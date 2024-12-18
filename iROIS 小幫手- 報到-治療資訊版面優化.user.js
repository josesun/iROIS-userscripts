﻿// ==UserScript==
// @name         iROIS 小幫手: 報到/治療資訊版面優化
// @namespace    josesun@gmail.com
// @version      1.8
// @description  1. 將 iROIS 報到/治療資訊中病人之計畫參數/治療記錄置頂顯示，避免需要一直上下捲動
// @             2. 將 iROIS 小幫手跳出的訊息使其可以拖動
// @author       Jose Sun
// @match        http://10.103.250.202/iROIS/CallPatient/Edit/*
// @match        http://196.254.100.230/iROIS/CallPatient/Edit/*
// @grant        none
// @downloadURL  https://www.dropbox.com/s/xth9if21i26k9p4/iROIS%20%E5%B0%8F%E5%B9%AB%E6%89%8B-%20%E5%A0%B1%E5%88%B0-%E6%B2%BB%E7%99%82%E8%B3%87%E8%A8%8A%E7%89%88%E9%9D%A2%E5%84%AA%E5%8C%96.user.js?dl=1
// @updateURL    https://www.dropbox.com/s/xth9if21i26k9p4/iROIS%20%E5%B0%8F%E5%B9%AB%E6%89%8B-%20%E5%A0%B1%E5%88%B0-%E6%B2%BB%E7%99%82%E8%B3%87%E8%A8%8A%E7%89%88%E9%9D%A2%E5%84%AA%E5%8C%96.user.js?dl=1
// ==/UserScript==
"use strict";
var thisElement;

//Plan Dose Table on left corner in screen
var elementDoseTable = document.getElementsByClassName("over-flow-scroll")[0];
var newDoseTableDiv = document.createElement("div");
newDoseTableDiv.setAttribute("class","over-flow-scroll");

var elementPatientRow = document.querySelector("#CallPatientForm > div.card-papper > div > div > div");
//alert(elementPatientRow.innerText);
var name = elementPatientRow.getElementsByClassName("row")[0].getElementsByClassName("col-md-8")[0].innerText;
var pid = elementPatientRow.getElementsByClassName("row")[1].getElementsByClassName("col-md-8")[0].innerText;
var namePosBefore = name.indexOf("(")
var namePosAfter = name.indexOf(")") + 1
var nameChinese = name.substring(0,namePosBefore)
var nameEnglish = name.substring(namePosBefore,namePosAfter)

newDoseTableDiv.innerHTML = "<div style='font-size:20px; margin-bottom:0.5rem'><strong>姓名：</strong> " + nameChinese + " " + nameEnglish + " <br> <strong>病歷號：</strong> " + pid + " </div>" + elementDoseTable.innerHTML;

var newDoseTableDivpos = document.getElementById("alert-box");
newDoseTableDivpos.parentNode.insertBefore(newDoseTableDiv, newDoseTableDivpos.nextSibling);

newDoseTableDiv.style.position = "fixed";
newDoseTableDiv.style.fontSize = "19px";
newDoseTableDiv.style.left = "60px";
newDoseTableDiv.style.bottom = "120px";
newDoseTableDiv.style.backgroundColor = "#FFFFFFCC";
newDoseTableDiv.style.border = "3px red solid";
newDoseTableDiv.style.cursor = "move";
newDoseTableDiv.style.zIndex = "100";
dragElement(newDoseTableDiv)

// if dose table is for Photon, then remove Prescription row for every table, because too long
var newDoseTableDivTable = newDoseTableDiv.getElementsByClassName('table text-center');
var newDoseTableDivTh = newDoseTableDiv.getElementsByTagName('th')[0];

if (newDoseTableDivTh.textContent == 'Field / Disease Name') {
    for (var i = 0; i < newDoseTableDivTable.length; i++) {
        const item = newDoseTableDivTable[i].getElementsByTagName('tr')[1];
        item.parentNode.removeChild(item);
    }
}


//Course Info on left top corner in screen
var elementCourseInfo = document.getElementsByClassName("over-flow-scroll")[3];

if (elementCourseInfo.innerText.indexOf("治療部位") >= 0 ) { // Check if it's coruse info table
    var newCourseDiv = document.createElement("div");
    newCourseDiv.setAttribute("class","green bg-white");
    newCourseDiv.innerHTML = elementCourseInfo.innerHTML;
    dragElement(newCourseDiv)

    var newCourseDivpos = document.getElementsByClassName("card-papper bg-pattern")[0];
    newCourseDivpos.parentNode.insertBefore(newCourseDiv, newCourseDivpos.nextSibling);

    newCourseDiv.style.position = "fixed";
    newCourseDiv.style.right = "60px";
    newCourseDiv.style.top = "6px";
    newCourseDiv.style.backgroundColor = "#FFFFFFCC";
    newCourseDiv.style.fontSize = "16px";
    newCourseDiv.style.border = "3px red solid";
    newCourseDiv.style.cursor = "move";
    newCourseDiv.style.zIndex = "100";

    var newCourseDivTable = newCourseDiv.getElementsByClassName("table table-hover res-table  last-table")[0];
    newCourseDivTable.setAttribute("class","table-hover res-table last-table");

    var newCourseDivTableTh = newCourseDivTable.getElementsByTagName('th');
    for (var j = 0; j < newCourseDivTableTh.length; j++) {
        thisElement = newCourseDivTableTh[j];
        thisElement.style.paddingRight = "0.85rem";
    }
}


//ReduceFx string on page top
if (document.getElementById("ReduceFX")) {
    var elementReduceFx = document.getElementById("ReduceFX");
    elementReduceFx.style.position = "absolute";
    elementReduceFx.style.left = "330px";
    elementReduceFx.style.top = "-53px";
    elementReduceFx.style.width = "800px";
}

//make pageMessageBox draggable
if (document.getElementById("pageMessageBox")) {
    var pageMessageBoxDivpos1 = document.getElementById("pageMessageBox");
    pageMessageBoxDivpos1.style.cursor = "move";
    dragElement(pageMessageBoxDivpos1);
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        elmnt.style.bottom = '';
        elmnt.style.right = '';
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}