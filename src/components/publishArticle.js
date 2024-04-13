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
      e("h4").sub("请先填写你的 Github Access Token"),
      e("button").attr({
        class: "ui right labeled icon button",
        click: () => loc.value = "/settings"
      }).sub(
        e("i").attr({ class: "right arrow icon" }),
        "前往"
      )
    );
  }

  async function submitForm() {
    let title = $("#title").val(),
        time = Date.now(),
        tags = $("#tags").val().split(',').map(s => s.trim()),
        fileCode = await (async file => new Promise((res, rej) => {
          const reader = new FileReader();
          reader.readAsBinaryString(file);
          reader.onload = () => res(btoa(reader.result))
        }))(document.getElementById("file").files[0]),
        fileExt = (path => path.substr(path.lastIndexOf('.') + 1))($("#file").val());

    let url = `https://api.github.com/repos/xinji31/book-test/contents/src/${title}.${fileExt}`,
        message = `Add ${title} via 小绿书`,
        description = JSON.stringify({ title, time, tags });

    let sha = "";
    try {
      await $.ajax({
        method: "GET",
        url,
        headers: {
          Authorization: `token ${db.config.gaToken}`
        },
        success: (data) => { sha = data.sha; }
      });
    } catch (e) {}
    
    try {
      await $.ajax({
        method: "PUT",
        url,
        headers: {
          Authorization: `token ${db.config.gaToken}`
        },
        data: JSON.stringify({
          message: [message, description].join('\n\n'),
          content: fileCode,
          sha
        }),
        success: (data) => {
          loc.value = `/view/article/${data.content.sha}`;
        },
        error: (jqXHR, textStatus, errorThrown) => {
          console.error(jqXHR, textStatus, errorThrown);
          alert(`发布失败：${jqXHR.status} ${jqXHR.statusText}, ${jqXHR.responseText}`);
        }
      });
    } catch (e) {}
  }

  return e("form").attr({ class: "ui form", submit: submitForm }).sub(
    e("div").attr({ class: "field" }).sub(
      e("label").sub("标题"),
      e("input").attr({ type: "text", id: "title", placeholder: "文章标题", required: "" })
    ),
    e("div").attr({ class: "field" }).sub(
      e("label").sub("标签"),
      e("input").attr({ type: "text", id: "tags", placeholder: "多个标签名请用半角逗号隔开" })
    ),
    e("div").attr({ class: "field" }).sub(
      e("label").sub("文件"),
      e("input").attr({ type: "file", id: "file", required: "" })
    ),
    e("button").attr({ class: "ui button", type: "submit" }).sub("提交")
  );
}