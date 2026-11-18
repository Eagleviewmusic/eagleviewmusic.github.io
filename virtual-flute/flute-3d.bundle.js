var Flute3D=(()=>{var ca=Object.defineProperty;var _h=Object.getOwnPropertyDescriptor;var xh=Object.getOwnPropertyNames;var yh=Object.prototype.hasOwnProperty;var Mh=(r,e)=>{for(var t in e)ca(r,t,{get:e[t],enumerable:!0})},bh=(r,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of xh(e))!yh.call(r,i)&&i!==t&&ca(r,i,{get:()=>e[i],enumerable:!(n=_h(e,i))||n.enumerable});return r};var Sh=r=>bh(ca({},"__esModule",{value:!0}),r);var zp={};Mh(zp,{createFlute:()=>Bp});var In={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},zn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3};var Th=0,vl=1,Js=2;var Fc=5,Ai=100,Eh=101,wh=102;var Bc=104,Ah=200,Ks=201,Rh=202,Ch=203,Ga=204,Wa=205,Ph=206,Ih=207,Lh=208,Dh=209,Uh=210,Nh=211,Oh=212,Fh=213,Bh=214,zh=0,kh=1,Hh=2,Vh=3,Gh=4,Wh=5,jh=6,Xh=7;var zc=0;var kc=5;var Hc=7;var Vc=300,sr=301,ar=302,ja=303,Xa=304,$s=306,qa=1e3,Nr=1001,Ya=1002,Rn=1003,qh=1004;var Zr=1005;var Zn=1006,ha=1007;var er=1008;var li=1009,Gc=1010,Wc=1011,Or=1012,_l=1013,Pi=1014,Jn=1015,Yr=1016,xl=1017,yl=1018,or=1020,jc=35902,Xc=1021,qc=1022,Nn=1023,Yc=1024,Zc=1025,Fr=1026,lr=1027,Jc=1028,Ml=1029,Kc=1030,bl=1031;var Sl=1033,Ss=33776,Ts=33777,Es=33778,ws=33779,Za=35840,Ja=35841,Ka=35842,$a=35843,Qa=36196,eo=37492,to=37496,no=37808,io=37809,ro=37810,so=37811,ao=37812,oo=37813,lo=37814,co=37815,ho=37816,uo=37817,po=37818,fo=37819,mo=37820,go=37821,As=36492,vo=36494,_o=36495,$c=36283,xo=36284,yo=36285,Mo=36286;var Rs=2300,bo=2301,ua=2302,Dl=2400,Ul=2401,Nl=2402;var $i="",cn="srgb",vr="srgb-linear",Qs="linear",ft="srgb";var zi=7680;var Yh=512,Zh=513,Jh=514,Kh=515,$h=516,Qh=517,eu=518,tu=519,Ol=35044;var Fl="300 es",cr=2e3,Cs=2001,$n=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let n=this._listeners[e];if(n!==void 0){let i=n.indexOf(t);i!==-1&&n.splice(i,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let t=this._listeners[e.type];if(t!==void 0){e.target=this;let n=t.slice(0);for(let i=0,s=n.length;i<s;i++)n[i].call(this,e);e.target=null}}},Zt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Bl=1234567,nr=Math.PI/180,Br=180/Math.PI;function Fi(){let r=4294967295*Math.random()|0,e=4294967295*Math.random()|0,t=4294967295*Math.random()|0,n=4294967295*Math.random()|0;return(Zt[255&r]+Zt[r>>8&255]+Zt[r>>16&255]+Zt[r>>24&255]+"-"+Zt[255&e]+Zt[e>>8&255]+"-"+Zt[e>>16&15|64]+Zt[e>>24&255]+"-"+Zt[63&t|128]+Zt[t>>8&255]+"-"+Zt[t>>16&255]+Zt[t>>24&255]+Zt[255&n]+Zt[n>>8&255]+Zt[n>>16&255]+Zt[n>>24&255]).toLowerCase()}function Nt(r,e,t){return Math.max(e,Math.min(t,r))}function So(r,e){return(r%e+e)%e}function Ir(r,e,t){return(1-t)*r+t*e}function Qi(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function tn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(4294967295*r);case Uint16Array:return Math.round(65535*r);case Uint8Array:return Math.round(255*r);case Int32Array:return Math.round(2147483647*r);case Int16Array:return Math.round(32767*r);case Int8Array:return Math.round(127*r);default:throw new Error("Invalid component type.")}}var ea={DEG2RAD:nr,RAD2DEG:Br,generateUUID:Fi,clamp:Nt,euclideanModulo:So,mapLinear:function(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)},inverseLerp:function(r,e,t){return r!==e?(t-r)/(e-r):0},lerp:Ir,damp:function(r,e,t,n){return Ir(r,e,1-Math.exp(-t*n))},pingpong:function(r,e=1){return e-Math.abs(So(r,2*e)-e)},smoothstep:function(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e))*r*(3-2*r)},smootherstep:function(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e))*r*r*(r*(6*r-15)+10)},randInt:function(r,e){return r+Math.floor(Math.random()*(e-r+1))},randFloat:function(r,e){return r+Math.random()*(e-r)},randFloatSpread:function(r){return r*(.5-Math.random())},seededRandom:function(r){r!==void 0&&(Bl=r);let e=Bl+=1831565813;return e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296},degToRad:function(r){return r*nr},radToDeg:function(r){return r*Br},isPowerOfTwo:function(r){return!(r&r-1)&&r!==0},ceilPowerOfTwo:function(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))},floorPowerOfTwo:function(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))},setQuaternionFromProperEuler:function(r,e,t,n,i){let s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),h=a((e+n)/2),u=s((e-n)/2),d=a((e-n)/2),p=s((n-e)/2),m=a((n-e)/2);switch(i){case"XYX":r.set(o*h,l*u,l*d,o*c);break;case"YZY":r.set(l*d,o*h,l*u,o*c);break;case"ZXZ":r.set(l*u,l*d,o*h,o*c);break;case"XZX":r.set(o*h,l*m,l*p,o*c);break;case"YXY":r.set(l*p,o*h,l*m,o*c);break;case"ZYZ":r.set(l*m,l*p,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}},normalize:tn,denormalize:Qi},me=class r{constructor(e=0,t=0){r.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Je=class r{constructor(e,t,n,i,s,a,o,l,c){r.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c)}set(e,t,n,i,s,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],p=n[5],m=n[8],_=i[0],f=i[3],g=i[6],v=i[1],x=i[4],y=i[7],w=i[2],E=i[5],U=i[8];return s[0]=a*_+o*v+l*w,s[3]=a*f+o*x+l*E,s[6]=a*g+o*y+l*U,s[1]=c*_+h*v+u*w,s[4]=c*f+h*x+u*E,s[7]=c*g+h*y+u*U,s[2]=d*_+p*v+m*w,s[5]=d*f+p*x+m*E,s[8]=d*g+p*y+m*U,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*s*h+n*o*l+i*s*c-i*a*l}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*s,p=c*s-a*l,m=t*u+n*d+i*p;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/m;return e[0]=u*_,e[1]=(i*c-h*n)*_,e[2]=(o*n-i*a)*_,e[3]=d*_,e[4]=(h*t-i*l)*_,e[5]=(i*s-o*t)*_,e[6]=p*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*s)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,o){let l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(da.makeScale(e,t)),this}rotate(e){return this.premultiply(da.makeRotation(-e)),this}translate(e,t){return this.premultiply(da.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},da=new Je;function Qc(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Ps(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function nu(){let r=Ps("canvas");return r.style.display="block",r}var zl={};function Pr(r){r in zl||(zl[r]=!0,console.warn(r))}var lt={enabled:!0,workingColorSpace:vr,spaces:{},convert:function(r,e,t){return this.enabled!==!1&&e!==t&&e&&t&&(this.spaces[e].transfer===ft&&(r.r=Kn(r.r),r.g=Kn(r.g),r.b=Kn(r.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(r.applyMatrix3(this.spaces[e].toXYZ),r.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===ft&&(r.r=ir(r.r),r.g=ir(r.g),r.b=ir(r.b))),r},fromWorkingColorSpace:function(r,e){return this.convert(r,this.workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===$i?Qs:this.spaces[r].transfer},getLuminanceCoefficients:function(r,e=this.workingColorSpace){return r.fromArray(this.spaces[e].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,e,t){return r.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}};function Kn(r){return r<.04045?.0773993808*r:Math.pow(.9478672986*r+.0521327014,2.4)}function ir(r){return r<.0031308?12.92*r:1.055*Math.pow(r,.41666)-.055}var kl=[.64,.33,.3,.6,.15,.06],Hl=[.2126,.7152,.0722],Vl=[.3127,.329],Gl=new Je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Wl=new Je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715),ki;lt.define({[vr]:{primaries:kl,whitePoint:Vl,transfer:Qs,toXYZ:Gl,fromXYZ:Wl,luminanceCoefficients:Hl,workingColorSpaceConfig:{unpackColorSpace:cn},outputColorSpaceConfig:{drawingBufferColorSpace:cn}},[cn]:{primaries:kl,whitePoint:Vl,transfer:ft,toXYZ:Gl,fromXYZ:Wl,luminanceCoefficients:Hl,outputColorSpaceConfig:{drawingBufferColorSpace:cn}}});var To=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ki===void 0&&(ki=Ps("canvas")),ki.width=e.width,ki.height=e.height;let n=ki.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ki}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Ps("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=255*Kn(s[a]/255);return n.putImageData(i,0,0),t}if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(255*Kn(t[n]/255)):t[n]=Kn(t[n]);return{data:t,width:e.width,height:e.height}}return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},iu=0,Is=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:iu++}),this.uuid=Fi(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(pa(i[a].image)):s.push(pa(i[a]))}else s=pa(i);n.url=s}return t||(e.images[this.uuid]=n),n}};function pa(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?To.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var ru=0,xn=class r extends $n{constructor(e=r.DEFAULT_IMAGE,t=r.DEFAULT_MAPPING,n=1001,i=1001,s=1006,a=1008,o=1023,l=1009,c=r.DEFAULT_ANISOTROPY,h=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ru++}),this.uuid=Fi(),this.name="",this.source=new Is(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new me(0,0),this.repeat=new me(1,1),this.center=new me(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Vc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case qa:e.x=e.x-Math.floor(e.x);break;case Nr:e.x=e.x<0?0:1;break;case Ya:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case qa:e.y=e.y-Math.floor(e.y);break;case Nr:e.y=e.y<0?0:1;break;case Ya:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};xn.DEFAULT_IMAGE=null,xn.DEFAULT_MAPPING=Vc,xn.DEFAULT_ANISOTROPY=1;var xt=class r{constructor(e=0,t=0,n=0,i=1){r.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],m=l[9],_=l[2],f=l[6],g=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(m-f)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(m+f)<.1&&Math.abs(c+p+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let x=(c+1)/2,y=(p+1)/2,w=(g+1)/2,E=(h+d)/4,U=(u+_)/4,V=(m+f)/4;return x>y&&x>w?x<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(x),i=E/n,s=U/n):y>w?y<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(y),n=E/i,s=V/i):w<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(w),n=U/s,i=V/s),this.set(n,i,s,t),this}let v=Math.sqrt((f-m)*(f-m)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(f-m)/v,this.y=(u-_)/v,this.z=(d-h)/v,this.w=Math.acos((c+p+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Eo=class extends $n{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new xt(0,0,e,t),this.scissorTest=!1,this.viewport=new xt(0,0,e,t);let i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Zn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let s=new xn(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Is(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},yn=class extends Eo{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ls=class extends xn{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Rn,this.minFilter=Rn,this.wrapR=Nr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var wo=class extends xn{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Rn,this.minFilter=Rn,this.wrapR=Nr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Kt=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=s[a+0],p=s[a+1],m=s[a+2],_=s[a+3];if(o===0)return e[t+0]=l,e[t+1]=c,e[t+2]=h,void(e[t+3]=u);if(o===1)return e[t+0]=d,e[t+1]=p,e[t+2]=m,void(e[t+3]=_);if(u!==_||l!==d||c!==p||h!==m){let f=1-o,g=l*d+c*p+h*m+u*_,v=g>=0?1:-1,x=1-g*g;if(x>Number.EPSILON){let w=Math.sqrt(x),E=Math.atan2(w,g*v);f=Math.sin(f*E)/w,o=Math.sin(o*E)/w}let y=o*v;if(l=l*f+d*y,c=c*f+p*y,h=h*f+m*y,u=u*f+_*y,f===1-o){let w=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=w,c*=w,h*=w,u*=w}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,a){let o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=s[a],d=s[a+1],p=s[a+2],m=s[a+3];return e[t]=o*m+h*u+l*p-c*d,e[t+1]=l*m+h*d+c*u-o*p,e[t+2]=c*m+h*p+o*d-l*u,e[t+3]=h*m-o*u-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(s/2),d=l(n/2),p=l(i/2),m=l(s/2);switch(a){case"XYZ":this._x=d*h*u+c*p*m,this._y=c*p*u-d*h*m,this._z=c*h*m+d*p*u,this._w=c*h*u-d*p*m;break;case"YXZ":this._x=d*h*u+c*p*m,this._y=c*p*u-d*h*m,this._z=c*h*m-d*p*u,this._w=c*h*u+d*p*m;break;case"ZXY":this._x=d*h*u-c*p*m,this._y=c*p*u+d*h*m,this._z=c*h*m+d*p*u,this._w=c*h*u-d*p*m;break;case"ZYX":this._x=d*h*u-c*p*m,this._y=c*p*u+d*h*m,this._z=c*h*m-d*p*u,this._w=c*h*u+d*p*m;break;case"YZX":this._x=d*h*u+c*p*m,this._y=c*p*u+d*h*m,this._z=c*h*m-d*p*u,this._w=c*h*u-d*p*m;break;case"XZY":this._x=d*h*u-c*p*m,this._y=c*p*u-d*h*m,this._z=c*h*m+d*p*u,this._w=c*h*u+d*p*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(s-c)*p,this._z=(a-i)*p}else if(n>o&&n>u){let p=2*Math.sqrt(1+n-o-u);this._w=(h-l)/p,this._x=.25*p,this._y=(i+a)/p,this._z=(s+c)/p}else if(o>u){let p=2*Math.sqrt(1+o-n-u);this._w=(s-c)/p,this._x=(i+a)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-n-o);this._w=(a-i)/p,this._x=(s+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Nt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-s*l,this._y=i*h+a*l+s*o-n*c,this._z=s*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,i=this._y,s=this._z,a=this._w,o=a*e._w+n*e._x+i*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=s,this;let l=1-o*o;if(l<=Number.EPSILON){let p=1-t;return this._w=p*a+t*this._w,this._x=p*n+t*this._x,this._y=p*i+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},R=class r{constructor(e=0,t=0,n=0){r.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(jl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(jl.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-s*i),u=2*(s*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-s*u,this.z=i+l*u+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return fa.copy(this).projectOnVector(e),this.sub(fa)}reflect(e){return this.sub(fa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Nt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,4*t)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,3*t)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=2*Math.random()-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},fa=new R,jl=new Kt,pn=class{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Tn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Tn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Tn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Tn):Tn.fromBufferAttribute(s,a),Tn.applyMatrix4(e.matrixWorld),this.expandByPoint(Tn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Jr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Jr.copy(n.boundingBox)),Jr.applyMatrix4(e.matrixWorld),this.union(Jr)}let i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Tn),Tn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Tr),Kr.subVectors(this.max,Tr),Hi.subVectors(e.a,Tr),Vi.subVectors(e.b,Tr),Gi.subVectors(e.c,Tr),ei.subVectors(Vi,Hi),ti.subVectors(Gi,Vi),yi.subVectors(Hi,Gi);let t=[0,-ei.z,ei.y,0,-ti.z,ti.y,0,-yi.z,yi.y,ei.z,0,-ei.x,ti.z,0,-ti.x,yi.z,0,-yi.x,-ei.y,ei.x,0,-ti.y,ti.x,0,-yi.y,yi.x,0];return!!ma(t,Hi,Vi,Gi,Kr)&&(t=[1,0,0,0,1,0,0,0,1],!!ma(t,Hi,Vi,Gi,Kr)&&($r.crossVectors(ei,ti),t=[$r.x,$r.y,$r.z],ma(t,Hi,Vi,Gi,Kr)))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Tn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=.5*this.getSize(Tn).length()),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Wn)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Wn=[new R,new R,new R,new R,new R,new R,new R,new R],Tn=new R,Jr=new pn,Hi=new R,Vi=new R,Gi=new R,ei=new R,ti=new R,yi=new R,Tr=new R,Kr=new R,$r=new R,Mi=new R;function ma(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){Mi.fromArray(r,s);let o=i.x*Math.abs(Mi.x)+i.y*Math.abs(Mi.y)+i.z*Math.abs(Mi.z),l=e.dot(Mi),c=t.dot(Mi),h=n.dot(Mi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var su=new pn,Er=new R,ga=new R,Fn=class{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):su.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Er.subVectors(e,this.center);let t=Er.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=.5*(n-this.radius);this.center.addScaledVector(Er,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ga.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Er.copy(e.center).add(ga)),this.expandByPoint(Er.copy(e.center).sub(ga))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},jn=new R,va=new R,Qr=new R,ni=new R,_a=new R,es=new R,xa=new R,Qn=class{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,jn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=jn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(jn.copy(this.origin).addScaledVector(this.direction,t),jn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){va.copy(e).add(t).multiplyScalar(.5),Qr.copy(t).sub(e).normalize(),ni.copy(this.origin).sub(va);let s=.5*e.distanceTo(t),a=-this.direction.dot(Qr),o=ni.dot(this.direction),l=-ni.dot(Qr),c=ni.lengthSq(),h=Math.abs(1-a*a),u,d,p,m;if(h>0)if(u=a*l-o,d=a*o-l,m=s*h,u>=0)if(d>=-m)if(d<=m){let _=1/h;u*=_,d*=_,p=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-l),s),p=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-l),s),p=-u*u+d*(d+2*l)+c);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(va).addScaledVector(Qr,d),p}intersectSphere(e,t){jn.subVectors(e.center,this.origin);let n=jn.dot(this.direction),i=jn.dot(jn)-n*n,s=e.radius*e.radius;if(i>s)return null;let a=Math.sqrt(s-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0?!0:e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||s>i?null:((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>i?null:((o>n||n!=n)&&(n=o),(l<i||i!=i)&&(i=l),i<0?null:this.at(n>=0?n:i,t)))}intersectsBox(e){return this.intersectBox(e,jn)!==null}intersectTriangle(e,t,n,i,s){_a.subVectors(t,e),es.subVectors(n,e),xa.crossVectors(_a,es);let a,o=this.direction.dot(xa);if(o>0){if(i)return null;a=1}else{if(!(o<0))return null;a=-1,o=-o}ni.subVectors(this.origin,e);let l=a*this.direction.dot(es.crossVectors(ni,es));if(l<0)return null;let c=a*this.direction.dot(_a.cross(ni));if(c<0||l+c>o)return null;let h=-a*ni.dot(xa);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Be=class r{constructor(e,t,n,i,s,a,o,l,c,h,u,d,p,m,_,f){r.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c,h,u,d,p,m,_,f)}set(e,t,n,i,s,a,o,l,c,h,u,d,p,m,_,f){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=i,g[1]=s,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=u,g[14]=d,g[3]=p,g[7]=m,g[11]=_,g[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,i=1/Wi.setFromMatrixColumn(e,0).length(),s=1/Wi.setFromMatrixColumn(e,1).length(),a=1/Wi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let d=a*h,p=a*u,m=o*h,_=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+m*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=m+p*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*h,p=l*u,m=c*h,_=c*u;t[0]=d+_*o,t[4]=m*o-p,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=p*o-m,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*h,p=l*u,m=c*h,_=c*u;t[0]=d-_*o,t[4]=-a*u,t[8]=m+p*o,t[1]=p+m*o,t[5]=a*h,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*h,p=a*u,m=o*h,_=o*u;t[0]=l*h,t[4]=m*c-p,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=p*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,p=a*c,m=o*l,_=o*c;t[0]=l*h,t[4]=_-d*u,t[8]=m*u+p,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=p*u+m,t[10]=d-_*u}else if(e.order==="XZY"){let d=a*l,p=a*c,m=o*l,_=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=a*h,t[9]=p*u-m,t[2]=m*u-p,t[6]=o*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(au,e,ou)}lookAt(e,t,n){let i=this.elements;return un.subVectors(e,t),un.lengthSq()===0&&(un.z=1),un.normalize(),ii.crossVectors(n,un),ii.lengthSq()===0&&(Math.abs(n.z)===1?un.x+=1e-4:un.z+=1e-4,un.normalize(),ii.crossVectors(n,un)),ii.normalize(),ts.crossVectors(un,ii),i[0]=ii.x,i[4]=ts.x,i[8]=un.x,i[1]=ii.y,i[5]=ts.y,i[9]=un.y,i[2]=ii.z,i[6]=ts.z,i[10]=un.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],p=n[13],m=n[2],_=n[6],f=n[10],g=n[14],v=n[3],x=n[7],y=n[11],w=n[15],E=i[0],U=i[4],V=i[8],C=i[12],X=i[1],L=i[5],D=i[9],j=i[13],G=i[2],Q=i[6],te=i[10],S=i[14],I=i[3],O=i[7],H=i[11],W=i[15];return s[0]=a*E+o*X+l*G+c*I,s[4]=a*U+o*L+l*Q+c*O,s[8]=a*V+o*D+l*te+c*H,s[12]=a*C+o*j+l*S+c*W,s[1]=h*E+u*X+d*G+p*I,s[5]=h*U+u*L+d*Q+p*O,s[9]=h*V+u*D+d*te+p*H,s[13]=h*C+u*j+d*S+p*W,s[2]=m*E+_*X+f*G+g*I,s[6]=m*U+_*L+f*Q+g*O,s[10]=m*V+_*D+f*te+g*H,s[14]=m*C+_*j+f*S+g*W,s[3]=v*E+x*X+y*G+w*I,s[7]=v*U+x*L+y*Q+w*O,s[11]=v*V+x*D+y*te+w*H,s[15]=v*C+x*j+y*S+w*W,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],p=e[14];return e[3]*(+s*l*u-i*c*u-s*o*d+n*c*d+i*o*p-n*l*p)+e[7]*(+t*l*p-t*c*d+s*a*d-i*a*p+i*c*h-s*l*h)+e[11]*(+t*c*u-t*o*p-s*a*u+n*a*p+s*o*h-n*c*h)+e[15]*(-i*o*h-t*l*u+t*o*d+i*a*u-n*a*d+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],p=e[11],m=e[12],_=e[13],f=e[14],g=e[15],v=u*f*c-_*d*c+_*l*p-o*f*p-u*l*g+o*d*g,x=m*d*c-h*f*c-m*l*p+a*f*p+h*l*g-a*d*g,y=h*_*c-m*u*c+m*o*p-a*_*p-h*o*g+a*u*g,w=m*u*l-h*_*l-m*o*d+a*_*d+h*o*f-a*u*f,E=t*v+n*x+i*y+s*w;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let U=1/E;return e[0]=v*U,e[1]=(_*d*s-u*f*s-_*i*p+n*f*p+u*i*g-n*d*g)*U,e[2]=(o*f*s-_*l*s+_*i*c-n*f*c-o*i*g+n*l*g)*U,e[3]=(u*l*s-o*d*s-u*i*c+n*d*c+o*i*p-n*l*p)*U,e[4]=x*U,e[5]=(h*f*s-m*d*s+m*i*p-t*f*p-h*i*g+t*d*g)*U,e[6]=(m*l*s-a*f*s-m*i*c+t*f*c+a*i*g-t*l*g)*U,e[7]=(a*d*s-h*l*s+h*i*c-t*d*c-a*i*p+t*l*p)*U,e[8]=y*U,e[9]=(m*u*s-h*_*s-m*n*p+t*_*p+h*n*g-t*u*g)*U,e[10]=(a*_*s-m*o*s+m*n*c-t*_*c-a*n*g+t*o*g)*U,e[11]=(h*o*s-a*u*s-h*n*c+t*u*c+a*n*p-t*o*p)*U,e[12]=w*U,e[13]=(h*_*i-m*u*i+m*n*d-t*_*d-h*n*f+t*u*f)*U,e[14]=(m*o*i-a*_*i-m*n*l+t*_*l+a*n*f-t*o*f)*U,e[15]=(a*u*i-h*o*i+h*n*l-t*u*l-a*n*d+t*o*d)*U,this}scale(e){let t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,u=o+o,d=s*c,p=s*h,m=s*u,_=a*h,f=a*u,g=o*u,v=l*c,x=l*h,y=l*u,w=n.x,E=n.y,U=n.z;return i[0]=(1-(_+g))*w,i[1]=(p+y)*w,i[2]=(m-x)*w,i[3]=0,i[4]=(p-y)*E,i[5]=(1-(d+g))*E,i[6]=(f+v)*E,i[7]=0,i[8]=(m+x)*U,i[9]=(f-v)*U,i[10]=(1-(d+_))*U,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements,s=Wi.set(i[0],i[1],i[2]).length(),a=Wi.set(i[4],i[5],i[6]).length(),o=Wi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],En.copy(this);let l=1/s,c=1/a,h=1/o;return En.elements[0]*=l,En.elements[1]*=l,En.elements[2]*=l,En.elements[4]*=c,En.elements[5]*=c,En.elements[6]*=c,En.elements[8]*=h,En.elements[9]*=h,En.elements[10]*=h,t.setFromRotationMatrix(En),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,i,s,a,o=2e3){let l=this.elements,c=2*s/(t-e),h=2*s/(n-i),u=(t+e)/(t-e),d=(n+i)/(n-i),p,m;if(o===cr)p=-(a+s)/(a-s),m=-2*a*s/(a-s);else{if(o!==Cs)throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);p=-a/(a-s),m=-a*s/(a-s)}return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,s,a,o=2e3){let l=this.elements,c=1/(t-e),h=1/(n-i),u=1/(a-s),d=(t+e)*c,p=(n+i)*h,m,_;if(o===cr)m=(a+s)*u,_=-2*u;else{if(o!==Cs)throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);m=s*u,_=-1*u}return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Wi=new R,En=new Be,au=new R(0,0,0),ou=new R(1,1,1),ii=new R,ts=new R,un=new R,Xl=new Be,ql=new Kt,Bn=class r{constructor(e=0,t=0,n=0,i=r.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],p=i[10];switch(t){case"XYZ":this._y=Math.asin(Nt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Nt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Nt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Nt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Nt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Nt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Xl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Xl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ql.setFromEuler(this),this.setFromQuaternion(ql,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Bn.DEFAULT_ORDER="XYZ";var zr=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return!!(this.mask&e.mask)}isEnabled(e){return!!(this.mask&1<<e)}},lu=0,Yl=new R,ji=new Kt,Xn=new Be,ns=new R,wr=new R,cu=new R,hu=new Kt,Zl=new R(1,0,0),Jl=new R(0,1,0),Kl=new R(0,0,1),$l={type:"added"},uu={type:"removed"},Xi={type:"childadded",child:null},ya={type:"childremoved",child:null},Cn=class r extends $n{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lu++}),this.uuid=Fi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let e=new R,t=new Bn,n=new Kt,i=new R(1,1,1);t._onChange((function(){n.setFromEuler(t,!1)})),n._onChange((function(){t.setFromQuaternion(n,void 0,!1)})),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Be},normalMatrix:{value:new Je}}),this.matrix=new Be,this.matrixWorld=new Be,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new zr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ji.setFromAxisAngle(e,t),this.quaternion.multiply(ji),this}rotateOnWorldAxis(e,t){return ji.setFromAxisAngle(e,t),this.quaternion.premultiply(ji),this}rotateX(e){return this.rotateOnAxis(Zl,e)}rotateY(e){return this.rotateOnAxis(Jl,e)}rotateZ(e){return this.rotateOnAxis(Kl,e)}translateOnAxis(e,t){return Yl.copy(e).applyQuaternion(this.quaternion),this.position.add(Yl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Zl,e)}translateY(e){return this.translateOnAxis(Jl,e)}translateZ(e){return this.translateOnAxis(Kl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Xn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ns.copy(e):ns.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),wr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Xn.lookAt(wr,ns,this.up):Xn.lookAt(ns,wr,this.up),this.quaternion.setFromRotationMatrix(Xn),i&&(Xn.extractRotation(i.matrixWorld),ji.setFromRotationMatrix(Xn),this.quaternion.premultiply(ji.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent($l),Xi.child=e,this.dispatchEvent(Xi),Xi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(uu),ya.child=e,this.dispatchEvent(ya),ya.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Xn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Xn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Xn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent($l),Xi.child=e,this.dispatchEvent(Xi),Xi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let s=this.children[n].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wr,e,cu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wr,hu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let i={};function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map((o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()}))),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()})),this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];i.animations.push(s(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),p=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),m.length>0&&(n.nodes=m)}return n.object=i,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}};Cn.DEFAULT_UP=new R(0,1,0),Cn.DEFAULT_MATRIX_AUTO_UPDATE=!0,Cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var wn=new R,qn=new R,Ma=new R,Yn=new R,qi=new R,Yi=new R,Ql=new R,ba=new R,Sa=new R,Ta=new R,Ea=new xt,wa=new xt,Aa=new xt,ai=class r{constructor(e=new R,t=new R,n=new R){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),wn.subVectors(e,t),i.cross(wn);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){wn.subVectors(i,t),qn.subVectors(n,t),Ma.subVectors(e,t);let a=wn.dot(wn),o=wn.dot(qn),l=wn.dot(Ma),c=qn.dot(qn),h=qn.dot(Ma),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;let d=1/u,p=(c*l-o*h)*d,m=(a*h-o*l)*d;return s.set(1-p-m,m,p)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Yn)!==null&&Yn.x>=0&&Yn.y>=0&&Yn.x+Yn.y<=1}static getInterpolation(e,t,n,i,s,a,o,l){return this.getBarycoord(e,t,n,i,Yn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Yn.x),l.addScaledVector(a,Yn.y),l.addScaledVector(o,Yn.z),l)}static getInterpolatedAttribute(e,t,n,i,s,a){return Ea.setScalar(0),wa.setScalar(0),Aa.setScalar(0),Ea.fromBufferAttribute(e,t),wa.fromBufferAttribute(e,n),Aa.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(Ea,s.x),a.addScaledVector(wa,s.y),a.addScaledVector(Aa,s.z),a}static isFrontFacing(e,t,n,i){return wn.subVectors(n,t),qn.subVectors(e,t),wn.cross(qn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return wn.subVectors(this.c,this.b),qn.subVectors(this.a,this.b),.5*wn.cross(qn).length()}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return r.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return r.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return r.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return r.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return r.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,a,o;qi.subVectors(i,n),Yi.subVectors(s,n),ba.subVectors(e,n);let l=qi.dot(ba),c=Yi.dot(ba);if(l<=0&&c<=0)return t.copy(n);Sa.subVectors(e,i);let h=qi.dot(Sa),u=Yi.dot(Sa);if(h>=0&&u<=h)return t.copy(i);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(qi,a);Ta.subVectors(e,s);let p=qi.dot(Ta),m=Yi.dot(Ta);if(m>=0&&p<=m)return t.copy(s);let _=p*c-l*m;if(_<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(n).addScaledVector(Yi,o);let f=h*m-p*u;if(f<=0&&u-h>=0&&p-m>=0)return Ql.subVectors(s,i),o=(u-h)/(u-h+(p-m)),t.copy(i).addScaledVector(Ql,o);let g=1/(f+_+d);return a=_*g,o=d*g,t.copy(n).addScaledVector(qi,a).addScaledVector(Yi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},eh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ri={h:0,s:0,l:0},is={h:0,s:0,l:0};function Ra(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+6*(e-r)*t:t<.5?e:t<2/3?r+6*(e-r)*(2/3-t):r}var qe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=cn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(255&e)/255,lt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=lt.workingColorSpace){return this.r=e,this.g=t,this.b=n,lt.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=lt.workingColorSpace){if(e=So(e,1),t=Nt(t,0,1),n=Nt(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=Ra(a,s,e+1/3),this.g=Ra(a,s,e),this.b=Ra(a,s,e-1/3)}return lt.toWorkingColorSpace(this,i),this}setStyle(e,t=cn){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=cn){let n=eh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Kn(e.r),this.g=Kn(e.g),this.b=Kn(e.b),this}copyLinearToSRGB(e){return this.r=ir(e.r),this.g=ir(e.g),this.b=ir(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=cn){return lt.fromWorkingColorSpace(Jt.copy(this),e),65536*Math.round(Nt(255*Jt.r,0,255))+256*Math.round(Nt(255*Jt.g,0,255))+Math.round(Nt(255*Jt.b,0,255))}getHexString(e=cn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=lt.workingColorSpace){lt.fromWorkingColorSpace(Jt.copy(this),t);let n=Jt.r,i=Jt.g,s=Jt.b,a=Math.max(n,i,s),o=Math.min(n,i,s),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-s)/u+(i<s?6:0);break;case i:l=(s-n)/u+2;break;case s:l=(n-i)/u+4}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=lt.workingColorSpace){return lt.fromWorkingColorSpace(Jt.copy(this),t),e.r=Jt.r,e.g=Jt.g,e.b=Jt.b,e}getStyle(e=cn){lt.fromWorkingColorSpace(Jt.copy(this),e);let t=Jt.r,n=Jt.g,i=Jt.b;return e!==cn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(255*t)},${Math.round(255*n)},${Math.round(255*i)})`}offsetHSL(e,t,n){return this.getHSL(ri),this.setHSL(ri.h+e,ri.s+t,ri.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ri),e.getHSL(is);let n=Ir(ri.h,is.h,t),i=Ir(ri.s,is.s,t),s=Ir(ri.l,is.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Jt=new qe;qe.NAMES=eh;var du=0,Ii=class extends $n{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:du++}),this.uuid=Fi(),this.name="",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ga,this.blendDst=Wa,this.blendEquation=Ai,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=zi,this.stencilZFail=zi,this.stencilZPass=zi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];i!==void 0?i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n:console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`)}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};function i(s){let a=[];for(let o in s){let l=s[o];delete l.metadata,a.push(l)}return a}if(n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ga&&(n.blendSrc=this.blendSrc),this.blendDst!==Wa&&(n.blendDst=this.blendDst),this.blendEquation!==Ai&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==zi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==zi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==zi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData),t){let s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Li=class extends Ii{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Hp=pu();function pu(){let r=new ArrayBuffer(4),e=new Float32Array(r),t=new Uint32Array(r),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[256|l]=32768,i[l]=24,i[256|l]=24):c<-14?(n[l]=1024>>-c-14,n[256|l]=1024>>-c-14|32768,i[l]=-c-1,i[256|l]=-c-1):c<=15?(n[l]=c+15<<10,n[256|l]=c+15<<10|32768,i[l]=13,i[256|l]=13):c<128?(n[l]=31744,n[256|l]=64512,i[l]=24,i[256|l]=24):(n[l]=31744,n[256|l]=64512,i[l]=13,i[256|l]=13)}let s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(8388608&c);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:s,exponentTable:a,offsetTable:o}}var Ut=new R,rs=new me,It=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ol,this.updateRanges=[],this.gpuType=Jn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)rs.fromBufferAttribute(this,t),rs.applyMatrix3(e),this.setXY(t,rs.x,rs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix3(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix4(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyNormalMatrix(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.transformDirection(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Qi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=tn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Qi(t,this.array)),t}setX(e,t){return this.normalized&&(t=tn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Qi(t,this.array)),t}setY(e,t){return this.normalized&&(t=tn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Qi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=tn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Qi(t,this.array)),t}setW(e,t){return this.normalized&&(t=tn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=tn(t,this.array),n=tn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=tn(t,this.array),n=tn(n,this.array),i=tn(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=tn(t,this.array),n=tn(n,this.array),i=tn(i,this.array),s=tn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ol&&(e.usage=this.usage),e}};var Ds=class extends It{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Us=class extends It{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Ue=class extends It{constructor(e,t,n){super(new Float32Array(e),t,n)}},fu=0,_n=new Be,Ca=new Cn,Zi=new R,dn=new pn,Ar=new pn,Ht=new R,mt=class r extends $n{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:fu++}),this.uuid=Fi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Qc(e)?Us:Ds)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Je().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return _n.makeRotationFromQuaternion(e),this.applyMatrix4(_n),this}rotateX(e){return _n.makeRotationX(e),this.applyMatrix4(_n),this}rotateY(e){return _n.makeRotationY(e),this.applyMatrix4(_n),this}rotateZ(e){return _n.makeRotationZ(e),this.applyMatrix4(_n),this}translate(e,t,n){return _n.makeTranslation(e,t,n),this.applyMatrix4(_n),this}scale(e,t,n){return _n.makeScale(e,t,n),this.applyMatrix4(_n),this}lookAt(e){return Ca.lookAt(e),Ca.updateMatrix(),this.applyMatrix4(Ca.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Zi).negate(),this.translate(Zi.x,Zi.y,Zi.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ue(n,3))}else{for(let n=0,i=t.count;n<i;n++){let s=e[n];t.setXYZ(n,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),void this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];dn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ht.addVectors(this.boundingBox.min,dn.min),this.boundingBox.expandByPoint(Ht),Ht.addVectors(this.boundingBox.max,dn.max),this.boundingBox.expandByPoint(Ht)):(this.boundingBox.expandByPoint(dn.min),this.boundingBox.expandByPoint(dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),void this.boundingSphere.set(new R,1/0);if(e){let n=this.boundingSphere.center;if(dn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let o=t[s];Ar.setFromBufferAttribute(o),this.morphTargetsRelative?(Ht.addVectors(dn.min,Ar.min),dn.expandByPoint(Ht),Ht.addVectors(dn.max,Ar.max),dn.expandByPoint(Ht)):(dn.expandByPoint(Ar.min),dn.expandByPoint(Ar.max))}dn.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)Ht.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Ht));if(t)for(let s=0,a=t.length;s<a;s++){let o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ht.fromBufferAttribute(o,c),l&&(Zi.fromBufferAttribute(e,c),Ht.add(Zi)),i=Math.max(i,n.distanceToSquared(Ht))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0)return void console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");let n=t.position,i=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new It(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let V=0;V<n.count;V++)o[V]=new R,l[V]=new R;let c=new R,h=new R,u=new R,d=new me,p=new me,m=new me,_=new R,f=new R;function g(V,C,X){c.fromBufferAttribute(n,V),h.fromBufferAttribute(n,C),u.fromBufferAttribute(n,X),d.fromBufferAttribute(s,V),p.fromBufferAttribute(s,C),m.fromBufferAttribute(s,X),h.sub(c),u.sub(c),p.sub(d),m.sub(d);let L=1/(p.x*m.y-m.x*p.y);isFinite(L)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(u,-p.y).multiplyScalar(L),f.copy(u).multiplyScalar(p.x).addScaledVector(h,-m.x).multiplyScalar(L),o[V].add(_),o[C].add(_),o[X].add(_),l[V].add(f),l[C].add(f),l[X].add(f))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let V=0,C=v.length;V<C;++V){let X=v[V],L=X.start;for(let D=L,j=L+X.count;D<j;D+=3)g(e.getX(D+0),e.getX(D+1),e.getX(D+2))}let x=new R,y=new R,w=new R,E=new R;function U(V){w.fromBufferAttribute(i,V),E.copy(w);let C=o[V];x.copy(C),x.sub(w.multiplyScalar(w.dot(C))).normalize(),y.crossVectors(E,C);let X=y.dot(l[V])<0?-1:1;a.setXYZW(V,x.x,x.y,x.z,X)}for(let V=0,C=v.length;V<C;++V){let X=v[V],L=X.start;for(let D=L,j=L+X.count;D<j;D+=3)U(e.getX(D+0)),U(e.getX(D+1)),U(e.getX(D+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new It(new Float32Array(3*t.count),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let i=new R,s=new R,a=new R,o=new R,l=new R,c=new R,h=new R,u=new R;if(e)for(let d=0,p=e.count;d<p;d+=3){let m=e.getX(d+0),_=e.getX(d+1),f=e.getX(d+2);i.fromBufferAttribute(t,m),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,f),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,f),o.add(h),l.add(h),c.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,s),u.subVectors(i,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ht.fromBufferAttribute(e,t),Ht.normalize(),e.setXYZ(t,Ht.x,Ht.y,Ht.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),p=0,m=0;for(let _=0,f=l.length;_<f;_++){p=o.isInterleavedBufferAttribute?l[_]*o.data.stride+o.offset:l[_]*h;for(let g=0;g<h;g++)d[m++]=c[p++]}return new It(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new r,n=this.index.array,i=this.attributes;for(let o in i){let l=e(i[o],n);t.setAttribute(o,l)}let s=this.morphAttributes;for(let o in s){let l=[],c=s[o];for(let h=0,u=c.length;h<u;h++){let d=e(c[h],n);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let i={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(i[l]=h,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let i=e.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(t))}let s=e.morphAttributes;for(let c in s){let h=[],u=s[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},ec=new Be,bi=new Qn,ss=new Fn,tc=new R,as=new R,os=new R,ls=new R,Pa=new R,cs=new R,nc=new R,hs=new R,Pt=class extends Cn{constructor(e=new mt,t=new Li){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let i=0,s=n.length;i<s;i++){let a=n[i].name||String(i);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=i}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let o=this.morphTargetInfluences;if(s&&o){cs.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=o[l],u=s[l];h!==0&&(Pa.fromBufferAttribute(u,e),a?cs.addScaledVector(Pa,h):cs.addScaledVector(Pa.sub(t),h))}t.add(cs)}return t}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;if(i!==void 0){if(n.boundingSphere===null&&n.computeBoundingSphere(),ss.copy(n.boundingSphere),ss.applyMatrix4(s),bi.copy(e.ray).recast(e.near),ss.containsPoint(bi.origin)===!1&&(bi.intersectSphere(ss,tc)===null||bi.origin.distanceToSquared(tc)>(e.far-e.near)**2))return;ec.copy(s).invert(),bi.copy(e.ray).applyMatrix4(ec),n.boundingBox!==null&&bi.intersectsBox(n.boundingBox)===!1||this._computeIntersections(e,t,bi)}}_computeIntersections(e,t,n){let i,s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,_=d.length;m<_;m++){let f=d[m],g=a[f.materialIndex];for(let v=Math.max(f.start,p.start),x=Math.min(o.count,Math.min(f.start+f.count,p.start+p.count));v<x;v+=3)i=us(this,g,e,n,c,h,u,o.getX(v),o.getX(v+1),o.getX(v+2)),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=f.materialIndex,t.push(i))}else for(let m=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);m<_;m+=3)i=us(this,a,e,n,c,h,u,o.getX(m),o.getX(m+1),o.getX(m+2)),i&&(i.faceIndex=Math.floor(m/3),t.push(i));else if(l!==void 0)if(Array.isArray(a))for(let m=0,_=d.length;m<_;m++){let f=d[m],g=a[f.materialIndex];for(let v=Math.max(f.start,p.start),x=Math.min(l.count,Math.min(f.start+f.count,p.start+p.count));v<x;v+=3)i=us(this,g,e,n,c,h,u,v,v+1,v+2),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=f.materialIndex,t.push(i))}else for(let m=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);m<_;m+=3)i=us(this,a,e,n,c,h,u,m,m+1,m+2),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}};function us(r,e,t,n,i,s,a,o,l,c){r.getVertexPosition(o,as),r.getVertexPosition(l,os),r.getVertexPosition(c,ls);let h=(function(u,d,p,m,_,f,g,v){let x;if(x=d.side===1?m.intersectTriangle(g,f,_,!0,v):m.intersectTriangle(_,f,g,d.side===0,v),x===null)return null;hs.copy(v),hs.applyMatrix4(u.matrixWorld);let y=p.ray.origin.distanceTo(hs);return y<p.near||y>p.far?null:{distance:y,point:hs.clone(),object:u}})(r,e,t,n,as,os,ls,nc);if(h){let u=new R;ai.getBarycoord(nc,as,os,ls,u),i&&(h.uv=ai.getInterpolatedAttribute(i,o,l,c,u,new me)),s&&(h.uv1=ai.getInterpolatedAttribute(s,o,l,c,u,new me)),a&&(h.normal=ai.getInterpolatedAttribute(a,o,l,c,u,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new R,materialIndex:0};ai.getNormal(as,os,ls,d.normal),h.face=d,h.barycoord=u}return h}var ci=class r extends mt{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};let o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,p=0;function m(_,f,g,v,x,y,w,E,U,V,C){let X=y/U,L=w/V,D=y/2,j=w/2,G=E/2,Q=U+1,te=V+1,S=0,I=0,O=new R;for(let H=0;H<te;H++){let W=H*L-j;for(let Z=0;Z<Q;Z++){let le=Z*X-D;O[_]=le*v,O[f]=W*x,O[g]=G,c.push(O.x,O.y,O.z),O[_]=0,O[f]=0,O[g]=E>0?1:-1,h.push(O.x,O.y,O.z),u.push(Z/U),u.push(1-H/V),S+=1}}for(let H=0;H<V;H++)for(let W=0;W<U;W++){let Z=d+W+Q*H,le=d+W+Q*(H+1),re=d+(W+1)+Q*(H+1),ie=d+(W+1)+Q*H;l.push(Z,le,ie),l.push(le,re,ie),I+=6}o.addGroup(p,I,C),p+=I,d+=S}m("z","y","x",-1,-1,n,t,e,a,s,0),m("z","y","x",1,-1,n,t,-e,a,s,1),m("x","z","y",1,1,e,n,t,i,a,2),m("x","z","y",1,-1,e,n,-t,i,a,3),m("x","y","z",1,-1,e,t,n,i,s,4),m("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new Ue(c,3)),this.setAttribute("normal",new Ue(h,3)),this.setAttribute("uv",new Ue(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function hr(r){let e={};for(let t in r){e[t]={};for(let n in r[t]){let i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function nn(r){let e={};for(let t=0;t<r.length;t++){let n=hr(r[t]);for(let i in n)e[i]=n[i]}return e}function th(r){let e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:lt.workingColorSpace}var mu={clone:hr,merge:nn},sn=class extends Ii{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,this.fragmentShader=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=hr(e.uniforms),this.uniformsGroups=(function(t){let n=[];for(let i=0;i<t.length;i++)n.push(t[i].clone());return n})(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let s=this.uniforms[i].value;s&&s.isTexture?t.uniforms[i]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[i]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[i]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[i]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[i]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[i]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[i]={type:"m4",value:s.toArray()}:t.uniforms[i]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Di=class extends Cn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Be,this.projectionMatrix=new Be,this.projectionMatrixInverse=new Be,this.coordinateSystem=cr}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},si=new R,ic=new me,rc=new me,rn=class extends Di{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=2*Br*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(.5*nr*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return 2*Br*Math.atan(Math.tan(.5*nr*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(si.x,si.y).multiplyScalar(-e/si.z),si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(si.x,si.y).multiplyScalar(-e/si.z)}getViewSize(e,t){return this.getViewBounds(e,ic,rc),t.subVectors(rc,ic)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(.5*nr*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ji=-90,Ao=class extends Cn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new rn(Ji,1,e,t);i.layers=this.layers,this.add(i);let s=new rn(Ji,1,e,t);s.layers=this.layers,this.add(s);let a=new rn(Ji,1,e,t);a.layers=this.layers,this.add(a);let o=new rn(Ji,1,e,t);o.layers=this.layers,this.add(o);let l=new rn(Ji,1,e,t);l.layers=this.layers,this.add(l);let c=new rn(Ji,1,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,o,l]=t;for(let c of t)this.remove(c);if(e===cr)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else{if(e!==Cs)throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1)}for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,s),e.setRenderTarget(n,1,i),e.render(t,a),e.setRenderTarget(n,2,i),e.render(t,o),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,d,p),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},Ns=class extends xn{constructor(e,t,n,i,s,a,o,l,c,h){super(e=e!==void 0?e:[],t=t!==void 0?t:sr,n,i,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ro=class extends yn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Ns(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0&&t.generateMipmaps,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Zn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new ci(5,5,5),s=new sn({name:"CubemapFromEquirect",uniforms:hr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=t;let a=new Pt(i,s),o=t.minFilter;return t.minFilter===er&&(t.minFilter=Zn),new Ao(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,i){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}},Ia=new R,gu=new R,vu=new Je,An=class{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=Ia.subVectors(n,t).cross(gu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Ia),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||vu.getNormalMatrix(e),i=this.coplanarPoint(Ia).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Si=new Fn,ds=new R,kr=class{constructor(e=new An,t=new An,n=new An,i=new An,s=new An,a=new An){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2e3){let n=this.planes,i=e.elements,s=i[0],a=i[1],o=i[2],l=i[3],c=i[4],h=i[5],u=i[6],d=i[7],p=i[8],m=i[9],_=i[10],f=i[11],g=i[12],v=i[13],x=i[14],y=i[15];if(n[0].setComponents(l-s,d-c,f-p,y-g).normalize(),n[1].setComponents(l+s,d+c,f+p,y+g).normalize(),n[2].setComponents(l+a,d+h,f+m,y+v).normalize(),n[3].setComponents(l-a,d-h,f-m,y-v).normalize(),n[4].setComponents(l-o,d-u,f-_,y-x).normalize(),t===cr)n[5].setComponents(l+o,d+u,f+_,y+x).normalize();else{if(t!==Cs)throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);n[5].setComponents(o,u,_,x).normalize()}return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Si.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Si.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Si)}intersectsSprite(e){return Si.center.set(0,0,0),Si.radius=.7071067811865476,Si.applyMatrix4(e.matrixWorld),this.intersectsSphere(Si)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(ds.x=i.normal.x>0?e.max.x:e.min.x,ds.y=i.normal.y>0?e.max.y:e.min.y,ds.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(ds)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function nh(){let r=null,e=!1,t=null,n=null;function i(s,a){t(s,a),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function _u(r){let e=new WeakMap;return{get:function(t){return t.isInterleavedBufferAttribute&&(t=t.data),e.get(t)},remove:function(t){t.isInterleavedBufferAttribute&&(t=t.data);let n=e.get(t);n&&(r.deleteBuffer(n.buffer),e.delete(t))},update:function(t,n){if(t.isInterleavedBufferAttribute&&(t=t.data),t.isGLBufferAttribute){let s=e.get(t);return void((!s||s.version<t.version)&&e.set(t,{buffer:t.buffer,type:t.type,bytesPerElement:t.elementSize,version:t.version}))}let i=e.get(t);if(i===void 0)e.set(t,(function(s,a){let o=s.array,l=s.usage,c=o.byteLength,h=r.createBuffer(),u;if(r.bindBuffer(a,h),r.bufferData(a,o,l),s.onUploadCallback(),o instanceof Float32Array)u=r.FLOAT;else if(o instanceof Uint16Array)u=s.isFloat16BufferAttribute?r.HALF_FLOAT:r.UNSIGNED_SHORT;else if(o instanceof Int16Array)u=r.SHORT;else if(o instanceof Uint32Array)u=r.UNSIGNED_INT;else if(o instanceof Int32Array)u=r.INT;else if(o instanceof Int8Array)u=r.BYTE;else if(o instanceof Uint8Array)u=r.UNSIGNED_BYTE;else{if(!(o instanceof Uint8ClampedArray))throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+o);u=r.UNSIGNED_BYTE}return{buffer:h,type:u,bytesPerElement:o.BYTES_PER_ELEMENT,version:s.version,size:c}})(t,n));else if(i.version<t.version){if(i.size!==t.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");(function(s,a,o){let l=a.array,c=a.updateRanges;if(r.bindBuffer(o,s),c.length===0)r.bufferSubData(o,0,l);else{c.sort(((u,d)=>u.start-d.start));let h=0;for(let u=1;u<c.length;u++){let d=c[h],p=c[u];p.start<=d.start+d.count+1?d.count=Math.max(d.count,p.start+p.count-d.start):(++h,c[h]=p)}c.length=h+1;for(let u=0,d=c.length;u<d;u++){let p=c[u];r.bufferSubData(o,p.start*l.BYTES_PER_ELEMENT,l,p.start,p.count)}a.clearUpdateRanges()}a.onUploadCallback()})(i.buffer,t,n),i.version=t.version}}}}var hi=class r extends mt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,d=t/l,p=[],m=[],_=[],f=[];for(let g=0;g<h;g++){let v=g*d-a;for(let x=0;x<c;x++){let y=x*u-s;m.push(y,-v,0),_.push(0,0,1),f.push(x/o),f.push(1-g/l)}}for(let g=0;g<l;g++)for(let v=0;v<o;v++){let x=v+c*g,y=v+c*(g+1),w=v+1+c*(g+1),E=v+1+c*g;p.push(x,y,E),p.push(y,w,E)}this.setIndex(p),this.setAttribute("position",new Ue(m,3)),this.setAttribute("normal",new Ue(_,3)),this.setAttribute("uv",new Ue(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.widthSegments,e.heightSegments)}},Xe={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:"gl_FragColor = linearToOutputTexel( gl_FragColor );",colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Te={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Je}},envmap:{envMap:{value:null},envMapRotation:{value:new Je},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Je},normalScale:{value:new me(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0},uvTransform:{value:new Je}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new me(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}}},Un={basic:{uniforms:nn([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:nn([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new qe(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:nn([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:nn([Te.common,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.roughnessmap,Te.metalnessmap,Te.fog,Te.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:nn([Te.common,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.gradientmap,Te.fog,Te.lights,{emissive:{value:new qe(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:nn([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:nn([Te.points,Te.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:nn([Te.common,Te.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:nn([Te.common,Te.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:nn([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:nn([Te.sprite,Te.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new Je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Je}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:nn([Te.common,Te.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:nn([Te.lights,Te.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};Un.physical={uniforms:nn([Un.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Je},clearcoatNormalScale:{value:new me(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Je},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Je},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Je},transmissionSamplerSize:{value:new me},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Je},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Je},anisotropyVector:{value:new me},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Je}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};var ps={r:0,b:0,g:0},Ti=new Bn,xu=new Be;function yu(r,e,t,n,i,s,a){let o=new qe(0),l,c,h=s===!0?0:1,u=null,d=0,p=null;function m(f){let g=f.isScene===!0?f.background:null;return g&&g.isTexture&&(g=(f.backgroundBlurriness>0?t:e).get(g)),g}function _(f,g){f.getRGB(ps,th(r)),n.buffers.color.setClear(ps.r,ps.g,ps.b,g,a)}return{getClearColor:function(){return o},setClearColor:function(f,g=1){o.set(f),h=g,_(o,h)},getClearAlpha:function(){return h},setClearAlpha:function(f){h=f,_(o,h)},render:function(f){let g=!1,v=m(f);v===null?_(o,h):v&&v.isColor&&(_(v,1),g=!0);let x=r.xr.getEnvironmentBlendMode();x==="additive"?n.buffers.color.setClear(0,0,0,1,a):x==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(r.autoClear||g)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))},addToRenderList:function(f,g){let v=m(g);v&&(v.isCubeTexture||v.mapping===$s)?(c===void 0&&(c=new Pt(new ci(1,1,1),new sn({name:"BackgroundCubeMaterial",uniforms:hr(Un.backgroundCube.uniforms),vertexShader:Un.backgroundCube.vertexShader,fragmentShader:Un.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(x,y,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),Ti.copy(g.backgroundRotation),Ti.x*=-1,Ti.y*=-1,Ti.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Ti.y*=-1,Ti.z*=-1),c.material.uniforms.envMap.value=v,c.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(xu.makeRotationFromEuler(Ti)),c.material.toneMapped=lt.getTransfer(v.colorSpace)!==ft,u===v&&d===v.version&&p===r.toneMapping||(c.material.needsUpdate=!0,u=v,d=v.version,p=r.toneMapping),c.layers.enableAll(),f.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new Pt(new hi(2,2),new sn({name:"BackgroundMaterial",uniforms:hr(Un.background.uniforms),vertexShader:Un.background.vertexShader,fragmentShader:Un.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,l.material.toneMapped=lt.getTransfer(v.colorSpace)!==ft,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),u===v&&d===v.version&&p===r.toneMapping||(l.material.needsUpdate=!0,u=v,d=v.version,p=r.toneMapping),l.layers.enableAll(),f.unshift(l,l.geometry,l.material,0,0,null))}}}function Mu(r,e){let t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=c(null),s=i,a=!1;function o(g){return r.bindVertexArray(g)}function l(g){return r.deleteVertexArray(g)}function c(g){let v=[],x=[],y=[];for(let w=0;w<t;w++)v[w]=0,x[w]=0,y[w]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:v,enabledAttributes:x,attributeDivisors:y,object:g,attributes:{},index:null}}function h(){let g=s.newAttributes;for(let v=0,x=g.length;v<x;v++)g[v]=0}function u(g){d(g,0)}function d(g,v){let x=s.newAttributes,y=s.enabledAttributes,w=s.attributeDivisors;x[g]=1,y[g]===0&&(r.enableVertexAttribArray(g),y[g]=1),w[g]!==v&&(r.vertexAttribDivisor(g,v),w[g]=v)}function p(){let g=s.newAttributes,v=s.enabledAttributes;for(let x=0,y=v.length;x<y;x++)v[x]!==g[x]&&(r.disableVertexAttribArray(x),v[x]=0)}function m(g,v,x,y,w,E,U){U===!0?r.vertexAttribIPointer(g,v,x,w,E):r.vertexAttribPointer(g,v,x,y,w,E)}function _(){f(),a=!0,s!==i&&(s=i,o(s.object))}function f(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:function(g,v,x,y,w){let E=!1,U=(function(V,C,X){let L=X.wireframe===!0,D=n[V.id];D===void 0&&(D={},n[V.id]=D);let j=D[C.id];j===void 0&&(j={},D[C.id]=j);let G=j[L];return G===void 0&&(G=c(r.createVertexArray()),j[L]=G),G})(y,x,v);s!==U&&(s=U,o(s.object)),E=(function(V,C,X,L){let D=s.attributes,j=C.attributes,G=0,Q=X.getAttributes();for(let te in Q)if(Q[te].location>=0){let S=D[te],I=j[te];if(I===void 0&&(te==="instanceMatrix"&&V.instanceMatrix&&(I=V.instanceMatrix),te==="instanceColor"&&V.instanceColor&&(I=V.instanceColor)),S===void 0||S.attribute!==I||I&&S.data!==I.data)return!0;G++}return s.attributesNum!==G||s.index!==L})(g,y,x,w),E&&(function(V,C,X,L){let D={},j=C.attributes,G=0,Q=X.getAttributes();for(let te in Q)if(Q[te].location>=0){let S=j[te];S===void 0&&(te==="instanceMatrix"&&V.instanceMatrix&&(S=V.instanceMatrix),te==="instanceColor"&&V.instanceColor&&(S=V.instanceColor));let I={};I.attribute=S,S&&S.data&&(I.data=S.data),D[te]=I,G++}s.attributes=D,s.attributesNum=G,s.index=L})(g,y,x,w),w!==null&&e.update(w,r.ELEMENT_ARRAY_BUFFER),(E||a)&&(a=!1,(function(V,C,X,L){h();let D=L.attributes,j=X.getAttributes(),G=C.defaultAttributeValues;for(let Q in j){let te=j[Q];if(te.location>=0){let S=D[Q];if(S===void 0&&(Q==="instanceMatrix"&&V.instanceMatrix&&(S=V.instanceMatrix),Q==="instanceColor"&&V.instanceColor&&(S=V.instanceColor)),S!==void 0){let I=S.normalized,O=S.itemSize,H=e.get(S);if(H===void 0)continue;let W=H.buffer,Z=H.type,le=H.bytesPerElement,re=Z===r.INT||Z===r.UNSIGNED_INT||S.gpuType===_l;if(S.isInterleavedBufferAttribute){let ie=S.data,T=ie.stride,b=S.offset;if(ie.isInstancedInterleavedBuffer){for(let F=0;F<te.locationSize;F++)d(te.location+F,ie.meshPerAttribute);V.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let F=0;F<te.locationSize;F++)u(te.location+F);r.bindBuffer(r.ARRAY_BUFFER,W);for(let F=0;F<te.locationSize;F++)m(te.location+F,O/te.locationSize,Z,I,T*le,(b+O/te.locationSize*F)*le,re)}else{if(S.isInstancedBufferAttribute){for(let ie=0;ie<te.locationSize;ie++)d(te.location+ie,S.meshPerAttribute);V.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=S.meshPerAttribute*S.count)}else for(let ie=0;ie<te.locationSize;ie++)u(te.location+ie);r.bindBuffer(r.ARRAY_BUFFER,W);for(let ie=0;ie<te.locationSize;ie++)m(te.location+ie,O/te.locationSize,Z,I,O*le,O/te.locationSize*ie*le,re)}}else if(G!==void 0){let I=G[Q];if(I!==void 0)switch(I.length){case 2:r.vertexAttrib2fv(te.location,I);break;case 3:r.vertexAttrib3fv(te.location,I);break;case 4:r.vertexAttrib4fv(te.location,I);break;default:r.vertexAttrib1fv(te.location,I)}}}}p()})(g,v,x,y),w!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(w).buffer))},reset:_,resetDefaultState:f,dispose:function(){_();for(let g in n){let v=n[g];for(let x in v){let y=v[x];for(let w in y)l(y[w].object),delete y[w];delete v[x]}delete n[g]}},releaseStatesOfGeometry:function(g){if(n[g.id]===void 0)return;let v=n[g.id];for(let x in v){let y=v[x];for(let w in y)l(y[w].object),delete y[w];delete v[x]}delete n[g.id]},releaseStatesOfProgram:function(g){for(let v in n){let x=n[v];if(x[g.id]===void 0)continue;let y=x[g.id];for(let w in y)l(y[w].object),delete y[w];delete x[g.id]}},initAttributes:h,enableAttribute:u,disableUnusedAttributes:p}}function bu(r,e,t){let n;function i(s,a,o){o!==0&&(r.drawArraysInstanced(n,s,a,o),t.update(a,n,o))}this.setMode=function(s){n=s},this.render=function(s,a){r.drawArrays(n,s,a),t.update(a,n,1)},this.renderInstances=i,this.renderMultiDraw=function(s,a,o){if(o===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,s,0,a,0,o);let l=0;for(let c=0;c<o;c++)l+=a[c];t.update(l,n,1)},this.renderMultiDrawInstances=function(s,a,o,l){if(o===0)return;let c=e.get("WEBGL_multi_draw");if(c===null)for(let h=0;h<s.length;h++)i(s[h],a[h],l[h]);else{c.multiDrawArraysInstancedWEBGL(n,s,0,a,0,l,0,o);let h=0;for(let u=0;u<o;u++)h+=a[u]*l[u];t.update(h,n,1)}}}function Su(r,e,t,n){let i;function s(d){if(d==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";d="mediump"}return d==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let a=t.precision!==void 0?t.precision:"highp",o=s(a);o!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",o,"instead."),a=o);let l=t.logarithmicDepthBuffer===!0,c=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),h=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),u=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS);return{isWebGL2:!0,getMaxAnisotropy:function(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let d=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(d.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i},getMaxPrecision:s,textureFormatReadable:function(d){return d===Nn||n.convert(d)===r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT)},textureTypeReadable:function(d){let p=d===Yr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(d!==li&&n.convert(d)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&d!==Jn&&!p)},precision:a,logarithmicDepthBuffer:l,reverseDepthBuffer:c,maxTextures:h,maxVertexTextures:u,maxTextureSize:r.getParameter(r.MAX_TEXTURE_SIZE),maxCubemapSize:r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),maxAttributes:r.getParameter(r.MAX_VERTEX_ATTRIBS),maxVertexUniforms:r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),maxVaryings:r.getParameter(r.MAX_VARYING_VECTORS),maxFragmentUniforms:r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),vertexTextures:u>0,maxSamples:r.getParameter(r.MAX_SAMPLES)}}function Tu(r){let e=this,t=null,n=0,i=!1,s=!1,a=new An,o=new Je,l={value:null,needsUpdate:!1};function c(h,u,d,p){let m=h!==null?h.length:0,_=null;if(m!==0){if(_=l.value,p!==!0||_===null){let f=d+4*m,g=u.matrixWorldInverse;o.getNormalMatrix(g),(_===null||_.length<f)&&(_=new Float32Array(f));for(let v=0,x=d;v!==m;++v,x+=4)a.copy(h[v]).applyMatrix4(g,o),a.normal.toArray(_,x),_[x+3]=a.constant}l.value=_,l.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,_}this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){let d=h.length!==0||u||n!==0||i;return i=u,n=h.length,d},this.beginShadows=function(){s=!0,c(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,u){t=c(h,u,0)},this.setState=function(h,u,d){let p=h.clippingPlanes,m=h.clipIntersection,_=h.clipShadows,f=r.get(h);if(!i||p===null||p.length===0||s&&!_)s?c(null):(function(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0})();else{let g=s?0:n,v=4*g,x=f.clippingState||null;l.value=x,x=c(p,u,v,d);for(let y=0;y!==v;++y)x[y]=t[y];f.clippingState=x,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=g}}}function Eu(r){let e=new WeakMap;function t(i,s){return s===ja?i.mapping=sr:s===Xa&&(i.mapping=ar),i}function n(i){let s=i.target;s.removeEventListener("dispose",n);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(i){if(i&&i.isTexture){let s=i.mapping;if(s===ja||s===Xa){if(e.has(i))return t(e.get(i).texture,i.mapping);{let a=i.image;if(a&&a.height>0){let o=new Ro(a.height);return o.fromEquirectangularTexture(r,i),e.set(i,o),i.addEventListener("dispose",n),t(o.texture,i.mapping)}return null}}}return i},dispose:function(){e=new WeakMap}}}var Hr=class extends Di{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},sc=[.125,.215,.35,.446,.526,.582],Rr=20,La=new Hr,ac=new qe,Da=null,Ua=0,Na=0,Oa=!1,wi=(1+Math.sqrt(5))/2,Ki=1/wi,oc=[new R(-wi,Ki,0),new R(wi,Ki,0),new R(-Ki,0,wi),new R(Ki,0,wi),new R(0,wi,-Ki),new R(0,wi,Ki),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)],ur=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Da=this._renderer.getRenderTarget(),Ua=this._renderer.getActiveCubeFace(),Na=this._renderer.getActiveMipmapLevel(),Oa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,i,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Da,Ua,Na),this._renderer.xr.enabled=Oa,e.scissorTest=!1,fs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===sr||e.mapping===ar?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Da=this._renderer.getRenderTarget(),Ua=this._renderer.getActiveCubeFace(),Na=this._renderer.getActiveMipmapLevel(),Oa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Zn,minFilter:Zn,generateMipmaps:!1,type:Yr,format:Nn,colorSpace:vr,depthBuffer:!1},i=lc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=lc(e,t,n);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=(function(a){let o=[],l=[],c=[],h=a,u=a-4+1+sc.length;for(let d=0;d<u;d++){let p=Math.pow(2,h);l.push(p);let m=1/p;d>a-4?m=sc[d-a+4-1]:d===0&&(m=0),c.push(m);let _=1/(p-2),f=-_,g=1+_,v=[f,f,g,f,g,g,f,f,g,g,f,g],x=6,y=6,w=3,E=2,U=1,V=new Float32Array(w*y*x),C=new Float32Array(E*y*x),X=new Float32Array(U*y*x);for(let D=0;D<x;D++){let j=D%3*2/3-1,G=D>2?0:-1,Q=[j,G,0,j+2/3,G,0,j+2/3,G+1,0,j,G,0,j+2/3,G+1,0,j,G+1,0];V.set(Q,w*y*D),C.set(v,E*y*D);let te=[D,D,D,D,D,D];X.set(te,U*y*D)}let L=new mt;L.setAttribute("position",new It(V,w)),L.setAttribute("uv",new It(C,E)),L.setAttribute("faceIndex",new It(X,U)),o.push(L),h>4&&h--}return{lodPlanes:o,sizeLods:l,sigmas:c}})(s)),this._blurMaterial=(function(a,o,l){let c=new Float32Array(Rr),h=new R(0,1,0);return new sn({name:"SphericalGaussianBlur",defines:{n:Rr,CUBEUV_TEXEL_WIDTH:1/o,CUBEUV_TEXEL_HEIGHT:1/l,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:c},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:h}},vertexShader:Tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})})(s,e,t)}return i}_compileMaterial(e){let t=new Pt(this._lodPlanes[0],e);this._renderer.compile(t,La)}_sceneToCubeUV(e,t,n,i){let s=new rn(90,1,t,n),a=[1,-1,1,1,1,1],o=[1,1,1,-1,-1,-1],l=this._renderer,c=l.autoClear,h=l.toneMapping;l.getClearColor(ac),l.toneMapping=0,l.autoClear=!1;let u=new Li({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),d=new Pt(new ci,u),p=!1,m=e.background;m?m.isColor&&(u.color.copy(m),e.background=null,p=!0):(u.color.copy(ac),p=!0);for(let _=0;_<6;_++){let f=_%3;f===0?(s.up.set(0,a[_],0),s.lookAt(o[_],0,0)):f===1?(s.up.set(0,0,a[_]),s.lookAt(0,o[_],0)):(s.up.set(0,a[_],0),s.lookAt(0,0,o[_]));let g=this._cubeSize;fs(i,f*g,_>2?g:0,g,g),l.setRenderTarget(i),p&&l.render(d,s),l.render(e,s)}d.geometry.dispose(),d.material.dispose(),l.toneMapping=h,l.autoClear=c,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===sr||e.mapping===ar;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=hc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=cc());let s=i?this._cubemapMaterial:this._equirectMaterial,a=new Pt(this._lodPlanes[0],s);s.uniforms.envMap.value=e;let o=this._cubeSize;fs(t,0,0,3*o,2*o),n.setRenderTarget(t),n.render(a,La)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodPlanes.length;for(let s=1;s<i;s++){let a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=oc[(i-s-1)%oc.length];this._blur(e,s-1,s,a,o)}t.autoClear=n}_blur(e,t,n,i,s){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",s),this._halfBlur(a,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=new Pt(this._lodPlanes[i],c),u=c.uniforms,d=this._sizeLods[n]-1,p=isFinite(s)?Math.PI/(2*d):2*Math.PI/39,m=s/p,_=isFinite(s)?1+Math.floor(3*m):Rr;_>Rr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${_} samples when the maximum is set to 20`);let f=[],g=0;for(let y=0;y<Rr;++y){let w=y/m,E=Math.exp(-w*w/2);f.push(E),y===0?g+=E:y<_&&(g+=2*E)}for(let y=0;y<f.length;y++)f[y]=f[y]/g;u.envMap.value=e.texture,u.samples.value=_,u.weights.value=f,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);let{_lodMax:v}=this;u.dTheta.value=p,u.mipInt.value=v-n;let x=this._sizeLods[i];fs(t,3*x*(i>v-4?i-v+4:0),4*(this._cubeSize-x),3*x,2*x),l.setRenderTarget(t),l.render(h,La)}};function lc(r,e,t){let n=new yn(r,e,t);return n.texture.mapping=$s,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function fs(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function cc(){return new sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function hc(){return new sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Tl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function wu(r){let e=new WeakMap,t=null;function n(i){let s=i.target;s.removeEventListener("dispose",n);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(i){if(i&&i.isTexture){let s=i.mapping,a=s===ja||s===Xa,o=s===sr||s===ar;if(a||o){let l=e.get(i),c=l!==void 0?l.texture.pmremVersion:0;if(i.isRenderTargetTexture&&i.pmremVersion!==c)return t===null&&(t=new ur(r)),l=a?t.fromEquirectangular(i,l):t.fromCubemap(i,l),l.texture.pmremVersion=i.pmremVersion,e.set(i,l),l.texture;if(l!==void 0)return l.texture;{let h=i.image;return a&&h&&h.height>0||o&&h&&(function(u){let d=0,p=6;for(let m=0;m<p;m++)u[m]!==void 0&&d++;return d===p})(h)?(t===null&&(t=new ur(r)),l=a?t.fromEquirectangular(i):t.fromCubemap(i),l.texture.pmremVersion=i.pmremVersion,e.set(i,l),i.addEventListener("dispose",n),l.texture):null}}}return i},dispose:function(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}}}function Au(r){let e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let i=t(n);return i===null&&Pr("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Ru(r,e,t,n){let i={},s=new WeakMap;function a(l){let c=l.target;c.index!==null&&e.remove(c.index);for(let u in c.attributes)e.remove(c.attributes[u]);for(let u in c.morphAttributes){let d=c.morphAttributes[u];for(let p=0,m=d.length;p<m;p++)e.remove(d[p])}c.removeEventListener("dispose",a),delete i[c.id];let h=s.get(c);h&&(e.remove(h),s.delete(c)),n.releaseStatesOfGeometry(c),c.isInstancedBufferGeometry===!0&&delete c._maxInstanceCount,t.memory.geometries--}function o(l){let c=[],h=l.index,u=l.attributes.position,d=0;if(h!==null){let _=h.array;d=h.version;for(let f=0,g=_.length;f<g;f+=3){let v=_[f+0],x=_[f+1],y=_[f+2];c.push(v,x,x,y,y,v)}}else{if(u===void 0)return;{let _=u.array;d=u.version;for(let f=0,g=_.length/3-1;f<g;f+=3){let v=f+0,x=f+1,y=f+2;c.push(v,x,x,y,y,v)}}}let p=new(Qc(c)?Us:Ds)(c,1);p.version=d;let m=s.get(l);m&&e.remove(m),s.set(l,p)}return{get:function(l,c){return i[c.id]===!0||(c.addEventListener("dispose",a),i[c.id]=!0,t.memory.geometries++),c},update:function(l){let c=l.attributes;for(let u in c)e.update(c[u],r.ARRAY_BUFFER);let h=l.morphAttributes;for(let u in h){let d=h[u];for(let p=0,m=d.length;p<m;p++)e.update(d[p],r.ARRAY_BUFFER)}},getWireframeAttribute:function(l){let c=s.get(l);if(c){let h=l.index;h!==null&&c.version<h.version&&o(l)}else o(l);return s.get(l)}}}function Cu(r,e,t){let n,i,s;function a(o,l,c){c!==0&&(r.drawElementsInstanced(n,l,i,o*s,c),t.update(l,n,c))}this.setMode=function(o){n=o},this.setIndex=function(o){i=o.type,s=o.bytesPerElement},this.render=function(o,l){r.drawElements(n,l,i,o*s),t.update(l,n,1)},this.renderInstances=a,this.renderMultiDraw=function(o,l,c){if(c===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,l,0,i,o,0,c);let h=0;for(let u=0;u<c;u++)h+=l[u];t.update(h,n,1)},this.renderMultiDrawInstances=function(o,l,c,h){if(c===0)return;let u=e.get("WEBGL_multi_draw");if(u===null)for(let d=0;d<o.length;d++)a(o[d]/s,l[d],h[d]);else{u.multiDrawElementsInstancedWEBGL(n,l,0,i,o,0,h,0,c);let d=0;for(let p=0;p<c;p++)d+=l[p]*h[p];t.update(d,n,1)}}}function Pu(r){let e={frame:0,calls:0,triangles:0,points:0,lines:0};return{memory:{geometries:0,textures:0},render:e,programs:null,autoReset:!0,reset:function(){e.calls=0,e.triangles=0,e.points=0,e.lines=0},update:function(t,n,i){switch(e.calls++,n){case r.TRIANGLES:e.triangles+=i*(t/3);break;case r.LINES:e.lines+=i*(t/2);break;case r.LINE_STRIP:e.lines+=i*(t-1);break;case r.LINE_LOOP:e.lines+=i*t;break;case r.POINTS:e.points+=i*t;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",n)}}}}function Iu(r,e,t){let n=new WeakMap,i=new xt;return{update:function(s,a,o){let l=s.morphTargetInfluences,c=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=c!==void 0?c.length:0,u=n.get(a);if(u===void 0||u.count!==h){let V=function(){E.dispose(),n.delete(a),a.removeEventListener("dispose",V)};u!==void 0&&u.texture.dispose();let d=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,_=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],g=a.morphAttributes.color||[],v=0;d===!0&&(v=1),p===!0&&(v=2),m===!0&&(v=3);let x=a.attributes.position.count*v,y=1;x>e.maxTextureSize&&(y=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let w=new Float32Array(x*y*4*h),E=new Ls(w,x,y,h);E.type=Jn,E.needsUpdate=!0;let U=4*v;for(let C=0;C<h;C++){let X=_[C],L=f[C],D=g[C],j=x*y*4*C;for(let G=0;G<X.count;G++){let Q=G*U;d===!0&&(i.fromBufferAttribute(X,G),w[j+Q+0]=i.x,w[j+Q+1]=i.y,w[j+Q+2]=i.z,w[j+Q+3]=0),p===!0&&(i.fromBufferAttribute(L,G),w[j+Q+4]=i.x,w[j+Q+5]=i.y,w[j+Q+6]=i.z,w[j+Q+7]=0),m===!0&&(i.fromBufferAttribute(D,G),w[j+Q+8]=i.x,w[j+Q+9]=i.y,w[j+Q+10]=i.z,w[j+Q+11]=D.itemSize===4?i.w:1)}}u={count:h,texture:E,size:new me(x,y)},n.set(a,u),a.addEventListener("dispose",V)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)o.getUniforms().setValue(r,"morphTexture",s.morphTexture,t);else{let d=0;for(let m=0;m<l.length;m++)d+=l[m];let p=a.morphTargetsRelative?1:1-d;o.getUniforms().setValue(r,"morphTargetBaseInfluence",p),o.getUniforms().setValue(r,"morphTargetInfluences",l)}o.getUniforms().setValue(r,"morphTargetsTexture",u.texture,t),o.getUniforms().setValue(r,"morphTargetsTextureSize",u.size)}}}function Lu(r,e,t,n){let i=new WeakMap;function s(a){let o=a.target;o.removeEventListener("dispose",s),t.remove(o.instanceMatrix),o.instanceColor!==null&&t.remove(o.instanceColor)}return{update:function(a){let o=n.render.frame,l=a.geometry,c=e.get(a,l);if(i.get(c)!==o&&(e.update(c),i.set(c,o)),a.isInstancedMesh&&(a.hasEventListener("dispose",s)===!1&&a.addEventListener("dispose",s),i.get(a)!==o&&(t.update(a.instanceMatrix,r.ARRAY_BUFFER),a.instanceColor!==null&&t.update(a.instanceColor,r.ARRAY_BUFFER),i.set(a,o))),a.isSkinnedMesh){let h=a.skeleton;i.get(h)!==o&&(h.update(),i.set(h,o))}return c},dispose:function(){i=new WeakMap}}}var Os=class extends xn{constructor(e,t,n,i,s,a,o,l,c,h=1026){if(h!==Fr&&h!==lr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Fr&&(n=Pi),n===void 0&&h===lr&&(n=or),super(null,i,s,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Rn,this.minFilter=l!==void 0?l:Rn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ih=new xn,uc=new Os(1,1),rh=new Ls,sh=new wo,ah=new Ns,dc=[],pc=[],fc=new Float32Array(16),mc=new Float32Array(9),gc=new Float32Array(4);function _r(r,e,t){let n=r[0];if(n<=0||n>0)return r;let i=e*t,s=dc[i];if(s===void 0&&(s=new Float32Array(i),dc[i]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function Ft(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function Bt(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function ta(r,e){let t=pc[e];t===void 0&&(t=new Int32Array(e),pc[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function Du(r,e){let t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Uu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;r.uniform2fv(this.addr,e),Bt(t,e)}}function Nu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)t[0]===e.r&&t[1]===e.g&&t[2]===e.b||(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ft(t,e))return;r.uniform3fv(this.addr,e),Bt(t,e)}}function Ou(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;r.uniform4fv(this.addr,e),Bt(t,e)}}function Fu(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Bt(t,e)}else{if(Ft(t,n))return;gc.set(n),r.uniformMatrix2fv(this.addr,!1,gc),Bt(t,n)}}function Bu(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Bt(t,e)}else{if(Ft(t,n))return;mc.set(n),r.uniformMatrix3fv(this.addr,!1,mc),Bt(t,n)}}function zu(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Bt(t,e)}else{if(Ft(t,n))return;fc.set(n),r.uniformMatrix4fv(this.addr,!1,fc),Bt(t,n)}}function ku(r,e){let t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Hu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;r.uniform2iv(this.addr,e),Bt(t,e)}}function Vu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;r.uniform3iv(this.addr,e),Bt(t,e)}}function Gu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;r.uniform4iv(this.addr,e),Bt(t,e)}}function Wu(r,e){let t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function ju(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;r.uniform2uiv(this.addr,e),Bt(t,e)}}function Xu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;r.uniform3uiv(this.addr,e),Bt(t,e)}}function qu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;r.uniform4uiv(this.addr,e),Bt(t,e)}}function Yu(r,e,t){let n=this.cache,i=t.allocateTextureUnit(),s;n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),this.type===r.SAMPLER_2D_SHADOW?(uc.compareFunction=515,s=uc):s=ih,t.setTexture2D(e||s,i)}function Zu(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||sh,i)}function Ju(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||ah,i)}function Ku(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||rh,i)}function $u(r,e){r.uniform1fv(this.addr,e)}function Qu(r,e){let t=_r(e,this.size,2);r.uniform2fv(this.addr,t)}function ed(r,e){let t=_r(e,this.size,3);r.uniform3fv(this.addr,t)}function td(r,e){let t=_r(e,this.size,4);r.uniform4fv(this.addr,t)}function nd(r,e){let t=_r(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function id(r,e){let t=_r(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function rd(r,e){let t=_r(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function sd(r,e){r.uniform1iv(this.addr,e)}function ad(r,e){r.uniform2iv(this.addr,e)}function od(r,e){r.uniform3iv(this.addr,e)}function ld(r,e){r.uniform4iv(this.addr,e)}function cd(r,e){r.uniform1uiv(this.addr,e)}function hd(r,e){r.uniform2uiv(this.addr,e)}function ud(r,e){r.uniform3uiv(this.addr,e)}function dd(r,e){r.uniform4uiv(this.addr,e)}function pd(r,e,t){let n=this.cache,i=e.length,s=ta(t,i);Ft(n,s)||(r.uniform1iv(this.addr,s),Bt(n,s));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||ih,s[a])}function fd(r,e,t){let n=this.cache,i=e.length,s=ta(t,i);Ft(n,s)||(r.uniform1iv(this.addr,s),Bt(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||sh,s[a])}function md(r,e,t){let n=this.cache,i=e.length,s=ta(t,i);Ft(n,s)||(r.uniform1iv(this.addr,s),Bt(n,s));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||ah,s[a])}function gd(r,e,t){let n=this.cache,i=e.length,s=ta(t,i);Ft(n,s)||(r.uniform1iv(this.addr,s),Bt(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||rh,s[a])}var Co=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=(function(i){switch(i){case 5126:return Du;case 35664:return Uu;case 35665:return Nu;case 35666:return Ou;case 35674:return Fu;case 35675:return Bu;case 35676:return zu;case 5124:case 35670:return ku;case 35667:case 35671:return Hu;case 35668:case 35672:return Vu;case 35669:case 35673:return Gu;case 5125:return Wu;case 36294:return ju;case 36295:return Xu;case 36296:return qu;case 35678:case 36198:case 36298:case 36306:case 35682:return Yu;case 35679:case 36299:case 36307:return Zu;case 35680:case 36300:case 36308:case 36293:return Ju;case 36289:case 36303:case 36311:case 36292:return Ku}})(t.type)}},Po=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=(function(i){switch(i){case 5126:return $u;case 35664:return Qu;case 35665:return ed;case 35666:return td;case 35674:return nd;case 35675:return id;case 35676:return rd;case 5124:case 35670:return sd;case 35667:case 35671:return ad;case 35668:case 35672:return od;case 35669:case 35673:return ld;case 5125:return cd;case 36294:return hd;case 36295:return ud;case 36296:return dd;case 35678:case 36198:case 36298:case 36306:case 35682:return pd;case 35679:case 36299:case 36307:return fd;case 35680:case 36300:case 36308:case 36293:return md;case 36289:case 36303:case 36311:case 36292:return gd}})(t.type)}},Io=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let s=0,a=i.length;s!==a;++s){let o=i[s];o.setValue(e,t[o.id],n)}}},Fa=/(\w+)(\])?(\[|\.)?/g;function vc(r,e){r.seq.push(e),r.map[e.id]=e}function vd(r,e,t){let n=r.name,i=n.length;for(Fa.lastIndex=0;;){let s=Fa.exec(n),a=Fa.lastIndex,o=s[1],l=s[2]==="]",c=s[3];if(l&&(o|=0),c===void 0||c==="["&&a+2===i){vc(t,c===void 0?new Co(o,r,e):new Po(o,r,e));break}{let h=t.map[o];h===void 0&&(h=new Io(o),vc(t,h)),t=h}}}var rr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let s=e.getActiveUniform(t,i);vd(s,e.getUniformLocation(t,s.name),this)}}setValue(e,t,n,i){let s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){let o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,s=e.length;i!==s;++i){let a=e[i];a.id in t&&n.push(a)}return n}};function _c(r,e,t){let n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}var _d=0,xc=new Je;function yc(r,e,t){let n=r.getShaderParameter(e,r.COMPILE_STATUS),i=r.getShaderInfoLog(e).trim();if(n&&i==="")return"";let s=/ERROR: 0:(\d+)/.exec(i);if(s){let a=parseInt(s[1]);return t.toUpperCase()+`

`+i+`

`+(function(o,l){let c=o.split(`
`),h=[],u=Math.max(l-6,0),d=Math.min(l+6,c.length);for(let p=u;p<d;p++){let m=p+1;h.push(`${m===l?">":" "} ${m}: ${c[p]}`)}return h.join(`
`)})(r.getShaderSource(e),a)}return i}function xd(r,e){let t=(function(n){lt._getMatrix(xc,lt.workingColorSpace,n);let i=`mat3( ${xc.elements.map((s=>s.toFixed(4)))} )`;switch(lt.getTransfer(n)){case Qs:return[i,"LinearTransferOETF"];case ft:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[i,"LinearTransferOETF"]}})(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function yd(r,e){let t;switch(e){case 1:t="Linear";break;case 2:t="Reinhard";break;case 3:t="Cineon";break;case 4:t="ACESFilmic";break;case 6:t="AgX";break;case 7:t="Neutral";break;case 5:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var ms=new R;function Md(){return lt.getLuminanceCoefficients(ms),["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${ms.x.toFixed(4)}, ${ms.y.toFixed(4)}, ${ms.z.toFixed(4)} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Cr(r){return r!==""}function Mc(r,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function bc(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var bd=/^[ \t]*#include +<([\w\d./]+)>/gm;function Lo(r){return r.replace(bd,Td)}var Sd=new Map;function Td(r,e){let t=Xe[e];if(t===void 0){let n=Sd.get(e);if(n===void 0)throw new Error("Can not resolve #include <"+e+">");t=Xe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n)}return Lo(t)}var Ed=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sc(r){return r.replace(Ed,wd)}function wd(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function Tc(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Ad(r,e,t,n){let i=r.getContext(),s=t.defines,a=t.vertexShader,o=t.fragmentShader,l=(function(L){let D="SHADOWMAP_TYPE_BASIC";return L.shadowMapType===1?D="SHADOWMAP_TYPE_PCF":L.shadowMapType===2?D="SHADOWMAP_TYPE_PCF_SOFT":L.shadowMapType===3&&(D="SHADOWMAP_TYPE_VSM"),D})(t),c=(function(L){let D="ENVMAP_TYPE_CUBE";if(L.envMap)switch(L.envMapMode){case sr:case ar:D="ENVMAP_TYPE_CUBE";break;case $s:D="ENVMAP_TYPE_CUBE_UV"}return D})(t),h=(function(L){let D="ENVMAP_MODE_REFLECTION";return L.envMap&&L.envMapMode===ar&&(D="ENVMAP_MODE_REFRACTION"),D})(t),u=(function(L){let D="ENVMAP_BLENDING_NONE";if(L.envMap)switch(L.combine){case 0:D="ENVMAP_BLENDING_MULTIPLY";break;case 1:D="ENVMAP_BLENDING_MIX";break;case 2:D="ENVMAP_BLENDING_ADD"}return D})(t),d=(function(L){let D=L.envMapCubeUVHeight;if(D===null)return null;let j=Math.log2(D)-2,G=1/D;return{texelWidth:1/(3*Math.max(Math.pow(2,j),112)),texelHeight:G,maxMip:j}})(t),p=(function(L){return[L.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",L.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Cr).join(`
`)})(t),m=(function(L){let D=[];for(let j in L){let G=L[j];G!==!1&&D.push("#define "+j+" "+G)}return D.join(`
`)})(s),_=i.createProgram(),f,g,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Cr).join(`
`),f.length>0&&(f+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Cr).join(`
`),g.length>0&&(g+=`
`)):(f=[Tc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Cr).join(`
`),g=[Tc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?Xe.tonemapping_pars_fragment:"",t.toneMapping!==0?yd("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,xd("linearToOutputTexel",t.outputColorSpace),Md(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Cr).join(`
`)),a=Lo(a),a=Mc(a,t),a=bc(a,t),o=Lo(o),o=Mc(o,t),o=bc(o,t),a=Sc(a),o=Sc(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,f=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,g=["#define varying in",t.glslVersion===Fl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Fl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let x=v+f+a,y=v+g+o,w=_c(i,i.VERTEX_SHADER,x),E=_c(i,i.FRAGMENT_SHADER,y);function U(L){if(r.debug.checkShaderErrors){let D=i.getProgramInfoLog(_).trim(),j=i.getShaderInfoLog(w).trim(),G=i.getShaderInfoLog(E).trim(),Q=!0,te=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(Q=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,w,E);else{let S=yc(i,w,"vertex"),I=yc(i,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+D+`
`+S+`
`+I)}else D!==""?console.warn("THREE.WebGLProgram: Program Info Log:",D):j!==""&&G!==""||(te=!1);te&&(L.diagnostics={runnable:Q,programLog:D,vertexShader:{log:j,prefix:f},fragmentShader:{log:G,prefix:g}})}i.deleteShader(w),i.deleteShader(E),V=new rr(i,_),C=(function(D,j){let G={},Q=D.getProgramParameter(j,D.ACTIVE_ATTRIBUTES);for(let te=0;te<Q;te++){let S=D.getActiveAttrib(j,te),I=S.name,O=1;S.type===D.FLOAT_MAT2&&(O=2),S.type===D.FLOAT_MAT3&&(O=3),S.type===D.FLOAT_MAT4&&(O=4),G[I]={type:S.type,location:D.getAttribLocation(j,I),locationSize:O}}return G})(i,_)}let V,C;i.attachShader(_,w),i.attachShader(_,E),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_),this.getUniforms=function(){return V===void 0&&U(this),V},this.getAttributes=function(){return C===void 0&&U(this),C};let X=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return X===!1&&(X=i.getProgramParameter(_,37297)),X},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=_d++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=E,this}var Rd=0,Do=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Uo(e),t.set(e,n)),n}},Uo=class{constructor(e){this.id=Rd++,this.code=e,this.usedTimes=0}};function Cd(r,e,t,n,i,s,a){let o=new zr,l=new Do,c=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures,p=i.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(f){return c.add(f),f===0?"uv":`uv${f}`}return{getParameters:function(f,g,v,x,y){let w=x.fog,E=y.geometry,U=f.isMeshStandardMaterial?x.environment:null,V=(f.isMeshStandardMaterial?t:e).get(f.envMap||U),C=V&&V.mapping===$s?V.image.height:null,X=m[f.type];f.precision!==null&&(p=i.getMaxPrecision(f.precision),p!==f.precision&&console.warn("THREE.WebGLProgram.getParameters:",f.precision,"not supported, using",p,"instead."));let L=E.morphAttributes.position||E.morphAttributes.normal||E.morphAttributes.color,D=L!==void 0?L.length:0,j,G,Q,te,S=0;if(E.morphAttributes.position!==void 0&&(S=1),E.morphAttributes.normal!==void 0&&(S=2),E.morphAttributes.color!==void 0&&(S=3),X){let ct=Un[X];j=ct.vertexShader,G=ct.fragmentShader}else j=f.vertexShader,G=f.fragmentShader,l.update(f),Q=l.getVertexShaderID(f),te=l.getFragmentShaderID(f);let I=r.getRenderTarget(),O=r.state.buffers.depth.getReversed(),H=y.isInstancedMesh===!0,W=y.isBatchedMesh===!0,Z=!!f.map,le=!!f.matcap,re=!!V,ie=!!f.aoMap,T=!!f.lightMap,b=!!f.bumpMap,F=!!f.normalMap,k=!!f.displacementMap,P=!!f.emissiveMap,B=!!f.metalnessMap,M=!!f.roughnessMap,z=f.anisotropy>0,q=f.clearcoat>0,ce=f.dispersion>0,Y=f.iridescence>0,oe=f.sheen>0,ae=f.transmission>0,pe=z&&!!f.anisotropyMap,fe=q&&!!f.clearcoatMap,Ee=q&&!!f.clearcoatNormalMap,Ce=q&&!!f.clearcoatRoughnessMap,we=Y&&!!f.iridescenceMap,nt=Y&&!!f.iridescenceThicknessMap,Ve=oe&&!!f.sheenColorMap,Le=oe&&!!f.sheenRoughnessMap,et=!!f.specularMap,at=!!f.specularColorMap,st=!!f.specularIntensityMap,Re=ae&&!!f.transmissionMap,Oe=ae&&!!f.thicknessMap,Ke=!!f.gradientMap,bn=!!f.alphaMap,Hn=f.alphaTest>0,Dt=!!f.alphaHash,Gt=!!f.extensions,on=0;f.toneMapped&&(I!==null&&I.isXRRenderTarget!==!0||(on=r.toneMapping));let J={shaderID:X,shaderType:f.type,shaderName:f.name,vertexShader:j,fragmentShader:G,defines:f.defines,customVertexShaderID:Q,customFragmentShaderID:te,isRawShaderMaterial:f.isRawShaderMaterial===!0,glslVersion:f.glslVersion,precision:p,batching:W,batchingColor:W&&y._colorsTexture!==null,instancing:H,instancingColor:H&&y.instanceColor!==null,instancingMorph:H&&y.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:I===null?r.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:vr,alphaToCoverage:!!f.alphaToCoverage,map:Z,matcap:le,envMap:re,envMapMode:re&&V.mapping,envMapCubeUVHeight:C,aoMap:ie,lightMap:T,bumpMap:b,normalMap:F,displacementMap:d&&k,emissiveMap:P,normalMapObjectSpace:F&&f.normalMapType===1,normalMapTangentSpace:F&&f.normalMapType===0,metalnessMap:B,roughnessMap:M,anisotropy:z,anisotropyMap:pe,clearcoat:q,clearcoatMap:fe,clearcoatNormalMap:Ee,clearcoatRoughnessMap:Ce,dispersion:ce,iridescence:Y,iridescenceMap:we,iridescenceThicknessMap:nt,sheen:oe,sheenColorMap:Ve,sheenRoughnessMap:Le,specularMap:et,specularColorMap:at,specularIntensityMap:st,transmission:ae,transmissionMap:Re,thicknessMap:Oe,gradientMap:Ke,opaque:f.transparent===!1&&f.blending===1&&f.alphaToCoverage===!1,alphaMap:bn,alphaTest:Hn,alphaHash:Dt,combine:f.combine,mapUv:Z&&_(f.map.channel),aoMapUv:ie&&_(f.aoMap.channel),lightMapUv:T&&_(f.lightMap.channel),bumpMapUv:b&&_(f.bumpMap.channel),normalMapUv:F&&_(f.normalMap.channel),displacementMapUv:k&&_(f.displacementMap.channel),emissiveMapUv:P&&_(f.emissiveMap.channel),metalnessMapUv:B&&_(f.metalnessMap.channel),roughnessMapUv:M&&_(f.roughnessMap.channel),anisotropyMapUv:pe&&_(f.anisotropyMap.channel),clearcoatMapUv:fe&&_(f.clearcoatMap.channel),clearcoatNormalMapUv:Ee&&_(f.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ce&&_(f.clearcoatRoughnessMap.channel),iridescenceMapUv:we&&_(f.iridescenceMap.channel),iridescenceThicknessMapUv:nt&&_(f.iridescenceThicknessMap.channel),sheenColorMapUv:Ve&&_(f.sheenColorMap.channel),sheenRoughnessMapUv:Le&&_(f.sheenRoughnessMap.channel),specularMapUv:et&&_(f.specularMap.channel),specularColorMapUv:at&&_(f.specularColorMap.channel),specularIntensityMapUv:st&&_(f.specularIntensityMap.channel),transmissionMapUv:Re&&_(f.transmissionMap.channel),thicknessMapUv:Oe&&_(f.thicknessMap.channel),alphaMapUv:bn&&_(f.alphaMap.channel),vertexTangents:!!E.attributes.tangent&&(F||z),vertexColors:f.vertexColors,vertexAlphas:f.vertexColors===!0&&!!E.attributes.color&&E.attributes.color.itemSize===4,pointsUvs:y.isPoints===!0&&!!E.attributes.uv&&(Z||bn),fog:!!w,useFog:f.fog===!0,fogExp2:!!w&&w.isFogExp2,flatShading:f.flatShading===!0,sizeAttenuation:f.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:O,skinning:y.isSkinnedMesh===!0,morphTargets:E.morphAttributes.position!==void 0,morphNormals:E.morphAttributes.normal!==void 0,morphColors:E.morphAttributes.color!==void 0,morphTargetsCount:D,morphTextureStride:S,numDirLights:g.directional.length,numPointLights:g.point.length,numSpotLights:g.spot.length,numSpotLightMaps:g.spotLightMap.length,numRectAreaLights:g.rectArea.length,numHemiLights:g.hemi.length,numDirLightShadows:g.directionalShadowMap.length,numPointLightShadows:g.pointShadowMap.length,numSpotLightShadows:g.spotShadowMap.length,numSpotLightShadowsWithMaps:g.numSpotLightShadowsWithMaps,numLightProbes:g.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:f.dithering,shadowMapEnabled:r.shadowMap.enabled&&v.length>0,shadowMapType:r.shadowMap.type,toneMapping:on,decodeVideoTexture:Z&&f.map.isVideoTexture===!0&&lt.getTransfer(f.map.colorSpace)===ft,decodeVideoTextureEmissive:P&&f.emissiveMap.isVideoTexture===!0&&lt.getTransfer(f.emissiveMap.colorSpace)===ft,premultipliedAlpha:f.premultipliedAlpha,doubleSided:f.side===2,flipSided:f.side===1,useDepthPacking:f.depthPacking>=0,depthPacking:f.depthPacking||0,index0AttributeName:f.index0AttributeName,extensionClipCullDistance:Gt&&f.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Gt&&f.extensions.multiDraw===!0||W)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:f.customProgramCacheKey()};return J.vertexUv1s=c.has(1),J.vertexUv2s=c.has(2),J.vertexUv3s=c.has(3),c.clear(),J},getProgramCacheKey:function(f){let g=[];if(f.shaderID?g.push(f.shaderID):(g.push(f.customVertexShaderID),g.push(f.customFragmentShaderID)),f.defines!==void 0)for(let v in f.defines)g.push(v),g.push(f.defines[v]);return f.isRawShaderMaterial===!1&&((function(v,x){v.push(x.precision),v.push(x.outputColorSpace),v.push(x.envMapMode),v.push(x.envMapCubeUVHeight),v.push(x.mapUv),v.push(x.alphaMapUv),v.push(x.lightMapUv),v.push(x.aoMapUv),v.push(x.bumpMapUv),v.push(x.normalMapUv),v.push(x.displacementMapUv),v.push(x.emissiveMapUv),v.push(x.metalnessMapUv),v.push(x.roughnessMapUv),v.push(x.anisotropyMapUv),v.push(x.clearcoatMapUv),v.push(x.clearcoatNormalMapUv),v.push(x.clearcoatRoughnessMapUv),v.push(x.iridescenceMapUv),v.push(x.iridescenceThicknessMapUv),v.push(x.sheenColorMapUv),v.push(x.sheenRoughnessMapUv),v.push(x.specularMapUv),v.push(x.specularColorMapUv),v.push(x.specularIntensityMapUv),v.push(x.transmissionMapUv),v.push(x.thicknessMapUv),v.push(x.combine),v.push(x.fogExp2),v.push(x.sizeAttenuation),v.push(x.morphTargetsCount),v.push(x.morphAttributeCount),v.push(x.numDirLights),v.push(x.numPointLights),v.push(x.numSpotLights),v.push(x.numSpotLightMaps),v.push(x.numHemiLights),v.push(x.numRectAreaLights),v.push(x.numDirLightShadows),v.push(x.numPointLightShadows),v.push(x.numSpotLightShadows),v.push(x.numSpotLightShadowsWithMaps),v.push(x.numLightProbes),v.push(x.shadowMapType),v.push(x.toneMapping),v.push(x.numClippingPlanes),v.push(x.numClipIntersection),v.push(x.depthPacking)})(g,f),(function(v,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),v.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reverseDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),v.push(o.mask)})(g,f),g.push(r.outputColorSpace)),g.push(f.customProgramCacheKey),g.join()},getUniforms:function(f){let g=m[f.type],v;if(g){let x=Un[g];v=mu.clone(x.uniforms)}else v=f.uniforms;return v},acquireProgram:function(f,g){let v;for(let x=0,y=h.length;x<y;x++){let w=h[x];if(w.cacheKey===g){v=w,++v.usedTimes;break}}return v===void 0&&(v=new Ad(r,g,f,s),h.push(v)),v},releaseProgram:function(f){if(--f.usedTimes==0){let g=h.indexOf(f);h[g]=h[h.length-1],h.pop(),f.destroy()}},releaseShaderCache:function(f){l.remove(f)},programs:h,dispose:function(){l.dispose()}}}function Pd(){let r=new WeakMap;return{has:function(e){return r.has(e)},get:function(e){let t=r.get(e);return t===void 0&&(t={},r.set(e,t)),t},remove:function(e){r.delete(e)},update:function(e,t,n){r.get(e)[t]=n},dispose:function(){r=new WeakMap}}}function Id(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function Ec(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function wc(){let r=[],e=0,t=[],n=[],i=[];function s(a,o,l,c,h,u){let d=r[e];return d===void 0?(d={id:a.id,object:a,geometry:o,material:l,groupOrder:c,renderOrder:a.renderOrder,z:h,group:u},r[e]=d):(d.id=a.id,d.object=a,d.geometry=o,d.material=l,d.groupOrder=c,d.renderOrder=a.renderOrder,d.z=h,d.group=u),e++,d}return{opaque:t,transmissive:n,transparent:i,init:function(){e=0,t.length=0,n.length=0,i.length=0},push:function(a,o,l,c,h,u){let d=s(a,o,l,c,h,u);l.transmission>0?n.push(d):l.transparent===!0?i.push(d):t.push(d)},unshift:function(a,o,l,c,h,u){let d=s(a,o,l,c,h,u);l.transmission>0?n.unshift(d):l.transparent===!0?i.unshift(d):t.unshift(d)},finish:function(){for(let a=e,o=r.length;a<o;a++){let l=r[a];if(l.id===null)break;l.id=null,l.object=null,l.geometry=null,l.material=null,l.group=null}},sort:function(a,o){t.length>1&&t.sort(a||Id),n.length>1&&n.sort(o||Ec),i.length>1&&i.sort(o||Ec)}}}function Ld(){let r=new WeakMap;return{get:function(e,t){let n=r.get(e),i;return n===void 0?(i=new wc,r.set(e,[i])):t>=n.length?(i=new wc,n.push(i)):i=n[t],i},dispose:function(){r=new WeakMap}}}function Dd(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new R,color:new qe};break;case"SpotLight":t={position:new R,direction:new R,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":t={color:new qe,position:new R,halfWidth:new R,halfHeight:new R}}return r[e.id]=t,t}}}var Ud=0;function Nd(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function Od(r){let e=new Dd,t=(function(){let o={};return{get:function(l){if(o[l.id]!==void 0)return o[l.id];let c;switch(l.type){case"DirectionalLight":case"SpotLight":c={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new me};break;case"PointLight":c={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new me,shadowCameraNear:1,shadowCameraFar:1e3}}return o[l.id]=c,c}}})(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let o=0;o<9;o++)n.probe.push(new R);let i=new R,s=new Be,a=new Be;return{setup:function(o){let l=0,c=0,h=0;for(let U=0;U<9;U++)n.probe[U].set(0,0,0);let u=0,d=0,p=0,m=0,_=0,f=0,g=0,v=0,x=0,y=0,w=0;o.sort(Nd);for(let U=0,V=o.length;U<V;U++){let C=o[U],X=C.color,L=C.intensity,D=C.distance,j=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)l+=X.r*L,c+=X.g*L,h+=X.b*L;else if(C.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(C.sh.coefficients[G],L);w++}else if(C.isDirectionalLight){let G=e.get(C);if(G.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let Q=C.shadow,te=t.get(C);te.shadowIntensity=Q.intensity,te.shadowBias=Q.bias,te.shadowNormalBias=Q.normalBias,te.shadowRadius=Q.radius,te.shadowMapSize=Q.mapSize,n.directionalShadow[u]=te,n.directionalShadowMap[u]=j,n.directionalShadowMatrix[u]=C.shadow.matrix,f++}n.directional[u]=G,u++}else if(C.isSpotLight){let G=e.get(C);G.position.setFromMatrixPosition(C.matrixWorld),G.color.copy(X).multiplyScalar(L),G.distance=D,G.coneCos=Math.cos(C.angle),G.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),G.decay=C.decay,n.spot[p]=G;let Q=C.shadow;if(C.map&&(n.spotLightMap[x]=C.map,x++,Q.updateMatrices(C),C.castShadow&&y++),n.spotLightMatrix[p]=Q.matrix,C.castShadow){let te=t.get(C);te.shadowIntensity=Q.intensity,te.shadowBias=Q.bias,te.shadowNormalBias=Q.normalBias,te.shadowRadius=Q.radius,te.shadowMapSize=Q.mapSize,n.spotShadow[p]=te,n.spotShadowMap[p]=j,v++}p++}else if(C.isRectAreaLight){let G=e.get(C);G.color.copy(X).multiplyScalar(L),G.halfWidth.set(.5*C.width,0,0),G.halfHeight.set(0,.5*C.height,0),n.rectArea[m]=G,m++}else if(C.isPointLight){let G=e.get(C);if(G.color.copy(C.color).multiplyScalar(C.intensity),G.distance=C.distance,G.decay=C.decay,C.castShadow){let Q=C.shadow,te=t.get(C);te.shadowIntensity=Q.intensity,te.shadowBias=Q.bias,te.shadowNormalBias=Q.normalBias,te.shadowRadius=Q.radius,te.shadowMapSize=Q.mapSize,te.shadowCameraNear=Q.camera.near,te.shadowCameraFar=Q.camera.far,n.pointShadow[d]=te,n.pointShadowMap[d]=j,n.pointShadowMatrix[d]=C.shadow.matrix,g++}n.point[d]=G,d++}else if(C.isHemisphereLight){let G=e.get(C);G.skyColor.copy(C.color).multiplyScalar(L),G.groundColor.copy(C.groundColor).multiplyScalar(L),n.hemi[_]=G,_++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Te.LTC_FLOAT_1,n.rectAreaLTC2=Te.LTC_FLOAT_2):(n.rectAreaLTC1=Te.LTC_HALF_1,n.rectAreaLTC2=Te.LTC_HALF_2)),n.ambient[0]=l,n.ambient[1]=c,n.ambient[2]=h;let E=n.hash;E.directionalLength===u&&E.pointLength===d&&E.spotLength===p&&E.rectAreaLength===m&&E.hemiLength===_&&E.numDirectionalShadows===f&&E.numPointShadows===g&&E.numSpotShadows===v&&E.numSpotMaps===x&&E.numLightProbes===w||(n.directional.length=u,n.spot.length=p,n.rectArea.length=m,n.point.length=d,n.hemi.length=_,n.directionalShadow.length=f,n.directionalShadowMap.length=f,n.pointShadow.length=g,n.pointShadowMap.length=g,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=f,n.pointShadowMatrix.length=g,n.spotLightMatrix.length=v+x-y,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=y,n.numLightProbes=w,E.directionalLength=u,E.pointLength=d,E.spotLength=p,E.rectAreaLength=m,E.hemiLength=_,E.numDirectionalShadows=f,E.numPointShadows=g,E.numSpotShadows=v,E.numSpotMaps=x,E.numLightProbes=w,n.version=Ud++)},setupView:function(o,l){let c=0,h=0,u=0,d=0,p=0,m=l.matrixWorldInverse;for(let _=0,f=o.length;_<f;_++){let g=o[_];if(g.isDirectionalLight){let v=n.directional[c];v.direction.setFromMatrixPosition(g.matrixWorld),i.setFromMatrixPosition(g.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),c++}else if(g.isSpotLight){let v=n.spot[u];v.position.setFromMatrixPosition(g.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(g.matrixWorld),i.setFromMatrixPosition(g.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),u++}else if(g.isRectAreaLight){let v=n.rectArea[d];v.position.setFromMatrixPosition(g.matrixWorld),v.position.applyMatrix4(m),a.identity(),s.copy(g.matrixWorld),s.premultiply(m),a.extractRotation(s),v.halfWidth.set(.5*g.width,0,0),v.halfHeight.set(0,.5*g.height,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),d++}else if(g.isPointLight){let v=n.point[h];v.position.setFromMatrixPosition(g.matrixWorld),v.position.applyMatrix4(m),h++}else if(g.isHemisphereLight){let v=n.hemi[p];v.direction.setFromMatrixPosition(g.matrixWorld),v.direction.transformDirection(m),p++}}},state:n}}function Ac(r){let e=new Od(r),t=[],n=[],i={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:function(s){i.camera=s,t.length=0,n.length=0},state:i,setupLights:function(){e.setup(t)},setupLightsView:function(s){e.setupView(t,s)},pushLight:function(s){t.push(s)},pushShadow:function(s){n.push(s)}}}function Fd(r){let e=new WeakMap;return{get:function(t,n=0){let i=e.get(t),s;return i===void 0?(s=new Ac(r),e.set(t,[s])):n>=i.length?(s=new Ac(r),i.push(s)):s=i[n],s},dispose:function(){e=new WeakMap}}}var No=class extends Ii{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Oo=class extends Ii{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Bd(r,e,t){let n=new kr,i=new me,s=new me,a=new xt,o=new No({depthPacking:3201}),l=new Oo,c={},h=t.maxTextureSize,u={[Th]:1,[vl]:0,[Js]:2},d=new sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new me},radius:{value:4}},vertexShader:`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fragmentShader:`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let m=new mt;m.setAttribute("position",new It(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Pt(m,d),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let g=this.type;function v(E,U){let V=e.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new yn(i.x,i.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,r.setRenderTarget(E.mapPass),r.clear(),r.renderBufferDirect(U,null,V,d,_,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,r.setRenderTarget(E.map),r.clear(),r.renderBufferDirect(U,null,V,p,_,null)}function x(E,U,V,C){let X=null,L=V.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(L!==void 0)X=L;else if(X=V.isPointLight===!0?l:o,r.localClippingEnabled&&U.clipShadows===!0&&Array.isArray(U.clippingPlanes)&&U.clippingPlanes.length!==0||U.displacementMap&&U.displacementScale!==0||U.alphaMap&&U.alphaTest>0||U.map&&U.alphaTest>0){let D=X.uuid,j=U.uuid,G=c[D];G===void 0&&(G={},c[D]=G);let Q=G[j];Q===void 0&&(Q=X.clone(),G[j]=Q,U.addEventListener("dispose",w)),X=Q}return X.visible=U.visible,X.wireframe=U.wireframe,X.side=C===3?U.shadowSide!==null?U.shadowSide:U.side:U.shadowSide!==null?U.shadowSide:u[U.side],X.alphaMap=U.alphaMap,X.alphaTest=U.alphaTest,X.map=U.map,X.clipShadows=U.clipShadows,X.clippingPlanes=U.clippingPlanes,X.clipIntersection=U.clipIntersection,X.displacementMap=U.displacementMap,X.displacementScale=U.displacementScale,X.displacementBias=U.displacementBias,X.wireframeLinewidth=U.wireframeLinewidth,X.linewidth=U.linewidth,V.isPointLight===!0&&X.isMeshDistanceMaterial===!0&&(r.properties.get(X).light=V),X}function y(E,U,V,C,X){if(E.visible===!1)return;if(E.layers.test(U.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&X===3)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,E.matrixWorld);let D=e.update(E),j=E.material;if(Array.isArray(j)){let G=D.groups;for(let Q=0,te=G.length;Q<te;Q++){let S=G[Q],I=j[S.materialIndex];if(I&&I.visible){let O=x(E,I,C,X);E.onBeforeShadow(r,E,U,V,D,O,S),r.renderBufferDirect(V,null,D,O,E,S),E.onAfterShadow(r,E,U,V,D,O,S)}}}else if(j.visible){let G=x(E,j,C,X);E.onBeforeShadow(r,E,U,V,D,G,null),r.renderBufferDirect(V,null,D,G,E,null),E.onAfterShadow(r,E,U,V,D,G,null)}}let L=E.children;for(let D=0,j=L.length;D<j;D++)y(L[D],U,V,C,X)}function w(E){E.target.removeEventListener("dispose",w);for(let U in c){let V=c[U],C=E.target.uuid;C in V&&(V[C].dispose(),delete V[C])}}this.render=function(E,U,V){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||E.length===0)return;let C=r.getRenderTarget(),X=r.getActiveCubeFace(),L=r.getActiveMipmapLevel(),D=r.state;D.setBlending(0),D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let j=g!==3&&this.type===3,G=g===3&&this.type!==3;for(let Q=0,te=E.length;Q<te;Q++){let S=E[Q],I=S.shadow;if(I===void 0){console.warn("THREE.WebGLShadowMap:",S,"has no shadow.");continue}if(I.autoUpdate===!1&&I.needsUpdate===!1)continue;i.copy(I.mapSize);let O=I.getFrameExtents();if(i.multiply(O),s.copy(I.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/O.x),i.x=s.x*O.x,I.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/O.y),i.y=s.y*O.y,I.mapSize.y=s.y)),I.map===null||j===!0||G===!0){let W=this.type!==3?{minFilter:Rn,magFilter:Rn}:{};I.map!==null&&I.map.dispose(),I.map=new yn(i.x,i.y,W),I.map.texture.name=S.name+".shadowMap",I.camera.updateProjectionMatrix()}r.setRenderTarget(I.map),r.clear();let H=I.getViewportCount();for(let W=0;W<H;W++){let Z=I.getViewport(W);a.set(s.x*Z.x,s.y*Z.y,s.x*Z.z,s.y*Z.w),D.viewport(a),I.updateMatrices(S,W),n=I.getFrustum(),y(U,V,I.camera,S,this.type)}I.isPointLightShadow!==!0&&this.type===3&&v(I,V),I.needsUpdate=!1}g=this.type,f.needsUpdate=!1,r.setRenderTarget(C,X,L)}}var zd={[zh]:1,[Hh]:6,[Gh]:7,[Vh]:5,[kh]:0,[jh]:2,[Xh]:4,[Wh]:3};function kd(r,e){let t=new function(){let M=!1,z=new xt,q=null,ce=new xt(0,0,0,0);return{setMask:function(Y){q===Y||M||(r.colorMask(Y,Y,Y,Y),q=Y)},setLocked:function(Y){M=Y},setClear:function(Y,oe,ae,pe,fe){fe===!0&&(Y*=pe,oe*=pe,ae*=pe),z.set(Y,oe,ae,pe),ce.equals(z)===!1&&(r.clearColor(Y,oe,ae,pe),ce.copy(z))},reset:function(){M=!1,q=null,ce.set(-1,0,0,0)}}},n=new function(){let M=!1,z=!1,q=null,ce=null,Y=null;return{setReversed:function(oe){if(z!==oe){let ae=e.get("EXT_clip_control");z?ae.clipControlEXT(ae.LOWER_LEFT_EXT,ae.ZERO_TO_ONE_EXT):ae.clipControlEXT(ae.LOWER_LEFT_EXT,ae.NEGATIVE_ONE_TO_ONE_EXT);let pe=Y;Y=null,this.setClear(pe)}z=oe},getReversed:function(){return z},setTest:function(oe){oe?re(r.DEPTH_TEST):ie(r.DEPTH_TEST)},setMask:function(oe){q===oe||M||(r.depthMask(oe),q=oe)},setFunc:function(oe){if(z&&(oe=zd[oe]),ce!==oe){switch(oe){case 0:r.depthFunc(r.NEVER);break;case 1:r.depthFunc(r.ALWAYS);break;case 2:r.depthFunc(r.LESS);break;case 3:default:r.depthFunc(r.LEQUAL);break;case 4:r.depthFunc(r.EQUAL);break;case 5:r.depthFunc(r.GEQUAL);break;case 6:r.depthFunc(r.GREATER);break;case 7:r.depthFunc(r.NOTEQUAL)}ce=oe}},setLocked:function(oe){M=oe},setClear:function(oe){Y!==oe&&(z&&(oe=1-oe),r.clearDepth(oe),Y=oe)},reset:function(){M=!1,q=null,ce=null,Y=null,z=!1}}},i=new function(){let M=!1,z=null,q=null,ce=null,Y=null,oe=null,ae=null,pe=null,fe=null;return{setTest:function(Ee){M||(Ee?re(r.STENCIL_TEST):ie(r.STENCIL_TEST))},setMask:function(Ee){z===Ee||M||(r.stencilMask(Ee),z=Ee)},setFunc:function(Ee,Ce,we){q===Ee&&ce===Ce&&Y===we||(r.stencilFunc(Ee,Ce,we),q=Ee,ce=Ce,Y=we)},setOp:function(Ee,Ce,we){oe===Ee&&ae===Ce&&pe===we||(r.stencilOp(Ee,Ce,we),oe=Ee,ae=Ce,pe=we)},setLocked:function(Ee){M=Ee},setClear:function(Ee){fe!==Ee&&(r.clearStencil(Ee),fe=Ee)},reset:function(){M=!1,z=null,q=null,ce=null,Y=null,oe=null,ae=null,pe=null,fe=null}}},s=new WeakMap,a=new WeakMap,o={},l={},c=new WeakMap,h=[],u=null,d=!1,p=null,m=null,_=null,f=null,g=null,v=null,x=null,y=new qe(0,0,0),w=0,E=!1,U=null,V=null,C=null,X=null,L=null,D=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),j=!1,G=0,Q=r.getParameter(r.VERSION);Q.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(Q)[1]),j=G>=1):Q.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),j=G>=2);let te=null,S={},I=r.getParameter(r.SCISSOR_BOX),O=r.getParameter(r.VIEWPORT),H=new xt().fromArray(I),W=new xt().fromArray(O);function Z(M,z,q,ce){let Y=new Uint8Array(4),oe=r.createTexture();r.bindTexture(M,oe),r.texParameteri(M,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(M,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let ae=0;ae<q;ae++)M===r.TEXTURE_3D||M===r.TEXTURE_2D_ARRAY?r.texImage3D(z,0,r.RGBA,1,1,ce,0,r.RGBA,r.UNSIGNED_BYTE,Y):r.texImage2D(z+ae,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Y);return oe}let le={};function re(M){o[M]!==!0&&(r.enable(M),o[M]=!0)}function ie(M){o[M]!==!1&&(r.disable(M),o[M]=!1)}le[r.TEXTURE_2D]=Z(r.TEXTURE_2D,r.TEXTURE_2D,1),le[r.TEXTURE_CUBE_MAP]=Z(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[r.TEXTURE_2D_ARRAY]=Z(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),le[r.TEXTURE_3D]=Z(r.TEXTURE_3D,r.TEXTURE_3D,1,1),t.setClear(0,0,0,1),n.setClear(1),i.setClear(0),re(r.DEPTH_TEST),n.setFunc(3),k(!1),P(1),re(r.CULL_FACE),F(0);let T={[Ai]:r.FUNC_ADD,[Eh]:r.FUNC_SUBTRACT,[wh]:r.FUNC_REVERSE_SUBTRACT};T[103]=r.MIN,T[104]=r.MAX;let b={[Ah]:r.ZERO,[Ks]:r.ONE,[Rh]:r.SRC_COLOR,[Ga]:r.SRC_ALPHA,[Uh]:r.SRC_ALPHA_SATURATE,[Lh]:r.DST_COLOR,[Ph]:r.DST_ALPHA,[Ch]:r.ONE_MINUS_SRC_COLOR,[Wa]:r.ONE_MINUS_SRC_ALPHA,[Dh]:r.ONE_MINUS_DST_COLOR,[Ih]:r.ONE_MINUS_DST_ALPHA,[Nh]:r.CONSTANT_COLOR,[Oh]:r.ONE_MINUS_CONSTANT_COLOR,[Fh]:r.CONSTANT_ALPHA,[Bh]:r.ONE_MINUS_CONSTANT_ALPHA};function F(M,z,q,ce,Y,oe,ae,pe,fe,Ee){if(M!==0){if(d===!1&&(re(r.BLEND),d=!0),M===5)Y=Y||z,oe=oe||q,ae=ae||ce,z===m&&Y===g||(r.blendEquationSeparate(T[z],T[Y]),m=z,g=Y),q===_&&ce===f&&oe===v&&ae===x||(r.blendFuncSeparate(b[q],b[ce],b[oe],b[ae]),_=q,f=ce,v=oe,x=ae),pe.equals(y)!==!1&&fe===w||(r.blendColor(pe.r,pe.g,pe.b,fe),y.copy(pe),w=fe),p=M,E=!1;else if(M!==p||Ee!==E){if(m===Ai&&g===Ai||(r.blendEquation(r.FUNC_ADD),m=Ai,g=Ai),Ee)switch(M){case 1:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.ONE,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",M)}else switch(M){case 1:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",M)}_=null,f=null,v=null,x=null,y.set(0,0,0),w=0,p=M,E=Ee}}else d===!0&&(ie(r.BLEND),d=!1)}function k(M){U!==M&&(M?r.frontFace(r.CW):r.frontFace(r.CCW),U=M)}function P(M){M!==0?(re(r.CULL_FACE),M!==V&&(M===1?r.cullFace(r.BACK):M===2?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):ie(r.CULL_FACE),V=M}function B(M,z,q){M?(re(r.POLYGON_OFFSET_FILL),X===z&&L===q||(r.polygonOffset(z,q),X=z,L=q)):ie(r.POLYGON_OFFSET_FILL)}return{buffers:{color:t,depth:n,stencil:i},enable:re,disable:ie,bindFramebuffer:function(M,z){return l[M]!==z&&(r.bindFramebuffer(M,z),l[M]=z,M===r.DRAW_FRAMEBUFFER&&(l[r.FRAMEBUFFER]=z),M===r.FRAMEBUFFER&&(l[r.DRAW_FRAMEBUFFER]=z),!0)},drawBuffers:function(M,z){let q=h,ce=!1;if(M){q=c.get(z),q===void 0&&(q=[],c.set(z,q));let Y=M.textures;if(q.length!==Y.length||q[0]!==r.COLOR_ATTACHMENT0){for(let oe=0,ae=Y.length;oe<ae;oe++)q[oe]=r.COLOR_ATTACHMENT0+oe;q.length=Y.length,ce=!0}}else q[0]!==r.BACK&&(q[0]=r.BACK,ce=!0);ce&&r.drawBuffers(q)},useProgram:function(M){return u!==M&&(r.useProgram(M),u=M,!0)},setBlending:F,setMaterial:function(M,z){M.side===2?ie(r.CULL_FACE):re(r.CULL_FACE);let q=M.side===1;z&&(q=!q),k(q),M.blending===1&&M.transparent===!1?F(0):F(M.blending,M.blendEquation,M.blendSrc,M.blendDst,M.blendEquationAlpha,M.blendSrcAlpha,M.blendDstAlpha,M.blendColor,M.blendAlpha,M.premultipliedAlpha),n.setFunc(M.depthFunc),n.setTest(M.depthTest),n.setMask(M.depthWrite),t.setMask(M.colorWrite);let ce=M.stencilWrite;i.setTest(ce),ce&&(i.setMask(M.stencilWriteMask),i.setFunc(M.stencilFunc,M.stencilRef,M.stencilFuncMask),i.setOp(M.stencilFail,M.stencilZFail,M.stencilZPass)),B(M.polygonOffset,M.polygonOffsetFactor,M.polygonOffsetUnits),M.alphaToCoverage===!0?re(r.SAMPLE_ALPHA_TO_COVERAGE):ie(r.SAMPLE_ALPHA_TO_COVERAGE)},setFlipSided:k,setCullFace:P,setLineWidth:function(M){M!==C&&(j&&r.lineWidth(M),C=M)},setPolygonOffset:B,setScissorTest:function(M){M?re(r.SCISSOR_TEST):ie(r.SCISSOR_TEST)},activeTexture:function(M){M===void 0&&(M=r.TEXTURE0+D-1),te!==M&&(r.activeTexture(M),te=M)},bindTexture:function(M,z,q){q===void 0&&(q=te===null?r.TEXTURE0+D-1:te);let ce=S[q];ce===void 0&&(ce={type:void 0,texture:void 0},S[q]=ce),ce.type===M&&ce.texture===z||(te!==q&&(r.activeTexture(q),te=q),r.bindTexture(M,z||le[M]),ce.type=M,ce.texture=z)},unbindTexture:function(){let M=S[te];M!==void 0&&M.type!==void 0&&(r.bindTexture(M.type,null),M.type=void 0,M.texture=void 0)},compressedTexImage2D:function(){try{r.compressedTexImage2D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},compressedTexImage3D:function(){try{r.compressedTexImage3D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texImage2D:function(){try{r.texImage2D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texImage3D:function(){try{r.texImage3D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},updateUBOMapping:function(M,z){let q=a.get(z);q===void 0&&(q=new WeakMap,a.set(z,q));let ce=q.get(M);ce===void 0&&(ce=r.getUniformBlockIndex(z,M.name),q.set(M,ce))},uniformBlockBinding:function(M,z){let q=a.get(z).get(M);s.get(z)!==q&&(r.uniformBlockBinding(z,q,M.__bindingPointIndex),s.set(z,q))},texStorage2D:function(){try{r.texStorage2D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texStorage3D:function(){try{r.texStorage3D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texSubImage2D:function(){try{r.texSubImage2D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},texSubImage3D:function(){try{r.texSubImage3D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},compressedTexSubImage2D:function(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},compressedTexSubImage3D:function(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(M){console.error("THREE.WebGLState:",M)}},scissor:function(M){H.equals(M)===!1&&(r.scissor(M.x,M.y,M.z,M.w),H.copy(M))},viewport:function(M){W.equals(M)===!1&&(r.viewport(M.x,M.y,M.z,M.w),W.copy(M))},reset:function(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),n.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),o={},te=null,S={},l={},c=new WeakMap,h=[],u=null,d=!1,p=null,m=null,_=null,f=null,g=null,v=null,x=null,y=new qe(0,0,0),w=0,E=!1,U=null,V=null,C=null,X=null,L=null,H.set(0,0,r.canvas.width,r.canvas.height),W.set(0,0,r.canvas.width,r.canvas.height),t.reset(),n.reset(),i.reset()}}}function Rc(r,e,t,n){let i=(function(s){switch(s){case li:case Gc:return{byteLength:1,components:1};case Or:case Wc:case Yr:return{byteLength:2,components:1};case xl:case yl:return{byteLength:2,components:4};case Pi:case _l:case Jn:return{byteLength:4,components:1};case jc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)})(n);switch(t){case Xc:case Yc:return r*e;case Zc:return r*e*2;case Jc:case Ml:return r*e/i.components*i.byteLength;case Kc:case bl:return r*e*2/i.components*i.byteLength;case qc:return r*e*3/i.components*i.byteLength;case Nn:case Sl:return r*e*4/i.components*i.byteLength;case Ss:case Ts:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Es:case ws:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Ja:case $a:return Math.max(r,16)*Math.max(e,8)/4;case Za:case Ka:return Math.max(r,8)*Math.max(e,8)/2;case Qa:case eo:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case to:case no:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case io:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case ro:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case so:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case ao:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case oo:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case lo:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case co:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case ho:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case uo:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case po:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case fo:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case mo:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case go:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case As:case vo:case _o:return Math.ceil(r/4)*Math.ceil(e/4)*16;case $c:case xo:return Math.ceil(r/4)*Math.ceil(e/4)*8;case yo:case Mo:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Hd(r,e,t,n,i,s,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator<"u"&&/OculusBrowser/g.test(navigator.userAgent),c=new me,h=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(T,b){return p?new OffscreenCanvas(T,b):Ps("canvas")}function _(T,b,F){let k=1,P=ie(T);if((P.width>F||P.height>F)&&(k=F/Math.max(P.width,P.height)),k<1){if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let B=Math.floor(k*P.width),M=Math.floor(k*P.height);u===void 0&&(u=m(B,M));let z=b?m(B,M):u;return z.width=B,z.height=M,z.getContext("2d").drawImage(T,0,0,B,M),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+P.width+"x"+P.height+") to ("+B+"x"+M+")."),z}return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+P.width+"x"+P.height+")."),T}return T}function f(T){return T.generateMipmaps}function g(T){r.generateMipmap(T)}function v(T){return T.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?r.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function x(T,b,F,k,P=!1){if(T!==null){if(r[T]!==void 0)return r[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let B=b;if(b===r.RED&&(F===r.FLOAT&&(B=r.R32F),F===r.HALF_FLOAT&&(B=r.R16F),F===r.UNSIGNED_BYTE&&(B=r.R8)),b===r.RED_INTEGER&&(F===r.UNSIGNED_BYTE&&(B=r.R8UI),F===r.UNSIGNED_SHORT&&(B=r.R16UI),F===r.UNSIGNED_INT&&(B=r.R32UI),F===r.BYTE&&(B=r.R8I),F===r.SHORT&&(B=r.R16I),F===r.INT&&(B=r.R32I)),b===r.RG&&(F===r.FLOAT&&(B=r.RG32F),F===r.HALF_FLOAT&&(B=r.RG16F),F===r.UNSIGNED_BYTE&&(B=r.RG8)),b===r.RG_INTEGER&&(F===r.UNSIGNED_BYTE&&(B=r.RG8UI),F===r.UNSIGNED_SHORT&&(B=r.RG16UI),F===r.UNSIGNED_INT&&(B=r.RG32UI),F===r.BYTE&&(B=r.RG8I),F===r.SHORT&&(B=r.RG16I),F===r.INT&&(B=r.RG32I)),b===r.RGB_INTEGER&&(F===r.UNSIGNED_BYTE&&(B=r.RGB8UI),F===r.UNSIGNED_SHORT&&(B=r.RGB16UI),F===r.UNSIGNED_INT&&(B=r.RGB32UI),F===r.BYTE&&(B=r.RGB8I),F===r.SHORT&&(B=r.RGB16I),F===r.INT&&(B=r.RGB32I)),b===r.RGBA_INTEGER&&(F===r.UNSIGNED_BYTE&&(B=r.RGBA8UI),F===r.UNSIGNED_SHORT&&(B=r.RGBA16UI),F===r.UNSIGNED_INT&&(B=r.RGBA32UI),F===r.BYTE&&(B=r.RGBA8I),F===r.SHORT&&(B=r.RGBA16I),F===r.INT&&(B=r.RGBA32I)),b===r.RGB&&F===r.UNSIGNED_INT_5_9_9_9_REV&&(B=r.RGB9_E5),b===r.RGBA){let M=P?Qs:lt.getTransfer(k);F===r.FLOAT&&(B=r.RGBA32F),F===r.HALF_FLOAT&&(B=r.RGBA16F),F===r.UNSIGNED_BYTE&&(B=M===ft?r.SRGB8_ALPHA8:r.RGBA8),F===r.UNSIGNED_SHORT_4_4_4_4&&(B=r.RGBA4),F===r.UNSIGNED_SHORT_5_5_5_1&&(B=r.RGB5_A1)}return B!==r.R16F&&B!==r.R32F&&B!==r.RG16F&&B!==r.RG32F&&B!==r.RGBA16F&&B!==r.RGBA32F||e.get("EXT_color_buffer_float"),B}function y(T,b){let F;return T?b===null||b===Pi||b===or?F=r.DEPTH24_STENCIL8:b===Jn?F=r.DEPTH32F_STENCIL8:b===Or&&(F=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Pi||b===or?F=r.DEPTH_COMPONENT24:b===Jn?F=r.DEPTH_COMPONENT32F:b===Or&&(F=r.DEPTH_COMPONENT16),F}function w(T,b){return f(T)===!0||T.isFramebufferTexture&&T.minFilter!==Rn&&T.minFilter!==Zn?Math.log2(Math.max(b.width,b.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?b.mipmaps.length:1}function E(T){let b=T.target;b.removeEventListener("dispose",E),(function(F){let k=n.get(F);if(k.__webglInit===void 0)return;let P=F.source,B=d.get(P);if(B){let M=B[k.__cacheKey];M.usedTimes--,M.usedTimes===0&&V(F),Object.keys(B).length===0&&d.delete(P)}n.remove(F)})(b),b.isVideoTexture&&h.delete(b)}function U(T){let b=T.target;b.removeEventListener("dispose",U),(function(F){let k=n.get(F);if(F.depthTexture&&(F.depthTexture.dispose(),n.remove(F.depthTexture)),F.isWebGLCubeRenderTarget)for(let B=0;B<6;B++){if(Array.isArray(k.__webglFramebuffer[B]))for(let M=0;M<k.__webglFramebuffer[B].length;M++)r.deleteFramebuffer(k.__webglFramebuffer[B][M]);else r.deleteFramebuffer(k.__webglFramebuffer[B]);k.__webglDepthbuffer&&r.deleteRenderbuffer(k.__webglDepthbuffer[B])}else{if(Array.isArray(k.__webglFramebuffer))for(let B=0;B<k.__webglFramebuffer.length;B++)r.deleteFramebuffer(k.__webglFramebuffer[B]);else r.deleteFramebuffer(k.__webglFramebuffer);if(k.__webglDepthbuffer&&r.deleteRenderbuffer(k.__webglDepthbuffer),k.__webglMultisampledFramebuffer&&r.deleteFramebuffer(k.__webglMultisampledFramebuffer),k.__webglColorRenderbuffer)for(let B=0;B<k.__webglColorRenderbuffer.length;B++)k.__webglColorRenderbuffer[B]&&r.deleteRenderbuffer(k.__webglColorRenderbuffer[B]);k.__webglDepthRenderbuffer&&r.deleteRenderbuffer(k.__webglDepthRenderbuffer)}let P=F.textures;for(let B=0,M=P.length;B<M;B++){let z=n.get(P[B]);z.__webglTexture&&(r.deleteTexture(z.__webglTexture),a.memory.textures--),n.remove(P[B])}n.remove(F)})(b)}function V(T){let b=n.get(T);r.deleteTexture(b.__webglTexture);let F=T.source;delete d.get(F)[b.__cacheKey],a.memory.textures--}let C=0;function X(T,b){let F=n.get(T);if(T.isVideoTexture&&(function(k){let P=a.render.frame;h.get(k)!==P&&(h.set(k,P),k.update())})(T),T.isRenderTargetTexture===!1&&T.version>0&&F.__version!==T.version){let k=T.image;if(k===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else{if(k.complete!==!1)return void te(F,T,b);console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete")}}t.bindTexture(r.TEXTURE_2D,F.__webglTexture,r.TEXTURE0+b)}let L={[qa]:r.REPEAT,[Nr]:r.CLAMP_TO_EDGE,[Ya]:r.MIRRORED_REPEAT},D={[Rn]:r.NEAREST,[qh]:r.NEAREST_MIPMAP_NEAREST,[Zr]:r.NEAREST_MIPMAP_LINEAR,[Zn]:r.LINEAR,[ha]:r.LINEAR_MIPMAP_NEAREST,[er]:r.LINEAR_MIPMAP_LINEAR},j={[Yh]:r.NEVER,[tu]:r.ALWAYS,[Zh]:r.LESS,[Kh]:r.LEQUAL,[Jh]:r.EQUAL,[eu]:r.GEQUAL,[$h]:r.GREATER,[Qh]:r.NOTEQUAL};function G(T,b){if(b.type!==Jn||e.has("OES_texture_float_linear")!==!1||b.magFilter!==Zn&&b.magFilter!==ha&&b.magFilter!==Zr&&b.magFilter!==er&&b.minFilter!==Zn&&b.minFilter!==ha&&b.minFilter!==Zr&&b.minFilter!==er||console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(T,r.TEXTURE_WRAP_S,L[b.wrapS]),r.texParameteri(T,r.TEXTURE_WRAP_T,L[b.wrapT]),T!==r.TEXTURE_3D&&T!==r.TEXTURE_2D_ARRAY||r.texParameteri(T,r.TEXTURE_WRAP_R,L[b.wrapR]),r.texParameteri(T,r.TEXTURE_MAG_FILTER,D[b.magFilter]),r.texParameteri(T,r.TEXTURE_MIN_FILTER,D[b.minFilter]),b.compareFunction&&(r.texParameteri(T,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(T,r.TEXTURE_COMPARE_FUNC,j[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Rn||b.minFilter!==Zr&&b.minFilter!==er||b.type===Jn&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){let F=e.get("EXT_texture_filter_anisotropic");r.texParameterf(T,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,i.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function Q(T,b){let F=!1;T.__webglInit===void 0&&(T.__webglInit=!0,b.addEventListener("dispose",E));let k=b.source,P=d.get(k);P===void 0&&(P={},d.set(k,P));let B=(function(M){let z=[];return z.push(M.wrapS),z.push(M.wrapT),z.push(M.wrapR||0),z.push(M.magFilter),z.push(M.minFilter),z.push(M.anisotropy),z.push(M.internalFormat),z.push(M.format),z.push(M.type),z.push(M.generateMipmaps),z.push(M.premultiplyAlpha),z.push(M.flipY),z.push(M.unpackAlignment),z.push(M.colorSpace),z.join()})(b);if(B!==T.__cacheKey){P[B]===void 0&&(P[B]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,F=!0),P[B].usedTimes++;let M=P[T.__cacheKey];M!==void 0&&(P[T.__cacheKey].usedTimes--,M.usedTimes===0&&V(b)),T.__cacheKey=B,T.__webglTexture=P[B].texture}return F}function te(T,b,F){let k=r.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(k=r.TEXTURE_2D_ARRAY),b.isData3DTexture&&(k=r.TEXTURE_3D);let P=Q(T,b),B=b.source;t.bindTexture(k,T.__webglTexture,r.TEXTURE0+F);let M=n.get(B);if(B.version!==M.__version||P===!0){t.activeTexture(r.TEXTURE0+F);let z=lt.getPrimaries(lt.workingColorSpace),q=b.colorSpace===$i?null:lt.getPrimaries(b.colorSpace),ce=b.colorSpace===$i||z===q?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,b.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,b.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce);let Y=_(b.image,!1,i.maxTextureSize);Y=re(b,Y);let oe=s.convert(b.format,b.colorSpace),ae=s.convert(b.type),pe,fe=x(b.internalFormat,oe,ae,b.colorSpace,b.isVideoTexture);G(k,b);let Ee=b.mipmaps,Ce=b.isVideoTexture!==!0,we=M.__version===void 0||P===!0,nt=B.dataReady,Ve=w(b,Y);if(b.isDepthTexture)fe=y(b.format===lr,b.type),we&&(Ce?t.texStorage2D(r.TEXTURE_2D,1,fe,Y.width,Y.height):t.texImage2D(r.TEXTURE_2D,0,fe,Y.width,Y.height,0,oe,ae,null));else if(b.isDataTexture)if(Ee.length>0){Ce&&we&&t.texStorage2D(r.TEXTURE_2D,Ve,fe,Ee[0].width,Ee[0].height);for(let Le=0,et=Ee.length;Le<et;Le++)pe=Ee[Le],Ce?nt&&t.texSubImage2D(r.TEXTURE_2D,Le,0,0,pe.width,pe.height,oe,ae,pe.data):t.texImage2D(r.TEXTURE_2D,Le,fe,pe.width,pe.height,0,oe,ae,pe.data);b.generateMipmaps=!1}else Ce?(we&&t.texStorage2D(r.TEXTURE_2D,Ve,fe,Y.width,Y.height),nt&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,Y.width,Y.height,oe,ae,Y.data)):t.texImage2D(r.TEXTURE_2D,0,fe,Y.width,Y.height,0,oe,ae,Y.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Ce&&we&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Ve,fe,Ee[0].width,Ee[0].height,Y.depth);for(let Le=0,et=Ee.length;Le<et;Le++)if(pe=Ee[Le],b.format!==Nn)if(oe!==null)if(Ce){if(nt)if(b.layerUpdates.size>0){let at=Rc(pe.width,pe.height,b.format,b.type);for(let st of b.layerUpdates){let Re=pe.data.subarray(st*at/pe.data.BYTES_PER_ELEMENT,(st+1)*at/pe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Le,0,0,st,pe.width,pe.height,1,oe,Re)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Le,0,0,0,pe.width,pe.height,Y.depth,oe,pe.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Le,fe,pe.width,pe.height,Y.depth,0,pe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ce?nt&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,Le,0,0,0,pe.width,pe.height,Y.depth,oe,ae,pe.data):t.texImage3D(r.TEXTURE_2D_ARRAY,Le,fe,pe.width,pe.height,Y.depth,0,oe,ae,pe.data)}else{Ce&&we&&t.texStorage2D(r.TEXTURE_2D,Ve,fe,Ee[0].width,Ee[0].height);for(let Le=0,et=Ee.length;Le<et;Le++)pe=Ee[Le],b.format!==Nn?oe!==null?Ce?nt&&t.compressedTexSubImage2D(r.TEXTURE_2D,Le,0,0,pe.width,pe.height,oe,pe.data):t.compressedTexImage2D(r.TEXTURE_2D,Le,fe,pe.width,pe.height,0,pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ce?nt&&t.texSubImage2D(r.TEXTURE_2D,Le,0,0,pe.width,pe.height,oe,ae,pe.data):t.texImage2D(r.TEXTURE_2D,Le,fe,pe.width,pe.height,0,oe,ae,pe.data)}else if(b.isDataArrayTexture)if(Ce){if(we&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Ve,fe,Y.width,Y.height,Y.depth),nt)if(b.layerUpdates.size>0){let Le=Rc(Y.width,Y.height,b.format,b.type);for(let et of b.layerUpdates){let at=Y.data.subarray(et*Le/Y.data.BYTES_PER_ELEMENT,(et+1)*Le/Y.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,et,Y.width,Y.height,1,oe,ae,at)}b.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Y.width,Y.height,Y.depth,oe,ae,Y.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,fe,Y.width,Y.height,Y.depth,0,oe,ae,Y.data);else if(b.isData3DTexture)Ce?(we&&t.texStorage3D(r.TEXTURE_3D,Ve,fe,Y.width,Y.height,Y.depth),nt&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Y.width,Y.height,Y.depth,oe,ae,Y.data)):t.texImage3D(r.TEXTURE_3D,0,fe,Y.width,Y.height,Y.depth,0,oe,ae,Y.data);else if(b.isFramebufferTexture){if(we)if(Ce)t.texStorage2D(r.TEXTURE_2D,Ve,fe,Y.width,Y.height);else{let Le=Y.width,et=Y.height;for(let at=0;at<Ve;at++)t.texImage2D(r.TEXTURE_2D,at,fe,Le,et,0,oe,ae,null),Le>>=1,et>>=1}}else if(Ee.length>0){if(Ce&&we){let Le=ie(Ee[0]);t.texStorage2D(r.TEXTURE_2D,Ve,fe,Le.width,Le.height)}for(let Le=0,et=Ee.length;Le<et;Le++)pe=Ee[Le],Ce?nt&&t.texSubImage2D(r.TEXTURE_2D,Le,0,0,oe,ae,pe):t.texImage2D(r.TEXTURE_2D,Le,fe,oe,ae,pe);b.generateMipmaps=!1}else if(Ce){if(we){let Le=ie(Y);t.texStorage2D(r.TEXTURE_2D,Ve,fe,Le.width,Le.height)}nt&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,oe,ae,Y)}else t.texImage2D(r.TEXTURE_2D,0,fe,oe,ae,Y);f(b)&&g(k),M.__version=B.version,b.onUpdate&&b.onUpdate(b)}T.__version=b.version}function S(T,b,F,k,P,B){let M=s.convert(F.format,F.colorSpace),z=s.convert(F.type),q=x(F.internalFormat,M,z,F.colorSpace),ce=n.get(b),Y=n.get(F);if(Y.__renderTarget=b,!ce.__hasExternalTextures){let oe=Math.max(1,b.width>>B),ae=Math.max(1,b.height>>B);P===r.TEXTURE_3D||P===r.TEXTURE_2D_ARRAY?t.texImage3D(P,B,q,oe,ae,b.depth,0,M,z,null):t.texImage2D(P,B,q,oe,ae,0,M,z,null)}t.bindFramebuffer(r.FRAMEBUFFER,T),le(b)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,k,P,Y.__webglTexture,0,Z(b)):(P===r.TEXTURE_2D||P>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&P<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,k,P,Y.__webglTexture,B),t.bindFramebuffer(r.FRAMEBUFFER,null)}function I(T,b,F){if(r.bindRenderbuffer(r.RENDERBUFFER,T),b.depthBuffer){let k=b.depthTexture,P=k&&k.isDepthTexture?k.type:null,B=y(b.stencilBuffer,P),M=b.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,z=Z(b);le(b)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,z,B,b.width,b.height):F?r.renderbufferStorageMultisample(r.RENDERBUFFER,z,B,b.width,b.height):r.renderbufferStorage(r.RENDERBUFFER,B,b.width,b.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,M,r.RENDERBUFFER,T)}else{let k=b.textures;for(let P=0;P<k.length;P++){let B=k[P],M=s.convert(B.format,B.colorSpace),z=s.convert(B.type),q=x(B.internalFormat,M,z,B.colorSpace),ce=Z(b);F&&le(b)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,ce,q,b.width,b.height):le(b)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ce,q,b.width,b.height):r.renderbufferStorage(r.RENDERBUFFER,q,b.width,b.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function O(T){let b=n.get(T),F=T.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==T.depthTexture){let k=T.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),k){let P=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,k.removeEventListener("dispose",P)};k.addEventListener("dispose",P),b.__depthDisposeCallback=P}b.__boundDepthTexture=k}if(T.depthTexture&&!b.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");(function(k,P){if(P&&P.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,k),!P.depthTexture||!P.depthTexture.isDepthTexture)throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let B=n.get(P.depthTexture);B.__renderTarget=P,B.__webglTexture&&P.depthTexture.image.width===P.width&&P.depthTexture.image.height===P.height||(P.depthTexture.image.width=P.width,P.depthTexture.image.height=P.height,P.depthTexture.needsUpdate=!0),X(P.depthTexture,0);let M=B.__webglTexture,z=Z(P);if(P.depthTexture.format===Fr)le(P)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,M,0,z):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,M,0);else{if(P.depthTexture.format!==lr)throw new Error("Unknown depthTexture format");le(P)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,M,0,z):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,M,0)}})(b.__webglFramebuffer,T)}else if(F){b.__webglDepthbuffer=[];for(let k=0;k<6;k++)if(t.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer[k]),b.__webglDepthbuffer[k]===void 0)b.__webglDepthbuffer[k]=r.createRenderbuffer(),I(b.__webglDepthbuffer[k],T,!1);else{let P=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,B=b.__webglDepthbuffer[k];r.bindRenderbuffer(r.RENDERBUFFER,B),r.framebufferRenderbuffer(r.FRAMEBUFFER,P,r.RENDERBUFFER,B)}}else if(t.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=r.createRenderbuffer(),I(b.__webglDepthbuffer,T,!1);else{let k=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,P=b.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,P),r.framebufferRenderbuffer(r.FRAMEBUFFER,k,r.RENDERBUFFER,P)}t.bindFramebuffer(r.FRAMEBUFFER,null)}let H=[],W=[];function Z(T){return Math.min(i.maxSamples,T.samples)}function le(T){let b=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function re(T,b){let F=T.colorSpace,k=T.format,P=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||F!==vr&&F!==$i&&(lt.getTransfer(F)===ft?k===Nn&&P===li||console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),b}function ie(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=function(){let T=C;return T>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+i.maxTextures),C+=1,T},this.resetTextureUnits=function(){C=0},this.setTexture2D=X,this.setTexture2DArray=function(T,b){let F=n.get(T);T.version>0&&F.__version!==T.version?te(F,T,b):t.bindTexture(r.TEXTURE_2D_ARRAY,F.__webglTexture,r.TEXTURE0+b)},this.setTexture3D=function(T,b){let F=n.get(T);T.version>0&&F.__version!==T.version?te(F,T,b):t.bindTexture(r.TEXTURE_3D,F.__webglTexture,r.TEXTURE0+b)},this.setTextureCube=function(T,b){let F=n.get(T);T.version>0&&F.__version!==T.version?(function(k,P,B){if(P.image.length!==6)return;let M=Q(k,P),z=P.source;t.bindTexture(r.TEXTURE_CUBE_MAP,k.__webglTexture,r.TEXTURE0+B);let q=n.get(z);if(z.version!==q.__version||M===!0){t.activeTexture(r.TEXTURE0+B);let ce=lt.getPrimaries(lt.workingColorSpace),Y=P.colorSpace===$i?null:lt.getPrimaries(P.colorSpace),oe=P.colorSpace===$i||ce===Y?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,P.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,P.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,oe);let ae=P.isCompressedTexture||P.image[0].isCompressedTexture,pe=P.image[0]&&P.image[0].isDataTexture,fe=[];for(let Re=0;Re<6;Re++)fe[Re]=ae||pe?pe?P.image[Re].image:P.image[Re]:_(P.image[Re],!0,i.maxCubemapSize),fe[Re]=re(P,fe[Re]);let Ee=fe[0],Ce=s.convert(P.format,P.colorSpace),we=s.convert(P.type),nt=x(P.internalFormat,Ce,we,P.colorSpace),Ve=P.isVideoTexture!==!0,Le=q.__version===void 0||M===!0,et=z.dataReady,at,st=w(P,Ee);if(G(r.TEXTURE_CUBE_MAP,P),ae){Ve&&Le&&t.texStorage2D(r.TEXTURE_CUBE_MAP,st,nt,Ee.width,Ee.height);for(let Re=0;Re<6;Re++){at=fe[Re].mipmaps;for(let Oe=0;Oe<at.length;Oe++){let Ke=at[Oe];P.format!==Nn?Ce!==null?Ve?et&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Oe,0,0,Ke.width,Ke.height,Ce,Ke.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Oe,nt,Ke.width,Ke.height,0,Ke.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ve?et&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Oe,0,0,Ke.width,Ke.height,Ce,we,Ke.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Oe,nt,Ke.width,Ke.height,0,Ce,we,Ke.data)}}}else{if(at=P.mipmaps,Ve&&Le){at.length>0&&st++;let Re=ie(fe[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,st,nt,Re.width,Re.height)}for(let Re=0;Re<6;Re++)if(pe){Ve?et&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0,0,0,fe[Re].width,fe[Re].height,Ce,we,fe[Re].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0,nt,fe[Re].width,fe[Re].height,0,Ce,we,fe[Re].data);for(let Oe=0;Oe<at.length;Oe++){let Ke=at[Oe].image[Re].image;Ve?et&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Oe+1,0,0,Ke.width,Ke.height,Ce,we,Ke.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Oe+1,nt,Ke.width,Ke.height,0,Ce,we,Ke.data)}}else{Ve?et&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0,0,0,Ce,we,fe[Re]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0,nt,Ce,we,fe[Re]);for(let Oe=0;Oe<at.length;Oe++){let Ke=at[Oe];Ve?et&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Oe+1,0,0,Ce,we,Ke.image[Re]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Oe+1,nt,Ce,we,Ke.image[Re])}}}f(P)&&g(r.TEXTURE_CUBE_MAP),q.__version=z.version,P.onUpdate&&P.onUpdate(P)}k.__version=P.version})(F,T,b):t.bindTexture(r.TEXTURE_CUBE_MAP,F.__webglTexture,r.TEXTURE0+b)},this.rebindTextures=function(T,b,F){let k=n.get(T);b!==void 0&&S(k.__webglFramebuffer,T,T.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),F!==void 0&&O(T)},this.setupRenderTarget=function(T){let b=T.texture,F=n.get(T),k=n.get(b);T.addEventListener("dispose",U);let P=T.textures,B=T.isWebGLCubeRenderTarget===!0,M=P.length>1;if(M||(k.__webglTexture===void 0&&(k.__webglTexture=r.createTexture()),k.__version=b.version,a.memory.textures++),B){F.__webglFramebuffer=[];for(let z=0;z<6;z++)if(b.mipmaps&&b.mipmaps.length>0){F.__webglFramebuffer[z]=[];for(let q=0;q<b.mipmaps.length;q++)F.__webglFramebuffer[z][q]=r.createFramebuffer()}else F.__webglFramebuffer[z]=r.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){F.__webglFramebuffer=[];for(let z=0;z<b.mipmaps.length;z++)F.__webglFramebuffer[z]=r.createFramebuffer()}else F.__webglFramebuffer=r.createFramebuffer();if(M)for(let z=0,q=P.length;z<q;z++){let ce=n.get(P[z]);ce.__webglTexture===void 0&&(ce.__webglTexture=r.createTexture(),a.memory.textures++)}if(T.samples>0&&le(T)===!1){F.__webglMultisampledFramebuffer=r.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let z=0;z<P.length;z++){let q=P[z];F.__webglColorRenderbuffer[z]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,F.__webglColorRenderbuffer[z]);let ce=s.convert(q.format,q.colorSpace),Y=s.convert(q.type),oe=x(q.internalFormat,ce,Y,q.colorSpace,T.isXRRenderTarget===!0),ae=Z(T);r.renderbufferStorageMultisample(r.RENDERBUFFER,ae,oe,T.width,T.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+z,r.RENDERBUFFER,F.__webglColorRenderbuffer[z])}r.bindRenderbuffer(r.RENDERBUFFER,null),T.depthBuffer&&(F.__webglDepthRenderbuffer=r.createRenderbuffer(),I(F.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(B){t.bindTexture(r.TEXTURE_CUBE_MAP,k.__webglTexture),G(r.TEXTURE_CUBE_MAP,b);for(let z=0;z<6;z++)if(b.mipmaps&&b.mipmaps.length>0)for(let q=0;q<b.mipmaps.length;q++)S(F.__webglFramebuffer[z][q],T,b,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+z,q);else S(F.__webglFramebuffer[z],T,b,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+z,0);f(b)&&g(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(M){for(let z=0,q=P.length;z<q;z++){let ce=P[z],Y=n.get(ce);t.bindTexture(r.TEXTURE_2D,Y.__webglTexture),G(r.TEXTURE_2D,ce),S(F.__webglFramebuffer,T,ce,r.COLOR_ATTACHMENT0+z,r.TEXTURE_2D,0),f(ce)&&g(r.TEXTURE_2D)}t.unbindTexture()}else{let z=r.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(z=T.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(z,k.__webglTexture),G(z,b),b.mipmaps&&b.mipmaps.length>0)for(let q=0;q<b.mipmaps.length;q++)S(F.__webglFramebuffer[q],T,b,r.COLOR_ATTACHMENT0,z,q);else S(F.__webglFramebuffer,T,b,r.COLOR_ATTACHMENT0,z,0);f(b)&&g(z),t.unbindTexture()}T.depthBuffer&&O(T)},this.updateRenderTargetMipmap=function(T){let b=T.textures;for(let F=0,k=b.length;F<k;F++){let P=b[F];if(f(P)){let B=v(T),M=n.get(P).__webglTexture;t.bindTexture(B,M),g(B),t.unbindTexture()}}},this.updateMultisampleRenderTarget=function(T){if(T.samples>0){if(le(T)===!1){let b=T.textures,F=T.width,k=T.height,P=r.COLOR_BUFFER_BIT,B=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,M=n.get(T),z=b.length>1;if(z)for(let q=0;q<b.length;q++)t.bindFramebuffer(r.FRAMEBUFFER,M.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+q,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,M.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+q,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,M.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,M.__webglFramebuffer);for(let q=0;q<b.length;q++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(P|=r.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(P|=r.STENCIL_BUFFER_BIT)),z){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,M.__webglColorRenderbuffer[q]);let ce=n.get(b[q]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,ce,0)}r.blitFramebuffer(0,0,F,k,0,0,F,k,P,r.NEAREST),l===!0&&(H.length=0,W.length=0,H.push(r.COLOR_ATTACHMENT0+q),T.depthBuffer&&T.resolveDepthBuffer===!1&&(H.push(B),W.push(B),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,W)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,H))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),z)for(let q=0;q<b.length;q++){t.bindFramebuffer(r.FRAMEBUFFER,M.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+q,r.RENDERBUFFER,M.__webglColorRenderbuffer[q]);let ce=n.get(b[q]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,M.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+q,r.TEXTURE_2D,ce,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,M.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){let b=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[b])}}},this.setupDepthRenderbuffer=O,this.setupFrameBufferTexture=S,this.useMultisampledRTT=le}function Vd(r,e){return{convert:function(t,n=""){let i,s=lt.getTransfer(n);if(t===li)return r.UNSIGNED_BYTE;if(t===xl)return r.UNSIGNED_SHORT_4_4_4_4;if(t===yl)return r.UNSIGNED_SHORT_5_5_5_1;if(t===jc)return r.UNSIGNED_INT_5_9_9_9_REV;if(t===Gc)return r.BYTE;if(t===Wc)return r.SHORT;if(t===Or)return r.UNSIGNED_SHORT;if(t===_l)return r.INT;if(t===Pi)return r.UNSIGNED_INT;if(t===Jn)return r.FLOAT;if(t===Yr)return r.HALF_FLOAT;if(t===Xc)return r.ALPHA;if(t===qc)return r.RGB;if(t===Nn)return r.RGBA;if(t===Yc)return r.LUMINANCE;if(t===Zc)return r.LUMINANCE_ALPHA;if(t===Fr)return r.DEPTH_COMPONENT;if(t===lr)return r.DEPTH_STENCIL;if(t===Jc)return r.RED;if(t===Ml)return r.RED_INTEGER;if(t===Kc)return r.RG;if(t===bl)return r.RG_INTEGER;if(t===Sl)return r.RGBA_INTEGER;if(t===Ss||t===Ts||t===Es||t===ws)if(s===ft){if(i=e.get("WEBGL_compressed_texture_s3tc_srgb"),i===null)return null;if(t===Ss)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(t===Ts)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(t===Es)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(t===ws)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else{if(i=e.get("WEBGL_compressed_texture_s3tc"),i===null)return null;if(t===Ss)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(t===Ts)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(t===Es)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(t===ws)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}if(t===Za||t===Ja||t===Ka||t===$a){if(i=e.get("WEBGL_compressed_texture_pvrtc"),i===null)return null;if(t===Za)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(t===Ja)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(t===Ka)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(t===$a)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}if(t===Qa||t===eo||t===to){if(i=e.get("WEBGL_compressed_texture_etc"),i===null)return null;if(t===Qa||t===eo)return s===ft?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(t===to)return s===ft?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC}if(t===no||t===io||t===ro||t===so||t===ao||t===oo||t===lo||t===co||t===ho||t===uo||t===po||t===fo||t===mo||t===go){if(i=e.get("WEBGL_compressed_texture_astc"),i===null)return null;if(t===no)return s===ft?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(t===io)return s===ft?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(t===ro)return s===ft?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(t===so)return s===ft?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(t===ao)return s===ft?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(t===oo)return s===ft?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(t===lo)return s===ft?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(t===co)return s===ft?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(t===ho)return s===ft?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(t===uo)return s===ft?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(t===po)return s===ft?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(t===fo)return s===ft?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(t===mo)return s===ft?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(t===go)return s===ft?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}if(t===As||t===vo||t===_o){if(i=e.get("EXT_texture_compression_bptc"),i===null)return null;if(t===As)return s===ft?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(t===vo)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(t===_o)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}if(t===$c||t===xo||t===yo||t===Mo){if(i=e.get("EXT_texture_compression_rgtc"),i===null)return null;if(t===As)return i.COMPRESSED_RED_RGTC1_EXT;if(t===xo)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(t===yo)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(t===Mo)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}return t===or?r.UNSIGNED_INT_24_8:r[t]!==void 0?r[t]:null}}}var Fo=class extends rn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},On=class extends Cn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Gd={type:"move"},Lr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new On,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new On,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new On,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let _ of e.hand.values()){let f=t.getJointPose(_,n),g=this._getHandJoint(c,_);f!==null&&(g.matrix.fromArray(f.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=f.radius),g.visible=f!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,m=.005;c.inputState.pinching&&d>p+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Gd)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new On;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Bo=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let i=new xn;e.properties.get(i).__webglTexture=t.texture,t.depthNear==n.depthNear&&t.depthFar==n.depthFar||(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new sn({vertexShader:`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,fragmentShader:`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Pt(new hi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},zo=class extends $n{constructor(e,t){super();let n=this,i=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,m=null,_=new Bo,f=t.getContextAttributes(),g=null,v=null,x=[],y=[],w=new me,E=null,U=new rn;U.viewport=new xt;let V=new rn;V.viewport=new xt;let C=[U,V],X=new Fo,L=null,D=null;function j(W){let Z=y.indexOf(W.inputSource);if(Z===-1)return;let le=x[Z];le!==void 0&&(le.update(W.inputSource,W.frame,c||a),le.dispatchEvent({type:W.type,data:W.inputSource}))}function G(){i.removeEventListener("select",j),i.removeEventListener("selectstart",j),i.removeEventListener("selectend",j),i.removeEventListener("squeeze",j),i.removeEventListener("squeezestart",j),i.removeEventListener("squeezeend",j),i.removeEventListener("end",G),i.removeEventListener("inputsourceschange",Q);for(let W=0;W<x.length;W++){let Z=y[W];Z!==null&&(y[W]=null,x[W].disconnect(Z))}L=null,D=null,_.reset(),e.setRenderTarget(g),p=null,d=null,u=null,i=null,v=null,H.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}function Q(W){for(let Z=0;Z<W.removed.length;Z++){let le=W.removed[Z],re=y.indexOf(le);re>=0&&(y[re]=null,x[re].disconnect(le))}for(let Z=0;Z<W.added.length;Z++){let le=W.added[Z],re=y.indexOf(le);if(re===-1){for(let T=0;T<x.length;T++){if(T>=y.length){y.push(le),re=T;break}if(y[T]===null){y[T]=le,re=T;break}}if(re===-1)break}let ie=x[re];ie&&ie.connect(le)}}this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let Z=x[W];return Z===void 0&&(Z=new Lr,x[W]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(W){let Z=x[W];return Z===void 0&&(Z=new Lr,x[W]=Z),Z.getGripSpace()},this.getHand=function(W){let Z=x[W];return Z===void 0&&(Z=new Lr,x[W]=Z),Z.getHandSpace()},this.setFramebufferScaleFactor=function(W){s=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){o=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(W){c=W},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(W){if(i=W,i!==null){if(g=e.getRenderTarget(),i.addEventListener("select",j),i.addEventListener("selectstart",j),i.addEventListener("selectend",j),i.addEventListener("squeeze",j),i.addEventListener("squeezestart",j),i.addEventListener("squeezeend",j),i.addEventListener("end",G),i.addEventListener("inputsourceschange",Q),f.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(w),i.renderState.layers===void 0){let Z={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(i,t,Z),i.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new yn(p.framebufferWidth,p.framebufferHeight,{format:Nn,type:li,colorSpace:e.outputColorSpace,stencilBuffer:f.stencil})}else{let Z=null,le=null,re=null;f.depth&&(re=f.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Z=f.stencil?lr:Fr,le=f.stencil?or:Pi);let ie={colorFormat:t.RGBA8,depthFormat:re,scaleFactor:s};u=new XRWebGLBinding(i,t),d=u.createProjectionLayer(ie),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new yn(d.textureWidth,d.textureHeight,{format:Nn,type:li,depthTexture:new Os(d.textureWidth,d.textureHeight,le,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:f.stencil,colorSpace:e.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),H.setContext(i),H.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};let te=new R,S=new R;function I(W,Z){Z===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(Z.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(i===null)return;let Z=W.near,le=W.far;_.texture!==null&&(_.depthNear>0&&(Z=_.depthNear),_.depthFar>0&&(le=_.depthFar)),X.near=V.near=U.near=Z,X.far=V.far=U.far=le,L===X.near&&D===X.far||(i.updateRenderState({depthNear:X.near,depthFar:X.far}),L=X.near,D=X.far),U.layers.mask=2|W.layers.mask,V.layers.mask=4|W.layers.mask,X.layers.mask=U.layers.mask|V.layers.mask;let re=W.parent,ie=X.cameras;I(X,re);for(let T=0;T<ie.length;T++)I(ie[T],re);ie.length===2?(function(T,b,F){te.setFromMatrixPosition(b.matrixWorld),S.setFromMatrixPosition(F.matrixWorld);let k=te.distanceTo(S),P=b.projectionMatrix.elements,B=F.projectionMatrix.elements,M=P[14]/(P[10]-1),z=P[14]/(P[10]+1),q=(P[9]+1)/P[5],ce=(P[9]-1)/P[5],Y=(P[8]-1)/P[0],oe=(B[8]+1)/B[0],ae=M*Y,pe=M*oe,fe=k/(-Y+oe),Ee=fe*-Y;if(b.matrixWorld.decompose(T.position,T.quaternion,T.scale),T.translateX(Ee),T.translateZ(fe),T.matrixWorld.compose(T.position,T.quaternion,T.scale),T.matrixWorldInverse.copy(T.matrixWorld).invert(),P[10]===-1)T.projectionMatrix.copy(b.projectionMatrix),T.projectionMatrixInverse.copy(b.projectionMatrixInverse);else{let Ce=M+fe,we=z+fe,nt=ae-Ee,Ve=pe+(k-Ee),Le=q*z/we*Ce,et=ce*z/we*Ce;T.projectionMatrix.makePerspective(nt,Ve,Le,et,Ce,we),T.projectionMatrixInverse.copy(T.projectionMatrix).invert()}})(X,U,V):X.projectionMatrix.copy(U.projectionMatrix),(function(T,b,F){F===null?T.matrix.copy(b.matrixWorld):(T.matrix.copy(F.matrixWorld),T.matrix.invert(),T.matrix.multiply(b.matrixWorld)),T.matrix.decompose(T.position,T.quaternion,T.scale),T.updateMatrixWorld(!0),T.projectionMatrix.copy(b.projectionMatrix),T.projectionMatrixInverse.copy(b.projectionMatrixInverse),T.isPerspectiveCamera&&(T.fov=2*Br*Math.atan(1/T.projectionMatrix.elements[5]),T.zoom=1)})(W,X,re)},this.getCamera=function(){return X},this.getFoveation=function(){if(d!==null||p!==null)return l},this.setFoveation=function(W){l=W,d!==null&&(d.fixedFoveation=W),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=W)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(X)};let O=null,H=new nh;H.setAnimationLoop((function(W,Z){if(h=Z.getViewerPose(c||a),m=Z,h!==null){let le=h.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let re=!1;le.length!==X.cameras.length&&(X.cameras.length=0,re=!0);for(let T=0;T<le.length;T++){let b=le[T],F=null;if(p!==null)F=p.getViewport(b);else{let P=u.getViewSubImage(d,b);F=P.viewport,T===0&&(e.setRenderTargetTextures(v,P.colorTexture,d.ignoreDepthValues?void 0:P.depthStencilTexture),e.setRenderTarget(v))}let k=C[T];k===void 0&&(k=new rn,k.layers.enable(T),k.viewport=new xt,C[T]=k),k.matrix.fromArray(b.transform.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale),k.projectionMatrix.fromArray(b.projectionMatrix),k.projectionMatrixInverse.copy(k.projectionMatrix).invert(),k.viewport.set(F.x,F.y,F.width,F.height),T===0&&(X.matrix.copy(k.matrix),X.matrix.decompose(X.position,X.quaternion,X.scale)),re===!0&&X.cameras.push(k)}let ie=i.enabledFeatures;if(ie&&ie.includes("depth-sensing")){let T=u.getDepthInformation(le[0]);T&&T.isValid&&T.texture&&_.init(e,T,i.renderState)}}for(let le=0;le<x.length;le++){let re=y[le],ie=x[le];re!==null&&ie!==void 0&&ie.update(re,Z,c||a)}O&&O(W,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),m=null})),this.setAnimationLoop=function(W){O=W},this.dispose=function(){}}},Ei=new Bn,Wd=new Be;function jd(r,e){function t(i,s){i.matrixAutoUpdate===!0&&i.updateMatrix(),s.value.copy(i.matrix)}function n(i,s){i.opacity.value=s.opacity,s.color&&i.diffuse.value.copy(s.color),s.emissive&&i.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity),s.map&&(i.map.value=s.map,t(s.map,i.mapTransform)),s.alphaMap&&(i.alphaMap.value=s.alphaMap,t(s.alphaMap,i.alphaMapTransform)),s.bumpMap&&(i.bumpMap.value=s.bumpMap,t(s.bumpMap,i.bumpMapTransform),i.bumpScale.value=s.bumpScale,s.side===1&&(i.bumpScale.value*=-1)),s.normalMap&&(i.normalMap.value=s.normalMap,t(s.normalMap,i.normalMapTransform),i.normalScale.value.copy(s.normalScale),s.side===1&&i.normalScale.value.negate()),s.displacementMap&&(i.displacementMap.value=s.displacementMap,t(s.displacementMap,i.displacementMapTransform),i.displacementScale.value=s.displacementScale,i.displacementBias.value=s.displacementBias),s.emissiveMap&&(i.emissiveMap.value=s.emissiveMap,t(s.emissiveMap,i.emissiveMapTransform)),s.specularMap&&(i.specularMap.value=s.specularMap,t(s.specularMap,i.specularMapTransform)),s.alphaTest>0&&(i.alphaTest.value=s.alphaTest);let a=e.get(s),o=a.envMap,l=a.envMapRotation;o&&(i.envMap.value=o,Ei.copy(l),Ei.x*=-1,Ei.y*=-1,Ei.z*=-1,o.isCubeTexture&&o.isRenderTargetTexture===!1&&(Ei.y*=-1,Ei.z*=-1),i.envMapRotation.value.setFromMatrix4(Wd.makeRotationFromEuler(Ei)),i.flipEnvMap.value=o.isCubeTexture&&o.isRenderTargetTexture===!1?-1:1,i.reflectivity.value=s.reflectivity,i.ior.value=s.ior,i.refractionRatio.value=s.refractionRatio),s.lightMap&&(i.lightMap.value=s.lightMap,i.lightMapIntensity.value=s.lightMapIntensity,t(s.lightMap,i.lightMapTransform)),s.aoMap&&(i.aoMap.value=s.aoMap,i.aoMapIntensity.value=s.aoMapIntensity,t(s.aoMap,i.aoMapTransform))}return{refreshFogUniforms:function(i,s){s.color.getRGB(i.fogColor.value,th(r)),s.isFog?(i.fogNear.value=s.near,i.fogFar.value=s.far):s.isFogExp2&&(i.fogDensity.value=s.density)},refreshMaterialUniforms:function(i,s,a,o,l){s.isMeshBasicMaterial||s.isMeshLambertMaterial?n(i,s):s.isMeshToonMaterial?(n(i,s),(function(c,h){h.gradientMap&&(c.gradientMap.value=h.gradientMap)})(i,s)):s.isMeshPhongMaterial?(n(i,s),(function(c,h){c.specular.value.copy(h.specular),c.shininess.value=Math.max(h.shininess,1e-4)})(i,s)):s.isMeshStandardMaterial?(n(i,s),(function(c,h){c.metalness.value=h.metalness,h.metalnessMap&&(c.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,c.metalnessMapTransform)),c.roughness.value=h.roughness,h.roughnessMap&&(c.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,c.roughnessMapTransform)),h.envMap&&(c.envMapIntensity.value=h.envMapIntensity)})(i,s),s.isMeshPhysicalMaterial&&(function(c,h,u){c.ior.value=h.ior,h.sheen>0&&(c.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),c.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(c.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,c.sheenColorMapTransform)),h.sheenRoughnessMap&&(c.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,c.sheenRoughnessMapTransform))),h.clearcoat>0&&(c.clearcoat.value=h.clearcoat,c.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(c.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,c.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(c.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,c.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(c.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,c.clearcoatNormalMapTransform),c.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===1&&c.clearcoatNormalScale.value.negate())),h.dispersion>0&&(c.dispersion.value=h.dispersion),h.iridescence>0&&(c.iridescence.value=h.iridescence,c.iridescenceIOR.value=h.iridescenceIOR,c.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],c.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(c.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,c.iridescenceMapTransform)),h.iridescenceThicknessMap&&(c.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,c.iridescenceThicknessMapTransform))),h.transmission>0&&(c.transmission.value=h.transmission,c.transmissionSamplerMap.value=u.texture,c.transmissionSamplerSize.value.set(u.width,u.height),h.transmissionMap&&(c.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,c.transmissionMapTransform)),c.thickness.value=h.thickness,h.thicknessMap&&(c.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,c.thicknessMapTransform)),c.attenuationDistance.value=h.attenuationDistance,c.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(c.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(c.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,c.anisotropyMapTransform))),c.specularIntensity.value=h.specularIntensity,c.specularColor.value.copy(h.specularColor),h.specularColorMap&&(c.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,c.specularColorMapTransform)),h.specularIntensityMap&&(c.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,c.specularIntensityMapTransform))})(i,s,l)):s.isMeshMatcapMaterial?(n(i,s),(function(c,h){h.matcap&&(c.matcap.value=h.matcap)})(i,s)):s.isMeshDepthMaterial?n(i,s):s.isMeshDistanceMaterial?(n(i,s),(function(c,h){let u=e.get(h).light;c.referencePosition.value.setFromMatrixPosition(u.matrixWorld),c.nearDistance.value=u.shadow.camera.near,c.farDistance.value=u.shadow.camera.far})(i,s)):s.isMeshNormalMaterial?n(i,s):s.isLineBasicMaterial?((function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform))})(i,s),s.isLineDashedMaterial&&(function(c,h){c.dashSize.value=h.dashSize,c.totalSize.value=h.dashSize+h.gapSize,c.scale.value=h.scale})(i,s)):s.isPointsMaterial?(function(c,h,u,d){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.size.value=h.size*u,c.scale.value=.5*d,h.map&&(c.map.value=h.map,t(h.map,c.uvTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)})(i,s,a,o):s.isSpriteMaterial?(function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.rotation.value=h.rotation,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)})(i,s):s.isShadowMaterial?(i.color.value.copy(s.color),i.opacity.value=s.opacity):s.isShaderMaterial&&(s.uniformsNeedUpdate=!1)}}}function Xd(r,e,t,n){let i={},s={},a=[],o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(u,d,p,m){let _=u.value,f=d+"_"+p;if(m[f]===void 0)return m[f]=typeof _=="number"||typeof _=="boolean"?_:_.clone(),!0;{let g=m[f];if(typeof _=="number"||typeof _=="boolean"){if(g!==_)return m[f]=_,!0}else if(g.equals(_)===!1)return g.copy(_),!0}return!1}function c(u){let d={boundary:0,storage:0};return typeof u=="number"||typeof u=="boolean"?(d.boundary=4,d.storage=4):u.isVector2?(d.boundary=8,d.storage=8):u.isVector3||u.isColor?(d.boundary=16,d.storage=12):u.isVector4?(d.boundary=16,d.storage=16):u.isMatrix3?(d.boundary=48,d.storage=48):u.isMatrix4?(d.boundary=64,d.storage=64):u.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",u),d}function h(u){let d=u.target;d.removeEventListener("dispose",h);let p=a.indexOf(d.__bindingPointIndex);a.splice(p,1),r.deleteBuffer(i[d.id]),delete i[d.id],delete s[d.id]}return{bind:function(u,d){let p=d.program;n.uniformBlockBinding(u,p)},update:function(u,d){let p=i[u.id];p===void 0&&((function(f){let g=f.uniforms,v=0,x=16;for(let w=0,E=g.length;w<E;w++){let U=Array.isArray(g[w])?g[w]:[g[w]];for(let V=0,C=U.length;V<C;V++){let X=U[V],L=Array.isArray(X.value)?X.value:[X.value];for(let D=0,j=L.length;D<j;D++){let G=c(L[D]),Q=v%x,te=Q%G.boundary,S=Q+te;v+=te,S!==0&&x-S<G.storage&&(v+=x-S),X.__data=new Float32Array(G.storage/Float32Array.BYTES_PER_ELEMENT),X.__offset=v,v+=G.storage}}}let y=v%x;y>0&&(v+=x-y),f.__size=v,f.__cache={}})(u),p=(function(f){let g=(function(){for(let w=0;w<o;w++)if(a.indexOf(w)===-1)return a.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0})();f.__bindingPointIndex=g;let v=r.createBuffer(),x=f.__size,y=f.usage;return r.bindBuffer(r.UNIFORM_BUFFER,v),r.bufferData(r.UNIFORM_BUFFER,x,y),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,g,v),v})(u),i[u.id]=p,u.addEventListener("dispose",h));let m=d.program;n.updateUBOMapping(u,m);let _=e.render.frame;s[u.id]!==_&&((function(f){let g=i[f.id],v=f.uniforms,x=f.__cache;r.bindBuffer(r.UNIFORM_BUFFER,g);for(let y=0,w=v.length;y<w;y++){let E=Array.isArray(v[y])?v[y]:[v[y]];for(let U=0,V=E.length;U<V;U++){let C=E[U];if(l(C,y,U,x)===!0){let X=C.__offset,L=Array.isArray(C.value)?C.value:[C.value],D=0;for(let j=0;j<L.length;j++){let G=L[j],Q=c(G);typeof G=="number"||typeof G=="boolean"?(C.__data[0]=G,r.bufferSubData(r.UNIFORM_BUFFER,X+D,C.__data)):G.isMatrix3?(C.__data[0]=G.elements[0],C.__data[1]=G.elements[1],C.__data[2]=G.elements[2],C.__data[3]=0,C.__data[4]=G.elements[3],C.__data[5]=G.elements[4],C.__data[6]=G.elements[5],C.__data[7]=0,C.__data[8]=G.elements[6],C.__data[9]=G.elements[7],C.__data[10]=G.elements[8],C.__data[11]=0):(G.toArray(C.__data,D),D+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,X,C.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)})(u),s[u.id]=_)},dispose:function(){for(let u in i)r.deleteBuffer(i[u]);a=[],i={},s={}}}}var Fs=class{constructor(e={}){let{canvas:t=nu(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=e,p;if(this.isWebGLRenderer=!0,n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let m=new Uint32Array(4),_=new Int32Array(4),f=null,g=null,v=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=cn,this.toneMapping=0,this.toneMappingExposure=1;let y=this,w=!1,E=0,U=0,V=null,C=-1,X=null,L=new xt,D=new xt,j=null,G=new qe(0),Q=0,te=t.width,S=t.height,I=1,O=null,H=null,W=new xt(0,0,te,S),Z=new xt(0,0,te,S),le=!1,re=new kr,ie=!1,T=!1,b=new Be,F=new Be,k=new R,P=new xt,B={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},M=!1;function z(){return V===null?I:1}let q,ce,Y,oe,ae,pe,fe,Ee,Ce,we,nt,Ve,Le,et,at,st,Re,Oe,Ke,bn,Hn,Dt,Gt,on,J=n;function ct(A,K){return t.getContext(A,K)}try{let A={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r170"),t.addEventListener("webglcontextlost",gi,!1),t.addEventListener("webglcontextrestored",Pe,!1),t.addEventListener("webglcontextcreationerror",We,!1),J===null){let K="webgl2";if(J=ct(K,A),J===null)throw ct(K)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}function mi(){q=new Au(J),q.init(),Dt=new Vd(J,q),ce=new Su(J,q,e,Dt),Y=new kd(J,q),ce.reverseDepthBuffer&&d&&Y.buffers.depth.setReversed(!0),oe=new Pu(J),ae=new Pd,pe=new Hd(J,q,Y,ae,ce,Dt,oe),fe=new Eu(y),Ee=new wu(y),Ce=new _u(J),Gt=new Mu(J,Ce),we=new Ru(J,Ce,oe,Gt),nt=new Lu(J,we,Ce,oe),Ke=new Iu(J,ce,pe),st=new Tu(ae),Ve=new Cd(y,fe,Ee,q,ce,Gt,st),Le=new jd(y,ae),et=new Ld,at=new Fd(q),Oe=new yu(y,fe,Ee,Y,nt,p,l),Re=new Bd(y,nt,ce),on=new Xd(J,oe,ce,Y),bn=new bu(J,q,oe),Hn=new Cu(J,q,oe),oe.programs=Ve.programs,y.capabilities=ce,y.extensions=q,y.properties=ae,y.renderLists=et,y.shadowMap=Re,y.state=Y,y.info=oe}mi();let Tt=new zo(y,J);function gi(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Pe(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;let A=oe.autoReset,K=Re.enabled,ne=Re.autoUpdate,de=Re.needsUpdate,ee=Re.type;mi(),oe.autoReset=A,Re.enabled=K,Re.autoUpdate=ne,Re.needsUpdate=de,Re.type=ee}function We(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function $e(A){let K=A.target;K.removeEventListener("dispose",$e),(function(ne){(function(de){let ee=ae.get(de).programs;ee!==void 0&&(ee.forEach((function(ge){Ve.releaseProgram(ge)})),de.isShaderMaterial&&Ve.releaseShaderCache(de))})(ne),ae.remove(ne)})(K)}function qt(A,K,ne){A.transparent===!0&&A.side===2&&A.forceSinglePass===!1?(A.side=1,A.needsUpdate=!0,Gn(A,K,ne),A.side=0,A.needsUpdate=!0,Gn(A,K,ne),A.side=2):Gn(A,K,ne)}this.xr=Tt,this.getContext=function(){return J},this.getContextAttributes=function(){return J.getContextAttributes()},this.forceContextLoss=function(){let A=q.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=q.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return I},this.setPixelRatio=function(A){A!==void 0&&(I=A,this.setSize(te,S,!1))},this.getSize=function(A){return A.set(te,S)},this.setSize=function(A,K,ne=!0){Tt.isPresenting?console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting."):(te=A,S=K,t.width=Math.floor(A*I),t.height=Math.floor(K*I),ne===!0&&(t.style.width=A+"px",t.style.height=K+"px"),this.setViewport(0,0,A,K))},this.getDrawingBufferSize=function(A){return A.set(te*I,S*I).floor()},this.setDrawingBufferSize=function(A,K,ne){te=A,S=K,I=ne,t.width=Math.floor(A*ne),t.height=Math.floor(K*ne),this.setViewport(0,0,A,K)},this.getCurrentViewport=function(A){return A.copy(L)},this.getViewport=function(A){return A.copy(W)},this.setViewport=function(A,K,ne,de){A.isVector4?W.set(A.x,A.y,A.z,A.w):W.set(A,K,ne,de),Y.viewport(L.copy(W).multiplyScalar(I).round())},this.getScissor=function(A){return A.copy(Z)},this.setScissor=function(A,K,ne,de){A.isVector4?Z.set(A.x,A.y,A.z,A.w):Z.set(A,K,ne,de),Y.scissor(D.copy(Z).multiplyScalar(I).round())},this.getScissorTest=function(){return le},this.setScissorTest=function(A){Y.setScissorTest(le=A)},this.setOpaqueSort=function(A){O=A},this.setTransparentSort=function(A){H=A},this.getClearColor=function(A){return A.copy(Oe.getClearColor())},this.setClearColor=function(){Oe.setClearColor.apply(Oe,arguments)},this.getClearAlpha=function(){return Oe.getClearAlpha()},this.setClearAlpha=function(){Oe.setClearAlpha.apply(Oe,arguments)},this.clear=function(A=!0,K=!0,ne=!0){let de=0;if(A){let ee=!1;if(V!==null){let ge=V.texture.format;ee=ge===Sl||ge===bl||ge===Ml}if(ee){let ge=V.texture.type,Ae=ge===li||ge===Pi||ge===Or||ge===or||ge===xl||ge===yl,De=Oe.getClearColor(),Fe=Oe.getClearAlpha(),Ge=De.r,Ye=De.g,ze=De.b;Ae?(m[0]=Ge,m[1]=Ye,m[2]=ze,m[3]=Fe,J.clearBufferuiv(J.COLOR,0,m)):(_[0]=Ge,_[1]=Ye,_[2]=ze,_[3]=Fe,J.clearBufferiv(J.COLOR,0,_))}else de|=J.COLOR_BUFFER_BIT}K&&(de|=J.DEPTH_BUFFER_BIT),ne&&(de|=J.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),J.clear(de)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",gi,!1),t.removeEventListener("webglcontextrestored",Pe,!1),t.removeEventListener("webglcontextcreationerror",We,!1),et.dispose(),at.dispose(),ae.dispose(),fe.dispose(),Ee.dispose(),nt.dispose(),Gt.dispose(),on.dispose(),Ve.dispose(),Tt.dispose(),Tt.removeEventListener("sessionstart",mn),Tt.removeEventListener("sessionend",vi),Qt.stop()},this.renderBufferDirect=function(A,K,ne,de,ee,ge){K===null&&(K=B);let Ae=ee.isMesh&&ee.matrixWorld.determinant()<0,De=(function(it,Ct,At,je,ke){Ct.isScene!==!0&&(Ct=B),pe.resetTextureUnits();let N=Ct.fog,se=je.isMeshStandardMaterial?Ct.environment:null,xe=V===null?y.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:vr,he=(je.isMeshStandardMaterial?Ee:fe).get(je.envMap||se),Se=je.vertexColors===!0&&!!At.attributes.color&&At.attributes.color.itemSize===4,ue=!!At.attributes.tangent&&(!!je.normalMap||je.anisotropy>0),Me=!!At.morphAttributes.position,_e=!!At.morphAttributes.normal,Ze=!!At.morphAttributes.color,He=0;je.toneMapped&&(V!==null&&V.isXRRenderTarget!==!0||(He=y.toneMapping));let ye=At.morphAttributes.position||At.morphAttributes.normal||At.morphAttributes.color,Ne=ye!==void 0?ye.length:0,Ie=ae.get(je),ot=g.state.lights;if(ie===!0&&(T===!0||it!==X)){let jt=it===X&&je.id===C;st.setState(je,it,jt)}let ht=!1;je.version===Ie.__version?Ie.needsLights&&Ie.lightsStateVersion!==ot.state.version||Ie.outputColorSpace!==xe||ke.isBatchedMesh&&Ie.batching===!1?ht=!0:ke.isBatchedMesh||Ie.batching!==!0?ke.isBatchedMesh&&Ie.batchingColor===!0&&ke.colorTexture===null||ke.isBatchedMesh&&Ie.batchingColor===!1&&ke.colorTexture!==null||ke.isInstancedMesh&&Ie.instancing===!1?ht=!0:ke.isInstancedMesh||Ie.instancing!==!0?ke.isSkinnedMesh&&Ie.skinning===!1?ht=!0:ke.isSkinnedMesh||Ie.skinning!==!0?ke.isInstancedMesh&&Ie.instancingColor===!0&&ke.instanceColor===null||ke.isInstancedMesh&&Ie.instancingColor===!1&&ke.instanceColor!==null||ke.isInstancedMesh&&Ie.instancingMorph===!0&&ke.morphTexture===null||ke.isInstancedMesh&&Ie.instancingMorph===!1&&ke.morphTexture!==null||Ie.envMap!==he||je.fog===!0&&Ie.fog!==N?ht=!0:Ie.numClippingPlanes===void 0||Ie.numClippingPlanes===st.numPlanes&&Ie.numIntersection===st.numIntersection?(Ie.vertexAlphas!==Se||Ie.vertexTangents!==ue||Ie.morphTargets!==Me||Ie.morphNormals!==_e||Ie.morphColors!==Ze||Ie.toneMapping!==He||Ie.morphTargetsCount!==Ne)&&(ht=!0):ht=!0:ht=!0:ht=!0:ht=!0:(ht=!0,Ie.__version=je.version);let Rt=Ie.currentProgram;ht===!0&&(Rt=Gn(je,Ct,ke));let Ot=!1,Yt=!1,Sn=!1,dt=Rt.getUniforms(),ln=Ie.uniforms;if(Y.useProgram(Rt.program)&&(Ot=!0,Yt=!0,Sn=!0),je.id!==C&&(C=je.id,Yt=!0),Ot||X!==it){Y.buffers.depth.getReversed()?(b.copy(it.projectionMatrix),(function(xi){let bt=xi.elements;bt[2]=.5*bt[2]+.5*bt[3],bt[6]=.5*bt[6]+.5*bt[7],bt[10]=.5*bt[10]+.5*bt[11],bt[14]=.5*bt[14]+.5*bt[15]})(b),(function(xi){let bt=xi.elements;bt[11]===-1?(bt[10]=-bt[10]-1,bt[14]=-bt[14]):(bt[10]=-bt[10],bt[14]=1-bt[14])})(b),dt.setValue(J,"projectionMatrix",b)):dt.setValue(J,"projectionMatrix",it.projectionMatrix),dt.setValue(J,"viewMatrix",it.matrixWorldInverse);let jt=dt.map.cameraPosition;jt!==void 0&&jt.setValue(J,k.setFromMatrixPosition(it.matrixWorld)),ce.logarithmicDepthBuffer&&dt.setValue(J,"logDepthBufFC",2/(Math.log(it.far+1)/Math.LN2)),(je.isMeshPhongMaterial||je.isMeshToonMaterial||je.isMeshLambertMaterial||je.isMeshBasicMaterial||je.isMeshStandardMaterial||je.isShaderMaterial)&&dt.setValue(J,"isOrthographic",it.isOrthographicCamera===!0),X!==it&&(X=it,Yt=!0,Sn=!0)}if(ke.isSkinnedMesh){dt.setOptional(J,ke,"bindMatrix"),dt.setOptional(J,ke,"bindMatrixInverse");let jt=ke.skeleton;jt&&(jt.boneTexture===null&&jt.computeBoneTexture(),dt.setValue(J,"boneTexture",jt.boneTexture,pe))}ke.isBatchedMesh&&(dt.setOptional(J,ke,"batchingTexture"),dt.setValue(J,"batchingTexture",ke._matricesTexture,pe),dt.setOptional(J,ke,"batchingIdTexture"),dt.setValue(J,"batchingIdTexture",ke._indirectTexture,pe),dt.setOptional(J,ke,"batchingColorTexture"),ke._colorsTexture!==null&&dt.setValue(J,"batchingColorTexture",ke._colorsTexture,pe));let Dn=At.morphAttributes;Dn.position===void 0&&Dn.normal===void 0&&Dn.color===void 0||Ke.update(ke,At,Rt),(Yt||Ie.receiveShadow!==ke.receiveShadow)&&(Ie.receiveShadow=ke.receiveShadow,dt.setValue(J,"receiveShadow",ke.receiveShadow)),je.isMeshGouraudMaterial&&je.envMap!==null&&(ln.envMap.value=he,ln.flipEnvMap.value=he.isCubeTexture&&he.isRenderTargetTexture===!1?-1:1),je.isMeshStandardMaterial&&je.envMap===null&&Ct.environment!==null&&(ln.envMapIntensity.value=Ct.environmentIntensity),Yt&&(dt.setValue(J,"toneMappingExposure",y.toneMappingExposure),Ie.needsLights&&(en=Sn,(Wt=ln).ambientLightColor.needsUpdate=en,Wt.lightProbe.needsUpdate=en,Wt.directionalLights.needsUpdate=en,Wt.directionalLightShadows.needsUpdate=en,Wt.pointLights.needsUpdate=en,Wt.pointLightShadows.needsUpdate=en,Wt.spotLights.needsUpdate=en,Wt.spotLightShadows.needsUpdate=en,Wt.rectAreaLights.needsUpdate=en,Wt.hemisphereLights.needsUpdate=en),N&&je.fog===!0&&Le.refreshFogUniforms(ln,N),Le.refreshMaterialUniforms(ln,je,I,S,g.state.transmissionRenderTarget[it.id]),rr.upload(J,_i(Ie),ln,pe));var Wt,en;if(je.isShaderMaterial&&je.uniformsNeedUpdate===!0&&(rr.upload(J,_i(Ie),ln,pe),je.uniformsNeedUpdate=!1),je.isSpriteMaterial&&dt.setValue(J,"center",ke.center),dt.setValue(J,"modelViewMatrix",ke.modelViewMatrix),dt.setValue(J,"normalMatrix",ke.normalMatrix),dt.setValue(J,"modelMatrix",ke.matrixWorld),je.isShaderMaterial||je.isRawShaderMaterial){let jt=je.uniformsGroups;for(let xi=0,bt=jt.length;xi<bt;xi++){let Ll=jt[xi];on.update(Ll,Rt),on.bind(Ll,Rt)}}return Rt})(A,K,ne,de,ee);Y.setMaterial(de,Ae);let Fe=ne.index,Ge=1;if(de.wireframe===!0){if(Fe=we.getWireframeAttribute(ne),Fe===void 0)return;Ge=2}let Ye=ne.drawRange,ze=ne.attributes.position,Qe=Ye.start*Ge,yt=(Ye.start+Ye.count)*Ge;ge!==null&&(Qe=Math.max(Qe,ge.start*Ge),yt=Math.min(yt,(ge.start+ge.count)*Ge)),Fe!==null?(Qe=Math.max(Qe,0),yt=Math.min(yt,Fe.count)):ze!=null&&(Qe=Math.max(Qe,0),yt=Math.min(yt,ze.count));let ut=yt-Qe;if(ut<0||ut===1/0)return;let wt;Gt.setup(ee,de,De,ne,Fe);let pt=bn;if(Fe!==null&&(wt=Ce.get(Fe),pt=Hn,pt.setIndex(wt)),ee.isMesh)de.wireframe===!0?(Y.setLineWidth(de.wireframeLinewidth*z()),pt.setMode(J.LINES)):pt.setMode(J.TRIANGLES);else if(ee.isLine){let it=de.linewidth;it===void 0&&(it=1),Y.setLineWidth(it*z()),ee.isLineSegments?pt.setMode(J.LINES):ee.isLineLoop?pt.setMode(J.LINE_LOOP):pt.setMode(J.LINE_STRIP)}else ee.isPoints?pt.setMode(J.POINTS):ee.isSprite&&pt.setMode(J.TRIANGLES);if(ee.isBatchedMesh)if(ee._multiDrawInstances!==null)pt.renderMultiDrawInstances(ee._multiDrawStarts,ee._multiDrawCounts,ee._multiDrawCount,ee._multiDrawInstances);else if(q.get("WEBGL_multi_draw"))pt.renderMultiDraw(ee._multiDrawStarts,ee._multiDrawCounts,ee._multiDrawCount);else{let it=ee._multiDrawStarts,Ct=ee._multiDrawCounts,At=ee._multiDrawCount,je=Fe?Ce.get(Fe).bytesPerElement:1,ke=ae.get(de).currentProgram.getUniforms();for(let N=0;N<At;N++)ke.setValue(J,"_gl_DrawID",N),pt.render(it[N]/je,Ct[N])}else if(ee.isInstancedMesh)pt.renderInstances(Qe,ut,ee.count);else if(ne.isInstancedBufferGeometry){let it=ne._maxInstanceCount!==void 0?ne._maxInstanceCount:1/0,Ct=Math.min(ne.instanceCount,it);pt.renderInstances(Qe,ut,Ct)}else pt.render(Qe,ut)},this.compile=function(A,K,ne=null){ne===null&&(ne=A),g=at.get(ne),g.init(K),x.push(g),ne.traverseVisible((function(ee){ee.isLight&&ee.layers.test(K.layers)&&(g.pushLight(ee),ee.castShadow&&g.pushShadow(ee))})),A!==ne&&A.traverseVisible((function(ee){ee.isLight&&ee.layers.test(K.layers)&&(g.pushLight(ee),ee.castShadow&&g.pushShadow(ee))})),g.setupLights();let de=new Set;return A.traverse((function(ee){if(!(ee.isMesh||ee.isPoints||ee.isLine||ee.isSprite))return;let ge=ee.material;if(ge)if(Array.isArray(ge))for(let Ae=0;Ae<ge.length;Ae++){let De=ge[Ae];qt(De,ne,ee),de.add(De)}else qt(ge,ne,ee),de.add(ge)})),x.pop(),g=null,de},this.compileAsync=function(A,K,ne=null){let de=this.compile(A,K,ne);return new Promise((ee=>{function ge(){de.forEach((function(Ae){ae.get(Ae).currentProgram.isReady()&&de.delete(Ae)})),de.size!==0?setTimeout(ge,10):ee(A)}q.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)}))};let fn=null;function mn(){Qt.stop()}function vi(){Qt.start()}let Qt=new nh;function gn(A,K,ne,de){if(A.visible===!1)return;if(A.layers.test(K.layers)){if(A.isGroup)ne=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(K);else if(A.isLight)g.pushLight(A),A.castShadow&&g.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||re.intersectsSprite(A)){de&&P.setFromMatrixPosition(A.matrixWorld).applyMatrix4(F);let ge=nt.update(A),Ae=A.material;Ae.visible&&f.push(A,ge,Ae,ne,P.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||re.intersectsObject(A))){let ge=nt.update(A),Ae=A.material;if(de&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),P.copy(A.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),P.copy(ge.boundingSphere.center)),P.applyMatrix4(A.matrixWorld).applyMatrix4(F)),Array.isArray(Ae)){let De=ge.groups;for(let Fe=0,Ge=De.length;Fe<Ge;Fe++){let Ye=De[Fe],ze=Ae[Ye.materialIndex];ze&&ze.visible&&f.push(A,ge,ze,ne,P.z,Ye)}}else Ae.visible&&f.push(A,ge,Ae,ne,P.z,null)}}let ee=A.children;for(let ge=0,Ae=ee.length;ge<Ae;ge++)gn(ee[ge],K,ne,de)}function Vn(A,K,ne,de){let ee=A.opaque,ge=A.transmissive,Ae=A.transparent;g.setupLightsView(ne),ie===!0&&st.setGlobalState(y.clippingPlanes,ne),de&&Y.viewport(L.copy(de)),ee.length>0&&vn(ee,K,ne),ge.length>0&&vn(ge,K,ne),Ae.length>0&&vn(Ae,K,ne),Y.buffers.depth.setTest(!0),Y.buffers.depth.setMask(!0),Y.buffers.color.setMask(!0),Y.setPolygonOffset(!1)}function Mt(A,K,ne,de){if((ne.isScene===!0?ne.overrideMaterial:null)!==null)return;g.state.transmissionRenderTarget[de.id]===void 0&&(g.state.transmissionRenderTarget[de.id]=new yn(1,1,{generateMipmaps:!0,type:q.has("EXT_color_buffer_half_float")||q.has("EXT_color_buffer_float")?Yr:li,minFilter:er,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:lt.workingColorSpace}));let ee=g.state.transmissionRenderTarget[de.id],ge=de.viewport||L;ee.setSize(ge.z,ge.w);let Ae=y.getRenderTarget();y.setRenderTarget(ee),y.getClearColor(G),Q=y.getClearAlpha(),Q<1&&y.setClearColor(16777215,.5),y.clear(),M&&Oe.render(ne);let De=y.toneMapping;y.toneMapping=0;let Fe=de.viewport;if(de.viewport!==void 0&&(de.viewport=void 0),g.setupLightsView(de),ie===!0&&st.setGlobalState(y.clippingPlanes,de),vn(A,ne,de),pe.updateMultisampleRenderTarget(ee),pe.updateRenderTargetMipmap(ee),q.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let Ye=0,ze=K.length;Ye<ze;Ye++){let Qe=K[Ye],yt=Qe.object,ut=Qe.geometry,wt=Qe.material,pt=Qe.group;if(wt.side===2&&yt.layers.test(de.layers)){let it=wt.side;wt.side=1,wt.needsUpdate=!0,Ln(yt,ne,de,ut,wt,pt),wt.side=it,wt.needsUpdate=!0,Ge=!0}}Ge===!0&&(pe.updateMultisampleRenderTarget(ee),pe.updateRenderTargetMipmap(ee))}y.setRenderTarget(Ae),y.setClearColor(G,Q),Fe!==void 0&&(de.viewport=Fe),y.toneMapping=De}function vn(A,K,ne){let de=K.isScene===!0?K.overrideMaterial:null;for(let ee=0,ge=A.length;ee<ge;ee++){let Ae=A[ee],De=Ae.object,Fe=Ae.geometry,Ge=de===null?Ae.material:de,Ye=Ae.group;De.layers.test(ne.layers)&&Ln(De,K,ne,Fe,Ge,Ye)}}function Ln(A,K,ne,de,ee,ge){A.onBeforeRender(y,K,ne,de,ee,ge),A.modelViewMatrix.multiplyMatrices(ne.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),ee.onBeforeRender(y,K,ne,de,A,ge),ee.transparent===!0&&ee.side===2&&ee.forceSinglePass===!1?(ee.side=1,ee.needsUpdate=!0,y.renderBufferDirect(ne,K,de,ee,A,ge),ee.side=0,ee.needsUpdate=!0,y.renderBufferDirect(ne,K,de,ee,A,ge),ee.side=2):y.renderBufferDirect(ne,K,de,ee,A,ge),A.onAfterRender(y,K,ne,de,ee,ge)}function Gn(A,K,ne){K.isScene!==!0&&(K=B);let de=ae.get(A),ee=g.state.lights,ge=g.state.shadowsArray,Ae=ee.state.version,De=Ve.getParameters(A,ee.state,ge,K,ne),Fe=Ve.getProgramCacheKey(De),Ge=de.programs;de.environment=A.isMeshStandardMaterial?K.environment:null,de.fog=K.fog,de.envMap=(A.isMeshStandardMaterial?Ee:fe).get(A.envMap||de.environment),de.envMapRotation=de.environment!==null&&A.envMap===null?K.environmentRotation:A.envMapRotation,Ge===void 0&&(A.addEventListener("dispose",$e),Ge=new Map,de.programs=Ge);let Ye=Ge.get(Fe);if(Ye!==void 0){if(de.currentProgram===Ye&&de.lightsStateVersion===Ae)return Sr(A,De),Ye}else De.uniforms=Ve.getUniforms(A),A.onBeforeCompile(De,y),Ye=Ve.acquireProgram(De,Fe),Ge.set(Fe,Ye),de.uniforms=De.uniforms;let ze=de.uniforms;return(A.isShaderMaterial||A.isRawShaderMaterial)&&A.clipping!==!0||(ze.clippingPlanes=st.uniform),Sr(A,De),de.needsLights=(function(Qe){return Qe.isMeshLambertMaterial||Qe.isMeshToonMaterial||Qe.isMeshPhongMaterial||Qe.isMeshStandardMaterial||Qe.isShadowMaterial||Qe.isShaderMaterial&&Qe.lights===!0})(A),de.lightsStateVersion=Ae,de.needsLights&&(ze.ambientLightColor.value=ee.state.ambient,ze.lightProbe.value=ee.state.probe,ze.directionalLights.value=ee.state.directional,ze.directionalLightShadows.value=ee.state.directionalShadow,ze.spotLights.value=ee.state.spot,ze.spotLightShadows.value=ee.state.spotShadow,ze.rectAreaLights.value=ee.state.rectArea,ze.ltc_1.value=ee.state.rectAreaLTC1,ze.ltc_2.value=ee.state.rectAreaLTC2,ze.pointLights.value=ee.state.point,ze.pointLightShadows.value=ee.state.pointShadow,ze.hemisphereLights.value=ee.state.hemi,ze.directionalShadowMap.value=ee.state.directionalShadowMap,ze.directionalShadowMatrix.value=ee.state.directionalShadowMatrix,ze.spotShadowMap.value=ee.state.spotShadowMap,ze.spotLightMatrix.value=ee.state.spotLightMatrix,ze.spotLightMap.value=ee.state.spotLightMap,ze.pointShadowMap.value=ee.state.pointShadowMap,ze.pointShadowMatrix.value=ee.state.pointShadowMatrix),de.currentProgram=Ye,de.uniformsList=null,Ye}function _i(A){if(A.uniformsList===null){let K=A.currentProgram.getUniforms();A.uniformsList=rr.seqWithValue(K.seq,A.uniforms)}return A.uniformsList}function Sr(A,K){let ne=ae.get(A);ne.outputColorSpace=K.outputColorSpace,ne.batching=K.batching,ne.batchingColor=K.batchingColor,ne.instancing=K.instancing,ne.instancingColor=K.instancingColor,ne.instancingMorph=K.instancingMorph,ne.skinning=K.skinning,ne.morphTargets=K.morphTargets,ne.morphNormals=K.morphNormals,ne.morphColors=K.morphColors,ne.morphTargetsCount=K.morphTargetsCount,ne.numClippingPlanes=K.numClippingPlanes,ne.numIntersection=K.numClipIntersection,ne.vertexAlphas=K.vertexAlphas,ne.vertexTangents=K.vertexTangents,ne.toneMapping=K.toneMapping}Qt.setAnimationLoop((function(A){fn&&fn(A)})),typeof self<"u"&&Qt.setContext(self),this.setAnimationLoop=function(A){fn=A,Tt.setAnimationLoop(A),A===null?Qt.stop():Qt.start()},Tt.addEventListener("sessionstart",mn),Tt.addEventListener("sessionend",vi),this.render=function(A,K){if(K!==void 0&&K.isCamera!==!0)return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");if(w===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),K.parent===null&&K.matrixWorldAutoUpdate===!0&&K.updateMatrixWorld(),Tt.enabled===!0&&Tt.isPresenting===!0&&(Tt.cameraAutoUpdate===!0&&Tt.updateCamera(K),K=Tt.getCamera()),A.isScene===!0&&A.onBeforeRender(y,A,K,V),g=at.get(A,x.length),g.init(K),x.push(g),F.multiplyMatrices(K.projectionMatrix,K.matrixWorldInverse),re.setFromProjectionMatrix(F),T=this.localClippingEnabled,ie=st.init(this.clippingPlanes,T),f=et.get(A,v.length),f.init(),v.push(f),Tt.enabled===!0&&Tt.isPresenting===!0){let ge=y.xr.getDepthSensingMesh();ge!==null&&gn(ge,K,-1/0,y.sortObjects)}gn(A,K,0,y.sortObjects),f.finish(),y.sortObjects===!0&&f.sort(O,H),M=Tt.enabled===!1||Tt.isPresenting===!1||Tt.hasDepthSensing()===!1,M&&Oe.addToRenderList(f,A),this.info.render.frame++,ie===!0&&st.beginShadows();let ne=g.state.shadowsArray;Re.render(ne,A,K),ie===!0&&st.endShadows(),this.info.autoReset===!0&&this.info.reset();let de=f.opaque,ee=f.transmissive;if(g.setupLights(),K.isArrayCamera){let ge=K.cameras;if(ee.length>0)for(let Ae=0,De=ge.length;Ae<De;Ae++)Mt(de,ee,A,ge[Ae]);M&&Oe.render(A);for(let Ae=0,De=ge.length;Ae<De;Ae++){let Fe=ge[Ae];Vn(f,A,Fe,Fe.viewport)}}else ee.length>0&&Mt(de,ee,A,K),M&&Oe.render(A),Vn(f,A,K);V!==null&&(pe.updateMultisampleRenderTarget(V),pe.updateRenderTargetMipmap(V)),A.isScene===!0&&A.onAfterRender(y,A,K),Gt.resetDefaultState(),C=-1,X=null,x.pop(),x.length>0?(g=x[x.length-1],ie===!0&&st.setGlobalState(y.clippingPlanes,g.state.camera)):g=null,v.pop(),f=v.length>0?v[v.length-1]:null},this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return U},this.getRenderTarget=function(){return V},this.setRenderTargetTextures=function(A,K,ne){ae.get(A.texture).__webglTexture=K,ae.get(A.depthTexture).__webglTexture=ne;let de=ae.get(A);de.__hasExternalTextures=!0,de.__autoAllocateDepthBuffer=ne===void 0,de.__autoAllocateDepthBuffer||q.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),de.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,K){let ne=ae.get(A);ne.__webglFramebuffer=K,ne.__useDefaultFramebuffer=K===void 0},this.setRenderTarget=function(A,K=0,ne=0){V=A,E=K,U=ne;let de=!0,ee=null,ge=!1,Ae=!1;if(A){let De=ae.get(A);if(De.__useDefaultFramebuffer!==void 0)Y.bindFramebuffer(J.FRAMEBUFFER,null),de=!1;else if(De.__webglFramebuffer===void 0)pe.setupRenderTarget(A);else if(De.__hasExternalTextures)pe.rebindTextures(A,ae.get(A.texture).__webglTexture,ae.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let Ye=A.depthTexture;if(De.__boundDepthTexture!==Ye){if(Ye!==null&&ae.has(Ye)&&(A.width!==Ye.image.width||A.height!==Ye.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");pe.setupDepthRenderbuffer(A)}}let Fe=A.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(Ae=!0);let Ge=ae.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(ee=Array.isArray(Ge[K])?Ge[K][ne]:Ge[K],ge=!0):ee=A.samples>0&&pe.useMultisampledRTT(A)===!1?ae.get(A).__webglMultisampledFramebuffer:Array.isArray(Ge)?Ge[ne]:Ge,L.copy(A.viewport),D.copy(A.scissor),j=A.scissorTest}else L.copy(W).multiplyScalar(I).floor(),D.copy(Z).multiplyScalar(I).floor(),j=le;if(Y.bindFramebuffer(J.FRAMEBUFFER,ee)&&de&&Y.drawBuffers(A,ee),Y.viewport(L),Y.scissor(D),Y.setScissorTest(j),ge){let De=ae.get(A.texture);J.framebufferTexture2D(J.FRAMEBUFFER,J.COLOR_ATTACHMENT0,J.TEXTURE_CUBE_MAP_POSITIVE_X+K,De.__webglTexture,ne)}else if(Ae){let De=ae.get(A.texture),Fe=K||0;J.framebufferTextureLayer(J.FRAMEBUFFER,J.COLOR_ATTACHMENT0,De.__webglTexture,ne||0,Fe)}C=-1},this.readRenderTargetPixels=function(A,K,ne,de,ee,ge,Ae){if(!A||!A.isWebGLRenderTarget)return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let De=ae.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ae!==void 0&&(De=De[Ae]),De){Y.bindFramebuffer(J.FRAMEBUFFER,De);try{let Fe=A.texture,Ge=Fe.format,Ye=Fe.type;if(!ce.textureFormatReadable(Ge))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");if(!ce.textureTypeReadable(Ye))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");K>=0&&K<=A.width-de&&ne>=0&&ne<=A.height-ee&&J.readPixels(K,ne,de,ee,Dt.convert(Ge),Dt.convert(Ye),ge)}finally{let Fe=V!==null?ae.get(V).__webglFramebuffer:null;Y.bindFramebuffer(J.FRAMEBUFFER,Fe)}}},this.readRenderTargetPixelsAsync=async function(A,K,ne,de,ee,ge,Ae){if(!A||!A.isWebGLRenderTarget)throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let De=ae.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ae!==void 0&&(De=De[Ae]),De){let Fe=A.texture,Ge=Fe.format,Ye=Fe.type;if(!ce.textureFormatReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ce.textureTypeReadable(Ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(K>=0&&K<=A.width-de&&ne>=0&&ne<=A.height-ee){Y.bindFramebuffer(J.FRAMEBUFFER,De);let ze=J.createBuffer();J.bindBuffer(J.PIXEL_PACK_BUFFER,ze),J.bufferData(J.PIXEL_PACK_BUFFER,ge.byteLength,J.STREAM_READ),J.readPixels(K,ne,de,ee,Dt.convert(Ge),Dt.convert(Ye),0);let Qe=V!==null?ae.get(V).__webglFramebuffer:null;Y.bindFramebuffer(J.FRAMEBUFFER,Qe);let yt=J.fenceSync(J.SYNC_GPU_COMMANDS_COMPLETE,0);return J.flush(),await(function(ut,wt,pt){return new Promise((function(it,Ct){setTimeout((function At(){switch(ut.clientWaitSync(wt,ut.SYNC_FLUSH_COMMANDS_BIT,0)){case ut.WAIT_FAILED:Ct();break;case ut.TIMEOUT_EXPIRED:setTimeout(At,pt);break;default:it()}}),pt)}))})(J,yt,4),J.bindBuffer(J.PIXEL_PACK_BUFFER,ze),J.getBufferSubData(J.PIXEL_PACK_BUFFER,0,ge),J.deleteBuffer(ze),J.deleteSync(yt),ge}throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,K=null,ne=0){A.isTexture!==!0&&(Pr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),K=arguments[0]||null,A=arguments[1]);let de=Math.pow(2,-ne),ee=Math.floor(A.image.width*de),ge=Math.floor(A.image.height*de),Ae=K!==null?K.x:0,De=K!==null?K.y:0;pe.setTexture2D(A,0),J.copyTexSubImage2D(J.TEXTURE_2D,ne,0,0,Ae,De,ee,ge),Y.unbindTexture()},this.copyTextureToTexture=function(A,K,ne=null,de=null,ee=0){let ge,Ae,De,Fe,Ge,Ye,ze,Qe,yt;A.isTexture!==!0&&(Pr("WebGLRenderer: copyTextureToTexture function signature has changed."),de=arguments[0]||null,A=arguments[1],K=arguments[2],ee=arguments[3]||0,ne=null);let ut=A.isCompressedTexture?A.mipmaps[ee]:A.image;ne!==null?(ge=ne.max.x-ne.min.x,Ae=ne.max.y-ne.min.y,De=ne.isBox3?ne.max.z-ne.min.z:1,Fe=ne.min.x,Ge=ne.min.y,Ye=ne.isBox3?ne.min.z:0):(ge=ut.width,Ae=ut.height,De=ut.depth||1,Fe=0,Ge=0,Ye=0),de!==null?(ze=de.x,Qe=de.y,yt=de.z):(ze=0,Qe=0,yt=0);let wt=Dt.convert(K.format),pt=Dt.convert(K.type),it;K.isData3DTexture?(pe.setTexture3D(K,0),it=J.TEXTURE_3D):K.isDataArrayTexture||K.isCompressedArrayTexture?(pe.setTexture2DArray(K,0),it=J.TEXTURE_2D_ARRAY):(pe.setTexture2D(K,0),it=J.TEXTURE_2D),J.pixelStorei(J.UNPACK_FLIP_Y_WEBGL,K.flipY),J.pixelStorei(J.UNPACK_PREMULTIPLY_ALPHA_WEBGL,K.premultiplyAlpha),J.pixelStorei(J.UNPACK_ALIGNMENT,K.unpackAlignment);let Ct=J.getParameter(J.UNPACK_ROW_LENGTH),At=J.getParameter(J.UNPACK_IMAGE_HEIGHT),je=J.getParameter(J.UNPACK_SKIP_PIXELS),ke=J.getParameter(J.UNPACK_SKIP_ROWS),N=J.getParameter(J.UNPACK_SKIP_IMAGES);J.pixelStorei(J.UNPACK_ROW_LENGTH,ut.width),J.pixelStorei(J.UNPACK_IMAGE_HEIGHT,ut.height),J.pixelStorei(J.UNPACK_SKIP_PIXELS,Fe),J.pixelStorei(J.UNPACK_SKIP_ROWS,Ge),J.pixelStorei(J.UNPACK_SKIP_IMAGES,Ye);let se=A.isDataArrayTexture||A.isData3DTexture,xe=K.isDataArrayTexture||K.isData3DTexture;if(A.isRenderTargetTexture||A.isDepthTexture){let he=ae.get(A),Se=ae.get(K),ue=ae.get(he.__renderTarget),Me=ae.get(Se.__renderTarget);Y.bindFramebuffer(J.READ_FRAMEBUFFER,ue.__webglFramebuffer),Y.bindFramebuffer(J.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let _e=0;_e<De;_e++)se&&J.framebufferTextureLayer(J.READ_FRAMEBUFFER,J.COLOR_ATTACHMENT0,ae.get(A).__webglTexture,ee,Ye+_e),A.isDepthTexture?(xe&&J.framebufferTextureLayer(J.DRAW_FRAMEBUFFER,J.COLOR_ATTACHMENT0,ae.get(K).__webglTexture,ee,yt+_e),J.blitFramebuffer(Fe,Ge,ge,Ae,ze,Qe,ge,Ae,J.DEPTH_BUFFER_BIT,J.NEAREST)):xe?J.copyTexSubImage3D(it,ee,ze,Qe,yt+_e,Fe,Ge,ge,Ae):J.copyTexSubImage2D(it,ee,ze,Qe,yt+_e,Fe,Ge,ge,Ae);Y.bindFramebuffer(J.READ_FRAMEBUFFER,null),Y.bindFramebuffer(J.DRAW_FRAMEBUFFER,null)}else xe?A.isDataTexture||A.isData3DTexture?J.texSubImage3D(it,ee,ze,Qe,yt,ge,Ae,De,wt,pt,ut.data):K.isCompressedArrayTexture?J.compressedTexSubImage3D(it,ee,ze,Qe,yt,ge,Ae,De,wt,ut.data):J.texSubImage3D(it,ee,ze,Qe,yt,ge,Ae,De,wt,pt,ut):A.isDataTexture?J.texSubImage2D(J.TEXTURE_2D,ee,ze,Qe,ge,Ae,wt,pt,ut.data):A.isCompressedTexture?J.compressedTexSubImage2D(J.TEXTURE_2D,ee,ze,Qe,ut.width,ut.height,wt,ut.data):J.texSubImage2D(J.TEXTURE_2D,ee,ze,Qe,ge,Ae,wt,pt,ut);J.pixelStorei(J.UNPACK_ROW_LENGTH,Ct),J.pixelStorei(J.UNPACK_IMAGE_HEIGHT,At),J.pixelStorei(J.UNPACK_SKIP_PIXELS,je),J.pixelStorei(J.UNPACK_SKIP_ROWS,ke),J.pixelStorei(J.UNPACK_SKIP_IMAGES,N),ee===0&&K.generateMipmaps&&J.generateMipmap(it),Y.unbindTexture()},this.copyTextureToTexture3D=function(A,K,ne=null,de=null,ee=0){return A.isTexture!==!0&&(Pr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ne=arguments[0]||null,de=arguments[1]||null,A=arguments[2],K=arguments[3],ee=arguments[4]||0),Pr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,K,ne,de,ee)},this.initRenderTarget=function(A){ae.get(A).__webglFramebuffer===void 0&&pe.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?pe.setTextureCube(A,0):A.isData3DTexture?pe.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?pe.setTexture2DArray(A,0):pe.setTexture2D(A,0),Y.unbindTexture()},this.resetState=function(){E=0,U=0,V=null,Y.reset(),Gt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return cr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=lt._getDrawingBufferColorSpace(e),t.unpackColorSpace=lt._getUnpackColorSpace()}};var dr=class extends Cn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Bn,this.environmentIntensity=1,this.environmentRotation=new Bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var Vp=new R;var Gp=new R,Wp=new R,jp=new R,Xp=new me,qp=new me,Yp=new Be,Zp=new R,Jp=new R,Kp=new R,$p=new me,Qp=new me,ef=new me;var tf=new R,nf=new R;var rf=new R,sf=new xt,af=new xt,of=new R,lf=new Be,cf=new R,hf=new Fn,uf=new Be,df=new Qn;var pf=new Be,ff=new Be;var mf=new Be,gf=new Be;var vf=new pn,_f=new Be,xf=new Pt,yf=new Fn;var ko=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,i){let s=this.pool,a=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});let o=s[this.index];a.push(o),this.index++,o.start=e,o.count=t,o.z=n,o.index=i}reset(){this.list.length=0,this.index=0}},Mf=new Be,bf=new qe(1,1,1),Sf=new kr,Tf=new pn,Ef=new Fn,wf=new R,Af=new R,Rf=new R,Cf=new ko,Pf=new Pt;var If=new R,Lf=new R,Df=new Be,Uf=new Qn,Nf=new Fn,Of=new R,Ff=new R;var Bf=new R,zf=new R;var kf=new Be,Hf=new Qn,Vf=new Fn,Gf=new R;var Mn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,i=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),i=0,s=n.length,a;a=t||e*n[s-1];let o,l=0,c=s-1;for(;l<=c;)if(i=Math.floor(l+(c-l)/2),o=n[i]-a,o<0)l=i+1;else{if(!(o>0)){c=i;break}c=i-1}if(i=c,n[i]===a)return i/(s-1);let h=n[i];return(i+(a-h)/(n[i+1]-h))/(s-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);let a=this.getPoint(i),o=this.getPoint(s),l=t||(a.isVector2?new me:new R);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new R,i=[],s=[],a=[],o=new R,l=new Be;for(let p=0;p<=e;p++){let m=p/e;i[p]=this.getTangentAt(m,new R)}s[0]=new R,a[0]=new R;let c=Number.MAX_VALUE,h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],o),a[0].crossVectors(i[0],s[0]);for(let p=1;p<=e;p++){if(s[p]=s[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(i[p-1],i[p]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(Nt(i[p-1].dot(i[p]),-1,1));s[p].applyMatrix4(l.makeRotationAxis(o,m))}a[p].crossVectors(i[p],s[p])}if(t===!0){let p=Math.acos(Nt(s[0].dot(s[e]),-1,1));p/=e,i[0].dot(o.crossVectors(s[0],s[e]))>0&&(p=-p);for(let m=1;m<=e;m++)s[m].applyMatrix4(l.makeRotationAxis(i[m],p*m)),a[m].crossVectors(i[m],s[m])}return{tangents:i,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Vr=class extends Mn{constructor(e=0,t=0,n=1,i=1,s=0,a=2*Math.PI,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new me){let n=t,i=2*Math.PI,s=this.aEndAngle-this.aStartAngle,a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(s=a?0:i),this.aClockwise!==!0||a||(s===i?s=-i:s-=i);let o=this.aStartAngle+e*s,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*h-p*u+this.aX,c=d*u+p*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ho=class extends Vr{constructor(e,t,n,i,s,a){super(e,t,n,n,i,s,a),this.isArcCurve=!0,this.type="ArcCurve"}};function El(){let r=0,e=0,t=0,n=0;function i(s,a,o,l){r=s,e=o,t=-3*s+3*a-2*o-l,n=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){i(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,u){let d=(a-s)/c-(o-s)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,p*=h,i(a,o,d,p)},calc:function(s){let a=s*s;return r+e*s+t*a+n*(a*s)}}}var gs=new R,Ba=new El,za=new El,ka=new El,pr=class extends Mn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new R){let n=t,i=this.points,s=i.length,a=(s-(this.closed?0:1))*e,o,l,c=Math.floor(a),h=a-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:h===0&&c===s-1&&(c=s-2,h=1),this.closed||c>0?o=i[(c-1)%s]:(gs.subVectors(i[0],i[1]).add(i[0]),o=gs);let u=i[c%s],d=i[(c+1)%s];if(this.closed||c+2<s?l=i[(c+2)%s]:(gs.subVectors(i[s-1],i[s-2]).add(i[s-1]),l=gs),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,m=Math.pow(o.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(d),p),f=Math.pow(d.distanceToSquared(l),p);_<1e-4&&(_=1),m<1e-4&&(m=_),f<1e-4&&(f=_),Ba.initNonuniformCatmullRom(o.x,u.x,d.x,l.x,m,_,f),za.initNonuniformCatmullRom(o.y,u.y,d.y,l.y,m,_,f),ka.initNonuniformCatmullRom(o.z,u.z,d.z,l.z,m,_,f)}else this.curveType==="catmullrom"&&(Ba.initCatmullRom(o.x,u.x,d.x,l.x,this.tension),za.initCatmullRom(o.y,u.y,d.y,l.y,this.tension),ka.initCatmullRom(o.z,u.z,d.z,l.z,this.tension));return n.set(Ba.calc(h),za.calc(h),ka.calc(h)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new R().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Cc(r,e,t,n,i){let s=.5*(n-e),a=.5*(i-t),o=r*r;return(2*t-2*n+s+a)*(r*o)+(-3*t+3*n-2*s-a)*o+s*r+t}function Dr(r,e,t,n){return(function(i,s){let a=1-i;return a*a*s})(r,e)+(function(i,s){return 2*(1-i)*i*s})(r,t)+(function(i,s){return i*i*s})(r,n)}function Ur(r,e,t,n,i){return(function(s,a){let o=1-s;return o*o*o*a})(r,e)+(function(s,a){let o=1-s;return 3*o*o*s*a})(r,t)+(function(s,a){return 3*(1-s)*s*s*a})(r,n)+(function(s,a){return s*s*s*a})(r,i)}var Bs=class extends Mn{constructor(e=new me,t=new me,n=new me,i=new me){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new me){let n=t,i=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Ur(e,i.x,s.x,a.x,o.x),Ur(e,i.y,s.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Vo=class extends Mn{constructor(e=new R,t=new R,n=new R,i=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new R){let n=t,i=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Ur(e,i.x,s.x,a.x,o.x),Ur(e,i.y,s.y,a.y,o.y),Ur(e,i.z,s.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},zs=class extends Mn{constructor(e=new me,t=new me){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new me){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new me){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Go=class extends Mn{constructor(e=new R,t=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new R){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new R){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ks=class extends Mn{constructor(e=new me,t=new me,n=new me){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new me){let n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Dr(e,i.x,s.x,a.x),Dr(e,i.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Hs=class extends Mn{constructor(e=new R,t=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new R){let n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Dr(e,i.x,s.x,a.x),Dr(e,i.y,s.y,a.y),Dr(e,i.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Vs=class extends Mn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new me){let n=t,i=this.points,s=(i.length-1)*e,a=Math.floor(s),o=s-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(Cc(o,l.x,c.x,h.x,u.x),Cc(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new me().fromArray(i))}return this}},Gs=Object.freeze({__proto__:null,ArcCurve:Ho,CatmullRomCurve3:pr,CubicBezierCurve:Bs,CubicBezierCurve3:Vo,EllipseCurve:Vr,LineCurve:zs,LineCurve3:Go,QuadraticBezierCurve:ks,QuadraticBezierCurve3:Hs,SplineCurve:Vs}),Wo=class extends Mn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Gs[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),i=this.getCurveLengths(),s=0;for(;s<i.length;){if(i[s]>=n){let a=i[s]-n,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let i=0,s=this.curves;i<s.length;i++){let a=s[i],o=a.isEllipseCurve?2*e:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(new Gs[i.type]().fromJSON(i))}return this}},Gr=class extends Wo{constructor(e){super(),this.type="Path",this.currentPoint=new me,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new zs(this.currentPoint.clone(),new me(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){let s=new ks(this.currentPoint.clone(),new me(e,t),new me(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,s,a){let o=new Bs(this.currentPoint.clone(),new me(e,t),new me(n,i),new me(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Vs(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,s,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,i,s,a),this}absarc(e,t,n,i,s,a){return this.absellipse(e,t,n,n,i,s,a),this}ellipse(e,t,n,i,s,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,i,s,a,o,l),this}absellipse(e,t,n,i,s,a,o,l){let c=new Vr(e,t,n,i,s,a,o,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Ws=class r extends mt{constructor(e=[new me(0,-.5),new me(.5,0),new me(0,.5)],t=12,n=0,i=2*Math.PI){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=Nt(i,0,2*Math.PI);let s=[],a=[],o=[],l=[],c=[],h=1/t,u=new R,d=new me,p=new R,m=new R,_=new R,f=0,g=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:f=e[v+1].x-e[v].x,g=e[v+1].y-e[v].y,p.x=1*g,p.y=-f,p.z=0*g,_.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:f=e[v+1].x-e[v].x,g=e[v+1].y-e[v].y,p.x=1*g,p.y=-f,p.z=0*g,m.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),l.push(p.x,p.y,p.z),_.copy(m)}for(let v=0;v<=t;v++){let x=n+v*h*i,y=Math.sin(x),w=Math.cos(x);for(let E=0;E<=e.length-1;E++){u.x=e[E].x*y,u.y=e[E].y,u.z=e[E].x*w,a.push(u.x,u.y,u.z),d.x=v/t,d.y=E/(e.length-1),o.push(d.x,d.y);let U=l[3*E+0]*y,V=l[3*E+1],C=l[3*E+0]*w;c.push(U,V,C)}}for(let v=0;v<t;v++)for(let x=0;x<e.length-1;x++){let y=x+v*e.length,w=y,E=y+e.length,U=y+e.length+1,V=y+1;s.push(w,E,V),s.push(U,V,E)}this.setIndex(s),this.setAttribute("position",new Ue(a,3)),this.setAttribute("uv",new Ue(o,2)),this.setAttribute("normal",new Ue(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.points,e.segments,e.phiStart,e.phiLength)}},jo=class r extends Ws{constructor(e=1,t=1,n=4,i=8){let s=new Gr;s.absarc(0,-t/2,e,1.5*Math.PI,0),s.absarc(0,t/2,e,0,.5*Math.PI),super(s.getPoints(n),i),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:i}}static fromJSON(e){return new r(e.radius,e.length,e.capSegments,e.radialSegments)}},Ui=class r extends mt{constructor(e=1,t=32,n=0,i=2*Math.PI){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);let s=[],a=[],o=[],l=[],c=new R,h=new me;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let p=n+u/t*i;c.x=e*Math.cos(p),c.y=e*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new Ue(a,3)),this.setAttribute("normal",new Ue(o,3)),this.setAttribute("uv",new Ue(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.segments,e.thetaStart,e.thetaLength)}},js=class r extends mt{constructor(e=1,t=1,n=1,i=32,s=1,a=!1,o=0,l=2*Math.PI){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};let c=this;i=Math.floor(i),s=Math.floor(s);let h=[],u=[],d=[],p=[],m=0,_=[],f=n/2,g=0;function v(x){let y=m,w=new me,E=new R,U=0,V=x===!0?e:t,C=x===!0?1:-1;for(let L=1;L<=i;L++)u.push(0,f*C,0),d.push(0,C,0),p.push(.5,.5),m++;let X=m;for(let L=0;L<=i;L++){let D=L/i*l+o,j=Math.cos(D),G=Math.sin(D);E.x=V*G,E.y=f*C,E.z=V*j,u.push(E.x,E.y,E.z),d.push(0,C,0),w.x=.5*j+.5,w.y=.5*G*C+.5,p.push(w.x,w.y),m++}for(let L=0;L<i;L++){let D=y+L,j=X+L;x===!0?h.push(j,j+1,D):h.push(j+1,j,D),U+=3}c.addGroup(g,U,x===!0?1:2),g+=U}(function(){let x=new R,y=new R,w=0,E=(t-e)/n;for(let U=0;U<=s;U++){let V=[],C=U/s,X=C*(t-e)+e;for(let L=0;L<=i;L++){let D=L/i,j=D*l+o,G=Math.sin(j),Q=Math.cos(j);y.x=X*G,y.y=-C*n+f,y.z=X*Q,u.push(y.x,y.y,y.z),x.set(G,E,Q).normalize(),d.push(x.x,x.y,x.z),p.push(D,1-C),V.push(m++)}_.push(V)}for(let U=0;U<i;U++)for(let V=0;V<s;V++){let C=_[V][U],X=_[V+1][U],L=_[V+1][U+1],D=_[V][U+1];(e>0||V!==0)&&(h.push(C,X,D),w+=3),(t>0||V!==s-1)&&(h.push(X,L,D),w+=3)}c.addGroup(g,w,0),g+=w})(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new Ue(u,3)),this.setAttribute("normal",new Ue(d,3)),this.setAttribute("uv",new Ue(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Xo=class r extends js{constructor(e=1,t=1,n=32,i=1,s=!1,a=0,o=2*Math.PI){super(0,e,t,n,i,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new r(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Ni=class r extends mt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};let s=[],a=[];function o(d,p,m,_){let f=_+1,g=[];for(let v=0;v<=f;v++){g[v]=[];let x=d.clone().lerp(m,v/f),y=p.clone().lerp(m,v/f),w=f-v;for(let E=0;E<=w;E++)g[v][E]=E===0&&v===f?x:x.clone().lerp(y,E/w)}for(let v=0;v<f;v++)for(let x=0;x<2*(f-v)-1;x++){let y=Math.floor(x/2);x%2==0?(l(g[v][y+1]),l(g[v+1][y]),l(g[v][y])):(l(g[v][y+1]),l(g[v+1][y+1]),l(g[v+1][y]))}}function l(d){s.push(d.x,d.y,d.z)}function c(d,p){let m=3*d;p.x=e[m+0],p.y=e[m+1],p.z=e[m+2]}function h(d,p,m,_){_<0&&d.x===1&&(a[p]=d.x-1),m.x===0&&m.z===0&&(a[p]=_/2/Math.PI+.5)}function u(d){return Math.atan2(d.z,-d.x)}(function(d){let p=new R,m=new R,_=new R;for(let f=0;f<t.length;f+=3)c(t[f+0],p),c(t[f+1],m),c(t[f+2],_),o(p,m,_,d)})(i),(function(d){let p=new R;for(let m=0;m<s.length;m+=3)p.x=s[m+0],p.y=s[m+1],p.z=s[m+2],p.normalize().multiplyScalar(d),s[m+0]=p.x,s[m+1]=p.y,s[m+2]=p.z})(n),(function(){let d=new R;for(let m=0;m<s.length;m+=3){d.x=s[m+0],d.y=s[m+1],d.z=s[m+2];let _=u(d)/2/Math.PI+.5,f=(p=d,Math.atan2(-p.y,Math.sqrt(p.x*p.x+p.z*p.z))/Math.PI+.5);a.push(_,1-f)}var p;(function(){let m=new R,_=new R,f=new R,g=new R,v=new me,x=new me,y=new me;for(let w=0,E=0;w<s.length;w+=9,E+=6){m.set(s[w+0],s[w+1],s[w+2]),_.set(s[w+3],s[w+4],s[w+5]),f.set(s[w+6],s[w+7],s[w+8]),v.set(a[E+0],a[E+1]),x.set(a[E+2],a[E+3]),y.set(a[E+4],a[E+5]),g.copy(m).add(_).add(f).divideScalar(3);let U=u(g);h(v,E+0,m,U),h(x,E+2,_,U),h(y,E+4,f,U)}})(),(function(){for(let m=0;m<a.length;m+=6){let _=a[m+0],f=a[m+2],g=a[m+4],v=Math.max(_,f,g),x=Math.min(_,f,g);v>.9&&x<.1&&(_<.2&&(a[m+0]+=1),f<.2&&(a[m+2]+=1),g<.2&&(a[m+4]+=1))}})()})(),this.setAttribute("position",new Ue(s,3)),this.setAttribute("normal",new Ue(s.slice(),3)),this.setAttribute("uv",new Ue(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.vertices,e.indices,e.radius,e.details)}},qo=class r extends Ni{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,i=1/n;super([-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},vs=new R,_s=new R,Ha=new R,xs=new ai,Yo=class extends mt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let i=Math.pow(10,4),s=Math.cos(nr*t),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},p=[];for(let m=0;m<l;m+=3){a?(c[0]=a.getX(m),c[1]=a.getX(m+1),c[2]=a.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);let{a:_,b:f,c:g}=xs;if(_.fromBufferAttribute(o,c[0]),f.fromBufferAttribute(o,c[1]),g.fromBufferAttribute(o,c[2]),xs.getNormal(Ha),u[0]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,u[1]=`${Math.round(f.x*i)},${Math.round(f.y*i)},${Math.round(f.z*i)}`,u[2]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,u[0]!==u[1]&&u[1]!==u[2]&&u[2]!==u[0])for(let v=0;v<3;v++){let x=(v+1)%3,y=u[v],w=u[x],E=xs[h[v]],U=xs[h[x]],V=`${y}_${w}`,C=`${w}_${y}`;C in d&&d[C]?(Ha.dot(d[C].normal)<=s&&(p.push(E.x,E.y,E.z),p.push(U.x,U.y,U.z)),d[C]=null):V in d||(d[V]={index0:c[v],index1:c[x],normal:Ha.clone()})}}for(let m in d)if(d[m]){let{index0:_,index1:f}=d[m];vs.fromBufferAttribute(o,_),_s.fromBufferAttribute(o,f),p.push(vs.x,vs.y,vs.z),p.push(_s.x,_s.y,_s.z)}this.setAttribute("position",new Ue(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},Xs=class extends Gr{constructor(e){super(e),this.uuid=Fi(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(new Gr().fromJSON(i))}return this}},qd=function(r,e,t=2){let n=e&&e.length,i=n?e[0]*t:r.length,s=Pc(r,0,i,t,!0),a=[];if(!s||s.next===s.prev)return a;let o,l,c,h,u,d,p;if(n&&(s=(function(m,_,f,g){let v=[],x,y,w,E,U;for(x=0,y=_.length;x<y;x++)w=_[x]*g,E=x<y-1?_[x+1]*g:m.length,U=Pc(m,w,E,g,!1),U===U.next&&(U.steiner=!0),v.push(tp(U));for(v.sort($d),x=0;x<v.length;x++)f=Qd(v[x],f);return f})(r,e,s,t)),r.length>80*t){o=c=r[0],l=h=r[1];for(let m=t;m<i;m+=t)u=r[m],d=r[m+1],u<o&&(o=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);p=Math.max(c-o,h-l),p=p!==0?32767/p:0}return Wr(s,a,t,o,l,p,0),a};function Pc(r,e,t,n,i){let s,a;if(i===(function(o,l,c,h){let u=0;for(let d=l,p=c-h;d<c;d+=h)u+=(o[p]-o[d])*(o[d+1]+o[p+1]),p=d;return u})(r,e,t,n)>0)for(s=e;s<t;s+=n)a=Ic(s,r[s],r[s+1],a);else for(s=t-n;s>=e;s-=n)a=Ic(s,r[s],r[s+1],a);return a&&na(a,a.next)&&(Xr(a),a=a.next),a}function Oi(r,e){if(!r)return r;e||(e=r);let t,n=r;do if(t=!1,n.steiner||!na(n,n.next)&&Et(n.prev,n,n.next)!==0)n=n.next;else{if(Xr(n),n=e=n.prev,n===n.next)break;t=!0}while(t||n!==e);return e}function Wr(r,e,t,n,i,s,a){if(!r)return;!a&&s&&(function(h,u,d,p){let m=h;do m.z===0&&(m.z=Zo(m.x,m.y,u,d,p)),m.prevZ=m.prev,m.nextZ=m.next,m=m.next;while(m!==h);m.prevZ.nextZ=null,m.prevZ=null,(function(_){let f,g,v,x,y,w,E,U,V=1;do{for(g=_,_=null,y=null,w=0;g;){for(w++,v=g,E=0,f=0;f<V&&(E++,v=v.nextZ,v);f++);for(U=V;E>0||U>0&&v;)E!==0&&(U===0||!v||g.z<=v.z)?(x=g,g=g.nextZ,E--):(x=v,v=v.nextZ,U--),y?y.nextZ=x:_=x,x.prevZ=y,y=x;g=v}y.nextZ=null,V*=2}while(w>1)})(m)})(r,n,i,s);let o,l,c=r;for(;r.prev!==r.next;)if(o=r.prev,l=r.next,s?Zd(r,n,i,s):Yd(r))e.push(o.i/t|0),e.push(r.i/t|0),e.push(l.i/t|0),Xr(r),r=l.next,c=l.next;else if((r=l)===c){a?a===1?Wr(r=Jd(Oi(r),e,t),e,t,n,i,s,2):a===2&&Kd(r,e,t,n,i,s):Wr(Oi(r),e,t,n,i,s,1);break}}function Yd(r){let e=r.prev,t=r,n=r.next;if(Et(e,t,n)>=0)return!1;let i=e.x,s=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=i<s?i<a?i:a:s<a?s:a,u=o<l?o<c?o:c:l<c?l:c,d=i>s?i>a?i:a:s>a?s:a,p=o>l?o>c?o:c:l>c?l:c,m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=p&&tr(i,o,s,l,a,c,m.x,m.y)&&Et(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Zd(r,e,t,n){let i=r.prev,s=r,a=r.next;if(Et(i,s,a)>=0)return!1;let o=i.x,l=s.x,c=a.x,h=i.y,u=s.y,d=a.y,p=o<l?o<c?o:c:l<c?l:c,m=h<u?h<d?h:d:u<d?u:d,_=o>l?o>c?o:c:l>c?l:c,f=h>u?h>d?h:d:u>d?u:d,g=Zo(p,m,e,t,n),v=Zo(_,f,e,t,n),x=r.prevZ,y=r.nextZ;for(;x&&x.z>=g&&y&&y.z<=v;){if(x.x>=p&&x.x<=_&&x.y>=m&&x.y<=f&&x!==i&&x!==a&&tr(o,h,l,u,c,d,x.x,x.y)&&Et(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=p&&y.x<=_&&y.y>=m&&y.y<=f&&y!==i&&y!==a&&tr(o,h,l,u,c,d,y.x,y.y)&&Et(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=g;){if(x.x>=p&&x.x<=_&&x.y>=m&&x.y<=f&&x!==i&&x!==a&&tr(o,h,l,u,c,d,x.x,x.y)&&Et(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=v;){if(y.x>=p&&y.x<=_&&y.y>=m&&y.y<=f&&y!==i&&y!==a&&tr(o,h,l,u,c,d,y.x,y.y)&&Et(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Jd(r,e,t){let n=r;do{let i=n.prev,s=n.next.next;!na(i,s)&&oh(i,n,n.next,s)&&jr(i,s)&&jr(s,i)&&(e.push(i.i/t|0),e.push(n.i/t|0),e.push(s.i/t|0),Xr(n),Xr(n.next),n=r=s),n=n.next}while(n!==r);return Oi(n)}function Kd(r,e,t,n,i,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&np(a,o)){let l=lh(a,o);return a=Oi(a,a.next),l=Oi(l,l.next),Wr(a,e,t,n,i,s,0),void Wr(l,e,t,n,i,s,0)}o=o.next}a=a.next}while(a!==r)}function $d(r,e){return r.x-e.x}function Qd(r,e){let t=(function(i,s){let a,o=s,l=-1/0,c=i.x,h=i.y;do{if(h<=o.y&&h>=o.next.y&&o.next.y!==o.y){let f=o.x+(h-o.y)*(o.next.x-o.x)/(o.next.y-o.y);if(f<=c&&f>l&&(l=f,a=o.x<o.next.x?o:o.next,f===c))return a}o=o.next}while(o!==s);if(!a)return null;let u=a,d=a.x,p=a.y,m,_=1/0;o=a;do c>=o.x&&o.x>=d&&c!==o.x&&tr(h<p?c:l,h,d,p,h<p?l:c,h,o.x,o.y)&&(m=Math.abs(h-o.y)/(c-o.x),jr(o,i)&&(m<_||m===_&&(o.x>a.x||o.x===a.x&&ep(a,o)))&&(a=o,_=m)),o=o.next;while(o!==u);return a})(r,e);if(!t)return e;let n=lh(t,r);return Oi(n,n.next),Oi(t,t.next)}function ep(r,e){return Et(r.prev,r,e.prev)<0&&Et(e.next,r,r.next)<0}function Zo(r,e,t,n,i){return(r=1431655765&((r=858993459&((r=252645135&((r=16711935&((r=(r-t)*i|0)|r<<8))|r<<4))|r<<2))|r<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=(e-n)*i|0)|e<<8))|e<<4))|e<<2))|e<<1))<<1}function tp(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function tr(r,e,t,n,i,s,a,o){return(i-a)*(e-o)>=(r-a)*(s-o)&&(r-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(i-a)*(n-o)}function np(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!(function(t,n){let i=t;do{if(i.i!==t.i&&i.next.i!==t.i&&i.i!==n.i&&i.next.i!==n.i&&oh(i,i.next,t,n))return!0;i=i.next}while(i!==t);return!1})(r,e)&&(jr(r,e)&&jr(e,r)&&(function(t,n){let i=t,s=!1,a=(t.x+n.x)/2,o=(t.y+n.y)/2;do i.y>o!=i.next.y>o&&i.next.y!==i.y&&a<(i.next.x-i.x)*(o-i.y)/(i.next.y-i.y)+i.x&&(s=!s),i=i.next;while(i!==t);return s})(r,e)&&(Et(r.prev,r,e.prev)||Et(r,e.prev,e))||na(r,e)&&Et(r.prev,r,r.next)>0&&Et(e.prev,e,e.next)>0)}function Et(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function na(r,e){return r.x===e.x&&r.y===e.y}function oh(r,e,t,n){let i=Ms(Et(r,e,t)),s=Ms(Et(r,e,n)),a=Ms(Et(t,n,r)),o=Ms(Et(t,n,e));return i!==s&&a!==o||!(i!==0||!ys(r,t,e))||!(s!==0||!ys(r,n,e))||!(a!==0||!ys(t,r,n))||!(o!==0||!ys(t,e,n))}function ys(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function Ms(r){return r>0?1:r<0?-1:0}function jr(r,e){return Et(r.prev,r,r.next)<0?Et(r,e,r.next)>=0&&Et(r,r.prev,e)>=0:Et(r,e,r.prev)<0||Et(r,r.next,e)<0}function lh(r,e){let t=new Jo(r.i,r.x,r.y),n=new Jo(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function Ic(r,e,t,n){let i=new Jo(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Xr(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Jo(r,e,t){this.i=r,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}var oi=class r{static area(e){let t=e.length,n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return .5*n}static isClockWise(e){return r.area(e)<0}static triangulateShape(e,t){let n=[],i=[],s=[];Lc(e),Dc(n,e);let a=e.length;t.forEach(Lc);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,Dc(n,t[l]);let o=qd(n,i);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}};function Lc(r){let e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function Dc(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}var Ko=class r extends mt{constructor(e=new Xs([new me(.5,.5),new me(-.5,.5),new me(-.5,-.5),new me(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,i=[],s=[];for(let o=0,l=e.length;o<l;o++)a(e[o]);function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled===void 0||t.bevelEnabled,p=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:p-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,f=t.bevelSegments!==void 0?t.bevelSegments:3,g=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:ip,x,y,w,E,U,V=!1;g&&(x=g.getSpacedPoints(h),V=!0,d=!1,y=g.computeFrenetFrames(h,!1),w=new R,E=new R,U=new R),d||(f=0,p=0,m=0,_=0);let C=o.extractPoints(c),X=C.shape,L=C.holes;if(!oi.isClockWise(X)){X=X.reverse();for(let k=0,P=L.length;k<P;k++){let B=L[k];oi.isClockWise(B)&&(L[k]=B.reverse())}}let D=oi.triangulateShape(X,L),j=X;for(let k=0,P=L.length;k<P;k++){let B=L[k];X=X.concat(B)}function G(k,P,B){return P||console.error("THREE.ExtrudeGeometry: vec does not exist"),k.clone().addScaledVector(P,B)}let Q=X.length,te=D.length;function S(k,P,B){let M,z,q,ce=k.x-P.x,Y=k.y-P.y,oe=B.x-k.x,ae=B.y-k.y,pe=ce*ce+Y*Y,fe=ce*ae-Y*oe;if(Math.abs(fe)>Number.EPSILON){let Ee=Math.sqrt(pe),Ce=Math.sqrt(oe*oe+ae*ae),we=P.x-Y/Ee,nt=P.y+ce/Ee,Ve=((B.x-ae/Ce-we)*ae-(B.y+oe/Ce-nt)*oe)/(ce*ae-Y*oe);M=we+ce*Ve-k.x,z=nt+Y*Ve-k.y;let Le=M*M+z*z;if(Le<=2)return new me(M,z);q=Math.sqrt(Le/2)}else{let Ee=!1;ce>Number.EPSILON?oe>Number.EPSILON&&(Ee=!0):ce<-Number.EPSILON?oe<-Number.EPSILON&&(Ee=!0):Math.sign(Y)===Math.sign(ae)&&(Ee=!0),Ee?(M=-Y,z=ce,q=Math.sqrt(pe)):(M=ce,z=Y,q=Math.sqrt(pe/2))}return new me(M/q,z/q)}let I=[];for(let k=0,P=j.length,B=P-1,M=k+1;k<P;k++,B++,M++)B===P&&(B=0),M===P&&(M=0),I[k]=S(j[k],j[B],j[M]);let O=[],H,W=I.concat();for(let k=0,P=L.length;k<P;k++){let B=L[k];H=[];for(let M=0,z=B.length,q=z-1,ce=M+1;M<z;M++,q++,ce++)q===z&&(q=0),ce===z&&(ce=0),H[M]=S(B[M],B[q],B[ce]);O.push(H),W=W.concat(H)}for(let k=0;k<f;k++){let P=k/f,B=p*Math.cos(P*Math.PI/2),M=m*Math.sin(P*Math.PI/2)+_;for(let z=0,q=j.length;z<q;z++){let ce=G(j[z],I[z],M);re(ce.x,ce.y,-B)}for(let z=0,q=L.length;z<q;z++){let ce=L[z];H=O[z];for(let Y=0,oe=ce.length;Y<oe;Y++){let ae=G(ce[Y],H[Y],M);re(ae.x,ae.y,-B)}}}let Z=m+_;for(let k=0;k<Q;k++){let P=d?G(X[k],W[k],Z):X[k];V?(E.copy(y.normals[0]).multiplyScalar(P.x),w.copy(y.binormals[0]).multiplyScalar(P.y),U.copy(x[0]).add(E).add(w),re(U.x,U.y,U.z)):re(P.x,P.y,0)}for(let k=1;k<=h;k++)for(let P=0;P<Q;P++){let B=d?G(X[P],W[P],Z):X[P];V?(E.copy(y.normals[k]).multiplyScalar(B.x),w.copy(y.binormals[k]).multiplyScalar(B.y),U.copy(x[k]).add(E).add(w),re(U.x,U.y,U.z)):re(B.x,B.y,u/h*k)}for(let k=f-1;k>=0;k--){let P=k/f,B=p*Math.cos(P*Math.PI/2),M=m*Math.sin(P*Math.PI/2)+_;for(let z=0,q=j.length;z<q;z++){let ce=G(j[z],I[z],M);re(ce.x,ce.y,u+B)}for(let z=0,q=L.length;z<q;z++){let ce=L[z];H=O[z];for(let Y=0,oe=ce.length;Y<oe;Y++){let ae=G(ce[Y],H[Y],M);V?re(ae.x,ae.y+x[h-1].y,x[h-1].x+B):re(ae.x,ae.y,u+B)}}}function le(k,P){let B=k.length;for(;--B>=0;){let M=B,z=B-1;z<0&&(z=k.length-1);for(let q=0,ce=h+2*f;q<ce;q++){let Y=Q*q,oe=Q*(q+1);T(P+M+Y,P+z+Y,P+z+oe,P+M+oe)}}}function re(k,P,B){l.push(k),l.push(P),l.push(B)}function ie(k,P,B){b(k),b(P),b(B);let M=i.length/3,z=v.generateTopUV(n,i,M-3,M-2,M-1);F(z[0]),F(z[1]),F(z[2])}function T(k,P,B,M){b(k),b(P),b(M),b(P),b(B),b(M);let z=i.length/3,q=v.generateSideWallUV(n,i,z-6,z-3,z-2,z-1);F(q[0]),F(q[1]),F(q[3]),F(q[1]),F(q[2]),F(q[3])}function b(k){i.push(l[3*k+0]),i.push(l[3*k+1]),i.push(l[3*k+2])}function F(k){s.push(k.x),s.push(k.y)}(function(){let k=i.length/3;if(d){let P=0,B=Q*P;for(let M=0;M<te;M++){let z=D[M];ie(z[2]+B,z[1]+B,z[0]+B)}P=h+2*f,B=Q*P;for(let M=0;M<te;M++){let z=D[M];ie(z[0]+B,z[1]+B,z[2]+B)}}else{for(let P=0;P<te;P++){let B=D[P];ie(B[2],B[1],B[0])}for(let P=0;P<te;P++){let B=D[P];ie(B[0]+Q*h,B[1]+Q*h,B[2]+Q*h)}}n.addGroup(k,i.length/3-k,0)})(),(function(){let k=i.length/3,P=0;le(j,P),P+=j.length;for(let B=0,M=L.length;B<M;B++){let z=L[B];le(z,P),P+=z.length}n.addGroup(k,i.length/3-k,1)})()}this.setAttribute("position",new Ue(i,3)),this.setAttribute("uv",new Ue(s,2)),this.computeVertexNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return(function(t,n,i){if(i.shapes=[],Array.isArray(t))for(let s=0,a=t.length;s<a;s++){let o=t[s];i.shapes.push(o.uuid)}else i.shapes.push(t.uuid);return i.options=Object.assign({},n),n.extrudePath!==void 0&&(i.options.extrudePath=n.extrudePath.toJSON()),i})(this.parameters.shapes,this.parameters.options,e)}static fromJSON(e,t){let n=[];for(let s=0,a=e.shapes.length;s<a;s++){let o=t[e.shapes[s]];n.push(o)}let i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new Gs[i.type]().fromJSON(i)),new r(n,e.options)}},ip={generateTopUV:function(r,e,t,n,i){let s=e[3*t],a=e[3*t+1],o=e[3*n],l=e[3*n+1],c=e[3*i],h=e[3*i+1];return[new me(s,a),new me(o,l),new me(c,h)]},generateSideWallUV:function(r,e,t,n,i,s){let a=e[3*t],o=e[3*t+1],l=e[3*t+2],c=e[3*n],h=e[3*n+1],u=e[3*n+2],d=e[3*i],p=e[3*i+1],m=e[3*i+2],_=e[3*s],f=e[3*s+1],g=e[3*s+2];return Math.abs(o-h)<Math.abs(a-c)?[new me(a,1-l),new me(c,1-u),new me(d,1-m),new me(_,1-g)]:[new me(o,1-l),new me(h,1-u),new me(p,1-m),new me(f,1-g)]}},$o=class r extends Ni{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2;super([-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Qo=class r extends Ni{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},el=class r extends mt{constructor(e=.5,t=1,n=32,i=1,s=0,a=2*Math.PI){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:a},n=Math.max(3,n);let o=[],l=[],c=[],h=[],u=e,d=(t-e)/(i=Math.max(1,i)),p=new R,m=new me;for(let _=0;_<=i;_++){for(let f=0;f<=n;f++){let g=s+f/n*a;p.x=u*Math.cos(g),p.y=u*Math.sin(g),l.push(p.x,p.y,p.z),c.push(0,0,1),m.x=(p.x/t+1)/2,m.y=(p.y/t+1)/2,h.push(m.x,m.y)}u+=d}for(let _=0;_<i;_++){let f=_*(n+1);for(let g=0;g<n;g++){let v=g+f,x=v,y=v+n+1,w=v+n+2,E=v+1;o.push(x,y,E),o.push(y,w,E)}}this.setIndex(o),this.setAttribute("position",new Ue(l,3)),this.setAttribute("normal",new Ue(c,3)),this.setAttribute("uv",new Ue(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},tl=class r extends mt{constructor(e=new Xs([new me(0,.5),new me(-.5,-.5),new me(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],i=[],s=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;function c(h){let u=i.length/3,d=h.extractPoints(t),p=d.shape,m=d.holes;oi.isClockWise(p)===!1&&(p=p.reverse());for(let f=0,g=m.length;f<g;f++){let v=m[f];oi.isClockWise(v)===!0&&(m[f]=v.reverse())}let _=oi.triangulateShape(p,m);for(let f=0,g=m.length;f<g;f++){let v=m[f];p=p.concat(v)}for(let f=0,g=p.length;f<g;f++){let v=p[f];i.push(v.x,v.y,0),s.push(0,0,1),a.push(v.x,v.y)}for(let f=0,g=_.length;f<g;f++){let v=_[f],x=v[0]+u,y=v[1]+u,w=v[2]+u;n.push(x,y,w),l+=3}}this.setIndex(n),this.setAttribute("position",new Ue(i,3)),this.setAttribute("normal",new Ue(s,3)),this.setAttribute("uv",new Ue(a,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return(function(t,n){if(n.shapes=[],Array.isArray(t))for(let i=0,s=t.length;i<s;i++){let a=t[i];n.shapes.push(a.uuid)}else n.shapes.push(t.uuid);return n})(this.parameters.shapes,e)}static fromJSON(e,t){let n=[];for(let i=0,s=e.shapes.length;i<s;i++){let a=t[e.shapes[i]];n.push(a)}return new r(n,e.curveSegments)}},fr=class r extends mt{constructor(e=1,t=32,n=16,i=0,s=2*Math.PI,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],u=new R,d=new R,p=[],m=[],_=[],f=[];for(let g=0;g<=n;g++){let v=[],x=g/n,y=0;g===0&&a===0?y=.5/t:g===n&&l===Math.PI&&(y=-.5/t);for(let w=0;w<=t;w++){let E=w/t;u.x=-e*Math.cos(i+E*s)*Math.sin(a+x*o),u.y=e*Math.cos(a+x*o),u.z=e*Math.sin(i+E*s)*Math.sin(a+x*o),m.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),f.push(E+y,1-x),v.push(c++)}h.push(v)}for(let g=0;g<n;g++)for(let v=0;v<t;v++){let x=h[g][v+1],y=h[g][v],w=h[g+1][v],E=h[g+1][v+1];(g!==0||a>0)&&p.push(x,y,E),(g!==n-1||l<Math.PI)&&p.push(y,w,E)}this.setIndex(p),this.setAttribute("position",new Ue(m,3)),this.setAttribute("normal",new Ue(_,3)),this.setAttribute("uv",new Ue(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},nl=class r extends Ni{constructor(e=1,t=0){super([1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],[2,1,0,0,3,2,1,3,0,2,3,1],e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},il=class r extends mt{constructor(e=1,t=.4,n=12,i=48,s=2*Math.PI){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s},n=Math.floor(n),i=Math.floor(i);let a=[],o=[],l=[],c=[],h=new R,u=new R,d=new R;for(let p=0;p<=n;p++)for(let m=0;m<=i;m++){let _=m/i*s,f=p/n*Math.PI*2;u.x=(e+t*Math.cos(f))*Math.cos(_),u.y=(e+t*Math.cos(f))*Math.sin(_),u.z=t*Math.sin(f),o.push(u.x,u.y,u.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/i),c.push(p/n)}for(let p=1;p<=n;p++)for(let m=1;m<=i;m++){let _=(i+1)*p+m-1,f=(i+1)*(p-1)+m-1,g=(i+1)*(p-1)+m,v=(i+1)*p+m;a.push(_,f,v),a.push(f,g,v)}this.setIndex(a),this.setAttribute("position",new Ue(o,3)),this.setAttribute("normal",new Ue(l,3)),this.setAttribute("uv",new Ue(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},rl=class r extends mt{constructor(e=1,t=.4,n=64,i=8,s=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:i,p:s,q:a},n=Math.floor(n),i=Math.floor(i);let o=[],l=[],c=[],h=[],u=new R,d=new R,p=new R,m=new R,_=new R,f=new R,g=new R;for(let x=0;x<=n;++x){let y=x/n*s*Math.PI*2;v(y,s,a,e,p),v(y+.01,s,a,e,m),f.subVectors(m,p),g.addVectors(m,p),_.crossVectors(f,g),g.crossVectors(_,f),_.normalize(),g.normalize();for(let w=0;w<=i;++w){let E=w/i*Math.PI*2,U=-t*Math.cos(E),V=t*Math.sin(E);u.x=p.x+(U*g.x+V*_.x),u.y=p.y+(U*g.y+V*_.y),u.z=p.z+(U*g.z+V*_.z),l.push(u.x,u.y,u.z),d.subVectors(u,p).normalize(),c.push(d.x,d.y,d.z),h.push(x/n),h.push(w/i)}}for(let x=1;x<=n;x++)for(let y=1;y<=i;y++){let w=(i+1)*(x-1)+(y-1),E=(i+1)*x+(y-1),U=(i+1)*x+y,V=(i+1)*(x-1)+y;o.push(w,E,V),o.push(E,U,V)}function v(x,y,w,E,U){let V=Math.cos(x),C=Math.sin(x),X=w/y*x,L=Math.cos(X);U.x=E*(2+L)*.5*V,U.y=E*(2+L)*C*.5,U.z=E*Math.sin(X)*.5}this.setIndex(o),this.setAttribute("position",new Ue(l,3)),this.setAttribute("normal",new Ue(c,3)),this.setAttribute("uv",new Ue(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}},sl=class r extends mt{constructor(e=new Hs(new R(-1,-1,0),new R(-1,1,0),new R(1,1,0)),t=64,n=1,i=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:s};let a=e.computeFrenetFrames(t,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new R,l=new R,c=new me,h=new R,u=[],d=[],p=[],m=[];function _(f){h=e.getPointAt(f/t,h);let g=a.normals[f],v=a.binormals[f];for(let x=0;x<=i;x++){let y=x/i*Math.PI*2,w=Math.sin(y),E=-Math.cos(y);l.x=E*g.x+w*v.x,l.y=E*g.y+w*v.y,l.z=E*g.z+w*v.z,l.normalize(),d.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,u.push(o.x,o.y,o.z)}}(function(){for(let f=0;f<t;f++)_(f);_(s===!1?t:0),(function(){for(let f=0;f<=t;f++)for(let g=0;g<=i;g++)c.x=f/t,c.y=g/i,p.push(c.x,c.y)})(),(function(){for(let f=1;f<=t;f++)for(let g=1;g<=i;g++){let v=(i+1)*(f-1)+(g-1),x=(i+1)*f+(g-1),y=(i+1)*f+g,w=(i+1)*(f-1)+g;m.push(v,x,w),m.push(x,y,w)}})()})(),this.setIndex(m),this.setAttribute("position",new Ue(u,3)),this.setAttribute("normal",new Ue(d,3)),this.setAttribute("uv",new Ue(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new r(new Gs[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},al=class extends mt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],n=new Set,i=new R,s=new R;if(e.index!==null){let a=e.attributes.position,o=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let u=l[c],d=u.start;for(let p=d,m=d+u.count;p<m;p+=3)for(let _=0;_<3;_++){let f=o.getX(p+_),g=o.getX(p+(_+1)%3);i.fromBufferAttribute(a,f),s.fromBufferAttribute(a,g),Uc(i,s,n)===!0&&(t.push(i.x,i.y,i.z),t.push(s.x,s.y,s.z))}}}else{let a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){let h=3*o+c,u=3*o+(c+1)%3;i.fromBufferAttribute(a,h),s.fromBufferAttribute(a,u),Uc(i,s,n)===!0&&(t.push(i.x,i.y,i.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new Ue(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function Uc(r,e,t){let n=`${r.x},${r.y},${r.z}-${e.x},${e.y},${e.z}`,i=`${e.x},${e.y},${e.z}-${r.x},${r.y},${r.z}`;return t.has(n)!==!0&&t.has(i)!==!0&&(t.add(n),t.add(i),!0)}var Wf=Object.freeze({__proto__:null,BoxGeometry:ci,CapsuleGeometry:jo,CircleGeometry:Ui,ConeGeometry:Xo,CylinderGeometry:js,DodecahedronGeometry:qo,EdgesGeometry:Yo,ExtrudeGeometry:Ko,IcosahedronGeometry:$o,LatheGeometry:Ws,OctahedronGeometry:Qo,PlaneGeometry:hi,PolyhedronGeometry:Ni,RingGeometry:el,ShapeGeometry:tl,SphereGeometry:fr,TetrahedronGeometry:nl,TorusGeometry:il,TorusKnotGeometry:rl,TubeGeometry:sl,WireframeGeometry:al});var ui=class extends Ii{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new me(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},mr=class extends ui{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new me(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Nt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new qe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new qe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new qe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};function bs(r,e,t){return!r||!t&&r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function rp(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}var gr=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];t:{e:{let a;n:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=i,i=t[++n],e<i)break e}a=t.length;break n}if(e>=s)break t;{let o=t[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=t[--n-1],e>=s)break e}a=n,n=0}}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let a=0;a!==i;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ol=class extends gr{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Dl,endingEnd:Dl}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,a=e+1,o=i[s],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ul:s=e,o=2*t-n;break;case Nl:s=i.length-2,o=t+i[s]-i[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Ul:a=e,l=2*n-t;break;case Nl:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}let c=.5*(n-t),h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,m=(n-t)/(i-t),_=m*m,f=_*m,g=-d*f+2*d*_-d*m,v=(1+d)*f+(-1.5-2*d)*_+(-.5+d)*m+1,x=(-1-p)*f+(1.5+p)*_+.5*m,y=p*f-p*_;for(let w=0;w!==o;++w)s[w]=g*a[h+w]+v*a[c+w]+x*a[l+w]+y*a[u+w];return s}},ll=class extends gr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==o;++d)s[d]=a[c+d]*u+a[l+d]*h;return s}},cl=class extends gr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},Pn=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=bs(t,this.TimeBufferType),this.values=bs(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:bs(e.times,Array),values:bs(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new cl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ll(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ol(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Rs:t=this.InterpolantFactoryMethodDiscrete;break;case bo:t=this.InterpolantFactoryMethodLinear;break;case ua:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0){if(e===this.DefaultInterpolation)throw new Error(n);this.setInterpolation(this.DefaultInterpolation)}return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Rs;case this.InterpolantFactoryMethodLinear:return bo;case this.InterpolantFactoryMethodSmooth:return ua}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){let n=this.times,i=n.length,s=0,a=i-1;for(;s!==i&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!=0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&rp(i))for(let o=0,l=i.length;o!==l;++o){let c=i[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===ua,s=e.length-1,a=1;for(let o=1;o<s;++o){let l=!1,c=e[o];if(c!==e[o+1]&&(o!==1||c!==e[0]))if(i)l=!0;else{let h=o*n,u=h-n,d=h+n;for(let p=0;p!==n;++p){let m=t[h+p];if(m!==t[u+p]||m!==t[d+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let h=o*n,u=a*n;for(let d=0;d!==n;++d)t[u+d]=t[h+d]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=new this.constructor(this.name,e,t);return n.createInterpolant=this.createInterpolant,n}};Pn.prototype.TimeBufferType=Float32Array,Pn.prototype.ValueBufferType=Float32Array,Pn.prototype.DefaultInterpolation=bo;var Ri=class extends Pn{constructor(e,t,n){super(e,t,n)}};Ri.prototype.ValueTypeName="bool",Ri.prototype.ValueBufferType=Array,Ri.prototype.DefaultInterpolation=Rs,Ri.prototype.InterpolantFactoryMethodLinear=void 0,Ri.prototype.InterpolantFactoryMethodSmooth=void 0;var hl=class extends Pn{};hl.prototype.ValueTypeName="color";var ul=class extends Pn{};ul.prototype.ValueTypeName="number";var dl=class extends gr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t),c=e*o;for(let h=c+o;c!==h;c+=4)Kt.slerpFlat(s,0,a,c-o,a,c,l);return s}},qs=class extends Pn{InterpolantFactoryMethodLinear(e){return new dl(this.times,this.values,this.getValueSize(),e)}};qs.prototype.ValueTypeName="quaternion",qs.prototype.InterpolantFactoryMethodSmooth=void 0;var Ci=class extends Pn{constructor(e,t,n){super(e,t,n)}};Ci.prototype.ValueTypeName="string",Ci.prototype.ValueBufferType=Array,Ci.prototype.DefaultInterpolation=Rs,Ci.prototype.InterpolantFactoryMethodLinear=void 0,Ci.prototype.InterpolantFactoryMethodSmooth=void 0;var pl=class extends Pn{};pl.prototype.ValueTypeName="vector";var fl=class{constructor(e,t,n){let i=this,s,a=!1,o=0,l=0,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){l++,a===!1&&i.onStart!==void 0&&i.onStart(h,o,l),a=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,l),o===l&&(a=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return s?s(h):h},this.setURLModifier=function(h){return s=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let p=c[u],m=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return m}return null}}},sp=new fl,ml=class{constructor(e){this.manager=e!==void 0?e:sp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise((function(i,s){n.load(e,i,t,s)}))}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};ml.DEFAULT_MATERIAL_NAME="__DEFAULT";var jf=new Be,Xf=new R,qf=new R;var Yf=new Be,Zf=new R,Jf=new R;var Kf=new Be,$f=new Be,Qf=new Be;var em=new R,tm=new Kt,nm=new R,im=new R;var rm=new R,sm=new Kt,am=new R,om=new R;var wl="\\[\\]\\.:\\/",ap=new RegExp("["+wl+"]","g"),Va="[^"+wl+"]",op="[^"+wl.replace("\\.","")+"]",lp=new RegExp("^"+/((?:WC+[\/:])*)/.source.replace("WC",Va)+/(WCOD+)?/.source.replace("WCOD",op)+/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Va)+/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Va)+"$"),cp=["material","materials","bones","map"],St=class r{constructor(e,t,n){this.path=t,this.parsedPath=n||r.parseTrackName(t),this.node=r.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new r.Composite(e,t,n):new r(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(ap,"")}static parseTrackName(e){let t=lp.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);cp.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let a=0;a<s.length;a++){let o=s[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,s=t.propertyIndex;if(e||(e=r.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e)return void console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.materials)return void console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);e=e.material.materials;break;case"bones":if(!e.skeleton)return void console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.map)return void console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);e=e.material.map;break;default:if(e[n]===void 0)return void console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);e=e[n]}if(c!==void 0){if(e[c]===void 0)return void console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);e=e[c]}}let a=e[i];if(a===void 0){let c=t.nodeName;return void console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e)}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);if(!e.geometry.morphAttributes)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};St.Composite=class{constructor(r,e,t){let n=t||St.parseTrackName(e);this._targetGroup=r,this._bindings=r.subscribe_(e,n)}getValue(r,e){this.bind();let t=this._targetGroup.nCachedObjects_,n=this._bindings[t];n!==void 0&&n.getValue(r,e)}setValue(r,e){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].setValue(r,e)}bind(){let r=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=r.length;e!==t;++e)r[e].bind()}unbind(){let r=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=r.length;e!==t;++e)r[e].unbind()}},St.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},St.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},St.prototype.GetterByBindingType=[St.prototype._getValue_direct,St.prototype._getValue_array,St.prototype._getValue_arrayElement,St.prototype._getValue_toArray],St.prototype.SetterByBindingTypeAndVersioning=[[St.prototype._setValue_direct,St.prototype._setValue_direct_setNeedsUpdate,St.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[St.prototype._setValue_array,St.prototype._setValue_array_setNeedsUpdate,St.prototype._setValue_array_setMatrixWorldNeedsUpdate],[St.prototype._setValue_arrayElement,St.prototype._setValue_arrayElement_setNeedsUpdate,St.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[St.prototype._setValue_fromArray,St.prototype._setValue_fromArray_setNeedsUpdate,St.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var lm=new Float32Array(1);var Nc=new Be,Ys=class{constructor(e,t,n=0,i=1/0){this.ray=new Qn(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new zr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Nc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Nc),this}intersectObject(e,t=!0,n=[]){return gl(e,this,n,t),n.sort(Oc),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)gl(e[i],this,n,t);return n.sort(Oc),n}};function Oc(r,e){return r.distance-e.distance}function gl(r,e,t,n){let i=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let s=r.children;for(let a=0,o=s.length;a<o;a++)gl(s[a],e,t,!0)}}var qr=class{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Nt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var cm=new me;var hm=new R,um=new R;var dm=new R;var pm=new R,fm=new Be,mm=new Be;var gm=new R,vm=new qe,_m=new qe;var xm=new R,ym=new R,Mm=new R;var bm=new R,Sm=new Di;var Tm=new pn;var Em=new R;var Zs=class extends $n{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170");var ch={type:"change"},Rl={type:"start"},uh={type:"end"},ia=new Qn,hh=new An,up=Math.cos(70*ea.DEG2RAD),zt=new R,hn=2*Math.PI,gt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Al=1e-6,ra=class extends Zs{constructor(e,t=null){super(e,t),this.state=gt.NONE,this.enabled=!0,this.target=new R,this.cursor=new R,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:In.ROTATE,MIDDLE:In.DOLLY,RIGHT:In.PAN},this.touches={ONE:zn.ROTATE,TWO:zn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new R,this._lastQuaternion=new Kt,this._lastTargetPosition=new R,this._quat=new Kt().setFromUnitVectors(e.up,new R(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new qr,this._sphericalDelta=new qr,this._scale=1,this._panOffset=new R,this._rotateStart=new me,this._rotateEnd=new me,this._rotateDelta=new me,this._panStart=new me,this._panEnd=new me,this._panDelta=new me,this._dollyStart=new me,this._dollyEnd=new me,this._dollyDelta=new me,this._dollyDirection=new R,this._mouse=new me,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=pp.bind(this),this._onPointerDown=dp.bind(this),this._onPointerUp=fp.bind(this),this._onContextMenu=Mp.bind(this),this._onMouseWheel=vp.bind(this),this._onKeyDown=_p.bind(this),this._onTouchStart=xp.bind(this),this._onTouchMove=yp.bind(this),this._onMouseDown=mp.bind(this),this._onMouseMove=gp.bind(this),this._interceptControlDown=bp.bind(this),this._interceptControlUp=Sp.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(ch),this.update(),this.state=gt.NONE}update(e=null){let t=this.object.position;zt.copy(t).sub(this.target),zt.applyQuaternion(this._quat),this._spherical.setFromVector3(zt),this.autoRotate&&this.state===gt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=hn:n>Math.PI&&(n-=hn),i<-Math.PI?i+=hn:i>Math.PI&&(i-=hn),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=a!=this._spherical.radius}if(zt.setFromSpherical(this._spherical),zt.applyQuaternion(this._quatInverse),t.copy(this.target).add(zt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let o=zt.length();a=this._clampDistance(o*this._scale);let l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){let o=new R(this._mouse.x,this._mouse.y,0);o.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;let c=new R(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=zt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(ia.origin.copy(this.object.position),ia.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ia.direction))<up?this.object.lookAt(this.target):(hh.setFromNormalAndCoplanarPoint(this.object.up,this.target),ia.intersectPlane(hh,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>Al||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Al||this._lastTargetPosition.distanceToSquared(this.target)>Al?(this.dispatchEvent(ch),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?hn/60*this.autoRotateSpeed*e:hn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){zt.setFromMatrixColumn(t,0),zt.multiplyScalar(-e),this._panOffset.add(zt)}_panUp(e,t){this.screenSpacePanning===!0?zt.setFromMatrixColumn(t,1):(zt.setFromMatrixColumn(t,0),zt.crossVectors(this.object.up,zt)),zt.multiplyScalar(e),this._panOffset.add(zt)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let i=this.object.position;zt.copy(i).sub(this.target);let s=zt.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/n.clientHeight,this.object.matrix),this._panUp(2*t*s/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),i=e-n.left,s=t-n.top,a=n.width,o=n.height;this._mouse.x=i/a*2-1,this._mouse.y=-(s/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(hn*this._rotateDelta.x/t.clientHeight),this._rotateUp(hn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(hn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-hn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(hn*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-hn*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panStart.set(n,i)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,s=Math.sqrt(n*n+i*i);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._rotateEnd.set(i,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(hn*this._rotateDelta.x/t.clientHeight),this._rotateUp(hn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,s=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new me,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function dp(r){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(r.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(r)&&(this._addPointer(r),r.pointerType==="touch"?this._onTouchStart(r):this._onMouseDown(r)))}function pp(r){this.enabled!==!1&&(r.pointerType==="touch"?this._onTouchMove(r):this._onMouseMove(r))}function fp(r){switch(this._removePointer(r),this._pointers.length){case 0:this.domElement.releasePointerCapture(r.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(uh),this.state=gt.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function mp(r){let e;switch(r.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case In.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(r),this.state=gt.DOLLY;break;case In.ROTATE:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=gt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=gt.ROTATE}break;case In.PAN:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=gt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=gt.PAN}break;default:this.state=gt.NONE}this.state!==gt.NONE&&this.dispatchEvent(Rl)}function gp(r){switch(this.state){case gt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(r);break;case gt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(r);break;case gt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(r);break}}function vp(r){this.enabled===!1||this.enableZoom===!1||this.state!==gt.NONE||(r.preventDefault(),this.dispatchEvent(Rl),this._handleMouseWheel(this._customWheelEvent(r)),this.dispatchEvent(uh))}function _p(r){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(r)}function xp(r){switch(this._trackPointer(r),this._pointers.length){case 1:switch(this.touches.ONE){case zn.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(r),this.state=gt.TOUCH_ROTATE;break;case zn.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(r),this.state=gt.TOUCH_PAN;break;default:this.state=gt.NONE}break;case 2:switch(this.touches.TWO){case zn.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(r),this.state=gt.TOUCH_DOLLY_PAN;break;case zn.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(r),this.state=gt.TOUCH_DOLLY_ROTATE;break;default:this.state=gt.NONE}break;default:this.state=gt.NONE}this.state!==gt.NONE&&this.dispatchEvent(Rl)}function yp(r){switch(this._trackPointer(r),this.state){case gt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(r),this.update();break;case gt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(r),this.update();break;case gt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(r),this.update();break;case gt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(r),this.update();break;default:this.state=gt.NONE}}function Mp(r){this.enabled!==!1&&r.preventDefault()}function bp(r){r.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Sp(r){r.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var be=(r,e,t)=>new R(r,e,t),kt=ea.clamp,tt=(r,e,t)=>{let n=kt((t-r)/(e-r),0,1);return n*n*(3-2*n)},_t=be(1,0,0),Cl=be(0,1,0),mh=be(0,0,1),Lt=Math.PI/180,Tp=(()=>{let r="vec3 CustomToneMapping( vec3 color ) { return color; }",e=Xe.tonemapping_pars_fragment||"";return e.includes("vtFilm")?!0:e.includes(r)?(Xe.tonemapping_pars_fragment=e.replace(r,"vec3 CustomToneMapping( vec3 color ) { /* vtFilm */ color *= toneMappingExposure; return min( color, 0.72 ) + 0.28 * ( 1.0 - exp( - max( color - 0.72, 0.0 ) / 0.28 ) ); }"),!0):!1})();function gh(r,e){let t=[r[0]];for(let n=1;n<r.length;n++){let i=r[n].distanceTo(r[n-1]),s=Math.ceil(i/e);for(let a=1;a<=s;a++)t.push(r[n-1].clone().lerp(r[n],a/s))}return t}function $t(r,e){return new pr(r,!1,"centripetal").getPoints(e)}function an(r,e,t={}){let n=r.length,i=t.segs||28,s=[0];for(let C=1;C<n;C++)s[C]=s[C-1]+r[C].distanceTo(r[C-1]);let a=s[n-1],o=[];for(let C=0;C<n;C++)o[C]=typeof e=="function"?e(s[C],a,C):Array.isArray(e)?e[C]:e;let l=[];for(let C=0;C<n;C++){let X=r[Math.max(0,C-1)],L=r[Math.min(n-1,C+1)];l[C]=L.clone().sub(X).normalize()}let c=(t.up||(Math.abs(l[0].z)<.9?mh:_t)).clone();c.addScaledVector(l[0],-c.dot(l[0])).normalize();let h=t.scaleN||1,u=t.scaleB||1,d=t.sq||2,p=!!t.inside,m=[],_=[],f=[],g=[],v=new Kt,x=be(),y=be(),w=be();for(let C=0;C<n;C++){C>0&&(v.setFromUnitVectors(l[C-1],l[C]),c.applyQuaternion(v),c.addScaledVector(l[C],-c.dot(l[C])).normalize()),w.crossVectors(l[C],c);let X=C===0?(o[1]-o[0])/(s[1]-s[0]||1):C===n-1?(o[C]-o[C-1])/(s[C]-s[C-1]||1):(o[C+1]-o[C-1])/(s[C+1]-s[C-1]||1);for(let L=0;L<=i;L++){let D=L/i*Math.PI*2,j=Math.cos(D),G=Math.sin(D),Q=j,te=G,S=j/h,I=G/u;d!==2&&(Q=Math.sign(j)*Math.pow(Math.abs(j),2/d),te=Math.sign(G)*Math.pow(Math.abs(G),2/d),S=Math.sign(j)*Math.pow(Math.abs(j),2*(d-1)/d)/h,I=Math.sign(G)*Math.pow(Math.abs(G),2*(d-1)/d)/u),x.set(0,0,0).addScaledVector(c,Q*h).addScaledVector(w,te*u),m.push(r[C].x+x.x*o[C],r[C].y+x.y*o[C],r[C].z+x.z*o[C]),y.set(0,0,0).addScaledVector(c,S).addScaledVector(w,I).normalize().addScaledVector(l[C],-X).normalize(),p&&y.negate(),_.push(y.x,y.y,y.z),f.push(L/i,s[C]/(t.uvLen||a||1))}}let E=i+1;for(let C=0;C<n-1;C++)for(let X=0;X<i;X++){let L=C*E+X,D=L+1,j=L+E,G=j+1;p?g.push(L,j,D,D,j,G):g.push(L,D,j,D,G,j)}let U=(C,X)=>{let L=m.length/3,D=l[C];m.push(r[C].x,r[C].y,r[C].z),_.push(D.x*X,D.y*X,D.z*X),f.push(.5,.5);for(let j=0;j<=i;j++){let G=(C*E+j)*3;m.push(m[G],m[G+1],m[G+2]),_.push(D.x*X,D.y*X,D.z*X),f.push(.5,.5)}for(let j=0;j<i;j++)X>0?g.push(L,L+1+j,L+2+j):g.push(L,L+2+j,L+1+j)};t.capA&&U(0,-1),t.capB&&U(n-1,1);let V=new mt;return V.setAttribute("position",new Ue(m,3)),V.setAttribute("normal",new Ue(_,3)),V.setAttribute("uv",new Ue(f,2)),V.setIndex(g),V.userData.rings=n,V.userData.W=E,V}function Vt(r,e={}){let t=e.segs||48,n=Math.cos((e.crease||32)*Math.PI/180),i=r.filter((m,_)=>_===0||Math.hypot(m[0]-r[_-1][0],m[1]-r[_-1][1])>1e-6),s=[];for(let m=0;m<i.length-1;m++){let _=i[m+1][0]-i[m][0],f=i[m+1][1]-i[m][1],g=Math.hypot(_,f);s.push([-f/g,_/g])}let a=[],o=0;for(let m=0;m<i.length;m++){m>0&&(o+=Math.hypot(i[m][0]-i[m-1][0],i[m][1]-i[m-1][1]));let _=s[m-1],f=s[m];if(_&&f&&_[0]*f[0]+_[1]*f[1]>=n){let g=_[0]+f[0],v=_[1]+f[1],x=Math.hypot(g,v);a.push({y:i[m][0],r:i[m][1],ny:g/x,nr:v/x,v:o,brk:!1})}else _&&a.push({y:i[m][0],r:i[m][1],ny:_[0],nr:_[1],v:o,brk:!0}),f&&a.push({y:i[m][0],r:i[m][1],ny:f[0],nr:f[1],v:o,brk:!1})}let l=[],c=[],h=[],u=[],d=t+1;for(let m of a)for(let _=0;_<=t;_++){let f=_/t*Math.PI*2,g=Math.cos(f),v=Math.sin(f);l.push(m.r*g,m.y,m.r*v),c.push(m.nr*g,m.ny,m.nr*v),h.push(_/t,m.v/(o||1))}for(let m=0;m<a.length-1;m++)if(!a[m].brk)for(let _=0;_<t;_++){let f=m*d+_,g=f+1,v=f+d,x=v+1;u.push(f,v,g,v,x,g)}let p=new mt;return p.setAttribute("position",new Ue(l,3)),p.setAttribute("normal",new Ue(c,3)),p.setAttribute("uv",new Ue(h,2)),p.setIndex(u),p}function Xt(r,e,t=Cl){let n=new Be().makeRotationFromQuaternion(new Kt().setFromUnitVectors(Cl,t.clone().normalize()));return n.setPosition(e),r.applyMatrix4(n)}function dh(r){let e=0,t=0;for(let u of r)e+=u.attributes.position.count,t+=u.index.count;let n=new Float32Array(e*3),i=new Float32Array(e*3),s=new Float32Array(e*2),a=new Float32Array(e*3).fill(1),o=new Uint32Array(t),l=0,c=0;for(let u of r){n.set(u.attributes.position.array,l*3),i.set(u.attributes.normal.array,l*3),u.attributes.uv&&s.set(u.attributes.uv.array,l*2),u.attributes.color&&a.set(u.attributes.color.array,l*3);let d=u.index.array;for(let p=0;p<d.length;p++)o[c+p]=d[p]+l;l+=u.attributes.position.count,c+=d.length,u.dispose()}let h=new mt;return h.setAttribute("position",new It(n,3)),h.setAttribute("normal",new It(i,3)),h.setAttribute("uv",new It(s,2)),h.setAttribute("color",new It(a,3)),h.setIndex(new It(o,1)),h}var di=be(),pi=be(),xr=be();function Ep(r,e,t,n){di.subVectors(e,r),pi.subVectors(n,t),xr.subVectors(r,t);let i=di.dot(di),s=pi.dot(pi),a=pi.dot(xr),o=di.dot(xr),l=di.dot(pi),c=0,h=0;if(i>1e-9&&s>1e-9){let m=i*s-l*l;c=m>1e-9?kt((l*a-o*s)/m,0,1):0,h=(l*c+a)/s,h<0?(h=0,c=kt(-o/i,0,1)):h>1&&(h=1,c=kt((l-o)/i,0,1))}else i>1e-9?c=kt(-o/i,0,1):s>1e-9&&(h=kt(a/s,0,1));let u=xr.x+di.x*c-pi.x*h,d=xr.y+di.y*c-pi.y*h,p=xr.z+di.z*c-pi.z*h;return u*u+d*d+p*p}var $={R:9.5,seat:11.3,cupR:9.3,crown:-72.5,headEnd:-62,sock:[117.6,160.2],bodyEnd:479.5,footSock:491.5,end:654,rodBody:{th:-62,R:17,x0:216,x1:476.5},rodG:{th:-32,R:13.5,x0:316,x1:366},rodFoot:{th:18,R:13.4,x0:485,x1:647},rodGiz:{th:56,R:12.9,x0:509,x1:592},rodTrill:{th:-80,R:20.6,x0:186,x1:458},axThumb:{th:-152,R:12,x:301.5}},Pl=r=>9.5-.9*Math.pow(kt((110-r)/172,0,1),2),ve=(r,e,t)=>be(r,t*Math.sin(e*Lt),t*Math.cos(e*Lt)),vt=r=>be(0,Math.sin(r*Lt),Math.cos(r*Lt)),br=r=>be(0,Math.cos(r*Lt),-Math.sin(r*Lt)),rt=(()=>{let r=$.axThumb,e=br(r.th),t=ve(r.x,r.th,r.R);return{x:r.x,ax:e,pv:t,ang:5*Lt,at:n=>t.clone().addScaledVector(e,n),sOf:n=>r.R*Math.tan((n-r.th)*Lt)}})(),yr=[{id:"Cs",x:227,th:0,r:6.7,rod:"rodBody",name:"B"},{id:"L1",x:261,th:0,r:8,rod:"rodBody",plate:!0,finger:"L1",name:"B"},{id:"Bb",x:282,th:0,r:$.cupR,rod:"rodBody",name:"B\u266D"},{id:"As",x:305,th:0,r:$.cupR,rod:"rodBody",finger:"L2",name:"A"},{id:"A",x:329,th:18,r:$.cupR,rod:"rodG",finger:"L3",name:"G"},{id:"Gf",x:353.5,th:18,r:$.cupR,rod:"rodG",name:"G\u266F"},{id:"G",x:378,th:0,r:$.cupR,rod:"rodBody",name:"F\u266F"},{id:"Fs",x:406,th:0,r:$.cupR,rod:"rodBody",finger:"R1",name:"F"},{id:"F",x:436,th:0,r:$.cupR,rod:"rodBody",finger:"R2",name:"E"},{id:"E",x:467,th:0,r:$.cupR,rod:"rodBody",finger:"R3",name:"D"},{id:"D",x:534,th:-50,r:$.cupR,rod:"rodFoot",foot:!0,name:"C\u266F"},{id:"CsF",x:570,th:-50,r:$.cupR,rod:"rodFoot",foot:!0,name:"C"},{id:"CF",x:608.5,th:-50,r:9.5,rod:"rodFoot",foot:!0,name:"B"},{id:"Ds",x:498,th:86,r:8.8,rod:"rodFoot",shut:!0,name:"E\u266D"},{id:"trDs",x:193,th:-125,r:5.4,rod:"rodTrill",shut:!0,name:"D\u266F trill"},{id:"trD",x:211,th:-125,r:5.4,rod:"rodTrill",shut:!0,name:"D trill"},{id:"GsR",x:353.5,th:-136,r:7.7,rod:"rodBody",shut:!0,name:"G\u266F"},{id:"Th",x:265,th:-140,r:8.7,rod:"axThumb",finger:"LT",name:"thumb B"}],vh=`
  float fsBand(float x, float a, float b, float e){ return smoothstep(a - e, a + e, x) * (1.0 - smoothstep(b - e, b + e, x)); }
  float fsUp(float r){
    const float X[13] = float[13](0.0, 12.0, 25.0, 40.0, 55.0, 72.0, 88.0, 104.0, 122.0, 136.0, 150.0, 164.0, 180.0);
    const float V[13] = float[13](0.90, 0.95, 1.06, 1.36, 1.6, 1.6, 1.3, 0.98, 0.80, 1.05, 0.85, 0.36, 0.22);
    float v = V[0];
    for (int i = 0; i < 12; i++) v = mix(v, V[i + 1], clamp((r - X[i]) / (X[i + 1] - X[i]), 0.0, 1.0));
    return v;
  }
  float fsDown(float r){
    const float X[13] = float[13](0.0, 8.0, 18.0, 28.0, 36.0, 44.0, 54.0, 70.0, 95.0, 112.0, 128.0, 148.0, 180.0);
    const float V[13] = float[13](0.90, 1.0, 1.1, 1.0, 0.78, 0.56, 0.44, 0.5, 0.76, 0.86, 0.70, 0.40, 0.20);
    float v = V[0];
    for (int i = 0; i < 12; i++) v = mix(v, V[i + 1], clamp((r - X[i]) / (X[i + 1] - X[i]), 0.0, 1.0));
    return v;
  }
  vec3 fsStudio(vec3 d, float rough){
    d = normalize(d);
    float e = 1.2 + 70.0 * rough * rough + 25.0 * rough;
    float u = degrees(atan(d.y, d.z));                                   // 0 = toward the camera, 90 = up, \xB1180 = behind, -90 = down
    float s = degrees(asin(clamp(d.x, -1.0, 1.0)));                       // left / right
    float rho = degrees(acos(clamp(d.z, -1.0, 1.0)));                     // the angle away from the camera
    float up = smoothstep(-0.4, 0.4, d.y / max(1e-4, length(d.xy)));
    float v = mix(fsDown(rho), fsUp(rho), up);
    v = mix(v, 0.8, smoothstep(0.12, 0.6, rough));                        // a rough surface sees the tent's average
    vec3 white = vec3(1.0, 0.997, 0.985);
    vec3 c = white * v;
    // the floor behind and below: a little warm (the table), as the bottom edge of every photographed tube is
    c *= mix(vec3(1.0), vec3(1.0, 0.95, 0.89), (1.0 - up) * smoothstep(120.0, 165.0, rho));
    // the room's sides are dark (black flags left and right of the set), each with one tall strip light in it: a tube
    // seen at a slant, and the left and right shoulders of every cup and ball, mirror these, so they show dark with a
    // bright streak instead of the tent's even white
    float elev = degrees(asin(clamp(d.y, -1.0, 1.0)));
    float wall = smoothstep(50.0, 60.0 + e, abs(s)) * fsBand(elev, -52.0, 58.0, e + 6.0);
    c = mix(c, vec3(0.17, 0.172, 0.18), 0.9 * wall);
    c = mix(c, white * 1.5, fsBand(abs(s), 65.0, 74.0, 2.0 + e) * fsBand(elev, -38.0, 46.0, e + 3.0));
    // The dark band just ABOVE the camera (the black card over the lens): on a tube it is the narrow dark stripe just
    // above the middle, hard against the bright streak of the overhead light, which is what makes polished silver read
    // as silver. Above, not below: a cup's flat face, seen from a little above as the flute usually is, mirrors what
    // lies BELOW the camera, and must stay light. Its upper edge is crisp (its own ~1\xB0 edge, widened only as far as a
    // pixel needs so it never shimmers on a small flute), its lower edge soft.
    float fw = clamp(fwidth(u), 0.0, 8.0);
    float eT = max(0.8, 0.45 * fw) + 30.0 * rough, hi = max(23.0, 5.0 + 2.6 * fw);
    float band = smoothstep(5.0 - 3.0 - eT, 5.0 + 3.0 + eT, u) * (1.0 - smoothstep(hi - eT, hi + eT, u));
    c = mix(c, vec3(0.045, 0.047, 0.052), 0.96 * band * (1.0 - smoothstep(30.0, 50.0, abs(s))));
    return c;
  }`,wp=`
  #ifdef FS_TRACE
  uniform vec4 fsA[ FS_N ];
  uniform vec4 fsB[ FS_N ];
  vec3 fsRadiance( vec3 P, vec3 D, float rough ) {
    float tBest = 1e9, under = 0.0, wBest = 0.0; vec3 nBest = vec3( 0.0, 0.0, 1.0 );
    for ( int i = 0; i < FS_N; i ++ ) {
      vec3 A = fsA[ i ].xyz; float r = fsA[ i ].w; vec3 U = fsB[ i ].xyz; float L = fsB[ i ].w;
      vec3 oc = P - A; float dU = dot( D, U ), oU = dot( oc, U );
      vec3 d2 = D - dU * U, o2 = oc - oU * U;
      float a = dot( d2, d2 ), b = dot( o2, d2 ), c = dot( o2, o2 ) - r * r, h = b * b - a * c;
      if ( h > 0.0 && a > 1e-6 ) {
        float t = ( - b - sqrt( h ) ) / a, sU = oU + t * dU;
        if ( t > 0.3 && t < tBest && sU > 0.0 && sU < L ) {
          float dmin = sqrt( max( 0.0, c + r * r - b * b / a ) );                 // how close the ray passes to the axis: soft near the outline
          tBest = t; nBest = ( o2 + t * d2 ) / r; under = 0.0; wBest = smoothstep( r, r * 0.82 - 0.4, dmin ) * smoothstep( 0.0, 0.8, sU ) * smoothstep( L, L - 0.8, sU ); }
      }
      if ( L < 20.0 && abs( dU ) > 1e-4 ) {
        float t0 = - oU / dU; vec3 q0 = o2 + t0 * d2;
        if ( dU > 0.0 && t0 > 0.3 && t0 < tBest && dot( q0, q0 ) < r * r ) { tBest = t0; nBest = - U; under = 1.0; wBest = smoothstep( r, r - 1.0, length( q0 ) ); }
        float t1 = ( L - oU ) / dU; vec3 q1 = o2 + t1 * d2;
        if ( dU < 0.0 && t1 > 0.3 && t1 < tBest && dot( q1, q1 ) < r * r ) { tBest = t1; nBest = U; under = 0.0; wBest = smoothstep( r, r - 1.0, length( q1 ) ); }
      }
    }
    vec3 miss = fsStudio( D, rough );
    if ( tBest > 1e8 ) return miss;
    vec3 col = vec3( 0.86 ) * fsStudio( reflect( D, nBest ), rough + 0.05 );
    col = mix( col, vec3( 0.2, 0.2, 0.21 ), 0.85 * under );
    return mix( miss, col, wBest * exp( - tBest / 160.0 ) * ( 1.0 - smoothstep( 0.15, 0.45, rough ) ) );
  }
  #endif`;function Ap(){let r=new dr;return r.add(new Pt(new fr(60,64,32),new sn({side:vl,depthWrite:!1,vertexShader:"varying vec3 d; void main(){ d = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"varying vec3 d;"+vh+" void main(){ gl_FragColor = vec4(fsStudio(d, 0.0), 1.0); }"}))),r}function kn(r,e,t,n,i,s=20){return Xt(Vt([[r,0],[r,i],[e,i],[e,0]],{segs:s,crease:30}),be(0,t,n),_t)}function Il(r,e,t=24){let n=new fr(e,t,Math.max(8,t>>1));return n.translate(r.x,r.y,r.z),n}function fi(r,e,t,n={}){return an(r,1,Object.assign({up:_t,scaleN:e/2,scaleB:t/2,sq:3.2,segs:14,capA:!0,capB:!0},n))}function sa(r,e,t,n,i,s,a={}){let l=Vt([[-.25,0],[-.22,.5],[-.1,.86],[0,1],[.5,1],[.78,.95],[.9,.86],[1,.7],[1.14,.35],[1.2,0]].map(([_,f])=>[_*s,f]),{segs:48,crease:60});if(a.sq&&a.sq!==2){let _=l.attributes.position,f=a.sq;for(let g=0;g<_.count;g++){let v=_.getX(g),x=_.getZ(g),y=Math.hypot(v,x);if(y<1e-6)continue;let w=.86/Math.pow(Math.pow(Math.abs(v/y),f)+Math.pow(Math.abs(x/y),f),1/f);_.setX(g,v*w),_.setZ(g,x*w)}}let c=vt(e),h=br(e),u=new Be,d=a.tilt||0,p=c.clone().applyAxisAngle(_t,-d*Lt),m=h.clone().applyAxisAngle(_t,-d*Lt);return u.makeBasis(_t.clone().multiplyScalar(n/2),p,m.clone().multiplyScalar(-i/2)),u.setPosition(ve(r,e,t)),l.applyMatrix4(u),l.computeVertexNormals(),l}function aa(r,e,t,n={}){let i=n.NT||112,s=n.NR||9,a=n.NE||7,o=n.thick||1.4,l=n.dome||0,c=n.edge||.12,h=new pr(r.map(([w,E])=>be(w,E,0)),!0,"centripetal").getSpacedPoints(i).slice(0,i),u=[];if(n.pillow){let w=o/2+l,E=-o/2+.3*o,U=s+5;for(let V=1;V<=U;V++){let C=V/U*Math.PI/2;u.push([Math.sin(C),E+(w-E)*Math.cos(C)])}u.push([.985,-o/2+.1*o],[.93,-o/2]);for(let V=s-1;V>=1;V--)u.push([.93*V/s,-o/2])}else{for(let w=1;w<=s;w++){let E=w/s;u.push([E*(1-c),o/2+l*(1-E*E)])}for(let w=1;w<a;w++){let E=w/a*Math.PI;u.push([1-c+c*Math.sin(E),o/2*Math.cos(E)])}for(let w=s;w>=1;w--){let E=w/s;u.push([E*(1-c),-o/2])}}let d=[],p=[],m=w=>d.push(w.x,w.y,w.z);m(t(e[0],e[1],o/2+l+(n.top?n.top(e[0],e[1],0):0)));for(let[w,E]of u)for(let U=0;U<i;U++){let V=e[0]+(h[U].x-e[0])*w,C=e[1]+(h[U].y-e[1])*w;m(t(V,C,E+(n.top&&E>0?n.top(V,C,w)*Math.min(1,E/(o/2)):0)))}m(t(e[0],e[1],-o/2));let _=w=>1+w*i,f=1+u.length*i,g=u.length;for(let w=0;w<i;w++){let E=(w+1)%i;p.push(0,_(0)+w,_(0)+E,f,_(g-1)+E,_(g-1)+w)}for(let w=0;w<g-1;w++)for(let E=0;E<i;E++){let U=(E+1)%i,V=_(w)+E,C=_(w)+U,X=_(w+1)+E,L=_(w+1)+U;p.push(V,X,C,C,X,L)}let v=new mt;v.setAttribute("position",new Ue(d,3)),v.setIndex(p),v.computeVertexNormals();let x=t(e[0],e[1],1).sub(t(e[0],e[1],0));if(be().fromBufferAttribute(v.attributes.normal,0).dot(x)<0){let w=v.index.array;for(let E=0;E<w.length;E+=3){let U=w[E+1];w[E+1]=w[E+2],w[E+2]=U}v.computeVertexNormals()}return v}function oa(r,e,t,n=4.2){let i=[ve(r,t,$.R+.25),ve(e,t,$.R+.25)];return an(gh(i,20),1,{up:br(t),scaleN:n/2,scaleB:.4,sq:4,segs:12,capA:!0,capB:!0})}function Rp(r,e){let t=vt(e.th),n=ve(r,e.th,$.R+.5),i=ve(r,e.th,e.R);return[Xt(Vt([[0,0],[0,3],[.6,2.75],[1.6,2],[i.distanceTo(n)-.6,2],[i.distanceTo(n),0]],{segs:18}),n,t),Il(i,2.75,26)]}function Cp(r,e){let t=r/9.3,n=Math.sqrt(t),a=Vt((e?[[.36,8.32],[.3,8.86],[.62,9.3],[2.3,9.3],[2.95,9.12],[3.42,8.62],[3.72,7.9],[3.9,7],[4.06,5.8],[4.22,4.4],[4.36,2.9],[4.46,1.5],[4.5,0]]:[[.36,8.32],[.3,8.86],[.62,9.3],[2.3,9.3],[2.95,9.12],[3.42,8.62],[3.72,7.9],[3.86,7.2],[3.96,6.3],[4,5.4],[4,5.25],[4.1,5.1],[4.13,4.9],[4.34,3.2],[4.46,1.5],[4.5,0]]).map(([c,h])=>[c*n,h*t]),{segs:88,crease:50}),o=a.attributes.position,l=[];for(let c=0;c<o.count;c++){let h=.42+.58*tt(.4*n,3.3*n,o.getY(c));l.push(h,h,h)}return a.setAttribute("color",new Ue(l,3)),a}function Pp(r){let e=r/9.3;return Vt([[-.18,0],[-.18,8.45*e],[-.05,8.62*e],[.5,8.62*e],[.5,0]],{segs:40,crease:50})}function Ip(r){let e=r*.78,t=e-.75;return Vt([[-7,e],[-.35,e],[-.05,e-.2],[0,e-.42],[0,t+.2],[-.15,t],[-2.6,t]],{segs:40,crease:50})}function Lp(r){let e=r*.78-.75;return Vt([[-1,0],[-1,e+.05],[-.9,e+.05]],{segs:32})}function ph(r){let e=r.attributes.position,t=r.attributes.normal;if(!t)return r;let n=r.attributes.color,i=new Float32Array(e.count*3);for(let s=0;s<e.count;s++){let a=e.getY(s),o=e.getZ(s),l=Math.hypot(a,o),c=1;if(l>.001){let h=Math.max(0,-(t.getY(s)*a+t.getZ(s)*o)/l),u=1-tt($.R+.4,$.R+6.5,l);c=Math.max(.07,1-.72*u*(.45+.55*h)-.55*h*(1-tt($.R+7,$.R+14,l)))}n&&(c*=n.getX(s)),i[s*3]=i[s*3+1]=i[s*3+2]=c}return r.setAttribute("color",new It(i,3)),r}function Dp(){let i=(L,D)=>(D<0?.3+Math.sqrt(Math.max(1,184.95999999999998-D*D)):-1.1+Math.sqrt(Math.max(1,225-D*D)))-L*L/560,s=L=>{let D=Math.cos(L),j=Math.sin(L),G=j>0,Q=3.2-.3*j;return[22.5*(1-(G?.05:0)*Math.pow(Math.abs(j),1.5))*Math.sign(D)*Math.pow(Math.abs(D),2/Q),0+13*Math.sign(j)*Math.pow(Math.abs(j),2/Q)]},a=(L,D)=>Math.sign(L)*Math.pow(Math.abs(L),2/D),o=L=>[6.1*a(Math.cos(L),2.8),2+4.85*a(Math.sin(L),2.8)],u=L=>{let D=[],j=[];for(let Q=0;Q<=120;Q++){let te=Q/120*Math.PI*2,S=o(te),I=s(te);for(let O=0;O<=14;O++){let H=O/14,W=H*H*(3-2*H)*.35+H*.65,Z=L(S[0]+(I[0]-S[0])*W,S[1]+(I[1]-S[1])*W);D.push(Z.x,Z.y,Z.z)}}for(let Q=0;Q<120;Q++)for(let te=0;te<14;te++){let S=Q*15+te,I=S+1,O=S+14+1,H=O+1;j.push(S,O,I,I,O,H)}let G=new mt;return G.setAttribute("position",new Ue(D,3)),G.setIndex(j),G},d=(L,D)=>{let G=(i(L+.01,D)-i(L-.01,D))/.02,Q=(i(L,D+.01)-i(L,D-.01))/(2*.01);return be(-G,-Q,1).normalize()},p=u((L,D)=>be(L,D,i(L,D))),m=u((L,D)=>be(L,D,i(L,D)).addScaledVector(d(L,D),-1.9)),_=[],f=[],g=4;for(let L=0;L<=120;L++){let D=L/120*Math.PI*2,j=s(D),G=s(D+.01),Q=G[0]-j[0],te=G[1]-j[1],S=Math.hypot(Q,te)||1,I=be(te/S,-Q/S,0),O=d(j[0],j[1]);for(let H=0;H<=g;H++){let W=H/g*Math.PI,Z=be(j[0],j[1],i(j[0],j[1])).addScaledVector(O,-1.9*(1-Math.cos(W))/2).addScaledVector(I,Math.sin(W)*1.9*.45);_.push(Z.x,Z.y,Z.z)}}for(let L=0;L<120;L++)for(let D=0;D<g;D++){let j=L*(g+1)+D,G=j+1,Q=j+g+1,te=Q+1;f.push(j,G,Q,G,te,Q)}let v=new mt;v.setAttribute("position",new Ue(_,3)),v.setIndex(f);let x=(L,D,j,G=8)=>{let Q=[],te=[];for(let I=0;I<=120;I++){let O=I/120*Math.PI*2,H=o(O),W=H[0]*(1+j/6.1),Z=2+(H[1]-2)*(1+j/4.85);for(let le=0;le<=G;le++){let re=le/G,ie=typeof L=="function"?L(W,Z):L,T=typeof D=="function"?D(W,Z):D;Q.push(W,Z,ie+(T-ie)*re)}}for(let I=0;I<120;I++)for(let O=0;O<G;O++){let H=I*(G+1)+O,W=H+1,Z=H+G+1,le=Z+1;te.push(H,W,Z,W,le,Z)}let S=new mt;return S.setAttribute("position",new Ue(Q,3)),S.setIndex(te),S},y=L=>tt(-.4,.8,(L-2)/4.85),w=x((L,D)=>i(L,D)-.05,(L,D)=>i(L,D)-.95-.6*y(D),0,2),E=x((L,D)=>i(L,D)-.95-.6*y(D),9.75,-.06,4),U=(L,D)=>D.push(L,L*.95,L*.88);{let L=E.attributes.position,D=[];for(let j=0;j<L.count;j++){let G=j%5/4,Q=tt(-.6,.9,(L.getY(j)-2)/4.85),te=.01+(.6-.46*Q)*(1-tt(.25,1,G));U(te,D)}E.setAttribute("color",new Ue(D,3))}let V=x((L,D)=>i(L,D)-1.9*.9,(L,D)=>Math.sqrt(Math.max(0,Pl(L)**2-D*D))-.4,1.7,4),C=new Ui(1,40);C.scale(6.1+.9,4.85+.9,1),C.translate(0,2,9.75);{let L=C.attributes.position,D=[];for(let j=0;j<L.count;j++)U(.008+.01*tt(-1,1,(L.getY(j)-2)/(4.85+.9)),D);C.setAttribute("color",new Ue(D,3))}let X=(L,D)=>(L.userData.weld=D,L);return{top:X(p,15),bot:X(m,15),rim:X(v,g+1),wallTop:X(w,3),wallLow:X(E,5),outerW:X(V,5),floor:C,nAt:d,zP:i,HY:2}}function Mr(r,e,t=!1){r.computeVertexNormals(),fh(r);let n=r.attributes.position,i=r.attributes.normal,s=0;for(let a=0;a<n.count;a+=7)s+=(n.getX(a)-e.x)*i.getX(a)+(n.getY(a)-e.y)*i.getY(a)+(n.getZ(a)-e.z)*i.getZ(a);if(s<0!==t){let a=r.index.array;for(let o=0;o<a.length;o+=3){let l=a[o+1];a[o+1]=a[o+2],a[o+2]=l}r.index.needsUpdate=!0,r.computeVertexNormals(),fh(r)}return r.attributes.uv||r.setAttribute("uv",new Ue(new Float32Array(n.count*2),2)),r}function fh(r){let e=r.userData.weld;if(!e)return;let t=r.attributes.normal,n=t.count/e,i=be(),s=be();for(let a=0;a<e;a++){let o=a,l=(n-1)*e+a;i.fromBufferAttribute(t,o).add(s.fromBufferAttribute(t,l)).normalize(),t.setXYZ(o,i.x,i.y,i.z),t.setXYZ(l,i.x,i.y,i.z)}t.needsUpdate=!0}var la=r=>(r.attributes.uv||r.setAttribute("uv",new Ue(new Float32Array(r.attributes.position.count*2),2)),r.index||r.setIndex([...Array(r.attributes.position.count).keys()]),r);function Up(){let r=new On;r.name="flute";let e={silver:new mr({color:15329506,metalness:1,roughness:.045,vertexColors:!0}),satin:new mr({color:15001063,metalness:1,roughness:.2}),pad:new ui({color:15327432,roughness:.78,metalness:0,envMapIntensity:.9}),dark:new ui({color:855310,roughness:.9,metalness:0,envMapIntensity:.25,side:Js}),riser:new mr({color:14606305,metalness:1,roughness:.3}),bore:new Li({color:16777215,vertexColors:!0,side:Js}),cork:new ui({color:2763308,roughness:.55,metalness:.2,envMapIntensity:.6}),spring:new ui({color:4015704,roughness:.35,metalness:1,envMapIntensity:1})};e.silver.name="silver";let t=[$.sock[0],$.bodyEnd],n=S=>S<t[0]?"head":S<t[1]?"body":"foot",i={};for(let S of["head","body","foot"])i[S]=new On,i[S].name="joint:"+S,r.add(i[S]);let s={};for(let S of Object.keys(i))s[S]={silver:[],satin:[],pad:[],dark:[],cork:[],spring:[],riser:[],bore:[]};let a=(S,...I)=>{for(let O of I){la(O),O.computeBoundingBox();let H=O.boundingBox;S==="silver"&&!O.userData.tube&&H.min.x>150&&ph(O),s[n((H.min.x+H.max.x)/2)][S].push(O)}},o=(S,I,O,H,W)=>{let Z=[],le=(I-S)/H;for(let re=0;re<H;re++){let ie=S+re*le;Z.push([ie+.15*le,O],[ie+.5*le,O-W],[ie+.85*le,O])}return Z},l=(S,I,O,H)=>{let W=[],Z=(I-S)/H;for(let le=0;le<H;le++){let re=S+le*Z;W.push([re+.08*Z,O],[re+.32*Z,O],[re+.5*Z,O-.22],[re+.68*Z,O],[re+.92*Z,O])}return W},c=[[$.crown,0],[$.crown+.15,2.6],[$.crown+.55,4.6],[$.crown+1.3,6.4],[$.crown+2.3,7.7],[$.crown+3.4,8.6],[$.crown+4,9.1],[$.crown+4.3,9.3],[$.crown+4.6,9.45],...o($.crown+4.8,$.crown+8.4,9.45,9,.07),[$.crown+8.6,9.45],[$.crown+8.9,9.25],[$.crown+9.2,Pl($.crown+9.2)],...[-50,-30,-10,10,30,50,70,90,110].map(S=>[S,Pl(S)]),[$.sock[0],9.5],[$.sock[0]+.1,9.22],[$.sock[0]+33,9.22],[$.sock[0]+33.2,8.95],[$.sock[0]+33.2,8.4],[$.sock[0]+32,8.4]],h=[[$.sock[0],9.3],[$.sock[0],10.2],[$.sock[0]+.3,10.75],...l($.sock[0]+.3,$.sock[0]+4.3,10.75,2),[$.sock[0]+4.5,10.75],[$.sock[0]+4.7,10.12],[$.sock[1]-4.7,10.12],[$.sock[1]-4.5,10.75],...l($.sock[1]-4.3,$.sock[1]-.3,10.75,2),[$.sock[1]-.3,10.75],[$.sock[1],10.2],[$.sock[1]+.3,9.5],[$.bodyEnd,9.5],[$.bodyEnd+.1,9.22],[$.bodyEnd+22,9.22],[$.bodyEnd+22.2,8.95],[$.bodyEnd+22.2,8.4],[$.bodyEnd+21,8.4]],u=[[$.bodyEnd,9.3],[$.bodyEnd,10.3],[$.bodyEnd+.3,10.75],...l($.bodyEnd+.3,$.bodyEnd+3.8,10.75,2),[$.bodyEnd+4,10.75],[$.bodyEnd+4.2,10.25],[$.footSock-.5,10.25],[$.footSock-.2,9.9],[$.footSock,9.5],[$.end-4.6,9.5],[$.end-4.3,10.15],[$.end-.6,10.15],[$.end-.2,9.95],[$.end,9.55],[$.end,8.75],[$.end-.5,8.7]],d=S=>{let I=S.attributes.position,O=new Float32Array(I.count*3),H=be(),W=be(),Z=yr.filter(ie=>!ie.plate).map(ie=>({seat:ve(ie.x,ie.th,$.seat),n:vt(ie.th),r:ie.r,x:ie.x,th:ie.th,rod:$[ie.rod]})),le=["rodBody","rodG","rodFoot","rodGiz","rodTrill"].map(ie=>$[ie]),re=[[273,298,-179,-141,.72],[296,329,-150,-126,.62],[276,300,-134,-120,.3],[rt.x-2.4,rt.x+2.4,-181,-106,.6],[rt.x-2.4,rt.x+2.4,-238,-160,.3]];for(let ie=0;ie<I.count;ie++){H.fromBufferAttribute(I,ie);let T=1;if(Math.hypot(H.y,H.z)>$.R-.3){let b=Math.atan2(H.y,H.z)/Lt;for(let F of Z){if(Math.abs(H.x-F.x)>F.r+9||Math.abs((b-F.th+540)%360-180)>50)continue;W.subVectors(H,F.seat);let k=W.dot(F.n);if(k>.5)continue;let P=Math.sqrt(Math.max(0,W.lengthSq()-k*k));T*=1-.55*tt(F.r+2.8,F.r-2.4,P)-.2*tt(F.r+7.5,F.r+2.8,P);let B=ve(F.x,(F.th+F.rod.th)/2,$.R),M=Math.hypot(H.x-F.x,H.y-B.y,H.z-B.z);T*=1-.45*tt(5.5,1.5,M)}for(let[F,k,P,B,M]of re){if(H.x<F-4||H.x>k+4)continue;let z=(P+B)/2,q=Math.abs((b-z+540)%360-180),ce=(B-P)/2;T*=1-M*tt(ce+9,ce-4,q)*tt(F-3.5,F+1.5,H.x)*tt(k+3.5,k-1.5,H.x)}for(let F of le){if(H.x<F.x0-3||H.x>F.x1+3)continue;let k=Math.abs((Math.atan2(H.y,H.z)/Lt-F.th+540)%360-180);T*=1-.6*tt(24,4,k)}}O[ie*3]=O[ie*3+1]=O[ie*3+2]=T}return S.setAttribute("color",new It(O,3)),S.userData.tube=!0,S},p=S=>{let I=[S[0]];for(let O=1;O<S.length;O++){let[H,W]=S[O-1],[Z,le]=S[O],re=Math.max(1,Math.ceil(Math.abs(Z-H)/1.5));for(let ie=1;ie<=re;ie++)I.push([H+(Z-H)*ie/re,W+(le-W)*ie/re])}return I};a("silver",(S=>{let I=S.attributes.position,O=new Float32Array(I.count*3);for(let H=0;H<I.count;H++){let W=I.getX(H),Z=I.getY(H),le=I.getZ(H),re=Math.atan2(Z,le)/Lt,ie=tt(26,19,Math.abs(W)),T=tt(-125,-95,re)*tt(-30,-55,re)+tt(125,95,re)*tt(35,60,re),b=1-.7*ie*T;O[H*3]=O[H*3+1]=O[H*3+2]=b}return S.setAttribute("color",new It(O,3)),S})(Xt(Vt(p(c.filter(([S])=>!0)),{segs:96,crease:35}),be(0,0,0),_t)));for(let S of[h,u])a("silver",d(Xt(Vt(p(S),{segs:96,crease:35}),be(0,0,0),_t)));let _=(S,I,O)=>{let H=new Ui(I,40);return H.rotateY(O*Math.PI/2),H.translate(S,0,0),H};a("dark",_($.sock[0]+31.5,8.4,1),_($.sock[0]+1.2,9.3,-1),_($.bodyEnd+20.5,8.4,1),_($.bodyEnd+1.2,9.3,-1)),a("dark",Xt(Vt([[$.end-14,0],[$.end-14,8.7],[$.end-.5,8.7]],{segs:40}),be(0,0,0),_t));let f=Dp(),g=be(0,0,-4);a("silver",Mr(f.top,g),Mr(f.bot,be(0,0,40)),Mr(f.rim,be(0,f.HY,8)),Mr(f.outerW,be(0,f.HY,12))),a("riser",Mr(f.wallTop,be(0,f.HY,12.8),!0)),a("bore",Mr(f.wallLow,be(0,f.HY,8.5),!0),la(f.floor));for(let S of yr){if(S.plate)continue;let I=vt(S.th),O=ve(S.x,S.th,$.seat);a("silver",Xt(Ip(S.r),O.clone(),I)),a("dark",Xt(Lp(S.r),O.clone(),I))}let v=(S,I=S.x0,O=S.x1,H=1.9)=>{let W=ve(0,S.th,S.R);return kn(I,O,W.y,W.z,H,18)},x=(S,I)=>{for(let O of I){let H=ve(0,S.th,S.R);a("satin",kn(O-.35,O+.35,H.y,H.z,1.93,16))}};for(let S of["rodBody","rodG","rodFoot","rodGiz","rodTrill"])a("silver",v($[S]));x($.rodBody,[238.5,249.5,271.5,292.5,316.5,341.5,366,389.5,395.2,421,451.5]),x($.rodFoot,[503,516,552,589]);let y={rodBody:[216,271.5,316.5,387.5,475.5],rodG:[316,366],rodFoot:[483.5,552,647],rodGiz:[509,592],rodTrill:[186,284,458]};for(let[S,I]of Object.entries(y)){let O=$[S];for(let H of I)a("silver",...Rp(H,O));for(let[H,W]of[[I[0],-1],[I[I.length-1],1]]){let Z=ve(0,O.th,O.R),le=H+W*2.1,re=H+W*2.75;a("silver",kn(Math.min(le,re),Math.max(le,re),Z.y,Z.z,1.15,16));let ie=new ci(.3,2.1,.32);ie.rotateX(-O.th*Lt),ie.translate(re+W*.02,Z.y,Z.z),a("dark",ie)}S!=="rodGiz"?a("silver",oa(I[0]-3.5,I[I.length-1]+3.5,O.th,4.4)):a("silver",oa(I[0]-3,I[0]+3,O.th,4),oa(I[1]-3,I[1]+3,O.th,4))}for(let S of[311.5,384.5,412.5,442.5,460.5]){let I=$.rodBody,O=vt(I.th+70),H=ve(S,I.th,I.R),W=H.clone().addScaledVector(O,3.7);a("silver",an([H.clone().addScaledVector(O,1.2),W],1,{up:_t,scaleN:1.15,scaleB:.95,sq:4,segs:16,capA:!0,capB:!0})),a("silver",Xt(Vt([[0,0],[0,.8],[.5,.8],[.62,.66],[.62,0]],{segs:16,crease:40}),W.clone(),O))}for(let S of yr){if(S.shut||S.plate||S.foot||S.id==="Th")continue;let I=$[S.rod],O=I.th+14,H=$.R+2.1,W=S.x-(S.foot?13:11),Z=S.x-3;a("spring",an([ve(W,O,H),ve(Z,O,H+.4)],.26,{segs:8,capA:!0,capB:!0})),a("silver",Xt(Vt([[0,0],[0,.75],[2.4,.6],[2.6,0]],{segs:12}),ve(W,O,$.R-.2),vt(O)))}let w={},E=(S,I,O={})=>{let H=$[I],W=O.pivot?O.pivot.clone():ve(0,H.th,H.R),Z=new On;Z.name=S,Z.position.copy(W);let le=i[n(O.xMid)];le.add(Z);let re=e.silver.clone();re.name="key:"+S,re.clearcoat=.001,re.roughness=.06,re.color.set(15329505),re.vertexColors=!0;let ie={id:S,group:Z,pivot:W,sign:1,angle:O.angle||7*Lt,mat:re,meshes:[],x:0,v:0,to:0,paint:0,paintTo:0,col:new qe(15790321),colTo:new qe(15790321),out:O.out||null,anchor:O.anchor||null,xMid:O.xMid,joint:le,axis:O.axis||null,rot:0};return w[S]=ie,ie},U=(S,I,...O)=>{for(let H of O){let W=la(H);I==="key"&&ph(W),W.translate(-S.pivot.x,-S.pivot.y,-S.pivot.z);let Z=new Pt(W,I==="key"?S.mat:e[I]);Z.name=S.id+":"+I,S.group.add(Z),S.meshes.push(Z)}},V=(S,I,O)=>{let H=I.clone().sub(S.pivot),W=H.clone().applyAxisAngle(S.axis||_t,.01).sub(H);S.sign=W.dot(O)>=0?1:-1};for(let S of yr){let I=$[S.rod],O=vt(S.th),H=ve(S.x,S.th,$.seat),W=S.id==="Th",Z=E(S.id,S.rod,W?{angle:rt.ang,out:O.clone(),xMid:S.x,pivot:rt.pv,axis:rt.ax}:{angle:(S.shut?7.5:8.5)*Lt,out:O.clone(),xMid:S.x});if(Z.cup=S,Z.size=S.r,Z.anchor=H.clone().addScaledVector(O,4.3*Math.sqrt(S.r/9.3)),U(Z,"key",Xt(Cp(S.r,W),H.clone(),O)),S.plate||U(Z,"pad",Xt(Pp(S.r),H.clone().addScaledVector(O,.02),O)),W){V(Z,H,O);continue}let le=ve(S.x,I.th,I.R),re=le.clone().sub(H);re.addScaledVector(O,-re.dot(O)).normalize();let ie=Math.sqrt(S.r/9.3);if(S.foot){let b=H.clone().addScaledVector(O,4.2*ie+.65),F=b.clone().lerp(le,.5);F.addScaledVector(vt((S.th+I.th)/2),1.6);let k=$t([le.clone().addScaledVector(vt(I.th),.3),F,b.clone().addScaledVector(re,S.r*.97).addScaledVector(O,-.9*ie),b.clone().addScaledVector(re,S.r*.55).addScaledVector(O,-.12),b.clone().addScaledVector(re,-S.r*.15)],40);U(Z,"key",an(k,(P,B)=>1-.94*tt(.5,1,P/B),{up:_t,scaleN:1,scaleB:.62,sq:2.2,segs:14,capA:!0,capB:!0}))}else{let b=H.clone().addScaledVector(re,S.r-2.6).addScaledVector(O,2.3*ie),F=H.clone().addScaledVector(re,S.r+1.4).addScaledVector(O,2.05*ie),k=$t([b,F,le.clone().lerp(F,.45).addScaledVector(O,.5),le],28),P=Math.min(6.4,S.r*.7),B=3.4/P;if(U(Z,"key",an(k,(M,z)=>{let q=kt((M/z-.1)/.55,0,1);return B+(1-B)*(1-q)*(1-q)},{up:_t,scaleN:P/2,scaleB:.95,sq:3.4,segs:18,capA:!0,capB:!0})),!S.plate){let M=$t([le.clone().lerp(F,.55).addScaledVector(O,.9),H.clone().addScaledVector(re,S.r+.75).addScaledVector(O,2.5*ie),H.clone().addScaledVector(re,S.r*.84).addScaledVector(O,3.72*ie+.42),H.clone().addScaledVector(re,S.r*.45).addScaledVector(O,4.26*ie+.36),H.clone().addScaledVector(re,-S.r*.08).addScaledVector(O,4.5*ie+.1)],36);U(Z,"key",an(M,(z,q)=>1-.95*tt(.42,1,z/q),{up:_t,scaleN:Math.min(1.12,S.r*.12),scaleB:.6,sq:3.6,segs:14,capA:!0,capB:!0}))}}let T=S.plate||S.id==="Cs"?9:10;U(Z,"key",Xt(Vt([[S.x-T/2,0],[S.x-T/2,1.75],[S.x-T/2+.4,2.12],[S.x+T/2-.4,2.12],[S.x+T/2,1.75],[S.x+T/2,0]],{segs:20,crease:40}),be(0,le.y,le.z),_t)),V(Z,H,O),S.foot&&(Z.mat.envMapIntensity=1.1)}{let S=w.L1,I=$.rodBody;U(S,"key",kn(232,256.5,ve(0,I.th,I.R).y,ve(0,I.th,I.R).z,2.08,18))}let C=(S,I,O,H,W,Z=5,le={})=>{let re=E(S,I,Object.assign({angle:Z*Lt,out:W,anchor:H,xMid:H.x},le));return U(re,"key",...O),V(re,H,W.clone().negate()),re.touch=!0,re.xMid=H.x,re};{let S=$t([be(320.5,24.2,3.1),be(324.5,23.4,3.1),be(329,21.6,3),be(333,18.9,2.9),be(336.2,15.9,2.8),be(338.4,13.6,2.75)],40),O=an(S,(W,Z)=>W<6?Math.sqrt(Math.max(.02,1-Math.pow((6-W)/6,2))):1-.62*tt(6,Z,W),{up:mh,scaleN:1.05,scaleB:6,sq:2.6,segs:28,capA:!0,capB:!0}).applyMatrix4(new Be().makeTranslation(338.4,13.6,2.75).multiply(new Be().makeRotationX(-15*Lt)).multiply(new Be().makeTranslation(-338.4,-13.6,-2.75))),H=fi($t([be(338.2,13.9,2.75),be(339.8,12.4,2.8),ve(340.8,70,12.1),ve(341.3,50,12.8),ve(341.5,20,12.6),ve(341.5,-20,12.8),ve(341.5,-48,14.6),ve(341.5,$.rodBody.th,$.rodBody.R)],40),3.2,1.9);C("Gs","rodBody",[O,H],be(327,22,4.4),vt(12),5)}let X=an($t([ve(393.6,6,12),ve(393.3,-4,11.95),ve(392.6,-16,12),ve(392,-28,12.3)],30),(S,I)=>S<3.4?Math.sqrt(Math.max(.03,1-Math.pow((3.4-S)/3.4,2))):1-.55*tt(3.4,I,S),{up:vt(-8),scaleN:.9,scaleB:3.5,sq:2.6,segs:24,capA:!0,capB:!0});C("BbL","rodBody",[X,fi($t([ve(392.2,-30,12),ve(392.2,-52,11.6),ve(392.2,$.rodBody.th,$.rodBody.R)],16),2,1.2),(()=>{let S=ve(0,$.rodBody.th,$.rodBody.R);return kn(389.8,394.9,S.y,S.z,2.1,18)})(),an($t([ve(392.4,-30,12.1),ve(389.5,-40,12.5),ve(384,-45,12.9),ve(376,-46,13),ve(368.5,-46,12.9)],30),(S,I)=>1-.3*tt(.6,1,S/I),{up:vt(-46),scaleN:.7,scaleB:1.5,sq:3,segs:14,capA:!0,capB:!0})],ve(392.2,-14,13.7),vt(-22),6);for(let[S,I]of[["trD",421],["trDs",451.5]]){let O=sa(I,-12,11.4,5.6,12.5,1.8),H=fi($t([ve(I,-34,11.8),ve(I,-58,11.3),ve(I,-74,12.6),ve(I,-80,16),ve(I,$.rodTrill.th,$.rodTrill.R)],24),3,1.5);C(S+":t","rodTrill",[O,H],ve(I,-12,13.2),vt(-12),6)}{let S=yr.find(Pe=>Pe.id==="Th"),I=S.th,O=Math.sqrt(S.r/9.3),H=vt(I),W=br(I),Z=ve(S.x,I,$.seat),le=w.Th,re=Pe=>new Be().makeTranslation(rt.pv.x,rt.pv.y,rt.pv.z).multiply(new Be().makeRotationAxis(rt.ax,Pe)).multiply(new Be().makeTranslation(-rt.pv.x,-rt.pv.y,-rt.pv.z)),ie=re(le.sign*rt.ang),T=(Pe,We,$e=1.9)=>Xt(Vt([[0,0],[0,$e-.32],[.32,$e],[We-Pe-.32,$e],[We-Pe,$e-.32],[We-Pe,0]],{segs:22,crease:40}),rt.at(Pe),rt.ax),b=re(-le.sign*rt.ang),F=-158,k=vt(F),P=br(F),B=14.1,M=(Pe,We,$e)=>be(265+Pe,0,0).addScaledVector(k,B+$e).addScaledVector(P,We),q=aa([[9,4.85],[13,4.85],[18,4.85],[23,4.85],[28,4.85],[31.6,4.8],[32.3,3.3],[31.6,1.8],[30.2,1.5],[28.9,.8],[27.7,-.6],[25.6,-2.6],[22,-4.2],[17.5,-4.85],[12.8,-4.75],[9.6,-3.9],[7.9,-2],[7.5,.6],[7.8,3.2]],[16,1.2],M,{thick:1.5,dome:0,edge:.075,NT:168,NR:12,top:(Pe,We,$e)=>-.6*(1-Math.pow($e,6))*(1-Math.pow(Math.abs(We+.4)/5.25,2.4))}),ce=265+24.5,Y=327.6,oe=Pe=>tt(0,6.2,Pe-ce),ae=Pe=>.5+.5*oe(Pe),pe=an(gh([ce,265+31.5,rt.x,314,Y].map(Pe=>be(Pe,0,0)),.6).map(Pe=>{let We=Pe.x;return Pe.addScaledVector(k,B+.15+1.25*oe(We)-1.1*ae(We)).addScaledVector(P,4.85-1.6*ae(We))}),(Pe,We)=>(.5+.5*tt(0,6.2,Pe))*(1-.2*tt(We-1.1,We,Pe)),{up:P,scaleN:1.6,scaleB:1.1,sq:6,segs:24,capA:!0,capB:!0});U(le,"key",pe.applyMatrix4(b),q.applyMatrix4(b),T(-2.1,2.9)),le.anchor=M(17,0,1).applyMatrix4(b),le.out=k.clone();let fe=1.5,Ee=1.6,Ce=Z.clone().addScaledVector(H,4.5*O+.3+fe/2).addScaledVector(_t,3).addScaledVector(W,-.6),we=(Pe,We,$e)=>Ce.clone().addScaledVector(_t,Pe).addScaledVector(W,We).addScaledVector(H,$e).applyMatrix4(ie),Ve=aa([[1.5,6.4],[5,5.2],[6.3,2.2],[5.6,-1.2],[4,-4],[1.2,-5.9],[-2.2,-5.4],[-4.8,-2.8],[-5.9,.8],[-4.9,4],[-2.2,6]],[.3,.3],we,{thick:fe,dome:Ee,pillow:!0,NR:12,NT:144}),Le=aa([[5.5,4.7],[7.2,4.55],[9.2,4.5],[7.7,3.85],[6.85,2.9],[6.4,1.4],[5.8,2.4],[5.5,3.6]],[6.3,3.9],(Pe,We,$e)=>we(Pe,We,$e-.3),{thick:1.2,dome:.15,edge:.2,NT:64,NR:5}),et=we(6.4,5.3,-.35),at=Math.hypot(et.y,et.z),st=Math.atan2(et.y,et.z)/Lt,Re=st-7,Oe=16.6,Ke=Y-4.8,bn=Pe=>{let We=tt(293,308,Pe);return ve(Pe,st+(Re-st)*We,at-.45+(Oe+.1-(at-.45))*We)},Hn=an($t([we(0,4.6,.2),we(3.4,5.1,.05),et,ve(280,st,at-.1),ve(287,st,at-.25),...[293,296,299,302,305,308].map(bn),ve(314,Re,Oe),ve(Ke,Re,Oe-.1)],110),(Pe,We)=>(.66+.34*tt(4,24,Pe)-.15*tt(36,46,Pe))*(1-.2*tt(We-1,We,Pe)),{up:br(st),scaleN:1.7,scaleB:1.15,sq:2.3,segs:24,capA:!0,capB:!0}),Dt=rt.sOf(Re),Gt=an([rt.at(Dt),rt.at(Dt).addScaledVector(vt(Re),4.9)],1,{up:_t,scaleN:1.35,scaleB:1.3,sq:4,segs:16,capA:!0,capB:!0}),on=C("Tb","axThumb",[Ve,Le,Hn,Gt,T(3.2,8.4)],we(0,0,fe/2+Ee),vt(I),5,{pivot:rt.pv,axis:rt.ax});on.angle=rt.ang;let J=rt.sOf(-172),ct=rt.sOf(-110),mi=rt.at(J),Tt=rt.at(ct),gi=1.95;a("satin",Xt(Vt([[0,0],[0,1],[ct-J,1],[ct-J,0]],{segs:14}),mi.clone(),rt.ax)),a("silver",Il(mi,gi,28),Xt(Vt([[0,0],[0,2.6],[.45,2.25],[1.2,1.5],[3.2,1.5],[3.2,0]],{segs:18}),ve(rt.x,-172,$.R+.25),vt(-172)));{let Pe=[];for(let We=0;We<=34;We++){let $e=We/34,qt=1-.95*tt(.7,1,$e);Pe.push(ve(rt.x,-160-70*$e,$.R+.03+.42*qt))}a("silver",an(Pe,(We,$e)=>(1-.95*tt(.7,1,We/$e))*Math.sqrt(Math.max(.06,1-Math.pow(Math.max(0,1-We/2.4),2))),{up:_t,scaleN:2.2,scaleB:.45,sq:3,segs:14,capA:!0,capB:!0}))}{let Pe=new Ui(.5,20);Pe.applyMatrix4(new Be().makeBasis(_t,vt($.axThumb.th),rt.ax.clone().negate()).setPosition(rt.at(J-gi-.015))),a("dark",Pe)}{let Pe=ve(rt.x,-110,$.R+.4),We=Tt.distanceTo(Pe);a("silver",Xt(Vt([[0,0],[0,2.7],[.55,2.4],[1.5,1.6],[We-.4,1.6],[We,0]],{segs:18}),Pe,vt(-110)),oa(rt.x-3.4,rt.x+3.4,-110,3.8),Il(Tt,2.05,28))}{let Pe=w.Bb,We=$.rodBody,$e=ve(0,We.th,We.R),qt=Ke-1.6,fn=new Be().makeTranslation($e.x,$e.y,$e.z).multiply(new Be().makeRotationX(-Pe.sign*Pe.angle)).multiply(new Be().makeTranslation(-$e.x,-$e.y,-$e.z)),mn=ve(qt,-110,20.3),vi=ve(qt,Re,Oe+1+.55),Qt=vi.clone().sub(mn),gn=Qt.length();Qt.normalize();let Vn=be().crossVectors(Qt,_t);Vn.dot(mn)<0&&Vn.negate();let Mt=[an($t([ve(qt,We.th,We.R),ve(qt,-80,16.2),ve(qt,-96,17.3),ve(qt,-106,19.3),mn.clone().addScaledVector(Qt,.5).addScaledVector(Vn,-.25)],32),(vn,Ln)=>1-.3*tt(.6,1,vn/Ln),{up:_t,scaleN:1.15,scaleB:1,sq:2.3,segs:18,capA:!0,capB:!0})];for(let vn of[-1.32,1.32])Mt.push(aa([[0,-1.1],[0,1.1],[2.6,1.15],[gn-2.3,1.15],[gn,0],[gn-2.3,-1.15],[2.6,-1.15]],[gn*.45,0],(Ln,Gn,_i)=>mn.clone().addScaledVector(Qt,Ln).addScaledVector(_t,Gn+vn).addScaledVector(Vn,_i),{thick:1,dome:.2,edge:.16,NT:64,NR:5}));U(Pe,"key",kn(qt-2.4,qt+2.4,$e.y,$e.z,2.12,18),...Mt.map(vn=>vn.applyMatrix4(fn)))}}{let S=sa(484.2,-80,17.2,13.5,22,2,{tilt:46,sq:3.6}),I=fi($t([ve(487.6,-80,17),ve(487.6,-45,13.2),ve(487.6,-10,12.6),ve(487.6,$.rodFoot.th,$.rodFoot.R)],28),2.6,1.3);C("Eb","rodFoot",[S,I],ve(484,-90,19.2),vt(-54),5)}let L=(S,I,O)=>{let W=ve(0,I,14.6),Z=Xt(Vt([[491.5,0],[491.5,1.45],[492,1.95],[493.2,2.3],[496,2.72],[500,2.9],[504,2.72],[506.8,2.3],[508,1.95],[508.5,1.45],[508.5,0]],{segs:48,crease:40}),be(0,W.y,W.z),_t),le=(I<-15?[490.4,509.6]:[492,508]).map(ie=>fi($t([ve(ie,I,14.6),ve(ie,I+2,12.3),ve(ie,(I+$.rodFoot.th)/2,11.5),ve(ie,$.rodFoot.th-6,12),ve(ie,$.rodFoot.th,$.rodFoot.R)],24),2,1)),re=kn(490.5,509.5,W.y,W.z,.8,10);return C(S,"rodFoot",[Z,re,...le],ve(500,I,14.6+2.6),vt(I),4)};L("B",-6,vt(-6)),L("C",-30,vt(-30));{let S=sa(502.5,-70,17.2,21,15,2,{tilt:40,sq:3.4}),I=fi($t([ve(513,-66,16.8),ve(517.5,-45,13.4),ve(518.5,-15,12.4),ve(518.5,5,12.3),ve(518.5,$.rodFoot.th,$.rodFoot.R)],30),2.6,1.3);C("CsT","rodFoot",[S,I],ve(503,-72,19),vt(-46),5)}{let S=sa(512.5,-18,16.2,6.5,9,2,{tilt:0}),I=fi($t([ve(512.5,-10,16),ve(512.5,0,12.6),ve(512.5,18,11.6),ve(512,38,11.9),ve(511,$.rodGiz.th,$.rodGiz.R)],24),2.2,1.2),O=C("giz","rodGiz",[S,I],ve(512.5,-18,18.2),vt(-18),5);U(O,"key",fi($t([ve(590,$.rodGiz.th,$.rodGiz.R),ve(596,40,14.4),ve(600,$.rodFoot.th+2,$.rodFoot.R+1.6)],16),2.2,1.3))}let D=[];for(let[S,I]of Object.entries(s))for(let[O,H]of Object.entries(I)){if(!H.length)continue;let W=new Pt(dh(H),e[O]);W.name=S+":"+O,i[S].add(W),D.push(W)}for(let S of Object.values(w)){let I=new Map;for(let H of S.meshes)I.has(H.material)||I.set(H.material,[]),I.get(H.material).push(H);let O=[];for(let[H,W]of I){let Z=dh(W.map(re=>re.geometry)),le=new Pt(Z,H);le.name=W[0].name;for(let re of W)S.group.remove(re);S.group.add(le),O.push(le)}S.meshes=O,D.push(...O)}let j=[{id:"tube",a:be($.crown,0,0),b:be($.end,0,0),r:$.R},{id:"plate",a:be(-18,1,11),b:be(18,1,11),r:3}];for(let S of["rodBody","rodFoot","rodTrill"]){let I=$[S];j.push({id:S,a:ve(I.x0,I.th,I.R),b:ve(I.x1,I.th,I.R),r:2})}let G=[{obj:i.head,a:be($.crown+4,0,0),u:_t.clone(),r:9.15,L:$.sock[0]-$.crown-4},{obj:i.body,a:be($.sock[0],0,0),u:_t.clone(),r:$.R,L:$.bodyEnd-$.sock[0]},{obj:i.foot,a:be($.bodyEnd,0,0),u:_t.clone(),r:$.R,L:$.end-$.bodyEnd}];for(let S of yr){let I=w[S.id],O=vt(S.th),H=ve(S.x,S.th,$.seat);G.push({obj:I.group,a:H.clone().sub(I.pivot),u:O,r:S.r,L:4.2*Math.sqrt(S.r/9.3)})}let Q=new Li({color:3894952,transparent:!0,opacity:0,depthWrite:!1});e.guide=Q;let te=[["head",kn(-58,$.sock[0]+30,0,9.75,.32,8),be(0,0,0)],["body",kn($.sock[0]+3,$.bodyEnd+18,0,9.85,.32,8),be(0,0,0)],["foot",(()=>{let S=ve(0,$.rodFoot.th,$.rodFoot.R+2.1);return kn($.bodyEnd+2,$.end-6,S.y,S.z,.32,8)})(),be(0,0,0)]].map(([S,I])=>{let O=new Pt(la(I),Q);return O.name="guide:"+S,O.renderOrder=2,O.visible=!1,i[S].add(O),O});return{root:r,M:e,parts:w,meshes:D,capsules:j,lip:f,joints:i,jointOf:n,refl:G,guides:te}}function Np(r){let e=s=>r.has(s),t=new Set;e("L1")&&(t.add("L1"),t.add("Cs")),e("L2")&&(t.add("As"),t.add("Bb")),e("L3")&&(t.add("A"),t.add("Gf")),e("R1")&&(t.add("Fs"),t.add("G"),t.add("Bb")),e("R2")&&(t.add("F"),t.add("G")),e("R3")&&(t.add("E"),t.add("G")),(e("Tb")||e("BbL"))&&t.add("Bb"),(e("T")||e("Tb"))&&t.add("Th"),e("Cs")&&t.add("D"),e("C")&&(t.add("D"),t.add("CsF")),e("B")&&(t.add("D"),t.add("CsF"),t.add("CF")),e("giz")&&t.add("CF");let n=new Set;e("Eb")&&n.add("Ds"),e("Gs")&&n.add("GsR"),e("trD")&&n.add("trD"),e("trDs")&&n.add("trDs");let i=new Set;for(let s of["Gs","Tb","BbL","Eb","C","B","giz"])e(s)&&i.add(s);return e("Cs")&&i.add("CsT"),e("trD")&&i.add("trD:t"),e("trDs")&&i.add("trDs:t"),{closed:t,opened:n,touches:i}}var Op=[["Crown",[-70,6,7],null],["Lip plate",[-15,-7,11.8],[0,-.45,.9]],["Embouchure hole",[0,1.2,13.6],[0,0,1]],["Head joint",[60,9.5,.5],null],["Body",[175,9.5,.5],null],["Rod",[258,-15,8],[0,-.9,.45]],["Post",[216,-15,8],[0,-.9,.45]],["Thumb keys",[268,-12,-18.5],[0,-.57,-.82]],["Trill keys",[421,-2.7,12.9],[0,-.2,1]],["G\u266F key",[327,22,4.2],[0,.2,1]],["Foot joint",[630,9.5,.5],null],["Rollers",[500,-1.8,17],[0,-.1,1]],["Gizmo",[512.5,-5.6,17.3],[0,-.3,1]],["E\u266D key",[484,-19.2,.3],[0,-.8,.6]]],Fp=`
.vf3d-root{position:relative;overflow:hidden;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.vf3d-canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;outline:none;cursor:grab;touch-action:none}
.vf3d-canvas.vf3d-drag{cursor:grabbing}
.vf3d-canvas:focus-visible{outline:2px solid #3b6ea8;outline-offset:-2px;border-radius:12px}
.vf3d-over{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:hidden}
.vf3d-over svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}
.vf3d-over line{stroke:#1f2937;stroke-width:1;stroke-opacity:.7;transition:opacity .16s}
.vf3d-over circle{fill:#1f2937;transition:opacity .16s}
.vf3d-tag{position:absolute;left:0;top:0;font:600 13px/1.15 system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1f2937;background:#fff;border:1px solid rgba(31,41,55,.28);border-radius:7px;padding:3px 7px 4px;white-space:nowrap;box-shadow:0 1px 3px rgba(31,41,55,.16);will-change:transform,opacity;transition:opacity .16s}
.vf3d-chip{position:absolute;left:0;top:0;min-width:22px;height:20px;padding:0 5px;box-sizing:border-box;border-radius:10px;font:700 12px/18px system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;text-align:center;color:#1f2937;background:rgba(255,255,255,.94);border:1.5px solid #4b5563;box-shadow:0 1px 3px rgba(31,41,55,.22);white-space:nowrap;will-change:transform,opacity;transition:opacity .14s}
.vf3d-chip.on{background:#1f2937;color:#fff;border-color:#1f2937}
.vf3d-chip.behind{border-style:dashed;box-shadow:none}
.vf3d-pick{z-index:2;font-weight:600;padding:0 9px;transition:none}
.vf3d-chip.on.behind{background:#4b5563;border-color:#1f2937}
`,Bi={front:{az:0,el:8},player:{az:-38,el:13},top:{az:0,el:86},under:{az:0,el:-84},back:{az:180,el:8},foot:{az:66,el:14},head:{az:-18,el:22,x:[-80,70],zoom:!0},left:{az:-8,el:14,x:[215,365],zoom:!0},right:{az:-8,el:10,x:[370,482],zoom:!0},footkeys:{az:8,el:6,x:[476,655],zoom:!0}};function Bp(r,e={}){let t=Object.assign({labels:"off",view:"front",shot:!1},e);if(!document.getElementById("vf3d-style")){let N=document.createElement("style");N.id="vf3d-style",N.textContent=Fp,document.head.appendChild(N)}r.classList.add("vf3d-root"),getComputedStyle(r).position==="static"&&(r.style.position="relative");let n=new Fs({antialias:!0,alpha:!0,premultipliedAlpha:!0,preserveDrawingBuffer:!!t.shot,powerPreference:"high-performance"});n.setClearColor(0,0),n.outputColorSpace=cn,n.toneMapping=Tp?kc:Hc,n.toneMappingExposure=.9;let i=n.domElement;i.className="vf3d-canvas",i.setAttribute("aria-label","3D flute: drag to turn it, pinch or scroll to zoom; with the keyboard, arrows turn it, Page Up and Page Down zoom, Home puts it back"),r.appendChild(i);let s=document.createElement("div");s.className="vf3d-over",r.appendChild(s);let a=document.createElementNS("http://www.w3.org/2000/svg","svg");s.appendChild(a);let o=new dr,l=new ur(n),c=l.fromScene(Ap(),.01,.1,200);o.environment=c.texture,l.dispose();let h=Up();o.add(h.root);let u=Object.values(h.parts),d=h.parts,p=[h.M.silver,h.M.satin,h.M.riser,...u.map(N=>N.mat)],m=`vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;`,_=Xe.envmap_physical_pars_fragment||"",f=_.includes(m),g="plain",v=h.refl.length,x={fsA:{value:h.refl.map(()=>new xt)},fsB:{value:h.refl.map(()=>new xt)}},y=be(),w=be();function E(){let N=O.matrixWorldInverse;h.refl.forEach((se,xe)=>{y.copy(se.a).applyMatrix4(se.obj.matrixWorld).applyMatrix4(N),w.copy(se.u).transformDirection(se.obj.matrixWorld).transformDirection(N),x.fsA.value[xe].set(y.x,y.y,y.z,se.r),x.fsB.value[xe].set(w.x,w.y,w.z,se.L)})}function U(N){if(N=f&&(N==="high"||N==="low")?N:"plain",N!==g){g=N;for(let se of p){delete se.defines.FS_TRACE,delete se.defines.FS_N;let xe=/^key:/.test(se.name);xe&&(se.defines.FS_KEYS=1),N==="plain"?(se.onBeforeCompile=()=>{},se.customProgramCacheKey=()=>"vf-plain"):(N==="high"&&(se.defines.FS_TRACE=1,se.defines.FS_N=v),se.customProgramCacheKey=()=>"vf-"+N+(xe?"-k":""),se.onBeforeCompile=he=>{Object.assign(he.uniforms,x),he.fragmentShader=he.fragmentShader.replace("#include <envmap_physical_pars_fragment>",vh+wp+`
`+_.replace(m,`vec3 fsV = normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz );
			#ifdef FS_TRACE
			return fsRadiance( - vViewPosition + normal * 0.05, fsV, roughness ) * envMapIntensity;
			#else
			return fsStudio( fsV, roughness ) * envMapIntensity;
			#endif`))}),se.needsUpdate=!0}}}let V=!1;n.debug.onShaderError=(N,se,xe,he)=>{V||(V=!0,console.warn("Virtual Flute: the studio shader did not compile here; using plain reflections. "+(N.getProgramInfoLog(se)||"")+" "+(N.getShaderInfoLog(he)||"").slice(0,600)))},U(t.reflections==="plain"?"plain":t.reflections==="low"?"low":"high");let C=[],X=new pn;h.root.updateMatrixWorld(!0);for(let N of h.meshes){let se=N.parent;for(;se&&!/^joint:/.test(se.name);)se=se.parent;let xe=N.geometry.attributes.position,he=Math.max(1,Math.floor(xe.count/1500));for(let ue=0;ue<xe.count;ue+=he){let Me=be().fromBufferAttribute(xe,ue).applyMatrix4(N.matrixWorld);Me.j=se,C.push(Me),X.expandByPoint(Me)}N.geometry.computeBoundingBox();let Se=N.geometry.boundingBox;for(let ue of[Se.min.x,Se.max.x])for(let Me of[Se.min.y,Se.max.y])for(let _e of[Se.min.z,Se.max.z]){let Ze=be(ue,Me,_e).applyMatrix4(N.matrixWorld);Ze.j=se,C.push(Ze)}}let L=X.getCenter(be()),D={head:-75,body:0,foot:75},j={head:-38*Lt,body:0,foot:30*Lt},G=0,Q=0,te=N=>{let se=h.joints[h.jointOf(N.x)];return se.updateMatrix(),N.applyMatrix4(se.matrix)};X.min.x+=D.head,X.max.x+=D.foot;let S=-34,I=(()=>{let Se=L.x,ue=0,Me=new yn(1024,160,{depthBuffer:!1}),_e=new yn(1024,160,{depthBuffer:!1}),Ze=new Hr(-480,480,66,-66,1,600);Ze.position.set(Se,300,ue),Ze.up.set(0,0,-1),Ze.lookAt(Se,0,ue);let He=new sn({uniforms:{y0:{value:S}},depthTest:!1,depthWrite:!1,blending:Fc,blendEquation:Bc,blendSrc:Ks,blendDst:Ks,vertexShader:"varying float h; uniform float y0; void main(){ vec4 w = modelMatrix * vec4(position,1.0); h = w.y - y0; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:"varying float h; void main(){ float k = 1.0 - 0.6 * smoothstep(0.0, 70.0, h); gl_FragColor = vec4(k, k, k, 1.0); }"}),ye=new Pt(new hi(2,2),new sn({uniforms:{tex:{value:null},dir:{value:new me}},depthTest:!1,depthWrite:!1,vertexShader:"varying vec2 u; void main(){ u = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`varying vec2 u; uniform sampler2D tex; uniform vec2 dir;
        void main(){ float s = 0.0, w = 0.0; for (int i = -8; i <= 8; i++){ float f = float(i); float g = exp(-f*f/18.0); s += texture2D(tex, u + dir * f).r * g; w += g; } gl_FragColor = vec4(vec3(s / w), 1.0); }`})),Ne=new dr;Ne.add(ye);let Ie=new Di,ot=new Pt(new hi(480*2,132),new sn({uniforms:{tex:{value:Me.texture},k:{value:.3}},transparent:!0,depthWrite:!1,vertexShader:"varying vec2 u; void main(){ u = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"varying vec2 u; uniform sampler2D tex; uniform float k; void main(){ float a = texture2D(tex, u).r; a = a*a*(3.0-2.0*a); vec2 e = smoothstep(0.0, 0.1, u) * smoothstep(0.0, 0.1, 1.0 - u); gl_FragColor = vec4(0.05, 0.05, 0.06, a * k * e.x * e.y); }"}));return ot.rotation.x=-Math.PI/2,ot.position.set(Se,S,ue),ot.renderOrder=-1,ot.name="shadow",o.add(ot),{plane:ot,bake:()=>{let Rt=n.toneMapping;n.toneMapping=zc,ot.visible=!1,o.overrideMaterial=He,n.setRenderTarget(Me),n.setClearColor(0,1),n.clear(),n.render(o,Ze),o.overrideMaterial=null,ot.visible=!0;let Ot=ye.material.uniforms;for(let Yt of[4,2,1])Ot.tex.value=Me.texture,Ot.dir.value.set(Yt/1024,0),n.setRenderTarget(_e),n.render(Ne,Ie),Ot.tex.value=_e.texture,Ot.dir.value.set(0,Yt/160),n.setRenderTarget(Me),n.render(Ne,Ie);n.setRenderTarget(null),n.setClearColor(0,0),n.toneMapping=Rt},dispose(){Me.dispose(),_e.dispose(),He.dispose(),ye.geometry.dispose(),ye.material.dispose(),ot.geometry.dispose(),ot.material.dispose()}}})();I.bake();let O=new rn(20,2,20,8e3),H=new ra(O,i);H.enableDamping=!0,H.dampingFactor=.09,H.minPolarAngle=.03,H.maxPolarAngle=Math.PI-.03,H.zoomSpeed=.9,H.screenSpacePanning=!0,H.mouseButtons={LEFT:In.ROTATE,MIDDLE:In.DOLLY,RIGHT:In.PAN},H.touches={ONE:zn.ROTATE,TWO:zn.DOLLY_PAN},H.target.copy(L);let W=2,Z=2,le=1,re=!1,ie=0,T=null,b="off",F=!1,k=0,P=0,B=0,M=[],z=()=>t.insets||(b==="parts"?{l:14,r:14,t:58,b:84}:{l:12,r:12,t:14,b:40}),q=be(),ce=be(),Y=be(),oe=be();function ae(N,se,xe){let he=N*Math.PI/180,Se=se*Math.PI/180;Y.set(-Math.sin(he)*Math.cos(Se),-Math.sin(Se),-Math.cos(he)*Math.cos(Se)),q.crossVectors(Y,Cl).normalize(),ce.crossVectors(q,Y).normalize();let ue=z(),Me=Math.max(40,W-ue.l-ue.r),_e=Math.max(40,Z-ue.t-ue.b),Ze=Math.tan(O.fov*Math.PI/360)*(_e/Z),He=Math.tan(O.fov*Math.PI/360)*(Me/Z),ye=(xe?C.filter(ht=>ht.x>=xe[0]&&ht.x<=xe[1]):C).map(ht=>{let Rt=ht.clone();return Rt.x+=D[ht.j.name.slice(6)]*Q,Rt}),Ne=new pn;for(let ht of ye)Ne.expandByPoint(ht);let Ie=Ne.getCenter(be()),ot=1e3;for(let ht=0;ht<6;ht++){let Rt=0,Ot=1/0,Yt=-1/0,Sn=1/0,dt=-1/0;for(let ln of ye){oe.subVectors(ln,Ie);let Dn=oe.dot(q),Wt=oe.dot(ce),en=oe.dot(Y);Rt=Math.max(Rt,Math.abs(Dn)/He-en,Math.abs(Wt)/Ze-en);let jt=1/(ot+en);Ot=Math.min(Ot,Dn*jt),Yt=Math.max(Yt,Dn*jt),Sn=Math.min(Sn,Wt*jt),dt=Math.max(dt,Wt*jt)}Ie.addScaledVector(q,(Ot+Yt)/2*ot).addScaledVector(ce,(Sn+dt)/2*ot),ot=Rt}return{dist:ot*1.04,target:Ie}}function pe(){let N=z();O.setViewOffset(W,Z,-(N.l-N.r)/2,-(N.t-N.b)/2,W,Z)}let fe={az:0,el:0,dist:1e3,target:L.clone()};function Ee(){let N=fe.az*Math.PI/180,se=fe.el*Math.PI/180;O.position.set(fe.target.x+fe.dist*Math.sin(N)*Math.cos(se),fe.target.y+fe.dist*Math.sin(se),fe.target.z+fe.dist*Math.cos(N)*Math.cos(se)),H.target.copy(fe.target),O.lookAt(fe.target)}function Ce(){let N=O.position.clone().sub(H.target);fe.dist=N.length(),fe.el=Math.asin(kt(N.y/fe.dist,-1,1))*180/Math.PI,fe.az=Math.atan2(N.x,N.z)*180/Math.PI,fe.target.copy(H.target)}let we=null;function nt(){H.enableDamping=!1,H.update(),H.enableDamping=!0}function Ve(N,se,xe,he,Se=650){nt(),Ce();let ue=(N-fe.az+540)%360-180;if(!Se){fe.az=N,fe.el=se,fe.dist=xe,fe.target.copy(he),Ee(),H.update(),we=null,Mt();return}we={t0:performance.now(),ms:Se,az0:fe.az,daz:ue,el0:fe.el,el1:se,d0:fe.dist,d1:xe,tg0:fe.target.clone(),tg1:he.clone()},Mt()}function Le(){let N=ae(Bi.front.az,Bi.front.el);H.minDistance=N.dist*.06,H.maxDistance=N.dist*2.2}let et=new qe(15329505),at=(N,se)=>{N.rot=se,N.axis?N.group.quaternion.setFromAxisAngle(N.axis,se):N.group.rotation.x=se},st=0;function Re(N){let se=Math.min(.05,st?(N-st)/1e3:.016);st=N;let xe=!1;for(let he of u){if(Math.abs(he.to-he.x)>1e-4||Math.abs(he.v)>.001){let Ze=se;for(;Ze>0;){let He=Math.min(Ze,.004);he.v+=(3364*(he.to-he.x)-2*.78*58*he.v)*He,he.x+=he.v*He,Ze-=He}Math.abs(he.to-he.x)<5e-4&&Math.abs(he.v)<.02&&(he.x=he.to,he.v=0),at(he,he.sign*he.angle*kt(he.x,-.06,1.06)),xe=!0}Math.abs(he.paintTo-he.paint)>.001&&(he.paint+=(he.paintTo-he.paint)*Math.min(1,se*20),Math.abs(he.paintTo-he.paint)<.004&&(he.paint=he.paintTo),xe=!0);let Se=he.paint,ue=he.mat;ue.color.copy(et).lerp(he.colTo,Se),ue.metalness=1-.62*Se,ue.roughness=.06+.2*Se,ue.clearcoat=Math.max(.001,Se),ue.clearcoatRoughness=.06,ue.emissive.copy(he.colTo).multiplyScalar(.3*Se),he===ge&&ue.emissive.addScalar(.1)}if(G!==Q){let he=Q-G,Se=se*2.2;G=Math.abs(he)<=Se?Q:G+Math.sign(he)*Se;let ue=G*G*(3-2*G);for(let[Me,_e]of Object.entries(h.joints))_e.position.x=D[Me]*ue,_e.rotation.x=j[Me]*tt(0,.7,G),_e.updateMatrix();h.M.guide.opacity=.85*tt(.05,.6,G);for(let Me of h.guides)Me.visible=G>.01;G===Q&&I.bake(),xe=!0}if(we){let he=kt((N-we.t0)/we.ms,0,1),Se=he<.5?4*he*he*he:1-Math.pow(-2*he+2,3)/2;fe.az=we.az0+we.daz*Se,fe.el=we.el0+(we.el1-we.el0)*Se,fe.dist=we.d0+(we.d1-we.d0)*Se,fe.target.lerpVectors(we.tg0,we.tg1,Se),Ee(),he>=1&&(we=null,nt(),Ee()),xe=!0}return xe}for(let N of u)N.to=N.x=N.cup&&!N.cup.shut?1:0,at(N,N.sign*N.angle*N.x);let Oe=[],Ke=[];function bn(){for(let N of Oe)N.el.remove(),N.line.remove(),N.dot.remove();Oe.length=0;for(let N of Ke)N.el.remove();Ke.length=0}let Hn=[["L1","L1","B"],["Cs","","B"],["Bb","","B\u266D"],["As","L2","A"],["A","L3","G"],["Gf","","G\u266F"],["G","","F\u266F"],["Fs","R1","F"],["F","R2","E"],["E","R3","D"],["D","","C\u266F"],["CsF","","C"],["CF","","B"],["Gs","L4","G\u266F"],["Th","LT","thumb B"],["Tb","LT","thumb B\u266D",!0],["BbL","R1","B\u266D lever",!0],["trD","R2","D trill",!0],["trDs","R3","D\u266F trill",!0],["Eb","R4","E\u266D"],["Ds","","E\u266D"],["CsT","R4","C\u266F",!0],["C","R4","C",!0],["B","R4","B",!0],["giz","R4","gizmo",!0]],Dt=new Set,Gt={};for(let[N,se,xe]of Hn)Gt[N==="trD"||N==="trDs"?N+":t":N]=[xe,se];Object.assign(Gt,{L1:["B key","L1"],Cs:["B (C\u266F cup, closed by L1)",""],Bb:["B\u266D cup",""],As:["A key","L2"],A:["G key","L3"],Gf:["G\u266F cup (closed by L3)",""],G:["F\u266F cup (closed by any right-hand finger)",""],Fs:["F key","R1"],F:["E key","R2"],E:["D key","R3"],D:["C\u266F cup",""],CsF:["C cup",""],CF:["B cup",""],Gs:["G\u266F key","L4"],GsR:["G\u266F cup (opened by the G\u266F key)",""],Th:["Thumb B key","LT"],Tb:["Thumb B\u266D key","LT"],BbL:["B\u266D lever","R1"],"trD:t":["D trill key","R2"],"trDs:t":["D\u266F trill key","R3"],trD:["D trill cup",""],trDs:["D\u266F trill cup",""],Eb:["E\u266D key","R4"],Ds:["E\u266D cup (opened by the E\u266D key)",""],CsT:["C\u266F key","R4"],C:["C roller","R4"],B:["B roller","R4"],giz:["Gizmo (low B only)","R4"]});let on=new Ys,J=new me,ct=null;function mi(N,se){let xe=i.getBoundingClientRect();if(!xe.width)return;J.set((N-xe.left)/xe.width*2-1,-(se-xe.top)/xe.height*2+1),on.setFromCamera(J,O);let he=on.intersectObjects(h.meshes,!1)[0];if(ct&&(ct.el.remove(),ct=null),!he){Mt();return}let[Se,ue]=he.object.name.split(":"),Me;if(Gt[Se]){let[ye,Ne]=Gt[Se];Me=Ne?`${ye} \xB7 ${Ne}`:ye}else{let ye=h.joints[Se]?he.point.clone().applyMatrix4(h.joints[Se].matrix.clone().invert()):he.point,Ne=ye.x;Me=Se==="head"?Ne<-60?"Crown":Math.abs(Ne)<26&&ye.z>9.6?Math.abs(Ne)<7&&Math.abs(ye.y-2)<6?"Embouchure hole":"Lip plate":"Head joint":Se==="foot"?"Foot joint":ue==="spring"?"Needle spring":"Body",ue==="silver"&&Math.hypot(ye.y,ye.z)>$.R+1.2&&Se!=="head"&&(Me=Math.hypot(ye.y,ye.z)>12?"Rod and posts":Me)}let _e=document.createElement("div");_e.className="vf3d-chip on vf3d-pick",_e.textContent=Me,s.appendChild(_e);let Ze=he.point.clone(),He=he.object.parent;for(;He&&!/^joint:/.test(He.name);)He=He.parent;He&&(He.updateMatrix(),Ze.applyMatrix4(He.matrix.clone().invert())),ct={el:_e,local:Ze,joint:He,until:performance.now()+2600,w:_e.offsetWidth,h:_e.offsetHeight},Mt()}function Tt(N){if(!ct)return!1;if(N>ct.until)return ct.el.remove(),ct=null,!1;let se=fn(ct.joint?$e.copy(ct.local).applyMatrix4(ct.joint.matrix):$e.copy(ct.local));return ct.el.style.transform=`translate(${(se.x-ct.w/2).toFixed(1)}px,${(se.y-ct.h-16).toFixed(1)}px)`,ct.el.style.opacity=Math.min(1,(ct.until-N)/400).toFixed(2),!0}function gi(){if(bn(),b==="parts"){for(let[N,se,xe]of Op){let he=document.createElement("div");he.className="vf3d-tag",he.textContent=N,s.appendChild(he);let Se=document.createElementNS("http://www.w3.org/2000/svg","line"),ue=document.createElementNS("http://www.w3.org/2000/svg","circle");ue.setAttribute("r",2.4),a.appendChild(Se),a.appendChild(ue),Oe.push({el:he,line:Se,dot:ue,pos:be(...se),out:xe?be(...xe).normalize():null,w:0,h:0,side:0,x:0,y:0,a:1})}for(let N of Oe)N.w=N.el.offsetWidth,N.h=N.el.offsetHeight}else if(b==="fingers"||b==="names"){for(let[N,se,xe,he]of Hn){let Se=b==="fingers"?se:xe;if(!Se)continue;let ue=N==="trD"||N==="trDs"?N+":t":N,Me=d[ue]||d[N];if(!Me||!Me.anchor)continue;let _e=document.createElement("div");_e.className="vf3d-chip",_e.textContent=Se,s.appendChild(_e),Ke.push({el:_e,p:Me,pid:ue,only:b==="fingers"&&!!he,prio:se?0:1,w:0,h:0})}for(let N of Ke)N.w=N.el.offsetWidth,N.h=N.el.offsetHeight}}let Pe=be(),We=be(),$e=be(),qt=be();function fn(N){Pe.copy(N);let se=Pe.clone().sub(O.position).dot(O.getWorldDirection(We))<0;return Pe.project(O),{x:(Pe.x*.5+.5)*W,y:(-Pe.y*.5+.5)*Z,behind:se}}let mn=be();function vi(N,se){mn.subVectors(N,O.position);let xe=mn.length();if(xe<10)return!1;mn.multiplyScalar((xe-3)/xe).add(O.position);for(let he of h.capsules){if(he.id===se)continue;let Se=he.r*.92;if(Ep(O.position,mn,he.a,he.b)<Se*Se)return!0}return!1}function Qt(N,se){return N.group.updateMatrixWorld(),se.copy(N.anchor).sub(N.pivot).applyAxisAngle(N.axis||_t,N.rot).add(N.pivot),N.joint.updateMatrix(),se.applyMatrix4(N.joint.matrix)}let gn=!1;function Vn(){if(Ke.length){let ue=[];for(let _e of Ke){let Ze=_e.p,He=Dt.has(_e.pid)||Dt.has(Ze.id),ye=1;_e.only&&!He&&(ye=0),b==="fingers"&&_e.pid==="Th"&&Dt.has("Tb")&&(ye=0),Qt(Ze,$e);let Ne=fn($e),Ie=fn($e.clone().addScaledVector(Ze.out,6));Pe.copy(O.position).sub($e).normalize();let ot=kt(Pe.dot(Ze.out),0,1);ye*=tt(-.15,.2,Pe.dot(Ze.out)),ye>0&&vi($e,null)&&(ye=0);let ht=!1;ye<.5&&b==="fingers"&&_e.prio===0&&!_e.only&&(ye=.62,ht=!0),b==="fingers"&&_e.pid==="Th"&&Dt.has("Tb")&&(ye=0,ht=!1),Ne.behind&&(ye=0),qt.setFromMatrixColumn(O.matrixWorld,0);let Rt=fn($e.clone().addScaledVector(qt,Ze.size||4)),Ot=Math.hypot(Rt.x-Ne.x,Rt.y-Ne.y),Yt,Sn;if(ot>.5&&Ot>1.15*_e.w)Yt=Ne.x-_e.w/2,Sn=Ne.y-_e.h/2;else{let dt=Ie.x-Ne.x,ln=Ie.y-Ne.y-Ot*ot,Dn=Math.hypot(dt,ln)||1;dt/=Dn,ln/=Dn;let Wt=10+_e.h/2+Ot*ot+.4*Math.hypot(Ie.x-Ne.x,Ie.y-Ne.y);Yt=Ne.x+dt*Wt-_e.w/2,Sn=Ne.y+ln*Wt-_e.h/2}Object.assign(_e,{lx:Yt,ly:Sn,la:ye,down:He,behindNow:ht})}let Me=Ke.slice().sort((_e,Ze)=>_e.behindNow-Ze.behindNow||_e.prio-Ze.prio);for(let _e of Me){let Ze=_e.la,He=_e.lx,ye=_e.ly;if(Ze>.05){for(let Ne of ue)if(He<Ne.x+Ne.w+2&&He+_e.w+2>Ne.x&&ye<Ne.y+Ne.h+1&&ye+_e.h+1>Ne.y){Ze=0;break}}Ze>.05&&ue.push({x:He,y:ye,w:_e.w,h:_e.h}),_e.el.style.transform=`translate(${He.toFixed(1)}px,${ye.toFixed(1)}px)`,_e.el.style.opacity=Ze.toFixed(2),_e.el.classList.toggle("on",_e.down&&b==="fingers"),_e.el.classList.toggle("behind",_e.behindNow)}return}if(b!=="parts"||!Oe.length)return;let N=0;for(let ue of Oe){let Me=fn(te($e.copy(ue.pos)));ue.ax=Me.x,ue.ay=Me.y;let _e=Me.behind?0:1;ue.out&&(Pe.copy(O.position).sub(ue.pos).normalize(),_e*=tt(-.25,.12,Pe.dot(ue.out))),(Me.x<-20||Me.x>W+20||Me.y<-20||Me.y>Z+20)&&(_e=0),_e>0&&vi(te($e.copy(ue.pos)),"plate")&&(_e=0),ue.a=_e}N=fn(L).y;let xe=Oe.filter(ue=>ue.a>.01),he=1/0,Se=-1/0;for(let ue of xe)he=Math.min(he,ue.ax),Se=Math.max(Se,ue.ax);if(xe.length){let ue=Se-he;ue<.4*W?gn=!0:ue>.5*W&&(gn=!1)}if(gn){let ue=(he+Se)/2;for(let Me of xe){let _e=Me.ax-ue;Me.col?_e*Me.col<-24&&(Me.col=-Me.col):Me.col=_e<0?-1:1}for(let Me of[-1,1]){let _e=xe.filter(ye=>ye.col===Me).sort((ye,Ne)=>ye.ay-Ne.ay);if(!_e.length)continue;let Ze=Me<0?Math.max(6,he-70):Math.min(W-6,Se+70);for(let ye of _e)ye.x=Me<0?Math.max(6,Ze-ye.w):Math.min(W-ye.w-6,Ze),ye.y=ye.ay-ye.h/2;let He=8;for(let ye of _e)ye.y=Math.max(ye.y,He),He=ye.y+ye.h+5;He=Z-40;for(let ye=_e.length-1;ye>=0;ye--){let Ne=_e[ye];Ne.y=Math.min(Ne.y,He-Ne.h),He=Ne.y-5}for(let ye of _e)ye.lx=Me<0?ye.x+ye.w:ye.x,ye.ly=ye.y+ye.h/2}}else{for(let ue of Oe){let Me=ue.ay-N;ue.side?Me*ue.side<-16&&(ue.side=-ue.side):ue.side=Me<0?-1:1}for(let ue of[-1,1]){let Me=xe.filter(ye=>ye.side===ue).sort((ye,Ne)=>ye.ax-Ne.ax);if(!Me.length)continue;let _e=Me.reduce((ye,Ne)=>ye+Ne.w+8,0),Ze=_e>W-20||Me.length>6?2:1,He=ue<0?8:Z-40;for(let ye=0;ye<Ze;ye++){let Ne=Me.filter((Ie,ot)=>ot%Ze===ye);for(let Ie of Ne)Ie.x=kt(Ie.ax-Ie.w/2,6,W-Ie.w-6),Ie.y=ue<0?He+ye*(Ie.h+6):He-Ie.h-ye*(Ie.h+6);for(let Ie=0;Ie<8;Ie++){for(let ot=1;ot<Ne.length;ot++){let ht=Ne[ot-1],Rt=Ne[ot],Ot=ht.x+ht.w+8-Rt.x;Ot>0&&(ht.x-=Ot/2,Rt.x+=Ot/2)}for(let ot of Ne)ot.x=kt(ot.x,6,W-ot.w-6)}}}for(let ue of xe)ue.lx=kt(ue.ax,ue.x+8,ue.x+ue.w-8),ue.ly=ue.side<0?ue.y+ue.h:ue.y}for(let ue of Oe)ue.el.style.transform=`translate(${(ue.x||0).toFixed(1)}px,${(ue.y||0).toFixed(1)}px)`,ue.el.style.opacity=ue.a.toFixed(2),ue.line.setAttribute("x1",(ue.lx||0).toFixed(1)),ue.line.setAttribute("y1",(ue.ly||0).toFixed(1)),ue.line.setAttribute("x2",ue.ax.toFixed(1)),ue.line.setAttribute("y2",ue.ay.toFixed(1)),ue.dot.setAttribute("cx",ue.ax.toFixed(1)),ue.dot.setAttribute("cy",ue.ay.toFixed(1)),ue.line.style.opacity=ue.dot.style.opacity=ue.a.toFixed(2)}function Mt(){!ie&&!re&&(ie=requestAnimationFrame(vn))}function vn(N){if(ie=0,re)return;let se=Re(N);!we&&H.update()&&(se=!0),H.autoRotate&&(se=!0);let xe=H.target;if(!X.containsPoint(xe)){let Se=X.clampPoint(xe,be()),ue=Se.sub(xe);xe.add(ue),O.position.add(ue)}let he=Math.asin(kt((O.position.y-S)/O.position.distanceTo(be(xe.x,S,xe.z)),-1,1));if(I.plane.material.uniforms.k.value=.3*tt(.02,.22,he),I.plane.visible=he>.02,o.environmentRotation.y=-Math.atan2(O.position.x-xe.x,O.position.z-xe.z),g==="high"&&(o.updateMatrixWorld(),O.updateMatrixWorld(),E()),n.render(o,O),V&&g!=="plain"&&(U("plain"),se=!0),se&&!t.shot&&(!F||g==="high")){let Se=N-P;Se<400&&(B=B?B*.85+Se*.15:Se,k=B>42?k+1:Math.max(0,k-1),k>20&&(F?g==="high"&&U("low"):(F=!0,At()),k=0,B=0))}P=N,Vn(),Tt(N)&&(se=!0),se?Mt():st=0}H.addEventListener("change",Mt),H.addEventListener("start",()=>{we=null,T=null,i.classList.add("vf3d-drag");for(let N of M)try{N()}catch(se){console.error(se)}}),H.addEventListener("end",()=>i.classList.remove("vf3d-drag"));let Ln=0,Gn=0,_i=0,Sr=0,A=0,K=0,ne=0,de=N=>{N.preventDefault(),clearTimeout(ne),ct&&(ct.el.remove(),ct=null),ke.resetView()},ee=N=>{Sr=N.clientX,A=N.clientY,K=performance.now()},ge=null,Ae=0,De=0,Fe=0,Ge=new Map;for(let N of u)for(let se of N.meshes)Ge.set(se,N);let Ye=[...Ge.keys()],ze=N=>{if(N.pointerType!=="mouse"||N.buttons){ge&&(ge=null,i.style.cursor="",Mt());return}De=N.clientX,Fe=N.clientY,!Ae&&(Ae=requestAnimationFrame(()=>{Ae=0;let se=i.getBoundingClientRect();if(!se.width)return;J.set((De-se.left)/se.width*2-1,-(Fe-se.top)/se.height*2+1),on.setFromCamera(J,O);let xe=on.intersectObjects(Ye,!1)[0],he=xe?Ge.get(xe.object):null;he!==ge&&(ge=he,i.style.cursor=he?"pointer":"",Mt())}))},Qe=()=>{ge&&(ge=null,i.style.cursor="",Mt())},yt=N=>{let se=performance.now();if(se-K>260||Math.hypot(N.clientX-Sr,N.clientY-A)>12)return;clearTimeout(ne);let xe=N.clientX,he=N.clientY;ne=setTimeout(()=>mi(xe,he),260),N.pointerType==="touch"&&(se-Ln<330&&Math.hypot(N.clientX-Gn,N.clientY-_i)<40?(Ln=0,clearTimeout(ne),ke.resetView()):(Ln=se,Gn=N.clientX,_i=N.clientY))},ut=N=>N.preventDefault();i.addEventListener("dblclick",de),i.addEventListener("pointerdown",ee),i.addEventListener("pointerup",yt),i.addEventListener("contextmenu",ut),i.addEventListener("pointermove",ze),i.addEventListener("pointerleave",Qe),i.tabIndex=0;let wt=N=>{let se={ArrowLeft:[-15,0],ArrowRight:[15,0],ArrowUp:[0,10],ArrowDown:[0,-10]}[N.key];if(se){N.preventDefault(),Ce(),T=null;for(let xe of M)try{xe()}catch(he){console.error(he)}Ve(fe.az+se[0],kt(fe.el+se[1],-85,85),fe.dist,fe.target,260);return}if(N.key==="PageUp"||N.key==="PageDown"){N.preventDefault(),Ce(),Ve(fe.az,fe.el,kt(fe.dist*(N.key==="PageUp"?.8:1.25),H.minDistance,H.maxDistance),fe.target,220);return}N.key==="Home"&&(N.preventDefault(),ke.resetView())};i.addEventListener("keydown",wt);let pt=N=>{N.preventDefault()},it=()=>{I.bake(),Mt()};i.addEventListener("webglcontextlost",pt),i.addEventListener("webglcontextrestored",it);function Ct(N,se){let xe=Bi[N]||Bi.front,he=ae(xe.az,xe.el,xe.x);Ve(xe.az,xe.el,he.dist,he.target,se)}function At(){if(re)return;let N=Math.max(2,r.clientWidth),se=Math.max(2,r.clientHeight),xe=r.getBoundingClientRect();le=xe.width>0&&N>0?xe.width/N:1;let he=Math.min((window.devicePixelRatio||1)*le,F?1:2.5);he=Math.max(he,F?.6:.75);let Se=N*se*he*he;Se>4e6&&(he*=Math.sqrt(4e6/Se));let ue=N!==W||se!==Z;if((ue||Math.abs(he-n.getPixelRatio())>.01)&&(n.setPixelRatio(he),n.setSize(N,se,!1)),W=N,Z=se,O.aspect=N/se,pe(),O.updateProjectionMatrix(),H.rotateSpeed=.9/le,H.panSpeed=1/le,Le(),ue&&T&&Ct(T,0),Oe.length)for(let Me of Oe)Me.w=Me.el.offsetWidth,Me.h=Me.el.offsetHeight;if(Ke.length)for(let Me of Ke)Me.w=Me.el.offsetWidth,Me.h=Me.el.offsetHeight;Mt()}let je=typeof ResizeObserver<"u"?new ResizeObserver(()=>At()):null;je&&je.observe(r);let ke={setKeys(N,se,xe){let he=N instanceof Set?N:new Set(N||[]),{closed:Se,opened:ue,touches:Me}=Np(he),_e=se?new qe(se):null,Ze=xe?new qe(xe):_e;Dt=new Set([...Se,...Me]);for(let He of u){let ye;if(He.cup)if(He.cup.shut)He.to=ue.has(He.id)?1:0,ye=!1;else{let Ne=Se.has(He.id);He.to=Ne?0:1,ye=Ne}else ye=Me.has(He.id),He.to=ye?1:0;ye&&_e?(He.colTo.copy(_e).lerp(Ze,kt((He.xMid-200)/420,0,1)),He.paintTo=1):He.paintTo=0}Mt()},setLabels(N){if(N=N==="fingers"||N==="names"||N==="parts"?N:"off",N===b)return;let se=b;b=N,gi(),se==="parts"!=(N==="parts")&&(pe(),O.updateProjectionMatrix(),T&&Ct(T,350)),Mt()},setView(N,se){T=Bi[N]?N:"front",pe(),O.updateProjectionMatrix(),Ct(T,se??700)},resetView(){ke.setView("front")},setCamera(N,se,xe,he=0){T=null;let Se=ae(N,se);Ve(N,se,Se.dist*(xe||1),Se.target,he)},lookAt(N,se,xe,he,Se,ue,Me=0){T=null,Ve(he,Se,ue,be(N,se,xe),Me)},setApart(N){Q=N?1:0,T&&Ct(T,800),Mt()},get apart(){return Q===1},setQuality(N){U(N),k=0,Mt()},get quality(){return g},setAutoRotate(N){H.autoRotate=!!N,H.autoRotateSpeed=1.6,Mt()},onViewChange(N){return typeof N=="function"&&M.push(N),()=>{let se=M.indexOf(N);se>=0&&M.splice(se,1)}},resize:At,render:Mt,views:Object.keys(Bi),get view(){return T},get labels(){return b},scene:o,camera:O,renderer:n,controls:H,flute:h.root,materials:h.M,parts:h.parts,info(){let N=0;for(let se of h.meshes)N+=se.geometry.index.count/3;return{triangles:N,meshes:h.meshes.length,calls:n.info.render.calls,pixelRatio:n.getPixelRatio(),size:[W,Z],cssScale:le,reflections:g,parts:u.length,lowRes:F}},dispose(){if(!re){re=!0,ie&&cancelAnimationFrame(ie),clearTimeout(ne),ct&&ct.el.remove(),je&&je.disconnect(),i.removeEventListener("dblclick",de),i.removeEventListener("pointerdown",ee),i.removeEventListener("pointerup",yt),i.removeEventListener("contextmenu",ut),i.removeEventListener("pointermove",ze),i.removeEventListener("pointerleave",Qe),Ae&&cancelAnimationFrame(Ae),i.removeEventListener("keydown",wt),i.removeEventListener("webglcontextlost",pt),i.removeEventListener("webglcontextrestored",it),H.dispose(),bn(),I.dispose();for(let N of h.meshes)N.geometry.dispose();for(let N of Object.values(h.M))N.dispose();for(let N of u)N.mat.dispose();c.dispose(),n.dispose(),i.remove(),s.remove(),r.classList.remove("vf3d-root"),M.length=0}}};return At(),b="off",ke.setLabels(t.labels),T=Bi[t.view]?t.view:"front",pe(),O.updateProjectionMatrix(),Ct(T,0),Mt(),ke}return Sh(zp);})();
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
Flute3D.builtFrom=121279;
