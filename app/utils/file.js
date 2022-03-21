// type: 'text/csv', 'application/vnd.ms-excel'
function exportFile(content, filename, type = "text/csv") {
  const eleLink = document.createElement("a");
  if (!("download" in eleLink)) {
    alert("该浏览器下载不支持");
    return;
  }
  const blob = new Blob([content], { type }); // application/vnd.ms-excel
  // 此时blob中的数据中文已经乱码，需要修改二进制的部分内容，给内容前加上'\uFEFF'
  const newBlob = blob.slice(0);
  const reader = new FileReader();
  reader.readAsText(newBlob, "utf-8");
  reader.onload = function(e) {
    // 字符内容转变成blob地址
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + e.target.result], { type: "text/csv;charset=utf-8" })
    );
    eleLink.download = filename;
    eleLink.style.display = "none";
    eleLink.href = url;
    document.body.appendChild(eleLink);
    // 触发点击
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  };
}

// 导出csv文件方法
function exportCSVFile(content, filename) {
  this.exportFile(content, filename, "text/csv");
}
// 导出excel文件方法
function exportExcelFile(content, filename) {
  this.exportFile(content, filename, "application/vnd.ms-excel");
}

export {
    exportFile,
    exportCSVFile,
    exportExcelFile
}
