var Clarinet3D=(()=>{var Oa=Object.defineProperty;var iu=Object.getOwnPropertyDescriptor;var ru=Object.getOwnPropertyNames;var su=Object.prototype.hasOwnProperty;var au=(i,e)=>{for(var t in e)Oa(i,t,{get:e[t],enumerable:!0})},ou=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of ru(e))!su.call(i,r)&&r!==t&&Oa(i,r,{get:()=>e[r],enumerable:!(n=iu(e,r))||n.enumerable});return i};var lu=i=>ou(Oa({},"__esModule",{value:!0}),i);var Uf={};au(Uf,{createClarinet:()=>Df});var Jn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},li={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3};var cu=0,Gl=1,xa=2;var dh=5,qi=100,hu=101,uu=102;var ph=104,du=200,Ma=201,pu=202,fu=203,vo=204,_o=205,mu=206,gu=207,vu=208,_u=209,yu=210,xu=211,Mu=212,bu=213,Su=214,wu=0,Eu=1,Tu=2,Au=3,Ru=4,Cu=5,Pu=6,Lu=7;var fh=0;var mh=5;var gh=7;var vh=300,wr=301,Er=302,yo=303,xo=304,ba=306,$r=1e3,Qr=1001,Mo=1002,Xn=1003,Iu=1004;var vs=1005;var gi=1006,Fa=1007;var yr=1008;var Di=1009,_h=1010,yh=1011,es=1012,Wl=1013,Ki=1014,vi=1015,ps=1016,jl=1017,Xl=1018,Tr=1020,xh=35902,Mh=1021,bh=1022,ri=1023,Sh=1024,wh=1025,ts=1026,Ar=1027,Eh=1028,ql=1029,Th=1030,Yl=1031;var Zl=1033,js=33776,Xs=33777,qs=33778,Ys=33779,bo=35840,So=35841,wo=35842,Eo=35843,To=36196,Ao=37492,Ro=37496,Co=37808,Po=37809,Lo=37810,Io=37811,Do=37812,Uo=37813,No=37814,Oo=37815,Fo=37816,Bo=37817,zo=37818,ko=37819,Vo=37820,Ho=37821,Zs=36492,Go=36494,Wo=36495,Ah=36283,jo=36284,Xo=36285,qo=36286;var Ks=2300,Yo=2301,Ba=2302,lc=2400,cc=2401,hc=2402;var vr="",Pn="srgb",Ur="srgb-linear",Sa="linear",Ot="srgb";var rr=7680;var Du=512,Uu=513,Nu=514,Ou=515,Fu=516,Bu=517,zu=518,ku=519,uc=35044;var dc="300 es",Rr=2e3,Js=2001,yi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let n=this._listeners[e];if(n!==void 0){let r=n.indexOf(t);r!==-1&&n.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let t=this._listeners[e.type];if(t!==void 0){e.target=this;let n=t.slice(0);for(let r=0,s=n.length;r<s;r++)n[r].call(this,e);e.target=null}}},fn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],pc=1234567,Mr=Math.PI/180,ns=180/Math.PI;function nr(){let i=4294967295*Math.random()|0,e=4294967295*Math.random()|0,t=4294967295*Math.random()|0,n=4294967295*Math.random()|0;return(fn[255&i]+fn[i>>8&255]+fn[i>>16&255]+fn[i>>24&255]+"-"+fn[255&e]+fn[e>>8&255]+"-"+fn[e>>16&15|64]+fn[e>>24&255]+"-"+fn[63&t|128]+fn[t>>8&255]+"-"+fn[t>>16&255]+fn[t>>24&255]+fn[255&n]+fn[n>>8&255]+fn[n>>16&255]+fn[n>>24&255]).toLowerCase()}function en(i,e,t){return Math.max(e,Math.min(t,i))}function Zo(i,e){return(i%e+e)%e}function Yr(i,e,t){return(1-t)*i+t*e}function _r(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function En(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(4294967295*i);case Uint16Array:return Math.round(65535*i);case Uint8Array:return Math.round(255*i);case Int32Array:return Math.round(2147483647*i);case Int16Array:return Math.round(32767*i);case Int8Array:return Math.round(127*i);default:throw new Error("Invalid component type.")}}var wa={DEG2RAD:Mr,RAD2DEG:ns,generateUUID:nr,clamp:en,euclideanModulo:Zo,mapLinear:function(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)},inverseLerp:function(i,e,t){return i!==e?(t-i)/(e-i):0},lerp:Yr,damp:function(i,e,t,n){return Yr(i,e,1-Math.exp(-t*n))},pingpong:function(i,e=1){return e-Math.abs(Zo(i,2*e)-e)},smoothstep:function(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e))*i*(3-2*i)},smootherstep:function(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e))*i*i*(i*(6*i-15)+10)},randInt:function(i,e){return i+Math.floor(Math.random()*(e-i+1))},randFloat:function(i,e){return i+Math.random()*(e-i)},randFloatSpread:function(i){return i*(.5-Math.random())},seededRandom:function(i){i!==void 0&&(pc=i);let e=pc+=1831565813;return e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296},degToRad:function(i){return i*Mr},radToDeg:function(i){return i*ns},isPowerOfTwo:function(i){return!(i&i-1)&&i!==0},ceilPowerOfTwo:function(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))},floorPowerOfTwo:function(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))},setQuaternionFromProperEuler:function(i,e,t,n,r){let s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+n)/2),h=o((e+n)/2),u=s((e-n)/2),d=o((e-n)/2),p=s((n-e)/2),m=o((n-e)/2);switch(r){case"XYX":i.set(a*h,l*u,l*d,a*c);break;case"YZY":i.set(l*d,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*d,a*h,a*c);break;case"XZX":i.set(a*h,l*m,l*p,a*c);break;case"YXY":i.set(l*p,a*h,l*m,a*c);break;case"ZYZ":i.set(l*m,l*p,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}},normalize:En,denormalize:_r},Ce=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(en(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*r+e.x,this.y=s*r+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},vt=class i{constructor(e,t,n,r,s,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,l,c)}set(e,t,n,r,s,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=r,h[2]=a,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],p=n[5],m=n[8],_=r[0],f=r[3],g=r[6],v=r[1],y=r[4],w=r[7],T=r[2],E=r[5],V=r[8];return s[0]=o*_+a*v+l*T,s[3]=o*f+a*y+l*E,s[6]=o*g+a*w+l*V,s[1]=c*_+h*v+u*T,s[4]=c*f+h*y+u*E,s[7]=c*g+h*w+u*V,s[2]=d*_+p*v+m*T,s[5]=d*f+p*y+m*E,s[8]=d*g+p*w+m*V,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*s*h+n*a*l+r*s*c-r*o*l}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*s,p=c*s-o*l,m=t*u+n*d+r*p;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/m;return e[0]=u*_,e[1]=(r*c-h*n)*_,e[2]=(a*n-r*o)*_,e[3]=d*_,e[4]=(h*t-r*l)*_,e[5]=(r*s-a*t)*_,e[6]=p*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*s)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,o,a){let l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(za.makeScale(e,t)),this}rotate(e){return this.premultiply(za.makeRotation(-e)),this}translate(e,t){return this.premultiply(za.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},za=new vt;function Rh(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function $s(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Vu(){let i=$s("canvas");return i.style.display="block",i}var fc={};function qr(i){i in fc||(fc[i]=!0,console.warn(i))}var wt={enabled:!0,workingColorSpace:Ur,spaces:{},convert:function(i,e,t){return this.enabled!==!1&&e!==t&&e&&t&&(this.spaces[e].transfer===Ot&&(i.r=_i(i.r),i.g=_i(i.g),i.b=_i(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===Ot&&(i.r=br(i.r),i.g=br(i.g),i.b=br(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===vr?Sa:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function _i(i){return i<.04045?.0773993808*i:Math.pow(.9478672986*i+.0521327014,2.4)}function br(i){return i<.0031308?12.92*i:1.055*Math.pow(i,.41666)-.055}var mc=[.64,.33,.3,.6,.15,.06],gc=[.2126,.7152,.0722],vc=[.3127,.329],_c=new vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),yc=new vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715),sr;wt.define({[Ur]:{primaries:mc,whitePoint:vc,transfer:Sa,toXYZ:_c,fromXYZ:yc,luminanceCoefficients:gc,workingColorSpaceConfig:{unpackColorSpace:Pn},outputColorSpaceConfig:{drawingBufferColorSpace:Pn}},[Pn]:{primaries:mc,whitePoint:vc,transfer:Ot,toXYZ:_c,fromXYZ:yc,luminanceCoefficients:gc,outputColorSpaceConfig:{drawingBufferColorSpace:Pn}}});var Ko=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{sr===void 0&&(sr=$s("canvas")),sr.width=e.width,sr.height=e.height;let n=sr.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=sr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=$s("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=255*_i(s[o]/255);return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(255*_i(t[n]/255)):t[n]=_i(t[n]);return{data:t,width:e.width,height:e.height}}return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Hu=0,Qs=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Hu++}),this.uuid=nr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(ka(r[o].image)):s.push(ka(r[o]))}else s=ka(r);n.url=s}return t||(e.images[this.uuid]=n),n}};function ka(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ko.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Gu=0,Nn=class i extends yi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=1001,r=1001,s=1006,o=1008,a=1023,l=1009,c=i.DEFAULT_ANISOTROPY,h=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Gu++}),this.uuid=nr(),this.name="",this.source=new Qs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Ce(0,0),this.repeat=new Ce(1,1),this.center=new Ce(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==vh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case $r:e.x=e.x-Math.floor(e.x);break;case Qr:e.x=e.x<0?0:1;break;case Mo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case $r:e.y=e.y-Math.floor(e.y);break;case Qr:e.y=e.y<0?0:1;break;case Mo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Nn.DEFAULT_IMAGE=null,Nn.DEFAULT_MAPPING=vh,Nn.DEFAULT_ANISOTROPY=1;var Ht=class i{constructor(e=0,t=0,n=0,r=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],m=l[9],_=l[2],f=l[6],g=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(m-f)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(m+f)<.1&&Math.abs(c+p+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let y=(c+1)/2,w=(p+1)/2,T=(g+1)/2,E=(h+d)/4,V=(u+_)/4,W=(m+f)/4;return y>w&&y>T?y<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(y),r=E/n,s=V/n):w>T?w<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(w),n=E/r,s=W/r):T<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(T),n=V/s,r=W/s),this.set(n,r,s,t),this}let v=Math.sqrt((f-m)*(f-m)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(f-m)/v,this.y=(u-_)/v,this.z=(d-h)/v,this.w=Math.acos((c+p+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Jo=class extends yi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Ht(0,0,e,t),this.scissorTest=!1,this.viewport=new Ht(0,0,e,t);let r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let s=new Nn(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Qs(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Bn=class extends Jo{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ea=class extends Nn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Xn,this.minFilter=Xn,this.wrapR=Qr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var $o=class extends Nn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Xn,this.minFilter=Xn,this.wrapR=Qr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var gn=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,o,a){let l=n[r+0],c=n[r+1],h=n[r+2],u=n[r+3],d=s[o+0],p=s[o+1],m=s[o+2],_=s[o+3];if(a===0)return e[t+0]=l,e[t+1]=c,e[t+2]=h,void(e[t+3]=u);if(a===1)return e[t+0]=d,e[t+1]=p,e[t+2]=m,void(e[t+3]=_);if(u!==_||l!==d||c!==p||h!==m){let f=1-a,g=l*d+c*p+h*m+u*_,v=g>=0?1:-1,y=1-g*g;if(y>Number.EPSILON){let T=Math.sqrt(y),E=Math.atan2(T,g*v);f=Math.sin(f*E)/T,a=Math.sin(a*E)/T}let w=a*v;if(l=l*f+d*w,c=c*f+p*w,h=h*f+m*w,u=u*f+_*w,f===1-a){let T=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=T,c*=T,h*=T,u*=T}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,s,o){let a=n[r],l=n[r+1],c=n[r+2],h=n[r+3],u=s[o],d=s[o+1],p=s[o+2],m=s[o+3];return e[t]=a*m+h*u+l*p-c*d,e[t+1]=l*m+h*d+c*u-a*p,e[t+2]=c*m+h*p+a*d-l*u,e[t+3]=h*m-a*u-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(r/2),u=a(s/2),d=l(n/2),p=l(r/2),m=l(s/2);switch(o){case"XYZ":this._x=d*h*u+c*p*m,this._y=c*p*u-d*h*m,this._z=c*h*m+d*p*u,this._w=c*h*u-d*p*m;break;case"YXZ":this._x=d*h*u+c*p*m,this._y=c*p*u-d*h*m,this._z=c*h*m-d*p*u,this._w=c*h*u+d*p*m;break;case"ZXY":this._x=d*h*u-c*p*m,this._y=c*p*u+d*h*m,this._z=c*h*m+d*p*u,this._w=c*h*u-d*p*m;break;case"ZYX":this._x=d*h*u-c*p*m,this._y=c*p*u+d*h*m,this._z=c*h*m-d*p*u,this._w=c*h*u+d*p*m;break;case"YZX":this._x=d*h*u+c*p*m,this._y=c*p*u+d*h*m,this._z=c*h*m-d*p*u,this._w=c*h*u-d*p*m;break;case"XZY":this._x=d*h*u-c*p*m,this._y=c*p*u-d*h*m,this._z=c*h*m+d*p*u,this._w=c*h*u+d*p*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(n>a&&n>u){let p=2*Math.sqrt(1+n-a-u);this._w=(h-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>u){let p=2*Math.sqrt(1+a-n-u);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-n-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(en(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+r*c-s*l,this._y=r*h+o*l+s*a-n*c,this._z=s*h+o*c+n*l-r*a,this._w=o*h-n*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,r=this._y,s=this._z,o=this._w,a=o*e._w+n*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;let l=1-a*a;if(l<=Number.EPSILON){let p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},B=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(xc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(xc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*n),h=2*(a*t-s*r),u=2*(s*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-s*u,this.z=r+l*u+s*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-n*l,this.z=n*a-r*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Va.copy(this).projectOnVector(e),this.sub(Va)}reflect(e){return this.sub(Va.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(en(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,4*t)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,3*t)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=2*Math.random()-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Va=new B,xc=new gn,Ln=class{constructor(e=new B(1/0,1/0,1/0),t=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Hn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Hn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Hn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Hn):Hn.fromBufferAttribute(s,o),Hn.applyMatrix4(e.matrixWorld),this.expandByPoint(Hn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),_s.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),_s.copy(n.boundingBox)),_s.applyMatrix4(e.matrixWorld),this.union(_s)}let r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Hn),Hn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Vr),ys.subVectors(this.max,Vr),ar.subVectors(e.a,Vr),or.subVectors(e.b,Vr),lr.subVectors(e.c,Vr),Ei.subVectors(or,ar),Ti.subVectors(lr,or),ki.subVectors(ar,lr);let t=[0,-Ei.z,Ei.y,0,-Ti.z,Ti.y,0,-ki.z,ki.y,Ei.z,0,-Ei.x,Ti.z,0,-Ti.x,ki.z,0,-ki.x,-Ei.y,Ei.x,0,-Ti.y,Ti.x,0,-ki.y,ki.x,0];return!!Ha(t,ar,or,lr,ys)&&(t=[1,0,0,0,1,0,0,0,1],!!Ha(t,ar,or,lr,ys)&&(xs.crossVectors(Ei,Ti),t=[xs.x,xs.y,xs.z],Ha(t,ar,or,lr,ys)))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Hn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=.5*this.getSize(Hn).length()),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(ui[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ui[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ui[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ui[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ui[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ui[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ui[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ui[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ui)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},ui=[new B,new B,new B,new B,new B,new B,new B,new B],Hn=new B,_s=new Ln,ar=new B,or=new B,lr=new B,Ei=new B,Ti=new B,ki=new B,Vr=new B,ys=new B,xs=new B,Vi=new B;function Ha(i,e,t,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){Vi.fromArray(i,s);let a=r.x*Math.abs(Vi.x)+r.y*Math.abs(Vi.y)+r.z*Math.abs(Vi.z),l=e.dot(Vi),c=t.dot(Vi),h=n.dot(Vi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Wu=new Ln,Hr=new B,Ga=new B,ai=class{constructor(e=new B,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Wu.setFromPoints(e).getCenter(n);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Hr.subVectors(e,this.center);let t=Hr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),r=.5*(n-this.radius);this.center.addScaledVector(Hr,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ga.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Hr.copy(e.center).add(Ga)),this.expandByPoint(Hr.copy(e.center).sub(Ga))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},di=new B,Wa=new B,Ms=new B,Ai=new B,ja=new B,bs=new B,Xa=new B,xi=class{constructor(e=new B,t=new B(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,di)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=di.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(di.copy(this.origin).addScaledVector(this.direction,t),di.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Wa.copy(e).add(t).multiplyScalar(.5),Ms.copy(t).sub(e).normalize(),Ai.copy(this.origin).sub(Wa);let s=.5*e.distanceTo(t),o=-this.direction.dot(Ms),a=Ai.dot(this.direction),l=-Ai.dot(Ms),c=Ai.lengthSq(),h=Math.abs(1-o*o),u,d,p,m;if(h>0)if(u=o*l-a,d=o*a-l,m=s*h,u>=0)if(d>=-m)if(d<=m){let _=1/h;u*=_,d*=_,p=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=s,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-o*s+a)),d=u>0?-s:Math.min(Math.max(-s,-l),s),p=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(u=Math.max(0,-(o*s+a)),d=u>0?s:Math.min(Math.max(-s,-l),s),p=-u*u+d*(d+2*l)+c);else d=o>0?-s:s,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Wa).addScaledVector(Ms,d),p}intersectSphere(e,t){di.subVectors(e.center,this.origin);let n=di.dot(this.direction),r=di.dot(di)-n*n,s=e.radius*e.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0?!0:e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||s>r?null:((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>r?null:((a>n||n!=n)&&(n=a),(l<r||r!=r)&&(r=l),r<0?null:this.at(n>=0?n:r,t)))}intersectsBox(e){return this.intersectBox(e,di)!==null}intersectTriangle(e,t,n,r,s){ja.subVectors(t,e),bs.subVectors(n,e),Xa.crossVectors(ja,bs);let o,a=this.direction.dot(Xa);if(a>0){if(r)return null;o=1}else{if(!(a<0))return null;o=-1,a=-a}Ai.subVectors(this.origin,e);let l=o*this.direction.dot(bs.crossVectors(Ai,bs));if(l<0)return null;let c=o*this.direction.dot(ja.cross(Ai));if(c<0||l+c>a)return null;let h=-o*Ai.dot(Xa);return h<0?null:this.at(h/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ht=class i{constructor(e,t,n,r,s,o,a,l,c,h,u,d,p,m,_,f){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,l,c,h,u,d,p,m,_,f)}set(e,t,n,r,s,o,a,l,c,h,u,d,p,m,_,f){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=s,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=h,g[10]=u,g[14]=d,g[3]=p,g[7]=m,g[11]=_,g[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,r=1/cr.setFromMatrixColumn(e,0).length(),s=1/cr.setFromMatrixColumn(e,1).length(),o=1/cr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,s=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let d=o*h,p=o*u,m=a*h,_=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+m*c,t[5]=d-_*c,t[9]=-a*l,t[2]=_-d*c,t[6]=m+p*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*h,p=l*u,m=c*h,_=c*u;t[0]=d+_*a,t[4]=m*a-p,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=p*a-m,t[6]=_+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*h,p=l*u,m=c*h,_=c*u;t[0]=d-_*a,t[4]=-o*u,t[8]=m+p*a,t[1]=p+m*a,t[5]=o*h,t[9]=_-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*h,p=o*u,m=a*h,_=a*u;t[0]=l*h,t[4]=m*c-p,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=p*c-m,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,p=o*c,m=a*l,_=a*c;t[0]=l*h,t[4]=_-d*u,t[8]=m*u+p,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=p*u+m,t[10]=d-_*u}else if(e.order==="XZY"){let d=o*l,p=o*c,m=a*l,_=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=o*h,t[9]=p*u-m,t[2]=m*u-p,t[6]=a*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ju,e,Xu)}lookAt(e,t,n){let r=this.elements;return Dn.subVectors(e,t),Dn.lengthSq()===0&&(Dn.z=1),Dn.normalize(),Ri.crossVectors(n,Dn),Ri.lengthSq()===0&&(Math.abs(n.z)===1?Dn.x+=1e-4:Dn.z+=1e-4,Dn.normalize(),Ri.crossVectors(n,Dn)),Ri.normalize(),Ss.crossVectors(Dn,Ri),r[0]=Ri.x,r[4]=Ss.x,r[8]=Dn.x,r[1]=Ri.y,r[5]=Ss.y,r[9]=Dn.y,r[2]=Ri.z,r[6]=Ss.z,r[10]=Dn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],p=n[13],m=n[2],_=n[6],f=n[10],g=n[14],v=n[3],y=n[7],w=n[11],T=n[15],E=r[0],V=r[4],W=r[8],H=r[12],$=r[1],ee=r[5],te=r[9],oe=r[13],ne=r[2],ye=r[6],ve=r[10],Pe=r[14],Ae=r[3],tt=r[7],z=r[11],U=r[15];return s[0]=o*E+a*$+l*ne+c*Ae,s[4]=o*V+a*ee+l*ye+c*tt,s[8]=o*W+a*te+l*ve+c*z,s[12]=o*H+a*oe+l*Pe+c*U,s[1]=h*E+u*$+d*ne+p*Ae,s[5]=h*V+u*ee+d*ye+p*tt,s[9]=h*W+u*te+d*ve+p*z,s[13]=h*H+u*oe+d*Pe+p*U,s[2]=m*E+_*$+f*ne+g*Ae,s[6]=m*V+_*ee+f*ye+g*tt,s[10]=m*W+_*te+f*ve+g*z,s[14]=m*H+_*oe+f*Pe+g*U,s[3]=v*E+y*$+w*ne+T*Ae,s[7]=v*V+y*ee+w*ye+T*tt,s[11]=v*W+y*te+w*ve+T*z,s[15]=v*H+y*oe+w*Pe+T*U,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],p=e[14];return e[3]*(+s*l*u-r*c*u-s*a*d+n*c*d+r*a*p-n*l*p)+e[7]*(+t*l*p-t*c*d+s*o*d-r*o*p+r*c*h-s*l*h)+e[11]*(+t*c*u-t*a*p-s*o*u+n*o*p+s*a*h-n*c*h)+e[15]*(-r*a*h-t*l*u+t*a*d+r*o*u-n*o*d+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],p=e[11],m=e[12],_=e[13],f=e[14],g=e[15],v=u*f*c-_*d*c+_*l*p-a*f*p-u*l*g+a*d*g,y=m*d*c-h*f*c-m*l*p+o*f*p+h*l*g-o*d*g,w=h*_*c-m*u*c+m*a*p-o*_*p-h*a*g+o*u*g,T=m*u*l-h*_*l-m*a*d+o*_*d+h*a*f-o*u*f,E=t*v+n*y+r*w+s*T;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let V=1/E;return e[0]=v*V,e[1]=(_*d*s-u*f*s-_*r*p+n*f*p+u*r*g-n*d*g)*V,e[2]=(a*f*s-_*l*s+_*r*c-n*f*c-a*r*g+n*l*g)*V,e[3]=(u*l*s-a*d*s-u*r*c+n*d*c+a*r*p-n*l*p)*V,e[4]=y*V,e[5]=(h*f*s-m*d*s+m*r*p-t*f*p-h*r*g+t*d*g)*V,e[6]=(m*l*s-o*f*s-m*r*c+t*f*c+o*r*g-t*l*g)*V,e[7]=(o*d*s-h*l*s+h*r*c-t*d*c-o*r*p+t*l*p)*V,e[8]=w*V,e[9]=(m*u*s-h*_*s-m*n*p+t*_*p+h*n*g-t*u*g)*V,e[10]=(o*_*s-m*a*s+m*n*c-t*_*c-o*n*g+t*a*g)*V,e[11]=(h*a*s-o*u*s-h*n*c+t*u*c+o*n*p-t*a*p)*V,e[12]=T*V,e[13]=(h*_*r-m*u*r+m*n*d-t*_*d-h*n*f+t*u*f)*V,e[14]=(m*a*r-o*_*r-m*n*l+t*_*l+o*n*f-t*a*f)*V,e[15]=(o*u*r-h*a*r+h*n*l-t*u*l-o*n*d+t*a*d)*V,this}scale(e){let t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),s=1-n,o=e.x,a=e.y,l=e.z,c=s*o,h=s*a;return this.set(c*o+n,c*a-r*l,c*l+r*a,0,c*a+r*l,h*a+n,h*l-r*o,0,c*l-r*a,h*l+r*o,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,o){return this.set(1,n,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,h=o+o,u=a+a,d=s*c,p=s*h,m=s*u,_=o*h,f=o*u,g=a*u,v=l*c,y=l*h,w=l*u,T=n.x,E=n.y,V=n.z;return r[0]=(1-(_+g))*T,r[1]=(p+w)*T,r[2]=(m-y)*T,r[3]=0,r[4]=(p-w)*E,r[5]=(1-(d+g))*E,r[6]=(f+v)*E,r[7]=0,r[8]=(m+y)*V,r[9]=(f-v)*V,r[10]=(1-(d+_))*V,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements,s=cr.set(r[0],r[1],r[2]).length(),o=cr.set(r[4],r[5],r[6]).length(),a=cr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Gn.copy(this);let l=1/s,c=1/o,h=1/a;return Gn.elements[0]*=l,Gn.elements[1]*=l,Gn.elements[2]*=l,Gn.elements[4]*=c,Gn.elements[5]*=c,Gn.elements[6]*=c,Gn.elements[8]*=h,Gn.elements[9]*=h,Gn.elements[10]*=h,t.setFromRotationMatrix(Gn),n.x=s,n.y=o,n.z=a,this}makePerspective(e,t,n,r,s,o,a=2e3){let l=this.elements,c=2*s/(t-e),h=2*s/(n-r),u=(t+e)/(t-e),d=(n+r)/(n-r),p,m;if(a===Rr)p=-(o+s)/(o-s),m=-2*o*s/(o-s);else{if(a!==Js)throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);p=-o/(o-s),m=-o*s/(o-s)}return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,s,o,a=2e3){let l=this.elements,c=1/(t-e),h=1/(n-r),u=1/(o-s),d=(t+e)*c,p=(n+r)*h,m,_;if(a===Rr)m=(o+s)*u,_=-2*u;else{if(a!==Js)throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);m=s*u,_=-1*u}return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},cr=new B,Gn=new ht,ju=new B(0,0,0),Xu=new B(1,1,1),Ri=new B,Ss=new B,Dn=new B,Mc=new ht,bc=new gn,oi=class i{constructor(e=0,t=0,n=0,r=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],h=r[9],u=r[2],d=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(en(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-en(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(en(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-en(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(en(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-en(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Mc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Mc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return bc.setFromEuler(this),this.setFromQuaternion(bc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};oi.DEFAULT_ORDER="XYZ";var is=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return!!(this.mask&e.mask)}isEnabled(e){return!!(this.mask&1<<e)}},qu=0,Sc=new B,hr=new gn,pi=new ht,ws=new B,Gr=new B,Yu=new B,Zu=new gn,wc=new B(1,0,0),Ec=new B(0,1,0),Tc=new B(0,0,1),Ac={type:"added"},Ku={type:"removed"},ur={type:"childadded",child:null},qa={type:"childremoved",child:null},qn=class i extends yi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qu++}),this.uuid=nr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new B,t=new oi,n=new gn,r=new B(1,1,1);t._onChange((function(){n.setFromEuler(t,!1)})),n._onChange((function(){t.setFromQuaternion(n,void 0,!1)})),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ht},normalMatrix:{value:new vt}}),this.matrix=new ht,this.matrixWorld=new ht,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new is,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return hr.setFromAxisAngle(e,t),this.quaternion.multiply(hr),this}rotateOnWorldAxis(e,t){return hr.setFromAxisAngle(e,t),this.quaternion.premultiply(hr),this}rotateX(e){return this.rotateOnAxis(wc,e)}rotateY(e){return this.rotateOnAxis(Ec,e)}rotateZ(e){return this.rotateOnAxis(Tc,e)}translateOnAxis(e,t){return Sc.copy(e).applyQuaternion(this.quaternion),this.position.add(Sc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wc,e)}translateY(e){return this.translateOnAxis(Ec,e)}translateZ(e){return this.translateOnAxis(Tc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(pi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ws.copy(e):ws.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Gr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?pi.lookAt(Gr,ws,this.up):pi.lookAt(ws,Gr,this.up),this.quaternion.setFromRotationMatrix(pi),r&&(pi.extractRotation(r.matrixWorld),hr.setFromRotationMatrix(pi),this.quaternion.premultiply(hr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ac),ur.child=e,this.dispatchEvent(ur),ur.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ku),qa.child=e,this.dispatchEvent(qa),qa.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),pi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),pi.multiply(e.parent.matrixWorld)),e.applyMatrix4(pi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ac),ur.child=e,this.dispatchEvent(ur),ur.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let s=this.children[n].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,e,Yu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,Zu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let r={};function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map((a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()}))),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()})),this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),p=o(e.animations),m=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),m.length>0&&(n.nodes=m)}return n.object=r,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let r=e.children[n];this.add(r.clone())}return this}};qn.DEFAULT_UP=new B(0,1,0),qn.DEFAULT_MATRIX_AUTO_UPDATE=!0,qn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Wn=new B,fi=new B,Ya=new B,mi=new B,dr=new B,pr=new B,Rc=new B,Za=new B,Ka=new B,Ja=new B,$a=new Ht,Qa=new Ht,eo=new Ht,Li=class i{constructor(e=new B,t=new B,n=new B){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Wn.subVectors(e,t),r.cross(Wn);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){Wn.subVectors(r,t),fi.subVectors(n,t),Ya.subVectors(e,t);let o=Wn.dot(Wn),a=Wn.dot(fi),l=Wn.dot(Ya),c=fi.dot(fi),h=fi.dot(Ya),u=o*c-a*a;if(u===0)return s.set(0,0,0),null;let d=1/u,p=(c*l-a*h)*d,m=(o*h-a*l)*d;return s.set(1-p-m,m,p)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,mi)!==null&&mi.x>=0&&mi.y>=0&&mi.x+mi.y<=1}static getInterpolation(e,t,n,r,s,o,a,l){return this.getBarycoord(e,t,n,r,mi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,mi.x),l.addScaledVector(o,mi.y),l.addScaledVector(a,mi.z),l)}static getInterpolatedAttribute(e,t,n,r,s,o){return $a.setScalar(0),Qa.setScalar(0),eo.setScalar(0),$a.fromBufferAttribute(e,t),Qa.fromBufferAttribute(e,n),eo.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector($a,s.x),o.addScaledVector(Qa,s.y),o.addScaledVector(eo,s.z),o}static isFrontFacing(e,t,n,r){return Wn.subVectors(n,t),fi.subVectors(e,t),Wn.cross(fi).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Wn.subVectors(this.c,this.b),fi.subVectors(this.a,this.b),.5*Wn.cross(fi).length()}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return i.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,s=this.c,o,a;dr.subVectors(r,n),pr.subVectors(s,n),Za.subVectors(e,n);let l=dr.dot(Za),c=pr.dot(Za);if(l<=0&&c<=0)return t.copy(n);Ka.subVectors(e,r);let h=dr.dot(Ka),u=pr.dot(Ka);if(h>=0&&u<=h)return t.copy(r);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(dr,o);Ja.subVectors(e,s);let p=dr.dot(Ja),m=pr.dot(Ja);if(m>=0&&p<=m)return t.copy(s);let _=p*c-l*m;if(_<=0&&c>=0&&m<=0)return a=c/(c-m),t.copy(n).addScaledVector(pr,a);let f=h*m-p*u;if(f<=0&&u-h>=0&&p-m>=0)return Rc.subVectors(s,r),a=(u-h)/(u-h+(p-m)),t.copy(r).addScaledVector(Rc,a);let g=1/(f+_+d);return o=_*g,a=d*g,t.copy(n).addScaledVector(dr,o).addScaledVector(pr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Ch={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ci={h:0,s:0,l:0},Es={h:0,s:0,l:0};function to(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+6*(e-i)*t:t<.5?e:t<2/3?i+6*(e-i)*(2/3-t):i}var mt=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Pn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(255&e)/255,wt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=wt.workingColorSpace){return this.r=e,this.g=t,this.b=n,wt.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=wt.workingColorSpace){if(e=Zo(e,1),t=en(t,0,1),n=en(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,o=2*n-s;this.r=to(o,s,e+1/3),this.g=to(o,s,e),this.b=to(o,s,e-1/3)}return wt.toWorkingColorSpace(this,r),this}setStyle(e,t=Pn){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Pn){let n=Ch[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=_i(e.r),this.g=_i(e.g),this.b=_i(e.b),this}copyLinearToSRGB(e){return this.r=br(e.r),this.g=br(e.g),this.b=br(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Pn){return wt.fromWorkingColorSpace(mn.copy(this),e),65536*Math.round(en(255*mn.r,0,255))+256*Math.round(en(255*mn.g,0,255))+Math.round(en(255*mn.b,0,255))}getHexString(e=Pn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=wt.workingColorSpace){wt.fromWorkingColorSpace(mn.copy(this),t);let n=mn.r,r=mn.g,s=mn.b,o=Math.max(n,r,s),a=Math.min(n,r,s),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(r-s)/u+(r<s?6:0);break;case r:l=(s-n)/u+2;break;case s:l=(n-r)/u+4}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=wt.workingColorSpace){return wt.fromWorkingColorSpace(mn.copy(this),t),e.r=mn.r,e.g=mn.g,e.b=mn.b,e}getStyle(e=Pn){wt.fromWorkingColorSpace(mn.copy(this),e);let t=mn.r,n=mn.g,r=mn.b;return e!==Pn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(255*t)},${Math.round(255*n)},${Math.round(255*r)})`}offsetHSL(e,t,n){return this.getHSL(Ci),this.setHSL(Ci.h+e,Ci.s+t,Ci.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ci),e.getHSL(Es);let n=Yr(Ci.h,Es.h,t),r=Yr(Ci.s,Es.s,t),s=Yr(Ci.l,Es.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},mn=new mt;mt.NAMES=Ch;var Ju=0,Ji=class extends yi{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ju++}),this.uuid=nr(),this.name="",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=vo,this.blendDst=_o,this.blendEquation=qi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new mt(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=rr,this.stencilZFail=rr,this.stencilZPass=rr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r!==void 0?r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n:console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`)}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};function r(s){let o=[];for(let a in s){let l=s[a];delete l.metadata,o.push(l)}return o}if(n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==vo&&(n.blendSrc=this.blendSrc),this.blendDst!==_o&&(n.blendDst=this.blendDst),this.blendEquation!==qi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==rr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==rr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==rr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData),t){let s=r(e.textures),o=r(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},ta=class extends Ji{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new mt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Of=$u();function $u(){let i=new ArrayBuffer(4),e=new Float32Array(i),t=new Uint32Array(i),n=new Uint32Array(512),r=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[256|l]=32768,r[l]=24,r[256|l]=24):c<-14?(n[l]=1024>>-c-14,n[256|l]=1024>>-c-14|32768,r[l]=-c-1,r[256|l]=-c-1):c<=15?(n[l]=c+15<<10,n[256|l]=c+15<<10|32768,r[l]=13,r[256|l]=13):c<128?(n[l]=31744,n[256|l]=64512,r[l]=24,r[256|l]=24):(n[l]=31744,n[256|l]=64512,r[l]=13,r[256|l]=13)}let s=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(8388608&c);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)o[l]=l<<23;o[31]=1199570944,o[32]=2147483648;for(let l=33;l<63;++l)o[l]=2147483648+(l-32<<23);o[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:r,mantissaTable:s,exponentTable:o,offsetTable:a}}var Qt=new B,Ts=new Ce,$t=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=uc,this.updateRanges=[],this.gpuType=vi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ts.fromBufferAttribute(this,t),Ts.applyMatrix3(e),this.setXY(t,Ts.x,Ts.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Qt.fromBufferAttribute(this,t),Qt.applyMatrix3(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Qt.fromBufferAttribute(this,t),Qt.applyMatrix4(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Qt.fromBufferAttribute(this,t),Qt.applyNormalMatrix(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Qt.fromBufferAttribute(this,t),Qt.transformDirection(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=_r(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=En(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=_r(t,this.array)),t}setX(e,t){return this.normalized&&(t=En(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=_r(t,this.array)),t}setY(e,t){return this.normalized&&(t=En(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=_r(t,this.array)),t}setZ(e,t){return this.normalized&&(t=En(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=_r(t,this.array)),t}setW(e,t){return this.normalized&&(t=En(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=En(t,this.array),n=En(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=En(t,this.array),n=En(n,this.array),r=En(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=En(t,this.array),n=En(n,this.array),r=En(r,this.array),s=En(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==uc&&(e.usage=this.usage),e}};var na=class extends $t{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var ia=class extends $t{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var at=class extends $t{constructor(e,t,n){super(new Float32Array(e),t,n)}},Qu=0,Fn=new ht,no=new qn,fr=new B,Un=new Ln,Wr=new Ln,un=new B,Dt=class i extends yi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Qu++}),this.uuid=nr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Rh(e)?ia:na)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new vt().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Fn.makeRotationFromQuaternion(e),this.applyMatrix4(Fn),this}rotateX(e){return Fn.makeRotationX(e),this.applyMatrix4(Fn),this}rotateY(e){return Fn.makeRotationY(e),this.applyMatrix4(Fn),this}rotateZ(e){return Fn.makeRotationZ(e),this.applyMatrix4(Fn),this}translate(e,t,n){return Fn.makeTranslation(e,t,n),this.applyMatrix4(Fn),this}scale(e,t,n){return Fn.makeScale(e,t,n),this.applyMatrix4(Fn),this}lookAt(e){return no.lookAt(e),no.updateMatrix(),this.applyMatrix4(no.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fr).negate(),this.translate(fr.x,fr.y,fr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let r=0,s=e.length;r<s;r++){let o=e[r];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new at(n,3))}else{for(let n=0,r=t.count;n<r;n++){let s=e[n];t.setXYZ(n,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ln);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),void this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){let s=t[n];Un.setFromBufferAttribute(s),this.morphTargetsRelative?(un.addVectors(this.boundingBox.min,Un.min),this.boundingBox.expandByPoint(un),un.addVectors(this.boundingBox.max,Un.max),this.boundingBox.expandByPoint(un)):(this.boundingBox.expandByPoint(Un.min),this.boundingBox.expandByPoint(Un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ai);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),void this.boundingSphere.set(new B,1/0);if(e){let n=this.boundingSphere.center;if(Un.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){let a=t[s];Wr.setFromBufferAttribute(a),this.morphTargetsRelative?(un.addVectors(Un.min,Wr.min),Un.expandByPoint(un),un.addVectors(Un.max,Wr.max),Un.expandByPoint(un)):(Un.expandByPoint(Wr.min),Un.expandByPoint(Wr.max))}Un.getCenter(n);let r=0;for(let s=0,o=e.count;s<o;s++)un.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(un));if(t)for(let s=0,o=t.length;s<o;s++){let a=t[s],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)un.fromBufferAttribute(a,c),l&&(fr.fromBufferAttribute(e,c),un.add(fr)),r=Math.max(r,n.distanceToSquared(un))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0)return void console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");let n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new $t(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let W=0;W<n.count;W++)a[W]=new B,l[W]=new B;let c=new B,h=new B,u=new B,d=new Ce,p=new Ce,m=new Ce,_=new B,f=new B;function g(W,H,$){c.fromBufferAttribute(n,W),h.fromBufferAttribute(n,H),u.fromBufferAttribute(n,$),d.fromBufferAttribute(s,W),p.fromBufferAttribute(s,H),m.fromBufferAttribute(s,$),h.sub(c),u.sub(c),p.sub(d),m.sub(d);let ee=1/(p.x*m.y-m.x*p.y);isFinite(ee)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(u,-p.y).multiplyScalar(ee),f.copy(u).multiplyScalar(p.x).addScaledVector(h,-m.x).multiplyScalar(ee),a[W].add(_),a[H].add(_),a[$].add(_),l[W].add(f),l[H].add(f),l[$].add(f))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let W=0,H=v.length;W<H;++W){let $=v[W],ee=$.start;for(let te=ee,oe=ee+$.count;te<oe;te+=3)g(e.getX(te+0),e.getX(te+1),e.getX(te+2))}let y=new B,w=new B,T=new B,E=new B;function V(W){T.fromBufferAttribute(r,W),E.copy(T);let H=a[W];y.copy(H),y.sub(T.multiplyScalar(T.dot(H))).normalize(),w.crossVectors(E,H);let $=w.dot(l[W])<0?-1:1;o.setXYZW(W,y.x,y.y,y.z,$)}for(let W=0,H=v.length;W<H;++W){let $=v[W],ee=$.start;for(let te=ee,oe=ee+$.count;te<oe;te+=3)V(e.getX(te+0)),V(e.getX(te+1)),V(e.getX(te+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new $t(new Float32Array(3*t.count),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let r=new B,s=new B,o=new B,a=new B,l=new B,c=new B,h=new B,u=new B;if(e)for(let d=0,p=e.count;d<p;d+=3){let m=e.getX(d+0),_=e.getX(d+1),f=e.getX(d+2);r.fromBufferAttribute(t,m),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,f),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),a.fromBufferAttribute(n,m),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,f),a.add(h),l.add(h),c.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)un.fromBufferAttribute(e,t),un.normalize(),e.setXYZ(t,un.x,un.y,un.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),p=0,m=0;for(let _=0,f=l.length;_<f;_++){p=a.isInterleavedBufferAttribute?l[_]*a.data.stride+a.offset:l[_]*h;for(let g=0;g<h;g++)d[m++]=c[p++]}return new $t(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,r=this.attributes;for(let a in r){let l=e(r[a],n);t.setAttribute(a,l)}let s=this.morphAttributes;for(let a in s){let l=[],c=s[a];for(let h=0,u=c.length;h<u;h++){let d=e(c[h],n);l.push(d)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let r=e.attributes;for(let c in r){let h=r[c];this.setAttribute(c,h.clone(t))}let s=e.morphAttributes;for(let c in s){let h=[],u=s[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Cc=new ht,Hi=new xi,As=new ai,Pc=new B,Rs=new B,Cs=new B,Ps=new B,io=new B,Ls=new B,Lc=new B,Is=new B,Jt=class extends qn{constructor(e=new Dt,t=new ta){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=n.length;r<s;r++){let o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let a=this.morphTargetInfluences;if(s&&a){Ls.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=a[l],u=s[l];h!==0&&(io.fromBufferAttribute(u,e),o?Ls.addScaledVector(io,h):Ls.addScaledVector(io.sub(t),h))}t.add(Ls)}return t}raycast(e,t){let n=this.geometry,r=this.material,s=this.matrixWorld;if(r!==void 0){if(n.boundingSphere===null&&n.computeBoundingSphere(),As.copy(n.boundingSphere),As.applyMatrix4(s),Hi.copy(e.ray).recast(e.near),As.containsPoint(Hi.origin)===!1&&(Hi.intersectSphere(As,Pc)===null||Hi.origin.distanceToSquared(Pc)>(e.far-e.near)**2))return;Cc.copy(s).invert(),Hi.copy(e.ray).applyMatrix4(Cc),n.boundingBox!==null&&Hi.intersectsBox(n.boundingBox)===!1||this._computeIntersections(e,t,Hi)}}_computeIntersections(e,t,n){let r,s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){let f=d[m],g=o[f.materialIndex];for(let v=Math.max(f.start,p.start),y=Math.min(a.count,Math.min(f.start+f.count,p.start+p.count));v<y;v+=3)r=Ds(this,g,e,n,c,h,u,a.getX(v),a.getX(v+1),a.getX(v+2)),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=f.materialIndex,t.push(r))}else for(let m=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);m<_;m+=3)r=Ds(this,o,e,n,c,h,u,a.getX(m),a.getX(m+1),a.getX(m+2)),r&&(r.faceIndex=Math.floor(m/3),t.push(r));else if(l!==void 0)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){let f=d[m],g=o[f.materialIndex];for(let v=Math.max(f.start,p.start),y=Math.min(l.count,Math.min(f.start+f.count,p.start+p.count));v<y;v+=3)r=Ds(this,g,e,n,c,h,u,v,v+1,v+2),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=f.materialIndex,t.push(r))}else for(let m=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);m<_;m+=3)r=Ds(this,o,e,n,c,h,u,m,m+1,m+2),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}};function Ds(i,e,t,n,r,s,o,a,l,c){i.getVertexPosition(a,Rs),i.getVertexPosition(l,Cs),i.getVertexPosition(c,Ps);let h=(function(u,d,p,m,_,f,g,v){let y;if(y=d.side===1?m.intersectTriangle(g,f,_,!0,v):m.intersectTriangle(_,f,g,d.side===0,v),y===null)return null;Is.copy(v),Is.applyMatrix4(u.matrixWorld);let w=p.ray.origin.distanceTo(Is);return w<p.near||w>p.far?null:{distance:w,point:Is.clone(),object:u}})(i,e,t,n,Rs,Cs,Ps,Lc);if(h){let u=new B;Li.getBarycoord(Lc,Rs,Cs,Ps,u),r&&(h.uv=Li.getInterpolatedAttribute(r,a,l,c,u,new Ce)),s&&(h.uv1=Li.getInterpolatedAttribute(s,a,l,c,u,new Ce)),o&&(h.normal=Li.getInterpolatedAttribute(o,a,l,c,u,new B),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new B,materialIndex:0};Li.getNormal(Rs,Cs,Ps,d.normal),h.face=d,h.barycoord=u}return h}var Mi=class i extends Dt{constructor(e=1,t=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,p=0;function m(_,f,g,v,y,w,T,E,V,W,H){let $=w/V,ee=T/W,te=w/2,oe=T/2,ne=E/2,ye=V+1,ve=W+1,Pe=0,Ae=0,tt=new B;for(let z=0;z<ve;z++){let U=z*ee-oe;for(let P=0;P<ye;P++){let K=P*$-te;tt[_]=K*v,tt[f]=U*y,tt[g]=ne,c.push(tt.x,tt.y,tt.z),tt[_]=0,tt[f]=0,tt[g]=E>0?1:-1,h.push(tt.x,tt.y,tt.z),u.push(P/V),u.push(1-z/W),Pe+=1}}for(let z=0;z<W;z++)for(let U=0;U<V;U++){let P=d+U+ye*z,K=d+U+ye*(z+1),q=d+(U+1)+ye*(z+1),G=d+(U+1)+ye*z;l.push(P,K,G),l.push(K,q,G),Ae+=6}a.addGroup(p,Ae,H),p+=Ae,d+=Pe}m("z","y","x",-1,-1,n,t,e,o,s,0),m("z","y","x",1,-1,n,t,-e,o,s,1),m("x","z","y",1,1,e,n,t,r,o,2),m("x","z","y",1,-1,e,n,-t,r,o,3),m("x","y","z",1,-1,e,t,n,r,s,4),m("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new at(c,3)),this.setAttribute("normal",new at(h,3)),this.setAttribute("uv",new at(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Cr(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function Tn(i){let e={};for(let t=0;t<i.length;t++){let n=Cr(i[t]);for(let r in n)e[r]=n[r]}return e}function Ph(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:wt.workingColorSpace}var ed={clone:Cr,merge:Tn},Rn=class extends Ji{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,this.fragmentShader=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Cr(e.uniforms),this.uniformsGroups=(function(t){let n=[];for(let r=0;r<t.length;r++)n.push(t[r].clone());return n})(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let s=this.uniforms[r].value;s&&s.isTexture?t.uniforms[r]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[r]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[r]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[r]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[r]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[r]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[r]={type:"m4",value:s.toArray()}:t.uniforms[r]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},$i=class extends qn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ht,this.projectionMatrix=new ht,this.projectionMatrixInverse=new ht,this.coordinateSystem=Rr}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Pi=new B,Ic=new Ce,Dc=new Ce,An=class extends $i{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=2*ns*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(.5*Mr*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return 2*ns*Math.atan(Math.tan(.5*Mr*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Pi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Pi.x,Pi.y).multiplyScalar(-e/Pi.z),Pi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Pi.x,Pi.y).multiplyScalar(-e/Pi.z)}getViewSize(e,t){return this.getViewBounds(e,Ic,Dc),t.subVectors(Dc,Ic)}setViewOffset(e,t,n,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(.5*Mr*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*n/c,r*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},mr=-90,Qo=class extends qn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new An(mr,1,e,t);r.layers=this.layers,this.add(r);let s=new An(mr,1,e,t);s.layers=this.layers,this.add(s);let o=new An(mr,1,e,t);o.layers=this.layers,this.add(o);let a=new An(mr,1,e,t);a.layers=this.layers,this.add(a);let l=new An(mr,1,e,t);l.layers=this.layers,this.add(l);let c=new An(mr,1,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,s,o,a,l]=t;for(let c of t)this.remove(c);if(e===Rr)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else{if(e!==Js)throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1)}for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,o),e.setRenderTarget(n,2,r),e.render(t,a),e.setRenderTarget(n,3,r),e.render(t,l),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,r),e.render(t,h),e.setRenderTarget(u,d,p),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},ra=class extends Nn{constructor(e,t,n,r,s,o,a,l,c,h){super(e=e!==void 0?e:[],t=t!==void 0?t:wr,n,r,s,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},el=class extends Bn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new ra(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0&&t.generateMipmaps,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:gi}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Mi(5,5,5),s=new Rn({name:"CubemapFromEquirect",uniforms:Cr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=t;let o=new Jt(r,s),a=t.minFilter;return t.minFilter===yr&&(t.minFilter=gi),new Qo(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,r){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,r);e.setRenderTarget(s)}},ro=new B,td=new B,nd=new vt,jn=class{constructor(e=new B(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=ro.subVectors(n,t).cross(td.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(ro),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||nd.getNormalMatrix(e),r=this.coplanarPoint(ro).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Gi=new ai,Us=new B,rs=class{constructor(e=new jn,t=new jn,n=new jn,r=new jn,s=new jn,o=new jn){this.planes=[e,t,n,r,s,o]}set(e,t,n,r,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2e3){let n=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],h=r[5],u=r[6],d=r[7],p=r[8],m=r[9],_=r[10],f=r[11],g=r[12],v=r[13],y=r[14],w=r[15];if(n[0].setComponents(l-s,d-c,f-p,w-g).normalize(),n[1].setComponents(l+s,d+c,f+p,w+g).normalize(),n[2].setComponents(l+o,d+h,f+m,w+v).normalize(),n[3].setComponents(l-o,d-h,f-m,w-v).normalize(),n[4].setComponents(l-a,d-u,f-_,w-y).normalize(),t===Rr)n[5].setComponents(l+a,d+u,f+_,w+y).normalize();else{if(t!==Js)throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);n[5].setComponents(a,u,_,y).normalize()}return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Gi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Gi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Gi)}intersectsSprite(e){return Gi.center.set(0,0,0),Gi.radius=.7071067811865476,Gi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Gi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Us.x=r.normal.x>0?e.max.x:e.min.x,Us.y=r.normal.y>0?e.max.y:e.min.y,Us.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Us)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Lh(){let i=null,e=!1,t=null,n=null;function r(s,o){t(s,o),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function id(i){let e=new WeakMap;return{get:function(t){return t.isInterleavedBufferAttribute&&(t=t.data),e.get(t)},remove:function(t){t.isInterleavedBufferAttribute&&(t=t.data);let n=e.get(t);n&&(i.deleteBuffer(n.buffer),e.delete(t))},update:function(t,n){if(t.isInterleavedBufferAttribute&&(t=t.data),t.isGLBufferAttribute){let s=e.get(t);return void((!s||s.version<t.version)&&e.set(t,{buffer:t.buffer,type:t.type,bytesPerElement:t.elementSize,version:t.version}))}let r=e.get(t);if(r===void 0)e.set(t,(function(s,o){let a=s.array,l=s.usage,c=a.byteLength,h=i.createBuffer(),u;if(i.bindBuffer(o,h),i.bufferData(o,a,l),s.onUploadCallback(),a instanceof Float32Array)u=i.FLOAT;else if(a instanceof Uint16Array)u=s.isFloat16BufferAttribute?i.HALF_FLOAT:i.UNSIGNED_SHORT;else if(a instanceof Int16Array)u=i.SHORT;else if(a instanceof Uint32Array)u=i.UNSIGNED_INT;else if(a instanceof Int32Array)u=i.INT;else if(a instanceof Int8Array)u=i.BYTE;else if(a instanceof Uint8Array)u=i.UNSIGNED_BYTE;else{if(!(a instanceof Uint8ClampedArray))throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+a);u=i.UNSIGNED_BYTE}return{buffer:h,type:u,bytesPerElement:a.BYTES_PER_ELEMENT,version:s.version,size:c}})(t,n));else if(r.version<t.version){if(r.size!==t.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");(function(s,o,a){let l=o.array,c=o.updateRanges;if(i.bindBuffer(a,s),c.length===0)i.bufferSubData(a,0,l);else{c.sort(((u,d)=>u.start-d.start));let h=0;for(let u=1;u<c.length;u++){let d=c[h],p=c[u];p.start<=d.start+d.count+1?d.count=Math.max(d.count,p.start+p.count-d.start):(++h,c[h]=p)}c.length=h+1;for(let u=0,d=c.length;u<d;u++){let p=c[u];i.bufferSubData(a,p.start*l.BYTES_PER_ELEMENT,l,p.start,p.count)}o.clearUpdateRanges()}o.onUploadCallback()})(r.buffer,t,n),r.version=t.version}}}}var Ui=class i extends Dt{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let s=e/2,o=t/2,a=Math.floor(n),l=Math.floor(r),c=a+1,h=l+1,u=e/a,d=t/l,p=[],m=[],_=[],f=[];for(let g=0;g<h;g++){let v=g*d-o;for(let y=0;y<c;y++){let w=y*u-s;m.push(w,-v,0),_.push(0,0,1),f.push(y/a),f.push(1-g/l)}}for(let g=0;g<l;g++)for(let v=0;v<a;v++){let y=v+c*g,w=v+c*(g+1),T=v+1+c*(g+1),E=v+1+c*g;p.push(y,w,E),p.push(w,T,E)}this.setIndex(p),this.setAttribute("position",new at(m,3)),this.setAttribute("normal",new at(_,3)),this.setAttribute("uv",new at(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},pt={alphahash_fragment:`#ifdef USE_ALPHAHASH
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
}`},Ye={common:{diffuse:{value:new mt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new vt},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new vt}},envmap:{envMap:{value:null},envMapRotation:{value:new vt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new vt},normalScale:{value:new Ce(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new mt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new mt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0},uvTransform:{value:new vt}},sprite:{diffuse:{value:new mt(16777215)},opacity:{value:1},center:{value:new Ce(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new vt},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0}}},ii={basic:{uniforms:Tn([Ye.common,Ye.specularmap,Ye.envmap,Ye.aomap,Ye.lightmap,Ye.fog]),vertexShader:pt.meshbasic_vert,fragmentShader:pt.meshbasic_frag},lambert:{uniforms:Tn([Ye.common,Ye.specularmap,Ye.envmap,Ye.aomap,Ye.lightmap,Ye.emissivemap,Ye.bumpmap,Ye.normalmap,Ye.displacementmap,Ye.fog,Ye.lights,{emissive:{value:new mt(0)}}]),vertexShader:pt.meshlambert_vert,fragmentShader:pt.meshlambert_frag},phong:{uniforms:Tn([Ye.common,Ye.specularmap,Ye.envmap,Ye.aomap,Ye.lightmap,Ye.emissivemap,Ye.bumpmap,Ye.normalmap,Ye.displacementmap,Ye.fog,Ye.lights,{emissive:{value:new mt(0)},specular:{value:new mt(1118481)},shininess:{value:30}}]),vertexShader:pt.meshphong_vert,fragmentShader:pt.meshphong_frag},standard:{uniforms:Tn([Ye.common,Ye.envmap,Ye.aomap,Ye.lightmap,Ye.emissivemap,Ye.bumpmap,Ye.normalmap,Ye.displacementmap,Ye.roughnessmap,Ye.metalnessmap,Ye.fog,Ye.lights,{emissive:{value:new mt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:pt.meshphysical_vert,fragmentShader:pt.meshphysical_frag},toon:{uniforms:Tn([Ye.common,Ye.aomap,Ye.lightmap,Ye.emissivemap,Ye.bumpmap,Ye.normalmap,Ye.displacementmap,Ye.gradientmap,Ye.fog,Ye.lights,{emissive:{value:new mt(0)}}]),vertexShader:pt.meshtoon_vert,fragmentShader:pt.meshtoon_frag},matcap:{uniforms:Tn([Ye.common,Ye.bumpmap,Ye.normalmap,Ye.displacementmap,Ye.fog,{matcap:{value:null}}]),vertexShader:pt.meshmatcap_vert,fragmentShader:pt.meshmatcap_frag},points:{uniforms:Tn([Ye.points,Ye.fog]),vertexShader:pt.points_vert,fragmentShader:pt.points_frag},dashed:{uniforms:Tn([Ye.common,Ye.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:pt.linedashed_vert,fragmentShader:pt.linedashed_frag},depth:{uniforms:Tn([Ye.common,Ye.displacementmap]),vertexShader:pt.depth_vert,fragmentShader:pt.depth_frag},normal:{uniforms:Tn([Ye.common,Ye.bumpmap,Ye.normalmap,Ye.displacementmap,{opacity:{value:1}}]),vertexShader:pt.meshnormal_vert,fragmentShader:pt.meshnormal_frag},sprite:{uniforms:Tn([Ye.sprite,Ye.fog]),vertexShader:pt.sprite_vert,fragmentShader:pt.sprite_frag},background:{uniforms:{uvTransform:{value:new vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:pt.background_vert,fragmentShader:pt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new vt}},vertexShader:pt.backgroundCube_vert,fragmentShader:pt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:pt.cube_vert,fragmentShader:pt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:pt.equirect_vert,fragmentShader:pt.equirect_frag},distanceRGBA:{uniforms:Tn([Ye.common,Ye.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:pt.distanceRGBA_vert,fragmentShader:pt.distanceRGBA_frag},shadow:{uniforms:Tn([Ye.lights,Ye.fog,{color:{value:new mt(0)},opacity:{value:1}}]),vertexShader:pt.shadow_vert,fragmentShader:pt.shadow_frag}};ii.physical={uniforms:Tn([ii.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new vt},clearcoatNormalScale:{value:new Ce(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new vt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new vt},sheen:{value:0},sheenColor:{value:new mt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new vt},transmissionSamplerSize:{value:new Ce},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new vt},attenuationDistance:{value:0},attenuationColor:{value:new mt(0)},specularColor:{value:new mt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new vt},anisotropyVector:{value:new Ce},anisotropyMap:{value:null},anisotropyMapTransform:{value:new vt}}]),vertexShader:pt.meshphysical_vert,fragmentShader:pt.meshphysical_frag};var Ns={r:0,b:0,g:0},Wi=new oi,rd=new ht;function sd(i,e,t,n,r,s,o){let a=new mt(0),l,c,h=s===!0?0:1,u=null,d=0,p=null;function m(f){let g=f.isScene===!0?f.background:null;return g&&g.isTexture&&(g=(f.backgroundBlurriness>0?t:e).get(g)),g}function _(f,g){f.getRGB(Ns,Ph(i)),n.buffers.color.setClear(Ns.r,Ns.g,Ns.b,g,o)}return{getClearColor:function(){return a},setClearColor:function(f,g=1){a.set(f),h=g,_(a,h)},getClearAlpha:function(){return h},setClearAlpha:function(f){h=f,_(a,h)},render:function(f){let g=!1,v=m(f);v===null?_(a,h):v&&v.isColor&&(_(v,1),g=!0);let y=i.xr.getEnvironmentBlendMode();y==="additive"?n.buffers.color.setClear(0,0,0,1,o):y==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||g)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))},addToRenderList:function(f,g){let v=m(g);v&&(v.isCubeTexture||v.mapping===ba)?(c===void 0&&(c=new Jt(new Mi(1,1,1),new Rn({name:"BackgroundCubeMaterial",uniforms:Cr(ii.backgroundCube.uniforms),vertexShader:ii.backgroundCube.vertexShader,fragmentShader:ii.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(y,w,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(c)),Wi.copy(g.backgroundRotation),Wi.x*=-1,Wi.y*=-1,Wi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Wi.y*=-1,Wi.z*=-1),c.material.uniforms.envMap.value=v,c.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(rd.makeRotationFromEuler(Wi)),c.material.toneMapped=wt.getTransfer(v.colorSpace)!==Ot,u===v&&d===v.version&&p===i.toneMapping||(c.material.needsUpdate=!0,u=v,d=v.version,p=i.toneMapping),c.layers.enableAll(),f.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new Jt(new Ui(2,2),new Rn({name:"BackgroundMaterial",uniforms:Cr(ii.background.uniforms),vertexShader:ii.background.vertexShader,fragmentShader:ii.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,l.material.toneMapped=wt.getTransfer(v.colorSpace)!==Ot,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),u===v&&d===v.version&&p===i.toneMapping||(l.material.needsUpdate=!0,u=v,d=v.version,p=i.toneMapping),l.layers.enableAll(),f.unshift(l,l.geometry,l.material,0,0,null))}}}function ad(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=c(null),s=r,o=!1;function a(g){return i.bindVertexArray(g)}function l(g){return i.deleteVertexArray(g)}function c(g){let v=[],y=[],w=[];for(let T=0;T<t;T++)v[T]=0,y[T]=0,w[T]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:v,enabledAttributes:y,attributeDivisors:w,object:g,attributes:{},index:null}}function h(){let g=s.newAttributes;for(let v=0,y=g.length;v<y;v++)g[v]=0}function u(g){d(g,0)}function d(g,v){let y=s.newAttributes,w=s.enabledAttributes,T=s.attributeDivisors;y[g]=1,w[g]===0&&(i.enableVertexAttribArray(g),w[g]=1),T[g]!==v&&(i.vertexAttribDivisor(g,v),T[g]=v)}function p(){let g=s.newAttributes,v=s.enabledAttributes;for(let y=0,w=v.length;y<w;y++)v[y]!==g[y]&&(i.disableVertexAttribArray(y),v[y]=0)}function m(g,v,y,w,T,E,V){V===!0?i.vertexAttribIPointer(g,v,y,T,E):i.vertexAttribPointer(g,v,y,w,T,E)}function _(){f(),o=!0,s!==r&&(s=r,a(s.object))}function f(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:function(g,v,y,w,T){let E=!1,V=(function(W,H,$){let ee=$.wireframe===!0,te=n[W.id];te===void 0&&(te={},n[W.id]=te);let oe=te[H.id];oe===void 0&&(oe={},te[H.id]=oe);let ne=oe[ee];return ne===void 0&&(ne=c(i.createVertexArray()),oe[ee]=ne),ne})(w,y,v);s!==V&&(s=V,a(s.object)),E=(function(W,H,$,ee){let te=s.attributes,oe=H.attributes,ne=0,ye=$.getAttributes();for(let ve in ye)if(ye[ve].location>=0){let Pe=te[ve],Ae=oe[ve];if(Ae===void 0&&(ve==="instanceMatrix"&&W.instanceMatrix&&(Ae=W.instanceMatrix),ve==="instanceColor"&&W.instanceColor&&(Ae=W.instanceColor)),Pe===void 0||Pe.attribute!==Ae||Ae&&Pe.data!==Ae.data)return!0;ne++}return s.attributesNum!==ne||s.index!==ee})(g,w,y,T),E&&(function(W,H,$,ee){let te={},oe=H.attributes,ne=0,ye=$.getAttributes();for(let ve in ye)if(ye[ve].location>=0){let Pe=oe[ve];Pe===void 0&&(ve==="instanceMatrix"&&W.instanceMatrix&&(Pe=W.instanceMatrix),ve==="instanceColor"&&W.instanceColor&&(Pe=W.instanceColor));let Ae={};Ae.attribute=Pe,Pe&&Pe.data&&(Ae.data=Pe.data),te[ve]=Ae,ne++}s.attributes=te,s.attributesNum=ne,s.index=ee})(g,w,y,T),T!==null&&e.update(T,i.ELEMENT_ARRAY_BUFFER),(E||o)&&(o=!1,(function(W,H,$,ee){h();let te=ee.attributes,oe=$.getAttributes(),ne=H.defaultAttributeValues;for(let ye in oe){let ve=oe[ye];if(ve.location>=0){let Pe=te[ye];if(Pe===void 0&&(ye==="instanceMatrix"&&W.instanceMatrix&&(Pe=W.instanceMatrix),ye==="instanceColor"&&W.instanceColor&&(Pe=W.instanceColor)),Pe!==void 0){let Ae=Pe.normalized,tt=Pe.itemSize,z=e.get(Pe);if(z===void 0)continue;let U=z.buffer,P=z.type,K=z.bytesPerElement,q=P===i.INT||P===i.UNSIGNED_INT||Pe.gpuType===Wl;if(Pe.isInterleavedBufferAttribute){let G=Pe.data,b=G.stride,M=Pe.offset;if(G.isInstancedInterleavedBuffer){for(let O=0;O<ve.locationSize;O++)d(ve.location+O,G.meshPerAttribute);W.isInstancedMesh!==!0&&ee._maxInstanceCount===void 0&&(ee._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let O=0;O<ve.locationSize;O++)u(ve.location+O);i.bindBuffer(i.ARRAY_BUFFER,U);for(let O=0;O<ve.locationSize;O++)m(ve.location+O,tt/ve.locationSize,P,Ae,b*K,(M+tt/ve.locationSize*O)*K,q)}else{if(Pe.isInstancedBufferAttribute){for(let G=0;G<ve.locationSize;G++)d(ve.location+G,Pe.meshPerAttribute);W.isInstancedMesh!==!0&&ee._maxInstanceCount===void 0&&(ee._maxInstanceCount=Pe.meshPerAttribute*Pe.count)}else for(let G=0;G<ve.locationSize;G++)u(ve.location+G);i.bindBuffer(i.ARRAY_BUFFER,U);for(let G=0;G<ve.locationSize;G++)m(ve.location+G,tt/ve.locationSize,P,Ae,tt*K,tt/ve.locationSize*G*K,q)}}else if(ne!==void 0){let Ae=ne[ye];if(Ae!==void 0)switch(Ae.length){case 2:i.vertexAttrib2fv(ve.location,Ae);break;case 3:i.vertexAttrib3fv(ve.location,Ae);break;case 4:i.vertexAttrib4fv(ve.location,Ae);break;default:i.vertexAttrib1fv(ve.location,Ae)}}}}p()})(g,v,y,w),T!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(T).buffer))},reset:_,resetDefaultState:f,dispose:function(){_();for(let g in n){let v=n[g];for(let y in v){let w=v[y];for(let T in w)l(w[T].object),delete w[T];delete v[y]}delete n[g]}},releaseStatesOfGeometry:function(g){if(n[g.id]===void 0)return;let v=n[g.id];for(let y in v){let w=v[y];for(let T in w)l(w[T].object),delete w[T];delete v[y]}delete n[g.id]},releaseStatesOfProgram:function(g){for(let v in n){let y=n[v];if(y[g.id]===void 0)continue;let w=y[g.id];for(let T in w)l(w[T].object),delete w[T];delete y[g.id]}},initAttributes:h,enableAttribute:u,disableUnusedAttributes:p}}function od(i,e,t){let n;function r(s,o,a){a!==0&&(i.drawArraysInstanced(n,s,o,a),t.update(o,n,a))}this.setMode=function(s){n=s},this.render=function(s,o){i.drawArrays(n,s,o),t.update(o,n,1)},this.renderInstances=r,this.renderMultiDraw=function(s,o,a){if(a===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,s,0,o,0,a);let l=0;for(let c=0;c<a;c++)l+=o[c];t.update(l,n,1)},this.renderMultiDrawInstances=function(s,o,a,l){if(a===0)return;let c=e.get("WEBGL_multi_draw");if(c===null)for(let h=0;h<s.length;h++)r(s[h],o[h],l[h]);else{c.multiDrawArraysInstancedWEBGL(n,s,0,o,0,l,0,a);let h=0;for(let u=0;u<a;u++)h+=o[u]*l[u];t.update(h,n,1)}}}function ld(i,e,t,n){let r;function s(d){if(d==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";d="mediump"}return d==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=t.precision!==void 0?t.precision:"highp",a=s(o);a!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",a,"instead."),o=a);let l=t.logarithmicDepthBuffer===!0,c=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),h=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),u=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS);return{isWebGL2:!0,getMaxAnisotropy:function(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let d=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(d.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r},getMaxPrecision:s,textureFormatReadable:function(d){return d===ri||n.convert(d)===i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT)},textureTypeReadable:function(d){let p=d===ps&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(d!==Di&&n.convert(d)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&d!==vi&&!p)},precision:o,logarithmicDepthBuffer:l,reverseDepthBuffer:c,maxTextures:h,maxVertexTextures:u,maxTextureSize:i.getParameter(i.MAX_TEXTURE_SIZE),maxCubemapSize:i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),maxAttributes:i.getParameter(i.MAX_VERTEX_ATTRIBS),maxVertexUniforms:i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),maxVaryings:i.getParameter(i.MAX_VARYING_VECTORS),maxFragmentUniforms:i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),vertexTextures:u>0,maxSamples:i.getParameter(i.MAX_SAMPLES)}}function cd(i){let e=this,t=null,n=0,r=!1,s=!1,o=new jn,a=new vt,l={value:null,needsUpdate:!1};function c(h,u,d,p){let m=h!==null?h.length:0,_=null;if(m!==0){if(_=l.value,p!==!0||_===null){let f=d+4*m,g=u.matrixWorldInverse;a.getNormalMatrix(g),(_===null||_.length<f)&&(_=new Float32Array(f));for(let v=0,y=d;v!==m;++v,y+=4)o.copy(h[v]).applyMatrix4(g,a),o.normal.toArray(_,y),_[y+3]=o.constant}l.value=_,l.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,_}this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){let d=h.length!==0||u||n!==0||r;return r=u,n=h.length,d},this.beginShadows=function(){s=!0,c(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,u){t=c(h,u,0)},this.setState=function(h,u,d){let p=h.clippingPlanes,m=h.clipIntersection,_=h.clipShadows,f=i.get(h);if(!r||p===null||p.length===0||s&&!_)s?c(null):(function(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0})();else{let g=s?0:n,v=4*g,y=f.clippingState||null;l.value=y,y=c(p,u,v,d);for(let w=0;w!==v;++w)y[w]=t[w];f.clippingState=y,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=g}}}function hd(i){let e=new WeakMap;function t(r,s){return s===yo?r.mapping=wr:s===xo&&(r.mapping=Er),r}function n(r){let s=r.target;s.removeEventListener("dispose",n);let o=e.get(s);o!==void 0&&(e.delete(s),o.dispose())}return{get:function(r){if(r&&r.isTexture){let s=r.mapping;if(s===yo||s===xo){if(e.has(r))return t(e.get(r).texture,r.mapping);{let o=r.image;if(o&&o.height>0){let a=new el(o.height);return a.fromEquirectangularTexture(i,r),e.set(r,a),r.addEventListener("dispose",n),t(a.texture,r.mapping)}return null}}}return r},dispose:function(){e=new WeakMap}}}var ss=class extends $i{constructor(e=-1,t=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=n-e,o=n+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Uc=[.125,.215,.35,.446,.526,.582],jr=20,so=new ss,Nc=new mt,ao=null,oo=0,lo=0,co=!1,Xi=(1+Math.sqrt(5))/2,gr=1/Xi,Oc=[new B(-Xi,gr,0),new B(Xi,gr,0),new B(-gr,0,Xi),new B(gr,0,Xi),new B(0,Xi,-gr),new B(0,Xi,gr),new B(-1,1,-1),new B(1,1,-1),new B(-1,1,1),new B(1,1,1)],Pr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){ao=this._renderer.getRenderTarget(),oo=this._renderer.getActiveCubeFace(),lo=this._renderer.getActiveMipmapLevel(),co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=zc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ao,oo,lo),this._renderer.xr.enabled=co,e.scissorTest=!1,Os(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===wr||e.mapping===Er?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ao=this._renderer.getRenderTarget(),oo=this._renderer.getActiveCubeFace(),lo=this._renderer.getActiveMipmapLevel(),co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:gi,minFilter:gi,generateMipmaps:!1,type:ps,format:ri,colorSpace:Ur,depthBuffer:!1},r=Fc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fc(e,t,n);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=(function(o){let a=[],l=[],c=[],h=o,u=o-4+1+Uc.length;for(let d=0;d<u;d++){let p=Math.pow(2,h);l.push(p);let m=1/p;d>o-4?m=Uc[d-o+4-1]:d===0&&(m=0),c.push(m);let _=1/(p-2),f=-_,g=1+_,v=[f,f,g,f,g,g,f,f,g,g,f,g],y=6,w=6,T=3,E=2,V=1,W=new Float32Array(T*w*y),H=new Float32Array(E*w*y),$=new Float32Array(V*w*y);for(let te=0;te<y;te++){let oe=te%3*2/3-1,ne=te>2?0:-1,ye=[oe,ne,0,oe+2/3,ne,0,oe+2/3,ne+1,0,oe,ne,0,oe+2/3,ne+1,0,oe,ne+1,0];W.set(ye,T*w*te),H.set(v,E*w*te);let ve=[te,te,te,te,te,te];$.set(ve,V*w*te)}let ee=new Dt;ee.setAttribute("position",new $t(W,T)),ee.setAttribute("uv",new $t(H,E)),ee.setAttribute("faceIndex",new $t($,V)),a.push(ee),h>4&&h--}return{lodPlanes:a,sizeLods:l,sigmas:c}})(s)),this._blurMaterial=(function(o,a,l){let c=new Float32Array(jr),h=new B(0,1,0);return new Rn({name:"SphericalGaussianBlur",defines:{n:jr,CUBEUV_TEXEL_WIDTH:1/a,CUBEUV_TEXEL_HEIGHT:1/l,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:c},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:h}},vertexShader:Kl(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})})(s,e,t)}return r}_compileMaterial(e){let t=new Jt(this._lodPlanes[0],e);this._renderer.compile(t,so)}_sceneToCubeUV(e,t,n,r){let s=new An(90,1,t,n),o=[1,-1,1,1,1,1],a=[1,1,1,-1,-1,-1],l=this._renderer,c=l.autoClear,h=l.toneMapping;l.getClearColor(Nc),l.toneMapping=0,l.autoClear=!1;let u=new ta({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),d=new Jt(new Mi,u),p=!1,m=e.background;m?m.isColor&&(u.color.copy(m),e.background=null,p=!0):(u.color.copy(Nc),p=!0);for(let _=0;_<6;_++){let f=_%3;f===0?(s.up.set(0,o[_],0),s.lookAt(a[_],0,0)):f===1?(s.up.set(0,0,o[_]),s.lookAt(0,a[_],0)):(s.up.set(0,o[_],0),s.lookAt(0,0,a[_]));let g=this._cubeSize;Os(r,f*g,_>2?g:0,g,g),l.setRenderTarget(r),p&&l.render(d,s),l.render(e,s)}d.geometry.dispose(),d.material.dispose(),l.toneMapping=h,l.autoClear=c,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===wr||e.mapping===Er;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=zc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bc());let s=r?this._cubemapMaterial:this._equirectMaterial,o=new Jt(this._lodPlanes[0],s);s.uniforms.envMap.value=e;let a=this._cubeSize;Os(t,0,0,3*a,2*a),n.setRenderTarget(t),n.render(o,so)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodPlanes.length;for(let s=1;s<r;s++){let o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Oc[(r-s-1)%Oc.length];this._blur(e,s-1,s,o,a)}t.autoClear=n}_blur(e,t,n,r,s){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,r,"latitudinal",s),this._halfBlur(o,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=new Jt(this._lodPlanes[r],c),u=c.uniforms,d=this._sizeLods[n]-1,p=isFinite(s)?Math.PI/(2*d):2*Math.PI/39,m=s/p,_=isFinite(s)?1+Math.floor(3*m):jr;_>jr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${_} samples when the maximum is set to 20`);let f=[],g=0;for(let w=0;w<jr;++w){let T=w/m,E=Math.exp(-T*T/2);f.push(E),w===0?g+=E:w<_&&(g+=2*E)}for(let w=0;w<f.length;w++)f[w]=f[w]/g;u.envMap.value=e.texture,u.samples.value=_,u.weights.value=f,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);let{_lodMax:v}=this;u.dTheta.value=p,u.mipInt.value=v-n;let y=this._sizeLods[r];Os(t,3*y*(r>v-4?r-v+4:0),4*(this._cubeSize-y),3*y,2*y),l.setRenderTarget(t),l.render(h,so)}};function Fc(i,e,t){let n=new Bn(i,e,t);return n.texture.mapping=ba,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Os(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function Bc(){return new Rn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Kl(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function zc(){return new Rn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Kl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Kl(){return`

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
	`}function ud(i){let e=new WeakMap,t=null;function n(r){let s=r.target;s.removeEventListener("dispose",n);let o=e.get(s);o!==void 0&&(e.delete(s),o.dispose())}return{get:function(r){if(r&&r.isTexture){let s=r.mapping,o=s===yo||s===xo,a=s===wr||s===Er;if(o||a){let l=e.get(r),c=l!==void 0?l.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==c)return t===null&&(t=new Pr(i)),l=o?t.fromEquirectangular(r,l):t.fromCubemap(r,l),l.texture.pmremVersion=r.pmremVersion,e.set(r,l),l.texture;if(l!==void 0)return l.texture;{let h=r.image;return o&&h&&h.height>0||a&&h&&(function(u){let d=0,p=6;for(let m=0;m<p;m++)u[m]!==void 0&&d++;return d===p})(h)?(t===null&&(t=new Pr(i)),l=o?t.fromEquirectangular(r):t.fromCubemap(r),l.texture.pmremVersion=r.pmremVersion,e.set(r,l),r.addEventListener("dispose",n),l.texture):null}}}return r},dispose:function(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}}}function dd(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let r=t(n);return r===null&&qr("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function pd(i,e,t,n){let r={},s=new WeakMap;function o(l){let c=l.target;c.index!==null&&e.remove(c.index);for(let u in c.attributes)e.remove(c.attributes[u]);for(let u in c.morphAttributes){let d=c.morphAttributes[u];for(let p=0,m=d.length;p<m;p++)e.remove(d[p])}c.removeEventListener("dispose",o),delete r[c.id];let h=s.get(c);h&&(e.remove(h),s.delete(c)),n.releaseStatesOfGeometry(c),c.isInstancedBufferGeometry===!0&&delete c._maxInstanceCount,t.memory.geometries--}function a(l){let c=[],h=l.index,u=l.attributes.position,d=0;if(h!==null){let _=h.array;d=h.version;for(let f=0,g=_.length;f<g;f+=3){let v=_[f+0],y=_[f+1],w=_[f+2];c.push(v,y,y,w,w,v)}}else{if(u===void 0)return;{let _=u.array;d=u.version;for(let f=0,g=_.length/3-1;f<g;f+=3){let v=f+0,y=f+1,w=f+2;c.push(v,y,y,w,w,v)}}}let p=new(Rh(c)?ia:na)(c,1);p.version=d;let m=s.get(l);m&&e.remove(m),s.set(l,p)}return{get:function(l,c){return r[c.id]===!0||(c.addEventListener("dispose",o),r[c.id]=!0,t.memory.geometries++),c},update:function(l){let c=l.attributes;for(let u in c)e.update(c[u],i.ARRAY_BUFFER);let h=l.morphAttributes;for(let u in h){let d=h[u];for(let p=0,m=d.length;p<m;p++)e.update(d[p],i.ARRAY_BUFFER)}},getWireframeAttribute:function(l){let c=s.get(l);if(c){let h=l.index;h!==null&&c.version<h.version&&a(l)}else a(l);return s.get(l)}}}function fd(i,e,t){let n,r,s;function o(a,l,c){c!==0&&(i.drawElementsInstanced(n,l,r,a*s,c),t.update(l,n,c))}this.setMode=function(a){n=a},this.setIndex=function(a){r=a.type,s=a.bytesPerElement},this.render=function(a,l){i.drawElements(n,l,r,a*s),t.update(l,n,1)},this.renderInstances=o,this.renderMultiDraw=function(a,l,c){if(c===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,l,0,r,a,0,c);let h=0;for(let u=0;u<c;u++)h+=l[u];t.update(h,n,1)},this.renderMultiDrawInstances=function(a,l,c,h){if(c===0)return;let u=e.get("WEBGL_multi_draw");if(u===null)for(let d=0;d<a.length;d++)o(a[d]/s,l[d],h[d]);else{u.multiDrawElementsInstancedWEBGL(n,l,0,r,a,0,h,0,c);let d=0;for(let p=0;p<c;p++)d+=l[p]*h[p];t.update(d,n,1)}}}function md(i){let e={frame:0,calls:0,triangles:0,points:0,lines:0};return{memory:{geometries:0,textures:0},render:e,programs:null,autoReset:!0,reset:function(){e.calls=0,e.triangles=0,e.points=0,e.lines=0},update:function(t,n,r){switch(e.calls++,n){case i.TRIANGLES:e.triangles+=r*(t/3);break;case i.LINES:e.lines+=r*(t/2);break;case i.LINE_STRIP:e.lines+=r*(t-1);break;case i.LINE_LOOP:e.lines+=r*t;break;case i.POINTS:e.points+=r*t;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",n)}}}}function gd(i,e,t){let n=new WeakMap,r=new Ht;return{update:function(s,o,a){let l=s.morphTargetInfluences,c=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=c!==void 0?c.length:0,u=n.get(o);if(u===void 0||u.count!==h){let W=function(){E.dispose(),n.delete(o),o.removeEventListener("dispose",W)};u!==void 0&&u.texture.dispose();let d=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,_=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],g=o.morphAttributes.color||[],v=0;d===!0&&(v=1),p===!0&&(v=2),m===!0&&(v=3);let y=o.attributes.position.count*v,w=1;y>e.maxTextureSize&&(w=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let T=new Float32Array(y*w*4*h),E=new ea(T,y,w,h);E.type=vi,E.needsUpdate=!0;let V=4*v;for(let H=0;H<h;H++){let $=_[H],ee=f[H],te=g[H],oe=y*w*4*H;for(let ne=0;ne<$.count;ne++){let ye=ne*V;d===!0&&(r.fromBufferAttribute($,ne),T[oe+ye+0]=r.x,T[oe+ye+1]=r.y,T[oe+ye+2]=r.z,T[oe+ye+3]=0),p===!0&&(r.fromBufferAttribute(ee,ne),T[oe+ye+4]=r.x,T[oe+ye+5]=r.y,T[oe+ye+6]=r.z,T[oe+ye+7]=0),m===!0&&(r.fromBufferAttribute(te,ne),T[oe+ye+8]=r.x,T[oe+ye+9]=r.y,T[oe+ye+10]=r.z,T[oe+ye+11]=te.itemSize===4?r.w:1)}}u={count:h,texture:E,size:new Ce(y,w)},n.set(o,u),o.addEventListener("dispose",W)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)a.getUniforms().setValue(i,"morphTexture",s.morphTexture,t);else{let d=0;for(let m=0;m<l.length;m++)d+=l[m];let p=o.morphTargetsRelative?1:1-d;a.getUniforms().setValue(i,"morphTargetBaseInfluence",p),a.getUniforms().setValue(i,"morphTargetInfluences",l)}a.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),a.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}}}function vd(i,e,t,n){let r=new WeakMap;function s(o){let a=o.target;a.removeEventListener("dispose",s),t.remove(a.instanceMatrix),a.instanceColor!==null&&t.remove(a.instanceColor)}return{update:function(o){let a=n.render.frame,l=o.geometry,c=e.get(o,l);if(r.get(c)!==a&&(e.update(c),r.set(c,a)),o.isInstancedMesh&&(o.hasEventListener("dispose",s)===!1&&o.addEventListener("dispose",s),r.get(o)!==a&&(t.update(o.instanceMatrix,i.ARRAY_BUFFER),o.instanceColor!==null&&t.update(o.instanceColor,i.ARRAY_BUFFER),r.set(o,a))),o.isSkinnedMesh){let h=o.skeleton;r.get(h)!==a&&(h.update(),r.set(h,a))}return c},dispose:function(){r=new WeakMap}}}var sa=class extends Nn{constructor(e,t,n,r,s,o,a,l,c,h=1026){if(h!==ts&&h!==Ar)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ts&&(n=Ki),n===void 0&&h===Ar&&(n=Tr),super(null,r,s,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Xn,this.minFilter=l!==void 0?l:Xn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Ih=new Nn,kc=new sa(1,1),Dh=new ea,Uh=new $o,Nh=new ra,Vc=[],Hc=[],Gc=new Float32Array(16),Wc=new Float32Array(9),jc=new Float32Array(4);function Nr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let r=e*t,s=Vc[r];if(s===void 0&&(s=new Float32Array(r),Vc[r]=s),e!==0){n.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(s,a)}return s}function rn(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function sn(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ea(i,e){let t=Hc[e];t===void 0&&(t=new Int32Array(e),Hc[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function _d(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function yd(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;i.uniform2fv(this.addr,e),sn(t,e)}}function xd(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)t[0]===e.r&&t[1]===e.g&&t[2]===e.b||(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(rn(t,e))return;i.uniform3fv(this.addr,e),sn(t,e)}}function Md(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;i.uniform4fv(this.addr,e),sn(t,e)}}function bd(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(rn(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),sn(t,e)}else{if(rn(t,n))return;jc.set(n),i.uniformMatrix2fv(this.addr,!1,jc),sn(t,n)}}function Sd(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(rn(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),sn(t,e)}else{if(rn(t,n))return;Wc.set(n),i.uniformMatrix3fv(this.addr,!1,Wc),sn(t,n)}}function wd(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(rn(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),sn(t,e)}else{if(rn(t,n))return;Gc.set(n),i.uniformMatrix4fv(this.addr,!1,Gc),sn(t,n)}}function Ed(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Td(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;i.uniform2iv(this.addr,e),sn(t,e)}}function Ad(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rn(t,e))return;i.uniform3iv(this.addr,e),sn(t,e)}}function Rd(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;i.uniform4iv(this.addr,e),sn(t,e)}}function Cd(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Pd(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;i.uniform2uiv(this.addr,e),sn(t,e)}}function Ld(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rn(t,e))return;i.uniform3uiv(this.addr,e),sn(t,e)}}function Id(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;i.uniform4uiv(this.addr,e),sn(t,e)}}function Dd(i,e,t){let n=this.cache,r=t.allocateTextureUnit(),s;n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),this.type===i.SAMPLER_2D_SHADOW?(kc.compareFunction=515,s=kc):s=Ih,t.setTexture2D(e||s,r)}function Ud(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||Uh,r)}function Nd(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||Nh,r)}function Od(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||Dh,r)}function Fd(i,e){i.uniform1fv(this.addr,e)}function Bd(i,e){let t=Nr(e,this.size,2);i.uniform2fv(this.addr,t)}function zd(i,e){let t=Nr(e,this.size,3);i.uniform3fv(this.addr,t)}function kd(i,e){let t=Nr(e,this.size,4);i.uniform4fv(this.addr,t)}function Vd(i,e){let t=Nr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Hd(i,e){let t=Nr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Gd(i,e){let t=Nr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Wd(i,e){i.uniform1iv(this.addr,e)}function jd(i,e){i.uniform2iv(this.addr,e)}function Xd(i,e){i.uniform3iv(this.addr,e)}function qd(i,e){i.uniform4iv(this.addr,e)}function Yd(i,e){i.uniform1uiv(this.addr,e)}function Zd(i,e){i.uniform2uiv(this.addr,e)}function Kd(i,e){i.uniform3uiv(this.addr,e)}function Jd(i,e){i.uniform4uiv(this.addr,e)}function $d(i,e,t){let n=this.cache,r=e.length,s=Ea(t,r);rn(n,s)||(i.uniform1iv(this.addr,s),sn(n,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||Ih,s[o])}function Qd(i,e,t){let n=this.cache,r=e.length,s=Ea(t,r);rn(n,s)||(i.uniform1iv(this.addr,s),sn(n,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Uh,s[o])}function ep(i,e,t){let n=this.cache,r=e.length,s=Ea(t,r);rn(n,s)||(i.uniform1iv(this.addr,s),sn(n,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Nh,s[o])}function tp(i,e,t){let n=this.cache,r=e.length,s=Ea(t,r);rn(n,s)||(i.uniform1iv(this.addr,s),sn(n,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Dh,s[o])}var tl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=(function(r){switch(r){case 5126:return _d;case 35664:return yd;case 35665:return xd;case 35666:return Md;case 35674:return bd;case 35675:return Sd;case 35676:return wd;case 5124:case 35670:return Ed;case 35667:case 35671:return Td;case 35668:case 35672:return Ad;case 35669:case 35673:return Rd;case 5125:return Cd;case 36294:return Pd;case 36295:return Ld;case 36296:return Id;case 35678:case 36198:case 36298:case 36306:case 35682:return Dd;case 35679:case 36299:case 36307:return Ud;case 35680:case 36300:case 36308:case 36293:return Nd;case 36289:case 36303:case 36311:case 36292:return Od}})(t.type)}},nl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=(function(r){switch(r){case 5126:return Fd;case 35664:return Bd;case 35665:return zd;case 35666:return kd;case 35674:return Vd;case 35675:return Hd;case 35676:return Gd;case 5124:case 35670:return Wd;case 35667:case 35671:return jd;case 35668:case 35672:return Xd;case 35669:case 35673:return qd;case 5125:return Yd;case 36294:return Zd;case 36295:return Kd;case 36296:return Jd;case 35678:case 36198:case 36298:case 36306:case 35682:return $d;case 35679:case 36299:case 36307:return Qd;case 35680:case 36300:case 36308:case 36293:return ep;case 36289:case 36303:case 36311:case 36292:return tp}})(t.type)}},il=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(e,t[a.id],n)}}},ho=/(\w+)(\])?(\[|\.)?/g;function Xc(i,e){i.seq.push(e),i.map[e.id]=e}function np(i,e,t){let n=i.name,r=n.length;for(ho.lastIndex=0;;){let s=ho.exec(n),o=ho.lastIndex,a=s[1],l=s[2]==="]",c=s[3];if(l&&(a|=0),c===void 0||c==="["&&o+2===r){Xc(t,c===void 0?new tl(a,i,e):new nl(a,i,e));break}{let h=t.map[a];h===void 0&&(h=new il(a),Xc(t,h)),t=h}}}var Sr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let s=e.getActiveUniform(t,r);np(s,e.getUniformLocation(t,s.name),this)}}setValue(e,t,n,r){let s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,o=t.length;s!==o;++s){let a=t[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,s=e.length;r!==s;++r){let o=e[r];o.id in t&&n.push(o)}return n}};function qc(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var ip=0,Yc=new vt;function Zc(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";let s=/ERROR: 0:(\d+)/.exec(r);if(s){let o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+(function(a,l){let c=a.split(`
`),h=[],u=Math.max(l-6,0),d=Math.min(l+6,c.length);for(let p=u;p<d;p++){let m=p+1;h.push(`${m===l?">":" "} ${m}: ${c[p]}`)}return h.join(`
`)})(i.getShaderSource(e),o)}return r}function rp(i,e){let t=(function(n){wt._getMatrix(Yc,wt.workingColorSpace,n);let r=`mat3( ${Yc.elements.map((s=>s.toFixed(4)))} )`;switch(wt.getTransfer(n)){case Sa:return[r,"LinearTransferOETF"];case Ot:return[r,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[r,"LinearTransferOETF"]}})(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function sp(i,e){let t;switch(e){case 1:t="Linear";break;case 2:t="Reinhard";break;case 3:t="Cineon";break;case 4:t="ACESFilmic";break;case 6:t="AgX";break;case 7:t="Neutral";break;case 5:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Fs=new B;function ap(){return wt.getLuminanceCoefficients(Fs),["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${Fs.x.toFixed(4)}, ${Fs.y.toFixed(4)}, ${Fs.z.toFixed(4)} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Xr(i){return i!==""}function Kc(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Jc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var op=/^[ \t]*#include +<([\w\d./]+)>/gm;function rl(i){return i.replace(op,cp)}var lp=new Map;function cp(i,e){let t=pt[e];if(t===void 0){let n=lp.get(e);if(n===void 0)throw new Error("Can not resolve #include <"+e+">");t=pt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n)}return rl(t)}var hp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function $c(i){return i.replace(hp,up)}function up(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Qc(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function dp(i,e,t,n){let r=i.getContext(),s=t.defines,o=t.vertexShader,a=t.fragmentShader,l=(function(ee){let te="SHADOWMAP_TYPE_BASIC";return ee.shadowMapType===1?te="SHADOWMAP_TYPE_PCF":ee.shadowMapType===2?te="SHADOWMAP_TYPE_PCF_SOFT":ee.shadowMapType===3&&(te="SHADOWMAP_TYPE_VSM"),te})(t),c=(function(ee){let te="ENVMAP_TYPE_CUBE";if(ee.envMap)switch(ee.envMapMode){case wr:case Er:te="ENVMAP_TYPE_CUBE";break;case ba:te="ENVMAP_TYPE_CUBE_UV"}return te})(t),h=(function(ee){let te="ENVMAP_MODE_REFLECTION";return ee.envMap&&ee.envMapMode===Er&&(te="ENVMAP_MODE_REFRACTION"),te})(t),u=(function(ee){let te="ENVMAP_BLENDING_NONE";if(ee.envMap)switch(ee.combine){case 0:te="ENVMAP_BLENDING_MULTIPLY";break;case 1:te="ENVMAP_BLENDING_MIX";break;case 2:te="ENVMAP_BLENDING_ADD"}return te})(t),d=(function(ee){let te=ee.envMapCubeUVHeight;if(te===null)return null;let oe=Math.log2(te)-2,ne=1/te;return{texelWidth:1/(3*Math.max(Math.pow(2,oe),112)),texelHeight:ne,maxMip:oe}})(t),p=(function(ee){return[ee.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",ee.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Xr).join(`
`)})(t),m=(function(ee){let te=[];for(let oe in ee){let ne=ee[oe];ne!==!1&&te.push("#define "+oe+" "+ne)}return te.join(`
`)})(s),_=r.createProgram(),f,g,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Xr).join(`
`),f.length>0&&(f+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Xr).join(`
`),g.length>0&&(g+=`
`)):(f=[Qc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xr).join(`
`),g=[Qc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?pt.tonemapping_pars_fragment:"",t.toneMapping!==0?sp("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",pt.colorspace_pars_fragment,rp("linearToOutputTexel",t.outputColorSpace),ap(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Xr).join(`
`)),o=rl(o),o=Kc(o,t),o=Jc(o,t),a=rl(a),a=Kc(a,t),a=Jc(a,t),o=$c(o),a=$c(a),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,f=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,g=["#define varying in",t.glslVersion===dc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===dc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let y=v+f+o,w=v+g+a,T=qc(r,r.VERTEX_SHADER,y),E=qc(r,r.FRAGMENT_SHADER,w);function V(ee){if(i.debug.checkShaderErrors){let te=r.getProgramInfoLog(_).trim(),oe=r.getShaderInfoLog(T).trim(),ne=r.getShaderInfoLog(E).trim(),ye=!0,ve=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(ye=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,_,T,E);else{let Pe=Zc(r,T,"vertex"),Ae=Zc(r,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+ee.name+`
Material Type: `+ee.type+`

Program Info Log: `+te+`
`+Pe+`
`+Ae)}else te!==""?console.warn("THREE.WebGLProgram: Program Info Log:",te):oe!==""&&ne!==""||(ve=!1);ve&&(ee.diagnostics={runnable:ye,programLog:te,vertexShader:{log:oe,prefix:f},fragmentShader:{log:ne,prefix:g}})}r.deleteShader(T),r.deleteShader(E),W=new Sr(r,_),H=(function(te,oe){let ne={},ye=te.getProgramParameter(oe,te.ACTIVE_ATTRIBUTES);for(let ve=0;ve<ye;ve++){let Pe=te.getActiveAttrib(oe,ve),Ae=Pe.name,tt=1;Pe.type===te.FLOAT_MAT2&&(tt=2),Pe.type===te.FLOAT_MAT3&&(tt=3),Pe.type===te.FLOAT_MAT4&&(tt=4),ne[Ae]={type:Pe.type,location:te.getAttribLocation(oe,Ae),locationSize:tt}}return ne})(r,_)}let W,H;r.attachShader(_,T),r.attachShader(_,E),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_),this.getUniforms=function(){return W===void 0&&V(this),W},this.getAttributes=function(){return H===void 0&&V(this),H};let $=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return $===!1&&($=r.getProgramParameter(_,37297)),$},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ip++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=E,this}var pp=0,sl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new al(e),t.set(e,n)),n}},al=class{constructor(e){this.id=pp++,this.code=e,this.usedTimes=0}};function fp(i,e,t,n,r,s,o){let a=new is,l=new sl,c=new Set,h=[],u=r.logarithmicDepthBuffer,d=r.vertexTextures,p=r.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(f){return c.add(f),f===0?"uv":`uv${f}`}return{getParameters:function(f,g,v,y,w){let T=y.fog,E=w.geometry,V=f.isMeshStandardMaterial?y.environment:null,W=(f.isMeshStandardMaterial?t:e).get(f.envMap||V),H=W&&W.mapping===ba?W.image.height:null,$=m[f.type];f.precision!==null&&(p=r.getMaxPrecision(f.precision),p!==f.precision&&console.warn("THREE.WebGLProgram.getParameters:",f.precision,"not supported, using",p,"instead."));let ee=E.morphAttributes.position||E.morphAttributes.normal||E.morphAttributes.color,te=ee!==void 0?ee.length:0,oe,ne,ye,ve,Pe=0;if(E.morphAttributes.position!==void 0&&(Pe=1),E.morphAttributes.normal!==void 0&&(Pe=2),E.morphAttributes.color!==void 0&&(Pe=3),$){let pn=ii[$];oe=pn.vertexShader,ne=pn.fragmentShader}else oe=f.vertexShader,ne=f.fragmentShader,l.update(f),ye=l.getVertexShaderID(f),ve=l.getFragmentShaderID(f);let Ae=i.getRenderTarget(),tt=i.state.buffers.depth.getReversed(),z=w.isInstancedMesh===!0,U=w.isBatchedMesh===!0,P=!!f.map,K=!!f.matcap,q=!!W,G=!!f.aoMap,b=!!f.lightMap,M=!!f.bumpMap,O=!!f.normalMap,L=!!f.displacementMap,A=!!f.emissiveMap,D=!!f.metalnessMap,S=!!f.roughnessMap,C=f.anisotropy>0,F=f.clearcoat>0,se=f.dispersion>0,j=f.iridescence>0,ae=f.sheen>0,ie=f.transmission>0,he=C&&!!f.anisotropyMap,Se=F&&!!f.clearcoatMap,xe=F&&!!f.clearcoatNormalMap,ge=F&&!!f.clearcoatRoughnessMap,Le=j&&!!f.iridescenceMap,ke=j&&!!f.iridescenceThicknessMap,We=ae&&!!f.sheenColorMap,ze=ae&&!!f.sheenRoughnessMap,nt=!!f.specularMap,Be=!!f.specularColorMap,gt=!!f.specularIntensityMap,qe=ie&&!!f.transmissionMap,Qe=ie&&!!f.thicknessMap,ut=!!f.gradientMap,Tt=!!f.alphaMap,At=f.alphaTest>0,Vt=!!f.alphaHash,_n=!!f.extensions,Yt=0;f.toneMapped&&(Ae!==null&&Ae.isXRRenderTarget!==!0||(Yt=i.toneMapping));let re={shaderID:$,shaderType:f.type,shaderName:f.name,vertexShader:oe,fragmentShader:ne,defines:f.defines,customVertexShaderID:ye,customFragmentShaderID:ve,isRawShaderMaterial:f.isRawShaderMaterial===!0,glslVersion:f.glslVersion,precision:p,batching:U,batchingColor:U&&w._colorsTexture!==null,instancing:z,instancingColor:z&&w.instanceColor!==null,instancingMorph:z&&w.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:Ae===null?i.outputColorSpace:Ae.isXRRenderTarget===!0?Ae.texture.colorSpace:Ur,alphaToCoverage:!!f.alphaToCoverage,map:P,matcap:K,envMap:q,envMapMode:q&&W.mapping,envMapCubeUVHeight:H,aoMap:G,lightMap:b,bumpMap:M,normalMap:O,displacementMap:d&&L,emissiveMap:A,normalMapObjectSpace:O&&f.normalMapType===1,normalMapTangentSpace:O&&f.normalMapType===0,metalnessMap:D,roughnessMap:S,anisotropy:C,anisotropyMap:he,clearcoat:F,clearcoatMap:Se,clearcoatNormalMap:xe,clearcoatRoughnessMap:ge,dispersion:se,iridescence:j,iridescenceMap:Le,iridescenceThicknessMap:ke,sheen:ae,sheenColorMap:We,sheenRoughnessMap:ze,specularMap:nt,specularColorMap:Be,specularIntensityMap:gt,transmission:ie,transmissionMap:qe,thicknessMap:Qe,gradientMap:ut,opaque:f.transparent===!1&&f.blending===1&&f.alphaToCoverage===!1,alphaMap:Tt,alphaTest:At,alphaHash:Vt,combine:f.combine,mapUv:P&&_(f.map.channel),aoMapUv:G&&_(f.aoMap.channel),lightMapUv:b&&_(f.lightMap.channel),bumpMapUv:M&&_(f.bumpMap.channel),normalMapUv:O&&_(f.normalMap.channel),displacementMapUv:L&&_(f.displacementMap.channel),emissiveMapUv:A&&_(f.emissiveMap.channel),metalnessMapUv:D&&_(f.metalnessMap.channel),roughnessMapUv:S&&_(f.roughnessMap.channel),anisotropyMapUv:he&&_(f.anisotropyMap.channel),clearcoatMapUv:Se&&_(f.clearcoatMap.channel),clearcoatNormalMapUv:xe&&_(f.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ge&&_(f.clearcoatRoughnessMap.channel),iridescenceMapUv:Le&&_(f.iridescenceMap.channel),iridescenceThicknessMapUv:ke&&_(f.iridescenceThicknessMap.channel),sheenColorMapUv:We&&_(f.sheenColorMap.channel),sheenRoughnessMapUv:ze&&_(f.sheenRoughnessMap.channel),specularMapUv:nt&&_(f.specularMap.channel),specularColorMapUv:Be&&_(f.specularColorMap.channel),specularIntensityMapUv:gt&&_(f.specularIntensityMap.channel),transmissionMapUv:qe&&_(f.transmissionMap.channel),thicknessMapUv:Qe&&_(f.thicknessMap.channel),alphaMapUv:Tt&&_(f.alphaMap.channel),vertexTangents:!!E.attributes.tangent&&(O||C),vertexColors:f.vertexColors,vertexAlphas:f.vertexColors===!0&&!!E.attributes.color&&E.attributes.color.itemSize===4,pointsUvs:w.isPoints===!0&&!!E.attributes.uv&&(P||Tt),fog:!!T,useFog:f.fog===!0,fogExp2:!!T&&T.isFogExp2,flatShading:f.flatShading===!0,sizeAttenuation:f.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:tt,skinning:w.isSkinnedMesh===!0,morphTargets:E.morphAttributes.position!==void 0,morphNormals:E.morphAttributes.normal!==void 0,morphColors:E.morphAttributes.color!==void 0,morphTargetsCount:te,morphTextureStride:Pe,numDirLights:g.directional.length,numPointLights:g.point.length,numSpotLights:g.spot.length,numSpotLightMaps:g.spotLightMap.length,numRectAreaLights:g.rectArea.length,numHemiLights:g.hemi.length,numDirLightShadows:g.directionalShadowMap.length,numPointLightShadows:g.pointShadowMap.length,numSpotLightShadows:g.spotShadowMap.length,numSpotLightShadowsWithMaps:g.numSpotLightShadowsWithMaps,numLightProbes:g.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:f.dithering,shadowMapEnabled:i.shadowMap.enabled&&v.length>0,shadowMapType:i.shadowMap.type,toneMapping:Yt,decodeVideoTexture:P&&f.map.isVideoTexture===!0&&wt.getTransfer(f.map.colorSpace)===Ot,decodeVideoTextureEmissive:A&&f.emissiveMap.isVideoTexture===!0&&wt.getTransfer(f.emissiveMap.colorSpace)===Ot,premultipliedAlpha:f.premultipliedAlpha,doubleSided:f.side===2,flipSided:f.side===1,useDepthPacking:f.depthPacking>=0,depthPacking:f.depthPacking||0,index0AttributeName:f.index0AttributeName,extensionClipCullDistance:_n&&f.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(_n&&f.extensions.multiDraw===!0||U)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:f.customProgramCacheKey()};return re.vertexUv1s=c.has(1),re.vertexUv2s=c.has(2),re.vertexUv3s=c.has(3),c.clear(),re},getProgramCacheKey:function(f){let g=[];if(f.shaderID?g.push(f.shaderID):(g.push(f.customVertexShaderID),g.push(f.customFragmentShaderID)),f.defines!==void 0)for(let v in f.defines)g.push(v),g.push(f.defines[v]);return f.isRawShaderMaterial===!1&&((function(v,y){v.push(y.precision),v.push(y.outputColorSpace),v.push(y.envMapMode),v.push(y.envMapCubeUVHeight),v.push(y.mapUv),v.push(y.alphaMapUv),v.push(y.lightMapUv),v.push(y.aoMapUv),v.push(y.bumpMapUv),v.push(y.normalMapUv),v.push(y.displacementMapUv),v.push(y.emissiveMapUv),v.push(y.metalnessMapUv),v.push(y.roughnessMapUv),v.push(y.anisotropyMapUv),v.push(y.clearcoatMapUv),v.push(y.clearcoatNormalMapUv),v.push(y.clearcoatRoughnessMapUv),v.push(y.iridescenceMapUv),v.push(y.iridescenceThicknessMapUv),v.push(y.sheenColorMapUv),v.push(y.sheenRoughnessMapUv),v.push(y.specularMapUv),v.push(y.specularColorMapUv),v.push(y.specularIntensityMapUv),v.push(y.transmissionMapUv),v.push(y.thicknessMapUv),v.push(y.combine),v.push(y.fogExp2),v.push(y.sizeAttenuation),v.push(y.morphTargetsCount),v.push(y.morphAttributeCount),v.push(y.numDirLights),v.push(y.numPointLights),v.push(y.numSpotLights),v.push(y.numSpotLightMaps),v.push(y.numHemiLights),v.push(y.numRectAreaLights),v.push(y.numDirLightShadows),v.push(y.numPointLightShadows),v.push(y.numSpotLightShadows),v.push(y.numSpotLightShadowsWithMaps),v.push(y.numLightProbes),v.push(y.shadowMapType),v.push(y.toneMapping),v.push(y.numClippingPlanes),v.push(y.numClipIntersection),v.push(y.depthPacking)})(g,f),(function(v,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),v.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reverseDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),v.push(a.mask)})(g,f),g.push(i.outputColorSpace)),g.push(f.customProgramCacheKey),g.join()},getUniforms:function(f){let g=m[f.type],v;if(g){let y=ii[g];v=ed.clone(y.uniforms)}else v=f.uniforms;return v},acquireProgram:function(f,g){let v;for(let y=0,w=h.length;y<w;y++){let T=h[y];if(T.cacheKey===g){v=T,++v.usedTimes;break}}return v===void 0&&(v=new dp(i,g,f,s),h.push(v)),v},releaseProgram:function(f){if(--f.usedTimes==0){let g=h.indexOf(f);h[g]=h[h.length-1],h.pop(),f.destroy()}},releaseShaderCache:function(f){l.remove(f)},programs:h,dispose:function(){l.dispose()}}}function mp(){let i=new WeakMap;return{has:function(e){return i.has(e)},get:function(e){let t=i.get(e);return t===void 0&&(t={},i.set(e,t)),t},remove:function(e){i.delete(e)},update:function(e,t,n){i.get(e)[t]=n},dispose:function(){i=new WeakMap}}}function gp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function eh(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function th(){let i=[],e=0,t=[],n=[],r=[];function s(o,a,l,c,h,u){let d=i[e];return d===void 0?(d={id:o.id,object:o,geometry:a,material:l,groupOrder:c,renderOrder:o.renderOrder,z:h,group:u},i[e]=d):(d.id=o.id,d.object=o,d.geometry=a,d.material=l,d.groupOrder=c,d.renderOrder=o.renderOrder,d.z=h,d.group=u),e++,d}return{opaque:t,transmissive:n,transparent:r,init:function(){e=0,t.length=0,n.length=0,r.length=0},push:function(o,a,l,c,h,u){let d=s(o,a,l,c,h,u);l.transmission>0?n.push(d):l.transparent===!0?r.push(d):t.push(d)},unshift:function(o,a,l,c,h,u){let d=s(o,a,l,c,h,u);l.transmission>0?n.unshift(d):l.transparent===!0?r.unshift(d):t.unshift(d)},finish:function(){for(let o=e,a=i.length;o<a;o++){let l=i[o];if(l.id===null)break;l.id=null,l.object=null,l.geometry=null,l.material=null,l.group=null}},sort:function(o,a){t.length>1&&t.sort(o||gp),n.length>1&&n.sort(a||eh),r.length>1&&r.sort(a||eh)}}}function vp(){let i=new WeakMap;return{get:function(e,t){let n=i.get(e),r;return n===void 0?(r=new th,i.set(e,[r])):t>=n.length?(r=new th,n.push(r)):r=n[t],r},dispose:function(){i=new WeakMap}}}function _p(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new B,color:new mt};break;case"SpotLight":t={position:new B,direction:new B,color:new mt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new B,color:new mt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new B,skyColor:new mt,groundColor:new mt};break;case"RectAreaLight":t={color:new mt,position:new B,halfWidth:new B,halfHeight:new B}}return i[e.id]=t,t}}}var yp=0;function xp(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Mp(i){let e=new _p,t=(function(){let a={};return{get:function(l){if(a[l.id]!==void 0)return a[l.id];let c;switch(l.type){case"DirectionalLight":case"SpotLight":c={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ce};break;case"PointLight":c={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ce,shadowCameraNear:1,shadowCameraFar:1e3}}return a[l.id]=c,c}}})(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let a=0;a<9;a++)n.probe.push(new B);let r=new B,s=new ht,o=new ht;return{setup:function(a){let l=0,c=0,h=0;for(let V=0;V<9;V++)n.probe[V].set(0,0,0);let u=0,d=0,p=0,m=0,_=0,f=0,g=0,v=0,y=0,w=0,T=0;a.sort(xp);for(let V=0,W=a.length;V<W;V++){let H=a[V],$=H.color,ee=H.intensity,te=H.distance,oe=H.shadow&&H.shadow.map?H.shadow.map.texture:null;if(H.isAmbientLight)l+=$.r*ee,c+=$.g*ee,h+=$.b*ee;else if(H.isLightProbe){for(let ne=0;ne<9;ne++)n.probe[ne].addScaledVector(H.sh.coefficients[ne],ee);T++}else if(H.isDirectionalLight){let ne=e.get(H);if(ne.color.copy(H.color).multiplyScalar(H.intensity),H.castShadow){let ye=H.shadow,ve=t.get(H);ve.shadowIntensity=ye.intensity,ve.shadowBias=ye.bias,ve.shadowNormalBias=ye.normalBias,ve.shadowRadius=ye.radius,ve.shadowMapSize=ye.mapSize,n.directionalShadow[u]=ve,n.directionalShadowMap[u]=oe,n.directionalShadowMatrix[u]=H.shadow.matrix,f++}n.directional[u]=ne,u++}else if(H.isSpotLight){let ne=e.get(H);ne.position.setFromMatrixPosition(H.matrixWorld),ne.color.copy($).multiplyScalar(ee),ne.distance=te,ne.coneCos=Math.cos(H.angle),ne.penumbraCos=Math.cos(H.angle*(1-H.penumbra)),ne.decay=H.decay,n.spot[p]=ne;let ye=H.shadow;if(H.map&&(n.spotLightMap[y]=H.map,y++,ye.updateMatrices(H),H.castShadow&&w++),n.spotLightMatrix[p]=ye.matrix,H.castShadow){let ve=t.get(H);ve.shadowIntensity=ye.intensity,ve.shadowBias=ye.bias,ve.shadowNormalBias=ye.normalBias,ve.shadowRadius=ye.radius,ve.shadowMapSize=ye.mapSize,n.spotShadow[p]=ve,n.spotShadowMap[p]=oe,v++}p++}else if(H.isRectAreaLight){let ne=e.get(H);ne.color.copy($).multiplyScalar(ee),ne.halfWidth.set(.5*H.width,0,0),ne.halfHeight.set(0,.5*H.height,0),n.rectArea[m]=ne,m++}else if(H.isPointLight){let ne=e.get(H);if(ne.color.copy(H.color).multiplyScalar(H.intensity),ne.distance=H.distance,ne.decay=H.decay,H.castShadow){let ye=H.shadow,ve=t.get(H);ve.shadowIntensity=ye.intensity,ve.shadowBias=ye.bias,ve.shadowNormalBias=ye.normalBias,ve.shadowRadius=ye.radius,ve.shadowMapSize=ye.mapSize,ve.shadowCameraNear=ye.camera.near,ve.shadowCameraFar=ye.camera.far,n.pointShadow[d]=ve,n.pointShadowMap[d]=oe,n.pointShadowMatrix[d]=H.shadow.matrix,g++}n.point[d]=ne,d++}else if(H.isHemisphereLight){let ne=e.get(H);ne.skyColor.copy(H.color).multiplyScalar(ee),ne.groundColor.copy(H.groundColor).multiplyScalar(ee),n.hemi[_]=ne,_++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ye.LTC_FLOAT_1,n.rectAreaLTC2=Ye.LTC_FLOAT_2):(n.rectAreaLTC1=Ye.LTC_HALF_1,n.rectAreaLTC2=Ye.LTC_HALF_2)),n.ambient[0]=l,n.ambient[1]=c,n.ambient[2]=h;let E=n.hash;E.directionalLength===u&&E.pointLength===d&&E.spotLength===p&&E.rectAreaLength===m&&E.hemiLength===_&&E.numDirectionalShadows===f&&E.numPointShadows===g&&E.numSpotShadows===v&&E.numSpotMaps===y&&E.numLightProbes===T||(n.directional.length=u,n.spot.length=p,n.rectArea.length=m,n.point.length=d,n.hemi.length=_,n.directionalShadow.length=f,n.directionalShadowMap.length=f,n.pointShadow.length=g,n.pointShadowMap.length=g,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=f,n.pointShadowMatrix.length=g,n.spotLightMatrix.length=v+y-w,n.spotLightMap.length=y,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=T,E.directionalLength=u,E.pointLength=d,E.spotLength=p,E.rectAreaLength=m,E.hemiLength=_,E.numDirectionalShadows=f,E.numPointShadows=g,E.numSpotShadows=v,E.numSpotMaps=y,E.numLightProbes=T,n.version=yp++)},setupView:function(a,l){let c=0,h=0,u=0,d=0,p=0,m=l.matrixWorldInverse;for(let _=0,f=a.length;_<f;_++){let g=a[_];if(g.isDirectionalLight){let v=n.directional[c];v.direction.setFromMatrixPosition(g.matrixWorld),r.setFromMatrixPosition(g.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(m),c++}else if(g.isSpotLight){let v=n.spot[u];v.position.setFromMatrixPosition(g.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(g.matrixWorld),r.setFromMatrixPosition(g.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(m),u++}else if(g.isRectAreaLight){let v=n.rectArea[d];v.position.setFromMatrixPosition(g.matrixWorld),v.position.applyMatrix4(m),o.identity(),s.copy(g.matrixWorld),s.premultiply(m),o.extractRotation(s),v.halfWidth.set(.5*g.width,0,0),v.halfHeight.set(0,.5*g.height,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),d++}else if(g.isPointLight){let v=n.point[h];v.position.setFromMatrixPosition(g.matrixWorld),v.position.applyMatrix4(m),h++}else if(g.isHemisphereLight){let v=n.hemi[p];v.direction.setFromMatrixPosition(g.matrixWorld),v.direction.transformDirection(m),p++}}},state:n}}function nh(i){let e=new Mp(i),t=[],n=[],r={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:function(s){r.camera=s,t.length=0,n.length=0},state:r,setupLights:function(){e.setup(t)},setupLightsView:function(s){e.setupView(t,s)},pushLight:function(s){t.push(s)},pushShadow:function(s){n.push(s)}}}function bp(i){let e=new WeakMap;return{get:function(t,n=0){let r=e.get(t),s;return r===void 0?(s=new nh(i),e.set(t,[s])):n>=r.length?(s=new nh(i),r.push(s)):s=r[n],s},dispose:function(){e=new WeakMap}}}var ol=class extends Ji{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ll=class extends Ji{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Sp(i,e,t){let n=new rs,r=new Ce,s=new Ce,o=new Ht,a=new ol({depthPacking:3201}),l=new ll,c={},h=t.maxTextureSize,u={[cu]:1,[Gl]:0,[xa]:2},d=new Rn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ce},radius:{value:4}},vertexShader:`void main() {
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
}`}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let m=new Dt;m.setAttribute("position",new $t(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Jt(m,d),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let g=this.type;function v(E,V){let W=e.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Bn(r.x,r.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(V,null,W,d,_,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(V,null,W,p,_,null)}function y(E,V,W,H){let $=null,ee=W.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(ee!==void 0)$=ee;else if($=W.isPointLight===!0?l:a,i.localClippingEnabled&&V.clipShadows===!0&&Array.isArray(V.clippingPlanes)&&V.clippingPlanes.length!==0||V.displacementMap&&V.displacementScale!==0||V.alphaMap&&V.alphaTest>0||V.map&&V.alphaTest>0){let te=$.uuid,oe=V.uuid,ne=c[te];ne===void 0&&(ne={},c[te]=ne);let ye=ne[oe];ye===void 0&&(ye=$.clone(),ne[oe]=ye,V.addEventListener("dispose",T)),$=ye}return $.visible=V.visible,$.wireframe=V.wireframe,$.side=H===3?V.shadowSide!==null?V.shadowSide:V.side:V.shadowSide!==null?V.shadowSide:u[V.side],$.alphaMap=V.alphaMap,$.alphaTest=V.alphaTest,$.map=V.map,$.clipShadows=V.clipShadows,$.clippingPlanes=V.clippingPlanes,$.clipIntersection=V.clipIntersection,$.displacementMap=V.displacementMap,$.displacementScale=V.displacementScale,$.displacementBias=V.displacementBias,$.wireframeLinewidth=V.wireframeLinewidth,$.linewidth=V.linewidth,W.isPointLight===!0&&$.isMeshDistanceMaterial===!0&&(i.properties.get($).light=W),$}function w(E,V,W,H,$){if(E.visible===!1)return;if(E.layers.test(V.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&$===3)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,E.matrixWorld);let te=e.update(E),oe=E.material;if(Array.isArray(oe)){let ne=te.groups;for(let ye=0,ve=ne.length;ye<ve;ye++){let Pe=ne[ye],Ae=oe[Pe.materialIndex];if(Ae&&Ae.visible){let tt=y(E,Ae,H,$);E.onBeforeShadow(i,E,V,W,te,tt,Pe),i.renderBufferDirect(W,null,te,tt,E,Pe),E.onAfterShadow(i,E,V,W,te,tt,Pe)}}}else if(oe.visible){let ne=y(E,oe,H,$);E.onBeforeShadow(i,E,V,W,te,ne,null),i.renderBufferDirect(W,null,te,ne,E,null),E.onAfterShadow(i,E,V,W,te,ne,null)}}let ee=E.children;for(let te=0,oe=ee.length;te<oe;te++)w(ee[te],V,W,H,$)}function T(E){E.target.removeEventListener("dispose",T);for(let V in c){let W=c[V],H=E.target.uuid;H in W&&(W[H].dispose(),delete W[H])}}this.render=function(E,V,W){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||E.length===0)return;let H=i.getRenderTarget(),$=i.getActiveCubeFace(),ee=i.getActiveMipmapLevel(),te=i.state;te.setBlending(0),te.buffers.color.setClear(1,1,1,1),te.buffers.depth.setTest(!0),te.setScissorTest(!1);let oe=g!==3&&this.type===3,ne=g===3&&this.type!==3;for(let ye=0,ve=E.length;ye<ve;ye++){let Pe=E[ye],Ae=Pe.shadow;if(Ae===void 0){console.warn("THREE.WebGLShadowMap:",Pe,"has no shadow.");continue}if(Ae.autoUpdate===!1&&Ae.needsUpdate===!1)continue;r.copy(Ae.mapSize);let tt=Ae.getFrameExtents();if(r.multiply(tt),s.copy(Ae.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/tt.x),r.x=s.x*tt.x,Ae.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/tt.y),r.y=s.y*tt.y,Ae.mapSize.y=s.y)),Ae.map===null||oe===!0||ne===!0){let U=this.type!==3?{minFilter:Xn,magFilter:Xn}:{};Ae.map!==null&&Ae.map.dispose(),Ae.map=new Bn(r.x,r.y,U),Ae.map.texture.name=Pe.name+".shadowMap",Ae.camera.updateProjectionMatrix()}i.setRenderTarget(Ae.map),i.clear();let z=Ae.getViewportCount();for(let U=0;U<z;U++){let P=Ae.getViewport(U);o.set(s.x*P.x,s.y*P.y,s.x*P.z,s.y*P.w),te.viewport(o),Ae.updateMatrices(Pe,U),n=Ae.getFrustum(),w(V,W,Ae.camera,Pe,this.type)}Ae.isPointLightShadow!==!0&&this.type===3&&v(Ae,W),Ae.needsUpdate=!1}g=this.type,f.needsUpdate=!1,i.setRenderTarget(H,$,ee)}}var wp={[wu]:1,[Tu]:6,[Ru]:7,[Au]:5,[Eu]:0,[Pu]:2,[Lu]:4,[Cu]:3};function Ep(i,e){let t=new function(){let S=!1,C=new Ht,F=null,se=new Ht(0,0,0,0);return{setMask:function(j){F===j||S||(i.colorMask(j,j,j,j),F=j)},setLocked:function(j){S=j},setClear:function(j,ae,ie,he,Se){Se===!0&&(j*=he,ae*=he,ie*=he),C.set(j,ae,ie,he),se.equals(C)===!1&&(i.clearColor(j,ae,ie,he),se.copy(C))},reset:function(){S=!1,F=null,se.set(-1,0,0,0)}}},n=new function(){let S=!1,C=!1,F=null,se=null,j=null;return{setReversed:function(ae){if(C!==ae){let ie=e.get("EXT_clip_control");C?ie.clipControlEXT(ie.LOWER_LEFT_EXT,ie.ZERO_TO_ONE_EXT):ie.clipControlEXT(ie.LOWER_LEFT_EXT,ie.NEGATIVE_ONE_TO_ONE_EXT);let he=j;j=null,this.setClear(he)}C=ae},getReversed:function(){return C},setTest:function(ae){ae?q(i.DEPTH_TEST):G(i.DEPTH_TEST)},setMask:function(ae){F===ae||S||(i.depthMask(ae),F=ae)},setFunc:function(ae){if(C&&(ae=wp[ae]),se!==ae){switch(ae){case 0:i.depthFunc(i.NEVER);break;case 1:i.depthFunc(i.ALWAYS);break;case 2:i.depthFunc(i.LESS);break;case 3:default:i.depthFunc(i.LEQUAL);break;case 4:i.depthFunc(i.EQUAL);break;case 5:i.depthFunc(i.GEQUAL);break;case 6:i.depthFunc(i.GREATER);break;case 7:i.depthFunc(i.NOTEQUAL)}se=ae}},setLocked:function(ae){S=ae},setClear:function(ae){j!==ae&&(C&&(ae=1-ae),i.clearDepth(ae),j=ae)},reset:function(){S=!1,F=null,se=null,j=null,C=!1}}},r=new function(){let S=!1,C=null,F=null,se=null,j=null,ae=null,ie=null,he=null,Se=null;return{setTest:function(xe){S||(xe?q(i.STENCIL_TEST):G(i.STENCIL_TEST))},setMask:function(xe){C===xe||S||(i.stencilMask(xe),C=xe)},setFunc:function(xe,ge,Le){F===xe&&se===ge&&j===Le||(i.stencilFunc(xe,ge,Le),F=xe,se=ge,j=Le)},setOp:function(xe,ge,Le){ae===xe&&ie===ge&&he===Le||(i.stencilOp(xe,ge,Le),ae=xe,ie=ge,he=Le)},setLocked:function(xe){S=xe},setClear:function(xe){Se!==xe&&(i.clearStencil(xe),Se=xe)},reset:function(){S=!1,C=null,F=null,se=null,j=null,ae=null,ie=null,he=null,Se=null}}},s=new WeakMap,o=new WeakMap,a={},l={},c=new WeakMap,h=[],u=null,d=!1,p=null,m=null,_=null,f=null,g=null,v=null,y=null,w=new mt(0,0,0),T=0,E=!1,V=null,W=null,H=null,$=null,ee=null,te=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),oe=!1,ne=0,ye=i.getParameter(i.VERSION);ye.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(ye)[1]),oe=ne>=1):ye.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(ye)[1]),oe=ne>=2);let ve=null,Pe={},Ae=i.getParameter(i.SCISSOR_BOX),tt=i.getParameter(i.VIEWPORT),z=new Ht().fromArray(Ae),U=new Ht().fromArray(tt);function P(S,C,F,se){let j=new Uint8Array(4),ae=i.createTexture();i.bindTexture(S,ae),i.texParameteri(S,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(S,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ie=0;ie<F;ie++)S===i.TEXTURE_3D||S===i.TEXTURE_2D_ARRAY?i.texImage3D(C,0,i.RGBA,1,1,se,0,i.RGBA,i.UNSIGNED_BYTE,j):i.texImage2D(C+ie,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,j);return ae}let K={};function q(S){a[S]!==!0&&(i.enable(S),a[S]=!0)}function G(S){a[S]!==!1&&(i.disable(S),a[S]=!1)}K[i.TEXTURE_2D]=P(i.TEXTURE_2D,i.TEXTURE_2D,1),K[i.TEXTURE_CUBE_MAP]=P(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[i.TEXTURE_2D_ARRAY]=P(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),K[i.TEXTURE_3D]=P(i.TEXTURE_3D,i.TEXTURE_3D,1,1),t.setClear(0,0,0,1),n.setClear(1),r.setClear(0),q(i.DEPTH_TEST),n.setFunc(3),L(!1),A(1),q(i.CULL_FACE),O(0);let b={[qi]:i.FUNC_ADD,[hu]:i.FUNC_SUBTRACT,[uu]:i.FUNC_REVERSE_SUBTRACT};b[103]=i.MIN,b[104]=i.MAX;let M={[du]:i.ZERO,[Ma]:i.ONE,[pu]:i.SRC_COLOR,[vo]:i.SRC_ALPHA,[yu]:i.SRC_ALPHA_SATURATE,[vu]:i.DST_COLOR,[mu]:i.DST_ALPHA,[fu]:i.ONE_MINUS_SRC_COLOR,[_o]:i.ONE_MINUS_SRC_ALPHA,[_u]:i.ONE_MINUS_DST_COLOR,[gu]:i.ONE_MINUS_DST_ALPHA,[xu]:i.CONSTANT_COLOR,[Mu]:i.ONE_MINUS_CONSTANT_COLOR,[bu]:i.CONSTANT_ALPHA,[Su]:i.ONE_MINUS_CONSTANT_ALPHA};function O(S,C,F,se,j,ae,ie,he,Se,xe){if(S!==0){if(d===!1&&(q(i.BLEND),d=!0),S===5)j=j||C,ae=ae||F,ie=ie||se,C===m&&j===g||(i.blendEquationSeparate(b[C],b[j]),m=C,g=j),F===_&&se===f&&ae===v&&ie===y||(i.blendFuncSeparate(M[F],M[se],M[ae],M[ie]),_=F,f=se,v=ae,y=ie),he.equals(w)!==!1&&Se===T||(i.blendColor(he.r,he.g,he.b,Se),w.copy(he),T=Se),p=S,E=!1;else if(S!==p||xe!==E){if(m===qi&&g===qi||(i.blendEquation(i.FUNC_ADD),m=qi,g=qi),xe)switch(S){case 1:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.ONE,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",S)}else switch(S){case 1:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",S)}_=null,f=null,v=null,y=null,w.set(0,0,0),T=0,p=S,E=xe}}else d===!0&&(G(i.BLEND),d=!1)}function L(S){V!==S&&(S?i.frontFace(i.CW):i.frontFace(i.CCW),V=S)}function A(S){S!==0?(q(i.CULL_FACE),S!==W&&(S===1?i.cullFace(i.BACK):S===2?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):G(i.CULL_FACE),W=S}function D(S,C,F){S?(q(i.POLYGON_OFFSET_FILL),$===C&&ee===F||(i.polygonOffset(C,F),$=C,ee=F)):G(i.POLYGON_OFFSET_FILL)}return{buffers:{color:t,depth:n,stencil:r},enable:q,disable:G,bindFramebuffer:function(S,C){return l[S]!==C&&(i.bindFramebuffer(S,C),l[S]=C,S===i.DRAW_FRAMEBUFFER&&(l[i.FRAMEBUFFER]=C),S===i.FRAMEBUFFER&&(l[i.DRAW_FRAMEBUFFER]=C),!0)},drawBuffers:function(S,C){let F=h,se=!1;if(S){F=c.get(C),F===void 0&&(F=[],c.set(C,F));let j=S.textures;if(F.length!==j.length||F[0]!==i.COLOR_ATTACHMENT0){for(let ae=0,ie=j.length;ae<ie;ae++)F[ae]=i.COLOR_ATTACHMENT0+ae;F.length=j.length,se=!0}}else F[0]!==i.BACK&&(F[0]=i.BACK,se=!0);se&&i.drawBuffers(F)},useProgram:function(S){return u!==S&&(i.useProgram(S),u=S,!0)},setBlending:O,setMaterial:function(S,C){S.side===2?G(i.CULL_FACE):q(i.CULL_FACE);let F=S.side===1;C&&(F=!F),L(F),S.blending===1&&S.transparent===!1?O(0):O(S.blending,S.blendEquation,S.blendSrc,S.blendDst,S.blendEquationAlpha,S.blendSrcAlpha,S.blendDstAlpha,S.blendColor,S.blendAlpha,S.premultipliedAlpha),n.setFunc(S.depthFunc),n.setTest(S.depthTest),n.setMask(S.depthWrite),t.setMask(S.colorWrite);let se=S.stencilWrite;r.setTest(se),se&&(r.setMask(S.stencilWriteMask),r.setFunc(S.stencilFunc,S.stencilRef,S.stencilFuncMask),r.setOp(S.stencilFail,S.stencilZFail,S.stencilZPass)),D(S.polygonOffset,S.polygonOffsetFactor,S.polygonOffsetUnits),S.alphaToCoverage===!0?q(i.SAMPLE_ALPHA_TO_COVERAGE):G(i.SAMPLE_ALPHA_TO_COVERAGE)},setFlipSided:L,setCullFace:A,setLineWidth:function(S){S!==H&&(oe&&i.lineWidth(S),H=S)},setPolygonOffset:D,setScissorTest:function(S){S?q(i.SCISSOR_TEST):G(i.SCISSOR_TEST)},activeTexture:function(S){S===void 0&&(S=i.TEXTURE0+te-1),ve!==S&&(i.activeTexture(S),ve=S)},bindTexture:function(S,C,F){F===void 0&&(F=ve===null?i.TEXTURE0+te-1:ve);let se=Pe[F];se===void 0&&(se={type:void 0,texture:void 0},Pe[F]=se),se.type===S&&se.texture===C||(ve!==F&&(i.activeTexture(F),ve=F),i.bindTexture(S,C||K[S]),se.type=S,se.texture=C)},unbindTexture:function(){let S=Pe[ve];S!==void 0&&S.type!==void 0&&(i.bindTexture(S.type,null),S.type=void 0,S.texture=void 0)},compressedTexImage2D:function(){try{i.compressedTexImage2D.apply(i,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},compressedTexImage3D:function(){try{i.compressedTexImage3D.apply(i,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},texImage2D:function(){try{i.texImage2D.apply(i,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},texImage3D:function(){try{i.texImage3D.apply(i,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},updateUBOMapping:function(S,C){let F=o.get(C);F===void 0&&(F=new WeakMap,o.set(C,F));let se=F.get(S);se===void 0&&(se=i.getUniformBlockIndex(C,S.name),F.set(S,se))},uniformBlockBinding:function(S,C){let F=o.get(C).get(S);s.get(C)!==F&&(i.uniformBlockBinding(C,F,S.__bindingPointIndex),s.set(C,F))},texStorage2D:function(){try{i.texStorage2D.apply(i,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},texStorage3D:function(){try{i.texStorage3D.apply(i,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},texSubImage2D:function(){try{i.texSubImage2D.apply(i,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},texSubImage3D:function(){try{i.texSubImage3D.apply(i,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},compressedTexSubImage2D:function(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},compressedTexSubImage3D:function(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},scissor:function(S){z.equals(S)===!1&&(i.scissor(S.x,S.y,S.z,S.w),z.copy(S))},viewport:function(S){U.equals(S)===!1&&(i.viewport(S.x,S.y,S.z,S.w),U.copy(S))},reset:function(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),n.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),a={},ve=null,Pe={},l={},c=new WeakMap,h=[],u=null,d=!1,p=null,m=null,_=null,f=null,g=null,v=null,y=null,w=new mt(0,0,0),T=0,E=!1,V=null,W=null,H=null,$=null,ee=null,z.set(0,0,i.canvas.width,i.canvas.height),U.set(0,0,i.canvas.width,i.canvas.height),t.reset(),n.reset(),r.reset()}}}function ih(i,e,t,n){let r=(function(s){switch(s){case Di:case _h:return{byteLength:1,components:1};case es:case yh:case ps:return{byteLength:2,components:1};case jl:case Xl:return{byteLength:2,components:4};case Ki:case Wl:case vi:return{byteLength:4,components:1};case xh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)})(n);switch(t){case Mh:case Sh:return i*e;case wh:return i*e*2;case Eh:case ql:return i*e/r.components*r.byteLength;case Th:case Yl:return i*e*2/r.components*r.byteLength;case bh:return i*e*3/r.components*r.byteLength;case ri:case Zl:return i*e*4/r.components*r.byteLength;case js:case Xs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case qs:case Ys:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case So:case Eo:return Math.max(i,16)*Math.max(e,8)/4;case bo:case wo:return Math.max(i,8)*Math.max(e,8)/2;case To:case Ao:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ro:case Co:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Po:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Lo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Io:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Do:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Uo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case No:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Oo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Fo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Bo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case zo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case ko:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Vo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ho:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Zs:case Go:case Wo:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Ah:case jo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Xo:case qo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Tp(i,e,t,n,r,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator<"u"&&/OculusBrowser/g.test(navigator.userAgent),c=new Ce,h=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(b,M){return p?new OffscreenCanvas(b,M):$s("canvas")}function _(b,M,O){let L=1,A=G(b);if((A.width>O||A.height>O)&&(L=O/Math.max(A.width,A.height)),L<1){if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){let D=Math.floor(L*A.width),S=Math.floor(L*A.height);u===void 0&&(u=m(D,S));let C=M?m(D,S):u;return C.width=D,C.height=S,C.getContext("2d").drawImage(b,0,0,D,S),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+D+"x"+S+")."),C}return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),b}return b}function f(b){return b.generateMipmaps}function g(b){i.generateMipmap(b)}function v(b){return b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:b.isWebGL3DRenderTarget?i.TEXTURE_3D:b.isWebGLArrayRenderTarget||b.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(b,M,O,L,A=!1){if(b!==null){if(i[b]!==void 0)return i[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let D=M;if(M===i.RED&&(O===i.FLOAT&&(D=i.R32F),O===i.HALF_FLOAT&&(D=i.R16F),O===i.UNSIGNED_BYTE&&(D=i.R8)),M===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(D=i.R8UI),O===i.UNSIGNED_SHORT&&(D=i.R16UI),O===i.UNSIGNED_INT&&(D=i.R32UI),O===i.BYTE&&(D=i.R8I),O===i.SHORT&&(D=i.R16I),O===i.INT&&(D=i.R32I)),M===i.RG&&(O===i.FLOAT&&(D=i.RG32F),O===i.HALF_FLOAT&&(D=i.RG16F),O===i.UNSIGNED_BYTE&&(D=i.RG8)),M===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(D=i.RG8UI),O===i.UNSIGNED_SHORT&&(D=i.RG16UI),O===i.UNSIGNED_INT&&(D=i.RG32UI),O===i.BYTE&&(D=i.RG8I),O===i.SHORT&&(D=i.RG16I),O===i.INT&&(D=i.RG32I)),M===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(D=i.RGB8UI),O===i.UNSIGNED_SHORT&&(D=i.RGB16UI),O===i.UNSIGNED_INT&&(D=i.RGB32UI),O===i.BYTE&&(D=i.RGB8I),O===i.SHORT&&(D=i.RGB16I),O===i.INT&&(D=i.RGB32I)),M===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(D=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(D=i.RGBA16UI),O===i.UNSIGNED_INT&&(D=i.RGBA32UI),O===i.BYTE&&(D=i.RGBA8I),O===i.SHORT&&(D=i.RGBA16I),O===i.INT&&(D=i.RGBA32I)),M===i.RGB&&O===i.UNSIGNED_INT_5_9_9_9_REV&&(D=i.RGB9_E5),M===i.RGBA){let S=A?Sa:wt.getTransfer(L);O===i.FLOAT&&(D=i.RGBA32F),O===i.HALF_FLOAT&&(D=i.RGBA16F),O===i.UNSIGNED_BYTE&&(D=S===Ot?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(D=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(D=i.RGB5_A1)}return D!==i.R16F&&D!==i.R32F&&D!==i.RG16F&&D!==i.RG32F&&D!==i.RGBA16F&&D!==i.RGBA32F||e.get("EXT_color_buffer_float"),D}function w(b,M){let O;return b?M===null||M===Ki||M===Tr?O=i.DEPTH24_STENCIL8:M===vi?O=i.DEPTH32F_STENCIL8:M===es&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Ki||M===Tr?O=i.DEPTH_COMPONENT24:M===vi?O=i.DEPTH_COMPONENT32F:M===es&&(O=i.DEPTH_COMPONENT16),O}function T(b,M){return f(b)===!0||b.isFramebufferTexture&&b.minFilter!==Xn&&b.minFilter!==gi?Math.log2(Math.max(M.width,M.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?M.mipmaps.length:1}function E(b){let M=b.target;M.removeEventListener("dispose",E),(function(O){let L=n.get(O);if(L.__webglInit===void 0)return;let A=O.source,D=d.get(A);if(D){let S=D[L.__cacheKey];S.usedTimes--,S.usedTimes===0&&W(O),Object.keys(D).length===0&&d.delete(A)}n.remove(O)})(M),M.isVideoTexture&&h.delete(M)}function V(b){let M=b.target;M.removeEventListener("dispose",V),(function(O){let L=n.get(O);if(O.depthTexture&&(O.depthTexture.dispose(),n.remove(O.depthTexture)),O.isWebGLCubeRenderTarget)for(let D=0;D<6;D++){if(Array.isArray(L.__webglFramebuffer[D]))for(let S=0;S<L.__webglFramebuffer[D].length;S++)i.deleteFramebuffer(L.__webglFramebuffer[D][S]);else i.deleteFramebuffer(L.__webglFramebuffer[D]);L.__webglDepthbuffer&&i.deleteRenderbuffer(L.__webglDepthbuffer[D])}else{if(Array.isArray(L.__webglFramebuffer))for(let D=0;D<L.__webglFramebuffer.length;D++)i.deleteFramebuffer(L.__webglFramebuffer[D]);else i.deleteFramebuffer(L.__webglFramebuffer);if(L.__webglDepthbuffer&&i.deleteRenderbuffer(L.__webglDepthbuffer),L.__webglMultisampledFramebuffer&&i.deleteFramebuffer(L.__webglMultisampledFramebuffer),L.__webglColorRenderbuffer)for(let D=0;D<L.__webglColorRenderbuffer.length;D++)L.__webglColorRenderbuffer[D]&&i.deleteRenderbuffer(L.__webglColorRenderbuffer[D]);L.__webglDepthRenderbuffer&&i.deleteRenderbuffer(L.__webglDepthRenderbuffer)}let A=O.textures;for(let D=0,S=A.length;D<S;D++){let C=n.get(A[D]);C.__webglTexture&&(i.deleteTexture(C.__webglTexture),o.memory.textures--),n.remove(A[D])}n.remove(O)})(M)}function W(b){let M=n.get(b);i.deleteTexture(M.__webglTexture);let O=b.source;delete d.get(O)[M.__cacheKey],o.memory.textures--}let H=0;function $(b,M){let O=n.get(b);if(b.isVideoTexture&&(function(L){let A=o.render.frame;h.get(L)!==A&&(h.set(L,A),L.update())})(b),b.isRenderTargetTexture===!1&&b.version>0&&O.__version!==b.version){let L=b.image;if(L===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else{if(L.complete!==!1)return void ve(O,b,M);console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete")}}t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+M)}let ee={[$r]:i.REPEAT,[Qr]:i.CLAMP_TO_EDGE,[Mo]:i.MIRRORED_REPEAT},te={[Xn]:i.NEAREST,[Iu]:i.NEAREST_MIPMAP_NEAREST,[vs]:i.NEAREST_MIPMAP_LINEAR,[gi]:i.LINEAR,[Fa]:i.LINEAR_MIPMAP_NEAREST,[yr]:i.LINEAR_MIPMAP_LINEAR},oe={[Du]:i.NEVER,[ku]:i.ALWAYS,[Uu]:i.LESS,[Ou]:i.LEQUAL,[Nu]:i.EQUAL,[zu]:i.GEQUAL,[Fu]:i.GREATER,[Bu]:i.NOTEQUAL};function ne(b,M){if(M.type!==vi||e.has("OES_texture_float_linear")!==!1||M.magFilter!==gi&&M.magFilter!==Fa&&M.magFilter!==vs&&M.magFilter!==yr&&M.minFilter!==gi&&M.minFilter!==Fa&&M.minFilter!==vs&&M.minFilter!==yr||console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(b,i.TEXTURE_WRAP_S,ee[M.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,ee[M.wrapT]),b!==i.TEXTURE_3D&&b!==i.TEXTURE_2D_ARRAY||i.texParameteri(b,i.TEXTURE_WRAP_R,ee[M.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,te[M.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,te[M.minFilter]),M.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,oe[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Xn||M.minFilter!==vs&&M.minFilter!==yr||M.type===vi&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){let O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(b,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function ye(b,M){let O=!1;b.__webglInit===void 0&&(b.__webglInit=!0,M.addEventListener("dispose",E));let L=M.source,A=d.get(L);A===void 0&&(A={},d.set(L,A));let D=(function(S){let C=[];return C.push(S.wrapS),C.push(S.wrapT),C.push(S.wrapR||0),C.push(S.magFilter),C.push(S.minFilter),C.push(S.anisotropy),C.push(S.internalFormat),C.push(S.format),C.push(S.type),C.push(S.generateMipmaps),C.push(S.premultiplyAlpha),C.push(S.flipY),C.push(S.unpackAlignment),C.push(S.colorSpace),C.join()})(M);if(D!==b.__cacheKey){A[D]===void 0&&(A[D]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,O=!0),A[D].usedTimes++;let S=A[b.__cacheKey];S!==void 0&&(A[b.__cacheKey].usedTimes--,S.usedTimes===0&&W(M)),b.__cacheKey=D,b.__webglTexture=A[D].texture}return O}function ve(b,M,O){let L=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(L=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(L=i.TEXTURE_3D);let A=ye(b,M),D=M.source;t.bindTexture(L,b.__webglTexture,i.TEXTURE0+O);let S=n.get(D);if(D.version!==S.__version||A===!0){t.activeTexture(i.TEXTURE0+O);let C=wt.getPrimaries(wt.workingColorSpace),F=M.colorSpace===vr?null:wt.getPrimaries(M.colorSpace),se=M.colorSpace===vr||C===F?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,se);let j=_(M.image,!1,r.maxTextureSize);j=q(M,j);let ae=s.convert(M.format,M.colorSpace),ie=s.convert(M.type),he,Se=y(M.internalFormat,ae,ie,M.colorSpace,M.isVideoTexture);ne(L,M);let xe=M.mipmaps,ge=M.isVideoTexture!==!0,Le=S.__version===void 0||A===!0,ke=D.dataReady,We=T(M,j);if(M.isDepthTexture)Se=w(M.format===Ar,M.type),Le&&(ge?t.texStorage2D(i.TEXTURE_2D,1,Se,j.width,j.height):t.texImage2D(i.TEXTURE_2D,0,Se,j.width,j.height,0,ae,ie,null));else if(M.isDataTexture)if(xe.length>0){ge&&Le&&t.texStorage2D(i.TEXTURE_2D,We,Se,xe[0].width,xe[0].height);for(let ze=0,nt=xe.length;ze<nt;ze++)he=xe[ze],ge?ke&&t.texSubImage2D(i.TEXTURE_2D,ze,0,0,he.width,he.height,ae,ie,he.data):t.texImage2D(i.TEXTURE_2D,ze,Se,he.width,he.height,0,ae,ie,he.data);M.generateMipmaps=!1}else ge?(Le&&t.texStorage2D(i.TEXTURE_2D,We,Se,j.width,j.height),ke&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,j.width,j.height,ae,ie,j.data)):t.texImage2D(i.TEXTURE_2D,0,Se,j.width,j.height,0,ae,ie,j.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){ge&&Le&&t.texStorage3D(i.TEXTURE_2D_ARRAY,We,Se,xe[0].width,xe[0].height,j.depth);for(let ze=0,nt=xe.length;ze<nt;ze++)if(he=xe[ze],M.format!==ri)if(ae!==null)if(ge){if(ke)if(M.layerUpdates.size>0){let Be=ih(he.width,he.height,M.format,M.type);for(let gt of M.layerUpdates){let qe=he.data.subarray(gt*Be/he.data.BYTES_PER_ELEMENT,(gt+1)*Be/he.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ze,0,0,gt,he.width,he.height,1,ae,qe)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ze,0,0,0,he.width,he.height,j.depth,ae,he.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ze,Se,he.width,he.height,j.depth,0,he.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ge?ke&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ze,0,0,0,he.width,he.height,j.depth,ae,ie,he.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ze,Se,he.width,he.height,j.depth,0,ae,ie,he.data)}else{ge&&Le&&t.texStorage2D(i.TEXTURE_2D,We,Se,xe[0].width,xe[0].height);for(let ze=0,nt=xe.length;ze<nt;ze++)he=xe[ze],M.format!==ri?ae!==null?ge?ke&&t.compressedTexSubImage2D(i.TEXTURE_2D,ze,0,0,he.width,he.height,ae,he.data):t.compressedTexImage2D(i.TEXTURE_2D,ze,Se,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ge?ke&&t.texSubImage2D(i.TEXTURE_2D,ze,0,0,he.width,he.height,ae,ie,he.data):t.texImage2D(i.TEXTURE_2D,ze,Se,he.width,he.height,0,ae,ie,he.data)}else if(M.isDataArrayTexture)if(ge){if(Le&&t.texStorage3D(i.TEXTURE_2D_ARRAY,We,Se,j.width,j.height,j.depth),ke)if(M.layerUpdates.size>0){let ze=ih(j.width,j.height,M.format,M.type);for(let nt of M.layerUpdates){let Be=j.data.subarray(nt*ze/j.data.BYTES_PER_ELEMENT,(nt+1)*ze/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,nt,j.width,j.height,1,ae,ie,Be)}M.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,ae,ie,j.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Se,j.width,j.height,j.depth,0,ae,ie,j.data);else if(M.isData3DTexture)ge?(Le&&t.texStorage3D(i.TEXTURE_3D,We,Se,j.width,j.height,j.depth),ke&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,ae,ie,j.data)):t.texImage3D(i.TEXTURE_3D,0,Se,j.width,j.height,j.depth,0,ae,ie,j.data);else if(M.isFramebufferTexture){if(Le)if(ge)t.texStorage2D(i.TEXTURE_2D,We,Se,j.width,j.height);else{let ze=j.width,nt=j.height;for(let Be=0;Be<We;Be++)t.texImage2D(i.TEXTURE_2D,Be,Se,ze,nt,0,ae,ie,null),ze>>=1,nt>>=1}}else if(xe.length>0){if(ge&&Le){let ze=G(xe[0]);t.texStorage2D(i.TEXTURE_2D,We,Se,ze.width,ze.height)}for(let ze=0,nt=xe.length;ze<nt;ze++)he=xe[ze],ge?ke&&t.texSubImage2D(i.TEXTURE_2D,ze,0,0,ae,ie,he):t.texImage2D(i.TEXTURE_2D,ze,Se,ae,ie,he);M.generateMipmaps=!1}else if(ge){if(Le){let ze=G(j);t.texStorage2D(i.TEXTURE_2D,We,Se,ze.width,ze.height)}ke&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ae,ie,j)}else t.texImage2D(i.TEXTURE_2D,0,Se,ae,ie,j);f(M)&&g(L),S.__version=D.version,M.onUpdate&&M.onUpdate(M)}b.__version=M.version}function Pe(b,M,O,L,A,D){let S=s.convert(O.format,O.colorSpace),C=s.convert(O.type),F=y(O.internalFormat,S,C,O.colorSpace),se=n.get(M),j=n.get(O);if(j.__renderTarget=M,!se.__hasExternalTextures){let ae=Math.max(1,M.width>>D),ie=Math.max(1,M.height>>D);A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY?t.texImage3D(A,D,F,ae,ie,M.depth,0,S,C,null):t.texImage2D(A,D,F,ae,ie,0,S,C,null)}t.bindFramebuffer(i.FRAMEBUFFER,b),K(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,L,A,j.__webglTexture,0,P(M)):(A===i.TEXTURE_2D||A>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&A<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,L,A,j.__webglTexture,D),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ae(b,M,O){if(i.bindRenderbuffer(i.RENDERBUFFER,b),M.depthBuffer){let L=M.depthTexture,A=L&&L.isDepthTexture?L.type:null,D=w(M.stencilBuffer,A),S=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,C=P(M);K(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,C,D,M.width,M.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,C,D,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,D,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,S,i.RENDERBUFFER,b)}else{let L=M.textures;for(let A=0;A<L.length;A++){let D=L[A],S=s.convert(D.format,D.colorSpace),C=s.convert(D.type),F=y(D.internalFormat,S,C,D.colorSpace),se=P(M);O&&K(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,se,F,M.width,M.height):K(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,se,F,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,F,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function tt(b){let M=n.get(b),O=b.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==b.depthTexture){let L=b.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),L){let A=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,L.removeEventListener("dispose",A)};L.addEventListener("dispose",A),M.__depthDisposeCallback=A}M.__boundDepthTexture=L}if(b.depthTexture&&!M.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");(function(L,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,L),!A.depthTexture||!A.depthTexture.isDepthTexture)throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let D=n.get(A.depthTexture);D.__renderTarget=A,D.__webglTexture&&A.depthTexture.image.width===A.width&&A.depthTexture.image.height===A.height||(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),$(A.depthTexture,0);let S=D.__webglTexture,C=P(A);if(A.depthTexture.format===ts)K(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,S,0,C):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,S,0);else{if(A.depthTexture.format!==Ar)throw new Error("Unknown depthTexture format");K(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,S,0,C):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,S,0)}})(M.__webglFramebuffer,b)}else if(O){M.__webglDepthbuffer=[];for(let L=0;L<6;L++)if(t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[L]),M.__webglDepthbuffer[L]===void 0)M.__webglDepthbuffer[L]=i.createRenderbuffer(),Ae(M.__webglDepthbuffer[L],b,!1);else{let A=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,D=M.__webglDepthbuffer[L];i.bindRenderbuffer(i.RENDERBUFFER,D),i.framebufferRenderbuffer(i.FRAMEBUFFER,A,i.RENDERBUFFER,D)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),Ae(M.__webglDepthbuffer,b,!1);else{let L=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,A=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,A),i.framebufferRenderbuffer(i.FRAMEBUFFER,L,i.RENDERBUFFER,A)}t.bindFramebuffer(i.FRAMEBUFFER,null)}let z=[],U=[];function P(b){return Math.min(r.maxSamples,b.samples)}function K(b){let M=n.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function q(b,M){let O=b.colorSpace,L=b.format,A=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||O!==Ur&&O!==vr&&(wt.getTransfer(O)===Ot?L===ri&&A===Di||console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),M}function G(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(c.width=b.naturalWidth||b.width,c.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(c.width=b.displayWidth,c.height=b.displayHeight):(c.width=b.width,c.height=b.height),c}this.allocateTextureUnit=function(){let b=H;return b>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+r.maxTextures),H+=1,b},this.resetTextureUnits=function(){H=0},this.setTexture2D=$,this.setTexture2DArray=function(b,M){let O=n.get(b);b.version>0&&O.__version!==b.version?ve(O,b,M):t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+M)},this.setTexture3D=function(b,M){let O=n.get(b);b.version>0&&O.__version!==b.version?ve(O,b,M):t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+M)},this.setTextureCube=function(b,M){let O=n.get(b);b.version>0&&O.__version!==b.version?(function(L,A,D){if(A.image.length!==6)return;let S=ye(L,A),C=A.source;t.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+D);let F=n.get(C);if(C.version!==F.__version||S===!0){t.activeTexture(i.TEXTURE0+D);let se=wt.getPrimaries(wt.workingColorSpace),j=A.colorSpace===vr?null:wt.getPrimaries(A.colorSpace),ae=A.colorSpace===vr||se===j?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ae);let ie=A.isCompressedTexture||A.image[0].isCompressedTexture,he=A.image[0]&&A.image[0].isDataTexture,Se=[];for(let qe=0;qe<6;qe++)Se[qe]=ie||he?he?A.image[qe].image:A.image[qe]:_(A.image[qe],!0,r.maxCubemapSize),Se[qe]=q(A,Se[qe]);let xe=Se[0],ge=s.convert(A.format,A.colorSpace),Le=s.convert(A.type),ke=y(A.internalFormat,ge,Le,A.colorSpace),We=A.isVideoTexture!==!0,ze=F.__version===void 0||S===!0,nt=C.dataReady,Be,gt=T(A,xe);if(ne(i.TEXTURE_CUBE_MAP,A),ie){We&&ze&&t.texStorage2D(i.TEXTURE_CUBE_MAP,gt,ke,xe.width,xe.height);for(let qe=0;qe<6;qe++){Be=Se[qe].mipmaps;for(let Qe=0;Qe<Be.length;Qe++){let ut=Be[Qe];A.format!==ri?ge!==null?We?nt&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+qe,Qe,0,0,ut.width,ut.height,ge,ut.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+qe,Qe,ke,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):We?nt&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+qe,Qe,0,0,ut.width,ut.height,ge,Le,ut.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+qe,Qe,ke,ut.width,ut.height,0,ge,Le,ut.data)}}}else{if(Be=A.mipmaps,We&&ze){Be.length>0&&gt++;let qe=G(Se[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,gt,ke,qe.width,qe.height)}for(let qe=0;qe<6;qe++)if(he){We?nt&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+qe,0,0,0,Se[qe].width,Se[qe].height,ge,Le,Se[qe].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+qe,0,ke,Se[qe].width,Se[qe].height,0,ge,Le,Se[qe].data);for(let Qe=0;Qe<Be.length;Qe++){let ut=Be[Qe].image[qe].image;We?nt&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+qe,Qe+1,0,0,ut.width,ut.height,ge,Le,ut.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+qe,Qe+1,ke,ut.width,ut.height,0,ge,Le,ut.data)}}else{We?nt&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+qe,0,0,0,ge,Le,Se[qe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+qe,0,ke,ge,Le,Se[qe]);for(let Qe=0;Qe<Be.length;Qe++){let ut=Be[Qe];We?nt&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+qe,Qe+1,0,0,ge,Le,ut.image[qe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+qe,Qe+1,ke,ge,Le,ut.image[qe])}}}f(A)&&g(i.TEXTURE_CUBE_MAP),F.__version=C.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version})(O,b,M):t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+M)},this.rebindTextures=function(b,M,O){let L=n.get(b);M!==void 0&&Pe(L.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&tt(b)},this.setupRenderTarget=function(b){let M=b.texture,O=n.get(b),L=n.get(M);b.addEventListener("dispose",V);let A=b.textures,D=b.isWebGLCubeRenderTarget===!0,S=A.length>1;if(S||(L.__webglTexture===void 0&&(L.__webglTexture=i.createTexture()),L.__version=M.version,o.memory.textures++),D){O.__webglFramebuffer=[];for(let C=0;C<6;C++)if(M.mipmaps&&M.mipmaps.length>0){O.__webglFramebuffer[C]=[];for(let F=0;F<M.mipmaps.length;F++)O.__webglFramebuffer[C][F]=i.createFramebuffer()}else O.__webglFramebuffer[C]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){O.__webglFramebuffer=[];for(let C=0;C<M.mipmaps.length;C++)O.__webglFramebuffer[C]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(S)for(let C=0,F=A.length;C<F;C++){let se=n.get(A[C]);se.__webglTexture===void 0&&(se.__webglTexture=i.createTexture(),o.memory.textures++)}if(b.samples>0&&K(b)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let C=0;C<A.length;C++){let F=A[C];O.__webglColorRenderbuffer[C]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[C]);let se=s.convert(F.format,F.colorSpace),j=s.convert(F.type),ae=y(F.internalFormat,se,j,F.colorSpace,b.isXRRenderTarget===!0),ie=P(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,ie,ae,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+C,i.RENDERBUFFER,O.__webglColorRenderbuffer[C])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Ae(O.__webglDepthRenderbuffer,b,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(D){t.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture),ne(i.TEXTURE_CUBE_MAP,M);for(let C=0;C<6;C++)if(M.mipmaps&&M.mipmaps.length>0)for(let F=0;F<M.mipmaps.length;F++)Pe(O.__webglFramebuffer[C][F],b,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+C,F);else Pe(O.__webglFramebuffer[C],b,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+C,0);f(M)&&g(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(S){for(let C=0,F=A.length;C<F;C++){let se=A[C],j=n.get(se);t.bindTexture(i.TEXTURE_2D,j.__webglTexture),ne(i.TEXTURE_2D,se),Pe(O.__webglFramebuffer,b,se,i.COLOR_ATTACHMENT0+C,i.TEXTURE_2D,0),f(se)&&g(i.TEXTURE_2D)}t.unbindTexture()}else{let C=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(C=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(C,L.__webglTexture),ne(C,M),M.mipmaps&&M.mipmaps.length>0)for(let F=0;F<M.mipmaps.length;F++)Pe(O.__webglFramebuffer[F],b,M,i.COLOR_ATTACHMENT0,C,F);else Pe(O.__webglFramebuffer,b,M,i.COLOR_ATTACHMENT0,C,0);f(M)&&g(C),t.unbindTexture()}b.depthBuffer&&tt(b)},this.updateRenderTargetMipmap=function(b){let M=b.textures;for(let O=0,L=M.length;O<L;O++){let A=M[O];if(f(A)){let D=v(b),S=n.get(A).__webglTexture;t.bindTexture(D,S),g(D),t.unbindTexture()}}},this.updateMultisampleRenderTarget=function(b){if(b.samples>0){if(K(b)===!1){let M=b.textures,O=b.width,L=b.height,A=i.COLOR_BUFFER_BIT,D=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,S=n.get(b),C=M.length>1;if(C)for(let F=0;F<M.length;F++)t.bindFramebuffer(i.FRAMEBUFFER,S.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+F,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+F,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,S.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,S.__webglFramebuffer);for(let F=0;F<M.length;F++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(A|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(A|=i.STENCIL_BUFFER_BIT)),C){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,S.__webglColorRenderbuffer[F]);let se=n.get(M[F]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,se,0)}i.blitFramebuffer(0,0,O,L,0,0,O,L,A,i.NEAREST),l===!0&&(z.length=0,U.length=0,z.push(i.COLOR_ATTACHMENT0+F),b.depthBuffer&&b.resolveDepthBuffer===!1&&(z.push(D),U.push(D),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,U)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,z))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),C)for(let F=0;F<M.length;F++){t.bindFramebuffer(i.FRAMEBUFFER,S.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+F,i.RENDERBUFFER,S.__webglColorRenderbuffer[F]);let se=n.get(M[F]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+F,i.TEXTURE_2D,se,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,S.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){let M=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}},this.setupDepthRenderbuffer=tt,this.setupFrameBufferTexture=Pe,this.useMultisampledRTT=K}function Ap(i,e){return{convert:function(t,n=""){let r,s=wt.getTransfer(n);if(t===Di)return i.UNSIGNED_BYTE;if(t===jl)return i.UNSIGNED_SHORT_4_4_4_4;if(t===Xl)return i.UNSIGNED_SHORT_5_5_5_1;if(t===xh)return i.UNSIGNED_INT_5_9_9_9_REV;if(t===_h)return i.BYTE;if(t===yh)return i.SHORT;if(t===es)return i.UNSIGNED_SHORT;if(t===Wl)return i.INT;if(t===Ki)return i.UNSIGNED_INT;if(t===vi)return i.FLOAT;if(t===ps)return i.HALF_FLOAT;if(t===Mh)return i.ALPHA;if(t===bh)return i.RGB;if(t===ri)return i.RGBA;if(t===Sh)return i.LUMINANCE;if(t===wh)return i.LUMINANCE_ALPHA;if(t===ts)return i.DEPTH_COMPONENT;if(t===Ar)return i.DEPTH_STENCIL;if(t===Eh)return i.RED;if(t===ql)return i.RED_INTEGER;if(t===Th)return i.RG;if(t===Yl)return i.RG_INTEGER;if(t===Zl)return i.RGBA_INTEGER;if(t===js||t===Xs||t===qs||t===Ys)if(s===Ot){if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r===null)return null;if(t===js)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(t===Xs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(t===qs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(t===Ys)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else{if(r=e.get("WEBGL_compressed_texture_s3tc"),r===null)return null;if(t===js)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(t===Xs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(t===qs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(t===Ys)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}if(t===bo||t===So||t===wo||t===Eo){if(r=e.get("WEBGL_compressed_texture_pvrtc"),r===null)return null;if(t===bo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(t===So)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(t===wo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(t===Eo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}if(t===To||t===Ao||t===Ro){if(r=e.get("WEBGL_compressed_texture_etc"),r===null)return null;if(t===To||t===Ao)return s===Ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(t===Ro)return s===Ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}if(t===Co||t===Po||t===Lo||t===Io||t===Do||t===Uo||t===No||t===Oo||t===Fo||t===Bo||t===zo||t===ko||t===Vo||t===Ho){if(r=e.get("WEBGL_compressed_texture_astc"),r===null)return null;if(t===Co)return s===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(t===Po)return s===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(t===Lo)return s===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(t===Io)return s===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(t===Do)return s===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(t===Uo)return s===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(t===No)return s===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(t===Oo)return s===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(t===Fo)return s===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(t===Bo)return s===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(t===zo)return s===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(t===ko)return s===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(t===Vo)return s===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(t===Ho)return s===Ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}if(t===Zs||t===Go||t===Wo){if(r=e.get("EXT_texture_compression_bptc"),r===null)return null;if(t===Zs)return s===Ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(t===Go)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(t===Wo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}if(t===Ah||t===jo||t===Xo||t===qo){if(r=e.get("EXT_texture_compression_rgtc"),r===null)return null;if(t===Zs)return r.COMPRESSED_RED_RGTC1_EXT;if(t===jo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(t===Xo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(t===qo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}return t===Tr?i.UNSIGNED_INT_24_8:i[t]!==void 0?i[t]:null}}}var cl=class extends An{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},si=class extends qn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Rp={type:"move"},Zr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new si,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new si,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new si,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let f=t.getJointPose(_,n),g=this._getHandJoint(c,_);f!==null&&(g.matrix.fromArray(f.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=f.radius),g.visible=f!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,m=.005;c.inputState.pinching&&d>p+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Rp)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new si;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},hl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let r=new Nn;e.properties.get(r).__webglTexture=t.texture,t.depthNear==n.depthNear&&t.depthFar==n.depthFar||(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Rn({vertexShader:`
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

}`,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Jt(new Ui(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},ul=class extends yi{constructor(e,t){super();let n=this,r=null,s=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,m=null,_=new hl,f=t.getContextAttributes(),g=null,v=null,y=[],w=[],T=new Ce,E=null,V=new An;V.viewport=new Ht;let W=new An;W.viewport=new Ht;let H=[V,W],$=new cl,ee=null,te=null;function oe(U){let P=w.indexOf(U.inputSource);if(P===-1)return;let K=y[P];K!==void 0&&(K.update(U.inputSource,U.frame,c||o),K.dispatchEvent({type:U.type,data:U.inputSource}))}function ne(){r.removeEventListener("select",oe),r.removeEventListener("selectstart",oe),r.removeEventListener("selectend",oe),r.removeEventListener("squeeze",oe),r.removeEventListener("squeezestart",oe),r.removeEventListener("squeezeend",oe),r.removeEventListener("end",ne),r.removeEventListener("inputsourceschange",ye);for(let U=0;U<y.length;U++){let P=w[U];P!==null&&(w[U]=null,y[U].disconnect(P))}ee=null,te=null,_.reset(),e.setRenderTarget(g),p=null,d=null,u=null,r=null,v=null,z.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}function ye(U){for(let P=0;P<U.removed.length;P++){let K=U.removed[P],q=w.indexOf(K);q>=0&&(w[q]=null,y[q].disconnect(K))}for(let P=0;P<U.added.length;P++){let K=U.added[P],q=w.indexOf(K);if(q===-1){for(let b=0;b<y.length;b++){if(b>=w.length){w.push(K),q=b;break}if(w[b]===null){w[b]=K,q=b;break}}if(q===-1)break}let G=y[q];G&&G.connect(K)}}this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let P=y[U];return P===void 0&&(P=new Zr,y[U]=P),P.getTargetRaySpace()},this.getControllerGrip=function(U){let P=y[U];return P===void 0&&(P=new Zr,y[U]=P),P.getGripSpace()},this.getHand=function(U){let P=y[U];return P===void 0&&(P=new Zr,y[U]=P),P.getHandSpace()},this.setFramebufferScaleFactor=function(U){s=U,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){a=U,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(U){c=U},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(U){if(r=U,r!==null){if(g=e.getRenderTarget(),r.addEventListener("select",oe),r.addEventListener("selectstart",oe),r.addEventListener("selectend",oe),r.addEventListener("squeeze",oe),r.addEventListener("squeezestart",oe),r.addEventListener("squeezeend",oe),r.addEventListener("end",ne),r.addEventListener("inputsourceschange",ye),f.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(T),r.renderState.layers===void 0){let P={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,P),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new Bn(p.framebufferWidth,p.framebufferHeight,{format:ri,type:Di,colorSpace:e.outputColorSpace,stencilBuffer:f.stencil})}else{let P=null,K=null,q=null;f.depth&&(q=f.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,P=f.stencil?Ar:ts,K=f.stencil?Tr:Ki);let G={colorFormat:t.RGBA8,depthFormat:q,scaleFactor:s};u=new XRWebGLBinding(r,t),d=u.createProjectionLayer(G),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new Bn(d.textureWidth,d.textureHeight,{format:ri,type:Di,depthTexture:new sa(d.textureWidth,d.textureHeight,K,void 0,void 0,void 0,void 0,void 0,void 0,P),stencilBuffer:f.stencil,colorSpace:e.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),z.setContext(r),z.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};let ve=new B,Pe=new B;function Ae(U,P){P===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(P.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(r===null)return;let P=U.near,K=U.far;_.texture!==null&&(_.depthNear>0&&(P=_.depthNear),_.depthFar>0&&(K=_.depthFar)),$.near=W.near=V.near=P,$.far=W.far=V.far=K,ee===$.near&&te===$.far||(r.updateRenderState({depthNear:$.near,depthFar:$.far}),ee=$.near,te=$.far),V.layers.mask=2|U.layers.mask,W.layers.mask=4|U.layers.mask,$.layers.mask=V.layers.mask|W.layers.mask;let q=U.parent,G=$.cameras;Ae($,q);for(let b=0;b<G.length;b++)Ae(G[b],q);G.length===2?(function(b,M,O){ve.setFromMatrixPosition(M.matrixWorld),Pe.setFromMatrixPosition(O.matrixWorld);let L=ve.distanceTo(Pe),A=M.projectionMatrix.elements,D=O.projectionMatrix.elements,S=A[14]/(A[10]-1),C=A[14]/(A[10]+1),F=(A[9]+1)/A[5],se=(A[9]-1)/A[5],j=(A[8]-1)/A[0],ae=(D[8]+1)/D[0],ie=S*j,he=S*ae,Se=L/(-j+ae),xe=Se*-j;if(M.matrixWorld.decompose(b.position,b.quaternion,b.scale),b.translateX(xe),b.translateZ(Se),b.matrixWorld.compose(b.position,b.quaternion,b.scale),b.matrixWorldInverse.copy(b.matrixWorld).invert(),A[10]===-1)b.projectionMatrix.copy(M.projectionMatrix),b.projectionMatrixInverse.copy(M.projectionMatrixInverse);else{let ge=S+Se,Le=C+Se,ke=ie-xe,We=he+(L-xe),ze=F*C/Le*ge,nt=se*C/Le*ge;b.projectionMatrix.makePerspective(ke,We,ze,nt,ge,Le),b.projectionMatrixInverse.copy(b.projectionMatrix).invert()}})($,V,W):$.projectionMatrix.copy(V.projectionMatrix),(function(b,M,O){O===null?b.matrix.copy(M.matrixWorld):(b.matrix.copy(O.matrixWorld),b.matrix.invert(),b.matrix.multiply(M.matrixWorld)),b.matrix.decompose(b.position,b.quaternion,b.scale),b.updateMatrixWorld(!0),b.projectionMatrix.copy(M.projectionMatrix),b.projectionMatrixInverse.copy(M.projectionMatrixInverse),b.isPerspectiveCamera&&(b.fov=2*ns*Math.atan(1/b.projectionMatrix.elements[5]),b.zoom=1)})(U,$,q)},this.getCamera=function(){return $},this.getFoveation=function(){if(d!==null||p!==null)return l},this.setFoveation=function(U){l=U,d!==null&&(d.fixedFoveation=U),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=U)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh($)};let tt=null,z=new Lh;z.setAnimationLoop((function(U,P){if(h=P.getViewerPose(c||o),m=P,h!==null){let K=h.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let q=!1;K.length!==$.cameras.length&&($.cameras.length=0,q=!0);for(let b=0;b<K.length;b++){let M=K[b],O=null;if(p!==null)O=p.getViewport(M);else{let A=u.getViewSubImage(d,M);O=A.viewport,b===0&&(e.setRenderTargetTextures(v,A.colorTexture,d.ignoreDepthValues?void 0:A.depthStencilTexture),e.setRenderTarget(v))}let L=H[b];L===void 0&&(L=new An,L.layers.enable(b),L.viewport=new Ht,H[b]=L),L.matrix.fromArray(M.transform.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale),L.projectionMatrix.fromArray(M.projectionMatrix),L.projectionMatrixInverse.copy(L.projectionMatrix).invert(),L.viewport.set(O.x,O.y,O.width,O.height),b===0&&($.matrix.copy(L.matrix),$.matrix.decompose($.position,$.quaternion,$.scale)),q===!0&&$.cameras.push(L)}let G=r.enabledFeatures;if(G&&G.includes("depth-sensing")){let b=u.getDepthInformation(K[0]);b&&b.isValid&&b.texture&&_.init(e,b,r.renderState)}}for(let K=0;K<y.length;K++){let q=w[K],G=y[K];q!==null&&G!==void 0&&G.update(q,P,c||o)}tt&&tt(U,P),P.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:P}),m=null})),this.setAnimationLoop=function(U){tt=U},this.dispose=function(){}}},ji=new oi,Cp=new ht;function Pp(i,e){function t(r,s){r.matrixAutoUpdate===!0&&r.updateMatrix(),s.value.copy(r.matrix)}function n(r,s){r.opacity.value=s.opacity,s.color&&r.diffuse.value.copy(s.color),s.emissive&&r.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity),s.map&&(r.map.value=s.map,t(s.map,r.mapTransform)),s.alphaMap&&(r.alphaMap.value=s.alphaMap,t(s.alphaMap,r.alphaMapTransform)),s.bumpMap&&(r.bumpMap.value=s.bumpMap,t(s.bumpMap,r.bumpMapTransform),r.bumpScale.value=s.bumpScale,s.side===1&&(r.bumpScale.value*=-1)),s.normalMap&&(r.normalMap.value=s.normalMap,t(s.normalMap,r.normalMapTransform),r.normalScale.value.copy(s.normalScale),s.side===1&&r.normalScale.value.negate()),s.displacementMap&&(r.displacementMap.value=s.displacementMap,t(s.displacementMap,r.displacementMapTransform),r.displacementScale.value=s.displacementScale,r.displacementBias.value=s.displacementBias),s.emissiveMap&&(r.emissiveMap.value=s.emissiveMap,t(s.emissiveMap,r.emissiveMapTransform)),s.specularMap&&(r.specularMap.value=s.specularMap,t(s.specularMap,r.specularMapTransform)),s.alphaTest>0&&(r.alphaTest.value=s.alphaTest);let o=e.get(s),a=o.envMap,l=o.envMapRotation;a&&(r.envMap.value=a,ji.copy(l),ji.x*=-1,ji.y*=-1,ji.z*=-1,a.isCubeTexture&&a.isRenderTargetTexture===!1&&(ji.y*=-1,ji.z*=-1),r.envMapRotation.value.setFromMatrix4(Cp.makeRotationFromEuler(ji)),r.flipEnvMap.value=a.isCubeTexture&&a.isRenderTargetTexture===!1?-1:1,r.reflectivity.value=s.reflectivity,r.ior.value=s.ior,r.refractionRatio.value=s.refractionRatio),s.lightMap&&(r.lightMap.value=s.lightMap,r.lightMapIntensity.value=s.lightMapIntensity,t(s.lightMap,r.lightMapTransform)),s.aoMap&&(r.aoMap.value=s.aoMap,r.aoMapIntensity.value=s.aoMapIntensity,t(s.aoMap,r.aoMapTransform))}return{refreshFogUniforms:function(r,s){s.color.getRGB(r.fogColor.value,Ph(i)),s.isFog?(r.fogNear.value=s.near,r.fogFar.value=s.far):s.isFogExp2&&(r.fogDensity.value=s.density)},refreshMaterialUniforms:function(r,s,o,a,l){s.isMeshBasicMaterial||s.isMeshLambertMaterial?n(r,s):s.isMeshToonMaterial?(n(r,s),(function(c,h){h.gradientMap&&(c.gradientMap.value=h.gradientMap)})(r,s)):s.isMeshPhongMaterial?(n(r,s),(function(c,h){c.specular.value.copy(h.specular),c.shininess.value=Math.max(h.shininess,1e-4)})(r,s)):s.isMeshStandardMaterial?(n(r,s),(function(c,h){c.metalness.value=h.metalness,h.metalnessMap&&(c.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,c.metalnessMapTransform)),c.roughness.value=h.roughness,h.roughnessMap&&(c.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,c.roughnessMapTransform)),h.envMap&&(c.envMapIntensity.value=h.envMapIntensity)})(r,s),s.isMeshPhysicalMaterial&&(function(c,h,u){c.ior.value=h.ior,h.sheen>0&&(c.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),c.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(c.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,c.sheenColorMapTransform)),h.sheenRoughnessMap&&(c.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,c.sheenRoughnessMapTransform))),h.clearcoat>0&&(c.clearcoat.value=h.clearcoat,c.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(c.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,c.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(c.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,c.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(c.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,c.clearcoatNormalMapTransform),c.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===1&&c.clearcoatNormalScale.value.negate())),h.dispersion>0&&(c.dispersion.value=h.dispersion),h.iridescence>0&&(c.iridescence.value=h.iridescence,c.iridescenceIOR.value=h.iridescenceIOR,c.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],c.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(c.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,c.iridescenceMapTransform)),h.iridescenceThicknessMap&&(c.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,c.iridescenceThicknessMapTransform))),h.transmission>0&&(c.transmission.value=h.transmission,c.transmissionSamplerMap.value=u.texture,c.transmissionSamplerSize.value.set(u.width,u.height),h.transmissionMap&&(c.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,c.transmissionMapTransform)),c.thickness.value=h.thickness,h.thicknessMap&&(c.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,c.thicknessMapTransform)),c.attenuationDistance.value=h.attenuationDistance,c.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(c.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(c.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,c.anisotropyMapTransform))),c.specularIntensity.value=h.specularIntensity,c.specularColor.value.copy(h.specularColor),h.specularColorMap&&(c.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,c.specularColorMapTransform)),h.specularIntensityMap&&(c.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,c.specularIntensityMapTransform))})(r,s,l)):s.isMeshMatcapMaterial?(n(r,s),(function(c,h){h.matcap&&(c.matcap.value=h.matcap)})(r,s)):s.isMeshDepthMaterial?n(r,s):s.isMeshDistanceMaterial?(n(r,s),(function(c,h){let u=e.get(h).light;c.referencePosition.value.setFromMatrixPosition(u.matrixWorld),c.nearDistance.value=u.shadow.camera.near,c.farDistance.value=u.shadow.camera.far})(r,s)):s.isMeshNormalMaterial?n(r,s):s.isLineBasicMaterial?((function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform))})(r,s),s.isLineDashedMaterial&&(function(c,h){c.dashSize.value=h.dashSize,c.totalSize.value=h.dashSize+h.gapSize,c.scale.value=h.scale})(r,s)):s.isPointsMaterial?(function(c,h,u,d){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.size.value=h.size*u,c.scale.value=.5*d,h.map&&(c.map.value=h.map,t(h.map,c.uvTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)})(r,s,o,a):s.isSpriteMaterial?(function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.rotation.value=h.rotation,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)})(r,s):s.isShadowMaterial?(r.color.value.copy(s.color),r.opacity.value=s.opacity):s.isShaderMaterial&&(s.uniformsNeedUpdate=!1)}}}function Lp(i,e,t,n){let r={},s={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(u,d,p,m){let _=u.value,f=d+"_"+p;if(m[f]===void 0)return m[f]=typeof _=="number"||typeof _=="boolean"?_:_.clone(),!0;{let g=m[f];if(typeof _=="number"||typeof _=="boolean"){if(g!==_)return m[f]=_,!0}else if(g.equals(_)===!1)return g.copy(_),!0}return!1}function c(u){let d={boundary:0,storage:0};return typeof u=="number"||typeof u=="boolean"?(d.boundary=4,d.storage=4):u.isVector2?(d.boundary=8,d.storage=8):u.isVector3||u.isColor?(d.boundary=16,d.storage=12):u.isVector4?(d.boundary=16,d.storage=16):u.isMatrix3?(d.boundary=48,d.storage=48):u.isMatrix4?(d.boundary=64,d.storage=64):u.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",u),d}function h(u){let d=u.target;d.removeEventListener("dispose",h);let p=o.indexOf(d.__bindingPointIndex);o.splice(p,1),i.deleteBuffer(r[d.id]),delete r[d.id],delete s[d.id]}return{bind:function(u,d){let p=d.program;n.uniformBlockBinding(u,p)},update:function(u,d){let p=r[u.id];p===void 0&&((function(f){let g=f.uniforms,v=0,y=16;for(let T=0,E=g.length;T<E;T++){let V=Array.isArray(g[T])?g[T]:[g[T]];for(let W=0,H=V.length;W<H;W++){let $=V[W],ee=Array.isArray($.value)?$.value:[$.value];for(let te=0,oe=ee.length;te<oe;te++){let ne=c(ee[te]),ye=v%y,ve=ye%ne.boundary,Pe=ye+ve;v+=ve,Pe!==0&&y-Pe<ne.storage&&(v+=y-Pe),$.__data=new Float32Array(ne.storage/Float32Array.BYTES_PER_ELEMENT),$.__offset=v,v+=ne.storage}}}let w=v%y;w>0&&(v+=y-w),f.__size=v,f.__cache={}})(u),p=(function(f){let g=(function(){for(let T=0;T<a;T++)if(o.indexOf(T)===-1)return o.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0})();f.__bindingPointIndex=g;let v=i.createBuffer(),y=f.__size,w=f.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,y,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,g,v),v})(u),r[u.id]=p,u.addEventListener("dispose",h));let m=d.program;n.updateUBOMapping(u,m);let _=e.render.frame;s[u.id]!==_&&((function(f){let g=r[f.id],v=f.uniforms,y=f.__cache;i.bindBuffer(i.UNIFORM_BUFFER,g);for(let w=0,T=v.length;w<T;w++){let E=Array.isArray(v[w])?v[w]:[v[w]];for(let V=0,W=E.length;V<W;V++){let H=E[V];if(l(H,w,V,y)===!0){let $=H.__offset,ee=Array.isArray(H.value)?H.value:[H.value],te=0;for(let oe=0;oe<ee.length;oe++){let ne=ee[oe],ye=c(ne);typeof ne=="number"||typeof ne=="boolean"?(H.__data[0]=ne,i.bufferSubData(i.UNIFORM_BUFFER,$+te,H.__data)):ne.isMatrix3?(H.__data[0]=ne.elements[0],H.__data[1]=ne.elements[1],H.__data[2]=ne.elements[2],H.__data[3]=0,H.__data[4]=ne.elements[3],H.__data[5]=ne.elements[4],H.__data[6]=ne.elements[5],H.__data[7]=0,H.__data[8]=ne.elements[6],H.__data[9]=ne.elements[7],H.__data[10]=ne.elements[8],H.__data[11]=0):(ne.toArray(H.__data,te),te+=ye.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,$,H.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)})(u),s[u.id]=_)},dispose:function(){for(let u in r)i.deleteBuffer(r[u]);o=[],r={},s={}}}}var aa=class{constructor(e={}){let{canvas:t=Vu(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=e,p;if(this.isWebGLRenderer=!0,n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let m=new Uint32Array(4),_=new Int32Array(4),f=null,g=null,v=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Pn,this.toneMapping=0,this.toneMappingExposure=1;let w=this,T=!1,E=0,V=0,W=null,H=-1,$=null,ee=new Ht,te=new Ht,oe=null,ne=new mt(0),ye=0,ve=t.width,Pe=t.height,Ae=1,tt=null,z=null,U=new Ht(0,0,ve,Pe),P=new Ht(0,0,ve,Pe),K=!1,q=new rs,G=!1,b=!1,M=new ht,O=new ht,L=new B,A=new Ht,D={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},S=!1;function C(){return W===null?Ae:1}let F,se,j,ae,ie,he,Se,xe,ge,Le,ke,We,ze,nt,Be,gt,qe,Qe,ut,Tt,At,Vt,_n,Yt,re=n;function pn(x,I){return t.getContext(x,I)}try{let x={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r170"),t.addEventListener("webglcontextlost",on,!1),t.addEventListener("webglcontextrestored",dn,!1),t.addEventListener("webglcontextcreationerror",ln,!1),re===null){let I="webgl2";if(re=pn(I,x),re===null)throw pn(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}function ei(){F=new dd(re),F.init(),Vt=new Ap(re,F),se=new ld(re,F,e,Vt),j=new Ep(re,F),se.reverseDepthBuffer&&d&&j.buffers.depth.setReversed(!0),ae=new md(re),ie=new mp,he=new Tp(re,F,j,ie,se,Vt,ae),Se=new hd(w),xe=new ud(w),ge=new id(re),_n=new ad(re,ge),Le=new pd(re,ge,ae,_n),ke=new vd(re,Le,ge,ae),ut=new gd(re,se,he),gt=new cd(ie),We=new fp(w,Se,xe,F,se,_n,gt),ze=new Pp(w,ie),nt=new vp,Be=new bp(F),Qe=new sd(w,Se,xe,j,ke,p,l),qe=new Sp(w,ke,se),Yt=new Lp(re,ae,se,j),Tt=new od(re,F,ae),At=new fd(re,F,ae),ae.programs=We.programs,w.capabilities=se,w.extensions=F,w.properties=ie,w.renderLists=nt,w.shadowMap=qe,w.state=j,w.info=ae}ei();let zt=new ul(w,re);function on(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function dn(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let x=ae.autoReset,I=qe.enabled,N=qe.autoUpdate,X=qe.needsUpdate,k=qe.type;ei(),ae.autoReset=x,qe.enabled=I,qe.autoUpdate=N,qe.needsUpdate=X,qe.type=k}function ln(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function yn(x){let I=x.target;I.removeEventListener("dispose",yn),(function(N){(function(X){let k=ie.get(X).programs;k!==void 0&&(k.forEach((function(J){We.releaseProgram(J)})),X.isShaderMaterial&&We.releaseShaderCache(X))})(N),ie.remove(N)})(I)}function ti(x,I,N){x.transparent===!0&&x.side===2&&x.forceSinglePass===!1?(x.side=1,x.needsUpdate=!0,Wt(x,I,N),x.side=0,x.needsUpdate=!0,Wt(x,I,N),x.side=2):Wt(x,I,N)}this.xr=zt,this.getContext=function(){return re},this.getContextAttributes=function(){return re.getContextAttributes()},this.forceContextLoss=function(){let x=F.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){let x=F.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return Ae},this.setPixelRatio=function(x){x!==void 0&&(Ae=x,this.setSize(ve,Pe,!1))},this.getSize=function(x){return x.set(ve,Pe)},this.setSize=function(x,I,N=!0){zt.isPresenting?console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting."):(ve=x,Pe=I,t.width=Math.floor(x*Ae),t.height=Math.floor(I*Ae),N===!0&&(t.style.width=x+"px",t.style.height=I+"px"),this.setViewport(0,0,x,I))},this.getDrawingBufferSize=function(x){return x.set(ve*Ae,Pe*Ae).floor()},this.setDrawingBufferSize=function(x,I,N){ve=x,Pe=I,Ae=N,t.width=Math.floor(x*N),t.height=Math.floor(I*N),this.setViewport(0,0,x,I)},this.getCurrentViewport=function(x){return x.copy(ee)},this.getViewport=function(x){return x.copy(U)},this.setViewport=function(x,I,N,X){x.isVector4?U.set(x.x,x.y,x.z,x.w):U.set(x,I,N,X),j.viewport(ee.copy(U).multiplyScalar(Ae).round())},this.getScissor=function(x){return x.copy(P)},this.setScissor=function(x,I,N,X){x.isVector4?P.set(x.x,x.y,x.z,x.w):P.set(x,I,N,X),j.scissor(te.copy(P).multiplyScalar(Ae).round())},this.getScissorTest=function(){return K},this.setScissorTest=function(x){j.setScissorTest(K=x)},this.setOpaqueSort=function(x){tt=x},this.setTransparentSort=function(x){z=x},this.getClearColor=function(x){return x.copy(Qe.getClearColor())},this.setClearColor=function(){Qe.setClearColor.apply(Qe,arguments)},this.getClearAlpha=function(){return Qe.getClearAlpha()},this.setClearAlpha=function(){Qe.setClearAlpha.apply(Qe,arguments)},this.clear=function(x=!0,I=!0,N=!0){let X=0;if(x){let k=!1;if(W!==null){let J=W.texture.format;k=J===Zl||J===Yl||J===ql}if(k){let J=W.texture.type,me=J===Di||J===Ki||J===es||J===Tr||J===jl||J===Xl,pe=Qe.getClearColor(),we=Qe.getClearAlpha(),Te=pe.r,be=pe.g,De=pe.b;me?(m[0]=Te,m[1]=be,m[2]=De,m[3]=we,re.clearBufferuiv(re.COLOR,0,m)):(_[0]=Te,_[1]=be,_[2]=De,_[3]=we,re.clearBufferiv(re.COLOR,0,_))}else X|=re.COLOR_BUFFER_BIT}I&&(X|=re.DEPTH_BUFFER_BIT),N&&(X|=re.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),re.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",on,!1),t.removeEventListener("webglcontextrestored",dn,!1),t.removeEventListener("webglcontextcreationerror",ln,!1),nt.dispose(),Be.dispose(),ie.dispose(),Se.dispose(),xe.dispose(),ke.dispose(),_n.dispose(),Yt.dispose(),We.dispose(),zt.dispose(),zt.removeEventListener("sessionstart",xn),zt.removeEventListener("sessionend",hn),Mn.stop()},this.renderBufferDirect=function(x,I,N,X,k,J){I===null&&(I=D);let me=k.isMesh&&k.matrixWorld.determinant()<0,pe=(function(de,Ve,je,Ne,Xe){Ve.isScene!==!0&&(Ve=D),he.resetTextureUnits();let $e=Ve.fog,Ze=Ne.isMeshStandardMaterial?Ve.environment:null,ot=W===null?w.outputColorSpace:W.isXRRenderTarget===!0?W.texture.colorSpace:Ur,lt=(Ne.isMeshStandardMaterial?xe:Se).get(Ne.envMap||Ze),ct=Ne.vertexColors===!0&&!!je.attributes.color&&je.attributes.color.itemSize===4,xt=!!je.attributes.tangent&&(!!Ne.normalMap||Ne.anisotropy>0),ft=!!je.morphAttributes.position,Pt=!!je.morphAttributes.normal,jt=!!je.morphAttributes.color,dt=0;Ne.toneMapped&&(W!==null&&W.isXRRenderTarget!==!0||(dt=w.toneMapping));let Lt=je.morphAttributes.position||je.morphAttributes.normal||je.morphAttributes.color,St=Lt!==void 0?Lt.length:0,Ke=ie.get(Ne),R=g.state.lights;if(G===!0&&(b===!0||de!==$)){let it=de===$&&Ne.id===H;gt.setState(Ne,de,it)}let Z=!1;Ne.version===Ke.__version?Ke.needsLights&&Ke.lightsStateVersion!==R.state.version||Ke.outputColorSpace!==ot||Xe.isBatchedMesh&&Ke.batching===!1?Z=!0:Xe.isBatchedMesh||Ke.batching!==!0?Xe.isBatchedMesh&&Ke.batchingColor===!0&&Xe.colorTexture===null||Xe.isBatchedMesh&&Ke.batchingColor===!1&&Xe.colorTexture!==null||Xe.isInstancedMesh&&Ke.instancing===!1?Z=!0:Xe.isInstancedMesh||Ke.instancing!==!0?Xe.isSkinnedMesh&&Ke.skinning===!1?Z=!0:Xe.isSkinnedMesh||Ke.skinning!==!0?Xe.isInstancedMesh&&Ke.instancingColor===!0&&Xe.instanceColor===null||Xe.isInstancedMesh&&Ke.instancingColor===!1&&Xe.instanceColor!==null||Xe.isInstancedMesh&&Ke.instancingMorph===!0&&Xe.morphTexture===null||Xe.isInstancedMesh&&Ke.instancingMorph===!1&&Xe.morphTexture!==null||Ke.envMap!==lt||Ne.fog===!0&&Ke.fog!==$e?Z=!0:Ke.numClippingPlanes===void 0||Ke.numClippingPlanes===gt.numPlanes&&Ke.numIntersection===gt.numIntersection?(Ke.vertexAlphas!==ct||Ke.vertexTangents!==xt||Ke.morphTargets!==ft||Ke.morphNormals!==Pt||Ke.morphColors!==jt||Ke.toneMapping!==dt||Ke.morphTargetsCount!==St)&&(Z=!0):Z=!0:Z=!0:Z=!0:Z=!0:(Z=!0,Ke.__version=Ne.version);let fe=Ke.currentProgram;Z===!0&&(fe=Wt(Ne,Ve,Xe));let le=!1,Fe=!1,_e=!1,Re=fe.getUniforms(),Oe=Ke.uniforms;if(j.useProgram(fe.program)&&(le=!0,Fe=!0,_e=!0),Ne.id!==H&&(H=Ne.id,Fe=!0),le||$!==de){j.buffers.depth.getReversed()?(M.copy(de.projectionMatrix),(function(Rt){let st=Rt.elements;st[2]=.5*st[2]+.5*st[3],st[6]=.5*st[6]+.5*st[7],st[10]=.5*st[10]+.5*st[11],st[14]=.5*st[14]+.5*st[15]})(M),(function(Rt){let st=Rt.elements;st[11]===-1?(st[10]=-st[10]-1,st[14]=-st[14]):(st[10]=-st[10],st[14]=1-st[14])})(M),Re.setValue(re,"projectionMatrix",M)):Re.setValue(re,"projectionMatrix",de.projectionMatrix),Re.setValue(re,"viewMatrix",de.matrixWorldInverse);let it=Re.map.cameraPosition;it!==void 0&&it.setValue(re,L.setFromMatrixPosition(de.matrixWorld)),se.logarithmicDepthBuffer&&Re.setValue(re,"logDepthBufFC",2/(Math.log(de.far+1)/Math.LN2)),(Ne.isMeshPhongMaterial||Ne.isMeshToonMaterial||Ne.isMeshLambertMaterial||Ne.isMeshBasicMaterial||Ne.isMeshStandardMaterial||Ne.isShaderMaterial)&&Re.setValue(re,"isOrthographic",de.isOrthographicCamera===!0),$!==de&&($=de,Fe=!0,_e=!0)}if(Xe.isSkinnedMesh){Re.setOptional(re,Xe,"bindMatrix"),Re.setOptional(re,Xe,"bindMatrixInverse");let it=Xe.skeleton;it&&(it.boneTexture===null&&it.computeBoneTexture(),Re.setValue(re,"boneTexture",it.boneTexture,he))}Xe.isBatchedMesh&&(Re.setOptional(re,Xe,"batchingTexture"),Re.setValue(re,"batchingTexture",Xe._matricesTexture,he),Re.setOptional(re,Xe,"batchingIdTexture"),Re.setValue(re,"batchingIdTexture",Xe._indirectTexture,he),Re.setOptional(re,Xe,"batchingColorTexture"),Xe._colorsTexture!==null&&Re.setValue(re,"batchingColorTexture",Xe._colorsTexture,he));let Je=je.morphAttributes;Je.position===void 0&&Je.normal===void 0&&Je.color===void 0||ut.update(Xe,je,fe),(Fe||Ke.receiveShadow!==Xe.receiveShadow)&&(Ke.receiveShadow=Xe.receiveShadow,Re.setValue(re,"receiveShadow",Xe.receiveShadow)),Ne.isMeshGouraudMaterial&&Ne.envMap!==null&&(Oe.envMap.value=lt,Oe.flipEnvMap.value=lt.isCubeTexture&&lt.isRenderTargetTexture===!1?-1:1),Ne.isMeshStandardMaterial&&Ne.envMap===null&&Ve.environment!==null&&(Oe.envMapIntensity.value=Ve.environmentIntensity),Fe&&(Re.setValue(re,"toneMappingExposure",w.toneMappingExposure),Ke.needsLights&&(Ie=_e,(He=Oe).ambientLightColor.needsUpdate=Ie,He.lightProbe.needsUpdate=Ie,He.directionalLights.needsUpdate=Ie,He.directionalLightShadows.needsUpdate=Ie,He.pointLights.needsUpdate=Ie,He.pointLightShadows.needsUpdate=Ie,He.spotLights.needsUpdate=Ie,He.spotLightShadows.needsUpdate=Ie,He.rectAreaLights.needsUpdate=Ie,He.hemisphereLights.needsUpdate=Ie),$e&&Ne.fog===!0&&ze.refreshFogUniforms(Oe,$e),ze.refreshMaterialUniforms(Oe,Ne,Ae,Pe,g.state.transmissionRenderTarget[de.id]),Sr.upload(re,Y(Ke),Oe,he));var He,Ie;if(Ne.isShaderMaterial&&Ne.uniformsNeedUpdate===!0&&(Sr.upload(re,Y(Ke),Oe,he),Ne.uniformsNeedUpdate=!1),Ne.isSpriteMaterial&&Re.setValue(re,"center",Xe.center),Re.setValue(re,"modelViewMatrix",Xe.modelViewMatrix),Re.setValue(re,"normalMatrix",Xe.normalMatrix),Re.setValue(re,"modelMatrix",Xe.matrixWorld),Ne.isShaderMaterial||Ne.isRawShaderMaterial){let it=Ne.uniformsGroups;for(let Rt=0,st=it.length;Rt<st;Rt++){let Kt=it[Rt];Yt.update(Kt,fe),Yt.bind(Kt,fe)}}return fe})(x,I,N,X,k);j.setMaterial(X,me);let we=N.index,Te=1;if(X.wireframe===!0){if(we=Le.getWireframeAttribute(N),we===void 0)return;Te=2}let be=N.drawRange,De=N.attributes.position,ce=be.start*Te,Me=(be.start+be.count)*Te;J!==null&&(ce=Math.max(ce,J.start*Te),Me=Math.min(Me,(J.start+J.count)*Te)),we!==null?(ce=Math.max(ce,0),Me=Math.min(Me,we.count)):De!=null&&(ce=Math.max(ce,0),Me=Math.min(Me,De.count));let Q=Me-ce;if(Q<0||Q===1/0)return;let Ee;_n.setup(k,X,pe,N,we);let Ue=Tt;if(we!==null&&(Ee=ge.get(we),Ue=At,Ue.setIndex(Ee)),k.isMesh)X.wireframe===!0?(j.setLineWidth(X.wireframeLinewidth*C()),Ue.setMode(re.LINES)):Ue.setMode(re.TRIANGLES);else if(k.isLine){let de=X.linewidth;de===void 0&&(de=1),j.setLineWidth(de*C()),k.isLineSegments?Ue.setMode(re.LINES):k.isLineLoop?Ue.setMode(re.LINE_LOOP):Ue.setMode(re.LINE_STRIP)}else k.isPoints?Ue.setMode(re.POINTS):k.isSprite&&Ue.setMode(re.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Ue.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(F.get("WEBGL_multi_draw"))Ue.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{let de=k._multiDrawStarts,Ve=k._multiDrawCounts,je=k._multiDrawCount,Ne=we?ge.get(we).bytesPerElement:1,Xe=ie.get(X).currentProgram.getUniforms();for(let $e=0;$e<je;$e++)Xe.setValue(re,"_gl_DrawID",$e),Ue.render(de[$e]/Ne,Ve[$e])}else if(k.isInstancedMesh)Ue.renderInstances(ce,Q,k.count);else if(N.isInstancedBufferGeometry){let de=N._maxInstanceCount!==void 0?N._maxInstanceCount:1/0,Ve=Math.min(N.instanceCount,de);Ue.renderInstances(ce,Q,Ve)}else Ue.render(ce,Q)},this.compile=function(x,I,N=null){N===null&&(N=x),g=Be.get(N),g.init(I),y.push(g),N.traverseVisible((function(k){k.isLight&&k.layers.test(I.layers)&&(g.pushLight(k),k.castShadow&&g.pushShadow(k))})),x!==N&&x.traverseVisible((function(k){k.isLight&&k.layers.test(I.layers)&&(g.pushLight(k),k.castShadow&&g.pushShadow(k))})),g.setupLights();let X=new Set;return x.traverse((function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;let J=k.material;if(J)if(Array.isArray(J))for(let me=0;me<J.length;me++){let pe=J[me];ti(pe,N,k),X.add(pe)}else ti(J,N,k),X.add(J)})),y.pop(),g=null,X},this.compileAsync=function(x,I,N=null){let X=this.compile(x,I,N);return new Promise((k=>{function J(){X.forEach((function(me){ie.get(me).currentProgram.isReady()&&X.delete(me)})),X.size!==0?setTimeout(J,10):k(x)}F.get("KHR_parallel_shader_compile")!==null?J():setTimeout(J,10)}))};let cn=null;function xn(){Mn.stop()}function hn(){Mn.start()}let Mn=new Lh;function Vn(x,I,N,X){if(x.visible===!1)return;if(x.layers.test(I.layers)){if(x.isGroup)N=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(I);else if(x.isLight)g.pushLight(x),x.castShadow&&g.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||q.intersectsSprite(x)){X&&A.setFromMatrixPosition(x.matrixWorld).applyMatrix4(O);let J=ke.update(x),me=x.material;me.visible&&f.push(x,J,me,N,A.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||q.intersectsObject(x))){let J=ke.update(x),me=x.material;if(X&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),A.copy(x.boundingSphere.center)):(J.boundingSphere===null&&J.computeBoundingSphere(),A.copy(J.boundingSphere.center)),A.applyMatrix4(x.matrixWorld).applyMatrix4(O)),Array.isArray(me)){let pe=J.groups;for(let we=0,Te=pe.length;we<Te;we++){let be=pe[we],De=me[be.materialIndex];De&&De.visible&&f.push(x,J,De,N,A.z,be)}}else me.visible&&f.push(x,J,me,N,A.z,null)}}let k=x.children;for(let J=0,me=k.length;J<me;J++)Vn(k[J],I,N,X)}function et(x,I,N,X){let k=x.opaque,J=x.transmissive,me=x.transparent;g.setupLightsView(N),G===!0&&gt.setGlobalState(w.clippingPlanes,N),X&&j.viewport(ee.copy(X)),k.length>0&&Sn(k,I,N),J.length>0&&Sn(J,I,N),me.length>0&&Sn(me,I,N),j.buffers.depth.setTest(!0),j.buffers.depth.setMask(!0),j.buffers.color.setMask(!0),j.setPolygonOffset(!1)}function bn(x,I,N,X){if((N.isScene===!0?N.overrideMaterial:null)!==null)return;g.state.transmissionRenderTarget[X.id]===void 0&&(g.state.transmissionRenderTarget[X.id]=new Bn(1,1,{generateMipmaps:!0,type:F.has("EXT_color_buffer_half_float")||F.has("EXT_color_buffer_float")?ps:Di,minFilter:yr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:wt.workingColorSpace}));let k=g.state.transmissionRenderTarget[X.id],J=X.viewport||ee;k.setSize(J.z,J.w);let me=w.getRenderTarget();w.setRenderTarget(k),w.getClearColor(ne),ye=w.getClearAlpha(),ye<1&&w.setClearColor(16777215,.5),w.clear(),S&&Qe.render(N);let pe=w.toneMapping;w.toneMapping=0;let we=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),g.setupLightsView(X),G===!0&&gt.setGlobalState(w.clippingPlanes,X),Sn(x,N,X),he.updateMultisampleRenderTarget(k),he.updateRenderTargetMipmap(k),F.has("WEBGL_multisampled_render_to_texture")===!1){let Te=!1;for(let be=0,De=I.length;be<De;be++){let ce=I[be],Me=ce.object,Q=ce.geometry,Ee=ce.material,Ue=ce.group;if(Ee.side===2&&Me.layers.test(X.layers)){let de=Ee.side;Ee.side=1,Ee.needsUpdate=!0,Bi(Me,N,X,Q,Ee,Ue),Ee.side=de,Ee.needsUpdate=!0,Te=!0}}Te===!0&&(he.updateMultisampleRenderTarget(k),he.updateRenderTargetMipmap(k))}w.setRenderTarget(me),w.setClearColor(ne,ye),we!==void 0&&(X.viewport=we),w.toneMapping=pe}function Sn(x,I,N){let X=I.isScene===!0?I.overrideMaterial:null;for(let k=0,J=x.length;k<J;k++){let me=x[k],pe=me.object,we=me.geometry,Te=X===null?me.material:X,be=me.group;pe.layers.test(N.layers)&&Bi(pe,I,N,we,Te,be)}}function Bi(x,I,N,X,k,J){x.onBeforeRender(w,I,N,X,k,J),x.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),k.onBeforeRender(w,I,N,X,x,J),k.transparent===!0&&k.side===2&&k.forceSinglePass===!1?(k.side=1,k.needsUpdate=!0,w.renderBufferDirect(N,I,X,k,x,J),k.side=0,k.needsUpdate=!0,w.renderBufferDirect(N,I,X,k,x,J),k.side=2):w.renderBufferDirect(N,I,X,k,x,J),x.onAfterRender(w,I,N,X,k,J)}function Wt(x,I,N){I.isScene!==!0&&(I=D);let X=ie.get(x),k=g.state.lights,J=g.state.shadowsArray,me=k.state.version,pe=We.getParameters(x,k.state,J,I,N),we=We.getProgramCacheKey(pe),Te=X.programs;X.environment=x.isMeshStandardMaterial?I.environment:null,X.fog=I.fog,X.envMap=(x.isMeshStandardMaterial?xe:Se).get(x.envMap||X.environment),X.envMapRotation=X.environment!==null&&x.envMap===null?I.environmentRotation:x.envMapRotation,Te===void 0&&(x.addEventListener("dispose",yn),Te=new Map,X.programs=Te);let be=Te.get(we);if(be!==void 0){if(X.currentProgram===be&&X.lightsStateVersion===me)return ue(x,pe),be}else pe.uniforms=We.getUniforms(x),x.onBeforeCompile(pe,w),be=We.acquireProgram(pe,we),Te.set(we,be),X.uniforms=pe.uniforms;let De=X.uniforms;return(x.isShaderMaterial||x.isRawShaderMaterial)&&x.clipping!==!0||(De.clippingPlanes=gt.uniform),ue(x,pe),X.needsLights=(function(ce){return ce.isMeshLambertMaterial||ce.isMeshToonMaterial||ce.isMeshPhongMaterial||ce.isMeshStandardMaterial||ce.isShadowMaterial||ce.isShaderMaterial&&ce.lights===!0})(x),X.lightsStateVersion=me,X.needsLights&&(De.ambientLightColor.value=k.state.ambient,De.lightProbe.value=k.state.probe,De.directionalLights.value=k.state.directional,De.directionalLightShadows.value=k.state.directionalShadow,De.spotLights.value=k.state.spot,De.spotLightShadows.value=k.state.spotShadow,De.rectAreaLights.value=k.state.rectArea,De.ltc_1.value=k.state.rectAreaLTC1,De.ltc_2.value=k.state.rectAreaLTC2,De.pointLights.value=k.state.point,De.pointLightShadows.value=k.state.pointShadow,De.hemisphereLights.value=k.state.hemi,De.directionalShadowMap.value=k.state.directionalShadowMap,De.directionalShadowMatrix.value=k.state.directionalShadowMatrix,De.spotShadowMap.value=k.state.spotShadowMap,De.spotLightMatrix.value=k.state.spotLightMatrix,De.spotLightMap.value=k.state.spotLightMap,De.pointShadowMap.value=k.state.pointShadowMap,De.pointShadowMatrix.value=k.state.pointShadowMatrix),X.currentProgram=be,X.uniformsList=null,be}function Y(x){if(x.uniformsList===null){let I=x.currentProgram.getUniforms();x.uniformsList=Sr.seqWithValue(I.seq,x.uniforms)}return x.uniformsList}function ue(x,I){let N=ie.get(x);N.outputColorSpace=I.outputColorSpace,N.batching=I.batching,N.batchingColor=I.batchingColor,N.instancing=I.instancing,N.instancingColor=I.instancingColor,N.instancingMorph=I.instancingMorph,N.skinning=I.skinning,N.morphTargets=I.morphTargets,N.morphNormals=I.morphNormals,N.morphColors=I.morphColors,N.morphTargetsCount=I.morphTargetsCount,N.numClippingPlanes=I.numClippingPlanes,N.numIntersection=I.numClipIntersection,N.vertexAlphas=I.vertexAlphas,N.vertexTangents=I.vertexTangents,N.toneMapping=I.toneMapping}Mn.setAnimationLoop((function(x){cn&&cn(x)})),typeof self<"u"&&Mn.setContext(self),this.setAnimationLoop=function(x){cn=x,zt.setAnimationLoop(x),x===null?Mn.stop():Mn.start()},zt.addEventListener("sessionstart",xn),zt.addEventListener("sessionend",hn),this.render=function(x,I){if(I!==void 0&&I.isCamera!==!0)return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");if(T===!0)return;if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),zt.enabled===!0&&zt.isPresenting===!0&&(zt.cameraAutoUpdate===!0&&zt.updateCamera(I),I=zt.getCamera()),x.isScene===!0&&x.onBeforeRender(w,x,I,W),g=Be.get(x,y.length),g.init(I),y.push(g),O.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),q.setFromProjectionMatrix(O),b=this.localClippingEnabled,G=gt.init(this.clippingPlanes,b),f=nt.get(x,v.length),f.init(),v.push(f),zt.enabled===!0&&zt.isPresenting===!0){let J=w.xr.getDepthSensingMesh();J!==null&&Vn(J,I,-1/0,w.sortObjects)}Vn(x,I,0,w.sortObjects),f.finish(),w.sortObjects===!0&&f.sort(tt,z),S=zt.enabled===!1||zt.isPresenting===!1||zt.hasDepthSensing()===!1,S&&Qe.addToRenderList(f,x),this.info.render.frame++,G===!0&&gt.beginShadows();let N=g.state.shadowsArray;qe.render(N,x,I),G===!0&&gt.endShadows(),this.info.autoReset===!0&&this.info.reset();let X=f.opaque,k=f.transmissive;if(g.setupLights(),I.isArrayCamera){let J=I.cameras;if(k.length>0)for(let me=0,pe=J.length;me<pe;me++)bn(X,k,x,J[me]);S&&Qe.render(x);for(let me=0,pe=J.length;me<pe;me++){let we=J[me];et(f,x,we,we.viewport)}}else k.length>0&&bn(X,k,x,I),S&&Qe.render(x),et(f,x,I);W!==null&&(he.updateMultisampleRenderTarget(W),he.updateRenderTargetMipmap(W)),x.isScene===!0&&x.onAfterRender(w,x,I),_n.resetDefaultState(),H=-1,$=null,y.pop(),y.length>0?(g=y[y.length-1],G===!0&&gt.setGlobalState(w.clippingPlanes,g.state.camera)):g=null,v.pop(),f=v.length>0?v[v.length-1]:null},this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return W},this.setRenderTargetTextures=function(x,I,N){ie.get(x.texture).__webglTexture=I,ie.get(x.depthTexture).__webglTexture=N;let X=ie.get(x);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=N===void 0,X.__autoAllocateDepthBuffer||F.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(x,I){let N=ie.get(x);N.__webglFramebuffer=I,N.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(x,I=0,N=0){W=x,E=I,V=N;let X=!0,k=null,J=!1,me=!1;if(x){let pe=ie.get(x);if(pe.__useDefaultFramebuffer!==void 0)j.bindFramebuffer(re.FRAMEBUFFER,null),X=!1;else if(pe.__webglFramebuffer===void 0)he.setupRenderTarget(x);else if(pe.__hasExternalTextures)he.rebindTextures(x,ie.get(x.texture).__webglTexture,ie.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){let be=x.depthTexture;if(pe.__boundDepthTexture!==be){if(be!==null&&ie.has(be)&&(x.width!==be.image.width||x.height!==be.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");he.setupDepthRenderbuffer(x)}}let we=x.texture;(we.isData3DTexture||we.isDataArrayTexture||we.isCompressedArrayTexture)&&(me=!0);let Te=ie.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(k=Array.isArray(Te[I])?Te[I][N]:Te[I],J=!0):k=x.samples>0&&he.useMultisampledRTT(x)===!1?ie.get(x).__webglMultisampledFramebuffer:Array.isArray(Te)?Te[N]:Te,ee.copy(x.viewport),te.copy(x.scissor),oe=x.scissorTest}else ee.copy(U).multiplyScalar(Ae).floor(),te.copy(P).multiplyScalar(Ae).floor(),oe=K;if(j.bindFramebuffer(re.FRAMEBUFFER,k)&&X&&j.drawBuffers(x,k),j.viewport(ee),j.scissor(te),j.setScissorTest(oe),J){let pe=ie.get(x.texture);re.framebufferTexture2D(re.FRAMEBUFFER,re.COLOR_ATTACHMENT0,re.TEXTURE_CUBE_MAP_POSITIVE_X+I,pe.__webglTexture,N)}else if(me){let pe=ie.get(x.texture),we=I||0;re.framebufferTextureLayer(re.FRAMEBUFFER,re.COLOR_ATTACHMENT0,pe.__webglTexture,N||0,we)}H=-1},this.readRenderTargetPixels=function(x,I,N,X,k,J,me){if(!x||!x.isWebGLRenderTarget)return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let pe=ie.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&me!==void 0&&(pe=pe[me]),pe){j.bindFramebuffer(re.FRAMEBUFFER,pe);try{let we=x.texture,Te=we.format,be=we.type;if(!se.textureFormatReadable(Te))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");if(!se.textureTypeReadable(be))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");I>=0&&I<=x.width-X&&N>=0&&N<=x.height-k&&re.readPixels(I,N,X,k,Vt.convert(Te),Vt.convert(be),J)}finally{let we=W!==null?ie.get(W).__webglFramebuffer:null;j.bindFramebuffer(re.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(x,I,N,X,k,J,me){if(!x||!x.isWebGLRenderTarget)throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let pe=ie.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&me!==void 0&&(pe=pe[me]),pe){let we=x.texture,Te=we.format,be=we.type;if(!se.textureFormatReadable(Te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!se.textureTypeReadable(be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=x.width-X&&N>=0&&N<=x.height-k){j.bindFramebuffer(re.FRAMEBUFFER,pe);let De=re.createBuffer();re.bindBuffer(re.PIXEL_PACK_BUFFER,De),re.bufferData(re.PIXEL_PACK_BUFFER,J.byteLength,re.STREAM_READ),re.readPixels(I,N,X,k,Vt.convert(Te),Vt.convert(be),0);let ce=W!==null?ie.get(W).__webglFramebuffer:null;j.bindFramebuffer(re.FRAMEBUFFER,ce);let Me=re.fenceSync(re.SYNC_GPU_COMMANDS_COMPLETE,0);return re.flush(),await(function(Q,Ee,Ue){return new Promise((function(de,Ve){setTimeout((function je(){switch(Q.clientWaitSync(Ee,Q.SYNC_FLUSH_COMMANDS_BIT,0)){case Q.WAIT_FAILED:Ve();break;case Q.TIMEOUT_EXPIRED:setTimeout(je,Ue);break;default:de()}}),Ue)}))})(re,Me,4),re.bindBuffer(re.PIXEL_PACK_BUFFER,De),re.getBufferSubData(re.PIXEL_PACK_BUFFER,0,J),re.deleteBuffer(De),re.deleteSync(Me),J}throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(x,I=null,N=0){x.isTexture!==!0&&(qr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,x=arguments[1]);let X=Math.pow(2,-N),k=Math.floor(x.image.width*X),J=Math.floor(x.image.height*X),me=I!==null?I.x:0,pe=I!==null?I.y:0;he.setTexture2D(x,0),re.copyTexSubImage2D(re.TEXTURE_2D,N,0,0,me,pe,k,J),j.unbindTexture()},this.copyTextureToTexture=function(x,I,N=null,X=null,k=0){let J,me,pe,we,Te,be,De,ce,Me;x.isTexture!==!0&&(qr("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,x=arguments[1],I=arguments[2],k=arguments[3]||0,N=null);let Q=x.isCompressedTexture?x.mipmaps[k]:x.image;N!==null?(J=N.max.x-N.min.x,me=N.max.y-N.min.y,pe=N.isBox3?N.max.z-N.min.z:1,we=N.min.x,Te=N.min.y,be=N.isBox3?N.min.z:0):(J=Q.width,me=Q.height,pe=Q.depth||1,we=0,Te=0,be=0),X!==null?(De=X.x,ce=X.y,Me=X.z):(De=0,ce=0,Me=0);let Ee=Vt.convert(I.format),Ue=Vt.convert(I.type),de;I.isData3DTexture?(he.setTexture3D(I,0),de=re.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(he.setTexture2DArray(I,0),de=re.TEXTURE_2D_ARRAY):(he.setTexture2D(I,0),de=re.TEXTURE_2D),re.pixelStorei(re.UNPACK_FLIP_Y_WEBGL,I.flipY),re.pixelStorei(re.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),re.pixelStorei(re.UNPACK_ALIGNMENT,I.unpackAlignment);let Ve=re.getParameter(re.UNPACK_ROW_LENGTH),je=re.getParameter(re.UNPACK_IMAGE_HEIGHT),Ne=re.getParameter(re.UNPACK_SKIP_PIXELS),Xe=re.getParameter(re.UNPACK_SKIP_ROWS),$e=re.getParameter(re.UNPACK_SKIP_IMAGES);re.pixelStorei(re.UNPACK_ROW_LENGTH,Q.width),re.pixelStorei(re.UNPACK_IMAGE_HEIGHT,Q.height),re.pixelStorei(re.UNPACK_SKIP_PIXELS,we),re.pixelStorei(re.UNPACK_SKIP_ROWS,Te),re.pixelStorei(re.UNPACK_SKIP_IMAGES,be);let Ze=x.isDataArrayTexture||x.isData3DTexture,ot=I.isDataArrayTexture||I.isData3DTexture;if(x.isRenderTargetTexture||x.isDepthTexture){let lt=ie.get(x),ct=ie.get(I),xt=ie.get(lt.__renderTarget),ft=ie.get(ct.__renderTarget);j.bindFramebuffer(re.READ_FRAMEBUFFER,xt.__webglFramebuffer),j.bindFramebuffer(re.DRAW_FRAMEBUFFER,ft.__webglFramebuffer);for(let Pt=0;Pt<pe;Pt++)Ze&&re.framebufferTextureLayer(re.READ_FRAMEBUFFER,re.COLOR_ATTACHMENT0,ie.get(x).__webglTexture,k,be+Pt),x.isDepthTexture?(ot&&re.framebufferTextureLayer(re.DRAW_FRAMEBUFFER,re.COLOR_ATTACHMENT0,ie.get(I).__webglTexture,k,Me+Pt),re.blitFramebuffer(we,Te,J,me,De,ce,J,me,re.DEPTH_BUFFER_BIT,re.NEAREST)):ot?re.copyTexSubImage3D(de,k,De,ce,Me+Pt,we,Te,J,me):re.copyTexSubImage2D(de,k,De,ce,Me+Pt,we,Te,J,me);j.bindFramebuffer(re.READ_FRAMEBUFFER,null),j.bindFramebuffer(re.DRAW_FRAMEBUFFER,null)}else ot?x.isDataTexture||x.isData3DTexture?re.texSubImage3D(de,k,De,ce,Me,J,me,pe,Ee,Ue,Q.data):I.isCompressedArrayTexture?re.compressedTexSubImage3D(de,k,De,ce,Me,J,me,pe,Ee,Q.data):re.texSubImage3D(de,k,De,ce,Me,J,me,pe,Ee,Ue,Q):x.isDataTexture?re.texSubImage2D(re.TEXTURE_2D,k,De,ce,J,me,Ee,Ue,Q.data):x.isCompressedTexture?re.compressedTexSubImage2D(re.TEXTURE_2D,k,De,ce,Q.width,Q.height,Ee,Q.data):re.texSubImage2D(re.TEXTURE_2D,k,De,ce,J,me,Ee,Ue,Q);re.pixelStorei(re.UNPACK_ROW_LENGTH,Ve),re.pixelStorei(re.UNPACK_IMAGE_HEIGHT,je),re.pixelStorei(re.UNPACK_SKIP_PIXELS,Ne),re.pixelStorei(re.UNPACK_SKIP_ROWS,Xe),re.pixelStorei(re.UNPACK_SKIP_IMAGES,$e),k===0&&I.generateMipmaps&&re.generateMipmap(de),j.unbindTexture()},this.copyTextureToTexture3D=function(x,I,N=null,X=null,k=0){return x.isTexture!==!0&&(qr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),N=arguments[0]||null,X=arguments[1]||null,x=arguments[2],I=arguments[3],k=arguments[4]||0),qr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(x,I,N,X,k)},this.initRenderTarget=function(x){ie.get(x).__webglFramebuffer===void 0&&he.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?he.setTextureCube(x,0):x.isData3DTexture?he.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?he.setTexture2DArray(x,0):he.setTexture2D(x,0),j.unbindTexture()},this.resetState=function(){E=0,V=0,W=null,j.reset(),_n.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Rr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=wt._getDrawingBufferColorSpace(e),t.unpackColorSpace=wt._getUnpackColorSpace()}};var Lr=class extends qn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new oi,this.environmentIntensity=1,this.environmentRotation=new oi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var Ff=new B;var Bf=new B,zf=new B,kf=new B,Vf=new Ce,Hf=new Ce,Gf=new ht,Wf=new B,jf=new B,Xf=new B,qf=new Ce,Yf=new Ce,Zf=new Ce;var Kf=new B,Jf=new B;var $f=new B,Qf=new Ht,em=new Ht,tm=new B,nm=new ht,im=new B,rm=new ai,sm=new ht,am=new xi;var om=new ht,lm=new ht;var cm=new ht,hm=new ht;var um=new Ln,dm=new ht,pm=new Jt,fm=new ai;var dl=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,r){let s=this.pool,o=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});let a=s[this.index];o.push(a),this.index++,a.start=e,a.count=t,a.z=n,a.index=r}reset(){this.list.length=0,this.index=0}},mm=new ht,gm=new mt(1,1,1),vm=new rs,_m=new Ln,ym=new ai,xm=new B,Mm=new B,bm=new B,Sm=new dl,wm=new Jt;var Em=new B,Tm=new B,Am=new ht,Rm=new xi,Cm=new ai,Pm=new B,Lm=new B;var Im=new B,Dm=new B;var Um=new ht,Nm=new xi,Om=new ai,Fm=new B;var oa=class extends Nn{constructor(e,t,n,r,s,o,a,l,c){super(e,t,n,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},zn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),s+=n.distanceTo(r),t.push(s),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),r=0,s=n.length,o;o=t||e*n[s-1];let a,l=0,c=s-1;for(;l<=c;)if(r=Math.floor(l+(c-l)/2),a=n[r]-o,a<0)l=r+1;else{if(!(a>0)){c=r;break}c=r-1}if(r=c,n[r]===o)return r/(s-1);let h=n[r];return(r+(o-h)/(n[r+1]-h))/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);let o=this.getPoint(r),a=this.getPoint(s),l=t||(o.isVector2?new Ce:new B);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new B,r=[],s=[],o=[],a=new B,l=new ht;for(let p=0;p<=e;p++){let m=p/e;r[p]=this.getTangentAt(m,new B)}s[0]=new B,o[0]=new B;let c=Number.MAX_VALUE,h=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let p=1;p<=e;p++){if(s[p]=s[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(r[p-1],r[p]),a.length()>Number.EPSILON){a.normalize();let m=Math.acos(en(r[p-1].dot(r[p]),-1,1));s[p].applyMatrix4(l.makeRotationAxis(a,m))}o[p].crossVectors(r[p],s[p])}if(t===!0){let p=Math.acos(en(s[0].dot(s[e]),-1,1));p/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(p=-p);for(let m=1;m<=e;m++)s[m].applyMatrix4(l.makeRotationAxis(r[m],p*m)),o[m].crossVectors(r[m],s[m])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},as=class extends zn{constructor(e=0,t=0,n=1,r=1,s=0,o=2*Math.PI,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new Ce){let n=t,r=2*Math.PI,s=this.aEndAngle-this.aStartAngle,o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(s=o?0:r),this.aClockwise!==!0||o||(s===r?s=-r:s-=r);let a=this.aStartAngle+e*s,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*h-p*u+this.aX,c=d*u+p*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},pl=class extends as{constructor(e,t,n,r,s,o){super(e,t,n,n,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Jl(){let i=0,e=0,t=0,n=0;function r(s,o,a,l){i=s,e=a,t=-3*s+3*o-2*a-l,n=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){r(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,h,u){let d=(o-s)/c-(a-s)/(c+h)+(a-o)/h,p=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,p*=h,r(o,a,d,p)},calc:function(s){let o=s*s;return i+e*s+t*o+n*(o*s)}}}var Bs=new B,uo=new Jl,po=new Jl,fo=new Jl,Qi=class extends zn{constructor(e=[],t=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new B){let n=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e,a,l,c=Math.floor(o),h=o-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:h===0&&c===s-1&&(c=s-2,h=1),this.closed||c>0?a=r[(c-1)%s]:(Bs.subVectors(r[0],r[1]).add(r[0]),a=Bs);let u=r[c%s],d=r[(c+1)%s];if(this.closed||c+2<s?l=r[(c+2)%s]:(Bs.subVectors(r[s-1],r[s-2]).add(r[s-1]),l=Bs),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,m=Math.pow(a.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(d),p),f=Math.pow(d.distanceToSquared(l),p);_<1e-4&&(_=1),m<1e-4&&(m=_),f<1e-4&&(f=_),uo.initNonuniformCatmullRom(a.x,u.x,d.x,l.x,m,_,f),po.initNonuniformCatmullRom(a.y,u.y,d.y,l.y,m,_,f),fo.initNonuniformCatmullRom(a.z,u.z,d.z,l.z,m,_,f)}else this.curveType==="catmullrom"&&(uo.initCatmullRom(a.x,u.x,d.x,l.x,this.tension),po.initCatmullRom(a.y,u.y,d.y,l.y,this.tension),fo.initCatmullRom(a.z,u.z,d.z,l.z,this.tension));return n.set(uo.calc(h),po.calc(h),fo.calc(h)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(new B().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function rh(i,e,t,n,r){let s=.5*(n-e),o=.5*(r-t),a=i*i;return(2*t-2*n+s+o)*(i*a)+(-3*t+3*n-2*s-o)*a+s*i+t}function Kr(i,e,t,n){return(function(r,s){let o=1-r;return o*o*s})(i,e)+(function(r,s){return 2*(1-r)*r*s})(i,t)+(function(r,s){return r*r*s})(i,n)}function Jr(i,e,t,n,r){return(function(s,o){let a=1-s;return a*a*a*o})(i,e)+(function(s,o){let a=1-s;return 3*a*a*s*o})(i,t)+(function(s,o){return 3*(1-s)*s*s*o})(i,n)+(function(s,o){return s*s*s*o})(i,r)}var la=class extends zn{constructor(e=new Ce,t=new Ce,n=new Ce,r=new Ce){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new Ce){let n=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(Jr(e,r.x,s.x,o.x,a.x),Jr(e,r.y,s.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},fl=class extends zn{constructor(e=new B,t=new B,n=new B,r=new B){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new B){let n=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(Jr(e,r.x,s.x,o.x,a.x),Jr(e,r.y,s.y,o.y,a.y),Jr(e,r.z,s.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ca=class extends zn{constructor(e=new Ce,t=new Ce){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ce){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ce){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ml=class extends zn{constructor(e=new B,t=new B){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new B){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new B){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ha=class extends zn{constructor(e=new Ce,t=new Ce,n=new Ce){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Ce){let n=t,r=this.v0,s=this.v1,o=this.v2;return n.set(Kr(e,r.x,s.x,o.x),Kr(e,r.y,s.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ua=class extends zn{constructor(e=new B,t=new B,n=new B){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new B){let n=t,r=this.v0,s=this.v1,o=this.v2;return n.set(Kr(e,r.x,s.x,o.x),Kr(e,r.y,s.y,o.y),Kr(e,r.z,s.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},da=class extends zn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ce){let n=t,r=this.points,s=(r.length-1)*e,o=Math.floor(s),a=s-o,l=r[o===0?o:o-1],c=r[o],h=r[o>r.length-2?r.length-1:o+1],u=r[o>r.length-3?r.length-1:o+2];return n.set(rh(a,l.x,c.x,h.x,u.x),rh(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(new Ce().fromArray(r))}return this}},pa=Object.freeze({__proto__:null,ArcCurve:pl,CatmullRomCurve3:Qi,CubicBezierCurve:la,CubicBezierCurve3:fl,EllipseCurve:as,LineCurve:ca,LineCurve3:ml,QuadraticBezierCurve:ha,QuadraticBezierCurve3:ua,SplineCurve:da}),gl=class extends zn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new pa[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),s=0;for(;s<r.length;){if(r[s]>=n){let o=r[s]-n,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,s=this.curves;r<s.length;r++){let o=s[r],a=o.isEllipseCurve?2*e:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let r=e.curves[t];this.curves.push(new pa[r.type]().fromJSON(r))}return this}},os=class extends gl{constructor(e){super(),this.type="Path",this.currentPoint=new Ce,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ca(this.currentPoint.clone(),new Ce(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let s=new ha(this.currentPoint.clone(),new Ce(e,t),new Ce(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,s,o){let a=new la(this.currentPoint.clone(),new Ce(e,t),new Ce(n,r),new Ce(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new da(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,s,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,r,s,o),this}absarc(e,t,n,r,s,o){return this.absellipse(e,t,n,n,r,s,o),this}ellipse(e,t,n,r,s,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,r,s,o,a,l),this}absellipse(e,t,n,r,s,o,a,l){let c=new as(e,t,n,r,s,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},fa=class i extends Dt{constructor(e=[new Ce(0,-.5),new Ce(.5,0),new Ce(0,.5)],t=12,n=0,r=2*Math.PI){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=en(r,0,2*Math.PI);let s=[],o=[],a=[],l=[],c=[],h=1/t,u=new B,d=new Ce,p=new B,m=new B,_=new B,f=0,g=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:f=e[v+1].x-e[v].x,g=e[v+1].y-e[v].y,p.x=1*g,p.y=-f,p.z=0*g,_.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:f=e[v+1].x-e[v].x,g=e[v+1].y-e[v].y,p.x=1*g,p.y=-f,p.z=0*g,m.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),l.push(p.x,p.y,p.z),_.copy(m)}for(let v=0;v<=t;v++){let y=n+v*h*r,w=Math.sin(y),T=Math.cos(y);for(let E=0;E<=e.length-1;E++){u.x=e[E].x*w,u.y=e[E].y,u.z=e[E].x*T,o.push(u.x,u.y,u.z),d.x=v/t,d.y=E/(e.length-1),a.push(d.x,d.y);let V=l[3*E+0]*w,W=l[3*E+1],H=l[3*E+0]*T;c.push(V,W,H)}}for(let v=0;v<t;v++)for(let y=0;y<e.length-1;y++){let w=y+v*e.length,T=w,E=w+e.length,V=w+e.length+1,W=w+1;s.push(T,E,W),s.push(V,W,E)}this.setIndex(s),this.setAttribute("position",new at(o,3)),this.setAttribute("uv",new at(a,2)),this.setAttribute("normal",new at(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},vl=class i extends fa{constructor(e=1,t=1,n=4,r=8){let s=new os;s.absarc(0,-t/2,e,1.5*Math.PI,0),s.absarc(0,t/2,e,0,.5*Math.PI),super(s.getPoints(n),r),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:r}}static fromJSON(e){return new i(e.radius,e.length,e.capSegments,e.radialSegments)}},_l=class i extends Dt{constructor(e=1,t=32,n=0,r=2*Math.PI){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let s=[],o=[],a=[],l=[],c=new B,h=new Ce;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let p=n+u/t*r;c.x=e*Math.cos(p),c.y=e*Math.sin(p),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/e+1)/2,h.y=(o[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new at(o,3)),this.setAttribute("normal",new at(a,3)),this.setAttribute("uv",new at(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},ma=class i extends Dt{constructor(e=1,t=1,n=1,r=32,s=1,o=!1,a=0,l=2*Math.PI){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};let c=this;r=Math.floor(r),s=Math.floor(s);let h=[],u=[],d=[],p=[],m=0,_=[],f=n/2,g=0;function v(y){let w=m,T=new Ce,E=new B,V=0,W=y===!0?e:t,H=y===!0?1:-1;for(let ee=1;ee<=r;ee++)u.push(0,f*H,0),d.push(0,H,0),p.push(.5,.5),m++;let $=m;for(let ee=0;ee<=r;ee++){let te=ee/r*l+a,oe=Math.cos(te),ne=Math.sin(te);E.x=W*ne,E.y=f*H,E.z=W*oe,u.push(E.x,E.y,E.z),d.push(0,H,0),T.x=.5*oe+.5,T.y=.5*ne*H+.5,p.push(T.x,T.y),m++}for(let ee=0;ee<r;ee++){let te=w+ee,oe=$+ee;y===!0?h.push(oe,oe+1,te):h.push(oe+1,oe,te),V+=3}c.addGroup(g,V,y===!0?1:2),g+=V}(function(){let y=new B,w=new B,T=0,E=(t-e)/n;for(let V=0;V<=s;V++){let W=[],H=V/s,$=H*(t-e)+e;for(let ee=0;ee<=r;ee++){let te=ee/r,oe=te*l+a,ne=Math.sin(oe),ye=Math.cos(oe);w.x=$*ne,w.y=-H*n+f,w.z=$*ye,u.push(w.x,w.y,w.z),y.set(ne,E,ye).normalize(),d.push(y.x,y.y,y.z),p.push(te,1-H),W.push(m++)}_.push(W)}for(let V=0;V<r;V++)for(let W=0;W<s;W++){let H=_[W][V],$=_[W+1][V],ee=_[W+1][V+1],te=_[W][V+1];(e>0||W!==0)&&(h.push(H,$,te),T+=3),(t>0||W!==s-1)&&(h.push($,ee,te),T+=3)}c.addGroup(g,T,0),g+=T})(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new at(u,3)),this.setAttribute("normal",new at(d,3)),this.setAttribute("uv",new at(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},yl=class i extends ma{constructor(e=1,t=1,n=32,r=1,s=!1,o=0,a=2*Math.PI){super(0,e,t,n,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},er=class i extends Dt{constructor(e=[],t=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:r};let s=[],o=[];function a(d,p,m,_){let f=_+1,g=[];for(let v=0;v<=f;v++){g[v]=[];let y=d.clone().lerp(m,v/f),w=p.clone().lerp(m,v/f),T=f-v;for(let E=0;E<=T;E++)g[v][E]=E===0&&v===f?y:y.clone().lerp(w,E/T)}for(let v=0;v<f;v++)for(let y=0;y<2*(f-v)-1;y++){let w=Math.floor(y/2);y%2==0?(l(g[v][w+1]),l(g[v+1][w]),l(g[v][w])):(l(g[v][w+1]),l(g[v+1][w+1]),l(g[v+1][w]))}}function l(d){s.push(d.x,d.y,d.z)}function c(d,p){let m=3*d;p.x=e[m+0],p.y=e[m+1],p.z=e[m+2]}function h(d,p,m,_){_<0&&d.x===1&&(o[p]=d.x-1),m.x===0&&m.z===0&&(o[p]=_/2/Math.PI+.5)}function u(d){return Math.atan2(d.z,-d.x)}(function(d){let p=new B,m=new B,_=new B;for(let f=0;f<t.length;f+=3)c(t[f+0],p),c(t[f+1],m),c(t[f+2],_),a(p,m,_,d)})(r),(function(d){let p=new B;for(let m=0;m<s.length;m+=3)p.x=s[m+0],p.y=s[m+1],p.z=s[m+2],p.normalize().multiplyScalar(d),s[m+0]=p.x,s[m+1]=p.y,s[m+2]=p.z})(n),(function(){let d=new B;for(let m=0;m<s.length;m+=3){d.x=s[m+0],d.y=s[m+1],d.z=s[m+2];let _=u(d)/2/Math.PI+.5,f=(p=d,Math.atan2(-p.y,Math.sqrt(p.x*p.x+p.z*p.z))/Math.PI+.5);o.push(_,1-f)}var p;(function(){let m=new B,_=new B,f=new B,g=new B,v=new Ce,y=new Ce,w=new Ce;for(let T=0,E=0;T<s.length;T+=9,E+=6){m.set(s[T+0],s[T+1],s[T+2]),_.set(s[T+3],s[T+4],s[T+5]),f.set(s[T+6],s[T+7],s[T+8]),v.set(o[E+0],o[E+1]),y.set(o[E+2],o[E+3]),w.set(o[E+4],o[E+5]),g.copy(m).add(_).add(f).divideScalar(3);let V=u(g);h(v,E+0,m,V),h(y,E+2,_,V),h(w,E+4,f,V)}})(),(function(){for(let m=0;m<o.length;m+=6){let _=o[m+0],f=o[m+2],g=o[m+4],v=Math.max(_,f,g),y=Math.min(_,f,g);v>.9&&y<.1&&(_<.2&&(o[m+0]+=1),f<.2&&(o[m+2]+=1),g<.2&&(o[m+4]+=1))}})()})(),this.setAttribute("position",new at(s,3)),this.setAttribute("normal",new at(s.slice(),3)),this.setAttribute("uv",new at(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}},xl=class i extends er{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=1/n;super([-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-n,0,-r,n,0,r,-n,0,r,n,-r,-n,0,-r,n,0,r,-n,0,r,n,0,-n,0,-r,n,0,-r,-n,0,r,n,0,r],[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},zs=new B,ks=new B,mo=new B,Vs=new Li,Ml=class extends Dt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let r=Math.pow(10,4),s=Math.cos(Mr*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},p=[];for(let m=0;m<l;m+=3){o?(c[0]=o.getX(m),c[1]=o.getX(m+1),c[2]=o.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);let{a:_,b:f,c:g}=Vs;if(_.fromBufferAttribute(a,c[0]),f.fromBufferAttribute(a,c[1]),g.fromBufferAttribute(a,c[2]),Vs.getNormal(mo),u[0]=`${Math.round(_.x*r)},${Math.round(_.y*r)},${Math.round(_.z*r)}`,u[1]=`${Math.round(f.x*r)},${Math.round(f.y*r)},${Math.round(f.z*r)}`,u[2]=`${Math.round(g.x*r)},${Math.round(g.y*r)},${Math.round(g.z*r)}`,u[0]!==u[1]&&u[1]!==u[2]&&u[2]!==u[0])for(let v=0;v<3;v++){let y=(v+1)%3,w=u[v],T=u[y],E=Vs[h[v]],V=Vs[h[y]],W=`${w}_${T}`,H=`${T}_${w}`;H in d&&d[H]?(mo.dot(d[H].normal)<=s&&(p.push(E.x,E.y,E.z),p.push(V.x,V.y,V.z)),d[H]=null):W in d||(d[W]={index0:c[v],index1:c[y],normal:mo.clone()})}}for(let m in d)if(d[m]){let{index0:_,index1:f}=d[m];zs.fromBufferAttribute(a,_),ks.fromBufferAttribute(a,f),p.push(zs.x,zs.y,zs.z),p.push(ks.x,ks.y,ks.z)}this.setAttribute("position",new at(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},ga=class extends os{constructor(e){super(e),this.uuid=nr(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let r=e.holes[t];this.holes.push(new os().fromJSON(r))}return this}},Ip=function(i,e,t=2){let n=e&&e.length,r=n?e[0]*t:i.length,s=sh(i,0,r,t,!0),o=[];if(!s||s.next===s.prev)return o;let a,l,c,h,u,d,p;if(n&&(s=(function(m,_,f,g){let v=[],y,w,T,E,V;for(y=0,w=_.length;y<w;y++)T=_[y]*g,E=y<w-1?_[y+1]*g:m.length,V=sh(m,T,E,g,!1),V===V.next&&(V.steiner=!0),v.push(kp(V));for(v.sort(Fp),y=0;y<v.length;y++)f=Bp(v[y],f);return f})(i,e,s,t)),i.length>80*t){a=c=i[0],l=h=i[1];for(let m=t;m<r;m+=t)u=i[m],d=i[m+1],u<a&&(a=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);p=Math.max(c-a,h-l),p=p!==0?32767/p:0}return ls(s,o,t,a,l,p,0),o};function sh(i,e,t,n,r){let s,o;if(r===(function(a,l,c,h){let u=0;for(let d=l,p=c-h;d<c;d+=h)u+=(a[p]-a[d])*(a[d+1]+a[p+1]),p=d;return u})(i,e,t,n)>0)for(s=e;s<t;s+=n)o=ah(s,i[s],i[s+1],o);else for(s=t-n;s>=e;s-=n)o=ah(s,i[s],i[s+1],o);return o&&Ta(o,o.next)&&(hs(o),o=o.next),o}function tr(i,e){if(!i)return i;e||(e=i);let t,n=i;do if(t=!1,n.steiner||!Ta(n,n.next)&&Zt(n.prev,n,n.next)!==0)n=n.next;else{if(hs(n),n=e=n.prev,n===n.next)break;t=!0}while(t||n!==e);return e}function ls(i,e,t,n,r,s,o){if(!i)return;!o&&s&&(function(h,u,d,p){let m=h;do m.z===0&&(m.z=bl(m.x,m.y,u,d,p)),m.prevZ=m.prev,m.nextZ=m.next,m=m.next;while(m!==h);m.prevZ.nextZ=null,m.prevZ=null,(function(_){let f,g,v,y,w,T,E,V,W=1;do{for(g=_,_=null,w=null,T=0;g;){for(T++,v=g,E=0,f=0;f<W&&(E++,v=v.nextZ,v);f++);for(V=W;E>0||V>0&&v;)E!==0&&(V===0||!v||g.z<=v.z)?(y=g,g=g.nextZ,E--):(y=v,v=v.nextZ,V--),w?w.nextZ=y:_=y,y.prevZ=w,w=y;g=v}w.nextZ=null,W*=2}while(T>1)})(m)})(i,n,r,s);let a,l,c=i;for(;i.prev!==i.next;)if(a=i.prev,l=i.next,s?Up(i,n,r,s):Dp(i))e.push(a.i/t|0),e.push(i.i/t|0),e.push(l.i/t|0),hs(i),i=l.next,c=l.next;else if((i=l)===c){o?o===1?ls(i=Np(tr(i),e,t),e,t,n,r,s,2):o===2&&Op(i,e,t,n,r,s):ls(tr(i),e,t,n,r,s,1);break}}function Dp(i){let e=i.prev,t=i,n=i.next;if(Zt(e,t,n)>=0)return!1;let r=e.x,s=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=r<s?r<o?r:o:s<o?s:o,u=a<l?a<c?a:c:l<c?l:c,d=r>s?r>o?r:o:s>o?s:o,p=a>l?a>c?a:c:l>c?l:c,m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=p&&xr(r,a,s,l,o,c,m.x,m.y)&&Zt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Up(i,e,t,n){let r=i.prev,s=i,o=i.next;if(Zt(r,s,o)>=0)return!1;let a=r.x,l=s.x,c=o.x,h=r.y,u=s.y,d=o.y,p=a<l?a<c?a:c:l<c?l:c,m=h<u?h<d?h:d:u<d?u:d,_=a>l?a>c?a:c:l>c?l:c,f=h>u?h>d?h:d:u>d?u:d,g=bl(p,m,e,t,n),v=bl(_,f,e,t,n),y=i.prevZ,w=i.nextZ;for(;y&&y.z>=g&&w&&w.z<=v;){if(y.x>=p&&y.x<=_&&y.y>=m&&y.y<=f&&y!==r&&y!==o&&xr(a,h,l,u,c,d,y.x,y.y)&&Zt(y.prev,y,y.next)>=0||(y=y.prevZ,w.x>=p&&w.x<=_&&w.y>=m&&w.y<=f&&w!==r&&w!==o&&xr(a,h,l,u,c,d,w.x,w.y)&&Zt(w.prev,w,w.next)>=0))return!1;w=w.nextZ}for(;y&&y.z>=g;){if(y.x>=p&&y.x<=_&&y.y>=m&&y.y<=f&&y!==r&&y!==o&&xr(a,h,l,u,c,d,y.x,y.y)&&Zt(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;w&&w.z<=v;){if(w.x>=p&&w.x<=_&&w.y>=m&&w.y<=f&&w!==r&&w!==o&&xr(a,h,l,u,c,d,w.x,w.y)&&Zt(w.prev,w,w.next)>=0)return!1;w=w.nextZ}return!0}function Np(i,e,t){let n=i;do{let r=n.prev,s=n.next.next;!Ta(r,s)&&Oh(r,n,n.next,s)&&cs(r,s)&&cs(s,r)&&(e.push(r.i/t|0),e.push(n.i/t|0),e.push(s.i/t|0),hs(n),hs(n.next),n=i=s),n=n.next}while(n!==i);return tr(n)}function Op(i,e,t,n,r,s){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Vp(o,a)){let l=Fh(o,a);return o=tr(o,o.next),l=tr(l,l.next),ls(o,e,t,n,r,s,0),void ls(l,e,t,n,r,s,0)}a=a.next}o=o.next}while(o!==i)}function Fp(i,e){return i.x-e.x}function Bp(i,e){let t=(function(r,s){let o,a=s,l=-1/0,c=r.x,h=r.y;do{if(h<=a.y&&h>=a.next.y&&a.next.y!==a.y){let f=a.x+(h-a.y)*(a.next.x-a.x)/(a.next.y-a.y);if(f<=c&&f>l&&(l=f,o=a.x<a.next.x?a:a.next,f===c))return o}a=a.next}while(a!==s);if(!o)return null;let u=o,d=o.x,p=o.y,m,_=1/0;a=o;do c>=a.x&&a.x>=d&&c!==a.x&&xr(h<p?c:l,h,d,p,h<p?l:c,h,a.x,a.y)&&(m=Math.abs(h-a.y)/(c-a.x),cs(a,r)&&(m<_||m===_&&(a.x>o.x||a.x===o.x&&zp(o,a)))&&(o=a,_=m)),a=a.next;while(a!==u);return o})(i,e);if(!t)return e;let n=Fh(t,i);return tr(n,n.next),tr(t,t.next)}function zp(i,e){return Zt(i.prev,i,e.prev)<0&&Zt(e.next,i,i.next)<0}function bl(i,e,t,n,r){return(i=1431655765&((i=858993459&((i=252645135&((i=16711935&((i=(i-t)*r|0)|i<<8))|i<<4))|i<<2))|i<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=(e-n)*r|0)|e<<8))|e<<4))|e<<2))|e<<1))<<1}function kp(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function xr(i,e,t,n,r,s,o,a){return(r-o)*(e-a)>=(i-o)*(s-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(s-a)>=(r-o)*(n-a)}function Vp(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!(function(t,n){let r=t;do{if(r.i!==t.i&&r.next.i!==t.i&&r.i!==n.i&&r.next.i!==n.i&&Oh(r,r.next,t,n))return!0;r=r.next}while(r!==t);return!1})(i,e)&&(cs(i,e)&&cs(e,i)&&(function(t,n){let r=t,s=!1,o=(t.x+n.x)/2,a=(t.y+n.y)/2;do r.y>a!=r.next.y>a&&r.next.y!==r.y&&o<(r.next.x-r.x)*(a-r.y)/(r.next.y-r.y)+r.x&&(s=!s),r=r.next;while(r!==t);return s})(i,e)&&(Zt(i.prev,i,e.prev)||Zt(i,e.prev,e))||Ta(i,e)&&Zt(i.prev,i,i.next)>0&&Zt(e.prev,e,e.next)>0)}function Zt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Ta(i,e){return i.x===e.x&&i.y===e.y}function Oh(i,e,t,n){let r=Gs(Zt(i,e,t)),s=Gs(Zt(i,e,n)),o=Gs(Zt(t,n,i)),a=Gs(Zt(t,n,e));return r!==s&&o!==a||!(r!==0||!Hs(i,t,e))||!(s!==0||!Hs(i,n,e))||!(o!==0||!Hs(t,i,n))||!(a!==0||!Hs(t,e,n))}function Hs(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Gs(i){return i>0?1:i<0?-1:0}function cs(i,e){return Zt(i.prev,i,i.next)<0?Zt(i,e,i.next)>=0&&Zt(i,i.prev,e)>=0:Zt(i,e,i.prev)<0||Zt(i,i.next,e)<0}function Fh(i,e){let t=new Sl(i.i,i.x,i.y),n=new Sl(e.i,e.x,e.y),r=i.next,s=e.prev;return i.next=e,e.prev=i,t.next=r,r.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function ah(i,e,t,n){let r=new Sl(i,e,t);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function hs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Sl(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}var Ii=class i{static area(e){let t=e.length,n=0;for(let r=t-1,s=0;s<t;r=s++)n+=e[r].x*e[s].y-e[s].x*e[r].y;return .5*n}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],r=[],s=[];oh(e),lh(n,e);let o=e.length;t.forEach(oh);for(let l=0;l<t.length;l++)r.push(o),o+=t[l].length,lh(n,t[l]);let a=Ip(n,r);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}};function oh(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function lh(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var wl=class i extends Dt{constructor(e=new ga([new Ce(.5,.5),new Ce(-.5,.5),new Ce(-.5,-.5),new Ce(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],s=[];for(let a=0,l=e.length;a<l;a++)o(e[a]);function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled===void 0||t.bevelEnabled,p=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:p-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,f=t.bevelSegments!==void 0?t.bevelSegments:3,g=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:Hp,y,w,T,E,V,W=!1;g&&(y=g.getSpacedPoints(h),W=!0,d=!1,w=g.computeFrenetFrames(h,!1),T=new B,E=new B,V=new B),d||(f=0,p=0,m=0,_=0);let H=a.extractPoints(c),$=H.shape,ee=H.holes;if(!Ii.isClockWise($)){$=$.reverse();for(let L=0,A=ee.length;L<A;L++){let D=ee[L];Ii.isClockWise(D)&&(ee[L]=D.reverse())}}let te=Ii.triangulateShape($,ee),oe=$;for(let L=0,A=ee.length;L<A;L++){let D=ee[L];$=$.concat(D)}function ne(L,A,D){return A||console.error("THREE.ExtrudeGeometry: vec does not exist"),L.clone().addScaledVector(A,D)}let ye=$.length,ve=te.length;function Pe(L,A,D){let S,C,F,se=L.x-A.x,j=L.y-A.y,ae=D.x-L.x,ie=D.y-L.y,he=se*se+j*j,Se=se*ie-j*ae;if(Math.abs(Se)>Number.EPSILON){let xe=Math.sqrt(he),ge=Math.sqrt(ae*ae+ie*ie),Le=A.x-j/xe,ke=A.y+se/xe,We=((D.x-ie/ge-Le)*ie-(D.y+ae/ge-ke)*ae)/(se*ie-j*ae);S=Le+se*We-L.x,C=ke+j*We-L.y;let ze=S*S+C*C;if(ze<=2)return new Ce(S,C);F=Math.sqrt(ze/2)}else{let xe=!1;se>Number.EPSILON?ae>Number.EPSILON&&(xe=!0):se<-Number.EPSILON?ae<-Number.EPSILON&&(xe=!0):Math.sign(j)===Math.sign(ie)&&(xe=!0),xe?(S=-j,C=se,F=Math.sqrt(he)):(S=se,C=j,F=Math.sqrt(he/2))}return new Ce(S/F,C/F)}let Ae=[];for(let L=0,A=oe.length,D=A-1,S=L+1;L<A;L++,D++,S++)D===A&&(D=0),S===A&&(S=0),Ae[L]=Pe(oe[L],oe[D],oe[S]);let tt=[],z,U=Ae.concat();for(let L=0,A=ee.length;L<A;L++){let D=ee[L];z=[];for(let S=0,C=D.length,F=C-1,se=S+1;S<C;S++,F++,se++)F===C&&(F=0),se===C&&(se=0),z[S]=Pe(D[S],D[F],D[se]);tt.push(z),U=U.concat(z)}for(let L=0;L<f;L++){let A=L/f,D=p*Math.cos(A*Math.PI/2),S=m*Math.sin(A*Math.PI/2)+_;for(let C=0,F=oe.length;C<F;C++){let se=ne(oe[C],Ae[C],S);q(se.x,se.y,-D)}for(let C=0,F=ee.length;C<F;C++){let se=ee[C];z=tt[C];for(let j=0,ae=se.length;j<ae;j++){let ie=ne(se[j],z[j],S);q(ie.x,ie.y,-D)}}}let P=m+_;for(let L=0;L<ye;L++){let A=d?ne($[L],U[L],P):$[L];W?(E.copy(w.normals[0]).multiplyScalar(A.x),T.copy(w.binormals[0]).multiplyScalar(A.y),V.copy(y[0]).add(E).add(T),q(V.x,V.y,V.z)):q(A.x,A.y,0)}for(let L=1;L<=h;L++)for(let A=0;A<ye;A++){let D=d?ne($[A],U[A],P):$[A];W?(E.copy(w.normals[L]).multiplyScalar(D.x),T.copy(w.binormals[L]).multiplyScalar(D.y),V.copy(y[L]).add(E).add(T),q(V.x,V.y,V.z)):q(D.x,D.y,u/h*L)}for(let L=f-1;L>=0;L--){let A=L/f,D=p*Math.cos(A*Math.PI/2),S=m*Math.sin(A*Math.PI/2)+_;for(let C=0,F=oe.length;C<F;C++){let se=ne(oe[C],Ae[C],S);q(se.x,se.y,u+D)}for(let C=0,F=ee.length;C<F;C++){let se=ee[C];z=tt[C];for(let j=0,ae=se.length;j<ae;j++){let ie=ne(se[j],z[j],S);W?q(ie.x,ie.y+y[h-1].y,y[h-1].x+D):q(ie.x,ie.y,u+D)}}}function K(L,A){let D=L.length;for(;--D>=0;){let S=D,C=D-1;C<0&&(C=L.length-1);for(let F=0,se=h+2*f;F<se;F++){let j=ye*F,ae=ye*(F+1);b(A+S+j,A+C+j,A+C+ae,A+S+ae)}}}function q(L,A,D){l.push(L),l.push(A),l.push(D)}function G(L,A,D){M(L),M(A),M(D);let S=r.length/3,C=v.generateTopUV(n,r,S-3,S-2,S-1);O(C[0]),O(C[1]),O(C[2])}function b(L,A,D,S){M(L),M(A),M(S),M(A),M(D),M(S);let C=r.length/3,F=v.generateSideWallUV(n,r,C-6,C-3,C-2,C-1);O(F[0]),O(F[1]),O(F[3]),O(F[1]),O(F[2]),O(F[3])}function M(L){r.push(l[3*L+0]),r.push(l[3*L+1]),r.push(l[3*L+2])}function O(L){s.push(L.x),s.push(L.y)}(function(){let L=r.length/3;if(d){let A=0,D=ye*A;for(let S=0;S<ve;S++){let C=te[S];G(C[2]+D,C[1]+D,C[0]+D)}A=h+2*f,D=ye*A;for(let S=0;S<ve;S++){let C=te[S];G(C[0]+D,C[1]+D,C[2]+D)}}else{for(let A=0;A<ve;A++){let D=te[A];G(D[2],D[1],D[0])}for(let A=0;A<ve;A++){let D=te[A];G(D[0]+ye*h,D[1]+ye*h,D[2]+ye*h)}}n.addGroup(L,r.length/3-L,0)})(),(function(){let L=r.length/3,A=0;K(oe,A),A+=oe.length;for(let D=0,S=ee.length;D<S;D++){let C=ee[D];K(C,A),A+=C.length}n.addGroup(L,r.length/3-L,1)})()}this.setAttribute("position",new at(r,3)),this.setAttribute("uv",new at(s,2)),this.computeVertexNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return(function(t,n,r){if(r.shapes=[],Array.isArray(t))for(let s=0,o=t.length;s<o;s++){let a=t[s];r.shapes.push(a.uuid)}else r.shapes.push(t.uuid);return r.options=Object.assign({},n),n.extrudePath!==void 0&&(r.options.extrudePath=n.extrudePath.toJSON()),r})(this.parameters.shapes,this.parameters.options,e)}static fromJSON(e,t){let n=[];for(let s=0,o=e.shapes.length;s<o;s++){let a=t[e.shapes[s]];n.push(a)}let r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new pa[r.type]().fromJSON(r)),new i(n,e.options)}},Hp={generateTopUV:function(i,e,t,n,r){let s=e[3*t],o=e[3*t+1],a=e[3*n],l=e[3*n+1],c=e[3*r],h=e[3*r+1];return[new Ce(s,o),new Ce(a,l),new Ce(c,h)]},generateSideWallUV:function(i,e,t,n,r,s){let o=e[3*t],a=e[3*t+1],l=e[3*t+2],c=e[3*n],h=e[3*n+1],u=e[3*n+2],d=e[3*r],p=e[3*r+1],m=e[3*r+2],_=e[3*s],f=e[3*s+1],g=e[3*s+2];return Math.abs(a-h)<Math.abs(o-c)?[new Ce(o,1-l),new Ce(c,1-u),new Ce(d,1-m),new Ce(_,1-g)]:[new Ce(a,1-l),new Ce(h,1-u),new Ce(p,1-m),new Ce(f,1-g)]}},El=class i extends er{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2;super([-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},Tl=class i extends er{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},Al=class i extends Dt{constructor(e=.5,t=1,n=32,r=1,s=0,o=2*Math.PI){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:s,thetaLength:o},n=Math.max(3,n);let a=[],l=[],c=[],h=[],u=e,d=(t-e)/(r=Math.max(1,r)),p=new B,m=new Ce;for(let _=0;_<=r;_++){for(let f=0;f<=n;f++){let g=s+f/n*o;p.x=u*Math.cos(g),p.y=u*Math.sin(g),l.push(p.x,p.y,p.z),c.push(0,0,1),m.x=(p.x/t+1)/2,m.y=(p.y/t+1)/2,h.push(m.x,m.y)}u+=d}for(let _=0;_<r;_++){let f=_*(n+1);for(let g=0;g<n;g++){let v=g+f,y=v,w=v+n+1,T=v+n+2,E=v+1;a.push(y,w,E),a.push(w,T,E)}}this.setIndex(a),this.setAttribute("position",new at(l,3)),this.setAttribute("normal",new at(c,3)),this.setAttribute("uv",new at(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},Rl=class i extends Dt{constructor(e=new ga([new Ce(0,.5),new Ce(-.5,-.5),new Ce(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],r=[],s=[],o=[],a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(a,l,h),a+=l,l=0;function c(h){let u=r.length/3,d=h.extractPoints(t),p=d.shape,m=d.holes;Ii.isClockWise(p)===!1&&(p=p.reverse());for(let f=0,g=m.length;f<g;f++){let v=m[f];Ii.isClockWise(v)===!0&&(m[f]=v.reverse())}let _=Ii.triangulateShape(p,m);for(let f=0,g=m.length;f<g;f++){let v=m[f];p=p.concat(v)}for(let f=0,g=p.length;f<g;f++){let v=p[f];r.push(v.x,v.y,0),s.push(0,0,1),o.push(v.x,v.y)}for(let f=0,g=_.length;f<g;f++){let v=_[f],y=v[0]+u,w=v[1]+u,T=v[2]+u;n.push(y,w,T),l+=3}}this.setIndex(n),this.setAttribute("position",new at(r,3)),this.setAttribute("normal",new at(s,3)),this.setAttribute("uv",new at(o,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return(function(t,n){if(n.shapes=[],Array.isArray(t))for(let r=0,s=t.length;r<s;r++){let o=t[r];n.shapes.push(o.uuid)}else n.shapes.push(t.uuid);return n})(this.parameters.shapes,e)}static fromJSON(e,t){let n=[];for(let r=0,s=e.shapes.length;r<s;r++){let o=t[e.shapes[r]];n.push(o)}return new i(n,e.curveSegments)}},Ir=class i extends Dt{constructor(e=1,t=32,n=16,r=0,s=2*Math.PI,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new B,d=new B,p=[],m=[],_=[],f=[];for(let g=0;g<=n;g++){let v=[],y=g/n,w=0;g===0&&o===0?w=.5/t:g===n&&l===Math.PI&&(w=-.5/t);for(let T=0;T<=t;T++){let E=T/t;u.x=-e*Math.cos(r+E*s)*Math.sin(o+y*a),u.y=e*Math.cos(o+y*a),u.z=e*Math.sin(r+E*s)*Math.sin(o+y*a),m.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),f.push(E+w,1-y),v.push(c++)}h.push(v)}for(let g=0;g<n;g++)for(let v=0;v<t;v++){let y=h[g][v+1],w=h[g][v],T=h[g+1][v],E=h[g+1][v+1];(g!==0||o>0)&&p.push(y,w,E),(g!==n-1||l<Math.PI)&&p.push(w,T,E)}this.setIndex(p),this.setAttribute("position",new at(m,3)),this.setAttribute("normal",new at(_,3)),this.setAttribute("uv",new at(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},Cl=class i extends er{constructor(e=1,t=0){super([1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],[2,1,0,0,3,2,1,3,0,2,3,1],e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},us=class i extends Dt{constructor(e=1,t=.4,n=12,r=48,s=2*Math.PI){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);let o=[],a=[],l=[],c=[],h=new B,u=new B,d=new B;for(let p=0;p<=n;p++)for(let m=0;m<=r;m++){let _=m/r*s,f=p/n*Math.PI*2;u.x=(e+t*Math.cos(f))*Math.cos(_),u.y=(e+t*Math.cos(f))*Math.sin(_),u.z=t*Math.sin(f),a.push(u.x,u.y,u.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/r),c.push(p/n)}for(let p=1;p<=n;p++)for(let m=1;m<=r;m++){let _=(r+1)*p+m-1,f=(r+1)*(p-1)+m-1,g=(r+1)*(p-1)+m,v=(r+1)*p+m;o.push(_,f,v),o.push(f,g,v)}this.setIndex(o),this.setAttribute("position",new at(a,3)),this.setAttribute("normal",new at(l,3)),this.setAttribute("uv",new at(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},Pl=class i extends Dt{constructor(e=1,t=.4,n=64,r=8,s=2,o=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:r,p:s,q:o},n=Math.floor(n),r=Math.floor(r);let a=[],l=[],c=[],h=[],u=new B,d=new B,p=new B,m=new B,_=new B,f=new B,g=new B;for(let y=0;y<=n;++y){let w=y/n*s*Math.PI*2;v(w,s,o,e,p),v(w+.01,s,o,e,m),f.subVectors(m,p),g.addVectors(m,p),_.crossVectors(f,g),g.crossVectors(_,f),_.normalize(),g.normalize();for(let T=0;T<=r;++T){let E=T/r*Math.PI*2,V=-t*Math.cos(E),W=t*Math.sin(E);u.x=p.x+(V*g.x+W*_.x),u.y=p.y+(V*g.y+W*_.y),u.z=p.z+(V*g.z+W*_.z),l.push(u.x,u.y,u.z),d.subVectors(u,p).normalize(),c.push(d.x,d.y,d.z),h.push(y/n),h.push(T/r)}}for(let y=1;y<=n;y++)for(let w=1;w<=r;w++){let T=(r+1)*(y-1)+(w-1),E=(r+1)*y+(w-1),V=(r+1)*y+w,W=(r+1)*(y-1)+w;a.push(T,E,W),a.push(E,V,W)}function v(y,w,T,E,V){let W=Math.cos(y),H=Math.sin(y),$=T/w*y,ee=Math.cos($);V.x=E*(2+ee)*.5*W,V.y=E*(2+ee)*H*.5,V.z=E*Math.sin($)*.5}this.setIndex(a),this.setAttribute("position",new at(l,3)),this.setAttribute("normal",new at(c,3)),this.setAttribute("uv",new at(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}},Ll=class i extends Dt{constructor(e=new ua(new B(-1,-1,0),new B(-1,1,0),new B(1,1,0)),t=64,n=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:r,closed:s};let o=e.computeFrenetFrames(t,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new B,l=new B,c=new Ce,h=new B,u=[],d=[],p=[],m=[];function _(f){h=e.getPointAt(f/t,h);let g=o.normals[f],v=o.binormals[f];for(let y=0;y<=r;y++){let w=y/r*Math.PI*2,T=Math.sin(w),E=-Math.cos(w);l.x=E*g.x+T*v.x,l.y=E*g.y+T*v.y,l.z=E*g.z+T*v.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}(function(){for(let f=0;f<t;f++)_(f);_(s===!1?t:0),(function(){for(let f=0;f<=t;f++)for(let g=0;g<=r;g++)c.x=f/t,c.y=g/r,p.push(c.x,c.y)})(),(function(){for(let f=1;f<=t;f++)for(let g=1;g<=r;g++){let v=(r+1)*(f-1)+(g-1),y=(r+1)*f+(g-1),w=(r+1)*f+g,T=(r+1)*(f-1)+g;m.push(v,y,T),m.push(y,w,T)}})()})(),this.setIndex(m),this.setAttribute("position",new at(u,3)),this.setAttribute("normal",new at(d,3)),this.setAttribute("uv",new at(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new pa[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},Il=class extends Dt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],n=new Set,r=new B,s=new B;if(e.index!==null){let o=e.attributes.position,a=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let u=l[c],d=u.start;for(let p=d,m=d+u.count;p<m;p+=3)for(let _=0;_<3;_++){let f=a.getX(p+_),g=a.getX(p+(_+1)%3);r.fromBufferAttribute(o,f),s.fromBufferAttribute(o,g),ch(r,s,n)===!0&&(t.push(r.x,r.y,r.z),t.push(s.x,s.y,s.z))}}}else{let o=e.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){let h=3*a+c,u=3*a+(c+1)%3;r.fromBufferAttribute(o,h),s.fromBufferAttribute(o,u),ch(r,s,n)===!0&&(t.push(r.x,r.y,r.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new at(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function ch(i,e,t){let n=`${i.x},${i.y},${i.z}-${e.x},${e.y},${e.z}`,r=`${e.x},${e.y},${e.z}-${i.x},${i.y},${i.z}`;return t.has(n)!==!0&&t.has(r)!==!0&&(t.add(n),t.add(r),!0)}var Bm=Object.freeze({__proto__:null,BoxGeometry:Mi,CapsuleGeometry:vl,CircleGeometry:_l,ConeGeometry:yl,CylinderGeometry:ma,DodecahedronGeometry:xl,EdgesGeometry:Ml,ExtrudeGeometry:wl,IcosahedronGeometry:El,LatheGeometry:fa,OctahedronGeometry:Tl,PlaneGeometry:Ui,PolyhedronGeometry:er,RingGeometry:Al,ShapeGeometry:Rl,SphereGeometry:Ir,TetrahedronGeometry:Cl,TorusGeometry:us,TorusKnotGeometry:Pl,TubeGeometry:Ll,WireframeGeometry:Il});var Zn=class extends Ji{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new mt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new mt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new Ce(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Kn=class extends Zn{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ce(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return en(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new mt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new mt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new mt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};function Ws(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Gp(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Dr=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],s=t[n-1];t:{e:{let o;n:{i:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=r,r=t[++n],e<r)break e}o=t.length;break n}if(e>=s)break t;{let a=t[1];e<a&&(n=2,s=a);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(r=s,s=t[--n-1],e>=s)break e}o=n,n=0}}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(r=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)t[o]=n[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Dl=class extends Dr{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:lc,endingEnd:lc}}intervalChanged_(e,t,n){let r=this.parameterPositions,s=e-2,o=e+1,a=r[s],l=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case cc:s=e,a=2*t-n;break;case hc:s=r.length-2,a=t+r[s]-r[s+1];break;default:s=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case cc:o=e,l=2*n-t;break;case hc:o=1,l=n+r[1]-r[0];break;default:o=e-1,l=t}let c=.5*(n-t),h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=o*h}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,m=(n-t)/(r-t),_=m*m,f=_*m,g=-d*f+2*d*_-d*m,v=(1+d)*f+(-1.5-2*d)*_+(-.5+d)*m+1,y=(-1-p)*f+(1.5+p)*_+.5*m,w=p*f-p*_;for(let T=0;T!==a;++T)s[T]=g*o[h+T]+v*o[c+T]+y*o[l+T]+w*o[u+T];return s}},Ul=class extends Dr{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(r-t),u=1-h;for(let d=0;d!==a;++d)s[d]=o[c+d]*u+o[l+d]*h;return s}},Nl=class extends Dr{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Yn=class{constructor(e,t,n,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ws(t,this.TimeBufferType),this.values=Ws(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ws(e.times,Array),values:Ws(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(n.interpolation=r)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Nl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ul(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Dl(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ks:t=this.InterpolantFactoryMethodDiscrete;break;case Yo:t=this.InterpolantFactoryMethodLinear;break;case Ba:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0){if(e===this.DefaultInterpolation)throw new Error(n);this.setInterpolation(this.DefaultInterpolation)}return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ks;case this.InterpolantFactoryMethodLinear:return Yo;case this.InterpolantFactoryMethodSmooth:return Ba}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,s=0,o=r-1;for(;s!==r&&n[s]<e;)++s;for(;o!==-1&&n[o]>t;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!=0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,r=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(r!==void 0&&Gp(r))for(let a=0,l=r.length;a!==l;++a){let c=r[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Ba,s=e.length-1,o=1;for(let a=1;a<s;++a){let l=!1,c=e[a];if(c!==e[a+1]&&(a!==1||c!==e[0]))if(r)l=!0;else{let h=a*n,u=h-n,d=h+n;for(let p=0;p!==n;++p){let m=t[h+p];if(m!==t[u+p]||m!==t[d+p]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let h=a*n,u=o*n;for(let d=0;d!==n;++d)t[u+d]=t[h+d]}++o}}if(s>0){e[o]=e[s];for(let a=s*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=new this.constructor(this.name,e,t);return n.createInterpolant=this.createInterpolant,n}};Yn.prototype.TimeBufferType=Float32Array,Yn.prototype.ValueBufferType=Float32Array,Yn.prototype.DefaultInterpolation=Yo;var Yi=class extends Yn{constructor(e,t,n){super(e,t,n)}};Yi.prototype.ValueTypeName="bool",Yi.prototype.ValueBufferType=Array,Yi.prototype.DefaultInterpolation=Ks,Yi.prototype.InterpolantFactoryMethodLinear=void 0,Yi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ol=class extends Yn{};Ol.prototype.ValueTypeName="color";var Fl=class extends Yn{};Fl.prototype.ValueTypeName="number";var Bl=class extends Dr{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(r-t),c=e*a;for(let h=c+a;c!==h;c+=4)gn.slerpFlat(s,0,o,c-a,o,c,l);return s}},va=class extends Yn{InterpolantFactoryMethodLinear(e){return new Bl(this.times,this.values,this.getValueSize(),e)}};va.prototype.ValueTypeName="quaternion",va.prototype.InterpolantFactoryMethodSmooth=void 0;var Zi=class extends Yn{constructor(e,t,n){super(e,t,n)}};Zi.prototype.ValueTypeName="string",Zi.prototype.ValueBufferType=Array,Zi.prototype.DefaultInterpolation=Ks,Zi.prototype.InterpolantFactoryMethodLinear=void 0,Zi.prototype.InterpolantFactoryMethodSmooth=void 0;var zl=class extends Yn{};zl.prototype.ValueTypeName="vector";var kl=class{constructor(e,t,n){let r=this,s,o=!1,a=0,l=0,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){l++,o===!1&&r.onStart!==void 0&&r.onStart(h,a,l),o=!0},this.itemEnd=function(h){a++,r.onProgress!==void 0&&r.onProgress(h,a,l),a===l&&(o=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return s?s(h):h},this.setURLModifier=function(h){return s=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let p=c[u],m=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return m}return null}}},Wp=new kl,Vl=class{constructor(e){this.manager=e!==void 0?e:Wp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise((function(r,s){n.load(e,r,t,s)}))}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Vl.DEFAULT_MATERIAL_NAME="__DEFAULT";var zm=new ht,km=new B,Vm=new B;var Hm=new ht,Gm=new B,Wm=new B;var jm=new ht,Xm=new ht,qm=new ht;var Ym=new B,Zm=new gn,Km=new B,Jm=new B;var $m=new B,Qm=new gn,e0=new B,t0=new B;var $l="\\[\\]\\.:\\/",jp=new RegExp("["+$l+"]","g"),go="[^"+$l+"]",Xp="[^"+$l.replace("\\.","")+"]",qp=new RegExp("^"+/((?:WC+[\/:])*)/.source.replace("WC",go)+/(WCOD+)?/.source.replace("WCOD",Xp)+/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",go)+/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",go)+"$"),Yp=["material","materials","bones","map"],Xt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(jp,"")}static parseTrackName(e){let t=qp.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=n.nodeName.substring(r+1);Yp.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e)return void console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.materials)return void console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);e=e.material.materials;break;case"bones":if(!e.skeleton)return void console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.map)return void console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);e=e.material.map;break;default:if(e[n]===void 0)return void console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);e=e[n]}if(c!==void 0){if(e[c]===void 0)return void console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);e=e[c]}}let o=e[r];if(o===void 0){let c=t.nodeName;return void console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e)}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);if(!e.geometry.morphAttributes)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Xt.Composite=class{constructor(i,e,t){let n=t||Xt.parseTrackName(e);this._targetGroup=i,this._bindings=i.subscribe_(e,n)}getValue(i,e){this.bind();let t=this._targetGroup.nCachedObjects_,n=this._bindings[t];n!==void 0&&n.getValue(i,e)}setValue(i,e){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,r=t.length;n!==r;++n)t[n].setValue(i,e)}bind(){let i=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=i.length;e!==t;++e)i[e].bind()}unbind(){let i=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=i.length;e!==t;++e)i[e].unbind()}},Xt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Xt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Xt.prototype.GetterByBindingType=[Xt.prototype._getValue_direct,Xt.prototype._getValue_array,Xt.prototype._getValue_arrayElement,Xt.prototype._getValue_toArray],Xt.prototype.SetterByBindingTypeAndVersioning=[[Xt.prototype._setValue_direct,Xt.prototype._setValue_direct_setNeedsUpdate,Xt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Xt.prototype._setValue_array,Xt.prototype._setValue_array_setNeedsUpdate,Xt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Xt.prototype._setValue_arrayElement,Xt.prototype._setValue_arrayElement_setNeedsUpdate,Xt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Xt.prototype._setValue_fromArray,Xt.prototype._setValue_fromArray_setNeedsUpdate,Xt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var n0=new Float32Array(1);var hh=new ht,_a=class{constructor(e,t,n=0,r=1/0){this.ray=new xi(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new is,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return hh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(hh),this}intersectObject(e,t=!0,n=[]){return Hl(e,this,n,t),n.sort(uh),n}intersectObjects(e,t=!0,n=[]){for(let r=0,s=e.length;r<s;r++)Hl(e[r],this,n,t);return n.sort(uh),n}};function uh(i,e){return i.distance-e.distance}function Hl(i,e,t,n){let r=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(r=!1),r===!0&&n===!0){let s=i.children;for(let o=0,a=s.length;o<a;o++)Hl(s[o],e,t,!0)}}var ds=class{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(en(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var i0=new Ce;var r0=new B,s0=new B;var a0=new B;var o0=new B,l0=new ht,c0=new ht;var h0=new B,u0=new mt,d0=new mt;var p0=new B,f0=new B,m0=new B;var g0=new B,v0=new $i;var _0=new Ln;var y0=new B;var ya=class extends yi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170");var Bh={type:"change"},ec={type:"start"},kh={type:"end"},Aa=new xi,zh=new jn,Kp=Math.cos(70*wa.DEG2RAD),an=new B,In=2*Math.PI,Ft={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Ql=1e-6,Ra=class extends ya{constructor(e,t=null){super(e,t),this.state=Ft.NONE,this.enabled=!0,this.target=new B,this.cursor=new B,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Jn.ROTATE,MIDDLE:Jn.DOLLY,RIGHT:Jn.PAN},this.touches={ONE:li.ROTATE,TWO:li.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new B,this._lastQuaternion=new gn,this._lastTargetPosition=new B,this._quat=new gn().setFromUnitVectors(e.up,new B(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ds,this._sphericalDelta=new ds,this._scale=1,this._panOffset=new B,this._rotateStart=new Ce,this._rotateEnd=new Ce,this._rotateDelta=new Ce,this._panStart=new Ce,this._panEnd=new Ce,this._panDelta=new Ce,this._dollyStart=new Ce,this._dollyEnd=new Ce,this._dollyDelta=new Ce,this._dollyDirection=new B,this._mouse=new Ce,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=$p.bind(this),this._onPointerDown=Jp.bind(this),this._onPointerUp=Qp.bind(this),this._onContextMenu=of.bind(this),this._onMouseWheel=nf.bind(this),this._onKeyDown=rf.bind(this),this._onTouchStart=sf.bind(this),this._onTouchMove=af.bind(this),this._onMouseDown=ef.bind(this),this._onMouseMove=tf.bind(this),this._interceptControlDown=lf.bind(this),this._interceptControlUp=cf.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Bh),this.update(),this.state=Ft.NONE}update(e=null){let t=this.object.position;an.copy(t).sub(this.target),an.applyQuaternion(this._quat),this._spherical.setFromVector3(an),this.autoRotate&&this.state===Ft.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=In:n>Math.PI&&(n-=In),r<-Math.PI?r+=In:r>Math.PI&&(r-=In),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(an.setFromSpherical(this._spherical),an.applyQuaternion(this._quatInverse),t.copy(this.target).add(an),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=an.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){let a=new B(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;let c=new B(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=an.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Aa.origin.copy(this.object.position),Aa.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Aa.direction))<Kp?this.object.lookAt(this.target):(zh.setFromNormalAndCoplanarPoint(this.object.up,this.target),Aa.intersectPlane(zh,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>Ql||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Ql||this._lastTargetPosition.distanceToSquared(this.target)>Ql?(this.dispatchEvent(Bh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?In/60*this.autoRotateSpeed*e:In/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){an.setFromMatrixColumn(t,0),an.multiplyScalar(-e),this._panOffset.add(an)}_panUp(e,t){this.screenSpacePanning===!0?an.setFromMatrixColumn(t,1):(an.setFromMatrixColumn(t,0),an.crossVectors(this.object.up,an)),an.multiplyScalar(e),this._panOffset.add(an)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let r=this.object.position;an.copy(r).sub(this.target);let s=an.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/n.clientHeight,this.object.matrix),this._panUp(2*t*s/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),r=e-n.left,s=t-n.top,o=n.width,a=n.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(In*this._rotateDelta.x/t.clientHeight),this._rotateUp(In*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(In*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-In*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(In*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-In*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(n*n+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),r=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(In*this._rotateDelta.x/t.clientHeight),this._rotateUp(In*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Ce,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Jp(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function $p(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Qp(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(kh),this.state=Ft.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function ef(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Jn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Ft.DOLLY;break;case Jn.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Ft.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Ft.ROTATE}break;case Jn.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Ft.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Ft.PAN}break;default:this.state=Ft.NONE}this.state!==Ft.NONE&&this.dispatchEvent(ec)}function tf(i){switch(this.state){case Ft.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Ft.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Ft.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function nf(i){this.enabled===!1||this.enableZoom===!1||this.state!==Ft.NONE||(i.preventDefault(),this.dispatchEvent(ec),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(kh))}function rf(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function sf(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case li.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Ft.TOUCH_ROTATE;break;case li.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Ft.TOUCH_PAN;break;default:this.state=Ft.NONE}break;case 2:switch(this.touches.TWO){case li.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Ft.TOUCH_DOLLY_PAN;break;case li.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Ft.TOUCH_DOLLY_ROTATE;break;default:this.state=Ft.NONE}break;default:this.state=Ft.NONE}this.state!==Ft.NONE&&this.dispatchEvent(ec)}function af(i){switch(this._trackPointer(i),this.state){case Ft.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Ft.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Ft.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Ft.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Ft.NONE}}function of(i){this.enabled!==!1&&i.preventDefault()}function lf(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function cf(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var kt=Math.PI/180,tn=i=>i<539?20:20+.3*Math.min(1,(i-539)/427),Or=i=>26+13*i+29*Math.pow(i,6.5);function hf(i){let e=c=>i.has(c),t=new Set,n=new Set,r=e("LE")||e("RE"),s=e("LF")||e("RF"),o=e("LFs")||e("RFs"),a=e("REb"),l=(e("R1")||e("R2"))&&!e("BF");return(e("T")||e("L1"))&&t.add("P"),l&&t.add("C"),e("R1")&&t.add("Bv"),(e("L2")||l)&&t.add("Ev"),(r||s||o||a)&&t.add("Fs"),(r||s||a)&&t.add("F"),(r||a)&&t.add("E"),a&&t.add("LEb"),e("A")&&n.add("Gs"),e("R")&&n.add(e("R3")?"RV":"NV"),{closed:t,moved:n}}var $n={RB:tn,rootY:592,floorS:1127.5,JOINTS:["mp","neck","upper","lower","bell"],jointOf:i=>i<113?"neck":i<539?"upper":i<962?"lower":"bell",APART:{mp:[-66,0,-62],neck:[-42,0,0],upper:0,lower:0,bell:[56,0,0]},reach:[60,60],mix:[250,700],shadow:{half:240,cz:-24},label:"3D bass clarinet",capsules:i=>[{id:"body",a:i(118),b:i(978),r:19.6},{id:"bell",a:i(1e3,0,68),b:i(850,0,96),r:28}],refl:(i,e)=>[{obj:i.upper,a:e(120,0,0),u:e(1,0,0),r:20,L:419},{obj:i.lower,a:e(539,0,0),u:e(1,0,0),r:20.15,L:427}],VIEWS:{front:{az:-26,el:6},left:{az:90,el:5},back:{az:180,el:5},right:{az:-90,el:5},keys:{az:-12,el:5,x:[246,748],zoom:!0},mouth:{az:-90,el:8,x:[40,190],zoom:!0},lh:{az:-14,el:6,x:[240,600],zoom:!0},rh:{az:12,el:5,x:[540,760],zoom:!0},bell:{az:-40,el:12,x:[740,1142],zoom:!0}},linkage:hf,CHIP_LIST:[["T","LT","Thumb plate"],["R","LT","Register",!0],["A","L1","A",!0],["Gs","L1","G\u266F",!0],["L1","L1","E"],["L2","L2","D"],["Eb","L2","E\u266D / B\u266D",!0],["L3","L3","C"],["LCs","L4","C\u266F / G\u266F",!0],["LF","L4","F / C",!0],["LFs","L4","F\u266F / C\u266F",!0],["LE","L4","E / B",!0],["S1","R1","Side 1",!0],["S2","R1","Side 2",!0],["S3","R1","Side 3",!0],["S4","R1","Side 4",!0],["R1","R1","B\u266D"],["R2","R2","A"],["BF","R2","B / F\u266F",!0],["R3","R3","G"],["RFs","R4","F\u266F / C\u266F",!0],["RE","R4","E / B",!0],["RGs","R4","G\u266F / D\u266F",!0],["RF","R4","F / C",!0],["REb","R4","Low E\u266D",!0]],PICK_LIST:{T:["Thumb plate","LT"],R:["Register key","LT"],A:["A key","L1"],Gs:["G\u266F key","L1"],L1:["First finger plate (E), with the half-hole vent","L1"],L2:["Second finger plate (D)","L2"],Eb:["E\u266D / B\u266D key","L2"],L3:["Third finger plate (C)","L3"],LCs:["C\u266F / G\u266F key","L4"],LF:["F / C lever","L4"],LFs:["F\u266F / C\u266F lever","L4"],LE:["E / B lever","L4"],S1:["Side key 1","R1"],S2:["Side key 2","R1"],S3:["Side key 3","R1"],S4:["Side key 4","R1"],R1:["First finger plate (B\u266D)","R1"],R2:["Second finger plate (A)","R2"],BF:["B / F\u266F key","R2"],R3:["Third finger plate (G)","R3"],RFs:["F\u266F / C\u266F key","R4"],RE:["E / B key","R4"],RGs:["G\u266F / D\u266F key","R4"],RF:["F / C key","R4"],REb:["Low E\u266D key","R4"],P:["G cup (closed by the thumb plate or the first finger)",""],Ev:["E cup (closed by the second finger, or by the right hand)",""],C:["B\u266D cup (closed by the right hand's first or second finger)",""],Bv:["Vent cup (closed by the right first finger)",""],Fs:["F\u266F / C\u266F pad",""],F:["F / C pad",""],E:["E / B pad",""],LEb:["Low E\u266D pad, on the bell",""],RV:["Register vent on the body (opens with the right third finger down)",""],NV:["Register vent on the neck (opens with the right third finger up)",""]},staticName(i,e,t,n){return i==="mp"?e==="reed"?"Reed":e==="lig"?"Ligature":e==="cork"?"Tenon cork":"Mouthpiece":i==="neck"?"Neck":i==="bell"?e==="ebonite"?"Floor peg tip":n<-20&&e==="silver"?"Floor peg":e==="silver"?"Bell ring":"Bell":e==="cork"?"Tenon cork":e==="ebonite"||e==="rest"?"Thumb rest":e==="silver"?t<128?"Neck socket":Math.abs(t-539)<8?"Joint ring":n<-19&&(Math.abs(t-578)<7||Math.abs(t-470)<7)?"Strap ring":"Rod and posts":i==="upper"?"Upper joint":"Lower joint"}};function Vh(i){let{THREE:e,V3:t,AX:n,AY:r,AZ:s,clamp:o,smooth:a,sweep:l,lathe:c,place:h,spline:u,densify:d,rad:p,nrm:m,tan:_,wrap:f,wrapTh:g,ball:v,plateGeo:y,withUV:w,X:T,disc:E,rodSeg:V,cupH:W,cupGeo:H,padGeo:$,seatGeo:ee,lever:te,leverP:oe,plate:ne,flat:ye,tearXY:ve,capPad:Pe,leverZ:Ae,dense:tt,initRods:z,M:U,joints:P,statics:K,add:q,addTo:G,plain:b,fingers:M,reflCups:O,mkPart:L,partAdd:A,chooseSign:D,onRod:S,sleeve:C,cupOn:F,cupArm:se,openCup:j,rocker:ae}=i,ie=(Y,ue,x=0)=>t(Y,x,ue),he=(Y,ue,x=2.7,I=5.4)=>{let N=I/2;return h(c([[-N,0],[-N,x-.75],[-N+.2,x-.3],[-N+.65,x],[N-.65,x],[N-.2,x-.3],[N,x-.75],[N,0]],{segs:32,crease:50}),Y,ue)},Se=(Y,ue,x,I={})=>{let N=m(ue),X=p(Y,ue,tn(Y)-.4),k=p(Y,ue,x).distanceTo(X),J=I.r||2.45,me=k+.5,pe=[[0,0],[0,3.6],[.35,3.55],[.7,3.15],[1.05,2.7],[1.5,J+.05],[me,J]];for(let we=1;we<=8;we++){let Te=we/8*Math.PI/2;pe.push([me+1.7*Math.sin(Te),J*Math.cos(Te)])}return[h(c(pe,{segs:32,crease:60}),X,N)]},xe=(Y,ue,x=1.25)=>[h(c([[0,0],[0,x],[.12,x],[.2,x-.12],[.2,0]],{segs:20,crease:40}),Y,ue)],ge=(Y,ue)=>{q("silver",V(Y.a,Y.b,Y.r));for(let x of ue){let I=Y.at(x),N=Math.max(2.3,Y.r+.85);if(q("silver",...Se(x,Y.th,Math.hypot(I.y,I.z),{axis:Y.dir,r:N})),Math.abs(x-Y.s0)<.01||Math.abs(x-Y.s1)<.01){let X=Y.dir.clone().multiplyScalar(Math.abs(x-Y.s0)<.01?-1:1),k=I.clone().addScaledVector(X,N-.02);q("silver",...xe(k,X));let J=m(Y.th),me=X.clone().cross(J).normalize(),pe=new e.BoxGeometry(.45,.4,2.3),we=new e.Matrix4().makeBasis(me,X,J);we.setPosition(k.clone().addScaledVector(X,.14)),pe.applyMatrix4(we),q("dark",pe)}}},Le=Y=>2.6+.07*Y,ke=Y=>.09*Y,We=Y=>Le(Y)+ke(Y),ze=(Y,ue,x)=>{let I=[[.3,ue-.75],[0,ue-.3],[.3,ue],[Y-x,ue]];for(let N=1;N<=8;N++){let X=N/8*Math.PI/2;I.push([Y-x+x*Math.sin(X),ue-x+x*Math.cos(X)])}return I},nt=Y=>(Math.sqrt(Y*Y+.0144)-.12)/(Math.sqrt(1.0144)-.12),Be=Y=>{let ue=Le(Y),x=1,I=Y-x,N=ze(ue,Y,x);for(let X=1;X<=14;X++){let k=1-X/14;N.push([ue+ke(Y)*(1-nt(k)),I*k])}return c(N,{segs:72,crease:28})},gt=(Y,ue,x)=>q("wood",h(c([[-7,x*.78],[-1.15,x*.78],[-.85,x*.72],[-.85,x*.6]],{segs:48,crease:40}),Y.clone(),ue)),qe=Y=>{let ue=Math.min(Y.sh,tn(Y.s)-Math.sqrt(Math.max(1,tn(Y.s)*tn(Y.s)-.36*Y.r*Y.r))+.95);return Y.sh=ue,Y.seat=p(Y.s,Y.th,tn(Y.s)+ue),Y},Qe=(Y,ue)=>(qe(Y),Y.geo=Be,Y.top=Y.seat.clone().addScaledVector(Y.n,We(Y.r)),ue||gt(Y.seat,Y.n,Y.r),Y),ut=i.cupTh,Tt=(Y,ue,x,I)=>Qe(ut(Y,ue,x),I),At=(Y,ue,x)=>Qe(i.cupAt(Y,ue,x)),Vt=Y=>[Math.atan2(Y.y,Y.z)/kt,Math.hypot(Y.y,Y.z),Y.x],_n=(Y,ue,x,I,N,X,k={})=>{let J=Math.hypot(I[0]-x[0],I[1]-x[1]),me=46,pe=40,we=(k.wf||.3)*J,Te=k.thick||2.3,be=k.tn||1,De=k.back||.45,ce=Ze=>Math.sqrt(Math.max(0,1-Math.pow((we-Ze)/we,2))),Me=Ze=>(1+Math.cos(Math.PI*o((Ze-we)/(J-we),0,1)))/2,Q=[],Ee=[],Ue=[];for(let Ze=0;Ze<=me;Ze++){let ot=J*Math.pow(Ze/me,1.5);Q.push(Y(x[0]+(I[0]-x[0])*ot/J,x[1]+(I[1]-x[1])*ot/J)),Ee.push(ot<=we?N/2*ce(ot):X/2+(N-X)/2*Me(ot)),Ue.push(ot<=we?Te*Math.pow(ce(ot),.85):be+(Te-be)*Me(ot))}let de=l(Q,1,{up:ue,segs:pe}),Ve=de.attributes.position,je=Q[me].clone().sub(Q[0]).normalize(),Ne=je.clone().cross(ue).normalize(),Xe=pe+1;for(let Ze=0;Ze<=me;Ze++)for(let ot=0;ot<=pe;ot++){let lt=ot/pe*Math.PI*2,ct=Math.cos(lt),xt=Math.sin(lt),ft=Q[Ze].clone().addScaledVector(ue,ct*Ue[Ze]*(ct>=0?1:De)).addScaledVector(Ne,xt*Ee[Ze]);Ve.setXYZ(Ze*Xe+ot,ft.x,ft.y,ft.z)}de.computeVertexNormals();let $e=de.attributes.normal;for(let Ze=0;Ze<=me;Ze++){let ot=Ze*Xe,lt=ot+pe,ct=t($e.getX(ot)+$e.getX(lt),$e.getY(ot)+$e.getY(lt),$e.getZ(ot)+$e.getZ(lt)).normalize();$e.setXYZ(ot,ct.x,ct.y,ct.z),$e.setXYZ(lt,ct.x,ct.y,ct.z)}for(let Ze=0;Ze<=pe;Ze++)$e.setXYZ(Ze,-je.x,-je.y,-je.z);return de},Yt=(Y,ue,x,I={})=>{let N=Y.length,X=I.segs||40,k=X+1,J=[0];for(let Q=1;Q<N;Q++)J[Q]=J[Q-1]+Y[Q].distanceTo(Y[Q-1]);let me=J[N-1],pe=l(Y,1,{up:ue,segs:X,capB:!!I.cap}),we=pe.attributes.position,Te=t(),be=t(),De=x(0,me).hw<1e-6,ce=null;for(let Q=0;Q<N;Q++){let Ee=Y[Math.min(N-1,Q+1)].clone().sub(Y[Math.max(0,Q-1)]).normalize();if(!Q)Te.copy(ue).addScaledVector(Ee,-ue.dot(Ee)).normalize(),be.copy(Ee);else{let $e=ce.clone().cross(Ee),Ze=$e.length();Ze>1e-9&&Te.applyAxisAngle($e.divideScalar(Ze),Math.atan2(Ze,ce.dot(Ee))),Te.addScaledVector(Ee,-Te.dot(Ee)).normalize()}ce=Ee;let Ue=Ee.clone().cross(Te),de=x(J[Q],me),Ve=2/(de.sq||2),je=de.ridge||0,Ne=de.off||0,Xe=de.roll?Te.clone().multiplyScalar(Math.cos(de.roll)).addScaledVector(Ue,Math.sin(de.roll)):Te;if(de.aim&&de.aw>0){let $e=de.aim.clone().addScaledVector(Ee,-de.aim.dot(Ee)).normalize();Xe=Xe.clone().lerp($e,de.aw).normalize()}(de.roll||de.aim&&de.aw>0)&&(Ue=Ee.clone().cross(Xe));for(let $e=0;$e<=X;$e++){let Ze=$e/X*Math.PI*2,ot=Math.cos(Ze),lt=Math.sin(Ze),ct=Math.sign(ot)*Math.pow(Math.abs(ot),Ve),xt=Math.sign(lt)*Math.pow(Math.abs(lt),Ve),ft=Y[Q].clone().addScaledVector(Xe,ct>=0?ct*(de.hf+je*(1-xt*xt)):ct*de.hb).addScaledVector(Ue,Ne+xt*de.hw);we.setXYZ(Q*k+$e,ft.x,ft.y,ft.z)}if(I.cap&&Q===N-1){let $e=Y[Q].clone().addScaledVector(Xe,(de.hf-de.hb)/2).addScaledVector(Ue,Ne);we.setXYZ(N*k,$e.x,$e.y,$e.z);for(let Ze=0;Ze<=X;Ze++)we.setXYZ(N*k+1+Ze,we.getX(Q*k+Ze),we.getY(Q*k+Ze),we.getZ(Q*k+Ze))}}pe.computeVertexNormals();let Me=pe.attributes.normal;for(let Q=0;Q<N;Q++){let Ee=Q*k,Ue=Ee+X,de=t(Me.getX(Ee)+Me.getX(Ue),Me.getY(Ee)+Me.getY(Ue),Me.getZ(Ee)+Me.getZ(Ue)).normalize();Me.setXYZ(Ee,de.x,de.y,de.z),Me.setXYZ(Ue,de.x,de.y,de.z)}if(De)for(let Q=0;Q<=X;Q++)Me.setXYZ(Q,-be.x,-be.y,-be.z);if(x(me,me).hw<1e-6){let Q=Y[N-1].clone().sub(Y[N-2]).normalize();for(let Ee=0;Ee<=X;Ee++)Me.setXYZ((N-1)*k+Ee,Q.x,Q.y,Q.z)}return pe},re=(Y,ue)=>{let x=[],I=1,N=0;for(let X of ue){for(;I<Y.length-1&&N+Y[I].distanceTo(Y[I-1])<X;)N+=Y[I].distanceTo(Y[I-1]),I++;let k=Y[I].distanceTo(Y[I-1])||1;x.push(Y[I-1].clone().lerp(Y[I],o((X-N)/k,0,1)))}return x},pn=(Y,ue,x=.7)=>{let I=[];for(let N=0;N<=14;N++)I.push(ue*Math.pow(N/14,1.7));for(let N=ue+x;N<Y;N+=x)I.push(N);return I.push(Y),I},ei=(Y,ue,x,I=4.4,N={})=>{let X=N.rise!=null?N.rise:ke(Y.r),k=N.pow||1,J=N.k0||0,me=ue-Y.th;for(;me>180;)me-=360;for(;me<-180;)me+=360;let pe=_(Y.th).multiplyScalar(Math.sign(me)||1),we=de=>Y.top.clone().addScaledVector(pe,Y.r*de).addScaledVector(Y.n,-.1-X*Math.pow(Math.min(de,.9),k)),Te=we(1.07).addScaledVector(Y.n,-.45),be=Math.atan2(Te.y,Te.z)/kt,De=Math.hypot(Te.y,Te.z),ce=Y.th+me-be;for(;ce>180;)ce-=360;for(;ce<-180;)ce+=360;let Me=[we(J),we(J+(.9-J)/3),we(J+2*(.9-J)/3),we(.9),Te];for(let de=1;de<=6;de++){let Ve=de/6;Me.push(p(Y.s,be+ce*Ve,Math.max(tn(Y.s)+1.5,De+(x+.8-De)*a(0,1,Ve))))}let Q=u(Me,60),Ee=dn(Q),Ue=Y.r*(1-J);return Yt(re(Q,pn(Ee,.01,.5)),Y.n,de=>({hw:de<.02?0:de<Ue?.75*a(0,1.4,de)+.75*de/Ue:1.5+(I/2-1.5)*a(Ue,Ee,de),hf:.22+.5*a(0,Ue,de),hb:.3+.45*a(0,.6*Ue,de),ridge:.55*a(.2*Ue,1.1*Ue,de),sq:4}),{segs:24,cap:!0})},zt=(Y,ue,x,I={})=>{let N=S(Y,x,ue.s,{angle:I.angle||6,out:ue.n,anchor:ue.top.clone(),size:ue.r,restUp:!0});F(N,ue);let X=x.at(ue.s);return A(N,"key",ei(ue,x.th,Math.hypot(X.y,X.z),I.w||4,I.arm),C(x,...I.tube||[ue.s-3.4,ue.s+3.4])),D(N,ue.seat,ue.n),N},on=(Y,ue)=>{let x=0;for(let N=1;N<Y.length;N++){let X=Y[N].distanceTo(Y[N-1]);if(x+X>=ue)return{p:Y[N-1].clone().lerp(Y[N],(ue-x)/X),T:Y[N].clone().sub(Y[N-1]).normalize()};x+=X}let I=Y.length;return{p:Y[I-1].clone(),T:Y[I-1].clone().sub(Y[I-2]).normalize()}},dn=Y=>{let ue=0;for(let x=1;x<Y.length;x++)ue+=Y[x].distanceTo(Y[x-1]);return ue},ln=(Y,ue,x,I,N)=>{let{p:X,T:k}=on(Y,ue);return h(c([[-x/2,I],[-x/2,N-.35],[-x/2+.35,N],[x/2-.35,N],[x/2,N-.35],[x/2,I]],{segs:72,crease:30}),X,k)},yn=Y=>t(Y.z,0,-Y.x),ti=(()=>{let Y=[[0,113]],ue=0,x=113,I=0,N=J=>{ue-=Math.sin(I*kt)*J,x-=Math.cos(I*kt)*J,Y.push([ue,x])},X=J=>{let me=Math.ceil(J/1.2);for(let pe=0;pe<me;pe++)N(J/me)},k=(J,me)=>{let pe=Math.ceil(Math.abs(me)/2.5);for(let we=0;we<pe;we++)I+=me/pe/2,N(J*Math.abs(me)/pe*kt),I+=me/pe/2};return X(6),k(38,152),X(10),k(46,-82),X(26),{P:d(Y.map(([J,me])=>ie(me,J)),1.2),end:ie(x,ue),axis:ie(Math.cos(I*kt),Math.sin(I*kt))}})(),cn=ti.P,xn=dn(cn),hn=Y=>12.75-3.5*Math.pow(Math.min(1,Y/(xn-14)),1.35);G("neck","neck",l(cn,Y=>hn(Y),{segs:72})),G("neck","neck",T(c([[112.5,12.4],[136,12.4],[136.4,12],[136.4,9.6]],{segs:48,crease:40}))),G("neck","dark",h(E(9.6),t(136.5,0,0),n),h(E(9.4),on(cn,xn-.2).p.addScaledVector(ti.axis,-.3),on(cn,xn).T)),G("neck","silver",b(T(c([[100.6,13.2],[100.6,15.5],[101,15.95],[112.5,15.95],[113,15.5],[113,12.4]],{segs:72,crease:30}))),b(ln(cn,92,1.7,10.4,hn(92)+.75)));{let Y=on(cn,xn),ue=hn(xn);G("neck","neck",h(c([[-13.8,ue-.3],[-13.8,ue+.5],[-13.6,13.2],[-13.3,13.75],[-12.9,14.15],[-12.4,14.75],[-11.6,14.95],[-10.8,14.75],[-.4,14.75],[0,14.35],[0,10]],{segs:72,crease:30}),Y.p,Y.T))}{K.mp.cork.length=0,K.mp.dark.length=0,K.mp.ebonite.splice(1);{let N=T(c([[70.6,14.05],[71,13.7],[71,9.2],[69,9.2]],{segs:56,crease:40})),X=N.attributes.position;for(let k=0;k<X.count;k++)X.getZ(k)<-9.4&&X.setZ(k,-9.4);N.computeVertexNormals(),G("mp","ebonite",N)}let Y=[1.5,1.3,1.3],ue=ti.axis,x=ie(-ue.z,ue.x),I=new e.Matrix4().makeBasis(ue.clone().multiplyScalar(Y[0]),r.clone().multiplyScalar(Y[1]),x.multiplyScalar(Y[2]));I.setPosition(ti.end.clone().addScaledVector(ue,-71*Y[0]));for(let N of Object.values(K.mp))for(let X of N)X.applyMatrix4(I)}U.wood.color.set(2368294),U.wood.map=null,U.wood.envMapIntensity=1.05,U.wood.roughness=.6;let Mn=T(c(tt([[120,13.2],[120,19.7],[120.3,20],[538.8,20],[539,19.85],[539,13]],2),{segs:96,crease:40}));Mn.userData.tube=!0,G("upper","wood",Mn);let Vn=T(c(tt([[539,13],[539,19.85],[539.2,20],[965.7,20.3],[966,20],[966,17.2],[983.6,17.2],[984,16.8],[984,12]],2),{segs:96,crease:40}));Vn.userData.tube=!0,G("lower","wood",Vn),G("lower","cork",T(c([[969.5,17.2],[969.5,17.5],[980.5,17.5],[980.5,17.2]],{segs:48,crease:40}))),G("lower","dark",h(E(12),t(984.1,0,0),n)),G("upper","silver",b(T(c([[112.8,12.6],[112.8,20.4],[113.2,21.1],[115,21.2],[115.2,20.9],[115.5,21.15],[116.6,21.15],[116.8,20.9],[117.1,21.35],[125.6,21.35],[126,20.95],[126,20.1]],{segs:96,crease:30})))),G("upper","dark",T(c([[112.9,12.6],[137,12.6],[137,9.5]],{segs:40,crease:40}))),G("upper","silver",b(h(c([[0,0],[0,2.6],[.4,3],[4.6,3],[5,2.6],[5,0]],{segs:24,crease:40}),t(119,20.6,0),r)),b(h(c([[0,0],[0,1.3],[3.2,1.3],[3.4,3.6],[3.8,4],[5.6,4],[6.1,3.4],[6.3,0]],{segs:32,crease:40}),t(119,25.4,0),r))),G("lower","silver",b(T(c([[533.5,19.9],[533.5,20.65],[533.65,20.95],[534,21.15],[534.45,21.12],[534.7,20.95],[534.9,20.85],[536.5,21],[539,21.06],[541.5,21],[543.1,20.85],[543.3,20.95],[543.55,21.12],[544,21.15],[544.35,20.95],[544.5,20.65],[544.5,19.9]],{segs:96,crease:30}))));{let Y=[],ue=[];for(let ce=0;ce<=12;ce++)Y.push(ie(972+28*ce/12,0)),ue.push(21.25);for(let ce=1;ce<=52;ce++){let Me=(180-180*ce/52)*kt;Y.push(ie(1e3+34*Math.sin(Me),34+34*Math.cos(Me))),ue.push(21.25+4.75*a(.05,1,ce/52))}let I=ce=>ie(1e3-182*ce,68+14*ce+30*Math.pow(ce,2.3));for(let ce=1;ce<=92;ce++){let Me=ce/92;Y.push(I(Me)),ue.push(Or(Me))}G("bell","tube",l(Y,ue,{segs:128}));let N=[],X=[];for(let ce=3;ce<=92;ce++){let Me=ce/92;N.push(I(Me)),X.push(Or(Me)-1.1)}let k=l(N,X,{segs:128,inside:!0});{let Me=new Float32Array(k.attributes.position.count*3);for(let Q=0;Q<k.attributes.position.count;Q++){let Ee=(3+Math.floor(Q/129))/92,Ue=.05+.95*Math.pow(a(0,.97,Ee),1.9),de=1-a(.62,1,Ee);Me[Q*3]=Ue,Me[Q*3+1]=Ue*(1-.12*de),Me[Q*3+2]=Ue*(1-.34*de)}k.setAttribute("color",new e.BufferAttribute(Me,3))}G("bell","tube",k),G("bell","dark",h(E(Or(3/92)-1),I(3/92),I(.05).sub(I(.03)).normalize()));let J=I(1),me=I(1).sub(I(.985)).normalize(),pe=Or(1),we=[];for(let ce=0;ce<=32;ce++){let Me=(-205+320*ce/32)*kt;we.push([.4+2.6*Math.sin(Me),pe-.6+2.6*Math.cos(Me)])}G("bell","tube",h(c(we,{segs:160,crease:80}),J,me));let Te=[];for(let ce=0;ce<=92;ce++)Te.push(I(ce/92));G("bell","silver",b(ln(Te,11,5.2,24,Or(.06)+1.15)),b(ln(Te,19,1.4,24,Or(.104)+.8))),G("bell","silver",b(T(c([[957.6,20.4],[957.6,21.3],[958,21.75],[960,21.75],[960.2,21.4],[960.5,21.6],[961.5,21.6],[961.7,21.4],[962,21.85],[977.4,21.85],[978,21.3],[978,20.6]],{segs:96,crease:30})))),G("bell","dark",T(c([[957.7,20.4],[957.7,17.6],[985,17.6],[985,12]],{segs:40,crease:40})));let be=-29.5,De=990;G("bell","silver",b(h(c([[-1,0],[-1,6.4],[-.4,7],[17.4,7],[18,6.4],[18,0]],{segs:40,crease:35}),ie(De,be),n)),b(l([ie(De+3.5,be+5.5),ie(De+3.5,-19.5)],1,{up:n,scaleN:2.4,scaleB:4.4,sq:4,segs:16,capA:!0,capB:!0})),b(l([ie(De+14,be+5.5),ie(De+14,-19.8)],1,{up:n,scaleN:2.4,scaleB:4.4,sq:4,segs:16,capA:!0,capB:!0})),b(h(c([[0,0],[0,3.3],[136,3.3],[136,0]],{segs:28,crease:40}),ie(De-14,be),n)),b(h(c([[0,0],[0,1.4],[5.5,1.4],[5.8,4.4],[6.3,4.9],[9.2,4.9],[9.8,4.2],[10,0]],{segs:40,crease:40}),ie(De+8.5,be,6.4),r.clone()))),G("bell","ebonite",h(c([[0,0],[0,4.4],[1.2,5.6],[4,6.3],[11,6.9],[14.6,6.9],[16.4,6.1],[17,4.6],[17,0]],{segs:40,crease:50}),ie(1110,be),n))}{let Y=ue=>(x,I,N)=>t(I,-x,-(tn(I)+(typeof ue=="function"?ue(x,I):ue)+N));q("rest",y([[-4.8,584],[4.8,584],[5.2,597],[-5.2,597]],[0,590.5],Y(.5),{thick:1.6,dome:.1,edge:.2})),q("ebonite",y([[-5.2,595],[5.2,595],[8,598.4],[10,603],[9.4,606.4],[0,608],[-9.4,606.4],[-10,603],[-8,598.4]],[0,601.5],Y((ue,x)=>1+11*Math.pow(a(595,609,x),1.4)+.02*ue*ue),{thick:3,dome:0,edge:.3}));for(let ue of[587.4,592.6])q("silver",h(c([[0,0],[0,1.3],[.5,1.3],[.75,1],[.75,0]],{segs:16,crease:40}),p(ue,180,tn(ue)+1),m(180)));for(let ue of[578,470]){let x=new e.TorusGeometry(4,1.05,14,40);x.rotateX(Math.PI/2),x.translate(ue,0,-(tn(ue)+5.4)),q("silver",x,h(c([[0,0],[0,3.2],[.5,3],[.9,2],[2.2,1.5],[2.2,0]],{segs:20,crease:40}),p(ue,180,tn(ue)-.2),m(180)))}}let et=z({LU:{th:-72,R:25.6,s0:304,s1:498,r:1.7},LL:{th:-72,R:25.9,s0:552,s1:690,r:1.7},Th:{th:222,R:24.2,s0:351,s1:375,r:1.3},Gs:{th:44,R:24.6,s0:288,s1:344,r:1.5},Eb:{th:66,R:24,s0:389,s1:437,r:1.3},Cs:{th:-58,R:23.8,s0:492,s1:520,r:1.3},Rg:{th:30,lift:3.4,s0:699,s1:723,r:1.2},Pd:{th:42,lift:5,s0:729,s1:950,r:1.7},Lk0:{th:66,lift:4.6,s0:604,s1:722,r:1.5},Lk:{th:80,lift:4.2,s0:609,s1:727,r:1.5},Lk2:{th:94,lift:4,s0:614,s1:944,r:1.5},BF_:{th:-60,lift:3.4,s0:715,s1:850,r:1.1},BEb:{th:-73,lift:3.4,s0:726,s1:946,r:1.1},BE:{th:-86,lift:3.4,s0:711.5,s1:926,r:1.1},BFs:{th:-100,lift:3.4,s0:698,s1:776,r:1.1}});ge(et.LU,[304,364,430,498]),ge(et.LL,[552,608,629,690]),ge(et.Th,[351,375],{ball:2}),ge(et.Gs,[288,344]),ge(et.Eb,[389,437],{ball:2}),ge(et.Cs,[492,520],{ball:2}),ge(et.Rg,[699,723],{ball:1.9}),ge(et.Pd,[729,809,884,950]),ge(et.Lk0,[604,660,722]),ge(et.Lk,[609,665,727]),ge(et.Lk2,[614,700,820,944]),ge(et.BFs,[698,776]),ge(et.BE,[711.5,815,926]),ge(et.BF_,[715,850]),ge(et.BEb,[726,835,946]);let bn=4.4,Sn=.32,Bi=(Y,ue)=>{let I=Y-.8-1,N=ue?1.8:0,X=ze(bn,Y,.8);X.push([bn,I+.5]);for(let k=0;k<=12;k++){let J=N+(I-N)*(1-k/12);X.push([bn-Sn*Math.pow(1-Math.pow(J/I,2),1),J])}return ue&&X.push([bn-Sn-.32,1.15],[bn-Sn-.4,1.1],[bn-2.8,1.1]),c(X,{segs:72,crease:28})},Wt=(Y,ue,x,I,N,X={})=>{let k=qe(ut(ue,x,I));k.top=k.seat.clone().addScaledVector(k.n,bn-Sn),gt(k.seat,k.n,I);let J=S(Y,N,x,{angle:X.angle||3,out:k.n,anchor:k.top.clone(),size:I,restUp:!0});A(J,"key",h(Bi(I,X.vent),k.seat.clone(),k.n)),A(J,"pad",h($(I),k.seat.clone(),k.n)),q("wood",h(ee(I),k.seat.clone(),k.n)),q("dark",h(E(I*.5),k.seat.clone().addScaledVector(k.n,-1.55),k.n)),J.cups.push(k),O.push({p:J,c:k});let me=N.at(x),pe=Math.hypot(me.y,me.z);if(A(J,"key",ei(k,N.th,pe,X.w||4.8,{rise:-Sn,pow:2,k0:X.vent?.34:0}),C(N,...X.tube||[x-5.6,x+5.6])),X.vent){A(J,"dark",h(E(1.1),k.seat.clone().addScaledVector(k.n,bn-2.7),k.n));let we=w(h(c([[0,3.3],[.5,3.2],[.85,2.2],[1,0]],{segs:32}),k.seat.clone().addScaledVector(k.n,bn-Sn-.1),k.n));we.translate(-J.pivot.x,-J.pivot.y,-J.pivot.z);let Te=new e.Mesh(we,new e.MeshStandardMaterial({color:16777215,roughness:.55,metalness:0,transparent:!0,opacity:0,depthWrite:!1}));Te.visible=!1,Te.name="finger:"+Y,Te.renderOrder=1,J.group.add(Te),M.push({id:Y,mesh:Te,mat:Te.material,s:x,a:0,to:0,show:be=>be.has(Y)&&!be.has("HH")})}return D(J,k.seat,k.n),J};Wt("L1",0,378,10.4,et.LU,{vent:!0,tube:[366.8,386.4]}),Wt("L2",0,418,10.4,et.LU,{tube:[406.9,427.2]}),Wt("L3",0,452,10.6,et.LU,{tube:[432.8,495.2]}),Wt("R1",0,596,10.8,et.LL,{tube:[581,605.2]}),Wt("R2",0,641,10.8,et.LL,{tube:[631.8,651.5]}),Wt("R3",0,678,11.2,et.LL,{tube:[665.5,687.2]}),Wt("T",180,363,8.6,et.Th,{w:4.2,tube:[353.6,372.4]});{let Y=Tt(0,394.9,7.7);Y.geo=ue=>Bi(ue),Y.top=Y.seat.clone().addScaledVector(Y.n,bn-Sn),zt("Ev",Y,et.LU,{angle:3.2,w:4.4,tube:[386.9,406.4],arm:{rise:-Sn,pow:2}})}zt("Bv",Tt(0,621.8,8.1),et.LL,{angle:3.2,w:4.4,tube:[610.8,626.2]}),zt("C",Tt(4,566,8.4),et.LL,{angle:6,w:4.4,tube:[554.8,580.5]}),zt("P",Tt(5,329,7),et.LU,{angle:5,w:4.4,tube:[306.8,361.2]});{let I=f(-8.6,308,4.8),N=f(14.6,308,4.8);q("silver",V(I,N,1.25),...Se(308,g(-8.6,308,4.8),Math.hypot(I.y,I.z),{axis:N.clone().sub(I)}),...Se(308,g(14.6,308,4.8),Math.hypot(N.y,N.z),{axis:N.clone().sub(I)}));let X=7.7,k=At(3.4,279.5,X),J=ve([3.4,364.4],[3.4,338.5],11.4,3.6,.34),me=ne(J.pts,8.6,{c:J.centre,thick:2.3,dome:.55,edge:.3,NT:128,NR:12,NE:10}),pe=te([[3.4,280,k.sh+We(X)+.25],[3.4,290,6.3],[3.4,305,6.1],[3.4,311,6.3],[3.4,320,6.9],[3.4,331,7.6],[3.4,341.5,8.2]],3.4,1.7,{taper:(Te,be)=>.22+.78*a(0,.1,Te/be)}),we=ae("A",{pivot:f(3.4,308,4.8),axis:r.clone(),angle:6,s:308,size:5},[me,pe,V(f(3.4-4.6,308,4.8),f(3.4+4.6,308,4.8),1.95)],f(3.4,355,9.8),m(0));F(we,k),A(we,"key",h(c([[0,0],[0,1.8],[.9,1.8],[1.2,1.4],[1.2,0]],{segs:18,crease:40}),f(3.4,295,6.4),m(g(3.4,295,6))))}{let Y=et.Gs,ue=6.7,x=At(-10.2,295,ue),I=tn(294),N=46,X=Math.tan(N*kt),k=l(u([p(295,x.th,I+x.sh+We(ue)+.25),p(294.6,x.th+12,I+7),p(294,8,I+9),p(294,30,I+7.4),p(294,Y.th,Y.R)],30),(Me,Q)=>.3+.7*a(0,.35,Me/Q),{up:n,scaleN:2.2,scaleB:.8,sq:3,segs:14,capA:!0,capB:!0}),J=ve([27.4,383],[20.6,337],11.8,4,.3),me=J.centre,pe=11.6,we=Me=>pe-X*(Me-me[0]),Te=_n((Me,Q)=>t(Q,Me,we(Me)),m(N),[27.4,383],[20.6,337],11.8,4,{thick:1.7,tn:1,wf:.3,back:.6}),be=Y.at(339),De=Ae([[be.y,339,be.z],[19.2,338,17],[21.2,341,we(21.2)-.7],[22.6,349,we(22.6)-.8]],4.2,1.9,N),ce=ae("Gs",{pivot:Y.at(294),angle:5.5,s:294,size:5},[k,Te,De,C(Y,Y.s0+1.6,Y.s1-1.6)],t(me[1],me[0],pe).addScaledVector(m(N),1.9),m(N));F(ce,x)}{let Y=et.Eb,ue=Tt(92,413,5.2),x=u([Y.at(434.8),f(19.4,435.1,4.4),f(14,435.2,4.9),f(7,435,5.2),f(0,434.6,5.3),f(-5.5,434.2,5.2)],120),I=dn(x),N=Yt(re(x,pn(I,.01,.5)),m(Y.th),k=>{let J=k/I,me=Math.pow(Math.max(0,Math.sin(Math.PI*Math.pow(Math.min(J,.86)/.86*.8,.8))),.7),pe=J>.86?Math.sqrt(Math.max(0,1-Math.pow((J-.86)/.14,2))):1;return{hw:Math.max(k>I-.02?0:.2,Math.max(1.45*(1-a(.2,.5,J)),2.75*me)*pe),hf:.9*Math.pow(pe,.3),hb:.8*Math.pow(pe,.3),ridge:.3*me,sq:3.6}},{segs:32}),X=ae("Eb",{pivot:Y.at(ue.s),angle:5,s:ue.s,size:3},[N,C(Y,Y.s0+1.6,Y.s1-1.6),ei(ue,Y.th,Y.R,3.6)],f(3,434.6,6.4),m(g(3,434.6,5)));F(X,ue)}{let Y=et.LL,ue=u([Y.at(659.2),f(-15.5,659.4,3.7),f(-10,659.7,4.5),f(-3,660.1,5),f(4,660.6,5.1),f(9,661,4.9)],120),x=dn(ue),I=19,N=Yt(re(ue,pn(x,.01,.4)),m(Y.th),X=>{let k=o((X-(x-I))/I,0,1),J=k<.68?Math.pow(Math.sin(Math.PI/2*k/.68),1.3):Math.sqrt(Math.max(0,1-Math.pow((k-.68)/.32,2)));return{hw:X>x-.02?0:Math.max(.03,1.3*(k<.68?1:J)+1.3*J*(k<.68?1:0)+(k>=.68?1.3*J:0)),hf:.75*(k<.68?1:Math.pow(J,.4)),hb:.75*(k<.68?1:Math.pow(J,.4)),ridge:.45*J,sq:3}},{segs:32});ae("BF",{pivot:Y.at(659),angle:4,s:659,size:2.6},[N,C(Y,652,665)],f(2,660.4,6.4),m(g(2,660.4,5)))}{let Y=(N,X,k,J)=>{let me=p(N,X,J),pe=p(N,k,J),we=pe.clone().sub(me).normalize(),Te=(X+k)/2,be=J*Math.cos((k-X)/2*kt);q("silver",V(me,pe,1),...Se(N,X,J,{r:2.4}),...Se(N,k,J,{r:2.4}),...xe(me.clone().addScaledVector(we,-2.45),we.clone().negate(),1.3),...xe(pe.clone().addScaledVector(we,2.45),we,1.3));let De=ce=>p(N,ce,be/Math.cos((ce-Te)*kt));return{ax:we,at:De,tube:(ce,Me,Q=2.2)=>{let Ee=De(ce),Ue=De(Me),de=Ee.distanceTo(Ue);return h(c([[0,1],[0,Q-.3],[.3,Q],[de-.3,Q],[de,Q-.3],[de,1]],{segs:28,crease:40}),Ee,Ue.clone().sub(Ee).normalize())}}},ue=(N,X,k)=>q("silver",...Se(N,X,k-2.2,{r:2})),x=(N,X,k,J,me,pe,we,Te)=>{let be=X.n,De=p(k[0][2],k[0][0],k[0][1]),ce=De.clone().sub(X.top);ce.addScaledVector(be,-ce.dot(be)).normalize();let Me=X.top,Q=p(J.s0,J.th,J.R),Ee=p(J.s1,J.th,J.R+1.1),Ue=J.hw||2.3,de=[Me.clone().addScaledVector(be,.3),Me.clone().addScaledVector(ce,X.r*.5).addScaledVector(be,.3),Me.clone().addScaledVector(ce,X.r*.9).addScaledVector(be,0),Me.clone().addScaledVector(ce,X.r*1.15).addScaledVector(be,-.6),...k.map(([dt,Lt,St])=>p(St,dt,Lt)),Q,Q.clone().lerp(Ee,.5),Ee],Ve=u(de,500),je=dn(Ve),Ne=0;{let dt=1e9,Lt=0;for(let St=1;St<Ve.length;St++){Lt+=Ve[St].distanceTo(Ve[St-1]);let Ke=Ve[St].distanceTo(Q);Ke<dt&&(dt=Ke,Ne=Lt)}}let Xe=je-.5*J.w,$e=X.r*1.5,Ze=[];for(let dt=0;dt<=12;dt++)Ze.push($e*Math.pow(dt/12,1.7));for(let dt=$e+.6;dt<je-4;dt+=.6)Ze.push(dt);for(let dt=0;dt<=16;dt++)Ze.push(je-4*Math.pow(1-dt/16,1.6));let ot=m(J.face),ct=[Yt(re(Ve,Ze),be,dt=>{let Lt=a(Ne-8,Ne+4,dt),St=dt>Xe?Math.sqrt(Math.max(0,1-Math.pow((dt-Xe)/(je-Xe),2))):1,Ke=Ue*(.12+.88*a(0,1.5*X.r,dt)),R=Math.max(.12,(Ke+(J.w/2-Ue)*Lt)*St),Z=Math.max(.15,Math.pow(St,.2));return{hw:R,hf:.9*Z,hb:.9*Z,sq:5.5,aim:ot,aw:.7*a(Ne-40,Ne-4,dt)}},{segs:40}),me.tube(Te[0],Te[1])],xt=me.at(we),ft=Q.clone().lerp(Ee,.45),Pt=Math.min(5,3.2/Math.max(1,ft.distanceTo(xt))/kt),jt=ae(N,{pivot:xt,axis:me.ax.clone(),angle:Pt,s:pe,joint:"upper",size:4},ct,ft.clone().addScaledVector(ot,1.6),ot);return F(jt,X),jt};x("S1",Tt(-64,252,5.2),[[-74,24.8,261],[-82,24.5,273],[-86,24.4,288],[-86,24.4,400],[-86,24.4,472],[-86,26.6,486],[-84.5,27.6,505],[-80,28.6,521],[-74.5,29.7,536]],{th:-70,R:30.5,s0:547.5,s1:558,w:8.2,face:-62,hw:2.5},Y(286,-64,-108,24.2),286,-85.5,[-70.6,-101.4]),x("S2",Tt(-104,300,5),[[-110,24.7,307],[-115,24.5,318],[-116,24.4,332],[-116,24.4,400],[-116,24.4,470],[-116,28,486],[-116,30.2,500],[-113,30.4,515],[-105,30.8,530],[-97,31,542],[-90,31.4,552],[-85,31.8,558]],{th:-78,R:32,s0:562,s1:571.5,w:7.6,face:-70,hw:2.4},Y(388,-101,-134,23.8),388,-116,[-107.2,-127.8]);for(let[N,X]of[[340,-86],[400,-86],[460,-86],[330,-116],[450,-116]])ue(N,X,23.4);let I=Y(548,-95,-139,24.2);x("S3",Tt(-110,526,4.6),[[-108,24.4,534],[-108,24.4,553],[-106,24.9,560],[-100,26.4,565.5],[-93,28.6,569.5],[-88,31,572.5]],{th:-85,R:33.5,s0:575.5,s1:585,w:7.2,face:-77,hw:2.3},I,548,-108,[-101,-115.3]),x("S4",Tt(-126,524.5,4.6),[[-124,24.6,532],[-124,24.6,556],[-123,24.8,565],[-117,26,574],[-108,28.2,580.5],[-100,31,585],[-95,33.6,587.5]],{th:-92,R:35,s0:589,s1:597.5,w:6.8,face:-84,hw:2.3},I,548,-124,[-116.7,-132.5])}{let x=p(322,180,tn(322)+3.6),I=t(322,5.2,-(tn(322)+3.6)),N=t(322,-11.4,-(tn(322)+3.6-2.6));q("silver",V(I,N,1.2),...Se(322,180-Math.atan2(5.2,tn(322)+3.6)/kt,Math.hypot(I.y,I.z),{axis:N.clone().sub(I)}),...Se(322,180+Math.atan2(11.4,tn(322)+3.6-2.6)/kt,Math.hypot(N.y,N.z),{axis:N.clone().sub(I)}));let X=(R,Z,fe)=>t(R,Z,-(tn(R)+fe)),k=(R,Z,fe)=>{let le=[];for(let Fe=Z;Math.abs(Fe-fe)>.3;Fe+=Math.sign(fe-Z)*.6)le.push(R(Fe));return le.push(R(fe)),le},J=k(R=>X(R,.4,3.4+2.6*a(326,351,R)),323.2,353),me=dn(J),pe=Yt(J,m(180),R=>{let Z=R/me,fe=Z<.7?a(.1,.7,Z):Math.sqrt(Math.max(0,1-Math.pow((Z-.7)/.3,2))),le=Z<.7?1:Math.pow(fe,.35);return{hw:R>me-.02?0:Math.max(.05,Z<.7?2.5+2.75*fe:5.25*fe),hf:1*le,hb:1*le,ridge:.2+.7*(Z<.7,fe),sq:4}},{segs:32});ae("R",{pivot:x,axis:r.clone(),angle:5,s:322,size:4.5},[pe,V(t(322,2.4,x.z),t(322,-1.6,x.z),1.85)],p(344,180,tn(344)+6.6),m(180));let we=Tt(180,284,5.6),Te=we.sh+We(5.6),be=k(R=>X(R,-3.4*a(298,321,R),R>290?3.5+(Te-.1-3.5)*a(312,291,R):Te-.1-ke(5.6)*Math.min(.9,(R-284)/5.6)),322.6,284),De=dn(be),ce=Yt(be,m(180),R=>{let Z=De-R,fe=Math.min(1,Z/5.6);return{hw:Z<.02?0:.75*a(0,1.4,Z)+1*fe+.75*a(6,De,Z),hf:.25+.75*a(0,5,Z),hb:.3+.7*a(0,4,Z),ridge:.3*a(.5,5,Z),sq:4.5}},{segs:24}),Me=L("RV",{pivot:x,axis:r.clone(),angle:5,s:322,joint:"upper",out:m(180),anchor:we.top.clone(),size:5});A(Me,"key",ce,V(t(322,-1.9,x.z),t(322,-6.6,x.z),1.85)),F(Me,we),D(Me,we.seat,we.n),q("silver",h(c([[-2,2.2],[1.4,2.2],[1.55,2],[1.55,1.4]],{segs:20,crease:40}),p(we.s,180,tn(we.s)),m(180)));let Q=-142,Ee=22.9;q("silver",V(p(321,Q,Ee),p(131,Q,Ee),1.1),...Se(300,Q,Ee,{r:2.3}),...Se(258,Q,Ee,{r:2.3}),...Se(215,Q,Ee,{r:2.3}),...Se(173,Q,Ee,{r:2.3}),...Se(131,Q,Ee,{r:2.3}),l(u([p(321,Q,Ee),p(322,-150,Ee+.2),N.clone()],12),1,{up:n,scaleN:1.7,scaleB:.8,sq:4,segs:14,capA:!0,capB:!0})),G("upper","silver",l(u([p(131,Q,Ee+.6),p(121,-122,23.3),p(113.4,-104,23.4),t(110.6,-19.4,-1.6)],30),1,{up:n,scaleN:2.6,scaleB:.95,sq:4,segs:16,capA:!0,capB:!0}));let Ue=xn-54,de=Ue-27,Ve=5.8,je=R=>yn(on(cn,R).T).negate(),Ne=(R,Z)=>{let fe=on(cn,R);return fe.p.addScaledVector(yn(fe.T).negate(),hn(R)+Z)},Xe=on(cn,Ue),$e=je(Ue),Ze=hn(Ue),ot=Xe.p.clone().addScaledVector($e,Ze+1.7),lt=ot.clone().addScaledVector($e,We(Ve));G("neck","silver",h(c([[-1.5,4.3],[1.9,4.3],[2.2,4],[2.2,3.1]],{segs:28,crease:40}),Xe.p.clone().addScaledVector($e,Ze),$e)),G("neck","dark",h(E(3.1),Xe.p.clone().addScaledVector($e,Ze+1.5),$e));let ct=Ne(de,2.2),xt=t(107.6,-21,-.6),ft=L("NV",{pivot:ct,axis:r.clone(),angle:3.2,s:ct.x,joint:"neck",out:$e,anchor:lt.clone(),size:5}),Pt=Xe.T.clone().negate(),jt=[0,.4,.8].map(R=>lt.clone().addScaledVector(Pt,Ve*R).addScaledVector($e,-.1-ke(Ve)*R));jt.push(lt.clone().addScaledVector(Pt,Ve*1.15).addScaledVector($e,-.3),Ne(Ue-Ve-5,2.4));for(let R=Ue-Ve-9;R>40;R-=4)jt.push(Ne(R,R>de?2.2:1.9));for(let[R,Z,fe]of[[36,.12,1.9],[30,.4,2.1],[24,.72,2.4],[18,.93,2.6],[13.5,1,2.6]]){let le=on(cn,R),Fe=je(R).lerp(r.clone().negate(),Z).normalize();jt.push(le.p.addScaledVector(Fe,hn(R)+fe))}jt.push(t(103.2,-19.8,-.4),xt.clone().add(t(-3.2,0,0)));let dt=u(jt,260),Lt=dn(dt),St=Ve*1.1;A(ft,"key",Yt(re(dt,pn(Lt,.01,.6)),$e,R=>({hw:R<.02?0:R<St?.1+1.4*Math.pow(R/St,.75):1.5,hf:.25+.8*a(0,5,R),hb:.3+.75*a(0,4,R),ridge:.4*a(1,5,R)*(1-a(St+16,St+26,R)),sq:4,aim:r.clone().negate(),aw:a(Lt-52,Lt-22,R)}),{segs:24,cap:!0}),l([xt.clone().add(t(-4,0,0)),xt.clone().add(t(4,0,0))],1,{up:r,scaleN:.65,scaleB:3,sq:4,segs:20,capA:!0,capB:!0}),V(ct.clone().add(t(0,-4.2,0)),ct.clone().add(t(0,4.2,0)),1.9,18),h(Be(Ve),ot.clone(),$e)),A(ft,"pad",h($(Ve),ot.clone(),$e)),D(ft,ot,$e);let Ke=(R,Z,fe)=>h(c([[0,0],[0,fe],[.25,fe],[.5,fe*.85],[.8,fe*.5],[.9,0]],{segs:20,crease:50}),R,Z);{let R=on(cn,de),Z=je(de);G("neck","silver",V(ct.clone().add(t(0,-6,0)),ct.clone().add(t(0,6,0)),1,12));for(let fe of[-1,1]){let le=R.p.clone().add(t(0,fe*6,0));G("neck","silver",V(le.clone().addScaledVector(Z,hn(de)-2.2),le.clone().addScaledVector(Z,hn(de)+3.4),1.9,16),Ke(le.clone().addScaledVector(Z,hn(de)+3.4),Z,1.9),Ke(ct.clone().add(t(0,fe*6,0)).add(t(0,fe*1.9,0)),t(0,fe,0),1.2))}}{let Z=on(cn,62),fe=je(62);for(let le of[-1,1]){let Fe=Z.p.clone().add(t(0,le*2.5,0));G("neck","silver",V(Fe.clone().addScaledVector(fe,hn(62)-.8),Fe.clone().addScaledVector(fe,hn(62)+3.2),.85,12),Ke(Fe.clone().addScaledVector(fe,hn(62)+3.2),fe,.95))}}}{let ue=Math.sin(42*kt),x=Math.cos(42*kt),I=m(42),N=_(42),X=26.4,k=(ce,Me=X,Q=42)=>(Me-ce*Math.sin(Q*kt))/Math.cos(Q*kt),J=(ce,Me,Q=X,Ee=42)=>t(Me,ce,k(ce,Q,Ee)),me=X-4.6,pe=(ce,Me,Q=me)=>t(ce,0,0).addScaledVector(I,Q).addScaledVector(N,Me),we=ce=>(ce-X*ue)/x,Te=(ce,Me,Q)=>{let Ee=Q.lean*kt,Ue=Math.sign(Ee)||1,de=Math.abs(Ee),Ve=Q.Lh,je=Ve+Q.ext,Ne=.31*Ve,Xe=Q.w,$e=1.95,Ze=.95,ot=.8,lt=Q.sTop+je*Math.cos(Ee)+Q.rho*Math.sin(de),ct=[Me+Ue*Q.rho*(1-Math.cos(de)),lt-Q.rho*Math.sin(de)],xt=lt-Q.rho*Math.sin(de)-Q.ext*Math.cos(Ee),ft=Q.th,Pt=Q.rd.at(Q.sEnd),jt=Je=>X+Q.dz*(1-a(xt-6,lt+46,Je)),dt=Je=>ft+(42-ft)*a(xt-6,lt+46,Je),Lt=(Je,He)=>J(Je,He,jt(He),dt(He)),St=[];for(let Je=je;Je>.01;Je-=.5)St.push(Lt(ct[0]+Math.sin(Ee)*Je,ct[1]-Math.cos(Ee)*Je));for(let Je=0,He=Math.max(2,Math.ceil(de*Q.rho/.5));Je<=He;Je++){let Ie=de*(1-Je/He);St.push(Lt(Me+Ue*Q.rho*(1-Math.cos(Ie)),lt-Q.rho*Math.sin(Ie)))}let Ke=u([St[St.length-1],Lt(Me,lt+10),Lt(Me,lt+22),...lt+30<540?[Lt(Me,(lt+22+548)/2)]:[],Lt(Me,548),J(Me,Q.sPin-7),J(Me,Q.sPin),J(Me,Q.sPin+6),...Q.sPin<590?[J(Me,596)]:[],t((595+Q.sEnd)/2+2,(Me+Pt.y)/2+.6,(k(Me)+Pt.z)/2+.9),t(Q.sEnd-1.5,Pt.y+.3,Pt.z+1.2),t(Q.sEnd+2.5,Pt.y,Pt.z+.9)],300),R=[...St,...Ke.slice(1)],Z=re(R,pn(dn(R),Ne,.7)),fe=0;{let Je=0,He=1e9;for(let Ie=1;Ie<Z.length;Ie++){Je+=Z[Ie].distanceTo(Z[Ie-1]);let it=Math.abs(Z[Ie].x-Q.sPin)+(Z[Ie].x<550?1e6:0);it<He&&(He=it,fe=Je)}}let le=-(Q.roll||0)*kt,Fe=(ft-42)*kt,_e=Yt(Z,m(ft),Je=>{if(Je<=Ne){let Rt=Math.sqrt(Math.max(0,1-Math.pow((Ne-Je)/Ne,2))),st=Math.pow(Rt,.85);return{hw:Xe/2*Rt,hf:$e*st,hb:Ze*st,sq:2.6,roll:le}}let He=(1+Math.cos(Math.PI*o((Je-Ne)/(Ve-Ne),0,1)))/2,Ie=1-a(Ve,je+18,Je),it=Math.exp(-Math.pow((Je-fe)/3.4,4));return{hw:1.9+.5*Ie+(Xe/2-2.4)*He,hf:.95+.25*Ie+($e-1.2)*He,hb:.9+(Ze-.9)*He+.75*it,sq:2.6+1.6*(1-He),roll:le*He+Fe*(1-He)}},{segs:40,cap:!0}),Re=pe(Q.sPin,we(Me)),Oe=J(ct[0]+Math.sin(Ee)*(je-Ne),ct[1]-Math.cos(Ee)*(je-Ne),X+Q.dz,ft);return ae(ce,{pivot:Re,axis:N.clone(),angle:.85,s:Oe.x,joint:"upper",size:5},[_e,h(c([[-3.6,0],[-3.6,2.85],[-3.4,3.1],[-2.9,3.1],[-2.7,2.6],[2.7,2.6],[2.9,3.1],[3.4,3.1],[3.6,2.85],[3.6,0]],{segs:32,crease:40}),Re,N),C(Q.rd,Q.sEnd,Q.sEnd+13,.75)],Oe.clone().addScaledVector(m(ft),2.4),m(ft))},be=[[25.1,590],[29.2,580],[33.3,570]];Te("LE",be[0][0],{sPin:be[0][1],rd:et.Lk0,sEnd:611,sTop:466,lean:4,rho:30,Lh:28,ext:4,w:15,dz:5.8,th:42,roll:-4}),Te("LFs",be[1][0],{sPin:be[1][1],rd:et.Lk,sEnd:616,sTop:476,lean:12,rho:28,Lh:22,ext:4,w:12.4,dz:2.6,th:42,roll:6}),Te("LF",be[2][0],{sPin:be[2][1],rd:et.Lk2,sEnd:621,sTop:459,lean:18,rho:26,Lh:23,ext:4,w:13,dz:-2.4,th:42,roll:10});let De=27.6;for(let[ce,Me]of be){let Q=we(ce),Ee=pe(Me,De),Ue=[[0,1.4],[0,2.1],[.25,2.4],[4.6,2.4],[4.8,2.2],[5,2.2]];for(let Ve=1;Ve<=10;Ve++){let je=Ve/10*Math.PI/2;Ue.push([5+1.8*Math.sin(je),2.2*Math.cos(je)+1e-4])}let de=(Ve,je,Ne=1.9)=>h(c([[0,1],[0,Ne-.25],[.25,Ne],[je-Ve-.25,Ne],[je-Ve,Ne-.25],[je-Ve,1]],{segs:28,crease:40}),pe(Me,Ve),N);q("silver",V(pe(Me,-1.2),Ee,1.1),de(2.7,Q-4.1),de(Q+4.1,De-.2),h(c(Ue,{segs:32,crease:40}),Ee,N),...Se(Me,42,me,{r:2.5}),...xe(pe(Me,-1.25),N.clone().negate(),1.3));for(let[Ve]of be)if(Ve!==ce&&we(Ve)<De-2){let je=we(Ve);q("silver",de(je-2.3,je+2.3,2.5))}}q("silver",ne([[8.6,562.4],[13.4,561.8],[18.4,562.6],[19.2,564.6],[15.6,574.6],[13.6,576.2],[11.6,574.6],[7.8,564.4]],.55,{thick:1.1,dome:0,edge:.14}),...xe(f(13.4,565.2,1.1),m(g(13.4,565.2,1.1)),1.5));{let ce=f(13.4,565.2,1.32),Me=m(g(13.4,565.2,1.1)),Q=new e.BoxGeometry(2.4,.4,.45),Ee=new e.Matrix4().makeBasis(n,Me,n.clone().cross(Me));Ee.setPosition(ce),Q.applyMatrix4(Ee),q("dark",Q)}{let ce=et.Cs,Me=Tt(-122,506,8.2),Q=26.4,Ee=505,Ue=[30.6,460.4],de=[10.5,473.5],Ve=Math.hypot(de[0]-Ue[0],de[1]-Ue[1]),je=.36*Ve,Ne=Ve+6,Xe=[Ue[0]+(de[0]-Ue[0])*.36,Ue[1]+(de[1]-Ue[1])*.36],$e=[0,.25,.5,.75,1].map(xt=>J(Ue[0]+(de[0]-Ue[0])*xt,Ue[1]+(de[1]-Ue[1])*xt,Q+(26.8-Q)*xt,46-18*xt));$e.push(f(6.5,476.6,6.2),f(3.5,480.8,5.8),f(1.8,486.2,5.4),f(.6,492.2,4.9),f(-1.6,498.2,4.4),f(-5.6,502.6,4),f(-10.4,504.6,3.7),f(-14.6,505,3.5),p(Ee,ce.th+4.6,ce.R+.4));let Ze=u($e,300),ot=Yt(re(Ze,pn(dn(Ze),je,.6)),m(46),xt=>{if(xt<=je){let jt=Math.sqrt(Math.max(0,1-Math.pow((je-xt)/je,2))),dt=Math.pow(jt,.85);return{hw:6.75*jt,hf:1.9*dt,hb:1*dt,sq:2.6}}let ft=(1+Math.cos(Math.PI*o((xt-je)/(Ne-je),0,1)))/2;return{hw:2.25+.5*a(Ne,Ne+40,xt)+4.5*ft,hf:1+.9*ft,hb:1,sq:2.6+2*(1-ft)}},{segs:40,cap:!0}),lt=T(c([[Ee-4.6,0],[Ee-4.6,2.5],[Ee-4.1,3.05],[Ee+4.1,3.05],[Ee+4.6,2.5],[Ee+4.6,0]],{segs:28,crease:40})).translate(0,ce.at(Ee).y,ce.at(Ee).z),ct=ae("LCs",{pivot:ce.at(506),angle:3.5,s:506,size:4.5},[ot,lt,C(ce,ce.s0+1.6,ce.s1-1.6),ei(Me,ce.th,ce.R,4)],J(Xe[0],Xe[1],Q-.8,40).addScaledVector(m(40),2),m(40));F(ct,Me)}}{let Y={Fs:[772,13,-10],F:[846,13.75,-25],E:[922,14.5,-12]},ue=-40,x=Math.sin(ue*kt),I=Math.cos(ue*kt),N=m(ue),X=(Te,be)=>(Te-be*x)/I,k=(Te,be,De,ce=0)=>t(De,be,X(Te,be)).addScaledVector(N,ce),J=(Te,be)=>{let[De,ce,Me]=Y[be],Q=Tt(Me,De,ce,!0),Ee=_(Me).multiplyScalar(Math.sign(Te.th-Me)||1),Ue=We(ce),de=(Ze,ot)=>Q.seat.clone().addScaledVector(Ee,ce*Ze).addScaledVector(Q.n,ot),Ve=Te.at(De-.5),je=Ue-ke(ce),Ne=de(1.06,je+1.3),Xe=u([Ve,Ve.clone().lerp(Ne,.5),Ne,de(.86,je+1.25),de(.66,Ue-ke(ce)*.66+1)],60),$e=dn(Xe);return Yt(re(Xe,pn($e,.01,.5)).reverse(),Q.n,Ze=>{let ot=Ze<2?Math.sqrt(Math.max(0,1-Math.pow((2-Ze)/2,2))):1;return{hw:Ze<.02?0:Math.max(.15,2*ot),hf:Math.pow(ot,.3),hb:Math.pow(ot,.3),sq:4.5}},{segs:24,cap:!0})},me=(Te,be,De,ce,Me,Q={})=>{let Ee=Q.L||34,Ue=(Q.al||30)*kt,de=Q.w||11.5,Ve=.25*Ee,je=Q.sag!=null?Q.sag:.8,Ne=Q.drop||0,Xe=Q.curl||0,$e=Q.asym||0,Ze=(Ke,R=0)=>{let Z=Ee-Ke,fe=Ke/Ee;return k(ce,De[0]-Z*Math.cos(Ue)*I,De[1]-Z*Math.sin(Ue),R+je*4*fe*(1-fe)-Ne*(1-fe)-.4*Xe*Math.pow(Math.max(0,1-fe/.4),2))},ot=pn(Ee,Ve,.6).map(Ke=>Ze(Ke)),lt=dn(ot),ct=Q.wf||.42,xt=Q.n||2.6,ft=Ke=>{let R=Ke<=ct*lt?.5*Ke/(ct*lt):.5+.5*(Ke-ct*lt)/(lt-ct*lt);return Math.pow(Math.max(0,1-Math.pow(Math.abs(2*o(R,0,1)-1),xt)),1/xt)},Pt=Yt(ot,N,Ke=>{let R=ft(Ke),Z=Math.sqrt(R);return{hw:de/2*R,hf:1.3*Z,hb:1*Z,ridge:-.12*R,sq:5.5,off:$e*de*R*(1-R)*a(.8*ct*lt,1.3*ct*lt,Ke)}},{segs:48}),jt=be.at(Me),dt=Ze(Ee,-2.5).lerp(jt,.5);Q.lift&&(dt.z+=Q.lift);let Lt=l(u([Ze(.6*Ee,-1),Ze(.86*Ee,-1.9),dt,jt],40),1,{up:N,scaleN:1.25,scaleB:2,sq:4,segs:20,capA:!0,capB:!0}),St=[Pt,Lt,...Q.extra||[]];if(Q.pad){St.push(J(be,Q.pad));let Ke=Q.mid;Ke?St.push(C(be,Me-1.2,Ke-2.8),C(be,Ke+2.8,be.s1-2.6)):St.push(C(be,Me-1.2,be.s1-2.6))}return ae(Te,{pivot:jt.clone(),axis:be.dir.clone(),angle:4.2,s:Me,size:6},St,Ze(Ve,1.8),N)},pe=23.5,we=27;me("RFs",et.BFs,[-27,700],pe,700,{pad:"Fs",L:33,w:11.6,al:35,asym:.8,drop:1,curl:5,n:2.4,wf:.4}),me("RE",et.BE,[-27.5,715],pe,715,{pad:"E",mid:815,L:36,w:12.2,al:30,asym:.15,drop:1,curl:5.5,n:3.1,wf:.5});{let Te=et.BEb,be=Te.at(944.5);me("REb",Te,[-28,730],pe,730,{L:32,w:11,al:25,asym:-.6,drop:1,curl:4.5,n:2.1,wf:.35,extra:[C(Te,728.8,832.2),C(Te,837.8,943.4),l(u([be,t(946.4,be.y-1.4,be.z+.2),t(948.2,be.y-2.6,be.z+.2)],10),1,{up:n,scaleN:2,scaleB:.9,sq:4,segs:14,capA:!0,capB:!0})]})}me("RF",et.BF_,[-15.5,720.5],we,720.5,{pad:"F",L:33,w:11.4,al:31,asym:.3,drop:.6,curl:1.2,n:2.8,wf:.45});{let Te=et.Rg,be=Tt(82,711,7),De=Te.at(711),ce=me("RGs",Te,[-15,705.5],we,706,{lift:2.4,L:30,w:11,al:37,asym:.7,drop:.6,curl:1.2,n:2.3,wf:.32,extra:[C(Te,700.6,721.4),ei(be,Te.th,Math.hypot(De.y,De.z),4)]});F(ce,be)}for(let[Te,[be,De,ce]]of Object.entries(Y))zt(Te,Tt(ce,be,De),et.Pd,{angle:6.5,w:5.6,tube:{Fs:[731.8,806.2],F:[811.8,881.2],E:[886.8,947.2]}[Te]});{let be=11*kt,De=34,ce=t(1e3+De*Math.sin(be),0,De-De*Math.cos(be)),Me=21.3,Q=r.clone().negate(),Ee=n.clone().negate(),Ue=Me-Math.sqrt(Me*Me-.36*14.5*14.5)+1,de=ce.clone().addScaledVector(Q,Me+Ue),Ve=de.clone().addScaledVector(Q,We(14.5));G("bell","tube",h(c([[-Ue-4,14.5*.74],[-1.15,14.5*.74],[-.95,14.5*.7],[-.95,14.5*.6],[-1.6,14.5*.56]],{segs:56,crease:40}),de.clone(),Q)),G("bell","dark",h(E(14.5*.57),de.clone().addScaledVector(Q,-1.5),Q));let je=de.x-14.5-5.4,Ne=-(Me+3.9),Xe=t(je,Ne,ce.z-9.5),$e=t(je,Ne,ce.z+9.5);G("bell","silver",b(V(Xe,$e,1.2)),...[Xe,$e].flatMap((ft,Pt)=>{let jt=Math.hypot(ft.y,ft.z),dt=Math.atan2(ft.y,ft.z)/kt,Lt=s.clone().multiplyScalar(Pt?1:-1);return[...Se(je,dt,jt,{r:2.4}).map(b),...xe(ft.clone().addScaledVector(Lt,2.42),Lt,1.3).map(b)]}));let Ze=L("LEb",{pivot:t(je,Ne,ce.z),axis:s.clone(),angle:5.5,s:de.x,joint:"bell",out:Q.clone(),anchor:Ve.clone(),size:14.5,restUp:!0}),ot=l(u([Ve.clone().addScaledVector(Q,.3),Ve.clone().addScaledVector(Ee,14.5*.5).addScaledVector(Q,.3),Ve.clone().addScaledVector(Ee,14.5*.86).addScaledVector(Q,.05),Ve.clone().addScaledVector(Ee,14.5*1.04).addScaledVector(Q,-.5),t(je+1.6,Ne-.7,ce.z),t(je,Ne-1.2,ce.z)],40),(ft,Pt)=>.1+.9*a(0,.3,ft/Pt),{up:Q,scaleN:.95,scaleB:2.6,sq:5,segs:22,capA:!0,capB:!0}),lt=et.BEb.at(946),ct=t(948.6,lt.y-3.6,lt.z+.2),xt=l(u([t(je,Ne-1.2,ce.z+4.6),t(je-8,Ne-1.5,lt.z-.4),t(966,lt.y-4.1,lt.z+.1),t(956,lt.y-3.9,lt.z+.2),ct],40),1,{up:Q,scaleN:.85,scaleB:1.9,sq:5,segs:20,capA:!0,capB:!0});A(Ze,"key",h(Be(14.5),de.clone(),Q),ot,xt,V(t(je,Ne,ce.z-7.1),t(je,Ne,ce.z+7.1),2,18),v(ct,1.9,18)),A(Ze,"pad",h($(14.5),de.clone(),Q)),D(Ze,de,Q)}}}var Ge=(i,e,t)=>new B(i,e,t),bt=wa.clamp,Nt=(i,e,t)=>{let n=bt((t-i)/(e-i),0,1);return n*n*(3-2*n)},Ut=Ge(1,0,0),Si=Ge(0,1,0),Jh=Ge(0,0,1),Ct=Math.PI/180,uf=(()=>{let i="vec3 CustomToneMapping( vec3 color ) { return color; }",e=pt.tonemapping_pars_fragment||"";return e.includes("vtFilm")?!0:e.includes(i)?(pt.tonemapping_pars_fragment=e.replace(i,"vec3 CustomToneMapping( vec3 color ) { /* vtFilm */ color *= toneMappingExposure; return min( color, 0.72 ) + 0.28 * ( 1.0 - exp( - max( color - 0.72, 0.0 ) / 0.28 ) ); }"),!0):!1})();function df(i,e){let t=[i[0]];for(let n=1;n<i.length;n++){let r=i[n].distanceTo(i[n-1]),s=Math.ceil(r/e);for(let o=1;o<=s;o++)t.push(i[n-1].clone().lerp(i[n],o/s))}return t}function wi(i,e){return new Qi(i,!1,"centripetal").getPoints(e)}function vn(i,e,t={}){let n=i.length,r=t.segs||28,s=[0];for(let H=1;H<n;H++)s[H]=s[H-1]+i[H].distanceTo(i[H-1]);let o=s[n-1],a=[];for(let H=0;H<n;H++)a[H]=typeof e=="function"?e(s[H],o,H):Array.isArray(e)?e[H]:e;let l=[];for(let H=0;H<n;H++){let $=i[Math.max(0,H-1)],ee=i[Math.min(n-1,H+1)];l[H]=ee.clone().sub($).normalize()}let c=(t.up||(Math.abs(l[0].z)<.9?Jh:Ut)).clone();c.addScaledVector(l[0],-c.dot(l[0])).normalize();let h=t.scaleN||1,u=t.scaleB||1,d=t.sq||2,p=!!t.inside,m=[],_=[],f=[],g=[],v=new gn,y=Ge(),w=Ge(),T=Ge();for(let H=0;H<n;H++){H>0&&(v.setFromUnitVectors(l[H-1],l[H]),c.applyQuaternion(v),c.addScaledVector(l[H],-c.dot(l[H])).normalize()),T.crossVectors(l[H],c);let $=H===0?(a[1]-a[0])/(s[1]-s[0]||1):H===n-1?(a[H]-a[H-1])/(s[H]-s[H-1]||1):(a[H+1]-a[H-1])/(s[H+1]-s[H-1]||1);for(let ee=0;ee<=r;ee++){let te=ee/r*Math.PI*2,oe=Math.cos(te),ne=Math.sin(te),ye=oe,ve=ne,Pe=oe/h,Ae=ne/u;d!==2&&(ye=Math.sign(oe)*Math.pow(Math.abs(oe),2/d),ve=Math.sign(ne)*Math.pow(Math.abs(ne),2/d),Pe=Math.sign(oe)*Math.pow(Math.abs(oe),2*(d-1)/d)/h,Ae=Math.sign(ne)*Math.pow(Math.abs(ne),2*(d-1)/d)/u),y.set(0,0,0).addScaledVector(c,ye*h).addScaledVector(T,ve*u),m.push(i[H].x+y.x*a[H],i[H].y+y.y*a[H],i[H].z+y.z*a[H]),w.set(0,0,0).addScaledVector(c,Pe).addScaledVector(T,Ae).normalize().addScaledVector(l[H],-$).normalize(),p&&w.negate(),_.push(w.x,w.y,w.z),f.push(ee/r,s[H]/(t.uvLen||o||1))}}let E=r+1;for(let H=0;H<n-1;H++)for(let $=0;$<r;$++){let ee=H*E+$,te=ee+1,oe=ee+E,ne=oe+1;p?g.push(ee,oe,te,te,oe,ne):g.push(ee,te,oe,te,ne,oe)}let V=(H,$)=>{let ee=m.length/3,te=l[H];m.push(i[H].x,i[H].y,i[H].z),_.push(te.x*$,te.y*$,te.z*$),f.push(.5,.5);for(let oe=0;oe<=r;oe++){let ne=(H*E+oe)*3;m.push(m[ne],m[ne+1],m[ne+2]),_.push(te.x*$,te.y*$,te.z*$),f.push(.5,.5)}for(let oe=0;oe<r;oe++)$>0?g.push(ee,ee+1+oe,ee+2+oe):g.push(ee,ee+2+oe,ee+1+oe)};t.capA&&V(0,-1),t.capB&&V(n-1,1);let W=new Dt;return W.setAttribute("position",new at(m,3)),W.setAttribute("normal",new at(_,3)),W.setAttribute("uv",new at(f,2)),W.setIndex(g),W.userData.rings=n,W.userData.W=E,W}function yt(i,e={}){let t=e.segs||48,n=Math.cos((e.crease||32)*Math.PI/180),r=i.filter((m,_)=>_===0||Math.hypot(m[0]-i[_-1][0],m[1]-i[_-1][1])>1e-6),s=[];for(let m=0;m<r.length-1;m++){let _=r[m+1][0]-r[m][0],f=r[m+1][1]-r[m][1],g=Math.hypot(_,f);s.push([-f/g,_/g])}let o=[],a=0;for(let m=0;m<r.length;m++){m>0&&(a+=Math.hypot(r[m][0]-r[m-1][0],r[m][1]-r[m-1][1]));let _=s[m-1],f=s[m];if(_&&f&&_[0]*f[0]+_[1]*f[1]>=n){let g=_[0]+f[0],v=_[1]+f[1],y=Math.hypot(g,v);o.push({y:r[m][0],r:r[m][1],ny:g/y,nr:v/y,v:a,brk:!1})}else _&&o.push({y:r[m][0],r:r[m][1],ny:_[0],nr:_[1],v:a,brk:!0}),f&&o.push({y:r[m][0],r:r[m][1],ny:f[0],nr:f[1],v:a,brk:!1})}let l=[],c=[],h=[],u=[],d=t+1;for(let m of o)for(let _=0;_<=t;_++){let f=_/t*Math.PI*2,g=Math.cos(f),v=Math.sin(f);l.push(m.r*g,m.y,m.r*v),c.push(m.nr*g,m.ny,m.nr*v),h.push(_/t,m.v/(a||1))}for(let m=0;m<o.length-1;m++)if(!o[m].brk)for(let _=0;_<t;_++){let f=m*d+_,g=f+1,v=f+d,y=v+1;u.push(f,v,g,v,y,g)}let p=new Dt;return p.setAttribute("position",new at(l,3)),p.setAttribute("normal",new at(c,3)),p.setAttribute("uv",new at(h,2)),p.setIndex(u),p}function Gt(i,e,t=Si){let n=new ht().makeRotationFromQuaternion(new gn().setFromUnitVectors(Si,t.clone().normalize()));return n.setPosition(e),i.applyMatrix4(n)}function tc(i){let e=0,t=0;for(let u of i)e+=u.attributes.position.count,t+=u.index.count;let n=new Float32Array(e*3),r=new Float32Array(e*3),s=new Float32Array(e*2),o=new Float32Array(e*3).fill(1),a=new Uint32Array(t),l=0,c=0;for(let u of i){n.set(u.attributes.position.array,l*3),r.set(u.attributes.normal.array,l*3),u.attributes.uv&&s.set(u.attributes.uv.array,l*2),u.attributes.color&&o.set(u.attributes.color.array,l*3);let d=u.index.array;for(let p=0;p<d.length;p++)a[c+p]=d[p]+l;l+=u.attributes.position.count,c+=d.length,u.dispose()}let h=new Dt;return h.setAttribute("position",new $t(n,3)),h.setAttribute("normal",new $t(r,3)),h.setAttribute("uv",new $t(s,2)),h.setAttribute("color",new $t(o,3)),h.setIndex(new $t(a,1)),h}var Ni=Ge(),Oi=Ge(),Fr=Ge();function pf(i,e,t,n){Ni.subVectors(e,i),Oi.subVectors(n,t),Fr.subVectors(i,t);let r=Ni.dot(Ni),s=Oi.dot(Oi),o=Oi.dot(Fr),a=Ni.dot(Fr),l=Ni.dot(Oi),c=0,h=0;if(r>1e-9&&s>1e-9){let m=r*s-l*l;c=m>1e-9?bt((l*o-a*s)/m,0,1):0,h=(l*c+o)/s,h<0?(h=0,c=bt(-a/r,0,1)):h>1&&(h=1,c=bt((l-a)/r,0,1))}else r>1e-9?c=bt(-a/r,0,1):s>1e-9&&(h=bt(o/s,0,1));let u=Fr.x+Ni.x*c-Oi.x*h,d=Fr.y+Ni.y*c-Oi.y*h,p=Fr.z+Ni.z*c-Oi.z*h;return u*u+d*d+p*p}var Br={mpEnd:71,barrelEnd:136,upperEnd:326,lowerEnd:566,end:670.4},$h=336,Qh=i=>i<326?14.45:i<566?14.3+(i-326)*1.35/240:16,Mt=Qh,Et=(i,e,t)=>Ge(i,t*Math.sin(e*Ct),t*Math.cos(e*Ct)),It=i=>Ge(0,Math.sin(i*Ct),Math.cos(i*Ct)),Qn=i=>Ge(0,Math.cos(i*Ct),-Math.sin(i*Ct)),Bt=(i,e)=>[(i-348.5)/8.2,136+(e-228)/8.2],qt=(i,e)=>[(i-283-(e-75)*.0045)/7.19,326+(e-75)/7.19],Ca=i=>i.map(e=>Bt(e[0],e[1])),Hh=i=>i.map(e=>qt(e[0],e[1])),bi=(i,e,t=0,n=62)=>bt(Math.asin(bt(i/(Mt(e)+t),-1,1))/Ct,-n,n);function kn(i,e,t=0,n=62){let r=Mt(e)+t,s=r*Math.sin(n*Ct);if(Math.abs(i)<=s)return Et(e,Math.asin(i/r)/Ct,r);let o=Math.sign(i),a=o*n;return Et(e,a,r).addScaledVector(Qn(a),o*(Math.abs(i)-s)/Math.cos(n*Ct))}var eu=`
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
    const float V[13] = float[13](0.90, 1.0, 1.08, 0.95, 0.7, 0.46, 0.3, 0.28, 0.4, 0.55, 0.5, 0.3, 0.15);
    float v = V[0];
    for (int i = 0; i < 12; i++) v = mix(v, V[i + 1], clamp((r - X[i]) / (X[i + 1] - X[i]), 0.0, 1.0));
    return v;
  }
  // Black wood and hard rubber are lit the way a photographer lights anything black and glossy: the room dark, and long
  // strip lights standing left and right of the camera. Polished black then shows as black, with a broad soft streak down
  // one side, a narrow one down the other, and a thin light edge from behind.
  float fsWood(vec3 d, float rough){
    d = normalize(d);
    float a = degrees(atan(d.x, d.z));                                    // round the upright instrument: 0 = toward the camera
    float e = 6.0 + 46.0 * rough;
    float key = fsBand(a, -78.0, -24.0, e);
    float rim = fsBand(a, 51.0, 57.0, 0.5 * e);
    float edge = smoothstep(118.0, 165.0, abs(a));
    float tall = 1.0 - 0.6 * smoothstep(0.3, 1.0, abs(d.y));            // (fades slowly: a hard end drew a line across the bell's flare)
    return 0.06 + tall * (2.9 * key + 2.2 * rim) + 0.45 * edge;
  }
  vec3 fsStudio(vec3 d, float rough){
    d = normalize(d);
    float e = 1.2 + 70.0 * rough * rough + 25.0 * rough;
    float u = degrees(atan(d.y, d.z));                                   // 0 = toward the camera, 90 = up, \xB1180 = behind, -90 = down
    float s = degrees(asin(clamp(d.x, -1.0, 1.0)));                       // left / right
    float rho = degrees(acos(clamp(d.z, -1.0, 1.0)));                     // the angle away from the camera
    float up = smoothstep(-0.4, 0.4, d.y / max(1e-4, length(d.xy)));
    float v = mix(fsDown(rho), fsUp(rho), up);
    float strip = 1.5;
    #ifdef FS_METAL
    // Plated keys are shot in a harder set than the tube's tent: the softboxes far brighter (they burn out to white, as
    // in every product photo of a clarinet), the grey between them pulled down toward black, so a cup or a spatula breaks
    // into black and white bands instead of an even satin grey. (An outside judge measured photos: about a quarter of
    // the key's pixels under 35 %, a fifth to a half over 90 %; ours had neither.)
    #ifdef FS_TUBE
    // (the bass's plated neck and bell: big polished tubes, between the tent and the keys' hard set)
    // (a mirror: the lit side of the tent burns out to white, the floor and the far side go nearly black, so every tube
    // shows a hard dark band beside its highlight, as plated tubes do in product photographs)
    // (2026-11-20 b: lifted, the floor and far side a light grey rather than near black: an outside judge read the old
    // bell and bow as pewter beside the keys; the product photographs show them mostly white with thin dark lines)
    #ifdef FS_NECK
    v = 0.3 + 2.6 * smoothstep(0.4, 1.18, v);                            // (the slim neck keeps harder dark bands: lifted like the bell it vanished into the page)
    #else
    v = 0.5 + 2.4 * smoothstep(0.36, 1.12, v);
    #endif
    strip = 2.8;
    #else
    v = 0.05 + 2.7 * pow(smoothstep(0.45, 1.5, v), 1.3);
    strip = 3.2;
    #endif
    #endif
    #if defined( FS_BASS ) && !defined( FS_TUBE )
    // (the bass's broad flat plates and spoons face the camera squarely, where this set is only mid grey: a white card
    // round the lens, so a flat face shows white, as in the product photographs)
    v = mix(v, 2.2, 0.8 * (1.0 - smoothstep(4.0, 30.0, rho)));
    #endif
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
    #if defined( FS_TUBE ) && !defined( FS_NECK )
    wall *= 0.45;                                                        // (a big bell mirrors whole walls: only a grey there)
    #endif
    c = mix(c, vec3(0.17, 0.172, 0.18), 0.9 * wall);
    c = mix(c, white * strip, fsBand(abs(s), 65.0, 74.0, 2.0 + e) * fsBand(elev, -38.0, 46.0, e + 3.0));
    // The dark band just ABOVE the camera (the black card over the lens): on a tube it is the narrow dark stripe just
    // above the middle, hard against the bright streak of the overhead light, which is what makes polished silver read
    // as silver. Above, not below: a cup's flat face, seen from a little above as the flute usually is, mirrors what
    // lies BELOW the camera, and must stay light. Its upper edge is crisp (its own ~1\xB0 edge, widened only as far as a
    // pixel needs so it never shimmers on a small flute), its lower edge soft.
    float fw = clamp(fwidth(u), 0.0, 8.0);
    float eT = max(0.8, 0.45 * fw) + 30.0 * rough, hi = max(23.0, 5.0 + 2.6 * fw);
    float band = smoothstep(5.0 - 3.0 - eT, 5.0 + 3.0 + eT, u) * (1.0 - smoothstep(hi - eT, hi + eT, u));
    #ifdef FS_TUBE
    band *= 0.8;                                                         // (the one crisp dark line down each plated tube)
    #endif
    #ifdef FS_BASS
    // (the bass's broad flat plates and spoons face the camera squarely: a full black card there turned every one dark grey)
    band *= 0.55;
    #endif
    c = mix(c, vec3(0.045, 0.047, 0.052), 0.96 * band * (1.0 - smoothstep(30.0, 50.0, abs(s))));
    // two tall black flags a little off the camera's line, left and right: every dome, rod and rolled edge then carries a
    // dark line beside its highlight, which is what makes plated keys read as metal against black wood
    #if defined( FS_TUBE ) && !defined( FS_NECK )
    // (the plated tubes: the flags narrower, so a bell's flare carries thin dark lines instead of broad smears)
    float flag = max(fsBand(s, 19.0, 25.0, 1.0 + e), fsBand(s, -37.0, -31.0, 1.0 + e)) * fsBand(elev, -60.0, 62.0, e + 5.0);
    #else
    float flag = max(fsBand(s, 15.0, 29.0, 1.5 + e), fsBand(s, -41.0, -27.0, 1.5 + e)) * fsBand(elev, -60.0, 62.0, e + 5.0);
    #endif
    c = mix(c, vec3(0.05, 0.05, 0.055), 0.9 * flag);
    return c;
  }`,ff=`
  #ifdef FS_TRACE
  uniform vec4 fsA[ FS_N ];
  uniform vec4 fsB[ FS_N ];
  vec3 fsRadiance( vec3 P, vec3 D, float rough ) {
    float tBest = 1e9, under = 0.0, wBest = 0.0, body = 0.0; vec3 nBest = vec3( 0.0, 0.0, 1.0 );
    for ( int i = 0; i < FS_N; i ++ ) {
      #ifdef FS_TUBE
      if ( i >= FS_NB ) break;                                           // (the bass's bell mirrors only the body: cups showed in it as stray ovals)
      #endif
      vec3 A = fsA[ i ].xyz; float r = fsA[ i ].w; vec3 U = fsB[ i ].xyz; float L = fsB[ i ].w;
      vec3 oc = P - A; float dU = dot( D, U ), oU = dot( oc, U );
      vec3 d2 = D - dU * U, o2 = oc - oU * U;
      float a = dot( d2, d2 ), b = dot( o2, d2 ), c = dot( o2, o2 ) - r * r, h = b * b - a * c;
      if ( h > 0.0 && a > 1e-6 ) {
        float t = ( - b - sqrt( h ) ) / a, sU = oU + t * dU;
        if ( t > 0.3 && t < tBest && sU > 0.0 && sU < L ) {
          float dmin = sqrt( max( 0.0, c + r * r - b * b / a ) );                 // how close the ray passes to the axis: soft near the outline
          tBest = t; nBest = ( o2 + t * d2 ) / r; under = 0.0; body = i < FS_NB ? 1.0 : 0.0; wBest = smoothstep( r, r * 0.82 - 0.4, dmin ) * smoothstep( 0.0, 0.8, sU ) * smoothstep( L, L - 0.8, sU ); }
      }
      if ( L < 20.0 && abs( dU ) > 1e-4 ) {
        float t0 = - oU / dU; vec3 q0 = o2 + t0 * d2;
        if ( dU > 0.0 && t0 > 0.3 && t0 < tBest && dot( q0, q0 ) < r * r ) { tBest = t0; nBest = - U; under = 1.0; body = 0.0; wBest = smoothstep( r, r - 1.0, length( q0 ) ); }
        float t1 = ( L - oU ) / dU; vec3 q1 = o2 + t1 * d2;
        if ( dU < 0.0 && t1 > 0.3 && t1 < tBest && dot( q1, q1 ) < r * r ) { tBest = t1; nBest = U; under = 0.0; body = 0.0; wBest = smoothstep( r, r - 1.0, length( q1 ) ); }
      }
    }
    vec3 miss = fsStudio( D, rough );
    #ifdef FS_WOOD
    miss *= fsWood( D, rough );
    #endif
    if ( tBest > 1e8 ) return miss;
    vec3 col = vec3( 0.86 ) * fsStudio( reflect( D, nBest ), rough + 0.05 );
    col = mix( col, vec3( 0.2, 0.2, 0.21 ), 0.85 * under );
    col = mix( col, mix( miss, vec3( 0.02 ) + 0.09 * fsStudio( reflect( D, nBest ), 0.3 ), 0.62 ), body );
    return mix( miss, col, wBest * exp( - tBest / 160.0 ) * ( 1.0 - smoothstep( 0.15, 0.45, rough ) ) );
  }
  #endif`;function mf(){let i=new Lr;return i.add(new Jt(new Ir(60,64,32),new Rn({side:Gl,depthWrite:!1,vertexShader:"varying vec3 d; void main(){ d = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"varying vec3 d;"+eu+" void main(){ gl_FragColor = vec4(fsStudio(d, 0.0), 1.0); }"}))),i}function gf(i,e,t,n,r,s=20){return Gt(yt([[i,0],[i,r],[e,r],[e,0]],{segs:s,crease:30}),Ge(0,t,n),Ut)}function tu(i,e,t=24){let n=new Ir(e,t,Math.max(8,t>>1));return n.translate(i.x,i.y,i.z),n}function vf(i,e,t,n,r,s=10){let o=[];for(let a=0;a<=s;a++){let l=a/s;o.push(Et(i,e+(t-e)*l,n+(r-n)*Nt(0,1,l)))}return o}function _f(i,e,t,n={}){return vn(i,1,Object.assign({up:Ut,scaleN:e/2,scaleB:t/2,sq:3.2,segs:14,capA:!0,capB:!0},n))}function yf(i,e,t,n,r,s,o={}){let l=yt([[-.25,0],[-.22,.5],[-.1,.86],[0,1],[.5,1],[.78,.95],[.9,.86],[1,.7],[1.14,.35],[1.2,0]].map(([_,f])=>[_*s,f]),{segs:48,crease:60});if(o.sq&&o.sq!==2){let _=l.attributes.position,f=o.sq;for(let g=0;g<_.count;g++){let v=_.getX(g),y=_.getZ(g),w=Math.hypot(v,y);if(w<1e-6)continue;let T=.86/Math.pow(Math.pow(Math.abs(v/w),f)+Math.pow(Math.abs(y/w),f),1/f);_.setX(g,v*T),_.setZ(g,y*T)}}let c=It(e),h=Qn(e),u=new ht,d=o.tilt||0,p=c.clone().applyAxisAngle(Ut,-d*Ct),m=h.clone().applyAxisAngle(Ut,-d*Ct);return u.makeBasis(Ut.clone().multiplyScalar(n/2),p,m.clone().multiplyScalar(-r/2)),u.setPosition(Et(i,e,t)),l.applyMatrix4(u),l.computeVertexNormals(),l}function ir(i,e,t,n={}){let r=n.NT||112,s=n.NR||9,o=n.NE||7,a=n.thick||1.4,l=n.dome||0,c=n.edge||.12,h=new Qi(i.map(([T,E])=>Ge(T,E,0)),!0,"centripetal").getSpacedPoints(r).slice(0,r),u=[];if(n.pillow){let T=a/2+l,E=-a/2+.3*a,V=s+5;for(let W=1;W<=V;W++){let H=W/V*Math.PI/2;u.push([Math.sin(H),E+(T-E)*Math.cos(H)])}u.push([.985,-a/2+.1*a],[.93,-a/2]);for(let W=s-1;W>=1;W--)u.push([.93*W/s,-a/2])}else{for(let T=1;T<=s;T++){let E=T/s;u.push([E*(1-c),a/2+l*(1-E*E)*(1-E*E)])}for(let T=1;T<o;T++){let E=T/o*Math.PI;u.push([1-c+c*Math.sin(E),a/2*Math.cos(E)])}for(let T=s;T>=1;T--){let E=T/s;u.push([E*(1-c),-a/2])}}let d=[],p=[],m=T=>d.push(T.x,T.y,T.z);m(t(e[0],e[1],a/2+l+(n.top?n.top(e[0],e[1],0):0)));for(let[T,E]of u)for(let V=0;V<r;V++){let W=e[0]+(h[V].x-e[0])*T,H=e[1]+(h[V].y-e[1])*T;m(t(W,H,E+(n.top&&E>0?n.top(W,H,T)*Math.min(1,E/(a/2)):0)))}m(t(e[0],e[1],-a/2));let _=T=>1+T*r,f=1+u.length*r,g=u.length;for(let T=0;T<r;T++){let E=(T+1)%r;p.push(0,_(0)+T,_(0)+E,f,_(g-1)+E,_(g-1)+T)}for(let T=0;T<g-1;T++)for(let E=0;E<r;E++){let V=(E+1)%r,W=_(T)+E,H=_(T)+V,$=_(T+1)+E,ee=_(T+1)+V;p.push(W,$,H,H,$,ee)}let v=new Dt;v.setAttribute("position",new at(d,3)),v.setIndex(p),v.computeVertexNormals();let y=t(e[0],e[1],1).sub(t(e[0],e[1],0));if(Ge().fromBufferAttribute(v.attributes.normal,0).dot(y)<0){let T=v.index.array;for(let E=0;E<T.length;E+=3){let V=T[E+1];T[E+1]=T[E+2],T[E+2]=V}v.computeVertexNormals()}return v}var zr=i=>(i.attributes.uv||i.setAttribute("uv",new at(new Float32Array(i.attributes.position.count*2),2)),i.index||i.setIndex([...Array(i.attributes.position.count).keys()]),i),nn=i=>Gt(i,Ge(0,0,0),Ut),ci=i=>yt([[0,i],[0,0]],{segs:32}),On=(i,e,t,n=16)=>vn([i,e],t,{segs:n,capA:!0,capB:!0}),xf=(i,e)=>{if(e<=i[0][0])return i[0][1];for(let t=1;t<i.length;t++)if(e<=i[t][0]){let n=(e-i[t-1][0])/(i[t][0]-i[t-1][0]);return i[t-1][1]+(i[t][1]-i[t-1][1])*n}return i[i.length-1][1]},Pa=(i,e)=>new Qi(i.map(([t,n])=>Ge(t,n,0)),!1,"centripetal").getPoints(e).map(t=>[t.x,t.y]);function ac(i,e=0,t=0){i.computeVertexNormals();let n=i.attributes.position,r=i.attributes.normal,s=0;for(let o=0;o<n.count;o+=3)s+=(n.getY(o)-e)*r.getY(o)+(n.getZ(o)-t)*r.getZ(o);if(s<0){let o=i.index.array;for(let a=0;a<o.length;a+=3){let l=o[a+1];o[a+1]=o[a+2],o[a+2]=l}i.computeVertexNormals()}return zr(i)}function nc(i){let e=i.attributes.position,t=i.attributes.normal;if(!t)return i;let n=i.attributes.color,r=new Float32Array(e.count*3);for(let s=0;s<e.count;s++){let o=e.getY(s),a=e.getZ(s),l=Math.hypot(o,a),c=Mt(e.getX(s)),h=1;if(l>.001){let u=Math.max(0,-(t.getY(s)*o+t.getZ(s)*a)/l),d=1-Nt(c+.3,c+5,l);h=Math.max(.1,1-.45*d*(.4+.6*u)-.22*u*(1-Nt(c+5,c+11,l)))}n&&(h*=n.getX(s)),r[s*3]=r[s*3+1]=r[s*3+2]=h}return i.setAttribute("color",new $t(r,3)),i}function Gh(i,e){let t=(i+e)/2;return yt([[0,e+.2],[0,i-.3],[.35,i],[1,i],[1.45,i-.3],[1.6,t+.3],[1.6,t-.3],[1.45,e+.3],[1,e],[.35,e],[0,e+.2]],{segs:56,crease:50})}function Wh(i,e,t){let n=[],r=[],a=Mt(i)+.1,l=(u,d)=>Et(i+u*Math.cos(d),e+u*Math.sin(d)/a/Ct,a),c=l(0,0);n.push(c.x,c.y,c.z);for(let u=1;u<=4;u++)for(let d=0;d<36;d++){let p=l(t*u/4,d/36*Math.PI*2);n.push(p.x,p.y,p.z)}for(let u=0;u<36;u++)r.push(0,1+u,1+(u+1)%36);for(let u=0;u<3;u++)for(let d=0;d<36;d++){let p=1+u*36+d,m=1+u*36+(d+1)%36;r.push(p,p+36,m,m,p+36,m+36)}let h=new Dt;return h.setAttribute("position",new at(n,3)),h.setIndex(r),h.computeVertexNormals(),h}var oc=i=>1.6+.05*i,Fi=i=>oc(i)+.25+.11*(i-.45);function jh(i){let e=oc(i),t=e+.25,n=[];for(let r=1;r<=8;r++){let s=1-r/8;n.push([t+(Fi(i)-t)*(1-Math.pow(s,1.5)*(1.5-.5*s)),(i-.45)*s])}return yt([[.2,i-.55],[0,i-.2],[.25,i],[e-.15,i],[e,i-.1],[e+.15,i-.28],[t,i-.45],...n],{segs:64,crease:35})}var Xh=i=>yt([[-.95,0],[-.95,i-.75],[-.75,i-.4],[.25,i-.4],[.25,0]],{segs:40,crease:50}),qh=i=>yt([[-5,i*.7],[-1.25,i*.7],[-1,i*.63],[-1,i*.52],[-1.7,i*.46]],{segs:40,crease:40}),ic=(i,e)=>Math.max(1.9,Mt(e)-Math.sqrt(Math.max(1,Mt(e)*Mt(e)-.49*i*i))+1.3);function hi(i,e,t,n={}){let r=It(e),s=Et(i,e,Mt(i)-.4),o=Et(i,e,t),a=o.distanceTo(s);return[Gt(yt([[0,0],[0,2.4],[.9,2.2],[1.7,1.55],[Math.max(1.8,a-.5),1.55],[a,0]],{segs:20}),s,r),tu(o,Math.max(2.5,(n.ball||2.25)*1.1),28)]}function Yh(i,e,t,n,r,s,o,a={}){for(;e-n>180;)e-=360;for(;n-e>180;)e+=360;let l=16,c=[];for(let h=0;h<=l;h++){let u=h/l;c.push(Et(i,e+(n-e)*u,Math.max(Mt(i)+(a.clear||1.3),t+(r-t)*Nt(0,1,u)+(a.hump||0)*Math.sin(Math.PI*u))))}return vn(c,a.taper||1,{up:Ut,scaleN:s/2,scaleB:o/2,sq:a.sq||5,segs:22,capA:!0,capB:!0})}function rc(i,e,t,n={}){let r=n.thMax||62,s=wi(i.map(([a,l,c])=>kn(a,l,c,r)),n.n||36),o=i[0];return vn(s,n.taper||1,{up:It(bi(o[0],o[1],o[2],r)),scaleN:t/2,scaleB:e/2,sq:5,segs:22,capA:!0,capB:!0})}function La(i,e,t,n={}){let r=wi(i.map(([s,o,a])=>Et(a,s,o)),n.n||40);return vn(r,n.taper||1,{up:It(n.face!=null?n.face:i[0][0]),scaleN:t/2,scaleB:e/2,sq:5,segs:22,capA:!0,capB:!0})}function fs(i,e,t={}){let n=0,r=0;for(let[l,c]of i)n+=l,r+=c;let s=t.c||[n/i.length,r/i.length],o=typeof e=="function"?e:()=>e,a=t.thMax||62;return ir(i,s,(l,c,h)=>kn(l,c,o(l,c)+h,a),Object.assign({thick:1.5,dome:.45,edge:.16},t))}function ms(i,e,t,n,r={}){let s=It(n),o=Qn(n),a=1/Math.cos(n*Ct),l=r.bow||0;return ir(i,e,(c,h,u)=>{let d=(c-e[0])*a;return Ge(h,e[0],t).addScaledVector(o,d).addScaledVector(s,u-l*d*d)},Object.assign({thick:1.7,dome:.45,edge:.3},r))}function Zh(i,e,t,n,r=.28){let s=Math.hypot(e[0]-i[0],e[1]-i[1]),o=[(e[0]-i[0])/s,(e[1]-i[1])/s],a=[-o[1],o[0]],l=r*s,c=_=>_<=l?t/2*Math.sqrt(Math.max(0,1-Math.pow((l-_)/l,2))):n/2+(t-n)/2*(1+Math.cos(Math.PI*bt((_-l)/(s-l),0,1)))/2,h=(_,f)=>[i[0]+o[0]*_+a[0]*f,i[1]+o[1]*_+a[1]*f],u=[],d=[];for(let _=1;_<=9;_++){let f=l-l*Math.cos(_/9*Math.PI/2);u.push(h(f,c(f))),d.push(h(f,-c(f)))}for(let _=1;_<=10;_++){let f=l+(s-l)*_/10;u.push(h(f,c(f))),d.push(h(f,-c(f)))}let p=(_,f,g)=>{let v=_-i[0],y=f-i[1],w=v*o[0]+y*o[1],T=v*a[0]+y*a[1],E=bt(Math.abs(T)/Math.max(.3,c(bt(w,0,s))),0,1);return-g*(1-E*E)*Nt(0,l,w)*(1-Nt(l+1,s-1,w))},m=(_,f,g)=>{let v=_-i[0],y=f-i[1],w=v*o[0]+y*o[1],T=v*a[0]+y*a[1],E=bt(Math.abs(T)/Math.max(.3,c(bt(w,0,s))),0,1);return g*(1-E*E)*(1-.6*Nt(l,s,w))};return{pts:[h(0,0),...u,h(s+.5,0),...d.reverse()],centre:h(l,0),dish:p,crown:m}}function Mf(i,e,t,n,r,s,o){let a=.32*s,l=[[0,0],[0,.5]];for(let f=1;f<=6;f++){let g=f/6*Math.PI/2;l.push([a*(1-Math.cos(g)),.5+.5*Math.sin(g)])}for(let f=1;f<=18;f++){let g=f/18*Math.PI/2;l.push([a+(s-a)*Math.sin(g),Math.cos(g)])}let c=yt(l,{segs:72,crease:80}),h=It(o),u=new ht,d=Et(i,e,t);u.makeBasis(Ut.clone().multiplyScalar(n/2),h,Qn(o).multiplyScalar(-r/2)),u.setPosition(d),c.applyMatrix4(u),c.computeVertexNormals();let p=d.clone().addScaledVector(h,s),m=c.attributes.position,_=c.attributes.normal;for(let f=0;f<m.count;f++)Math.abs(m.getX(f)-p.x)+Math.abs(m.getY(f)-p.y)+Math.abs(m.getZ(f)-p.z)<.001&&_.setXYZ(f,h.x,h.y,h.z);return c}function Kh(i,e,t,n,r){let o=[[0,0],[0,.88],[.08,.96],[.22,.995],[.4,1],[.9,1]];for(let p=1;p<=16;p++){let m=p/16*Math.PI/2;o.push([.9+(r-.9)*Math.sin(m),Math.cos(m)])}let a=yt(o,{segs:72,crease:70}),l=It(e),c=new ht;c.makeBasis(Ut.clone().multiplyScalar(t/2),l,Qn(e).multiplyScalar(-n/2)),c.setPosition(i),a.applyMatrix4(c),a.computeVertexNormals();let h=i.clone().addScaledVector(l,r),u=a.attributes.position,d=a.attributes.normal;for(let p=0;p<u.count;p++)Math.abs(u.getX(p)-h.x)+Math.abs(u.getY(p)-h.y)+Math.abs(u.getZ(p)-h.z)<.001&&d.setXYZ(p,l.x,l.y,l.z);return a}function sc(i,e,t,n,r={}){let s=wi(i.map(([o,a,l])=>Ge(a,o,l)),r.n||60);return vn(s,r.taper||1,{up:It(n),scaleN:t/2,scaleB:e/2,sq:r.sq||5,segs:22,capA:!0,capB:!0})}function bf(){let i=document.createElement("canvas");i.width=512,i.height=128;let e=i.getContext("2d"),t=7,n=()=>(t=t*16807%2147483647)/2147483647;e.fillStyle="#b6b6b6",e.fillRect(0,0,512,128),e.filter="blur(5px)";for(let s=0;s<55;s++){let o=n()*512,a=8+n()*34,l=140+Math.floor(n()*90);e.fillStyle=`rgba(${l},${l},${l},${(.12+n()*.14).toFixed(2)})`,e.fillRect(o,-10,a,148),e.fillRect(o-512,-10,a,148)}e.filter="blur(0.7px)";for(let s=0;s<520;s++){let o=n()*512,a=.6+n()*n()*2.6,l=n()<.8,c=l?70+Math.floor(n()*70):200+Math.floor(n()*40),h=n()*128,u=8+n()*n()*110;e.fillStyle=`rgba(${c},${c},${c},${(.1+n()*.24).toFixed(2)})`,e.fillRect(o,h,a,u),e.fillRect(o,h-128,a,u)}e.filter="none";let r=new oa(i);return r.wrapS=r.wrapT=$r,r.repeat.set(2,1),r.anisotropy=4,r}var rt={ZT:9.4,BK:30,TIP:2.4,W0:8.6};rt.rho=i=>i<=rt.BK?12:i<=62?12+(i-rt.BK)*1.6/(62-rt.BK):13.6+(i-62)*.5/9;rt.face=i=>i<18?Math.pow((18-i)/18,2):0;rt.zfP=i=>-rt.ZT+1+rt.TIP+.45*i+.087*Math.pow(Math.max(0,i-12),2);rt.zf=rt.zfP;rt.arc=i=>{if(i>=3)return 1;let e=0,t=1;for(let n=0;n<30;n++){let r=(e+t)/2;r*r+2*Math.pow(r,12)<i?e=r:t=r}return(e+t)/2};rt.w=i=>(rt.W0+(12-rt.W0)*bt(i/rt.BK,0,1))*rt.arc(i);rt.nose=i=>{let e=bt(i/1.6,0,1),t=-rt.ZT+rt.face(i);return t+(rt.zf(i)-t)*Math.sqrt(e*(2-e))};function Sf(){let i=[.02,.1,.25,.45,.7,1,1.35,1.75,2.2,2.7,3.3,4],e=160,t=12;for(let a=5;a<42;a+=1.5)i.push(a);for(let a=42;a<60;a+=3)i.push(a);for(let a=60;a<68;a+=1.25)i.push(a);i.push(68,68.6,69.1,69.6,70.1,70.6,71);let n=[],r=[];for(let a of i){let l=rt.rho(a),c=a>=38?1:1-Math.pow(1-a/38,2),h=Math.max(.05,(rt.W0+(l-rt.W0)*(rt.eW?rt.eW(a,c):c))*rt.arc(a)),u=6+(l-6)*c,d=-7*(1-c),p=d+u,m=Math.min(rt.zfP(a),rt.nose(a)),_=m<p+3,f=_?Math.min(p,m):p,g=-(rt.ZT-rt.face(a)+(rt.noRamp?0:(l-rt.ZT)*bt((a-68.6)/2,0,1))),v=(f+g)/2;for(let y=0;y<e;y++){let w=y/e*Math.PI*2,T=Math.sin(w),E=Math.cos(w),V=v-d,W=T/h*(T/h)+E/u*(E/u),H=2*V*E/(u*u),$=V/u*(V/u)-1,ee=(-H+Math.sqrt(Math.max(0,H*H-4*W*$)))/(2*W),te=Math.pow(ee,-t);E<-1e-4&&(te+=Math.pow((g-v)/E,-t));let oe=Math.pow(te,-1/t);if(E>1e-4&&_){let ne=(rt.crown||0)*(T/h)*(T/h);oe=Math.pow(Math.pow(oe,-14)+Math.pow(ne>1e-6?(-E+Math.sqrt(E*E+4*ne*(m-v)))/(2*ne):(m-v)/E,-14),-1/14)}n.push(a,oe*T,v+oe*E)}}for(let a=0;a<i.length-1;a++)for(let l=0;l<e;l++){let c=a*e+l,h=a*e+(l+1)%e,u=c+e,d=h+e;r.push(c,u,h,h,u,d)}let s=n.length/3;n.push(0,0,-rt.ZT+1.02);for(let a=0;a<e;a++)r.push(s,a,(a+1)%e);let o=new Dt;return o.setAttribute("position",new at(n,3)),o.setIndex(r),ac(o,0,-4)}function wf(){let i=rt.reedL||67.8,e=[.55,.6,.7,.85,1.05,1.3,1.6,2,2.5,3.1,3.85,5,6.5,8,10,12,14,16,18,20,22,24];for(let p=25;p<37;p+=.6)e.push(+p.toFixed(2));e.push(38,40,43,47,52,57,62,65,67.4,i);let t=44,n=[],r=[],s=[],o=p=>{if(p>=2.4)return 1;let m=0,_=1;for(let f=0;f<30;f++){let g=(m+_)/2;1*g*g+1.4*Math.pow(g,16)<p?m=g:_=g}return(m+_)/2},a=p=>{let m=Math.sin(p*127.1+311.7)*43758.5453;return 2*(m-Math.floor(m))-1},l=p=>.6*a(p)+.4*a(Math.floor(p/3)+50);for(let p of e){let m=6.5-.5*p/i,_=Math.max(.001,m*o(p-.55)),f=.12+2.9*Math.pow(Nt(.6,34,p),1.25),g=-rt.ZT+.09;for(let v=0;v<=t+2;v++){let y,w;v===0||v===t+2?(y=v===0?_:-_,w=g):(y=_*Math.cos((v-1)/t*Math.PI),w=g-f*(.3+.7*Math.sqrt(Math.max(0,1-y/_*(y/_))))),n.push(p,y,w);let T=y/m,E=27-6*T*T,V=Nt(-1,1,p-E),W=.3*Math.exp(-Math.pow((p-E-.6)/.6,2)),H=l(Math.min(t,Math.max(1,v))),$=(1+(.05+.12*V)*H)*(1-.13*W)*(v===0||v===t+2?.8:1),ee=1-V*(a(v*31+Math.round(p*3)*7)>.86?.3:0);r.push((1.32-.38*V)*$*ee,(1.19-.35*V)*$*ee,(.86-.28*V)*$*ee)}}let c=t+3;for(let p=0;p<e.length-1;p++)for(let m=0;m<c-1;m++){let _=p*c+m,f=_+1,g=_+c,v=g+1;s.push(_,g,f,f,g,v)}let h=n.length/3,u=(e.length-1)*c;n.push(i,0,-rt.ZT-1),r.push(.5,.41,.25);for(let p=0;p<c-1;p++)s.push(h,u+p,u+p+1);let d=new Dt;return d.setAttribute("position",new at(n,3)),d.setAttribute("color",new at(r,3)),d.setIndex(s),ac(d,0,-rt.ZT+2)}var _t={U1:{th:-72,R:18.2,s0:224,s1:321.5,r:1.4},Th:{th:219,R:16.6,s0:228,s1:250.6,r:1.15},Gs:{th:35,R:16.9,s0:201.5,s1:224,r:1.6},Eb:{th:56.6,R:17,s0:274.4,s1:294,r:1.2},Cs:{th:-56,R:16.5,s0:304.2,s1:323,r:1.2},L1:{th:-68,R:16.6,s0:345,s1:419.3,r:1.6},Rg:{th:33,lift:2.7,s0:431.5,s1:481,r:1.05},Fs:{th:-6,lift:2.6,s0:449.4,s1:478,r:.95},RF:{th:2,lift:2.6,s0:449.4,s1:551,r:.85},RE:{th:16.4,lift:2.6,s0:449.4,s1:551,r:.9}};function nu(i){for(let e of Object.values(i))e.at=t=>Et(t,e.th,e.R!=null?e.R:Mt(t)+e.lift),e.a=e.at(e.s0),e.b=e.at(e.s1),e.dir=e.b.clone().sub(e.a).normalize();return i}nu(_t);function Ef(i){let e=i==="bass";Mt=e?$n.RB:Qh;let t=new si;t.name="clarinet",t.rotation.z=-Math.PI/2,t.position.y=e?$n.rootY:$h;let n=bf(),r={silver:new Kn({color:15263455,metalness:1,roughness:.07,vertexColors:!0}),satin:new Kn({color:14672098,metalness:1,roughness:.22}),wood:new Kn({color:4604484,vertexColors:!0,metalness:0,roughness:.66,map:n,clearcoat:.32,clearcoatRoughness:.1,envMapIntensity:1.25}),ebonite:new Kn({color:526346,metalness:0,roughness:.2,clearcoat:.7,clearcoatRoughness:.08,envMapIntensity:1.25}),bore:new Zn({color:657415,roughness:.8,metalness:0,envMapIntensity:.25,side:xa}),dark:new Zn({color:328965,roughness:.95,metalness:0,envMapIntensity:.12,side:xa}),pad:new Zn({color:15129792,roughness:.8,metalness:0,envMapIntensity:.9}),cork:new Zn({color:12159572,roughness:.9,metalness:0,envMapIntensity:.5}),lig:new Kn({color:15132129,metalness:1,roughness:.1}),rest:new Kn({color:15263455,metalness:1,roughness:.1}),reed:new Zn({color:16777215,roughness:.82,metalness:0,envMapIntensity:1.95,vertexColors:!0}),tube:new Kn({color:15329249,metalness:1,roughness:.085,vertexColors:!0}),neck:new Kn({color:15329249,metalness:1,roughness:.085,vertexColors:!0})};r.silver.name="silver";let s=e?$n.JOINTS:["mp","barrel","upper","lower","bell"],o=e?$n.jointOf:z=>z<Br.mpEnd?"mp":z<Br.barrelEnd?"barrel":z<Br.upperEnd?"upper":z<Br.lowerEnd?"lower":"bell",a={},l={};for(let z of s){a[z]=new si,a[z].name="joint:"+z,t.add(a[z]),l[z]={};for(let U of Object.keys(r))l[z][U]=[]}let c=(z,U,...P)=>{for(let K of P)zr(K),U==="silver"&&(z==="upper"||z==="lower")&&!K.userData.plain&&nc(K),l[z][U].push(K)},h=(z,...U)=>{for(let P of U)P.computeBoundingBox(),c(o((P.boundingBox.min.x+P.boundingBox.max.x)/2),z,P)},u=z=>(z.userData.plain=!0,z),d={TIP:rt.TIP,zfP:rt.zfP,zf:rt.zf,eW:rt.eW,crown:rt.crown,reedL:rt.reedL,noRamp:rt.noRamp};e&&(rt.TIP=.6,rt.zfP=z=>-rt.ZT+1+rt.TIP+.5*z+.012*Math.pow(Math.max(0,z-20),2),rt.zf=rt.zfP,rt.eW=z=>Math.min(1,Math.pow(z/46,.85)),rt.crown=1.6,rt.reedL=70.9,rt.noRamp=!0),c("mp","ebonite",Sf(),nn(yt([[71,14.1],[71,10.9],[73,10.9],[73,10.6],[86,10.6],[86,10.9],[88,10.9],[88,7.5],[80,7.5]],{segs:56,crease:40}))),c("mp","cork",nn(yt([[73.2,10.6],[73.2,11.25],[85.8,11.25],[85.8,10.6]],{segs:48,crease:40}))),c("mp","dark",Gt(ci(7.5),Ge(81,0,0),Ut)),c("mp","reed",wf());{let U=rt.ZT+3+.3,P=D=>(rt.rho(D)+.3+U)/2,K=D=>(rt.rho(D)+.3-U)/2,q=163,G=1.4,b=(D,S)=>{let C=P(D)+S,F=K(D),se=[];for(let Le=0;Le<=96;Le++){let ke=(-q+2*q*Le/96)*Ct;se.push([C*Math.sin(ke),F+C*Math.cos(ke)])}let j=[],[ae,ie]=se[se.length-1],he=Math.atan2(-Math.sin(q*Ct),Math.cos(q*Ct)),Se=-Math.PI/2,xe=10;for(let Le=1;Le<=xe;Le++){let ke=he+(Se-he)*(Le-.5)/xe,We=G*Math.abs(Se-he)/xe;ae+=Math.cos(ke)*We,ie+=Math.sin(ke)*We,j.push([ae,ie])}let ge=ie;for(let Le=1;Le<=5;Le++)ie-=.95,j.push([ae,ie]);return{pts:[...j.map(([Le,ke])=>[-Le,ke]).reverse(),...se,...j],nEar:j.length,yEar:ae,zF:ge}},M=(D,S)=>{let C=(D+S)/2,F=b(C,.6/2),se=F.pts.length,j=(Se,xe,ge)=>{let Le=Math.min(ge,se-1-ge);return .7+.3*Nt(F.nEar-6,F.nEar+4,Le)},ae=vn(F.pts.map(([Se,xe])=>Ge(C,Se,xe)),j,{up:Ut,scaleN:(S-D)/2,scaleB:.6/2,sq:6,segs:24,capA:!0,capB:!0}),ie=Se=>{let xe=b(C,.38);return vn(xe.pts.slice(xe.nEar-4,xe.pts.length-xe.nEar+4).map(([ge,Le])=>Ge(Se,ge,Le)),.3,{segs:10,capA:!0,capB:!0})},he=[ae,ie(D+.32),ie(S-.32)];for(let Se of he){let xe=Se.attributes.position;for(let ge=0;ge<xe.count;ge++){let Le=xe.getX(ge),ke=(P(Le)+.6/2)/(P(C)+.6/2);xe.setY(ge,xe.getY(ge)*ke),xe.setZ(ge,K(Le)+(xe.getZ(ge)-K(C))*ke)}}for(let Se of[-1,1]){let xe=Se<0?F.pts.slice(0,F.nEar-5).reverse():F.pts.slice(se-F.nEar+5);he.push(vn(xe.map(([ge,Le])=>Ge(C,ge,Le)),1,{up:Ut,scaleN:(S-D)/2*.72,scaleB:.9,sq:4,segs:18,capA:!0,capB:!0}))}return{gs:he,L0:F}},O=M(37.6,44.1),L=M(55.7,62.2);c("mp","lig",...O.gs,...L.gs);let A=D=>{let S=[];for(let ge=43.6;ge<=56.21;ge+=.2)S.push(ge);let C=14,F=6,se=[],j=[];for(let ge of S){let Le=P(ge)+.06,ke=P(ge)+.48,We=(Le+ke)/2,ze=(ke-Le)/2,nt=K(ge),Be=Math.min(5.95,Math.abs(ge-49.9))/6,gt=5.6*Math.pow(1-Math.pow(Be,2.5),1/2.5),qe=Math.asin(gt/ke)/Ct,Qe=140,ut=ze/We/Ct,Tt=[];for(let At=0;At<=C;At++)Tt.push([qe+ut+(Qe-qe-2*ut)*At/C,ke]);for(let At=1;At<F;At++){let Vt=Math.PI/2-Math.PI*At/F;Tt.push([Qe-ut+ut*Math.cos(Vt),We+ze*Math.sin(Vt)])}for(let At=0;At<=C;At++)Tt.push([Qe-ut-(Qe-qe-2*ut)*At/C,Le]);for(let At=1;At<F;At++){let Vt=-Math.PI/2-Math.PI*At/F;Tt.push([qe+ut+ut*Math.cos(Vt),We+ze*Math.sin(Vt)])}for(let[At,Vt]of Tt)se.push(ge,D*Vt*Math.sin(At*Ct),nt+Vt*Math.cos(At*Ct))}let ae=se.length/3/S.length;for(let ge=0;ge<S.length-1;ge++)for(let Le=0;Le<ae;Le++){let ke=ge*ae+Le,We=ge*ae+(Le+1)%ae,ze=ke+ae,nt=We+ae;j.push(ke,ze,We,We,ze,nt)}let ie=new Dt;ie.setAttribute("position",new at(se,3)),ie.setIndex(j),ie.computeVertexNormals();let he=Math.floor(C/2),Se=Ge().fromBufferAttribute(ie.attributes.normal,he),xe=Ge().fromBufferAttribute(ie.attributes.position,he);if(Se.y*xe.y+Se.z*(xe.z-K(S[0]))<0){let ge=ie.index.array;for(let Le=0;Le<ge.length;Le+=3){let ke=ge[Le+1];ge[Le+1]=ge[Le+2],ge[Le+2]=ke}ie.computeVertexNormals()}return zr(ie)};c("mp","lig",A(1),A(-1));for(let D of[O,L]){let S=(D===O?81.7:117.9)/2,C=Math.abs(D.L0.yEar),F=D.L0.zF-2.2,se=[[-12.4,0],[-12.4,1.05]];for(let ie=-12,he=0;ie<C+1.6;ie+=.45,he++)se.push([ie,he%2?.98:1.12]);se.push([C+1.9,.95],[C+2.1,0]);let j=yt([[0,0],[0,1.6],[.2,1.9],[.5,2],[.7,3.3],[.9,3.55],[3.5,3.55],[3.8,3.35],[4.6,3],[5.3,2.3],[5.7,1.3],[5.85,0]],{segs:120,crease:40});{let ie=j.attributes.position;for(let he=0;he<ie.count;he++){let Se=ie.getX(he),xe=ie.getY(he),ge=ie.getZ(he);if(Math.hypot(Se,ge)>3.3&&xe>.85&&xe<3.55){let ke=1+.045*Math.cos(30*Math.atan2(ge,Se));ie.setX(he,Se*ke),ie.setZ(he,ge*ke)}}j.computeVertexNormals()}let ae=ie=>Gt(yt([[0,0],[0,1.85],[.25,2.15],[2.15,2.15],[2.4,1.85],[2.4,0]],{segs:28,crease:40}),Ge(S,ie,F),Si);c("mp","lig",Gt(yt(se,{segs:16,crease:60}),Ge(S,0,F),Si),Gt(j,Ge(S,-12.4,F),Si.clone().negate()),ae(C-.7),ae(-C-1.7))}for(let D of l.mp.lig){let S=D.attributes.position;for(let C=0;C<S.count;C++){let F=S.getX(C);S.setY(C,S.getY(C)*(rt.rho(F)+.05)/P(F))}D.computeVertexNormals()}}Object.assign(rt,d);let p=(z,U)=>{let P=[z[0]];for(let K=1;K<z.length;K++){let[q,G]=z[K-1],[b,M]=z[K],O=Math.max(1,Math.round(Math.abs(b-q)/U));for(let L=1;L<=O;L++)P.push([q+(b-q)*L/O,G+(M-G)*L/O])}return P};if(!e){c("barrel","wood",nn(yt([[77.2,13.2],[77.2,13.9],...Pa([[77.4,13.9],[86,14.45],[96,15.15],[106,15.55],[118,15.62],[125,15.48],[129.6,15.2]],40),[129.8,14.6]],{segs:72,crease:40}))),c("barrel","silver",u(nn(yt([[71,11.4],[71,14],[71.3,14.25],[72.2,14.25],[72.35,14],[72.5,14.2],[73.3,14.2],[73.45,14],[73.6,14.3],[77,14.3],[77.4,14],[77.4,13.5]],{segs:72,crease:30}))),u(nn(yt([[129.6,14.8],[129.6,15.1],[129.9,15.35],[132.8,15.35],[132.95,15.1],[133.1,15.25],[133.9,15.25],[134.05,15.1],[134.2,15.35],[135.7,15.35],[136,15.05],[136,11.3]],{segs:72,crease:30})))),c("barrel","dark",nn(yt([[71.05,11.4],[89,11.4],[89,7.4]],{segs:40,crease:40})),nn(yt([[135.95,11.3],[118,11.3],[118,7.4]],{segs:40,crease:40})),Gt(ci(7.4),Ge(100,0,0),Ut));let z=nn(yt(p([[118.5,7.5],[118.5,10.7],[118.9,11],[136,11],[136,14.2],[136.3,14.45],[325.7,14.45],[326,14.2],[326,11],[343.6,11],[344,10.7],[344,7.5]],1.5),{segs:120,crease:40}));z.userData.tube=!0,c("upper","wood",z),c("upper","cork",nn(yt([[121.5,11],[121.5,11.28],[132.5,11.28],[132.5,11]],{segs:48,crease:40})),nn(yt([[329.5,11],[329.5,11.28],[340.5,11.28],[340.5,11]],{segs:48,crease:40}))),c("upper","dark",Gt(ci(7.5),Ge(118.4,0,0),Ut),Gt(ci(7.5),Ge(344.1,0,0),Ut));let U=nn(yt(p([[333.8,14],[333.8,14.35],[566,15.65],[566,11.6],[583.6,11.6],[584,11.3],[584,7.6]],1.5),{segs:120,crease:40}));U.userData.tube=!0,c("lower","wood",U),c("lower","cork",nn(yt([[569.5,11.6],[569.5,11.88],[580.5,11.88],[580.5,11.6]],{segs:48,crease:40}))),c("lower","silver",u(nn(yt([[326,11.4],[326,14.55],[326.3,14.8],[329.2,14.8],[329.35,14.55],[329.5,14.9],[330.4,14.9],[330.55,14.65],[330.7,15.05],[333.6,15.05],[334,14.7],[334,14.3]],{segs:72,crease:30})))),c("lower","dark",nn(yt([[326.05,11.4],[344.5,11.4],[344.5,7.5]],{segs:40,crease:40})),Gt(ci(7.5),Ge(352,0,0),Ut),Gt(ci(7.6),Ge(584.1,0,0),Ut));let P=Br.lowerEnd;c("bell","wood",nn(yt([[P+6.3,15],[P+6.3,15.45],...Pa([[P+6.5,15.45],[P+22,16.4],[P+40,18.3],[P+58,20.7],[P+71,22.9],[P+78,24.7],[P+86,27.6],[P+90,29.7],[P+93,31.8],[P+96,34.9],[P+98.2,37],[P+100.5,37.7],[P+103.4,37.75],[P+104.2,37],[P+104.4,35.6]],90),...Pa([[P+104.4,35.6],[P+104.1,34.2],[P+102,32.2],[P+97,29],[P+91,25.8],[P+84,22.9],[P+76,20.3],[P+64,17.7],[P+46,15.2],[P+28,13.2],[P+19,12.3]],60)],{segs:96,crease:40}))),c("bell","bore",nn(yt([[P+19,12.3],[P+19,11.8],[P+.05,11.8]],{segs:72,crease:40}))),c("bell","dark",Gt(ci(12.2),Ge(P+22,0,0),Ut)),c("bell","silver",u(nn(yt([[P+100.2,37.25],[P+100.2,37.9],[P+100.4,38.15],[P+100.9,38.2],[P+101.05,38.05],[P+101.2,38.22],[P+103.6,38.5],[P+104.3,38.3],[P+104.7,37.8],[P+104.85,37],[P+104.85,35.25],[P+104.62,34.85],[P+103.8,34.8]],{segs:128,crease:35})))),c("bell","silver",u(nn(yt([[P,11.8],[P,15.8],[P+.3,16.05],[P+1.1,16.05],[P+1.25,15.8],[P+1.4,15.95],[P+2.2,15.95],[P+2.35,15.8],[P+2.5,16.15],[P+6.1,16.15],[P+6.5,15.8],[P+6.5,15.4]],{segs:72,crease:30}))));{let K=q=>(G,b,M)=>Ge(b,-G,-(Mt(b)+(typeof q=="function"?q(G,b):q)+M));h("rest",ir([[-4,338],[4,338],[4.4,349],[-4.4,349]],[0,343.5],K(.5),{thick:1.6,dome:.1,edge:.2})),h("rest",ir([[-4.4,347.6],[4.4,347.6],[6.8,350.6],[8.6,354.8],[8,357.6],[0,359],[-8,357.6],[-8.6,354.8],[-6.8,350.6]],[0,353],K((q,G)=>1+9.5*Math.pow(Nt(347.6,360,G),1.4)+.025*q*q),{thick:2.2,dome:0,edge:.3}));for(let q of[341,345.6])h("silver",Gt(yt([[0,0],[0,1.15],[.5,1.15],[.7,.9],[.7,0]],{segs:16,crease:40}),Et(q,180,Mt(q)+1),It(180)))}}let m={},_=[],f=[],g=(z,U)=>{let P=new si;P.name=z,P.position.copy(U.pivot);let K=a[U.joint||o(U.s)];K.add(P);let q=r.silver.clone();q.name="key:"+z,q.clearcoat=.001,q.roughness=.07,q.color.set(15263455),q.vertexColors=!0;let G={id:z,group:P,pivot:U.pivot.clone(),sign:1,angle:(U.angle||4)*Ct,mat:q,meshes:[],x:0,v:0,to:0,paint:0,paintTo:0,colTo:new mt(15790321),out:U.out||It(0),anchor:U.anchor||U.pivot.clone(),xMid:U.s,joint:K,axis:U.axis||null,rot:0,size:U.size||4,restUp:!!U.restUp,cups:[]};return m[z]=G,G},v=(z,U,...P)=>{for(let K of P){let q=zr(K);U==="key"&&nc(q),q.translate(-z.pivot.x,-z.pivot.y,-z.pivot.z);let G=new Jt(q,U==="key"?z.mat:r[U]);G.name=z.id+":"+U,z.group.add(G),z.meshes.push(G)}},y=(z,U,P)=>{let K=U.clone().sub(z.pivot),q=K.clone().applyAxisAngle(z.axis||Ut,.01).sub(K);z.sign=q.dot(P)>=0?1:-1},w=(z,U,P,K)=>g(z,Object.assign({pivot:U.at(P),axis:U.R!=null?null:U.dir,s:P},K)),T=(z,U,P,K=.6)=>z.R==null?On(z.at(U),z.at(P),z.r+K,18):nn(yt([[U,0],[U,z.r+K-.25],[U+.3,z.r+K],[P-.3,z.r+K],[P,z.r+K-.25],[P,0]],{segs:18,crease:40})).translate(0,z.at(U).y,z.at(U).z),E=(z,U,P,K=80)=>{let q=ic(P,U),G=bi(z,U,q+1,K);return{th:G,s:U,r:P,sh:q,n:It(G),seat:Et(U,G,Mt(U)+q),top:Et(U,G,Mt(U)+q+Fi(P))}},V=(z,U,P)=>{let K=ic(P,U);return{th:z,s:U,r:P,sh:K,n:It(z),seat:Et(U,z,Mt(U)+K),top:Et(U,z,Mt(U)+K+Fi(P))}},W=(z,U)=>{v(z,"key",Gt((U.geo||jh)(U.r),U.seat.clone(),U.n)),v(z,"pad",Gt(Xh(U.r),U.seat.clone(),U.n)),h("wood",Gt(qh(U.r),U.seat.clone(),U.n)),h("dark",Gt(ci(U.r*.5),U.seat.clone().addScaledVector(U.n,-1.55),U.n)),z.cups.push(U),f.push({p:z,c:U})},H=(z,U)=>.3+.7*Nt(0,.4,z/U),$=(z,U,P,K=3.2,q=1.5)=>{let G=U-z.th;for(;G>180;)G-=360;for(;G<-180;)G+=360;let b=Qn(z.th).multiplyScalar(Math.sign(G)||1),M=z.top,O=M.clone().addScaledVector(b,z.r*1.04).addScaledVector(z.n,-.5),L=Math.atan2(O.y,O.z)/Ct,A=Math.hypot(O.y,O.z),D=z.th+G-L;for(;D>180;)D-=360;for(;D<-180;)D+=360;let S=[M.clone().addScaledVector(z.n,.3),M.clone().addScaledVector(b,z.r*.5).addScaledVector(z.n,.3),M.clone().addScaledVector(b,z.r*.86).addScaledVector(z.n,.05),O];for(let C=1;C<=6;C++){let F=C/6;S.push(Et(z.s,L+D*F,Math.max(Mt(z.s)+1.5,A+(P-A)*Nt(0,1,F))))}return vn(wi(S,40),(C,F)=>.1+.9*Nt(0,.3,C/F),{up:Ut,scaleN:K/2,scaleB:q/2,sq:5,segs:22,capA:!0,capB:!0})},ee=(z,U,P,K={})=>{let q=w(z,P,U.s,{angle:K.angle||6,out:U.n,anchor:U.top.clone(),size:U.r,restUp:!0});W(q,U);let G=P.at(U.s),b=Math.hypot(G.y,G.z)+(K.lug||0);return v(q,"key",$(U,P.th,b,K.w||3.2),T(P,U.s-3.2,U.s+3.2)),K.lug&&v(q,"key",On(G,Et(U.s,P.th,b),1.1,12)),y(q,U.seat,U.n),q},te=(z,U,P,K,q,G,b,M={})=>{let O=M.th!=null?M.th:bi(U,P,0),L=It(O),A=Et(P,O,Mt(P));b?(h("wood",Gt(yt([[-3,q-.4],[.9,q-.4],[1.2,q-.7],[1.2,G+.4],[.8,G],[-.3,G]],{segs:40,crease:40}),A.clone(),L)),h("dark",Gt(ci(G+.05),A.clone().addScaledVector(L,.28),L))):h("dark",Wh(P,O,G));let D=new Jt(zr(Gt(yt([[0,q-.6],[.5,q-.75],[.9,q*.6],[1.05,0]],{segs:32}),A.clone().addScaledVector(L,b?1.2:.75),L)),new Zn({color:16777215,roughness:.55,metalness:0,transparent:!0,opacity:0,depthWrite:!1}));if(D.visible=!1,D.name="finger:"+z,D.renderOrder=1,a[o(P)].add(D),_.push({id:z,mesh:D,mat:D.material,s:P,a:0,to:0}),!b)return g(z,{pivot:A.clone(),s:P,out:L,anchor:A.clone().addScaledVector(L,1.4),size:q,angle:0});let S=w(z,b,P,{angle:M.angle||3.4,out:L,anchor:A.clone().addScaledVector(L,1.6),size:K,restUp:!0});v(S,"key",Gt(Gh(K,q),A.clone().addScaledVector(L,-.3),L));let C=b.at(P),F=C.clone().sub(A);F.addScaledVector(L,-F.dot(L)).normalize();let se=A.clone().addScaledVector(F,K-.5).addScaledVector(L,.5),j=vn(wi([A.clone().addScaledVector(F,q+.15).addScaledVector(L,1.45),A.clone().addScaledVector(F,(q+K)/2+.6).addScaledVector(L,1.55),se.clone().addScaledVector(L,.25)],16),(ae,ie)=>.2+.8*Nt(0,ie*.85,ae),{up:L,scaleN:.85,scaleB:1.3,sq:2.6,segs:16,capA:!0,capB:!0});return v(S,"key",Yh(P,Math.atan2(se.y,se.z)/Ct,Math.hypot(se.y,se.z),b.th,Math.hypot(C.y,C.z),2.6,1.9,{clear:1.2,sq:2.6,taper:(ae,ie)=>.85+.4*Nt(.3*ie,ie,ae)}),j,T(b,P-4,P+4)),y(S,A,L),S},oe=(z,U,P,K,q)=>{let G=g(z,Object.assign({out:q,anchor:K},U));return v(G,"key",...P),y(G,K,q.clone().negate()),G},ne=(z,U,P={})=>{h("silver",On(z.a,z.b,z.r));for(let K of U){let q=z.at(K),G=Math.max(2.5,(P.ball||z.r+.95)*1.1);if(h("silver",...hi(K,z.th,Math.hypot(q.y,q.z),{ball:P.ball||z.r+.95})),Math.abs(K-z.s0)<.01||Math.abs(K-z.s1)<.01){let b=z.dir.clone().multiplyScalar(Math.abs(K-z.s0)<.01?-1:1),M=It(z.th),O=b.clone().cross(M).normalize(),L=new Mi(.55,.5,G*1.5),A=new ht().makeBasis(O,b,M);A.setPosition(q.clone().addScaledVector(b,G*Math.sqrt(1-.16)-.05)),L.applyMatrix4(A),h("dark",L)}}};if(e)Vh({THREE:{Matrix4:ht,Mesh:Jt,MeshStandardMaterial:Zn,TorusGeometry:us,BufferAttribute:$t,BoxGeometry:Mi},V3:Ge,RAD:Ct,AX:Ut,AY:Si,AZ:Jh,clamp:bt,smooth:Nt,sweep:vn,lathe:yt,place:Gt,spline:wi,densify:df,merge:tc,rad:Et,nrm:It,tan:Qn,wrap:kn,wrapTh:bi,cylX:gf,ball:tu,arcPts:vf,strap:_f,touchPad:yf,plateGeo:ir,withUV:zr,X:nn,disc:ci,rodSeg:On,interp:xf,smoothProf:Pa,faceAway:ac,contactShade:nc,ringGeo:Gh,holePatch:Wh,cupWall:oc,cupH:Fi,cupGeo:jh,padGeo:Xh,seatGeo:qh,seatH:ic,post:hi,armArc:Yh,lever:rc,leverP:La,plate:fs,flat:ms,tearXY:Zh,domePad:Mf,capPad:Kh,leverZ:sc,dense:p,initRods:nu,M:r,root:t,joints:a,statics:l,add:h,addTo:c,plain:u,parts:m,fingers:_,reflCups:f,mkPart:g,partAdd:v,chooseSign:y,onRod:w,sleeve:T,cupAt:E,cupTh:V,cupOn:W,pointed:H,cupArm:$,openCup:ee,ringKey:te,rocker:oe,rodStatic:ne});else{ne(_t.U1,[225.3,257.5,280.5,322.6]),ne(_t.Th,[228,250.6],{ball:2}),ne(_t.Gs,[201.5,224]),ne(_t.Eb,[274.4,294]),ne(_t.Cs,[304.2,323]);{let[z,U]=Bt(340.5,1175);te("L1",z,U,6.2,4.7,2.75,_t.U1)}{let[z,U]=Bt(329.2,1447.5);te("L2",z,U,7.1,5.4,3.3,_t.U1)}{let[z,U]=Bt(361.7,1639.3);te("L3",z,U,0,4.9,4,null)}te("T",0,239.5,7.7,5.9,3.5,_t.Th,{th:180});{let[z,U]=Bt(351,987);ee("P",E(z,U,4.5),_t.U1)}{let[z,U]=Bt(334,1329),P=ee("Ev",E(z,U,5.2),_t.U1);v(P,"key",La([[-72,18.2,316],[-72,19.5,322.5],[-72,19.75,335.5]],4.4,1.2),T(_t.U1,312,320))}{let z=Bt(0,910)[1],U=4.3,P=Et(z,0,Mt(z)+U),K=kn(Bt(289,910)[0],z,U),q=kn(Bt(392,910)[0],z,U);h("silver",On(K,q,1.15),...hi(z,bi(Bt(289,910)[0],z,U),K.length()>0?Math.hypot(K.y,K.z):18,{ball:2.3}),...hi(z,bi(Bt(392,910)[0],z,U),Math.hypot(q.y,q.z),{ball:2.3}));let[G,b]=Bt(341.5,759),M=E(G,b,5.2),O=fs(Ca([[356,925],[358,945],[372,985],[381,1020],[382,1045],[373,1070],[358,1085],[343,1090],[325,1085],[310,1070],[301,1045],[301,1020],[310,985],[322,945],[328,925]]),7.2,{thick:1.9,dome:.28,edge:.22,NE:10}),L=rc([[G,b+.5,M.sh+Fi(5.2)-.3],[G,b+8,5.4],[G,z-3,4.6],[G,z+3,4.9],[G,z+9,7]],3.4,1.5),A=kn(Bt(342,1040)[0],Bt(342,1040)[1],8.1),D=oe("A",{pivot:P,axis:Si.clone(),angle:7.5,s:z,size:5},[O,L,On(kn(G-4.4,z,U),kn(G+4.4,z,U),1.8)],A,It(0));W(D,M),v(D,"key",Gt(yt([[0,0],[0,1.7],[.9,1.7],[1.15,1.35],[1.15,0]],{segs:18,crease:40}),kn(G,Bt(0,822)[1],5.9),It(0)))}{let z=_t.Gs,[U,P]=Bt(266,845),K=E(U,P,4.9),q=Mt(P),G=vn(wi([Et(P,K.th,q+K.sh+Fi(4.9)-.3),Et(P,K.th+16,q+5.6),Et(P,-4,q+7.4),Et(P,15,q+6.2),Et(P,z.th,z.R)],30),H,{up:Ut,scaleN:1.5,scaleB:.65,sq:3,segs:14,capA:!0,capB:!0}),b=Ca([[441,846],[454,846],[463,905],[483,955],[503,995],[516,1035],[521,1085],[517,1135],[505,1168],[490,1177],[470,1165],[455,1140],[448,1100],[449,1050],[451,1010],[450,965],[445,900]]),M=ms(b,Bt(478,1050),10.5,38,{thick:2,dome:.3,edge:.2,NE:10}),O=It(38),L=Ge(Bt(486,1080)[1],Bt(486,1080)[0],10).addScaledVector(O,1.2),A=oe("Gs",{pivot:z.at(P),angle:6.5,s:P,size:5},[G,M,T(z,z.s0+1.6,z.s1-1.6)],L,O);W(A,K)}{let z=_t.Eb,U=V(86,Bt(0,1460)[1],4.4),P=fs(Ca([[303,1555],[318,1545],[357,1530],[400,1517],[428,1503],[446,1488],[462,1492],[448,1512],[433,1520],[395,1540],[357,1556],[317,1563]]),3.3,{c:Bt(385,1532),thick:1.3,dome:.3}),K=kn(Bt(330,1550)[0],Bt(330,1550)[1],4.1),q=oe("Eb",{pivot:z.at(U.s),angle:6,s:U.s,size:3},[P,T(z,z.s0+1.5,z.s1-1.5),$(U,z.th,z.R,2.8,1.3)],K,It(bi(Bt(330,1550)[0],Bt(330,1550)[1],3.3)));W(q,U)}{let z=_t.Cs,U=V(-122,311,4.6),P=rc([[-13.6,309.5,2.3],[-13.2,315.5,2.6],[-11.4,319.4,3],[-7.5,321.2,3.3],[0,321.7,3.5],[8,320.7,3.8],[13.5,319.2,4.2]],3.3,2),K=fs(Ca([[430,1700],[455,1692],[480,1690],[500,1696],[513,1708],[514,1726],[503,1748],[485,1762],[455,1764],[430,1750],[420,1728]]),4.3,{thick:1.9,dome:.28,edge:.22,NE:10}),[q,G]=Bt(478,1727),b=kn(q,G,5.2),M=oe("LCs",{pivot:z.at(313),angle:5.5,s:313,size:4.5},[P,K,T(z,z.s0+1.5,z.s1-1.5),$(U,z.th,z.R,2.8,1.3)],b,It(bi(q,G,4.3)));W(M,U)}{let z=(P,K,q,G,b,M,O,L,A=4.4,D=null,S=null)=>{let C=La([[K.th,Mt(K.s)+K.sh+Fi(K.r)-.3,K.s],...q],A,1.4,{taper:(xe,ge)=>.55+.45*Nt(0,.1,xe/ge),face:D}),F=q[q.length-1],se=Et(F[2],F[0],F[1]),j=[C],ae=(xe,ge)=>vn(wi([se,se.clone().lerp(xe,.5).add(Ge(0,-.5,.5)),xe],24),(Le,ke)=>.85+.3*Nt(.45*ke,ke,Le),{up:It(-45),scaleN:.8,scaleB:ge/2,sq:4,segs:18,capA:!0,capB:!0}),ie,he;if(G.block){let xe=Ge(...G.block);he=It(G.face),j.push(ae(xe,4)),j.push(vn([xe.clone().add(Ge(-1.8,0,0)),xe.clone().add(Ge(1.8,0,0))],1,{up:he,scaleN:1.5,scaleB:2.2,sq:4,segs:20,capA:!0,capB:!0}));let ge=xe.clone().addScaledVector(he,2.9);j.push(On(xe,ge.clone().addScaledVector(he,.2),1.25,16),Kh(ge,G.face,G.len,G.wid,G.H)),ie=ge.clone().addScaledVector(he,G.H)}else{let xe=G.face,ge=Qn(xe),Le=1/Math.cos(xe*Ct),ke=G.c[0],We=(nt,Be)=>Ge(Be,ke,G.z0).addScaledVector(ge,(nt-ke)*Le);he=It(xe);let ze=[];for(let nt=0;nt<40;nt++){let Be=nt/40*Math.PI*2,gt=Math.cos(Be),qe=Math.sin(Be);ze.push([G.c[0]+G.wid/2*Math.sign(gt)*Math.pow(Math.abs(gt),.85),G.c[1]+G.len/2*Math.sign(qe)*Math.pow(Math.abs(qe),.85)])}j.push(ms(ze,G.c,G.z0,xe,{thick:2,dome:0,edge:.2,NT:112,NR:12,NE:8,top:(nt,Be,gt)=>-.35*(1-gt*gt)})),j.push(ae(We(G.at[0],G.at[1]).addScaledVector(he,-1),3.6)),ie=We(G.c[0],G.c[1]).addScaledVector(he,1)}let Se=oe(P,{pivot:Et(b,M,O),axis:Qn(S??D??M),angle:L,s:b,joint:"upper",size:3.6},j,ie,he);return W(Se,K),h("silver",hi(b,M,O-.5)[0]),Se};z("S1",V(-75,Bt(0,467)[1],5),[[-80,14.45+4.6,172],[-85.2,19.8,198],[-85.2,19.8,300],[-85.2,20.4,306]],{block:[319.4,-26.6,2.6],face:-50,len:7,wid:6.6,H:2.6},256,-85.2,19.8,1.7,4.5,-45),z("S2",V(-112,Bt(0,791)[1],4.6),[[-104,14.45+5.2,211],[-94.1,23.1,222],[-94.1,23.1,300],[-94,23.4,309]],{block:[326.4,-27,1.4],face:-50,len:7,wid:6.6,H:2.6},262,-94.1,23.1,2.2,4.5,-45),z("S3",V(-100,262,4.3),[[-100,17.7,269],[-100,17.5,316],[-96,19.4,322]],{c:[-27.6,332.9],len:9,wid:7,z0:2.2,face:-45,at:[-26.4,330.2]},300,-100,17.5,3.4,4,-45,-100),z("S4",V(-84,288.7,4.3),[[-84,17.4,295.5],[-84,17.2,318],[-84,18.3,328]],{c:[-25.8,341.8],len:9,wid:7.4,z0:2.8,face:-45,at:[-24.8,339]},316,-84,17.2,4.4,4,-45,-84)}{let P=Et(197,180,Mt(197)+3.3),K=L=>(A,D,S)=>Ge(D,-A,-(Mt(D)+L(D)+S)),q=V(180,155.6,5),G=ir([[-1.7,159],[.5,159],[.6,201],[2.6,212],[3.3,222],[1.6,229],[-.7,230.4],[-3,229],[-4.3,222],[-3.2,212],[-1.6,201]],[-.5,204],K(L=>3+2.2*Nt(200,228,L)),{thick:1.5,dome:.35,edge:.2}),b=Ge(197,3.8,-(Mt(197)+3.3)),M=Ge(197,-9.6,-(Mt(197)+3.3-2.2));h("silver",On(b,M,1.1),...hi(197,180-Math.atan2(3.8,Mt(197)+3.3)/Ct,Math.hypot(b.y,b.z),{ball:2}),...hi(197,180+Math.atan2(9.6,Mt(197)+3.3-2.2)/Ct,Math.hypot(M.y,M.z),{ball:2.1}));let O=oe("R",{pivot:P,axis:Si.clone(),angle:5.5,s:197,size:4},[G,On(Ge(197,2.4,P.z),Ge(197,-2.6,P.z),1.7)],Et(222,180,Mt(222)+6.2),It(180));W(O,q),h("silver",Gt(yt([[-2,2],[1.3,2],[1.45,1.8],[1.45,1.3]],{segs:20,crease:40}),Et(q.s,180,Mt(q.s)),It(180)))}ne(_t.L1,[345,419.3]);{let[z,U]=qt(295.7,236.7),P=ee("C",E(z,U,6.4),_t.L1);v(P,"key",La([[-68,16.6,351],[-70,17.5,343],[-72,18.3,337],[-72,18.35,330.5]],4.4,1.2))}{let[z,U]=qt(293.7,351.7);te("R1",z,U,7.86,6.1,4.2,_t.L1)}{let[z,U]=qt(295.7,545.7);te("R2",z,U,7.7,6,3.96,_t.L1)}{let[z,U]=qt(295,715);te("R3",z,U,8.5,6.6,4.5,_t.L1)}{let z=_t.L1,U=Hh([[186,601],[205,603],[250,612],[320,624],[333,627],[338,633],[333,640],[320,642],[243,632],[205,626],[186,624]]),[P,K]=qt(300,630),q=qt(0,612)[1];oe("BF",{pivot:z.at(q),angle:5,s:q,size:2.6},[fs(U,3.3,{c:qt(262,622),thick:1.3,dome:.3}),T(z,q-2.6,q+2.6)],kn(P,K,4.1),It(bi(P,K,3.3)))}{let z=({tip:q,wide:G,neck:b,w:M,wn:O},L)=>L<=G?M/2*Math.sqrt(Math.max(0,1-Math.pow((G-L)/(G-q),2))):O/2+(M-O)/2*(1+Math.cos(Math.PI*bt((L-G)/(b-G),0,1)))/2,U=({tip:q,wide:G,neck:b,cT:M,cN:O,w:L,wn:A})=>{let D=F=>M+(O-M)*bt((F-q)/(b-q),0,1),S=[],C=[];for(let F=1;F<=9;F++){let se=F/9*Math.PI/2,j=G-(G-q)*Math.cos(se),ae=L/2*Math.sin(se);S.push([D(j)+ae,j]),C.push([D(j)-ae,j])}for(let F=1;F<=10;F++){let se=F/10,j=G+(b-G)*se,ae=A/2+(L-A)/2*(1+Math.cos(Math.PI*se))/2;S.push([D(j)+ae,j]),C.push([D(j)-ae,j])}return[[D(q),q],...S,[D(b),b+.5],...C.reverse()]},P=(q,G,b,M,O,L,A,D=[],S={})=>{let C=U(G),F=[G.cT+(G.cN-G.cT)*(G.wide-G.tip)/(G.neck-G.tip),G.wide],se=F[0],j=It(M),ae=Qn(M),ie=1/Math.cos(M*Ct),he=We=>2.4*Math.pow(Nt(G.neck,G.tip,We),2),Se=(We,ze,nt)=>Ge(ze,se,b).addScaledVector(ae,(We-se)*ie).addScaledVector(j,nt+he(ze)),xe=We=>G.cT+(G.cN-G.cT)*bt((We-G.tip)/(G.neck-G.tip),0,1),ge=(We,ze)=>{let nt=bt(Math.abs(We-xe(ze))/Math.max(.3,z(G,ze)),0,1);return 1.1*(1-nt*nt)*(1-.6*Nt(G.wide,G.neck,ze))},Le=ir(C,F,Se,{thick:2,dome:0,edge:.18,NE:8,NT:128,NR:14,top:(We,ze)=>ge(We,ze)}),ke=O.map(([We,ze,nt])=>{let Be=qt(We,ze);return[Be[0],Be[1],nt]});return oe(q,{pivot:Ge(L,A[0],A[1]),axis:Qn(55),angle:2.6,s:L,joint:"lower",size:4},[Le,sc(ke,4.4,1.8,60,Object.assign({sq:4},S)),...D],Se(F[0],F[1],1.6),j)},K=(q,G,b)=>{let M=Math.atan2(G,b)/Ct,O=Math.atan2(9.9,14.3)/Ct,L=Math.hypot(G,b),A=Math.hypot(9.9,14.3),D=[];for(let S=0;S<=16;S++){let C=S/16,F=Nt(0,1,C);D.push(Et(q-17*(1-C)*(1-.35*C),M+(O-M)*F,L+(A-L)*F+.9*Math.sin(Math.PI*C)))}return vn(wi(D,40),1,{up:It(60),scaleN:.9,scaleB:2.2,sq:4,segs:20,capA:!0,capB:!0})};P("LF",{tip:324.6,wide:328.6,neck:333.6,cT:24.6,cN:23.6,w:8,wn:3},3,35,[[452,112,3.2],[454,200,1.4],[448,300,.4],[434,400,.6],[421,519,2.4]],qt(0,400)[1],[20.6,.6],[],{taper:(q,G)=>1-.6*Nt(.7,1,q/G)}),P("LFs",{tip:334.4,wide:340.2,neck:357.6,cT:26.4,cN:25.9,w:6.6,wn:3},2.5,40,[[470,285,2.8],[462,360,3],[450,440,3.4],[438,510,3.8],[425,590,4],[417,700,4],[417,752,4]],qt(0,571)[1],[20.1,3.9],[K(qt(0,870)[1],18.4,4)]),P("LE",{tip:327,wide:333.4,neck:351.2,cT:17.6,cN:20.6,w:7,wn:3},10.3,40,[[432,238,8.2],[436,300,7.4],[430,380,7],[420,470,6.6],[408,560,6.2],[402,640,6],[402,733,6]],qt(0,519)[1],[18.1,6.4],[K(qt(0,847)[1],16.4,6)]);for(let[q,G]of[[519,6.4],[571,3.9]]){let b=qt(0,q)[1];h("silver",...hi(b,80,Mt(b)+4.6,{ball:2.4}),On(Et(b,80,Mt(b)+4.4),Ge(b,17.6,G),1,12))}}{let z=P=>P.map(([K,q,G])=>{let b=qt(K,q);return[b[0],b[1],G]}),U=(P,K,q,G,b,M,O,L,A=[],D={})=>{let S=O.map(([se,j,ae])=>{let ie=qt(se,j);return[ie[0],ie[1],ae]}),C,F;if(Array.isArray(q))F=qt(G[0],G[1]),C=ms(Hh(q),F,b,M,{thick:2.2,dome:.3,edge:.2,bow:.006,NT:144,NR:12,NE:10});else{let se=Zh(qt(...q.tip),qt(...q.neck),q.w,q.wn);F=se.centre,C=ms(se.pts,F,b,M,{thick:2.3,dome:0,edge:.13,bow:.006,NT:144,NR:14,NE:8,top:(j,ae)=>se.crown(j,ae,.32)})}return oe(P,{pivot:K.at(L),axis:K.dir.clone(),angle:D.angle||4.5,s:L,size:5},[C,sc(S,3.4,2.4,M,{sq:3.2}),...A],Ge(F[1],F[0],b).addScaledVector(It(M),1.2),It(M))};ne(_t.Rg,[431.5,469.7,481],{ball:1.9}),h("silver",On(_t.Fs.a,_t.Fs.b,_t.Fs.r),On(_t.RF.a,_t.RF.b,_t.RF.r),On(_t.RE.a,_t.RE.b,_t.RE.r));for(let P of[449.4,510.5,551])h("silver",...hi(P,8.8,Mt(P)+2.6,{ball:2.5}));for(let P of[449.4,478])h("silver",...hi(P,-6,Mt(P)+2.6,{ball:1.9}));U("RFs",_t.Fs,{tip:[88,789],neck:[251,844],w:10.2,wn:5},null,14.6,-25,[[226,834,17.2],[244,838,17.7],[262,880,18],[270,930,18],[270,962,17.7]],462,[T(_t.Fs,450.5,476.8,.35)]),U("RE",_t.RE,{tip:[49,864],neck:[230,921],w:10.2,wn:5},null,14.8,-25,[[206,925,17.4],[224,932,17.4],[262,958,17.4],[296,970,17.6],[309.7,994,17.4]],500,[T(_t.RE,451,550,.7)]);{let P=_t.Rg,K=qt(409,953)[1],q=V(80,K,6.4),G=P.at(K),b=U("RGs",P,{tip:[172,807],neck:[344,862],w:10,wn:5},null,21.1,-12,[[318,848,21.6],[334,852,21.8],[346,890,20.6],[347,930,18.4],[347,953,16.2]],K,[T(P,441.5,452),$(q,P.th,Math.hypot(G.y,G.z),3,1.4)]);W(b,q)}U("RF",_t.RF,{tip:[158,879],neck:[346,943],w:10,wn:5},null,22.4,-12,[[320,939,22.6],[334,948,21.4],[322,985,18.6],[295,1003,17.4]],500,[T(_t.RF,451,550,.7)]);{let[P,K]=qt(174,1155);ee("Fs",E(P,K,8.6),_t.Fs,{angle:7.5,w:3.4})}{let[P,K]=qt(400,1387);ee("F",E(P,K,8.6),_t.RF,{angle:7.5,w:3.4,lug:1.9})}{let[P,K]=qt(168,1670);ee("E",E(P,K,8.6),_t.RE,{angle:7.5,w:3.4,lug:1.9})}}}{let z=performance.now(),U=3,P=40,K=new Map,q=[],G=e?[112,984]:[128,572],b=(L,A,D)=>(L*64+A+P)*64+D+P,M=(L,A)=>{let D=L.attributes.position;for(let S=0;S<D.count;S+=1){let C=D.getX(S)+A.x,F=D.getY(S)+A.y,se=D.getZ(S)+A.z;if(C<G[0]||C>G[1]||Math.hypot(F,se)>Mt(C)+7)continue;let j=b(Math.floor(C/U),Math.floor(F/U),Math.floor(se/U)),ae=K.get(j);ae||K.set(j,ae=[]),ae.push(q.length),q.push(C,F,se)}},O=Ge(0,0,0);for(let L of["upper","lower"])for(let A of[...l[L].silver,...l[L].satin])M(A,O);for(let L of Object.values(m))for(let A of L.meshes)M(A.geometry,L.pivot);for(let L of["upper","lower"])for(let A of l[L].wood){let D=A.attributes.position,S=new Float32Array(D.count*3);for(let C=0;C<D.count;C++){let F=D.getX(C),se=D.getY(C),j=D.getZ(C),ae=Math.floor(F/U),ie=Math.floor(se/U),he=Math.floor(j/U),Se=36;for(let Le=-2;Le<=2;Le++)for(let ke=-2;ke<=2;ke++)for(let We=-2;We<=2;We++){let ze=K.get(b(ae+Le,ie+ke,he+We));if(ze)for(let nt of ze){let Be=q[nt]-F,gt=q[nt+1]-se,qe=q[nt+2]-j,Qe=Be*Be+gt*gt+qe*qe;Qe<Se&&(Se=Qe)}}let xe=Math.sqrt(Se),ge=1-.45*Math.pow(1-Nt(.2,4.5,xe),1.2)-.15*(1-Nt(1,8,xe));S[C*3]=S[C*3+1]=S[C*3+2]=ge}A.setAttribute("color",new $t(S,3))}t.userData.aoMs=Math.round(performance.now()-z)}let ye=[];for(let[z,U]of Object.entries(l))for(let[P,K]of Object.entries(U)){if(!K.length)continue;let q=new Jt(tc(K),r[P]);q.name=z+":"+P,a[z].add(q),ye.push(q)}for(let z of Object.values(m)){let U=new Map;for(let K of z.meshes)U.has(K.material)||U.set(K.material,[]),U.get(K.material).push(K);let P=[];for(let[K,q]of U){let G=tc(q.map(M=>M.geometry)),b=new Jt(G,K);b.name=q[0].name;for(let M of q)z.group.remove(M);z.group.add(b),P.push(b)}z.meshes=P,ye.push(...P)}t.updateMatrixWorld(!0);let ve=(z,U=0,P=0)=>Ge(z,U,P).applyMatrix4(t.matrix),Pe=e?$n.capsules(ve):[{id:"mp",a:ve(30),b:ve(70),r:12.5},{id:"body",a:ve(72),b:ve(640),r:14.2},{id:"bell",a:ve(645),b:ve(668),r:25}],Ae=e?$n.refl(a,Ge):[{obj:a.mp,a:Ge(34,0,0),u:Ut.clone(),r:12.8,L:37},{obj:a.barrel,a:Ge(71,0,0),u:Ut.clone(),r:14.8,L:65},{obj:a.upper,a:Ge(136,0,0),u:Ut.clone(),r:14.45,L:190},{obj:a.lower,a:Ge(326,0,0),u:Ut.clone(),r:14.9,L:240},{obj:a.bell,a:Ge(566,0,0),u:Ut.clone(),r:17,L:74}],tt=Ae.length;for(let{p:z,c:U}of f)Ae.push({obj:z.group,a:U.seat.clone().sub(z.pivot),u:U.n,r:U.r,L:Fi(U.r)});return{root:t,M:r,parts:m,meshes:ye,capsules:Pe,joints:a,jointOf:o,refl:Ae,nBody:tt,fingers:_}}function Tf(i){let e=l=>i.has(l),t=new Set,n=new Set,r=e("LE")||e("RE"),s=e("LF")||e("RF"),o=e("LFs")||e("RFs"),a=(e("R1")||e("R2"))&&!e("BF");return(e("T")||e("L1"))&&t.add("P"),a&&t.add("C"),(e("L2")||a)&&t.add("Ev"),(r||s||o)&&t.add("Fs"),(r||s)&&t.add("F"),r&&t.add("E"),e("A")&&n.add("Gs"),{closed:t,moved:n}}var Af=[["T","LT","Thumb ring"],["R","LT","Register",!0],["A","L1","A",!0],["Gs","L1","G\u266F",!0],["L1","L1","E"],["L2","L2","D"],["Eb","L2","E\u266D / B\u266D",!0],["L3","L3","C"],["LCs","L4","C\u266F / G\u266F",!0],["LF","L4","F / C",!0],["LFs","L4","F\u266F / C\u266F",!0],["LE","L4","E / B",!0],["S1","R1","Side 1",!0],["S2","R1","Side 2",!0],["S3","R1","Side 3",!0],["S4","R1","Side 4",!0],["R1","R1","B\u266D"],["R2","R2","A"],["BF","R2","B / F\u266F",!0],["R3","R3","G"],["RFs","R4","F\u266F / C\u266F",!0],["RE","R4","E / B",!0],["RGs","R4","G\u266F / D\u266F",!0],["RF","R4","F / C",!0]],Rf={T:["Thumb ring","LT"],R:["Register key","LT"],A:["A key","L1"],Gs:["G\u266F key","L1"],L1:["First finger ring (E)","L1"],L2:["Second finger ring (D)","L2"],Eb:["E\u266D / B\u266D key","L2"],LCs:["C\u266F / G\u266F key","L4"],LF:["F / C lever","L4"],LFs:["F\u266F / C\u266F lever","L4"],LE:["E / B lever","L4"],S1:["Side key 1","R1"],S2:["Side key 2","R1"],S3:["Side key 3","R1"],S4:["Side key 4","R1"],R1:["First finger ring (B\u266D)","R1"],R2:["Second finger ring (A)","R2"],BF:["B / F\u266F key","R2"],R3:["Third finger ring (G)","R3"],RFs:["F\u266F / C\u266F key","R4"],RE:["E / B key","R4"],RGs:["G\u266F / D\u266F key","R4"],RF:["F / C key","R4"],P:["G cup (closed by the thumb ring or the first finger)",""],Ev:["E cup (closed by the second finger, or by the right hand through the bridge)",""],C:["B\u266D cup (closed by the right hand's first or second finger)",""],Fs:["F\u266F / C\u266F cup",""],F:["F / C cup",""],E:["E / B cup",""]};function Cf(i,e,t,n){return i==="mp"?e==="reed"?"Reed":e==="silver"?"Ligature":e==="cork"?"Tenon cork":"Mouthpiece":i==="barrel"?e==="silver"?"Barrel ring":"Barrel":i==="bell"?e==="silver"?"Bell ring":"Bell":e==="cork"?"Tenon cork":e==="silver"?i==="lower"&&t<335?"Lower joint ring":i==="lower"&&n<-8&&t<362?"Thumb rest":"Rod and posts":i==="upper"?"Upper joint":"Lower joint"}var Pf=`
.vc3d-root{position:relative;overflow:hidden;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.vc3d-canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;outline:none;cursor:grab;touch-action:none}
.vc3d-canvas.vc3d-drag{cursor:grabbing}
.vc3d-canvas:focus-visible{outline:2px solid #3b6ea8;outline-offset:-2px;border-radius:12px}
.vc3d-over{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:hidden}
.vc3d-over svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}
.vc3d-over line{stroke:#1f2937;stroke-width:1;stroke-opacity:.7;transition:opacity .16s}
.vc3d-over circle{fill:#1f2937;transition:opacity .16s}
.vc3d-tag{position:absolute;left:0;top:0;font:600 13px/1.15 system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1f2937;background:#fff;border:1px solid rgba(31,41,55,.28);border-radius:7px;padding:3px 7px 4px;white-space:nowrap;box-shadow:0 1px 3px rgba(31,41,55,.16);will-change:transform,opacity;transition:opacity .16s}
.vc3d-chip{position:absolute;left:0;top:0;min-width:22px;height:20px;padding:0 5px;box-sizing:border-box;border-radius:10px;font:700 12px/18px system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;text-align:center;color:#1f2937;background:rgba(255,255,255,.94);border:1.5px solid #4b5563;box-shadow:0 1px 3px rgba(31,41,55,.22);white-space:nowrap;will-change:transform,opacity;transition:opacity .14s}
.vc3d-chip.on{background:#1f2937;color:#fff;border-color:#1f2937}
.vc3d-chip.behind{border-style:dashed;box-shadow:none}
.vc3d-pick{z-index:2;font-weight:600;padding:0 9px;transition:none}
.vc3d-chip.on.behind{background:#4b5563;border-color:#1f2937}
`,Lf={front:{az:0,el:5},left:{az:90,el:5},back:{az:180,el:5},right:{az:-90,el:5},keys:{az:0,el:5,x:[128,472],zoom:!0},mouth:{az:-128,el:8,x:[-4,142],zoom:!0},lh:{az:-16,el:6,x:[132,334],zoom:!0},rh:{az:14,el:4,x:[322,486],zoom:!0},bell:{az:-22,el:-18,x:[436,676],zoom:!0}},If={rootY:$h,floorS:Br.end,VIEWS:Lf,linkage:Tf,CHIP_LIST:Af,PICK_LIST:Rf,staticName:Cf,APART:{mp:-84,barrel:-56,upper:-28,lower:0,bell:28},reach:[84,28],mix:[150,420],shadow:{half:95,cz:0},label:"3D clarinet"};function Df(i,e={}){let t=Object.assign({labels:"off",view:"front",shot:!1},e),n=t.model==="bass"?$n:If,r=n.VIEWS,s=n.linkage,o=n.CHIP_LIST,a=n.PICK_LIST,l=n.staticName,c=n.rootY;if(!document.getElementById("vc3d-style")){let R=document.createElement("style");R.id="vc3d-style",R.textContent=Pf,document.head.appendChild(R)}i.classList.add("vc3d-root"),getComputedStyle(i).position==="static"&&(i.style.position="relative");let h=new aa({antialias:!0,alpha:!0,premultipliedAlpha:!0,preserveDrawingBuffer:!!t.shot,powerPreference:"high-performance"});h.setClearColor(0,0),h.outputColorSpace=Pn,h.toneMapping=uf?mh:gh,h.toneMappingExposure=.9;let u=h.domElement;u.className="vc3d-canvas",u.setAttribute("aria-label",n.label+": drag to turn it, pinch or scroll to zoom; with the keyboard, arrows turn it, Page Up and Page Down zoom, Home puts it back"),i.appendChild(u);let d=document.createElement("div");d.className="vc3d-over",i.appendChild(d);let p=document.createElementNS("http://www.w3.org/2000/svg","svg");d.appendChild(p);let m=new Lr,_=new Pr(h),f=_.fromScene(mf(),.01,.1,200);m.environment=f.texture,_.dispose();let g=Ef(t.model);m.add(g.root);let v=Object.values(g.parts);for(let R of v)R.out=R.out.clone().applyQuaternion(g.root.quaternion);let y=g.parts,w=[g.M.silver,g.M.satin,g.M.lig,g.M.rest,g.M.tube,g.M.neck,g.M.wood,g.M.ebonite,...v.map(R=>R.mat)],T=`vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;`,E=pt.envmap_physical_pars_fragment||"",V=E.includes(T),W="plain",H=g.refl.length,$={fsA:{value:g.refl.map(()=>new Ht)},fsB:{value:g.refl.map(()=>new Ht)}},ee=Ge(),te=Ge();function oe(){let R=M.matrixWorldInverse;g.refl.forEach((Z,fe)=>{ee.copy(Z.a).applyMatrix4(Z.obj.matrixWorld).applyMatrix4(R),te.copy(Z.u).transformDirection(Z.obj.matrixWorld).transformDirection(R),$.fsA.value[fe].set(ee.x,ee.y,ee.z,Z.r),$.fsB.value[fe].set(te.x,te.y,te.z,Z.L)})}function ne(R){if(R=V&&(R==="high"||R==="low")?R:"plain",R!==W){W=R;for(let Z of w){delete Z.defines.FS_TRACE,delete Z.defines.FS_N,delete Z.defines.FS_NB;let fe=Z===g.M.wood||Z===g.M.ebonite,le=Z===g.M.neck,Fe=Z===g.M.tube||le;fe?Z.defines.FS_WOOD=1:Z.defines.FS_METAL=1,Fe&&(Z.defines.FS_TUBE=1),le&&(Z.defines.FS_NECK=1),n===$n&&!fe&&!Fe&&(Z.defines.FS_BASS=1);let _e=/^key:/.test(Z.name);_e&&(Z.defines.FS_KEYS=1),R==="plain"?(Z.onBeforeCompile=()=>{},Z.customProgramCacheKey=()=>"vc-plain"):(R==="high"&&(Z.defines.FS_TRACE=1,Z.defines.FS_N=H,Z.defines.FS_NB=g.nBody),Z.customProgramCacheKey=()=>"vc-"+R+(_e?"-k":"")+(fe?"-w":"")+(Fe?"-t":"")+(le?"-n":"")+(n===$n?"-b":""),Z.onBeforeCompile=Re=>{Object.assign(Re.uniforms,$),Re.fragmentShader=Re.fragmentShader.replace("#include <envmap_physical_pars_fragment>",eu+ff+`
#if defined( FS_WOOD ) && defined( USE_COLOR )
#define FS_OCC ( vColor.r * vColor.r )
#else
#define FS_OCC 1.0
#endif
`+E.replace(T,`vec3 fsV = normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz );
			#ifdef FS_TRACE
			return fsRadiance( - vViewPosition + normal * 0.05, fsV, roughness ) * envMapIntensity * FS_OCC;
			#else
			#ifdef FS_WOOD
			return fsStudio( fsV, roughness ) * fsWood( fsV, roughness ) * envMapIntensity * FS_OCC;
			#else
			return fsStudio( fsV, roughness ) * envMapIntensity;
			#endif
			#endif`))}),Z.needsUpdate=!0}}}let ye=!1;h.debug.onShaderError=(R,Z,fe,le)=>{ye||(ye=!0,console.warn("Virtual Clarinet: the studio shader did not compile here; using plain reflections. "+(R.getProgramInfoLog(Z)||"")+" "+(R.getShaderInfoLog(le)||"").slice(0,600)))},ne(t.reflections==="plain"?"plain":t.reflections==="low"?"low":"high");let ve=[],Pe=new Ln;g.root.updateMatrixWorld(!0);for(let R of g.meshes){let Z=R.parent;for(;Z&&!/^joint:/.test(Z.name);)Z=Z.parent;let fe=R.geometry.attributes.position,le=Math.max(1,Math.floor(fe.count/1500));for(let _e=0;_e<fe.count;_e+=le){let Re=Ge().fromBufferAttribute(fe,_e).applyMatrix4(R.matrixWorld);Re.j=Z,Re.s=c-Re.y,ve.push(Re),Pe.expandByPoint(Re)}R.geometry.computeBoundingBox();let Fe=R.geometry.boundingBox;for(let _e of[Fe.min.x,Fe.max.x])for(let Re of[Fe.min.y,Fe.max.y])for(let Oe of[Fe.min.z,Fe.max.z]){let Je=Ge(_e,Re,Oe).applyMatrix4(R.matrixWorld);Je.j=Z,Je.s=c-Je.y,ve.push(Je)}}let Ae=Pe.getCenter(Ge()),tt=n.APART,z={},U={};for(let[R,Z]of Object.entries(tt))z[R]=typeof Z=="number"?Ge(Z,0,0):Ge(...Z),U[R]=Ge(z[R].y,-z[R].x,z[R].z);let P=0,K=0,q=R=>{let Z=g.joints[g.jointOf(R.x)];return Z.updateMatrix(),R.applyMatrix4(Z.matrix).applyMatrix4(g.root.matrix)};Pe.max.y+=n.reach[0],Pe.min.y-=n.reach[1];let G=c-n.floorS-2.5,b=(()=>{let fe=n.shadow.half,le=n.shadow.half,Fe=0,_e=n.shadow.cz,Re=new Bn(256,256,{depthBuffer:!1}),Oe=new Bn(256,256,{depthBuffer:!1}),Je=new ss(-fe,fe,le,-le,1,1200);Je.position.set(Fe,G+900,_e),Je.up.set(0,0,-1),Je.lookAt(Fe,0,_e);let He=new Rn({uniforms:{y0:{value:G}},depthTest:!1,depthWrite:!1,blending:dh,blendEquation:ph,blendSrc:Ma,blendDst:Ma,vertexShader:"varying float h; uniform float y0; void main(){ vec4 w = modelMatrix * vec4(position,1.0); h = w.y - y0; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:"varying float h; void main(){ float k = 1.0 - 0.8 * smoothstep(0.0, 150.0, h); gl_FragColor = vec4(k, k, k, 1.0); }"}),Ie=new Jt(new Ui(2,2),new Rn({uniforms:{tex:{value:null},dir:{value:new Ce}},depthTest:!1,depthWrite:!1,vertexShader:"varying vec2 u; void main(){ u = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`varying vec2 u; uniform sampler2D tex; uniform vec2 dir;
        void main(){ float s = 0.0, w = 0.0; for (int i = -8; i <= 8; i++){ float f = float(i); float g = exp(-f*f/18.0); s += texture2D(tex, u + dir * f).r * g; w += g; } gl_FragColor = vec4(vec3(s / w), 1.0); }`})),it=new Lr;it.add(Ie);let Rt=new $i,st=new Jt(new Ui(fe*2,le*2),new Rn({uniforms:{tex:{value:Re.texture},k:{value:.3}},transparent:!0,depthWrite:!1,vertexShader:"varying vec2 u; void main(){ u = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"varying vec2 u; uniform sampler2D tex; uniform float k; void main(){ float a = texture2D(tex, u).r; a = a*a*(3.0-2.0*a); vec2 e = smoothstep(0.0, 0.1, u) * smoothstep(0.0, 0.1, 1.0 - u); gl_FragColor = vec4(0.05, 0.05, 0.06, a * k * e.x * e.y); }"}));return st.rotation.x=-Math.PI/2,st.position.set(Fe,G,_e),st.renderOrder=-1,st.name="shadow",m.add(st),{plane:st,bake:()=>{let Cn=h.toneMapping;h.toneMapping=fh,st.visible=!1,m.overrideMaterial=He,h.setRenderTarget(Re),h.setClearColor(0,1),h.clear(),h.render(m,Je),m.overrideMaterial=null,st.visible=!0;let wn=Ie.material.uniforms;for(let ni of[4,2,1])wn.tex.value=Re.texture,wn.dir.value.set(ni/256,0),h.setRenderTarget(Oe),h.render(it,Rt),wn.tex.value=Oe.texture,wn.dir.value.set(0,ni/256),h.setRenderTarget(Re),h.render(it,Rt);h.setRenderTarget(null),h.setClearColor(0,0),h.toneMapping=Cn},dispose(){Re.dispose(),Oe.dispose(),He.dispose(),Ie.geometry.dispose(),Ie.material.dispose(),st.geometry.dispose(),st.material.dispose()}}})();b.bake();let M=new An(20,2,20,8e3),O=new Ra(M,u);O.enableDamping=!0,O.dampingFactor=.09,O.minPolarAngle=.03,O.maxPolarAngle=Math.PI-.03,O.zoomSpeed=.9,O.screenSpacePanning=!0,O.mouseButtons={LEFT:Jn.ROTATE,MIDDLE:Jn.DOLLY,RIGHT:Jn.PAN},O.touches={ONE:li.ROTATE,TWO:li.DOLLY_PAN},O.target.copy(Ae),O.zoomToCursor=!0;let L=2,A=2,D=1,S=!1,C=0,F=null,se="off",j=!1,ae=0,ie=0,he=0,Se=[],xe=()=>t.insets||{l:10,r:10,t:26,b:66},ge=Ge(),Le=Ge(),ke=Ge(),We=Ge();function ze(R,Z,fe){let le=R*Math.PI/180,Fe=Z*Math.PI/180;ke.set(-Math.sin(le)*Math.cos(Fe),-Math.sin(Fe),-Math.cos(le)*Math.cos(Fe)),ge.crossVectors(ke,Si).normalize(),Le.crossVectors(ge,ke).normalize();let _e=xe(),Re=Math.max(40,L-_e.l-_e.r),Oe=Math.max(40,A-_e.t-_e.b),Je=Math.tan(M.fov*Math.PI/360)*(Oe/A),He=Math.tan(M.fov*Math.PI/360)*(Re/A),Ie=(fe?ve.filter(Kt=>Kt.s>=fe[0]&&Kt.s<=fe[1]):ve).map(Kt=>{let Cn=Kt.clone();return Cn.addScaledVector(U[Kt.j.name.slice(6)],K),Cn}),it=new Ln;for(let Kt of Ie)it.expandByPoint(Kt);let Rt=it.getCenter(Ge()),st=1e3;for(let Kt=0;Kt<6;Kt++){let Cn=0,wn=1/0,ni=-1/0,zi=1/0,kr=-1/0;for(let Ia of Ie){We.subVectors(Ia,Rt);let Da=We.dot(ge),Ua=We.dot(Le),Na=We.dot(ke);Cn=Math.max(Cn,Math.abs(Da)/He-Na,Math.abs(Ua)/Je-Na);let gs=1/(st+Na);wn=Math.min(wn,Da*gs),ni=Math.max(ni,Da*gs),zi=Math.min(zi,Ua*gs),kr=Math.max(kr,Ua*gs)}Rt.addScaledVector(ge,(wn+ni)/2*st).addScaledVector(Le,(zi+kr)/2*st),st=Cn}return{dist:st*1.04,target:Rt}}function nt(){let R=xe();M.setViewOffset(L,A,-(R.l-R.r)/2,-(R.t-R.b)/2,L,A)}let Be={az:0,el:0,dist:1e3,target:Ae.clone()};function gt(){let R=Be.az*Math.PI/180,Z=Be.el*Math.PI/180;M.position.set(Be.target.x+Be.dist*Math.sin(R)*Math.cos(Z),Be.target.y+Be.dist*Math.sin(Z),Be.target.z+Be.dist*Math.cos(R)*Math.cos(Z)),O.target.copy(Be.target),M.lookAt(Be.target)}function qe(){let R=M.position.clone().sub(O.target);Be.dist=R.length(),Be.el=Math.asin(bt(R.y/Be.dist,-1,1))*180/Math.PI,Be.az=Math.atan2(R.x,R.z)*180/Math.PI,Be.target.copy(O.target)}let Qe=null,ut=new Ln;function Tt(){return ut.copy(Pe),ut.max.y+=n.reach[0]*P,ut.min.y-=n.reach[1]*P,ut}let At=0,Vt=0;function _n(){F=null;for(let R of Se)try{R()}catch(Z){console.error(Z)}}function Yt(){O.enableDamping=!1,O.update(),O.enableDamping=!0}function re(R,Z,fe,le,Fe=650){Yt(),qe();let _e=(R-Be.az+540)%360-180;if(!Fe){Be.az=R,Be.el=Z,Be.dist=fe,Be.target.copy(le),gt(),O.update(),Qe=null,pe();return}Qe={t0:performance.now(),ms:Fe,az0:Be.az,daz:_e,el0:Be.el,el1:Z,d0:Be.dist,d1:fe,tg0:Be.target.clone(),tg1:le.clone()},pe()}function pn(){let R=ze(r.front.az,r.front.el);O.minDistance=R.dist*.06,O.maxDistance=R.dist*2.2}let ei=new mt(15263455),zt=(R,Z)=>{R.rot=Z,R.axis?R.group.quaternion.setFromAxisAngle(R.axis,Z):R.group.rotation.x=Z},on=0;function dn(R){let Z=Math.min(.05,on?(R-on)/1e3:.016);on=R;let fe=!1;for(let le of v){if(Math.abs(le.to-le.x)>1e-4||Math.abs(le.v)>.001){let Je=Z;for(;Je>0;){let He=Math.min(Je,.004);le.v+=(3364*(le.to-le.x)-2*.78*58*le.v)*He,le.x+=le.v*He,Je-=He}Math.abs(le.to-le.x)<5e-4&&Math.abs(le.v)<.02&&(le.x=le.to,le.v=0),zt(le,le.sign*le.angle*bt(le.x,-.06,1.06)),fe=!0}Math.abs(le.paintTo-le.paint)>.001&&(le.paint+=(le.paintTo-le.paint)*Math.min(1,Z*20),Math.abs(le.paintTo-le.paint)<.004&&(le.paint=le.paintTo),fe=!0);let Fe=le.paint,_e=le.mat;_e.color.copy(ei).lerp(le.colTo,Fe),_e.metalness=1-.62*Fe,_e.roughness=.07+.2*Fe,_e.clearcoat=Math.max(.001,Fe),_e.clearcoatRoughness=.06,_e.emissive.copy(le.colTo).multiplyScalar(.3*Fe),le===Ve&&_e.emissive.addScalar(.1)}for(let le of g.fingers)Math.abs(le.to-le.a)>.001&&(le.a+=(le.to-le.a)*Math.min(1,Z*18),Math.abs(le.to-le.a)<.01&&(le.a=le.to),fe=!0),le.mat.opacity=.93*le.a,le.mesh.visible=le.a>.01;if(P!==K){let le=K-P,Fe=Z*2.2;P=Math.abs(le)<=Fe?K:P+Math.sign(le)*Fe;let _e=P*P*(3-2*P);for(let[Re,Oe]of Object.entries(g.joints))Oe.position.copy(z[Re]).multiplyScalar(_e),Oe.updateMatrix();b.plane.position.y=G+U.bell.y*_e,P===K&&b.bake(),fe=!0}if(Qe){let le=bt((R-Qe.t0)/Qe.ms,0,1),Fe=le<.5?4*le*le*le:1-Math.pow(-2*le+2,3)/2;Be.az=Qe.az0+Qe.daz*Fe,Be.el=Qe.el0+(Qe.el1-Qe.el0)*Fe,Be.dist=Qe.d0+(Qe.d1-Qe.d0)*Fe,Be.target.lerpVectors(Qe.tg0,Qe.tg1,Fe),gt(),le>=1&&(Qe=null,Yt(),gt()),fe=!0}return fe}for(let R of v)R.to=R.x=R.restUp?1:0,zt(R,R.sign*R.angle*R.x);let ln=[],yn=[];function ti(){for(let R of ln)R.el.remove(),R.line.remove(),R.dot.remove();ln.length=0;for(let R of yn)R.el.remove();yn.length=0}let cn=o,xn=new Set,hn=a,Mn=new _a,Vn=new Ce,et=null;function bn(R,Z){let fe=u.getBoundingClientRect();if(!fe.width)return;Vn.set((R-fe.left)/fe.width*2-1,-(Z-fe.top)/fe.height*2+1),Mn.setFromCamera(Vn,M);let le=Mn.intersectObjects(g.meshes,!1)[0];if(et&&(et.el.remove(),et=null),!le){pe();return}let[Fe,_e]=le.object.name.split(":"),Re;if(hn[Fe]){let[Ie,it]=hn[Fe];Re=it?`${Ie} \xB7 ${it}`:Ie}else{let Ie=g.root.worldToLocal(le.point.clone());Re=l(Fe,_e,Ie.x,Ie.z)}let Oe=document.createElement("div");Oe.className="vc3d-chip on vc3d-pick",Oe.textContent=Re,d.appendChild(Oe);let Je=le.point.clone(),He=le.object.parent;for(;He&&!/^joint:/.test(He.name);)He=He.parent;He&&(He.updateMatrixWorld(),He.worldToLocal(Je)),et={el:Oe,local:Je,joint:He,until:performance.now()+2600,w:Oe.offsetWidth,h:Oe.offsetHeight},pe()}function Sn(R){if(!et)return!1;if(R>et.until)return et.el.remove(),et=null,!1;let Z=I(et.joint?ue.copy(et.local).applyMatrix4(et.joint.matrixWorld):ue.copy(et.local));return et.el.style.transform=`translate(${(Z.x-et.w/2).toFixed(1)}px,${(Z.y-et.h-16).toFixed(1)}px)`,et.el.style.opacity=Math.min(1,(et.until-R)/400).toFixed(2),!0}function Bi(){if(ti(),se==="parts"){for(let[R,Z,fe]of PARTS){let le=document.createElement("div");le.className="vc3d-tag",le.textContent=R,d.appendChild(le);let Fe=document.createElementNS("http://www.w3.org/2000/svg","line"),_e=document.createElementNS("http://www.w3.org/2000/svg","circle");_e.setAttribute("r",2.4),p.appendChild(Fe),p.appendChild(_e),ln.push({el:le,line:Fe,dot:_e,pos:Ge(...Z),out:fe?Ge(...fe).normalize():null,w:0,h:0,side:0,x:0,y:0,a:1})}for(let R of ln)R.w=R.el.offsetWidth,R.h=R.el.offsetHeight}else if(se==="fingers"||se==="names"){for(let[R,Z,fe,le]of cn){let Fe=se==="fingers"?Z:fe;if(!Fe)continue;let _e=R==="trD"||R==="trDs"?R+":t":R,Re=y[_e]||y[R];if(!Re||!Re.anchor)continue;let Oe=document.createElement("div");Oe.className="vc3d-chip",Oe.textContent=Fe,d.appendChild(Oe),yn.push({el:Oe,p:Re,pid:_e,only:se==="fingers"&&!!le,prio:Z?0:1,w:0,h:0})}for(let R of yn)R.w=R.el.offsetWidth,R.h=R.el.offsetHeight}}let Wt=Ge(),Y=Ge(),ue=Ge(),x=Ge();function I(R){Wt.copy(R);let Z=Wt.clone().sub(M.position).dot(M.getWorldDirection(Y))<0;return Wt.project(M),{x:(Wt.x*.5+.5)*L,y:(-Wt.y*.5+.5)*A,behind:Z}}let N=Ge();function X(R,Z){N.subVectors(R,M.position);let fe=N.length();if(fe<10)return!1;N.multiplyScalar((fe-3)/fe).add(M.position);for(let le of g.capsules){if(le.id===Z)continue;let Fe=le.r*.92;if(pf(M.position,N,le.a,le.b)<Fe*Fe)return!0}return!1}function k(R,Z){return R.group.updateMatrixWorld(),Z.copy(R.anchor).sub(R.pivot).applyAxisAngle(R.axis||Ut,R.rot).add(R.pivot),R.joint.updateMatrix(),Z.applyMatrix4(R.joint.matrix).applyMatrix4(g.root.matrix)}let J=!1;function me(){if(yn.length){let _e=[];for(let Oe of yn){let Je=Oe.p,He=xn.has(Oe.pid)||xn.has(Je.id),Ie=1;Oe.only&&!He&&(Ie=0),se==="fingers"&&Oe.pid==="Th"&&xn.has("Tb")&&(Ie=0),k(Je,ue);let it=I(ue),Rt=I(ue.clone().addScaledVector(Je.out,6));Wt.copy(M.position).sub(ue).normalize();let st=bt(Wt.dot(Je.out),0,1);Ie*=Nt(-.15,.2,Wt.dot(Je.out)),Ie>0&&X(ue,null)&&(Ie=0);let Kt=!1;Ie<.5&&se==="fingers"&&Oe.prio===0&&!Oe.only&&(Ie=.62,Kt=!0),se==="fingers"&&Oe.pid==="Th"&&xn.has("Tb")&&(Ie=0,Kt=!1),it.behind&&(Ie=0),x.setFromMatrixColumn(M.matrixWorld,0);let Cn=I(ue.clone().addScaledVector(x,Je.size||4)),wn=Math.hypot(Cn.x-it.x,Cn.y-it.y),ni,zi;if(st>.5&&wn>1.15*Oe.w)ni=it.x-Oe.w/2,zi=it.y-Oe.h/2;else{let kr=I(Wt.set(g.root.position.x,ue.y,g.root.position.z)),Ia=it.x>=kr.x-3?1:-1;ni=it.x+Ia*(wn*(.35+.65*st)+7+Oe.w/2)-Oe.w/2,zi=it.y-Oe.h/2}Object.assign(Oe,{lx:ni,ly:zi,la:Ie,down:He,behindNow:Kt})}let Re=yn.slice().sort((Oe,Je)=>Oe.behindNow-Je.behindNow||Oe.prio-Je.prio);for(let Oe of Re){let Je=Oe.la,He=Oe.lx,Ie=Oe.ly;if(Je>.05){for(let it of _e)if(He<it.x+it.w+2&&He+Oe.w+2>it.x&&Ie<it.y+it.h+1&&Ie+Oe.h+1>it.y){Je=0;break}}Je>.05&&_e.push({x:He,y:Ie,w:Oe.w,h:Oe.h}),Oe.el.style.transform=`translate(${He.toFixed(1)}px,${Ie.toFixed(1)}px)`,Oe.el.style.opacity=Je.toFixed(2),Oe.el.classList.toggle("on",Oe.down&&se==="fingers"),Oe.el.classList.toggle("behind",Oe.behindNow)}return}if(se!=="parts"||!ln.length)return;let R=0;for(let _e of ln){let Re=I(q(ue.copy(_e.pos)));_e.ax=Re.x,_e.ay=Re.y;let Oe=Re.behind?0:1;_e.out&&(Wt.copy(M.position).sub(_e.pos).normalize(),Oe*=Nt(-.25,.12,Wt.dot(_e.out))),(Re.x<-20||Re.x>L+20||Re.y<-20||Re.y>A+20)&&(Oe=0),Oe>0&&X(q(ue.copy(_e.pos)),"plate")&&(Oe=0),_e.a=Oe}R=I(Ae).y;let fe=ln.filter(_e=>_e.a>.01),le=1/0,Fe=-1/0;for(let _e of fe)le=Math.min(le,_e.ax),Fe=Math.max(Fe,_e.ax);if(fe.length){let _e=Fe-le;_e<.4*L?J=!0:_e>.5*L&&(J=!1)}if(J){let _e=(le+Fe)/2;for(let Re of fe){let Oe=Re.ax-_e;Re.col?Oe*Re.col<-24&&(Re.col=-Re.col):Re.col=Oe<0?-1:1}for(let Re of[-1,1]){let Oe=fe.filter(Ie=>Ie.col===Re).sort((Ie,it)=>Ie.ay-it.ay);if(!Oe.length)continue;let Je=Re<0?Math.max(6,le-70):Math.min(L-6,Fe+70);for(let Ie of Oe)Ie.x=Re<0?Math.max(6,Je-Ie.w):Math.min(L-Ie.w-6,Je),Ie.y=Ie.ay-Ie.h/2;let He=8;for(let Ie of Oe)Ie.y=Math.max(Ie.y,He),He=Ie.y+Ie.h+5;He=A-40;for(let Ie=Oe.length-1;Ie>=0;Ie--){let it=Oe[Ie];it.y=Math.min(it.y,He-it.h),He=it.y-5}for(let Ie of Oe)Ie.lx=Re<0?Ie.x+Ie.w:Ie.x,Ie.ly=Ie.y+Ie.h/2}}else{for(let _e of ln){let Re=_e.ay-R;_e.side?Re*_e.side<-16&&(_e.side=-_e.side):_e.side=Re<0?-1:1}for(let _e of[-1,1]){let Re=fe.filter(Ie=>Ie.side===_e).sort((Ie,it)=>Ie.ax-it.ax);if(!Re.length)continue;let Oe=Re.reduce((Ie,it)=>Ie+it.w+8,0),Je=Oe>L-20||Re.length>6?2:1,He=_e<0?8:A-40;for(let Ie=0;Ie<Je;Ie++){let it=Re.filter((Rt,st)=>st%Je===Ie);for(let Rt of it)Rt.x=bt(Rt.ax-Rt.w/2,6,L-Rt.w-6),Rt.y=_e<0?He+Ie*(Rt.h+6):He-Rt.h-Ie*(Rt.h+6);for(let Rt=0;Rt<8;Rt++){for(let st=1;st<it.length;st++){let Kt=it[st-1],Cn=it[st],wn=Kt.x+Kt.w+8-Cn.x;wn>0&&(Kt.x-=wn/2,Cn.x+=wn/2)}for(let st of it)st.x=bt(st.x,6,L-st.w-6)}}}for(let _e of fe)_e.lx=bt(_e.ax,_e.x+8,_e.x+_e.w-8),_e.ly=_e.side<0?_e.y+_e.h:_e.y}for(let _e of ln)_e.el.style.transform=`translate(${(_e.x||0).toFixed(1)}px,${(_e.y||0).toFixed(1)}px)`,_e.el.style.opacity=_e.a.toFixed(2),_e.line.setAttribute("x1",(_e.lx||0).toFixed(1)),_e.line.setAttribute("y1",(_e.ly||0).toFixed(1)),_e.line.setAttribute("x2",_e.ax.toFixed(1)),_e.line.setAttribute("y2",_e.ay.toFixed(1)),_e.dot.setAttribute("cx",_e.ax.toFixed(1)),_e.dot.setAttribute("cy",_e.ay.toFixed(1)),_e.line.style.opacity=_e.dot.style.opacity=_e.a.toFixed(2)}function pe(){!C&&!S&&(C=requestAnimationFrame(we))}function we(R){if(C=0,S)return;let Z=dn(R);if(At&&!Qe){let _e=Vt?Math.min(.05,(R-Vt)/1e3):.016;Vt=R;let Re=2*M.position.distanceTo(O.target)*Math.tan(M.fov*Math.PI/360),Oe=At*.4*Re*_e;O.target.y+=Oe,M.position.y+=Oe,Z=!0}else Vt=0;!Qe&&O.update()&&(Z=!0),O.autoRotate&&(Z=!0);let fe=O.target,le=Tt();if(!le.containsPoint(fe)){let _e=le.clampPoint(fe,Ge()),Re=_e.sub(fe);fe.add(Re),M.position.add(Re)}let Fe=Math.asin(bt((M.position.y-G)/M.position.distanceTo(Ge(fe.x,G,fe.z)),-1,1));if(b.plane.material.uniforms.k.value=.3*Nt(.02,.22,Fe),b.plane.visible=Fe>.02,m.environmentRotation.y=-Math.atan2(M.position.x-fe.x,M.position.z-fe.z),W==="high"&&(m.updateMatrixWorld(),M.updateMatrixWorld(),oe()),h.render(m,M),ye&&W!=="plain"&&(ne("plain"),Z=!0),Z&&!t.shot&&(!j||W==="high")){let _e=R-ie;_e<400&&(he=he?he*.85+_e*.15:_e,ae=he>42?ae+1:Math.max(0,ae-1),ae>20&&(j?W==="high"&&ne("low"):(j=!0,Lt()),ae=0,he=0))}ie=R,me(),Sn(R)&&(Z=!0),Z?pe():on=0}O.addEventListener("change",pe),O.addEventListener("start",()=>{Qe=null,F=null,u.classList.add("vc3d-drag");for(let R of Se)try{R()}catch(Z){console.error(Z)}}),O.addEventListener("end",()=>u.classList.remove("vc3d-drag"));let Te=0,be=0,De=0,ce=0,Me=0,Q=0,Ee=0,Ue=R=>{R.preventDefault(),clearTimeout(Ee),et&&(et.el.remove(),et=null),Ke.resetView()},de=R=>{ce=R.clientX,Me=R.clientY,Q=performance.now()},Ve=null,je=0,Ne=0,Xe=0,$e=new Map;for(let R of v)for(let Z of R.meshes)$e.set(Z,R);let Ze=[...$e.keys()],ot=R=>{if(R.pointerType!=="mouse"||R.buttons){Ve&&(Ve=null,u.style.cursor="",pe());return}Ne=R.clientX,Xe=R.clientY,!je&&(je=requestAnimationFrame(()=>{je=0;let Z=u.getBoundingClientRect();if(!Z.width)return;Vn.set((Ne-Z.left)/Z.width*2-1,-(Xe-Z.top)/Z.height*2+1),Mn.setFromCamera(Vn,M);let fe=Mn.intersectObjects(Ze,!1)[0],le=fe?$e.get(fe.object):null;le!==Ve&&(Ve=le,u.style.cursor=le?"pointer":"",pe())}))},lt=()=>{Ve&&(Ve=null,u.style.cursor="",pe())},ct=R=>{let Z=performance.now();if(Z-Q>260||Math.hypot(R.clientX-ce,R.clientY-Me)>12)return;clearTimeout(Ee);let fe=R.clientX,le=R.clientY;Ee=setTimeout(()=>bn(fe,le),260),R.pointerType==="touch"&&(Z-Te<330&&Math.hypot(R.clientX-be,R.clientY-De)<40?(Te=0,clearTimeout(Ee),Ke.resetView()):(Te=Z,be=R.clientX,De=R.clientY))},xt=R=>R.preventDefault();u.addEventListener("dblclick",Ue),u.addEventListener("pointerdown",de),u.addEventListener("pointerup",ct),u.addEventListener("contextmenu",xt),u.addEventListener("pointermove",ot),u.addEventListener("pointerleave",lt),u.tabIndex=0;let ft=R=>{if(R.shiftKey&&(R.key==="ArrowUp"||R.key==="ArrowDown")){R.preventDefault(),Ke.moveAlong(R.key==="ArrowUp"?1:-1);return}let Z={ArrowLeft:[-15,0],ArrowRight:[15,0],ArrowUp:[0,10],ArrowDown:[0,-10]}[R.key];if(Z){R.preventDefault(),qe(),F=null;for(let fe of Se)try{fe()}catch(le){console.error(le)}re(Be.az+Z[0],bt(Be.el+Z[1],-85,85),Be.dist,Be.target,260);return}if(R.key==="PageUp"||R.key==="PageDown"){R.preventDefault(),qe(),re(Be.az,Be.el,bt(Be.dist*(R.key==="PageUp"?.8:1.25),O.minDistance,O.maxDistance),Be.target,220);return}R.key==="Home"&&(R.preventDefault(),Ke.resetView())};u.addEventListener("keydown",ft);let Pt=R=>{R.preventDefault()},jt=()=>{b.bake(),pe()};u.addEventListener("webglcontextlost",Pt),u.addEventListener("webglcontextrestored",jt);function dt(R,Z){let fe=r[R]||r.front,le=ze(fe.az,fe.el,fe.x);re(fe.az,fe.el,le.dist,le.target,Z)}function Lt(){if(S)return;let R=Math.max(2,i.clientWidth),Z=Math.max(2,i.clientHeight),fe=i.getBoundingClientRect();D=fe.width>0&&R>0?fe.width/R:1;let le=Math.min((window.devicePixelRatio||1)*D,j?1:2.5);le=Math.max(le,j?.6:.75);let Fe=R*Z*le*le;Fe>4e6&&(le*=Math.sqrt(4e6/Fe));let _e=R!==L||Z!==A;if((_e||Math.abs(le-h.getPixelRatio())>.01)&&(h.setPixelRatio(le),h.setSize(R,Z,!1)),L=R,A=Z,M.aspect=R/Z,nt(),M.updateProjectionMatrix(),O.rotateSpeed=.9/D,O.panSpeed=1/D,pn(),_e&&F&&dt(F,0),ln.length)for(let Re of ln)Re.w=Re.el.offsetWidth,Re.h=Re.el.offsetHeight;if(yn.length)for(let Re of yn)Re.w=Re.el.offsetWidth,Re.h=Re.el.offsetHeight;pe()}let St=typeof ResizeObserver<"u"?new ResizeObserver(()=>Lt()):null;St&&St.observe(i);let Ke={setKeys(R,Z,fe){let le=R instanceof Set?R:new Set(R||[]),{closed:Fe,moved:_e}=s(le),Re=Z?new mt(Z):null,Oe=fe?new mt(fe):Re,Je=(He,Ie)=>He.copy(Re).lerp(Oe,bt((Ie-n.mix[0])/n.mix[1],0,1));xn=new Set([...le,...Fe]);for(let He of v){let Ie=le.has(He.id)||Fe.has(He.id);He.to=He.restUp?Ie?0:1:Ie||_e.has(He.id)?1:0,Ie&&Re?(Je(He.colTo,He.xMid),He.paintTo=1):He.paintTo=0}for(let He of g.fingers)He.to=(He.show?He.show(le):le.has(He.id))&&Re?1:0,He.to&&Je(He.mat.color,He.s);pe()},setLabels(R){if(R=R==="fingers"||R==="names"||R==="parts"?R:"off",R===se)return;let Z=se;se=R,Bi(),Z==="parts"!=(R==="parts")&&(nt(),M.updateProjectionMatrix(),F&&dt(F,350)),pe()},setView(R,Z){F=r[R]?R:"front",nt(),M.updateProjectionMatrix(),dt(F,Z??700)},resetView(){Ke.setView("front")},moveAlong(R,Z=.3,fe=300){Yt(),qe(),_n();let le=2*Be.dist*Math.tan(M.fov*Math.PI/360),Fe=Tt(),_e=Be.target.clone();return _e.y=bt(_e.y+Math.sign(R)*Z*le,Fe.min.y,Fe.max.y),Math.abs(_e.y-Be.target.y)<.5?!1:(re(Be.az,Be.el,Be.dist,_e,fe),!0)},glide(R){At=Math.sign(R||0),At&&(_n(),pe())},get along(){let R=Tt();return bt((O.target.y-R.min.y)/Math.max(1,R.max.y-R.min.y),0,1)},setCamera(R,Z,fe,le=0){F=null;let Fe=ze(R,Z);re(R,Z,Fe.dist*(fe||1),Fe.target,le)},lookAt(R,Z,fe,le,Fe,_e,Re=0){F=null,re(le,Fe,_e,Ge(R,Z,fe),Re)},setApart(R){K=R?1:0,F&&dt(F,800),pe()},get apart(){return K===1},setQuality(R){ne(R),ae=0,pe()},get quality(){return W},setAutoRotate(R){O.autoRotate=!!R,O.autoRotateSpeed=1.6,pe()},onViewChange(R){return typeof R=="function"&&Se.push(R),()=>{let Z=Se.indexOf(R);Z>=0&&Se.splice(Z,1)}},resize:Lt,render:pe,views:Object.keys(r),get view(){return F},get labels(){return se},model:n===$n?"bass":"bb",rootY:c,scene:m,camera:M,renderer:h,controls:O,clarinet:g.root,materials:g.M,parts:g.parts,info(){let R=0;for(let Z of g.meshes)R+=Z.geometry.index.count/3;return{triangles:R,meshes:g.meshes.length,calls:h.info.render.calls,pixelRatio:h.getPixelRatio(),size:[L,A],cssScale:D,reflections:W,parts:v.length,lowRes:j}},dispose(){if(!S){S=!0,C&&cancelAnimationFrame(C),clearTimeout(Ee),et&&et.el.remove(),St&&St.disconnect(),u.removeEventListener("dblclick",Ue),u.removeEventListener("pointerdown",de),u.removeEventListener("pointerup",ct),u.removeEventListener("contextmenu",xt),u.removeEventListener("pointermove",ot),u.removeEventListener("pointerleave",lt),je&&cancelAnimationFrame(je),u.removeEventListener("keydown",ft),u.removeEventListener("webglcontextlost",Pt),u.removeEventListener("webglcontextrestored",jt),O.dispose(),ti(),b.dispose();for(let R of g.meshes)R.geometry.dispose();for(let R of Object.values(g.M))R.dispose();for(let R of v)R.mat.dispose();f.dispose(),h.dispose();try{h.forceContextLoss()}catch{}u.remove(),d.remove(),i.classList.remove("vc3d-root"),Se.length=0}}};return Lt(),se="off",Ke.setLabels(t.labels),F=r[t.view]?t.view:"front",nt(),M.updateProjectionMatrix(),dt(F,0),pe(),Ke}return lu(Uf);})();
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
Clarinet3D.builtFrom=151174;
