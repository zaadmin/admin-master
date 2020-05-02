import Vue from 'vue'
import showdown from 'showdown'// 引入md文件


// 使用md文件
export function useMD() {
  Vue.prototype.md2html = (md)=> {
    let converter = new showdown.Converter();
    let text = md.toString();
    let html = converter.makeHtml(text);
    return html
  }  
}

 