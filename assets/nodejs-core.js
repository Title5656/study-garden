/* Small, bounded teaching models. No eval, network or real filesystem access. */
(function(root) {
  'use strict';
  function parsePath(input) {
    const windows = /^[A-Za-z]:|\\/.test(input), sep = windows ? '\\' : '/';
    const value = windows ? input.replaceAll('/', '\\') : input;
    const root = windows ? (/^[A-Za-z]:\\/.exec(value)?.[0] || (value.startsWith('\\') ? '\\' : '')) : (value.startsWith('/') ? '/' : '');
    const trimmed = value.replace(windows ? /\\+$/ : /\/+$/, '');
    const at = trimmed.lastIndexOf(sep);
    const base = trimmed.slice(Math.max(at + 1, root.length));
    const dot = base.lastIndexOf('.');
    const ext = dot > 0 && base !== '..' ? base.slice(dot) : '';
    return {root, dir:at < root.length ? root : trimmed.slice(0,at), base, ext, name:ext ? base.slice(0,-ext.length) : base};
  }
  function route(path) {
    if(path === '/') return {status:200,type:'text/plain',body:'Greeting',branch:'home'};
    if(path === '/shabu' || path === '/bbq') return {status:200,type:'text/html',body:path === '/bbq' ? 'BBQ · ยินดีต้อนรับร้านปิ้งย่าง' : 'Shabu · ยินดีต้อนรับร้านชาบู',branch:path.slice(1)};
    return {status:404,type:'text/plain',body:'Invalid requested :(',branch:'missing'};
  }
  function requestSteps(mode) {return mode === 'static' ? [1,2,5,6] : [1,2,3,4,5,6];}
  function asyncTimeline(durations, mode) {
    let end=0;
    return durations.map((duration,i)=>{
      const start=mode==='parallel' ? 0 : end;
      end=start+duration;
      return {id:i+1,start,end,duration};
    }).sort((a,b)=>a.end-b.end || a.id-b.id);
  }
  // Deliberately interprets only the syntax taught in this activity; never executes user code.
  function runModules(files) {
    const cache=Object.create(null), output=[];
    const unsupported=()=>{throw new Error('ตัวจำลองรองรับ string, require, console.log, function และ module.exports ตามตัวอย่างเท่านั้น');};
    function load(filename, depth=0) {
      if(depth>8) throw new Error('require ซ้อนเกินขอบเขตตัวอย่าง');
      if(Object.hasOwn(cache,filename)) return cache[filename];
      if(!Object.hasOwn(files,filename)) throw new Error('Cannot find module '+filename);
      const vars=Object.create(null), funcs=Object.create(null);
      let exported=Object.create(null), source=String(files[filename]);
      if(source.length>10000) throw new Error('โค้ดยาวเกินขอบเขตตัวอย่าง');
      source=source.replace(/^\s*\/\/.*$/gm,'');
      function value(expr) {
        expr=expr.trim();
        const literal=/^(["'])([^\r\n]*?)\1$/.exec(expr);
        if(literal) return literal[2];
        if(/^`[^`]*`$/.test(expr)) return expr.slice(1,-1).replace(/\$\{([^}]+)\}/g,(_,x)=>String(value(x)));
        const parts=expr.split('.');
        if(parts.every(p=>/^[A-Za-z_$][\w$]*$/.test(p)) && Object.hasOwn(vars,parts[0])) {
          let result=vars[parts.shift()];
          for(const key of parts) { if(!result || !Object.hasOwn(result,key)) return undefined; result=result[key]; }
          return result;
        }
        if(Object.hasOwn(funcs,expr)) return funcs[expr];
        return unsupported();
      }
      source=source.replace(/function\s+(\w+)\s*\(\s*\)\s*\{\s*console\.log\(([^\n]+?)\);?\s*\}/g,(_,name,expr)=>{funcs[name]=()=>output.push(String(value(expr)));return '';});
      for(let statement of source.split(/[;\n]+/).map(x=>x.trim()).filter(Boolean)) {
        let m;
        if((m=/^(?:const|let|var)\s+(\w+)\s*=\s*require\((["'])\.\/([^"']+)\2\)$/.exec(statement))) vars[m[1]]=load(m[3].endsWith('.js') ? m[3] : m[3]+'.js',depth+1);
        else if((m=/^(?:const|let|var)\s+(\w+)\s*=\s*(.+)$/.exec(statement))) vars[m[1]]=value(m[2]);
        else if((m=/^module\.exports(?:\.(\w+))?\s*=\s*(.+)$/.exec(statement))) { if(m[1]) exported[m[1]]=value(m[2]); else exported=value(m[2]); }
        else if((m=/^console\.log\((.+)\)$/.exec(statement))) output.push(String(value(m[1])));
        else if((m=/^(\w+)\.(\w+)\(\)$/.exec(statement))) {
          const fn=value(m[1]+'.'+m[2]);
          if(typeof fn!=='function') throw new Error(m[1]+'.'+m[2]+' is not a function');
          fn();
        } else unsupported();
      }
      cache[filename]=exported;
      return exported;
    }
    load('greet.js'); return output;
  }
  const api={parsePath,route,requestSteps,asyncTimeline,runModules};
  if(typeof module!=='undefined' && module.exports) module.exports=api; else root.NodeLessonCore=api;
})(typeof window==='undefined' ? globalThis : window);
