var Clarinet3D=(()=>{var ba=Object.defineProperty;var Ih=Object.getOwnPropertyDescriptor;var Dh=Object.getOwnPropertyNames;var Uh=Object.prototype.hasOwnProperty;var Nh=(i,e)=>{for(var t in e)ba(i,t,{get:e[t],enumerable:!0})},Oh=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of Dh(e))!Uh.call(i,r)&&r!==t&&ba(i,r,{get:()=>e[r],enumerable:!(n=Ih(e,r))||n.enumerable});return i};var Fh=i=>Oh(ba({},"__esModule",{value:!0}),i);var cf={};Nh(cf,{createClarinet:()=>lf});var Pn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Vn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3};var Bh=0,Pl=1,ca=2;var Yc=5,Ri=100,zh=101,kh=102;var Zc=104,Vh=200,ha=201,Hh=202,Gh=203,no=204,io=205,Wh=206,jh=207,Xh=208,qh=209,Yh=210,Zh=211,Kh=212,Jh=213,$h=214,Qh=0,eu=1,tu=2,nu=3,iu=4,ru=5,su=6,au=7;var Kc=0;var Jc=5;var $c=7;var Qc=300,hr=301,ur=302,ro=303,so=304,ua=306,Br=1e3,zr=1001,ao=1002,An=1003,ou=1004;var as=1005;var qn=1006,Sa=1007;var sr=1008;var hi=1009,eh=1010,th=1011,kr=1012,Ll=1013,Li=1014,Yn=1015,$r=1016,Il=1017,Dl=1018,dr=1020,nh=35902,ih=1021,rh=1022,On=1023,sh=1024,ah=1025,Vr=1026,pr=1027,oh=1028,Ul=1029,lh=1030,Nl=1031;var Ol=1033,Us=33776,Ns=33777,Os=33778,Fs=33779,oo=35840,lo=35841,co=35842,ho=35843,uo=36196,po=37492,fo=37496,mo=37808,go=37809,vo=37810,_o=37811,xo=37812,yo=37813,Mo=37814,bo=37815,So=37816,wo=37817,Eo=37818,To=37819,Ao=37820,Ro=37821,Bs=36492,Co=36494,Po=36495,ch=36283,Lo=36284,Io=36285,Do=36286;var zs=2300,Uo=2301,wa=2302,Wl=2400,jl=2401,Xl=2402;var ir="",cn="srgb",yr="srgb-linear",da="linear",pt="srgb";var Wi=7680;var lu=512,cu=513,hu=514,uu=515,du=516,pu=517,fu=518,mu=519,ql=35044;var Yl="300 es",fr=2e3,ks=2001,Kn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let n=this._listeners[e];if(n!==void 0){let r=n.indexOf(t);r!==-1&&n.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let t=this._listeners[e.type];if(t!==void 0){e.target=this;let n=t.slice(0);for(let r=0,s=n.length;r<s;r++)n[r].call(this,e);e.target=null}}},Jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Zl=1234567,or=Math.PI/180,Hr=180/Math.PI;function Fi(){let i=4294967295*Math.random()|0,e=4294967295*Math.random()|0,t=4294967295*Math.random()|0,n=4294967295*Math.random()|0;return(Jt[255&i]+Jt[i>>8&255]+Jt[i>>16&255]+Jt[i>>24&255]+"-"+Jt[255&e]+Jt[e>>8&255]+"-"+Jt[e>>16&15|64]+Jt[e>>24&255]+"-"+Jt[63&t|128]+Jt[t>>8&255]+"-"+Jt[t>>16&255]+Jt[t>>24&255]+Jt[255&n]+Jt[n>>8&255]+Jt[n>>16&255]+Jt[n>>24&255]).toLowerCase()}function Bt(i,e,t){return Math.max(e,Math.min(t,i))}function No(i,e){return(i%e+e)%e}function Ur(i,e,t){return(1-t)*i+t*e}function rr(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function tn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(4294967295*i);case Uint16Array:return Math.round(65535*i);case Uint8Array:return Math.round(255*i);case Int32Array:return Math.round(2147483647*i);case Int16Array:return Math.round(32767*i);case Int8Array:return Math.round(127*i);default:throw new Error("Invalid component type.")}}var pa={DEG2RAD:or,RAD2DEG:Hr,generateUUID:Fi,clamp:Bt,euclideanModulo:No,mapLinear:function(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)},inverseLerp:function(i,e,t){return i!==e?(t-i)/(e-i):0},lerp:Ur,damp:function(i,e,t,n){return Ur(i,e,1-Math.exp(-t*n))},pingpong:function(i,e=1){return e-Math.abs(No(i,2*e)-e)},smoothstep:function(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e))*i*(3-2*i)},smootherstep:function(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e))*i*i*(i*(6*i-15)+10)},randInt:function(i,e){return i+Math.floor(Math.random()*(e-i+1))},randFloat:function(i,e){return i+Math.random()*(e-i)},randFloatSpread:function(i){return i*(.5-Math.random())},seededRandom:function(i){i!==void 0&&(Zl=i);let e=Zl+=1831565813;return e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296},degToRad:function(i){return i*or},radToDeg:function(i){return i*Hr},isPowerOfTwo:function(i){return!(i&i-1)&&i!==0},ceilPowerOfTwo:function(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))},floorPowerOfTwo:function(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))},setQuaternionFromProperEuler:function(i,e,t,n,r){let s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+n)/2),h=o((e+n)/2),u=s((e-n)/2),p=o((e-n)/2),d=s((n-e)/2),f=o((n-e)/2);switch(r){case"XYX":i.set(a*h,l*u,l*p,a*c);break;case"YZY":i.set(l*p,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*p,a*h,a*c);break;case"XZX":i.set(a*h,l*f,l*d,a*c);break;case"YXY":i.set(l*d,a*h,l*f,a*c);break;case"ZYZ":i.set(l*f,l*d,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}},normalize:tn,denormalize:rr},fe=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Bt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*r+e.x,this.y=s*r+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ze=class i{constructor(e,t,n,r,s,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,l,c)}set(e,t,n,r,s,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=r,h[2]=a,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],p=n[2],d=n[5],f=n[8],_=r[0],m=r[3],g=r[6],v=r[1],x=r[4],b=r[7],E=r[2],w=r[5],F=r[8];return s[0]=o*_+a*v+l*E,s[3]=o*m+a*x+l*w,s[6]=o*g+a*b+l*F,s[1]=c*_+h*v+u*E,s[4]=c*m+h*x+u*w,s[7]=c*g+h*b+u*F,s[2]=p*_+d*v+f*E,s[5]=p*m+d*x+f*w,s[8]=p*g+d*b+f*F,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*s*h+n*a*l+r*s*c-r*o*l}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,p=a*l-h*s,d=c*s-o*l,f=t*u+n*p+r*d;if(f===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/f;return e[0]=u*_,e[1]=(r*c-h*n)*_,e[2]=(a*n-r*o)*_,e[3]=p*_,e[4]=(h*t-r*l)*_,e[5]=(r*s-a*t)*_,e[6]=d*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*s)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,o,a){let l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ea.makeScale(e,t)),this}rotate(e){return this.premultiply(Ea.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ea.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ea=new Ze;function hh(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Vs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function gu(){let i=Vs("canvas");return i.style.display="block",i}var Kl={};function Dr(i){i in Kl||(Kl[i]=!0,console.warn(i))}var st={enabled:!0,workingColorSpace:yr,spaces:{},convert:function(i,e,t){return this.enabled!==!1&&e!==t&&e&&t&&(this.spaces[e].transfer===pt&&(i.r=Zn(i.r),i.g=Zn(i.g),i.b=Zn(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===pt&&(i.r=lr(i.r),i.g=lr(i.g),i.b=lr(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ir?da:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Zn(i){return i<.04045?.0773993808*i:Math.pow(.9478672986*i+.0521327014,2.4)}function lr(i){return i<.0031308?12.92*i:1.055*Math.pow(i,.41666)-.055}var Jl=[.64,.33,.3,.6,.15,.06],$l=[.2126,.7152,.0722],Ql=[.3127,.329],ec=new Ze().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),tc=new Ze().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715),ji;st.define({[yr]:{primaries:Jl,whitePoint:Ql,transfer:da,toXYZ:ec,fromXYZ:tc,luminanceCoefficients:$l,workingColorSpaceConfig:{unpackColorSpace:cn},outputColorSpaceConfig:{drawingBufferColorSpace:cn}},[cn]:{primaries:Jl,whitePoint:Ql,transfer:pt,toXYZ:ec,fromXYZ:tc,luminanceCoefficients:$l,outputColorSpaceConfig:{drawingBufferColorSpace:cn}}});var Oo=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ji===void 0&&(ji=Vs("canvas")),ji.width=e.width,ji.height=e.height;let n=ji.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ji}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Vs("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=255*Zn(s[o]/255);return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(255*Zn(t[n]/255)):t[n]=Zn(t[n]);return{data:t,width:e.width,height:e.height}}return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},vu=0,Hs=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:vu++}),this.uuid=Fi(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Ta(r[o].image)):s.push(Ta(r[o]))}else s=Ta(r);n.url=s}return t||(e.images[this.uuid]=n),n}};function Ta(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Oo.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var _u=0,mn=class i extends Kn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=1001,r=1001,s=1006,o=1008,a=1023,l=1009,c=i.DEFAULT_ANISOTROPY,h=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_u++}),this.uuid=Fi(),this.name="",this.source=new Hs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new fe(0,0),this.repeat=new fe(1,1),this.center=new fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Qc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Br:e.x=e.x-Math.floor(e.x);break;case zr:e.x=e.x<0?0:1;break;case ao:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case Br:e.y=e.y-Math.floor(e.y);break;case zr:e.y=e.y<0?0:1;break;case ao:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};mn.DEFAULT_IMAGE=null,mn.DEFAULT_MAPPING=Qc,mn.DEFAULT_ANISOTROPY=1;var yt=class i{constructor(e=0,t=0,n=0,r=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s,l=e.elements,c=l[0],h=l[4],u=l[8],p=l[1],d=l[5],f=l[9],_=l[2],m=l[6],g=l[10];if(Math.abs(h-p)<.01&&Math.abs(u-_)<.01&&Math.abs(f-m)<.01){if(Math.abs(h+p)<.1&&Math.abs(u+_)<.1&&Math.abs(f+m)<.1&&Math.abs(c+d+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let x=(c+1)/2,b=(d+1)/2,E=(g+1)/2,w=(h+p)/4,F=(u+_)/4,V=(f+m)/4;return x>b&&x>E?x<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(x),r=w/n,s=F/n):b>E?b<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(b),n=w/r,s=V/r):E<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(E),n=F/s,r=V/s),this.set(n,r,s,t),this}let v=Math.sqrt((m-f)*(m-f)+(u-_)*(u-_)+(p-h)*(p-h));return Math.abs(v)<.001&&(v=1),this.x=(m-f)/v,this.y=(u-_)/v,this.z=(p-h)/v,this.w=Math.acos((c+d+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Fo=class extends Kn{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new yt(0,0,e,t),this.scissorTest=!1,this.viewport=new yt(0,0,e,t);let r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:qn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let s=new mn(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Hs(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},vn=class extends Fo{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Gs=class extends mn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=An,this.minFilter=An,this.wrapR=zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Bo=class extends mn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=An,this.minFilter=An,this.wrapR=zr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Qt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,o,a){let l=n[r+0],c=n[r+1],h=n[r+2],u=n[r+3],p=s[o+0],d=s[o+1],f=s[o+2],_=s[o+3];if(a===0)return e[t+0]=l,e[t+1]=c,e[t+2]=h,void(e[t+3]=u);if(a===1)return e[t+0]=p,e[t+1]=d,e[t+2]=f,void(e[t+3]=_);if(u!==_||l!==p||c!==d||h!==f){let m=1-a,g=l*p+c*d+h*f+u*_,v=g>=0?1:-1,x=1-g*g;if(x>Number.EPSILON){let E=Math.sqrt(x),w=Math.atan2(E,g*v);m=Math.sin(m*w)/E,a=Math.sin(a*w)/E}let b=a*v;if(l=l*m+p*b,c=c*m+d*b,h=h*m+f*b,u=u*m+_*b,m===1-a){let E=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=E,c*=E,h*=E,u*=E}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,s,o){let a=n[r],l=n[r+1],c=n[r+2],h=n[r+3],u=s[o],p=s[o+1],d=s[o+2],f=s[o+3];return e[t]=a*f+h*u+l*d-c*p,e[t+1]=l*f+h*p+c*u-a*d,e[t+2]=c*f+h*d+a*p-l*u,e[t+3]=h*f-a*u-l*p-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(r/2),u=a(s/2),p=l(n/2),d=l(r/2),f=l(s/2);switch(o){case"XYZ":this._x=p*h*u+c*d*f,this._y=c*d*u-p*h*f,this._z=c*h*f+p*d*u,this._w=c*h*u-p*d*f;break;case"YXZ":this._x=p*h*u+c*d*f,this._y=c*d*u-p*h*f,this._z=c*h*f-p*d*u,this._w=c*h*u+p*d*f;break;case"ZXY":this._x=p*h*u-c*d*f,this._y=c*d*u+p*h*f,this._z=c*h*f+p*d*u,this._w=c*h*u-p*d*f;break;case"ZYX":this._x=p*h*u-c*d*f,this._y=c*d*u+p*h*f,this._z=c*h*f-p*d*u,this._w=c*h*u+p*d*f;break;case"YZX":this._x=p*h*u+c*d*f,this._y=c*d*u+p*h*f,this._z=c*h*f-p*d*u,this._w=c*h*u-p*d*f;break;case"XZY":this._x=p*h*u-c*d*f,this._y=c*d*u-p*h*f,this._z=c*h*f+p*d*u,this._w=c*h*u+p*d*f;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],p=n+a+u;if(p>0){let d=.5/Math.sqrt(p+1);this._w=.25/d,this._x=(h-l)*d,this._y=(s-c)*d,this._z=(o-r)*d}else if(n>a&&n>u){let d=2*Math.sqrt(1+n-a-u);this._w=(h-l)/d,this._x=.25*d,this._y=(r+o)/d,this._z=(s+c)/d}else if(a>u){let d=2*Math.sqrt(1+a-n-u);this._w=(s-c)/d,this._x=(r+o)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+u-n-a);this._w=(o-r)/d,this._x=(s+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Bt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+r*c-s*l,this._y=r*h+o*l+s*a-n*c,this._z=s*h+o*c+n*l-r*a,this._w=o*h-n*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,r=this._y,s=this._z,o=this._w,a=o*e._w+n*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;let l=1-a*a;if(l<=Number.EPSILON){let d=1-t;return this._w=d*o+t*this._w,this._x=d*n+t*this._x,this._y=d*r+t*this._y,this._z=d*s+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,p=Math.sin(t*h)/c;return this._w=o*u+this._w*p,this._x=n*u+this._x*p,this._y=r*u+this._y*p,this._z=s*u+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},D=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(nc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(nc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*n),h=2*(a*t-s*r),u=2*(s*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-s*u,this.z=r+l*u+s*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-n*l,this.z=n*a-r*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Aa.copy(this).projectOnVector(e),this.sub(Aa)}reflect(e){return this.sub(Aa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Bt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,4*t)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,3*t)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=2*Math.random()-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Aa=new D,nc=new Qt,hn=class{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Sn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Sn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Sn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Sn):Sn.fromBufferAttribute(s,o),Sn.applyMatrix4(e.matrixWorld),this.expandByPoint(Sn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),os.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),os.copy(n.boundingBox)),os.applyMatrix4(e.matrixWorld),this.union(os)}let r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Sn),Sn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ar),ls.subVectors(this.max,Ar),Xi.subVectors(e.a,Ar),qi.subVectors(e.b,Ar),Yi.subVectors(e.c,Ar),ni.subVectors(qi,Xi),ii.subVectors(Yi,qi),Mi.subVectors(Xi,Yi);let t=[0,-ni.z,ni.y,0,-ii.z,ii.y,0,-Mi.z,Mi.y,ni.z,0,-ni.x,ii.z,0,-ii.x,Mi.z,0,-Mi.x,-ni.y,ni.x,0,-ii.y,ii.x,0,-Mi.y,Mi.x,0];return!!Ra(t,Xi,qi,Yi,ls)&&(t=[1,0,0,0,1,0,0,0,1],!!Ra(t,Xi,qi,Yi,ls)&&(cs.crossVectors(ni,ii),t=[cs.x,cs.y,cs.z],Ra(t,Xi,qi,Yi,ls)))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Sn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=.5*this.getSize(Sn).length()),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Hn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Hn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Hn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Hn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Hn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Hn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Hn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Hn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Hn)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Hn=[new D,new D,new D,new D,new D,new D,new D,new D],Sn=new D,os=new hn,Xi=new D,qi=new D,Yi=new D,ni=new D,ii=new D,Mi=new D,Ar=new D,ls=new D,cs=new D,bi=new D;function Ra(i,e,t,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){bi.fromArray(i,s);let a=r.x*Math.abs(bi.x)+r.y*Math.abs(bi.y)+r.z*Math.abs(bi.z),l=e.dot(bi),c=t.dot(bi),h=n.dot(bi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var xu=new hn,Rr=new D,Ca=new D,Bn=class{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):xu.setFromPoints(e).getCenter(n);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Rr.subVectors(e,this.center);let t=Rr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),r=.5*(n-this.radius);this.center.addScaledVector(Rr,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ca.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Rr.copy(e.center).add(Ca)),this.expandByPoint(Rr.copy(e.center).sub(Ca))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},Gn=new D,Pa=new D,hs=new D,ri=new D,La=new D,us=new D,Ia=new D,Jn=class{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Gn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Gn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Gn.copy(this.origin).addScaledVector(this.direction,t),Gn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Pa.copy(e).add(t).multiplyScalar(.5),hs.copy(t).sub(e).normalize(),ri.copy(this.origin).sub(Pa);let s=.5*e.distanceTo(t),o=-this.direction.dot(hs),a=ri.dot(this.direction),l=-ri.dot(hs),c=ri.lengthSq(),h=Math.abs(1-o*o),u,p,d,f;if(h>0)if(u=o*l-a,p=o*a-l,f=s*h,u>=0)if(p>=-f)if(p<=f){let _=1/h;u*=_,p*=_,d=u*(u+o*p+2*a)+p*(o*u+p+2*l)+c}else p=s,u=Math.max(0,-(o*p+a)),d=-u*u+p*(p+2*l)+c;else p=-s,u=Math.max(0,-(o*p+a)),d=-u*u+p*(p+2*l)+c;else p<=-f?(u=Math.max(0,-(-o*s+a)),p=u>0?-s:Math.min(Math.max(-s,-l),s),d=-u*u+p*(p+2*l)+c):p<=f?(u=0,p=Math.min(Math.max(-s,-l),s),d=p*(p+2*l)+c):(u=Math.max(0,-(o*s+a)),p=u>0?s:Math.min(Math.max(-s,-l),s),d=-u*u+p*(p+2*l)+c);else p=o>0?-s:s,u=Math.max(0,-(o*p+a)),d=-u*u+p*(p+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Pa).addScaledVector(hs,p),d}intersectSphere(e,t){Gn.subVectors(e.center,this.origin);let n=Gn.dot(this.direction),r=Gn.dot(Gn)-n*n,s=e.radius*e.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0?!0:e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,p=this.origin;return c>=0?(n=(e.min.x-p.x)*c,r=(e.max.x-p.x)*c):(n=(e.max.x-p.x)*c,r=(e.min.x-p.x)*c),h>=0?(s=(e.min.y-p.y)*h,o=(e.max.y-p.y)*h):(s=(e.max.y-p.y)*h,o=(e.min.y-p.y)*h),n>o||s>r?null:((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),u>=0?(a=(e.min.z-p.z)*u,l=(e.max.z-p.z)*u):(a=(e.max.z-p.z)*u,l=(e.min.z-p.z)*u),n>l||a>r?null:((a>n||n!=n)&&(n=a),(l<r||r!=r)&&(r=l),r<0?null:this.at(n>=0?n:r,t)))}intersectsBox(e){return this.intersectBox(e,Gn)!==null}intersectTriangle(e,t,n,r,s){La.subVectors(t,e),us.subVectors(n,e),Ia.crossVectors(La,us);let o,a=this.direction.dot(Ia);if(a>0){if(r)return null;o=1}else{if(!(a<0))return null;o=-1,a=-a}ri.subVectors(this.origin,e);let l=o*this.direction.dot(us.crossVectors(ri,us));if(l<0)return null;let c=o*this.direction.dot(La.cross(ri));if(c<0||l+c>a)return null;let h=-o*ri.dot(Ia);return h<0?null:this.at(h/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Xe=class i{constructor(e,t,n,r,s,o,a,l,c,h,u,p,d,f,_,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,l,c,h,u,p,d,f,_,m)}set(e,t,n,r,s,o,a,l,c,h,u,p,d,f,_,m){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=s,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=h,g[10]=u,g[14]=p,g[3]=d,g[7]=f,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,r=1/Zi.setFromMatrixColumn(e,0).length(),s=1/Zi.setFromMatrixColumn(e,1).length(),o=1/Zi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,s=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let p=o*h,d=o*u,f=a*h,_=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=d+f*c,t[5]=p-_*c,t[9]=-a*l,t[2]=_-p*c,t[6]=f+d*c,t[10]=o*l}else if(e.order==="YXZ"){let p=l*h,d=l*u,f=c*h,_=c*u;t[0]=p+_*a,t[4]=f*a-d,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=d*a-f,t[6]=_+p*a,t[10]=o*l}else if(e.order==="ZXY"){let p=l*h,d=l*u,f=c*h,_=c*u;t[0]=p-_*a,t[4]=-o*u,t[8]=f+d*a,t[1]=d+f*a,t[5]=o*h,t[9]=_-p*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let p=o*h,d=o*u,f=a*h,_=a*u;t[0]=l*h,t[4]=f*c-d,t[8]=p*c+_,t[1]=l*u,t[5]=_*c+p,t[9]=d*c-f,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let p=o*l,d=o*c,f=a*l,_=a*c;t[0]=l*h,t[4]=_-p*u,t[8]=f*u+d,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=d*u+f,t[10]=p-_*u}else if(e.order==="XZY"){let p=o*l,d=o*c,f=a*l,_=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=p*u+_,t[5]=o*h,t[9]=d*u-f,t[2]=f*u-d,t[6]=a*h,t[10]=_*u+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(yu,e,Mu)}lookAt(e,t,n){let r=this.elements;return pn.subVectors(e,t),pn.lengthSq()===0&&(pn.z=1),pn.normalize(),si.crossVectors(n,pn),si.lengthSq()===0&&(Math.abs(n.z)===1?pn.x+=1e-4:pn.z+=1e-4,pn.normalize(),si.crossVectors(n,pn)),si.normalize(),ds.crossVectors(pn,si),r[0]=si.x,r[4]=ds.x,r[8]=pn.x,r[1]=si.y,r[5]=ds.y,r[9]=pn.y,r[2]=si.z,r[6]=ds.z,r[10]=pn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],p=n[9],d=n[13],f=n[2],_=n[6],m=n[10],g=n[14],v=n[3],x=n[7],b=n[11],E=n[15],w=r[0],F=r[4],V=r[8],U=r[12],j=r[1],Y=r[5],q=r[9],Z=r[13],K=r[2],ce=r[6],le=r[10],pe=r[14],ie=r[3],ve=r[7],I=r[11],T=r[15];return s[0]=o*w+a*j+l*K+c*ie,s[4]=o*F+a*Y+l*ce+c*ve,s[8]=o*V+a*q+l*le+c*I,s[12]=o*U+a*Z+l*pe+c*T,s[1]=h*w+u*j+p*K+d*ie,s[5]=h*F+u*Y+p*ce+d*ve,s[9]=h*V+u*q+p*le+d*I,s[13]=h*U+u*Z+p*pe+d*T,s[2]=f*w+_*j+m*K+g*ie,s[6]=f*F+_*Y+m*ce+g*ve,s[10]=f*V+_*q+m*le+g*I,s[14]=f*U+_*Z+m*pe+g*T,s[3]=v*w+x*j+b*K+E*ie,s[7]=v*F+x*Y+b*ce+E*ve,s[11]=v*V+x*q+b*le+E*I,s[15]=v*U+x*Z+b*pe+E*T,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],p=e[10],d=e[14];return e[3]*(+s*l*u-r*c*u-s*a*p+n*c*p+r*a*d-n*l*d)+e[7]*(+t*l*d-t*c*p+s*o*p-r*o*d+r*c*h-s*l*h)+e[11]*(+t*c*u-t*a*d-s*o*u+n*o*d+s*a*h-n*c*h)+e[15]*(-r*a*h-t*l*u+t*a*p+r*o*u-n*o*p+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],p=e[10],d=e[11],f=e[12],_=e[13],m=e[14],g=e[15],v=u*m*c-_*p*c+_*l*d-a*m*d-u*l*g+a*p*g,x=f*p*c-h*m*c-f*l*d+o*m*d+h*l*g-o*p*g,b=h*_*c-f*u*c+f*a*d-o*_*d-h*a*g+o*u*g,E=f*u*l-h*_*l-f*a*p+o*_*p+h*a*m-o*u*m,w=t*v+n*x+r*b+s*E;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/w;return e[0]=v*F,e[1]=(_*p*s-u*m*s-_*r*d+n*m*d+u*r*g-n*p*g)*F,e[2]=(a*m*s-_*l*s+_*r*c-n*m*c-a*r*g+n*l*g)*F,e[3]=(u*l*s-a*p*s-u*r*c+n*p*c+a*r*d-n*l*d)*F,e[4]=x*F,e[5]=(h*m*s-f*p*s+f*r*d-t*m*d-h*r*g+t*p*g)*F,e[6]=(f*l*s-o*m*s-f*r*c+t*m*c+o*r*g-t*l*g)*F,e[7]=(o*p*s-h*l*s+h*r*c-t*p*c-o*r*d+t*l*d)*F,e[8]=b*F,e[9]=(f*u*s-h*_*s-f*n*d+t*_*d+h*n*g-t*u*g)*F,e[10]=(o*_*s-f*a*s+f*n*c-t*_*c-o*n*g+t*a*g)*F,e[11]=(h*a*s-o*u*s-h*n*c+t*u*c+o*n*d-t*a*d)*F,e[12]=E*F,e[13]=(h*_*r-f*u*r+f*n*p-t*_*p-h*n*m+t*u*m)*F,e[14]=(f*a*r-o*_*r-f*n*l+t*_*l+o*n*m-t*a*m)*F,e[15]=(o*u*r-h*a*r+h*n*l-t*u*l-o*n*p+t*a*p)*F,this}scale(e){let t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),s=1-n,o=e.x,a=e.y,l=e.z,c=s*o,h=s*a;return this.set(c*o+n,c*a-r*l,c*l+r*a,0,c*a+r*l,h*a+n,h*l-r*o,0,c*l-r*a,h*l+r*o,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,o){return this.set(1,n,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,h=o+o,u=a+a,p=s*c,d=s*h,f=s*u,_=o*h,m=o*u,g=a*u,v=l*c,x=l*h,b=l*u,E=n.x,w=n.y,F=n.z;return r[0]=(1-(_+g))*E,r[1]=(d+b)*E,r[2]=(f-x)*E,r[3]=0,r[4]=(d-b)*w,r[5]=(1-(p+g))*w,r[6]=(m+v)*w,r[7]=0,r[8]=(f+x)*F,r[9]=(m-v)*F,r[10]=(1-(p+_))*F,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements,s=Zi.set(r[0],r[1],r[2]).length(),o=Zi.set(r[4],r[5],r[6]).length(),a=Zi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],wn.copy(this);let l=1/s,c=1/o,h=1/a;return wn.elements[0]*=l,wn.elements[1]*=l,wn.elements[2]*=l,wn.elements[4]*=c,wn.elements[5]*=c,wn.elements[6]*=c,wn.elements[8]*=h,wn.elements[9]*=h,wn.elements[10]*=h,t.setFromRotationMatrix(wn),n.x=s,n.y=o,n.z=a,this}makePerspective(e,t,n,r,s,o,a=2e3){let l=this.elements,c=2*s/(t-e),h=2*s/(n-r),u=(t+e)/(t-e),p=(n+r)/(n-r),d,f;if(a===fr)d=-(o+s)/(o-s),f=-2*o*s/(o-s);else{if(a!==ks)throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);d=-o/(o-s),f=-o*s/(o-s)}return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=f,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,s,o,a=2e3){let l=this.elements,c=1/(t-e),h=1/(n-r),u=1/(o-s),p=(t+e)*c,d=(n+r)*h,f,_;if(a===fr)f=(o+s)*u,_=-2*u;else{if(a!==ks)throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);f=s*u,_=-1*u}return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-p,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=_,l[14]=-f,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Zi=new D,wn=new Xe,yu=new D(0,0,0),Mu=new D(1,1,1),si=new D,ds=new D,pn=new D,ic=new Xe,rc=new Qt,zn=class i{constructor(e=0,t=0,n=0,r=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],h=r[9],u=r[2],p=r[6],d=r[10];switch(t){case"XYZ":this._y=Math.asin(Bt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Bt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Bt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Bt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(p,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Bt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Bt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ic.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ic,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return rc.setFromEuler(this),this.setFromQuaternion(rc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};zn.DEFAULT_ORDER="XYZ";var Gr=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return!!(this.mask&e.mask)}isEnabled(e){return!!(this.mask&1<<e)}},bu=0,sc=new D,Ki=new Qt,Wn=new Xe,ps=new D,Cr=new D,Su=new D,wu=new Qt,ac=new D(1,0,0),oc=new D(0,1,0),lc=new D(0,0,1),cc={type:"added"},Eu={type:"removed"},Ji={type:"childadded",child:null},Da={type:"childremoved",child:null},Rn=class i extends Kn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:bu++}),this.uuid=Fi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new D,t=new zn,n=new Qt,r=new D(1,1,1);t._onChange((function(){n.setFromEuler(t,!1)})),n._onChange((function(){t.setFromQuaternion(n,void 0,!1)})),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Xe},normalMatrix:{value:new Ze}}),this.matrix=new Xe,this.matrixWorld=new Xe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Gr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ki.setFromAxisAngle(e,t),this.quaternion.multiply(Ki),this}rotateOnWorldAxis(e,t){return Ki.setFromAxisAngle(e,t),this.quaternion.premultiply(Ki),this}rotateX(e){return this.rotateOnAxis(ac,e)}rotateY(e){return this.rotateOnAxis(oc,e)}rotateZ(e){return this.rotateOnAxis(lc,e)}translateOnAxis(e,t){return sc.copy(e).applyQuaternion(this.quaternion),this.position.add(sc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ac,e)}translateY(e){return this.translateOnAxis(oc,e)}translateZ(e){return this.translateOnAxis(lc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Wn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ps.copy(e):ps.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Cr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wn.lookAt(Cr,ps,this.up):Wn.lookAt(ps,Cr,this.up),this.quaternion.setFromRotationMatrix(Wn),r&&(Wn.extractRotation(r.matrixWorld),Ki.setFromRotationMatrix(Wn),this.quaternion.premultiply(Ki.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(cc),Ji.child=e,this.dispatchEvent(Ji),Ji.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Eu),Da.child=e,this.dispatchEvent(Da),Da.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Wn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Wn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Wn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(cc),Ji.child=e,this.dispatchEvent(Ji),Ji.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let s=this.children[n].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cr,e,Su),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cr,wu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let r={};function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map((a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()}))),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()})),this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),p=o(e.skeletons),d=o(e.animations),f=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),p.length>0&&(n.skeletons=p),d.length>0&&(n.animations=d),f.length>0&&(n.nodes=f)}return n.object=r,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let r=e.children[n];this.add(r.clone())}return this}};Rn.DEFAULT_UP=new D(0,1,0),Rn.DEFAULT_MATRIX_AUTO_UPDATE=!0,Rn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var En=new D,jn=new D,Ua=new D,Xn=new D,$i=new D,Qi=new D,hc=new D,Na=new D,Oa=new D,Fa=new D,Ba=new yt,za=new yt,ka=new yt,li=class i{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),En.subVectors(e,t),r.cross(En);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){En.subVectors(r,t),jn.subVectors(n,t),Ua.subVectors(e,t);let o=En.dot(En),a=En.dot(jn),l=En.dot(Ua),c=jn.dot(jn),h=jn.dot(Ua),u=o*c-a*a;if(u===0)return s.set(0,0,0),null;let p=1/u,d=(c*l-a*h)*p,f=(o*h-a*l)*p;return s.set(1-d-f,f,d)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Xn)!==null&&Xn.x>=0&&Xn.y>=0&&Xn.x+Xn.y<=1}static getInterpolation(e,t,n,r,s,o,a,l){return this.getBarycoord(e,t,n,r,Xn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Xn.x),l.addScaledVector(o,Xn.y),l.addScaledVector(a,Xn.z),l)}static getInterpolatedAttribute(e,t,n,r,s,o){return Ba.setScalar(0),za.setScalar(0),ka.setScalar(0),Ba.fromBufferAttribute(e,t),za.fromBufferAttribute(e,n),ka.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Ba,s.x),o.addScaledVector(za,s.y),o.addScaledVector(ka,s.z),o}static isFrontFacing(e,t,n,r){return En.subVectors(n,t),jn.subVectors(e,t),En.cross(jn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return En.subVectors(this.c,this.b),jn.subVectors(this.a,this.b),.5*En.cross(jn).length()}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return i.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,s=this.c,o,a;$i.subVectors(r,n),Qi.subVectors(s,n),Na.subVectors(e,n);let l=$i.dot(Na),c=Qi.dot(Na);if(l<=0&&c<=0)return t.copy(n);Oa.subVectors(e,r);let h=$i.dot(Oa),u=Qi.dot(Oa);if(h>=0&&u<=h)return t.copy(r);let p=l*u-h*c;if(p<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector($i,o);Fa.subVectors(e,s);let d=$i.dot(Fa),f=Qi.dot(Fa);if(f>=0&&d<=f)return t.copy(s);let _=d*c-l*f;if(_<=0&&c>=0&&f<=0)return a=c/(c-f),t.copy(n).addScaledVector(Qi,a);let m=h*f-d*u;if(m<=0&&u-h>=0&&d-f>=0)return hc.subVectors(s,r),a=(u-h)/(u-h+(d-f)),t.copy(r).addScaledVector(hc,a);let g=1/(m+_+p);return o=_*g,a=p*g,t.copy(n).addScaledVector($i,o).addScaledVector(Qi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},uh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ai={h:0,s:0,l:0},fs={h:0,s:0,l:0};function Va(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+6*(e-i)*t:t<.5?e:t<2/3?i+6*(e-i)*(2/3-t):i}var je=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=cn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(255&e)/255,st.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=st.workingColorSpace){return this.r=e,this.g=t,this.b=n,st.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=st.workingColorSpace){if(e=No(e,1),t=Bt(t,0,1),n=Bt(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,o=2*n-s;this.r=Va(o,s,e+1/3),this.g=Va(o,s,e),this.b=Va(o,s,e-1/3)}return st.toWorkingColorSpace(this,r),this}setStyle(e,t=cn){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=cn){let n=uh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zn(e.r),this.g=Zn(e.g),this.b=Zn(e.b),this}copyLinearToSRGB(e){return this.r=lr(e.r),this.g=lr(e.g),this.b=lr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=cn){return st.fromWorkingColorSpace($t.copy(this),e),65536*Math.round(Bt(255*$t.r,0,255))+256*Math.round(Bt(255*$t.g,0,255))+Math.round(Bt(255*$t.b,0,255))}getHexString(e=cn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=st.workingColorSpace){st.fromWorkingColorSpace($t.copy(this),t);let n=$t.r,r=$t.g,s=$t.b,o=Math.max(n,r,s),a=Math.min(n,r,s),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(r-s)/u+(r<s?6:0);break;case r:l=(s-n)/u+2;break;case s:l=(n-r)/u+4}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=st.workingColorSpace){return st.fromWorkingColorSpace($t.copy(this),t),e.r=$t.r,e.g=$t.g,e.b=$t.b,e}getStyle(e=cn){st.fromWorkingColorSpace($t.copy(this),e);let t=$t.r,n=$t.g,r=$t.b;return e!==cn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(255*t)},${Math.round(255*n)},${Math.round(255*r)})`}offsetHSL(e,t,n){return this.getHSL(ai),this.setHSL(ai.h+e,ai.s+t,ai.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ai),e.getHSL(fs);let n=Ur(ai.h,fs.h,t),r=Ur(ai.s,fs.s,t),s=Ur(ai.l,fs.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},$t=new je;je.NAMES=uh;var Tu=0,Ii=class extends Kn{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Tu++}),this.uuid=Fi(),this.name="",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=no,this.blendDst=io,this.blendEquation=Ri,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new je(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Wi,this.stencilZFail=Wi,this.stencilZPass=Wi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r!==void 0?r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n:console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`)}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};function r(s){let o=[];for(let a in s){let l=s[a];delete l.metadata,o.push(l)}return o}if(n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==no&&(n.blendSrc=this.blendSrc),this.blendDst!==io&&(n.blendDst=this.blendDst),this.blendEquation!==Ri&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Wi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Wi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Wi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData),t){let s=r(e.textures),o=r(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Ws=class extends Ii{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},uf=Au();function Au(){let i=new ArrayBuffer(4),e=new Float32Array(i),t=new Uint32Array(i),n=new Uint32Array(512),r=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[256|l]=32768,r[l]=24,r[256|l]=24):c<-14?(n[l]=1024>>-c-14,n[256|l]=1024>>-c-14|32768,r[l]=-c-1,r[256|l]=-c-1):c<=15?(n[l]=c+15<<10,n[256|l]=c+15<<10|32768,r[l]=13,r[256|l]=13):c<128?(n[l]=31744,n[256|l]=64512,r[l]=24,r[256|l]=24):(n[l]=31744,n[256|l]=64512,r[l]=13,r[256|l]=13)}let s=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(8388608&c);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)o[l]=l<<23;o[31]=1199570944,o[32]=2147483648;for(let l=33;l<63;++l)o[l]=2147483648+(l-32<<23);o[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:r,mantissaTable:s,exponentTable:o,offsetTable:a}}var Ft=new D,ms=new fe,zt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ql,this.updateRanges=[],this.gpuType=Yn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ms.fromBufferAttribute(this,t),ms.applyMatrix3(e),this.setXY(t,ms.x,ms.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix3(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix4(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyNormalMatrix(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.transformDirection(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=rr(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=tn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=rr(t,this.array)),t}setX(e,t){return this.normalized&&(t=tn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=rr(t,this.array)),t}setY(e,t){return this.normalized&&(t=tn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=rr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=tn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=rr(t,this.array)),t}setW(e,t){return this.normalized&&(t=tn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=tn(t,this.array),n=tn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=tn(t,this.array),n=tn(n,this.array),r=tn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=tn(t,this.array),n=tn(n,this.array),r=tn(r,this.array),s=tn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ql&&(e.usage=this.usage),e}};var js=class extends zt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Xs=class extends zt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var De=class extends zt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Ru=0,gn=new Xe,Ha=new Rn,er=new D,fn=new hn,Pr=new hn,Xt=new D,lt=class i extends Kn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ru++}),this.uuid=Fi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(hh(e)?Xs:js)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Ze().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return gn.makeRotationFromQuaternion(e),this.applyMatrix4(gn),this}rotateX(e){return gn.makeRotationX(e),this.applyMatrix4(gn),this}rotateY(e){return gn.makeRotationY(e),this.applyMatrix4(gn),this}rotateZ(e){return gn.makeRotationZ(e),this.applyMatrix4(gn),this}translate(e,t,n){return gn.makeTranslation(e,t,n),this.applyMatrix4(gn),this}scale(e,t,n){return gn.makeScale(e,t,n),this.applyMatrix4(gn),this}lookAt(e){return Ha.lookAt(e),Ha.updateMatrix(),this.applyMatrix4(Ha.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(er).negate(),this.translate(er.x,er.y,er.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let r=0,s=e.length;r<s;r++){let o=e[r];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new De(n,3))}else{for(let n=0,r=t.count;n<r;n++){let s=e[n];t.setXYZ(n,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new hn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),void this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){let s=t[n];fn.setFromBufferAttribute(s),this.morphTargetsRelative?(Xt.addVectors(this.boundingBox.min,fn.min),this.boundingBox.expandByPoint(Xt),Xt.addVectors(this.boundingBox.max,fn.max),this.boundingBox.expandByPoint(Xt)):(this.boundingBox.expandByPoint(fn.min),this.boundingBox.expandByPoint(fn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Bn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),void this.boundingSphere.set(new D,1/0);if(e){let n=this.boundingSphere.center;if(fn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){let a=t[s];Pr.setFromBufferAttribute(a),this.morphTargetsRelative?(Xt.addVectors(fn.min,Pr.min),fn.expandByPoint(Xt),Xt.addVectors(fn.max,Pr.max),fn.expandByPoint(Xt)):(fn.expandByPoint(Pr.min),fn.expandByPoint(Pr.max))}fn.getCenter(n);let r=0;for(let s=0,o=e.count;s<o;s++)Xt.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(Xt));if(t)for(let s=0,o=t.length;s<o;s++){let a=t[s],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Xt.fromBufferAttribute(a,c),l&&(er.fromBufferAttribute(e,c),Xt.add(er)),r=Math.max(r,n.distanceToSquared(Xt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0)return void console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");let n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new zt(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let V=0;V<n.count;V++)a[V]=new D,l[V]=new D;let c=new D,h=new D,u=new D,p=new fe,d=new fe,f=new fe,_=new D,m=new D;function g(V,U,j){c.fromBufferAttribute(n,V),h.fromBufferAttribute(n,U),u.fromBufferAttribute(n,j),p.fromBufferAttribute(s,V),d.fromBufferAttribute(s,U),f.fromBufferAttribute(s,j),h.sub(c),u.sub(c),d.sub(p),f.sub(p);let Y=1/(d.x*f.y-f.x*d.y);isFinite(Y)&&(_.copy(h).multiplyScalar(f.y).addScaledVector(u,-d.y).multiplyScalar(Y),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-f.x).multiplyScalar(Y),a[V].add(_),a[U].add(_),a[j].add(_),l[V].add(m),l[U].add(m),l[j].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let V=0,U=v.length;V<U;++V){let j=v[V],Y=j.start;for(let q=Y,Z=Y+j.count;q<Z;q+=3)g(e.getX(q+0),e.getX(q+1),e.getX(q+2))}let x=new D,b=new D,E=new D,w=new D;function F(V){E.fromBufferAttribute(r,V),w.copy(E);let U=a[V];x.copy(U),x.sub(E.multiplyScalar(E.dot(U))).normalize(),b.crossVectors(w,U);let j=b.dot(l[V])<0?-1:1;o.setXYZW(V,x.x,x.y,x.z,j)}for(let V=0,U=v.length;V<U;++V){let j=v[V],Y=j.start;for(let q=Y,Z=Y+j.count;q<Z;q+=3)F(e.getX(q+0)),F(e.getX(q+1)),F(e.getX(q+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new zt(new Float32Array(3*t.count),3),this.setAttribute("normal",n);else for(let p=0,d=n.count;p<d;p++)n.setXYZ(p,0,0,0);let r=new D,s=new D,o=new D,a=new D,l=new D,c=new D,h=new D,u=new D;if(e)for(let p=0,d=e.count;p<d;p+=3){let f=e.getX(p+0),_=e.getX(p+1),m=e.getX(p+2);r.fromBufferAttribute(t,f),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),a.fromBufferAttribute(n,f),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(f,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let p=0,d=t.count;p<d;p+=3)r.fromBufferAttribute(t,p+0),s.fromBufferAttribute(t,p+1),o.fromBufferAttribute(t,p+2),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),n.setXYZ(p+0,h.x,h.y,h.z),n.setXYZ(p+1,h.x,h.y,h.z),n.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Xt.fromBufferAttribute(e,t),Xt.normalize(),e.setXYZ(t,Xt.x,Xt.y,Xt.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,p=new c.constructor(l.length*h),d=0,f=0;for(let _=0,m=l.length;_<m;_++){d=a.isInterleavedBufferAttribute?l[_]*a.data.stride+a.offset:l[_]*h;for(let g=0;g<h;g++)p[f++]=c[d++]}return new zt(p,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,r=this.attributes;for(let a in r){let l=e(r[a],n);t.setAttribute(a,l)}let s=this.morphAttributes;for(let a in s){let l=[],c=s[a];for(let h=0,u=c.length;h<u;h++){let p=e(c[h],n);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,p=c.length;u<p;u++){let d=c[u];h.push(d.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let r=e.attributes;for(let c in r){let h=r[c];this.setAttribute(c,h.clone(t))}let s=e.morphAttributes;for(let c in s){let h=[],u=s[c];for(let p=0,d=u.length;p<d;p++)h.push(u[p].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},uc=new Xe,Si=new Jn,gs=new Bn,dc=new D,vs=new D,_s=new D,xs=new D,Ga=new D,ys=new D,pc=new D,Ms=new D,Ut=class extends Rn{constructor(e=new lt,t=new Ws){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=n.length;r<s;r++){let o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let a=this.morphTargetInfluences;if(s&&a){ys.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=a[l],u=s[l];h!==0&&(Ga.fromBufferAttribute(u,e),o?ys.addScaledVector(Ga,h):ys.addScaledVector(Ga.sub(t),h))}t.add(ys)}return t}raycast(e,t){let n=this.geometry,r=this.material,s=this.matrixWorld;if(r!==void 0){if(n.boundingSphere===null&&n.computeBoundingSphere(),gs.copy(n.boundingSphere),gs.applyMatrix4(s),Si.copy(e.ray).recast(e.near),gs.containsPoint(Si.origin)===!1&&(Si.intersectSphere(gs,dc)===null||Si.origin.distanceToSquared(dc)>(e.far-e.near)**2))return;uc.copy(s).invert(),Si.copy(e.ray).applyMatrix4(uc),n.boundingBox!==null&&Si.intersectsBox(n.boundingBox)===!1||this._computeIntersections(e,t,Si)}}_computeIntersections(e,t,n){let r,s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,p=s.groups,d=s.drawRange;if(a!==null)if(Array.isArray(o))for(let f=0,_=p.length;f<_;f++){let m=p[f],g=o[m.materialIndex];for(let v=Math.max(m.start,d.start),x=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));v<x;v+=3)r=bs(this,g,e,n,c,h,u,a.getX(v),a.getX(v+1),a.getX(v+2)),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=m.materialIndex,t.push(r))}else for(let f=Math.max(0,d.start),_=Math.min(a.count,d.start+d.count);f<_;f+=3)r=bs(this,o,e,n,c,h,u,a.getX(f),a.getX(f+1),a.getX(f+2)),r&&(r.faceIndex=Math.floor(f/3),t.push(r));else if(l!==void 0)if(Array.isArray(o))for(let f=0,_=p.length;f<_;f++){let m=p[f],g=o[m.materialIndex];for(let v=Math.max(m.start,d.start),x=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));v<x;v+=3)r=bs(this,g,e,n,c,h,u,v,v+1,v+2),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=m.materialIndex,t.push(r))}else for(let f=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);f<_;f+=3)r=bs(this,o,e,n,c,h,u,f,f+1,f+2),r&&(r.faceIndex=Math.floor(f/3),t.push(r))}};function bs(i,e,t,n,r,s,o,a,l,c){i.getVertexPosition(a,vs),i.getVertexPosition(l,_s),i.getVertexPosition(c,xs);let h=(function(u,p,d,f,_,m,g,v){let x;if(x=p.side===1?f.intersectTriangle(g,m,_,!0,v):f.intersectTriangle(_,m,g,p.side===0,v),x===null)return null;Ms.copy(v),Ms.applyMatrix4(u.matrixWorld);let b=d.ray.origin.distanceTo(Ms);return b<d.near||b>d.far?null:{distance:b,point:Ms.clone(),object:u}})(i,e,t,n,vs,_s,xs,pc);if(h){let u=new D;li.getBarycoord(pc,vs,_s,xs,u),r&&(h.uv=li.getInterpolatedAttribute(r,a,l,c,u,new fe)),s&&(h.uv1=li.getInterpolatedAttribute(s,a,l,c,u,new fe)),o&&(h.normal=li.getInterpolatedAttribute(o,a,l,c,u,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let p={a,b:l,c,normal:new D,materialIndex:0};li.getNormal(vs,_s,xs,p.normal),h.face=p,h.barycoord=u}return h}var ui=class i extends lt{constructor(e=1,t=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let l=[],c=[],h=[],u=[],p=0,d=0;function f(_,m,g,v,x,b,E,w,F,V,U){let j=b/F,Y=E/V,q=b/2,Z=E/2,K=w/2,ce=F+1,le=V+1,pe=0,ie=0,ve=new D;for(let I=0;I<le;I++){let T=I*Y-Z;for(let B=0;B<ce;B++){let G=B*j-q;ve[_]=G*v,ve[m]=T*x,ve[g]=K,c.push(ve.x,ve.y,ve.z),ve[_]=0,ve[m]=0,ve[g]=w>0?1:-1,h.push(ve.x,ve.y,ve.z),u.push(B/F),u.push(1-I/V),pe+=1}}for(let I=0;I<V;I++)for(let T=0;T<F;T++){let B=p+T+ce*I,G=p+T+ce*(I+1),W=p+(T+1)+ce*(I+1),H=p+(T+1)+ce*I;l.push(B,G,H),l.push(G,W,H),ie+=6}a.addGroup(d,ie,U),d+=ie,p+=pe}f("z","y","x",-1,-1,n,t,e,o,s,0),f("z","y","x",1,-1,n,t,-e,o,s,1),f("x","z","y",1,1,e,n,t,r,o,2),f("x","z","y",1,-1,e,n,-t,r,o,3),f("x","y","z",1,-1,e,t,n,r,s,4),f("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new De(c,3)),this.setAttribute("normal",new De(h,3)),this.setAttribute("uv",new De(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function mr(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function nn(i){let e={};for(let t=0;t<i.length;t++){let n=mr(i[t]);for(let r in n)e[r]=n[r]}return e}function dh(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:st.workingColorSpace}var Cu={clone:mr,merge:nn},sn=class extends Ii{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,this.fragmentShader=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=mr(e.uniforms),this.uniformsGroups=(function(t){let n=[];for(let r=0;r<t.length;r++)n.push(t[r].clone());return n})(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let s=this.uniforms[r].value;s&&s.isTexture?t.uniforms[r]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[r]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[r]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[r]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[r]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[r]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[r]={type:"m4",value:s.toArray()}:t.uniforms[r]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Di=class extends Rn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xe,this.projectionMatrix=new Xe,this.projectionMatrixInverse=new Xe,this.coordinateSystem=fr}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},oi=new D,fc=new fe,mc=new fe,rn=class extends Di{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=2*Hr*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(.5*or*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return 2*Hr*Math.atan(Math.tan(.5*or*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){oi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(oi.x,oi.y).multiplyScalar(-e/oi.z),oi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(oi.x,oi.y).multiplyScalar(-e/oi.z)}getViewSize(e,t){return this.getViewBounds(e,fc,mc),t.subVectors(mc,fc)}setViewOffset(e,t,n,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(.5*or*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*n/c,r*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},tr=-90,zo=class extends Rn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new rn(tr,1,e,t);r.layers=this.layers,this.add(r);let s=new rn(tr,1,e,t);s.layers=this.layers,this.add(s);let o=new rn(tr,1,e,t);o.layers=this.layers,this.add(o);let a=new rn(tr,1,e,t);a.layers=this.layers,this.add(a);let l=new rn(tr,1,e,t);l.layers=this.layers,this.add(l);let c=new rn(tr,1,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,s,o,a,l]=t;for(let c of t)this.remove(c);if(e===fr)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else{if(e!==ks)throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1)}for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,l,c,h]=this.children,u=e.getRenderTarget(),p=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,o),e.setRenderTarget(n,2,r),e.render(t,a),e.setRenderTarget(n,3,r),e.render(t,l),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,r),e.render(t,h),e.setRenderTarget(u,p,d),e.xr.enabled=f,n.texture.needsPMREMUpdate=!0}},qs=class extends mn{constructor(e,t,n,r,s,o,a,l,c,h){super(e=e!==void 0?e:[],t=t!==void 0?t:hr,n,r,s,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ko=class extends vn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new qs(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0&&t.generateMipmaps,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:qn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new ui(5,5,5),s=new sn({name:"CubemapFromEquirect",uniforms:mr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=t;let o=new Ut(r,s),a=t.minFilter;return t.minFilter===sr&&(t.minFilter=qn),new zo(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,r){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,r);e.setRenderTarget(s)}},Wa=new D,Pu=new D,Lu=new Ze,Tn=class{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Wa.subVectors(n,t).cross(Pu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Wa),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Lu.getNormalMatrix(e),r=this.coplanarPoint(Wa).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},wi=new Bn,Ss=new D,Wr=class{constructor(e=new Tn,t=new Tn,n=new Tn,r=new Tn,s=new Tn,o=new Tn){this.planes=[e,t,n,r,s,o]}set(e,t,n,r,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2e3){let n=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],h=r[5],u=r[6],p=r[7],d=r[8],f=r[9],_=r[10],m=r[11],g=r[12],v=r[13],x=r[14],b=r[15];if(n[0].setComponents(l-s,p-c,m-d,b-g).normalize(),n[1].setComponents(l+s,p+c,m+d,b+g).normalize(),n[2].setComponents(l+o,p+h,m+f,b+v).normalize(),n[3].setComponents(l-o,p-h,m-f,b-v).normalize(),n[4].setComponents(l-a,p-u,m-_,b-x).normalize(),t===fr)n[5].setComponents(l+a,p+u,m+_,b+x).normalize();else{if(t!==ks)throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);n[5].setComponents(a,u,_,x).normalize()}return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),wi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),wi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(wi)}intersectsSprite(e){return wi.center.set(0,0,0),wi.radius=.7071067811865476,wi.applyMatrix4(e.matrixWorld),this.intersectsSphere(wi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Ss.x=r.normal.x>0?e.max.x:e.min.x,Ss.y=r.normal.y>0?e.max.y:e.min.y,Ss.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ss)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function ph(){let i=null,e=!1,t=null,n=null;function r(s,o){t(s,o),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function Iu(i){let e=new WeakMap;return{get:function(t){return t.isInterleavedBufferAttribute&&(t=t.data),e.get(t)},remove:function(t){t.isInterleavedBufferAttribute&&(t=t.data);let n=e.get(t);n&&(i.deleteBuffer(n.buffer),e.delete(t))},update:function(t,n){if(t.isInterleavedBufferAttribute&&(t=t.data),t.isGLBufferAttribute){let s=e.get(t);return void((!s||s.version<t.version)&&e.set(t,{buffer:t.buffer,type:t.type,bytesPerElement:t.elementSize,version:t.version}))}let r=e.get(t);if(r===void 0)e.set(t,(function(s,o){let a=s.array,l=s.usage,c=a.byteLength,h=i.createBuffer(),u;if(i.bindBuffer(o,h),i.bufferData(o,a,l),s.onUploadCallback(),a instanceof Float32Array)u=i.FLOAT;else if(a instanceof Uint16Array)u=s.isFloat16BufferAttribute?i.HALF_FLOAT:i.UNSIGNED_SHORT;else if(a instanceof Int16Array)u=i.SHORT;else if(a instanceof Uint32Array)u=i.UNSIGNED_INT;else if(a instanceof Int32Array)u=i.INT;else if(a instanceof Int8Array)u=i.BYTE;else if(a instanceof Uint8Array)u=i.UNSIGNED_BYTE;else{if(!(a instanceof Uint8ClampedArray))throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+a);u=i.UNSIGNED_BYTE}return{buffer:h,type:u,bytesPerElement:a.BYTES_PER_ELEMENT,version:s.version,size:c}})(t,n));else if(r.version<t.version){if(r.size!==t.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");(function(s,o,a){let l=o.array,c=o.updateRanges;if(i.bindBuffer(a,s),c.length===0)i.bufferSubData(a,0,l);else{c.sort(((u,p)=>u.start-p.start));let h=0;for(let u=1;u<c.length;u++){let p=c[h],d=c[u];d.start<=p.start+p.count+1?p.count=Math.max(p.count,d.start+d.count-p.start):(++h,c[h]=d)}c.length=h+1;for(let u=0,p=c.length;u<p;u++){let d=c[u];i.bufferSubData(a,d.start*l.BYTES_PER_ELEMENT,l,d.start,d.count)}o.clearUpdateRanges()}o.onUploadCallback()})(r.buffer,t,n),r.version=t.version}}}}var di=class i extends lt{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let s=e/2,o=t/2,a=Math.floor(n),l=Math.floor(r),c=a+1,h=l+1,u=e/a,p=t/l,d=[],f=[],_=[],m=[];for(let g=0;g<h;g++){let v=g*p-o;for(let x=0;x<c;x++){let b=x*u-s;f.push(b,-v,0),_.push(0,0,1),m.push(x/a),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let v=0;v<a;v++){let x=v+c*g,b=v+c*(g+1),E=v+1+c*(g+1),w=v+1+c*g;d.push(x,b,w),d.push(b,E,w)}this.setIndex(d),this.setAttribute("position",new De(f,3)),this.setAttribute("normal",new De(_,3)),this.setAttribute("uv",new De(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},Ge={alphahash_fragment:`#ifdef USE_ALPHAHASH
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
}`},Te={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ze},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ze}},envmap:{envMap:{value:null},envMapRotation:{value:new Ze},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ze},normalScale:{value:new fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0},uvTransform:{value:new Ze}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ze},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0}}},Nn={basic:{uniforms:nn([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:nn([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new je(0)}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:nn([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:nn([Te.common,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.roughnessmap,Te.metalnessmap,Te.fog,Te.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:nn([Te.common,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.gradientmap,Te.fog,Te.lights,{emissive:{value:new je(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:nn([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:nn([Te.points,Te.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:nn([Te.common,Te.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:nn([Te.common,Te.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:nn([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:nn([Te.sprite,Te.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new Ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ze}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distanceRGBA:{uniforms:nn([Te.common,Te.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distanceRGBA_vert,fragmentShader:Ge.distanceRGBA_frag},shadow:{uniforms:nn([Te.lights,Te.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};Nn.physical={uniforms:nn([Nn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ze},clearcoatNormalScale:{value:new fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ze},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ze},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ze},transmissionSamplerSize:{value:new fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ze},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ze},anisotropyVector:{value:new fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ze}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};var ws={r:0,b:0,g:0},Ei=new zn,Du=new Xe;function Uu(i,e,t,n,r,s,o){let a=new je(0),l,c,h=s===!0?0:1,u=null,p=0,d=null;function f(m){let g=m.isScene===!0?m.background:null;return g&&g.isTexture&&(g=(m.backgroundBlurriness>0?t:e).get(g)),g}function _(m,g){m.getRGB(ws,dh(i)),n.buffers.color.setClear(ws.r,ws.g,ws.b,g,o)}return{getClearColor:function(){return a},setClearColor:function(m,g=1){a.set(m),h=g,_(a,h)},getClearAlpha:function(){return h},setClearAlpha:function(m){h=m,_(a,h)},render:function(m){let g=!1,v=f(m);v===null?_(a,h):v&&v.isColor&&(_(v,1),g=!0);let x=i.xr.getEnvironmentBlendMode();x==="additive"?n.buffers.color.setClear(0,0,0,1,o):x==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||g)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))},addToRenderList:function(m,g){let v=f(g);v&&(v.isCubeTexture||v.mapping===ua)?(c===void 0&&(c=new Ut(new ui(1,1,1),new sn({name:"BackgroundCubeMaterial",uniforms:mr(Nn.backgroundCube.uniforms),vertexShader:Nn.backgroundCube.vertexShader,fragmentShader:Nn.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(x,b,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(c)),Ei.copy(g.backgroundRotation),Ei.x*=-1,Ei.y*=-1,Ei.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Ei.y*=-1,Ei.z*=-1),c.material.uniforms.envMap.value=v,c.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Du.makeRotationFromEuler(Ei)),c.material.toneMapped=st.getTransfer(v.colorSpace)!==pt,u===v&&p===v.version&&d===i.toneMapping||(c.material.needsUpdate=!0,u=v,p=v.version,d=i.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new Ut(new di(2,2),new sn({name:"BackgroundMaterial",uniforms:mr(Nn.background.uniforms),vertexShader:Nn.background.vertexShader,fragmentShader:Nn.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,l.material.toneMapped=st.getTransfer(v.colorSpace)!==pt,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),u===v&&p===v.version&&d===i.toneMapping||(l.material.needsUpdate=!0,u=v,p=v.version,d=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}}}function Nu(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=c(null),s=r,o=!1;function a(g){return i.bindVertexArray(g)}function l(g){return i.deleteVertexArray(g)}function c(g){let v=[],x=[],b=[];for(let E=0;E<t;E++)v[E]=0,x[E]=0,b[E]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:v,enabledAttributes:x,attributeDivisors:b,object:g,attributes:{},index:null}}function h(){let g=s.newAttributes;for(let v=0,x=g.length;v<x;v++)g[v]=0}function u(g){p(g,0)}function p(g,v){let x=s.newAttributes,b=s.enabledAttributes,E=s.attributeDivisors;x[g]=1,b[g]===0&&(i.enableVertexAttribArray(g),b[g]=1),E[g]!==v&&(i.vertexAttribDivisor(g,v),E[g]=v)}function d(){let g=s.newAttributes,v=s.enabledAttributes;for(let x=0,b=v.length;x<b;x++)v[x]!==g[x]&&(i.disableVertexAttribArray(x),v[x]=0)}function f(g,v,x,b,E,w,F){F===!0?i.vertexAttribIPointer(g,v,x,E,w):i.vertexAttribPointer(g,v,x,b,E,w)}function _(){m(),o=!0,s!==r&&(s=r,a(s.object))}function m(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:function(g,v,x,b,E){let w=!1,F=(function(V,U,j){let Y=j.wireframe===!0,q=n[V.id];q===void 0&&(q={},n[V.id]=q);let Z=q[U.id];Z===void 0&&(Z={},q[U.id]=Z);let K=Z[Y];return K===void 0&&(K=c(i.createVertexArray()),Z[Y]=K),K})(b,x,v);s!==F&&(s=F,a(s.object)),w=(function(V,U,j,Y){let q=s.attributes,Z=U.attributes,K=0,ce=j.getAttributes();for(let le in ce)if(ce[le].location>=0){let pe=q[le],ie=Z[le];if(ie===void 0&&(le==="instanceMatrix"&&V.instanceMatrix&&(ie=V.instanceMatrix),le==="instanceColor"&&V.instanceColor&&(ie=V.instanceColor)),pe===void 0||pe.attribute!==ie||ie&&pe.data!==ie.data)return!0;K++}return s.attributesNum!==K||s.index!==Y})(g,b,x,E),w&&(function(V,U,j,Y){let q={},Z=U.attributes,K=0,ce=j.getAttributes();for(let le in ce)if(ce[le].location>=0){let pe=Z[le];pe===void 0&&(le==="instanceMatrix"&&V.instanceMatrix&&(pe=V.instanceMatrix),le==="instanceColor"&&V.instanceColor&&(pe=V.instanceColor));let ie={};ie.attribute=pe,pe&&pe.data&&(ie.data=pe.data),q[le]=ie,K++}s.attributes=q,s.attributesNum=K,s.index=Y})(g,b,x,E),E!==null&&e.update(E,i.ELEMENT_ARRAY_BUFFER),(w||o)&&(o=!1,(function(V,U,j,Y){h();let q=Y.attributes,Z=j.getAttributes(),K=U.defaultAttributeValues;for(let ce in Z){let le=Z[ce];if(le.location>=0){let pe=q[ce];if(pe===void 0&&(ce==="instanceMatrix"&&V.instanceMatrix&&(pe=V.instanceMatrix),ce==="instanceColor"&&V.instanceColor&&(pe=V.instanceColor)),pe!==void 0){let ie=pe.normalized,ve=pe.itemSize,I=e.get(pe);if(I===void 0)continue;let T=I.buffer,B=I.type,G=I.bytesPerElement,W=B===i.INT||B===i.UNSIGNED_INT||pe.gpuType===Ll;if(pe.isInterleavedBufferAttribute){let H=pe.data,M=H.stride,S=pe.offset;if(H.isInstancedInterleavedBuffer){for(let N=0;N<le.locationSize;N++)p(le.location+N,H.meshPerAttribute);V.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=H.meshPerAttribute*H.count)}else for(let N=0;N<le.locationSize;N++)u(le.location+N);i.bindBuffer(i.ARRAY_BUFFER,T);for(let N=0;N<le.locationSize;N++)f(le.location+N,ve/le.locationSize,B,ie,M*G,(S+ve/le.locationSize*N)*G,W)}else{if(pe.isInstancedBufferAttribute){for(let H=0;H<le.locationSize;H++)p(le.location+H,pe.meshPerAttribute);V.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=pe.meshPerAttribute*pe.count)}else for(let H=0;H<le.locationSize;H++)u(le.location+H);i.bindBuffer(i.ARRAY_BUFFER,T);for(let H=0;H<le.locationSize;H++)f(le.location+H,ve/le.locationSize,B,ie,ve*G,ve/le.locationSize*H*G,W)}}else if(K!==void 0){let ie=K[ce];if(ie!==void 0)switch(ie.length){case 2:i.vertexAttrib2fv(le.location,ie);break;case 3:i.vertexAttrib3fv(le.location,ie);break;case 4:i.vertexAttrib4fv(le.location,ie);break;default:i.vertexAttrib1fv(le.location,ie)}}}}d()})(g,v,x,b),E!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(E).buffer))},reset:_,resetDefaultState:m,dispose:function(){_();for(let g in n){let v=n[g];for(let x in v){let b=v[x];for(let E in b)l(b[E].object),delete b[E];delete v[x]}delete n[g]}},releaseStatesOfGeometry:function(g){if(n[g.id]===void 0)return;let v=n[g.id];for(let x in v){let b=v[x];for(let E in b)l(b[E].object),delete b[E];delete v[x]}delete n[g.id]},releaseStatesOfProgram:function(g){for(let v in n){let x=n[v];if(x[g.id]===void 0)continue;let b=x[g.id];for(let E in b)l(b[E].object),delete b[E];delete x[g.id]}},initAttributes:h,enableAttribute:u,disableUnusedAttributes:d}}function Ou(i,e,t){let n;function r(s,o,a){a!==0&&(i.drawArraysInstanced(n,s,o,a),t.update(o,n,a))}this.setMode=function(s){n=s},this.render=function(s,o){i.drawArrays(n,s,o),t.update(o,n,1)},this.renderInstances=r,this.renderMultiDraw=function(s,o,a){if(a===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,s,0,o,0,a);let l=0;for(let c=0;c<a;c++)l+=o[c];t.update(l,n,1)},this.renderMultiDrawInstances=function(s,o,a,l){if(a===0)return;let c=e.get("WEBGL_multi_draw");if(c===null)for(let h=0;h<s.length;h++)r(s[h],o[h],l[h]);else{c.multiDrawArraysInstancedWEBGL(n,s,0,o,0,l,0,a);let h=0;for(let u=0;u<a;u++)h+=o[u]*l[u];t.update(h,n,1)}}}function Fu(i,e,t,n){let r;function s(p){if(p==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";p="mediump"}return p==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=t.precision!==void 0?t.precision:"highp",a=s(o);a!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",a,"instead."),o=a);let l=t.logarithmicDepthBuffer===!0,c=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),h=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),u=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS);return{isWebGL2:!0,getMaxAnisotropy:function(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let p=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(p.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r},getMaxPrecision:s,textureFormatReadable:function(p){return p===On||n.convert(p)===i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT)},textureTypeReadable:function(p){let d=p===$r&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(p!==hi&&n.convert(p)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&p!==Yn&&!d)},precision:o,logarithmicDepthBuffer:l,reverseDepthBuffer:c,maxTextures:h,maxVertexTextures:u,maxTextureSize:i.getParameter(i.MAX_TEXTURE_SIZE),maxCubemapSize:i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),maxAttributes:i.getParameter(i.MAX_VERTEX_ATTRIBS),maxVertexUniforms:i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),maxVaryings:i.getParameter(i.MAX_VARYING_VECTORS),maxFragmentUniforms:i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),vertexTextures:u>0,maxSamples:i.getParameter(i.MAX_SAMPLES)}}function Bu(i){let e=this,t=null,n=0,r=!1,s=!1,o=new Tn,a=new Ze,l={value:null,needsUpdate:!1};function c(h,u,p,d){let f=h!==null?h.length:0,_=null;if(f!==0){if(_=l.value,d!==!0||_===null){let m=p+4*f,g=u.matrixWorldInverse;a.getNormalMatrix(g),(_===null||_.length<m)&&(_=new Float32Array(m));for(let v=0,x=p;v!==f;++v,x+=4)o.copy(h[v]).applyMatrix4(g,a),o.normal.toArray(_,x),_[x+3]=o.constant}l.value=_,l.needsUpdate=!0}return e.numPlanes=f,e.numIntersection=0,_}this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){let p=h.length!==0||u||n!==0||r;return r=u,n=h.length,p},this.beginShadows=function(){s=!0,c(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,u){t=c(h,u,0)},this.setState=function(h,u,p){let d=h.clippingPlanes,f=h.clipIntersection,_=h.clipShadows,m=i.get(h);if(!r||d===null||d.length===0||s&&!_)s?c(null):(function(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0})();else{let g=s?0:n,v=4*g,x=m.clippingState||null;l.value=x,x=c(d,u,v,p);for(let b=0;b!==v;++b)x[b]=t[b];m.clippingState=x,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=g}}}function zu(i){let e=new WeakMap;function t(r,s){return s===ro?r.mapping=hr:s===so&&(r.mapping=ur),r}function n(r){let s=r.target;s.removeEventListener("dispose",n);let o=e.get(s);o!==void 0&&(e.delete(s),o.dispose())}return{get:function(r){if(r&&r.isTexture){let s=r.mapping;if(s===ro||s===so){if(e.has(r))return t(e.get(r).texture,r.mapping);{let o=r.image;if(o&&o.height>0){let a=new ko(o.height);return a.fromEquirectangularTexture(i,r),e.set(r,a),r.addEventListener("dispose",n),t(a.texture,r.mapping)}return null}}}return r},dispose:function(){e=new WeakMap}}}var jr=class extends Di{constructor(e=-1,t=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=n-e,o=n+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},gc=[.125,.215,.35,.446,.526,.582],Lr=20,ja=new jr,vc=new je,Xa=null,qa=0,Ya=0,Za=!1,Ai=(1+Math.sqrt(5))/2,nr=1/Ai,_c=[new D(-Ai,nr,0),new D(Ai,nr,0),new D(-nr,0,Ai),new D(nr,0,Ai),new D(0,Ai,-nr),new D(0,Ai,nr),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],gr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){Xa=this._renderer.getRenderTarget(),qa=this._renderer.getActiveCubeFace(),Ya=this._renderer.getActiveMipmapLevel(),Za=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Mc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=yc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Xa,qa,Ya),this._renderer.xr.enabled=Za,e.scissorTest=!1,Es(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===hr||e.mapping===ur?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Xa=this._renderer.getRenderTarget(),qa=this._renderer.getActiveCubeFace(),Ya=this._renderer.getActiveMipmapLevel(),Za=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:qn,minFilter:qn,generateMipmaps:!1,type:$r,format:On,colorSpace:yr,depthBuffer:!1},r=xc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xc(e,t,n);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=(function(o){let a=[],l=[],c=[],h=o,u=o-4+1+gc.length;for(let p=0;p<u;p++){let d=Math.pow(2,h);l.push(d);let f=1/d;p>o-4?f=gc[p-o+4-1]:p===0&&(f=0),c.push(f);let _=1/(d-2),m=-_,g=1+_,v=[m,m,g,m,g,g,m,m,g,g,m,g],x=6,b=6,E=3,w=2,F=1,V=new Float32Array(E*b*x),U=new Float32Array(w*b*x),j=new Float32Array(F*b*x);for(let q=0;q<x;q++){let Z=q%3*2/3-1,K=q>2?0:-1,ce=[Z,K,0,Z+2/3,K,0,Z+2/3,K+1,0,Z,K,0,Z+2/3,K+1,0,Z,K+1,0];V.set(ce,E*b*q),U.set(v,w*b*q);let le=[q,q,q,q,q,q];j.set(le,F*b*q)}let Y=new lt;Y.setAttribute("position",new zt(V,E)),Y.setAttribute("uv",new zt(U,w)),Y.setAttribute("faceIndex",new zt(j,F)),a.push(Y),h>4&&h--}return{lodPlanes:a,sizeLods:l,sigmas:c}})(s)),this._blurMaterial=(function(o,a,l){let c=new Float32Array(Lr),h=new D(0,1,0);return new sn({name:"SphericalGaussianBlur",defines:{n:Lr,CUBEUV_TEXEL_WIDTH:1/a,CUBEUV_TEXEL_HEIGHT:1/l,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:c},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:h}},vertexShader:Fl(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})})(s,e,t)}return r}_compileMaterial(e){let t=new Ut(this._lodPlanes[0],e);this._renderer.compile(t,ja)}_sceneToCubeUV(e,t,n,r){let s=new rn(90,1,t,n),o=[1,-1,1,1,1,1],a=[1,1,1,-1,-1,-1],l=this._renderer,c=l.autoClear,h=l.toneMapping;l.getClearColor(vc),l.toneMapping=0,l.autoClear=!1;let u=new Ws({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),p=new Ut(new ui,u),d=!1,f=e.background;f?f.isColor&&(u.color.copy(f),e.background=null,d=!0):(u.color.copy(vc),d=!0);for(let _=0;_<6;_++){let m=_%3;m===0?(s.up.set(0,o[_],0),s.lookAt(a[_],0,0)):m===1?(s.up.set(0,0,o[_]),s.lookAt(0,a[_],0)):(s.up.set(0,o[_],0),s.lookAt(0,0,a[_]));let g=this._cubeSize;Es(r,m*g,_>2?g:0,g,g),l.setRenderTarget(r),d&&l.render(p,s),l.render(e,s)}p.geometry.dispose(),p.material.dispose(),l.toneMapping=h,l.autoClear=c,e.background=f}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===hr||e.mapping===ur;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Mc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=yc());let s=r?this._cubemapMaterial:this._equirectMaterial,o=new Ut(this._lodPlanes[0],s);s.uniforms.envMap.value=e;let a=this._cubeSize;Es(t,0,0,3*a,2*a),n.setRenderTarget(t),n.render(o,ja)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodPlanes.length;for(let s=1;s<r;s++){let o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=_c[(r-s-1)%_c.length];this._blur(e,s-1,s,o,a)}t.autoClear=n}_blur(e,t,n,r,s){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,r,"latitudinal",s),this._halfBlur(o,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=new Ut(this._lodPlanes[r],c),u=c.uniforms,p=this._sizeLods[n]-1,d=isFinite(s)?Math.PI/(2*p):2*Math.PI/39,f=s/d,_=isFinite(s)?1+Math.floor(3*f):Lr;_>Lr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${_} samples when the maximum is set to 20`);let m=[],g=0;for(let b=0;b<Lr;++b){let E=b/f,w=Math.exp(-E*E/2);m.push(w),b===0?g+=w:b<_&&(g+=2*w)}for(let b=0;b<m.length;b++)m[b]=m[b]/g;u.envMap.value=e.texture,u.samples.value=_,u.weights.value=m,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);let{_lodMax:v}=this;u.dTheta.value=d,u.mipInt.value=v-n;let x=this._sizeLods[r];Es(t,3*x*(r>v-4?r-v+4:0),4*(this._cubeSize-x),3*x,2*x),l.setRenderTarget(t),l.render(h,ja)}};function xc(i,e,t){let n=new vn(i,e,t);return n.texture.mapping=ua,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Es(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function yc(){return new sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fl(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function Mc(){return new sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Fl(){return`

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
	`}function ku(i){let e=new WeakMap,t=null;function n(r){let s=r.target;s.removeEventListener("dispose",n);let o=e.get(s);o!==void 0&&(e.delete(s),o.dispose())}return{get:function(r){if(r&&r.isTexture){let s=r.mapping,o=s===ro||s===so,a=s===hr||s===ur;if(o||a){let l=e.get(r),c=l!==void 0?l.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==c)return t===null&&(t=new gr(i)),l=o?t.fromEquirectangular(r,l):t.fromCubemap(r,l),l.texture.pmremVersion=r.pmremVersion,e.set(r,l),l.texture;if(l!==void 0)return l.texture;{let h=r.image;return o&&h&&h.height>0||a&&h&&(function(u){let p=0,d=6;for(let f=0;f<d;f++)u[f]!==void 0&&p++;return p===d})(h)?(t===null&&(t=new gr(i)),l=o?t.fromEquirectangular(r):t.fromCubemap(r),l.texture.pmremVersion=r.pmremVersion,e.set(r,l),r.addEventListener("dispose",n),l.texture):null}}}return r},dispose:function(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}}}function Vu(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let r=t(n);return r===null&&Dr("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Hu(i,e,t,n){let r={},s=new WeakMap;function o(l){let c=l.target;c.index!==null&&e.remove(c.index);for(let u in c.attributes)e.remove(c.attributes[u]);for(let u in c.morphAttributes){let p=c.morphAttributes[u];for(let d=0,f=p.length;d<f;d++)e.remove(p[d])}c.removeEventListener("dispose",o),delete r[c.id];let h=s.get(c);h&&(e.remove(h),s.delete(c)),n.releaseStatesOfGeometry(c),c.isInstancedBufferGeometry===!0&&delete c._maxInstanceCount,t.memory.geometries--}function a(l){let c=[],h=l.index,u=l.attributes.position,p=0;if(h!==null){let _=h.array;p=h.version;for(let m=0,g=_.length;m<g;m+=3){let v=_[m+0],x=_[m+1],b=_[m+2];c.push(v,x,x,b,b,v)}}else{if(u===void 0)return;{let _=u.array;p=u.version;for(let m=0,g=_.length/3-1;m<g;m+=3){let v=m+0,x=m+1,b=m+2;c.push(v,x,x,b,b,v)}}}let d=new(hh(c)?Xs:js)(c,1);d.version=p;let f=s.get(l);f&&e.remove(f),s.set(l,d)}return{get:function(l,c){return r[c.id]===!0||(c.addEventListener("dispose",o),r[c.id]=!0,t.memory.geometries++),c},update:function(l){let c=l.attributes;for(let u in c)e.update(c[u],i.ARRAY_BUFFER);let h=l.morphAttributes;for(let u in h){let p=h[u];for(let d=0,f=p.length;d<f;d++)e.update(p[d],i.ARRAY_BUFFER)}},getWireframeAttribute:function(l){let c=s.get(l);if(c){let h=l.index;h!==null&&c.version<h.version&&a(l)}else a(l);return s.get(l)}}}function Gu(i,e,t){let n,r,s;function o(a,l,c){c!==0&&(i.drawElementsInstanced(n,l,r,a*s,c),t.update(l,n,c))}this.setMode=function(a){n=a},this.setIndex=function(a){r=a.type,s=a.bytesPerElement},this.render=function(a,l){i.drawElements(n,l,r,a*s),t.update(l,n,1)},this.renderInstances=o,this.renderMultiDraw=function(a,l,c){if(c===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,l,0,r,a,0,c);let h=0;for(let u=0;u<c;u++)h+=l[u];t.update(h,n,1)},this.renderMultiDrawInstances=function(a,l,c,h){if(c===0)return;let u=e.get("WEBGL_multi_draw");if(u===null)for(let p=0;p<a.length;p++)o(a[p]/s,l[p],h[p]);else{u.multiDrawElementsInstancedWEBGL(n,l,0,r,a,0,h,0,c);let p=0;for(let d=0;d<c;d++)p+=l[d]*h[d];t.update(p,n,1)}}}function Wu(i){let e={frame:0,calls:0,triangles:0,points:0,lines:0};return{memory:{geometries:0,textures:0},render:e,programs:null,autoReset:!0,reset:function(){e.calls=0,e.triangles=0,e.points=0,e.lines=0},update:function(t,n,r){switch(e.calls++,n){case i.TRIANGLES:e.triangles+=r*(t/3);break;case i.LINES:e.lines+=r*(t/2);break;case i.LINE_STRIP:e.lines+=r*(t-1);break;case i.LINE_LOOP:e.lines+=r*t;break;case i.POINTS:e.points+=r*t;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",n)}}}}function ju(i,e,t){let n=new WeakMap,r=new yt;return{update:function(s,o,a){let l=s.morphTargetInfluences,c=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=c!==void 0?c.length:0,u=n.get(o);if(u===void 0||u.count!==h){let V=function(){w.dispose(),n.delete(o),o.removeEventListener("dispose",V)};u!==void 0&&u.texture.dispose();let p=o.morphAttributes.position!==void 0,d=o.morphAttributes.normal!==void 0,f=o.morphAttributes.color!==void 0,_=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],g=o.morphAttributes.color||[],v=0;p===!0&&(v=1),d===!0&&(v=2),f===!0&&(v=3);let x=o.attributes.position.count*v,b=1;x>e.maxTextureSize&&(b=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let E=new Float32Array(x*b*4*h),w=new Gs(E,x,b,h);w.type=Yn,w.needsUpdate=!0;let F=4*v;for(let U=0;U<h;U++){let j=_[U],Y=m[U],q=g[U],Z=x*b*4*U;for(let K=0;K<j.count;K++){let ce=K*F;p===!0&&(r.fromBufferAttribute(j,K),E[Z+ce+0]=r.x,E[Z+ce+1]=r.y,E[Z+ce+2]=r.z,E[Z+ce+3]=0),d===!0&&(r.fromBufferAttribute(Y,K),E[Z+ce+4]=r.x,E[Z+ce+5]=r.y,E[Z+ce+6]=r.z,E[Z+ce+7]=0),f===!0&&(r.fromBufferAttribute(q,K),E[Z+ce+8]=r.x,E[Z+ce+9]=r.y,E[Z+ce+10]=r.z,E[Z+ce+11]=q.itemSize===4?r.w:1)}}u={count:h,texture:w,size:new fe(x,b)},n.set(o,u),o.addEventListener("dispose",V)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)a.getUniforms().setValue(i,"morphTexture",s.morphTexture,t);else{let p=0;for(let f=0;f<l.length;f++)p+=l[f];let d=o.morphTargetsRelative?1:1-p;a.getUniforms().setValue(i,"morphTargetBaseInfluence",d),a.getUniforms().setValue(i,"morphTargetInfluences",l)}a.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),a.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}}}function Xu(i,e,t,n){let r=new WeakMap;function s(o){let a=o.target;a.removeEventListener("dispose",s),t.remove(a.instanceMatrix),a.instanceColor!==null&&t.remove(a.instanceColor)}return{update:function(o){let a=n.render.frame,l=o.geometry,c=e.get(o,l);if(r.get(c)!==a&&(e.update(c),r.set(c,a)),o.isInstancedMesh&&(o.hasEventListener("dispose",s)===!1&&o.addEventListener("dispose",s),r.get(o)!==a&&(t.update(o.instanceMatrix,i.ARRAY_BUFFER),o.instanceColor!==null&&t.update(o.instanceColor,i.ARRAY_BUFFER),r.set(o,a))),o.isSkinnedMesh){let h=o.skeleton;r.get(h)!==a&&(h.update(),r.set(h,a))}return c},dispose:function(){r=new WeakMap}}}var Ys=class extends mn{constructor(e,t,n,r,s,o,a,l,c,h=1026){if(h!==Vr&&h!==pr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Vr&&(n=Li),n===void 0&&h===pr&&(n=dr),super(null,r,s,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:An,this.minFilter=l!==void 0?l:An,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},fh=new mn,bc=new Ys(1,1),mh=new Gs,gh=new Bo,vh=new qs,Sc=[],wc=[],Ec=new Float32Array(16),Tc=new Float32Array(9),Ac=new Float32Array(4);function Mr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let r=e*t,s=Sc[r];if(s===void 0&&(s=new Float32Array(r),Sc[r]=s),e!==0){n.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(s,a)}return s}function kt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Vt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function fa(i,e){let t=wc[e];t===void 0&&(t=new Int32Array(e),wc[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function qu(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Yu(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kt(t,e))return;i.uniform2fv(this.addr,e),Vt(t,e)}}function Zu(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)t[0]===e.r&&t[1]===e.g&&t[2]===e.b||(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(kt(t,e))return;i.uniform3fv(this.addr,e),Vt(t,e)}}function Ku(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kt(t,e))return;i.uniform4fv(this.addr,e),Vt(t,e)}}function Ju(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(kt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Vt(t,e)}else{if(kt(t,n))return;Ac.set(n),i.uniformMatrix2fv(this.addr,!1,Ac),Vt(t,n)}}function $u(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(kt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Vt(t,e)}else{if(kt(t,n))return;Tc.set(n),i.uniformMatrix3fv(this.addr,!1,Tc),Vt(t,n)}}function Qu(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(kt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Vt(t,e)}else{if(kt(t,n))return;Ec.set(n),i.uniformMatrix4fv(this.addr,!1,Ec),Vt(t,n)}}function ed(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function td(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kt(t,e))return;i.uniform2iv(this.addr,e),Vt(t,e)}}function nd(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(kt(t,e))return;i.uniform3iv(this.addr,e),Vt(t,e)}}function id(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kt(t,e))return;i.uniform4iv(this.addr,e),Vt(t,e)}}function rd(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function sd(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kt(t,e))return;i.uniform2uiv(this.addr,e),Vt(t,e)}}function ad(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(kt(t,e))return;i.uniform3uiv(this.addr,e),Vt(t,e)}}function od(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kt(t,e))return;i.uniform4uiv(this.addr,e),Vt(t,e)}}function ld(i,e,t){let n=this.cache,r=t.allocateTextureUnit(),s;n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),this.type===i.SAMPLER_2D_SHADOW?(bc.compareFunction=515,s=bc):s=fh,t.setTexture2D(e||s,r)}function cd(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||gh,r)}function hd(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||vh,r)}function ud(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||mh,r)}function dd(i,e){i.uniform1fv(this.addr,e)}function pd(i,e){let t=Mr(e,this.size,2);i.uniform2fv(this.addr,t)}function fd(i,e){let t=Mr(e,this.size,3);i.uniform3fv(this.addr,t)}function md(i,e){let t=Mr(e,this.size,4);i.uniform4fv(this.addr,t)}function gd(i,e){let t=Mr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function vd(i,e){let t=Mr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function _d(i,e){let t=Mr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function xd(i,e){i.uniform1iv(this.addr,e)}function yd(i,e){i.uniform2iv(this.addr,e)}function Md(i,e){i.uniform3iv(this.addr,e)}function bd(i,e){i.uniform4iv(this.addr,e)}function Sd(i,e){i.uniform1uiv(this.addr,e)}function wd(i,e){i.uniform2uiv(this.addr,e)}function Ed(i,e){i.uniform3uiv(this.addr,e)}function Td(i,e){i.uniform4uiv(this.addr,e)}function Ad(i,e,t){let n=this.cache,r=e.length,s=fa(t,r);kt(n,s)||(i.uniform1iv(this.addr,s),Vt(n,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||fh,s[o])}function Rd(i,e,t){let n=this.cache,r=e.length,s=fa(t,r);kt(n,s)||(i.uniform1iv(this.addr,s),Vt(n,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||gh,s[o])}function Cd(i,e,t){let n=this.cache,r=e.length,s=fa(t,r);kt(n,s)||(i.uniform1iv(this.addr,s),Vt(n,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||vh,s[o])}function Pd(i,e,t){let n=this.cache,r=e.length,s=fa(t,r);kt(n,s)||(i.uniform1iv(this.addr,s),Vt(n,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||mh,s[o])}var Vo=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=(function(r){switch(r){case 5126:return qu;case 35664:return Yu;case 35665:return Zu;case 35666:return Ku;case 35674:return Ju;case 35675:return $u;case 35676:return Qu;case 5124:case 35670:return ed;case 35667:case 35671:return td;case 35668:case 35672:return nd;case 35669:case 35673:return id;case 5125:return rd;case 36294:return sd;case 36295:return ad;case 36296:return od;case 35678:case 36198:case 36298:case 36306:case 35682:return ld;case 35679:case 36299:case 36307:return cd;case 35680:case 36300:case 36308:case 36293:return hd;case 36289:case 36303:case 36311:case 36292:return ud}})(t.type)}},Ho=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=(function(r){switch(r){case 5126:return dd;case 35664:return pd;case 35665:return fd;case 35666:return md;case 35674:return gd;case 35675:return vd;case 35676:return _d;case 5124:case 35670:return xd;case 35667:case 35671:return yd;case 35668:case 35672:return Md;case 35669:case 35673:return bd;case 5125:return Sd;case 36294:return wd;case 36295:return Ed;case 36296:return Td;case 35678:case 36198:case 36298:case 36306:case 35682:return Ad;case 35679:case 36299:case 36307:return Rd;case 35680:case 36300:case 36308:case 36293:return Cd;case 36289:case 36303:case 36311:case 36292:return Pd}})(t.type)}},Go=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(e,t[a.id],n)}}},Ka=/(\w+)(\])?(\[|\.)?/g;function Rc(i,e){i.seq.push(e),i.map[e.id]=e}function Ld(i,e,t){let n=i.name,r=n.length;for(Ka.lastIndex=0;;){let s=Ka.exec(n),o=Ka.lastIndex,a=s[1],l=s[2]==="]",c=s[3];if(l&&(a|=0),c===void 0||c==="["&&o+2===r){Rc(t,c===void 0?new Vo(a,i,e):new Ho(a,i,e));break}{let h=t.map[a];h===void 0&&(h=new Go(a),Rc(t,h)),t=h}}}var cr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let s=e.getActiveUniform(t,r);Ld(s,e.getUniformLocation(t,s.name),this)}}setValue(e,t,n,r){let s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,o=t.length;s!==o;++s){let a=t[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,s=e.length;r!==s;++r){let o=e[r];o.id in t&&n.push(o)}return n}};function Cc(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Id=0,Pc=new Ze;function Lc(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";let s=/ERROR: 0:(\d+)/.exec(r);if(s){let o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+(function(a,l){let c=a.split(`
`),h=[],u=Math.max(l-6,0),p=Math.min(l+6,c.length);for(let d=u;d<p;d++){let f=d+1;h.push(`${f===l?">":" "} ${f}: ${c[d]}`)}return h.join(`
`)})(i.getShaderSource(e),o)}return r}function Dd(i,e){let t=(function(n){st._getMatrix(Pc,st.workingColorSpace,n);let r=`mat3( ${Pc.elements.map((s=>s.toFixed(4)))} )`;switch(st.getTransfer(n)){case da:return[r,"LinearTransferOETF"];case pt:return[r,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[r,"LinearTransferOETF"]}})(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Ud(i,e){let t;switch(e){case 1:t="Linear";break;case 2:t="Reinhard";break;case 3:t="Cineon";break;case 4:t="ACESFilmic";break;case 6:t="AgX";break;case 7:t="Neutral";break;case 5:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Ts=new D;function Nd(){return st.getLuminanceCoefficients(Ts),["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${Ts.x.toFixed(4)}, ${Ts.y.toFixed(4)}, ${Ts.z.toFixed(4)} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ir(i){return i!==""}function Ic(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Dc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Od=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wo(i){return i.replace(Od,Bd)}var Fd=new Map;function Bd(i,e){let t=Ge[e];if(t===void 0){let n=Fd.get(e);if(n===void 0)throw new Error("Can not resolve #include <"+e+">");t=Ge[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n)}return Wo(t)}var zd=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Uc(i){return i.replace(zd,kd)}function kd(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Nc(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function Vd(i,e,t,n){let r=i.getContext(),s=t.defines,o=t.vertexShader,a=t.fragmentShader,l=(function(Y){let q="SHADOWMAP_TYPE_BASIC";return Y.shadowMapType===1?q="SHADOWMAP_TYPE_PCF":Y.shadowMapType===2?q="SHADOWMAP_TYPE_PCF_SOFT":Y.shadowMapType===3&&(q="SHADOWMAP_TYPE_VSM"),q})(t),c=(function(Y){let q="ENVMAP_TYPE_CUBE";if(Y.envMap)switch(Y.envMapMode){case hr:case ur:q="ENVMAP_TYPE_CUBE";break;case ua:q="ENVMAP_TYPE_CUBE_UV"}return q})(t),h=(function(Y){let q="ENVMAP_MODE_REFLECTION";return Y.envMap&&Y.envMapMode===ur&&(q="ENVMAP_MODE_REFRACTION"),q})(t),u=(function(Y){let q="ENVMAP_BLENDING_NONE";if(Y.envMap)switch(Y.combine){case 0:q="ENVMAP_BLENDING_MULTIPLY";break;case 1:q="ENVMAP_BLENDING_MIX";break;case 2:q="ENVMAP_BLENDING_ADD"}return q})(t),p=(function(Y){let q=Y.envMapCubeUVHeight;if(q===null)return null;let Z=Math.log2(q)-2,K=1/q;return{texelWidth:1/(3*Math.max(Math.pow(2,Z),112)),texelHeight:K,maxMip:Z}})(t),d=(function(Y){return[Y.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",Y.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ir).join(`
`)})(t),f=(function(Y){let q=[];for(let Z in Y){let K=Y[Z];K!==!1&&q.push("#define "+Z+" "+K)}return q.join(`
`)})(s),_=r.createProgram(),m,g,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(Ir).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(Ir).join(`
`),g.length>0&&(g+=`
`)):(m=[Nc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ir).join(`
`),g=[Nc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?Ge.tonemapping_pars_fragment:"",t.toneMapping!==0?Ud("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,Dd("linearToOutputTexel",t.outputColorSpace),Nd(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ir).join(`
`)),o=Wo(o),o=Ic(o,t),o=Dc(o,t),a=Wo(a),a=Ic(a,t),a=Dc(a,t),o=Uc(o),a=Uc(a),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",t.glslVersion===Yl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Yl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let x=v+m+o,b=v+g+a,E=Cc(r,r.VERTEX_SHADER,x),w=Cc(r,r.FRAGMENT_SHADER,b);function F(Y){if(i.debug.checkShaderErrors){let q=r.getProgramInfoLog(_).trim(),Z=r.getShaderInfoLog(E).trim(),K=r.getShaderInfoLog(w).trim(),ce=!0,le=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(ce=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,_,E,w);else{let pe=Lc(r,E,"vertex"),ie=Lc(r,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+Y.name+`
Material Type: `+Y.type+`

Program Info Log: `+q+`
`+pe+`
`+ie)}else q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",q):Z!==""&&K!==""||(le=!1);le&&(Y.diagnostics={runnable:ce,programLog:q,vertexShader:{log:Z,prefix:m},fragmentShader:{log:K,prefix:g}})}r.deleteShader(E),r.deleteShader(w),V=new cr(r,_),U=(function(q,Z){let K={},ce=q.getProgramParameter(Z,q.ACTIVE_ATTRIBUTES);for(let le=0;le<ce;le++){let pe=q.getActiveAttrib(Z,le),ie=pe.name,ve=1;pe.type===q.FLOAT_MAT2&&(ve=2),pe.type===q.FLOAT_MAT3&&(ve=3),pe.type===q.FLOAT_MAT4&&(ve=4),K[ie]={type:pe.type,location:q.getAttribLocation(Z,ie),locationSize:ve}}return K})(r,_)}let V,U;r.attachShader(_,E),r.attachShader(_,w),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_),this.getUniforms=function(){return V===void 0&&F(this),V},this.getAttributes=function(){return U===void 0&&F(this),U};let j=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return j===!1&&(j=r.getProgramParameter(_,37297)),j},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Id++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=w,this}var Hd=0,jo=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Xo(e),t.set(e,n)),n}},Xo=class{constructor(e){this.id=Hd++,this.code=e,this.usedTimes=0}};function Gd(i,e,t,n,r,s,o){let a=new Gr,l=new jo,c=new Set,h=[],u=r.logarithmicDepthBuffer,p=r.vertexTextures,d=r.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(m){return c.add(m),m===0?"uv":`uv${m}`}return{getParameters:function(m,g,v,x,b){let E=x.fog,w=b.geometry,F=m.isMeshStandardMaterial?x.environment:null,V=(m.isMeshStandardMaterial?t:e).get(m.envMap||F),U=V&&V.mapping===ua?V.image.height:null,j=f[m.type];m.precision!==null&&(d=r.getMaxPrecision(m.precision),d!==m.precision&&console.warn("THREE.WebGLProgram.getParameters:",m.precision,"not supported, using",d,"instead."));let Y=w.morphAttributes.position||w.morphAttributes.normal||w.morphAttributes.color,q=Y!==void 0?Y.length:0,Z,K,ce,le,pe=0;if(w.morphAttributes.position!==void 0&&(pe=1),w.morphAttributes.normal!==void 0&&(pe=2),w.morphAttributes.color!==void 0&&(pe=3),j){let yn=Nn[j];Z=yn.vertexShader,K=yn.fragmentShader}else Z=m.vertexShader,K=m.fragmentShader,l.update(m),ce=l.getVertexShaderID(m),le=l.getFragmentShaderID(m);let ie=i.getRenderTarget(),ve=i.state.buffers.depth.getReversed(),I=b.isInstancedMesh===!0,T=b.isBatchedMesh===!0,B=!!m.map,G=!!m.matcap,W=!!V,H=!!m.aoMap,M=!!m.lightMap,S=!!m.bumpMap,N=!!m.normalMap,L=!!m.displacementMap,A=!!m.emissiveMap,C=!!m.metalnessMap,y=!!m.roughnessMap,P=m.anisotropy>0,O=m.clearcoat>0,Q=m.dispersion>0,k=m.iridescence>0,te=m.sheen>0,J=m.transmission>0,X=P&&!!m.anisotropyMap,ge=O&&!!m.clearcoatMap,ue=O&&!!m.clearcoatNormalMap,ae=O&&!!m.clearcoatRoughnessMap,me=k&&!!m.iridescenceMap,Ae=k&&!!m.iridescenceThicknessMap,Re=te&&!!m.sheenColorMap,ye=te&&!!m.sheenRoughnessMap,Ue=!!m.specularMap,He=!!m.specularColorMap,Ye=!!m.specularIntensityMap,Ce=J&&!!m.transmissionMap,We=J&&!!m.thicknessMap,$e=!!m.gradientMap,qt=!!m.alphaMap,Mt=m.alphaTest>0,ot=!!m.alphaHash,Nt=!!m.extensions,In=0;m.toneMapped&&(ie!==null&&ie.isXRRenderTarget!==!0||(In=i.toneMapping));let $={shaderID:j,shaderType:m.type,shaderName:m.name,vertexShader:Z,fragmentShader:K,defines:m.defines,customVertexShaderID:ce,customFragmentShaderID:le,isRawShaderMaterial:m.isRawShaderMaterial===!0,glslVersion:m.glslVersion,precision:d,batching:T,batchingColor:T&&b._colorsTexture!==null,instancing:I,instancingColor:I&&b.instanceColor!==null,instancingMorph:I&&b.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:ie===null?i.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:yr,alphaToCoverage:!!m.alphaToCoverage,map:B,matcap:G,envMap:W,envMapMode:W&&V.mapping,envMapCubeUVHeight:U,aoMap:H,lightMap:M,bumpMap:S,normalMap:N,displacementMap:p&&L,emissiveMap:A,normalMapObjectSpace:N&&m.normalMapType===1,normalMapTangentSpace:N&&m.normalMapType===0,metalnessMap:C,roughnessMap:y,anisotropy:P,anisotropyMap:X,clearcoat:O,clearcoatMap:ge,clearcoatNormalMap:ue,clearcoatRoughnessMap:ae,dispersion:Q,iridescence:k,iridescenceMap:me,iridescenceThicknessMap:Ae,sheen:te,sheenColorMap:Re,sheenRoughnessMap:ye,specularMap:Ue,specularColorMap:He,specularIntensityMap:Ye,transmission:J,transmissionMap:Ce,thicknessMap:We,gradientMap:$e,opaque:m.transparent===!1&&m.blending===1&&m.alphaToCoverage===!1,alphaMap:qt,alphaTest:Mt,alphaHash:ot,combine:m.combine,mapUv:B&&_(m.map.channel),aoMapUv:H&&_(m.aoMap.channel),lightMapUv:M&&_(m.lightMap.channel),bumpMapUv:S&&_(m.bumpMap.channel),normalMapUv:N&&_(m.normalMap.channel),displacementMapUv:L&&_(m.displacementMap.channel),emissiveMapUv:A&&_(m.emissiveMap.channel),metalnessMapUv:C&&_(m.metalnessMap.channel),roughnessMapUv:y&&_(m.roughnessMap.channel),anisotropyMapUv:X&&_(m.anisotropyMap.channel),clearcoatMapUv:ge&&_(m.clearcoatMap.channel),clearcoatNormalMapUv:ue&&_(m.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ae&&_(m.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&_(m.iridescenceMap.channel),iridescenceThicknessMapUv:Ae&&_(m.iridescenceThicknessMap.channel),sheenColorMapUv:Re&&_(m.sheenColorMap.channel),sheenRoughnessMapUv:ye&&_(m.sheenRoughnessMap.channel),specularMapUv:Ue&&_(m.specularMap.channel),specularColorMapUv:He&&_(m.specularColorMap.channel),specularIntensityMapUv:Ye&&_(m.specularIntensityMap.channel),transmissionMapUv:Ce&&_(m.transmissionMap.channel),thicknessMapUv:We&&_(m.thicknessMap.channel),alphaMapUv:qt&&_(m.alphaMap.channel),vertexTangents:!!w.attributes.tangent&&(N||P),vertexColors:m.vertexColors,vertexAlphas:m.vertexColors===!0&&!!w.attributes.color&&w.attributes.color.itemSize===4,pointsUvs:b.isPoints===!0&&!!w.attributes.uv&&(B||qt),fog:!!E,useFog:m.fog===!0,fogExp2:!!E&&E.isFogExp2,flatShading:m.flatShading===!0,sizeAttenuation:m.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:ve,skinning:b.isSkinnedMesh===!0,morphTargets:w.morphAttributes.position!==void 0,morphNormals:w.morphAttributes.normal!==void 0,morphColors:w.morphAttributes.color!==void 0,morphTargetsCount:q,morphTextureStride:pe,numDirLights:g.directional.length,numPointLights:g.point.length,numSpotLights:g.spot.length,numSpotLightMaps:g.spotLightMap.length,numRectAreaLights:g.rectArea.length,numHemiLights:g.hemi.length,numDirLightShadows:g.directionalShadowMap.length,numPointLightShadows:g.pointShadowMap.length,numSpotLightShadows:g.spotShadowMap.length,numSpotLightShadowsWithMaps:g.numSpotLightShadowsWithMaps,numLightProbes:g.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:m.dithering,shadowMapEnabled:i.shadowMap.enabled&&v.length>0,shadowMapType:i.shadowMap.type,toneMapping:In,decodeVideoTexture:B&&m.map.isVideoTexture===!0&&st.getTransfer(m.map.colorSpace)===pt,decodeVideoTextureEmissive:A&&m.emissiveMap.isVideoTexture===!0&&st.getTransfer(m.emissiveMap.colorSpace)===pt,premultipliedAlpha:m.premultipliedAlpha,doubleSided:m.side===2,flipSided:m.side===1,useDepthPacking:m.depthPacking>=0,depthPacking:m.depthPacking||0,index0AttributeName:m.index0AttributeName,extensionClipCullDistance:Nt&&m.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Nt&&m.extensions.multiDraw===!0||T)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:m.customProgramCacheKey()};return $.vertexUv1s=c.has(1),$.vertexUv2s=c.has(2),$.vertexUv3s=c.has(3),c.clear(),$},getProgramCacheKey:function(m){let g=[];if(m.shaderID?g.push(m.shaderID):(g.push(m.customVertexShaderID),g.push(m.customFragmentShaderID)),m.defines!==void 0)for(let v in m.defines)g.push(v),g.push(m.defines[v]);return m.isRawShaderMaterial===!1&&((function(v,x){v.push(x.precision),v.push(x.outputColorSpace),v.push(x.envMapMode),v.push(x.envMapCubeUVHeight),v.push(x.mapUv),v.push(x.alphaMapUv),v.push(x.lightMapUv),v.push(x.aoMapUv),v.push(x.bumpMapUv),v.push(x.normalMapUv),v.push(x.displacementMapUv),v.push(x.emissiveMapUv),v.push(x.metalnessMapUv),v.push(x.roughnessMapUv),v.push(x.anisotropyMapUv),v.push(x.clearcoatMapUv),v.push(x.clearcoatNormalMapUv),v.push(x.clearcoatRoughnessMapUv),v.push(x.iridescenceMapUv),v.push(x.iridescenceThicknessMapUv),v.push(x.sheenColorMapUv),v.push(x.sheenRoughnessMapUv),v.push(x.specularMapUv),v.push(x.specularColorMapUv),v.push(x.specularIntensityMapUv),v.push(x.transmissionMapUv),v.push(x.thicknessMapUv),v.push(x.combine),v.push(x.fogExp2),v.push(x.sizeAttenuation),v.push(x.morphTargetsCount),v.push(x.morphAttributeCount),v.push(x.numDirLights),v.push(x.numPointLights),v.push(x.numSpotLights),v.push(x.numSpotLightMaps),v.push(x.numHemiLights),v.push(x.numRectAreaLights),v.push(x.numDirLightShadows),v.push(x.numPointLightShadows),v.push(x.numSpotLightShadows),v.push(x.numSpotLightShadowsWithMaps),v.push(x.numLightProbes),v.push(x.shadowMapType),v.push(x.toneMapping),v.push(x.numClippingPlanes),v.push(x.numClipIntersection),v.push(x.depthPacking)})(g,m),(function(v,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),v.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reverseDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),v.push(a.mask)})(g,m),g.push(i.outputColorSpace)),g.push(m.customProgramCacheKey),g.join()},getUniforms:function(m){let g=f[m.type],v;if(g){let x=Nn[g];v=Cu.clone(x.uniforms)}else v=m.uniforms;return v},acquireProgram:function(m,g){let v;for(let x=0,b=h.length;x<b;x++){let E=h[x];if(E.cacheKey===g){v=E,++v.usedTimes;break}}return v===void 0&&(v=new Vd(i,g,m,s),h.push(v)),v},releaseProgram:function(m){if(--m.usedTimes==0){let g=h.indexOf(m);h[g]=h[h.length-1],h.pop(),m.destroy()}},releaseShaderCache:function(m){l.remove(m)},programs:h,dispose:function(){l.dispose()}}}function Wd(){let i=new WeakMap;return{has:function(e){return i.has(e)},get:function(e){let t=i.get(e);return t===void 0&&(t={},i.set(e,t)),t},remove:function(e){i.delete(e)},update:function(e,t,n){i.get(e)[t]=n},dispose:function(){i=new WeakMap}}}function jd(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Oc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Fc(){let i=[],e=0,t=[],n=[],r=[];function s(o,a,l,c,h,u){let p=i[e];return p===void 0?(p={id:o.id,object:o,geometry:a,material:l,groupOrder:c,renderOrder:o.renderOrder,z:h,group:u},i[e]=p):(p.id=o.id,p.object=o,p.geometry=a,p.material=l,p.groupOrder=c,p.renderOrder=o.renderOrder,p.z=h,p.group=u),e++,p}return{opaque:t,transmissive:n,transparent:r,init:function(){e=0,t.length=0,n.length=0,r.length=0},push:function(o,a,l,c,h,u){let p=s(o,a,l,c,h,u);l.transmission>0?n.push(p):l.transparent===!0?r.push(p):t.push(p)},unshift:function(o,a,l,c,h,u){let p=s(o,a,l,c,h,u);l.transmission>0?n.unshift(p):l.transparent===!0?r.unshift(p):t.unshift(p)},finish:function(){for(let o=e,a=i.length;o<a;o++){let l=i[o];if(l.id===null)break;l.id=null,l.object=null,l.geometry=null,l.material=null,l.group=null}},sort:function(o,a){t.length>1&&t.sort(o||jd),n.length>1&&n.sort(a||Oc),r.length>1&&r.sort(a||Oc)}}}function Xd(){let i=new WeakMap;return{get:function(e,t){let n=i.get(e),r;return n===void 0?(r=new Fc,i.set(e,[r])):t>=n.length?(r=new Fc,n.push(r)):r=n[t],r},dispose:function(){i=new WeakMap}}}function qd(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new je};break;case"SpotLight":t={position:new D,direction:new D,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new je,groundColor:new je};break;case"RectAreaLight":t={color:new je,position:new D,halfWidth:new D,halfHeight:new D}}return i[e.id]=t,t}}}var Yd=0;function Zd(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Kd(i){let e=new qd,t=(function(){let a={};return{get:function(l){if(a[l.id]!==void 0)return a[l.id];let c;switch(l.type){case"DirectionalLight":case"SpotLight":c={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"PointLight":c={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe,shadowCameraNear:1,shadowCameraFar:1e3}}return a[l.id]=c,c}}})(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let a=0;a<9;a++)n.probe.push(new D);let r=new D,s=new Xe,o=new Xe;return{setup:function(a){let l=0,c=0,h=0;for(let F=0;F<9;F++)n.probe[F].set(0,0,0);let u=0,p=0,d=0,f=0,_=0,m=0,g=0,v=0,x=0,b=0,E=0;a.sort(Zd);for(let F=0,V=a.length;F<V;F++){let U=a[F],j=U.color,Y=U.intensity,q=U.distance,Z=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)l+=j.r*Y,c+=j.g*Y,h+=j.b*Y;else if(U.isLightProbe){for(let K=0;K<9;K++)n.probe[K].addScaledVector(U.sh.coefficients[K],Y);E++}else if(U.isDirectionalLight){let K=e.get(U);if(K.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let ce=U.shadow,le=t.get(U);le.shadowIntensity=ce.intensity,le.shadowBias=ce.bias,le.shadowNormalBias=ce.normalBias,le.shadowRadius=ce.radius,le.shadowMapSize=ce.mapSize,n.directionalShadow[u]=le,n.directionalShadowMap[u]=Z,n.directionalShadowMatrix[u]=U.shadow.matrix,m++}n.directional[u]=K,u++}else if(U.isSpotLight){let K=e.get(U);K.position.setFromMatrixPosition(U.matrixWorld),K.color.copy(j).multiplyScalar(Y),K.distance=q,K.coneCos=Math.cos(U.angle),K.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),K.decay=U.decay,n.spot[d]=K;let ce=U.shadow;if(U.map&&(n.spotLightMap[x]=U.map,x++,ce.updateMatrices(U),U.castShadow&&b++),n.spotLightMatrix[d]=ce.matrix,U.castShadow){let le=t.get(U);le.shadowIntensity=ce.intensity,le.shadowBias=ce.bias,le.shadowNormalBias=ce.normalBias,le.shadowRadius=ce.radius,le.shadowMapSize=ce.mapSize,n.spotShadow[d]=le,n.spotShadowMap[d]=Z,v++}d++}else if(U.isRectAreaLight){let K=e.get(U);K.color.copy(j).multiplyScalar(Y),K.halfWidth.set(.5*U.width,0,0),K.halfHeight.set(0,.5*U.height,0),n.rectArea[f]=K,f++}else if(U.isPointLight){let K=e.get(U);if(K.color.copy(U.color).multiplyScalar(U.intensity),K.distance=U.distance,K.decay=U.decay,U.castShadow){let ce=U.shadow,le=t.get(U);le.shadowIntensity=ce.intensity,le.shadowBias=ce.bias,le.shadowNormalBias=ce.normalBias,le.shadowRadius=ce.radius,le.shadowMapSize=ce.mapSize,le.shadowCameraNear=ce.camera.near,le.shadowCameraFar=ce.camera.far,n.pointShadow[p]=le,n.pointShadowMap[p]=Z,n.pointShadowMatrix[p]=U.shadow.matrix,g++}n.point[p]=K,p++}else if(U.isHemisphereLight){let K=e.get(U);K.skyColor.copy(U.color).multiplyScalar(Y),K.groundColor.copy(U.groundColor).multiplyScalar(Y),n.hemi[_]=K,_++}}f>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Te.LTC_FLOAT_1,n.rectAreaLTC2=Te.LTC_FLOAT_2):(n.rectAreaLTC1=Te.LTC_HALF_1,n.rectAreaLTC2=Te.LTC_HALF_2)),n.ambient[0]=l,n.ambient[1]=c,n.ambient[2]=h;let w=n.hash;w.directionalLength===u&&w.pointLength===p&&w.spotLength===d&&w.rectAreaLength===f&&w.hemiLength===_&&w.numDirectionalShadows===m&&w.numPointShadows===g&&w.numSpotShadows===v&&w.numSpotMaps===x&&w.numLightProbes===E||(n.directional.length=u,n.spot.length=d,n.rectArea.length=f,n.point.length=p,n.hemi.length=_,n.directionalShadow.length=m,n.directionalShadowMap.length=m,n.pointShadow.length=g,n.pointShadowMap.length=g,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=m,n.pointShadowMatrix.length=g,n.spotLightMatrix.length=v+x-b,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=E,w.directionalLength=u,w.pointLength=p,w.spotLength=d,w.rectAreaLength=f,w.hemiLength=_,w.numDirectionalShadows=m,w.numPointShadows=g,w.numSpotShadows=v,w.numSpotMaps=x,w.numLightProbes=E,n.version=Yd++)},setupView:function(a,l){let c=0,h=0,u=0,p=0,d=0,f=l.matrixWorldInverse;for(let _=0,m=a.length;_<m;_++){let g=a[_];if(g.isDirectionalLight){let v=n.directional[c];v.direction.setFromMatrixPosition(g.matrixWorld),r.setFromMatrixPosition(g.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(f),c++}else if(g.isSpotLight){let v=n.spot[u];v.position.setFromMatrixPosition(g.matrixWorld),v.position.applyMatrix4(f),v.direction.setFromMatrixPosition(g.matrixWorld),r.setFromMatrixPosition(g.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(f),u++}else if(g.isRectAreaLight){let v=n.rectArea[p];v.position.setFromMatrixPosition(g.matrixWorld),v.position.applyMatrix4(f),o.identity(),s.copy(g.matrixWorld),s.premultiply(f),o.extractRotation(s),v.halfWidth.set(.5*g.width,0,0),v.halfHeight.set(0,.5*g.height,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),p++}else if(g.isPointLight){let v=n.point[h];v.position.setFromMatrixPosition(g.matrixWorld),v.position.applyMatrix4(f),h++}else if(g.isHemisphereLight){let v=n.hemi[d];v.direction.setFromMatrixPosition(g.matrixWorld),v.direction.transformDirection(f),d++}}},state:n}}function Bc(i){let e=new Kd(i),t=[],n=[],r={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:function(s){r.camera=s,t.length=0,n.length=0},state:r,setupLights:function(){e.setup(t)},setupLightsView:function(s){e.setupView(t,s)},pushLight:function(s){t.push(s)},pushShadow:function(s){n.push(s)}}}function Jd(i){let e=new WeakMap;return{get:function(t,n=0){let r=e.get(t),s;return r===void 0?(s=new Bc(i),e.set(t,[s])):n>=r.length?(s=new Bc(i),r.push(s)):s=r[n],s},dispose:function(){e=new WeakMap}}}var qo=class extends Ii{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Yo=class extends Ii{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function $d(i,e,t){let n=new Wr,r=new fe,s=new fe,o=new yt,a=new qo({depthPacking:3201}),l=new Yo,c={},h=t.maxTextureSize,u={[Bh]:1,[Pl]:0,[ca]:2},p=new sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new fe},radius:{value:4}},vertexShader:`void main() {
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
}`}),d=p.clone();d.defines.HORIZONTAL_PASS=1;let f=new lt;f.setAttribute("position",new zt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Ut(f,p),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let g=this.type;function v(w,F){let V=e.update(_);p.defines.VSM_SAMPLES!==w.blurSamples&&(p.defines.VSM_SAMPLES=w.blurSamples,d.defines.VSM_SAMPLES=w.blurSamples,p.needsUpdate=!0,d.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new vn(r.x,r.y)),p.uniforms.shadow_pass.value=w.map.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(F,null,V,p,_,null),d.uniforms.shadow_pass.value=w.mapPass.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(F,null,V,d,_,null)}function x(w,F,V,U){let j=null,Y=V.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(Y!==void 0)j=Y;else if(j=V.isPointLight===!0?l:a,i.localClippingEnabled&&F.clipShadows===!0&&Array.isArray(F.clippingPlanes)&&F.clippingPlanes.length!==0||F.displacementMap&&F.displacementScale!==0||F.alphaMap&&F.alphaTest>0||F.map&&F.alphaTest>0){let q=j.uuid,Z=F.uuid,K=c[q];K===void 0&&(K={},c[q]=K);let ce=K[Z];ce===void 0&&(ce=j.clone(),K[Z]=ce,F.addEventListener("dispose",E)),j=ce}return j.visible=F.visible,j.wireframe=F.wireframe,j.side=U===3?F.shadowSide!==null?F.shadowSide:F.side:F.shadowSide!==null?F.shadowSide:u[F.side],j.alphaMap=F.alphaMap,j.alphaTest=F.alphaTest,j.map=F.map,j.clipShadows=F.clipShadows,j.clippingPlanes=F.clippingPlanes,j.clipIntersection=F.clipIntersection,j.displacementMap=F.displacementMap,j.displacementScale=F.displacementScale,j.displacementBias=F.displacementBias,j.wireframeLinewidth=F.wireframeLinewidth,j.linewidth=F.linewidth,V.isPointLight===!0&&j.isMeshDistanceMaterial===!0&&(i.properties.get(j).light=V),j}function b(w,F,V,U,j){if(w.visible===!1)return;if(w.layers.test(F.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&j===3)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,w.matrixWorld);let q=e.update(w),Z=w.material;if(Array.isArray(Z)){let K=q.groups;for(let ce=0,le=K.length;ce<le;ce++){let pe=K[ce],ie=Z[pe.materialIndex];if(ie&&ie.visible){let ve=x(w,ie,U,j);w.onBeforeShadow(i,w,F,V,q,ve,pe),i.renderBufferDirect(V,null,q,ve,w,pe),w.onAfterShadow(i,w,F,V,q,ve,pe)}}}else if(Z.visible){let K=x(w,Z,U,j);w.onBeforeShadow(i,w,F,V,q,K,null),i.renderBufferDirect(V,null,q,K,w,null),w.onAfterShadow(i,w,F,V,q,K,null)}}let Y=w.children;for(let q=0,Z=Y.length;q<Z;q++)b(Y[q],F,V,U,j)}function E(w){w.target.removeEventListener("dispose",E);for(let F in c){let V=c[F],U=w.target.uuid;U in V&&(V[U].dispose(),delete V[U])}}this.render=function(w,F,V){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;let U=i.getRenderTarget(),j=i.getActiveCubeFace(),Y=i.getActiveMipmapLevel(),q=i.state;q.setBlending(0),q.buffers.color.setClear(1,1,1,1),q.buffers.depth.setTest(!0),q.setScissorTest(!1);let Z=g!==3&&this.type===3,K=g===3&&this.type!==3;for(let ce=0,le=w.length;ce<le;ce++){let pe=w[ce],ie=pe.shadow;if(ie===void 0){console.warn("THREE.WebGLShadowMap:",pe,"has no shadow.");continue}if(ie.autoUpdate===!1&&ie.needsUpdate===!1)continue;r.copy(ie.mapSize);let ve=ie.getFrameExtents();if(r.multiply(ve),s.copy(ie.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/ve.x),r.x=s.x*ve.x,ie.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/ve.y),r.y=s.y*ve.y,ie.mapSize.y=s.y)),ie.map===null||Z===!0||K===!0){let T=this.type!==3?{minFilter:An,magFilter:An}:{};ie.map!==null&&ie.map.dispose(),ie.map=new vn(r.x,r.y,T),ie.map.texture.name=pe.name+".shadowMap",ie.camera.updateProjectionMatrix()}i.setRenderTarget(ie.map),i.clear();let I=ie.getViewportCount();for(let T=0;T<I;T++){let B=ie.getViewport(T);o.set(s.x*B.x,s.y*B.y,s.x*B.z,s.y*B.w),q.viewport(o),ie.updateMatrices(pe,T),n=ie.getFrustum(),b(F,V,ie.camera,pe,this.type)}ie.isPointLightShadow!==!0&&this.type===3&&v(ie,V),ie.needsUpdate=!1}g=this.type,m.needsUpdate=!1,i.setRenderTarget(U,j,Y)}}var Qd={[Qh]:1,[tu]:6,[iu]:7,[nu]:5,[eu]:0,[su]:2,[au]:4,[ru]:3};function ep(i,e){let t=new function(){let y=!1,P=new yt,O=null,Q=new yt(0,0,0,0);return{setMask:function(k){O===k||y||(i.colorMask(k,k,k,k),O=k)},setLocked:function(k){y=k},setClear:function(k,te,J,X,ge){ge===!0&&(k*=X,te*=X,J*=X),P.set(k,te,J,X),Q.equals(P)===!1&&(i.clearColor(k,te,J,X),Q.copy(P))},reset:function(){y=!1,O=null,Q.set(-1,0,0,0)}}},n=new function(){let y=!1,P=!1,O=null,Q=null,k=null;return{setReversed:function(te){if(P!==te){let J=e.get("EXT_clip_control");P?J.clipControlEXT(J.LOWER_LEFT_EXT,J.ZERO_TO_ONE_EXT):J.clipControlEXT(J.LOWER_LEFT_EXT,J.NEGATIVE_ONE_TO_ONE_EXT);let X=k;k=null,this.setClear(X)}P=te},getReversed:function(){return P},setTest:function(te){te?W(i.DEPTH_TEST):H(i.DEPTH_TEST)},setMask:function(te){O===te||y||(i.depthMask(te),O=te)},setFunc:function(te){if(P&&(te=Qd[te]),Q!==te){switch(te){case 0:i.depthFunc(i.NEVER);break;case 1:i.depthFunc(i.ALWAYS);break;case 2:i.depthFunc(i.LESS);break;case 3:default:i.depthFunc(i.LEQUAL);break;case 4:i.depthFunc(i.EQUAL);break;case 5:i.depthFunc(i.GEQUAL);break;case 6:i.depthFunc(i.GREATER);break;case 7:i.depthFunc(i.NOTEQUAL)}Q=te}},setLocked:function(te){y=te},setClear:function(te){k!==te&&(P&&(te=1-te),i.clearDepth(te),k=te)},reset:function(){y=!1,O=null,Q=null,k=null,P=!1}}},r=new function(){let y=!1,P=null,O=null,Q=null,k=null,te=null,J=null,X=null,ge=null;return{setTest:function(ue){y||(ue?W(i.STENCIL_TEST):H(i.STENCIL_TEST))},setMask:function(ue){P===ue||y||(i.stencilMask(ue),P=ue)},setFunc:function(ue,ae,me){O===ue&&Q===ae&&k===me||(i.stencilFunc(ue,ae,me),O=ue,Q=ae,k=me)},setOp:function(ue,ae,me){te===ue&&J===ae&&X===me||(i.stencilOp(ue,ae,me),te=ue,J=ae,X=me)},setLocked:function(ue){y=ue},setClear:function(ue){ge!==ue&&(i.clearStencil(ue),ge=ue)},reset:function(){y=!1,P=null,O=null,Q=null,k=null,te=null,J=null,X=null,ge=null}}},s=new WeakMap,o=new WeakMap,a={},l={},c=new WeakMap,h=[],u=null,p=!1,d=null,f=null,_=null,m=null,g=null,v=null,x=null,b=new je(0,0,0),E=0,w=!1,F=null,V=null,U=null,j=null,Y=null,q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Z=!1,K=0,ce=i.getParameter(i.VERSION);ce.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(ce)[1]),Z=K>=1):ce.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(ce)[1]),Z=K>=2);let le=null,pe={},ie=i.getParameter(i.SCISSOR_BOX),ve=i.getParameter(i.VIEWPORT),I=new yt().fromArray(ie),T=new yt().fromArray(ve);function B(y,P,O,Q){let k=new Uint8Array(4),te=i.createTexture();i.bindTexture(y,te),i.texParameteri(y,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(y,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let J=0;J<O;J++)y===i.TEXTURE_3D||y===i.TEXTURE_2D_ARRAY?i.texImage3D(P,0,i.RGBA,1,1,Q,0,i.RGBA,i.UNSIGNED_BYTE,k):i.texImage2D(P+J,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,k);return te}let G={};function W(y){a[y]!==!0&&(i.enable(y),a[y]=!0)}function H(y){a[y]!==!1&&(i.disable(y),a[y]=!1)}G[i.TEXTURE_2D]=B(i.TEXTURE_2D,i.TEXTURE_2D,1),G[i.TEXTURE_CUBE_MAP]=B(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),G[i.TEXTURE_2D_ARRAY]=B(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),G[i.TEXTURE_3D]=B(i.TEXTURE_3D,i.TEXTURE_3D,1,1),t.setClear(0,0,0,1),n.setClear(1),r.setClear(0),W(i.DEPTH_TEST),n.setFunc(3),L(!1),A(1),W(i.CULL_FACE),N(0);let M={[Ri]:i.FUNC_ADD,[zh]:i.FUNC_SUBTRACT,[kh]:i.FUNC_REVERSE_SUBTRACT};M[103]=i.MIN,M[104]=i.MAX;let S={[Vh]:i.ZERO,[ha]:i.ONE,[Hh]:i.SRC_COLOR,[no]:i.SRC_ALPHA,[Yh]:i.SRC_ALPHA_SATURATE,[Xh]:i.DST_COLOR,[Wh]:i.DST_ALPHA,[Gh]:i.ONE_MINUS_SRC_COLOR,[io]:i.ONE_MINUS_SRC_ALPHA,[qh]:i.ONE_MINUS_DST_COLOR,[jh]:i.ONE_MINUS_DST_ALPHA,[Zh]:i.CONSTANT_COLOR,[Kh]:i.ONE_MINUS_CONSTANT_COLOR,[Jh]:i.CONSTANT_ALPHA,[$h]:i.ONE_MINUS_CONSTANT_ALPHA};function N(y,P,O,Q,k,te,J,X,ge,ue){if(y!==0){if(p===!1&&(W(i.BLEND),p=!0),y===5)k=k||P,te=te||O,J=J||Q,P===f&&k===g||(i.blendEquationSeparate(M[P],M[k]),f=P,g=k),O===_&&Q===m&&te===v&&J===x||(i.blendFuncSeparate(S[O],S[Q],S[te],S[J]),_=O,m=Q,v=te,x=J),X.equals(b)!==!1&&ge===E||(i.blendColor(X.r,X.g,X.b,ge),b.copy(X),E=ge),d=y,w=!1;else if(y!==d||ue!==w){if(f===Ri&&g===Ri||(i.blendEquation(i.FUNC_ADD),f=Ri,g=Ri),ue)switch(y){case 1:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.ONE,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",y)}else switch(y){case 1:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",y)}_=null,m=null,v=null,x=null,b.set(0,0,0),E=0,d=y,w=ue}}else p===!0&&(H(i.BLEND),p=!1)}function L(y){F!==y&&(y?i.frontFace(i.CW):i.frontFace(i.CCW),F=y)}function A(y){y!==0?(W(i.CULL_FACE),y!==V&&(y===1?i.cullFace(i.BACK):y===2?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):H(i.CULL_FACE),V=y}function C(y,P,O){y?(W(i.POLYGON_OFFSET_FILL),j===P&&Y===O||(i.polygonOffset(P,O),j=P,Y=O)):H(i.POLYGON_OFFSET_FILL)}return{buffers:{color:t,depth:n,stencil:r},enable:W,disable:H,bindFramebuffer:function(y,P){return l[y]!==P&&(i.bindFramebuffer(y,P),l[y]=P,y===i.DRAW_FRAMEBUFFER&&(l[i.FRAMEBUFFER]=P),y===i.FRAMEBUFFER&&(l[i.DRAW_FRAMEBUFFER]=P),!0)},drawBuffers:function(y,P){let O=h,Q=!1;if(y){O=c.get(P),O===void 0&&(O=[],c.set(P,O));let k=y.textures;if(O.length!==k.length||O[0]!==i.COLOR_ATTACHMENT0){for(let te=0,J=k.length;te<J;te++)O[te]=i.COLOR_ATTACHMENT0+te;O.length=k.length,Q=!0}}else O[0]!==i.BACK&&(O[0]=i.BACK,Q=!0);Q&&i.drawBuffers(O)},useProgram:function(y){return u!==y&&(i.useProgram(y),u=y,!0)},setBlending:N,setMaterial:function(y,P){y.side===2?H(i.CULL_FACE):W(i.CULL_FACE);let O=y.side===1;P&&(O=!O),L(O),y.blending===1&&y.transparent===!1?N(0):N(y.blending,y.blendEquation,y.blendSrc,y.blendDst,y.blendEquationAlpha,y.blendSrcAlpha,y.blendDstAlpha,y.blendColor,y.blendAlpha,y.premultipliedAlpha),n.setFunc(y.depthFunc),n.setTest(y.depthTest),n.setMask(y.depthWrite),t.setMask(y.colorWrite);let Q=y.stencilWrite;r.setTest(Q),Q&&(r.setMask(y.stencilWriteMask),r.setFunc(y.stencilFunc,y.stencilRef,y.stencilFuncMask),r.setOp(y.stencilFail,y.stencilZFail,y.stencilZPass)),C(y.polygonOffset,y.polygonOffsetFactor,y.polygonOffsetUnits),y.alphaToCoverage===!0?W(i.SAMPLE_ALPHA_TO_COVERAGE):H(i.SAMPLE_ALPHA_TO_COVERAGE)},setFlipSided:L,setCullFace:A,setLineWidth:function(y){y!==U&&(Z&&i.lineWidth(y),U=y)},setPolygonOffset:C,setScissorTest:function(y){y?W(i.SCISSOR_TEST):H(i.SCISSOR_TEST)},activeTexture:function(y){y===void 0&&(y=i.TEXTURE0+q-1),le!==y&&(i.activeTexture(y),le=y)},bindTexture:function(y,P,O){O===void 0&&(O=le===null?i.TEXTURE0+q-1:le);let Q=pe[O];Q===void 0&&(Q={type:void 0,texture:void 0},pe[O]=Q),Q.type===y&&Q.texture===P||(le!==O&&(i.activeTexture(O),le=O),i.bindTexture(y,P||G[y]),Q.type=y,Q.texture=P)},unbindTexture:function(){let y=pe[le];y!==void 0&&y.type!==void 0&&(i.bindTexture(y.type,null),y.type=void 0,y.texture=void 0)},compressedTexImage2D:function(){try{i.compressedTexImage2D.apply(i,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},compressedTexImage3D:function(){try{i.compressedTexImage3D.apply(i,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},texImage2D:function(){try{i.texImage2D.apply(i,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},texImage3D:function(){try{i.texImage3D.apply(i,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},updateUBOMapping:function(y,P){let O=o.get(P);O===void 0&&(O=new WeakMap,o.set(P,O));let Q=O.get(y);Q===void 0&&(Q=i.getUniformBlockIndex(P,y.name),O.set(y,Q))},uniformBlockBinding:function(y,P){let O=o.get(P).get(y);s.get(P)!==O&&(i.uniformBlockBinding(P,O,y.__bindingPointIndex),s.set(P,O))},texStorage2D:function(){try{i.texStorage2D.apply(i,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},texStorage3D:function(){try{i.texStorage3D.apply(i,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},texSubImage2D:function(){try{i.texSubImage2D.apply(i,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},texSubImage3D:function(){try{i.texSubImage3D.apply(i,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},compressedTexSubImage2D:function(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},compressedTexSubImage3D:function(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(y){console.error("THREE.WebGLState:",y)}},scissor:function(y){I.equals(y)===!1&&(i.scissor(y.x,y.y,y.z,y.w),I.copy(y))},viewport:function(y){T.equals(y)===!1&&(i.viewport(y.x,y.y,y.z,y.w),T.copy(y))},reset:function(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),n.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),a={},le=null,pe={},l={},c=new WeakMap,h=[],u=null,p=!1,d=null,f=null,_=null,m=null,g=null,v=null,x=null,b=new je(0,0,0),E=0,w=!1,F=null,V=null,U=null,j=null,Y=null,I.set(0,0,i.canvas.width,i.canvas.height),T.set(0,0,i.canvas.width,i.canvas.height),t.reset(),n.reset(),r.reset()}}}function zc(i,e,t,n){let r=(function(s){switch(s){case hi:case eh:return{byteLength:1,components:1};case kr:case th:case $r:return{byteLength:2,components:1};case Il:case Dl:return{byteLength:2,components:4};case Li:case Ll:case Yn:return{byteLength:4,components:1};case nh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)})(n);switch(t){case ih:case sh:return i*e;case ah:return i*e*2;case oh:case Ul:return i*e/r.components*r.byteLength;case lh:case Nl:return i*e*2/r.components*r.byteLength;case rh:return i*e*3/r.components*r.byteLength;case On:case Ol:return i*e*4/r.components*r.byteLength;case Us:case Ns:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Os:case Fs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case lo:case ho:return Math.max(i,16)*Math.max(e,8)/4;case oo:case co:return Math.max(i,8)*Math.max(e,8)/2;case uo:case po:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case fo:case mo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case go:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case vo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case _o:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case xo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case yo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Mo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case bo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case So:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case wo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Eo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case To:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Ao:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ro:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Bs:case Co:case Po:return Math.ceil(i/4)*Math.ceil(e/4)*16;case ch:case Lo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Io:case Do:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function tp(i,e,t,n,r,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator<"u"&&/OculusBrowser/g.test(navigator.userAgent),c=new fe,h=new WeakMap,u,p=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function f(M,S){return d?new OffscreenCanvas(M,S):Vs("canvas")}function _(M,S,N){let L=1,A=H(M);if((A.width>N||A.height>N)&&(L=N/Math.max(A.width,A.height)),L<1){if(typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&M instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&M instanceof ImageBitmap||typeof VideoFrame<"u"&&M instanceof VideoFrame){let C=Math.floor(L*A.width),y=Math.floor(L*A.height);u===void 0&&(u=f(C,y));let P=S?f(C,y):u;return P.width=C,P.height=y,P.getContext("2d").drawImage(M,0,0,C,y),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+C+"x"+y+")."),P}return"data"in M&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),M}return M}function m(M){return M.generateMipmaps}function g(M){i.generateMipmap(M)}function v(M){return M.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:M.isWebGL3DRenderTarget?i.TEXTURE_3D:M.isWebGLArrayRenderTarget||M.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function x(M,S,N,L,A=!1){if(M!==null){if(i[M]!==void 0)return i[M];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+M+"'")}let C=S;if(S===i.RED&&(N===i.FLOAT&&(C=i.R32F),N===i.HALF_FLOAT&&(C=i.R16F),N===i.UNSIGNED_BYTE&&(C=i.R8)),S===i.RED_INTEGER&&(N===i.UNSIGNED_BYTE&&(C=i.R8UI),N===i.UNSIGNED_SHORT&&(C=i.R16UI),N===i.UNSIGNED_INT&&(C=i.R32UI),N===i.BYTE&&(C=i.R8I),N===i.SHORT&&(C=i.R16I),N===i.INT&&(C=i.R32I)),S===i.RG&&(N===i.FLOAT&&(C=i.RG32F),N===i.HALF_FLOAT&&(C=i.RG16F),N===i.UNSIGNED_BYTE&&(C=i.RG8)),S===i.RG_INTEGER&&(N===i.UNSIGNED_BYTE&&(C=i.RG8UI),N===i.UNSIGNED_SHORT&&(C=i.RG16UI),N===i.UNSIGNED_INT&&(C=i.RG32UI),N===i.BYTE&&(C=i.RG8I),N===i.SHORT&&(C=i.RG16I),N===i.INT&&(C=i.RG32I)),S===i.RGB_INTEGER&&(N===i.UNSIGNED_BYTE&&(C=i.RGB8UI),N===i.UNSIGNED_SHORT&&(C=i.RGB16UI),N===i.UNSIGNED_INT&&(C=i.RGB32UI),N===i.BYTE&&(C=i.RGB8I),N===i.SHORT&&(C=i.RGB16I),N===i.INT&&(C=i.RGB32I)),S===i.RGBA_INTEGER&&(N===i.UNSIGNED_BYTE&&(C=i.RGBA8UI),N===i.UNSIGNED_SHORT&&(C=i.RGBA16UI),N===i.UNSIGNED_INT&&(C=i.RGBA32UI),N===i.BYTE&&(C=i.RGBA8I),N===i.SHORT&&(C=i.RGBA16I),N===i.INT&&(C=i.RGBA32I)),S===i.RGB&&N===i.UNSIGNED_INT_5_9_9_9_REV&&(C=i.RGB9_E5),S===i.RGBA){let y=A?da:st.getTransfer(L);N===i.FLOAT&&(C=i.RGBA32F),N===i.HALF_FLOAT&&(C=i.RGBA16F),N===i.UNSIGNED_BYTE&&(C=y===pt?i.SRGB8_ALPHA8:i.RGBA8),N===i.UNSIGNED_SHORT_4_4_4_4&&(C=i.RGBA4),N===i.UNSIGNED_SHORT_5_5_5_1&&(C=i.RGB5_A1)}return C!==i.R16F&&C!==i.R32F&&C!==i.RG16F&&C!==i.RG32F&&C!==i.RGBA16F&&C!==i.RGBA32F||e.get("EXT_color_buffer_float"),C}function b(M,S){let N;return M?S===null||S===Li||S===dr?N=i.DEPTH24_STENCIL8:S===Yn?N=i.DEPTH32F_STENCIL8:S===kr&&(N=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Li||S===dr?N=i.DEPTH_COMPONENT24:S===Yn?N=i.DEPTH_COMPONENT32F:S===kr&&(N=i.DEPTH_COMPONENT16),N}function E(M,S){return m(M)===!0||M.isFramebufferTexture&&M.minFilter!==An&&M.minFilter!==qn?Math.log2(Math.max(S.width,S.height))+1:M.mipmaps!==void 0&&M.mipmaps.length>0?M.mipmaps.length:M.isCompressedTexture&&Array.isArray(M.image)?S.mipmaps.length:1}function w(M){let S=M.target;S.removeEventListener("dispose",w),(function(N){let L=n.get(N);if(L.__webglInit===void 0)return;let A=N.source,C=p.get(A);if(C){let y=C[L.__cacheKey];y.usedTimes--,y.usedTimes===0&&V(N),Object.keys(C).length===0&&p.delete(A)}n.remove(N)})(S),S.isVideoTexture&&h.delete(S)}function F(M){let S=M.target;S.removeEventListener("dispose",F),(function(N){let L=n.get(N);if(N.depthTexture&&(N.depthTexture.dispose(),n.remove(N.depthTexture)),N.isWebGLCubeRenderTarget)for(let C=0;C<6;C++){if(Array.isArray(L.__webglFramebuffer[C]))for(let y=0;y<L.__webglFramebuffer[C].length;y++)i.deleteFramebuffer(L.__webglFramebuffer[C][y]);else i.deleteFramebuffer(L.__webglFramebuffer[C]);L.__webglDepthbuffer&&i.deleteRenderbuffer(L.__webglDepthbuffer[C])}else{if(Array.isArray(L.__webglFramebuffer))for(let C=0;C<L.__webglFramebuffer.length;C++)i.deleteFramebuffer(L.__webglFramebuffer[C]);else i.deleteFramebuffer(L.__webglFramebuffer);if(L.__webglDepthbuffer&&i.deleteRenderbuffer(L.__webglDepthbuffer),L.__webglMultisampledFramebuffer&&i.deleteFramebuffer(L.__webglMultisampledFramebuffer),L.__webglColorRenderbuffer)for(let C=0;C<L.__webglColorRenderbuffer.length;C++)L.__webglColorRenderbuffer[C]&&i.deleteRenderbuffer(L.__webglColorRenderbuffer[C]);L.__webglDepthRenderbuffer&&i.deleteRenderbuffer(L.__webglDepthRenderbuffer)}let A=N.textures;for(let C=0,y=A.length;C<y;C++){let P=n.get(A[C]);P.__webglTexture&&(i.deleteTexture(P.__webglTexture),o.memory.textures--),n.remove(A[C])}n.remove(N)})(S)}function V(M){let S=n.get(M);i.deleteTexture(S.__webglTexture);let N=M.source;delete p.get(N)[S.__cacheKey],o.memory.textures--}let U=0;function j(M,S){let N=n.get(M);if(M.isVideoTexture&&(function(L){let A=o.render.frame;h.get(L)!==A&&(h.set(L,A),L.update())})(M),M.isRenderTargetTexture===!1&&M.version>0&&N.__version!==M.version){let L=M.image;if(L===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else{if(L.complete!==!1)return void le(N,M,S);console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete")}}t.bindTexture(i.TEXTURE_2D,N.__webglTexture,i.TEXTURE0+S)}let Y={[Br]:i.REPEAT,[zr]:i.CLAMP_TO_EDGE,[ao]:i.MIRRORED_REPEAT},q={[An]:i.NEAREST,[ou]:i.NEAREST_MIPMAP_NEAREST,[as]:i.NEAREST_MIPMAP_LINEAR,[qn]:i.LINEAR,[Sa]:i.LINEAR_MIPMAP_NEAREST,[sr]:i.LINEAR_MIPMAP_LINEAR},Z={[lu]:i.NEVER,[mu]:i.ALWAYS,[cu]:i.LESS,[uu]:i.LEQUAL,[hu]:i.EQUAL,[fu]:i.GEQUAL,[du]:i.GREATER,[pu]:i.NOTEQUAL};function K(M,S){if(S.type!==Yn||e.has("OES_texture_float_linear")!==!1||S.magFilter!==qn&&S.magFilter!==Sa&&S.magFilter!==as&&S.magFilter!==sr&&S.minFilter!==qn&&S.minFilter!==Sa&&S.minFilter!==as&&S.minFilter!==sr||console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(M,i.TEXTURE_WRAP_S,Y[S.wrapS]),i.texParameteri(M,i.TEXTURE_WRAP_T,Y[S.wrapT]),M!==i.TEXTURE_3D&&M!==i.TEXTURE_2D_ARRAY||i.texParameteri(M,i.TEXTURE_WRAP_R,Y[S.wrapR]),i.texParameteri(M,i.TEXTURE_MAG_FILTER,q[S.magFilter]),i.texParameteri(M,i.TEXTURE_MIN_FILTER,q[S.minFilter]),S.compareFunction&&(i.texParameteri(M,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(M,i.TEXTURE_COMPARE_FUNC,Z[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===An||S.minFilter!==as&&S.minFilter!==sr||S.type===Yn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){let N=e.get("EXT_texture_filter_anisotropic");i.texParameterf(M,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,r.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function ce(M,S){let N=!1;M.__webglInit===void 0&&(M.__webglInit=!0,S.addEventListener("dispose",w));let L=S.source,A=p.get(L);A===void 0&&(A={},p.set(L,A));let C=(function(y){let P=[];return P.push(y.wrapS),P.push(y.wrapT),P.push(y.wrapR||0),P.push(y.magFilter),P.push(y.minFilter),P.push(y.anisotropy),P.push(y.internalFormat),P.push(y.format),P.push(y.type),P.push(y.generateMipmaps),P.push(y.premultiplyAlpha),P.push(y.flipY),P.push(y.unpackAlignment),P.push(y.colorSpace),P.join()})(S);if(C!==M.__cacheKey){A[C]===void 0&&(A[C]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,N=!0),A[C].usedTimes++;let y=A[M.__cacheKey];y!==void 0&&(A[M.__cacheKey].usedTimes--,y.usedTimes===0&&V(S)),M.__cacheKey=C,M.__webglTexture=A[C].texture}return N}function le(M,S,N){let L=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(L=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(L=i.TEXTURE_3D);let A=ce(M,S),C=S.source;t.bindTexture(L,M.__webglTexture,i.TEXTURE0+N);let y=n.get(C);if(C.version!==y.__version||A===!0){t.activeTexture(i.TEXTURE0+N);let P=st.getPrimaries(st.workingColorSpace),O=S.colorSpace===ir?null:st.getPrimaries(S.colorSpace),Q=S.colorSpace===ir||P===O?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);let k=_(S.image,!1,r.maxTextureSize);k=W(S,k);let te=s.convert(S.format,S.colorSpace),J=s.convert(S.type),X,ge=x(S.internalFormat,te,J,S.colorSpace,S.isVideoTexture);K(L,S);let ue=S.mipmaps,ae=S.isVideoTexture!==!0,me=y.__version===void 0||A===!0,Ae=C.dataReady,Re=E(S,k);if(S.isDepthTexture)ge=b(S.format===pr,S.type),me&&(ae?t.texStorage2D(i.TEXTURE_2D,1,ge,k.width,k.height):t.texImage2D(i.TEXTURE_2D,0,ge,k.width,k.height,0,te,J,null));else if(S.isDataTexture)if(ue.length>0){ae&&me&&t.texStorage2D(i.TEXTURE_2D,Re,ge,ue[0].width,ue[0].height);for(let ye=0,Ue=ue.length;ye<Ue;ye++)X=ue[ye],ae?Ae&&t.texSubImage2D(i.TEXTURE_2D,ye,0,0,X.width,X.height,te,J,X.data):t.texImage2D(i.TEXTURE_2D,ye,ge,X.width,X.height,0,te,J,X.data);S.generateMipmaps=!1}else ae?(me&&t.texStorage2D(i.TEXTURE_2D,Re,ge,k.width,k.height),Ae&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,k.width,k.height,te,J,k.data)):t.texImage2D(i.TEXTURE_2D,0,ge,k.width,k.height,0,te,J,k.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){ae&&me&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Re,ge,ue[0].width,ue[0].height,k.depth);for(let ye=0,Ue=ue.length;ye<Ue;ye++)if(X=ue[ye],S.format!==On)if(te!==null)if(ae){if(Ae)if(S.layerUpdates.size>0){let He=zc(X.width,X.height,S.format,S.type);for(let Ye of S.layerUpdates){let Ce=X.data.subarray(Ye*He/X.data.BYTES_PER_ELEMENT,(Ye+1)*He/X.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ye,0,0,Ye,X.width,X.height,1,te,Ce)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ye,0,0,0,X.width,X.height,k.depth,te,X.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ye,ge,X.width,X.height,k.depth,0,X.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ae?Ae&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ye,0,0,0,X.width,X.height,k.depth,te,J,X.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ye,ge,X.width,X.height,k.depth,0,te,J,X.data)}else{ae&&me&&t.texStorage2D(i.TEXTURE_2D,Re,ge,ue[0].width,ue[0].height);for(let ye=0,Ue=ue.length;ye<Ue;ye++)X=ue[ye],S.format!==On?te!==null?ae?Ae&&t.compressedTexSubImage2D(i.TEXTURE_2D,ye,0,0,X.width,X.height,te,X.data):t.compressedTexImage2D(i.TEXTURE_2D,ye,ge,X.width,X.height,0,X.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ae?Ae&&t.texSubImage2D(i.TEXTURE_2D,ye,0,0,X.width,X.height,te,J,X.data):t.texImage2D(i.TEXTURE_2D,ye,ge,X.width,X.height,0,te,J,X.data)}else if(S.isDataArrayTexture)if(ae){if(me&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Re,ge,k.width,k.height,k.depth),Ae)if(S.layerUpdates.size>0){let ye=zc(k.width,k.height,S.format,S.type);for(let Ue of S.layerUpdates){let He=k.data.subarray(Ue*ye/k.data.BYTES_PER_ELEMENT,(Ue+1)*ye/k.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Ue,k.width,k.height,1,te,J,He)}S.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,k.width,k.height,k.depth,te,J,k.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ge,k.width,k.height,k.depth,0,te,J,k.data);else if(S.isData3DTexture)ae?(me&&t.texStorage3D(i.TEXTURE_3D,Re,ge,k.width,k.height,k.depth),Ae&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,k.width,k.height,k.depth,te,J,k.data)):t.texImage3D(i.TEXTURE_3D,0,ge,k.width,k.height,k.depth,0,te,J,k.data);else if(S.isFramebufferTexture){if(me)if(ae)t.texStorage2D(i.TEXTURE_2D,Re,ge,k.width,k.height);else{let ye=k.width,Ue=k.height;for(let He=0;He<Re;He++)t.texImage2D(i.TEXTURE_2D,He,ge,ye,Ue,0,te,J,null),ye>>=1,Ue>>=1}}else if(ue.length>0){if(ae&&me){let ye=H(ue[0]);t.texStorage2D(i.TEXTURE_2D,Re,ge,ye.width,ye.height)}for(let ye=0,Ue=ue.length;ye<Ue;ye++)X=ue[ye],ae?Ae&&t.texSubImage2D(i.TEXTURE_2D,ye,0,0,te,J,X):t.texImage2D(i.TEXTURE_2D,ye,ge,te,J,X);S.generateMipmaps=!1}else if(ae){if(me){let ye=H(k);t.texStorage2D(i.TEXTURE_2D,Re,ge,ye.width,ye.height)}Ae&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,te,J,k)}else t.texImage2D(i.TEXTURE_2D,0,ge,te,J,k);m(S)&&g(L),y.__version=C.version,S.onUpdate&&S.onUpdate(S)}M.__version=S.version}function pe(M,S,N,L,A,C){let y=s.convert(N.format,N.colorSpace),P=s.convert(N.type),O=x(N.internalFormat,y,P,N.colorSpace),Q=n.get(S),k=n.get(N);if(k.__renderTarget=S,!Q.__hasExternalTextures){let te=Math.max(1,S.width>>C),J=Math.max(1,S.height>>C);A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY?t.texImage3D(A,C,O,te,J,S.depth,0,y,P,null):t.texImage2D(A,C,O,te,J,0,y,P,null)}t.bindFramebuffer(i.FRAMEBUFFER,M),G(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,L,A,k.__webglTexture,0,B(S)):(A===i.TEXTURE_2D||A>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&A<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,L,A,k.__webglTexture,C),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ie(M,S,N){if(i.bindRenderbuffer(i.RENDERBUFFER,M),S.depthBuffer){let L=S.depthTexture,A=L&&L.isDepthTexture?L.type:null,C=b(S.stencilBuffer,A),y=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,P=B(S);G(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,P,C,S.width,S.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,P,C,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,C,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,y,i.RENDERBUFFER,M)}else{let L=S.textures;for(let A=0;A<L.length;A++){let C=L[A],y=s.convert(C.format,C.colorSpace),P=s.convert(C.type),O=x(C.internalFormat,y,P,C.colorSpace),Q=B(S);N&&G(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Q,O,S.width,S.height):G(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Q,O,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,O,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ve(M){let S=n.get(M),N=M.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==M.depthTexture){let L=M.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),L){let A=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,L.removeEventListener("dispose",A)};L.addEventListener("dispose",A),S.__depthDisposeCallback=A}S.__boundDepthTexture=L}if(M.depthTexture&&!S.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");(function(L,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,L),!A.depthTexture||!A.depthTexture.isDepthTexture)throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let C=n.get(A.depthTexture);C.__renderTarget=A,C.__webglTexture&&A.depthTexture.image.width===A.width&&A.depthTexture.image.height===A.height||(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),j(A.depthTexture,0);let y=C.__webglTexture,P=B(A);if(A.depthTexture.format===Vr)G(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,y,0,P):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,y,0);else{if(A.depthTexture.format!==pr)throw new Error("Unknown depthTexture format");G(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,y,0,P):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,y,0)}})(S.__webglFramebuffer,M)}else if(N){S.__webglDepthbuffer=[];for(let L=0;L<6;L++)if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[L]),S.__webglDepthbuffer[L]===void 0)S.__webglDepthbuffer[L]=i.createRenderbuffer(),ie(S.__webglDepthbuffer[L],M,!1);else{let A=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,C=S.__webglDepthbuffer[L];i.bindRenderbuffer(i.RENDERBUFFER,C),i.framebufferRenderbuffer(i.FRAMEBUFFER,A,i.RENDERBUFFER,C)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),ie(S.__webglDepthbuffer,M,!1);else{let L=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,A=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,A),i.framebufferRenderbuffer(i.FRAMEBUFFER,L,i.RENDERBUFFER,A)}t.bindFramebuffer(i.FRAMEBUFFER,null)}let I=[],T=[];function B(M){return Math.min(r.maxSamples,M.samples)}function G(M){let S=n.get(M);return M.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function W(M,S){let N=M.colorSpace,L=M.format,A=M.type;return M.isCompressedTexture===!0||M.isVideoTexture===!0||N!==yr&&N!==ir&&(st.getTransfer(N)===pt?L===On&&A===hi||console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",N)),S}function H(M){return typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement?(c.width=M.naturalWidth||M.width,c.height=M.naturalHeight||M.height):typeof VideoFrame<"u"&&M instanceof VideoFrame?(c.width=M.displayWidth,c.height=M.displayHeight):(c.width=M.width,c.height=M.height),c}this.allocateTextureUnit=function(){let M=U;return M>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+M+" texture units while this GPU supports only "+r.maxTextures),U+=1,M},this.resetTextureUnits=function(){U=0},this.setTexture2D=j,this.setTexture2DArray=function(M,S){let N=n.get(M);M.version>0&&N.__version!==M.version?le(N,M,S):t.bindTexture(i.TEXTURE_2D_ARRAY,N.__webglTexture,i.TEXTURE0+S)},this.setTexture3D=function(M,S){let N=n.get(M);M.version>0&&N.__version!==M.version?le(N,M,S):t.bindTexture(i.TEXTURE_3D,N.__webglTexture,i.TEXTURE0+S)},this.setTextureCube=function(M,S){let N=n.get(M);M.version>0&&N.__version!==M.version?(function(L,A,C){if(A.image.length!==6)return;let y=ce(L,A),P=A.source;t.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+C);let O=n.get(P);if(P.version!==O.__version||y===!0){t.activeTexture(i.TEXTURE0+C);let Q=st.getPrimaries(st.workingColorSpace),k=A.colorSpace===ir?null:st.getPrimaries(A.colorSpace),te=A.colorSpace===ir||Q===k?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let J=A.isCompressedTexture||A.image[0].isCompressedTexture,X=A.image[0]&&A.image[0].isDataTexture,ge=[];for(let Ce=0;Ce<6;Ce++)ge[Ce]=J||X?X?A.image[Ce].image:A.image[Ce]:_(A.image[Ce],!0,r.maxCubemapSize),ge[Ce]=W(A,ge[Ce]);let ue=ge[0],ae=s.convert(A.format,A.colorSpace),me=s.convert(A.type),Ae=x(A.internalFormat,ae,me,A.colorSpace),Re=A.isVideoTexture!==!0,ye=O.__version===void 0||y===!0,Ue=P.dataReady,He,Ye=E(A,ue);if(K(i.TEXTURE_CUBE_MAP,A),J){Re&&ye&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ye,Ae,ue.width,ue.height);for(let Ce=0;Ce<6;Ce++){He=ge[Ce].mipmaps;for(let We=0;We<He.length;We++){let $e=He[We];A.format!==On?ae!==null?Re?Ue&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,We,0,0,$e.width,$e.height,ae,$e.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,We,Ae,$e.width,$e.height,0,$e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Re?Ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,We,0,0,$e.width,$e.height,ae,me,$e.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,We,Ae,$e.width,$e.height,0,ae,me,$e.data)}}}else{if(He=A.mipmaps,Re&&ye){He.length>0&&Ye++;let Ce=H(ge[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ye,Ae,Ce.width,Ce.height)}for(let Ce=0;Ce<6;Ce++)if(X){Re?Ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,0,0,0,ge[Ce].width,ge[Ce].height,ae,me,ge[Ce].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,0,Ae,ge[Ce].width,ge[Ce].height,0,ae,me,ge[Ce].data);for(let We=0;We<He.length;We++){let $e=He[We].image[Ce].image;Re?Ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,We+1,0,0,$e.width,$e.height,ae,me,$e.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,We+1,Ae,$e.width,$e.height,0,ae,me,$e.data)}}else{Re?Ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,0,0,0,ae,me,ge[Ce]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,0,Ae,ae,me,ge[Ce]);for(let We=0;We<He.length;We++){let $e=He[We];Re?Ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,We+1,0,0,ae,me,$e.image[Ce]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,We+1,Ae,ae,me,$e.image[Ce])}}}m(A)&&g(i.TEXTURE_CUBE_MAP),O.__version=P.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version})(N,M,S):t.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+S)},this.rebindTextures=function(M,S,N){let L=n.get(M);S!==void 0&&pe(L.__webglFramebuffer,M,M.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),N!==void 0&&ve(M)},this.setupRenderTarget=function(M){let S=M.texture,N=n.get(M),L=n.get(S);M.addEventListener("dispose",F);let A=M.textures,C=M.isWebGLCubeRenderTarget===!0,y=A.length>1;if(y||(L.__webglTexture===void 0&&(L.__webglTexture=i.createTexture()),L.__version=S.version,o.memory.textures++),C){N.__webglFramebuffer=[];for(let P=0;P<6;P++)if(S.mipmaps&&S.mipmaps.length>0){N.__webglFramebuffer[P]=[];for(let O=0;O<S.mipmaps.length;O++)N.__webglFramebuffer[P][O]=i.createFramebuffer()}else N.__webglFramebuffer[P]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){N.__webglFramebuffer=[];for(let P=0;P<S.mipmaps.length;P++)N.__webglFramebuffer[P]=i.createFramebuffer()}else N.__webglFramebuffer=i.createFramebuffer();if(y)for(let P=0,O=A.length;P<O;P++){let Q=n.get(A[P]);Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture(),o.memory.textures++)}if(M.samples>0&&G(M)===!1){N.__webglMultisampledFramebuffer=i.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let P=0;P<A.length;P++){let O=A[P];N.__webglColorRenderbuffer[P]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,N.__webglColorRenderbuffer[P]);let Q=s.convert(O.format,O.colorSpace),k=s.convert(O.type),te=x(O.internalFormat,Q,k,O.colorSpace,M.isXRRenderTarget===!0),J=B(M);i.renderbufferStorageMultisample(i.RENDERBUFFER,J,te,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+P,i.RENDERBUFFER,N.__webglColorRenderbuffer[P])}i.bindRenderbuffer(i.RENDERBUFFER,null),M.depthBuffer&&(N.__webglDepthRenderbuffer=i.createRenderbuffer(),ie(N.__webglDepthRenderbuffer,M,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(C){t.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture),K(i.TEXTURE_CUBE_MAP,S);for(let P=0;P<6;P++)if(S.mipmaps&&S.mipmaps.length>0)for(let O=0;O<S.mipmaps.length;O++)pe(N.__webglFramebuffer[P][O],M,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+P,O);else pe(N.__webglFramebuffer[P],M,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+P,0);m(S)&&g(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(y){for(let P=0,O=A.length;P<O;P++){let Q=A[P],k=n.get(Q);t.bindTexture(i.TEXTURE_2D,k.__webglTexture),K(i.TEXTURE_2D,Q),pe(N.__webglFramebuffer,M,Q,i.COLOR_ATTACHMENT0+P,i.TEXTURE_2D,0),m(Q)&&g(i.TEXTURE_2D)}t.unbindTexture()}else{let P=i.TEXTURE_2D;if((M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(P=M.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(P,L.__webglTexture),K(P,S),S.mipmaps&&S.mipmaps.length>0)for(let O=0;O<S.mipmaps.length;O++)pe(N.__webglFramebuffer[O],M,S,i.COLOR_ATTACHMENT0,P,O);else pe(N.__webglFramebuffer,M,S,i.COLOR_ATTACHMENT0,P,0);m(S)&&g(P),t.unbindTexture()}M.depthBuffer&&ve(M)},this.updateRenderTargetMipmap=function(M){let S=M.textures;for(let N=0,L=S.length;N<L;N++){let A=S[N];if(m(A)){let C=v(M),y=n.get(A).__webglTexture;t.bindTexture(C,y),g(C),t.unbindTexture()}}},this.updateMultisampleRenderTarget=function(M){if(M.samples>0){if(G(M)===!1){let S=M.textures,N=M.width,L=M.height,A=i.COLOR_BUFFER_BIT,C=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,y=n.get(M),P=S.length>1;if(P)for(let O=0;O<S.length;O++)t.bindFramebuffer(i.FRAMEBUFFER,y.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+O,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+O,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,y.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,y.__webglFramebuffer);for(let O=0;O<S.length;O++){if(M.resolveDepthBuffer&&(M.depthBuffer&&(A|=i.DEPTH_BUFFER_BIT),M.stencilBuffer&&M.resolveStencilBuffer&&(A|=i.STENCIL_BUFFER_BIT)),P){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,y.__webglColorRenderbuffer[O]);let Q=n.get(S[O]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Q,0)}i.blitFramebuffer(0,0,N,L,0,0,N,L,A,i.NEAREST),l===!0&&(I.length=0,T.length=0,I.push(i.COLOR_ATTACHMENT0+O),M.depthBuffer&&M.resolveDepthBuffer===!1&&(I.push(C),T.push(C),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,T)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,I))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),P)for(let O=0;O<S.length;O++){t.bindFramebuffer(i.FRAMEBUFFER,y.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+O,i.RENDERBUFFER,y.__webglColorRenderbuffer[O]);let Q=n.get(S[O]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+O,i.TEXTURE_2D,Q,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,y.__webglMultisampledFramebuffer)}else if(M.depthBuffer&&M.resolveDepthBuffer===!1&&l){let S=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}},this.setupDepthRenderbuffer=ve,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=G}function np(i,e){return{convert:function(t,n=""){let r,s=st.getTransfer(n);if(t===hi)return i.UNSIGNED_BYTE;if(t===Il)return i.UNSIGNED_SHORT_4_4_4_4;if(t===Dl)return i.UNSIGNED_SHORT_5_5_5_1;if(t===nh)return i.UNSIGNED_INT_5_9_9_9_REV;if(t===eh)return i.BYTE;if(t===th)return i.SHORT;if(t===kr)return i.UNSIGNED_SHORT;if(t===Ll)return i.INT;if(t===Li)return i.UNSIGNED_INT;if(t===Yn)return i.FLOAT;if(t===$r)return i.HALF_FLOAT;if(t===ih)return i.ALPHA;if(t===rh)return i.RGB;if(t===On)return i.RGBA;if(t===sh)return i.LUMINANCE;if(t===ah)return i.LUMINANCE_ALPHA;if(t===Vr)return i.DEPTH_COMPONENT;if(t===pr)return i.DEPTH_STENCIL;if(t===oh)return i.RED;if(t===Ul)return i.RED_INTEGER;if(t===lh)return i.RG;if(t===Nl)return i.RG_INTEGER;if(t===Ol)return i.RGBA_INTEGER;if(t===Us||t===Ns||t===Os||t===Fs)if(s===pt){if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r===null)return null;if(t===Us)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(t===Ns)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(t===Os)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(t===Fs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else{if(r=e.get("WEBGL_compressed_texture_s3tc"),r===null)return null;if(t===Us)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(t===Ns)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(t===Os)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(t===Fs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}if(t===oo||t===lo||t===co||t===ho){if(r=e.get("WEBGL_compressed_texture_pvrtc"),r===null)return null;if(t===oo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(t===lo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(t===co)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(t===ho)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}if(t===uo||t===po||t===fo){if(r=e.get("WEBGL_compressed_texture_etc"),r===null)return null;if(t===uo||t===po)return s===pt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(t===fo)return s===pt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}if(t===mo||t===go||t===vo||t===_o||t===xo||t===yo||t===Mo||t===bo||t===So||t===wo||t===Eo||t===To||t===Ao||t===Ro){if(r=e.get("WEBGL_compressed_texture_astc"),r===null)return null;if(t===mo)return s===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(t===go)return s===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(t===vo)return s===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(t===_o)return s===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(t===xo)return s===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(t===yo)return s===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(t===Mo)return s===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(t===bo)return s===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(t===So)return s===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(t===wo)return s===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(t===Eo)return s===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(t===To)return s===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(t===Ao)return s===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(t===Ro)return s===pt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}if(t===Bs||t===Co||t===Po){if(r=e.get("EXT_texture_compression_bptc"),r===null)return null;if(t===Bs)return s===pt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(t===Co)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(t===Po)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}if(t===ch||t===Lo||t===Io||t===Do){if(r=e.get("EXT_texture_compression_rgtc"),r===null)return null;if(t===Bs)return r.COMPRESSED_RED_RGTC1_EXT;if(t===Lo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(t===Io)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(t===Do)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}return t===dr?i.UNSIGNED_INT_24_8:i[t]!==void 0?i[t]:null}}}var Zo=class extends rn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},Fn=class extends Rn{constructor(){super(),this.isGroup=!0,this.type="Group"}},ip={type:"move"},Nr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Fn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Fn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Fn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,n),g=this._getHandJoint(c,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],p=h.position.distanceTo(u.position),d=.02,f=.005;c.inputState.pinching&&p>d+f?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&p<=d-f&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(ip)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Fn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Ko=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let r=new mn;e.properties.get(r).__webglTexture=t.texture,t.depthNear==n.depthNear&&t.depthFar==n.depthFar||(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new sn({vertexShader:`
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

}`,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ut(new di(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Jo=class extends Kn{constructor(e,t){super();let n=this,r=null,s=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,p=null,d=null,f=null,_=new Ko,m=t.getContextAttributes(),g=null,v=null,x=[],b=[],E=new fe,w=null,F=new rn;F.viewport=new yt;let V=new rn;V.viewport=new yt;let U=[F,V],j=new Zo,Y=null,q=null;function Z(T){let B=b.indexOf(T.inputSource);if(B===-1)return;let G=x[B];G!==void 0&&(G.update(T.inputSource,T.frame,c||o),G.dispatchEvent({type:T.type,data:T.inputSource}))}function K(){r.removeEventListener("select",Z),r.removeEventListener("selectstart",Z),r.removeEventListener("selectend",Z),r.removeEventListener("squeeze",Z),r.removeEventListener("squeezestart",Z),r.removeEventListener("squeezeend",Z),r.removeEventListener("end",K),r.removeEventListener("inputsourceschange",ce);for(let T=0;T<x.length;T++){let B=b[T];B!==null&&(b[T]=null,x[T].disconnect(B))}Y=null,q=null,_.reset(),e.setRenderTarget(g),d=null,p=null,u=null,r=null,v=null,I.stop(),n.isPresenting=!1,e.setPixelRatio(w),e.setSize(E.width,E.height,!1),n.dispatchEvent({type:"sessionend"})}function ce(T){for(let B=0;B<T.removed.length;B++){let G=T.removed[B],W=b.indexOf(G);W>=0&&(b[W]=null,x[W].disconnect(G))}for(let B=0;B<T.added.length;B++){let G=T.added[B],W=b.indexOf(G);if(W===-1){for(let M=0;M<x.length;M++){if(M>=b.length){b.push(G),W=M;break}if(b[M]===null){b[M]=G,W=M;break}}if(W===-1)break}let H=x[W];H&&H.connect(G)}}this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(T){let B=x[T];return B===void 0&&(B=new Nr,x[T]=B),B.getTargetRaySpace()},this.getControllerGrip=function(T){let B=x[T];return B===void 0&&(B=new Nr,x[T]=B),B.getGripSpace()},this.getHand=function(T){let B=x[T];return B===void 0&&(B=new Nr,x[T]=B),B.getHandSpace()},this.setFramebufferScaleFactor=function(T){s=T,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(T){a=T,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(T){c=T},this.getBaseLayer=function(){return p!==null?p:d},this.getBinding=function(){return u},this.getFrame=function(){return f},this.getSession=function(){return r},this.setSession=async function(T){if(r=T,r!==null){if(g=e.getRenderTarget(),r.addEventListener("select",Z),r.addEventListener("selectstart",Z),r.addEventListener("selectend",Z),r.addEventListener("squeeze",Z),r.addEventListener("squeezestart",Z),r.addEventListener("squeezeend",Z),r.addEventListener("end",K),r.addEventListener("inputsourceschange",ce),m.xrCompatible!==!0&&await t.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(E),r.renderState.layers===void 0){let B={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,t,B),r.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new vn(d.framebufferWidth,d.framebufferHeight,{format:On,type:hi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let B=null,G=null,W=null;m.depth&&(W=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,B=m.stencil?pr:Vr,G=m.stencil?dr:Li);let H={colorFormat:t.RGBA8,depthFormat:W,scaleFactor:s};u=new XRWebGLBinding(r,t),p=u.createProjectionLayer(H),r.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),v=new vn(p.textureWidth,p.textureHeight,{format:On,type:hi,depthTexture:new Ys(p.textureWidth,p.textureHeight,G,void 0,void 0,void 0,void 0,void 0,void 0,B),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),I.setContext(r),I.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};let le=new D,pe=new D;function ie(T,B){B===null?T.matrixWorld.copy(T.matrix):T.matrixWorld.multiplyMatrices(B.matrixWorld,T.matrix),T.matrixWorldInverse.copy(T.matrixWorld).invert()}this.updateCamera=function(T){if(r===null)return;let B=T.near,G=T.far;_.texture!==null&&(_.depthNear>0&&(B=_.depthNear),_.depthFar>0&&(G=_.depthFar)),j.near=V.near=F.near=B,j.far=V.far=F.far=G,Y===j.near&&q===j.far||(r.updateRenderState({depthNear:j.near,depthFar:j.far}),Y=j.near,q=j.far),F.layers.mask=2|T.layers.mask,V.layers.mask=4|T.layers.mask,j.layers.mask=F.layers.mask|V.layers.mask;let W=T.parent,H=j.cameras;ie(j,W);for(let M=0;M<H.length;M++)ie(H[M],W);H.length===2?(function(M,S,N){le.setFromMatrixPosition(S.matrixWorld),pe.setFromMatrixPosition(N.matrixWorld);let L=le.distanceTo(pe),A=S.projectionMatrix.elements,C=N.projectionMatrix.elements,y=A[14]/(A[10]-1),P=A[14]/(A[10]+1),O=(A[9]+1)/A[5],Q=(A[9]-1)/A[5],k=(A[8]-1)/A[0],te=(C[8]+1)/C[0],J=y*k,X=y*te,ge=L/(-k+te),ue=ge*-k;if(S.matrixWorld.decompose(M.position,M.quaternion,M.scale),M.translateX(ue),M.translateZ(ge),M.matrixWorld.compose(M.position,M.quaternion,M.scale),M.matrixWorldInverse.copy(M.matrixWorld).invert(),A[10]===-1)M.projectionMatrix.copy(S.projectionMatrix),M.projectionMatrixInverse.copy(S.projectionMatrixInverse);else{let ae=y+ge,me=P+ge,Ae=J-ue,Re=X+(L-ue),ye=O*P/me*ae,Ue=Q*P/me*ae;M.projectionMatrix.makePerspective(Ae,Re,ye,Ue,ae,me),M.projectionMatrixInverse.copy(M.projectionMatrix).invert()}})(j,F,V):j.projectionMatrix.copy(F.projectionMatrix),(function(M,S,N){N===null?M.matrix.copy(S.matrixWorld):(M.matrix.copy(N.matrixWorld),M.matrix.invert(),M.matrix.multiply(S.matrixWorld)),M.matrix.decompose(M.position,M.quaternion,M.scale),M.updateMatrixWorld(!0),M.projectionMatrix.copy(S.projectionMatrix),M.projectionMatrixInverse.copy(S.projectionMatrixInverse),M.isPerspectiveCamera&&(M.fov=2*Hr*Math.atan(1/M.projectionMatrix.elements[5]),M.zoom=1)})(T,j,W)},this.getCamera=function(){return j},this.getFoveation=function(){if(p!==null||d!==null)return l},this.setFoveation=function(T){l=T,p!==null&&(p.fixedFoveation=T),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=T)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(j)};let ve=null,I=new ph;I.setAnimationLoop((function(T,B){if(h=B.getViewerPose(c||o),f=B,h!==null){let G=h.views;d!==null&&(e.setRenderTargetFramebuffer(v,d.framebuffer),e.setRenderTarget(v));let W=!1;G.length!==j.cameras.length&&(j.cameras.length=0,W=!0);for(let M=0;M<G.length;M++){let S=G[M],N=null;if(d!==null)N=d.getViewport(S);else{let A=u.getViewSubImage(p,S);N=A.viewport,M===0&&(e.setRenderTargetTextures(v,A.colorTexture,p.ignoreDepthValues?void 0:A.depthStencilTexture),e.setRenderTarget(v))}let L=U[M];L===void 0&&(L=new rn,L.layers.enable(M),L.viewport=new yt,U[M]=L),L.matrix.fromArray(S.transform.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale),L.projectionMatrix.fromArray(S.projectionMatrix),L.projectionMatrixInverse.copy(L.projectionMatrix).invert(),L.viewport.set(N.x,N.y,N.width,N.height),M===0&&(j.matrix.copy(L.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale)),W===!0&&j.cameras.push(L)}let H=r.enabledFeatures;if(H&&H.includes("depth-sensing")){let M=u.getDepthInformation(G[0]);M&&M.isValid&&M.texture&&_.init(e,M,r.renderState)}}for(let G=0;G<x.length;G++){let W=b[G],H=x[G];W!==null&&H!==void 0&&H.update(W,B,c||o)}ve&&ve(T,B),B.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:B}),f=null})),this.setAnimationLoop=function(T){ve=T},this.dispose=function(){}}},Ti=new zn,rp=new Xe;function sp(i,e){function t(r,s){r.matrixAutoUpdate===!0&&r.updateMatrix(),s.value.copy(r.matrix)}function n(r,s){r.opacity.value=s.opacity,s.color&&r.diffuse.value.copy(s.color),s.emissive&&r.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity),s.map&&(r.map.value=s.map,t(s.map,r.mapTransform)),s.alphaMap&&(r.alphaMap.value=s.alphaMap,t(s.alphaMap,r.alphaMapTransform)),s.bumpMap&&(r.bumpMap.value=s.bumpMap,t(s.bumpMap,r.bumpMapTransform),r.bumpScale.value=s.bumpScale,s.side===1&&(r.bumpScale.value*=-1)),s.normalMap&&(r.normalMap.value=s.normalMap,t(s.normalMap,r.normalMapTransform),r.normalScale.value.copy(s.normalScale),s.side===1&&r.normalScale.value.negate()),s.displacementMap&&(r.displacementMap.value=s.displacementMap,t(s.displacementMap,r.displacementMapTransform),r.displacementScale.value=s.displacementScale,r.displacementBias.value=s.displacementBias),s.emissiveMap&&(r.emissiveMap.value=s.emissiveMap,t(s.emissiveMap,r.emissiveMapTransform)),s.specularMap&&(r.specularMap.value=s.specularMap,t(s.specularMap,r.specularMapTransform)),s.alphaTest>0&&(r.alphaTest.value=s.alphaTest);let o=e.get(s),a=o.envMap,l=o.envMapRotation;a&&(r.envMap.value=a,Ti.copy(l),Ti.x*=-1,Ti.y*=-1,Ti.z*=-1,a.isCubeTexture&&a.isRenderTargetTexture===!1&&(Ti.y*=-1,Ti.z*=-1),r.envMapRotation.value.setFromMatrix4(rp.makeRotationFromEuler(Ti)),r.flipEnvMap.value=a.isCubeTexture&&a.isRenderTargetTexture===!1?-1:1,r.reflectivity.value=s.reflectivity,r.ior.value=s.ior,r.refractionRatio.value=s.refractionRatio),s.lightMap&&(r.lightMap.value=s.lightMap,r.lightMapIntensity.value=s.lightMapIntensity,t(s.lightMap,r.lightMapTransform)),s.aoMap&&(r.aoMap.value=s.aoMap,r.aoMapIntensity.value=s.aoMapIntensity,t(s.aoMap,r.aoMapTransform))}return{refreshFogUniforms:function(r,s){s.color.getRGB(r.fogColor.value,dh(i)),s.isFog?(r.fogNear.value=s.near,r.fogFar.value=s.far):s.isFogExp2&&(r.fogDensity.value=s.density)},refreshMaterialUniforms:function(r,s,o,a,l){s.isMeshBasicMaterial||s.isMeshLambertMaterial?n(r,s):s.isMeshToonMaterial?(n(r,s),(function(c,h){h.gradientMap&&(c.gradientMap.value=h.gradientMap)})(r,s)):s.isMeshPhongMaterial?(n(r,s),(function(c,h){c.specular.value.copy(h.specular),c.shininess.value=Math.max(h.shininess,1e-4)})(r,s)):s.isMeshStandardMaterial?(n(r,s),(function(c,h){c.metalness.value=h.metalness,h.metalnessMap&&(c.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,c.metalnessMapTransform)),c.roughness.value=h.roughness,h.roughnessMap&&(c.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,c.roughnessMapTransform)),h.envMap&&(c.envMapIntensity.value=h.envMapIntensity)})(r,s),s.isMeshPhysicalMaterial&&(function(c,h,u){c.ior.value=h.ior,h.sheen>0&&(c.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),c.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(c.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,c.sheenColorMapTransform)),h.sheenRoughnessMap&&(c.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,c.sheenRoughnessMapTransform))),h.clearcoat>0&&(c.clearcoat.value=h.clearcoat,c.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(c.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,c.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(c.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,c.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(c.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,c.clearcoatNormalMapTransform),c.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===1&&c.clearcoatNormalScale.value.negate())),h.dispersion>0&&(c.dispersion.value=h.dispersion),h.iridescence>0&&(c.iridescence.value=h.iridescence,c.iridescenceIOR.value=h.iridescenceIOR,c.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],c.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(c.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,c.iridescenceMapTransform)),h.iridescenceThicknessMap&&(c.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,c.iridescenceThicknessMapTransform))),h.transmission>0&&(c.transmission.value=h.transmission,c.transmissionSamplerMap.value=u.texture,c.transmissionSamplerSize.value.set(u.width,u.height),h.transmissionMap&&(c.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,c.transmissionMapTransform)),c.thickness.value=h.thickness,h.thicknessMap&&(c.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,c.thicknessMapTransform)),c.attenuationDistance.value=h.attenuationDistance,c.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(c.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(c.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,c.anisotropyMapTransform))),c.specularIntensity.value=h.specularIntensity,c.specularColor.value.copy(h.specularColor),h.specularColorMap&&(c.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,c.specularColorMapTransform)),h.specularIntensityMap&&(c.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,c.specularIntensityMapTransform))})(r,s,l)):s.isMeshMatcapMaterial?(n(r,s),(function(c,h){h.matcap&&(c.matcap.value=h.matcap)})(r,s)):s.isMeshDepthMaterial?n(r,s):s.isMeshDistanceMaterial?(n(r,s),(function(c,h){let u=e.get(h).light;c.referencePosition.value.setFromMatrixPosition(u.matrixWorld),c.nearDistance.value=u.shadow.camera.near,c.farDistance.value=u.shadow.camera.far})(r,s)):s.isMeshNormalMaterial?n(r,s):s.isLineBasicMaterial?((function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform))})(r,s),s.isLineDashedMaterial&&(function(c,h){c.dashSize.value=h.dashSize,c.totalSize.value=h.dashSize+h.gapSize,c.scale.value=h.scale})(r,s)):s.isPointsMaterial?(function(c,h,u,p){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.size.value=h.size*u,c.scale.value=.5*p,h.map&&(c.map.value=h.map,t(h.map,c.uvTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)})(r,s,o,a):s.isSpriteMaterial?(function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.rotation.value=h.rotation,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)})(r,s):s.isShadowMaterial?(r.color.value.copy(s.color),r.opacity.value=s.opacity):s.isShaderMaterial&&(s.uniformsNeedUpdate=!1)}}}function ap(i,e,t,n){let r={},s={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(u,p,d,f){let _=u.value,m=p+"_"+d;if(f[m]===void 0)return f[m]=typeof _=="number"||typeof _=="boolean"?_:_.clone(),!0;{let g=f[m];if(typeof _=="number"||typeof _=="boolean"){if(g!==_)return f[m]=_,!0}else if(g.equals(_)===!1)return g.copy(_),!0}return!1}function c(u){let p={boundary:0,storage:0};return typeof u=="number"||typeof u=="boolean"?(p.boundary=4,p.storage=4):u.isVector2?(p.boundary=8,p.storage=8):u.isVector3||u.isColor?(p.boundary=16,p.storage=12):u.isVector4?(p.boundary=16,p.storage=16):u.isMatrix3?(p.boundary=48,p.storage=48):u.isMatrix4?(p.boundary=64,p.storage=64):u.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",u),p}function h(u){let p=u.target;p.removeEventListener("dispose",h);let d=o.indexOf(p.__bindingPointIndex);o.splice(d,1),i.deleteBuffer(r[p.id]),delete r[p.id],delete s[p.id]}return{bind:function(u,p){let d=p.program;n.uniformBlockBinding(u,d)},update:function(u,p){let d=r[u.id];d===void 0&&((function(m){let g=m.uniforms,v=0,x=16;for(let E=0,w=g.length;E<w;E++){let F=Array.isArray(g[E])?g[E]:[g[E]];for(let V=0,U=F.length;V<U;V++){let j=F[V],Y=Array.isArray(j.value)?j.value:[j.value];for(let q=0,Z=Y.length;q<Z;q++){let K=c(Y[q]),ce=v%x,le=ce%K.boundary,pe=ce+le;v+=le,pe!==0&&x-pe<K.storage&&(v+=x-pe),j.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),j.__offset=v,v+=K.storage}}}let b=v%x;b>0&&(v+=x-b),m.__size=v,m.__cache={}})(u),d=(function(m){let g=(function(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0})();m.__bindingPointIndex=g;let v=i.createBuffer(),x=m.__size,b=m.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,x,b),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,g,v),v})(u),r[u.id]=d,u.addEventListener("dispose",h));let f=p.program;n.updateUBOMapping(u,f);let _=e.render.frame;s[u.id]!==_&&((function(m){let g=r[m.id],v=m.uniforms,x=m.__cache;i.bindBuffer(i.UNIFORM_BUFFER,g);for(let b=0,E=v.length;b<E;b++){let w=Array.isArray(v[b])?v[b]:[v[b]];for(let F=0,V=w.length;F<V;F++){let U=w[F];if(l(U,b,F,x)===!0){let j=U.__offset,Y=Array.isArray(U.value)?U.value:[U.value],q=0;for(let Z=0;Z<Y.length;Z++){let K=Y[Z],ce=c(K);typeof K=="number"||typeof K=="boolean"?(U.__data[0]=K,i.bufferSubData(i.UNIFORM_BUFFER,j+q,U.__data)):K.isMatrix3?(U.__data[0]=K.elements[0],U.__data[1]=K.elements[1],U.__data[2]=K.elements[2],U.__data[3]=0,U.__data[4]=K.elements[3],U.__data[5]=K.elements[4],U.__data[6]=K.elements[5],U.__data[7]=0,U.__data[8]=K.elements[6],U.__data[9]=K.elements[7],U.__data[10]=K.elements[8],U.__data[11]=0):(K.toArray(U.__data,q),q+=ce.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,j,U.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)})(u),s[u.id]=_)},dispose:function(){for(let u in r)i.deleteBuffer(r[u]);o=[],r={},s={}}}}var Zs=class{constructor(e={}){let{canvas:t=gu(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:p=!1}=e,d;if(this.isWebGLRenderer=!0,n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;let f=new Uint32Array(4),_=new Int32Array(4),m=null,g=null,v=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=cn,this.toneMapping=0,this.toneMappingExposure=1;let b=this,E=!1,w=0,F=0,V=null,U=-1,j=null,Y=new yt,q=new yt,Z=null,K=new je(0),ce=0,le=t.width,pe=t.height,ie=1,ve=null,I=null,T=new yt(0,0,le,pe),B=new yt(0,0,le,pe),G=!1,W=new Wr,H=!1,M=!1,S=new Xe,N=new Xe,L=new D,A=new yt,C={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},y=!1;function P(){return V===null?ie:1}let O,Q,k,te,J,X,ge,ue,ae,me,Ae,Re,ye,Ue,He,Ye,Ce,We,$e,qt,Mt,ot,Nt,In,$=n;function yn(R,ee){return t.getContext(R,ee)}try{let R={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r170"),t.addEventListener("webglcontextlost",xi,!1),t.addEventListener("webglcontextrestored",bt,!1),t.addEventListener("webglcontextcreationerror",es,!1),$===null){let ee="webgl2";if($=yn(ee,R),$===null)throw yn(ee)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}function Er(){O=new Vu($),O.init(),ot=new np($,O),Q=new Fu($,O,e,ot),k=new ep($,O),Q.reverseDepthBuffer&&p&&k.buffers.depth.setReversed(!0),te=new Wu($),J=new Wd,X=new tp($,O,k,J,Q,ot,te),ge=new zu(b),ue=new ku(b),ae=new Iu($),Nt=new Nu($,ae),me=new Hu($,ae,te,Nt),Ae=new Xu($,me,ae,te),$e=new ju($,Q,X),Ye=new Bu(J),Re=new Gd(b,ge,ue,O,Q,Nt,Ye),ye=new sp(b,J),Ue=new Xd,He=new Jd(O),We=new Uu(b,ge,ue,k,Ae,d,l),Ce=new $d(b,Ae,Q),In=new ap($,te,Q,k),qt=new Ou($,O,te),Mt=new Gu($,O,te),te.programs=Re.programs,b.capabilities=Q,b.extensions=O,b.properties=J,b.renderLists=Ue,b.shadowMap=Ce,b.state=k,b.info=te}Er();let Tt=new Jo(b,$);function xi(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function bt(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;let R=te.autoReset,ee=Ce.enabled,se=Ce.autoUpdate,de=Ce.needsUpdate,ne=Ce.type;Er(),te.autoReset=R,Ce.enabled=ee,Ce.autoUpdate=se,Ce.needsUpdate=de,Ce.type=ne}function es(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function ts(R){let ee=R.target;ee.removeEventListener("dispose",ts),(function(se){(function(de){let ne=J.get(de).programs;ne!==void 0&&(ne.forEach((function(_e){Re.releaseProgram(_e)})),de.isShaderMaterial&&Re.releaseShaderCache(de))})(se),J.remove(se)})(ee)}function ns(R,ee,se){R.transparent===!0&&R.side===2&&R.forceSinglePass===!1?(R.side=1,R.needsUpdate=!0,Hi(R,ee,se),R.side=0,R.needsUpdate=!0,Hi(R,ee,se),R.side=2):Hi(R,ee,se)}this.xr=Tt,this.getContext=function(){return $},this.getContextAttributes=function(){return $.getContextAttributes()},this.forceContextLoss=function(){let R=O.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){let R=O.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(R){R!==void 0&&(ie=R,this.setSize(le,pe,!1))},this.getSize=function(R){return R.set(le,pe)},this.setSize=function(R,ee,se=!0){Tt.isPresenting?console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting."):(le=R,pe=ee,t.width=Math.floor(R*ie),t.height=Math.floor(ee*ie),se===!0&&(t.style.width=R+"px",t.style.height=ee+"px"),this.setViewport(0,0,R,ee))},this.getDrawingBufferSize=function(R){return R.set(le*ie,pe*ie).floor()},this.setDrawingBufferSize=function(R,ee,se){le=R,pe=ee,ie=se,t.width=Math.floor(R*se),t.height=Math.floor(ee*se),this.setViewport(0,0,R,ee)},this.getCurrentViewport=function(R){return R.copy(Y)},this.getViewport=function(R){return R.copy(T)},this.setViewport=function(R,ee,se,de){R.isVector4?T.set(R.x,R.y,R.z,R.w):T.set(R,ee,se,de),k.viewport(Y.copy(T).multiplyScalar(ie).round())},this.getScissor=function(R){return R.copy(B)},this.setScissor=function(R,ee,se,de){R.isVector4?B.set(R.x,R.y,R.z,R.w):B.set(R,ee,se,de),k.scissor(q.copy(B).multiplyScalar(ie).round())},this.getScissorTest=function(){return G},this.setScissorTest=function(R){k.setScissorTest(G=R)},this.setOpaqueSort=function(R){ve=R},this.setTransparentSort=function(R){I=R},this.getClearColor=function(R){return R.copy(We.getClearColor())},this.setClearColor=function(){We.setClearColor.apply(We,arguments)},this.getClearAlpha=function(){return We.getClearAlpha()},this.setClearAlpha=function(){We.setClearAlpha.apply(We,arguments)},this.clear=function(R=!0,ee=!0,se=!0){let de=0;if(R){let ne=!1;if(V!==null){let _e=V.texture.format;ne=_e===Ol||_e===Nl||_e===Ul}if(ne){let _e=V.texture.type,Pe=_e===hi||_e===Li||_e===kr||_e===dr||_e===Il||_e===Dl,Ie=We.getClearColor(),Oe=We.getClearAlpha(),ze=Ie.r,ke=Ie.g,Fe=Ie.b;Pe?(f[0]=ze,f[1]=ke,f[2]=Fe,f[3]=Oe,$.clearBufferuiv($.COLOR,0,f)):(_[0]=ze,_[1]=ke,_[2]=Fe,_[3]=Oe,$.clearBufferiv($.COLOR,0,_))}else de|=$.COLOR_BUFFER_BIT}ee&&(de|=$.DEPTH_BUFFER_BIT),se&&(de|=$.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),$.clear(de)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",xi,!1),t.removeEventListener("webglcontextrestored",bt,!1),t.removeEventListener("webglcontextcreationerror",es,!1),Ue.dispose(),He.dispose(),J.dispose(),ge.dispose(),ue.dispose(),Ae.dispose(),Nt.dispose(),In.dispose(),Re.dispose(),Tt.dispose(),Tt.removeEventListener("sessionstart",is),Tt.removeEventListener("sessionend",an),Dn.stop()},this.renderBufferDirect=function(R,ee,se,de,ne,_e){ee===null&&(ee=C);let Pe=ne.isMesh&&ne.matrixWorld.determinant()<0,Ie=(function(Qe,Wt,Ot,qe,Ve){Wt.isScene!==!0&&(Wt=C),X.resetTextureUnits();let Yt=Wt.fog,ti=qe.isMeshStandardMaterial?Wt.environment:null,Un=V===null?b.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:yr,on=(qe.isMeshStandardMaterial?ue:ge).get(qe.envMap||ti),z=qe.vertexColors===!0&&!!Ot.attributes.color&&Ot.attributes.color.itemSize===4,oe=!!Ot.attributes.tangent&&(!!qe.normalMap||qe.anisotropy>0),Me=!!Ot.morphAttributes.position,re=!!Ot.morphAttributes.normal,Le=!!Ot.morphAttributes.color,he=0;qe.toneMapped&&(V!==null&&V.isXRRenderTarget!==!0||(he=b.toneMapping));let be=Ot.morphAttributes.position||Ot.morphAttributes.normal||Ot.morphAttributes.color,Se=be!==void 0?be.length:0,we=J.get(qe),Ne=g.state.lights;if(H===!0&&(M===!0||Qe!==j)){let Kt=Qe===j&&qe.id===U;Ye.setState(qe,Qe,Kt)}let xe=!1;qe.version===we.__version?we.needsLights&&we.lightsStateVersion!==Ne.state.version||we.outputColorSpace!==Un||Ve.isBatchedMesh&&we.batching===!1?xe=!0:Ve.isBatchedMesh||we.batching!==!0?Ve.isBatchedMesh&&we.batchingColor===!0&&Ve.colorTexture===null||Ve.isBatchedMesh&&we.batchingColor===!1&&Ve.colorTexture!==null||Ve.isInstancedMesh&&we.instancing===!1?xe=!0:Ve.isInstancedMesh||we.instancing!==!0?Ve.isSkinnedMesh&&we.skinning===!1?xe=!0:Ve.isSkinnedMesh||we.skinning!==!0?Ve.isInstancedMesh&&we.instancingColor===!0&&Ve.instanceColor===null||Ve.isInstancedMesh&&we.instancingColor===!1&&Ve.instanceColor!==null||Ve.isInstancedMesh&&we.instancingMorph===!0&&Ve.morphTexture===null||Ve.isInstancedMesh&&we.instancingMorph===!1&&Ve.morphTexture!==null||we.envMap!==on||qe.fog===!0&&we.fog!==Yt?xe=!0:we.numClippingPlanes===void 0||we.numClippingPlanes===Ye.numPlanes&&we.numIntersection===Ye.numIntersection?(we.vertexAlphas!==z||we.vertexTangents!==oe||we.morphTargets!==Me||we.morphNormals!==re||we.morphColors!==Le||we.toneMapping!==he||we.morphTargetsCount!==Se)&&(xe=!0):xe=!0:xe=!0:xe=!0:xe=!0:(xe=!0,we.__version=qe.version);let Be=we.currentProgram;xe===!0&&(Be=Hi(qe,Wt,Ve));let At=!1,tt=!1,Rt=!1,nt=Be.getUniforms(),St=we.uniforms;if(k.useProgram(Be.program)&&(At=!0,tt=!0,Rt=!0),qe.id!==U&&(U=qe.id,tt=!0),At||j!==Qe){k.buffers.depth.getReversed()?(S.copy(Qe.projectionMatrix),(function(bn){let dt=bn.elements;dt[2]=.5*dt[2]+.5*dt[3],dt[6]=.5*dt[6]+.5*dt[7],dt[10]=.5*dt[10]+.5*dt[11],dt[14]=.5*dt[14]+.5*dt[15]})(S),(function(bn){let dt=bn.elements;dt[11]===-1?(dt[10]=-dt[10]-1,dt[14]=-dt[14]):(dt[10]=-dt[10],dt[14]=1-dt[14])})(S),nt.setValue($,"projectionMatrix",S)):nt.setValue($,"projectionMatrix",Qe.projectionMatrix),nt.setValue($,"viewMatrix",Qe.matrixWorldInverse);let Kt=nt.map.cameraPosition;Kt!==void 0&&Kt.setValue($,L.setFromMatrixPosition(Qe.matrixWorld)),Q.logarithmicDepthBuffer&&nt.setValue($,"logDepthBufFC",2/(Math.log(Qe.far+1)/Math.LN2)),(qe.isMeshPhongMaterial||qe.isMeshToonMaterial||qe.isMeshLambertMaterial||qe.isMeshBasicMaterial||qe.isMeshStandardMaterial||qe.isShaderMaterial)&&nt.setValue($,"isOrthographic",Qe.isOrthographicCamera===!0),j!==Qe&&(j=Qe,tt=!0,Rt=!0)}if(Ve.isSkinnedMesh){nt.setOptional($,Ve,"bindMatrix"),nt.setOptional($,Ve,"bindMatrixInverse");let Kt=Ve.skeleton;Kt&&(Kt.boneTexture===null&&Kt.computeBoneTexture(),nt.setValue($,"boneTexture",Kt.boneTexture,X))}Ve.isBatchedMesh&&(nt.setOptional($,Ve,"batchingTexture"),nt.setValue($,"batchingTexture",Ve._matricesTexture,X),nt.setOptional($,Ve,"batchingIdTexture"),nt.setValue($,"batchingIdTexture",Ve._indirectTexture,X),nt.setOptional($,Ve,"batchingColorTexture"),Ve._colorsTexture!==null&&nt.setValue($,"batchingColorTexture",Ve._colorsTexture,X));let ln=Ot.morphAttributes;ln.position===void 0&&ln.normal===void 0&&ln.color===void 0||$e.update(Ve,Ot,Be),(tt||we.receiveShadow!==Ve.receiveShadow)&&(we.receiveShadow=Ve.receiveShadow,nt.setValue($,"receiveShadow",Ve.receiveShadow)),qe.isMeshGouraudMaterial&&qe.envMap!==null&&(St.envMap.value=on,St.flipEnvMap.value=on.isCubeTexture&&on.isRenderTargetTexture===!1?-1:1),qe.isMeshStandardMaterial&&qe.envMap===null&&Wt.environment!==null&&(St.envMapIntensity.value=Wt.environmentIntensity),tt&&(nt.setValue($,"toneMappingExposure",b.toneMappingExposure),we.needsLights&&(Zt=Rt,(jt=St).ambientLightColor.needsUpdate=Zt,jt.lightProbe.needsUpdate=Zt,jt.directionalLights.needsUpdate=Zt,jt.directionalLightShadows.needsUpdate=Zt,jt.pointLights.needsUpdate=Zt,jt.pointLightShadows.needsUpdate=Zt,jt.spotLights.needsUpdate=Zt,jt.spotLightShadows.needsUpdate=Zt,jt.rectAreaLights.needsUpdate=Zt,jt.hemisphereLights.needsUpdate=Zt),Yt&&qe.fog===!0&&ye.refreshFogUniforms(St,Yt),ye.refreshMaterialUniforms(St,qe,ie,pe,g.state.transmissionRenderTarget[Qe.id]),cr.upload($,Lt(we),St,X));var jt,Zt;if(qe.isShaderMaterial&&qe.uniformsNeedUpdate===!0&&(cr.upload($,Lt(we),St,X),qe.uniformsNeedUpdate=!1),qe.isSpriteMaterial&&nt.setValue($,"center",Ve.center),nt.setValue($,"modelViewMatrix",Ve.modelViewMatrix),nt.setValue($,"normalMatrix",Ve.normalMatrix),nt.setValue($,"modelMatrix",Ve.matrixWorld),qe.isShaderMaterial||qe.isRawShaderMaterial){let Kt=qe.uniformsGroups;for(let bn=0,dt=Kt.length;bn<dt;bn++){let Gi=Kt[bn];In.update(Gi,Be),In.bind(Gi,Be)}}return Be})(R,ee,se,de,ne);k.setMaterial(de,Pe);let Oe=se.index,ze=1;if(de.wireframe===!0){if(Oe=me.getWireframeAttribute(se),Oe===void 0)return;ze=2}let ke=se.drawRange,Fe=se.attributes.position,Je=ke.start*ze,xt=(ke.start+ke.count)*ze;_e!==null&&(Je=Math.max(Je,_e.start*ze),xt=Math.min(xt,(_e.start+_e.count)*ze)),Oe!==null?(Je=Math.max(Je,0),xt=Math.min(xt,Oe.count)):Fe!=null&&(Je=Math.max(Je,0),xt=Math.min(xt,Fe.count));let ht=xt-Je;if(ht<0||ht===1/0)return;let It;Nt.setup(ne,de,Ie,se,Oe);let ut=qt;if(Oe!==null&&(It=ae.get(Oe),ut=Mt,ut.setIndex(It)),ne.isMesh)de.wireframe===!0?(k.setLineWidth(de.wireframeLinewidth*P()),ut.setMode($.LINES)):ut.setMode($.TRIANGLES);else if(ne.isLine){let Qe=de.linewidth;Qe===void 0&&(Qe=1),k.setLineWidth(Qe*P()),ne.isLineSegments?ut.setMode($.LINES):ne.isLineLoop?ut.setMode($.LINE_LOOP):ut.setMode($.LINE_STRIP)}else ne.isPoints?ut.setMode($.POINTS):ne.isSprite&&ut.setMode($.TRIANGLES);if(ne.isBatchedMesh)if(ne._multiDrawInstances!==null)ut.renderMultiDrawInstances(ne._multiDrawStarts,ne._multiDrawCounts,ne._multiDrawCount,ne._multiDrawInstances);else if(O.get("WEBGL_multi_draw"))ut.renderMultiDraw(ne._multiDrawStarts,ne._multiDrawCounts,ne._multiDrawCount);else{let Qe=ne._multiDrawStarts,Wt=ne._multiDrawCounts,Ot=ne._multiDrawCount,qe=Oe?ae.get(Oe).bytesPerElement:1,Ve=J.get(de).currentProgram.getUniforms();for(let Yt=0;Yt<Ot;Yt++)Ve.setValue($,"_gl_DrawID",Yt),ut.render(Qe[Yt]/qe,Wt[Yt])}else if(ne.isInstancedMesh)ut.renderInstances(Je,ht,ne.count);else if(se.isInstancedBufferGeometry){let Qe=se._maxInstanceCount!==void 0?se._maxInstanceCount:1/0,Wt=Math.min(se.instanceCount,Qe);ut.renderInstances(Je,ht,Wt)}else ut.render(Je,ht)},this.compile=function(R,ee,se=null){se===null&&(se=R),g=He.get(se),g.init(ee),x.push(g),se.traverseVisible((function(ne){ne.isLight&&ne.layers.test(ee.layers)&&(g.pushLight(ne),ne.castShadow&&g.pushShadow(ne))})),R!==se&&R.traverseVisible((function(ne){ne.isLight&&ne.layers.test(ee.layers)&&(g.pushLight(ne),ne.castShadow&&g.pushShadow(ne))})),g.setupLights();let de=new Set;return R.traverse((function(ne){if(!(ne.isMesh||ne.isPoints||ne.isLine||ne.isSprite))return;let _e=ne.material;if(_e)if(Array.isArray(_e))for(let Pe=0;Pe<_e.length;Pe++){let Ie=_e[Pe];ns(Ie,se,ne),de.add(Ie)}else ns(_e,se,ne),de.add(_e)})),x.pop(),g=null,de},this.compileAsync=function(R,ee,se=null){let de=this.compile(R,ee,se);return new Promise((ne=>{function _e(){de.forEach((function(Pe){J.get(Pe).currentProgram.isReady()&&de.delete(Pe)})),de.size!==0?setTimeout(_e,10):ne(R)}O.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)}))};let en=null;function is(){Dn.stop()}function an(){Dn.start()}let Dn=new ph;function Mn(R,ee,se,de){if(R.visible===!1)return;if(R.layers.test(ee.layers)){if(R.isGroup)se=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(ee);else if(R.isLight)g.pushLight(R),R.castShadow&&g.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||W.intersectsSprite(R)){de&&A.setFromMatrixPosition(R.matrixWorld).applyMatrix4(N);let _e=Ae.update(R),Pe=R.material;Pe.visible&&m.push(R,_e,Pe,se,A.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||W.intersectsObject(R))){let _e=Ae.update(R),Pe=R.material;if(de&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),A.copy(R.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),A.copy(_e.boundingSphere.center)),A.applyMatrix4(R.matrixWorld).applyMatrix4(N)),Array.isArray(Pe)){let Ie=_e.groups;for(let Oe=0,ze=Ie.length;Oe<ze;Oe++){let ke=Ie[Oe],Fe=Pe[ke.materialIndex];Fe&&Fe.visible&&m.push(R,_e,Fe,se,A.z,ke)}}else Pe.visible&&m.push(R,_e,Pe,se,A.z,null)}}let ne=R.children;for(let _e=0,Pe=ne.length;_e<Pe;_e++)Mn(ne[_e],ee,se,de)}function yi(R,ee,se,de){let ne=R.opaque,_e=R.transmissive,Pe=R.transparent;g.setupLightsView(se),H===!0&&Ye.setGlobalState(b.clippingPlanes,se),de&&k.viewport(Y.copy(de)),ne.length>0&&ki(ne,ee,se),_e.length>0&&ki(_e,ee,se),Pe.length>0&&ki(Pe,ee,se),k.buffers.depth.setTest(!0),k.buffers.depth.setMask(!0),k.buffers.color.setMask(!0),k.setPolygonOffset(!1)}function Tr(R,ee,se,de){if((se.isScene===!0?se.overrideMaterial:null)!==null)return;g.state.transmissionRenderTarget[de.id]===void 0&&(g.state.transmissionRenderTarget[de.id]=new vn(1,1,{generateMipmaps:!0,type:O.has("EXT_color_buffer_half_float")||O.has("EXT_color_buffer_float")?$r:hi,minFilter:sr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:st.workingColorSpace}));let ne=g.state.transmissionRenderTarget[de.id],_e=de.viewport||Y;ne.setSize(_e.z,_e.w);let Pe=b.getRenderTarget();b.setRenderTarget(ne),b.getClearColor(K),ce=b.getClearAlpha(),ce<1&&b.setClearColor(16777215,.5),b.clear(),y&&We.render(se);let Ie=b.toneMapping;b.toneMapping=0;let Oe=de.viewport;if(de.viewport!==void 0&&(de.viewport=void 0),g.setupLightsView(de),H===!0&&Ye.setGlobalState(b.clippingPlanes,de),ki(R,se,de),X.updateMultisampleRenderTarget(ne),X.updateRenderTargetMipmap(ne),O.has("WEBGL_multisampled_render_to_texture")===!1){let ze=!1;for(let ke=0,Fe=ee.length;ke<Fe;ke++){let Je=ee[ke],xt=Je.object,ht=Je.geometry,It=Je.material,ut=Je.group;if(It.side===2&&xt.layers.test(de.layers)){let Qe=It.side;It.side=1,It.needsUpdate=!0,Vi(xt,se,de,ht,It,ut),It.side=Qe,It.needsUpdate=!0,ze=!0}}ze===!0&&(X.updateMultisampleRenderTarget(ne),X.updateRenderTargetMipmap(ne))}b.setRenderTarget(Pe),b.setClearColor(K,ce),Oe!==void 0&&(de.viewport=Oe),b.toneMapping=Ie}function ki(R,ee,se){let de=ee.isScene===!0?ee.overrideMaterial:null;for(let ne=0,_e=R.length;ne<_e;ne++){let Pe=R[ne],Ie=Pe.object,Oe=Pe.geometry,ze=de===null?Pe.material:de,ke=Pe.group;Ie.layers.test(se.layers)&&Vi(Ie,ee,se,Oe,ze,ke)}}function Vi(R,ee,se,de,ne,_e){R.onBeforeRender(b,ee,se,de,ne,_e),R.modelViewMatrix.multiplyMatrices(se.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),ne.onBeforeRender(b,ee,se,de,R,_e),ne.transparent===!0&&ne.side===2&&ne.forceSinglePass===!1?(ne.side=1,ne.needsUpdate=!0,b.renderBufferDirect(se,ee,de,ne,R,_e),ne.side=0,ne.needsUpdate=!0,b.renderBufferDirect(se,ee,de,ne,R,_e),ne.side=2):b.renderBufferDirect(se,ee,de,ne,R,_e),R.onAfterRender(b,ee,se,de,ne,_e)}function Hi(R,ee,se){ee.isScene!==!0&&(ee=C);let de=J.get(R),ne=g.state.lights,_e=g.state.shadowsArray,Pe=ne.state.version,Ie=Re.getParameters(R,ne.state,_e,ee,se),Oe=Re.getProgramCacheKey(Ie),ze=de.programs;de.environment=R.isMeshStandardMaterial?ee.environment:null,de.fog=ee.fog,de.envMap=(R.isMeshStandardMaterial?ue:ge).get(R.envMap||de.environment),de.envMapRotation=de.environment!==null&&R.envMap===null?ee.environmentRotation:R.envMapRotation,ze===void 0&&(R.addEventListener("dispose",ts),ze=new Map,de.programs=ze);let ke=ze.get(Oe);if(ke!==void 0){if(de.currentProgram===ke&&de.lightsStateVersion===Pe)return rs(R,Ie),ke}else Ie.uniforms=Re.getUniforms(R),R.onBeforeCompile(Ie,b),ke=Re.acquireProgram(Ie,Oe),ze.set(Oe,ke),de.uniforms=Ie.uniforms;let Fe=de.uniforms;return(R.isShaderMaterial||R.isRawShaderMaterial)&&R.clipping!==!0||(Fe.clippingPlanes=Ye.uniform),rs(R,Ie),de.needsLights=(function(Je){return Je.isMeshLambertMaterial||Je.isMeshToonMaterial||Je.isMeshPhongMaterial||Je.isMeshStandardMaterial||Je.isShadowMaterial||Je.isShaderMaterial&&Je.lights===!0})(R),de.lightsStateVersion=Pe,de.needsLights&&(Fe.ambientLightColor.value=ne.state.ambient,Fe.lightProbe.value=ne.state.probe,Fe.directionalLights.value=ne.state.directional,Fe.directionalLightShadows.value=ne.state.directionalShadow,Fe.spotLights.value=ne.state.spot,Fe.spotLightShadows.value=ne.state.spotShadow,Fe.rectAreaLights.value=ne.state.rectArea,Fe.ltc_1.value=ne.state.rectAreaLTC1,Fe.ltc_2.value=ne.state.rectAreaLTC2,Fe.pointLights.value=ne.state.point,Fe.pointLightShadows.value=ne.state.pointShadow,Fe.hemisphereLights.value=ne.state.hemi,Fe.directionalShadowMap.value=ne.state.directionalShadowMap,Fe.directionalShadowMatrix.value=ne.state.directionalShadowMatrix,Fe.spotShadowMap.value=ne.state.spotShadowMap,Fe.spotLightMatrix.value=ne.state.spotLightMatrix,Fe.spotLightMap.value=ne.state.spotLightMap,Fe.pointShadowMap.value=ne.state.pointShadowMap,Fe.pointShadowMatrix.value=ne.state.pointShadowMatrix),de.currentProgram=ke,de.uniformsList=null,ke}function Lt(R){if(R.uniformsList===null){let ee=R.currentProgram.getUniforms();R.uniformsList=cr.seqWithValue(ee.seq,R.uniforms)}return R.uniformsList}function rs(R,ee){let se=J.get(R);se.outputColorSpace=ee.outputColorSpace,se.batching=ee.batching,se.batchingColor=ee.batchingColor,se.instancing=ee.instancing,se.instancingColor=ee.instancingColor,se.instancingMorph=ee.instancingMorph,se.skinning=ee.skinning,se.morphTargets=ee.morphTargets,se.morphNormals=ee.morphNormals,se.morphColors=ee.morphColors,se.morphTargetsCount=ee.morphTargetsCount,se.numClippingPlanes=ee.numClippingPlanes,se.numIntersection=ee.numClipIntersection,se.vertexAlphas=ee.vertexAlphas,se.vertexTangents=ee.vertexTangents,se.toneMapping=ee.toneMapping}Dn.setAnimationLoop((function(R){en&&en(R)})),typeof self<"u"&&Dn.setContext(self),this.setAnimationLoop=function(R){en=R,Tt.setAnimationLoop(R),R===null?Dn.stop():Dn.start()},Tt.addEventListener("sessionstart",is),Tt.addEventListener("sessionend",an),this.render=function(R,ee){if(ee!==void 0&&ee.isCamera!==!0)return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");if(E===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),ee.parent===null&&ee.matrixWorldAutoUpdate===!0&&ee.updateMatrixWorld(),Tt.enabled===!0&&Tt.isPresenting===!0&&(Tt.cameraAutoUpdate===!0&&Tt.updateCamera(ee),ee=Tt.getCamera()),R.isScene===!0&&R.onBeforeRender(b,R,ee,V),g=He.get(R,x.length),g.init(ee),x.push(g),N.multiplyMatrices(ee.projectionMatrix,ee.matrixWorldInverse),W.setFromProjectionMatrix(N),M=this.localClippingEnabled,H=Ye.init(this.clippingPlanes,M),m=Ue.get(R,v.length),m.init(),v.push(m),Tt.enabled===!0&&Tt.isPresenting===!0){let _e=b.xr.getDepthSensingMesh();_e!==null&&Mn(_e,ee,-1/0,b.sortObjects)}Mn(R,ee,0,b.sortObjects),m.finish(),b.sortObjects===!0&&m.sort(ve,I),y=Tt.enabled===!1||Tt.isPresenting===!1||Tt.hasDepthSensing()===!1,y&&We.addToRenderList(m,R),this.info.render.frame++,H===!0&&Ye.beginShadows();let se=g.state.shadowsArray;Ce.render(se,R,ee),H===!0&&Ye.endShadows(),this.info.autoReset===!0&&this.info.reset();let de=m.opaque,ne=m.transmissive;if(g.setupLights(),ee.isArrayCamera){let _e=ee.cameras;if(ne.length>0)for(let Pe=0,Ie=_e.length;Pe<Ie;Pe++)Tr(de,ne,R,_e[Pe]);y&&We.render(R);for(let Pe=0,Ie=_e.length;Pe<Ie;Pe++){let Oe=_e[Pe];yi(m,R,Oe,Oe.viewport)}}else ne.length>0&&Tr(de,ne,R,ee),y&&We.render(R),yi(m,R,ee);V!==null&&(X.updateMultisampleRenderTarget(V),X.updateRenderTargetMipmap(V)),R.isScene===!0&&R.onAfterRender(b,R,ee),Nt.resetDefaultState(),U=-1,j=null,x.pop(),x.length>0?(g=x[x.length-1],H===!0&&Ye.setGlobalState(b.clippingPlanes,g.state.camera)):g=null,v.pop(),m=v.length>0?v[v.length-1]:null},this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return F},this.getRenderTarget=function(){return V},this.setRenderTargetTextures=function(R,ee,se){J.get(R.texture).__webglTexture=ee,J.get(R.depthTexture).__webglTexture=se;let de=J.get(R);de.__hasExternalTextures=!0,de.__autoAllocateDepthBuffer=se===void 0,de.__autoAllocateDepthBuffer||O.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),de.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(R,ee){let se=J.get(R);se.__webglFramebuffer=ee,se.__useDefaultFramebuffer=ee===void 0},this.setRenderTarget=function(R,ee=0,se=0){V=R,w=ee,F=se;let de=!0,ne=null,_e=!1,Pe=!1;if(R){let Ie=J.get(R);if(Ie.__useDefaultFramebuffer!==void 0)k.bindFramebuffer($.FRAMEBUFFER,null),de=!1;else if(Ie.__webglFramebuffer===void 0)X.setupRenderTarget(R);else if(Ie.__hasExternalTextures)X.rebindTextures(R,J.get(R.texture).__webglTexture,J.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){let ke=R.depthTexture;if(Ie.__boundDepthTexture!==ke){if(ke!==null&&J.has(ke)&&(R.width!==ke.image.width||R.height!==ke.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");X.setupDepthRenderbuffer(R)}}let Oe=R.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(Pe=!0);let ze=J.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(ne=Array.isArray(ze[ee])?ze[ee][se]:ze[ee],_e=!0):ne=R.samples>0&&X.useMultisampledRTT(R)===!1?J.get(R).__webglMultisampledFramebuffer:Array.isArray(ze)?ze[se]:ze,Y.copy(R.viewport),q.copy(R.scissor),Z=R.scissorTest}else Y.copy(T).multiplyScalar(ie).floor(),q.copy(B).multiplyScalar(ie).floor(),Z=G;if(k.bindFramebuffer($.FRAMEBUFFER,ne)&&de&&k.drawBuffers(R,ne),k.viewport(Y),k.scissor(q),k.setScissorTest(Z),_e){let Ie=J.get(R.texture);$.framebufferTexture2D($.FRAMEBUFFER,$.COLOR_ATTACHMENT0,$.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ie.__webglTexture,se)}else if(Pe){let Ie=J.get(R.texture),Oe=ee||0;$.framebufferTextureLayer($.FRAMEBUFFER,$.COLOR_ATTACHMENT0,Ie.__webglTexture,se||0,Oe)}U=-1},this.readRenderTargetPixels=function(R,ee,se,de,ne,_e,Pe){if(!R||!R.isWebGLRenderTarget)return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ie=J.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Pe!==void 0&&(Ie=Ie[Pe]),Ie){k.bindFramebuffer($.FRAMEBUFFER,Ie);try{let Oe=R.texture,ze=Oe.format,ke=Oe.type;if(!Q.textureFormatReadable(ze))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");if(!Q.textureTypeReadable(ke))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");ee>=0&&ee<=R.width-de&&se>=0&&se<=R.height-ne&&$.readPixels(ee,se,de,ne,ot.convert(ze),ot.convert(ke),_e)}finally{let Oe=V!==null?J.get(V).__webglFramebuffer:null;k.bindFramebuffer($.FRAMEBUFFER,Oe)}}},this.readRenderTargetPixelsAsync=async function(R,ee,se,de,ne,_e,Pe){if(!R||!R.isWebGLRenderTarget)throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ie=J.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Pe!==void 0&&(Ie=Ie[Pe]),Ie){let Oe=R.texture,ze=Oe.format,ke=Oe.type;if(!Q.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Q.textureTypeReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(ee>=0&&ee<=R.width-de&&se>=0&&se<=R.height-ne){k.bindFramebuffer($.FRAMEBUFFER,Ie);let Fe=$.createBuffer();$.bindBuffer($.PIXEL_PACK_BUFFER,Fe),$.bufferData($.PIXEL_PACK_BUFFER,_e.byteLength,$.STREAM_READ),$.readPixels(ee,se,de,ne,ot.convert(ze),ot.convert(ke),0);let Je=V!==null?J.get(V).__webglFramebuffer:null;k.bindFramebuffer($.FRAMEBUFFER,Je);let xt=$.fenceSync($.SYNC_GPU_COMMANDS_COMPLETE,0);return $.flush(),await(function(ht,It,ut){return new Promise((function(Qe,Wt){setTimeout((function Ot(){switch(ht.clientWaitSync(It,ht.SYNC_FLUSH_COMMANDS_BIT,0)){case ht.WAIT_FAILED:Wt();break;case ht.TIMEOUT_EXPIRED:setTimeout(Ot,ut);break;default:Qe()}}),ut)}))})($,xt,4),$.bindBuffer($.PIXEL_PACK_BUFFER,Fe),$.getBufferSubData($.PIXEL_PACK_BUFFER,0,_e),$.deleteBuffer(Fe),$.deleteSync(xt),_e}throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(R,ee=null,se=0){R.isTexture!==!0&&(Dr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),ee=arguments[0]||null,R=arguments[1]);let de=Math.pow(2,-se),ne=Math.floor(R.image.width*de),_e=Math.floor(R.image.height*de),Pe=ee!==null?ee.x:0,Ie=ee!==null?ee.y:0;X.setTexture2D(R,0),$.copyTexSubImage2D($.TEXTURE_2D,se,0,0,Pe,Ie,ne,_e),k.unbindTexture()},this.copyTextureToTexture=function(R,ee,se=null,de=null,ne=0){let _e,Pe,Ie,Oe,ze,ke,Fe,Je,xt;R.isTexture!==!0&&(Dr("WebGLRenderer: copyTextureToTexture function signature has changed."),de=arguments[0]||null,R=arguments[1],ee=arguments[2],ne=arguments[3]||0,se=null);let ht=R.isCompressedTexture?R.mipmaps[ne]:R.image;se!==null?(_e=se.max.x-se.min.x,Pe=se.max.y-se.min.y,Ie=se.isBox3?se.max.z-se.min.z:1,Oe=se.min.x,ze=se.min.y,ke=se.isBox3?se.min.z:0):(_e=ht.width,Pe=ht.height,Ie=ht.depth||1,Oe=0,ze=0,ke=0),de!==null?(Fe=de.x,Je=de.y,xt=de.z):(Fe=0,Je=0,xt=0);let It=ot.convert(ee.format),ut=ot.convert(ee.type),Qe;ee.isData3DTexture?(X.setTexture3D(ee,0),Qe=$.TEXTURE_3D):ee.isDataArrayTexture||ee.isCompressedArrayTexture?(X.setTexture2DArray(ee,0),Qe=$.TEXTURE_2D_ARRAY):(X.setTexture2D(ee,0),Qe=$.TEXTURE_2D),$.pixelStorei($.UNPACK_FLIP_Y_WEBGL,ee.flipY),$.pixelStorei($.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ee.premultiplyAlpha),$.pixelStorei($.UNPACK_ALIGNMENT,ee.unpackAlignment);let Wt=$.getParameter($.UNPACK_ROW_LENGTH),Ot=$.getParameter($.UNPACK_IMAGE_HEIGHT),qe=$.getParameter($.UNPACK_SKIP_PIXELS),Ve=$.getParameter($.UNPACK_SKIP_ROWS),Yt=$.getParameter($.UNPACK_SKIP_IMAGES);$.pixelStorei($.UNPACK_ROW_LENGTH,ht.width),$.pixelStorei($.UNPACK_IMAGE_HEIGHT,ht.height),$.pixelStorei($.UNPACK_SKIP_PIXELS,Oe),$.pixelStorei($.UNPACK_SKIP_ROWS,ze),$.pixelStorei($.UNPACK_SKIP_IMAGES,ke);let ti=R.isDataArrayTexture||R.isData3DTexture,Un=ee.isDataArrayTexture||ee.isData3DTexture;if(R.isRenderTargetTexture||R.isDepthTexture){let on=J.get(R),z=J.get(ee),oe=J.get(on.__renderTarget),Me=J.get(z.__renderTarget);k.bindFramebuffer($.READ_FRAMEBUFFER,oe.__webglFramebuffer),k.bindFramebuffer($.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let re=0;re<Ie;re++)ti&&$.framebufferTextureLayer($.READ_FRAMEBUFFER,$.COLOR_ATTACHMENT0,J.get(R).__webglTexture,ne,ke+re),R.isDepthTexture?(Un&&$.framebufferTextureLayer($.DRAW_FRAMEBUFFER,$.COLOR_ATTACHMENT0,J.get(ee).__webglTexture,ne,xt+re),$.blitFramebuffer(Oe,ze,_e,Pe,Fe,Je,_e,Pe,$.DEPTH_BUFFER_BIT,$.NEAREST)):Un?$.copyTexSubImage3D(Qe,ne,Fe,Je,xt+re,Oe,ze,_e,Pe):$.copyTexSubImage2D(Qe,ne,Fe,Je,xt+re,Oe,ze,_e,Pe);k.bindFramebuffer($.READ_FRAMEBUFFER,null),k.bindFramebuffer($.DRAW_FRAMEBUFFER,null)}else Un?R.isDataTexture||R.isData3DTexture?$.texSubImage3D(Qe,ne,Fe,Je,xt,_e,Pe,Ie,It,ut,ht.data):ee.isCompressedArrayTexture?$.compressedTexSubImage3D(Qe,ne,Fe,Je,xt,_e,Pe,Ie,It,ht.data):$.texSubImage3D(Qe,ne,Fe,Je,xt,_e,Pe,Ie,It,ut,ht):R.isDataTexture?$.texSubImage2D($.TEXTURE_2D,ne,Fe,Je,_e,Pe,It,ut,ht.data):R.isCompressedTexture?$.compressedTexSubImage2D($.TEXTURE_2D,ne,Fe,Je,ht.width,ht.height,It,ht.data):$.texSubImage2D($.TEXTURE_2D,ne,Fe,Je,_e,Pe,It,ut,ht);$.pixelStorei($.UNPACK_ROW_LENGTH,Wt),$.pixelStorei($.UNPACK_IMAGE_HEIGHT,Ot),$.pixelStorei($.UNPACK_SKIP_PIXELS,qe),$.pixelStorei($.UNPACK_SKIP_ROWS,Ve),$.pixelStorei($.UNPACK_SKIP_IMAGES,Yt),ne===0&&ee.generateMipmaps&&$.generateMipmap(Qe),k.unbindTexture()},this.copyTextureToTexture3D=function(R,ee,se=null,de=null,ne=0){return R.isTexture!==!0&&(Dr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),se=arguments[0]||null,de=arguments[1]||null,R=arguments[2],ee=arguments[3],ne=arguments[4]||0),Dr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(R,ee,se,de,ne)},this.initRenderTarget=function(R){J.get(R).__webglFramebuffer===void 0&&X.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?X.setTextureCube(R,0):R.isData3DTexture?X.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?X.setTexture2DArray(R,0):X.setTexture2D(R,0),k.unbindTexture()},this.resetState=function(){w=0,F=0,V=null,k.reset(),Nt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return fr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=st._getDrawingBufferColorSpace(e),t.unpackColorSpace=st._getUnpackColorSpace()}};var vr=class extends Rn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new zn,this.environmentIntensity=1,this.environmentRotation=new zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var df=new D;var pf=new D,ff=new D,mf=new D,gf=new fe,vf=new fe,_f=new Xe,xf=new D,yf=new D,Mf=new D,bf=new fe,Sf=new fe,wf=new fe;var Ef=new D,Tf=new D;var Af=new D,Rf=new yt,Cf=new yt,Pf=new D,Lf=new Xe,If=new D,Df=new Bn,Uf=new Xe,Nf=new Jn;var Of=new Xe,Ff=new Xe;var Bf=new Xe,zf=new Xe;var kf=new hn,Vf=new Xe,Hf=new Ut,Gf=new Bn;var $o=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,r){let s=this.pool,o=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});let a=s[this.index];o.push(a),this.index++,a.start=e,a.count=t,a.z=n,a.index=r}reset(){this.list.length=0,this.index=0}},Wf=new Xe,jf=new je(1,1,1),Xf=new Wr,qf=new hn,Yf=new Bn,Zf=new D,Kf=new D,Jf=new D,$f=new $o,Qf=new Ut;var em=new D,tm=new D,nm=new Xe,im=new Jn,rm=new Bn,sm=new D,am=new D;var om=new D,lm=new D;var cm=new Xe,hm=new Jn,um=new Bn,dm=new D;var Ks=class extends mn{constructor(e,t,n,r,s,o,a,l,c){super(e,t,n,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},_n=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),s+=n.distanceTo(r),t.push(s),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),r=0,s=n.length,o;o=t||e*n[s-1];let a,l=0,c=s-1;for(;l<=c;)if(r=Math.floor(l+(c-l)/2),a=n[r]-o,a<0)l=r+1;else{if(!(a>0)){c=r;break}c=r-1}if(r=c,n[r]===o)return r/(s-1);let h=n[r];return(r+(o-h)/(n[r+1]-h))/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);let o=this.getPoint(r),a=this.getPoint(s),l=t||(o.isVector2?new fe:new D);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new D,r=[],s=[],o=[],a=new D,l=new Xe;for(let d=0;d<=e;d++){let f=d/e;r[d]=this.getTangentAt(f,new D)}s[0]=new D,o[0]=new D;let c=Number.MAX_VALUE,h=Math.abs(r[0].x),u=Math.abs(r[0].y),p=Math.abs(r[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),p<=c&&n.set(0,0,1),a.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let d=1;d<=e;d++){if(s[d]=s[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(r[d-1],r[d]),a.length()>Number.EPSILON){a.normalize();let f=Math.acos(Bt(r[d-1].dot(r[d]),-1,1));s[d].applyMatrix4(l.makeRotationAxis(a,f))}o[d].crossVectors(r[d],s[d])}if(t===!0){let d=Math.acos(Bt(s[0].dot(s[e]),-1,1));d/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(d=-d);for(let f=1;f<=e;f++)s[f].applyMatrix4(l.makeRotationAxis(r[f],d*f)),o[f].crossVectors(r[f],s[f])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Xr=class extends _n{constructor(e=0,t=0,n=1,r=1,s=0,o=2*Math.PI,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new fe){let n=t,r=2*Math.PI,s=this.aEndAngle-this.aStartAngle,o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(s=o?0:r),this.aClockwise!==!0||o||(s===r?s=-r:s-=r);let a=this.aStartAngle+e*s,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),p=l-this.aX,d=c-this.aY;l=p*h-d*u+this.aX,c=p*u+d*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Qo=class extends Xr{constructor(e,t,n,r,s,o){super(e,t,n,n,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Bl(){let i=0,e=0,t=0,n=0;function r(s,o,a,l){i=s,e=a,t=-3*s+3*o-2*a-l,n=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){r(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,h,u){let p=(o-s)/c-(a-s)/(c+h)+(a-o)/h,d=(a-o)/h-(l-o)/(h+u)+(l-a)/u;p*=h,d*=h,r(o,a,p,d)},calc:function(s){let o=s*s;return i+e*s+t*o+n*(o*s)}}}var As=new D,Ja=new Bl,$a=new Bl,Qa=new Bl,Ui=class extends _n{constructor(e=[],t=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new D){let n=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e,a,l,c=Math.floor(o),h=o-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:h===0&&c===s-1&&(c=s-2,h=1),this.closed||c>0?a=r[(c-1)%s]:(As.subVectors(r[0],r[1]).add(r[0]),a=As);let u=r[c%s],p=r[(c+1)%s];if(this.closed||c+2<s?l=r[(c+2)%s]:(As.subVectors(r[s-1],r[s-2]).add(r[s-1]),l=As),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,f=Math.pow(a.distanceToSquared(u),d),_=Math.pow(u.distanceToSquared(p),d),m=Math.pow(p.distanceToSquared(l),d);_<1e-4&&(_=1),f<1e-4&&(f=_),m<1e-4&&(m=_),Ja.initNonuniformCatmullRom(a.x,u.x,p.x,l.x,f,_,m),$a.initNonuniformCatmullRom(a.y,u.y,p.y,l.y,f,_,m),Qa.initNonuniformCatmullRom(a.z,u.z,p.z,l.z,f,_,m)}else this.curveType==="catmullrom"&&(Ja.initCatmullRom(a.x,u.x,p.x,l.x,this.tension),$a.initCatmullRom(a.y,u.y,p.y,l.y,this.tension),Qa.initCatmullRom(a.z,u.z,p.z,l.z,this.tension));return n.set(Ja.calc(h),$a.calc(h),Qa.calc(h)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(new D().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function kc(i,e,t,n,r){let s=.5*(n-e),o=.5*(r-t),a=i*i;return(2*t-2*n+s+o)*(i*a)+(-3*t+3*n-2*s-o)*a+s*i+t}function Or(i,e,t,n){return(function(r,s){let o=1-r;return o*o*s})(i,e)+(function(r,s){return 2*(1-r)*r*s})(i,t)+(function(r,s){return r*r*s})(i,n)}function Fr(i,e,t,n,r){return(function(s,o){let a=1-s;return a*a*a*o})(i,e)+(function(s,o){let a=1-s;return 3*a*a*s*o})(i,t)+(function(s,o){return 3*(1-s)*s*s*o})(i,n)+(function(s,o){return s*s*s*o})(i,r)}var Js=class extends _n{constructor(e=new fe,t=new fe,n=new fe,r=new fe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new fe){let n=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(Fr(e,r.x,s.x,o.x,a.x),Fr(e,r.y,s.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},el=class extends _n{constructor(e=new D,t=new D,n=new D,r=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new D){let n=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(Fr(e,r.x,s.x,o.x,a.x),Fr(e,r.y,s.y,o.y,a.y),Fr(e,r.z,s.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},$s=class extends _n{constructor(e=new fe,t=new fe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new fe){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new fe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},tl=class extends _n{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Qs=class extends _n{constructor(e=new fe,t=new fe,n=new fe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new fe){let n=t,r=this.v0,s=this.v1,o=this.v2;return n.set(Or(e,r.x,s.x,o.x),Or(e,r.y,s.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ea=class extends _n{constructor(e=new D,t=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new D){let n=t,r=this.v0,s=this.v1,o=this.v2;return n.set(Or(e,r.x,s.x,o.x),Or(e,r.y,s.y,o.y),Or(e,r.z,s.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ta=class extends _n{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new fe){let n=t,r=this.points,s=(r.length-1)*e,o=Math.floor(s),a=s-o,l=r[o===0?o:o-1],c=r[o],h=r[o>r.length-2?r.length-1:o+1],u=r[o>r.length-3?r.length-1:o+2];return n.set(kc(a,l.x,c.x,h.x,u.x),kc(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(new fe().fromArray(r))}return this}},na=Object.freeze({__proto__:null,ArcCurve:Qo,CatmullRomCurve3:Ui,CubicBezierCurve:Js,CubicBezierCurve3:el,EllipseCurve:Xr,LineCurve:$s,LineCurve3:tl,QuadraticBezierCurve:Qs,QuadraticBezierCurve3:ea,SplineCurve:ta}),nl=class extends _n{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new na[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),s=0;for(;s<r.length;){if(r[s]>=n){let o=r[s]-n,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,s=this.curves;r<s.length;r++){let o=s[r],a=o.isEllipseCurve?2*e:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let r=e.curves[t];this.curves.push(new na[r.type]().fromJSON(r))}return this}},qr=class extends nl{constructor(e){super(),this.type="Path",this.currentPoint=new fe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new $s(this.currentPoint.clone(),new fe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let s=new Qs(this.currentPoint.clone(),new fe(e,t),new fe(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,s,o){let a=new Js(this.currentPoint.clone(),new fe(e,t),new fe(n,r),new fe(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new ta(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,s,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,r,s,o),this}absarc(e,t,n,r,s,o){return this.absellipse(e,t,n,n,r,s,o),this}ellipse(e,t,n,r,s,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,r,s,o,a,l),this}absellipse(e,t,n,r,s,o,a,l){let c=new Xr(e,t,n,r,s,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},ia=class i extends lt{constructor(e=[new fe(0,-.5),new fe(.5,0),new fe(0,.5)],t=12,n=0,r=2*Math.PI){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=Bt(r,0,2*Math.PI);let s=[],o=[],a=[],l=[],c=[],h=1/t,u=new D,p=new fe,d=new D,f=new D,_=new D,m=0,g=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:m=e[v+1].x-e[v].x,g=e[v+1].y-e[v].y,d.x=1*g,d.y=-m,d.z=0*g,_.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:m=e[v+1].x-e[v].x,g=e[v+1].y-e[v].y,d.x=1*g,d.y=-m,d.z=0*g,f.copy(d),d.x+=_.x,d.y+=_.y,d.z+=_.z,d.normalize(),l.push(d.x,d.y,d.z),_.copy(f)}for(let v=0;v<=t;v++){let x=n+v*h*r,b=Math.sin(x),E=Math.cos(x);for(let w=0;w<=e.length-1;w++){u.x=e[w].x*b,u.y=e[w].y,u.z=e[w].x*E,o.push(u.x,u.y,u.z),p.x=v/t,p.y=w/(e.length-1),a.push(p.x,p.y);let F=l[3*w+0]*b,V=l[3*w+1],U=l[3*w+0]*E;c.push(F,V,U)}}for(let v=0;v<t;v++)for(let x=0;x<e.length-1;x++){let b=x+v*e.length,E=b,w=b+e.length,F=b+e.length+1,V=b+1;s.push(E,w,V),s.push(F,V,w)}this.setIndex(s),this.setAttribute("position",new De(o,3)),this.setAttribute("uv",new De(a,2)),this.setAttribute("normal",new De(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},il=class i extends ia{constructor(e=1,t=1,n=4,r=8){let s=new qr;s.absarc(0,-t/2,e,1.5*Math.PI,0),s.absarc(0,t/2,e,0,.5*Math.PI),super(s.getPoints(n),r),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:r}}static fromJSON(e){return new i(e.radius,e.length,e.capSegments,e.radialSegments)}},rl=class i extends lt{constructor(e=1,t=32,n=0,r=2*Math.PI){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let s=[],o=[],a=[],l=[],c=new D,h=new fe;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,p=3;u<=t;u++,p+=3){let d=n+u/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[p]/e+1)/2,h.y=(o[p+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new De(o,3)),this.setAttribute("normal",new De(a,3)),this.setAttribute("uv",new De(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},ra=class i extends lt{constructor(e=1,t=1,n=1,r=32,s=1,o=!1,a=0,l=2*Math.PI){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};let c=this;r=Math.floor(r),s=Math.floor(s);let h=[],u=[],p=[],d=[],f=0,_=[],m=n/2,g=0;function v(x){let b=f,E=new fe,w=new D,F=0,V=x===!0?e:t,U=x===!0?1:-1;for(let Y=1;Y<=r;Y++)u.push(0,m*U,0),p.push(0,U,0),d.push(.5,.5),f++;let j=f;for(let Y=0;Y<=r;Y++){let q=Y/r*l+a,Z=Math.cos(q),K=Math.sin(q);w.x=V*K,w.y=m*U,w.z=V*Z,u.push(w.x,w.y,w.z),p.push(0,U,0),E.x=.5*Z+.5,E.y=.5*K*U+.5,d.push(E.x,E.y),f++}for(let Y=0;Y<r;Y++){let q=b+Y,Z=j+Y;x===!0?h.push(Z,Z+1,q):h.push(Z+1,Z,q),F+=3}c.addGroup(g,F,x===!0?1:2),g+=F}(function(){let x=new D,b=new D,E=0,w=(t-e)/n;for(let F=0;F<=s;F++){let V=[],U=F/s,j=U*(t-e)+e;for(let Y=0;Y<=r;Y++){let q=Y/r,Z=q*l+a,K=Math.sin(Z),ce=Math.cos(Z);b.x=j*K,b.y=-U*n+m,b.z=j*ce,u.push(b.x,b.y,b.z),x.set(K,w,ce).normalize(),p.push(x.x,x.y,x.z),d.push(q,1-U),V.push(f++)}_.push(V)}for(let F=0;F<r;F++)for(let V=0;V<s;V++){let U=_[V][F],j=_[V+1][F],Y=_[V+1][F+1],q=_[V][F+1];(e>0||V!==0)&&(h.push(U,j,q),E+=3),(t>0||V!==s-1)&&(h.push(j,Y,q),E+=3)}c.addGroup(g,E,0),g+=E})(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new De(u,3)),this.setAttribute("normal",new De(p,3)),this.setAttribute("uv",new De(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},sl=class i extends ra{constructor(e=1,t=1,n=32,r=1,s=!1,o=0,a=2*Math.PI){super(0,e,t,n,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Ni=class i extends lt{constructor(e=[],t=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:r};let s=[],o=[];function a(p,d,f,_){let m=_+1,g=[];for(let v=0;v<=m;v++){g[v]=[];let x=p.clone().lerp(f,v/m),b=d.clone().lerp(f,v/m),E=m-v;for(let w=0;w<=E;w++)g[v][w]=w===0&&v===m?x:x.clone().lerp(b,w/E)}for(let v=0;v<m;v++)for(let x=0;x<2*(m-v)-1;x++){let b=Math.floor(x/2);x%2==0?(l(g[v][b+1]),l(g[v+1][b]),l(g[v][b])):(l(g[v][b+1]),l(g[v+1][b+1]),l(g[v+1][b]))}}function l(p){s.push(p.x,p.y,p.z)}function c(p,d){let f=3*p;d.x=e[f+0],d.y=e[f+1],d.z=e[f+2]}function h(p,d,f,_){_<0&&p.x===1&&(o[d]=p.x-1),f.x===0&&f.z===0&&(o[d]=_/2/Math.PI+.5)}function u(p){return Math.atan2(p.z,-p.x)}(function(p){let d=new D,f=new D,_=new D;for(let m=0;m<t.length;m+=3)c(t[m+0],d),c(t[m+1],f),c(t[m+2],_),a(d,f,_,p)})(r),(function(p){let d=new D;for(let f=0;f<s.length;f+=3)d.x=s[f+0],d.y=s[f+1],d.z=s[f+2],d.normalize().multiplyScalar(p),s[f+0]=d.x,s[f+1]=d.y,s[f+2]=d.z})(n),(function(){let p=new D;for(let f=0;f<s.length;f+=3){p.x=s[f+0],p.y=s[f+1],p.z=s[f+2];let _=u(p)/2/Math.PI+.5,m=(d=p,Math.atan2(-d.y,Math.sqrt(d.x*d.x+d.z*d.z))/Math.PI+.5);o.push(_,1-m)}var d;(function(){let f=new D,_=new D,m=new D,g=new D,v=new fe,x=new fe,b=new fe;for(let E=0,w=0;E<s.length;E+=9,w+=6){f.set(s[E+0],s[E+1],s[E+2]),_.set(s[E+3],s[E+4],s[E+5]),m.set(s[E+6],s[E+7],s[E+8]),v.set(o[w+0],o[w+1]),x.set(o[w+2],o[w+3]),b.set(o[w+4],o[w+5]),g.copy(f).add(_).add(m).divideScalar(3);let F=u(g);h(v,w+0,f,F),h(x,w+2,_,F),h(b,w+4,m,F)}})(),(function(){for(let f=0;f<o.length;f+=6){let _=o[f+0],m=o[f+2],g=o[f+4],v=Math.max(_,m,g),x=Math.min(_,m,g);v>.9&&x<.1&&(_<.2&&(o[f+0]+=1),m<.2&&(o[f+2]+=1),g<.2&&(o[f+4]+=1))}})()})(),this.setAttribute("position",new De(s,3)),this.setAttribute("normal",new De(s.slice(),3)),this.setAttribute("uv",new De(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}},al=class i extends Ni{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=1/n;super([-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-n,0,-r,n,0,r,-n,0,r,n,-r,-n,0,-r,n,0,r,-n,0,r,n,0,-n,0,-r,n,0,-r,-n,0,r,n,0,r],[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},Rs=new D,Cs=new D,eo=new D,Ps=new li,ol=class extends lt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let r=Math.pow(10,4),s=Math.cos(or*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),p={},d=[];for(let f=0;f<l;f+=3){o?(c[0]=o.getX(f),c[1]=o.getX(f+1),c[2]=o.getX(f+2)):(c[0]=f,c[1]=f+1,c[2]=f+2);let{a:_,b:m,c:g}=Ps;if(_.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),g.fromBufferAttribute(a,c[2]),Ps.getNormal(eo),u[0]=`${Math.round(_.x*r)},${Math.round(_.y*r)},${Math.round(_.z*r)}`,u[1]=`${Math.round(m.x*r)},${Math.round(m.y*r)},${Math.round(m.z*r)}`,u[2]=`${Math.round(g.x*r)},${Math.round(g.y*r)},${Math.round(g.z*r)}`,u[0]!==u[1]&&u[1]!==u[2]&&u[2]!==u[0])for(let v=0;v<3;v++){let x=(v+1)%3,b=u[v],E=u[x],w=Ps[h[v]],F=Ps[h[x]],V=`${b}_${E}`,U=`${E}_${b}`;U in p&&p[U]?(eo.dot(p[U].normal)<=s&&(d.push(w.x,w.y,w.z),d.push(F.x,F.y,F.z)),p[U]=null):V in p||(p[V]={index0:c[v],index1:c[x],normal:eo.clone()})}}for(let f in p)if(p[f]){let{index0:_,index1:m}=p[f];Rs.fromBufferAttribute(a,_),Cs.fromBufferAttribute(a,m),d.push(Rs.x,Rs.y,Rs.z),d.push(Cs.x,Cs.y,Cs.z)}this.setAttribute("position",new De(d,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},sa=class extends qr{constructor(e){super(e),this.uuid=Fi(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let r=e.holes[t];this.holes.push(new qr().fromJSON(r))}return this}},op=function(i,e,t=2){let n=e&&e.length,r=n?e[0]*t:i.length,s=Vc(i,0,r,t,!0),o=[];if(!s||s.next===s.prev)return o;let a,l,c,h,u,p,d;if(n&&(s=(function(f,_,m,g){let v=[],x,b,E,w,F;for(x=0,b=_.length;x<b;x++)E=_[x]*g,w=x<b-1?_[x+1]*g:f.length,F=Vc(f,E,w,g,!1),F===F.next&&(F.steiner=!0),v.push(mp(F));for(v.sort(dp),x=0;x<v.length;x++)m=pp(v[x],m);return m})(i,e,s,t)),i.length>80*t){a=c=i[0],l=h=i[1];for(let f=t;f<r;f+=t)u=i[f],p=i[f+1],u<a&&(a=u),p<l&&(l=p),u>c&&(c=u),p>h&&(h=p);d=Math.max(c-a,h-l),d=d!==0?32767/d:0}return Yr(s,o,t,a,l,d,0),o};function Vc(i,e,t,n,r){let s,o;if(r===(function(a,l,c,h){let u=0;for(let p=l,d=c-h;p<c;p+=h)u+=(a[d]-a[p])*(a[p+1]+a[d+1]),d=p;return u})(i,e,t,n)>0)for(s=e;s<t;s+=n)o=Hc(s,i[s],i[s+1],o);else for(s=t-n;s>=e;s-=n)o=Hc(s,i[s],i[s+1],o);return o&&ma(o,o.next)&&(Kr(o),o=o.next),o}function Oi(i,e){if(!i)return i;e||(e=i);let t,n=i;do if(t=!1,n.steiner||!ma(n,n.next)&&Ct(n.prev,n,n.next)!==0)n=n.next;else{if(Kr(n),n=e=n.prev,n===n.next)break;t=!0}while(t||n!==e);return e}function Yr(i,e,t,n,r,s,o){if(!i)return;!o&&s&&(function(h,u,p,d){let f=h;do f.z===0&&(f.z=ll(f.x,f.y,u,p,d)),f.prevZ=f.prev,f.nextZ=f.next,f=f.next;while(f!==h);f.prevZ.nextZ=null,f.prevZ=null,(function(_){let m,g,v,x,b,E,w,F,V=1;do{for(g=_,_=null,b=null,E=0;g;){for(E++,v=g,w=0,m=0;m<V&&(w++,v=v.nextZ,v);m++);for(F=V;w>0||F>0&&v;)w!==0&&(F===0||!v||g.z<=v.z)?(x=g,g=g.nextZ,w--):(x=v,v=v.nextZ,F--),b?b.nextZ=x:_=x,x.prevZ=b,b=x;g=v}b.nextZ=null,V*=2}while(E>1)})(f)})(i,n,r,s);let a,l,c=i;for(;i.prev!==i.next;)if(a=i.prev,l=i.next,s?cp(i,n,r,s):lp(i))e.push(a.i/t|0),e.push(i.i/t|0),e.push(l.i/t|0),Kr(i),i=l.next,c=l.next;else if((i=l)===c){o?o===1?Yr(i=hp(Oi(i),e,t),e,t,n,r,s,2):o===2&&up(i,e,t,n,r,s):Yr(Oi(i),e,t,n,r,s,1);break}}function lp(i){let e=i.prev,t=i,n=i.next;if(Ct(e,t,n)>=0)return!1;let r=e.x,s=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=r<s?r<o?r:o:s<o?s:o,u=a<l?a<c?a:c:l<c?l:c,p=r>s?r>o?r:o:s>o?s:o,d=a>l?a>c?a:c:l>c?l:c,f=n.next;for(;f!==e;){if(f.x>=h&&f.x<=p&&f.y>=u&&f.y<=d&&ar(r,a,s,l,o,c,f.x,f.y)&&Ct(f.prev,f,f.next)>=0)return!1;f=f.next}return!0}function cp(i,e,t,n){let r=i.prev,s=i,o=i.next;if(Ct(r,s,o)>=0)return!1;let a=r.x,l=s.x,c=o.x,h=r.y,u=s.y,p=o.y,d=a<l?a<c?a:c:l<c?l:c,f=h<u?h<p?h:p:u<p?u:p,_=a>l?a>c?a:c:l>c?l:c,m=h>u?h>p?h:p:u>p?u:p,g=ll(d,f,e,t,n),v=ll(_,m,e,t,n),x=i.prevZ,b=i.nextZ;for(;x&&x.z>=g&&b&&b.z<=v;){if(x.x>=d&&x.x<=_&&x.y>=f&&x.y<=m&&x!==r&&x!==o&&ar(a,h,l,u,c,p,x.x,x.y)&&Ct(x.prev,x,x.next)>=0||(x=x.prevZ,b.x>=d&&b.x<=_&&b.y>=f&&b.y<=m&&b!==r&&b!==o&&ar(a,h,l,u,c,p,b.x,b.y)&&Ct(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;x&&x.z>=g;){if(x.x>=d&&x.x<=_&&x.y>=f&&x.y<=m&&x!==r&&x!==o&&ar(a,h,l,u,c,p,x.x,x.y)&&Ct(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;b&&b.z<=v;){if(b.x>=d&&b.x<=_&&b.y>=f&&b.y<=m&&b!==r&&b!==o&&ar(a,h,l,u,c,p,b.x,b.y)&&Ct(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function hp(i,e,t){let n=i;do{let r=n.prev,s=n.next.next;!ma(r,s)&&_h(r,n,n.next,s)&&Zr(r,s)&&Zr(s,r)&&(e.push(r.i/t|0),e.push(n.i/t|0),e.push(s.i/t|0),Kr(n),Kr(n.next),n=i=s),n=n.next}while(n!==i);return Oi(n)}function up(i,e,t,n,r,s){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&gp(o,a)){let l=xh(o,a);return o=Oi(o,o.next),l=Oi(l,l.next),Yr(o,e,t,n,r,s,0),void Yr(l,e,t,n,r,s,0)}a=a.next}o=o.next}while(o!==i)}function dp(i,e){return i.x-e.x}function pp(i,e){let t=(function(r,s){let o,a=s,l=-1/0,c=r.x,h=r.y;do{if(h<=a.y&&h>=a.next.y&&a.next.y!==a.y){let m=a.x+(h-a.y)*(a.next.x-a.x)/(a.next.y-a.y);if(m<=c&&m>l&&(l=m,o=a.x<a.next.x?a:a.next,m===c))return o}a=a.next}while(a!==s);if(!o)return null;let u=o,p=o.x,d=o.y,f,_=1/0;a=o;do c>=a.x&&a.x>=p&&c!==a.x&&ar(h<d?c:l,h,p,d,h<d?l:c,h,a.x,a.y)&&(f=Math.abs(h-a.y)/(c-a.x),Zr(a,r)&&(f<_||f===_&&(a.x>o.x||a.x===o.x&&fp(o,a)))&&(o=a,_=f)),a=a.next;while(a!==u);return o})(i,e);if(!t)return e;let n=xh(t,i);return Oi(n,n.next),Oi(t,t.next)}function fp(i,e){return Ct(i.prev,i,e.prev)<0&&Ct(e.next,i,i.next)<0}function ll(i,e,t,n,r){return(i=1431655765&((i=858993459&((i=252645135&((i=16711935&((i=(i-t)*r|0)|i<<8))|i<<4))|i<<2))|i<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=(e-n)*r|0)|e<<8))|e<<4))|e<<2))|e<<1))<<1}function mp(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function ar(i,e,t,n,r,s,o,a){return(r-o)*(e-a)>=(i-o)*(s-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(s-a)>=(r-o)*(n-a)}function gp(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!(function(t,n){let r=t;do{if(r.i!==t.i&&r.next.i!==t.i&&r.i!==n.i&&r.next.i!==n.i&&_h(r,r.next,t,n))return!0;r=r.next}while(r!==t);return!1})(i,e)&&(Zr(i,e)&&Zr(e,i)&&(function(t,n){let r=t,s=!1,o=(t.x+n.x)/2,a=(t.y+n.y)/2;do r.y>a!=r.next.y>a&&r.next.y!==r.y&&o<(r.next.x-r.x)*(a-r.y)/(r.next.y-r.y)+r.x&&(s=!s),r=r.next;while(r!==t);return s})(i,e)&&(Ct(i.prev,i,e.prev)||Ct(i,e.prev,e))||ma(i,e)&&Ct(i.prev,i,i.next)>0&&Ct(e.prev,e,e.next)>0)}function Ct(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function ma(i,e){return i.x===e.x&&i.y===e.y}function _h(i,e,t,n){let r=Is(Ct(i,e,t)),s=Is(Ct(i,e,n)),o=Is(Ct(t,n,i)),a=Is(Ct(t,n,e));return r!==s&&o!==a||!(r!==0||!Ls(i,t,e))||!(s!==0||!Ls(i,n,e))||!(o!==0||!Ls(t,i,n))||!(a!==0||!Ls(t,e,n))}function Ls(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Is(i){return i>0?1:i<0?-1:0}function Zr(i,e){return Ct(i.prev,i,i.next)<0?Ct(i,e,i.next)>=0&&Ct(i,i.prev,e)>=0:Ct(i,e,i.prev)<0||Ct(i,i.next,e)<0}function xh(i,e){let t=new cl(i.i,i.x,i.y),n=new cl(e.i,e.x,e.y),r=i.next,s=e.prev;return i.next=e,e.prev=i,t.next=r,r.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function Hc(i,e,t,n){let r=new cl(i,e,t);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function Kr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function cl(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}var ci=class i{static area(e){let t=e.length,n=0;for(let r=t-1,s=0;s<t;r=s++)n+=e[r].x*e[s].y-e[s].x*e[r].y;return .5*n}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],r=[],s=[];Gc(e),Wc(n,e);let o=e.length;t.forEach(Gc);for(let l=0;l<t.length;l++)r.push(o),o+=t[l].length,Wc(n,t[l]);let a=op(n,r);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}};function Gc(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Wc(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var hl=class i extends lt{constructor(e=new sa([new fe(.5,.5),new fe(-.5,.5),new fe(-.5,-.5),new fe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],s=[];for(let a=0,l=e.length;a<l;a++)o(e[a]);function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,p=t.bevelEnabled===void 0||t.bevelEnabled,d=t.bevelThickness!==void 0?t.bevelThickness:.2,f=t.bevelSize!==void 0?t.bevelSize:d-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,g=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:vp,x,b,E,w,F,V=!1;g&&(x=g.getSpacedPoints(h),V=!0,p=!1,b=g.computeFrenetFrames(h,!1),E=new D,w=new D,F=new D),p||(m=0,d=0,f=0,_=0);let U=a.extractPoints(c),j=U.shape,Y=U.holes;if(!ci.isClockWise(j)){j=j.reverse();for(let L=0,A=Y.length;L<A;L++){let C=Y[L];ci.isClockWise(C)&&(Y[L]=C.reverse())}}let q=ci.triangulateShape(j,Y),Z=j;for(let L=0,A=Y.length;L<A;L++){let C=Y[L];j=j.concat(C)}function K(L,A,C){return A||console.error("THREE.ExtrudeGeometry: vec does not exist"),L.clone().addScaledVector(A,C)}let ce=j.length,le=q.length;function pe(L,A,C){let y,P,O,Q=L.x-A.x,k=L.y-A.y,te=C.x-L.x,J=C.y-L.y,X=Q*Q+k*k,ge=Q*J-k*te;if(Math.abs(ge)>Number.EPSILON){let ue=Math.sqrt(X),ae=Math.sqrt(te*te+J*J),me=A.x-k/ue,Ae=A.y+Q/ue,Re=((C.x-J/ae-me)*J-(C.y+te/ae-Ae)*te)/(Q*J-k*te);y=me+Q*Re-L.x,P=Ae+k*Re-L.y;let ye=y*y+P*P;if(ye<=2)return new fe(y,P);O=Math.sqrt(ye/2)}else{let ue=!1;Q>Number.EPSILON?te>Number.EPSILON&&(ue=!0):Q<-Number.EPSILON?te<-Number.EPSILON&&(ue=!0):Math.sign(k)===Math.sign(J)&&(ue=!0),ue?(y=-k,P=Q,O=Math.sqrt(X)):(y=Q,P=k,O=Math.sqrt(X/2))}return new fe(y/O,P/O)}let ie=[];for(let L=0,A=Z.length,C=A-1,y=L+1;L<A;L++,C++,y++)C===A&&(C=0),y===A&&(y=0),ie[L]=pe(Z[L],Z[C],Z[y]);let ve=[],I,T=ie.concat();for(let L=0,A=Y.length;L<A;L++){let C=Y[L];I=[];for(let y=0,P=C.length,O=P-1,Q=y+1;y<P;y++,O++,Q++)O===P&&(O=0),Q===P&&(Q=0),I[y]=pe(C[y],C[O],C[Q]);ve.push(I),T=T.concat(I)}for(let L=0;L<m;L++){let A=L/m,C=d*Math.cos(A*Math.PI/2),y=f*Math.sin(A*Math.PI/2)+_;for(let P=0,O=Z.length;P<O;P++){let Q=K(Z[P],ie[P],y);W(Q.x,Q.y,-C)}for(let P=0,O=Y.length;P<O;P++){let Q=Y[P];I=ve[P];for(let k=0,te=Q.length;k<te;k++){let J=K(Q[k],I[k],y);W(J.x,J.y,-C)}}}let B=f+_;for(let L=0;L<ce;L++){let A=p?K(j[L],T[L],B):j[L];V?(w.copy(b.normals[0]).multiplyScalar(A.x),E.copy(b.binormals[0]).multiplyScalar(A.y),F.copy(x[0]).add(w).add(E),W(F.x,F.y,F.z)):W(A.x,A.y,0)}for(let L=1;L<=h;L++)for(let A=0;A<ce;A++){let C=p?K(j[A],T[A],B):j[A];V?(w.copy(b.normals[L]).multiplyScalar(C.x),E.copy(b.binormals[L]).multiplyScalar(C.y),F.copy(x[L]).add(w).add(E),W(F.x,F.y,F.z)):W(C.x,C.y,u/h*L)}for(let L=m-1;L>=0;L--){let A=L/m,C=d*Math.cos(A*Math.PI/2),y=f*Math.sin(A*Math.PI/2)+_;for(let P=0,O=Z.length;P<O;P++){let Q=K(Z[P],ie[P],y);W(Q.x,Q.y,u+C)}for(let P=0,O=Y.length;P<O;P++){let Q=Y[P];I=ve[P];for(let k=0,te=Q.length;k<te;k++){let J=K(Q[k],I[k],y);V?W(J.x,J.y+x[h-1].y,x[h-1].x+C):W(J.x,J.y,u+C)}}}function G(L,A){let C=L.length;for(;--C>=0;){let y=C,P=C-1;P<0&&(P=L.length-1);for(let O=0,Q=h+2*m;O<Q;O++){let k=ce*O,te=ce*(O+1);M(A+y+k,A+P+k,A+P+te,A+y+te)}}}function W(L,A,C){l.push(L),l.push(A),l.push(C)}function H(L,A,C){S(L),S(A),S(C);let y=r.length/3,P=v.generateTopUV(n,r,y-3,y-2,y-1);N(P[0]),N(P[1]),N(P[2])}function M(L,A,C,y){S(L),S(A),S(y),S(A),S(C),S(y);let P=r.length/3,O=v.generateSideWallUV(n,r,P-6,P-3,P-2,P-1);N(O[0]),N(O[1]),N(O[3]),N(O[1]),N(O[2]),N(O[3])}function S(L){r.push(l[3*L+0]),r.push(l[3*L+1]),r.push(l[3*L+2])}function N(L){s.push(L.x),s.push(L.y)}(function(){let L=r.length/3;if(p){let A=0,C=ce*A;for(let y=0;y<le;y++){let P=q[y];H(P[2]+C,P[1]+C,P[0]+C)}A=h+2*m,C=ce*A;for(let y=0;y<le;y++){let P=q[y];H(P[0]+C,P[1]+C,P[2]+C)}}else{for(let A=0;A<le;A++){let C=q[A];H(C[2],C[1],C[0])}for(let A=0;A<le;A++){let C=q[A];H(C[0]+ce*h,C[1]+ce*h,C[2]+ce*h)}}n.addGroup(L,r.length/3-L,0)})(),(function(){let L=r.length/3,A=0;G(Z,A),A+=Z.length;for(let C=0,y=Y.length;C<y;C++){let P=Y[C];G(P,A),A+=P.length}n.addGroup(L,r.length/3-L,1)})()}this.setAttribute("position",new De(r,3)),this.setAttribute("uv",new De(s,2)),this.computeVertexNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return(function(t,n,r){if(r.shapes=[],Array.isArray(t))for(let s=0,o=t.length;s<o;s++){let a=t[s];r.shapes.push(a.uuid)}else r.shapes.push(t.uuid);return r.options=Object.assign({},n),n.extrudePath!==void 0&&(r.options.extrudePath=n.extrudePath.toJSON()),r})(this.parameters.shapes,this.parameters.options,e)}static fromJSON(e,t){let n=[];for(let s=0,o=e.shapes.length;s<o;s++){let a=t[e.shapes[s]];n.push(a)}let r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new na[r.type]().fromJSON(r)),new i(n,e.options)}},vp={generateTopUV:function(i,e,t,n,r){let s=e[3*t],o=e[3*t+1],a=e[3*n],l=e[3*n+1],c=e[3*r],h=e[3*r+1];return[new fe(s,o),new fe(a,l),new fe(c,h)]},generateSideWallUV:function(i,e,t,n,r,s){let o=e[3*t],a=e[3*t+1],l=e[3*t+2],c=e[3*n],h=e[3*n+1],u=e[3*n+2],p=e[3*r],d=e[3*r+1],f=e[3*r+2],_=e[3*s],m=e[3*s+1],g=e[3*s+2];return Math.abs(a-h)<Math.abs(o-c)?[new fe(o,1-l),new fe(c,1-u),new fe(p,1-f),new fe(_,1-g)]:[new fe(a,1-l),new fe(h,1-u),new fe(d,1-f),new fe(m,1-g)]}},ul=class i extends Ni{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2;super([-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},dl=class i extends Ni{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},pl=class i extends lt{constructor(e=.5,t=1,n=32,r=1,s=0,o=2*Math.PI){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:s,thetaLength:o},n=Math.max(3,n);let a=[],l=[],c=[],h=[],u=e,p=(t-e)/(r=Math.max(1,r)),d=new D,f=new fe;for(let _=0;_<=r;_++){for(let m=0;m<=n;m++){let g=s+m/n*o;d.x=u*Math.cos(g),d.y=u*Math.sin(g),l.push(d.x,d.y,d.z),c.push(0,0,1),f.x=(d.x/t+1)/2,f.y=(d.y/t+1)/2,h.push(f.x,f.y)}u+=p}for(let _=0;_<r;_++){let m=_*(n+1);for(let g=0;g<n;g++){let v=g+m,x=v,b=v+n+1,E=v+n+2,w=v+1;a.push(x,b,w),a.push(b,E,w)}}this.setIndex(a),this.setAttribute("position",new De(l,3)),this.setAttribute("normal",new De(c,3)),this.setAttribute("uv",new De(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},fl=class i extends lt{constructor(e=new sa([new fe(0,.5),new fe(-.5,-.5),new fe(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],r=[],s=[],o=[],a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(a,l,h),a+=l,l=0;function c(h){let u=r.length/3,p=h.extractPoints(t),d=p.shape,f=p.holes;ci.isClockWise(d)===!1&&(d=d.reverse());for(let m=0,g=f.length;m<g;m++){let v=f[m];ci.isClockWise(v)===!0&&(f[m]=v.reverse())}let _=ci.triangulateShape(d,f);for(let m=0,g=f.length;m<g;m++){let v=f[m];d=d.concat(v)}for(let m=0,g=d.length;m<g;m++){let v=d[m];r.push(v.x,v.y,0),s.push(0,0,1),o.push(v.x,v.y)}for(let m=0,g=_.length;m<g;m++){let v=_[m],x=v[0]+u,b=v[1]+u,E=v[2]+u;n.push(x,b,E),l+=3}}this.setIndex(n),this.setAttribute("position",new De(r,3)),this.setAttribute("normal",new De(s,3)),this.setAttribute("uv",new De(o,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return(function(t,n){if(n.shapes=[],Array.isArray(t))for(let r=0,s=t.length;r<s;r++){let o=t[r];n.shapes.push(o.uuid)}else n.shapes.push(t.uuid);return n})(this.parameters.shapes,e)}static fromJSON(e,t){let n=[];for(let r=0,s=e.shapes.length;r<s;r++){let o=t[e.shapes[r]];n.push(o)}return new i(n,e.curveSegments)}},_r=class i extends lt{constructor(e=1,t=32,n=16,r=0,s=2*Math.PI,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new D,p=new D,d=[],f=[],_=[],m=[];for(let g=0;g<=n;g++){let v=[],x=g/n,b=0;g===0&&o===0?b=.5/t:g===n&&l===Math.PI&&(b=-.5/t);for(let E=0;E<=t;E++){let w=E/t;u.x=-e*Math.cos(r+w*s)*Math.sin(o+x*a),u.y=e*Math.cos(o+x*a),u.z=e*Math.sin(r+w*s)*Math.sin(o+x*a),f.push(u.x,u.y,u.z),p.copy(u).normalize(),_.push(p.x,p.y,p.z),m.push(w+b,1-x),v.push(c++)}h.push(v)}for(let g=0;g<n;g++)for(let v=0;v<t;v++){let x=h[g][v+1],b=h[g][v],E=h[g+1][v],w=h[g+1][v+1];(g!==0||o>0)&&d.push(x,b,w),(g!==n-1||l<Math.PI)&&d.push(b,E,w)}this.setIndex(d),this.setAttribute("position",new De(f,3)),this.setAttribute("normal",new De(_,3)),this.setAttribute("uv",new De(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},ml=class i extends Ni{constructor(e=1,t=0){super([1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],[2,1,0,0,3,2,1,3,0,2,3,1],e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},gl=class i extends lt{constructor(e=1,t=.4,n=12,r=48,s=2*Math.PI){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);let o=[],a=[],l=[],c=[],h=new D,u=new D,p=new D;for(let d=0;d<=n;d++)for(let f=0;f<=r;f++){let _=f/r*s,m=d/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(_),u.y=(e+t*Math.cos(m))*Math.sin(_),u.z=t*Math.sin(m),a.push(u.x,u.y,u.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),p.subVectors(u,h).normalize(),l.push(p.x,p.y,p.z),c.push(f/r),c.push(d/n)}for(let d=1;d<=n;d++)for(let f=1;f<=r;f++){let _=(r+1)*d+f-1,m=(r+1)*(d-1)+f-1,g=(r+1)*(d-1)+f,v=(r+1)*d+f;o.push(_,m,v),o.push(m,g,v)}this.setIndex(o),this.setAttribute("position",new De(a,3)),this.setAttribute("normal",new De(l,3)),this.setAttribute("uv",new De(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},vl=class i extends lt{constructor(e=1,t=.4,n=64,r=8,s=2,o=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:r,p:s,q:o},n=Math.floor(n),r=Math.floor(r);let a=[],l=[],c=[],h=[],u=new D,p=new D,d=new D,f=new D,_=new D,m=new D,g=new D;for(let x=0;x<=n;++x){let b=x/n*s*Math.PI*2;v(b,s,o,e,d),v(b+.01,s,o,e,f),m.subVectors(f,d),g.addVectors(f,d),_.crossVectors(m,g),g.crossVectors(_,m),_.normalize(),g.normalize();for(let E=0;E<=r;++E){let w=E/r*Math.PI*2,F=-t*Math.cos(w),V=t*Math.sin(w);u.x=d.x+(F*g.x+V*_.x),u.y=d.y+(F*g.y+V*_.y),u.z=d.z+(F*g.z+V*_.z),l.push(u.x,u.y,u.z),p.subVectors(u,d).normalize(),c.push(p.x,p.y,p.z),h.push(x/n),h.push(E/r)}}for(let x=1;x<=n;x++)for(let b=1;b<=r;b++){let E=(r+1)*(x-1)+(b-1),w=(r+1)*x+(b-1),F=(r+1)*x+b,V=(r+1)*(x-1)+b;a.push(E,w,V),a.push(w,F,V)}function v(x,b,E,w,F){let V=Math.cos(x),U=Math.sin(x),j=E/b*x,Y=Math.cos(j);F.x=w*(2+Y)*.5*V,F.y=w*(2+Y)*U*.5,F.z=w*Math.sin(j)*.5}this.setIndex(a),this.setAttribute("position",new De(l,3)),this.setAttribute("normal",new De(c,3)),this.setAttribute("uv",new De(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}},_l=class i extends lt{constructor(e=new ea(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),t=64,n=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:r,closed:s};let o=e.computeFrenetFrames(t,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new D,l=new D,c=new fe,h=new D,u=[],p=[],d=[],f=[];function _(m){h=e.getPointAt(m/t,h);let g=o.normals[m],v=o.binormals[m];for(let x=0;x<=r;x++){let b=x/r*Math.PI*2,E=Math.sin(b),w=-Math.cos(b);l.x=w*g.x+E*v.x,l.y=w*g.y+E*v.y,l.z=w*g.z+E*v.z,l.normalize(),p.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}(function(){for(let m=0;m<t;m++)_(m);_(s===!1?t:0),(function(){for(let m=0;m<=t;m++)for(let g=0;g<=r;g++)c.x=m/t,c.y=g/r,d.push(c.x,c.y)})(),(function(){for(let m=1;m<=t;m++)for(let g=1;g<=r;g++){let v=(r+1)*(m-1)+(g-1),x=(r+1)*m+(g-1),b=(r+1)*m+g,E=(r+1)*(m-1)+g;f.push(v,x,E),f.push(x,b,E)}})()})(),this.setIndex(f),this.setAttribute("position",new De(u,3)),this.setAttribute("normal",new De(p,3)),this.setAttribute("uv",new De(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new na[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},xl=class extends lt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],n=new Set,r=new D,s=new D;if(e.index!==null){let o=e.attributes.position,a=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let u=l[c],p=u.start;for(let d=p,f=p+u.count;d<f;d+=3)for(let _=0;_<3;_++){let m=a.getX(d+_),g=a.getX(d+(_+1)%3);r.fromBufferAttribute(o,m),s.fromBufferAttribute(o,g),jc(r,s,n)===!0&&(t.push(r.x,r.y,r.z),t.push(s.x,s.y,s.z))}}}else{let o=e.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){let h=3*a+c,u=3*a+(c+1)%3;r.fromBufferAttribute(o,h),s.fromBufferAttribute(o,u),jc(r,s,n)===!0&&(t.push(r.x,r.y,r.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new De(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function jc(i,e,t){let n=`${i.x},${i.y},${i.z}-${e.x},${e.y},${e.z}`,r=`${e.x},${e.y},${e.z}-${i.x},${i.y},${i.z}`;return t.has(n)!==!0&&t.has(r)!==!0&&(t.add(n),t.add(r),!0)}var pm=Object.freeze({__proto__:null,BoxGeometry:ui,CapsuleGeometry:il,CircleGeometry:rl,ConeGeometry:sl,CylinderGeometry:ra,DodecahedronGeometry:al,EdgesGeometry:ol,ExtrudeGeometry:hl,IcosahedronGeometry:ul,LatheGeometry:ia,OctahedronGeometry:dl,PlaneGeometry:di,PolyhedronGeometry:Ni,RingGeometry:pl,ShapeGeometry:fl,SphereGeometry:_r,TetrahedronGeometry:ml,TorusGeometry:gl,TorusKnotGeometry:vl,TubeGeometry:_l,WireframeGeometry:xl});var kn=class extends Ii{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new je(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new je(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},$n=class extends kn{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new fe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Bt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new je(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new je(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new je(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};function Ds(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function _p(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var xr=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],s=t[n-1];t:{e:{let o;n:{i:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=r,r=t[++n],e<r)break e}o=t.length;break n}if(e>=s)break t;{let a=t[1];e<a&&(n=2,s=a);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(r=s,s=t[--n-1],e>=s)break e}o=n,n=0}}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(r=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)t[o]=n[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},yl=class extends xr{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Wl,endingEnd:Wl}}intervalChanged_(e,t,n){let r=this.parameterPositions,s=e-2,o=e+1,a=r[s],l=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case jl:s=e,a=2*t-n;break;case Xl:s=r.length-2,a=t+r[s]-r[s+1];break;default:s=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case jl:o=e,l=2*n-t;break;case Xl:o=1,l=n+r[1]-r[0];break;default:o=e-1,l=t}let c=.5*(n-t),h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=o*h}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,p=this._weightPrev,d=this._weightNext,f=(n-t)/(r-t),_=f*f,m=_*f,g=-p*m+2*p*_-p*f,v=(1+p)*m+(-1.5-2*p)*_+(-.5+p)*f+1,x=(-1-d)*m+(1.5+d)*_+.5*f,b=d*m-d*_;for(let E=0;E!==a;++E)s[E]=g*o[h+E]+v*o[c+E]+x*o[l+E]+b*o[u+E];return s}},Ml=class extends xr{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(r-t),u=1-h;for(let p=0;p!==a;++p)s[p]=o[c+p]*u+o[l+p]*h;return s}},bl=class extends xr{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Cn=class{constructor(e,t,n,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ds(t,this.TimeBufferType),this.values=Ds(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ds(e.times,Array),values:Ds(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(n.interpolation=r)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new bl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ml(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new yl(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case zs:t=this.InterpolantFactoryMethodDiscrete;break;case Uo:t=this.InterpolantFactoryMethodLinear;break;case wa:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0){if(e===this.DefaultInterpolation)throw new Error(n);this.setInterpolation(this.DefaultInterpolation)}return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return zs;case this.InterpolantFactoryMethodLinear:return Uo;case this.InterpolantFactoryMethodSmooth:return wa}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,s=0,o=r-1;for(;s!==r&&n[s]<e;)++s;for(;o!==-1&&n[o]>t;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!=0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,r=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(r!==void 0&&_p(r))for(let a=0,l=r.length;a!==l;++a){let c=r[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===wa,s=e.length-1,o=1;for(let a=1;a<s;++a){let l=!1,c=e[a];if(c!==e[a+1]&&(a!==1||c!==e[0]))if(r)l=!0;else{let h=a*n,u=h-n,p=h+n;for(let d=0;d!==n;++d){let f=t[h+d];if(f!==t[u+d]||f!==t[p+d]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let h=a*n,u=o*n;for(let p=0;p!==n;++p)t[u+p]=t[h+p]}++o}}if(s>0){e[o]=e[s];for(let a=s*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=new this.constructor(this.name,e,t);return n.createInterpolant=this.createInterpolant,n}};Cn.prototype.TimeBufferType=Float32Array,Cn.prototype.ValueBufferType=Float32Array,Cn.prototype.DefaultInterpolation=Uo;var Ci=class extends Cn{constructor(e,t,n){super(e,t,n)}};Ci.prototype.ValueTypeName="bool",Ci.prototype.ValueBufferType=Array,Ci.prototype.DefaultInterpolation=zs,Ci.prototype.InterpolantFactoryMethodLinear=void 0,Ci.prototype.InterpolantFactoryMethodSmooth=void 0;var Sl=class extends Cn{};Sl.prototype.ValueTypeName="color";var wl=class extends Cn{};wl.prototype.ValueTypeName="number";var El=class extends xr{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(r-t),c=e*a;for(let h=c+a;c!==h;c+=4)Qt.slerpFlat(s,0,o,c-a,o,c,l);return s}},aa=class extends Cn{InterpolantFactoryMethodLinear(e){return new El(this.times,this.values,this.getValueSize(),e)}};aa.prototype.ValueTypeName="quaternion",aa.prototype.InterpolantFactoryMethodSmooth=void 0;var Pi=class extends Cn{constructor(e,t,n){super(e,t,n)}};Pi.prototype.ValueTypeName="string",Pi.prototype.ValueBufferType=Array,Pi.prototype.DefaultInterpolation=zs,Pi.prototype.InterpolantFactoryMethodLinear=void 0,Pi.prototype.InterpolantFactoryMethodSmooth=void 0;var Tl=class extends Cn{};Tl.prototype.ValueTypeName="vector";var Al=class{constructor(e,t,n){let r=this,s,o=!1,a=0,l=0,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){l++,o===!1&&r.onStart!==void 0&&r.onStart(h,a,l),o=!0},this.itemEnd=function(h){a++,r.onProgress!==void 0&&r.onProgress(h,a,l),a===l&&(o=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return s?s(h):h},this.setURLModifier=function(h){return s=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,p=c.length;u<p;u+=2){let d=c[u],f=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return f}return null}}},xp=new Al,Rl=class{constructor(e){this.manager=e!==void 0?e:xp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise((function(r,s){n.load(e,r,t,s)}))}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Rl.DEFAULT_MATERIAL_NAME="__DEFAULT";var fm=new Xe,mm=new D,gm=new D;var vm=new Xe,_m=new D,xm=new D;var ym=new Xe,Mm=new Xe,bm=new Xe;var Sm=new D,wm=new Qt,Em=new D,Tm=new D;var Am=new D,Rm=new Qt,Cm=new D,Pm=new D;var zl="\\[\\]\\.:\\/",yp=new RegExp("["+zl+"]","g"),to="[^"+zl+"]",Mp="[^"+zl.replace("\\.","")+"]",bp=new RegExp("^"+/((?:WC+[\/:])*)/.source.replace("WC",to)+/(WCOD+)?/.source.replace("WCOD",Mp)+/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",to)+/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",to)+"$"),Sp=["material","materials","bones","map"],wt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(yp,"")}static parseTrackName(e){let t=bp.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=n.nodeName.substring(r+1);Sp.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e)return void console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.materials)return void console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);e=e.material.materials;break;case"bones":if(!e.skeleton)return void console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.map)return void console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);e=e.material.map;break;default:if(e[n]===void 0)return void console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);e=e[n]}if(c!==void 0){if(e[c]===void 0)return void console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);e=e[c]}}let o=e[r];if(o===void 0){let c=t.nodeName;return void console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e)}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);if(!e.geometry.morphAttributes)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};wt.Composite=class{constructor(i,e,t){let n=t||wt.parseTrackName(e);this._targetGroup=i,this._bindings=i.subscribe_(e,n)}getValue(i,e){this.bind();let t=this._targetGroup.nCachedObjects_,n=this._bindings[t];n!==void 0&&n.getValue(i,e)}setValue(i,e){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,r=t.length;n!==r;++n)t[n].setValue(i,e)}bind(){let i=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=i.length;e!==t;++e)i[e].bind()}unbind(){let i=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=i.length;e!==t;++e)i[e].unbind()}},wt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},wt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},wt.prototype.GetterByBindingType=[wt.prototype._getValue_direct,wt.prototype._getValue_array,wt.prototype._getValue_arrayElement,wt.prototype._getValue_toArray],wt.prototype.SetterByBindingTypeAndVersioning=[[wt.prototype._setValue_direct,wt.prototype._setValue_direct_setNeedsUpdate,wt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[wt.prototype._setValue_array,wt.prototype._setValue_array_setNeedsUpdate,wt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[wt.prototype._setValue_arrayElement,wt.prototype._setValue_arrayElement_setNeedsUpdate,wt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[wt.prototype._setValue_fromArray,wt.prototype._setValue_fromArray_setNeedsUpdate,wt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Lm=new Float32Array(1);var Xc=new Xe,oa=class{constructor(e,t,n=0,r=1/0){this.ray=new Jn(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Gr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Xc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Xc),this}intersectObject(e,t=!0,n=[]){return Cl(e,this,n,t),n.sort(qc),n}intersectObjects(e,t=!0,n=[]){for(let r=0,s=e.length;r<s;r++)Cl(e[r],this,n,t);return n.sort(qc),n}};function qc(i,e){return i.distance-e.distance}function Cl(i,e,t,n){let r=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(r=!1),r===!0&&n===!0){let s=i.children;for(let o=0,a=s.length;o<a;o++)Cl(s[o],e,t,!0)}}var Jr=class{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Bt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Im=new fe;var Dm=new D,Um=new D;var Nm=new D;var Om=new D,Fm=new Xe,Bm=new Xe;var zm=new D,km=new je,Vm=new je;var Hm=new D,Gm=new D,Wm=new D;var jm=new D,Xm=new Di;var qm=new hn;var Ym=new D;var la=class extends Kn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170");var yh={type:"change"},Vl={type:"start"},bh={type:"end"},ga=new Jn,Mh=new Tn,Ep=Math.cos(70*pa.DEG2RAD),Ht=new D,un=2*Math.PI,ft={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},kl=1e-6,va=class extends la{constructor(e,t=null){super(e,t),this.state=ft.NONE,this.enabled=!0,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Pn.ROTATE,MIDDLE:Pn.DOLLY,RIGHT:Pn.PAN},this.touches={ONE:Vn.ROTATE,TWO:Vn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new Qt,this._lastTargetPosition=new D,this._quat=new Qt().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Jr,this._sphericalDelta=new Jr,this._scale=1,this._panOffset=new D,this._rotateStart=new fe,this._rotateEnd=new fe,this._rotateDelta=new fe,this._panStart=new fe,this._panEnd=new fe,this._panDelta=new fe,this._dollyStart=new fe,this._dollyEnd=new fe,this._dollyDelta=new fe,this._dollyDirection=new D,this._mouse=new fe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Ap.bind(this),this._onPointerDown=Tp.bind(this),this._onPointerUp=Rp.bind(this),this._onContextMenu=Np.bind(this),this._onMouseWheel=Lp.bind(this),this._onKeyDown=Ip.bind(this),this._onTouchStart=Dp.bind(this),this._onTouchMove=Up.bind(this),this._onMouseDown=Cp.bind(this),this._onMouseMove=Pp.bind(this),this._interceptControlDown=Op.bind(this),this._interceptControlUp=Fp.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(yh),this.update(),this.state=ft.NONE}update(e=null){let t=this.object.position;Ht.copy(t).sub(this.target),Ht.applyQuaternion(this._quat),this._spherical.setFromVector3(Ht),this.autoRotate&&this.state===ft.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=un:n>Math.PI&&(n-=un),r<-Math.PI?r+=un:r>Math.PI&&(r-=un),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(Ht.setFromSpherical(this._spherical),Ht.applyQuaternion(this._quatInverse),t.copy(this.target).add(Ht),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Ht.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){let a=new D(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;let c=new D(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Ht.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(ga.origin.copy(this.object.position),ga.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ga.direction))<Ep?this.object.lookAt(this.target):(Mh.setFromNormalAndCoplanarPoint(this.object.up,this.target),ga.intersectPlane(Mh,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>kl||8*(1-this._lastQuaternion.dot(this.object.quaternion))>kl||this._lastTargetPosition.distanceToSquared(this.target)>kl?(this.dispatchEvent(yh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?un/60*this.autoRotateSpeed*e:un/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Ht.setFromMatrixColumn(t,0),Ht.multiplyScalar(-e),this._panOffset.add(Ht)}_panUp(e,t){this.screenSpacePanning===!0?Ht.setFromMatrixColumn(t,1):(Ht.setFromMatrixColumn(t,0),Ht.crossVectors(this.object.up,Ht)),Ht.multiplyScalar(e),this._panOffset.add(Ht)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let r=this.object.position;Ht.copy(r).sub(this.target);let s=Ht.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/n.clientHeight,this.object.matrix),this._panUp(2*t*s/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),r=e-n.left,s=t-n.top,o=n.width,a=n.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(un*this._rotateDelta.x/t.clientHeight),this._rotateUp(un*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(un*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-un*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(un*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-un*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(n*n+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),r=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(un*this._rotateDelta.x/t.clientHeight),this._rotateUp(un*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new fe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Tp(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function Ap(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Rp(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(bh),this.state=ft.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Cp(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Pn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=ft.DOLLY;break;case Pn.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ft.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ft.ROTATE}break;case Pn.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ft.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ft.PAN}break;default:this.state=ft.NONE}this.state!==ft.NONE&&this.dispatchEvent(Vl)}function Pp(i){switch(this.state){case ft.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case ft.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case ft.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Lp(i){this.enabled===!1||this.enableZoom===!1||this.state!==ft.NONE||(i.preventDefault(),this.dispatchEvent(Vl),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(bh))}function Ip(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function Dp(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Vn.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=ft.TOUCH_ROTATE;break;case Vn.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=ft.TOUCH_PAN;break;default:this.state=ft.NONE}break;case 2:switch(this.touches.TWO){case Vn.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=ft.TOUCH_DOLLY_PAN;break;case Vn.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=ft.TOUCH_DOLLY_ROTATE;break;default:this.state=ft.NONE}break;default:this.state=ft.NONE}this.state!==ft.NONE&&this.dispatchEvent(Vl)}function Up(i){switch(this._trackPointer(i),this.state){case ft.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case ft.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case ft.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case ft.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=ft.NONE}}function Np(i){this.enabled!==!1&&i.preventDefault()}function Op(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Fp(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Ee=(i,e,t)=>new D(i,e,t),at=pa.clamp,_t=(i,e,t)=>{let n=at((t-i)/(e-i),0,1);return n*n*(3-2*n)},Dt=Ee(1,0,0),gi=Ee(0,1,0),Bp=Ee(0,0,1),gt=Math.PI/180,zp=(()=>{let i="vec3 CustomToneMapping( vec3 color ) { return color; }",e=Ge.tonemapping_pars_fragment||"";return e.includes("vtFilm")?!0:e.includes(i)?(Ge.tonemapping_pars_fragment=e.replace(i,"vec3 CustomToneMapping( vec3 color ) { /* vtFilm */ color *= toneMappingExposure; return min( color, 0.72 ) + 0.28 * ( 1.0 - exp( - max( color - 0.72, 0.0 ) / 0.28 ) ); }"),!0):!1})();function vi(i,e){return new Ui(i,!1,"centripetal").getPoints(e)}function dn(i,e,t={}){let n=i.length,r=t.segs||28,s=[0];for(let U=1;U<n;U++)s[U]=s[U-1]+i[U].distanceTo(i[U-1]);let o=s[n-1],a=[];for(let U=0;U<n;U++)a[U]=typeof e=="function"?e(s[U],o,U):Array.isArray(e)?e[U]:e;let l=[];for(let U=0;U<n;U++){let j=i[Math.max(0,U-1)],Y=i[Math.min(n-1,U+1)];l[U]=Y.clone().sub(j).normalize()}let c=(t.up||(Math.abs(l[0].z)<.9?Bp:Dt)).clone();c.addScaledVector(l[0],-c.dot(l[0])).normalize();let h=t.scaleN||1,u=t.scaleB||1,p=t.sq||2,d=!!t.inside,f=[],_=[],m=[],g=[],v=new Qt,x=Ee(),b=Ee(),E=Ee();for(let U=0;U<n;U++){U>0&&(v.setFromUnitVectors(l[U-1],l[U]),c.applyQuaternion(v),c.addScaledVector(l[U],-c.dot(l[U])).normalize()),E.crossVectors(l[U],c);let j=U===0?(a[1]-a[0])/(s[1]-s[0]||1):U===n-1?(a[U]-a[U-1])/(s[U]-s[U-1]||1):(a[U+1]-a[U-1])/(s[U+1]-s[U-1]||1);for(let Y=0;Y<=r;Y++){let q=Y/r*Math.PI*2,Z=Math.cos(q),K=Math.sin(q),ce=Z,le=K,pe=Z/h,ie=K/u;p!==2&&(ce=Math.sign(Z)*Math.pow(Math.abs(Z),2/p),le=Math.sign(K)*Math.pow(Math.abs(K),2/p),pe=Math.sign(Z)*Math.pow(Math.abs(Z),2*(p-1)/p)/h,ie=Math.sign(K)*Math.pow(Math.abs(K),2*(p-1)/p)/u),x.set(0,0,0).addScaledVector(c,ce*h).addScaledVector(E,le*u),f.push(i[U].x+x.x*a[U],i[U].y+x.y*a[U],i[U].z+x.z*a[U]),b.set(0,0,0).addScaledVector(c,pe).addScaledVector(E,ie).normalize().addScaledVector(l[U],-j).normalize(),d&&b.negate(),_.push(b.x,b.y,b.z),m.push(Y/r,s[U]/(t.uvLen||o||1))}}let w=r+1;for(let U=0;U<n-1;U++)for(let j=0;j<r;j++){let Y=U*w+j,q=Y+1,Z=Y+w,K=Z+1;d?g.push(Y,Z,q,q,Z,K):g.push(Y,q,Z,q,K,Z)}let F=(U,j)=>{let Y=f.length/3,q=l[U];f.push(i[U].x,i[U].y,i[U].z),_.push(q.x*j,q.y*j,q.z*j),m.push(.5,.5);for(let Z=0;Z<=r;Z++){let K=(U*w+Z)*3;f.push(f[K],f[K+1],f[K+2]),_.push(q.x*j,q.y*j,q.z*j),m.push(.5,.5)}for(let Z=0;Z<r;Z++)j>0?g.push(Y,Y+1+Z,Y+2+Z):g.push(Y,Y+2+Z,Y+1+Z)};t.capA&&F(0,-1),t.capB&&F(n-1,1);let V=new lt;return V.setAttribute("position",new De(f,3)),V.setAttribute("normal",new De(_,3)),V.setAttribute("uv",new De(m,2)),V.setIndex(g),V.userData.rings=n,V.userData.W=w,V}function it(i,e={}){let t=e.segs||48,n=Math.cos((e.crease||32)*Math.PI/180),r=i.filter((f,_)=>_===0||Math.hypot(f[0]-i[_-1][0],f[1]-i[_-1][1])>1e-6),s=[];for(let f=0;f<r.length-1;f++){let _=r[f+1][0]-r[f][0],m=r[f+1][1]-r[f][1],g=Math.hypot(_,m);s.push([-m/g,_/g])}let o=[],a=0;for(let f=0;f<r.length;f++){f>0&&(a+=Math.hypot(r[f][0]-r[f-1][0],r[f][1]-r[f-1][1]));let _=s[f-1],m=s[f];if(_&&m&&_[0]*m[0]+_[1]*m[1]>=n){let g=_[0]+m[0],v=_[1]+m[1],x=Math.hypot(g,v);o.push({y:r[f][0],r:r[f][1],ny:g/x,nr:v/x,v:a,brk:!1})}else _&&o.push({y:r[f][0],r:r[f][1],ny:_[0],nr:_[1],v:a,brk:!0}),m&&o.push({y:r[f][0],r:r[f][1],ny:m[0],nr:m[1],v:a,brk:!1})}let l=[],c=[],h=[],u=[],p=t+1;for(let f of o)for(let _=0;_<=t;_++){let m=_/t*Math.PI*2,g=Math.cos(m),v=Math.sin(m);l.push(f.r*g,f.y,f.r*v),c.push(f.nr*g,f.ny,f.nr*v),h.push(_/t,f.v/(a||1))}for(let f=0;f<o.length-1;f++)if(!o[f].brk)for(let _=0;_<t;_++){let m=f*p+_,g=m+1,v=m+p,x=v+1;u.push(m,v,g,v,x,g)}let d=new lt;return d.setAttribute("position",new De(l,3)),d.setAttribute("normal",new De(c,3)),d.setAttribute("uv",new De(h,2)),d.setIndex(u),d}function Pt(i,e,t=gi){let n=new Xe().makeRotationFromQuaternion(new Qt().setFromUnitVectors(gi,t.clone().normalize()));return n.setPosition(e),i.applyMatrix4(n)}function Sh(i){let e=0,t=0;for(let u of i)e+=u.attributes.position.count,t+=u.index.count;let n=new Float32Array(e*3),r=new Float32Array(e*3),s=new Float32Array(e*2),o=new Float32Array(e*3).fill(1),a=new Uint32Array(t),l=0,c=0;for(let u of i){n.set(u.attributes.position.array,l*3),r.set(u.attributes.normal.array,l*3),u.attributes.uv&&s.set(u.attributes.uv.array,l*2),u.attributes.color&&o.set(u.attributes.color.array,l*3);let p=u.index.array;for(let d=0;d<p.length;d++)a[c+d]=p[d]+l;l+=u.attributes.position.count,c+=p.length,u.dispose()}let h=new lt;return h.setAttribute("position",new zt(n,3)),h.setAttribute("normal",new zt(r,3)),h.setAttribute("uv",new zt(s,2)),h.setAttribute("color",new zt(o,3)),h.setIndex(new zt(a,1)),h}var pi=Ee(),fi=Ee(),br=Ee();function kp(i,e,t,n){pi.subVectors(e,i),fi.subVectors(n,t),br.subVectors(i,t);let r=pi.dot(pi),s=fi.dot(fi),o=fi.dot(br),a=pi.dot(br),l=pi.dot(fi),c=0,h=0;if(r>1e-9&&s>1e-9){let f=r*s-l*l;c=f>1e-9?at((l*o-a*s)/f,0,1):0,h=(l*c+o)/s,h<0?(h=0,c=at(-a/r,0,1)):h>1&&(h=1,c=at((l-a)/r,0,1))}else r>1e-9?c=at(-a/r,0,1):s>1e-9&&(h=at(o/s,0,1));let u=br.x+pi.x*c-fi.x*h,p=br.y+pi.y*c-fi.y*h,d=br.z+pi.z*c-fi.z*h;return u*u+p*p+d*d}var Sr={mpEnd:71,barrelEnd:136,upperEnd:326,lowerEnd:566,end:670.4},Ma=336,rt=i=>i<326?14.45:i<566?14.3+(i-326)*1.35/240:16,ct=(i,e,t)=>Ee(i,t*Math.sin(e*gt),t*Math.cos(e*gt)),vt=i=>Ee(0,Math.sin(i*gt),Math.cos(i*gt)),_i=i=>Ee(0,Math.cos(i*gt),-Math.sin(i*gt)),mt=(i,e)=>[(i-348.5)/8.2,136+(e-228)/8.2],Et=(i,e)=>[(i-283-(e-75)*.0045)/7.19,326+(e-75)/7.19],_a=i=>i.map(e=>mt(e[0],e[1])),wh=i=>i.map(e=>Et(e[0],e[1])),mi=(i,e,t=0,n=62)=>at(Math.asin(at(i/(rt(e)+t),-1,1))/gt,-n,n);function Ln(i,e,t=0,n=62){let r=rt(e)+t,s=r*Math.sin(n*gt);if(Math.abs(i)<=s)return ct(e,Math.asin(i/r)/gt,r);let o=Math.sign(i),a=o*n;return ct(e,a,r).addScaledVector(_i(a),o*(Math.abs(i)-s)/Math.cos(n*gt))}var Ch=`
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
    v = 0.05 + 2.7 * pow(smoothstep(0.45, 1.5, v), 1.3);
    strip = 3.2;
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
    c = mix(c, vec3(0.045, 0.047, 0.052), 0.96 * band * (1.0 - smoothstep(30.0, 50.0, abs(s))));
    // two tall black flags a little off the camera's line, left and right: every dome, rod and rolled edge then carries a
    // dark line beside its highlight, which is what makes plated keys read as metal against black wood
    float flag = max(fsBand(s, 15.0, 29.0, 1.5 + e), fsBand(s, -41.0, -27.0, 1.5 + e)) * fsBand(elev, -60.0, 62.0, e + 5.0);
    c = mix(c, vec3(0.05, 0.05, 0.055), 0.9 * flag);
    return c;
  }`,Vp=`
  #ifdef FS_TRACE
  uniform vec4 fsA[ FS_N ];
  uniform vec4 fsB[ FS_N ];
  vec3 fsRadiance( vec3 P, vec3 D, float rough ) {
    float tBest = 1e9, under = 0.0, wBest = 0.0, body = 0.0; vec3 nBest = vec3( 0.0, 0.0, 1.0 );
    for ( int i = 0; i < FS_N; i ++ ) {
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
  #endif`;function Hp(){let i=new vr;return i.add(new Ut(new _r(60,64,32),new sn({side:Pl,depthWrite:!1,vertexShader:"varying vec3 d; void main(){ d = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"varying vec3 d;"+Ch+" void main(){ gl_FragColor = vec4(fsStudio(d, 0.0), 1.0); }"}))),i}function Gp(i,e,t=24){let n=new _r(e,t,Math.max(8,t>>1));return n.translate(i.x,i.y,i.z),n}function wr(i,e,t,n={}){let r=n.NT||112,s=n.NR||9,o=n.NE||7,a=n.thick||1.4,l=n.dome||0,c=n.edge||.12,h=new Ui(i.map(([E,w])=>Ee(E,w,0)),!0,"centripetal").getSpacedPoints(r).slice(0,r),u=[];if(n.pillow){let E=a/2+l,w=-a/2+.3*a,F=s+5;for(let V=1;V<=F;V++){let U=V/F*Math.PI/2;u.push([Math.sin(U),w+(E-w)*Math.cos(U)])}u.push([.985,-a/2+.1*a],[.93,-a/2]);for(let V=s-1;V>=1;V--)u.push([.93*V/s,-a/2])}else{for(let E=1;E<=s;E++){let w=E/s;u.push([w*(1-c),a/2+l*(1-w*w)*(1-w*w)])}for(let E=1;E<o;E++){let w=E/o*Math.PI;u.push([1-c+c*Math.sin(w),a/2*Math.cos(w)])}for(let E=s;E>=1;E--){let w=E/s;u.push([w*(1-c),-a/2])}}let p=[],d=[],f=E=>p.push(E.x,E.y,E.z);f(t(e[0],e[1],a/2+l+(n.top?n.top(e[0],e[1],0):0)));for(let[E,w]of u)for(let F=0;F<r;F++){let V=e[0]+(h[F].x-e[0])*E,U=e[1]+(h[F].y-e[1])*E;f(t(V,U,w+(n.top&&w>0?n.top(V,U,E)*Math.min(1,w/(a/2)):0)))}f(t(e[0],e[1],-a/2));let _=E=>1+E*r,m=1+u.length*r,g=u.length;for(let E=0;E<r;E++){let w=(E+1)%r;d.push(0,_(0)+E,_(0)+w,m,_(g-1)+w,_(g-1)+E)}for(let E=0;E<g-1;E++)for(let w=0;w<r;w++){let F=(w+1)%r,V=_(E)+w,U=_(E)+F,j=_(E+1)+w,Y=_(E+1)+F;d.push(V,j,U,U,j,Y)}let v=new lt;v.setAttribute("position",new De(p,3)),v.setIndex(d),v.computeVertexNormals();let x=t(e[0],e[1],1).sub(t(e[0],e[1],0));if(Ee().fromBufferAttribute(v.attributes.normal,0).dot(x)<0){let E=v.index.array;for(let w=0;w<E.length;w+=3){let F=E[w+1];E[w+1]=E[w+2],E[w+2]=F}v.computeVertexNormals()}return v}var Qr=i=>(i.attributes.uv||i.setAttribute("uv",new De(new Float32Array(i.attributes.position.count*2),2)),i.index||i.setIndex([...Array(i.attributes.position.count).keys()]),i),Gt=i=>Pt(i,Ee(0,0,0),Dt),Qn=i=>it([[0,i],[0,0]],{segs:32}),xn=(i,e,t,n=16)=>dn([i,e],t,{segs:n,capA:!0,capB:!0});var Hl=(i,e)=>new Ui(i.map(([t,n])=>Ee(t,n,0)),!1,"centripetal").getPoints(e).map(t=>[t.x,t.y]);function Ph(i,e=0,t=0){i.computeVertexNormals();let n=i.attributes.position,r=i.attributes.normal,s=0;for(let o=0;o<n.count;o+=3)s+=(n.getY(o)-e)*r.getY(o)+(n.getZ(o)-t)*r.getZ(o);if(s<0){let o=i.index.array;for(let a=0;a<o.length;a+=3){let l=o[a+1];o[a+1]=o[a+2],o[a+2]=l}i.computeVertexNormals()}return Qr(i)}function Eh(i){let e=i.attributes.position,t=i.attributes.normal;if(!t)return i;let n=i.attributes.color,r=new Float32Array(e.count*3);for(let s=0;s<e.count;s++){let o=e.getY(s),a=e.getZ(s),l=Math.hypot(o,a),c=rt(e.getX(s)),h=1;if(l>.001){let u=Math.max(0,-(t.getY(s)*o+t.getZ(s)*a)/l),p=1-_t(c+.3,c+5,l);h=Math.max(.1,1-.45*p*(.4+.6*u)-.22*u*(1-_t(c+5,c+11,l)))}n&&(h*=n.getX(s)),r[s*3]=r[s*3+1]=r[s*3+2]=h}return i.setAttribute("color",new zt(r,3)),i}function Wp(i,e){let t=(i+e)/2;return it([[0,e+.2],[0,i-.3],[.35,i],[1,i],[1.45,i-.3],[1.6,t+.3],[1.6,t-.3],[1.45,e+.3],[1,e],[.35,e],[0,e+.2]],{segs:56,crease:50})}function jp(i,e,t){let n=[],r=[],a=rt(i)+.1,l=(u,p)=>ct(i+u*Math.cos(p),e+u*Math.sin(p)/a/gt,a),c=l(0,0);n.push(c.x,c.y,c.z);for(let u=1;u<=4;u++)for(let p=0;p<36;p++){let d=l(t*u/4,p/36*Math.PI*2);n.push(d.x,d.y,d.z)}for(let u=0;u<36;u++)r.push(0,1+u,1+(u+1)%36);for(let u=0;u<3;u++)for(let p=0;p<36;p++){let d=1+u*36+p,f=1+u*36+(p+1)%36;r.push(d,d+36,f,f,d+36,f+36)}let h=new lt;return h.setAttribute("position",new De(n,3)),h.setIndex(r),h.computeVertexNormals(),h}var Lh=i=>1.6+.05*i,zi=i=>Lh(i)+.25+.11*(i-.45);function Xp(i){let e=Lh(i),t=e+.25,n=[];for(let r=1;r<=8;r++){let s=1-r/8;n.push([t+(zi(i)-t)*(1-Math.pow(s,1.5)*(1.5-.5*s)),(i-.45)*s])}return it([[.2,i-.55],[0,i-.2],[.25,i],[e-.15,i],[e,i-.1],[e+.15,i-.28],[t,i-.45],...n],{segs:64,crease:35})}var qp=i=>it([[-.95,0],[-.95,i-.75],[-.75,i-.4],[.25,i-.4],[.25,0]],{segs:40,crease:50}),Yp=i=>it([[-5,i*.7],[-1.25,i*.7],[-1,i*.63],[-1,i*.52],[-1.7,i*.46]],{segs:40,crease:40}),Th=(i,e)=>Math.max(1.9,rt(e)-Math.sqrt(Math.max(1,rt(e)*rt(e)-.49*i*i))+1.3);function ei(i,e,t,n={}){let r=vt(e),s=ct(i,e,rt(i)-.4),o=ct(i,e,t),a=o.distanceTo(s);return[Pt(it([[0,0],[0,2.4],[.9,2.2],[1.7,1.55],[Math.max(1.8,a-.5),1.55],[a,0]],{segs:20}),s,r),Gp(o,Math.max(2.5,(n.ball||2.25)*1.1),28)]}function Zp(i,e,t,n,r,s,o,a={}){for(;e-n>180;)e-=360;for(;n-e>180;)e+=360;let l=16,c=[];for(let h=0;h<=l;h++){let u=h/l;c.push(ct(i,e+(n-e)*u,Math.max(rt(i)+(a.clear||1.3),t+(r-t)*_t(0,1,u)+(a.hump||0)*Math.sin(Math.PI*u))))}return dn(c,a.taper||1,{up:Dt,scaleN:s/2,scaleB:o/2,sq:a.sq||5,segs:22,capA:!0,capB:!0})}function Ah(i,e,t,n={}){let r=n.thMax||62,s=vi(i.map(([a,l,c])=>Ln(a,l,c,r)),n.n||36),o=i[0];return dn(s,n.taper||1,{up:vt(mi(o[0],o[1],o[2],r)),scaleN:t/2,scaleB:e/2,sq:5,segs:22,capA:!0,capB:!0})}function Gl(i,e,t,n={}){let r=vi(i.map(([s,o,a])=>ct(a,s,o)),n.n||40);return dn(r,n.taper||1,{up:vt(n.face!=null?n.face:i[0][0]),scaleN:t/2,scaleB:e/2,sq:5,segs:22,capA:!0,capB:!0})}function xa(i,e,t={}){let n=0,r=0;for(let[l,c]of i)n+=l,r+=c;let s=t.c||[n/i.length,r/i.length],o=typeof e=="function"?e:()=>e,a=t.thMax||62;return wr(i,s,(l,c,h)=>Ln(l,c,o(l,c)+h,a),Object.assign({thick:1.5,dome:.45,edge:.16},t))}function ya(i,e,t,n,r={}){let s=vt(n),o=_i(n),a=1/Math.cos(n*gt),l=r.bow||0;return wr(i,e,(c,h,u)=>{let p=(c-e[0])*a;return Ee(h,e[0],t).addScaledVector(o,p).addScaledVector(s,u-l*p*p)},Object.assign({thick:1.7,dome:.45,edge:.3},r))}function Kp(i,e,t,n,r=.28){let s=Math.hypot(e[0]-i[0],e[1]-i[1]),o=[(e[0]-i[0])/s,(e[1]-i[1])/s],a=[-o[1],o[0]],l=r*s,c=_=>_<=l?t/2*Math.sqrt(Math.max(0,1-Math.pow((l-_)/l,2))):n/2+(t-n)/2*(1+Math.cos(Math.PI*at((_-l)/(s-l),0,1)))/2,h=(_,m)=>[i[0]+o[0]*_+a[0]*m,i[1]+o[1]*_+a[1]*m],u=[],p=[];for(let _=1;_<=9;_++){let m=l-l*Math.cos(_/9*Math.PI/2);u.push(h(m,c(m))),p.push(h(m,-c(m)))}for(let _=1;_<=10;_++){let m=l+(s-l)*_/10;u.push(h(m,c(m))),p.push(h(m,-c(m)))}let d=(_,m,g)=>{let v=_-i[0],x=m-i[1],b=v*o[0]+x*o[1],E=v*a[0]+x*a[1],w=at(Math.abs(E)/Math.max(.3,c(at(b,0,s))),0,1);return-g*(1-w*w)*_t(0,l,b)*(1-_t(l+1,s-1,b))},f=(_,m,g)=>{let v=_-i[0],x=m-i[1],b=v*o[0]+x*o[1],E=v*a[0]+x*a[1],w=at(Math.abs(E)/Math.max(.3,c(at(b,0,s))),0,1);return g*(1-w*w)*(1-.6*_t(l,s,b))};return{pts:[h(0,0),...u,h(s+.5,0),...p.reverse()],centre:h(l,0),dish:d,crown:f}}function Jp(i,e,t,n,r){let o=[[0,0],[0,.88],[.08,.96],[.22,.995],[.4,1],[.9,1]];for(let d=1;d<=16;d++){let f=d/16*Math.PI/2;o.push([.9+(r-.9)*Math.sin(f),Math.cos(f)])}let a=it(o,{segs:72,crease:70}),l=vt(e),c=new Xe;c.makeBasis(Dt.clone().multiplyScalar(t/2),l,_i(e).multiplyScalar(-n/2)),c.setPosition(i),a.applyMatrix4(c),a.computeVertexNormals();let h=i.clone().addScaledVector(l,r),u=a.attributes.position,p=a.attributes.normal;for(let d=0;d<u.count;d++)Math.abs(u.getX(d)-h.x)+Math.abs(u.getY(d)-h.y)+Math.abs(u.getZ(d)-h.z)<.001&&p.setXYZ(d,l.x,l.y,l.z);return a}function Rh(i,e,t,n,r={}){let s=vi(i.map(([o,a,l])=>Ee(a,o,l)),r.n||60);return dn(s,r.taper||1,{up:vt(n),scaleN:t/2,scaleB:e/2,sq:r.sq||5,segs:22,capA:!0,capB:!0})}function $p(){let i=document.createElement("canvas");i.width=512,i.height=128;let e=i.getContext("2d"),t=7,n=()=>(t=t*16807%2147483647)/2147483647;e.fillStyle="#b6b6b6",e.fillRect(0,0,512,128),e.filter="blur(5px)";for(let s=0;s<55;s++){let o=n()*512,a=8+n()*34,l=140+Math.floor(n()*90);e.fillStyle=`rgba(${l},${l},${l},${(.12+n()*.14).toFixed(2)})`,e.fillRect(o,-10,a,148),e.fillRect(o-512,-10,a,148)}e.filter="blur(0.7px)";for(let s=0;s<520;s++){let o=n()*512,a=.6+n()*n()*2.6,l=n()<.8,c=l?70+Math.floor(n()*70):200+Math.floor(n()*40),h=n()*128,u=8+n()*n()*110;e.fillStyle=`rgba(${c},${c},${c},${(.1+n()*.24).toFixed(2)})`,e.fillRect(o,h,a,u),e.fillRect(o,h-128,a,u)}e.filter="none";let r=new Ks(i);return r.wrapS=r.wrapT=Br,r.repeat.set(2,1),r.anisotropy=4,r}var et={ZT:9.4,BK:30,TIP:2.4,W0:8.6};et.rho=i=>i<=et.BK?12:i<=62?12+(i-et.BK)*1.6/(62-et.BK):13.6+(i-62)*.5/9;et.face=i=>i<18?Math.pow((18-i)/18,2):0;et.zfP=i=>-et.ZT+1+et.TIP+.45*i+.087*Math.pow(Math.max(0,i-12),2);et.zf=et.zfP;et.arc=i=>{if(i>=3)return 1;let e=0,t=1;for(let n=0;n<30;n++){let r=(e+t)/2;r*r+2*Math.pow(r,12)<i?e=r:t=r}return(e+t)/2};et.w=i=>(et.W0+(12-et.W0)*at(i/et.BK,0,1))*et.arc(i);et.nose=i=>{let e=at(i/1.6,0,1),t=-et.ZT+et.face(i);return t+(et.zf(i)-t)*Math.sqrt(e*(2-e))};function Qp(){let i=[.02,.1,.25,.45,.7,1,1.35,1.75,2.2,2.7,3.3,4],e=160,t=12;for(let a=5;a<42;a+=1.5)i.push(a);for(let a=42;a<60;a+=3)i.push(a);for(let a=60;a<68;a+=1.25)i.push(a);i.push(68,68.6,69.1,69.6,70.1,70.6,71);let n=[],r=[];for(let a of i){let l=et.rho(a),c=a>=38?1:1-Math.pow(1-a/38,2),h=Math.max(.05,(et.W0+(l-et.W0)*c)*et.arc(a)),u=6+(l-6)*c,p=-7*(1-c),d=p+u,f=Math.min(et.zfP(a),et.nose(a)),_=f<d+3,m=_?Math.min(d,f):d,g=-(et.ZT-et.face(a)+(l-et.ZT)*at((a-68.6)/2,0,1)),v=(m+g)/2;for(let x=0;x<e;x++){let b=x/e*Math.PI*2,E=Math.sin(b),w=Math.cos(b),F=v-p,V=E/h*(E/h)+w/u*(w/u),U=2*F*w/(u*u),j=F/u*(F/u)-1,Y=(-U+Math.sqrt(Math.max(0,U*U-4*V*j)))/(2*V),q=Math.pow(Y,-t);w<-1e-4&&(q+=Math.pow((g-v)/w,-t));let Z=Math.pow(q,-1/t);w>1e-4&&_&&(Z=Math.pow(Math.pow(Z,-14)+Math.pow((f-v)/w,-14),-1/14)),n.push(a,Z*E,v+Z*w)}}for(let a=0;a<i.length-1;a++)for(let l=0;l<e;l++){let c=a*e+l,h=a*e+(l+1)%e,u=c+e,p=h+e;r.push(c,u,h,h,u,p)}let s=n.length/3;n.push(0,0,-et.ZT+1.02);for(let a=0;a<e;a++)r.push(s,a,(a+1)%e);let o=new lt;return o.setAttribute("position",new De(n,3)),o.setIndex(r),Ph(o,0,-4)}function ef(){let e=[.55,.6,.7,.85,1.05,1.3,1.6,2,2.5,3.1,3.85,5,6.5,8,10,12,14,16,18,20,22,24];for(let d=25;d<37;d+=.6)e.push(+d.toFixed(2));e.push(38,40,43,47,52,57,62,65,67.4,67.8);let t=44,n=[],r=[],s=[],o=d=>{if(d>=2.4)return 1;let f=0,_=1;for(let m=0;m<30;m++){let g=(f+_)/2;1*g*g+1.4*Math.pow(g,16)<d?f=g:_=g}return(f+_)/2},a=d=>{let f=Math.sin(d*127.1+311.7)*43758.5453;return 2*(f-Math.floor(f))-1},l=d=>.6*a(d)+.4*a(Math.floor(d/3)+50);for(let d of e){let f=6.5-.5*d/67.8,_=Math.max(.001,f*o(d-.55)),m=.12+2.9*Math.pow(_t(.6,34,d),1.25),g=-et.ZT+.09;for(let v=0;v<=t+2;v++){let x,b;v===0||v===t+2?(x=v===0?_:-_,b=g):(x=_*Math.cos((v-1)/t*Math.PI),b=g-m*(.3+.7*Math.sqrt(Math.max(0,1-x/_*(x/_))))),n.push(d,x,b);let E=x/f,w=27-6*E*E,F=_t(-1,1,d-w),V=.3*Math.exp(-Math.pow((d-w-.6)/.6,2)),U=l(Math.min(t,Math.max(1,v))),j=(1+(.05+.12*F)*U)*(1-.13*V)*(v===0||v===t+2?.8:1),Y=1-F*(a(v*31+Math.round(d*3)*7)>.86?.3:0);r.push((1.32-.38*F)*j*Y,(1.19-.35*F)*j*Y,(.86-.28*F)*j*Y)}}let c=t+3;for(let d=0;d<e.length-1;d++)for(let f=0;f<c-1;f++){let _=d*c+f,m=_+1,g=_+c,v=g+1;s.push(_,g,m,m,g,v)}let h=n.length/3,u=(e.length-1)*c;n.push(67.8,0,-et.ZT-1),r.push(.5,.41,.25);for(let d=0;d<c-1;d++)s.push(h,u+d,u+d+1);let p=new lt;return p.setAttribute("position",new De(n,3)),p.setAttribute("color",new De(r,3)),p.setIndex(s),Ph(p,0,-et.ZT+2)}var Ke={U1:{th:-72,R:18.2,s0:224,s1:321.5,r:1.4},Th:{th:219,R:16.6,s0:228,s1:250.6,r:1.15},Gs:{th:35,R:16.9,s0:201.5,s1:224,r:1.6},Eb:{th:56.6,R:17,s0:274.4,s1:294,r:1.2},Cs:{th:-56,R:16.5,s0:304.2,s1:323,r:1.2},L1:{th:-68,R:16.6,s0:345,s1:419.3,r:1.6},Rg:{th:33,lift:2.7,s0:431.5,s1:481,r:1.05},Fs:{th:-6,lift:2.6,s0:449.4,s1:478,r:.95},RF:{th:2,lift:2.6,s0:449.4,s1:551,r:.85},RE:{th:16.4,lift:2.6,s0:449.4,s1:551,r:.9}};for(let i of Object.values(Ke))i.at=e=>ct(e,i.th,i.R!=null?i.R:rt(e)+i.lift),i.a=i.at(i.s0),i.b=i.at(i.s1),i.dir=i.b.clone().sub(i.a).normalize();function tf(){let i=new Fn;i.name="clarinet",i.rotation.z=-Math.PI/2,i.position.y=Ma;let e=$p(),t={silver:new $n({color:15263455,metalness:1,roughness:.07,vertexColors:!0}),satin:new $n({color:14672098,metalness:1,roughness:.22}),wood:new $n({color:4604484,vertexColors:!0,metalness:0,roughness:.66,map:e,clearcoat:.32,clearcoatRoughness:.1,envMapIntensity:1.25}),ebonite:new $n({color:526346,metalness:0,roughness:.2,clearcoat:.7,clearcoatRoughness:.08,envMapIntensity:1.25}),bore:new kn({color:657415,roughness:.8,metalness:0,envMapIntensity:.25,side:ca}),dark:new kn({color:328965,roughness:.95,metalness:0,envMapIntensity:.12,side:ca}),pad:new kn({color:15129792,roughness:.8,metalness:0,envMapIntensity:.9}),cork:new kn({color:12159572,roughness:.9,metalness:0,envMapIntensity:.5}),lig:new $n({color:15132129,metalness:1,roughness:.1}),rest:new $n({color:15263455,metalness:1,roughness:.1}),reed:new kn({color:16777215,roughness:.82,metalness:0,envMapIntensity:1.95,vertexColors:!0})};t.silver.name="silver";let n=["mp","barrel","upper","lower","bell"],r=I=>I<Sr.mpEnd?"mp":I<Sr.barrelEnd?"barrel":I<Sr.upperEnd?"upper":I<Sr.lowerEnd?"lower":"bell",s={},o={};for(let I of n){s[I]=new Fn,s[I].name="joint:"+I,i.add(s[I]),o[I]={};for(let T of Object.keys(t))o[I][T]=[]}let a=(I,T,...B)=>{for(let G of B)Qr(G),T==="silver"&&(I==="upper"||I==="lower")&&!G.userData.plain&&Eh(G),o[I][T].push(G)},l=(I,...T)=>{for(let B of T)B.computeBoundingBox(),a(r((B.boundingBox.min.x+B.boundingBox.max.x)/2),I,B)},c=I=>(I.userData.plain=!0,I);a("mp","ebonite",Qp(),Gt(it([[71,14.1],[71,10.9],[73,10.9],[73,10.6],[86,10.6],[86,10.9],[88,10.9],[88,7.5],[80,7.5]],{segs:56,crease:40}))),a("mp","cork",Gt(it([[73.2,10.6],[73.2,11.25],[85.8,11.25],[85.8,10.6]],{segs:48,crease:40}))),a("mp","dark",Pt(Qn(7.5),Ee(81,0,0),Dt)),a("mp","reed",ef());{let T=et.ZT+3+.3,B=C=>(et.rho(C)+.3+T)/2,G=C=>(et.rho(C)+.3-T)/2,W=163,H=1.4,M=(C,y)=>{let P=B(C)+y,O=G(C),Q=[];for(let me=0;me<=96;me++){let Ae=(-W+2*W*me/96)*gt;Q.push([P*Math.sin(Ae),O+P*Math.cos(Ae)])}let k=[],[te,J]=Q[Q.length-1],X=Math.atan2(-Math.sin(W*gt),Math.cos(W*gt)),ge=-Math.PI/2,ue=10;for(let me=1;me<=ue;me++){let Ae=X+(ge-X)*(me-.5)/ue,Re=H*Math.abs(ge-X)/ue;te+=Math.cos(Ae)*Re,J+=Math.sin(Ae)*Re,k.push([te,J])}let ae=J;for(let me=1;me<=5;me++)J-=.95,k.push([te,J]);return{pts:[...k.map(([me,Ae])=>[-me,Ae]).reverse(),...Q,...k],nEar:k.length,yEar:te,zF:ae}},S=(C,y)=>{let P=(C+y)/2,O=M(P,.6/2),Q=O.pts.length,k=(ge,ue,ae)=>{let me=Math.min(ae,Q-1-ae);return .7+.3*_t(O.nEar-6,O.nEar+4,me)},te=dn(O.pts.map(([ge,ue])=>Ee(P,ge,ue)),k,{up:Dt,scaleN:(y-C)/2,scaleB:.6/2,sq:6,segs:24,capA:!0,capB:!0}),J=ge=>{let ue=M(P,.38);return dn(ue.pts.slice(ue.nEar-4,ue.pts.length-ue.nEar+4).map(([ae,me])=>Ee(ge,ae,me)),.3,{segs:10,capA:!0,capB:!0})},X=[te,J(C+.32),J(y-.32)];for(let ge of X){let ue=ge.attributes.position;for(let ae=0;ae<ue.count;ae++){let me=ue.getX(ae),Ae=(B(me)+.6/2)/(B(P)+.6/2);ue.setY(ae,ue.getY(ae)*Ae),ue.setZ(ae,G(me)+(ue.getZ(ae)-G(P))*Ae)}}for(let ge of[-1,1]){let ue=ge<0?O.pts.slice(0,O.nEar-5).reverse():O.pts.slice(Q-O.nEar+5);X.push(dn(ue.map(([ae,me])=>Ee(P,ae,me)),1,{up:Dt,scaleN:(y-C)/2*.72,scaleB:.9,sq:4,segs:18,capA:!0,capB:!0}))}return{gs:X,L0:O}},N=S(37.6,44.1),L=S(55.7,62.2);a("mp","lig",...N.gs,...L.gs);let A=C=>{let y=[];for(let ae=43.6;ae<=56.21;ae+=.2)y.push(ae);let P=14,O=6,Q=[],k=[];for(let ae of y){let me=B(ae)+.06,Ae=B(ae)+.48,Re=(me+Ae)/2,ye=(Ae-me)/2,Ue=G(ae),He=Math.min(5.95,Math.abs(ae-49.9))/6,Ye=5.6*Math.pow(1-Math.pow(He,2.5),1/2.5),Ce=Math.asin(Ye/Ae)/gt,We=140,$e=ye/Re/gt,qt=[];for(let Mt=0;Mt<=P;Mt++)qt.push([Ce+$e+(We-Ce-2*$e)*Mt/P,Ae]);for(let Mt=1;Mt<O;Mt++){let ot=Math.PI/2-Math.PI*Mt/O;qt.push([We-$e+$e*Math.cos(ot),Re+ye*Math.sin(ot)])}for(let Mt=0;Mt<=P;Mt++)qt.push([We-$e-(We-Ce-2*$e)*Mt/P,me]);for(let Mt=1;Mt<O;Mt++){let ot=-Math.PI/2-Math.PI*Mt/O;qt.push([Ce+$e+$e*Math.cos(ot),Re+ye*Math.sin(ot)])}for(let[Mt,ot]of qt)Q.push(ae,C*ot*Math.sin(Mt*gt),Ue+ot*Math.cos(Mt*gt))}let te=Q.length/3/y.length;for(let ae=0;ae<y.length-1;ae++)for(let me=0;me<te;me++){let Ae=ae*te+me,Re=ae*te+(me+1)%te,ye=Ae+te,Ue=Re+te;k.push(Ae,ye,Re,Re,ye,Ue)}let J=new lt;J.setAttribute("position",new De(Q,3)),J.setIndex(k),J.computeVertexNormals();let X=Math.floor(P/2),ge=Ee().fromBufferAttribute(J.attributes.normal,X),ue=Ee().fromBufferAttribute(J.attributes.position,X);if(ge.y*ue.y+ge.z*(ue.z-G(y[0]))<0){let ae=J.index.array;for(let me=0;me<ae.length;me+=3){let Ae=ae[me+1];ae[me+1]=ae[me+2],ae[me+2]=Ae}J.computeVertexNormals()}return Qr(J)};a("mp","lig",A(1),A(-1));for(let C of[N,L]){let y=(C===N?81.7:117.9)/2,P=Math.abs(C.L0.yEar),O=C.L0.zF-2.2,Q=[[-12.4,0],[-12.4,1.05]];for(let J=-12,X=0;J<P+1.6;J+=.45,X++)Q.push([J,X%2?.98:1.12]);Q.push([P+1.9,.95],[P+2.1,0]);let k=it([[0,0],[0,1.6],[.2,1.9],[.5,2],[.7,3.3],[.9,3.55],[3.5,3.55],[3.8,3.35],[4.6,3],[5.3,2.3],[5.7,1.3],[5.85,0]],{segs:120,crease:40});{let J=k.attributes.position;for(let X=0;X<J.count;X++){let ge=J.getX(X),ue=J.getY(X),ae=J.getZ(X);if(Math.hypot(ge,ae)>3.3&&ue>.85&&ue<3.55){let Ae=1+.045*Math.cos(30*Math.atan2(ae,ge));J.setX(X,ge*Ae),J.setZ(X,ae*Ae)}}k.computeVertexNormals()}let te=J=>Pt(it([[0,0],[0,1.85],[.25,2.15],[2.15,2.15],[2.4,1.85],[2.4,0]],{segs:28,crease:40}),Ee(y,J,O),gi);a("mp","lig",Pt(it(Q,{segs:16,crease:60}),Ee(y,0,O),gi),Pt(k,Ee(y,-12.4,O),gi.clone().negate()),te(P-.7),te(-P-1.7))}for(let C of o.mp.lig){let y=C.attributes.position;for(let P=0;P<y.count;P++){let O=y.getX(P);y.setY(P,y.getY(P)*(et.rho(O)+.05)/B(O))}C.computeVertexNormals()}}a("barrel","wood",Gt(it([[77.2,13.2],[77.2,13.9],...Hl([[77.4,13.9],[86,14.45],[96,15.15],[106,15.55],[118,15.62],[125,15.48],[129.6,15.2]],40),[129.8,14.6]],{segs:72,crease:40}))),a("barrel","silver",c(Gt(it([[71,11.4],[71,14],[71.3,14.25],[72.2,14.25],[72.35,14],[72.5,14.2],[73.3,14.2],[73.45,14],[73.6,14.3],[77,14.3],[77.4,14],[77.4,13.5]],{segs:72,crease:30}))),c(Gt(it([[129.6,14.8],[129.6,15.1],[129.9,15.35],[132.8,15.35],[132.95,15.1],[133.1,15.25],[133.9,15.25],[134.05,15.1],[134.2,15.35],[135.7,15.35],[136,15.05],[136,11.3]],{segs:72,crease:30})))),a("barrel","dark",Gt(it([[71.05,11.4],[89,11.4],[89,7.4]],{segs:40,crease:40})),Gt(it([[135.95,11.3],[118,11.3],[118,7.4]],{segs:40,crease:40})),Pt(Qn(7.4),Ee(100,0,0),Dt));let h=(I,T)=>{let B=[I[0]];for(let G=1;G<I.length;G++){let[W,H]=I[G-1],[M,S]=I[G],N=Math.max(1,Math.round(Math.abs(M-W)/T));for(let L=1;L<=N;L++)B.push([W+(M-W)*L/N,H+(S-H)*L/N])}return B},u=Gt(it(h([[118.5,7.5],[118.5,10.7],[118.9,11],[136,11],[136,14.2],[136.3,14.45],[325.7,14.45],[326,14.2],[326,11],[343.6,11],[344,10.7],[344,7.5]],1.5),{segs:120,crease:40}));u.userData.tube=!0,a("upper","wood",u),a("upper","cork",Gt(it([[121.5,11],[121.5,11.28],[132.5,11.28],[132.5,11]],{segs:48,crease:40})),Gt(it([[329.5,11],[329.5,11.28],[340.5,11.28],[340.5,11]],{segs:48,crease:40}))),a("upper","dark",Pt(Qn(7.5),Ee(118.4,0,0),Dt),Pt(Qn(7.5),Ee(344.1,0,0),Dt));let p=Gt(it(h([[333.8,14],[333.8,14.35],[566,15.65],[566,11.6],[583.6,11.6],[584,11.3],[584,7.6]],1.5),{segs:120,crease:40}));p.userData.tube=!0,a("lower","wood",p),a("lower","cork",Gt(it([[569.5,11.6],[569.5,11.88],[580.5,11.88],[580.5,11.6]],{segs:48,crease:40}))),a("lower","silver",c(Gt(it([[326,11.4],[326,14.55],[326.3,14.8],[329.2,14.8],[329.35,14.55],[329.5,14.9],[330.4,14.9],[330.55,14.65],[330.7,15.05],[333.6,15.05],[334,14.7],[334,14.3]],{segs:72,crease:30})))),a("lower","dark",Gt(it([[326.05,11.4],[344.5,11.4],[344.5,7.5]],{segs:40,crease:40})),Pt(Qn(7.5),Ee(352,0,0),Dt),Pt(Qn(7.6),Ee(584.1,0,0),Dt));let d=Sr.lowerEnd;a("bell","wood",Gt(it([[d+6.3,15],[d+6.3,15.45],...Hl([[d+6.5,15.45],[d+22,16.4],[d+40,18.3],[d+58,20.7],[d+71,22.9],[d+78,24.7],[d+86,27.6],[d+90,29.7],[d+93,31.8],[d+96,34.9],[d+98.2,37],[d+100.5,37.7],[d+103.4,37.75],[d+104.2,37],[d+104.4,35.6]],90),...Hl([[d+104.4,35.6],[d+104.1,34.2],[d+102,32.2],[d+97,29],[d+91,25.8],[d+84,22.9],[d+76,20.3],[d+64,17.7],[d+46,15.2],[d+28,13.2],[d+19,12.3]],60)],{segs:96,crease:40}))),a("bell","bore",Gt(it([[d+19,12.3],[d+19,11.8],[d+.05,11.8]],{segs:72,crease:40}))),a("bell","dark",Pt(Qn(12.2),Ee(d+22,0,0),Dt)),a("bell","silver",c(Gt(it([[d+100.2,37.25],[d+100.2,37.9],[d+100.4,38.15],[d+100.9,38.2],[d+101.05,38.05],[d+101.2,38.22],[d+103.6,38.5],[d+104.3,38.3],[d+104.7,37.8],[d+104.85,37],[d+104.85,35.25],[d+104.62,34.85],[d+103.8,34.8]],{segs:128,crease:35})))),a("bell","silver",c(Gt(it([[d,11.8],[d,15.8],[d+.3,16.05],[d+1.1,16.05],[d+1.25,15.8],[d+1.4,15.95],[d+2.2,15.95],[d+2.35,15.8],[d+2.5,16.15],[d+6.1,16.15],[d+6.5,15.8],[d+6.5,15.4]],{segs:72,crease:30}))));{let I=T=>(B,G,W)=>Ee(G,-B,-(rt(G)+(typeof T=="function"?T(B,G):T)+W));l("rest",wr([[-4,338],[4,338],[4.4,349],[-4.4,349]],[0,343.5],I(.5),{thick:1.6,dome:.1,edge:.2})),l("rest",wr([[-4.4,347.6],[4.4,347.6],[6.8,350.6],[8.6,354.8],[8,357.6],[0,359],[-8,357.6],[-8.6,354.8],[-6.8,350.6]],[0,353],I((T,B)=>1+9.5*Math.pow(_t(347.6,360,B),1.4)+.025*T*T),{thick:2.2,dome:0,edge:.3}));for(let T of[341,345.6])l("silver",Pt(it([[0,0],[0,1.15],[.5,1.15],[.7,.9],[.7,0]],{segs:16,crease:40}),ct(T,180,rt(T)+1),vt(180)))}let f={},_=[],m=[],g=(I,T)=>{let B=new Fn;B.name=I,B.position.copy(T.pivot);let G=s[T.joint||r(T.s)];G.add(B);let W=t.silver.clone();W.name="key:"+I,W.clearcoat=.001,W.roughness=.07,W.color.set(15263455),W.vertexColors=!0;let H={id:I,group:B,pivot:T.pivot.clone(),sign:1,angle:(T.angle||4)*gt,mat:W,meshes:[],x:0,v:0,to:0,paint:0,paintTo:0,colTo:new je(15790321),out:T.out||vt(0),anchor:T.anchor||T.pivot.clone(),xMid:T.s,joint:G,axis:T.axis||null,rot:0,size:T.size||4,restUp:!!T.restUp,cups:[]};return f[I]=H,H},v=(I,T,...B)=>{for(let G of B){let W=Qr(G);T==="key"&&Eh(W),W.translate(-I.pivot.x,-I.pivot.y,-I.pivot.z);let H=new Ut(W,T==="key"?I.mat:t[T]);H.name=I.id+":"+T,I.group.add(H),I.meshes.push(H)}},x=(I,T,B)=>{let G=T.clone().sub(I.pivot),W=G.clone().applyAxisAngle(I.axis||Dt,.01).sub(G);I.sign=W.dot(B)>=0?1:-1},b=(I,T,B,G)=>g(I,Object.assign({pivot:T.at(B),axis:T.R!=null?null:T.dir,s:B},G)),E=(I,T,B,G=.6)=>I.R==null?xn(I.at(T),I.at(B),I.r+G,18):Gt(it([[T,0],[T,I.r+G-.25],[T+.3,I.r+G],[B-.3,I.r+G],[B,I.r+G-.25],[B,0]],{segs:18,crease:40})).translate(0,I.at(T).y,I.at(T).z),w=(I,T,B,G=80)=>{let W=Th(B,T),H=mi(I,T,W+1,G);return{th:H,s:T,r:B,sh:W,n:vt(H),seat:ct(T,H,rt(T)+W),top:ct(T,H,rt(T)+W+zi(B))}},F=(I,T,B)=>{let G=Th(B,T);return{th:I,s:T,r:B,sh:G,n:vt(I),seat:ct(T,I,rt(T)+G),top:ct(T,I,rt(T)+G+zi(B))}},V=(I,T)=>{v(I,"key",Pt(Xp(T.r),T.seat.clone(),T.n)),v(I,"pad",Pt(qp(T.r),T.seat.clone(),T.n)),l("wood",Pt(Yp(T.r),T.seat.clone(),T.n)),l("dark",Pt(Qn(T.r*.5),T.seat.clone().addScaledVector(T.n,-1.55),T.n)),I.cups.push(T),m.push({p:I,c:T})},U=(I,T)=>.3+.7*_t(0,.4,I/T),j=(I,T,B,G=3.2,W=1.5)=>{let H=T-I.th;for(;H>180;)H-=360;for(;H<-180;)H+=360;let M=_i(I.th).multiplyScalar(Math.sign(H)||1),S=I.top,N=S.clone().addScaledVector(M,I.r*1.04).addScaledVector(I.n,-.5),L=Math.atan2(N.y,N.z)/gt,A=Math.hypot(N.y,N.z),C=I.th+H-L;for(;C>180;)C-=360;for(;C<-180;)C+=360;let y=[S.clone().addScaledVector(I.n,.3),S.clone().addScaledVector(M,I.r*.5).addScaledVector(I.n,.3),S.clone().addScaledVector(M,I.r*.86).addScaledVector(I.n,.05),N];for(let P=1;P<=6;P++){let O=P/6;y.push(ct(I.s,L+C*O,Math.max(rt(I.s)+1.5,A+(B-A)*_t(0,1,O))))}return dn(vi(y,40),(P,O)=>.1+.9*_t(0,.3,P/O),{up:Dt,scaleN:G/2,scaleB:W/2,sq:5,segs:22,capA:!0,capB:!0})},Y=(I,T,B,G={})=>{let W=b(I,B,T.s,{angle:G.angle||6,out:T.n,anchor:T.top.clone(),size:T.r,restUp:!0});V(W,T);let H=B.at(T.s),M=Math.hypot(H.y,H.z)+(G.lug||0);return v(W,"key",j(T,B.th,M,G.w||3.2),E(B,T.s-3.2,T.s+3.2)),G.lug&&v(W,"key",xn(H,ct(T.s,B.th,M),1.1,12)),x(W,T.seat,T.n),W},q=(I,T,B,G,W,H,M,S={})=>{let N=S.th!=null?S.th:mi(T,B,0),L=vt(N),A=ct(B,N,rt(B));M?(l("wood",Pt(it([[-3,W-.4],[.9,W-.4],[1.2,W-.7],[1.2,H+.4],[.8,H],[-.3,H]],{segs:40,crease:40}),A.clone(),L)),l("dark",Pt(Qn(H+.05),A.clone().addScaledVector(L,.28),L))):l("dark",jp(B,N,H));let C=new Ut(Qr(Pt(it([[0,W-.6],[.5,W-.75],[.9,W*.6],[1.05,0]],{segs:32}),A.clone().addScaledVector(L,M?1.2:.75),L)),new kn({color:16777215,roughness:.55,metalness:0,transparent:!0,opacity:0,depthWrite:!1}));if(C.visible=!1,C.name="finger:"+I,C.renderOrder=1,s[r(B)].add(C),_.push({id:I,mesh:C,mat:C.material,s:B,a:0,to:0}),!M)return g(I,{pivot:A.clone(),s:B,out:L,anchor:A.clone().addScaledVector(L,1.4),size:W,angle:0});let y=b(I,M,B,{angle:S.angle||3.4,out:L,anchor:A.clone().addScaledVector(L,1.6),size:G,restUp:!0});v(y,"key",Pt(Wp(G,W),A.clone().addScaledVector(L,-.3),L));let P=M.at(B),O=P.clone().sub(A);O.addScaledVector(L,-O.dot(L)).normalize();let Q=A.clone().addScaledVector(O,G-.5).addScaledVector(L,.5),k=dn(vi([A.clone().addScaledVector(O,W+.15).addScaledVector(L,1.45),A.clone().addScaledVector(O,(W+G)/2+.6).addScaledVector(L,1.55),Q.clone().addScaledVector(L,.25)],16),(te,J)=>.2+.8*_t(0,J*.85,te),{up:L,scaleN:.85,scaleB:1.3,sq:2.6,segs:16,capA:!0,capB:!0});return v(y,"key",Zp(B,Math.atan2(Q.y,Q.z)/gt,Math.hypot(Q.y,Q.z),M.th,Math.hypot(P.y,P.z),2.6,1.9,{clear:1.2,sq:2.6,taper:(te,J)=>.85+.4*_t(.3*J,J,te)}),k,E(M,B-4,B+4)),x(y,A,L),y},Z=(I,T,B,G,W)=>{let H=g(I,Object.assign({out:W,anchor:G},T));return v(H,"key",...B),x(H,G,W.clone().negate()),H},K=(I,T,B={})=>{l("silver",xn(I.a,I.b,I.r));for(let G of T){let W=I.at(G),H=Math.max(2.5,(B.ball||I.r+.95)*1.1);if(l("silver",...ei(G,I.th,Math.hypot(W.y,W.z),{ball:B.ball||I.r+.95})),Math.abs(G-I.s0)<.01||Math.abs(G-I.s1)<.01){let M=I.dir.clone().multiplyScalar(Math.abs(G-I.s0)<.01?-1:1),S=vt(I.th),N=M.clone().cross(S).normalize(),L=new ui(.55,.5,H*1.5),A=new Xe().makeBasis(N,M,S);A.setPosition(W.clone().addScaledVector(M,H*Math.sqrt(1-.16)-.05)),L.applyMatrix4(A),l("dark",L)}}};K(Ke.U1,[225.3,257.5,280.5,322.6]),K(Ke.Th,[228,250.6],{ball:2}),K(Ke.Gs,[201.5,224]),K(Ke.Eb,[274.4,294]),K(Ke.Cs,[304.2,323]);{let[I,T]=mt(340.5,1175);q("L1",I,T,6.2,4.7,2.75,Ke.U1)}{let[I,T]=mt(329.2,1447.5);q("L2",I,T,7.1,5.4,3.3,Ke.U1)}{let[I,T]=mt(361.7,1639.3);q("L3",I,T,0,4.9,4,null)}q("T",0,239.5,7.7,5.9,3.5,Ke.Th,{th:180});{let[I,T]=mt(351,987);Y("P",w(I,T,4.5),Ke.U1)}{let[I,T]=mt(334,1329),B=Y("Ev",w(I,T,5.2),Ke.U1);v(B,"key",Gl([[-72,18.2,316],[-72,19.5,322.5],[-72,19.75,335.5]],4.4,1.2),E(Ke.U1,312,320))}{let I=mt(0,910)[1],T=4.3,B=ct(I,0,rt(I)+T),G=Ln(mt(289,910)[0],I,T),W=Ln(mt(392,910)[0],I,T);l("silver",xn(G,W,1.15),...ei(I,mi(mt(289,910)[0],I,T),G.length()>0?Math.hypot(G.y,G.z):18,{ball:2.3}),...ei(I,mi(mt(392,910)[0],I,T),Math.hypot(W.y,W.z),{ball:2.3}));let[H,M]=mt(341.5,759),S=w(H,M,5.2),N=xa(_a([[356,925],[358,945],[372,985],[381,1020],[382,1045],[373,1070],[358,1085],[343,1090],[325,1085],[310,1070],[301,1045],[301,1020],[310,985],[322,945],[328,925]]),7.2,{thick:1.9,dome:.28,edge:.22,NE:10}),L=Ah([[H,M+.5,S.sh+zi(5.2)-.3],[H,M+8,5.4],[H,I-3,4.6],[H,I+3,4.9],[H,I+9,7]],3.4,1.5),A=Ln(mt(342,1040)[0],mt(342,1040)[1],8.1),C=Z("A",{pivot:B,axis:gi.clone(),angle:7.5,s:I,size:5},[N,L,xn(Ln(H-4.4,I,T),Ln(H+4.4,I,T),1.8)],A,vt(0));V(C,S),v(C,"key",Pt(it([[0,0],[0,1.7],[.9,1.7],[1.15,1.35],[1.15,0]],{segs:18,crease:40}),Ln(H,mt(0,822)[1],5.9),vt(0)))}{let I=Ke.Gs,[T,B]=mt(266,845),G=w(T,B,4.9),W=rt(B),H=dn(vi([ct(B,G.th,W+G.sh+zi(4.9)-.3),ct(B,G.th+16,W+5.6),ct(B,-4,W+7.4),ct(B,15,W+6.2),ct(B,I.th,I.R)],30),U,{up:Dt,scaleN:1.5,scaleB:.65,sq:3,segs:14,capA:!0,capB:!0}),M=_a([[441,846],[454,846],[463,905],[483,955],[503,995],[516,1035],[521,1085],[517,1135],[505,1168],[490,1177],[470,1165],[455,1140],[448,1100],[449,1050],[451,1010],[450,965],[445,900]]),S=ya(M,mt(478,1050),10.5,38,{thick:2,dome:.3,edge:.2,NE:10}),N=vt(38),L=Ee(mt(486,1080)[1],mt(486,1080)[0],10).addScaledVector(N,1.2),A=Z("Gs",{pivot:I.at(B),angle:6.5,s:B,size:5},[H,S,E(I,I.s0+1.6,I.s1-1.6)],L,N);V(A,G)}{let I=Ke.Eb,T=F(86,mt(0,1460)[1],4.4),B=xa(_a([[303,1555],[318,1545],[357,1530],[400,1517],[428,1503],[446,1488],[462,1492],[448,1512],[433,1520],[395,1540],[357,1556],[317,1563]]),3.3,{c:mt(385,1532),thick:1.3,dome:.3}),G=Ln(mt(330,1550)[0],mt(330,1550)[1],4.1),W=Z("Eb",{pivot:I.at(T.s),angle:6,s:T.s,size:3},[B,E(I,I.s0+1.5,I.s1-1.5),j(T,I.th,I.R,2.8,1.3)],G,vt(mi(mt(330,1550)[0],mt(330,1550)[1],3.3)));V(W,T)}{let I=Ke.Cs,T=F(-122,311,4.6),B=Ah([[-13.6,309.5,2.3],[-13.2,315.5,2.6],[-11.4,319.4,3],[-7.5,321.2,3.3],[0,321.7,3.5],[8,320.7,3.8],[13.5,319.2,4.2]],3.3,2),G=xa(_a([[430,1700],[455,1692],[480,1690],[500,1696],[513,1708],[514,1726],[503,1748],[485,1762],[455,1764],[430,1750],[420,1728]]),4.3,{thick:1.9,dome:.28,edge:.22,NE:10}),[W,H]=mt(478,1727),M=Ln(W,H,5.2),S=Z("LCs",{pivot:I.at(313),angle:5.5,s:313,size:4.5},[B,G,E(I,I.s0+1.5,I.s1-1.5),j(T,I.th,I.R,2.8,1.3)],M,vt(mi(W,H,4.3)));V(S,T)}{let I=(B,G,W,H,M,S,N,L,A=4.4,C=null,y=null)=>{let P=Gl([[G.th,rt(G.s)+G.sh+zi(G.r)-.3,G.s],...W],A,1.4,{taper:(ue,ae)=>.55+.45*_t(0,.1,ue/ae),face:C}),O=W[W.length-1],Q=ct(O[2],O[0],O[1]),k=[P],te=(ue,ae)=>dn(vi([Q,Q.clone().lerp(ue,.5).add(Ee(0,-.5,.5)),ue],24),(me,Ae)=>.85+.3*_t(.45*Ae,Ae,me),{up:vt(-45),scaleN:.8,scaleB:ae/2,sq:4,segs:18,capA:!0,capB:!0}),J,X;if(H.block){let ue=Ee(...H.block);X=vt(H.face),k.push(te(ue,4)),k.push(dn([ue.clone().add(Ee(-1.8,0,0)),ue.clone().add(Ee(1.8,0,0))],1,{up:X,scaleN:1.5,scaleB:2.2,sq:4,segs:20,capA:!0,capB:!0}));let ae=ue.clone().addScaledVector(X,2.9);k.push(xn(ue,ae.clone().addScaledVector(X,.2),1.25,16),Jp(ae,H.face,H.len,H.wid,H.H)),J=ae.clone().addScaledVector(X,H.H)}else{let ue=H.face,ae=_i(ue),me=1/Math.cos(ue*gt),Ae=H.c[0],Re=(Ue,He)=>Ee(He,Ae,H.z0).addScaledVector(ae,(Ue-Ae)*me);X=vt(ue);let ye=[];for(let Ue=0;Ue<40;Ue++){let He=Ue/40*Math.PI*2,Ye=Math.cos(He),Ce=Math.sin(He);ye.push([H.c[0]+H.wid/2*Math.sign(Ye)*Math.pow(Math.abs(Ye),.85),H.c[1]+H.len/2*Math.sign(Ce)*Math.pow(Math.abs(Ce),.85)])}k.push(ya(ye,H.c,H.z0,ue,{thick:2,dome:0,edge:.2,NT:112,NR:12,NE:8,top:(Ue,He,Ye)=>-.35*(1-Ye*Ye)})),k.push(te(Re(H.at[0],H.at[1]).addScaledVector(X,-1),3.6)),J=Re(H.c[0],H.c[1]).addScaledVector(X,1)}let ge=Z(B,{pivot:ct(M,S,N),axis:_i(y??C??S),angle:L,s:M,joint:"upper",size:3.6},k,J,X);return V(ge,G),l("silver",ei(M,S,N-.5)[0]),ge};I("S1",F(-75,mt(0,467)[1],5),[[-80,14.45+4.6,172],[-85.2,19.8,198],[-85.2,19.8,300],[-85.2,20.4,306]],{block:[319.4,-26.6,2.6],face:-50,len:7,wid:6.6,H:2.6},256,-85.2,19.8,1.7,4.5,-45),I("S2",F(-112,mt(0,791)[1],4.6),[[-104,14.45+5.2,211],[-94.1,23.1,222],[-94.1,23.1,300],[-94,23.4,309]],{block:[326.4,-27,1.4],face:-50,len:7,wid:6.6,H:2.6},262,-94.1,23.1,2.2,4.5,-45),I("S3",F(-100,262,4.3),[[-100,17.7,269],[-100,17.5,316],[-96,19.4,322]],{c:[-27.6,332.9],len:9,wid:7,z0:2.2,face:-45,at:[-26.4,330.2]},300,-100,17.5,3.4,4,-45,-100),I("S4",F(-84,288.7,4.3),[[-84,17.4,295.5],[-84,17.2,318],[-84,18.3,328]],{c:[-25.8,341.8],len:9,wid:7.4,z0:2.8,face:-45,at:[-24.8,339]},316,-84,17.2,4.4,4,-45,-84)}{let B=ct(197,180,rt(197)+3.3),G=L=>(A,C,y)=>Ee(C,-A,-(rt(C)+L(C)+y)),W=F(180,155.6,5),H=wr([[-1.7,159],[.5,159],[.6,201],[2.6,212],[3.3,222],[1.6,229],[-.7,230.4],[-3,229],[-4.3,222],[-3.2,212],[-1.6,201]],[-.5,204],G(L=>3+2.2*_t(200,228,L)),{thick:1.5,dome:.35,edge:.2}),M=Ee(197,3.8,-(rt(197)+3.3)),S=Ee(197,-9.6,-(rt(197)+3.3-2.2));l("silver",xn(M,S,1.1),...ei(197,180-Math.atan2(3.8,rt(197)+3.3)/gt,Math.hypot(M.y,M.z),{ball:2}),...ei(197,180+Math.atan2(9.6,rt(197)+3.3-2.2)/gt,Math.hypot(S.y,S.z),{ball:2.1}));let N=Z("R",{pivot:B,axis:gi.clone(),angle:5.5,s:197,size:4},[H,xn(Ee(197,2.4,B.z),Ee(197,-2.6,B.z),1.7)],ct(222,180,rt(222)+6.2),vt(180));V(N,W),l("silver",Pt(it([[-2,2],[1.3,2],[1.45,1.8],[1.45,1.3]],{segs:20,crease:40}),ct(W.s,180,rt(W.s)),vt(180)))}K(Ke.L1,[345,419.3]);{let[I,T]=Et(295.7,236.7),B=Y("C",w(I,T,6.4),Ke.L1);v(B,"key",Gl([[-68,16.6,351],[-70,17.5,343],[-72,18.3,337],[-72,18.35,330.5]],4.4,1.2))}{let[I,T]=Et(293.7,351.7);q("R1",I,T,7.86,6.1,4.2,Ke.L1)}{let[I,T]=Et(295.7,545.7);q("R2",I,T,7.7,6,3.96,Ke.L1)}{let[I,T]=Et(295,715);q("R3",I,T,8.5,6.6,4.5,Ke.L1)}{let I=Ke.L1,T=wh([[186,601],[205,603],[250,612],[320,624],[333,627],[338,633],[333,640],[320,642],[243,632],[205,626],[186,624]]),[B,G]=Et(300,630),W=Et(0,612)[1];Z("BF",{pivot:I.at(W),angle:5,s:W,size:2.6},[xa(T,3.3,{c:Et(262,622),thick:1.3,dome:.3}),E(I,W-2.6,W+2.6)],Ln(B,G,4.1),vt(mi(B,G,3.3)))}{let I=({tip:W,wide:H,neck:M,w:S,wn:N},L)=>L<=H?S/2*Math.sqrt(Math.max(0,1-Math.pow((H-L)/(H-W),2))):N/2+(S-N)/2*(1+Math.cos(Math.PI*at((L-H)/(M-H),0,1)))/2,T=({tip:W,wide:H,neck:M,cT:S,cN:N,w:L,wn:A})=>{let C=O=>S+(N-S)*at((O-W)/(M-W),0,1),y=[],P=[];for(let O=1;O<=9;O++){let Q=O/9*Math.PI/2,k=H-(H-W)*Math.cos(Q),te=L/2*Math.sin(Q);y.push([C(k)+te,k]),P.push([C(k)-te,k])}for(let O=1;O<=10;O++){let Q=O/10,k=H+(M-H)*Q,te=A/2+(L-A)/2*(1+Math.cos(Math.PI*Q))/2;y.push([C(k)+te,k]),P.push([C(k)-te,k])}return[[C(W),W],...y,[C(M),M+.5],...P.reverse()]},B=(W,H,M,S,N,L,A,C=[],y={})=>{let P=T(H),O=[H.cT+(H.cN-H.cT)*(H.wide-H.tip)/(H.neck-H.tip),H.wide],Q=O[0],k=vt(S),te=_i(S),J=1/Math.cos(S*gt),X=Re=>2.4*Math.pow(_t(H.neck,H.tip,Re),2),ge=(Re,ye,Ue)=>Ee(ye,Q,M).addScaledVector(te,(Re-Q)*J).addScaledVector(k,Ue+X(ye)),ue=Re=>H.cT+(H.cN-H.cT)*at((Re-H.tip)/(H.neck-H.tip),0,1),ae=(Re,ye)=>{let Ue=at(Math.abs(Re-ue(ye))/Math.max(.3,I(H,ye)),0,1);return 1.1*(1-Ue*Ue)*(1-.6*_t(H.wide,H.neck,ye))},me=wr(P,O,ge,{thick:2,dome:0,edge:.18,NE:8,NT:128,NR:14,top:(Re,ye)=>ae(Re,ye)}),Ae=N.map(([Re,ye,Ue])=>{let He=Et(Re,ye);return[He[0],He[1],Ue]});return Z(W,{pivot:Ee(L,A[0],A[1]),axis:_i(55),angle:2.6,s:L,joint:"lower",size:4},[me,Rh(Ae,4.4,1.8,60,Object.assign({sq:4},y)),...C],ge(O[0],O[1],1.6),k)},G=(W,H,M)=>{let S=Math.atan2(H,M)/gt,N=Math.atan2(9.9,14.3)/gt,L=Math.hypot(H,M),A=Math.hypot(9.9,14.3),C=[];for(let y=0;y<=16;y++){let P=y/16,O=_t(0,1,P);C.push(ct(W-17*(1-P)*(1-.35*P),S+(N-S)*O,L+(A-L)*O+.9*Math.sin(Math.PI*P)))}return dn(vi(C,40),1,{up:vt(60),scaleN:.9,scaleB:2.2,sq:4,segs:20,capA:!0,capB:!0})};B("LF",{tip:324.6,wide:328.6,neck:333.6,cT:24.6,cN:23.6,w:8,wn:3},3,35,[[452,112,3.2],[454,200,1.4],[448,300,.4],[434,400,.6],[421,519,2.4]],Et(0,400)[1],[20.6,.6],[],{taper:(W,H)=>1-.6*_t(.7,1,W/H)}),B("LFs",{tip:334.4,wide:340.2,neck:357.6,cT:26.4,cN:25.9,w:6.6,wn:3},2.5,40,[[470,285,2.8],[462,360,3],[450,440,3.4],[438,510,3.8],[425,590,4],[417,700,4],[417,752,4]],Et(0,571)[1],[20.1,3.9],[G(Et(0,870)[1],18.4,4)]),B("LE",{tip:327,wide:333.4,neck:351.2,cT:17.6,cN:20.6,w:7,wn:3},10.3,40,[[432,238,8.2],[436,300,7.4],[430,380,7],[420,470,6.6],[408,560,6.2],[402,640,6],[402,733,6]],Et(0,519)[1],[18.1,6.4],[G(Et(0,847)[1],16.4,6)]);for(let[W,H]of[[519,6.4],[571,3.9]]){let M=Et(0,W)[1];l("silver",...ei(M,80,rt(M)+4.6,{ball:2.4}),xn(ct(M,80,rt(M)+4.4),Ee(M,17.6,H),1,12))}}{let I=B=>B.map(([G,W,H])=>{let M=Et(G,W);return[M[0],M[1],H]}),T=(B,G,W,H,M,S,N,L,A=[],C={})=>{let y=N.map(([Q,k,te])=>{let J=Et(Q,k);return[J[0],J[1],te]}),P,O;if(Array.isArray(W))O=Et(H[0],H[1]),P=ya(wh(W),O,M,S,{thick:2.2,dome:.3,edge:.2,bow:.006,NT:144,NR:12,NE:10});else{let Q=Kp(Et(...W.tip),Et(...W.neck),W.w,W.wn);O=Q.centre,P=ya(Q.pts,O,M,S,{thick:2.3,dome:0,edge:.13,bow:.006,NT:144,NR:14,NE:8,top:(k,te)=>Q.crown(k,te,.32)})}return Z(B,{pivot:G.at(L),axis:G.dir.clone(),angle:C.angle||4.5,s:L,size:5},[P,Rh(y,3.4,2.4,S,{sq:3.2}),...A],Ee(O[1],O[0],M).addScaledVector(vt(S),1.2),vt(S))};K(Ke.Rg,[431.5,469.7,481],{ball:1.9}),l("silver",xn(Ke.Fs.a,Ke.Fs.b,Ke.Fs.r),xn(Ke.RF.a,Ke.RF.b,Ke.RF.r),xn(Ke.RE.a,Ke.RE.b,Ke.RE.r));for(let B of[449.4,510.5,551])l("silver",...ei(B,8.8,rt(B)+2.6,{ball:2.5}));for(let B of[449.4,478])l("silver",...ei(B,-6,rt(B)+2.6,{ball:1.9}));T("RFs",Ke.Fs,{tip:[88,789],neck:[251,844],w:10.2,wn:5},null,14.6,-25,[[226,834,17.2],[244,838,17.7],[262,880,18],[270,930,18],[270,962,17.7]],462,[E(Ke.Fs,450.5,476.8,.35)]),T("RE",Ke.RE,{tip:[49,864],neck:[230,921],w:10.2,wn:5},null,14.8,-25,[[206,925,17.4],[224,932,17.4],[262,958,17.4],[296,970,17.6],[309.7,994,17.4]],500,[E(Ke.RE,451,550,.7)]);{let B=Ke.Rg,G=Et(409,953)[1],W=F(80,G,6.4),H=B.at(G),M=T("RGs",B,{tip:[172,807],neck:[344,862],w:10,wn:5},null,21.1,-12,[[318,848,21.6],[334,852,21.8],[346,890,20.6],[347,930,18.4],[347,953,16.2]],G,[E(B,441.5,452),j(W,B.th,Math.hypot(H.y,H.z),3,1.4)]);V(M,W)}T("RF",Ke.RF,{tip:[158,879],neck:[346,943],w:10,wn:5},null,22.4,-12,[[320,939,22.6],[334,948,21.4],[322,985,18.6],[295,1003,17.4]],500,[E(Ke.RF,451,550,.7)]);{let[B,G]=Et(174,1155);Y("Fs",w(B,G,8.6),Ke.Fs,{angle:7.5,w:3.4})}{let[B,G]=Et(400,1387);Y("F",w(B,G,8.6),Ke.RF,{angle:7.5,w:3.4,lug:1.9})}{let[B,G]=Et(168,1670);Y("E",w(B,G,8.6),Ke.RE,{angle:7.5,w:3.4,lug:1.9})}}{let I=performance.now(),T=3,B=40,G=new Map,W=[],H=(N,L,A)=>(N*64+L+B)*64+A+B,M=(N,L)=>{let A=N.attributes.position;for(let C=0;C<A.count;C+=1){let y=A.getX(C)+L.x,P=A.getY(C)+L.y,O=A.getZ(C)+L.z;if(y<128||y>572||Math.hypot(P,O)>rt(y)+7)continue;let Q=H(Math.floor(y/T),Math.floor(P/T),Math.floor(O/T)),k=G.get(Q);k||G.set(Q,k=[]),k.push(W.length),W.push(y,P,O)}},S=Ee(0,0,0);for(let N of["upper","lower"])for(let L of[...o[N].silver,...o[N].satin])M(L,S);for(let N of Object.values(f))for(let L of N.meshes)M(L.geometry,N.pivot);for(let N of["upper","lower"])for(let L of o[N].wood){let A=L.attributes.position,C=new Float32Array(A.count*3);for(let y=0;y<A.count;y++){let P=A.getX(y),O=A.getY(y),Q=A.getZ(y),k=Math.floor(P/T),te=Math.floor(O/T),J=Math.floor(Q/T),X=36;for(let ae=-2;ae<=2;ae++)for(let me=-2;me<=2;me++)for(let Ae=-2;Ae<=2;Ae++){let Re=G.get(H(k+ae,te+me,J+Ae));if(Re)for(let ye of Re){let Ue=W[ye]-P,He=W[ye+1]-O,Ye=W[ye+2]-Q,Ce=Ue*Ue+He*He+Ye*Ye;Ce<X&&(X=Ce)}}let ge=Math.sqrt(X),ue=1-.45*Math.pow(1-_t(.2,4.5,ge),1.2)-.15*(1-_t(1,8,ge));C[y*3]=C[y*3+1]=C[y*3+2]=ue}L.setAttribute("color",new zt(C,3))}i.userData.aoMs=Math.round(performance.now()-I)}let ce=[];for(let[I,T]of Object.entries(o))for(let[B,G]of Object.entries(T)){if(!G.length)continue;let W=new Ut(Sh(G),t[B]);W.name=I+":"+B,s[I].add(W),ce.push(W)}for(let I of Object.values(f)){let T=new Map;for(let G of I.meshes)T.has(G.material)||T.set(G.material,[]),T.get(G.material).push(G);let B=[];for(let[G,W]of T){let H=Sh(W.map(S=>S.geometry)),M=new Ut(H,G);M.name=W[0].name;for(let S of W)I.group.remove(S);I.group.add(M),B.push(M)}I.meshes=B,ce.push(...B)}i.updateMatrixWorld(!0);let le=(I,T=0,B=0)=>Ee(I,T,B).applyMatrix4(i.matrix),pe=[{id:"mp",a:le(30),b:le(70),r:12.5},{id:"body",a:le(72),b:le(640),r:14.2},{id:"bell",a:le(645),b:le(668),r:25}],ie=[{obj:s.mp,a:Ee(34,0,0),u:Dt.clone(),r:12.8,L:37},{obj:s.barrel,a:Ee(71,0,0),u:Dt.clone(),r:14.8,L:65},{obj:s.upper,a:Ee(136,0,0),u:Dt.clone(),r:14.45,L:190},{obj:s.lower,a:Ee(326,0,0),u:Dt.clone(),r:14.9,L:240},{obj:s.bell,a:Ee(566,0,0),u:Dt.clone(),r:17,L:74}],ve=ie.length;for(let{p:I,c:T}of m)ie.push({obj:I.group,a:T.seat.clone().sub(I.pivot),u:T.n,r:T.r,L:zi(T.r)});return{root:i,M:t,parts:f,meshes:ce,capsules:pe,joints:s,jointOf:r,refl:ie,nBody:ve,fingers:_}}function nf(i){let e=l=>i.has(l),t=new Set,n=new Set,r=e("LE")||e("RE"),s=e("LF")||e("RF"),o=e("LFs")||e("RFs"),a=(e("R1")||e("R2"))&&!e("BF");return(e("T")||e("L1"))&&t.add("P"),a&&t.add("C"),(e("L2")||a)&&t.add("Ev"),(r||s||o)&&t.add("Fs"),(r||s)&&t.add("F"),r&&t.add("E"),e("A")&&n.add("Gs"),{closed:t,moved:n}}var rf=[["T","LT","Thumb ring"],["R","LT","Register",!0],["A","L1","A",!0],["Gs","L1","G\u266F",!0],["L1","L1","E"],["L2","L2","D"],["Eb","L2","E\u266D / B\u266D",!0],["L3","L3","C"],["LCs","L4","C\u266F / G\u266F",!0],["LF","L4","F / C",!0],["LFs","L4","F\u266F / C\u266F",!0],["LE","L4","E / B",!0],["S1","R1","Side 1",!0],["S2","R1","Side 2",!0],["S3","R1","Side 3",!0],["S4","R1","Side 4",!0],["R1","R1","B\u266D"],["R2","R2","A"],["BF","R2","B / F\u266F",!0],["R3","R3","G"],["RFs","R4","F\u266F / C\u266F",!0],["RE","R4","E / B",!0],["RGs","R4","G\u266F / D\u266F",!0],["RF","R4","F / C",!0]],sf={T:["Thumb ring","LT"],R:["Register key","LT"],A:["A key","L1"],Gs:["G\u266F key","L1"],L1:["First finger ring (E)","L1"],L2:["Second finger ring (D)","L2"],Eb:["E\u266D / B\u266D key","L2"],LCs:["C\u266F / G\u266F key","L4"],LF:["F / C lever","L4"],LFs:["F\u266F / C\u266F lever","L4"],LE:["E / B lever","L4"],S1:["Side key 1","R1"],S2:["Side key 2","R1"],S3:["Side key 3","R1"],S4:["Side key 4","R1"],R1:["First finger ring (B\u266D)","R1"],R2:["Second finger ring (A)","R2"],BF:["B / F\u266F key","R2"],R3:["Third finger ring (G)","R3"],RFs:["F\u266F / C\u266F key","R4"],RE:["E / B key","R4"],RGs:["G\u266F / D\u266F key","R4"],RF:["F / C key","R4"],P:["G cup (closed by the thumb ring or the first finger)",""],Ev:["E cup (closed by the second finger, or by the right hand through the bridge)",""],C:["B\u266D cup (closed by the right hand's first or second finger)",""],Fs:["F\u266F / C\u266F cup",""],F:["F / C cup",""],E:["E / B cup",""]};function af(i,e,t,n){return i==="mp"?e==="reed"?"Reed":e==="silver"?"Ligature":e==="cork"?"Tenon cork":"Mouthpiece":i==="barrel"?e==="silver"?"Barrel ring":"Barrel":i==="bell"?e==="silver"?"Bell ring":"Bell":e==="cork"?"Tenon cork":e==="silver"?i==="lower"&&t<335?"Lower joint ring":i==="lower"&&n<-8&&t<362?"Thumb rest":"Rod and posts":i==="upper"?"Upper joint":"Lower joint"}var of=`
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
`,Bi={front:{az:0,el:5},left:{az:90,el:5},back:{az:180,el:5},right:{az:-90,el:5},keys:{az:0,el:5,x:[128,472],zoom:!0},mouth:{az:-128,el:8,x:[-4,142],zoom:!0},lh:{az:-16,el:6,x:[132,334],zoom:!0},rh:{az:14,el:4,x:[322,486],zoom:!0},bell:{az:-22,el:-18,x:[436,676],zoom:!0}};function lf(i,e={}){let t=Object.assign({labels:"off",view:"front",shot:!1},e);if(!document.getElementById("vc3d-style")){let z=document.createElement("style");z.id="vc3d-style",z.textContent=of,document.head.appendChild(z)}i.classList.add("vc3d-root"),getComputedStyle(i).position==="static"&&(i.style.position="relative");let n=new Zs({antialias:!0,alpha:!0,premultipliedAlpha:!0,preserveDrawingBuffer:!!t.shot,powerPreference:"high-performance"});n.setClearColor(0,0),n.outputColorSpace=cn,n.toneMapping=zp?Jc:$c,n.toneMappingExposure=.9;let r=n.domElement;r.className="vc3d-canvas",r.setAttribute("aria-label","3D clarinet: drag to turn it, pinch or scroll to zoom; with the keyboard, arrows turn it, Page Up and Page Down zoom, Home puts it back"),i.appendChild(r);let s=document.createElement("div");s.className="vc3d-over",i.appendChild(s);let o=document.createElementNS("http://www.w3.org/2000/svg","svg");s.appendChild(o);let a=new vr,l=new gr(n),c=l.fromScene(Hp(),.01,.1,200);a.environment=c.texture,l.dispose();let h=tf();a.add(h.root);let u=Object.values(h.parts);for(let z of u)z.out=z.out.clone().applyQuaternion(h.root.quaternion);let p=h.parts,d=[h.M.silver,h.M.satin,h.M.lig,h.M.rest,h.M.wood,h.M.ebonite,...u.map(z=>z.mat)],f=`vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;`,_=Ge.envmap_physical_pars_fragment||"",m=_.includes(f),g="plain",v=h.refl.length,x={fsA:{value:h.refl.map(()=>new yt)},fsB:{value:h.refl.map(()=>new yt)}},b=Ee(),E=Ee();function w(){let z=ie.matrixWorldInverse;h.refl.forEach((oe,Me)=>{b.copy(oe.a).applyMatrix4(oe.obj.matrixWorld).applyMatrix4(z),E.copy(oe.u).transformDirection(oe.obj.matrixWorld).transformDirection(z),x.fsA.value[Me].set(b.x,b.y,b.z,oe.r),x.fsB.value[Me].set(E.x,E.y,E.z,oe.L)})}function F(z){if(z=m&&(z==="high"||z==="low")?z:"plain",z!==g){g=z;for(let oe of d){delete oe.defines.FS_TRACE,delete oe.defines.FS_N,delete oe.defines.FS_NB;let Me=oe===h.M.wood||oe===h.M.ebonite;Me?oe.defines.FS_WOOD=1:oe.defines.FS_METAL=1;let re=/^key:/.test(oe.name);re&&(oe.defines.FS_KEYS=1),z==="plain"?(oe.onBeforeCompile=()=>{},oe.customProgramCacheKey=()=>"vc-plain"):(z==="high"&&(oe.defines.FS_TRACE=1,oe.defines.FS_N=v,oe.defines.FS_NB=h.nBody),oe.customProgramCacheKey=()=>"vc-"+z+(re?"-k":"")+(Me?"-w":""),oe.onBeforeCompile=Le=>{Object.assign(Le.uniforms,x),Le.fragmentShader=Le.fragmentShader.replace("#include <envmap_physical_pars_fragment>",Ch+Vp+`
#if defined( FS_WOOD ) && defined( USE_COLOR )
#define FS_OCC ( vColor.r * vColor.r )
#else
#define FS_OCC 1.0
#endif
`+_.replace(f,`vec3 fsV = normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz );
			#ifdef FS_TRACE
			return fsRadiance( - vViewPosition + normal * 0.05, fsV, roughness ) * envMapIntensity * FS_OCC;
			#else
			#ifdef FS_WOOD
			return fsStudio( fsV, roughness ) * fsWood( fsV, roughness ) * envMapIntensity * FS_OCC;
			#else
			return fsStudio( fsV, roughness ) * envMapIntensity;
			#endif
			#endif`))}),oe.needsUpdate=!0}}}let V=!1;n.debug.onShaderError=(z,oe,Me,re)=>{V||(V=!0,console.warn("Virtual Clarinet: the studio shader did not compile here; using plain reflections. "+(z.getProgramInfoLog(oe)||"")+" "+(z.getShaderInfoLog(re)||"").slice(0,600)))},F(t.reflections==="plain"?"plain":t.reflections==="low"?"low":"high");let U=[],j=new hn;h.root.updateMatrixWorld(!0);for(let z of h.meshes){let oe=z.parent;for(;oe&&!/^joint:/.test(oe.name);)oe=oe.parent;let Me=z.geometry.attributes.position,re=Math.max(1,Math.floor(Me.count/1500));for(let he=0;he<Me.count;he+=re){let be=Ee().fromBufferAttribute(Me,he).applyMatrix4(z.matrixWorld);be.j=oe,be.s=Ma-be.y,U.push(be),j.expandByPoint(be)}z.geometry.computeBoundingBox();let Le=z.geometry.boundingBox;for(let he of[Le.min.x,Le.max.x])for(let be of[Le.min.y,Le.max.y])for(let Se of[Le.min.z,Le.max.z]){let we=Ee(he,be,Se).applyMatrix4(z.matrixWorld);we.j=oe,we.s=Ma-we.y,U.push(we)}}let Y=j.getCenter(Ee()),q={mp:-84,barrel:-56,upper:-28,lower:0,bell:28},Z=0,K=0,ce=z=>{let oe=h.joints[h.jointOf(z.x)];return oe.updateMatrix(),z.applyMatrix4(oe.matrix).applyMatrix4(h.root.matrix)};j.max.y-=q.mp,j.min.y-=q.bell;let le=Ma-Sr.end-2.5,pe=(()=>{let be=new vn(256,256,{depthBuffer:!1}),Se=new vn(256,256,{depthBuffer:!1}),we=new jr(-95,95,95,-95,1,1200);we.position.set(0,le+900,0),we.up.set(0,0,-1),we.lookAt(0,0,0);let Ne=new sn({uniforms:{y0:{value:le}},depthTest:!1,depthWrite:!1,blending:Yc,blendEquation:Zc,blendSrc:ha,blendDst:ha,vertexShader:"varying float h; uniform float y0; void main(){ vec4 w = modelMatrix * vec4(position,1.0); h = w.y - y0; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:"varying float h; void main(){ float k = 1.0 - 0.8 * smoothstep(0.0, 150.0, h); gl_FragColor = vec4(k, k, k, 1.0); }"}),xe=new Ut(new di(2,2),new sn({uniforms:{tex:{value:null},dir:{value:new fe}},depthTest:!1,depthWrite:!1,vertexShader:"varying vec2 u; void main(){ u = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`varying vec2 u; uniform sampler2D tex; uniform vec2 dir;
        void main(){ float s = 0.0, w = 0.0; for (int i = -8; i <= 8; i++){ float f = float(i); float g = exp(-f*f/18.0); s += texture2D(tex, u + dir * f).r * g; w += g; } gl_FragColor = vec4(vec3(s / w), 1.0); }`})),Be=new vr;Be.add(xe);let At=new Di,tt=new Ut(new di(190,190),new sn({uniforms:{tex:{value:be.texture},k:{value:.3}},transparent:!0,depthWrite:!1,vertexShader:"varying vec2 u; void main(){ u = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"varying vec2 u; uniform sampler2D tex; uniform float k; void main(){ float a = texture2D(tex, u).r; a = a*a*(3.0-2.0*a); vec2 e = smoothstep(0.0, 0.1, u) * smoothstep(0.0, 0.1, 1.0 - u); gl_FragColor = vec4(0.05, 0.05, 0.06, a * k * e.x * e.y); }"}));return tt.rotation.x=-Math.PI/2,tt.position.set(0,le,0),tt.renderOrder=-1,tt.name="shadow",a.add(tt),{plane:tt,bake:()=>{let nt=n.toneMapping;n.toneMapping=Kc,tt.visible=!1,a.overrideMaterial=Ne,n.setRenderTarget(be),n.setClearColor(0,1),n.clear(),n.render(a,we),a.overrideMaterial=null,tt.visible=!0;let St=xe.material.uniforms;for(let ln of[4,2,1])St.tex.value=be.texture,St.dir.value.set(ln/256,0),n.setRenderTarget(Se),n.render(Be,At),St.tex.value=Se.texture,St.dir.value.set(0,ln/256),n.setRenderTarget(be),n.render(Be,At);n.setRenderTarget(null),n.setClearColor(0,0),n.toneMapping=nt},dispose(){be.dispose(),Se.dispose(),Ne.dispose(),xe.geometry.dispose(),xe.material.dispose(),tt.geometry.dispose(),tt.material.dispose()}}})();pe.bake();let ie=new rn(20,2,20,8e3),ve=new va(ie,r);ve.enableDamping=!0,ve.dampingFactor=.09,ve.minPolarAngle=.03,ve.maxPolarAngle=Math.PI-.03,ve.zoomSpeed=.9,ve.screenSpacePanning=!0,ve.mouseButtons={LEFT:Pn.ROTATE,MIDDLE:Pn.DOLLY,RIGHT:Pn.PAN},ve.touches={ONE:Vn.ROTATE,TWO:Vn.DOLLY_PAN},ve.target.copy(Y),ve.zoomToCursor=!0;let I=2,T=2,B=1,G=!1,W=0,H=null,M="off",S=!1,N=0,L=0,A=0,C=[],y=()=>t.insets||{l:10,r:10,t:26,b:66},P=Ee(),O=Ee(),Q=Ee(),k=Ee();function te(z,oe,Me){let re=z*Math.PI/180,Le=oe*Math.PI/180;Q.set(-Math.sin(re)*Math.cos(Le),-Math.sin(Le),-Math.cos(re)*Math.cos(Le)),P.crossVectors(Q,gi).normalize(),O.crossVectors(P,Q).normalize();let he=y(),be=Math.max(40,I-he.l-he.r),Se=Math.max(40,T-he.t-he.b),we=Math.tan(ie.fov*Math.PI/360)*(Se/T),Ne=Math.tan(ie.fov*Math.PI/360)*(be/T),xe=(Me?U.filter(Rt=>Rt.s>=Me[0]&&Rt.s<=Me[1]):U).map(Rt=>{let nt=Rt.clone();return nt.y-=q[Rt.j.name.slice(6)]*K,nt}),Be=new hn;for(let Rt of xe)Be.expandByPoint(Rt);let At=Be.getCenter(Ee()),tt=1e3;for(let Rt=0;Rt<6;Rt++){let nt=0,St=1/0,ln=-1/0,jt=1/0,Zt=-1/0;for(let Kt of xe){k.subVectors(Kt,At);let bn=k.dot(P),dt=k.dot(O),Gi=k.dot(Q);nt=Math.max(nt,Math.abs(bn)/Ne-Gi,Math.abs(dt)/we-Gi);let ss=1/(tt+Gi);St=Math.min(St,bn*ss),ln=Math.max(ln,bn*ss),jt=Math.min(jt,dt*ss),Zt=Math.max(Zt,dt*ss)}At.addScaledVector(P,(St+ln)/2*tt).addScaledVector(O,(jt+Zt)/2*tt),tt=nt}return{dist:tt*1.04,target:At}}function J(){let z=y();ie.setViewOffset(I,T,-(z.l-z.r)/2,-(z.t-z.b)/2,I,T)}let X={az:0,el:0,dist:1e3,target:Y.clone()};function ge(){let z=X.az*Math.PI/180,oe=X.el*Math.PI/180;ie.position.set(X.target.x+X.dist*Math.sin(z)*Math.cos(oe),X.target.y+X.dist*Math.sin(oe),X.target.z+X.dist*Math.cos(z)*Math.cos(oe)),ve.target.copy(X.target),ie.lookAt(X.target)}function ue(){let z=ie.position.clone().sub(ve.target);X.dist=z.length(),X.el=Math.asin(at(z.y/X.dist,-1,1))*180/Math.PI,X.az=Math.atan2(z.x,z.z)*180/Math.PI,X.target.copy(ve.target)}let ae=null,me=new hn;function Ae(){return me.copy(j),me.max.y+=84*Z,me.min.y-=28*Z,me}let Re=0,ye=0;function Ue(){H=null;for(let z of C)try{z()}catch(oe){console.error(oe)}}function He(){ve.enableDamping=!1,ve.update(),ve.enableDamping=!0}function Ye(z,oe,Me,re,Le=650){He(),ue();let he=(z-X.az+540)%360-180;if(!Le){X.az=z,X.el=oe,X.dist=Me,X.target.copy(re),ge(),ve.update(),ae=null,Lt();return}ae={t0:performance.now(),ms:Le,az0:X.az,daz:he,el0:X.el,el1:oe,d0:X.dist,d1:Me,tg0:X.target.clone(),tg1:re.clone()},Lt()}function Ce(){let z=te(Bi.front.az,Bi.front.el);ve.minDistance=z.dist*.06,ve.maxDistance=z.dist*2.2}let We=new je(15263455),$e=(z,oe)=>{z.rot=oe,z.axis?z.group.quaternion.setFromAxisAngle(z.axis,oe):z.group.rotation.x=oe},qt=0;function Mt(z){let oe=Math.min(.05,qt?(z-qt)/1e3:.016);qt=z;let Me=!1;for(let re of u){if(Math.abs(re.to-re.x)>1e-4||Math.abs(re.v)>.001){let we=oe;for(;we>0;){let Ne=Math.min(we,.004);re.v+=(3364*(re.to-re.x)-2*.78*58*re.v)*Ne,re.x+=re.v*Ne,we-=Ne}Math.abs(re.to-re.x)<5e-4&&Math.abs(re.v)<.02&&(re.x=re.to,re.v=0),$e(re,re.sign*re.angle*at(re.x,-.06,1.06)),Me=!0}Math.abs(re.paintTo-re.paint)>.001&&(re.paint+=(re.paintTo-re.paint)*Math.min(1,oe*20),Math.abs(re.paintTo-re.paint)<.004&&(re.paint=re.paintTo),Me=!0);let Le=re.paint,he=re.mat;he.color.copy(We).lerp(re.colTo,Le),he.metalness=1-.62*Le,he.roughness=.07+.2*Le,he.clearcoat=Math.max(.001,Le),he.clearcoatRoughness=.06,he.emissive.copy(re.colTo).multiplyScalar(.3*Le),re===ze&&he.emissive.addScalar(.1)}for(let re of h.fingers)Math.abs(re.to-re.a)>.001&&(re.a+=(re.to-re.a)*Math.min(1,oe*18),Math.abs(re.to-re.a)<.01&&(re.a=re.to),Me=!0),re.mat.opacity=.93*re.a,re.mesh.visible=re.a>.01;if(Z!==K){let re=K-Z,Le=oe*2.2;Z=Math.abs(re)<=Le?K:Z+Math.sign(re)*Le;let he=Z*Z*(3-2*Z);for(let[be,Se]of Object.entries(h.joints))Se.position.x=q[be]*he,Se.updateMatrix();pe.plane.position.y=le-q.bell*he,Z===K&&pe.bake(),Me=!0}if(ae){let re=at((z-ae.t0)/ae.ms,0,1),Le=re<.5?4*re*re*re:1-Math.pow(-2*re+2,3)/2;X.az=ae.az0+ae.daz*Le,X.el=ae.el0+(ae.el1-ae.el0)*Le,X.dist=ae.d0+(ae.d1-ae.d0)*Le,X.target.lerpVectors(ae.tg0,ae.tg1,Le),ge(),re>=1&&(ae=null,He(),ge()),Me=!0}return Me}for(let z of u)z.to=z.x=z.restUp?1:0,$e(z,z.sign*z.angle*z.x);let ot=[],Nt=[];function In(){for(let z of ot)z.el.remove(),z.line.remove(),z.dot.remove();ot.length=0;for(let z of Nt)z.el.remove();Nt.length=0}let $=rf,yn=new Set,Er=sf,Tt=new oa,xi=new fe,bt=null;function es(z,oe){let Me=r.getBoundingClientRect();if(!Me.width)return;xi.set((z-Me.left)/Me.width*2-1,-(oe-Me.top)/Me.height*2+1),Tt.setFromCamera(xi,ie);let re=Tt.intersectObjects(h.meshes,!1)[0];if(bt&&(bt.el.remove(),bt=null),!re){Lt();return}let[Le,he]=re.object.name.split(":"),be;if(Er[Le]){let[xe,Be]=Er[Le];be=Be?`${xe} \xB7 ${Be}`:xe}else{let xe=h.root.worldToLocal(re.point.clone());be=af(Le,he,xe.x,xe.z)}let Se=document.createElement("div");Se.className="vc3d-chip on vc3d-pick",Se.textContent=be,s.appendChild(Se);let we=re.point.clone(),Ne=re.object.parent;for(;Ne&&!/^joint:/.test(Ne.name);)Ne=Ne.parent;Ne&&(Ne.updateMatrixWorld(),Ne.worldToLocal(we)),bt={el:Se,local:we,joint:Ne,until:performance.now()+2600,w:Se.offsetWidth,h:Se.offsetHeight},Lt()}function ts(z){if(!bt)return!1;if(z>bt.until)return bt.el.remove(),bt=null,!1;let oe=Mn(bt.joint?an.copy(bt.local).applyMatrix4(bt.joint.matrixWorld):an.copy(bt.local));return bt.el.style.transform=`translate(${(oe.x-bt.w/2).toFixed(1)}px,${(oe.y-bt.h-16).toFixed(1)}px)`,bt.el.style.opacity=Math.min(1,(bt.until-z)/400).toFixed(2),!0}function ns(){if(In(),M==="parts"){for(let[z,oe,Me]of PARTS){let re=document.createElement("div");re.className="vc3d-tag",re.textContent=z,s.appendChild(re);let Le=document.createElementNS("http://www.w3.org/2000/svg","line"),he=document.createElementNS("http://www.w3.org/2000/svg","circle");he.setAttribute("r",2.4),o.appendChild(Le),o.appendChild(he),ot.push({el:re,line:Le,dot:he,pos:Ee(...oe),out:Me?Ee(...Me).normalize():null,w:0,h:0,side:0,x:0,y:0,a:1})}for(let z of ot)z.w=z.el.offsetWidth,z.h=z.el.offsetHeight}else if(M==="fingers"||M==="names"){for(let[z,oe,Me,re]of $){let Le=M==="fingers"?oe:Me;if(!Le)continue;let he=z==="trD"||z==="trDs"?z+":t":z,be=p[he]||p[z];if(!be||!be.anchor)continue;let Se=document.createElement("div");Se.className="vc3d-chip",Se.textContent=Le,s.appendChild(Se),Nt.push({el:Se,p:be,pid:he,only:M==="fingers"&&!!re,prio:oe?0:1,w:0,h:0})}for(let z of Nt)z.w=z.el.offsetWidth,z.h=z.el.offsetHeight}}let en=Ee(),is=Ee(),an=Ee(),Dn=Ee();function Mn(z){en.copy(z);let oe=en.clone().sub(ie.position).dot(ie.getWorldDirection(is))<0;return en.project(ie),{x:(en.x*.5+.5)*I,y:(-en.y*.5+.5)*T,behind:oe}}let yi=Ee();function Tr(z,oe){yi.subVectors(z,ie.position);let Me=yi.length();if(Me<10)return!1;yi.multiplyScalar((Me-3)/Me).add(ie.position);for(let re of h.capsules){if(re.id===oe)continue;let Le=re.r*.92;if(kp(ie.position,yi,re.a,re.b)<Le*Le)return!0}return!1}function ki(z,oe){return z.group.updateMatrixWorld(),oe.copy(z.anchor).sub(z.pivot).applyAxisAngle(z.axis||Dt,z.rot).add(z.pivot),z.joint.updateMatrix(),oe.applyMatrix4(z.joint.matrix).applyMatrix4(h.root.matrix)}let Vi=!1;function Hi(){if(Nt.length){let he=[];for(let Se of Nt){let we=Se.p,Ne=yn.has(Se.pid)||yn.has(we.id),xe=1;Se.only&&!Ne&&(xe=0),M==="fingers"&&Se.pid==="Th"&&yn.has("Tb")&&(xe=0),ki(we,an);let Be=Mn(an),At=Mn(an.clone().addScaledVector(we.out,6));en.copy(ie.position).sub(an).normalize();let tt=at(en.dot(we.out),0,1);xe*=_t(-.15,.2,en.dot(we.out)),xe>0&&Tr(an,null)&&(xe=0);let Rt=!1;xe<.5&&M==="fingers"&&Se.prio===0&&!Se.only&&(xe=.62,Rt=!0),M==="fingers"&&Se.pid==="Th"&&yn.has("Tb")&&(xe=0,Rt=!1),Be.behind&&(xe=0),Dn.setFromMatrixColumn(ie.matrixWorld,0);let nt=Mn(an.clone().addScaledVector(Dn,we.size||4)),St=Math.hypot(nt.x-Be.x,nt.y-Be.y),ln,jt;if(tt>.5&&St>1.15*Se.w)ln=Be.x-Se.w/2,jt=Be.y-Se.h/2;else{let Zt=Mn(en.set(h.root.position.x,an.y,h.root.position.z)),Kt=Be.x>=Zt.x-3?1:-1;ln=Be.x+Kt*(St*(.35+.65*tt)+7+Se.w/2)-Se.w/2,jt=Be.y-Se.h/2}Object.assign(Se,{lx:ln,ly:jt,la:xe,down:Ne,behindNow:Rt})}let be=Nt.slice().sort((Se,we)=>Se.behindNow-we.behindNow||Se.prio-we.prio);for(let Se of be){let we=Se.la,Ne=Se.lx,xe=Se.ly;if(we>.05){for(let Be of he)if(Ne<Be.x+Be.w+2&&Ne+Se.w+2>Be.x&&xe<Be.y+Be.h+1&&xe+Se.h+1>Be.y){we=0;break}}we>.05&&he.push({x:Ne,y:xe,w:Se.w,h:Se.h}),Se.el.style.transform=`translate(${Ne.toFixed(1)}px,${xe.toFixed(1)}px)`,Se.el.style.opacity=we.toFixed(2),Se.el.classList.toggle("on",Se.down&&M==="fingers"),Se.el.classList.toggle("behind",Se.behindNow)}return}if(M!=="parts"||!ot.length)return;let z=0;for(let he of ot){let be=Mn(ce(an.copy(he.pos)));he.ax=be.x,he.ay=be.y;let Se=be.behind?0:1;he.out&&(en.copy(ie.position).sub(he.pos).normalize(),Se*=_t(-.25,.12,en.dot(he.out))),(be.x<-20||be.x>I+20||be.y<-20||be.y>T+20)&&(Se=0),Se>0&&Tr(ce(an.copy(he.pos)),"plate")&&(Se=0),he.a=Se}z=Mn(Y).y;let Me=ot.filter(he=>he.a>.01),re=1/0,Le=-1/0;for(let he of Me)re=Math.min(re,he.ax),Le=Math.max(Le,he.ax);if(Me.length){let he=Le-re;he<.4*I?Vi=!0:he>.5*I&&(Vi=!1)}if(Vi){let he=(re+Le)/2;for(let be of Me){let Se=be.ax-he;be.col?Se*be.col<-24&&(be.col=-be.col):be.col=Se<0?-1:1}for(let be of[-1,1]){let Se=Me.filter(xe=>xe.col===be).sort((xe,Be)=>xe.ay-Be.ay);if(!Se.length)continue;let we=be<0?Math.max(6,re-70):Math.min(I-6,Le+70);for(let xe of Se)xe.x=be<0?Math.max(6,we-xe.w):Math.min(I-xe.w-6,we),xe.y=xe.ay-xe.h/2;let Ne=8;for(let xe of Se)xe.y=Math.max(xe.y,Ne),Ne=xe.y+xe.h+5;Ne=T-40;for(let xe=Se.length-1;xe>=0;xe--){let Be=Se[xe];Be.y=Math.min(Be.y,Ne-Be.h),Ne=Be.y-5}for(let xe of Se)xe.lx=be<0?xe.x+xe.w:xe.x,xe.ly=xe.y+xe.h/2}}else{for(let he of ot){let be=he.ay-z;he.side?be*he.side<-16&&(he.side=-he.side):he.side=be<0?-1:1}for(let he of[-1,1]){let be=Me.filter(xe=>xe.side===he).sort((xe,Be)=>xe.ax-Be.ax);if(!be.length)continue;let Se=be.reduce((xe,Be)=>xe+Be.w+8,0),we=Se>I-20||be.length>6?2:1,Ne=he<0?8:T-40;for(let xe=0;xe<we;xe++){let Be=be.filter((At,tt)=>tt%we===xe);for(let At of Be)At.x=at(At.ax-At.w/2,6,I-At.w-6),At.y=he<0?Ne+xe*(At.h+6):Ne-At.h-xe*(At.h+6);for(let At=0;At<8;At++){for(let tt=1;tt<Be.length;tt++){let Rt=Be[tt-1],nt=Be[tt],St=Rt.x+Rt.w+8-nt.x;St>0&&(Rt.x-=St/2,nt.x+=St/2)}for(let tt of Be)tt.x=at(tt.x,6,I-tt.w-6)}}}for(let he of Me)he.lx=at(he.ax,he.x+8,he.x+he.w-8),he.ly=he.side<0?he.y+he.h:he.y}for(let he of ot)he.el.style.transform=`translate(${(he.x||0).toFixed(1)}px,${(he.y||0).toFixed(1)}px)`,he.el.style.opacity=he.a.toFixed(2),he.line.setAttribute("x1",(he.lx||0).toFixed(1)),he.line.setAttribute("y1",(he.ly||0).toFixed(1)),he.line.setAttribute("x2",he.ax.toFixed(1)),he.line.setAttribute("y2",he.ay.toFixed(1)),he.dot.setAttribute("cx",he.ax.toFixed(1)),he.dot.setAttribute("cy",he.ay.toFixed(1)),he.line.style.opacity=he.dot.style.opacity=he.a.toFixed(2)}function Lt(){!W&&!G&&(W=requestAnimationFrame(rs))}function rs(z){if(W=0,G)return;let oe=Mt(z);if(Re&&!ae){let he=ye?Math.min(.05,(z-ye)/1e3):.016;ye=z;let be=2*ie.position.distanceTo(ve.target)*Math.tan(ie.fov*Math.PI/360),Se=Re*.4*be*he;ve.target.y+=Se,ie.position.y+=Se,oe=!0}else ye=0;!ae&&ve.update()&&(oe=!0),ve.autoRotate&&(oe=!0);let Me=ve.target,re=Ae();if(!re.containsPoint(Me)){let he=re.clampPoint(Me,Ee()),be=he.sub(Me);Me.add(be),ie.position.add(be)}let Le=Math.asin(at((ie.position.y-le)/ie.position.distanceTo(Ee(Me.x,le,Me.z)),-1,1));if(pe.plane.material.uniforms.k.value=.3*_t(.02,.22,Le),pe.plane.visible=Le>.02,a.environmentRotation.y=-Math.atan2(ie.position.x-Me.x,ie.position.z-Me.z),g==="high"&&(a.updateMatrixWorld(),ie.updateMatrixWorld(),w()),n.render(a,ie),V&&g!=="plain"&&(F("plain"),oe=!0),oe&&!t.shot&&(!S||g==="high")){let he=z-L;he<400&&(A=A?A*.85+he*.15:he,N=A>42?N+1:Math.max(0,N-1),N>20&&(S?g==="high"&&F("low"):(S=!0,ti()),N=0,A=0))}L=z,Hi(),ts(z)&&(oe=!0),oe?Lt():qt=0}ve.addEventListener("change",Lt),ve.addEventListener("start",()=>{ae=null,H=null,r.classList.add("vc3d-drag");for(let z of C)try{z()}catch(oe){console.error(oe)}}),ve.addEventListener("end",()=>r.classList.remove("vc3d-drag"));let R=0,ee=0,se=0,de=0,ne=0,_e=0,Pe=0,Ie=z=>{z.preventDefault(),clearTimeout(Pe),bt&&(bt.el.remove(),bt=null),on.resetView()},Oe=z=>{de=z.clientX,ne=z.clientY,_e=performance.now()},ze=null,ke=0,Fe=0,Je=0,xt=new Map;for(let z of u)for(let oe of z.meshes)xt.set(oe,z);let ht=[...xt.keys()],It=z=>{if(z.pointerType!=="mouse"||z.buttons){ze&&(ze=null,r.style.cursor="",Lt());return}Fe=z.clientX,Je=z.clientY,!ke&&(ke=requestAnimationFrame(()=>{ke=0;let oe=r.getBoundingClientRect();if(!oe.width)return;xi.set((Fe-oe.left)/oe.width*2-1,-(Je-oe.top)/oe.height*2+1),Tt.setFromCamera(xi,ie);let Me=Tt.intersectObjects(ht,!1)[0],re=Me?xt.get(Me.object):null;re!==ze&&(ze=re,r.style.cursor=re?"pointer":"",Lt())}))},ut=()=>{ze&&(ze=null,r.style.cursor="",Lt())},Qe=z=>{let oe=performance.now();if(oe-_e>260||Math.hypot(z.clientX-de,z.clientY-ne)>12)return;clearTimeout(Pe);let Me=z.clientX,re=z.clientY;Pe=setTimeout(()=>es(Me,re),260),z.pointerType==="touch"&&(oe-R<330&&Math.hypot(z.clientX-ee,z.clientY-se)<40?(R=0,clearTimeout(Pe),on.resetView()):(R=oe,ee=z.clientX,se=z.clientY))},Wt=z=>z.preventDefault();r.addEventListener("dblclick",Ie),r.addEventListener("pointerdown",Oe),r.addEventListener("pointerup",Qe),r.addEventListener("contextmenu",Wt),r.addEventListener("pointermove",It),r.addEventListener("pointerleave",ut),r.tabIndex=0;let Ot=z=>{if(z.shiftKey&&(z.key==="ArrowUp"||z.key==="ArrowDown")){z.preventDefault(),on.moveAlong(z.key==="ArrowUp"?1:-1);return}let oe={ArrowLeft:[-15,0],ArrowRight:[15,0],ArrowUp:[0,10],ArrowDown:[0,-10]}[z.key];if(oe){z.preventDefault(),ue(),H=null;for(let Me of C)try{Me()}catch(re){console.error(re)}Ye(X.az+oe[0],at(X.el+oe[1],-85,85),X.dist,X.target,260);return}if(z.key==="PageUp"||z.key==="PageDown"){z.preventDefault(),ue(),Ye(X.az,X.el,at(X.dist*(z.key==="PageUp"?.8:1.25),ve.minDistance,ve.maxDistance),X.target,220);return}z.key==="Home"&&(z.preventDefault(),on.resetView())};r.addEventListener("keydown",Ot);let qe=z=>{z.preventDefault()},Ve=()=>{pe.bake(),Lt()};r.addEventListener("webglcontextlost",qe),r.addEventListener("webglcontextrestored",Ve);function Yt(z,oe){let Me=Bi[z]||Bi.front,re=te(Me.az,Me.el,Me.x);Ye(Me.az,Me.el,re.dist,re.target,oe)}function ti(){if(G)return;let z=Math.max(2,i.clientWidth),oe=Math.max(2,i.clientHeight),Me=i.getBoundingClientRect();B=Me.width>0&&z>0?Me.width/z:1;let re=Math.min((window.devicePixelRatio||1)*B,S?1:2.5);re=Math.max(re,S?.6:.75);let Le=z*oe*re*re;Le>4e6&&(re*=Math.sqrt(4e6/Le));let he=z!==I||oe!==T;if((he||Math.abs(re-n.getPixelRatio())>.01)&&(n.setPixelRatio(re),n.setSize(z,oe,!1)),I=z,T=oe,ie.aspect=z/oe,J(),ie.updateProjectionMatrix(),ve.rotateSpeed=.9/B,ve.panSpeed=1/B,Ce(),he&&H&&Yt(H,0),ot.length)for(let be of ot)be.w=be.el.offsetWidth,be.h=be.el.offsetHeight;if(Nt.length)for(let be of Nt)be.w=be.el.offsetWidth,be.h=be.el.offsetHeight;Lt()}let Un=typeof ResizeObserver<"u"?new ResizeObserver(()=>ti()):null;Un&&Un.observe(i);let on={setKeys(z,oe,Me){let re=z instanceof Set?z:new Set(z||[]),{closed:Le,moved:he}=nf(re),be=oe?new je(oe):null,Se=Me?new je(Me):be,we=(Ne,xe)=>Ne.copy(be).lerp(Se,at((xe-150)/420,0,1));yn=new Set([...re,...Le]);for(let Ne of u){let xe=re.has(Ne.id)||Le.has(Ne.id);Ne.to=Ne.restUp?xe?0:1:xe||he.has(Ne.id)?1:0,xe&&be?(we(Ne.colTo,Ne.xMid),Ne.paintTo=1):Ne.paintTo=0}for(let Ne of h.fingers)Ne.to=re.has(Ne.id)&&be?1:0,Ne.to&&we(Ne.mat.color,Ne.s);Lt()},setLabels(z){if(z=z==="fingers"||z==="names"||z==="parts"?z:"off",z===M)return;let oe=M;M=z,ns(),oe==="parts"!=(z==="parts")&&(J(),ie.updateProjectionMatrix(),H&&Yt(H,350)),Lt()},setView(z,oe){H=Bi[z]?z:"front",J(),ie.updateProjectionMatrix(),Yt(H,oe??700)},resetView(){on.setView("front")},moveAlong(z,oe=.3,Me=300){He(),ue(),Ue();let re=2*X.dist*Math.tan(ie.fov*Math.PI/360),Le=Ae(),he=X.target.clone();return he.y=at(he.y+Math.sign(z)*oe*re,Le.min.y,Le.max.y),Math.abs(he.y-X.target.y)<.5?!1:(Ye(X.az,X.el,X.dist,he,Me),!0)},glide(z){Re=Math.sign(z||0),Re&&(Ue(),Lt())},get along(){let z=Ae();return at((ve.target.y-z.min.y)/Math.max(1,z.max.y-z.min.y),0,1)},setCamera(z,oe,Me,re=0){H=null;let Le=te(z,oe);Ye(z,oe,Le.dist*(Me||1),Le.target,re)},lookAt(z,oe,Me,re,Le,he,be=0){H=null,Ye(re,Le,he,Ee(z,oe,Me),be)},setApart(z){K=z?1:0,H&&Yt(H,800),Lt()},get apart(){return K===1},setQuality(z){F(z),N=0,Lt()},get quality(){return g},setAutoRotate(z){ve.autoRotate=!!z,ve.autoRotateSpeed=1.6,Lt()},onViewChange(z){return typeof z=="function"&&C.push(z),()=>{let oe=C.indexOf(z);oe>=0&&C.splice(oe,1)}},resize:ti,render:Lt,views:Object.keys(Bi),get view(){return H},get labels(){return M},scene:a,camera:ie,renderer:n,controls:ve,clarinet:h.root,materials:h.M,parts:h.parts,info(){let z=0;for(let oe of h.meshes)z+=oe.geometry.index.count/3;return{triangles:z,meshes:h.meshes.length,calls:n.info.render.calls,pixelRatio:n.getPixelRatio(),size:[I,T],cssScale:B,reflections:g,parts:u.length,lowRes:S}},dispose(){if(!G){G=!0,W&&cancelAnimationFrame(W),clearTimeout(Pe),bt&&bt.el.remove(),Un&&Un.disconnect(),r.removeEventListener("dblclick",Ie),r.removeEventListener("pointerdown",Oe),r.removeEventListener("pointerup",Qe),r.removeEventListener("contextmenu",Wt),r.removeEventListener("pointermove",It),r.removeEventListener("pointerleave",ut),ke&&cancelAnimationFrame(ke),r.removeEventListener("keydown",Ot),r.removeEventListener("webglcontextlost",qe),r.removeEventListener("webglcontextrestored",Ve),ve.dispose(),In(),pe.dispose();for(let z of h.meshes)z.geometry.dispose();for(let z of Object.values(h.M))z.dispose();for(let z of u)z.mat.dispose();c.dispose(),n.dispose(),r.remove(),s.remove(),i.classList.remove("vc3d-root"),C.length=0}}};return ti(),M="off",on.setLabels(t.labels),H=Bi[t.view]?t.view:"front",J(),ie.updateProjectionMatrix(),Yt(H,0),Lt(),on}return Fh(cf);})();
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
Clarinet3D.builtFrom=144514;
