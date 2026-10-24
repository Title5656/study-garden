/* Offline authoring of full-frame monochrome currents. Only WebP files ship. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.env.STUDY_GARDEN_SHARP || 'sharp');
const destination = path.join(__dirname, '../assets/aurora');
fs.mkdirSync(destination, {recursive:true});
const sizes = [{width:960,height:660,suffix:''},{width:480,height:750,suffix:'-mobile'}];

function sourceSvg(name, width, height) {
  const phase = name === 'a' ? .4 : 2.25;
  const scale = width / 1280;
  const paths = [];
  // The stream extends through every row, including the center, with no edge mask.
  for (let row=-3; row<=10; row++) {
    const points=[];
    for (let x=-400; x<=1680; x+=8) {
      const t=x/1280;
      const y=row*146 + 130*Math.sin(t*5.1 + phase + row*.17)
        + 64*Math.sin(t*8.3 - row*.24 + phase*.7)
        + 20*Math.cos(t*12.4 + row*.45);
      points.push([x*scale, y*height/1080]);
    }
    const d=points.map(([x,y],i)=>(i?'L':'M')+x.toFixed(2)+','+y.toFixed(2)).join(' ');
    paths.push('<path d="'+d+'" stroke-width="'+(92*scale)+'" opacity=".24" filter="url(#haze)"/>');
    paths.push('<path d="'+d+'" stroke-width="'+(34*scale)+'" opacity=".22" filter="url(#body)"/>');
    paths.push('<path d="'+d+'" stroke-width="'+(5*scale)+'" opacity=".30" filter="url(#spine)"/>');
    for (const offset of [-27,-14,13,25]) {
      paths.push('<path d="'+d+'" transform="translate(0 '+(offset*height/1080)+')" stroke-width="'+(1.4*scale)+'" opacity=".065" filter="url(#detail)"/>');
    }
  }
  return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'"><defs>'+
    '<filter id="haze" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="'+(24*scale)+'"/></filter>'+
    '<filter id="body" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="'+(12*scale)+'"/></filter>'+
    '<filter id="spine" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="'+(3.8*scale)+'"/></filter>'+
    '<filter id="detail" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="'+(1.8*scale)+'"/></filter>'+
    '</defs><g fill="none" stroke="white" stroke-linecap="round">'+paths.join('')+'</g></svg>');
}

(async()=>{
  const manifest=[];
  for (const size of sizes) {
    for (const name of ['a','b']) {
      const {data,info}=await sharp(sourceSvg(name,size.width,size.height)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
      for (const theme of ['dark','light']) {
        const pixels=Buffer.alloc(info.width*info.height*3);
        const tone=theme==='dark' ? 242 : 48;
        const base=theme==='dark' ? 8 : 246;
        // Bake transparency into the matching theme base before encoding.
        for (let pixel=0;pixel<info.width*info.height;pixel++) {
          const value=Math.round(base+(tone-base)*data[pixel*info.channels+3]/255);
          const i=pixel*3;
          pixels[i]=pixels[i+1]=pixels[i+2]=value;
        }
        const filename='flow-'+name+'-'+theme+size.suffix+'.webp';
        const file=path.join(destination,filename);
        await sharp(pixels,{raw:{width:info.width,height:info.height,channels:3}})
          .webp({quality:88,effort:6}).toFile(file);
        const meta=await sharp(file).metadata();
        const stats=await sharp(file).stats();
        if (meta.hasAlpha) throw new Error('Expected baked opaque flow texture');
        manifest.push({filename,width:meta.width,height:meta.height,bytes:fs.statSync(file).size,hasAlpha:meta.hasAlpha,min:stats.channels[0].min,max:stats.channels[0].max});
      }
    }
  }
  process.stdout.write(JSON.stringify(manifest,null,2)+'\n');
})().catch(error=>{console.error(error);process.exitCode=1;});
