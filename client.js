"use strict";
import * as io from "socket.io-client";

try {
    const socket = io.connect("https://localhost");
    socket.on("connect", function () {
        console.log("success");
    });
    socket.on("confirm", function (data) {
        console.log("confirm");
    });
    socket.on("disconnect", function () { });
}
catch(err) {
    console.log(err);
}