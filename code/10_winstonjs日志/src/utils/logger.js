/**
 * logger
 * @param {*} verbosity 日志级别，默认2，输出info、error、warn、success
 * @param {*} sectionName 日志模块名称
 */
"use strict";
const globalLogger = require("./winstonLogger.js");
const logger = (verbosity = 2, sectionName = "project name") => {
  const util = require("util");
  // 颜色库
  const chalk = require("chalk");

  const customizer = {
    signs: ["==>", "!!!", "xx>", "===", ">>>", "xxx", "=H=", "   "],
    types: ["wsc", "sys"],
  };
  // 打印的类型
  const verbosityMethods = [
    [],
    ["error", "warn"],
    ["info", "error", "warn", "success"],
    ["info", "stats", "sstats", "error", "warn", "success", "time", "timeEnd"],
  ];

  // 更改console的函数体，执行自定义操作
  [
    {
      name: "info",
      sign: "=i=",
      signColor: chalk.blue,
      messageColor: chalk.bold,
      formatter: (sign, message) => {
        globalLogger.info(message);
        return [sign, message];
      },
    },
    {
      name: "stats",
      inherit: "log",
      sign: "=s=",
      signColor: chalk.blue,
      messageColor: chalk.bold,
      formatter: (sign, message) => {
        globalLogger.info(message);
        return [sign, message];
      },
    },
    {
      name: "success",
      inherit: "log",
      sign: "=✓=",
      signColor: chalk.green,
      messageColor: chalk.bold.green,
      formatter: (sign, message) => {
        globalLogger.info(message);
        return [sign, message];
      },
    },
    {
      name: "sstats",
      inherit: "log",
      sign: "=✓=",
      signColor: chalk.green,
      messageColor: chalk.bold.green,
      formatter: (sign, message) => [sign, message],
    },
    {
      name: "warn",
      sign: "=!=",
      signColor: chalk.yellow,
      messageColor: chalk.bold.yellow,
      formatter: (sign, message) => {
        globalLogger.warn(message);
        return [sign, message];
      },
    },
    {
      name: "error",
      sign: "=✘=",
      signColor: chalk.red,
      messageColor: chalk.bold.red,
      formatter: (sign, message) => {
        globalLogger.error(message);
        return [sign, message];
      },
    },
    {
      name: "time",
      sign: "=T=",
      signColor: chalk.cyan,
      messageColor: chalk.bold,
      formatter: (sign, message) => [util.format.apply(util, [sign, message])],
    },
    {
      name: "timeEnd",
      sign: "=T=",
      signColor: chalk.cyan,
      messageColor: chalk.bold,
      formatter: (sign, message) => [util.format.apply(util, [sign, message])],
    },
  ].forEach((item) => {
    const methodName = item.name;

    item.inherit !== undefined && (console[item.name] = console[item.inherit]);

    const consoleMethod = console[methodName];

    console[item.name] = function () {
      if (verbosityMethods[verbosity].indexOf(methodName) === -1) return false;

      const args = Array.prototype.slice.call(arguments);

      let sign = item.sign,
        section = sectionName,
        message = "";
      if (customizer.signs.indexOf(args[0]) >= 0) {
        sign = args.splice(0, 1);
      }
      if (customizer.types.indexOf(args[0]) >= 0) {
        section += ":" + args.splice(0, 1);
      }

      sign = item.signColor("[" + section + "] " + sign);

      typeof args[0] === "object"
        ? (message = util.inspect(args[0], {
            depth: null,
            colors: true,
          }))
        : (message = item.messageColor(util.format.apply(util, args)));
      return consoleMethod.apply(this, item.formatter(sign, message));
    };
  });
};
module.exports = logger;
