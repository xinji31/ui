import { element as e } from "../lib/element";
import { Database } from "../db";
import { loc } from "../lib/router";

/**
 * 
 * @param {Database} db 
 * @returns 
 */
export function publishArticle(db) {
  if (!db.config.gaToken) {
    return e("div").sub(
      e("h4").sub("请先在设置中填写您的 Github Personal Access Token"),
      e("button").attr({
        class: "ui right labeled icon button",
        click: () => loc.value = "/settings",
      }).sub(
        e("i").attr({ class: "right arrow icon" }),
        "前往设置",
      )
    );
  }

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result.toString().replace(/^.*,/, '')
        let targetLength = Math.ceil(encoded.length / 4) * 4
        encoded = encoded.padEnd(targetLength, "=")
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = error => reject(error);
    });
  }

  function getFiletype(filename) {
    if (filename.endsWith(".pdf"))
      return "pdf"
    if (filename.endsWith(".md"))
      return "md"
    throw Error("unsupported filetype")
  }

  async function submitForm() {
    let title = $("#title").val()
    let tags = $("#tags").val().split(',').map(s => s.trim())
    let fileCode = await getBase64(document.getElementById("file").files[0])
    let type = getFiletype($("#file").val())

    let url = `https://api.github.com/repos/xinji31/book-test/contents/file`
    let message = `Add ${title} via 小绿书`
    let description = JSON.stringify({ title, tags, type })

    let sha = await new Promise((res, rej) => {
      $.ajax({
        method: "GET",
        url,
        headers: {
          Authorization: `token ${db.config.gaToken}`
        },
        success: data => res(data.sha),
        error: (jqXHR) => {
          console.log(jqXHR)
          if (jqXHR.status === 404) {
            res()
          } else {
            rej(`发布失败：${jqXHR.status} ${jqXHR.statusText}, ${jqXHR.responseText}`)
          }
        }
      });
    })

    await new Promise((res, rej) => {
      $.ajax({
        method: "PUT",
        url,
        headers: {
          Authorization: `token ${db.config.gaToken}`
        },
        data: JSON.stringify({
          message: [message, description].join('\n\n'),
          content: fileCode,
          sha,
        }),
        success: res,
        error: (jqXHR) => rej(`发布失败：${jqXHR.status} ${jqXHR.statusText}, ${jqXHR.responseText}`),
      });
    })

    alert("发布成功！")
  }

  const field = (...p) => e("div").sub(...p).attr({
    class: "field",
  })
  const label = (...p) => e("label").sub(...p)
  const input = (attr) => e("input").attr(attr)

  return e("form").attr({
    class: "ui form",
    onsubmit: "return false",
    submit: async (...p) => {
      try {
        await submitForm(...p)
        loc.value = "/"
      } catch (err) {
        alert(`发布失败: ${err.message}`)
      }
    },
  }).sub(
    field(
      label("标题"),
      input({ type: "text", id: "title", placeholder: "文章标题", required: "" }),
    ),
    field(
      label("标签"),
      input({ type: "text", id: "tags", placeholder: "多个标签名请用半角逗号隔开" }),
    ),
    field(
      label("文件"),
      input({ type: "file", accept: ".pdf,.md", id: "file", required: "" })
    ),
    e("button").attr({ class: "ui button", type: "submit" }).sub("提交")
  );
}