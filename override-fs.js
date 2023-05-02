import path from "node:path"
import url from "node:url"
import { Readable } from 'node:stream';
import fs from "node:fs"
import promisesFs from "node:fs/promises"
import files from "./files";

const { realpathSync, statSync } = fs
const realpathSyncNative = realpathSync.native
const { readFile: promisesReadFile } = promisesFs


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// assets directory
fs.realpathSync = function(...args) {
  // console.log("realtpathSync", args[0])
  if (checkPathRemote(args[0])) { 
    return args[0]
  }
  return realpathSync(...args)
}

fs.realpathSync.native = function(...args) {
  // console.log("realpathSync.native", ...args)
  if (checkPathRemote(args[0])) {
    return args[0]
  }
  return realpathSyncNative(...args)
}



// assets directory
fs.statSync = function(...args) {
  if (checkPathRemote(args[0])) { 
    return {
      size: 255,
      isDirectory: () => false,
      isFile: () => true,
      mtime: new Date,
    }
  }
  return statSync(...args)
}

// assets directory
promisesFs.readFile = function(...args) {
  let pathname;
  if (pathname = checkPathRemote(args[0])) {
    return fetch(`https://a1xp8ym5wle2pctckmfw-src.halkinsesi.com${pathname}`).then(res => res.arrayBuffer()).then(ab => Buffer.from(ab))
  }
  // if (args[0] instanceof URL && args[0].href.startsWith('file:///C:/Users/cihad/Desktop/astro-starter/src/assets/flower.jpg')) {
  //   return fetch("https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg").then(res => res.arrayBuffer()).then(ab => Buffer.from(ab))
  // }
  return promisesReadFile(...args)
}



function convertPathToPosix(p) {
  return p.toString().split(path.sep).join(path.posix.sep)
}

function checkPathRemote(p) {
  const extname = path.extname(p instanceof URL ? p.pathname : p)
  if (p instanceof URL) {
    p = url.fileURLToPath(p)
  }

  // p = convertPathToPosix(p)
  const pathname = convertPathToPosix(p.slice(__dirname.length))

  // console.log({
  //   p,
  //   __dirname,
  //   pathname,
  //   extname,
  //   files
  // })

  return p.startsWith(__dirname) &&
    [".jpg", ".jpeg", ".png", ".gif"].includes(extname) &&
    files.includes(pathname) &&
    pathname
}