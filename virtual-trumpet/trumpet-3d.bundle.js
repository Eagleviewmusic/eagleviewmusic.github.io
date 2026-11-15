var Trumpet3D=(()=>{var Ks=Object.defineProperty;var ih=Object.getOwnPropertyDescriptor;var rh=Object.getOwnPropertyNames;var sh=Object.prototype.hasOwnProperty;var ah=(i,e)=>{for(var t in e)Ks(i,t,{get:e[t],enumerable:!0})},oh=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of rh(e))!sh.call(i,r)&&r!==t&&Ks(i,r,{get:()=>e[r],enumerable:!(n=ih(e,r))||n.enumerable});return i};var lh=i=>oh(Ks({},"__esModule",{value:!0}),i);var yp={};ah(yp,{createTrumpet:()=>xp});var un={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},_n={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3};var ch=0,tl=1,hh=2;var bc=5,si=100,uh=101,dh=102;var Sc=104,ph=200,Ns=201,mh=202,fh=203,Pa=204,Ia=205,gh=206,vh=207,_h=208,xh=209,yh=210,Mh=211,bh=212,Sh=213,wh=214,Th=0,Eh=1,Ah=2,Rh=3,Ch=4,Ph=5,Ih=6,Lh=7;var wc=0;var Tc=5;var Ec=7;var Ac=300,Bi=301,zi=302,La=303,Da=304,Os=306,Ua=1e3,gr=1001,Na=1002,Wt=1003,Dh=1004;var Ur=1005;var Tn=1006,Js=1007;var Di=1008;var Vn=1009,Rc=1010,Cc=1011,vr=1012,nl=1013,li=1014,ln=1015,Lr=1016,il=1017,rl=1018,ki=1020,Pc=35902,Ic=1021,Lc=1022,Zt=1023,Dc=1024,Uc=1025,_r=1026,Hi=1027,Nc=1028,sl=1029,Oc=1030,al=1031;var ol=1033,ls=33776,cs=33777,hs=33778,us=33779,Oa=35840,Fa=35841,Ba=35842,za=35843,ka=36196,Ha=37492,Va=37496,Ga=37808,Wa=37809,Xa=37810,ja=37811,Ya=37812,qa=37813,Za=37814,Ka=37815,Ja=37816,$a=37817,Qa=37818,eo=37819,to=37820,no=37821,ds=36492,io=36494,ro=36495,Fc=36283,so=36284,ao=36285,oo=36286;var ps=2300,lo=2301,$s=2302,yl=2400,Ml=2401,bl=2402;var Ii="",Bt="srgb",Ki="srgb-linear",Fs="linear",nt="srgb";var _i=7680;var Uh=512,Nh=513,Oh=514,Fh=515,Bh=516,zh=517,kh=518,Hh=519,Sl=35044;var wl="300 es",Vi=2e3,ms=2001,Rn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let n=this._listeners[e];if(n!==void 0){let r=n.indexOf(t);r!==-1&&n.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let t=this._listeners[e.type];if(t!==void 0){e.target=this;let n=t.slice(0);for(let r=0,s=n.length;r<s;r++)n[r].call(this,e);e.target=null}}},Ct=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Tl=1234567,Ni=Math.PI/180,xr=180/Math.PI;function mi(){let i=4294967295*Math.random()|0,e=4294967295*Math.random()|0,t=4294967295*Math.random()|0,n=4294967295*Math.random()|0;return(Ct[255&i]+Ct[i>>8&255]+Ct[i>>16&255]+Ct[i>>24&255]+"-"+Ct[255&e]+Ct[e>>8&255]+"-"+Ct[e>>16&15|64]+Ct[e>>24&255]+"-"+Ct[63&t|128]+Ct[t>>8&255]+"-"+Ct[t>>16&255]+Ct[t>>24&255]+Ct[255&n]+Ct[n>>8&255]+Ct[n>>16&255]+Ct[n>>24&255]).toLowerCase()}function xt(i,e,t){return Math.max(e,Math.min(t,i))}function co(i,e){return(i%e+e)%e}function dr(i,e,t){return(1-t)*i+t*e}function Li(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Dt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(4294967295*i);case Uint16Array:return Math.round(65535*i);case Uint8Array:return Math.round(255*i);case Int32Array:return Math.round(2147483647*i);case Int16Array:return Math.round(32767*i);case Int8Array:return Math.round(127*i);default:throw new Error("Invalid component type.")}}var Bs={DEG2RAD:Ni,RAD2DEG:xr,generateUUID:mi,clamp:xt,euclideanModulo:co,mapLinear:function(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)},inverseLerp:function(i,e,t){return i!==e?(t-i)/(e-i):0},lerp:dr,damp:function(i,e,t,n){return dr(i,e,1-Math.exp(-t*n))},pingpong:function(i,e=1){return e-Math.abs(co(i,2*e)-e)},smoothstep:function(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e))*i*(3-2*i)},smootherstep:function(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e))*i*i*(i*(6*i-15)+10)},randInt:function(i,e){return i+Math.floor(Math.random()*(e-i+1))},randFloat:function(i,e){return i+Math.random()*(e-i)},randFloatSpread:function(i){return i*(.5-Math.random())},seededRandom:function(i){i!==void 0&&(Tl=i);let e=Tl+=1831565813;return e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296},degToRad:function(i){return i*Ni},radToDeg:function(i){return i*xr},isPowerOfTwo:function(i){return!(i&i-1)&&i!==0},ceilPowerOfTwo:function(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))},floorPowerOfTwo:function(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))},setQuaternionFromProperEuler:function(i,e,t,n,r){let s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),h=a((e+n)/2),u=s((e-n)/2),d=a((e-n)/2),m=s((n-e)/2),p=a((n-e)/2);switch(r){case"XYX":i.set(o*h,l*u,l*d,o*c);break;case"YZY":i.set(l*d,o*h,l*u,o*c);break;case"ZXZ":i.set(l*u,l*d,o*h,o*c);break;case"XZX":i.set(o*h,l*p,l*m,o*c);break;case"YXY":i.set(l*m,o*h,l*p,o*c);break;case"ZYZ":i.set(l*p,l*m,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}},normalize:Dt,denormalize:Li},me=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(xt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Fe=class i{constructor(e,t,n,r,s,a,o,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c)}set(e,t,n,r,s,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=r,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],m=n[5],p=n[8],_=r[0],f=r[3],g=r[6],x=r[1],v=r[4],M=r[7],L=r[2],P=r[5],O=r[8];return s[0]=a*_+o*x+l*L,s[3]=a*f+o*v+l*P,s[6]=a*g+o*M+l*O,s[1]=c*_+h*x+u*L,s[4]=c*f+h*v+u*P,s[7]=c*g+h*M+u*O,s[2]=d*_+m*x+p*L,s[5]=d*f+m*v+p*P,s[8]=d*g+m*M+p*O,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*s*h+n*o*l+r*s*c-r*a*l}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*s,m=c*s-a*l,p=t*u+n*d+r*m;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/p;return e[0]=u*_,e[1]=(r*c-h*n)*_,e[2]=(o*n-r*a)*_,e[3]=d*_,e[4]=(h*t-r*l)*_,e[5]=(r*s-o*t)*_,e[6]=m*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*s)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){let l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Qs.makeScale(e,t)),this}rotate(e){return this.premultiply(Qs.makeRotation(-e)),this}translate(e,t){return this.premultiply(Qs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Qs=new Fe;function Bc(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function fs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Vh(){let i=fs("canvas");return i.style.display="block",i}var El={};function ur(i){i in El||(El[i]=!0,console.warn(i))}var Je={enabled:!0,workingColorSpace:Ki,spaces:{},convert:function(i,e,t){return this.enabled!==!1&&e!==t&&e&&t&&(this.spaces[e].transfer===nt&&(i.r=An(i.r),i.g=An(i.g),i.b=An(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===nt&&(i.r=Oi(i.r),i.g=Oi(i.g),i.b=Oi(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Ii?Fs:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function An(i){return i<.04045?.0773993808*i:Math.pow(.9478672986*i+.0521327014,2.4)}function Oi(i){return i<.0031308?12.92*i:1.055*Math.pow(i,.41666)-.055}var Al=[.64,.33,.3,.6,.15,.06],Rl=[.2126,.7152,.0722],Cl=[.3127,.329],Pl=new Fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Il=new Fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715),xi;Je.define({[Ki]:{primaries:Al,whitePoint:Cl,transfer:Fs,toXYZ:Pl,fromXYZ:Il,luminanceCoefficients:Rl,workingColorSpaceConfig:{unpackColorSpace:Bt},outputColorSpaceConfig:{drawingBufferColorSpace:Bt}},[Bt]:{primaries:Al,whitePoint:Cl,transfer:nt,toXYZ:Pl,fromXYZ:Il,luminanceCoefficients:Rl,outputColorSpaceConfig:{drawingBufferColorSpace:Bt}}});var ho=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{xi===void 0&&(xi=fs("canvas")),xi.width=e.width,xi.height=e.height;let n=xi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=xi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=fs("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=255*An(s[a]/255);return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(255*An(t[n]/255)):t[n]=An(t[n]);return{data:t,width:e.width,height:e.height}}return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Gh=0,gs=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Gh++}),this.uuid=mi(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(ea(r[a].image)):s.push(ea(r[a]))}else s=ea(r);n.url=s}return t||(e.images[this.uuid]=n),n}};function ea(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ho.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Wh=0,Xt=class i extends Rn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=1001,r=1001,s=1006,a=1008,o=1023,l=1009,c=i.DEFAULT_ANISOTROPY,h=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wh++}),this.uuid=mi(),this.name="",this.source=new gs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new me(0,0),this.repeat=new me(1,1),this.center=new me(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ac)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ua:e.x=e.x-Math.floor(e.x);break;case gr:e.x=e.x<0?0:1;break;case Na:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case Ua:e.y=e.y-Math.floor(e.y);break;case gr:e.y=e.y<0?0:1;break;case Na:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Xt.DEFAULT_IMAGE=null,Xt.DEFAULT_MAPPING=Ac,Xt.DEFAULT_ANISOTROPY=1;var ut=class i{constructor(e=0,t=0,n=0,r=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],m=l[5],p=l[9],_=l[2],f=l[6],g=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(p-f)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(p+f)<.1&&Math.abs(c+m+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(c+1)/2,M=(m+1)/2,L=(g+1)/2,P=(h+d)/4,O=(u+_)/4,y=(p+f)/4;return v>M&&v>L?v<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(v),r=P/n,s=O/n):M>L?M<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),n=P/r,s=y/r):L<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(L),n=O/s,r=y/s),this.set(n,r,s,t),this}let x=Math.sqrt((f-p)*(f-p)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(f-p)/x,this.y=(u-_)/x,this.z=(d-h)/x,this.w=Math.acos((c+m+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},uo=class extends Rn{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ut(0,0,e,t),this.scissorTest=!1,this.viewport=new ut(0,0,e,t);let r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Tn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let s=new Xt(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new gs(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Kt=class extends uo{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},vs=class extends Xt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=gr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var po=class extends Xt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=gr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var It=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let l=n[r+0],c=n[r+1],h=n[r+2],u=n[r+3],d=s[a+0],m=s[a+1],p=s[a+2],_=s[a+3];if(o===0)return e[t+0]=l,e[t+1]=c,e[t+2]=h,void(e[t+3]=u);if(o===1)return e[t+0]=d,e[t+1]=m,e[t+2]=p,void(e[t+3]=_);if(u!==_||l!==d||c!==m||h!==p){let f=1-o,g=l*d+c*m+h*p+u*_,x=g>=0?1:-1,v=1-g*g;if(v>Number.EPSILON){let L=Math.sqrt(v),P=Math.atan2(L,g*x);f=Math.sin(f*P)/L,o=Math.sin(o*P)/L}let M=o*x;if(l=l*f+d*M,c=c*f+m*M,h=h*f+p*M,u=u*f+_*M,f===1-o){let L=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=L,c*=L,h*=L,u*=L}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,s,a){let o=n[r],l=n[r+1],c=n[r+2],h=n[r+3],u=s[a],d=s[a+1],m=s[a+2],p=s[a+3];return e[t]=o*p+h*u+l*m-c*d,e[t+1]=l*p+h*d+c*u-o*m,e[t+2]=c*p+h*m+o*d-l*u,e[t+3]=h*p-o*u-l*d-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(r/2),u=o(s/2),d=l(n/2),m=l(r/2),p=l(s/2);switch(a){case"XYZ":this._x=d*h*u+c*m*p,this._y=c*m*u-d*h*p,this._z=c*h*p+d*m*u,this._w=c*h*u-d*m*p;break;case"YXZ":this._x=d*h*u+c*m*p,this._y=c*m*u-d*h*p,this._z=c*h*p-d*m*u,this._w=c*h*u+d*m*p;break;case"ZXY":this._x=d*h*u-c*m*p,this._y=c*m*u+d*h*p,this._z=c*h*p+d*m*u,this._w=c*h*u-d*m*p;break;case"ZYX":this._x=d*h*u-c*m*p,this._y=c*m*u+d*h*p,this._z=c*h*p-d*m*u,this._w=c*h*u+d*m*p;break;case"YZX":this._x=d*h*u+c*m*p,this._y=c*m*u+d*h*p,this._z=c*h*p-d*m*u,this._w=c*h*u-d*m*p;break;case"XZY":this._x=d*h*u-c*m*p,this._y=c*m*u-d*h*p,this._z=c*h*p+d*m*u,this._w=c*h*u+d*m*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){let m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(h-l)*m,this._y=(s-c)*m,this._z=(a-r)*m}else if(n>o&&n>u){let m=2*Math.sqrt(1+n-o-u);this._w=(h-l)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+c)/m}else if(o>u){let m=2*Math.sqrt(1+o-n-u);this._w=(s-c)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(l+h)/m}else{let m=2*Math.sqrt(1+u-n-o);this._w=(a-r)/m,this._x=(s+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(xt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+r*c-s*l,this._y=r*h+a*l+s*o-n*c,this._z=s*h+a*c+n*l-r*o,this._w=a*h-n*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,r=this._y,s=this._z,a=this._w,o=a*e._w+n*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;let l=1-o*o;if(l<=Number.EPSILON){let m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*r+t*this._y,this._z=m*s+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},I=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ll.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ll.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*n),h=2*(o*t-s*r),u=2*(s*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-s*u,this.z=r+l*u+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-n*l,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ta.copy(this).projectOnVector(e),this.sub(ta)}reflect(e){return this.sub(ta.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(xt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,4*t)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,3*t)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=2*Math.random()-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ta=new I,Ll=new It,jt=class{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(rn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(rn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=rn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,rn):rn.fromBufferAttribute(s,a),rn.applyMatrix4(e.matrixWorld),this.expandByPoint(rn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Nr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Nr.copy(n.boundingBox)),Nr.applyMatrix4(e.matrixWorld),this.union(Nr)}let r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,rn),rn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(sr),Or.subVectors(this.max,sr),yi.subVectors(e.a,sr),Mi.subVectors(e.b,sr),bi.subVectors(e.c,sr),Un.subVectors(Mi,yi),Nn.subVectors(bi,Mi),$n.subVectors(yi,bi);let t=[0,-Un.z,Un.y,0,-Nn.z,Nn.y,0,-$n.z,$n.y,Un.z,0,-Un.x,Nn.z,0,-Nn.x,$n.z,0,-$n.x,-Un.y,Un.x,0,-Nn.y,Nn.x,0,-$n.y,$n.x,0];return!!na(t,yi,Mi,bi,Or)&&(t=[1,0,0,0,1,0,0,0,1],!!na(t,yi,Mi,bi,Or)&&(Fr.crossVectors(Un,Nn),t=[Fr.x,Fr.y,Fr.z],na(t,yi,Mi,bi,Or)))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,rn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=.5*this.getSize(rn).length()),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(yn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),yn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),yn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),yn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),yn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),yn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),yn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),yn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(yn)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},yn=[new I,new I,new I,new I,new I,new I,new I,new I],rn=new I,Nr=new jt,yi=new I,Mi=new I,bi=new I,Un=new I,Nn=new I,$n=new I,sr=new I,Or=new I,Fr=new I,Qn=new I;function na(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){Qn.fromArray(i,s);let o=r.x*Math.abs(Qn.x)+r.y*Math.abs(Qn.y)+r.z*Math.abs(Qn.z),l=e.dot(Qn),c=t.dot(Qn),h=n.dot(Qn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Xh=new jt,ar=new I,ia=new I,fn=class{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Xh.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ar.subVectors(e,this.center);let t=ar.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),r=.5*(n-this.radius);this.center.addScaledVector(ar,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ia.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ar.copy(e.center).add(ia)),this.expandByPoint(ar.copy(e.center).sub(ia))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},Mn=new I,ra=new I,Br=new I,On=new I,sa=new I,zr=new I,aa=new I,Gn=class{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Mn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Mn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Mn.copy(this.origin).addScaledVector(this.direction,t),Mn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){ra.copy(e).add(t).multiplyScalar(.5),Br.copy(t).sub(e).normalize(),On.copy(this.origin).sub(ra);let s=.5*e.distanceTo(t),a=-this.direction.dot(Br),o=On.dot(this.direction),l=-On.dot(Br),c=On.lengthSq(),h=Math.abs(1-a*a),u,d,m,p;if(h>0)if(u=a*l-o,d=a*o-l,p=s*h,u>=0)if(d>=-p)if(d<=p){let _=1/h;u*=_,d*=_,m=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=s,u=Math.max(0,-(a*d+o)),m=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(a*d+o)),m=-u*u+d*(d+2*l)+c;else d<=-p?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-l),s),m=-u*u+d*(d+2*l)+c):d<=p?(u=0,d=Math.min(Math.max(-s,-l),s),m=d*(d+2*l)+c):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-l),s),m=-u*u+d*(d+2*l)+c);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),m=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(ra).addScaledVector(Br,d),m}intersectSphere(e,t){Mn.subVectors(e.center,this.origin);let n=Mn.dot(this.direction),r=Mn.dot(Mn)-n*n,s=e.radius*e.radius;if(r>s)return null;let a=Math.sqrt(s-r),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0?!0:e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||s>r?null:((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>r?null:((o>n||n!=n)&&(n=o),(l<r||r!=r)&&(r=l),r<0?null:this.at(n>=0?n:r,t)))}intersectsBox(e){return this.intersectBox(e,Mn)!==null}intersectTriangle(e,t,n,r,s){sa.subVectors(t,e),zr.subVectors(n,e),aa.crossVectors(sa,zr);let a,o=this.direction.dot(aa);if(o>0){if(r)return null;a=1}else{if(!(o<0))return null;a=-1,o=-o}On.subVectors(this.origin,e);let l=a*this.direction.dot(zr.crossVectors(On,zr));if(l<0)return null;let c=a*this.direction.dot(sa.cross(On));if(c<0||l+c>o)return null;let h=-a*On.dot(aa);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ke=class i{constructor(e,t,n,r,s,a,o,l,c,h,u,d,m,p,_,f){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c,h,u,d,m,p,_,f)}set(e,t,n,r,s,a,o,l,c,h,u,d,m,p,_,f){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=s,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=u,g[14]=d,g[3]=m,g[7]=p,g[11]=_,g[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,r=1/Si.setFromMatrixColumn(e,0).length(),s=1/Si.setFromMatrixColumn(e,1).length(),a=1/Si.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let d=a*h,m=a*u,p=o*h,_=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=m+p*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=p+m*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*h,m=l*u,p=c*h,_=c*u;t[0]=d+_*o,t[4]=p*o-m,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=m*o-p,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*h,m=l*u,p=c*h,_=c*u;t[0]=d-_*o,t[4]=-a*u,t[8]=p+m*o,t[1]=m+p*o,t[5]=a*h,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*h,m=a*u,p=o*h,_=o*u;t[0]=l*h,t[4]=p*c-m,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=m*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,m=a*c,p=o*l,_=o*c;t[0]=l*h,t[4]=_-d*u,t[8]=p*u+m,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=m*u+p,t[10]=d-_*u}else if(e.order==="XZY"){let d=a*l,m=a*c,p=o*l,_=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=a*h,t[9]=m*u-p,t[2]=p*u-m,t[6]=o*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(jh,e,Yh)}lookAt(e,t,n){let r=this.elements;return Vt.subVectors(e,t),Vt.lengthSq()===0&&(Vt.z=1),Vt.normalize(),Fn.crossVectors(n,Vt),Fn.lengthSq()===0&&(Math.abs(n.z)===1?Vt.x+=1e-4:Vt.z+=1e-4,Vt.normalize(),Fn.crossVectors(n,Vt)),Fn.normalize(),kr.crossVectors(Vt,Fn),r[0]=Fn.x,r[4]=kr.x,r[8]=Vt.x,r[1]=Fn.y,r[5]=kr.y,r[9]=Vt.y,r[2]=Fn.z,r[6]=kr.z,r[10]=Vt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],m=n[13],p=n[2],_=n[6],f=n[10],g=n[14],x=n[3],v=n[7],M=n[11],L=n[15],P=r[0],O=r[4],y=r[8],b=r[12],w=r[1],R=r[5],C=r[9],B=r[13],U=r[2],k=r[6],j=r[10],ie=r[14],J=r[3],fe=r[7],Q=r[11],q=r[15];return s[0]=a*P+o*w+l*U+c*J,s[4]=a*O+o*R+l*k+c*fe,s[8]=a*y+o*C+l*j+c*Q,s[12]=a*b+o*B+l*ie+c*q,s[1]=h*P+u*w+d*U+m*J,s[5]=h*O+u*R+d*k+m*fe,s[9]=h*y+u*C+d*j+m*Q,s[13]=h*b+u*B+d*ie+m*q,s[2]=p*P+_*w+f*U+g*J,s[6]=p*O+_*R+f*k+g*fe,s[10]=p*y+_*C+f*j+g*Q,s[14]=p*b+_*B+f*ie+g*q,s[3]=x*P+v*w+M*U+L*J,s[7]=x*O+v*R+M*k+L*fe,s[11]=x*y+v*C+M*j+L*Q,s[15]=x*b+v*B+M*ie+L*q,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],m=e[14];return e[3]*(+s*l*u-r*c*u-s*o*d+n*c*d+r*o*m-n*l*m)+e[7]*(+t*l*m-t*c*d+s*a*d-r*a*m+r*c*h-s*l*h)+e[11]*(+t*c*u-t*o*m-s*a*u+n*a*m+s*o*h-n*c*h)+e[15]*(-r*o*h-t*l*u+t*o*d+r*a*u-n*a*d+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],m=e[11],p=e[12],_=e[13],f=e[14],g=e[15],x=u*f*c-_*d*c+_*l*m-o*f*m-u*l*g+o*d*g,v=p*d*c-h*f*c-p*l*m+a*f*m+h*l*g-a*d*g,M=h*_*c-p*u*c+p*o*m-a*_*m-h*o*g+a*u*g,L=p*u*l-h*_*l-p*o*d+a*_*d+h*o*f-a*u*f,P=t*x+n*v+r*M+s*L;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let O=1/P;return e[0]=x*O,e[1]=(_*d*s-u*f*s-_*r*m+n*f*m+u*r*g-n*d*g)*O,e[2]=(o*f*s-_*l*s+_*r*c-n*f*c-o*r*g+n*l*g)*O,e[3]=(u*l*s-o*d*s-u*r*c+n*d*c+o*r*m-n*l*m)*O,e[4]=v*O,e[5]=(h*f*s-p*d*s+p*r*m-t*f*m-h*r*g+t*d*g)*O,e[6]=(p*l*s-a*f*s-p*r*c+t*f*c+a*r*g-t*l*g)*O,e[7]=(a*d*s-h*l*s+h*r*c-t*d*c-a*r*m+t*l*m)*O,e[8]=M*O,e[9]=(p*u*s-h*_*s-p*n*m+t*_*m+h*n*g-t*u*g)*O,e[10]=(a*_*s-p*o*s+p*n*c-t*_*c-a*n*g+t*o*g)*O,e[11]=(h*o*s-a*u*s-h*n*c+t*u*c+a*n*m-t*o*m)*O,e[12]=L*O,e[13]=(h*_*r-p*u*r+p*n*d-t*_*d-h*n*f+t*u*f)*O,e[14]=(p*o*r-a*_*r-p*n*l+t*_*l+a*n*f-t*o*f)*O,e[15]=(a*u*r-h*o*r+h*n*l-t*u*l-a*n*d+t*o*d)*O,this}scale(e){let t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+n,c*o-r*l,c*l+r*o,0,c*o+r*l,h*o+n,h*l-r*a,0,c*l-r*o,h*l+r*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,u=o+o,d=s*c,m=s*h,p=s*u,_=a*h,f=a*u,g=o*u,x=l*c,v=l*h,M=l*u,L=n.x,P=n.y,O=n.z;return r[0]=(1-(_+g))*L,r[1]=(m+M)*L,r[2]=(p-v)*L,r[3]=0,r[4]=(m-M)*P,r[5]=(1-(d+g))*P,r[6]=(f+x)*P,r[7]=0,r[8]=(p+v)*O,r[9]=(f-x)*O,r[10]=(1-(d+_))*O,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements,s=Si.set(r[0],r[1],r[2]).length(),a=Si.set(r[4],r[5],r[6]).length(),o=Si.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],sn.copy(this);let l=1/s,c=1/a,h=1/o;return sn.elements[0]*=l,sn.elements[1]*=l,sn.elements[2]*=l,sn.elements[4]*=c,sn.elements[5]*=c,sn.elements[6]*=c,sn.elements[8]*=h,sn.elements[9]*=h,sn.elements[10]*=h,t.setFromRotationMatrix(sn),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,r,s,a,o=2e3){let l=this.elements,c=2*s/(t-e),h=2*s/(n-r),u=(t+e)/(t-e),d=(n+r)/(n-r),m,p;if(o===Vi)m=-(a+s)/(a-s),p=-2*a*s/(a-s);else{if(o!==ms)throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);m=-a/(a-s),p=-a*s/(a-s)}return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=p,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=2e3){let l=this.elements,c=1/(t-e),h=1/(n-r),u=1/(a-s),d=(t+e)*c,m=(n+r)*h,p,_;if(o===Vi)p=(a+s)*u,_=-2*u;else{if(o!==ms)throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);p=s*u,_=-1*u}return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=_,l[14]=-p,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Si=new I,sn=new ke,jh=new I(0,0,0),Yh=new I(1,1,1),Fn=new I,kr=new I,Vt=new I,Dl=new ke,Ul=new It,gn=class i{constructor(e=0,t=0,n=0,r=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],h=r[9],u=r[2],d=r[6],m=r[10];switch(t){case"XYZ":this._y=Math.asin(xt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-xt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(xt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-xt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(xt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-xt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Dl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Dl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ul.setFromEuler(this),this.setFromQuaternion(Ul,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};gn.DEFAULT_ORDER="XYZ";var _s=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return!!(this.mask&e.mask)}isEnabled(e){return!!(this.mask&1<<e)}},qh=0,Nl=new I,wi=new It,bn=new ke,Hr=new I,or=new I,Zh=new I,Kh=new It,Ol=new I(1,0,0),Fl=new I(0,1,0),Bl=new I(0,0,1),zl={type:"added"},Jh={type:"removed"},Ti={type:"childadded",child:null},oa={type:"childremoved",child:null},cn=class i extends Rn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qh++}),this.uuid=mi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new I,t=new gn,n=new It,r=new I(1,1,1);t._onChange((function(){n.setFromEuler(t,!1)})),n._onChange((function(){t.setFromQuaternion(n,void 0,!1)})),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ke},normalMatrix:{value:new Fe}}),this.matrix=new ke,this.matrixWorld=new ke,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new _s,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return wi.setFromAxisAngle(e,t),this.quaternion.multiply(wi),this}rotateOnWorldAxis(e,t){return wi.setFromAxisAngle(e,t),this.quaternion.premultiply(wi),this}rotateX(e){return this.rotateOnAxis(Ol,e)}rotateY(e){return this.rotateOnAxis(Fl,e)}rotateZ(e){return this.rotateOnAxis(Bl,e)}translateOnAxis(e,t){return Nl.copy(e).applyQuaternion(this.quaternion),this.position.add(Nl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ol,e)}translateY(e){return this.translateOnAxis(Fl,e)}translateZ(e){return this.translateOnAxis(Bl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(bn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Hr.copy(e):Hr.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),or.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?bn.lookAt(or,Hr,this.up):bn.lookAt(Hr,or,this.up),this.quaternion.setFromRotationMatrix(bn),r&&(bn.extractRotation(r.matrixWorld),wi.setFromRotationMatrix(bn),this.quaternion.premultiply(wi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(zl),Ti.child=e,this.dispatchEvent(Ti),Ti.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Jh),oa.child=e,this.dispatchEvent(oa),oa.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),bn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),bn.multiply(e.parent.matrixWorld)),e.applyMatrix4(bn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(zl),Ti.child=e,this.dispatchEvent(Ti),Ti.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let s=this.children[n].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,e,Zh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,Kh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let r={};function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map((o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()}))),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()})),this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),m=a(e.animations),p=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),p.length>0&&(n.nodes=p)}return n.object=r,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let r=e.children[n];this.add(r.clone())}return this}};cn.DEFAULT_UP=new I(0,1,0),cn.DEFAULT_MATRIX_AUTO_UPDATE=!0,cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var an=new I,Sn=new I,la=new I,wn=new I,Ei=new I,Ai=new I,kl=new I,ca=new I,ha=new I,ua=new I,da=new ut,pa=new ut,ma=new ut,kn=class i{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),an.subVectors(e,t),r.cross(an);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){an.subVectors(r,t),Sn.subVectors(n,t),la.subVectors(e,t);let a=an.dot(an),o=an.dot(Sn),l=an.dot(la),c=Sn.dot(Sn),h=Sn.dot(la),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;let d=1/u,m=(c*l-o*h)*d,p=(a*h-o*l)*d;return s.set(1-m-p,p,m)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,wn)!==null&&wn.x>=0&&wn.y>=0&&wn.x+wn.y<=1}static getInterpolation(e,t,n,r,s,a,o,l){return this.getBarycoord(e,t,n,r,wn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,wn.x),l.addScaledVector(a,wn.y),l.addScaledVector(o,wn.z),l)}static getInterpolatedAttribute(e,t,n,r,s,a){return da.setScalar(0),pa.setScalar(0),ma.setScalar(0),da.fromBufferAttribute(e,t),pa.fromBufferAttribute(e,n),ma.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(da,s.x),a.addScaledVector(pa,s.y),a.addScaledVector(ma,s.z),a}static isFrontFacing(e,t,n,r){return an.subVectors(n,t),Sn.subVectors(e,t),an.cross(Sn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return an.subVectors(this.c,this.b),Sn.subVectors(this.a,this.b),.5*an.cross(Sn).length()}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return i.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,s=this.c,a,o;Ei.subVectors(r,n),Ai.subVectors(s,n),ca.subVectors(e,n);let l=Ei.dot(ca),c=Ai.dot(ca);if(l<=0&&c<=0)return t.copy(n);ha.subVectors(e,r);let h=Ei.dot(ha),u=Ai.dot(ha);if(h>=0&&u<=h)return t.copy(r);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Ei,a);ua.subVectors(e,s);let m=Ei.dot(ua),p=Ai.dot(ua);if(p>=0&&m<=p)return t.copy(s);let _=m*c-l*p;if(_<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Ai,o);let f=h*p-m*u;if(f<=0&&u-h>=0&&m-p>=0)return kl.subVectors(s,r),o=(u-h)/(u-h+(m-p)),t.copy(r).addScaledVector(kl,o);let g=1/(f+_+d);return a=_*g,o=d*g,t.copy(n).addScaledVector(Ei,a).addScaledVector(Ai,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},zc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bn={h:0,s:0,l:0},Vr={h:0,s:0,l:0};function fa(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+6*(e-i)*t:t<.5?e:t<2/3?i+6*(e-i)*(2/3-t):i}var Ne=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(255&e)/255,Je.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=Je.workingColorSpace){return this.r=e,this.g=t,this.b=n,Je.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=Je.workingColorSpace){if(e=co(e,1),t=xt(t,0,1),n=xt(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=fa(a,s,e+1/3),this.g=fa(a,s,e),this.b=fa(a,s,e-1/3)}return Je.toWorkingColorSpace(this,r),this}setStyle(e,t=Bt){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Bt){let n=zc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=An(e.r),this.g=An(e.g),this.b=An(e.b),this}copyLinearToSRGB(e){return this.r=Oi(e.r),this.g=Oi(e.g),this.b=Oi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Bt){return Je.fromWorkingColorSpace(Pt.copy(this),e),65536*Math.round(xt(255*Pt.r,0,255))+256*Math.round(xt(255*Pt.g,0,255))+Math.round(xt(255*Pt.b,0,255))}getHexString(e=Bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.fromWorkingColorSpace(Pt.copy(this),t);let n=Pt.r,r=Pt.g,s=Pt.b,a=Math.max(n,r,s),o=Math.min(n,r,s),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(r-s)/u+(r<s?6:0);break;case r:l=(s-n)/u+2;break;case s:l=(n-r)/u+4}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Je.workingColorSpace){return Je.fromWorkingColorSpace(Pt.copy(this),t),e.r=Pt.r,e.g=Pt.g,e.b=Pt.b,e}getStyle(e=Bt){Je.fromWorkingColorSpace(Pt.copy(this),e);let t=Pt.r,n=Pt.g,r=Pt.b;return e!==Bt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(255*t)},${Math.round(255*n)},${Math.round(255*r)})`}offsetHSL(e,t,n){return this.getHSL(Bn),this.setHSL(Bn.h+e,Bn.s+t,Bn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Bn),e.getHSL(Vr);let n=dr(Bn.h,Vr.h,t),r=dr(Bn.s,Vr.s,t),s=dr(Bn.l,Vr.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Pt=new Ne;Ne.NAMES=zc;var $h=0,ci=class extends Rn{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$h++}),this.uuid=mi(),this.name="",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Pa,this.blendDst=Ia,this.blendEquation=si,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ne(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=_i,this.stencilZFail=_i,this.stencilZPass=_i,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r!==void 0?r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n:console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`)}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};function r(s){let a=[];for(let o in s){let l=s[o];delete l.metadata,a.push(l)}return a}if(n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Pa&&(n.blendSrc=this.blendSrc),this.blendDst!==Ia&&(n.blendDst=this.blendDst),this.blendEquation!==si&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==_i&&(n.stencilFail=this.stencilFail),this.stencilZFail!==_i&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==_i&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData),t){let s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},hi=class extends ci{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},bp=Qh();function Qh(){let i=new ArrayBuffer(4),e=new Float32Array(i),t=new Uint32Array(i),n=new Uint32Array(512),r=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[256|l]=32768,r[l]=24,r[256|l]=24):c<-14?(n[l]=1024>>-c-14,n[256|l]=1024>>-c-14|32768,r[l]=-c-1,r[256|l]=-c-1):c<=15?(n[l]=c+15<<10,n[256|l]=c+15<<10|32768,r[l]=13,r[256|l]=13):c<128?(n[l]=31744,n[256|l]=64512,r[l]=24,r[256|l]=24):(n[l]=31744,n[256|l]=64512,r[l]=13,r[256|l]=13)}let s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(8388608&c);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:r,mantissaTable:s,exponentTable:a,offsetTable:o}}var _t=new I,Gr=new me,vt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Sl,this.updateRanges=[],this.gpuType=ln,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Gr.fromBufferAttribute(this,t),Gr.applyMatrix3(e),this.setXY(t,Gr.x,Gr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix3(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix4(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyNormalMatrix(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.transformDirection(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Li(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Dt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Li(t,this.array)),t}setX(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Li(t,this.array)),t}setY(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Li(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Li(t,this.array)),t}setW(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),r=Dt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),r=Dt(r,this.array),s=Dt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Sl&&(e.usage=this.usage),e}};var xs=class extends vt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var ys=class extends vt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Re=class extends vt{constructor(e,t,n){super(new Float32Array(e),t,n)}},eu=0,qt=new ke,ga=new cn,Ri=new I,Gt=new jt,lr=new jt,Tt=new I,rt=class i extends Rn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:eu++}),this.uuid=mi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Bc(e)?ys:xs)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Fe().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return qt.makeRotationFromQuaternion(e),this.applyMatrix4(qt),this}rotateX(e){return qt.makeRotationX(e),this.applyMatrix4(qt),this}rotateY(e){return qt.makeRotationY(e),this.applyMatrix4(qt),this}rotateZ(e){return qt.makeRotationZ(e),this.applyMatrix4(qt),this}translate(e,t,n){return qt.makeTranslation(e,t,n),this.applyMatrix4(qt),this}scale(e,t,n){return qt.makeScale(e,t,n),this.applyMatrix4(qt),this}lookAt(e){return ga.lookAt(e),ga.updateMatrix(),this.applyMatrix4(ga.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ri).negate(),this.translate(Ri.x,Ri.y,Ri.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let r=0,s=e.length;r<s;r++){let a=e[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Re(n,3))}else{for(let n=0,r=t.count;n<r;n++){let s=e[n];t.setXYZ(n,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new jt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),void this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){let s=t[n];Gt.setFromBufferAttribute(s),this.morphTargetsRelative?(Tt.addVectors(this.boundingBox.min,Gt.min),this.boundingBox.expandByPoint(Tt),Tt.addVectors(this.boundingBox.max,Gt.max),this.boundingBox.expandByPoint(Tt)):(this.boundingBox.expandByPoint(Gt.min),this.boundingBox.expandByPoint(Gt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),void this.boundingSphere.set(new I,1/0);if(e){let n=this.boundingSphere.center;if(Gt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let o=t[s];lr.setFromBufferAttribute(o),this.morphTargetsRelative?(Tt.addVectors(Gt.min,lr.min),Gt.expandByPoint(Tt),Tt.addVectors(Gt.max,lr.max),Gt.expandByPoint(Tt)):(Gt.expandByPoint(lr.min),Gt.expandByPoint(lr.max))}Gt.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)Tt.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(Tt));if(t)for(let s=0,a=t.length;s<a;s++){let o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Tt.fromBufferAttribute(o,c),l&&(Ri.fromBufferAttribute(e,c),Tt.add(Ri)),r=Math.max(r,n.distanceToSquared(Tt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0)return void console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");let n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new vt(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let y=0;y<n.count;y++)o[y]=new I,l[y]=new I;let c=new I,h=new I,u=new I,d=new me,m=new me,p=new me,_=new I,f=new I;function g(y,b,w){c.fromBufferAttribute(n,y),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,w),d.fromBufferAttribute(s,y),m.fromBufferAttribute(s,b),p.fromBufferAttribute(s,w),h.sub(c),u.sub(c),m.sub(d),p.sub(d);let R=1/(m.x*p.y-p.x*m.y);isFinite(R)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(u,-m.y).multiplyScalar(R),f.copy(u).multiplyScalar(m.x).addScaledVector(h,-p.x).multiplyScalar(R),o[y].add(_),o[b].add(_),o[w].add(_),l[y].add(f),l[b].add(f),l[w].add(f))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let y=0,b=x.length;y<b;++y){let w=x[y],R=w.start;for(let C=R,B=R+w.count;C<B;C+=3)g(e.getX(C+0),e.getX(C+1),e.getX(C+2))}let v=new I,M=new I,L=new I,P=new I;function O(y){L.fromBufferAttribute(r,y),P.copy(L);let b=o[y];v.copy(b),v.sub(L.multiplyScalar(L.dot(b))).normalize(),M.crossVectors(P,b);let w=M.dot(l[y])<0?-1:1;a.setXYZW(y,v.x,v.y,v.z,w)}for(let y=0,b=x.length;y<b;++y){let w=x[y],R=w.start;for(let C=R,B=R+w.count;C<B;C+=3)O(e.getX(C+0)),O(e.getX(C+1)),O(e.getX(C+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new vt(new Float32Array(3*t.count),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);let r=new I,s=new I,a=new I,o=new I,l=new I,c=new I,h=new I,u=new I;if(e)for(let d=0,m=e.count;d<m;d+=3){let p=e.getX(d+0),_=e.getX(d+1),f=e.getX(d+2);r.fromBufferAttribute(t,p),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,f),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,f),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let d=0,m=t.count;d<m;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,s),u.subVectors(r,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Tt.fromBufferAttribute(e,t),Tt.normalize(),e.setXYZ(t,Tt.x,Tt.y,Tt.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),m=0,p=0;for(let _=0,f=l.length;_<f;_++){m=o.isInterleavedBufferAttribute?l[_]*o.data.stride+o.offset:l[_]*h;for(let g=0;g<h;g++)d[p++]=c[m++]}return new vt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,r=this.attributes;for(let o in r){let l=e(r[o],n);t.setAttribute(o,l)}let s=this.morphAttributes;for(let o in s){let l=[],c=s[o];for(let h=0,u=c.length;h<u;h++){let d=e(c[h],n);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let m=c[u];h.push(m.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let r=e.attributes;for(let c in r){let h=r[c];this.setAttribute(c,h.clone(t))}let s=e.morphAttributes;for(let c in s){let h=[],u=s[c];for(let d=0,m=u.length;d<m;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Hl=new ke,ei=new Gn,Wr=new fn,Vl=new I,Xr=new I,jr=new I,Yr=new I,va=new I,qr=new I,Gl=new I,Zr=new I,Et=class extends cn{constructor(e=new rt,t=new hi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=n.length;r<s;r++){let a=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(s&&o){qr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=o[l],u=s[l];h!==0&&(va.fromBufferAttribute(u,e),a?qr.addScaledVector(va,h):qr.addScaledVector(va.sub(t),h))}t.add(qr)}return t}raycast(e,t){let n=this.geometry,r=this.material,s=this.matrixWorld;if(r!==void 0){if(n.boundingSphere===null&&n.computeBoundingSphere(),Wr.copy(n.boundingSphere),Wr.applyMatrix4(s),ei.copy(e.ray).recast(e.near),Wr.containsPoint(ei.origin)===!1&&(ei.intersectSphere(Wr,Vl)===null||ei.origin.distanceToSquared(Vl)>(e.far-e.near)**2))return;Hl.copy(s).invert(),ei.copy(e.ray).applyMatrix4(Hl),n.boundingBox!==null&&ei.intersectsBox(n.boundingBox)===!1||this._computeIntersections(e,t,ei)}}_computeIntersections(e,t,n){let r,s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){let f=d[p],g=a[f.materialIndex];for(let x=Math.max(f.start,m.start),v=Math.min(o.count,Math.min(f.start+f.count,m.start+m.count));x<v;x+=3)r=Kr(this,g,e,n,c,h,u,o.getX(x),o.getX(x+1),o.getX(x+2)),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=f.materialIndex,t.push(r))}else for(let p=Math.max(0,m.start),_=Math.min(o.count,m.start+m.count);p<_;p+=3)r=Kr(this,a,e,n,c,h,u,o.getX(p),o.getX(p+1),o.getX(p+2)),r&&(r.faceIndex=Math.floor(p/3),t.push(r));else if(l!==void 0)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){let f=d[p],g=a[f.materialIndex];for(let x=Math.max(f.start,m.start),v=Math.min(l.count,Math.min(f.start+f.count,m.start+m.count));x<v;x+=3)r=Kr(this,g,e,n,c,h,u,x,x+1,x+2),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=f.materialIndex,t.push(r))}else for(let p=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);p<_;p+=3)r=Kr(this,a,e,n,c,h,u,p,p+1,p+2),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}};function Kr(i,e,t,n,r,s,a,o,l,c){i.getVertexPosition(o,Xr),i.getVertexPosition(l,jr),i.getVertexPosition(c,Yr);let h=(function(u,d,m,p,_,f,g,x){let v;if(v=d.side===1?p.intersectTriangle(g,f,_,!0,x):p.intersectTriangle(_,f,g,d.side===0,x),v===null)return null;Zr.copy(x),Zr.applyMatrix4(u.matrixWorld);let M=m.ray.origin.distanceTo(Zr);return M<m.near||M>m.far?null:{distance:M,point:Zr.clone(),object:u}})(i,e,t,n,Xr,jr,Yr,Gl);if(h){let u=new I;kn.getBarycoord(Gl,Xr,jr,Yr,u),r&&(h.uv=kn.getInterpolatedAttribute(r,o,l,c,u,new me)),s&&(h.uv1=kn.getInterpolatedAttribute(s,o,l,c,u,new me)),a&&(h.normal=kn.getInterpolatedAttribute(a,o,l,c,u,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new I,materialIndex:0};kn.getNormal(Xr,jr,Yr,d.normal),h.face=d,h.barycoord=u}return h}var Gi=class i extends rt{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};let o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,m=0;function p(_,f,g,x,v,M,L,P,O,y,b){let w=M/O,R=L/y,C=M/2,B=L/2,U=P/2,k=O+1,j=y+1,ie=0,J=0,fe=new I;for(let Q=0;Q<j;Q++){let q=Q*R-B;for(let ee=0;ee<k;ee++){let ce=ee*w-C;fe[_]=ce*x,fe[f]=q*v,fe[g]=U,c.push(fe.x,fe.y,fe.z),fe[_]=0,fe[f]=0,fe[g]=P>0?1:-1,h.push(fe.x,fe.y,fe.z),u.push(ee/O),u.push(1-Q/y),ie+=1}}for(let Q=0;Q<y;Q++)for(let q=0;q<O;q++){let ee=d+q+k*Q,ce=d+q+k*(Q+1),ne=d+(q+1)+k*(Q+1),ae=d+(q+1)+k*Q;l.push(ee,ce,ae),l.push(ce,ne,ae),J+=6}o.addGroup(m,J,b),m+=J,d+=ie}p("z","y","x",-1,-1,n,t,e,a,s,0),p("z","y","x",1,-1,n,t,-e,a,s,1),p("x","z","y",1,1,e,n,t,r,a,2),p("x","z","y",1,-1,e,n,-t,r,a,3),p("x","y","z",1,-1,e,t,n,r,s,4),p("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new Re(c,3)),this.setAttribute("normal",new Re(h,3)),this.setAttribute("uv",new Re(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Wi(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function Ut(i){let e={};for(let t=0;t<i.length;t++){let n=Wi(i[t]);for(let r in n)e[r]=n[r]}return e}function kc(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}var tu={clone:Wi,merge:Ut},Ot=class extends ci{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,this.fragmentShader=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Wi(e.uniforms),this.uniformsGroups=(function(t){let n=[];for(let r=0;r<t.length;r++)n.push(t[r].clone());return n})(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let s=this.uniforms[r].value;s&&s.isTexture?t.uniforms[r]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[r]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[r]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[r]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[r]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[r]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[r]={type:"m4",value:s.toArray()}:t.uniforms[r]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},ui=class extends cn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ke,this.projectionMatrix=new ke,this.projectionMatrixInverse=new ke,this.coordinateSystem=Vi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},zn=new I,Wl=new me,Xl=new me,Nt=class extends ui{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=2*xr*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(.5*Ni*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return 2*xr*Math.atan(Math.tan(.5*Ni*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){zn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(zn.x,zn.y).multiplyScalar(-e/zn.z),zn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(zn.x,zn.y).multiplyScalar(-e/zn.z)}getViewSize(e,t){return this.getViewBounds(e,Wl,Xl),t.subVectors(Xl,Wl)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(.5*Ni*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*n/c,r*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ci=-90,mo=class extends cn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Nt(Ci,1,e,t);r.layers=this.layers,this.add(r);let s=new Nt(Ci,1,e,t);s.layers=this.layers,this.add(s);let a=new Nt(Ci,1,e,t);a.layers=this.layers,this.add(a);let o=new Nt(Ci,1,e,t);o.layers=this.layers,this.add(o);let l=new Nt(Ci,1,e,t);l.layers=this.layers,this.add(l);let c=new Nt(Ci,1,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,l]=t;for(let c of t)this.remove(c);if(e===Vi)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else{if(e!==ms)throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1)}for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,a),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,l),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,r),e.render(t,h),e.setRenderTarget(u,d,m),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Ms=class extends Xt{constructor(e,t,n,r,s,a,o,l,c,h){super(e=e!==void 0?e:[],t=t!==void 0?t:Bi,n,r,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},fo=class extends Kt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Ms(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0&&t.generateMipmaps,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Tn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Gi(5,5,5),s=new Ot({name:"CubemapFromEquirect",uniforms:Wi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=t;let a=new Et(r,s),o=t.minFilter;return t.minFilter===Di&&(t.minFilter=Tn),new mo(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,r){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}},_a=new I,nu=new I,iu=new Fe,on=class{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=_a.subVectors(n,t).cross(nu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(_a),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||iu.getNormalMatrix(e),r=this.coplanarPoint(_a).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},ti=new fn,Jr=new I,yr=class{constructor(e=new on,t=new on,n=new on,r=new on,s=new on,a=new on){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2e3){let n=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],h=r[5],u=r[6],d=r[7],m=r[8],p=r[9],_=r[10],f=r[11],g=r[12],x=r[13],v=r[14],M=r[15];if(n[0].setComponents(l-s,d-c,f-m,M-g).normalize(),n[1].setComponents(l+s,d+c,f+m,M+g).normalize(),n[2].setComponents(l+a,d+h,f+p,M+x).normalize(),n[3].setComponents(l-a,d-h,f-p,M-x).normalize(),n[4].setComponents(l-o,d-u,f-_,M-v).normalize(),t===Vi)n[5].setComponents(l+o,d+u,f+_,M+v).normalize();else{if(t!==ms)throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);n[5].setComponents(o,u,_,v).normalize()}return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ti.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ti.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ti)}intersectsSprite(e){return ti.center.set(0,0,0),ti.radius=.7071067811865476,ti.applyMatrix4(e.matrixWorld),this.intersectsSphere(ti)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Jr.x=r.normal.x>0?e.max.x:e.min.x,Jr.y=r.normal.y>0?e.max.y:e.min.y,Jr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Jr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Hc(){let i=null,e=!1,t=null,n=null;function r(s,a){t(s,a),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function ru(i){let e=new WeakMap;return{get:function(t){return t.isInterleavedBufferAttribute&&(t=t.data),e.get(t)},remove:function(t){t.isInterleavedBufferAttribute&&(t=t.data);let n=e.get(t);n&&(i.deleteBuffer(n.buffer),e.delete(t))},update:function(t,n){if(t.isInterleavedBufferAttribute&&(t=t.data),t.isGLBufferAttribute){let s=e.get(t);return void((!s||s.version<t.version)&&e.set(t,{buffer:t.buffer,type:t.type,bytesPerElement:t.elementSize,version:t.version}))}let r=e.get(t);if(r===void 0)e.set(t,(function(s,a){let o=s.array,l=s.usage,c=o.byteLength,h=i.createBuffer(),u;if(i.bindBuffer(a,h),i.bufferData(a,o,l),s.onUploadCallback(),o instanceof Float32Array)u=i.FLOAT;else if(o instanceof Uint16Array)u=s.isFloat16BufferAttribute?i.HALF_FLOAT:i.UNSIGNED_SHORT;else if(o instanceof Int16Array)u=i.SHORT;else if(o instanceof Uint32Array)u=i.UNSIGNED_INT;else if(o instanceof Int32Array)u=i.INT;else if(o instanceof Int8Array)u=i.BYTE;else if(o instanceof Uint8Array)u=i.UNSIGNED_BYTE;else{if(!(o instanceof Uint8ClampedArray))throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+o);u=i.UNSIGNED_BYTE}return{buffer:h,type:u,bytesPerElement:o.BYTES_PER_ELEMENT,version:s.version,size:c}})(t,n));else if(r.version<t.version){if(r.size!==t.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");(function(s,a,o){let l=a.array,c=a.updateRanges;if(i.bindBuffer(o,s),c.length===0)i.bufferSubData(o,0,l);else{c.sort(((u,d)=>u.start-d.start));let h=0;for(let u=1;u<c.length;u++){let d=c[h],m=c[u];m.start<=d.start+d.count+1?d.count=Math.max(d.count,m.start+m.count-d.start):(++h,c[h]=m)}c.length=h+1;for(let u=0,d=c.length;u<d;u++){let m=c[u];i.bufferSubData(o,m.start*l.BYTES_PER_ELEMENT,l,m.start,m.count)}a.clearUpdateRanges()}a.onUploadCallback()})(r.buffer,t,n),r.version=t.version}}}}var Wn=class i extends rt{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(r),c=o+1,h=l+1,u=e/o,d=t/l,m=[],p=[],_=[],f=[];for(let g=0;g<h;g++){let x=g*d-a;for(let v=0;v<c;v++){let M=v*u-s;p.push(M,-x,0),_.push(0,0,1),f.push(v/o),f.push(1-g/l)}}for(let g=0;g<l;g++)for(let x=0;x<o;x++){let v=x+c*g,M=x+c*(g+1),L=x+1+c*(g+1),P=x+1+c*g;m.push(v,M,P),m.push(M,L,P)}this.setIndex(m),this.setAttribute("position",new Re(p,3)),this.setAttribute("normal",new Re(_,3)),this.setAttribute("uv",new Re(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},Ue={alphahash_fragment:`#ifdef USE_ALPHAHASH
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
}`},ve={common:{diffuse:{value:new Ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new me(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new Ne(16777215)},opacity:{value:1},center:{value:new me(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},mn={basic:{uniforms:Ut([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:Ue.meshbasic_vert,fragmentShader:Ue.meshbasic_frag},lambert:{uniforms:Ut([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ne(0)}}]),vertexShader:Ue.meshlambert_vert,fragmentShader:Ue.meshlambert_frag},phong:{uniforms:Ut([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ne(0)},specular:{value:new Ne(1118481)},shininess:{value:30}}]),vertexShader:Ue.meshphong_vert,fragmentShader:Ue.meshphong_frag},standard:{uniforms:Ut([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag},toon:{uniforms:Ut([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Ne(0)}}]),vertexShader:Ue.meshtoon_vert,fragmentShader:Ue.meshtoon_frag},matcap:{uniforms:Ut([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:Ue.meshmatcap_vert,fragmentShader:Ue.meshmatcap_frag},points:{uniforms:Ut([ve.points,ve.fog]),vertexShader:Ue.points_vert,fragmentShader:Ue.points_frag},dashed:{uniforms:Ut([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ue.linedashed_vert,fragmentShader:Ue.linedashed_frag},depth:{uniforms:Ut([ve.common,ve.displacementmap]),vertexShader:Ue.depth_vert,fragmentShader:Ue.depth_frag},normal:{uniforms:Ut([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:Ue.meshnormal_vert,fragmentShader:Ue.meshnormal_frag},sprite:{uniforms:Ut([ve.sprite,ve.fog]),vertexShader:Ue.sprite_vert,fragmentShader:Ue.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ue.background_vert,fragmentShader:Ue.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:Ue.backgroundCube_vert,fragmentShader:Ue.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ue.cube_vert,fragmentShader:Ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ue.equirect_vert,fragmentShader:Ue.equirect_frag},distanceRGBA:{uniforms:Ut([ve.common,ve.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ue.distanceRGBA_vert,fragmentShader:Ue.distanceRGBA_frag},shadow:{uniforms:Ut([ve.lights,ve.fog,{color:{value:new Ne(0)},opacity:{value:1}}]),vertexShader:Ue.shadow_vert,fragmentShader:Ue.shadow_frag}};mn.physical={uniforms:Ut([mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new me(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new Ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new me},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new Ne(0)},specularColor:{value:new Ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new me},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag};var $r={r:0,b:0,g:0},ni=new gn,su=new ke;function au(i,e,t,n,r,s,a){let o=new Ne(0),l,c,h=s===!0?0:1,u=null,d=0,m=null;function p(f){let g=f.isScene===!0?f.background:null;return g&&g.isTexture&&(g=(f.backgroundBlurriness>0?t:e).get(g)),g}function _(f,g){f.getRGB($r,kc(i)),n.buffers.color.setClear($r.r,$r.g,$r.b,g,a)}return{getClearColor:function(){return o},setClearColor:function(f,g=1){o.set(f),h=g,_(o,h)},getClearAlpha:function(){return h},setClearAlpha:function(f){h=f,_(o,h)},render:function(f){let g=!1,x=p(f);x===null?_(o,h):x&&x.isColor&&(_(x,1),g=!0);let v=i.xr.getEnvironmentBlendMode();v==="additive"?n.buffers.color.setClear(0,0,0,1,a):v==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||g)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))},addToRenderList:function(f,g){let x=p(g);x&&(x.isCubeTexture||x.mapping===Os)?(c===void 0&&(c=new Et(new Gi(1,1,1),new Ot({name:"BackgroundCubeMaterial",uniforms:Wi(mn.backgroundCube.uniforms),vertexShader:mn.backgroundCube.vertexShader,fragmentShader:mn.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(v,M,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(c)),ni.copy(g.backgroundRotation),ni.x*=-1,ni.y*=-1,ni.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(ni.y*=-1,ni.z*=-1),c.material.uniforms.envMap.value=x,c.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(su.makeRotationFromEuler(ni)),c.material.toneMapped=Je.getTransfer(x.colorSpace)!==nt,u===x&&d===x.version&&m===i.toneMapping||(c.material.needsUpdate=!0,u=x,d=x.version,m=i.toneMapping),c.layers.enableAll(),f.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new Et(new Wn(2,2),new Ot({name:"BackgroundMaterial",uniforms:Wi(mn.background.uniforms),vertexShader:mn.background.vertexShader,fragmentShader:mn.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,l.material.toneMapped=Je.getTransfer(x.colorSpace)!==nt,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),u===x&&d===x.version&&m===i.toneMapping||(l.material.needsUpdate=!0,u=x,d=x.version,m=i.toneMapping),l.layers.enableAll(),f.unshift(l,l.geometry,l.material,0,0,null))}}}function ou(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=c(null),s=r,a=!1;function o(g){return i.bindVertexArray(g)}function l(g){return i.deleteVertexArray(g)}function c(g){let x=[],v=[],M=[];for(let L=0;L<t;L++)x[L]=0,v[L]=0,M[L]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:x,enabledAttributes:v,attributeDivisors:M,object:g,attributes:{},index:null}}function h(){let g=s.newAttributes;for(let x=0,v=g.length;x<v;x++)g[x]=0}function u(g){d(g,0)}function d(g,x){let v=s.newAttributes,M=s.enabledAttributes,L=s.attributeDivisors;v[g]=1,M[g]===0&&(i.enableVertexAttribArray(g),M[g]=1),L[g]!==x&&(i.vertexAttribDivisor(g,x),L[g]=x)}function m(){let g=s.newAttributes,x=s.enabledAttributes;for(let v=0,M=x.length;v<M;v++)x[v]!==g[v]&&(i.disableVertexAttribArray(v),x[v]=0)}function p(g,x,v,M,L,P,O){O===!0?i.vertexAttribIPointer(g,x,v,L,P):i.vertexAttribPointer(g,x,v,M,L,P)}function _(){f(),a=!0,s!==r&&(s=r,o(s.object))}function f(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:function(g,x,v,M,L){let P=!1,O=(function(y,b,w){let R=w.wireframe===!0,C=n[y.id];C===void 0&&(C={},n[y.id]=C);let B=C[b.id];B===void 0&&(B={},C[b.id]=B);let U=B[R];return U===void 0&&(U=c(i.createVertexArray()),B[R]=U),U})(M,v,x);s!==O&&(s=O,o(s.object)),P=(function(y,b,w,R){let C=s.attributes,B=b.attributes,U=0,k=w.getAttributes();for(let j in k)if(k[j].location>=0){let ie=C[j],J=B[j];if(J===void 0&&(j==="instanceMatrix"&&y.instanceMatrix&&(J=y.instanceMatrix),j==="instanceColor"&&y.instanceColor&&(J=y.instanceColor)),ie===void 0||ie.attribute!==J||J&&ie.data!==J.data)return!0;U++}return s.attributesNum!==U||s.index!==R})(g,M,v,L),P&&(function(y,b,w,R){let C={},B=b.attributes,U=0,k=w.getAttributes();for(let j in k)if(k[j].location>=0){let ie=B[j];ie===void 0&&(j==="instanceMatrix"&&y.instanceMatrix&&(ie=y.instanceMatrix),j==="instanceColor"&&y.instanceColor&&(ie=y.instanceColor));let J={};J.attribute=ie,ie&&ie.data&&(J.data=ie.data),C[j]=J,U++}s.attributes=C,s.attributesNum=U,s.index=R})(g,M,v,L),L!==null&&e.update(L,i.ELEMENT_ARRAY_BUFFER),(P||a)&&(a=!1,(function(y,b,w,R){h();let C=R.attributes,B=w.getAttributes(),U=b.defaultAttributeValues;for(let k in B){let j=B[k];if(j.location>=0){let ie=C[k];if(ie===void 0&&(k==="instanceMatrix"&&y.instanceMatrix&&(ie=y.instanceMatrix),k==="instanceColor"&&y.instanceColor&&(ie=y.instanceColor)),ie!==void 0){let J=ie.normalized,fe=ie.itemSize,Q=e.get(ie);if(Q===void 0)continue;let q=Q.buffer,ee=Q.type,ce=Q.bytesPerElement,ne=ee===i.INT||ee===i.UNSIGNED_INT||ie.gpuType===nl;if(ie.isInterleavedBufferAttribute){let ae=ie.data,E=ae.stride,A=ie.offset;if(ae.isInstancedInterleavedBuffer){for(let G=0;G<j.locationSize;G++)d(j.location+G,ae.meshPerAttribute);y.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let G=0;G<j.locationSize;G++)u(j.location+G);i.bindBuffer(i.ARRAY_BUFFER,q);for(let G=0;G<j.locationSize;G++)p(j.location+G,fe/j.locationSize,ee,J,E*ce,(A+fe/j.locationSize*G)*ce,ne)}else{if(ie.isInstancedBufferAttribute){for(let ae=0;ae<j.locationSize;ae++)d(j.location+ae,ie.meshPerAttribute);y.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let ae=0;ae<j.locationSize;ae++)u(j.location+ae);i.bindBuffer(i.ARRAY_BUFFER,q);for(let ae=0;ae<j.locationSize;ae++)p(j.location+ae,fe/j.locationSize,ee,J,fe*ce,fe/j.locationSize*ae*ce,ne)}}else if(U!==void 0){let J=U[k];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(j.location,J);break;case 3:i.vertexAttrib3fv(j.location,J);break;case 4:i.vertexAttrib4fv(j.location,J);break;default:i.vertexAttrib1fv(j.location,J)}}}}m()})(g,x,v,M),L!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(L).buffer))},reset:_,resetDefaultState:f,dispose:function(){_();for(let g in n){let x=n[g];for(let v in x){let M=x[v];for(let L in M)l(M[L].object),delete M[L];delete x[v]}delete n[g]}},releaseStatesOfGeometry:function(g){if(n[g.id]===void 0)return;let x=n[g.id];for(let v in x){let M=x[v];for(let L in M)l(M[L].object),delete M[L];delete x[v]}delete n[g.id]},releaseStatesOfProgram:function(g){for(let x in n){let v=n[x];if(v[g.id]===void 0)continue;let M=v[g.id];for(let L in M)l(M[L].object),delete M[L];delete v[g.id]}},initAttributes:h,enableAttribute:u,disableUnusedAttributes:m}}function lu(i,e,t){let n;function r(s,a,o){o!==0&&(i.drawArraysInstanced(n,s,a,o),t.update(a,n,o))}this.setMode=function(s){n=s},this.render=function(s,a){i.drawArrays(n,s,a),t.update(a,n,1)},this.renderInstances=r,this.renderMultiDraw=function(s,a,o){if(o===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,s,0,a,0,o);let l=0;for(let c=0;c<o;c++)l+=a[c];t.update(l,n,1)},this.renderMultiDrawInstances=function(s,a,o,l){if(o===0)return;let c=e.get("WEBGL_multi_draw");if(c===null)for(let h=0;h<s.length;h++)r(s[h],a[h],l[h]);else{c.multiDrawArraysInstancedWEBGL(n,s,0,a,0,l,0,o);let h=0;for(let u=0;u<o;u++)h+=a[u]*l[u];t.update(h,n,1)}}}function cu(i,e,t,n){let r;function s(d){if(d==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";d="mediump"}return d==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let a=t.precision!==void 0?t.precision:"highp",o=s(a);o!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",o,"instead."),a=o);let l=t.logarithmicDepthBuffer===!0,c=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),h=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),u=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS);return{isWebGL2:!0,getMaxAnisotropy:function(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let d=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(d.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r},getMaxPrecision:s,textureFormatReadable:function(d){return d===Zt||n.convert(d)===i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT)},textureTypeReadable:function(d){let m=d===Lr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(d!==Vn&&n.convert(d)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&d!==ln&&!m)},precision:a,logarithmicDepthBuffer:l,reverseDepthBuffer:c,maxTextures:h,maxVertexTextures:u,maxTextureSize:i.getParameter(i.MAX_TEXTURE_SIZE),maxCubemapSize:i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),maxAttributes:i.getParameter(i.MAX_VERTEX_ATTRIBS),maxVertexUniforms:i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),maxVaryings:i.getParameter(i.MAX_VARYING_VECTORS),maxFragmentUniforms:i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),vertexTextures:u>0,maxSamples:i.getParameter(i.MAX_SAMPLES)}}function hu(i){let e=this,t=null,n=0,r=!1,s=!1,a=new on,o=new Fe,l={value:null,needsUpdate:!1};function c(h,u,d,m){let p=h!==null?h.length:0,_=null;if(p!==0){if(_=l.value,m!==!0||_===null){let f=d+4*p,g=u.matrixWorldInverse;o.getNormalMatrix(g),(_===null||_.length<f)&&(_=new Float32Array(f));for(let x=0,v=d;x!==p;++x,v+=4)a.copy(h[x]).applyMatrix4(g,o),a.normal.toArray(_,v),_[v+3]=a.constant}l.value=_,l.needsUpdate=!0}return e.numPlanes=p,e.numIntersection=0,_}this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){let d=h.length!==0||u||n!==0||r;return r=u,n=h.length,d},this.beginShadows=function(){s=!0,c(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,u){t=c(h,u,0)},this.setState=function(h,u,d){let m=h.clippingPlanes,p=h.clipIntersection,_=h.clipShadows,f=i.get(h);if(!r||m===null||m.length===0||s&&!_)s?c(null):(function(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0})();else{let g=s?0:n,x=4*g,v=f.clippingState||null;l.value=v,v=c(m,u,x,d);for(let M=0;M!==x;++M)v[M]=t[M];f.clippingState=v,this.numIntersection=p?this.numPlanes:0,this.numPlanes+=g}}}function uu(i){let e=new WeakMap;function t(r,s){return s===La?r.mapping=Bi:s===Da&&(r.mapping=zi),r}function n(r){let s=r.target;s.removeEventListener("dispose",n);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(r){if(r&&r.isTexture){let s=r.mapping;if(s===La||s===Da){if(e.has(r))return t(e.get(r).texture,r.mapping);{let a=r.image;if(a&&a.height>0){let o=new fo(a.height);return o.fromEquirectangularTexture(i,r),e.set(r,o),r.addEventListener("dispose",n),t(o.texture,r.mapping)}return null}}}return r},dispose:function(){e=new WeakMap}}}var Mr=class extends ui{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=n-e,a=n+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},jl=[.125,.215,.35,.446,.526,.582],cr=20,xa=new Mr,Yl=new Ne,ya=null,Ma=0,ba=0,Sa=!1,ri=(1+Math.sqrt(5))/2,Pi=1/ri,ql=[new I(-ri,Pi,0),new I(ri,Pi,0),new I(-Pi,0,ri),new I(Pi,0,ri),new I(0,ri,-Pi),new I(0,ri,Pi),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],Xi=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){ya=this._renderer.getRenderTarget(),Ma=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel(),Sa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Jl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Kl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ya,Ma,ba),this._renderer.xr.enabled=Sa,e.scissorTest=!1,Qr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Bi||e.mapping===zi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ya=this._renderer.getRenderTarget(),Ma=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel(),Sa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Tn,minFilter:Tn,generateMipmaps:!1,type:Lr,format:Zt,colorSpace:Ki,depthBuffer:!1},r=Zl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Zl(e,t,n);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=(function(a){let o=[],l=[],c=[],h=a,u=a-4+1+jl.length;for(let d=0;d<u;d++){let m=Math.pow(2,h);l.push(m);let p=1/m;d>a-4?p=jl[d-a+4-1]:d===0&&(p=0),c.push(p);let _=1/(m-2),f=-_,g=1+_,x=[f,f,g,f,g,g,f,f,g,g,f,g],v=6,M=6,L=3,P=2,O=1,y=new Float32Array(L*M*v),b=new Float32Array(P*M*v),w=new Float32Array(O*M*v);for(let C=0;C<v;C++){let B=C%3*2/3-1,U=C>2?0:-1,k=[B,U,0,B+2/3,U,0,B+2/3,U+1,0,B,U,0,B+2/3,U+1,0,B,U+1,0];y.set(k,L*M*C),b.set(x,P*M*C);let j=[C,C,C,C,C,C];w.set(j,O*M*C)}let R=new rt;R.setAttribute("position",new vt(y,L)),R.setAttribute("uv",new vt(b,P)),R.setAttribute("faceIndex",new vt(w,O)),o.push(R),h>4&&h--}return{lodPlanes:o,sizeLods:l,sigmas:c}})(s)),this._blurMaterial=(function(a,o,l){let c=new Float32Array(cr),h=new I(0,1,0);return new Ot({name:"SphericalGaussianBlur",defines:{n:cr,CUBEUV_TEXEL_WIDTH:1/o,CUBEUV_TEXEL_HEIGHT:1/l,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:c},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:h}},vertexShader:ll(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})})(s,e,t)}return r}_compileMaterial(e){let t=new Et(this._lodPlanes[0],e);this._renderer.compile(t,xa)}_sceneToCubeUV(e,t,n,r){let s=new Nt(90,1,t,n),a=[1,-1,1,1,1,1],o=[1,1,1,-1,-1,-1],l=this._renderer,c=l.autoClear,h=l.toneMapping;l.getClearColor(Yl),l.toneMapping=0,l.autoClear=!1;let u=new hi({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),d=new Et(new Gi,u),m=!1,p=e.background;p?p.isColor&&(u.color.copy(p),e.background=null,m=!0):(u.color.copy(Yl),m=!0);for(let _=0;_<6;_++){let f=_%3;f===0?(s.up.set(0,a[_],0),s.lookAt(o[_],0,0)):f===1?(s.up.set(0,0,a[_]),s.lookAt(0,o[_],0)):(s.up.set(0,a[_],0),s.lookAt(0,0,o[_]));let g=this._cubeSize;Qr(r,f*g,_>2?g:0,g,g),l.setRenderTarget(r),m&&l.render(d,s),l.render(e,s)}d.geometry.dispose(),d.material.dispose(),l.toneMapping=h,l.autoClear=c,e.background=p}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===Bi||e.mapping===zi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Jl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Kl());let s=r?this._cubemapMaterial:this._equirectMaterial,a=new Et(this._lodPlanes[0],s);s.uniforms.envMap.value=e;let o=this._cubeSize;Qr(t,0,0,3*o,2*o),n.setRenderTarget(t),n.render(a,xa)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodPlanes.length;for(let s=1;s<r;s++){let a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=ql[(r-s-1)%ql.length];this._blur(e,s-1,s,a,o)}t.autoClear=n}_blur(e,t,n,r,s){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,"latitudinal",s),this._halfBlur(a,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=new Et(this._lodPlanes[r],c),u=c.uniforms,d=this._sizeLods[n]-1,m=isFinite(s)?Math.PI/(2*d):2*Math.PI/39,p=s/m,_=isFinite(s)?1+Math.floor(3*p):cr;_>cr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${_} samples when the maximum is set to 20`);let f=[],g=0;for(let M=0;M<cr;++M){let L=M/p,P=Math.exp(-L*L/2);f.push(P),M===0?g+=P:M<_&&(g+=2*P)}for(let M=0;M<f.length;M++)f[M]=f[M]/g;u.envMap.value=e.texture,u.samples.value=_,u.weights.value=f,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);let{_lodMax:x}=this;u.dTheta.value=m,u.mipInt.value=x-n;let v=this._sizeLods[r];Qr(t,3*v*(r>x-4?r-x+4:0),4*(this._cubeSize-v),3*v,2*v),l.setRenderTarget(t),l.render(h,xa)}};function Zl(i,e,t){let n=new Kt(i,e,t);return n.texture.mapping=Os,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Qr(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function Kl(){return new Ot({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ll(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function Jl(){return new Ot({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ll(){return`

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
	`}function du(i){let e=new WeakMap,t=null;function n(r){let s=r.target;s.removeEventListener("dispose",n);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(r){if(r&&r.isTexture){let s=r.mapping,a=s===La||s===Da,o=s===Bi||s===zi;if(a||o){let l=e.get(r),c=l!==void 0?l.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==c)return t===null&&(t=new Xi(i)),l=a?t.fromEquirectangular(r,l):t.fromCubemap(r,l),l.texture.pmremVersion=r.pmremVersion,e.set(r,l),l.texture;if(l!==void 0)return l.texture;{let h=r.image;return a&&h&&h.height>0||o&&h&&(function(u){let d=0,m=6;for(let p=0;p<m;p++)u[p]!==void 0&&d++;return d===m})(h)?(t===null&&(t=new Xi(i)),l=a?t.fromEquirectangular(r):t.fromCubemap(r),l.texture.pmremVersion=r.pmremVersion,e.set(r,l),r.addEventListener("dispose",n),l.texture):null}}}return r},dispose:function(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}}}function pu(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let r=t(n);return r===null&&ur("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function mu(i,e,t,n){let r={},s=new WeakMap;function a(l){let c=l.target;c.index!==null&&e.remove(c.index);for(let u in c.attributes)e.remove(c.attributes[u]);for(let u in c.morphAttributes){let d=c.morphAttributes[u];for(let m=0,p=d.length;m<p;m++)e.remove(d[m])}c.removeEventListener("dispose",a),delete r[c.id];let h=s.get(c);h&&(e.remove(h),s.delete(c)),n.releaseStatesOfGeometry(c),c.isInstancedBufferGeometry===!0&&delete c._maxInstanceCount,t.memory.geometries--}function o(l){let c=[],h=l.index,u=l.attributes.position,d=0;if(h!==null){let _=h.array;d=h.version;for(let f=0,g=_.length;f<g;f+=3){let x=_[f+0],v=_[f+1],M=_[f+2];c.push(x,v,v,M,M,x)}}else{if(u===void 0)return;{let _=u.array;d=u.version;for(let f=0,g=_.length/3-1;f<g;f+=3){let x=f+0,v=f+1,M=f+2;c.push(x,v,v,M,M,x)}}}let m=new(Bc(c)?ys:xs)(c,1);m.version=d;let p=s.get(l);p&&e.remove(p),s.set(l,m)}return{get:function(l,c){return r[c.id]===!0||(c.addEventListener("dispose",a),r[c.id]=!0,t.memory.geometries++),c},update:function(l){let c=l.attributes;for(let u in c)e.update(c[u],i.ARRAY_BUFFER);let h=l.morphAttributes;for(let u in h){let d=h[u];for(let m=0,p=d.length;m<p;m++)e.update(d[m],i.ARRAY_BUFFER)}},getWireframeAttribute:function(l){let c=s.get(l);if(c){let h=l.index;h!==null&&c.version<h.version&&o(l)}else o(l);return s.get(l)}}}function fu(i,e,t){let n,r,s;function a(o,l,c){c!==0&&(i.drawElementsInstanced(n,l,r,o*s,c),t.update(l,n,c))}this.setMode=function(o){n=o},this.setIndex=function(o){r=o.type,s=o.bytesPerElement},this.render=function(o,l){i.drawElements(n,l,r,o*s),t.update(l,n,1)},this.renderInstances=a,this.renderMultiDraw=function(o,l,c){if(c===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,l,0,r,o,0,c);let h=0;for(let u=0;u<c;u++)h+=l[u];t.update(h,n,1)},this.renderMultiDrawInstances=function(o,l,c,h){if(c===0)return;let u=e.get("WEBGL_multi_draw");if(u===null)for(let d=0;d<o.length;d++)a(o[d]/s,l[d],h[d]);else{u.multiDrawElementsInstancedWEBGL(n,l,0,r,o,0,h,0,c);let d=0;for(let m=0;m<c;m++)d+=l[m]*h[m];t.update(d,n,1)}}}function gu(i){let e={frame:0,calls:0,triangles:0,points:0,lines:0};return{memory:{geometries:0,textures:0},render:e,programs:null,autoReset:!0,reset:function(){e.calls=0,e.triangles=0,e.points=0,e.lines=0},update:function(t,n,r){switch(e.calls++,n){case i.TRIANGLES:e.triangles+=r*(t/3);break;case i.LINES:e.lines+=r*(t/2);break;case i.LINE_STRIP:e.lines+=r*(t-1);break;case i.LINE_LOOP:e.lines+=r*t;break;case i.POINTS:e.points+=r*t;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",n)}}}}function vu(i,e,t){let n=new WeakMap,r=new ut;return{update:function(s,a,o){let l=s.morphTargetInfluences,c=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=c!==void 0?c.length:0,u=n.get(a);if(u===void 0||u.count!==h){let y=function(){P.dispose(),n.delete(a),a.removeEventListener("dispose",y)};u!==void 0&&u.texture.dispose();let d=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,_=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],g=a.morphAttributes.color||[],x=0;d===!0&&(x=1),m===!0&&(x=2),p===!0&&(x=3);let v=a.attributes.position.count*x,M=1;v>e.maxTextureSize&&(M=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let L=new Float32Array(v*M*4*h),P=new vs(L,v,M,h);P.type=ln,P.needsUpdate=!0;let O=4*x;for(let b=0;b<h;b++){let w=_[b],R=f[b],C=g[b],B=v*M*4*b;for(let U=0;U<w.count;U++){let k=U*O;d===!0&&(r.fromBufferAttribute(w,U),L[B+k+0]=r.x,L[B+k+1]=r.y,L[B+k+2]=r.z,L[B+k+3]=0),m===!0&&(r.fromBufferAttribute(R,U),L[B+k+4]=r.x,L[B+k+5]=r.y,L[B+k+6]=r.z,L[B+k+7]=0),p===!0&&(r.fromBufferAttribute(C,U),L[B+k+8]=r.x,L[B+k+9]=r.y,L[B+k+10]=r.z,L[B+k+11]=C.itemSize===4?r.w:1)}}u={count:h,texture:P,size:new me(v,M)},n.set(a,u),a.addEventListener("dispose",y)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)o.getUniforms().setValue(i,"morphTexture",s.morphTexture,t);else{let d=0;for(let p=0;p<l.length;p++)d+=l[p];let m=a.morphTargetsRelative?1:1-d;o.getUniforms().setValue(i,"morphTargetBaseInfluence",m),o.getUniforms().setValue(i,"morphTargetInfluences",l)}o.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),o.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}}}function _u(i,e,t,n){let r=new WeakMap;function s(a){let o=a.target;o.removeEventListener("dispose",s),t.remove(o.instanceMatrix),o.instanceColor!==null&&t.remove(o.instanceColor)}return{update:function(a){let o=n.render.frame,l=a.geometry,c=e.get(a,l);if(r.get(c)!==o&&(e.update(c),r.set(c,o)),a.isInstancedMesh&&(a.hasEventListener("dispose",s)===!1&&a.addEventListener("dispose",s),r.get(a)!==o&&(t.update(a.instanceMatrix,i.ARRAY_BUFFER),a.instanceColor!==null&&t.update(a.instanceColor,i.ARRAY_BUFFER),r.set(a,o))),a.isSkinnedMesh){let h=a.skeleton;r.get(h)!==o&&(h.update(),r.set(h,o))}return c},dispose:function(){r=new WeakMap}}}var bs=class extends Xt{constructor(e,t,n,r,s,a,o,l,c,h=1026){if(h!==_r&&h!==Hi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===_r&&(n=li),n===void 0&&h===Hi&&(n=ki),super(null,r,s,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Wt,this.minFilter=l!==void 0?l:Wt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Vc=new Xt,$l=new bs(1,1),Gc=new vs,Wc=new po,Xc=new Ms,Ql=[],ec=[],tc=new Float32Array(16),nc=new Float32Array(9),ic=new Float32Array(4);function Ji(i,e,t){let n=i[0];if(n<=0||n>0)return i;let r=e*t,s=Ql[r];if(s===void 0&&(s=new Float32Array(r),Ql[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function Mt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function bt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function zs(i,e){let t=ec[e];t===void 0&&(t=new Int32Array(e),ec[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function xu(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function yu(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2fv(this.addr,e),bt(t,e)}}function Mu(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)t[0]===e.r&&t[1]===e.g&&t[2]===e.b||(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Mt(t,e))return;i.uniform3fv(this.addr,e),bt(t,e)}}function bu(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4fv(this.addr,e),bt(t,e)}}function Su(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),bt(t,e)}else{if(Mt(t,n))return;ic.set(n),i.uniformMatrix2fv(this.addr,!1,ic),bt(t,n)}}function wu(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),bt(t,e)}else{if(Mt(t,n))return;nc.set(n),i.uniformMatrix3fv(this.addr,!1,nc),bt(t,n)}}function Tu(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),bt(t,e)}else{if(Mt(t,n))return;tc.set(n),i.uniformMatrix4fv(this.addr,!1,tc),bt(t,n)}}function Eu(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Au(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2iv(this.addr,e),bt(t,e)}}function Ru(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3iv(this.addr,e),bt(t,e)}}function Cu(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4iv(this.addr,e),bt(t,e)}}function Pu(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Iu(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2uiv(this.addr,e),bt(t,e)}}function Lu(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3uiv(this.addr,e),bt(t,e)}}function Du(i,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4uiv(this.addr,e),bt(t,e)}}function Uu(i,e,t){let n=this.cache,r=t.allocateTextureUnit(),s;n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),this.type===i.SAMPLER_2D_SHADOW?($l.compareFunction=515,s=$l):s=Vc,t.setTexture2D(e||s,r)}function Nu(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||Wc,r)}function Ou(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||Xc,r)}function Fu(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||Gc,r)}function Bu(i,e){i.uniform1fv(this.addr,e)}function zu(i,e){let t=Ji(e,this.size,2);i.uniform2fv(this.addr,t)}function ku(i,e){let t=Ji(e,this.size,3);i.uniform3fv(this.addr,t)}function Hu(i,e){let t=Ji(e,this.size,4);i.uniform4fv(this.addr,t)}function Vu(i,e){let t=Ji(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Gu(i,e){let t=Ji(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Wu(i,e){let t=Ji(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Xu(i,e){i.uniform1iv(this.addr,e)}function ju(i,e){i.uniform2iv(this.addr,e)}function Yu(i,e){i.uniform3iv(this.addr,e)}function qu(i,e){i.uniform4iv(this.addr,e)}function Zu(i,e){i.uniform1uiv(this.addr,e)}function Ku(i,e){i.uniform2uiv(this.addr,e)}function Ju(i,e){i.uniform3uiv(this.addr,e)}function $u(i,e){i.uniform4uiv(this.addr,e)}function Qu(i,e,t){let n=this.cache,r=e.length,s=zs(t,r);Mt(n,s)||(i.uniform1iv(this.addr,s),bt(n,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||Vc,s[a])}function ed(i,e,t){let n=this.cache,r=e.length,s=zs(t,r);Mt(n,s)||(i.uniform1iv(this.addr,s),bt(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||Wc,s[a])}function td(i,e,t){let n=this.cache,r=e.length,s=zs(t,r);Mt(n,s)||(i.uniform1iv(this.addr,s),bt(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||Xc,s[a])}function nd(i,e,t){let n=this.cache,r=e.length,s=zs(t,r);Mt(n,s)||(i.uniform1iv(this.addr,s),bt(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||Gc,s[a])}var go=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=(function(r){switch(r){case 5126:return xu;case 35664:return yu;case 35665:return Mu;case 35666:return bu;case 35674:return Su;case 35675:return wu;case 35676:return Tu;case 5124:case 35670:return Eu;case 35667:case 35671:return Au;case 35668:case 35672:return Ru;case 35669:case 35673:return Cu;case 5125:return Pu;case 36294:return Iu;case 36295:return Lu;case 36296:return Du;case 35678:case 36198:case 36298:case 36306:case 35682:return Uu;case 35679:case 36299:case 36307:return Nu;case 35680:case 36300:case 36308:case 36293:return Ou;case 36289:case 36303:case 36311:case 36292:return Fu}})(t.type)}},vo=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=(function(r){switch(r){case 5126:return Bu;case 35664:return zu;case 35665:return ku;case 35666:return Hu;case 35674:return Vu;case 35675:return Gu;case 35676:return Wu;case 5124:case 35670:return Xu;case 35667:case 35671:return ju;case 35668:case 35672:return Yu;case 35669:case 35673:return qu;case 5125:return Zu;case 36294:return Ku;case 36295:return Ju;case 36296:return $u;case 35678:case 36198:case 36298:case 36306:case 35682:return Qu;case 35679:case 36299:case 36307:return ed;case 35680:case 36300:case 36308:case 36293:return td;case 36289:case 36303:case 36311:case 36292:return nd}})(t.type)}},_o=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let s=0,a=r.length;s!==a;++s){let o=r[s];o.setValue(e,t[o.id],n)}}},wa=/(\w+)(\])?(\[|\.)?/g;function rc(i,e){i.seq.push(e),i.map[e.id]=e}function id(i,e,t){let n=i.name,r=n.length;for(wa.lastIndex=0;;){let s=wa.exec(n),a=wa.lastIndex,o=s[1],l=s[2]==="]",c=s[3];if(l&&(o|=0),c===void 0||c==="["&&a+2===r){rc(t,c===void 0?new go(o,i,e):new vo(o,i,e));break}{let h=t.map[o];h===void 0&&(h=new _o(o),rc(t,h)),t=h}}}var Fi=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let s=e.getActiveUniform(t,r);id(s,e.getUniformLocation(t,s.name),this)}}setValue(e,t,n,r){let s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){let o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,s=e.length;r!==s;++r){let a=e[r];a.id in t&&n.push(a)}return n}};function sc(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var rd=0,ac=new Fe;function oc(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";let s=/ERROR: 0:(\d+)/.exec(r);if(s){let a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+(function(o,l){let c=o.split(`
`),h=[],u=Math.max(l-6,0),d=Math.min(l+6,c.length);for(let m=u;m<d;m++){let p=m+1;h.push(`${p===l?">":" "} ${p}: ${c[m]}`)}return h.join(`
`)})(i.getShaderSource(e),a)}return r}function sd(i,e){let t=(function(n){Je._getMatrix(ac,Je.workingColorSpace,n);let r=`mat3( ${ac.elements.map((s=>s.toFixed(4)))} )`;switch(Je.getTransfer(n)){case Fs:return[r,"LinearTransferOETF"];case nt:return[r,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[r,"LinearTransferOETF"]}})(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function ad(i,e){let t;switch(e){case 1:t="Linear";break;case 2:t="Reinhard";break;case 3:t="Cineon";break;case 4:t="ACESFilmic";break;case 6:t="AgX";break;case 7:t="Neutral";break;case 5:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var es=new I;function od(){return Je.getLuminanceCoefficients(es),["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${es.x.toFixed(4)}, ${es.y.toFixed(4)}, ${es.z.toFixed(4)} );`,"	return dot( weights, rgb );","}"].join(`
`)}function hr(i){return i!==""}function lc(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function cc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var ld=/^[ \t]*#include +<([\w\d./]+)>/gm;function xo(i){return i.replace(ld,hd)}var cd=new Map;function hd(i,e){let t=Ue[e];if(t===void 0){let n=cd.get(e);if(n===void 0)throw new Error("Can not resolve #include <"+e+">");t=Ue[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n)}return xo(t)}var ud=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function hc(i){return i.replace(ud,dd)}function dd(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function uc(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function pd(i,e,t,n){let r=i.getContext(),s=t.defines,a=t.vertexShader,o=t.fragmentShader,l=(function(R){let C="SHADOWMAP_TYPE_BASIC";return R.shadowMapType===1?C="SHADOWMAP_TYPE_PCF":R.shadowMapType===2?C="SHADOWMAP_TYPE_PCF_SOFT":R.shadowMapType===3&&(C="SHADOWMAP_TYPE_VSM"),C})(t),c=(function(R){let C="ENVMAP_TYPE_CUBE";if(R.envMap)switch(R.envMapMode){case Bi:case zi:C="ENVMAP_TYPE_CUBE";break;case Os:C="ENVMAP_TYPE_CUBE_UV"}return C})(t),h=(function(R){let C="ENVMAP_MODE_REFLECTION";return R.envMap&&R.envMapMode===zi&&(C="ENVMAP_MODE_REFRACTION"),C})(t),u=(function(R){let C="ENVMAP_BLENDING_NONE";if(R.envMap)switch(R.combine){case 0:C="ENVMAP_BLENDING_MULTIPLY";break;case 1:C="ENVMAP_BLENDING_MIX";break;case 2:C="ENVMAP_BLENDING_ADD"}return C})(t),d=(function(R){let C=R.envMapCubeUVHeight;if(C===null)return null;let B=Math.log2(C)-2,U=1/C;return{texelWidth:1/(3*Math.max(Math.pow(2,B),112)),texelHeight:U,maxMip:B}})(t),m=(function(R){return[R.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",R.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(hr).join(`
`)})(t),p=(function(R){let C=[];for(let B in R){let U=R[B];U!==!1&&C.push("#define "+B+" "+U)}return C.join(`
`)})(s),_=r.createProgram(),f,g,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(hr).join(`
`),f.length>0&&(f+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(hr).join(`
`),g.length>0&&(g+=`
`)):(f=[uc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(hr).join(`
`),g=[uc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?Ue.tonemapping_pars_fragment:"",t.toneMapping!==0?ad("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ue.colorspace_pars_fragment,sd("linearToOutputTexel",t.outputColorSpace),od(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(hr).join(`
`)),a=xo(a),a=lc(a,t),a=cc(a,t),o=xo(o),o=lc(o,t),o=cc(o,t),a=hc(a),o=hc(o),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,f=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,g=["#define varying in",t.glslVersion===wl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===wl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let v=x+f+a,M=x+g+o,L=sc(r,r.VERTEX_SHADER,v),P=sc(r,r.FRAGMENT_SHADER,M);function O(R){if(i.debug.checkShaderErrors){let C=r.getProgramInfoLog(_).trim(),B=r.getShaderInfoLog(L).trim(),U=r.getShaderInfoLog(P).trim(),k=!0,j=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(k=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,_,L,P);else{let ie=oc(r,L,"vertex"),J=oc(r,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+C+`
`+ie+`
`+J)}else C!==""?console.warn("THREE.WebGLProgram: Program Info Log:",C):B!==""&&U!==""||(j=!1);j&&(R.diagnostics={runnable:k,programLog:C,vertexShader:{log:B,prefix:f},fragmentShader:{log:U,prefix:g}})}r.deleteShader(L),r.deleteShader(P),y=new Fi(r,_),b=(function(C,B){let U={},k=C.getProgramParameter(B,C.ACTIVE_ATTRIBUTES);for(let j=0;j<k;j++){let ie=C.getActiveAttrib(B,j),J=ie.name,fe=1;ie.type===C.FLOAT_MAT2&&(fe=2),ie.type===C.FLOAT_MAT3&&(fe=3),ie.type===C.FLOAT_MAT4&&(fe=4),U[J]={type:ie.type,location:C.getAttribLocation(B,J),locationSize:fe}}return U})(r,_)}let y,b;r.attachShader(_,L),r.attachShader(_,P),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_),this.getUniforms=function(){return y===void 0&&O(this),y},this.getAttributes=function(){return b===void 0&&O(this),b};let w=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=r.getProgramParameter(_,37297)),w},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=rd++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=L,this.fragmentShader=P,this}var md=0,yo=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Mo(e),t.set(e,n)),n}},Mo=class{constructor(e){this.id=md++,this.code=e,this.usedTimes=0}};function fd(i,e,t,n,r,s,a){let o=new _s,l=new yo,c=new Set,h=[],u=r.logarithmicDepthBuffer,d=r.vertexTextures,m=r.precision,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(f){return c.add(f),f===0?"uv":`uv${f}`}return{getParameters:function(f,g,x,v,M){let L=v.fog,P=M.geometry,O=f.isMeshStandardMaterial?v.environment:null,y=(f.isMeshStandardMaterial?t:e).get(f.envMap||O),b=y&&y.mapping===Os?y.image.height:null,w=p[f.type];f.precision!==null&&(m=r.getMaxPrecision(f.precision),m!==f.precision&&console.warn("THREE.WebGLProgram.getParameters:",f.precision,"not supported, using",m,"instead."));let R=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,C=R!==void 0?R.length:0,B,U,k,j,ie=0;if(P.morphAttributes.position!==void 0&&(ie=1),P.morphAttributes.normal!==void 0&&(ie=2),P.morphAttributes.color!==void 0&&(ie=3),w){let Pn=mn[w];B=Pn.vertexShader,U=Pn.fragmentShader}else B=f.vertexShader,U=f.fragmentShader,l.update(f),k=l.getVertexShaderID(f),j=l.getFragmentShaderID(f);let J=i.getRenderTarget(),fe=i.state.buffers.depth.getReversed(),Q=M.isInstancedMesh===!0,q=M.isBatchedMesh===!0,ee=!!f.map,ce=!!f.matcap,ne=!!y,ae=!!f.aoMap,E=!!f.lightMap,A=!!f.bumpMap,G=!!f.normalMap,H=!!f.displacementMap,D=!!f.emissiveMap,z=!!f.metalnessMap,T=!!f.roughnessMap,N=f.anisotropy>0,X=f.clearcoat>0,le=f.dispersion>0,Y=f.iridescence>0,oe=f.sheen>0,re=f.transmission>0,ue=N&&!!f.anisotropyMap,Me=X&&!!f.clearcoatMap,be=X&&!!f.clearcoatNormalMap,we=X&&!!f.clearcoatRoughnessMap,De=Y&&!!f.iridescenceMap,Ve=Y&&!!f.iridescenceThicknessMap,Be=oe&&!!f.sheenColorMap,Ee=oe&&!!f.sheenRoughnessMap,Ze=!!f.specularMap,Qe=!!f.specularColorMap,at=!!f.specularIntensityMap,ye=re&&!!f.transmissionMap,We=re&&!!f.thicknessMap,$e=!!f.gradientMap,xn=!!f.alphaMap,qn=f.alphaTest>0,Ft=!!f.alphaHash,Ht=!!f.extensions,dn=0;f.toneMapped&&(J!==null&&J.isXRRenderTarget!==!0||(dn=i.toneMapping));let K={shaderID:w,shaderType:f.type,shaderName:f.name,vertexShader:B,fragmentShader:U,defines:f.defines,customVertexShaderID:k,customFragmentShaderID:j,isRawShaderMaterial:f.isRawShaderMaterial===!0,glslVersion:f.glslVersion,precision:m,batching:q,batchingColor:q&&M._colorsTexture!==null,instancing:Q,instancingColor:Q&&M.instanceColor!==null,instancingMorph:Q&&M.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:J===null?i.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Ki,alphaToCoverage:!!f.alphaToCoverage,map:ee,matcap:ce,envMap:ne,envMapMode:ne&&y.mapping,envMapCubeUVHeight:b,aoMap:ae,lightMap:E,bumpMap:A,normalMap:G,displacementMap:d&&H,emissiveMap:D,normalMapObjectSpace:G&&f.normalMapType===1,normalMapTangentSpace:G&&f.normalMapType===0,metalnessMap:z,roughnessMap:T,anisotropy:N,anisotropyMap:ue,clearcoat:X,clearcoatMap:Me,clearcoatNormalMap:be,clearcoatRoughnessMap:we,dispersion:le,iridescence:Y,iridescenceMap:De,iridescenceThicknessMap:Ve,sheen:oe,sheenColorMap:Be,sheenRoughnessMap:Ee,specularMap:Ze,specularColorMap:Qe,specularIntensityMap:at,transmission:re,transmissionMap:ye,thicknessMap:We,gradientMap:$e,opaque:f.transparent===!1&&f.blending===1&&f.alphaToCoverage===!1,alphaMap:xn,alphaTest:qn,alphaHash:Ft,combine:f.combine,mapUv:ee&&_(f.map.channel),aoMapUv:ae&&_(f.aoMap.channel),lightMapUv:E&&_(f.lightMap.channel),bumpMapUv:A&&_(f.bumpMap.channel),normalMapUv:G&&_(f.normalMap.channel),displacementMapUv:H&&_(f.displacementMap.channel),emissiveMapUv:D&&_(f.emissiveMap.channel),metalnessMapUv:z&&_(f.metalnessMap.channel),roughnessMapUv:T&&_(f.roughnessMap.channel),anisotropyMapUv:ue&&_(f.anisotropyMap.channel),clearcoatMapUv:Me&&_(f.clearcoatMap.channel),clearcoatNormalMapUv:be&&_(f.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:we&&_(f.clearcoatRoughnessMap.channel),iridescenceMapUv:De&&_(f.iridescenceMap.channel),iridescenceThicknessMapUv:Ve&&_(f.iridescenceThicknessMap.channel),sheenColorMapUv:Be&&_(f.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&_(f.sheenRoughnessMap.channel),specularMapUv:Ze&&_(f.specularMap.channel),specularColorMapUv:Qe&&_(f.specularColorMap.channel),specularIntensityMapUv:at&&_(f.specularIntensityMap.channel),transmissionMapUv:ye&&_(f.transmissionMap.channel),thicknessMapUv:We&&_(f.thicknessMap.channel),alphaMapUv:xn&&_(f.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(G||N),vertexColors:f.vertexColors,vertexAlphas:f.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:M.isPoints===!0&&!!P.attributes.uv&&(ee||xn),fog:!!L,useFog:f.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:f.flatShading===!0,sizeAttenuation:f.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:fe,skinning:M.isSkinnedMesh===!0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:C,morphTextureStride:ie,numDirLights:g.directional.length,numPointLights:g.point.length,numSpotLights:g.spot.length,numSpotLightMaps:g.spotLightMap.length,numRectAreaLights:g.rectArea.length,numHemiLights:g.hemi.length,numDirLightShadows:g.directionalShadowMap.length,numPointLightShadows:g.pointShadowMap.length,numSpotLightShadows:g.spotShadowMap.length,numSpotLightShadowsWithMaps:g.numSpotLightShadowsWithMaps,numLightProbes:g.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:f.dithering,shadowMapEnabled:i.shadowMap.enabled&&x.length>0,shadowMapType:i.shadowMap.type,toneMapping:dn,decodeVideoTexture:ee&&f.map.isVideoTexture===!0&&Je.getTransfer(f.map.colorSpace)===nt,decodeVideoTextureEmissive:D&&f.emissiveMap.isVideoTexture===!0&&Je.getTransfer(f.emissiveMap.colorSpace)===nt,premultipliedAlpha:f.premultipliedAlpha,doubleSided:f.side===2,flipSided:f.side===1,useDepthPacking:f.depthPacking>=0,depthPacking:f.depthPacking||0,index0AttributeName:f.index0AttributeName,extensionClipCullDistance:Ht&&f.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ht&&f.extensions.multiDraw===!0||q)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:f.customProgramCacheKey()};return K.vertexUv1s=c.has(1),K.vertexUv2s=c.has(2),K.vertexUv3s=c.has(3),c.clear(),K},getProgramCacheKey:function(f){let g=[];if(f.shaderID?g.push(f.shaderID):(g.push(f.customVertexShaderID),g.push(f.customFragmentShaderID)),f.defines!==void 0)for(let x in f.defines)g.push(x),g.push(f.defines[x]);return f.isRawShaderMaterial===!1&&((function(x,v){x.push(v.precision),x.push(v.outputColorSpace),x.push(v.envMapMode),x.push(v.envMapCubeUVHeight),x.push(v.mapUv),x.push(v.alphaMapUv),x.push(v.lightMapUv),x.push(v.aoMapUv),x.push(v.bumpMapUv),x.push(v.normalMapUv),x.push(v.displacementMapUv),x.push(v.emissiveMapUv),x.push(v.metalnessMapUv),x.push(v.roughnessMapUv),x.push(v.anisotropyMapUv),x.push(v.clearcoatMapUv),x.push(v.clearcoatNormalMapUv),x.push(v.clearcoatRoughnessMapUv),x.push(v.iridescenceMapUv),x.push(v.iridescenceThicknessMapUv),x.push(v.sheenColorMapUv),x.push(v.sheenRoughnessMapUv),x.push(v.specularMapUv),x.push(v.specularColorMapUv),x.push(v.specularIntensityMapUv),x.push(v.transmissionMapUv),x.push(v.thicknessMapUv),x.push(v.combine),x.push(v.fogExp2),x.push(v.sizeAttenuation),x.push(v.morphTargetsCount),x.push(v.morphAttributeCount),x.push(v.numDirLights),x.push(v.numPointLights),x.push(v.numSpotLights),x.push(v.numSpotLightMaps),x.push(v.numHemiLights),x.push(v.numRectAreaLights),x.push(v.numDirLightShadows),x.push(v.numPointLightShadows),x.push(v.numSpotLightShadows),x.push(v.numSpotLightShadowsWithMaps),x.push(v.numLightProbes),x.push(v.shadowMapType),x.push(v.toneMapping),x.push(v.numClippingPlanes),x.push(v.numClipIntersection),x.push(v.depthPacking)})(g,f),(function(x,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),x.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reverseDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),x.push(o.mask)})(g,f),g.push(i.outputColorSpace)),g.push(f.customProgramCacheKey),g.join()},getUniforms:function(f){let g=p[f.type],x;if(g){let v=mn[g];x=tu.clone(v.uniforms)}else x=f.uniforms;return x},acquireProgram:function(f,g){let x;for(let v=0,M=h.length;v<M;v++){let L=h[v];if(L.cacheKey===g){x=L,++x.usedTimes;break}}return x===void 0&&(x=new pd(i,g,f,s),h.push(x)),x},releaseProgram:function(f){if(--f.usedTimes==0){let g=h.indexOf(f);h[g]=h[h.length-1],h.pop(),f.destroy()}},releaseShaderCache:function(f){l.remove(f)},programs:h,dispose:function(){l.dispose()}}}function gd(){let i=new WeakMap;return{has:function(e){return i.has(e)},get:function(e){let t=i.get(e);return t===void 0&&(t={},i.set(e,t)),t},remove:function(e){i.delete(e)},update:function(e,t,n){i.get(e)[t]=n},dispose:function(){i=new WeakMap}}}function vd(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function dc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function pc(){let i=[],e=0,t=[],n=[],r=[];function s(a,o,l,c,h,u){let d=i[e];return d===void 0?(d={id:a.id,object:a,geometry:o,material:l,groupOrder:c,renderOrder:a.renderOrder,z:h,group:u},i[e]=d):(d.id=a.id,d.object=a,d.geometry=o,d.material=l,d.groupOrder=c,d.renderOrder=a.renderOrder,d.z=h,d.group=u),e++,d}return{opaque:t,transmissive:n,transparent:r,init:function(){e=0,t.length=0,n.length=0,r.length=0},push:function(a,o,l,c,h,u){let d=s(a,o,l,c,h,u);l.transmission>0?n.push(d):l.transparent===!0?r.push(d):t.push(d)},unshift:function(a,o,l,c,h,u){let d=s(a,o,l,c,h,u);l.transmission>0?n.unshift(d):l.transparent===!0?r.unshift(d):t.unshift(d)},finish:function(){for(let a=e,o=i.length;a<o;a++){let l=i[a];if(l.id===null)break;l.id=null,l.object=null,l.geometry=null,l.material=null,l.group=null}},sort:function(a,o){t.length>1&&t.sort(a||vd),n.length>1&&n.sort(o||dc),r.length>1&&r.sort(o||dc)}}}function _d(){let i=new WeakMap;return{get:function(e,t){let n=i.get(e),r;return n===void 0?(r=new pc,i.set(e,[r])):t>=n.length?(r=new pc,n.push(r)):r=n[t],r},dispose:function(){i=new WeakMap}}}function xd(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Ne};break;case"SpotLight":t={position:new I,direction:new I,color:new Ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Ne,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Ne,groundColor:new Ne};break;case"RectAreaLight":t={color:new Ne,position:new I,halfWidth:new I,halfHeight:new I}}return i[e.id]=t,t}}}var yd=0;function Md(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function bd(i){let e=new xd,t=(function(){let o={};return{get:function(l){if(o[l.id]!==void 0)return o[l.id];let c;switch(l.type){case"DirectionalLight":case"SpotLight":c={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new me};break;case"PointLight":c={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new me,shadowCameraNear:1,shadowCameraFar:1e3}}return o[l.id]=c,c}}})(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let o=0;o<9;o++)n.probe.push(new I);let r=new I,s=new ke,a=new ke;return{setup:function(o){let l=0,c=0,h=0;for(let O=0;O<9;O++)n.probe[O].set(0,0,0);let u=0,d=0,m=0,p=0,_=0,f=0,g=0,x=0,v=0,M=0,L=0;o.sort(Md);for(let O=0,y=o.length;O<y;O++){let b=o[O],w=b.color,R=b.intensity,C=b.distance,B=b.shadow&&b.shadow.map?b.shadow.map.texture:null;if(b.isAmbientLight)l+=w.r*R,c+=w.g*R,h+=w.b*R;else if(b.isLightProbe){for(let U=0;U<9;U++)n.probe[U].addScaledVector(b.sh.coefficients[U],R);L++}else if(b.isDirectionalLight){let U=e.get(b);if(U.color.copy(b.color).multiplyScalar(b.intensity),b.castShadow){let k=b.shadow,j=t.get(b);j.shadowIntensity=k.intensity,j.shadowBias=k.bias,j.shadowNormalBias=k.normalBias,j.shadowRadius=k.radius,j.shadowMapSize=k.mapSize,n.directionalShadow[u]=j,n.directionalShadowMap[u]=B,n.directionalShadowMatrix[u]=b.shadow.matrix,f++}n.directional[u]=U,u++}else if(b.isSpotLight){let U=e.get(b);U.position.setFromMatrixPosition(b.matrixWorld),U.color.copy(w).multiplyScalar(R),U.distance=C,U.coneCos=Math.cos(b.angle),U.penumbraCos=Math.cos(b.angle*(1-b.penumbra)),U.decay=b.decay,n.spot[m]=U;let k=b.shadow;if(b.map&&(n.spotLightMap[v]=b.map,v++,k.updateMatrices(b),b.castShadow&&M++),n.spotLightMatrix[m]=k.matrix,b.castShadow){let j=t.get(b);j.shadowIntensity=k.intensity,j.shadowBias=k.bias,j.shadowNormalBias=k.normalBias,j.shadowRadius=k.radius,j.shadowMapSize=k.mapSize,n.spotShadow[m]=j,n.spotShadowMap[m]=B,x++}m++}else if(b.isRectAreaLight){let U=e.get(b);U.color.copy(w).multiplyScalar(R),U.halfWidth.set(.5*b.width,0,0),U.halfHeight.set(0,.5*b.height,0),n.rectArea[p]=U,p++}else if(b.isPointLight){let U=e.get(b);if(U.color.copy(b.color).multiplyScalar(b.intensity),U.distance=b.distance,U.decay=b.decay,b.castShadow){let k=b.shadow,j=t.get(b);j.shadowIntensity=k.intensity,j.shadowBias=k.bias,j.shadowNormalBias=k.normalBias,j.shadowRadius=k.radius,j.shadowMapSize=k.mapSize,j.shadowCameraNear=k.camera.near,j.shadowCameraFar=k.camera.far,n.pointShadow[d]=j,n.pointShadowMap[d]=B,n.pointShadowMatrix[d]=b.shadow.matrix,g++}n.point[d]=U,d++}else if(b.isHemisphereLight){let U=e.get(b);U.skyColor.copy(b.color).multiplyScalar(R),U.groundColor.copy(b.groundColor).multiplyScalar(R),n.hemi[_]=U,_++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ve.LTC_FLOAT_1,n.rectAreaLTC2=ve.LTC_FLOAT_2):(n.rectAreaLTC1=ve.LTC_HALF_1,n.rectAreaLTC2=ve.LTC_HALF_2)),n.ambient[0]=l,n.ambient[1]=c,n.ambient[2]=h;let P=n.hash;P.directionalLength===u&&P.pointLength===d&&P.spotLength===m&&P.rectAreaLength===p&&P.hemiLength===_&&P.numDirectionalShadows===f&&P.numPointShadows===g&&P.numSpotShadows===x&&P.numSpotMaps===v&&P.numLightProbes===L||(n.directional.length=u,n.spot.length=m,n.rectArea.length=p,n.point.length=d,n.hemi.length=_,n.directionalShadow.length=f,n.directionalShadowMap.length=f,n.pointShadow.length=g,n.pointShadowMap.length=g,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=f,n.pointShadowMatrix.length=g,n.spotLightMatrix.length=x+v-M,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=M,n.numLightProbes=L,P.directionalLength=u,P.pointLength=d,P.spotLength=m,P.rectAreaLength=p,P.hemiLength=_,P.numDirectionalShadows=f,P.numPointShadows=g,P.numSpotShadows=x,P.numSpotMaps=v,P.numLightProbes=L,n.version=yd++)},setupView:function(o,l){let c=0,h=0,u=0,d=0,m=0,p=l.matrixWorldInverse;for(let _=0,f=o.length;_<f;_++){let g=o[_];if(g.isDirectionalLight){let x=n.directional[c];x.direction.setFromMatrixPosition(g.matrixWorld),r.setFromMatrixPosition(g.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(p),c++}else if(g.isSpotLight){let x=n.spot[u];x.position.setFromMatrixPosition(g.matrixWorld),x.position.applyMatrix4(p),x.direction.setFromMatrixPosition(g.matrixWorld),r.setFromMatrixPosition(g.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(p),u++}else if(g.isRectAreaLight){let x=n.rectArea[d];x.position.setFromMatrixPosition(g.matrixWorld),x.position.applyMatrix4(p),a.identity(),s.copy(g.matrixWorld),s.premultiply(p),a.extractRotation(s),x.halfWidth.set(.5*g.width,0,0),x.halfHeight.set(0,.5*g.height,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),d++}else if(g.isPointLight){let x=n.point[h];x.position.setFromMatrixPosition(g.matrixWorld),x.position.applyMatrix4(p),h++}else if(g.isHemisphereLight){let x=n.hemi[m];x.direction.setFromMatrixPosition(g.matrixWorld),x.direction.transformDirection(p),m++}}},state:n}}function mc(i){let e=new bd(i),t=[],n=[],r={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:function(s){r.camera=s,t.length=0,n.length=0},state:r,setupLights:function(){e.setup(t)},setupLightsView:function(s){e.setupView(t,s)},pushLight:function(s){t.push(s)},pushShadow:function(s){n.push(s)}}}function Sd(i){let e=new WeakMap;return{get:function(t,n=0){let r=e.get(t),s;return r===void 0?(s=new mc(i),e.set(t,[s])):n>=r.length?(s=new mc(i),r.push(s)):s=r[n],s},dispose:function(){e=new WeakMap}}}var bo=class extends ci{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},So=class extends ci{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function wd(i,e,t){let n=new yr,r=new me,s=new me,a=new ut,o=new bo({depthPacking:3201}),l=new So,c={},h=t.maxTextureSize,u={[ch]:1,[tl]:0,[hh]:2},d=new Ot({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new me},radius:{value:4}},vertexShader:`void main() {
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
}`}),m=d.clone();m.defines.HORIZONTAL_PASS=1;let p=new rt;p.setAttribute("position",new vt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Et(p,d),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let g=this.type;function x(P,O){let y=e.update(_);d.defines.VSM_SAMPLES!==P.blurSamples&&(d.defines.VSM_SAMPLES=P.blurSamples,m.defines.VSM_SAMPLES=P.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new Kt(r.x,r.y)),d.uniforms.shadow_pass.value=P.map.texture,d.uniforms.resolution.value=P.mapSize,d.uniforms.radius.value=P.radius,i.setRenderTarget(P.mapPass),i.clear(),i.renderBufferDirect(O,null,y,d,_,null),m.uniforms.shadow_pass.value=P.mapPass.texture,m.uniforms.resolution.value=P.mapSize,m.uniforms.radius.value=P.radius,i.setRenderTarget(P.map),i.clear(),i.renderBufferDirect(O,null,y,m,_,null)}function v(P,O,y,b){let w=null,R=y.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(R!==void 0)w=R;else if(w=y.isPointLight===!0?l:o,i.localClippingEnabled&&O.clipShadows===!0&&Array.isArray(O.clippingPlanes)&&O.clippingPlanes.length!==0||O.displacementMap&&O.displacementScale!==0||O.alphaMap&&O.alphaTest>0||O.map&&O.alphaTest>0){let C=w.uuid,B=O.uuid,U=c[C];U===void 0&&(U={},c[C]=U);let k=U[B];k===void 0&&(k=w.clone(),U[B]=k,O.addEventListener("dispose",L)),w=k}return w.visible=O.visible,w.wireframe=O.wireframe,w.side=b===3?O.shadowSide!==null?O.shadowSide:O.side:O.shadowSide!==null?O.shadowSide:u[O.side],w.alphaMap=O.alphaMap,w.alphaTest=O.alphaTest,w.map=O.map,w.clipShadows=O.clipShadows,w.clippingPlanes=O.clippingPlanes,w.clipIntersection=O.clipIntersection,w.displacementMap=O.displacementMap,w.displacementScale=O.displacementScale,w.displacementBias=O.displacementBias,w.wireframeLinewidth=O.wireframeLinewidth,w.linewidth=O.linewidth,y.isPointLight===!0&&w.isMeshDistanceMaterial===!0&&(i.properties.get(w).light=y),w}function M(P,O,y,b,w){if(P.visible===!1)return;if(P.layers.test(O.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&w===3)&&(!P.frustumCulled||n.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,P.matrixWorld);let C=e.update(P),B=P.material;if(Array.isArray(B)){let U=C.groups;for(let k=0,j=U.length;k<j;k++){let ie=U[k],J=B[ie.materialIndex];if(J&&J.visible){let fe=v(P,J,b,w);P.onBeforeShadow(i,P,O,y,C,fe,ie),i.renderBufferDirect(y,null,C,fe,P,ie),P.onAfterShadow(i,P,O,y,C,fe,ie)}}}else if(B.visible){let U=v(P,B,b,w);P.onBeforeShadow(i,P,O,y,C,U,null),i.renderBufferDirect(y,null,C,U,P,null),P.onAfterShadow(i,P,O,y,C,U,null)}}let R=P.children;for(let C=0,B=R.length;C<B;C++)M(R[C],O,y,b,w)}function L(P){P.target.removeEventListener("dispose",L);for(let O in c){let y=c[O],b=P.target.uuid;b in y&&(y[b].dispose(),delete y[b])}}this.render=function(P,O,y){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||P.length===0)return;let b=i.getRenderTarget(),w=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),C=i.state;C.setBlending(0),C.buffers.color.setClear(1,1,1,1),C.buffers.depth.setTest(!0),C.setScissorTest(!1);let B=g!==3&&this.type===3,U=g===3&&this.type!==3;for(let k=0,j=P.length;k<j;k++){let ie=P[k],J=ie.shadow;if(J===void 0){console.warn("THREE.WebGLShadowMap:",ie,"has no shadow.");continue}if(J.autoUpdate===!1&&J.needsUpdate===!1)continue;r.copy(J.mapSize);let fe=J.getFrameExtents();if(r.multiply(fe),s.copy(J.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/fe.x),r.x=s.x*fe.x,J.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/fe.y),r.y=s.y*fe.y,J.mapSize.y=s.y)),J.map===null||B===!0||U===!0){let q=this.type!==3?{minFilter:Wt,magFilter:Wt}:{};J.map!==null&&J.map.dispose(),J.map=new Kt(r.x,r.y,q),J.map.texture.name=ie.name+".shadowMap",J.camera.updateProjectionMatrix()}i.setRenderTarget(J.map),i.clear();let Q=J.getViewportCount();for(let q=0;q<Q;q++){let ee=J.getViewport(q);a.set(s.x*ee.x,s.y*ee.y,s.x*ee.z,s.y*ee.w),C.viewport(a),J.updateMatrices(ie,q),n=J.getFrustum(),M(O,y,J.camera,ie,this.type)}J.isPointLightShadow!==!0&&this.type===3&&x(J,y),J.needsUpdate=!1}g=this.type,f.needsUpdate=!1,i.setRenderTarget(b,w,R)}}var Td={[Th]:1,[Ah]:6,[Ch]:7,[Rh]:5,[Eh]:0,[Ih]:2,[Lh]:4,[Ph]:3};function Ed(i,e){let t=new function(){let T=!1,N=new ut,X=null,le=new ut(0,0,0,0);return{setMask:function(Y){X===Y||T||(i.colorMask(Y,Y,Y,Y),X=Y)},setLocked:function(Y){T=Y},setClear:function(Y,oe,re,ue,Me){Me===!0&&(Y*=ue,oe*=ue,re*=ue),N.set(Y,oe,re,ue),le.equals(N)===!1&&(i.clearColor(Y,oe,re,ue),le.copy(N))},reset:function(){T=!1,X=null,le.set(-1,0,0,0)}}},n=new function(){let T=!1,N=!1,X=null,le=null,Y=null;return{setReversed:function(oe){if(N!==oe){let re=e.get("EXT_clip_control");N?re.clipControlEXT(re.LOWER_LEFT_EXT,re.ZERO_TO_ONE_EXT):re.clipControlEXT(re.LOWER_LEFT_EXT,re.NEGATIVE_ONE_TO_ONE_EXT);let ue=Y;Y=null,this.setClear(ue)}N=oe},getReversed:function(){return N},setTest:function(oe){oe?ne(i.DEPTH_TEST):ae(i.DEPTH_TEST)},setMask:function(oe){X===oe||T||(i.depthMask(oe),X=oe)},setFunc:function(oe){if(N&&(oe=Td[oe]),le!==oe){switch(oe){case 0:i.depthFunc(i.NEVER);break;case 1:i.depthFunc(i.ALWAYS);break;case 2:i.depthFunc(i.LESS);break;case 3:default:i.depthFunc(i.LEQUAL);break;case 4:i.depthFunc(i.EQUAL);break;case 5:i.depthFunc(i.GEQUAL);break;case 6:i.depthFunc(i.GREATER);break;case 7:i.depthFunc(i.NOTEQUAL)}le=oe}},setLocked:function(oe){T=oe},setClear:function(oe){Y!==oe&&(N&&(oe=1-oe),i.clearDepth(oe),Y=oe)},reset:function(){T=!1,X=null,le=null,Y=null,N=!1}}},r=new function(){let T=!1,N=null,X=null,le=null,Y=null,oe=null,re=null,ue=null,Me=null;return{setTest:function(be){T||(be?ne(i.STENCIL_TEST):ae(i.STENCIL_TEST))},setMask:function(be){N===be||T||(i.stencilMask(be),N=be)},setFunc:function(be,we,De){X===be&&le===we&&Y===De||(i.stencilFunc(be,we,De),X=be,le=we,Y=De)},setOp:function(be,we,De){oe===be&&re===we&&ue===De||(i.stencilOp(be,we,De),oe=be,re=we,ue=De)},setLocked:function(be){T=be},setClear:function(be){Me!==be&&(i.clearStencil(be),Me=be)},reset:function(){T=!1,N=null,X=null,le=null,Y=null,oe=null,re=null,ue=null,Me=null}}},s=new WeakMap,a=new WeakMap,o={},l={},c=new WeakMap,h=[],u=null,d=!1,m=null,p=null,_=null,f=null,g=null,x=null,v=null,M=new Ne(0,0,0),L=0,P=!1,O=null,y=null,b=null,w=null,R=null,C=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),B=!1,U=0,k=i.getParameter(i.VERSION);k.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec(k)[1]),B=U>=1):k.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),B=U>=2);let j=null,ie={},J=i.getParameter(i.SCISSOR_BOX),fe=i.getParameter(i.VIEWPORT),Q=new ut().fromArray(J),q=new ut().fromArray(fe);function ee(T,N,X,le){let Y=new Uint8Array(4),oe=i.createTexture();i.bindTexture(T,oe),i.texParameteri(T,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(T,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let re=0;re<X;re++)T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY?i.texImage3D(N,0,i.RGBA,1,1,le,0,i.RGBA,i.UNSIGNED_BYTE,Y):i.texImage2D(N+re,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Y);return oe}let ce={};function ne(T){o[T]!==!0&&(i.enable(T),o[T]=!0)}function ae(T){o[T]!==!1&&(i.disable(T),o[T]=!1)}ce[i.TEXTURE_2D]=ee(i.TEXTURE_2D,i.TEXTURE_2D,1),ce[i.TEXTURE_CUBE_MAP]=ee(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[i.TEXTURE_2D_ARRAY]=ee(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ce[i.TEXTURE_3D]=ee(i.TEXTURE_3D,i.TEXTURE_3D,1,1),t.setClear(0,0,0,1),n.setClear(1),r.setClear(0),ne(i.DEPTH_TEST),n.setFunc(3),H(!1),D(1),ne(i.CULL_FACE),G(0);let E={[si]:i.FUNC_ADD,[uh]:i.FUNC_SUBTRACT,[dh]:i.FUNC_REVERSE_SUBTRACT};E[103]=i.MIN,E[104]=i.MAX;let A={[ph]:i.ZERO,[Ns]:i.ONE,[mh]:i.SRC_COLOR,[Pa]:i.SRC_ALPHA,[yh]:i.SRC_ALPHA_SATURATE,[_h]:i.DST_COLOR,[gh]:i.DST_ALPHA,[fh]:i.ONE_MINUS_SRC_COLOR,[Ia]:i.ONE_MINUS_SRC_ALPHA,[xh]:i.ONE_MINUS_DST_COLOR,[vh]:i.ONE_MINUS_DST_ALPHA,[Mh]:i.CONSTANT_COLOR,[bh]:i.ONE_MINUS_CONSTANT_COLOR,[Sh]:i.CONSTANT_ALPHA,[wh]:i.ONE_MINUS_CONSTANT_ALPHA};function G(T,N,X,le,Y,oe,re,ue,Me,be){if(T!==0){if(d===!1&&(ne(i.BLEND),d=!0),T===5)Y=Y||N,oe=oe||X,re=re||le,N===p&&Y===g||(i.blendEquationSeparate(E[N],E[Y]),p=N,g=Y),X===_&&le===f&&oe===x&&re===v||(i.blendFuncSeparate(A[X],A[le],A[oe],A[re]),_=X,f=le,x=oe,v=re),ue.equals(M)!==!1&&Me===L||(i.blendColor(ue.r,ue.g,ue.b,Me),M.copy(ue),L=Me),m=T,P=!1;else if(T!==m||be!==P){if(p===si&&g===si||(i.blendEquation(i.FUNC_ADD),p=si,g=si),be)switch(T){case 1:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.ONE,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",T)}else switch(T){case 1:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",T)}_=null,f=null,x=null,v=null,M.set(0,0,0),L=0,m=T,P=be}}else d===!0&&(ae(i.BLEND),d=!1)}function H(T){O!==T&&(T?i.frontFace(i.CW):i.frontFace(i.CCW),O=T)}function D(T){T!==0?(ne(i.CULL_FACE),T!==y&&(T===1?i.cullFace(i.BACK):T===2?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ae(i.CULL_FACE),y=T}function z(T,N,X){T?(ne(i.POLYGON_OFFSET_FILL),w===N&&R===X||(i.polygonOffset(N,X),w=N,R=X)):ae(i.POLYGON_OFFSET_FILL)}return{buffers:{color:t,depth:n,stencil:r},enable:ne,disable:ae,bindFramebuffer:function(T,N){return l[T]!==N&&(i.bindFramebuffer(T,N),l[T]=N,T===i.DRAW_FRAMEBUFFER&&(l[i.FRAMEBUFFER]=N),T===i.FRAMEBUFFER&&(l[i.DRAW_FRAMEBUFFER]=N),!0)},drawBuffers:function(T,N){let X=h,le=!1;if(T){X=c.get(N),X===void 0&&(X=[],c.set(N,X));let Y=T.textures;if(X.length!==Y.length||X[0]!==i.COLOR_ATTACHMENT0){for(let oe=0,re=Y.length;oe<re;oe++)X[oe]=i.COLOR_ATTACHMENT0+oe;X.length=Y.length,le=!0}}else X[0]!==i.BACK&&(X[0]=i.BACK,le=!0);le&&i.drawBuffers(X)},useProgram:function(T){return u!==T&&(i.useProgram(T),u=T,!0)},setBlending:G,setMaterial:function(T,N){T.side===2?ae(i.CULL_FACE):ne(i.CULL_FACE);let X=T.side===1;N&&(X=!X),H(X),T.blending===1&&T.transparent===!1?G(0):G(T.blending,T.blendEquation,T.blendSrc,T.blendDst,T.blendEquationAlpha,T.blendSrcAlpha,T.blendDstAlpha,T.blendColor,T.blendAlpha,T.premultipliedAlpha),n.setFunc(T.depthFunc),n.setTest(T.depthTest),n.setMask(T.depthWrite),t.setMask(T.colorWrite);let le=T.stencilWrite;r.setTest(le),le&&(r.setMask(T.stencilWriteMask),r.setFunc(T.stencilFunc,T.stencilRef,T.stencilFuncMask),r.setOp(T.stencilFail,T.stencilZFail,T.stencilZPass)),z(T.polygonOffset,T.polygonOffsetFactor,T.polygonOffsetUnits),T.alphaToCoverage===!0?ne(i.SAMPLE_ALPHA_TO_COVERAGE):ae(i.SAMPLE_ALPHA_TO_COVERAGE)},setFlipSided:H,setCullFace:D,setLineWidth:function(T){T!==b&&(B&&i.lineWidth(T),b=T)},setPolygonOffset:z,setScissorTest:function(T){T?ne(i.SCISSOR_TEST):ae(i.SCISSOR_TEST)},activeTexture:function(T){T===void 0&&(T=i.TEXTURE0+C-1),j!==T&&(i.activeTexture(T),j=T)},bindTexture:function(T,N,X){X===void 0&&(X=j===null?i.TEXTURE0+C-1:j);let le=ie[X];le===void 0&&(le={type:void 0,texture:void 0},ie[X]=le),le.type===T&&le.texture===N||(j!==X&&(i.activeTexture(X),j=X),i.bindTexture(T,N||ce[T]),le.type=T,le.texture=N)},unbindTexture:function(){let T=ie[j];T!==void 0&&T.type!==void 0&&(i.bindTexture(T.type,null),T.type=void 0,T.texture=void 0)},compressedTexImage2D:function(){try{i.compressedTexImage2D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},compressedTexImage3D:function(){try{i.compressedTexImage3D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},texImage2D:function(){try{i.texImage2D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},texImage3D:function(){try{i.texImage3D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},updateUBOMapping:function(T,N){let X=a.get(N);X===void 0&&(X=new WeakMap,a.set(N,X));let le=X.get(T);le===void 0&&(le=i.getUniformBlockIndex(N,T.name),X.set(T,le))},uniformBlockBinding:function(T,N){let X=a.get(N).get(T);s.get(N)!==X&&(i.uniformBlockBinding(N,X,T.__bindingPointIndex),s.set(N,X))},texStorage2D:function(){try{i.texStorage2D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},texStorage3D:function(){try{i.texStorage3D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},texSubImage2D:function(){try{i.texSubImage2D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},texSubImage3D:function(){try{i.texSubImage3D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},compressedTexSubImage2D:function(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},compressedTexSubImage3D:function(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(T){console.error("THREE.WebGLState:",T)}},scissor:function(T){Q.equals(T)===!1&&(i.scissor(T.x,T.y,T.z,T.w),Q.copy(T))},viewport:function(T){q.equals(T)===!1&&(i.viewport(T.x,T.y,T.z,T.w),q.copy(T))},reset:function(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),n.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),o={},j=null,ie={},l={},c=new WeakMap,h=[],u=null,d=!1,m=null,p=null,_=null,f=null,g=null,x=null,v=null,M=new Ne(0,0,0),L=0,P=!1,O=null,y=null,b=null,w=null,R=null,Q.set(0,0,i.canvas.width,i.canvas.height),q.set(0,0,i.canvas.width,i.canvas.height),t.reset(),n.reset(),r.reset()}}}function fc(i,e,t,n){let r=(function(s){switch(s){case Vn:case Rc:return{byteLength:1,components:1};case vr:case Cc:case Lr:return{byteLength:2,components:1};case il:case rl:return{byteLength:2,components:4};case li:case nl:case ln:return{byteLength:4,components:1};case Pc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)})(n);switch(t){case Ic:case Dc:return i*e;case Uc:return i*e*2;case Nc:case sl:return i*e/r.components*r.byteLength;case Oc:case al:return i*e*2/r.components*r.byteLength;case Lc:return i*e*3/r.components*r.byteLength;case Zt:case ol:return i*e*4/r.components*r.byteLength;case ls:case cs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case hs:case us:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Fa:case za:return Math.max(i,16)*Math.max(e,8)/4;case Oa:case Ba:return Math.max(i,8)*Math.max(e,8)/2;case ka:case Ha:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Va:case Ga:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Wa:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Xa:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ja:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ya:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case qa:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Za:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ka:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ja:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case $a:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Qa:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case eo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case to:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case no:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case ds:case io:case ro:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Fc:case so:return Math.ceil(i/4)*Math.ceil(e/4)*8;case ao:case oo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Ad(i,e,t,n,r,s,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator<"u"&&/OculusBrowser/g.test(navigator.userAgent),c=new me,h=new WeakMap,u,d=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(E,A){return m?new OffscreenCanvas(E,A):fs("canvas")}function _(E,A,G){let H=1,D=ae(E);if((D.width>G||D.height>G)&&(H=G/Math.max(D.width,D.height)),H<1){if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){let z=Math.floor(H*D.width),T=Math.floor(H*D.height);u===void 0&&(u=p(z,T));let N=A?p(z,T):u;return N.width=z,N.height=T,N.getContext("2d").drawImage(E,0,0,z,T),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+D.width+"x"+D.height+") to ("+z+"x"+T+")."),N}return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+D.width+"x"+D.height+")."),E}return E}function f(E){return E.generateMipmaps}function g(E){i.generateMipmap(E)}function x(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(E,A,G,H,D=!1){if(E!==null){if(i[E]!==void 0)return i[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let z=A;if(A===i.RED&&(G===i.FLOAT&&(z=i.R32F),G===i.HALF_FLOAT&&(z=i.R16F),G===i.UNSIGNED_BYTE&&(z=i.R8)),A===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(z=i.R8UI),G===i.UNSIGNED_SHORT&&(z=i.R16UI),G===i.UNSIGNED_INT&&(z=i.R32UI),G===i.BYTE&&(z=i.R8I),G===i.SHORT&&(z=i.R16I),G===i.INT&&(z=i.R32I)),A===i.RG&&(G===i.FLOAT&&(z=i.RG32F),G===i.HALF_FLOAT&&(z=i.RG16F),G===i.UNSIGNED_BYTE&&(z=i.RG8)),A===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(z=i.RG8UI),G===i.UNSIGNED_SHORT&&(z=i.RG16UI),G===i.UNSIGNED_INT&&(z=i.RG32UI),G===i.BYTE&&(z=i.RG8I),G===i.SHORT&&(z=i.RG16I),G===i.INT&&(z=i.RG32I)),A===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(z=i.RGB8UI),G===i.UNSIGNED_SHORT&&(z=i.RGB16UI),G===i.UNSIGNED_INT&&(z=i.RGB32UI),G===i.BYTE&&(z=i.RGB8I),G===i.SHORT&&(z=i.RGB16I),G===i.INT&&(z=i.RGB32I)),A===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(z=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(z=i.RGBA16UI),G===i.UNSIGNED_INT&&(z=i.RGBA32UI),G===i.BYTE&&(z=i.RGBA8I),G===i.SHORT&&(z=i.RGBA16I),G===i.INT&&(z=i.RGBA32I)),A===i.RGB&&G===i.UNSIGNED_INT_5_9_9_9_REV&&(z=i.RGB9_E5),A===i.RGBA){let T=D?Fs:Je.getTransfer(H);G===i.FLOAT&&(z=i.RGBA32F),G===i.HALF_FLOAT&&(z=i.RGBA16F),G===i.UNSIGNED_BYTE&&(z=T===nt?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(z=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(z=i.RGB5_A1)}return z!==i.R16F&&z!==i.R32F&&z!==i.RG16F&&z!==i.RG32F&&z!==i.RGBA16F&&z!==i.RGBA32F||e.get("EXT_color_buffer_float"),z}function M(E,A){let G;return E?A===null||A===li||A===ki?G=i.DEPTH24_STENCIL8:A===ln?G=i.DEPTH32F_STENCIL8:A===vr&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===li||A===ki?G=i.DEPTH_COMPONENT24:A===ln?G=i.DEPTH_COMPONENT32F:A===vr&&(G=i.DEPTH_COMPONENT16),G}function L(E,A){return f(E)===!0||E.isFramebufferTexture&&E.minFilter!==Wt&&E.minFilter!==Tn?Math.log2(Math.max(A.width,A.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?A.mipmaps.length:1}function P(E){let A=E.target;A.removeEventListener("dispose",P),(function(G){let H=n.get(G);if(H.__webglInit===void 0)return;let D=G.source,z=d.get(D);if(z){let T=z[H.__cacheKey];T.usedTimes--,T.usedTimes===0&&y(G),Object.keys(z).length===0&&d.delete(D)}n.remove(G)})(A),A.isVideoTexture&&h.delete(A)}function O(E){let A=E.target;A.removeEventListener("dispose",O),(function(G){let H=n.get(G);if(G.depthTexture&&(G.depthTexture.dispose(),n.remove(G.depthTexture)),G.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(H.__webglFramebuffer[z]))for(let T=0;T<H.__webglFramebuffer[z].length;T++)i.deleteFramebuffer(H.__webglFramebuffer[z][T]);else i.deleteFramebuffer(H.__webglFramebuffer[z]);H.__webglDepthbuffer&&i.deleteRenderbuffer(H.__webglDepthbuffer[z])}else{if(Array.isArray(H.__webglFramebuffer))for(let z=0;z<H.__webglFramebuffer.length;z++)i.deleteFramebuffer(H.__webglFramebuffer[z]);else i.deleteFramebuffer(H.__webglFramebuffer);if(H.__webglDepthbuffer&&i.deleteRenderbuffer(H.__webglDepthbuffer),H.__webglMultisampledFramebuffer&&i.deleteFramebuffer(H.__webglMultisampledFramebuffer),H.__webglColorRenderbuffer)for(let z=0;z<H.__webglColorRenderbuffer.length;z++)H.__webglColorRenderbuffer[z]&&i.deleteRenderbuffer(H.__webglColorRenderbuffer[z]);H.__webglDepthRenderbuffer&&i.deleteRenderbuffer(H.__webglDepthRenderbuffer)}let D=G.textures;for(let z=0,T=D.length;z<T;z++){let N=n.get(D[z]);N.__webglTexture&&(i.deleteTexture(N.__webglTexture),a.memory.textures--),n.remove(D[z])}n.remove(G)})(A)}function y(E){let A=n.get(E);i.deleteTexture(A.__webglTexture);let G=E.source;delete d.get(G)[A.__cacheKey],a.memory.textures--}let b=0;function w(E,A){let G=n.get(E);if(E.isVideoTexture&&(function(H){let D=a.render.frame;h.get(H)!==D&&(h.set(H,D),H.update())})(E),E.isRenderTargetTexture===!1&&E.version>0&&G.__version!==E.version){let H=E.image;if(H===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else{if(H.complete!==!1)return void j(G,E,A);console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete")}}t.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+A)}let R={[Ua]:i.REPEAT,[gr]:i.CLAMP_TO_EDGE,[Na]:i.MIRRORED_REPEAT},C={[Wt]:i.NEAREST,[Dh]:i.NEAREST_MIPMAP_NEAREST,[Ur]:i.NEAREST_MIPMAP_LINEAR,[Tn]:i.LINEAR,[Js]:i.LINEAR_MIPMAP_NEAREST,[Di]:i.LINEAR_MIPMAP_LINEAR},B={[Uh]:i.NEVER,[Hh]:i.ALWAYS,[Nh]:i.LESS,[Fh]:i.LEQUAL,[Oh]:i.EQUAL,[kh]:i.GEQUAL,[Bh]:i.GREATER,[zh]:i.NOTEQUAL};function U(E,A){if(A.type!==ln||e.has("OES_texture_float_linear")!==!1||A.magFilter!==Tn&&A.magFilter!==Js&&A.magFilter!==Ur&&A.magFilter!==Di&&A.minFilter!==Tn&&A.minFilter!==Js&&A.minFilter!==Ur&&A.minFilter!==Di||console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,R[A.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,R[A.wrapT]),E!==i.TEXTURE_3D&&E!==i.TEXTURE_2D_ARRAY||i.texParameteri(E,i.TEXTURE_WRAP_R,R[A.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,C[A.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,C[A.minFilter]),A.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,B[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Wt||A.minFilter!==Ur&&A.minFilter!==Di||A.type===ln&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){let G=e.get("EXT_texture_filter_anisotropic");i.texParameterf(E,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,r.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function k(E,A){let G=!1;E.__webglInit===void 0&&(E.__webglInit=!0,A.addEventListener("dispose",P));let H=A.source,D=d.get(H);D===void 0&&(D={},d.set(H,D));let z=(function(T){let N=[];return N.push(T.wrapS),N.push(T.wrapT),N.push(T.wrapR||0),N.push(T.magFilter),N.push(T.minFilter),N.push(T.anisotropy),N.push(T.internalFormat),N.push(T.format),N.push(T.type),N.push(T.generateMipmaps),N.push(T.premultiplyAlpha),N.push(T.flipY),N.push(T.unpackAlignment),N.push(T.colorSpace),N.join()})(A);if(z!==E.__cacheKey){D[z]===void 0&&(D[z]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,G=!0),D[z].usedTimes++;let T=D[E.__cacheKey];T!==void 0&&(D[E.__cacheKey].usedTimes--,T.usedTimes===0&&y(A)),E.__cacheKey=z,E.__webglTexture=D[z].texture}return G}function j(E,A,G){let H=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(H=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(H=i.TEXTURE_3D);let D=k(E,A),z=A.source;t.bindTexture(H,E.__webglTexture,i.TEXTURE0+G);let T=n.get(z);if(z.version!==T.__version||D===!0){t.activeTexture(i.TEXTURE0+G);let N=Je.getPrimaries(Je.workingColorSpace),X=A.colorSpace===Ii?null:Je.getPrimaries(A.colorSpace),le=A.colorSpace===Ii||N===X?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,le);let Y=_(A.image,!1,r.maxTextureSize);Y=ne(A,Y);let oe=s.convert(A.format,A.colorSpace),re=s.convert(A.type),ue,Me=v(A.internalFormat,oe,re,A.colorSpace,A.isVideoTexture);U(H,A);let be=A.mipmaps,we=A.isVideoTexture!==!0,De=T.__version===void 0||D===!0,Ve=z.dataReady,Be=L(A,Y);if(A.isDepthTexture)Me=M(A.format===Hi,A.type),De&&(we?t.texStorage2D(i.TEXTURE_2D,1,Me,Y.width,Y.height):t.texImage2D(i.TEXTURE_2D,0,Me,Y.width,Y.height,0,oe,re,null));else if(A.isDataTexture)if(be.length>0){we&&De&&t.texStorage2D(i.TEXTURE_2D,Be,Me,be[0].width,be[0].height);for(let Ee=0,Ze=be.length;Ee<Ze;Ee++)ue=be[Ee],we?Ve&&t.texSubImage2D(i.TEXTURE_2D,Ee,0,0,ue.width,ue.height,oe,re,ue.data):t.texImage2D(i.TEXTURE_2D,Ee,Me,ue.width,ue.height,0,oe,re,ue.data);A.generateMipmaps=!1}else we?(De&&t.texStorage2D(i.TEXTURE_2D,Be,Me,Y.width,Y.height),Ve&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Y.width,Y.height,oe,re,Y.data)):t.texImage2D(i.TEXTURE_2D,0,Me,Y.width,Y.height,0,oe,re,Y.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){we&&De&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Be,Me,be[0].width,be[0].height,Y.depth);for(let Ee=0,Ze=be.length;Ee<Ze;Ee++)if(ue=be[Ee],A.format!==Zt)if(oe!==null)if(we){if(Ve)if(A.layerUpdates.size>0){let Qe=fc(ue.width,ue.height,A.format,A.type);for(let at of A.layerUpdates){let ye=ue.data.subarray(at*Qe/ue.data.BYTES_PER_ELEMENT,(at+1)*Qe/ue.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Ee,0,0,at,ue.width,ue.height,1,oe,ye)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Ee,0,0,0,ue.width,ue.height,Y.depth,oe,ue.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Ee,Me,ue.width,ue.height,Y.depth,0,ue.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else we?Ve&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Ee,0,0,0,ue.width,ue.height,Y.depth,oe,re,ue.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Ee,Me,ue.width,ue.height,Y.depth,0,oe,re,ue.data)}else{we&&De&&t.texStorage2D(i.TEXTURE_2D,Be,Me,be[0].width,be[0].height);for(let Ee=0,Ze=be.length;Ee<Ze;Ee++)ue=be[Ee],A.format!==Zt?oe!==null?we?Ve&&t.compressedTexSubImage2D(i.TEXTURE_2D,Ee,0,0,ue.width,ue.height,oe,ue.data):t.compressedTexImage2D(i.TEXTURE_2D,Ee,Me,ue.width,ue.height,0,ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):we?Ve&&t.texSubImage2D(i.TEXTURE_2D,Ee,0,0,ue.width,ue.height,oe,re,ue.data):t.texImage2D(i.TEXTURE_2D,Ee,Me,ue.width,ue.height,0,oe,re,ue.data)}else if(A.isDataArrayTexture)if(we){if(De&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Be,Me,Y.width,Y.height,Y.depth),Ve)if(A.layerUpdates.size>0){let Ee=fc(Y.width,Y.height,A.format,A.type);for(let Ze of A.layerUpdates){let Qe=Y.data.subarray(Ze*Ee/Y.data.BYTES_PER_ELEMENT,(Ze+1)*Ee/Y.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Ze,Y.width,Y.height,1,oe,re,Qe)}A.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Y.width,Y.height,Y.depth,oe,re,Y.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Me,Y.width,Y.height,Y.depth,0,oe,re,Y.data);else if(A.isData3DTexture)we?(De&&t.texStorage3D(i.TEXTURE_3D,Be,Me,Y.width,Y.height,Y.depth),Ve&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Y.width,Y.height,Y.depth,oe,re,Y.data)):t.texImage3D(i.TEXTURE_3D,0,Me,Y.width,Y.height,Y.depth,0,oe,re,Y.data);else if(A.isFramebufferTexture){if(De)if(we)t.texStorage2D(i.TEXTURE_2D,Be,Me,Y.width,Y.height);else{let Ee=Y.width,Ze=Y.height;for(let Qe=0;Qe<Be;Qe++)t.texImage2D(i.TEXTURE_2D,Qe,Me,Ee,Ze,0,oe,re,null),Ee>>=1,Ze>>=1}}else if(be.length>0){if(we&&De){let Ee=ae(be[0]);t.texStorage2D(i.TEXTURE_2D,Be,Me,Ee.width,Ee.height)}for(let Ee=0,Ze=be.length;Ee<Ze;Ee++)ue=be[Ee],we?Ve&&t.texSubImage2D(i.TEXTURE_2D,Ee,0,0,oe,re,ue):t.texImage2D(i.TEXTURE_2D,Ee,Me,oe,re,ue);A.generateMipmaps=!1}else if(we){if(De){let Ee=ae(Y);t.texStorage2D(i.TEXTURE_2D,Be,Me,Ee.width,Ee.height)}Ve&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,oe,re,Y)}else t.texImage2D(i.TEXTURE_2D,0,Me,oe,re,Y);f(A)&&g(H),T.__version=z.version,A.onUpdate&&A.onUpdate(A)}E.__version=A.version}function ie(E,A,G,H,D,z){let T=s.convert(G.format,G.colorSpace),N=s.convert(G.type),X=v(G.internalFormat,T,N,G.colorSpace),le=n.get(A),Y=n.get(G);if(Y.__renderTarget=A,!le.__hasExternalTextures){let oe=Math.max(1,A.width>>z),re=Math.max(1,A.height>>z);D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?t.texImage3D(D,z,X,oe,re,A.depth,0,T,N,null):t.texImage2D(D,z,X,oe,re,0,T,N,null)}t.bindFramebuffer(i.FRAMEBUFFER,E),ce(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,H,D,Y.__webglTexture,0,ee(A)):(D===i.TEXTURE_2D||D>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&D<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,H,D,Y.__webglTexture,z),t.bindFramebuffer(i.FRAMEBUFFER,null)}function J(E,A,G){if(i.bindRenderbuffer(i.RENDERBUFFER,E),A.depthBuffer){let H=A.depthTexture,D=H&&H.isDepthTexture?H.type:null,z=M(A.stencilBuffer,D),T=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,N=ee(A);ce(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,N,z,A.width,A.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,N,z,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,z,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,T,i.RENDERBUFFER,E)}else{let H=A.textures;for(let D=0;D<H.length;D++){let z=H[D],T=s.convert(z.format,z.colorSpace),N=s.convert(z.type),X=v(z.internalFormat,T,N,z.colorSpace),le=ee(A);G&&ce(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,le,X,A.width,A.height):ce(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,le,X,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,X,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function fe(E){let A=n.get(E),G=E.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==E.depthTexture){let H=E.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),H){let D=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,H.removeEventListener("dispose",D)};H.addEventListener("dispose",D),A.__depthDisposeCallback=D}A.__boundDepthTexture=H}if(E.depthTexture&&!A.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");(function(H,D){if(D&&D.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,H),!D.depthTexture||!D.depthTexture.isDepthTexture)throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let z=n.get(D.depthTexture);z.__renderTarget=D,z.__webglTexture&&D.depthTexture.image.width===D.width&&D.depthTexture.image.height===D.height||(D.depthTexture.image.width=D.width,D.depthTexture.image.height=D.height,D.depthTexture.needsUpdate=!0),w(D.depthTexture,0);let T=z.__webglTexture,N=ee(D);if(D.depthTexture.format===_r)ce(D)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,T,0,N):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,T,0);else{if(D.depthTexture.format!==Hi)throw new Error("Unknown depthTexture format");ce(D)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,T,0,N):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,T,0)}})(A.__webglFramebuffer,E)}else if(G){A.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[H]),A.__webglDepthbuffer[H]===void 0)A.__webglDepthbuffer[H]=i.createRenderbuffer(),J(A.__webglDepthbuffer[H],E,!1);else{let D=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,z=A.__webglDepthbuffer[H];i.bindRenderbuffer(i.RENDERBUFFER,z),i.framebufferRenderbuffer(i.FRAMEBUFFER,D,i.RENDERBUFFER,z)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),J(A.__webglDepthbuffer,E,!1);else{let H=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,D=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,D),i.framebufferRenderbuffer(i.FRAMEBUFFER,H,i.RENDERBUFFER,D)}t.bindFramebuffer(i.FRAMEBUFFER,null)}let Q=[],q=[];function ee(E){return Math.min(r.maxSamples,E.samples)}function ce(E){let A=n.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function ne(E,A){let G=E.colorSpace,H=E.format,D=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||G!==Ki&&G!==Ii&&(Je.getTransfer(G)===nt?H===Zt&&D===Vn||console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),A}function ae(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=function(){let E=b;return E>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+r.maxTextures),b+=1,E},this.resetTextureUnits=function(){b=0},this.setTexture2D=w,this.setTexture2DArray=function(E,A){let G=n.get(E);E.version>0&&G.__version!==E.version?j(G,E,A):t.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+A)},this.setTexture3D=function(E,A){let G=n.get(E);E.version>0&&G.__version!==E.version?j(G,E,A):t.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+A)},this.setTextureCube=function(E,A){let G=n.get(E);E.version>0&&G.__version!==E.version?(function(H,D,z){if(D.image.length!==6)return;let T=k(H,D),N=D.source;t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+z);let X=n.get(N);if(N.version!==X.__version||T===!0){t.activeTexture(i.TEXTURE0+z);let le=Je.getPrimaries(Je.workingColorSpace),Y=D.colorSpace===Ii?null:Je.getPrimaries(D.colorSpace),oe=D.colorSpace===Ii||le===Y?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,D.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,D.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,oe);let re=D.isCompressedTexture||D.image[0].isCompressedTexture,ue=D.image[0]&&D.image[0].isDataTexture,Me=[];for(let ye=0;ye<6;ye++)Me[ye]=re||ue?ue?D.image[ye].image:D.image[ye]:_(D.image[ye],!0,r.maxCubemapSize),Me[ye]=ne(D,Me[ye]);let be=Me[0],we=s.convert(D.format,D.colorSpace),De=s.convert(D.type),Ve=v(D.internalFormat,we,De,D.colorSpace),Be=D.isVideoTexture!==!0,Ee=X.__version===void 0||T===!0,Ze=N.dataReady,Qe,at=L(D,be);if(U(i.TEXTURE_CUBE_MAP,D),re){Be&&Ee&&t.texStorage2D(i.TEXTURE_CUBE_MAP,at,Ve,be.width,be.height);for(let ye=0;ye<6;ye++){Qe=Me[ye].mipmaps;for(let We=0;We<Qe.length;We++){let $e=Qe[We];D.format!==Zt?we!==null?Be?Ze&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,We,0,0,$e.width,$e.height,we,$e.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,We,Ve,$e.width,$e.height,0,$e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Be?Ze&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,We,0,0,$e.width,$e.height,we,De,$e.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,We,Ve,$e.width,$e.height,0,we,De,$e.data)}}}else{if(Qe=D.mipmaps,Be&&Ee){Qe.length>0&&at++;let ye=ae(Me[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,at,Ve,ye.width,ye.height)}for(let ye=0;ye<6;ye++)if(ue){Be?Ze&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,Me[ye].width,Me[ye].height,we,De,Me[ye].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,Ve,Me[ye].width,Me[ye].height,0,we,De,Me[ye].data);for(let We=0;We<Qe.length;We++){let $e=Qe[We].image[ye].image;Be?Ze&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,We+1,0,0,$e.width,$e.height,we,De,$e.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,We+1,Ve,$e.width,$e.height,0,we,De,$e.data)}}else{Be?Ze&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,we,De,Me[ye]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,Ve,we,De,Me[ye]);for(let We=0;We<Qe.length;We++){let $e=Qe[We];Be?Ze&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,We+1,0,0,we,De,$e.image[ye]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ye,We+1,Ve,we,De,$e.image[ye])}}}f(D)&&g(i.TEXTURE_CUBE_MAP),X.__version=N.version,D.onUpdate&&D.onUpdate(D)}H.__version=D.version})(G,E,A):t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+A)},this.rebindTextures=function(E,A,G){let H=n.get(E);A!==void 0&&ie(H.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&fe(E)},this.setupRenderTarget=function(E){let A=E.texture,G=n.get(E),H=n.get(A);E.addEventListener("dispose",O);let D=E.textures,z=E.isWebGLCubeRenderTarget===!0,T=D.length>1;if(T||(H.__webglTexture===void 0&&(H.__webglTexture=i.createTexture()),H.__version=A.version,a.memory.textures++),z){G.__webglFramebuffer=[];for(let N=0;N<6;N++)if(A.mipmaps&&A.mipmaps.length>0){G.__webglFramebuffer[N]=[];for(let X=0;X<A.mipmaps.length;X++)G.__webglFramebuffer[N][X]=i.createFramebuffer()}else G.__webglFramebuffer[N]=i.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){G.__webglFramebuffer=[];for(let N=0;N<A.mipmaps.length;N++)G.__webglFramebuffer[N]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(T)for(let N=0,X=D.length;N<X;N++){let le=n.get(D[N]);le.__webglTexture===void 0&&(le.__webglTexture=i.createTexture(),a.memory.textures++)}if(E.samples>0&&ce(E)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let N=0;N<D.length;N++){let X=D[N];G.__webglColorRenderbuffer[N]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[N]);let le=s.convert(X.format,X.colorSpace),Y=s.convert(X.type),oe=v(X.internalFormat,le,Y,X.colorSpace,E.isXRRenderTarget===!0),re=ee(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,re,oe,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+N,i.RENDERBUFFER,G.__webglColorRenderbuffer[N])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),J(G.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(z){t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture),U(i.TEXTURE_CUBE_MAP,A);for(let N=0;N<6;N++)if(A.mipmaps&&A.mipmaps.length>0)for(let X=0;X<A.mipmaps.length;X++)ie(G.__webglFramebuffer[N][X],E,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+N,X);else ie(G.__webglFramebuffer[N],E,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+N,0);f(A)&&g(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(T){for(let N=0,X=D.length;N<X;N++){let le=D[N],Y=n.get(le);t.bindTexture(i.TEXTURE_2D,Y.__webglTexture),U(i.TEXTURE_2D,le),ie(G.__webglFramebuffer,E,le,i.COLOR_ATTACHMENT0+N,i.TEXTURE_2D,0),f(le)&&g(i.TEXTURE_2D)}t.unbindTexture()}else{let N=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(N=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(N,H.__webglTexture),U(N,A),A.mipmaps&&A.mipmaps.length>0)for(let X=0;X<A.mipmaps.length;X++)ie(G.__webglFramebuffer[X],E,A,i.COLOR_ATTACHMENT0,N,X);else ie(G.__webglFramebuffer,E,A,i.COLOR_ATTACHMENT0,N,0);f(A)&&g(N),t.unbindTexture()}E.depthBuffer&&fe(E)},this.updateRenderTargetMipmap=function(E){let A=E.textures;for(let G=0,H=A.length;G<H;G++){let D=A[G];if(f(D)){let z=x(E),T=n.get(D).__webglTexture;t.bindTexture(z,T),g(z),t.unbindTexture()}}},this.updateMultisampleRenderTarget=function(E){if(E.samples>0){if(ce(E)===!1){let A=E.textures,G=E.width,H=E.height,D=i.COLOR_BUFFER_BIT,z=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,T=n.get(E),N=A.length>1;if(N)for(let X=0;X<A.length;X++)t.bindFramebuffer(i.FRAMEBUFFER,T.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+X,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+X,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,T.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,T.__webglFramebuffer);for(let X=0;X<A.length;X++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(D|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(D|=i.STENCIL_BUFFER_BIT)),N){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,T.__webglColorRenderbuffer[X]);let le=n.get(A[X]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,le,0)}i.blitFramebuffer(0,0,G,H,0,0,G,H,D,i.NEAREST),l===!0&&(Q.length=0,q.length=0,Q.push(i.COLOR_ATTACHMENT0+X),E.depthBuffer&&E.resolveDepthBuffer===!1&&(Q.push(z),q.push(z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,q)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Q))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),N)for(let X=0;X<A.length;X++){t.bindFramebuffer(i.FRAMEBUFFER,T.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+X,i.RENDERBUFFER,T.__webglColorRenderbuffer[X]);let le=n.get(A[X]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+X,i.TEXTURE_2D,le,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,T.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){let A=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}},this.setupDepthRenderbuffer=fe,this.setupFrameBufferTexture=ie,this.useMultisampledRTT=ce}function Rd(i,e){return{convert:function(t,n=""){let r,s=Je.getTransfer(n);if(t===Vn)return i.UNSIGNED_BYTE;if(t===il)return i.UNSIGNED_SHORT_4_4_4_4;if(t===rl)return i.UNSIGNED_SHORT_5_5_5_1;if(t===Pc)return i.UNSIGNED_INT_5_9_9_9_REV;if(t===Rc)return i.BYTE;if(t===Cc)return i.SHORT;if(t===vr)return i.UNSIGNED_SHORT;if(t===nl)return i.INT;if(t===li)return i.UNSIGNED_INT;if(t===ln)return i.FLOAT;if(t===Lr)return i.HALF_FLOAT;if(t===Ic)return i.ALPHA;if(t===Lc)return i.RGB;if(t===Zt)return i.RGBA;if(t===Dc)return i.LUMINANCE;if(t===Uc)return i.LUMINANCE_ALPHA;if(t===_r)return i.DEPTH_COMPONENT;if(t===Hi)return i.DEPTH_STENCIL;if(t===Nc)return i.RED;if(t===sl)return i.RED_INTEGER;if(t===Oc)return i.RG;if(t===al)return i.RG_INTEGER;if(t===ol)return i.RGBA_INTEGER;if(t===ls||t===cs||t===hs||t===us)if(s===nt){if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r===null)return null;if(t===ls)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(t===cs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(t===hs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(t===us)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else{if(r=e.get("WEBGL_compressed_texture_s3tc"),r===null)return null;if(t===ls)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(t===cs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(t===hs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(t===us)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}if(t===Oa||t===Fa||t===Ba||t===za){if(r=e.get("WEBGL_compressed_texture_pvrtc"),r===null)return null;if(t===Oa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(t===Fa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(t===Ba)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(t===za)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}if(t===ka||t===Ha||t===Va){if(r=e.get("WEBGL_compressed_texture_etc"),r===null)return null;if(t===ka||t===Ha)return s===nt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(t===Va)return s===nt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}if(t===Ga||t===Wa||t===Xa||t===ja||t===Ya||t===qa||t===Za||t===Ka||t===Ja||t===$a||t===Qa||t===eo||t===to||t===no){if(r=e.get("WEBGL_compressed_texture_astc"),r===null)return null;if(t===Ga)return s===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(t===Wa)return s===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(t===Xa)return s===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(t===ja)return s===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(t===Ya)return s===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(t===qa)return s===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(t===Za)return s===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(t===Ka)return s===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(t===Ja)return s===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(t===$a)return s===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(t===Qa)return s===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(t===eo)return s===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(t===to)return s===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(t===no)return s===nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}if(t===ds||t===io||t===ro){if(r=e.get("EXT_texture_compression_bptc"),r===null)return null;if(t===ds)return s===nt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(t===io)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(t===ro)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}if(t===Fc||t===so||t===ao||t===oo){if(r=e.get("EXT_texture_compression_rgtc"),r===null)return null;if(t===ds)return r.COMPRESSED_RED_RGTC1_EXT;if(t===so)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(t===ao)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(t===oo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}return t===ki?i.UNSIGNED_INT_24_8:i[t]!==void 0?i[t]:null}}}var wo=class extends Nt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},En=class extends cn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Cd={type:"move"},pr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new En,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new En,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new En,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let _ of e.hand.values()){let f=t.getJointPose(_,n),g=this._getHandJoint(c,_);f!==null&&(g.matrix.fromArray(f.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=f.radius),g.visible=f!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),m=.02,p=.005;c.inputState.pinching&&d>m+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=m-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Cd)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new En;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},To=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let r=new Xt;e.properties.get(r).__webglTexture=t.texture,t.depthNear==n.depthNear&&t.depthFar==n.depthFar||(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Ot({vertexShader:`
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

}`,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Et(new Wn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Eo=class extends Rn{constructor(e,t){super();let n=this,r=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,m=null,p=null,_=new To,f=t.getContextAttributes(),g=null,x=null,v=[],M=[],L=new me,P=null,O=new Nt;O.viewport=new ut;let y=new Nt;y.viewport=new ut;let b=[O,y],w=new wo,R=null,C=null;function B(q){let ee=M.indexOf(q.inputSource);if(ee===-1)return;let ce=v[ee];ce!==void 0&&(ce.update(q.inputSource,q.frame,c||a),ce.dispatchEvent({type:q.type,data:q.inputSource}))}function U(){r.removeEventListener("select",B),r.removeEventListener("selectstart",B),r.removeEventListener("selectend",B),r.removeEventListener("squeeze",B),r.removeEventListener("squeezestart",B),r.removeEventListener("squeezeend",B),r.removeEventListener("end",U),r.removeEventListener("inputsourceschange",k);for(let q=0;q<v.length;q++){let ee=M[q];ee!==null&&(M[q]=null,v[q].disconnect(ee))}R=null,C=null,_.reset(),e.setRenderTarget(g),m=null,d=null,u=null,r=null,x=null,Q.stop(),n.isPresenting=!1,e.setPixelRatio(P),e.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}function k(q){for(let ee=0;ee<q.removed.length;ee++){let ce=q.removed[ee],ne=M.indexOf(ce);ne>=0&&(M[ne]=null,v[ne].disconnect(ce))}for(let ee=0;ee<q.added.length;ee++){let ce=q.added[ee],ne=M.indexOf(ce);if(ne===-1){for(let E=0;E<v.length;E++){if(E>=M.length){M.push(ce),ne=E;break}if(M[E]===null){M[E]=ce,ne=E;break}}if(ne===-1)break}let ae=v[ne];ae&&ae.connect(ce)}}this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let ee=v[q];return ee===void 0&&(ee=new pr,v[q]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(q){let ee=v[q];return ee===void 0&&(ee=new pr,v[q]=ee),ee.getGripSpace()},this.getHand=function(q){let ee=v[q];return ee===void 0&&(ee=new pr,v[q]=ee),ee.getHandSpace()},this.setFramebufferScaleFactor=function(q){s=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(q){if(r=q,r!==null){if(g=e.getRenderTarget(),r.addEventListener("select",B),r.addEventListener("selectstart",B),r.addEventListener("selectend",B),r.addEventListener("squeeze",B),r.addEventListener("squeezestart",B),r.addEventListener("squeezeend",B),r.addEventListener("end",U),r.addEventListener("inputsourceschange",k),f.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(L),r.renderState.layers===void 0){let ee={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,t,ee),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),x=new Kt(m.framebufferWidth,m.framebufferHeight,{format:Zt,type:Vn,colorSpace:e.outputColorSpace,stencilBuffer:f.stencil})}else{let ee=null,ce=null,ne=null;f.depth&&(ne=f.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ee=f.stencil?Hi:_r,ce=f.stencil?ki:li);let ae={colorFormat:t.RGBA8,depthFormat:ne,scaleFactor:s};u=new XRWebGLBinding(r,t),d=u.createProjectionLayer(ae),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new Kt(d.textureWidth,d.textureHeight,{format:Zt,type:Vn,depthTexture:new bs(d.textureWidth,d.textureHeight,ce,void 0,void 0,void 0,void 0,void 0,void 0,ee),stencilBuffer:f.stencil,colorSpace:e.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),Q.setContext(r),Q.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};let j=new I,ie=new I;function J(q,ee){ee===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(ee.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(r===null)return;let ee=q.near,ce=q.far;_.texture!==null&&(_.depthNear>0&&(ee=_.depthNear),_.depthFar>0&&(ce=_.depthFar)),w.near=y.near=O.near=ee,w.far=y.far=O.far=ce,R===w.near&&C===w.far||(r.updateRenderState({depthNear:w.near,depthFar:w.far}),R=w.near,C=w.far),O.layers.mask=2|q.layers.mask,y.layers.mask=4|q.layers.mask,w.layers.mask=O.layers.mask|y.layers.mask;let ne=q.parent,ae=w.cameras;J(w,ne);for(let E=0;E<ae.length;E++)J(ae[E],ne);ae.length===2?(function(E,A,G){j.setFromMatrixPosition(A.matrixWorld),ie.setFromMatrixPosition(G.matrixWorld);let H=j.distanceTo(ie),D=A.projectionMatrix.elements,z=G.projectionMatrix.elements,T=D[14]/(D[10]-1),N=D[14]/(D[10]+1),X=(D[9]+1)/D[5],le=(D[9]-1)/D[5],Y=(D[8]-1)/D[0],oe=(z[8]+1)/z[0],re=T*Y,ue=T*oe,Me=H/(-Y+oe),be=Me*-Y;if(A.matrixWorld.decompose(E.position,E.quaternion,E.scale),E.translateX(be),E.translateZ(Me),E.matrixWorld.compose(E.position,E.quaternion,E.scale),E.matrixWorldInverse.copy(E.matrixWorld).invert(),D[10]===-1)E.projectionMatrix.copy(A.projectionMatrix),E.projectionMatrixInverse.copy(A.projectionMatrixInverse);else{let we=T+Me,De=N+Me,Ve=re-be,Be=ue+(H-be),Ee=X*N/De*we,Ze=le*N/De*we;E.projectionMatrix.makePerspective(Ve,Be,Ee,Ze,we,De),E.projectionMatrixInverse.copy(E.projectionMatrix).invert()}})(w,O,y):w.projectionMatrix.copy(O.projectionMatrix),(function(E,A,G){G===null?E.matrix.copy(A.matrixWorld):(E.matrix.copy(G.matrixWorld),E.matrix.invert(),E.matrix.multiply(A.matrixWorld)),E.matrix.decompose(E.position,E.quaternion,E.scale),E.updateMatrixWorld(!0),E.projectionMatrix.copy(A.projectionMatrix),E.projectionMatrixInverse.copy(A.projectionMatrixInverse),E.isPerspectiveCamera&&(E.fov=2*xr*Math.atan(1/E.projectionMatrix.elements[5]),E.zoom=1)})(q,w,ne)},this.getCamera=function(){return w},this.getFoveation=function(){if(d!==null||m!==null)return l},this.setFoveation=function(q){l=q,d!==null&&(d.fixedFoveation=q),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=q)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(w)};let fe=null,Q=new Hc;Q.setAnimationLoop((function(q,ee){if(h=ee.getViewerPose(c||a),p=ee,h!==null){let ce=h.views;m!==null&&(e.setRenderTargetFramebuffer(x,m.framebuffer),e.setRenderTarget(x));let ne=!1;ce.length!==w.cameras.length&&(w.cameras.length=0,ne=!0);for(let E=0;E<ce.length;E++){let A=ce[E],G=null;if(m!==null)G=m.getViewport(A);else{let D=u.getViewSubImage(d,A);G=D.viewport,E===0&&(e.setRenderTargetTextures(x,D.colorTexture,d.ignoreDepthValues?void 0:D.depthStencilTexture),e.setRenderTarget(x))}let H=b[E];H===void 0&&(H=new Nt,H.layers.enable(E),H.viewport=new ut,b[E]=H),H.matrix.fromArray(A.transform.matrix),H.matrix.decompose(H.position,H.quaternion,H.scale),H.projectionMatrix.fromArray(A.projectionMatrix),H.projectionMatrixInverse.copy(H.projectionMatrix).invert(),H.viewport.set(G.x,G.y,G.width,G.height),E===0&&(w.matrix.copy(H.matrix),w.matrix.decompose(w.position,w.quaternion,w.scale)),ne===!0&&w.cameras.push(H)}let ae=r.enabledFeatures;if(ae&&ae.includes("depth-sensing")){let E=u.getDepthInformation(ce[0]);E&&E.isValid&&E.texture&&_.init(e,E,r.renderState)}}for(let ce=0;ce<v.length;ce++){let ne=M[ce],ae=v[ce];ne!==null&&ae!==void 0&&ae.update(ne,ee,c||a)}fe&&fe(q,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),p=null})),this.setAnimationLoop=function(q){fe=q},this.dispose=function(){}}},ii=new gn,Pd=new ke;function Id(i,e){function t(r,s){r.matrixAutoUpdate===!0&&r.updateMatrix(),s.value.copy(r.matrix)}function n(r,s){r.opacity.value=s.opacity,s.color&&r.diffuse.value.copy(s.color),s.emissive&&r.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity),s.map&&(r.map.value=s.map,t(s.map,r.mapTransform)),s.alphaMap&&(r.alphaMap.value=s.alphaMap,t(s.alphaMap,r.alphaMapTransform)),s.bumpMap&&(r.bumpMap.value=s.bumpMap,t(s.bumpMap,r.bumpMapTransform),r.bumpScale.value=s.bumpScale,s.side===1&&(r.bumpScale.value*=-1)),s.normalMap&&(r.normalMap.value=s.normalMap,t(s.normalMap,r.normalMapTransform),r.normalScale.value.copy(s.normalScale),s.side===1&&r.normalScale.value.negate()),s.displacementMap&&(r.displacementMap.value=s.displacementMap,t(s.displacementMap,r.displacementMapTransform),r.displacementScale.value=s.displacementScale,r.displacementBias.value=s.displacementBias),s.emissiveMap&&(r.emissiveMap.value=s.emissiveMap,t(s.emissiveMap,r.emissiveMapTransform)),s.specularMap&&(r.specularMap.value=s.specularMap,t(s.specularMap,r.specularMapTransform)),s.alphaTest>0&&(r.alphaTest.value=s.alphaTest);let a=e.get(s),o=a.envMap,l=a.envMapRotation;o&&(r.envMap.value=o,ii.copy(l),ii.x*=-1,ii.y*=-1,ii.z*=-1,o.isCubeTexture&&o.isRenderTargetTexture===!1&&(ii.y*=-1,ii.z*=-1),r.envMapRotation.value.setFromMatrix4(Pd.makeRotationFromEuler(ii)),r.flipEnvMap.value=o.isCubeTexture&&o.isRenderTargetTexture===!1?-1:1,r.reflectivity.value=s.reflectivity,r.ior.value=s.ior,r.refractionRatio.value=s.refractionRatio),s.lightMap&&(r.lightMap.value=s.lightMap,r.lightMapIntensity.value=s.lightMapIntensity,t(s.lightMap,r.lightMapTransform)),s.aoMap&&(r.aoMap.value=s.aoMap,r.aoMapIntensity.value=s.aoMapIntensity,t(s.aoMap,r.aoMapTransform))}return{refreshFogUniforms:function(r,s){s.color.getRGB(r.fogColor.value,kc(i)),s.isFog?(r.fogNear.value=s.near,r.fogFar.value=s.far):s.isFogExp2&&(r.fogDensity.value=s.density)},refreshMaterialUniforms:function(r,s,a,o,l){s.isMeshBasicMaterial||s.isMeshLambertMaterial?n(r,s):s.isMeshToonMaterial?(n(r,s),(function(c,h){h.gradientMap&&(c.gradientMap.value=h.gradientMap)})(r,s)):s.isMeshPhongMaterial?(n(r,s),(function(c,h){c.specular.value.copy(h.specular),c.shininess.value=Math.max(h.shininess,1e-4)})(r,s)):s.isMeshStandardMaterial?(n(r,s),(function(c,h){c.metalness.value=h.metalness,h.metalnessMap&&(c.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,c.metalnessMapTransform)),c.roughness.value=h.roughness,h.roughnessMap&&(c.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,c.roughnessMapTransform)),h.envMap&&(c.envMapIntensity.value=h.envMapIntensity)})(r,s),s.isMeshPhysicalMaterial&&(function(c,h,u){c.ior.value=h.ior,h.sheen>0&&(c.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),c.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(c.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,c.sheenColorMapTransform)),h.sheenRoughnessMap&&(c.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,c.sheenRoughnessMapTransform))),h.clearcoat>0&&(c.clearcoat.value=h.clearcoat,c.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(c.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,c.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(c.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,c.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(c.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,c.clearcoatNormalMapTransform),c.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===1&&c.clearcoatNormalScale.value.negate())),h.dispersion>0&&(c.dispersion.value=h.dispersion),h.iridescence>0&&(c.iridescence.value=h.iridescence,c.iridescenceIOR.value=h.iridescenceIOR,c.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],c.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(c.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,c.iridescenceMapTransform)),h.iridescenceThicknessMap&&(c.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,c.iridescenceThicknessMapTransform))),h.transmission>0&&(c.transmission.value=h.transmission,c.transmissionSamplerMap.value=u.texture,c.transmissionSamplerSize.value.set(u.width,u.height),h.transmissionMap&&(c.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,c.transmissionMapTransform)),c.thickness.value=h.thickness,h.thicknessMap&&(c.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,c.thicknessMapTransform)),c.attenuationDistance.value=h.attenuationDistance,c.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(c.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(c.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,c.anisotropyMapTransform))),c.specularIntensity.value=h.specularIntensity,c.specularColor.value.copy(h.specularColor),h.specularColorMap&&(c.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,c.specularColorMapTransform)),h.specularIntensityMap&&(c.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,c.specularIntensityMapTransform))})(r,s,l)):s.isMeshMatcapMaterial?(n(r,s),(function(c,h){h.matcap&&(c.matcap.value=h.matcap)})(r,s)):s.isMeshDepthMaterial?n(r,s):s.isMeshDistanceMaterial?(n(r,s),(function(c,h){let u=e.get(h).light;c.referencePosition.value.setFromMatrixPosition(u.matrixWorld),c.nearDistance.value=u.shadow.camera.near,c.farDistance.value=u.shadow.camera.far})(r,s)):s.isMeshNormalMaterial?n(r,s):s.isLineBasicMaterial?((function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform))})(r,s),s.isLineDashedMaterial&&(function(c,h){c.dashSize.value=h.dashSize,c.totalSize.value=h.dashSize+h.gapSize,c.scale.value=h.scale})(r,s)):s.isPointsMaterial?(function(c,h,u,d){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.size.value=h.size*u,c.scale.value=.5*d,h.map&&(c.map.value=h.map,t(h.map,c.uvTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)})(r,s,a,o):s.isSpriteMaterial?(function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.rotation.value=h.rotation,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)})(r,s):s.isShadowMaterial?(r.color.value.copy(s.color),r.opacity.value=s.opacity):s.isShaderMaterial&&(s.uniformsNeedUpdate=!1)}}}function Ld(i,e,t,n){let r={},s={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(u,d,m,p){let _=u.value,f=d+"_"+m;if(p[f]===void 0)return p[f]=typeof _=="number"||typeof _=="boolean"?_:_.clone(),!0;{let g=p[f];if(typeof _=="number"||typeof _=="boolean"){if(g!==_)return p[f]=_,!0}else if(g.equals(_)===!1)return g.copy(_),!0}return!1}function c(u){let d={boundary:0,storage:0};return typeof u=="number"||typeof u=="boolean"?(d.boundary=4,d.storage=4):u.isVector2?(d.boundary=8,d.storage=8):u.isVector3||u.isColor?(d.boundary=16,d.storage=12):u.isVector4?(d.boundary=16,d.storage=16):u.isMatrix3?(d.boundary=48,d.storage=48):u.isMatrix4?(d.boundary=64,d.storage=64):u.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",u),d}function h(u){let d=u.target;d.removeEventListener("dispose",h);let m=a.indexOf(d.__bindingPointIndex);a.splice(m,1),i.deleteBuffer(r[d.id]),delete r[d.id],delete s[d.id]}return{bind:function(u,d){let m=d.program;n.uniformBlockBinding(u,m)},update:function(u,d){let m=r[u.id];m===void 0&&((function(f){let g=f.uniforms,x=0,v=16;for(let L=0,P=g.length;L<P;L++){let O=Array.isArray(g[L])?g[L]:[g[L]];for(let y=0,b=O.length;y<b;y++){let w=O[y],R=Array.isArray(w.value)?w.value:[w.value];for(let C=0,B=R.length;C<B;C++){let U=c(R[C]),k=x%v,j=k%U.boundary,ie=k+j;x+=j,ie!==0&&v-ie<U.storage&&(x+=v-ie),w.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),w.__offset=x,x+=U.storage}}}let M=x%v;M>0&&(x+=v-M),f.__size=x,f.__cache={}})(u),m=(function(f){let g=(function(){for(let L=0;L<o;L++)if(a.indexOf(L)===-1)return a.push(L),L;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0})();f.__bindingPointIndex=g;let x=i.createBuffer(),v=f.__size,M=f.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,v,M),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,g,x),x})(u),r[u.id]=m,u.addEventListener("dispose",h));let p=d.program;n.updateUBOMapping(u,p);let _=e.render.frame;s[u.id]!==_&&((function(f){let g=r[f.id],x=f.uniforms,v=f.__cache;i.bindBuffer(i.UNIFORM_BUFFER,g);for(let M=0,L=x.length;M<L;M++){let P=Array.isArray(x[M])?x[M]:[x[M]];for(let O=0,y=P.length;O<y;O++){let b=P[O];if(l(b,M,O,v)===!0){let w=b.__offset,R=Array.isArray(b.value)?b.value:[b.value],C=0;for(let B=0;B<R.length;B++){let U=R[B],k=c(U);typeof U=="number"||typeof U=="boolean"?(b.__data[0]=U,i.bufferSubData(i.UNIFORM_BUFFER,w+C,b.__data)):U.isMatrix3?(b.__data[0]=U.elements[0],b.__data[1]=U.elements[1],b.__data[2]=U.elements[2],b.__data[3]=0,b.__data[4]=U.elements[3],b.__data[5]=U.elements[4],b.__data[6]=U.elements[5],b.__data[7]=0,b.__data[8]=U.elements[6],b.__data[9]=U.elements[7],b.__data[10]=U.elements[8],b.__data[11]=0):(U.toArray(b.__data,C),C+=k.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,w,b.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)})(u),s[u.id]=_)},dispose:function(){for(let u in r)i.deleteBuffer(r[u]);a=[],r={},s={}}}}var Ss=class{constructor(e={}){let{canvas:t=Vh(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=e,m;if(this.isWebGLRenderer=!0,n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;let p=new Uint32Array(4),_=new Int32Array(4),f=null,g=null,x=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Bt,this.toneMapping=0,this.toneMappingExposure=1;let M=this,L=!1,P=0,O=0,y=null,b=-1,w=null,R=new ut,C=new ut,B=null,U=new Ne(0),k=0,j=t.width,ie=t.height,J=1,fe=null,Q=null,q=new ut(0,0,j,ie),ee=new ut(0,0,j,ie),ce=!1,ne=new yr,ae=!1,E=!1,A=new ke,G=new ke,H=new I,D=new ut,z={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},T=!1;function N(){return y===null?J:1}let X,le,Y,oe,re,ue,Me,be,we,De,Ve,Be,Ee,Ze,Qe,at,ye,We,$e,xn,qn,Ft,Ht,dn,K=n;function Pn(S,W){return t.getContext(S,W)}try{let S={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r170"),t.addEventListener("webglcontextlost",tr,!1),t.addEventListener("webglcontextrestored",nr,!1),t.addEventListener("webglcontextcreationerror",gi,!1),K===null){let W="webgl2";if(K=Pn(W,S),K===null)throw Pn(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}function er(){X=new pu(K),X.init(),Ft=new Rd(K,X),le=new cu(K,X,e,Ft),Y=new Ed(K,X),le.reverseDepthBuffer&&d&&Y.buffers.depth.setReversed(!0),oe=new gu(K),re=new gd,ue=new Ad(K,X,Y,re,le,Ft,oe),Me=new uu(M),be=new du(M),we=new ru(K),Ht=new ou(K,we),De=new mu(K,we,oe,Ht),Ve=new _u(K,De,we,oe),$e=new vu(K,le,ue),at=new hu(re),Be=new fd(M,Me,be,X,le,Ht,at),Ee=new Id(M,re),Ze=new _d,Qe=new Sd(X),We=new au(M,Me,be,Y,Ve,m,l),ye=new wd(M,Ve,le),dn=new Ld(K,oe,le,Y),xn=new lu(K,X,oe),qn=new fu(K,X,oe),oe.programs=Be.programs,M.capabilities=le,M.extensions=X,M.properties=re,M.renderLists=Ze,M.shadowMap=ye,M.state=Y,M.info=oe}er();let ft=new Eo(M,K);function tr(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function nr(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;let S=oe.autoReset,W=ye.enabled,$=ye.autoUpdate,te=ye.needsUpdate,V=ye.type;er(),oe.autoReset=S,ye.enabled=W,ye.autoUpdate=$,ye.needsUpdate=te,ye.type=V}function gi(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Zn(S){let W=S.target;W.removeEventListener("dispose",Zn),(function($){(function(te){let V=re.get(te).programs;V!==void 0&&(V.forEach((function(he){Be.releaseProgram(he)})),te.isShaderMaterial&&Be.releaseShaderCache(te))})($),re.remove($)})(W)}function In(S,W,$){S.transparent===!0&&S.side===2&&S.forceSinglePass===!1?(S.side=1,S.needsUpdate=!0,ot(S,W,$),S.side=0,S.needsUpdate=!0,ot(S,W,$),S.side=2):ot(S,W,$)}this.xr=ft,this.getContext=function(){return K},this.getContextAttributes=function(){return K.getContextAttributes()},this.forceContextLoss=function(){let S=X.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=X.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(S){S!==void 0&&(J=S,this.setSize(j,ie,!1))},this.getSize=function(S){return S.set(j,ie)},this.setSize=function(S,W,$=!0){ft.isPresenting?console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting."):(j=S,ie=W,t.width=Math.floor(S*J),t.height=Math.floor(W*J),$===!0&&(t.style.width=S+"px",t.style.height=W+"px"),this.setViewport(0,0,S,W))},this.getDrawingBufferSize=function(S){return S.set(j*J,ie*J).floor()},this.setDrawingBufferSize=function(S,W,$){j=S,ie=W,J=$,t.width=Math.floor(S*$),t.height=Math.floor(W*$),this.setViewport(0,0,S,W)},this.getCurrentViewport=function(S){return S.copy(R)},this.getViewport=function(S){return S.copy(q)},this.setViewport=function(S,W,$,te){S.isVector4?q.set(S.x,S.y,S.z,S.w):q.set(S,W,$,te),Y.viewport(R.copy(q).multiplyScalar(J).round())},this.getScissor=function(S){return S.copy(ee)},this.setScissor=function(S,W,$,te){S.isVector4?ee.set(S.x,S.y,S.z,S.w):ee.set(S,W,$,te),Y.scissor(C.copy(ee).multiplyScalar(J).round())},this.getScissorTest=function(){return ce},this.setScissorTest=function(S){Y.setScissorTest(ce=S)},this.setOpaqueSort=function(S){fe=S},this.setTransparentSort=function(S){Q=S},this.getClearColor=function(S){return S.copy(We.getClearColor())},this.setClearColor=function(){We.setClearColor.apply(We,arguments)},this.getClearAlpha=function(){return We.getClearAlpha()},this.setClearAlpha=function(){We.setClearAlpha.apply(We,arguments)},this.clear=function(S=!0,W=!0,$=!0){let te=0;if(S){let V=!1;if(y!==null){let he=y.texture.format;V=he===ol||he===al||he===sl}if(V){let he=y.texture.type,xe=he===Vn||he===li||he===vr||he===ki||he===il||he===rl,Se=We.getClearColor(),Ae=We.getClearAlpha(),Ie=Se.r,He=Se.g,Le=Se.b;xe?(p[0]=Ie,p[1]=He,p[2]=Le,p[3]=Ae,K.clearBufferuiv(K.COLOR,0,p)):(_[0]=Ie,_[1]=He,_[2]=Le,_[3]=Ae,K.clearBufferiv(K.COLOR,0,_))}else te|=K.COLOR_BUFFER_BIT}W&&(te|=K.DEPTH_BUFFER_BIT),$&&(te|=K.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),K.clear(te)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",tr,!1),t.removeEventListener("webglcontextrestored",nr,!1),t.removeEventListener("webglcontextcreationerror",gi,!1),Ze.dispose(),Qe.dispose(),re.dispose(),Me.dispose(),be.dispose(),Ve.dispose(),Ht.dispose(),dn.dispose(),Be.dispose(),ft.dispose(),ft.removeEventListener("sessionstart",ge),ft.removeEventListener("sessionend",_e),se.stop()},this.renderBufferDirect=function(S,W,$,te,V,he){W===null&&(W=z);let xe=V.isMesh&&V.matrixWorld.determinant()<0,Se=(function(Ye,Lt,Rt,Ge,Oe){Lt.isScene!==!0&&(Lt=z),ue.resetTextureUnits();let en=Lt.fog,Ws=Ge.isMeshStandardMaterial?Lt.environment:null,ir=y===null?M.outputColorSpace:y.isXRRenderTarget===!0?y.texture.colorSpace:Ki,vi=(Ge.isMeshStandardMaterial?be:Me).get(Ge.envMap||Ws),Xs=Ge.vertexColors===!0&&!!Rt.attributes.color&&Rt.attributes.color.itemSize===4,js=!!Rt.attributes.tangent&&(!!Ge.normalMap||Ge.anisotropy>0),Ys=!!Rt.morphAttributes.position,Ln=!!Rt.morphAttributes.normal,eh=!!Rt.morphAttributes.color,gl=0;Ge.toneMapped&&(y!==null&&y.isXRRenderTarget!==!0||(gl=M.toneMapping));let vl=Rt.morphAttributes.position||Rt.morphAttributes.normal||Rt.morphAttributes.color,th=vl!==void 0?vl.length:0,je=re.get(Ge),nh=g.state.lights;if(ae===!0&&(E===!0||Ye!==w)){let Yt=Ye===w&&Ge.id===b;at.setState(Ge,Ye,Yt)}let tn=!1;Ge.version===je.__version?je.needsLights&&je.lightsStateVersion!==nh.state.version||je.outputColorSpace!==ir||Oe.isBatchedMesh&&je.batching===!1?tn=!0:Oe.isBatchedMesh||je.batching!==!0?Oe.isBatchedMesh&&je.batchingColor===!0&&Oe.colorTexture===null||Oe.isBatchedMesh&&je.batchingColor===!1&&Oe.colorTexture!==null||Oe.isInstancedMesh&&je.instancing===!1?tn=!0:Oe.isInstancedMesh||je.instancing!==!0?Oe.isSkinnedMesh&&je.skinning===!1?tn=!0:Oe.isSkinnedMesh||je.skinning!==!0?Oe.isInstancedMesh&&je.instancingColor===!0&&Oe.instanceColor===null||Oe.isInstancedMesh&&je.instancingColor===!1&&Oe.instanceColor!==null||Oe.isInstancedMesh&&je.instancingMorph===!0&&Oe.morphTexture===null||Oe.isInstancedMesh&&je.instancingMorph===!1&&Oe.morphTexture!==null||je.envMap!==vi||Ge.fog===!0&&je.fog!==en?tn=!0:je.numClippingPlanes===void 0||je.numClippingPlanes===at.numPlanes&&je.numIntersection===at.numIntersection?(je.vertexAlphas!==Xs||je.vertexTangents!==js||je.morphTargets!==Ys||je.morphNormals!==Ln||je.morphColors!==eh||je.toneMapping!==gl||je.morphTargetsCount!==th)&&(tn=!0):tn=!0:tn=!0:tn=!0:tn=!0:(tn=!0,je.__version=Ge.version);let Kn=je.currentProgram;tn===!0&&(Kn=ot(Ge,Lt,Oe));let _l=!1,rr=!1,qs=!1,gt=Kn.getUniforms(),Dn=je.uniforms;if(Y.useProgram(Kn.program)&&(_l=!0,rr=!0,qs=!0),Ge.id!==b&&(b=Ge.id,rr=!0),_l||w!==Ye){Y.buffers.depth.getReversed()?(A.copy(Ye.projectionMatrix),(function(Jn){let ct=Jn.elements;ct[2]=.5*ct[2]+.5*ct[3],ct[6]=.5*ct[6]+.5*ct[7],ct[10]=.5*ct[10]+.5*ct[11],ct[14]=.5*ct[14]+.5*ct[15]})(A),(function(Jn){let ct=Jn.elements;ct[11]===-1?(ct[10]=-ct[10]-1,ct[14]=-ct[14]):(ct[10]=-ct[10],ct[14]=1-ct[14])})(A),gt.setValue(K,"projectionMatrix",A)):gt.setValue(K,"projectionMatrix",Ye.projectionMatrix),gt.setValue(K,"viewMatrix",Ye.matrixWorldInverse);let Yt=gt.map.cameraPosition;Yt!==void 0&&Yt.setValue(K,H.setFromMatrixPosition(Ye.matrixWorld)),le.logarithmicDepthBuffer&&gt.setValue(K,"logDepthBufFC",2/(Math.log(Ye.far+1)/Math.LN2)),(Ge.isMeshPhongMaterial||Ge.isMeshToonMaterial||Ge.isMeshLambertMaterial||Ge.isMeshBasicMaterial||Ge.isMeshStandardMaterial||Ge.isShaderMaterial)&&gt.setValue(K,"isOrthographic",Ye.isOrthographicCamera===!0),w!==Ye&&(w=Ye,rr=!0,qs=!0)}if(Oe.isSkinnedMesh){gt.setOptional(K,Oe,"bindMatrix"),gt.setOptional(K,Oe,"bindMatrixInverse");let Yt=Oe.skeleton;Yt&&(Yt.boneTexture===null&&Yt.computeBoneTexture(),gt.setValue(K,"boneTexture",Yt.boneTexture,ue))}Oe.isBatchedMesh&&(gt.setOptional(K,Oe,"batchingTexture"),gt.setValue(K,"batchingTexture",Oe._matricesTexture,ue),gt.setOptional(K,Oe,"batchingIdTexture"),gt.setValue(K,"batchingIdTexture",Oe._indirectTexture,ue),gt.setOptional(K,Oe,"batchingColorTexture"),Oe._colorsTexture!==null&&gt.setValue(K,"batchingColorTexture",Oe._colorsTexture,ue));let Zs=Rt.morphAttributes;Zs.position===void 0&&Zs.normal===void 0&&Zs.color===void 0||$e.update(Oe,Rt,Kn),(rr||je.receiveShadow!==Oe.receiveShadow)&&(je.receiveShadow=Oe.receiveShadow,gt.setValue(K,"receiveShadow",Oe.receiveShadow)),Ge.isMeshGouraudMaterial&&Ge.envMap!==null&&(Dn.envMap.value=vi,Dn.flipEnvMap.value=vi.isCubeTexture&&vi.isRenderTargetTexture===!1?-1:1),Ge.isMeshStandardMaterial&&Ge.envMap===null&&Lt.environment!==null&&(Dn.envMapIntensity.value=Lt.environmentIntensity),rr&&(gt.setValue(K,"toneMappingExposure",M.toneMappingExposure),je.needsLights&&(nn=qs,(pn=Dn).ambientLightColor.needsUpdate=nn,pn.lightProbe.needsUpdate=nn,pn.directionalLights.needsUpdate=nn,pn.directionalLightShadows.needsUpdate=nn,pn.pointLights.needsUpdate=nn,pn.pointLightShadows.needsUpdate=nn,pn.spotLights.needsUpdate=nn,pn.spotLightShadows.needsUpdate=nn,pn.rectAreaLights.needsUpdate=nn,pn.hemisphereLights.needsUpdate=nn),en&&Ge.fog===!0&&Ee.refreshFogUniforms(Dn,en),Ee.refreshMaterialUniforms(Dn,Ge,J,ie,g.state.transmissionRenderTarget[Ye.id]),Fi.upload(K,et(je),Dn,ue));var pn,nn;if(Ge.isShaderMaterial&&Ge.uniformsNeedUpdate===!0&&(Fi.upload(K,et(je),Dn,ue),Ge.uniformsNeedUpdate=!1),Ge.isSpriteMaterial&&gt.setValue(K,"center",Oe.center),gt.setValue(K,"modelViewMatrix",Oe.modelViewMatrix),gt.setValue(K,"normalMatrix",Oe.normalMatrix),gt.setValue(K,"modelMatrix",Oe.matrixWorld),Ge.isShaderMaterial||Ge.isRawShaderMaterial){let Yt=Ge.uniformsGroups;for(let Jn=0,ct=Yt.length;Jn<ct;Jn++){let xl=Yt[Jn];dn.update(xl,Kn),dn.bind(xl,Kn)}}return Kn})(S,W,$,te,V);Y.setMaterial(te,xe);let Ae=$.index,Ie=1;if(te.wireframe===!0){if(Ae=De.getWireframeAttribute($),Ae===void 0)return;Ie=2}let He=$.drawRange,Le=$.attributes.position,Xe=He.start*Ie,mt=(He.start+He.count)*Ie;he!==null&&(Xe=Math.max(Xe,he.start*Ie),mt=Math.min(mt,(he.start+he.count)*Ie)),Ae!==null?(Xe=Math.max(Xe,0),mt=Math.min(mt,Ae.count)):Le!=null&&(Xe=Math.max(Xe,0),mt=Math.min(mt,Le.count));let st=mt-Xe;if(st<0||st===1/0)return;let yt;Ht.setup(V,te,Se,$,Ae);let lt=xn;if(Ae!==null&&(yt=we.get(Ae),lt=qn,lt.setIndex(yt)),V.isMesh)te.wireframe===!0?(Y.setLineWidth(te.wireframeLinewidth*N()),lt.setMode(K.LINES)):lt.setMode(K.TRIANGLES);else if(V.isLine){let Ye=te.linewidth;Ye===void 0&&(Ye=1),Y.setLineWidth(Ye*N()),V.isLineSegments?lt.setMode(K.LINES):V.isLineLoop?lt.setMode(K.LINE_LOOP):lt.setMode(K.LINE_STRIP)}else V.isPoints?lt.setMode(K.POINTS):V.isSprite&&lt.setMode(K.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)lt.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(X.get("WEBGL_multi_draw"))lt.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{let Ye=V._multiDrawStarts,Lt=V._multiDrawCounts,Rt=V._multiDrawCount,Ge=Ae?we.get(Ae).bytesPerElement:1,Oe=re.get(te).currentProgram.getUniforms();for(let en=0;en<Rt;en++)Oe.setValue(K,"_gl_DrawID",en),lt.render(Ye[en]/Ge,Lt[en])}else if(V.isInstancedMesh)lt.renderInstances(Xe,st,V.count);else if($.isInstancedBufferGeometry){let Ye=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Lt=Math.min($.instanceCount,Ye);lt.renderInstances(Xe,st,Lt)}else lt.render(Xe,st)},this.compile=function(S,W,$=null){$===null&&($=S),g=Qe.get($),g.init(W),v.push(g),$.traverseVisible((function(V){V.isLight&&V.layers.test(W.layers)&&(g.pushLight(V),V.castShadow&&g.pushShadow(V))})),S!==$&&S.traverseVisible((function(V){V.isLight&&V.layers.test(W.layers)&&(g.pushLight(V),V.castShadow&&g.pushShadow(V))})),g.setupLights();let te=new Set;return S.traverse((function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;let he=V.material;if(he)if(Array.isArray(he))for(let xe=0;xe<he.length;xe++){let Se=he[xe];In(Se,$,V),te.add(Se)}else In(he,$,V),te.add(he)})),v.pop(),g=null,te},this.compileAsync=function(S,W,$=null){let te=this.compile(S,W,$);return new Promise((V=>{function he(){te.forEach((function(xe){re.get(xe).currentProgram.isReady()&&te.delete(xe)})),te.size!==0?setTimeout(he,10):V(S)}X.get("KHR_parallel_shader_compile")!==null?he():setTimeout(he,10)}))};let Z=null;function ge(){se.stop()}function _e(){se.start()}let se=new Hc;function Pe(S,W,$,te){if(S.visible===!1)return;if(S.layers.test(W.layers)){if(S.isGroup)$=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(W);else if(S.isLight)g.pushLight(S),S.castShadow&&g.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||ne.intersectsSprite(S)){te&&D.setFromMatrixPosition(S.matrixWorld).applyMatrix4(G);let he=Ve.update(S),xe=S.material;xe.visible&&f.push(S,he,xe,$,D.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||ne.intersectsObject(S))){let he=Ve.update(S),xe=S.material;if(te&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),D.copy(S.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),D.copy(he.boundingSphere.center)),D.applyMatrix4(S.matrixWorld).applyMatrix4(G)),Array.isArray(xe)){let Se=he.groups;for(let Ae=0,Ie=Se.length;Ae<Ie;Ae++){let He=Se[Ae],Le=xe[He.materialIndex];Le&&Le.visible&&f.push(S,he,Le,$,D.z,He)}}else xe.visible&&f.push(S,he,xe,$,D.z,null)}}let V=S.children;for(let he=0,xe=V.length;he<xe;he++)Pe(V[he],W,$,te)}function ze(S,W,$,te){let V=S.opaque,he=S.transmissive,xe=S.transparent;g.setupLightsView($),ae===!0&&at.setGlobalState(M.clippingPlanes,$),te&&Y.viewport(R.copy(te)),V.length>0&&Te(V,W,$),he.length>0&&Te(he,W,$),xe.length>0&&Te(xe,W,$),Y.buffers.depth.setTest(!0),Y.buffers.depth.setMask(!0),Y.buffers.color.setMask(!0),Y.setPolygonOffset(!1)}function de(S,W,$,te){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;g.state.transmissionRenderTarget[te.id]===void 0&&(g.state.transmissionRenderTarget[te.id]=new Kt(1,1,{generateMipmaps:!0,type:X.has("EXT_color_buffer_half_float")||X.has("EXT_color_buffer_float")?Lr:Vn,minFilter:Di,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));let V=g.state.transmissionRenderTarget[te.id],he=te.viewport||R;V.setSize(he.z,he.w);let xe=M.getRenderTarget();M.setRenderTarget(V),M.getClearColor(U),k=M.getClearAlpha(),k<1&&M.setClearColor(16777215,.5),M.clear(),T&&We.render($);let Se=M.toneMapping;M.toneMapping=0;let Ae=te.viewport;if(te.viewport!==void 0&&(te.viewport=void 0),g.setupLightsView(te),ae===!0&&at.setGlobalState(M.clippingPlanes,te),Te(S,$,te),ue.updateMultisampleRenderTarget(V),ue.updateRenderTargetMipmap(V),X.has("WEBGL_multisampled_render_to_texture")===!1){let Ie=!1;for(let He=0,Le=W.length;He<Le;He++){let Xe=W[He],mt=Xe.object,st=Xe.geometry,yt=Xe.material,lt=Xe.group;if(yt.side===2&&mt.layers.test(te.layers)){let Ye=yt.side;yt.side=1,yt.needsUpdate=!0,Ke(mt,$,te,st,yt,lt),yt.side=Ye,yt.needsUpdate=!0,Ie=!0}}Ie===!0&&(ue.updateMultisampleRenderTarget(V),ue.updateRenderTargetMipmap(V))}M.setRenderTarget(xe),M.setClearColor(U,k),Ae!==void 0&&(te.viewport=Ae),M.toneMapping=Se}function Te(S,W,$){let te=W.isScene===!0?W.overrideMaterial:null;for(let V=0,he=S.length;V<he;V++){let xe=S[V],Se=xe.object,Ae=xe.geometry,Ie=te===null?xe.material:te,He=xe.group;Se.layers.test($.layers)&&Ke(Se,W,$,Ae,Ie,He)}}function Ke(S,W,$,te,V,he){S.onBeforeRender(M,W,$,te,V,he),S.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),V.onBeforeRender(M,W,$,te,S,he),V.transparent===!0&&V.side===2&&V.forceSinglePass===!1?(V.side=1,V.needsUpdate=!0,M.renderBufferDirect($,W,te,V,S,he),V.side=0,V.needsUpdate=!0,M.renderBufferDirect($,W,te,V,S,he),V.side=2):M.renderBufferDirect($,W,te,V,S,he),S.onAfterRender(M,W,$,te,V,he)}function ot(S,W,$){W.isScene!==!0&&(W=z);let te=re.get(S),V=g.state.lights,he=g.state.shadowsArray,xe=V.state.version,Se=Be.getParameters(S,V.state,he,W,$),Ae=Be.getProgramCacheKey(Se),Ie=te.programs;te.environment=S.isMeshStandardMaterial?W.environment:null,te.fog=W.fog,te.envMap=(S.isMeshStandardMaterial?be:Me).get(S.envMap||te.environment),te.envMapRotation=te.environment!==null&&S.envMap===null?W.environmentRotation:S.envMapRotation,Ie===void 0&&(S.addEventListener("dispose",Zn),Ie=new Map,te.programs=Ie);let He=Ie.get(Ae);if(He!==void 0){if(te.currentProgram===He&&te.lightsStateVersion===xe)return Ce(S,Se),He}else Se.uniforms=Be.getUniforms(S),S.onBeforeCompile(Se,M),He=Be.acquireProgram(Se,Ae),Ie.set(Ae,He),te.uniforms=Se.uniforms;let Le=te.uniforms;return(S.isShaderMaterial||S.isRawShaderMaterial)&&S.clipping!==!0||(Le.clippingPlanes=at.uniform),Ce(S,Se),te.needsLights=(function(Xe){return Xe.isMeshLambertMaterial||Xe.isMeshToonMaterial||Xe.isMeshPhongMaterial||Xe.isMeshStandardMaterial||Xe.isShadowMaterial||Xe.isShaderMaterial&&Xe.lights===!0})(S),te.lightsStateVersion=xe,te.needsLights&&(Le.ambientLightColor.value=V.state.ambient,Le.lightProbe.value=V.state.probe,Le.directionalLights.value=V.state.directional,Le.directionalLightShadows.value=V.state.directionalShadow,Le.spotLights.value=V.state.spot,Le.spotLightShadows.value=V.state.spotShadow,Le.rectAreaLights.value=V.state.rectArea,Le.ltc_1.value=V.state.rectAreaLTC1,Le.ltc_2.value=V.state.rectAreaLTC2,Le.pointLights.value=V.state.point,Le.pointLightShadows.value=V.state.pointShadow,Le.hemisphereLights.value=V.state.hemi,Le.directionalShadowMap.value=V.state.directionalShadowMap,Le.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Le.spotShadowMap.value=V.state.spotShadowMap,Le.spotLightMatrix.value=V.state.spotLightMatrix,Le.spotLightMap.value=V.state.spotLightMap,Le.pointShadowMap.value=V.state.pointShadowMap,Le.pointShadowMatrix.value=V.state.pointShadowMatrix),te.currentProgram=He,te.uniformsList=null,He}function et(S){if(S.uniformsList===null){let W=S.currentProgram.getUniforms();S.uniformsList=Fi.seqWithValue(W.seq,S.uniforms)}return S.uniformsList}function Ce(S,W){let $=re.get(S);$.outputColorSpace=W.outputColorSpace,$.batching=W.batching,$.batchingColor=W.batchingColor,$.instancing=W.instancing,$.instancingColor=W.instancingColor,$.instancingMorph=W.instancingMorph,$.skinning=W.skinning,$.morphTargets=W.morphTargets,$.morphNormals=W.morphNormals,$.morphColors=W.morphColors,$.morphTargetsCount=W.morphTargetsCount,$.numClippingPlanes=W.numClippingPlanes,$.numIntersection=W.numClipIntersection,$.vertexAlphas=W.vertexAlphas,$.vertexTangents=W.vertexTangents,$.toneMapping=W.toneMapping}se.setAnimationLoop((function(S){Z&&Z(S)})),typeof self<"u"&&se.setContext(self),this.setAnimationLoop=function(S){Z=S,ft.setAnimationLoop(S),S===null?se.stop():se.start()},ft.addEventListener("sessionstart",ge),ft.addEventListener("sessionend",_e),this.render=function(S,W){if(W!==void 0&&W.isCamera!==!0)return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");if(L===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),ft.enabled===!0&&ft.isPresenting===!0&&(ft.cameraAutoUpdate===!0&&ft.updateCamera(W),W=ft.getCamera()),S.isScene===!0&&S.onBeforeRender(M,S,W,y),g=Qe.get(S,v.length),g.init(W),v.push(g),G.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),ne.setFromProjectionMatrix(G),E=this.localClippingEnabled,ae=at.init(this.clippingPlanes,E),f=Ze.get(S,x.length),f.init(),x.push(f),ft.enabled===!0&&ft.isPresenting===!0){let he=M.xr.getDepthSensingMesh();he!==null&&Pe(he,W,-1/0,M.sortObjects)}Pe(S,W,0,M.sortObjects),f.finish(),M.sortObjects===!0&&f.sort(fe,Q),T=ft.enabled===!1||ft.isPresenting===!1||ft.hasDepthSensing()===!1,T&&We.addToRenderList(f,S),this.info.render.frame++,ae===!0&&at.beginShadows();let $=g.state.shadowsArray;ye.render($,S,W),ae===!0&&at.endShadows(),this.info.autoReset===!0&&this.info.reset();let te=f.opaque,V=f.transmissive;if(g.setupLights(),W.isArrayCamera){let he=W.cameras;if(V.length>0)for(let xe=0,Se=he.length;xe<Se;xe++)de(te,V,S,he[xe]);T&&We.render(S);for(let xe=0,Se=he.length;xe<Se;xe++){let Ae=he[xe];ze(f,S,Ae,Ae.viewport)}}else V.length>0&&de(te,V,S,W),T&&We.render(S),ze(f,S,W);y!==null&&(ue.updateMultisampleRenderTarget(y),ue.updateRenderTargetMipmap(y)),S.isScene===!0&&S.onAfterRender(M,S,W),Ht.resetDefaultState(),b=-1,w=null,v.pop(),v.length>0?(g=v[v.length-1],ae===!0&&at.setGlobalState(M.clippingPlanes,g.state.camera)):g=null,x.pop(),f=x.length>0?x[x.length-1]:null},this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return y},this.setRenderTargetTextures=function(S,W,$){re.get(S.texture).__webglTexture=W,re.get(S.depthTexture).__webglTexture=$;let te=re.get(S);te.__hasExternalTextures=!0,te.__autoAllocateDepthBuffer=$===void 0,te.__autoAllocateDepthBuffer||X.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),te.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(S,W){let $=re.get(S);$.__webglFramebuffer=W,$.__useDefaultFramebuffer=W===void 0},this.setRenderTarget=function(S,W=0,$=0){y=S,P=W,O=$;let te=!0,V=null,he=!1,xe=!1;if(S){let Se=re.get(S);if(Se.__useDefaultFramebuffer!==void 0)Y.bindFramebuffer(K.FRAMEBUFFER,null),te=!1;else if(Se.__webglFramebuffer===void 0)ue.setupRenderTarget(S);else if(Se.__hasExternalTextures)ue.rebindTextures(S,re.get(S.texture).__webglTexture,re.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let He=S.depthTexture;if(Se.__boundDepthTexture!==He){if(He!==null&&re.has(He)&&(S.width!==He.image.width||S.height!==He.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ue.setupDepthRenderbuffer(S)}}let Ae=S.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(xe=!0);let Ie=re.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(V=Array.isArray(Ie[W])?Ie[W][$]:Ie[W],he=!0):V=S.samples>0&&ue.useMultisampledRTT(S)===!1?re.get(S).__webglMultisampledFramebuffer:Array.isArray(Ie)?Ie[$]:Ie,R.copy(S.viewport),C.copy(S.scissor),B=S.scissorTest}else R.copy(q).multiplyScalar(J).floor(),C.copy(ee).multiplyScalar(J).floor(),B=ce;if(Y.bindFramebuffer(K.FRAMEBUFFER,V)&&te&&Y.drawBuffers(S,V),Y.viewport(R),Y.scissor(C),Y.setScissorTest(B),he){let Se=re.get(S.texture);K.framebufferTexture2D(K.FRAMEBUFFER,K.COLOR_ATTACHMENT0,K.TEXTURE_CUBE_MAP_POSITIVE_X+W,Se.__webglTexture,$)}else if(xe){let Se=re.get(S.texture),Ae=W||0;K.framebufferTextureLayer(K.FRAMEBUFFER,K.COLOR_ATTACHMENT0,Se.__webglTexture,$||0,Ae)}b=-1},this.readRenderTargetPixels=function(S,W,$,te,V,he,xe){if(!S||!S.isWebGLRenderTarget)return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=re.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&xe!==void 0&&(Se=Se[xe]),Se){Y.bindFramebuffer(K.FRAMEBUFFER,Se);try{let Ae=S.texture,Ie=Ae.format,He=Ae.type;if(!le.textureFormatReadable(Ie))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");if(!le.textureTypeReadable(He))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");W>=0&&W<=S.width-te&&$>=0&&$<=S.height-V&&K.readPixels(W,$,te,V,Ft.convert(Ie),Ft.convert(He),he)}finally{let Ae=y!==null?re.get(y).__webglFramebuffer:null;Y.bindFramebuffer(K.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(S,W,$,te,V,he,xe){if(!S||!S.isWebGLRenderTarget)throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=re.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&xe!==void 0&&(Se=Se[xe]),Se){let Ae=S.texture,Ie=Ae.format,He=Ae.type;if(!le.textureFormatReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!le.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(W>=0&&W<=S.width-te&&$>=0&&$<=S.height-V){Y.bindFramebuffer(K.FRAMEBUFFER,Se);let Le=K.createBuffer();K.bindBuffer(K.PIXEL_PACK_BUFFER,Le),K.bufferData(K.PIXEL_PACK_BUFFER,he.byteLength,K.STREAM_READ),K.readPixels(W,$,te,V,Ft.convert(Ie),Ft.convert(He),0);let Xe=y!==null?re.get(y).__webglFramebuffer:null;Y.bindFramebuffer(K.FRAMEBUFFER,Xe);let mt=K.fenceSync(K.SYNC_GPU_COMMANDS_COMPLETE,0);return K.flush(),await(function(st,yt,lt){return new Promise((function(Ye,Lt){setTimeout((function Rt(){switch(st.clientWaitSync(yt,st.SYNC_FLUSH_COMMANDS_BIT,0)){case st.WAIT_FAILED:Lt();break;case st.TIMEOUT_EXPIRED:setTimeout(Rt,lt);break;default:Ye()}}),lt)}))})(K,mt,4),K.bindBuffer(K.PIXEL_PACK_BUFFER,Le),K.getBufferSubData(K.PIXEL_PACK_BUFFER,0,he),K.deleteBuffer(Le),K.deleteSync(mt),he}throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(S,W=null,$=0){S.isTexture!==!0&&(ur("WebGLRenderer: copyFramebufferToTexture function signature has changed."),W=arguments[0]||null,S=arguments[1]);let te=Math.pow(2,-$),V=Math.floor(S.image.width*te),he=Math.floor(S.image.height*te),xe=W!==null?W.x:0,Se=W!==null?W.y:0;ue.setTexture2D(S,0),K.copyTexSubImage2D(K.TEXTURE_2D,$,0,0,xe,Se,V,he),Y.unbindTexture()},this.copyTextureToTexture=function(S,W,$=null,te=null,V=0){let he,xe,Se,Ae,Ie,He,Le,Xe,mt;S.isTexture!==!0&&(ur("WebGLRenderer: copyTextureToTexture function signature has changed."),te=arguments[0]||null,S=arguments[1],W=arguments[2],V=arguments[3]||0,$=null);let st=S.isCompressedTexture?S.mipmaps[V]:S.image;$!==null?(he=$.max.x-$.min.x,xe=$.max.y-$.min.y,Se=$.isBox3?$.max.z-$.min.z:1,Ae=$.min.x,Ie=$.min.y,He=$.isBox3?$.min.z:0):(he=st.width,xe=st.height,Se=st.depth||1,Ae=0,Ie=0,He=0),te!==null?(Le=te.x,Xe=te.y,mt=te.z):(Le=0,Xe=0,mt=0);let yt=Ft.convert(W.format),lt=Ft.convert(W.type),Ye;W.isData3DTexture?(ue.setTexture3D(W,0),Ye=K.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(ue.setTexture2DArray(W,0),Ye=K.TEXTURE_2D_ARRAY):(ue.setTexture2D(W,0),Ye=K.TEXTURE_2D),K.pixelStorei(K.UNPACK_FLIP_Y_WEBGL,W.flipY),K.pixelStorei(K.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),K.pixelStorei(K.UNPACK_ALIGNMENT,W.unpackAlignment);let Lt=K.getParameter(K.UNPACK_ROW_LENGTH),Rt=K.getParameter(K.UNPACK_IMAGE_HEIGHT),Ge=K.getParameter(K.UNPACK_SKIP_PIXELS),Oe=K.getParameter(K.UNPACK_SKIP_ROWS),en=K.getParameter(K.UNPACK_SKIP_IMAGES);K.pixelStorei(K.UNPACK_ROW_LENGTH,st.width),K.pixelStorei(K.UNPACK_IMAGE_HEIGHT,st.height),K.pixelStorei(K.UNPACK_SKIP_PIXELS,Ae),K.pixelStorei(K.UNPACK_SKIP_ROWS,Ie),K.pixelStorei(K.UNPACK_SKIP_IMAGES,He);let Ws=S.isDataArrayTexture||S.isData3DTexture,ir=W.isDataArrayTexture||W.isData3DTexture;if(S.isRenderTargetTexture||S.isDepthTexture){let vi=re.get(S),Xs=re.get(W),js=re.get(vi.__renderTarget),Ys=re.get(Xs.__renderTarget);Y.bindFramebuffer(K.READ_FRAMEBUFFER,js.__webglFramebuffer),Y.bindFramebuffer(K.DRAW_FRAMEBUFFER,Ys.__webglFramebuffer);for(let Ln=0;Ln<Se;Ln++)Ws&&K.framebufferTextureLayer(K.READ_FRAMEBUFFER,K.COLOR_ATTACHMENT0,re.get(S).__webglTexture,V,He+Ln),S.isDepthTexture?(ir&&K.framebufferTextureLayer(K.DRAW_FRAMEBUFFER,K.COLOR_ATTACHMENT0,re.get(W).__webglTexture,V,mt+Ln),K.blitFramebuffer(Ae,Ie,he,xe,Le,Xe,he,xe,K.DEPTH_BUFFER_BIT,K.NEAREST)):ir?K.copyTexSubImage3D(Ye,V,Le,Xe,mt+Ln,Ae,Ie,he,xe):K.copyTexSubImage2D(Ye,V,Le,Xe,mt+Ln,Ae,Ie,he,xe);Y.bindFramebuffer(K.READ_FRAMEBUFFER,null),Y.bindFramebuffer(K.DRAW_FRAMEBUFFER,null)}else ir?S.isDataTexture||S.isData3DTexture?K.texSubImage3D(Ye,V,Le,Xe,mt,he,xe,Se,yt,lt,st.data):W.isCompressedArrayTexture?K.compressedTexSubImage3D(Ye,V,Le,Xe,mt,he,xe,Se,yt,st.data):K.texSubImage3D(Ye,V,Le,Xe,mt,he,xe,Se,yt,lt,st):S.isDataTexture?K.texSubImage2D(K.TEXTURE_2D,V,Le,Xe,he,xe,yt,lt,st.data):S.isCompressedTexture?K.compressedTexSubImage2D(K.TEXTURE_2D,V,Le,Xe,st.width,st.height,yt,st.data):K.texSubImage2D(K.TEXTURE_2D,V,Le,Xe,he,xe,yt,lt,st);K.pixelStorei(K.UNPACK_ROW_LENGTH,Lt),K.pixelStorei(K.UNPACK_IMAGE_HEIGHT,Rt),K.pixelStorei(K.UNPACK_SKIP_PIXELS,Ge),K.pixelStorei(K.UNPACK_SKIP_ROWS,Oe),K.pixelStorei(K.UNPACK_SKIP_IMAGES,en),V===0&&W.generateMipmaps&&K.generateMipmap(Ye),Y.unbindTexture()},this.copyTextureToTexture3D=function(S,W,$=null,te=null,V=0){return S.isTexture!==!0&&(ur("WebGLRenderer: copyTextureToTexture3D function signature has changed."),$=arguments[0]||null,te=arguments[1]||null,S=arguments[2],W=arguments[3],V=arguments[4]||0),ur('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(S,W,$,te,V)},this.initRenderTarget=function(S){re.get(S).__webglFramebuffer===void 0&&ue.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?ue.setTextureCube(S,0):S.isData3DTexture?ue.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?ue.setTexture2DArray(S,0):ue.setTexture2D(S,0),Y.unbindTexture()},this.resetState=function(){P=0,O=0,y=null,Y.reset(),Ht.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Vi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}};var ji=class extends cn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gn,this.environmentIntensity=1,this.environmentRotation=new gn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var Sp=new I;var wp=new I,Tp=new I,Ep=new I,Ap=new me,Rp=new me,Cp=new ke,Pp=new I,Ip=new I,Lp=new I,Dp=new me,Up=new me,Np=new me;var Op=new I,Fp=new I;var Bp=new I,zp=new ut,kp=new ut,Hp=new I,Vp=new ke,Gp=new I,Wp=new fn,Xp=new ke,jp=new Gn;var ws=class extends Xt{constructor(e=null,t=1,n=1,r,s,a,o,l,c=1003,h=1003,u,d){super(null,a,o,l,c,h,r,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Yp=new ke,qp=new ke;var Zp=new ke,Kp=new ke;var Jp=new jt,$p=new ke,Qp=new Et,em=new fn;var Ao=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,r){let s=this.pool,a=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});let o=s[this.index];a.push(o),this.index++,o.start=e,o.count=t,o.z=n,o.index=r}reset(){this.list.length=0,this.index=0}},tm=new ke,nm=new Ne(1,1,1),im=new yr,rm=new jt,sm=new fn,am=new I,om=new I,lm=new I,cm=new Ao,hm=new Et;var um=new I,dm=new I,pm=new ke,mm=new Gn,fm=new fn,gm=new I,vm=new I;var _m=new I,xm=new I;var ym=new ke,Mm=new Gn,bm=new fn,Sm=new I;var Jt=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(r),t.push(s),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),r=0,s=n.length,a;a=t||e*n[s-1];let o,l=0,c=s-1;for(;l<=c;)if(r=Math.floor(l+(c-l)/2),o=n[r]-a,o<0)l=r+1;else{if(!(o>0)){c=r;break}c=r-1}if(r=c,n[r]===a)return r/(s-1);let h=n[r];return(r+(a-h)/(n[r+1]-h))/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);let a=this.getPoint(r),o=this.getPoint(s),l=t||(a.isVector2?new me:new I);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new I,r=[],s=[],a=[],o=new I,l=new ke;for(let m=0;m<=e;m++){let p=m/e;r[m]=this.getTangentAt(p,new I)}s[0]=new I,a[0]=new I;let c=Number.MAX_VALUE,h=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let m=1;m<=e;m++){if(s[m]=s[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(r[m-1],r[m]),o.length()>Number.EPSILON){o.normalize();let p=Math.acos(xt(r[m-1].dot(r[m]),-1,1));s[m].applyMatrix4(l.makeRotationAxis(o,p))}a[m].crossVectors(r[m],s[m])}if(t===!0){let m=Math.acos(xt(s[0].dot(s[e]),-1,1));m/=e,r[0].dot(o.crossVectors(s[0],s[e]))>0&&(m=-m);for(let p=1;p<=e;p++)s[p].applyMatrix4(l.makeRotationAxis(r[p],m*p)),a[p].crossVectors(r[p],s[p])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},br=class extends Jt{constructor(e=0,t=0,n=1,r=1,s=0,a=2*Math.PI,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new me){let n=t,r=2*Math.PI,s=this.aEndAngle-this.aStartAngle,a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(s=a?0:r),this.aClockwise!==!0||a||(s===r?s=-r:s-=r);let o=this.aStartAngle+e*s,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,m=c-this.aY;l=d*h-m*u+this.aX,c=d*u+m*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ro=class extends br{constructor(e,t,n,r,s,a){super(e,t,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}};function cl(){let i=0,e=0,t=0,n=0;function r(s,a,o,l){i=s,e=o,t=-3*s+3*a-2*o-l,n=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){r(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,u){let d=(a-s)/c-(o-s)/(c+h)+(o-a)/h,m=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,m*=h,r(a,o,d,m)},calc:function(s){let a=s*s;return i+e*s+t*a+n*(a*s)}}}var ts=new I,Ta=new cl,Ea=new cl,Aa=new cl,Sr=class extends Jt{constructor(e=[],t=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new I){let n=t,r=this.points,s=r.length,a=(s-(this.closed?0:1))*e,o,l,c=Math.floor(a),h=a-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:h===0&&c===s-1&&(c=s-2,h=1),this.closed||c>0?o=r[(c-1)%s]:(ts.subVectors(r[0],r[1]).add(r[0]),o=ts);let u=r[c%s],d=r[(c+1)%s];if(this.closed||c+2<s?l=r[(c+2)%s]:(ts.subVectors(r[s-1],r[s-2]).add(r[s-1]),l=ts),this.curveType==="centripetal"||this.curveType==="chordal"){let m=this.curveType==="chordal"?.5:.25,p=Math.pow(o.distanceToSquared(u),m),_=Math.pow(u.distanceToSquared(d),m),f=Math.pow(d.distanceToSquared(l),m);_<1e-4&&(_=1),p<1e-4&&(p=_),f<1e-4&&(f=_),Ta.initNonuniformCatmullRom(o.x,u.x,d.x,l.x,p,_,f),Ea.initNonuniformCatmullRom(o.y,u.y,d.y,l.y,p,_,f),Aa.initNonuniformCatmullRom(o.z,u.z,d.z,l.z,p,_,f)}else this.curveType==="catmullrom"&&(Ta.initCatmullRom(o.x,u.x,d.x,l.x,this.tension),Ea.initCatmullRom(o.y,u.y,d.y,l.y,this.tension),Aa.initCatmullRom(o.z,u.z,d.z,l.z,this.tension));return n.set(Ta.calc(h),Ea.calc(h),Aa.calc(h)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(new I().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function gc(i,e,t,n,r){let s=.5*(n-e),a=.5*(r-t),o=i*i;return(2*t-2*n+s+a)*(i*o)+(-3*t+3*n-2*s-a)*o+s*i+t}function mr(i,e,t,n){return(function(r,s){let a=1-r;return a*a*s})(i,e)+(function(r,s){return 2*(1-r)*r*s})(i,t)+(function(r,s){return r*r*s})(i,n)}function fr(i,e,t,n,r){return(function(s,a){let o=1-s;return o*o*o*a})(i,e)+(function(s,a){let o=1-s;return 3*o*o*s*a})(i,t)+(function(s,a){return 3*(1-s)*s*s*a})(i,n)+(function(s,a){return s*s*s*a})(i,r)}var Ts=class extends Jt{constructor(e=new me,t=new me,n=new me,r=new me){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new me){let n=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(fr(e,r.x,s.x,a.x,o.x),fr(e,r.y,s.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Co=class extends Jt{constructor(e=new I,t=new I,n=new I,r=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new I){let n=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(fr(e,r.x,s.x,a.x,o.x),fr(e,r.y,s.y,a.y,o.y),fr(e,r.z,s.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Es=class extends Jt{constructor(e=new me,t=new me){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new me){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new me){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Po=class extends Jt{constructor(e=new I,t=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new I){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new I){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},As=class extends Jt{constructor(e=new me,t=new me,n=new me){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new me){let n=t,r=this.v0,s=this.v1,a=this.v2;return n.set(mr(e,r.x,s.x,a.x),mr(e,r.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Rs=class extends Jt{constructor(e=new I,t=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new I){let n=t,r=this.v0,s=this.v1,a=this.v2;return n.set(mr(e,r.x,s.x,a.x),mr(e,r.y,s.y,a.y),mr(e,r.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Cs=class extends Jt{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new me){let n=t,r=this.points,s=(r.length-1)*e,a=Math.floor(s),o=s-a,l=r[a===0?a:a-1],c=r[a],h=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(gc(o,l.x,c.x,h.x,u.x),gc(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(new me().fromArray(r))}return this}},Ps=Object.freeze({__proto__:null,ArcCurve:Ro,CatmullRomCurve3:Sr,CubicBezierCurve:Ts,CubicBezierCurve3:Co,EllipseCurve:br,LineCurve:Es,LineCurve3:Po,QuadraticBezierCurve:As,QuadraticBezierCurve3:Rs,SplineCurve:Cs}),Io=class extends Jt{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ps[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),s=0;for(;s<r.length;){if(r[s]>=n){let a=r[s]-n,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,s=this.curves;r<s.length;r++){let a=s[r],o=a.isEllipseCurve?2*e:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let r=e.curves[t];this.curves.push(new Ps[r.type]().fromJSON(r))}return this}},wr=class extends Io{constructor(e){super(),this.type="Path",this.currentPoint=new me,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Es(this.currentPoint.clone(),new me(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let s=new As(this.currentPoint.clone(),new me(e,t),new me(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,s,a){let o=new Ts(this.currentPoint.clone(),new me(e,t),new me(n,r),new me(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Cs(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,s,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,r,s,a),this}absarc(e,t,n,r,s,a){return this.absellipse(e,t,n,n,r,s,a),this}ellipse(e,t,n,r,s,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,r,s,a,o,l),this}absellipse(e,t,n,r,s,a,o,l){let c=new br(e,t,n,r,s,a,o,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Is=class i extends rt{constructor(e=[new me(0,-.5),new me(.5,0),new me(0,.5)],t=12,n=0,r=2*Math.PI){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=xt(r,0,2*Math.PI);let s=[],a=[],o=[],l=[],c=[],h=1/t,u=new I,d=new me,m=new I,p=new I,_=new I,f=0,g=0;for(let x=0;x<=e.length-1;x++)switch(x){case 0:f=e[x+1].x-e[x].x,g=e[x+1].y-e[x].y,m.x=1*g,m.y=-f,m.z=0*g,_.copy(m),m.normalize(),l.push(m.x,m.y,m.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:f=e[x+1].x-e[x].x,g=e[x+1].y-e[x].y,m.x=1*g,m.y=-f,m.z=0*g,p.copy(m),m.x+=_.x,m.y+=_.y,m.z+=_.z,m.normalize(),l.push(m.x,m.y,m.z),_.copy(p)}for(let x=0;x<=t;x++){let v=n+x*h*r,M=Math.sin(v),L=Math.cos(v);for(let P=0;P<=e.length-1;P++){u.x=e[P].x*M,u.y=e[P].y,u.z=e[P].x*L,a.push(u.x,u.y,u.z),d.x=x/t,d.y=P/(e.length-1),o.push(d.x,d.y);let O=l[3*P+0]*M,y=l[3*P+1],b=l[3*P+0]*L;c.push(O,y,b)}}for(let x=0;x<t;x++)for(let v=0;v<e.length-1;v++){let M=v+x*e.length,L=M,P=M+e.length,O=M+e.length+1,y=M+1;s.push(L,P,y),s.push(O,y,P)}this.setIndex(s),this.setAttribute("position",new Re(a,3)),this.setAttribute("uv",new Re(o,2)),this.setAttribute("normal",new Re(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},Lo=class i extends Is{constructor(e=1,t=1,n=4,r=8){let s=new wr;s.absarc(0,-t/2,e,1.5*Math.PI,0),s.absarc(0,t/2,e,0,.5*Math.PI),super(s.getPoints(n),r),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:r}}static fromJSON(e){return new i(e.radius,e.length,e.capSegments,e.radialSegments)}},Tr=class i extends rt{constructor(e=1,t=32,n=0,r=2*Math.PI){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let s=[],a=[],o=[],l=[],c=new I,h=new me;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let m=n+u/t*r;c.x=e*Math.cos(m),c.y=e*Math.sin(m),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new Re(a,3)),this.setAttribute("normal",new Re(o,3)),this.setAttribute("uv",new Re(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Ls=class i extends rt{constructor(e=1,t=1,n=1,r=32,s=1,a=!1,o=0,l=2*Math.PI){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};let c=this;r=Math.floor(r),s=Math.floor(s);let h=[],u=[],d=[],m=[],p=0,_=[],f=n/2,g=0;function x(v){let M=p,L=new me,P=new I,O=0,y=v===!0?e:t,b=v===!0?1:-1;for(let R=1;R<=r;R++)u.push(0,f*b,0),d.push(0,b,0),m.push(.5,.5),p++;let w=p;for(let R=0;R<=r;R++){let C=R/r*l+o,B=Math.cos(C),U=Math.sin(C);P.x=y*U,P.y=f*b,P.z=y*B,u.push(P.x,P.y,P.z),d.push(0,b,0),L.x=.5*B+.5,L.y=.5*U*b+.5,m.push(L.x,L.y),p++}for(let R=0;R<r;R++){let C=M+R,B=w+R;v===!0?h.push(B,B+1,C):h.push(B+1,B,C),O+=3}c.addGroup(g,O,v===!0?1:2),g+=O}(function(){let v=new I,M=new I,L=0,P=(t-e)/n;for(let O=0;O<=s;O++){let y=[],b=O/s,w=b*(t-e)+e;for(let R=0;R<=r;R++){let C=R/r,B=C*l+o,U=Math.sin(B),k=Math.cos(B);M.x=w*U,M.y=-b*n+f,M.z=w*k,u.push(M.x,M.y,M.z),v.set(U,P,k).normalize(),d.push(v.x,v.y,v.z),m.push(C,1-b),y.push(p++)}_.push(y)}for(let O=0;O<r;O++)for(let y=0;y<s;y++){let b=_[y][O],w=_[y+1][O],R=_[y+1][O+1],C=_[y][O+1];(e>0||y!==0)&&(h.push(b,w,C),L+=3),(t>0||y!==s-1)&&(h.push(w,R,C),L+=3)}c.addGroup(g,L,0),g+=L})(),a===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Re(u,3)),this.setAttribute("normal",new Re(d,3)),this.setAttribute("uv",new Re(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Do=class i extends Ls{constructor(e=1,t=1,n=32,r=1,s=!1,a=0,o=2*Math.PI){super(0,e,t,n,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},di=class i extends rt{constructor(e=[],t=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:r};let s=[],a=[];function o(d,m,p,_){let f=_+1,g=[];for(let x=0;x<=f;x++){g[x]=[];let v=d.clone().lerp(p,x/f),M=m.clone().lerp(p,x/f),L=f-x;for(let P=0;P<=L;P++)g[x][P]=P===0&&x===f?v:v.clone().lerp(M,P/L)}for(let x=0;x<f;x++)for(let v=0;v<2*(f-x)-1;v++){let M=Math.floor(v/2);v%2==0?(l(g[x][M+1]),l(g[x+1][M]),l(g[x][M])):(l(g[x][M+1]),l(g[x+1][M+1]),l(g[x+1][M]))}}function l(d){s.push(d.x,d.y,d.z)}function c(d,m){let p=3*d;m.x=e[p+0],m.y=e[p+1],m.z=e[p+2]}function h(d,m,p,_){_<0&&d.x===1&&(a[m]=d.x-1),p.x===0&&p.z===0&&(a[m]=_/2/Math.PI+.5)}function u(d){return Math.atan2(d.z,-d.x)}(function(d){let m=new I,p=new I,_=new I;for(let f=0;f<t.length;f+=3)c(t[f+0],m),c(t[f+1],p),c(t[f+2],_),o(m,p,_,d)})(r),(function(d){let m=new I;for(let p=0;p<s.length;p+=3)m.x=s[p+0],m.y=s[p+1],m.z=s[p+2],m.normalize().multiplyScalar(d),s[p+0]=m.x,s[p+1]=m.y,s[p+2]=m.z})(n),(function(){let d=new I;for(let p=0;p<s.length;p+=3){d.x=s[p+0],d.y=s[p+1],d.z=s[p+2];let _=u(d)/2/Math.PI+.5,f=(m=d,Math.atan2(-m.y,Math.sqrt(m.x*m.x+m.z*m.z))/Math.PI+.5);a.push(_,1-f)}var m;(function(){let p=new I,_=new I,f=new I,g=new I,x=new me,v=new me,M=new me;for(let L=0,P=0;L<s.length;L+=9,P+=6){p.set(s[L+0],s[L+1],s[L+2]),_.set(s[L+3],s[L+4],s[L+5]),f.set(s[L+6],s[L+7],s[L+8]),x.set(a[P+0],a[P+1]),v.set(a[P+2],a[P+3]),M.set(a[P+4],a[P+5]),g.copy(p).add(_).add(f).divideScalar(3);let O=u(g);h(x,P+0,p,O),h(v,P+2,_,O),h(M,P+4,f,O)}})(),(function(){for(let p=0;p<a.length;p+=6){let _=a[p+0],f=a[p+2],g=a[p+4],x=Math.max(_,f,g),v=Math.min(_,f,g);x>.9&&v<.1&&(_<.2&&(a[p+0]+=1),f<.2&&(a[p+2]+=1),g<.2&&(a[p+4]+=1))}})()})(),this.setAttribute("position",new Re(s,3)),this.setAttribute("normal",new Re(s.slice(),3)),this.setAttribute("uv",new Re(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}},Uo=class i extends di{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=1/n;super([-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-n,0,-r,n,0,r,-n,0,r,n,-r,-n,0,-r,n,0,r,-n,0,r,n,0,-n,0,-r,n,0,-r,-n,0,r,n,0,r],[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},ns=new I,is=new I,Ra=new I,rs=new kn,No=class extends rt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let r=Math.pow(10,4),s=Math.cos(Ni*t),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},m=[];for(let p=0;p<l;p+=3){a?(c[0]=a.getX(p),c[1]=a.getX(p+1),c[2]=a.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);let{a:_,b:f,c:g}=rs;if(_.fromBufferAttribute(o,c[0]),f.fromBufferAttribute(o,c[1]),g.fromBufferAttribute(o,c[2]),rs.getNormal(Ra),u[0]=`${Math.round(_.x*r)},${Math.round(_.y*r)},${Math.round(_.z*r)}`,u[1]=`${Math.round(f.x*r)},${Math.round(f.y*r)},${Math.round(f.z*r)}`,u[2]=`${Math.round(g.x*r)},${Math.round(g.y*r)},${Math.round(g.z*r)}`,u[0]!==u[1]&&u[1]!==u[2]&&u[2]!==u[0])for(let x=0;x<3;x++){let v=(x+1)%3,M=u[x],L=u[v],P=rs[h[x]],O=rs[h[v]],y=`${M}_${L}`,b=`${L}_${M}`;b in d&&d[b]?(Ra.dot(d[b].normal)<=s&&(m.push(P.x,P.y,P.z),m.push(O.x,O.y,O.z)),d[b]=null):y in d||(d[y]={index0:c[x],index1:c[v],normal:Ra.clone()})}}for(let p in d)if(d[p]){let{index0:_,index1:f}=d[p];ns.fromBufferAttribute(o,_),is.fromBufferAttribute(o,f),m.push(ns.x,ns.y,ns.z),m.push(is.x,is.y,is.z)}this.setAttribute("position",new Re(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},Yi=class extends wr{constructor(e){super(e),this.uuid=mi(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let r=e.holes[t];this.holes.push(new wr().fromJSON(r))}return this}},Dd=function(i,e,t=2){let n=e&&e.length,r=n?e[0]*t:i.length,s=vc(i,0,r,t,!0),a=[];if(!s||s.next===s.prev)return a;let o,l,c,h,u,d,m;if(n&&(s=(function(p,_,f,g){let x=[],v,M,L,P,O;for(v=0,M=_.length;v<M;v++)L=_[v]*g,P=v<M-1?_[v+1]*g:p.length,O=vc(p,L,P,g,!1),O===O.next&&(O.steiner=!0),x.push(Hd(O));for(x.sort(Bd),v=0;v<x.length;v++)f=zd(x[v],f);return f})(i,e,s,t)),i.length>80*t){o=c=i[0],l=h=i[1];for(let p=t;p<r;p+=t)u=i[p],d=i[p+1],u<o&&(o=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);m=Math.max(c-o,h-l),m=m!==0?32767/m:0}return Er(s,a,t,o,l,m,0),a};function vc(i,e,t,n,r){let s,a;if(r===(function(o,l,c,h){let u=0;for(let d=l,m=c-h;d<c;d+=h)u+=(o[m]-o[d])*(o[d+1]+o[m+1]),m=d;return u})(i,e,t,n)>0)for(s=e;s<t;s+=n)a=_c(s,i[s],i[s+1],a);else for(s=t-n;s>=e;s-=n)a=_c(s,i[s],i[s+1],a);return a&&ks(a,a.next)&&(Rr(a),a=a.next),a}function pi(i,e){if(!i)return i;e||(e=i);let t,n=i;do if(t=!1,n.steiner||!ks(n,n.next)&&dt(n.prev,n,n.next)!==0)n=n.next;else{if(Rr(n),n=e=n.prev,n===n.next)break;t=!0}while(t||n!==e);return e}function Er(i,e,t,n,r,s,a){if(!i)return;!a&&s&&(function(h,u,d,m){let p=h;do p.z===0&&(p.z=Oo(p.x,p.y,u,d,m)),p.prevZ=p.prev,p.nextZ=p.next,p=p.next;while(p!==h);p.prevZ.nextZ=null,p.prevZ=null,(function(_){let f,g,x,v,M,L,P,O,y=1;do{for(g=_,_=null,M=null,L=0;g;){for(L++,x=g,P=0,f=0;f<y&&(P++,x=x.nextZ,x);f++);for(O=y;P>0||O>0&&x;)P!==0&&(O===0||!x||g.z<=x.z)?(v=g,g=g.nextZ,P--):(v=x,x=x.nextZ,O--),M?M.nextZ=v:_=v,v.prevZ=M,M=v;g=x}M.nextZ=null,y*=2}while(L>1)})(p)})(i,n,r,s);let o,l,c=i;for(;i.prev!==i.next;)if(o=i.prev,l=i.next,s?Nd(i,n,r,s):Ud(i))e.push(o.i/t|0),e.push(i.i/t|0),e.push(l.i/t|0),Rr(i),i=l.next,c=l.next;else if((i=l)===c){a?a===1?Er(i=Od(pi(i),e,t),e,t,n,r,s,2):a===2&&Fd(i,e,t,n,r,s):Er(pi(i),e,t,n,r,s,1);break}}function Ud(i){let e=i.prev,t=i,n=i.next;if(dt(e,t,n)>=0)return!1;let r=e.x,s=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=r<s?r<a?r:a:s<a?s:a,u=o<l?o<c?o:c:l<c?l:c,d=r>s?r>a?r:a:s>a?s:a,m=o>l?o>c?o:c:l>c?l:c,p=n.next;for(;p!==e;){if(p.x>=h&&p.x<=d&&p.y>=u&&p.y<=m&&Ui(r,o,s,l,a,c,p.x,p.y)&&dt(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function Nd(i,e,t,n){let r=i.prev,s=i,a=i.next;if(dt(r,s,a)>=0)return!1;let o=r.x,l=s.x,c=a.x,h=r.y,u=s.y,d=a.y,m=o<l?o<c?o:c:l<c?l:c,p=h<u?h<d?h:d:u<d?u:d,_=o>l?o>c?o:c:l>c?l:c,f=h>u?h>d?h:d:u>d?u:d,g=Oo(m,p,e,t,n),x=Oo(_,f,e,t,n),v=i.prevZ,M=i.nextZ;for(;v&&v.z>=g&&M&&M.z<=x;){if(v.x>=m&&v.x<=_&&v.y>=p&&v.y<=f&&v!==r&&v!==a&&Ui(o,h,l,u,c,d,v.x,v.y)&&dt(v.prev,v,v.next)>=0||(v=v.prevZ,M.x>=m&&M.x<=_&&M.y>=p&&M.y<=f&&M!==r&&M!==a&&Ui(o,h,l,u,c,d,M.x,M.y)&&dt(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;v&&v.z>=g;){if(v.x>=m&&v.x<=_&&v.y>=p&&v.y<=f&&v!==r&&v!==a&&Ui(o,h,l,u,c,d,v.x,v.y)&&dt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;M&&M.z<=x;){if(M.x>=m&&M.x<=_&&M.y>=p&&M.y<=f&&M!==r&&M!==a&&Ui(o,h,l,u,c,d,M.x,M.y)&&dt(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function Od(i,e,t){let n=i;do{let r=n.prev,s=n.next.next;!ks(r,s)&&jc(r,n,n.next,s)&&Ar(r,s)&&Ar(s,r)&&(e.push(r.i/t|0),e.push(n.i/t|0),e.push(s.i/t|0),Rr(n),Rr(n.next),n=i=s),n=n.next}while(n!==i);return pi(n)}function Fd(i,e,t,n,r,s){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Vd(a,o)){let l=Yc(a,o);return a=pi(a,a.next),l=pi(l,l.next),Er(a,e,t,n,r,s,0),void Er(l,e,t,n,r,s,0)}o=o.next}a=a.next}while(a!==i)}function Bd(i,e){return i.x-e.x}function zd(i,e){let t=(function(r,s){let a,o=s,l=-1/0,c=r.x,h=r.y;do{if(h<=o.y&&h>=o.next.y&&o.next.y!==o.y){let f=o.x+(h-o.y)*(o.next.x-o.x)/(o.next.y-o.y);if(f<=c&&f>l&&(l=f,a=o.x<o.next.x?o:o.next,f===c))return a}o=o.next}while(o!==s);if(!a)return null;let u=a,d=a.x,m=a.y,p,_=1/0;o=a;do c>=o.x&&o.x>=d&&c!==o.x&&Ui(h<m?c:l,h,d,m,h<m?l:c,h,o.x,o.y)&&(p=Math.abs(h-o.y)/(c-o.x),Ar(o,r)&&(p<_||p===_&&(o.x>a.x||o.x===a.x&&kd(a,o)))&&(a=o,_=p)),o=o.next;while(o!==u);return a})(i,e);if(!t)return e;let n=Yc(t,i);return pi(n,n.next),pi(t,t.next)}function kd(i,e){return dt(i.prev,i,e.prev)<0&&dt(e.next,i,i.next)<0}function Oo(i,e,t,n,r){return(i=1431655765&((i=858993459&((i=252645135&((i=16711935&((i=(i-t)*r|0)|i<<8))|i<<4))|i<<2))|i<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=(e-n)*r|0)|e<<8))|e<<4))|e<<2))|e<<1))<<1}function Hd(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Ui(i,e,t,n,r,s,a,o){return(r-a)*(e-o)>=(i-a)*(s-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(r-a)*(n-o)}function Vd(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!(function(t,n){let r=t;do{if(r.i!==t.i&&r.next.i!==t.i&&r.i!==n.i&&r.next.i!==n.i&&jc(r,r.next,t,n))return!0;r=r.next}while(r!==t);return!1})(i,e)&&(Ar(i,e)&&Ar(e,i)&&(function(t,n){let r=t,s=!1,a=(t.x+n.x)/2,o=(t.y+n.y)/2;do r.y>o!=r.next.y>o&&r.next.y!==r.y&&a<(r.next.x-r.x)*(o-r.y)/(r.next.y-r.y)+r.x&&(s=!s),r=r.next;while(r!==t);return s})(i,e)&&(dt(i.prev,i,e.prev)||dt(i,e.prev,e))||ks(i,e)&&dt(i.prev,i,i.next)>0&&dt(e.prev,e,e.next)>0)}function dt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function ks(i,e){return i.x===e.x&&i.y===e.y}function jc(i,e,t,n){let r=as(dt(i,e,t)),s=as(dt(i,e,n)),a=as(dt(t,n,i)),o=as(dt(t,n,e));return r!==s&&a!==o||!(r!==0||!ss(i,t,e))||!(s!==0||!ss(i,n,e))||!(a!==0||!ss(t,i,n))||!(o!==0||!ss(t,e,n))}function ss(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function as(i){return i>0?1:i<0?-1:0}function Ar(i,e){return dt(i.prev,i,i.next)<0?dt(i,e,i.next)>=0&&dt(i,i.prev,e)>=0:dt(i,e,i.prev)<0||dt(i,i.next,e)<0}function Yc(i,e){let t=new Fo(i.i,i.x,i.y),n=new Fo(e.i,e.x,e.y),r=i.next,s=e.prev;return i.next=e,e.prev=i,t.next=r,r.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function _c(i,e,t,n){let r=new Fo(i,e,t);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function Rr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Fo(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}var Hn=class i{static area(e){let t=e.length,n=0;for(let r=t-1,s=0;s<t;r=s++)n+=e[r].x*e[s].y-e[s].x*e[r].y;return .5*n}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],r=[],s=[];xc(e),yc(n,e);let a=e.length;t.forEach(xc);for(let l=0;l<t.length;l++)r.push(a),a+=t[l].length,yc(n,t[l]);let o=Dd(n,r);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}};function xc(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function yc(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var Cr=class i extends rt{constructor(e=new Yi([new me(.5,.5),new me(-.5,.5),new me(-.5,-.5),new me(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],s=[];for(let o=0,l=e.length;o<l;o++)a(e[o]);function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled===void 0||t.bevelEnabled,m=t.bevelThickness!==void 0?t.bevelThickness:.2,p=t.bevelSize!==void 0?t.bevelSize:m-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,f=t.bevelSegments!==void 0?t.bevelSegments:3,g=t.extrudePath,x=t.UVGenerator!==void 0?t.UVGenerator:Gd,v,M,L,P,O,y=!1;g&&(v=g.getSpacedPoints(h),y=!0,d=!1,M=g.computeFrenetFrames(h,!1),L=new I,P=new I,O=new I),d||(f=0,m=0,p=0,_=0);let b=o.extractPoints(c),w=b.shape,R=b.holes;if(!Hn.isClockWise(w)){w=w.reverse();for(let H=0,D=R.length;H<D;H++){let z=R[H];Hn.isClockWise(z)&&(R[H]=z.reverse())}}let C=Hn.triangulateShape(w,R),B=w;for(let H=0,D=R.length;H<D;H++){let z=R[H];w=w.concat(z)}function U(H,D,z){return D||console.error("THREE.ExtrudeGeometry: vec does not exist"),H.clone().addScaledVector(D,z)}let k=w.length,j=C.length;function ie(H,D,z){let T,N,X,le=H.x-D.x,Y=H.y-D.y,oe=z.x-H.x,re=z.y-H.y,ue=le*le+Y*Y,Me=le*re-Y*oe;if(Math.abs(Me)>Number.EPSILON){let be=Math.sqrt(ue),we=Math.sqrt(oe*oe+re*re),De=D.x-Y/be,Ve=D.y+le/be,Be=((z.x-re/we-De)*re-(z.y+oe/we-Ve)*oe)/(le*re-Y*oe);T=De+le*Be-H.x,N=Ve+Y*Be-H.y;let Ee=T*T+N*N;if(Ee<=2)return new me(T,N);X=Math.sqrt(Ee/2)}else{let be=!1;le>Number.EPSILON?oe>Number.EPSILON&&(be=!0):le<-Number.EPSILON?oe<-Number.EPSILON&&(be=!0):Math.sign(Y)===Math.sign(re)&&(be=!0),be?(T=-Y,N=le,X=Math.sqrt(ue)):(T=le,N=Y,X=Math.sqrt(ue/2))}return new me(T/X,N/X)}let J=[];for(let H=0,D=B.length,z=D-1,T=H+1;H<D;H++,z++,T++)z===D&&(z=0),T===D&&(T=0),J[H]=ie(B[H],B[z],B[T]);let fe=[],Q,q=J.concat();for(let H=0,D=R.length;H<D;H++){let z=R[H];Q=[];for(let T=0,N=z.length,X=N-1,le=T+1;T<N;T++,X++,le++)X===N&&(X=0),le===N&&(le=0),Q[T]=ie(z[T],z[X],z[le]);fe.push(Q),q=q.concat(Q)}for(let H=0;H<f;H++){let D=H/f,z=m*Math.cos(D*Math.PI/2),T=p*Math.sin(D*Math.PI/2)+_;for(let N=0,X=B.length;N<X;N++){let le=U(B[N],J[N],T);ne(le.x,le.y,-z)}for(let N=0,X=R.length;N<X;N++){let le=R[N];Q=fe[N];for(let Y=0,oe=le.length;Y<oe;Y++){let re=U(le[Y],Q[Y],T);ne(re.x,re.y,-z)}}}let ee=p+_;for(let H=0;H<k;H++){let D=d?U(w[H],q[H],ee):w[H];y?(P.copy(M.normals[0]).multiplyScalar(D.x),L.copy(M.binormals[0]).multiplyScalar(D.y),O.copy(v[0]).add(P).add(L),ne(O.x,O.y,O.z)):ne(D.x,D.y,0)}for(let H=1;H<=h;H++)for(let D=0;D<k;D++){let z=d?U(w[D],q[D],ee):w[D];y?(P.copy(M.normals[H]).multiplyScalar(z.x),L.copy(M.binormals[H]).multiplyScalar(z.y),O.copy(v[H]).add(P).add(L),ne(O.x,O.y,O.z)):ne(z.x,z.y,u/h*H)}for(let H=f-1;H>=0;H--){let D=H/f,z=m*Math.cos(D*Math.PI/2),T=p*Math.sin(D*Math.PI/2)+_;for(let N=0,X=B.length;N<X;N++){let le=U(B[N],J[N],T);ne(le.x,le.y,u+z)}for(let N=0,X=R.length;N<X;N++){let le=R[N];Q=fe[N];for(let Y=0,oe=le.length;Y<oe;Y++){let re=U(le[Y],Q[Y],T);y?ne(re.x,re.y+v[h-1].y,v[h-1].x+z):ne(re.x,re.y,u+z)}}}function ce(H,D){let z=H.length;for(;--z>=0;){let T=z,N=z-1;N<0&&(N=H.length-1);for(let X=0,le=h+2*f;X<le;X++){let Y=k*X,oe=k*(X+1);E(D+T+Y,D+N+Y,D+N+oe,D+T+oe)}}}function ne(H,D,z){l.push(H),l.push(D),l.push(z)}function ae(H,D,z){A(H),A(D),A(z);let T=r.length/3,N=x.generateTopUV(n,r,T-3,T-2,T-1);G(N[0]),G(N[1]),G(N[2])}function E(H,D,z,T){A(H),A(D),A(T),A(D),A(z),A(T);let N=r.length/3,X=x.generateSideWallUV(n,r,N-6,N-3,N-2,N-1);G(X[0]),G(X[1]),G(X[3]),G(X[1]),G(X[2]),G(X[3])}function A(H){r.push(l[3*H+0]),r.push(l[3*H+1]),r.push(l[3*H+2])}function G(H){s.push(H.x),s.push(H.y)}(function(){let H=r.length/3;if(d){let D=0,z=k*D;for(let T=0;T<j;T++){let N=C[T];ae(N[2]+z,N[1]+z,N[0]+z)}D=h+2*f,z=k*D;for(let T=0;T<j;T++){let N=C[T];ae(N[0]+z,N[1]+z,N[2]+z)}}else{for(let D=0;D<j;D++){let z=C[D];ae(z[2],z[1],z[0])}for(let D=0;D<j;D++){let z=C[D];ae(z[0]+k*h,z[1]+k*h,z[2]+k*h)}}n.addGroup(H,r.length/3-H,0)})(),(function(){let H=r.length/3,D=0;ce(B,D),D+=B.length;for(let z=0,T=R.length;z<T;z++){let N=R[z];ce(N,D),D+=N.length}n.addGroup(H,r.length/3-H,1)})()}this.setAttribute("position",new Re(r,3)),this.setAttribute("uv",new Re(s,2)),this.computeVertexNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return(function(t,n,r){if(r.shapes=[],Array.isArray(t))for(let s=0,a=t.length;s<a;s++){let o=t[s];r.shapes.push(o.uuid)}else r.shapes.push(t.uuid);return r.options=Object.assign({},n),n.extrudePath!==void 0&&(r.options.extrudePath=n.extrudePath.toJSON()),r})(this.parameters.shapes,this.parameters.options,e)}static fromJSON(e,t){let n=[];for(let s=0,a=e.shapes.length;s<a;s++){let o=t[e.shapes[s]];n.push(o)}let r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new Ps[r.type]().fromJSON(r)),new i(n,e.options)}},Gd={generateTopUV:function(i,e,t,n,r){let s=e[3*t],a=e[3*t+1],o=e[3*n],l=e[3*n+1],c=e[3*r],h=e[3*r+1];return[new me(s,a),new me(o,l),new me(c,h)]},generateSideWallUV:function(i,e,t,n,r,s){let a=e[3*t],o=e[3*t+1],l=e[3*t+2],c=e[3*n],h=e[3*n+1],u=e[3*n+2],d=e[3*r],m=e[3*r+1],p=e[3*r+2],_=e[3*s],f=e[3*s+1],g=e[3*s+2];return Math.abs(o-h)<Math.abs(a-c)?[new me(a,1-l),new me(c,1-u),new me(d,1-p),new me(_,1-g)]:[new me(o,1-l),new me(h,1-u),new me(m,1-p),new me(f,1-g)]}},Bo=class i extends di{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2;super([-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},zo=class i extends di{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},ko=class i extends rt{constructor(e=.5,t=1,n=32,r=1,s=0,a=2*Math.PI){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:s,thetaLength:a},n=Math.max(3,n);let o=[],l=[],c=[],h=[],u=e,d=(t-e)/(r=Math.max(1,r)),m=new I,p=new me;for(let _=0;_<=r;_++){for(let f=0;f<=n;f++){let g=s+f/n*a;m.x=u*Math.cos(g),m.y=u*Math.sin(g),l.push(m.x,m.y,m.z),c.push(0,0,1),p.x=(m.x/t+1)/2,p.y=(m.y/t+1)/2,h.push(p.x,p.y)}u+=d}for(let _=0;_<r;_++){let f=_*(n+1);for(let g=0;g<n;g++){let x=g+f,v=x,M=x+n+1,L=x+n+2,P=x+1;o.push(v,M,P),o.push(M,L,P)}}this.setIndex(o),this.setAttribute("position",new Re(l,3)),this.setAttribute("normal",new Re(c,3)),this.setAttribute("uv",new Re(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},Ho=class i extends rt{constructor(e=new Yi([new me(0,.5),new me(-.5,-.5),new me(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],r=[],s=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;function c(h){let u=r.length/3,d=h.extractPoints(t),m=d.shape,p=d.holes;Hn.isClockWise(m)===!1&&(m=m.reverse());for(let f=0,g=p.length;f<g;f++){let x=p[f];Hn.isClockWise(x)===!0&&(p[f]=x.reverse())}let _=Hn.triangulateShape(m,p);for(let f=0,g=p.length;f<g;f++){let x=p[f];m=m.concat(x)}for(let f=0,g=m.length;f<g;f++){let x=m[f];r.push(x.x,x.y,0),s.push(0,0,1),a.push(x.x,x.y)}for(let f=0,g=_.length;f<g;f++){let x=_[f],v=x[0]+u,M=x[1]+u,L=x[2]+u;n.push(v,M,L),l+=3}}this.setIndex(n),this.setAttribute("position",new Re(r,3)),this.setAttribute("normal",new Re(s,3)),this.setAttribute("uv",new Re(a,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return(function(t,n){if(n.shapes=[],Array.isArray(t))for(let r=0,s=t.length;r<s;r++){let a=t[r];n.shapes.push(a.uuid)}else n.shapes.push(t.uuid);return n})(this.parameters.shapes,e)}static fromJSON(e,t){let n=[];for(let r=0,s=e.shapes.length;r<s;r++){let a=t[e.shapes[r]];n.push(a)}return new i(n,e.curveSegments)}},Pr=class i extends rt{constructor(e=1,t=32,n=16,r=0,s=2*Math.PI,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],u=new I,d=new I,m=[],p=[],_=[],f=[];for(let g=0;g<=n;g++){let x=[],v=g/n,M=0;g===0&&a===0?M=.5/t:g===n&&l===Math.PI&&(M=-.5/t);for(let L=0;L<=t;L++){let P=L/t;u.x=-e*Math.cos(r+P*s)*Math.sin(a+v*o),u.y=e*Math.cos(a+v*o),u.z=e*Math.sin(r+P*s)*Math.sin(a+v*o),p.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),f.push(P+M,1-v),x.push(c++)}h.push(x)}for(let g=0;g<n;g++)for(let x=0;x<t;x++){let v=h[g][x+1],M=h[g][x],L=h[g+1][x],P=h[g+1][x+1];(g!==0||a>0)&&m.push(v,M,P),(g!==n-1||l<Math.PI)&&m.push(M,L,P)}this.setIndex(m),this.setAttribute("position",new Re(p,3)),this.setAttribute("normal",new Re(_,3)),this.setAttribute("uv",new Re(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},Vo=class i extends di{constructor(e=1,t=0){super([1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],[2,1,0,0,3,2,1,3,0,2,3,1],e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},qi=class i extends rt{constructor(e=1,t=.4,n=12,r=48,s=2*Math.PI){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);let a=[],o=[],l=[],c=[],h=new I,u=new I,d=new I;for(let m=0;m<=n;m++)for(let p=0;p<=r;p++){let _=p/r*s,f=m/n*Math.PI*2;u.x=(e+t*Math.cos(f))*Math.cos(_),u.y=(e+t*Math.cos(f))*Math.sin(_),u.z=t*Math.sin(f),o.push(u.x,u.y,u.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(p/r),c.push(m/n)}for(let m=1;m<=n;m++)for(let p=1;p<=r;p++){let _=(r+1)*m+p-1,f=(r+1)*(m-1)+p-1,g=(r+1)*(m-1)+p,x=(r+1)*m+p;a.push(_,f,x),a.push(f,g,x)}this.setIndex(a),this.setAttribute("position",new Re(o,3)),this.setAttribute("normal",new Re(l,3)),this.setAttribute("uv",new Re(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},Go=class i extends rt{constructor(e=1,t=.4,n=64,r=8,s=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:r,p:s,q:a},n=Math.floor(n),r=Math.floor(r);let o=[],l=[],c=[],h=[],u=new I,d=new I,m=new I,p=new I,_=new I,f=new I,g=new I;for(let v=0;v<=n;++v){let M=v/n*s*Math.PI*2;x(M,s,a,e,m),x(M+.01,s,a,e,p),f.subVectors(p,m),g.addVectors(p,m),_.crossVectors(f,g),g.crossVectors(_,f),_.normalize(),g.normalize();for(let L=0;L<=r;++L){let P=L/r*Math.PI*2,O=-t*Math.cos(P),y=t*Math.sin(P);u.x=m.x+(O*g.x+y*_.x),u.y=m.y+(O*g.y+y*_.y),u.z=m.z+(O*g.z+y*_.z),l.push(u.x,u.y,u.z),d.subVectors(u,m).normalize(),c.push(d.x,d.y,d.z),h.push(v/n),h.push(L/r)}}for(let v=1;v<=n;v++)for(let M=1;M<=r;M++){let L=(r+1)*(v-1)+(M-1),P=(r+1)*v+(M-1),O=(r+1)*v+M,y=(r+1)*(v-1)+M;o.push(L,P,y),o.push(P,O,y)}function x(v,M,L,P,O){let y=Math.cos(v),b=Math.sin(v),w=L/M*v,R=Math.cos(w);O.x=P*(2+R)*.5*y,O.y=P*(2+R)*b*.5,O.z=P*Math.sin(w)*.5}this.setIndex(o),this.setAttribute("position",new Re(l,3)),this.setAttribute("normal",new Re(c,3)),this.setAttribute("uv",new Re(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}},Wo=class i extends rt{constructor(e=new Rs(new I(-1,-1,0),new I(-1,1,0),new I(1,1,0)),t=64,n=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:r,closed:s};let a=e.computeFrenetFrames(t,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new I,l=new I,c=new me,h=new I,u=[],d=[],m=[],p=[];function _(f){h=e.getPointAt(f/t,h);let g=a.normals[f],x=a.binormals[f];for(let v=0;v<=r;v++){let M=v/r*Math.PI*2,L=Math.sin(M),P=-Math.cos(M);l.x=P*g.x+L*x.x,l.y=P*g.y+L*x.y,l.z=P*g.z+L*x.z,l.normalize(),d.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,u.push(o.x,o.y,o.z)}}(function(){for(let f=0;f<t;f++)_(f);_(s===!1?t:0),(function(){for(let f=0;f<=t;f++)for(let g=0;g<=r;g++)c.x=f/t,c.y=g/r,m.push(c.x,c.y)})(),(function(){for(let f=1;f<=t;f++)for(let g=1;g<=r;g++){let x=(r+1)*(f-1)+(g-1),v=(r+1)*f+(g-1),M=(r+1)*f+g,L=(r+1)*(f-1)+g;p.push(x,v,L),p.push(v,M,L)}})()})(),this.setIndex(p),this.setAttribute("position",new Re(u,3)),this.setAttribute("normal",new Re(d,3)),this.setAttribute("uv",new Re(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new Ps[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},Xo=class extends rt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],n=new Set,r=new I,s=new I;if(e.index!==null){let a=e.attributes.position,o=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let u=l[c],d=u.start;for(let m=d,p=d+u.count;m<p;m+=3)for(let _=0;_<3;_++){let f=o.getX(m+_),g=o.getX(m+(_+1)%3);r.fromBufferAttribute(a,f),s.fromBufferAttribute(a,g),Mc(r,s,n)===!0&&(t.push(r.x,r.y,r.z),t.push(s.x,s.y,s.z))}}}else{let a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){let h=3*o+c,u=3*o+(c+1)%3;r.fromBufferAttribute(a,h),s.fromBufferAttribute(a,u),Mc(r,s,n)===!0&&(t.push(r.x,r.y,r.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new Re(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function Mc(i,e,t){let n=`${i.x},${i.y},${i.z}-${e.x},${e.y},${e.z}`,r=`${e.x},${e.y},${e.z}-${i.x},${i.y},${i.z}`;return t.has(n)!==!0&&t.has(r)!==!0&&(t.add(n),t.add(r),!0)}var wm=Object.freeze({__proto__:null,BoxGeometry:Gi,CapsuleGeometry:Lo,CircleGeometry:Tr,ConeGeometry:Do,CylinderGeometry:Ls,DodecahedronGeometry:Uo,EdgesGeometry:No,ExtrudeGeometry:Cr,IcosahedronGeometry:Bo,LatheGeometry:Is,OctahedronGeometry:zo,PlaneGeometry:Wn,PolyhedronGeometry:di,RingGeometry:ko,ShapeGeometry:Ho,SphereGeometry:Pr,TetrahedronGeometry:Vo,TorusGeometry:qi,TorusKnotGeometry:Go,TubeGeometry:Wo,WireframeGeometry:Xo});var Xn=class extends ci{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Ne(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new me(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},vn=class extends Xn{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new me(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return xt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ne(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ne(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ne(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};function os(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Wd(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Zi=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],s=t[n-1];t:{e:{let a;n:{i:if(!(e<r)){for(let o=n+2;;){if(r===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=r,r=t[++n],e<r)break e}a=t.length;break n}if(e>=s)break t;{let o=t[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(r=s,s=t[--n-1],e>=s)break e}a=n,n=0}}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(r=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r;for(let a=0;a!==r;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},jo=class extends Zi{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:yl,endingEnd:yl}}intervalChanged_(e,t,n){let r=this.parameterPositions,s=e-2,a=e+1,o=r[s],l=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ml:s=e,o=2*t-n;break;case bl:s=r.length-2,o=t+r[s]-r[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Ml:a=e,l=2*n-t;break;case bl:a=1,l=n+r[1]-r[0];break;default:a=e-1,l=t}let c=.5*(n-t),h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,m=this._weightNext,p=(n-t)/(r-t),_=p*p,f=_*p,g=-d*f+2*d*_-d*p,x=(1+d)*f+(-1.5-2*d)*_+(-.5+d)*p+1,v=(-1-m)*f+(1.5+m)*_+.5*p,M=m*f-m*_;for(let L=0;L!==o;++L)s[L]=g*a[h+L]+x*a[c+L]+v*a[l+L]+M*a[u+L];return s}},Yo=class extends Zi{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(r-t),u=1-h;for(let d=0;d!==o;++d)s[d]=a[c+d]*u+a[l+d]*h;return s}},qo=class extends Zi{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},hn=class{constructor(e,t,n,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=os(t,this.TimeBufferType),this.values=os(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:os(e.times,Array),values:os(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(n.interpolation=r)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new qo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Yo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new jo(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ps:t=this.InterpolantFactoryMethodDiscrete;break;case lo:t=this.InterpolantFactoryMethodLinear;break;case $s:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0){if(e===this.DefaultInterpolation)throw new Error(n);this.setInterpolation(this.DefaultInterpolation)}return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ps;case this.InterpolantFactoryMethodLinear:return lo;case this.InterpolantFactoryMethodSmooth:return $s}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,s=0,a=r-1;for(;s!==r&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==r){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!=0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,r=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(r!==void 0&&Wd(r))for(let o=0,l=r.length;o!==l;++o){let c=r[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===$s,s=e.length-1,a=1;for(let o=1;o<s;++o){let l=!1,c=e[o];if(c!==e[o+1]&&(o!==1||c!==e[0]))if(r)l=!0;else{let h=o*n,u=h-n,d=h+n;for(let m=0;m!==n;++m){let p=t[h+m];if(p!==t[u+m]||p!==t[d+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let h=o*n,u=a*n;for(let d=0;d!==n;++d)t[u+d]=t[h+d]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=new this.constructor(this.name,e,t);return n.createInterpolant=this.createInterpolant,n}};hn.prototype.TimeBufferType=Float32Array,hn.prototype.ValueBufferType=Float32Array,hn.prototype.DefaultInterpolation=lo;var ai=class extends hn{constructor(e,t,n){super(e,t,n)}};ai.prototype.ValueTypeName="bool",ai.prototype.ValueBufferType=Array,ai.prototype.DefaultInterpolation=ps,ai.prototype.InterpolantFactoryMethodLinear=void 0,ai.prototype.InterpolantFactoryMethodSmooth=void 0;var Zo=class extends hn{};Zo.prototype.ValueTypeName="color";var Ko=class extends hn{};Ko.prototype.ValueTypeName="number";var Jo=class extends Zi{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(r-t),c=e*o;for(let h=c+o;c!==h;c+=4)It.slerpFlat(s,0,a,c-o,a,c,l);return s}},Ds=class extends hn{InterpolantFactoryMethodLinear(e){return new Jo(this.times,this.values,this.getValueSize(),e)}};Ds.prototype.ValueTypeName="quaternion",Ds.prototype.InterpolantFactoryMethodSmooth=void 0;var oi=class extends hn{constructor(e,t,n){super(e,t,n)}};oi.prototype.ValueTypeName="string",oi.prototype.ValueBufferType=Array,oi.prototype.DefaultInterpolation=ps,oi.prototype.InterpolantFactoryMethodLinear=void 0,oi.prototype.InterpolantFactoryMethodSmooth=void 0;var $o=class extends hn{};$o.prototype.ValueTypeName="vector";var Qo=class{constructor(e,t,n){let r=this,s,a=!1,o=0,l=0,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){l++,a===!1&&r.onStart!==void 0&&r.onStart(h,o,l),a=!0},this.itemEnd=function(h){o++,r.onProgress!==void 0&&r.onProgress(h,o,l),o===l&&(a=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return s?s(h):h},this.setURLModifier=function(h){return s=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let m=c[u],p=c[u+1];if(m.global&&(m.lastIndex=0),m.test(h))return p}return null}}},Xd=new Qo,el=class{constructor(e){this.manager=e!==void 0?e:Xd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise((function(r,s){n.load(e,r,t,s)}))}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};el.DEFAULT_MATERIAL_NAME="__DEFAULT";var Tm=new ke,Em=new I,Am=new I;var Rm=new ke,Cm=new I,Pm=new I;var Im=new ke,Lm=new ke,Dm=new ke;var Um=new I,Nm=new It,Om=new I,Fm=new I;var Bm=new I,zm=new It,km=new I,Hm=new I;var hl="\\[\\]\\.:\\/",jd=new RegExp("["+hl+"]","g"),Ca="[^"+hl+"]",Yd="[^"+hl.replace("\\.","")+"]",qd=new RegExp("^"+/((?:WC+[\/:])*)/.source.replace("WC",Ca)+/(WCOD+)?/.source.replace("WCOD",Yd)+/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ca)+/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ca)+"$"),Zd=["material","materials","bones","map"],ht=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(jd,"")}static parseTrackName(e){let t=qd.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=n.nodeName.substring(r+1);Zd.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let a=0;a<s.length;a++){let o=s[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e)return void console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.materials)return void console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);e=e.material.materials;break;case"bones":if(!e.skeleton)return void console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.map)return void console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);e=e.material.map;break;default:if(e[n]===void 0)return void console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);e=e[n]}if(c!==void 0){if(e[c]===void 0)return void console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);e=e[c]}}let a=e[r];if(a===void 0){let c=t.nodeName;return void console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e)}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);if(!e.geometry.morphAttributes)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ht.Composite=class{constructor(i,e,t){let n=t||ht.parseTrackName(e);this._targetGroup=i,this._bindings=i.subscribe_(e,n)}getValue(i,e){this.bind();let t=this._targetGroup.nCachedObjects_,n=this._bindings[t];n!==void 0&&n.getValue(i,e)}setValue(i,e){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,r=t.length;n!==r;++n)t[n].setValue(i,e)}bind(){let i=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=i.length;e!==t;++e)i[e].bind()}unbind(){let i=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=i.length;e!==t;++e)i[e].unbind()}},ht.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},ht.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},ht.prototype.GetterByBindingType=[ht.prototype._getValue_direct,ht.prototype._getValue_array,ht.prototype._getValue_arrayElement,ht.prototype._getValue_toArray],ht.prototype.SetterByBindingTypeAndVersioning=[[ht.prototype._setValue_direct,ht.prototype._setValue_direct_setNeedsUpdate,ht.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ht.prototype._setValue_array,ht.prototype._setValue_array_setNeedsUpdate,ht.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ht.prototype._setValue_arrayElement,ht.prototype._setValue_arrayElement_setNeedsUpdate,ht.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ht.prototype._setValue_fromArray,ht.prototype._setValue_fromArray_setNeedsUpdate,ht.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Vm=new Float32Array(1);var Gm=new ke;var Ir=class{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(xt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Wm=new me;var Xm=new I,jm=new I;var Ym=new I;var qm=new I,Zm=new ke,Km=new ke;var Jm=new I,$m=new Ne,Qm=new Ne;var ef=new I,tf=new I,nf=new I;var rf=new I,sf=new ui;var af=new jt;var of=new I;var Us=class extends Rn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170");var qc={type:"change"},dl={type:"start"},Kc={type:"end"},Hs=new Gn,Zc=new on,Jd=Math.cos(70*Bs.DEG2RAD),St=new I,zt=2*Math.PI,it={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ul=1e-6,Vs=class extends Us{constructor(e,t=null){super(e,t),this.state=it.NONE,this.enabled=!0,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:un.ROTATE,MIDDLE:un.DOLLY,RIGHT:un.PAN},this.touches={ONE:_n.ROTATE,TWO:_n.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new It,this._lastTargetPosition=new I,this._quat=new It().setFromUnitVectors(e.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ir,this._sphericalDelta=new Ir,this._scale=1,this._panOffset=new I,this._rotateStart=new me,this._rotateEnd=new me,this._rotateDelta=new me,this._panStart=new me,this._panEnd=new me,this._panDelta=new me,this._dollyStart=new me,this._dollyEnd=new me,this._dollyDelta=new me,this._dollyDirection=new I,this._mouse=new me,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Qd.bind(this),this._onPointerDown=$d.bind(this),this._onPointerUp=ep.bind(this),this._onContextMenu=op.bind(this),this._onMouseWheel=ip.bind(this),this._onKeyDown=rp.bind(this),this._onTouchStart=sp.bind(this),this._onTouchMove=ap.bind(this),this._onMouseDown=tp.bind(this),this._onMouseMove=np.bind(this),this._interceptControlDown=lp.bind(this),this._interceptControlUp=cp.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(qc),this.update(),this.state=it.NONE}update(e=null){let t=this.object.position;St.copy(t).sub(this.target),St.applyQuaternion(this._quat),this._spherical.setFromVector3(St),this.autoRotate&&this.state===it.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=zt:n>Math.PI&&(n-=zt),r<-Math.PI?r+=zt:r>Math.PI&&(r-=zt),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=a!=this._spherical.radius}if(St.setFromSpherical(this._spherical),St.applyQuaternion(this._quatInverse),t.copy(this.target).add(St),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let o=St.length();a=this._clampDistance(o*this._scale);let l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){let o=new I(this._mouse.x,this._mouse.y,0);o.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;let c=new I(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=St.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Hs.origin.copy(this.object.position),Hs.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Hs.direction))<Jd?this.object.lookAt(this.target):(Zc.setFromNormalAndCoplanarPoint(this.object.up,this.target),Hs.intersectPlane(Zc,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>ul||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ul||this._lastTargetPosition.distanceToSquared(this.target)>ul?(this.dispatchEvent(qc),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?zt/60*this.autoRotateSpeed*e:zt/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){St.setFromMatrixColumn(t,0),St.multiplyScalar(-e),this._panOffset.add(St)}_panUp(e,t){this.screenSpacePanning===!0?St.setFromMatrixColumn(t,1):(St.setFromMatrixColumn(t,0),St.crossVectors(this.object.up,St)),St.multiplyScalar(e),this._panOffset.add(St)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let r=this.object.position;St.copy(r).sub(this.target);let s=St.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/n.clientHeight,this.object.matrix),this._panUp(2*t*s/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),r=e-n.left,s=t-n.top,a=n.width,o=n.height;this._mouse.x=r/a*2-1,this._mouse.y=-(s/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(zt*this._rotateDelta.x/t.clientHeight),this._rotateUp(zt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(zt*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-zt*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(zt*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-zt*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(n*n+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),r=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(zt*this._rotateDelta.x/t.clientHeight),this._rotateUp(zt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new me,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function $d(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function Qd(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function ep(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Kc),this.state=it.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function tp(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case un.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=it.DOLLY;break;case un.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=it.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=it.ROTATE}break;case un.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=it.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=it.PAN}break;default:this.state=it.NONE}this.state!==it.NONE&&this.dispatchEvent(dl)}function np(i){switch(this.state){case it.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case it.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case it.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function ip(i){this.enabled===!1||this.enableZoom===!1||this.state!==it.NONE||(i.preventDefault(),this.dispatchEvent(dl),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Kc))}function rp(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function sp(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case _n.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=it.TOUCH_ROTATE;break;case _n.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=it.TOUCH_PAN;break;default:this.state=it.NONE}break;case 2:switch(this.touches.TWO){case _n.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=it.TOUCH_DOLLY_PAN;break;case _n.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=it.TOUCH_DOLLY_ROTATE;break;default:this.state=it.NONE}break;default:this.state=it.NONE}this.state!==it.NONE&&this.dispatchEvent(dl)}function ap(i){switch(this._trackPointer(i),this.state){case it.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case it.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case it.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case it.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=it.NONE}}function op(i){this.enabled!==!1&&i.preventDefault()}function lp(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function cp(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var F=(i,e,t)=>new I(i,e,t),pt=Bs.clamp,kt=(i,e,t)=>{let n=pt((t-i)/(e-i),0,1);return n*n*(3-2*n)},wt=F(1,0,0),Qi=F(0,1,0),fi=F(0,0,1),hp=(()=>{let i="vec3 CustomToneMapping( vec3 color ) { return color; }",e=Ue.tonemapping_pars_fragment||"";return e.includes("vtFilm")?!0:e.includes(i)?(Ue.tonemapping_pars_fragment=e.replace(i,"vec3 CustomToneMapping( vec3 color ) { /* vtFilm */ color *= toneMappingExposure; return min( color, 0.72 ) + 0.28 * ( 1.0 - exp( - max( color - 0.72, 0.0 ) / 0.28 ) ); }"),!0):!1})(),fl=16371578,$c=14869474,pe={zL:15.6,zB:-19.5,z1:13.5,V:24.4,casingR:9.75,casingTop:7.9,casingBot:-103.2,capTop:15,capBot:-110.9,stroke:16.5,buttonUnder:31.9,buttonTop:36.5,mouthRim:-242.6,recvEnd:-176.5,recvFront:-129.9,leadR:5.5,outerR:6.7,bowR:6.35,leadFerrule:72.2,slideFerrule:158.4,bowStart:170.8,bowCorner:25.7,bowFront:196.5,lowerY:-67.4,s3:{yU:-53.7,yL:-73.8,x0:47.2,x1:147.5,out:25},s1:{yU:-56.7,yL:-74.9,x0:-36.1,x1:-91.6,out:12},s2:{yU:-54,yL:-75.2},bell:{rimX:310,rimR:61.5,bowCx:-135.4,bowR:39.5,lowY:-79}};function $t(i,e,t=.1){let n=[],r=s=>{(!n.length||n[n.length-1].distanceToSquared(s)>1e-8)&&n.push(s)};r(i[0].clone());for(let s=1;s<i.length-1;s++){let a=i[s],o=a.clone().sub(i[s-1]).normalize(),l=i[s+1].clone().sub(a).normalize(),c=Math.acos(pt(o.dot(l),-1,1)),h=Array.isArray(e)?e[s-1]:e;if(c<1e-4||!h){r(a.clone());continue}let u=h*Math.tan(c/2),d=a.clone().addScaledVector(o,-u),m=l.clone().sub(o).normalize(),p=a.clone().addScaledVector(m,h/Math.cos(c/2)),_=Math.max(2,Math.ceil(c/t)),f=d.clone().sub(p),g=o.clone().cross(l).normalize();for(let x=0;x<=_;x++)r(f.clone().applyAxisAngle(g,c*x/_).add(p))}return r(i[i.length-1].clone()),n}function pl(i,e){let t=[i[0]];for(let n=1;n<i.length;n++){let r=i[n].distanceTo(i[n-1]),s=Math.ceil(r/e);for(let a=1;a<=s;a++)t.push(i[n-1].clone().lerp(i[n],a/s))}return t}function Gs(i,e){return new Sr(i,!1,"centripetal").getPoints(e)}function Cn(i,e,t={}){let n=i.length,r=t.segs||28,s=[0];for(let b=1;b<n;b++)s[b]=s[b-1]+i[b].distanceTo(i[b-1]);let a=s[n-1],o=[];for(let b=0;b<n;b++)o[b]=typeof e=="function"?e(s[b],a,b):Array.isArray(e)?e[b]:e;let l=[];for(let b=0;b<n;b++){let w=i[Math.max(0,b-1)],R=i[Math.min(n-1,b+1)];l[b]=R.clone().sub(w).normalize()}let c=(t.up||(Math.abs(l[0].z)<.9?fi:wt)).clone();c.addScaledVector(l[0],-c.dot(l[0])).normalize();let h=t.scaleN||1,u=t.scaleB||1,d=t.sq||2,m=!!t.inside,p=[],_=[],f=[],g=[],x=new It,v=F(),M=F(),L=F();for(let b=0;b<n;b++){b>0&&(x.setFromUnitVectors(l[b-1],l[b]),c.applyQuaternion(x),c.addScaledVector(l[b],-c.dot(l[b])).normalize()),L.crossVectors(l[b],c);let w=b===0?(o[1]-o[0])/(s[1]-s[0]||1):b===n-1?(o[b]-o[b-1])/(s[b]-s[b-1]||1):(o[b+1]-o[b-1])/(s[b+1]-s[b-1]||1);for(let R=0;R<=r;R++){let C=R/r*Math.PI*2,B=Math.cos(C),U=Math.sin(C),k=B,j=U,ie=B/h,J=U/u;d!==2&&(k=Math.sign(B)*Math.pow(Math.abs(B),2/d),j=Math.sign(U)*Math.pow(Math.abs(U),2/d),ie=Math.sign(B)*Math.pow(Math.abs(B),2*(d-1)/d)/h,J=Math.sign(U)*Math.pow(Math.abs(U),2*(d-1)/d)/u),v.set(0,0,0).addScaledVector(c,k*h).addScaledVector(L,j*u),p.push(i[b].x+v.x*o[b],i[b].y+v.y*o[b],i[b].z+v.z*o[b]),M.set(0,0,0).addScaledVector(c,ie).addScaledVector(L,J).normalize().addScaledVector(l[b],-w).normalize(),m&&M.negate(),_.push(M.x,M.y,M.z),f.push(R/r,s[b]/(t.uvLen||a||1))}}let P=r+1;for(let b=0;b<n-1;b++)for(let w=0;w<r;w++){let R=b*P+w,C=R+1,B=R+P,U=B+1;m?g.push(R,B,C,C,B,U):g.push(R,C,B,C,U,B)}let O=(b,w)=>{let R=p.length/3,C=l[b];p.push(i[b].x,i[b].y,i[b].z),_.push(C.x*w,C.y*w,C.z*w),f.push(.5,.5);for(let B=0;B<=r;B++){let U=(b*P+B)*3;p.push(p[U],p[U+1],p[U+2]),_.push(C.x*w,C.y*w,C.z*w),f.push(.5,.5)}for(let B=0;B<r;B++)w>0?g.push(R,R+1+B,R+2+B):g.push(R,R+2+B,R+1+B)};t.capA&&O(0,-1),t.capB&&O(n-1,1);let y=new rt;return y.setAttribute("position",new Re(p,3)),y.setAttribute("normal",new Re(_,3)),y.setAttribute("uv",new Re(f,2)),y.setIndex(g),y.userData.rings=n,y.userData.W=P,y}function Jc(i,e,t){let n=i.userData.W,r=new rt;for(let o of["position","normal","uv","color"]){let l=i.getAttribute(o);l&&r.setAttribute(o,new vt(l.array.slice(e*n*l.itemSize,(t+1)*n*l.itemSize),l.itemSize))}let s=i.index.array,a=[];for(let o=0;o<s.length;o+=3){let l=Math.floor(Math.min(s[o],s[o+1],s[o+2])/n);l>=e&&l<t&&a.push(s[o]-e*n,s[o+1]-e*n,s[o+2]-e*n)}return r.setIndex(a),r}function tt(i,e={}){let t=e.segs||48,n=Math.cos((e.crease||32)*Math.PI/180),r=i.filter((p,_)=>_===0||Math.hypot(p[0]-i[_-1][0],p[1]-i[_-1][1])>1e-6),s=[];for(let p=0;p<r.length-1;p++){let _=r[p+1][0]-r[p][0],f=r[p+1][1]-r[p][1],g=Math.hypot(_,f);s.push([-f/g,_/g])}let a=[],o=0;for(let p=0;p<r.length;p++){p>0&&(o+=Math.hypot(r[p][0]-r[p-1][0],r[p][1]-r[p-1][1]));let _=s[p-1],f=s[p];if(_&&f&&_[0]*f[0]+_[1]*f[1]>=n){let g=_[0]+f[0],x=_[1]+f[1],v=Math.hypot(g,x);a.push({y:r[p][0],r:r[p][1],ny:g/v,nr:x/v,v:o,brk:!1})}else _&&a.push({y:r[p][0],r:r[p][1],ny:_[0],nr:_[1],v:o,brk:!0}),f&&a.push({y:r[p][0],r:r[p][1],ny:f[0],nr:f[1],v:o,brk:!1})}let l=[],c=[],h=[],u=[],d=t+1;for(let p of a)for(let _=0;_<=t;_++){let f=_/t*Math.PI*2,g=Math.cos(f),x=Math.sin(f);l.push(p.r*g,p.y,p.r*x),c.push(p.nr*g,p.ny,p.nr*x),h.push(_/t,p.v/(o||1))}for(let p=0;p<a.length-1;p++)if(!a[p].brk)for(let _=0;_<t;_++){let f=p*d+_,g=f+1,x=f+d,v=x+1;u.push(f,x,g,x,v,g)}let m=new rt;return m.setAttribute("position",new Re(l,3)),m.setAttribute("normal",new Re(c,3)),m.setAttribute("uv",new Re(h,2)),m.setIndex(u),m}function Dr(i,e,t,n){let s=[],a=[],o=[],l=[];for(let h=0;h<=96;h++){let u=h/96*Math.PI*2,d=Math.cos(u),m=Math.sin(u);s.push(t*d,i,t*m,t*d,e,t*m),a.push(d,0,m,d,0,m),o.push(n*h/96,0,n*h/96,1)}for(let h=0;h<96;h++){let u=h*2;l.push(u,u+1,u+2,u+2,u+1,u+3)}let c=new rt;return c.setAttribute("position",new Re(s,3)),c.setAttribute("normal",new Re(a,3)),c.setAttribute("uv",new Re(o,2)),c.setIndex(l),c}function At(i,e,t,n,r,s=6){let a=[];for(let o=0;o<=s;o++){let l=(n+(r-n)*o/s)*Math.PI/180;a.push([i+t*Math.cos(l),e+t*Math.sin(l)])}return a}function qe(i,e,t=Qi){let n=new ke().makeRotationFromQuaternion(new It().setFromUnitVectors(Qi,t.clone().normalize()));return n.setPosition(e),i.applyMatrix4(n)}function up(i){let e=0,t=0;for(let u of i)e+=u.attributes.position.count,t+=u.index.count;let n=new Float32Array(e*3),r=new Float32Array(e*3),s=new Float32Array(e*2),a=new Float32Array(e*3).fill(1),o=new Uint32Array(t),l=0,c=0;for(let u of i){n.set(u.attributes.position.array,l*3),r.set(u.attributes.normal.array,l*3),u.attributes.uv&&s.set(u.attributes.uv.array,l*2),u.attributes.color&&a.set(u.attributes.color.array,l*3);let d=u.index.array;for(let m=0;m<d.length;m++)o[c+m]=d[m]+l;l+=u.attributes.position.count,c+=d.length,u.dispose()}let h=new rt;return h.setAttribute("position",new vt(n,3)),h.setAttribute("normal",new vt(r,3)),h.setAttribute("uv",new vt(s,2)),h.setAttribute("color",new vt(a,3)),h.setIndex(new vt(o,1)),h}function ml(i,e,t,n){let r=new Yi,s=i/2-n,a=e/2-n;r.absarc(s,a,n,0,Math.PI/2),r.absarc(-s,a,n,Math.PI/2,Math.PI),r.absarc(-s,-a,n,Math.PI,Math.PI*1.5),r.absarc(s,-a,n,Math.PI*1.5,Math.PI*2);let o=new Cr(r,{depth:t-2*n,bevelEnabled:!0,bevelThickness:n,bevelSize:n*.999,bevelOffset:-n*.999,bevelSegments:3,curveSegments:5});o.translate(0,0,-(t-2*n)/2);let l=o.index?o.toNonIndexed():o;return l.setIndex([...Array(l.attributes.position.count).keys()]),l}var Qc=`
  float vtBand(float x, float a, float b, float e){ return smoothstep(a - e, a + e, x) * (1.0 - smoothstep(b - e, b + e, x)); }
  float vtStrip(float az, float c, float w, float e){ float x = abs(mod(az - c + 180.0, 360.0) - 180.0); return 1.0 - smoothstep(w - e, w + e, x); }
  float vtCap(vec3 n, float az, float el, float R, float e){ float a = radians(az), b = radians(el); return 1.0 - smoothstep(R - e, R + e, degrees(acos(clamp(dot(n, vec3(sin(a) * cos(b), sin(b), cos(a) * cos(b))), -1.0, 1.0)))); }
  // bl = how many degrees of the room one screen pixel covers in this reflection: every edge is softened by that
  // much, so hairline reflections (a light seen in a tube seen in a tube) fade out instead of breaking into dashes
  // The room is a light tent: big, smooth, glowing surfaces and nothing with an edge. (A highlight a third of a
  // tube's width means a light some 80 to 90 degrees across; everything crisp in a product photo is the instrument
  // mirrored in itself, which the tracer below does.)
  // n = the direction looked in, as seen from where the mirror stands in the room; s = the same direction for a
  // mirror at the middle of the room (used for the light at the instrument's own height, so that it never slides
  // onto the long level tubes); upr = 0 leaves that light out (the bell)
  float vtLobe(vec3 n, float az, float el, float sig){
    float a = radians(az), b = radians(el), d = degrees(acos(clamp(dot(n, vec3(sin(a) * cos(b), sin(b), cos(a) * cos(b))), -1.0, 1.0)));
    return exp(-d * d / (2.0 * sig * sig));
  }
  float vtEdgeK = 1.0, vtTubeK = 0.0, vtFrontK = 1.0, vtBellW = 0.0;                              // set per material by the mirror shader (the baked map uses these defaults)
  vec3 vtStudio(vec3 n, vec3 s, float bl, float upr){
    n = normalize(n); s = normalize(s);
    float az = degrees(atan(n.x, n.z));
    vec3 white = vec3(1.0, 0.985, 0.955);
    float ek = vtEdgeK, tk = vtTubeK, bw = vtBellW;
    // the tent's own glow: pale on the camera's side, falling smoothly to warm dark behind the instrument
    vec3 c = mix(vec3(0.43, 0.335, 0.24), white * (0.66 + 0.06 * smoothstep(-70.0, 45.0, az)), smoothstep(-0.95, 0.40, n.z));
    // ... for the long level tubes and the bell (tk = 1) without the mid-greys: tan is gold times grey. There every
    // direction is either bright (clean yellow-gold in the brass, rising to white in the lights) or dark and warm
    // (deep amber-brown), with a definite edge between
    c = mix(c, mix(vec3(0.27, 0.155, 0.07), white * vec3(1.02, 1.0, 0.96), smoothstep(mix(-0.36, -0.82, bw), mix(-0.12, -0.56, bw), n.z)), tk);
    // The lights are soft boxes: flat, with a definite but soft edge (a transition some 6 to 10 % of a tube's
    // width; a hard edge reads as a drawing, an edge half a tube wide as satin paint).
    float up = degrees(atan(n.y, n.z)), ends = (1.0 - smoothstep(0.93, 0.995, abs(n.x))) * mix(1.0, 0.85, smoothstep(0.5, 0.93, abs(n.x)));   // (the long lights run far past the instrument's ends, a little dimmer out there)
    // the long level tubes and the bell (tk = 1) see the lower half of the tent warmer: rich orange-gold below
    c *= mix(vec3(1.0), vec3(0.97, 0.86, 0.66), tk * (1.0 - 0.5 * bw) * vtBand(up, -89.0, -10.0, 6.0));   // (richer below)
    // the key box, overhead, long from left to right. On the valve block (tk = 0): a wide pale stripe. On the level
    // tubes and the bell: a narrow near-white highlight with a thin dark-amber line under it, as in the photos
    vec3 key0 = white * (1.3 + 1.5 * vtBand(up, 57.0, 87.0, 7.0)), key1 = white * (0.95 + 0.45 * bw + 2.4 * vtBand(up, 63.0 - 7.0 * bw, 89.0 + 10.0 * bw, 3.5 * ek + bl));
    c = mix(c, mix(key0, key1, tk), mix(vtBand(up, 47.0, 118.0, 5.0 + bl), vtBand(up, 58.0 - 8.0 * bw, 106.0 + 10.0 * bw, 4.0 * ek + bl), tk) * ends);
    c = mix(c, vec3(0.24, 0.14, 0.06), tk * (0.92 - 0.1 * bw) * vtBand(up, 35.0 - 9.0 * bw, 54.0 - 9.0 * bw, 3.0 * ek + bl) * ends);
    // the white table below and in front (the lighter lower part of every tube), and the dark gap between table
    // and tent (the deep amber line low down)
    c = mix(c, mix(vec3(0.30, 0.215, 0.14), vec3(0.24, 0.14, 0.06), tk), mix(0.62, 0.9, tk) * vtBand(up, -37.0, -21.0, 4.5 * mix(1.0, ek, tk) + bl) * ends);
    c = mix(c, white * 0.92 * mix(vec3(1.0), vec3(1.12, 0.99, 0.80), tk), vtBand(up, -86.0, -40.0, 5.0 * mix(1.0, ek, tk) + bl) * ends);
    // at the instrument's own height (upr): a soft box beside the camera, a hair left of it (the near-white band
    // down the middle of every casing; on the level tubes only a pale line; dimmer still for the nickel, whose
    // flat faces would otherwise all turn white), a second, paler one to the right (the casings' second bright
    // zone) and the gap between them
    float saz = degrees(atan(s.x, s.z)), sel = degrees(asin(clamp(s.y, -1.0, 1.0))), sb = min(bl, 2.5);   // (little softening with distance: a casing a few pixels wide keeps its white stripe)
    float nk = step(vtFrontK, 0.99);                                               // nickel and silver
    c = mix(c, white * mix(2.8 * vtFrontK, 1.7, tk), upr * vtStrip(saz, -5.0 - 15.0 * nk, 14.0, 4.5 + 8.0 * nk + sb) * vtBand(sel, -12.0 - 6.0 * nk, 8.0 + 6.0 * nk, 4.0 + 5.0 * nk + sb));
    c = mix(c, vec3(0.30, 0.285, 0.27), 0.85 * nk * vtLobe(n, 7.0, 1.0, 10.0));   // (nickel only) the camera's own dark corner: a flat polished face turned to the camera is never a blank white disc
    c *= 1.0 - mix(0.22, 0.62, tk) * upr * vtStrip(saz, 22.0, 6.0, 4.5 + sb) * vtBand(sel, -34.0, 26.0, 6.0 + sb);
    c = mix(c, white * 0.90, upr * vtStrip(saz, 60.0, 24.0, 6.0 + sb) * vtBand(sel, -40.0, 30.0, 7.0 + sb));
    return c;
  }`;function dp(){let i=new ji;return i.add(new Et(new Pr(60,64,32),new Ot({side:tl,depthWrite:!1,vertexShader:"varying vec3 d; void main(){ d = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"varying vec3 d;"+Qc+" void main(){ gl_FragColor = vec4(vtStudio(d, d, 0.0, 1.0), 1.0); }"}))),i}var pp=`
  uniform highp sampler2D vtCaps;
  uniform vec3 vtTint[3];
  uniform float vtAo, vtCool, vtPix, vtUpright, vtDeep, vtBlob, vtWave, vtEdge, vtTube, vtFront;
  uniform vec3 vtBell;
  uniform vec2 vtSkip;
  uniform mat3 vtRot;
  ${Qc}
  #if VT_TRACE == 1
  // ray against a tube from pa along the unit axis ax for len, radius ra; round ends, or flat ones (flt).
  // Worked in the plane across the axis, which keeps the numbers small enough for 32-bit floats near a graze.
  // pen = how deep the ray cuts into the tube (0 = a graze, 1 = through the axis)
  float vtHit(vec3 ro, vec3 rd, vec3 pa, vec3 ax, float len, float ra, bool flt, out float pen){
    pen = 1.0;
    vec3 oa = ro - pa;
    float rdA = dot(rd, ax), oaA = dot(oa, ax);
    vec3 rdP = rd - ax * rdA, oaP = oa - ax * oaA;
    float a = dot(rdP, rdP), b = dot(rdP, oaP), c = dot(oaP, oaP) - ra * ra;
    float h = b * b - a * c;
    if (h < 0.0 || a < 1e-7) return -1.0;
    h = sqrt(h);
    float t = (-b - h) / a;
    float y = oaA + t * rdA;
    if (y > 0.0 && y < len){ pen = 1.0 - sqrt(max(ra * ra - h * h / a, 0.0)) / ra; return t; }
    if (flt) {
      float tc = ((y < 0.0 ? 0.0 : len) - oaA) / rdA;
      return abs(b + a * tc) < h ? tc : -1.0;
    }
    vec3 oc = y <= 0.0 ? oa : oa - ax * len;
    float b2 = dot(rd, oc), h2 = b2 * b2 - dot(oc, oc) + ra * ra;
    return h2 > 0.0 ? -b2 - sqrt(h2) : -1.0;
  }
  vec3 vtNormalAt(vec3 p, vec3 pa, vec3 ax, float len, float ra, bool flt){
    vec3 q = p - pa;
    float h = dot(q, ax);
    if (!flt) h = clamp(h, 0.0, len);
    vec3 rad = q - h * ax;
    if (flt && dot(rad, rad) < ra * ra * 0.985) return ax * sign(h - 0.5 * len);
    return normalize(rad);
  }
  #endif
  float vtUpr = 1.0;
  vec3 vtRoom(vec3 d, vec3 s, float bl){                                                  // nickel and silver see the room with less of its warmth and more contrast: plain mirrors, near-black to white
    vec3 e = vtStudio(d, s, bl, vtUpr);
    if (vtCool > 0.0){ e = mix(e, vec3(dot(e, vec3(0.3, 0.59, 0.11))), vtCool); e = 0.75 * pow(e / 0.75, vec3(2.0)) + 0.05; }
    return e;
  }
  const vec3 vtMid = vec3(35.0, -35.0, 0.0);                                      // the middle of the set. The set is a room, not the sky:
  const float vtFar = 700.0;                                                      // what a tube sees shifts along its length
  #if VT_TRACE == 1
  // follow one mirror ray: up to two bounces off the tubes, then the room. bl = softening for the room lookup,
  // px = the size of one pixel out here (mm)
  vec3 vtTrace(vec3 ro, vec3 rd, float bl, float px, float fan, out bool any){
    vec3 thr = vec3(1.0), acc = vec3(0.0); float wgt = 1.0, top = 1e3;
    any = false;
    for (int bounce = 0; bounce < 2; bounce++){
      float tMin = 1e9, pen = 1.0, pn; int hit = -1;
      for (int i = 0; i < VT_N; i++){
        if (float(i) >= vtSkip.x && float(i) < vtSkip.y) continue;
        vec4 A = texelFetch(vtCaps, ivec2(i, 0), 0), B = texelFetch(vtCaps, ivec2(i, 1), 0);
        float t = vtHit(ro, rd, A.xyz, B.xyz, abs(B.w), A.w, B.w < 0.0, pn);
        if (t > 0.02 && t < tMin){ tMin = t; hit = i; pen = pn; }
      }
      if (hit < 0) break;
      any = true;
      vec4 A = texelFetch(vtCaps, ivec2(hit, 0), 0), B = texelFetch(vtCaps, ivec2(hit, 1), 0);
      // a ray that only grazes a tube is shared between the tube and what lies past it: the outline of every
      // mirrored tube is a soft step about a pixel wide (sized from how far one pixel's ray fans out by the time
      // it gets there), not a hard one; a mirrored tube thinner than a pixel fades out
      float thin = (px + tMin * fan) / A.w;                                       // 1 / (how many pixels wide this tube is in the mirror); fan = how fast neighbouring pixels' rays part
      float cov = smoothstep(0.0, max(clamp(thin, 0.06, 1.6), vtBlob), pen) ;
      if (cov < 0.999) acc += wgt * (1.0 - cov) * thr * min(vtRoom(vtRot * (rd * vtFar + ro - vtMid), vtRot * rd, bl + 4.0), vec3(top));
      top = min(top, mix(1.7, 0.64, smoothstep(0.004, 0.03, thin)));               // a light seen in a mirrored tube is a hairline: hold it down, or it breaks into dots (and brass seen in brass reads as the deep orange of the photos)
      if (vtBlob > 0.0) top = min(top, 1.25);                                     // in the bell a mirrored tube is gold to amber: never white, never near-black
      wgt *= cov;
      if (vtBlob > 0.0) return acc + wgt * mix(vec3(1.0), vtTint[0], 0.4) * 0.92;                        // in the bell: a smooth golden shape, as in the photos (the detail inside it only ever looked like damage)
      vec3 p = ro + rd * tMin, n = vtNormalAt(p, A.xyz, B.xyz, abs(B.w), A.w, B.w < 0.0);
      thr *= vtTint[int(texelFetch(vtCaps, ivec2(hit, 2), 0).x + 0.5)] * vtDeep;
      if (bounce == 1) return acc + wgt * thr * vec3(0.42, 0.35, 0.28) * (1.0 + 0.9 * step(0.05, vtBlob));           // caught between two tubes: the bounces after this are not followed; what comes back is dim
      ro = p + n * 0.4; rd = reflect(rd, n); bl = max(bl * 1.6 + 1.0, min(VT_SOFT * thin, 60.0));   // a tube a few pixels wide holds the whole room: soften to match
    }
    return acc + wgt * thr * min(vtRoom(vtRot * (rd * vtFar + ro - vtMid), vtRot * rd, bl), vec3(top));
  }
  #endif
  bool vtHave = false; vec3 vtCache = vec3(0.0);
  vec3 vtRadiance(vec3 rd, vec3 viewNormal){
    if (vtHave) return vtCache;
    vec3 nW = inverseTransformDirection(viewNormal, viewMatrix);
    vec3 ro = cameraPosition + (vec4(-vViewPosition, 0.0) * viewMatrix).xyz + nW * 1.3;
    float lift = dot(rd, nW);                                                     // along a tube's outline the smoothed normal can lean away from the eye:
    if (lift < 0.03) rd = normalize(rd + nW * (0.03 - lift));                     // never let the mirror ray dive back into its own tube
    vtUpr = vtUpright < 0.0 ? 1.0 - smoothstep(205.0, 255.0, ro.x) : vtUpright;
    vtEdgeK = vtEdge; vtTubeK = vtTube; vtFrontK = vtFront; vtBellW = step(0.05, vtBlob);
    if (vtWave > 0.0){
      vec3 w = ro * 0.11;
      rd = normalize(rd + vtWave * vec3(sin(w.y * 1.3 + w.z * 0.7 + 1.0) + sin(w.x * 0.9 - w.y * 0.5), sin(w.x * 1.1 + w.z * 1.7 + 2.0) + sin(w.y * 0.6 + w.x * 0.4 + 0.5), sin(w.z * 1.2 + w.y * 0.8 + 4.0) + sin(w.x * 0.7 - w.z * 0.9)));
    }
    vec3 look = vtRot * (rd * vtFar + ro - vtMid);
    float bl = clamp(degrees(length(fwidth(normalize(look)))) * 0.7, 0.0, 12.0);  // how much of the room one pixel covers in this mirror
    #ifdef VT_INSIDE
    // inside the flare the studio is mirrored once, softly (the hollow blurs it), then dimmed and reddened toward
    // the throat by the shading baked into the vertex colours: deep in there brass sees only more brass, and the
    // throat is a dark hole
    // (now: a ray that leaves through the mouth shows the room, crisp; one that does not meets the wall opposite,
    // brass seen in brass, darker the deeper in)
    float qx = (vtBell.x - ro.x) / max(rd.x, 1e-3);
    float qr = rd.x > 1e-3 ? length(ro.yz + rd.yz * qx - vec2(0.0, vtBell.y)) / vtBell.z : 4.0;
    float outW = 1.0 - smoothstep(0.45, 1.1, qr);                                 // no border: the far wall comes in gradually
    float deepK = smoothstep(0.25, 0.95, vColor.r);
    vec3 wall = vtTint[0] * vec3(0.66, 0.52, 0.37) * mix(0.4, 1.0, deepK);
    vtCache = vColor * mix(vtTint[0] * vtTint[0] * 1.5, vec3(1.0), deepK) * max(mix(wall, min(vtRoom(look, vtRot * rd, max(bl, 4.0)), vec3(5.0)), outW), vec3(1.45, 1.40, 1.30) * smoothstep(0.84, 0.995, vColor.r));   // (and the last stretch before the rim always catches the tent: a bright zone all the way round)
    #elif VT_TRACE == 1
    float px = length(vViewPosition) * vtPix;
    bool any;
    vtCache = vtTrace(ro, rd, bl, px, clamp(length(fwidth(rd)), 0.0, 0.5), any);
    if (vtBlob > 0.0 && any) vtCache = max(vtCache, vec3(0.34, 0.24, 0.13));
    #else
    vtCache = vtRoom(look, vtRot * rd, bl);
    #endif
    vtHave = true;
    return vtCache;
  }`;function mp(){let i={};i.brass=new vn({color:fl,metalness:1,roughness:.03,clearcoat:1,clearcoatRoughness:.02,vertexColors:!0}),i.brassV=i.brass.clone(),i.brassBell=i.brass.clone(),i.brassIn=new vn({color:fl,metalness:1,roughness:.05,clearcoat:1,clearcoatRoughness:.03,vertexColors:!0}),i.nickel=new vn({color:$c,metalness:1,roughness:.04,vertexColors:!0}),i.satin=new vn({color:14474717,metalness:1,roughness:.27,vertexColors:!0}),i.knurl=new vn({color:15330025,metalness:1,roughness:.24,vertexColors:!0}),i.knurl.defines.USE_UV="",i.knurl.customProgramCacheKey=()=>"vt-knurl",i.knurl.onBeforeCompile=y=>{y.fragmentShader=y.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
      { float kt = vUv.x, kw = fwidth(kt);
        float ridge = smoothstep(0.05, 0.55, abs(fract(kt) - 0.5) * 2.0);
        diffuseColor.rgb *= mix(0.46, 1.0, mix(ridge, 0.6, smoothstep(0.3, 1.1, kw))); }`)},i.silver=new vn({color:15987697,metalness:1,roughness:.03,vertexColors:!0}),i.felt=new Xn({color:1315860,metalness:0,roughness:1,vertexColors:!0}),i.cork=new Xn({color:12947298,metalness:0,roughness:.9,vertexColors:!0}),i.rubber=new Xn({color:1776411,metalness:0,roughness:.55,vertexColors:!0}),i.steel=new Xn({color:12763322,metalness:1,roughness:.25,vertexColors:!0}),i.dark=new hi({color:788742}),i.vent=new hi({color:3021838});let e=()=>new vn({color:15196888,metalness:0,roughness:.22,clearcoat:1,clearcoatRoughness:.08,iridescence:.55,iridescenceIOR:1.5,sheen:.4,sheenColor:13623551,vertexColors:!0});i.pearl1=e(),i.pearl2=e(),i.pearl3=e();let t=new En;t.name="trumpet";let n={},r=(y,b)=>{if(n[y])return n[y];let w=new En;return w.name=y,(b?r(b).obj:t).add(w),n[y]={obj:w,bins:new Map}},s=(y,b,w)=>{let R=r(y);return R.bins.has(b)||R.bins.set(b,[]),R.bins.get(b).push(w),w},a=[],o=[],l=(y,b,w,R={})=>o.push({a:y.clone(),b:b.clone(),r:w,kind:R.kind||0,flat:!!R.flat,mov:R.mov||null}),c=(y,b,w,R)=>{let C=[0];for(let k=1;k<y.length;k++)C[k]=C[k-1]+y[k].distanceTo(y[k-1]);let B=C[y.length-1],U=k=>{let j=1;for(;j<y.length-1&&C[j]<k;)j++;return y[j-1].clone().lerp(y[j],pt((k-C[j-1])/(C[j]-C[j-1]||1),0,1))};for(let k=0;k<w;k++)l(U(B*k/w),U(B*(k+1)/w),typeof b=="function"?b((k+.5)/w):b,R)},h=(y,b,w,R,C={})=>{let B=s(y,b,Cn(pl(w,3),R,C));if(!C.noAO)for(let U=1;U<w.length;U++)a.push({a:w[U-1],b:w[U],r:typeof R=="number"?R:Array.isArray(R)?R[U]:6,id:C.id||y});return B},u=(y,b,w,R,C,B,U={})=>{let k=[[0,B-.9],[0,B-.12],[.12,B],[C-.12,B],[C,B-.12],[C,B-.9]];s(y,b,qe(tt(k,{segs:U.segs||36,crease:30}),w,R))},d=(y,b=2.5)=>{let w=[y[0]];for(let R=1;R<y.length;R++){let C=y[R-1],B=y[R],U=Math.ceil(Math.hypot(B[0]-C[0],B[1]-C[1])/b);for(let k=1;k<=U;k++)w.push([C[0]+(B[0]-C[0])*k/U,C[1]+(B[1]-C[1])*k/U])}return w},m=(y,b,w,R,C,B=1.4,U=.55)=>{let k=B*.7,j=U*.32,ie=[[-k/2,C-.3],...At(0,C,1,180,0,8).map(J=>[J[0]*k/2,C+(J[1]-C)*j]),[k/2,C-.3]];s(y,b,qe(tt(ie,{segs:36}),w,R))},{zL:p,zB:_,z1:f,V:g}=pe;{let y=[];y.push([19.5,1.83],[15.5,1.9],[12.5,2.6],[10,3.9],[7.6,5.5],[5.2,6.9],[3,7.8],[1.6,8.2]),y.push(...At(1.9,10.4,2.2,270,180,8).map(b=>[b[0]-.3+.3,b[1]])),y.push(...At(2.1,10.5,2.1,180,90,8)),y.push([8,12.6],...At(8,11.5,1.1,90,0,6)),y.push([9.3,11.1],[10,11.1],[10.3,10.9]),y.push([11.4,10.75],[12.6,10.4],[13.9,9.85],[15.2,9.15],[16.6,8.35],[18,7.55],[19.4,6.85],[20.8,6.3],[22,5.95],[22.6,5.85]),y.push([22.9,5.95],[23.7,5.95],[24,4.5],[28.2,4.5],[28.5,5.2],[29.3,5.2],[29.6,4.75]),y.push(...At(32,4.6,1.9,180,0,10).map(b=>[b[0],4.6+(b[1]-4.6)*.75])),y.push([34.4,4.75],[34.7,5.2],[35.5,5.2],[35.8,4.5],[39.4,4.5],[40.3,5.8],[41,5.85],[66,5.35],[86,4.9],[86,4.2]);for(let b of y)b[0]=b[0]<=24?b[0]*.9:b[0]<=39.4?b[0]-2.4:b[0];s("mouthpiece",i.silver,qe(tt(y,{segs:72,crease:40}),F(pe.mouthRim,0,p),wt)),s("mouthpiece",i.dark,qe(tt([[17.45,0],[17.45,1.9]],{segs:16}),F(pe.mouthRim,0,p),wt)),a.push({a:F(pe.mouthRim+1,0,p),b:F(pe.mouthRim+9,0,p),r:13,id:"mouthpiece"},{a:F(pe.mouthRim+12,0,p),b:F(pe.mouthRim+20,0,p),r:9,id:"mouthpiece"}),l(F(pe.mouthRim+11.5,0,p),F(pe.mouthRim+12.5,0,p),11,{kind:1}),l(F(pe.mouthRim+30,0,p),F(pe.recvEnd+2,0,p),5.2,{kind:1})}{let y=pe.recvEnd,b=[[0,5.45],[0,6.2],...At(5.2,5.2,5.3,168,12,14).map(w=>[w[0],6.25+(w[1]-6.25)*.2]),[10.6,6.5],[10.9,6.95],[12.3,6.95],[12.6,6.4],[pe.recvFront-y-.5,6.4],[pe.recvFront-y,5.9],[pe.recvFront-y,5.4]];s("leadpipe",i.brass,qe(tt(b,{segs:56,crease:40}),F(y,0,p),wt)),s("leadpipe",i.dark,qe(tt([[3,0],[3,5.45]],{segs:24}),F(y,0,p),wt)),h("leadpipe",i.brass,[F(pe.recvFront-2,0,p),F(pe.leadFerrule+2,0,p)],(w,R)=>5.25+.95*w/R,{segs:40}),u("leadpipe",i.brass,F(pe.leadFerrule,0,p),wt,2.6,pe.outerR+.35),h("leadpipe",i.brass,[F(pe.leadFerrule+1,0,p),F(pe.slideFerrule+.3,0,p)],pe.outerR,{segs:40}),h("leadpipe",i.brass,[F(pe.slideFerrule+.3,pe.lowerY,p),F(37.5,pe.lowerY,p)],pe.outerR-.2,{segs:40}),u("leadpipe",i.brass,F(38.4,pe.lowerY,p),F(-1,0,0),2.4,pe.outerR+.1),h("leadpipe",i.brass,$t([F(38,pe.lowerY,p),F(g+2.6,pe.lowerY,p),F(g+2.6,pe.lowerY,0)],7.2),6.1,{segs:36}),l(F(y+6,0,p),F(pe.recvFront-5,0,p),6.4),l(F(pe.recvFront,0,p),F(-25,0,p),5.55),l(F(-25,0,p),F(pe.leadFerrule,0,p),6),l(F(pe.leadFerrule,0,p),F(pe.bowStart,0,p),6.8),l(F(pe.bowStart,pe.lowerY,p),F(40,pe.lowerY,p),6.6),c($t([F(40,pe.lowerY,p),F(g+2.6,pe.lowerY,p),F(g+2.6,pe.lowerY,4)],7.2),6.1,2)}{for(let b of[0,pe.lowerY])u("tuningSlide",i.brass,F(pe.slideFerrule,b,p),wt,pe.bowStart-pe.slideFerrule+.6,pe.outerR+.45,{segs:44}),m("tuningSlide",i.brass,F(pe.slideFerrule+1.2,b,p),wt,pe.outerR+.45,1.6,.5),m("tuningSlide",i.brass,F(pe.bowStart-.6,b,p),wt,pe.outerR+.45,1.6,.5);let y=$t([F(pe.bowStart-3,0,p),F(pe.bowFront,0,p),F(pe.bowFront,pe.lowerY,p),F(pe.bowStart-3,pe.lowerY,p)],pe.bowCorner,.06);h("tuningSlide",i.brass,y,pe.bowR,{segs:44}),c(y,pe.bowR,6)}let x=[-g,0,g];x.forEach((y,b)=>{let w="casing"+(b+1),R="valve"+(b+1),C=R+".moving",B=pe.casingR,U=B+.35,k=B-.5,j=F(y,0,0),ie=[[pe.casingBot,k],[-27.4,k],[-26.7,U-.05],...At(-25.9,U,.7,180,0,8).map(ce=>[ce[0],U+(ce[1]-U)*.4]),[pe.casingTop,U]];s(w,i.brassV,qe(tt(d(ie),{segs:72}),j)),a.push({a:F(y,pe.capBot,0),b:F(y,pe.capTop,0),r:B,id:w}),l(F(y,pe.casingBot,0),F(y,-26.5,0),k,{flat:!0}),l(F(y,-26.5,0),F(y,pe.casingTop,0),U,{flat:!0}),l(F(y,pe.casingTop,0),F(y,pe.casingTop+6.2,0),11.3,{flat:!0,kind:1}),l(F(y,pe.casingBot-8,0),F(y,pe.casingBot,0),10.2,{flat:!0,kind:1}),l(F(y,pe.buttonUnder-.9,0),F(y,pe.buttonUnder+3.6,0),8.1,{flat:!0,kind:1,mov:C});let J=pe.casingTop;s(w,i.nickel,qe(tt([[J-.2,U-.1],[J-.2,U+.3],[J+1.3,U+.3],[J+1.4,11.1]],{segs:64}),j)),s(w,i.knurl,qe(Dr(J+1.4,J+4.6,11.5,90),j)),s(w,i.nickel,qe(tt([...At(J+4.6,9.4,2.1,90,14,10),[J+6.6,8.8]],{segs:72,crease:50}),j)),s(w,i.felt,qe(tt([[J+6.45,8.9],[J+6.8,8.9],[J+6.9,8.75],[J+6.9,3],[J+5.2,3],[J+5.2,0]],{segs:64,crease:50}),j));let fe=pe.casingBot;s(w,i.nickel,qe(tt([[fe-3.4,9.9],[fe-3.3,k+.3],[fe+.2,k+.3],[fe+.2,k]],{segs:64}),j)),s(w,i.knurl,qe(Dr(fe-7,fe-3.4,10.3,86),j)),s(w,i.nickel,qe(tt([[fe-7.6,1.35],[fe-8.3,1.6],...[2.6,3.6,4.6,5.6,6.6,7.6,8.6,9.2].map(ce=>[fe-7.7-.6*(1-((ce-1.6)/7.75)**2),ce]),...At(fe-7,9.6,.7,168,90,6)],{segs:64,crease:50}),j)),s(w,i.vent,qe(tt([[fe-7.6,0],[fe-7.6,1.45]],{segs:24}),j)),r(R),r(C,R);let Q=pe.buttonUnder,q=Q-.9;s(C,i.satin,qe(tt([[-14,2.5],[Q+.3,2.5]],{segs:28}),j)),s(C,i.nickel,qe(tt([[q,2.4],[q,6.5],...At(q+.9,7.25,.9,180,90,6)],{segs:56,crease:50}),j)),s(C,i.knurl,qe(Dr(q+.9,Q+2.6,8.15,80),j)),s(C,i.nickel,qe(tt([...At(Q+2.6,7.15,1,90,0,8),[Q+3.6,6.62],[Q+3.45,6.58]],{segs:64,crease:60}),j));let ee=[];for(let ce=0;ce<=8;ce++){let ne=6.6*(1-ce/8);ee.push([Q+3.5+1*(1-(ne/6.6)**2),ne])}s(C,i["pearl"+(b+1)],qe(tt(ee,{segs:48}),j)),a.push({a:F(y,Q,0),b:F(y,Q+3.5,0),r:8,id:C})});{let y=(w,R)=>{s("casing2",i.brassV,qe(tt([[0,3.85],[9.6,3.85],[10.4,4.1],[11.3,4.38],[12.2,4.45],[13.1,4.38],[14,4.1],[14.8,3.85],[g,3.85]],{segs:36}),F(w,R,0),wt)),l(F(w+7,R,0),F(w+g-7,R,0),4.2)};y(-g,-34.5),y(-g,-91),y(0,-34.5),y(0,-91);let b=(w,R)=>{h("casing2",i.brassV,[F(w+5,R,-2.2),F(w+g-5,R,-2.2)],4.3,{segs:32}),m("casing2",i.brassV,F(w+g/2-.35,R,-2.2),wt,4.3,2.2,.6),l(F(w+7,R,-2.2),F(w+g-7,R,-2.2),4.4)};b(-g,-64),b(0,-72)}let v=[[0,61.5],[4,57.2],[10,50.6],[17.7,43.9],[23.7,37.7],[29.6,32.6],[35.6,28.4],[41.6,25.3],[53.6,20.8],[65.5,17.8],[83.4,14.9],[101,13],[119,11.4],[150,10.2],[190,9.3],[273,8.3],[334,7.6],[445.4,7]],M=(()=>{let y=v.length,b=v.map(Q=>Q[0]),w=v.map(Q=>Math.log(Q[1])),R=[],C=[],B=[];for(let Q=0;Q<y-1;Q++)R[Q]=b[Q+1]-b[Q],C[Q]=(w[Q+1]-w[Q])/R[Q];B[0]=C[0],B[y-1]=C[y-2];for(let Q=1;Q<y-1;Q++)B[Q]=C[Q-1]*C[Q]<=0?0:3*(R[Q-1]+R[Q])/((2*R[Q]+R[Q-1])/C[Q-1]+(R[Q]+2*R[Q-1])/C[Q]);let U=Q=>{if(Q<=0)return w[0];if(Q>=b[y-1])return w[y-1];let q=0;for(;Q>b[q+1];)q++;let ee=(Q-b[q])/R[q],ce=ee*ee,ne=ce*ee;return(2*ne-3*ce+1)*w[q]+(ne-2*ce+ee)*R[q]*B[q]+(-2*ne+3*ce)*w[q+1]+(ne-ce)*R[q]*B[q+1]},k=[[8,1],[14,.95],[20,.865],[26.3,.875],[34.5,.891],[42.8,.915],[51,.939],[59.3,.966],[67.6,1]],j=Q=>{if(Q<=k[0][0]||Q>=k[k.length-1][0])return 1;let q=0;for(;Q>k[q+1][0];)q++;return k[q][1]+(k[q+1][1]-k[q][1])*(Q-k[q][0])/(k[q+1][0]-k[q][0])},ie=446,J=new Float64Array(ie+1);for(let Q=0;Q<=ie;Q++)J[Q]=U(Q)+Math.log(j(Q));for(let Q=0;Q<2;Q++){let q=J.slice(),ee=ce=>ce<0?2*q[0]-q[-ce]:ce>ie?2*q[ie]-q[2*ie-ce]:q[ce];for(let ce=1;ce<ie;ce++){let ne=pt(2+ce*.06,2,10),ae=Math.ceil(ne*2.5),E=0,A=0;for(let G=-ae;G<=ae;G++){let H=Math.exp(-G*G/(2*ne*ne));E+=ee(ce+G)*H,A+=H}J[ce]=E/A}}let fe=Q=>J[pt(Q,0,ie)];return Q=>{if(Q<=0)return v[0][1];if(Q>=ie)return Math.exp(J[ie]);let q=Math.floor(Q),ee=Q-q,ce=fe(q-1),ne=fe(q),ae=fe(q+1),E=fe(q+2);return Math.exp(ne+.5*ee*(ae-ce+ee*(2*ce-5*ne+4*ae-E+ee*(3*(ne-ae)+E-ce))))}})();if(typeof location<"u"&&/vtdebug/.test(location.search)){let y=0,b=0;for(let[w,R]of v){let C=Math.abs(M(w)-R);C>y&&(y=C,b=w)}console.log("bell smoothing: largest change "+y.toFixed(3)+" mm at d="+b)}{let y=pe.bell,b=y.bowCx-y.bowR,R=[...Gs([F(-28,y.lowY,_+13),F(-32,y.lowY,_+12.4),F(-36,y.lowY,_+10.4),F(-40.5,y.lowY,_+6.5),F(-45,y.lowY,_+2.6),F(-49,y.lowY,_+.6),F(-53,y.lowY,_)],40),...$t([F(-53,y.lowY,_),F(b,y.lowY,_),F(b,0,_),F(y.bowCx+6,0,_)],[y.bowR,y.bowR],.045).slice(1)];u("bellTube",i.brass,F(-36.2,y.lowY,_+10.25),F(4,0,1.7),4.2,6.3,{segs:40});let C=pl(R,3),B=[];for(let ne of C)if(ne.x<y.bowCx-.001){let ae=Math.atan2(-(ne.x-y.bowCx),-(ne.y+y.bowR))/Math.PI;B.push(6.1+1*kt(0,1,ae))}else B.push(ne.y<-1?6.1-.35*kt(-47,-30,ne.x):M(y.rimX-ne.x));let U=C.length-1;for(let ne=y.bowCx+6;ne<y.rimX;){let ae=y.rimX-ne,E=pt(ae*.05,.22,5);ne=Math.min(y.rimX,ne+E),C.push(F(ne,0,_)),B.push(M(y.rimX-ne))}let k=Cn(C,B,{segs:112,up:Qi});s("bellTube",i.brass,Jc(k,0,U)),s("bell",i.brassBell,Jc(k,U,C.length-1)),k.dispose();for(let ne=4;ne<C.length;ne+=4)a.push({a:C[ne-4],b:C[ne],r:(B[ne-4]+B[ne])/2,id:"bell"});c(C.slice(0,U+1),6.5,7);let j=[y.bowCx+6,-40,50,115,160,190,212,230,245,257,267,275];o.skipBell=[o.length,o.length+j.length-1];for(let ne=1;ne<j.length;ne++)l(F(j[ne-1],0,_),F(j[ne],0,_),M(y.rimX-(j[ne-1]+j[ne])/2));let ie=[],J=[];for(let ne=C.length-1;ne>=0&&C[ne].x>40;ne--)ie.unshift(C[ne]),J.unshift(B[ne]-.45);let fe=Cn(ie,J,{segs:112,up:Qi,inside:!0}),Q=new Float32Array(fe.attributes.position.count*3),q=fe.attributes.position;for(let ne=0;ne<q.count;ne++){let ae=Math.hypot(q.getY(ne),q.getZ(ne)-_),E=(.02+.26*kt(7.5,25,ae)+.32*kt(22,47,ae)+.4*kt(44,61,ae))**.6;Q[ne*3]=E,Q[ne*3+1]=E*(.88+.12*E*E),Q[ne*3+2]=E*(.66+.34*E*E)}fe.setAttribute("color",new vt(Q,3)),fe.userData.keepColor=!0,s("bell",i.brassIn,fe);let ee=new Tr(J[0]+.3,32);ee.rotateY(Math.PI/2),ee.translate(ie[0].x+.2,0,_),s("bell",i.dark,ee);let ce=new qi(y.rimR-.7,2.3,20,128);ce.rotateY(Math.PI/2),ce.translate(y.rimX-1.7,0,_),s("bell",i.brassBell,ce),u("bellTube",i.brass,F(-64,y.lowY,_),wt,11,6.75,{segs:40}),m("bellTube",i.brass,F(-62.6,y.lowY,_),wt,6.75,1.5,.5),m("bellTube",i.brass,F(-54.4,y.lowY,_),wt,6.75,1.5,.5)}{let y=pe.s3;r("slide3"),r("slide3.moving","slide3");for(let U of[y.yU,y.yL])h("slide3",i.brass,[F(g+4,U,0),F(y.x0,U,0)],6,{segs:36}),m("slide3",i.brass,F(g+11.6,U,0),wt,6.05,1.5,.5),h("slide3",i.nickel,[F(y.x0-1,U,0),F(y.x0+62,U,0)],5.7,{segs:32,noAO:!0}),h("slide3.moving",i.brass,[F(y.x0,U,0),F(y.x1-2.6,U,0)],6.3,{segs:40,capA:!0}),m("slide3.moving",i.brass,F(y.x0+.9,U,0),wt,6.4,1.8,.75),u("slide3.moving",i.brass,F(y.x1-3.2,U,0),wt,4.2,6.6,{segs:40});let b=(y.yU-y.yL)/2;h("slide3.moving",i.brass,$t([F(y.x1-1,y.yU,0),F(y.x1+b,y.yU,0),F(y.x1+b,y.yL,0),F(y.x1-1,y.yL,0)],b,.07),6.1,{segs:40});for(let U of[y.yU,y.yL])l(F(g+6,U,0),F(y.x0,U,0),6),l(F(y.x0,U,0),F(y.x1,U,0),6.3,{mov:"slide3.moving"});c($t([F(y.x1,y.yU,0),F(y.x1+b,y.yU,0),F(y.x1+b,y.yL,0),F(y.x1,y.yL,0)],b,.07),6.1,4,{mov:"slide3.moving"});let w=y.yU+6.6,R=[[-3.2,10.3],...At(-2.7,11.4,.5,180,90,4),...At(2.7,11.4,.5,90,0,4),[3.2,10.3],...At(2.7,10.3,.5,0,-90,4),...At(-2.7,10.3,.5,-90,-180,4)];s("slide3.moving",i.nickel,qe(tt(R,{segs:72,crease:60}),F(73.3,w+3.3+11.8,0),fi));let C=ml(52,2.3,5.4,.7);C.translate(73.3+2+26,w+2.5,0),s("slide3.moving",i.nickel,C);let B=ml(9.4,9.2,9.2,1.1);B.translate(109,w+3.6,0),s("slide3.moving",i.brass,B),s("slide3.moving",i.nickel,qe(tt([[0,1.3],[3.2,1.3],[3.2,3]],{segs:20}),F(109,w+8.1,0))),s("slide3.moving",i.knurl,qe(Dr(3.2,5.2,3.3,22),F(109,w+8.1,0))),s("slide3.moving",i.nickel,qe(tt([[5.2,3.3],[5.5,2.9],[5.5,0]],{segs:24}),F(109,w+8.1,0))),s("slide3.moving",i.rubber,qe(tt([[0,2.2],[0,3.1],[4.5,3.1],...At(4.5,0,3.1,90,0,6)],{segs:24}),F(126.5,w+2.5,0),wt)),s("slide3",i.nickel,qe(tt([[0,0],[0,3.1],[.6,3.4]],{segs:24}),F(96.7,y.yL-6.2-4.4,3.5))),s("slide3",i.knurl,qe(Dr(.6,3.6,3.45,22),F(96.7,y.yL-6.2-4.4,3.5))),s("slide3",i.nickel,qe(tt([[3.6,3.4],[4.4,1.6],[4.4,1.3],[6.4,1.3]],{segs:24}),F(96.7,y.yL-6.2-4.4,3.5)))}{let y=pe.s1;r("slide1"),r("slide1.moving","slide1");for(let k of[y.yU,y.yL]){let j=k===y.yU?-g-7.3:-g-2.1;h("slide1",i.brass,$t([F(j,k,2),F(j,k,f),F(y.x0-1.5,k,f)],6.6),6,{segs:36}),h("slide1",i.nickel,[F(y.x0-.5,k,f),F(y.x0-40,k,f)],5.7,{segs:32,noAO:!0}),h("slide1.moving",i.brass,[F(y.x1+2.6,k,f),F(y.x0,k,f)],6.3,{segs:40}),m("slide1.moving",i.brass,F(y.x0-.35,k,f),wt,6.4,1.8,.75),u("slide1.moving",i.brass,F(y.x1+3.2,k,f),F(-1,0,0),4.2,6.6,{segs:40})}let b=(y.yU-y.yL)/2;h("slide1.moving",i.brass,$t([F(y.x1+1,y.yU,f),F(y.x1-b,y.yU,f),F(y.x1-b,y.yL,f),F(y.x1+1,y.yL,f)],b,.07),6.1,{segs:40});for(let k of[y.yU,y.yL]){let j=k===y.yU?-g-7.3:-g-2.1;c($t([F(j,k,5),F(j,k,f),F(y.x0,k,f)],6.6),6,2),l(F(y.x0,k,f),F(y.x1,k,f),6.3,{mov:"slide1.moving"})}c($t([F(y.x1,y.yU,f),F(y.x1-b,y.yU,f),F(y.x1-b,y.yL,f),F(y.x1,y.yL,f)],b,.07),6.1,4,{mov:"slide1.moving"});let w=y.yU+6.6,R=-50.2,C=11,B=Gs([F(R-C-1.7,w+27.5,f),F(R-C-.9,w+25,f),F(R-C-.3,w+22,f),F(R-C,w+18,f),F(R-C,w+12,f),F(R-C*.9,w+7.2,f),F(R-C*.66,w+3.6,f),F(R-C*.34,w+1.75,f),F(R,w+1.2,f),F(R+C*.34,w+1.75,f),F(R+C*.66,w+3.6,f),F(R+C*.9,w+7.2,f),F(R+C,w+12,f),F(R+C,w+18,f),F(R+C+.3,w+22,f),F(R+C+.9,w+25,f),F(R+C+1.7,w+27.5,f)],80);s("hooks",i.nickel,Cn(B,1.15,{segs:20,up:fi,scaleN:3.1,scaleB:1,sq:5,capA:!0,capB:!0}));let U=ml(8,1.7,6.4,.5);U.translate(R,w+.05,f),s("hooks",i.nickel,U)}{let y=pe.s2,b=40*Math.PI/180,w=F(-Math.sin(b),0,Math.cos(b)),R=(J,fe)=>F(2.8+w.x*(J-8),fe,9.35+w.z*(J-8));for(let J of[y.yU,y.yL])h("slide2",i.brassV,[R(5,J),R(16,J)],6.4,{segs:36,capA:!0}),u("slide2",i.brassV,R(15.6,J),w,11.6,6.8,{segs:36}),m("slide2",i.brassV,R(21.2,J),w,6.8,1.2,.5);let C=(y.yU-y.yL)/2,B=(y.yU+y.yL)/2,U=R(26.5,y.yU),k=R(26.5,y.yL),j=R(28+C,0);h("slide2",i.brassV,$t([U,F(j.x,y.yU,j.z),F(j.x,y.yL,j.z),k],C,.07),pe.bowR,{segs:40}),l(R(9,y.yU),U,6.7),l(R(9,y.yL),k,6.7),c($t([U,F(j.x,y.yU,j.z),F(j.x,y.yL,j.z),k],C,.07),pe.bowR,4);let ie=F(Math.cos(b),0,Math.sin(b));s("slide2",i.brassV,qe(tt([[0,1.7],[3.6,1.7],...At(5.2,0,2.6,125,0,8)],{segs:20}),F(j.x,B,j.z).addScaledVector(ie,pe.bowR-.8),ie))}{let y=(b,w,R)=>{let C=M(pe.bell.rimX-w),B=p-2,U=_+2,k=B-U,j=J=>1.5*(1-kt(0,5,J));s("braces",i.brass,Cn(pl([F(b,0,B),F(w,0,U)],.6),J=>3.1+j(J-(R-2))+j(k-J-(C-2)),{segs:28,up:Qi}));let ie=(J,fe,Q,q,ee,ce=.66)=>{let A=[],G=[],H=[],D=[];for(let T=0;T<=16;T++){let N=T/16,X=Q+(q-Q)*N,le=ce*(1-Math.abs(2*N-1))+.02,Y=fe(X)+.9;for(let oe=0;oe<=8;oe++){let re=ee+le*(2*oe/8-1),ue=Math.cos(re),Me=Math.sin(re);A.push(X,Y*Me,J+Y*ue),G.push(0,Me,ue),H.push(N,oe/8)}}for(let T=0;T<16;T++)for(let N=0;N<8;N++){let X=T*9+N;D.push(X,X+9,X+1,X+1,X+9,X+9+1)}let z=new rt;z.setAttribute("position",new Re(A,3)),z.setAttribute("normal",new Re(G,3)),z.setAttribute("uv",new Re(H,2)),z.setIndex(D),s("braces",i.brass,z)};ie(p,()=>R,b-13,b+13,Math.PI,.95),ie(_,J=>M(pe.bell.rimX-J),w-13,w+13,0,.5)};y(-101,-101,5.45),y(150,150,pe.outerR)}{let b=Gs([F(71,6.699999999999999,p),F(62,6.699999999999999,p),F(53.5,7,p),F(48.4,9.3,p),F(45.6,14.7,p),F(45.2,20.7,p),F(47.2,25.4,p),F(51.6,28.1,p),F(57.5,28.9,p)],64);s("hooks",i.brass,Cn(b,(w,R)=>(1.5-.2*w/R)*(.6+.4*kt(7,17,w))*(.4+.6*Math.sqrt(kt(0,1.2,R-w)))+.02,{segs:18,up:fi,scaleN:2.3,scaleB:1,sq:4,capA:!0}))}{let y=(w,R,C,B,U,k,j)=>{let ie=F(B[0],B[1],0).normalize(),J=F(C[0],C[1],R);s(w,i.brass,qe(tt([[-3,3],[2.4,3],[2.4,2.2]],{segs:20}),J,ie)),s(w,i.cork,qe(tt([[2.4,0],[2.4,4],[4.4,4],[4.4,0]],{segs:24,crease:40}),J,ie)),s(w,i.nickel,qe(tt([[4,4.5],[4.6,4.7],...At(5,3.5,1.2,90,0,6),[6.2,0]],{segs:28}),J,ie));let fe=Gs(U.map(ae=>F(ae[0],ae[1],R)),60),Q=F(k[0],k[1],R),q=F(j[0],j[1],R),ee=0;for(let ae=1;ae<fe.length;ae++)fe[ae].distanceToSquared(Q)<fe[ee].distanceToSquared(Q)&&(ee=ae);let ce=ee/60;s(w,i.nickel,Cn(fe,(ae,E)=>(1.05+1.25*Math.exp(-(((ae/E-ce)/.1)**2)))*Math.sqrt(kt(0,1.5,ae)*kt(0,1.5,E-ae))+.02,{segs:16,up:fi,scaleN:2.5,scaleB:1,sq:3.5})),s(w,i.nickel,Cn(fe.slice(Math.min(fe.length-8,ee+5)),(ae,E)=>.85*Math.sqrt(kt(0,3,ae)*kt(0,2.2,E-ae))+.02,{segs:16,up:fi,scaleN:5,scaleB:1,sq:2.5}));for(let ae of[-3.6,3.6])s(w,i.brass,Cn([q.clone().setZ(R+ae),Q.clone().lerp(q,-.18).setZ(R+ae)],1.5,{segs:12,capB:!0}));s(w,i.nickel,qe(tt([[-5.3,0],[-5.3,1.7],[-5,2],[-4.7,2],[-4.7,1],[4.7,1],[4.7,2],[5,2],[5.3,1.7],[5.3,0]],{segs:20,crease:40}),Q,fi));let ne=new qi(1.9,.34,6,18);for(let ae=-2.1;ae<=2.11;ae+=.7){let E=ne.clone();E.translate(Q.x,Q.y,R+ae),s(w,i.steel,E)}ne.dispose()};y("waterKeys",p,[184.2,-70.8],[.418,-.908],[[185,-75.6],[190.4,-76.6],[196.6,-70.6],[202.4,-61],[207.6,-50],[210.6,-41],[211.9,-34.6]],[201.6,-62.2],[197.6,-59]),r("slide3.moving"),y("slide3.moving",0,[155.7,-77.9],[.5,-.866],[[156.6,-82.6],[162.2,-83.4],[167.6,-77.5],[170.6,-68.5],[171.2,-59],[170.2,-51.5],[168.8,-47]],[170.4,-68],[165.2,-66.6])}let L=(y,b)=>{if(y.userData.keepColor)return;let w=y.attributes.position,R=y.attributes.normal,C=new Float32Array(w.count*3),B=F(),U=F(),k=F(),j=F(),ie=F();y.computeBoundingBox();let J=y.boundingBox,fe=new jt,Q=a.filter(q=>q.id===b?!1:(fe.makeEmpty().expandByPoint(q.a).expandByPoint(q.b).expandByScalar(q.r*3.2+6),fe.intersectsBox(J)));for(let q=0;q<w.count;q++){j.fromBufferAttribute(w,q),ie.fromBufferAttribute(R,q);let ee=0;for(let ne of Q){B.subVectors(ne.b,ne.a),U.subVectors(j,ne.a);let ae=pt(U.dot(B)/(B.lengthSq()||1),0,1);k.copy(ne.a).addScaledVector(B,ae).sub(j);let E=k.length();if(E>ne.r*3.2+6)continue;let A=k.dot(ie)/(E||1),G=Math.max(E-ne.r,.4);ee+=Math.max(0,A*.75+.25)*pt(ne.r/(ne.r+G*1.6),0,1)**2*(A>-.2?1:0)}let ce=1-.7*pt(ee,0,1.25)/1.25;C[q*3]=ce,C[q*3+1]=ce*(.84+.16*ce),C[q*3+2]=ce*(.6+.4*ce)}y.setAttribute("color",new vt(C,3))},P=[];for(let[y,b]of Object.entries(n)){for(let[w,R]of b.bins){if(w!==i.dark)for(let B of R)L(B,y.startsWith("bell")?"bell":y);let C=new Et(up(R),w);C.name=y+":"+Object.keys(i).find(B=>i[B]===w),b.obj.add(C),P.push(C)}b.bins.clear()}let O=y=>n[y].obj;for(let y=1;y<=3;y++)O("valve"+y).userData.moving=O("valve"+y+".moving"),O("valve"+y).moving=O("valve"+y+".moving");for(let y of["slide1","slide3"])O(y).userData.moving=O(y+".moving"),O(y).moving=O(y+".moving");return{root:t,M:i,obj:O,meshes:P,valveX:x,capsules:a,refl:o}}var jn=F(),Yn=F(),$i=F();function fp(i,e,t,n){jn.subVectors(e,i),Yn.subVectors(n,t),$i.subVectors(i,t);let r=jn.dot(jn),s=Yn.dot(Yn),a=Yn.dot($i),o=jn.dot($i),l=jn.dot(Yn),c=0,h=0;if(r>1e-9&&s>1e-9){let p=r*s-l*l;c=p>1e-9?pt((l*a-o*s)/p,0,1):0,h=(l*c+a)/s,h<0?(h=0,c=pt(-o/r,0,1)):h>1&&(h=1,c=pt((l-o)/r,0,1))}else r>1e-9?c=pt(-o/r,0,1):s>1e-9&&(h=pt(a/s,0,1));let u=$i.x+jn.x*c-Yn.x*h,d=$i.y+jn.y*c-Yn.y*h,m=$i.z+jn.z*c-Yn.z*h;return u*u+d*d+m*m}var gp=[["Mouthpiece",[-235.5,12.6,pe.zL],null,null],["Mouthpiece receiver",[-158,6.4,pe.zL],null,null],["Leadpipe",[-88,5.5,pe.zL],null,null],["1st valve",[-pe.V,pe.buttonTop,0],"valve1.moving",null],["2nd valve",[0,pe.buttonTop,0],"valve2.moving",null],["3rd valve",[pe.V,pe.buttonTop,0],"valve3.moving",null],["Finger hook (pinky)",[47.5,26,pe.zL],null,null],["Bell",[268,20,pe.zB+15.4],null,null,"bell"],["3rd slide ring",[73.3,-23.8,3],"slide3.moving",null],["Valve casings",[pe.V,-92,9.5],null,null],["Valve caps",[-pe.V,-108.5,10.3],null,null],["1st slide thumb saddle",[-59.9,-35,pe.z1+2.5],"slide1.moving",null],["1st valve slide",[-96,-72,pe.z1+4],"slide1.moving",null],["2nd valve slide",[-17.5,-64.6,36.5],null,[-.5,0,.86]],["3rd valve slide",[92,-50.6,5.4],"slide3.moving",null],["Main tuning slide",[178,5.6,pe.zL+4],null,null],["Water key",[207,-51,pe.zL+2],null,null]],vp=`
.vt3d-root{position:relative;overflow:hidden;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.vt3d-canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;outline:none;cursor:grab;touch-action:none}
.vt3d-canvas.vt3d-drag{cursor:grabbing}
.vt3d-over{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:hidden}
.vt3d-over svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}
.vt3d-over line{stroke:#1f2937;stroke-width:1;stroke-opacity:.7;transition:opacity .16s}
.vt3d-over circle{fill:#1f2937;transition:opacity .16s}
.vt3d-tag{position:absolute;left:0;top:0;font:600 13px/1.15 system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1f2937;background:#fff;border:1px solid rgba(31,41,55,.28);border-radius:7px;padding:3px 7px 4px;white-space:nowrap;box-shadow:0 1px 3px rgba(31,41,55,.16);will-change:transform,opacity;transition:opacity .16s}
.vt3d-num{position:absolute;left:0;top:0;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;font:700 14px/24px system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;text-align:center;color:#1f2937;background:#fff;border:1.5px solid #1f2937;box-shadow:0 1px 3px rgba(31,41,55,.25);will-change:transform}
`,_p=-1,Qt={side:{az:-4,el:9},player:{az:-64,el:22},bell:{az:50,el:10},top:{az:0,el:87},bottom:{az:0,el:-86},left:{az:176,el:9}};function xp(i,e={}){let t=Object.assign({labels:"off",view:"side",shot:!1},e);if(!document.getElementById("vt3d-style")){let Z=document.createElement("style");Z.id="vt3d-style",Z.textContent=vp,document.head.appendChild(Z)}i.classList.add("vt3d-root"),getComputedStyle(i).position==="static"&&(i.style.position="relative");let n=new Ss({antialias:!0,alpha:!0,premultipliedAlpha:!0,preserveDrawingBuffer:!!t.shot,powerPreference:"high-performance"});n.setClearColor(0,0),n.outputColorSpace=Bt,n.toneMapping=hp?Tc:Ec,n.toneMappingExposure=1;let r=n.domElement;r.className="vt3d-canvas",r.setAttribute("aria-label","3D trumpet: drag to turn it, pinch or scroll to zoom"),i.appendChild(r);let s=document.createElement("div");s.className="vt3d-over",i.appendChild(s);let a=document.createElementNS("http://www.w3.org/2000/svg","svg");s.appendChild(a);let o=new ji,l=new Xi(n),h=(Z=>{let ge=l.fromScene(Z,.012,.1,200);return Z.traverse(_e=>{_e.geometry&&_e.geometry.dispose(),_e.material&&_e.material.dispose()}),ge})(dp());o.environment=h.texture,l.dispose();let u=mp();o.add(u.root);let d=(()=>{let Z=u.refl,ge=Z.length,_e=new Float32Array(ge*12),se=F(),Pe=new ws(_e,ge,3,Zt,ln);Pe.minFilter=Pe.magFilter=Wt,Pe.generateMipmaps=!1;let ze=te=>{let V=new Ne(te);return F(V.r,V.g,V.b)},de={vtPix:{value:.001},vtRot:{value:new Fe},vtBell:{value:F(pe.bell.rimX,pe.zB,pe.bell.rimR)},vtCaps:{value:Pe},vtAo:{value:.5},vtTint:{value:[ze(fl),ze($c).multiplyScalar(.9),F(.03,.03,.03)]}},Te=[u.M.brass,u.M.brassV,u.M.brassBell,u.M.brassIn,u.M.nickel,u.M.silver],Ke=()=>{for(let te=0;te<ge;te++){let V=Z[te],he=V.mov?u.obj(V.mov).position:null,xe=he?he.x:0,Se=he?he.y:0,Ae=he?he.z:0,Ie=se.subVectors(V.b,V.a).length();se.multiplyScalar(1/Ie),_e.set([V.a.x+xe,V.a.y+Se,V.a.z+Ae,V.r],te*4),_e.set([se.x,se.y,se.z,V.flat?-Ie:Ie],(ge+te)*4),_e[(2*ge+te)*4]=V.kind}Pe.needsUpdate=!0};Ke();let ot=`vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;`,et=Ue.envmap_physical_pars_fragment||"",Ce=et.includes(ot)&&n.capabilities.isWebGL2!==!1,S="plain";return{set:te=>{if(te=Ce&&(te==="high"||te==="low")?te:"plain",te!==S){S=te;for(let V of Te)te==="plain"?(V.onBeforeCompile=()=>{},V.customProgramCacheKey=()=>"vt-plain",delete V.defines.VT_N,delete V.defines.VT_TRACE,delete V.defines.VT_INSIDE,delete V.defines.VT_SOFT):(V.defines.VT_N=ge,V.defines.VT_TRACE=te==="high"?1:0,V.defines.VT_SOFT=(t.soften||90).toFixed(1),V===u.M.brassIn&&(V.defines.VT_INSIDE=1),V.customProgramCacheKey=()=>"vt-studio",V.onBeforeCompile=he=>{Object.assign(he.uniforms,de,{vtUpright:{value:V===u.M.brassBell?-1:V===u.M.brassIn?0:1},vtEdge:{value:V===u.M.brassBell?.4:1},vtTube:{value:V===u.M.brass||V===u.M.brassBell?1:0},vtFront:{value:V===u.M.nickel||V===u.M.silver?.6:1},vtDeep:{value:V===u.M.brassBell?.92:1},vtCool:{value:V===u.M.nickel||V===u.M.silver?.25:0},vtBlob:{value:V===u.M.brassBell?.62:0},vtWave:{value:t.wave===!1?0:V===u.M.brassBell?.006:V===u.M.brass?.0045:0},vtSkip:{value:V===u.M.brassBell?new me(Z.skipBell[0],Z.skipBell[1]):new me(-1,-1)}}),he.fragmentShader=he.fragmentShader.replace("#include <envmap_physical_pars_fragment>",pp+`
`+et.replace(ot,"return vtRadiance( reflectVec, normal ) * envMapIntensity;")).replace("#include <color_fragment>",`#if defined( USE_COLOR ) && ! defined( VT_INSIDE )
	diffuseColor.rgb *= mix( vec3( 1.0 ), vColor, vtAo );
#endif`)}),V.needsUpdate=!0;de.vtAo.value=te==="high"?.6:.8}},write:Ke,aim:(te,V)=>{let he=V-7*Math.PI/180,xe=Math.sin(te),Se=Math.cos(te),Ae=Math.sin(he),Ie=Math.cos(he);de.vtRot.value.set(Se,0,-xe,-xe*Ae,Ie,-Se*Ae,xe*Ie,Ae,Se*Ie),de.vtPix.value=2/(v.projectionMatrix.elements[5]*Math.max(1,n.domElement.height))},uniforms:de,get level(){return S},count:ge,dispose(){Pe.dispose()}}})(),m=!1;n.debug.onShaderError=(Z,ge,_e,se)=>{m||(m=!0,console.warn("Virtual Trumpet: the reflection shader did not compile here; using plain reflections. "+(Z.getProgramInfoLog(ge)||"")+" "+(Z.getShaderInfoLog(se)||"").slice(0,600)))},d.set(t.reflections==="low"||t.reflections===!1?"low":"high");let p=[],_=new jt;u.root.updateMatrixWorld(!0);for(let Z of u.meshes){let ge=Z.geometry.attributes.position,_e=Math.max(1,Math.floor(ge.count/500));for(let se=0;se<ge.count;se+=_e){let Pe=F().fromBufferAttribute(ge,se).applyMatrix4(Z.matrixWorld);p.push(Pe),_.expandByPoint(Pe)}}let f=_.getCenter(F()),g=pe.capBot-16,x=(()=>{let Pe=f.x,ze=f.z,de=new Kt(512,256,{depthBuffer:!1}),Te=new Kt(512,256,{depthBuffer:!1}),Ke=new Mr(-330,330,165,-165,1,600);Ke.position.set(Pe,300,ze),Ke.up.set(0,0,-1),Ke.lookAt(Pe,0,ze);let ot=new Ot({uniforms:{y0:{value:g}},depthTest:!1,depthWrite:!1,blending:bc,blendEquation:Sc,blendSrc:Ns,blendDst:Ns,vertexShader:"varying float h; uniform float y0; void main(){ vec4 w = modelMatrix * vec4(position,1.0); h = w.y - y0; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:"varying float h; void main(){ float k = 1.0 - 0.72 * smoothstep(0.0, 190.0, h); gl_FragColor = vec4(k, k, k, 1.0); }"}),et=new Et(new Wn(2,2),new Ot({uniforms:{tex:{value:null},dir:{value:new me}},depthTest:!1,depthWrite:!1,vertexShader:"varying vec2 u; void main(){ u = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`varying vec2 u; uniform sampler2D tex; uniform vec2 dir;
        void main(){ float s = 0.0, w = 0.0; for (int i = -8; i <= 8; i++){ float f = float(i); float g = exp(-f*f/18.0); s += texture2D(tex, u + dir * f).r * g; w += g; } gl_FragColor = vec4(vec3(s / w), 1.0); }`})),Ce=new ji;Ce.add(et);let S=new ui,W=new Et(new Wn(330*2,330),new Ot({uniforms:{tex:{value:de.texture},k:{value:.3}},transparent:!0,depthWrite:!1,vertexShader:"varying vec2 u; void main(){ u = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"varying vec2 u; uniform sampler2D tex; uniform float k; void main(){ float a = texture2D(tex, u).r; a = a*a*(3.0-2.0*a); vec2 e = smoothstep(0.0, 0.12, u) * smoothstep(0.0, 0.12, 1.0 - u); gl_FragColor = vec4(0.07, 0.05, 0.03, a * k * e.x * e.y); }"}));return W.rotation.x=-Math.PI/2,W.position.set(Pe,g,ze),W.renderOrder=-1,W.name="shadow",o.add(W),{plane:W,bake:()=>{let te=n.toneMapping;n.toneMapping=wc,W.visible=!1,o.overrideMaterial=ot,n.setRenderTarget(de),n.setClearColor(0,1),n.clear(),n.render(o,Ke),o.overrideMaterial=null,W.visible=!0;let V=et.material.uniforms;for(let he of[5,2.4,1.2])V.tex.value=de.texture,V.dir.value.set(he/512,0),n.setRenderTarget(Te),n.render(Ce,S),V.tex.value=Te.texture,V.dir.value.set(0,he/256),n.setRenderTarget(de),n.render(Ce,S);n.setRenderTarget(null),n.setClearColor(0,0),n.toneMapping=te},dispose(){de.dispose(),Te.dispose(),ot.dispose(),et.geometry.dispose(),et.material.dispose(),W.geometry.dispose(),W.material.dispose()}}})();x.bake();let v=new Nt(20,2,30,6e3),M=new Vs(v,r);M.enableDamping=!0,M.dampingFactor=.09,M.minPolarAngle=.03,M.maxPolarAngle=Math.PI-.03,M.zoomSpeed=.9,M.screenSpacePanning=!0,M.mouseButtons={LEFT:un.ROTATE,MIDDLE:un.DOLLY,RIGHT:un.PAN},M.touches={ONE:_n.ROTATE,TWO:_n.DOLLY_PAN},M.target.copy(f);let L=2,P=2,O=1,y=!1,b=0,w=null,R="off",C=[],B=()=>w==="player"||w==="bell",U=()=>t.insets||(R==="parts"&&!B()?{l:14,r:14,t:62,b:96}:{l:10,r:10,t:14,b:40}),k=F(),j=F(),ie=F(),J=F();function fe(Z,ge){let _e=Z*Math.PI/180,se=ge*Math.PI/180;ie.set(-Math.sin(_e)*Math.cos(se),-Math.sin(se),-Math.cos(_e)*Math.cos(se)),k.crossVectors(ie,Qi).normalize(),j.crossVectors(k,ie).normalize();let Pe=U(),ze=Math.max(40,L-Pe.l-Pe.r),de=Math.max(40,P-Pe.t-Pe.b),Te=Math.tan(v.fov*Math.PI/360)*(de/P),Ke=Math.tan(v.fov*Math.PI/360)*(ze/P),ot=f.clone(),et=1e3;for(let Ce=0;Ce<6;Ce++){let S=0,W=1/0,$=-1/0,te=1/0,V=-1/0;for(let he of p){J.subVectors(he,ot);let xe=J.dot(k),Se=J.dot(j),Ae=J.dot(ie);S=Math.max(S,Math.abs(xe)/Ke-Ae,Math.abs(Se)/Te-Ae);let Ie=1/(et+Ae);W=Math.min(W,xe*Ie),$=Math.max($,xe*Ie),te=Math.min(te,Se*Ie),V=Math.max(V,Se*Ie)}ot.addScaledVector(k,(W+$)/2*et).addScaledVector(j,(te+V)/2*et),et=S}return{dist:et*1.03,target:ot}}let Q=null;function q(){if(Q){v.setViewOffset(Q.full[0],Q.full[1],Q.crop[0],Q.crop[1],Q.crop[2],Q.crop[2]*P/L);return}let Z=U();v.setViewOffset(L,P,-(Z.l-Z.r)/2,-(Z.t-Z.b)/2,L,P)}let ee={az:0,el:0,dist:1e3,target:f.clone()};function ce(){let Z=ee.az*Math.PI/180,ge=ee.el*Math.PI/180;v.position.set(ee.target.x+ee.dist*Math.sin(Z)*Math.cos(ge),ee.target.y+ee.dist*Math.sin(ge),ee.target.z+ee.dist*Math.cos(Z)*Math.cos(ge)),M.target.copy(ee.target),v.lookAt(ee.target)}function ne(){let Z=v.position.clone().sub(M.target);ee.dist=Z.length(),ee.el=Math.asin(pt(Z.y/ee.dist,-1,1))*180/Math.PI,ee.az=Math.atan2(Z.x,Z.z)*180/Math.PI,ee.target.copy(M.target)}let ae=null;function E(){M.enableDamping=!1,M.update(),M.enableDamping=!0}function A(Z,ge,_e,se,Pe=650){E(),ne();let ze=(Z-ee.az+540)%360-180;if(!Pe){ee.az=Z,ee.el=ge,ee.dist=_e,ee.target.copy(se),ce(),M.update(),ae=null,ye();return}ae={t0:performance.now(),ms:Pe,az0:ee.az,daz:ze,el0:ee.el,el1:ge,d0:ee.dist,d1:_e,tg0:ee.target.clone(),tg1:se.clone()},ye()}function G(){let Z=fe(Qt.side.az,Qt.side.el);M.minDistance=Z.dist*.16,M.maxDistance=Z.dist*2.4}let H=[0,1,2].map(Z=>({obj:u.obj("valve"+(Z+1)+".moving"),mat:u.M["pearl"+(Z+1)],x:0,v:0,to:0,col:new Ne(15196888),colTo:new Ne(15196888),mix:0,mixTo:0})),D=new Ne(15196888),z={third:{obj:u.obj("slide3.moving"),x:0,to:0,len:pe.s3.out,dir:1},first:{obj:u.obj("slide1.moving"),x:0,to:0,len:pe.s1.out,dir:-1}};{let Z=u.obj("hooks"),ge=Z.children.find(_e=>_e.name==="hooks:nickel");ge&&z.first.obj.add(ge)}let T=0,N=!1,X=0,le=0,Y=!1;function oe(Z){let ge=Math.min(.05,T?(Z-T)/1e3:.016);T=Z;let _e=!1;for(let se of H){if(Math.abs(se.to-se.x)>1e-4||Math.abs(se.v)>.001){let Pe=se.to>.5?62:46,ze=.72,de=ge;for(;de>0;){let Te=Math.min(de,.004);se.v+=(Pe*Pe*(se.to-se.x)-2*ze*Pe*se.v)*Te,se.x+=se.v*Te,de-=Te}Math.abs(se.to-se.x)<5e-4&&Math.abs(se.v)<.02&&(se.x=se.to,se.v=0),se.obj.position.y=-pe.stroke*pt(se.x,-.03,1),_e=!0,N=!0}Math.abs(se.mixTo-se.mix)>.001&&(se.mix+=(se.mixTo-se.mix)*Math.min(1,ge*22),Math.abs(se.mixTo-se.mix)<.004&&(se.mix=se.mixTo),_e=!0),se.mat.color.copy(D).lerp(se.colTo,se.mix),se.mat.emissive.copy(se.colTo).multiplyScalar(.55*se.mix),se.mat.envMapIntensity=.62*(1-.72*se.mix),se.mat.clearcoat=.7*(1-.55*se.mix),se.mat.iridescence=.55*(1-se.mix),se.mat.sheen=.4*(1-se.mix)}for(let se of Object.values(z))Math.abs(se.to-se.x)>1e-4&&(se.x+=(se.to-se.x)*Math.min(1,ge*13),Math.abs(se.to-se.x)<.002&&(se.x=se.to),se.obj.position.x=se.dir*se.len*se.x,_e=!0,N=!0);if(ae){let se=pt((Z-ae.t0)/ae.ms,0,1),Pe=se<.5?4*se*se*se:1-Math.pow(-2*se+2,3)/2;ee.az=ae.az0+ae.daz*Pe,ee.el=ae.el0+(ae.el1-ae.el0)*Pe,ee.dist=ae.d0+(ae.d1-ae.d0)*Pe,ee.target.lerpVectors(ae.tg0,ae.tg1,Pe),ce(),se>=1&&(ae=null,E(),ce()),_e=!0}return _e}let re=[],ue=[];function Me(){for(let Z of re)Z.el.remove(),Z.line.remove(),Z.dot.remove();re.length=0;for(let Z of ue)Z.el.remove();ue.length=0}function be(){if(Me(),R==="parts"){for(let[Z,ge,_e,se,Pe]of gp){let ze=document.createElement("div");ze.className="vt3d-tag",ze.textContent=Z,s.appendChild(ze);let de=document.createElementNS("http://www.w3.org/2000/svg","line"),Te=document.createElementNS("http://www.w3.org/2000/svg","circle");Te.setAttribute("r",2.4),a.appendChild(de),a.appendChild(Te),re.push({el:ze,line:de,dot:Te,skip:Pe,pos:F(...ge),on:_e?u.obj(_e):null,out:se?F(...se).normalize():null,w:0,h:0,side:0,x:0,y:0,a:1})}for(let Z of re)Z.w=Z.el.offsetWidth,Z.h=Z.el.offsetHeight}else if(R==="fingers")for(let Z=0;Z<3;Z++){let ge=document.createElement("div");ge.className="vt3d-num",ge.textContent=String(Z+1),s.appendChild(ge),ue.push({el:ge,on:u.obj("valve"+(Z+1)+".moving"),pos:F(u.valveX[Z],pe.buttonTop+1,0)})}}let we=F(),De=F();function Ve(Z,ge){we.copy(Z),ge&&we.add(ge.position);let _e=we.clone().sub(v.position).dot(v.getWorldDirection(De))<0;return we.project(v),{x:(we.x*.5+.5)*L,y:(-we.y*.5+.5)*P,behind:_e}}let Be=F(),Ee=F();function Ze(Z){Ee.copy(Z.pos),Z.on&&Ee.add(Z.on.position),Be.subVectors(Ee,v.position);let ge=Be.length();if(ge<10)return!1;Be.multiplyScalar((ge-4)/ge).add(v.position);for(let _e of u.capsules){if(_e.id===Z.skip||Z.on&&_e.id===Z.on.name)continue;let se=_e.r*.9;if(fp(v.position,Be,_e.a,_e.b)<se*se)return!0}return!1}let Qe=!1;function at(){if(R==="fingers"){for(let de of ue){let Te=Ve(de.pos,de.on),Ke=Ve(de.pos.clone().add(F(0,14,0)),de.on),ot=Ke.x-Te.x,et=Ke.y-Te.y,Ce=Math.hypot(ot,et);Ce<4?(ot=0,et=-1):(ot/=Ce,et/=Ce),de.el.style.transform=`translate(${(Te.x+ot*24).toFixed(1)}px,${(Te.y+et*24).toFixed(1)}px)`,de.el.style.opacity=Te.behind?0:1}return}if(R!=="parts"||!re.length)return;let Z=0,ge=0;for(let de of re){let Te=Ve(de.pos,de.on);de.ax=Te.x,de.ay=Te.y;let Ke=Te.behind?0:1;de.out&&(we.copy(v.position).sub(de.pos).normalize(),Ke*=kt(-.25,.12,we.dot(de.out))),(Te.x<-20||Te.x>L+20||Te.y<-20||Te.y>P+20)&&(Ke=0),Ke>0&&Ze(de)&&(Ke=0),de.a=Ke}Z=Ve(f).y;let se=re.filter(de=>de.a>.01),Pe=1/0,ze=-1/0;for(let de of se)Pe=Math.min(Pe,de.ax),ze=Math.max(ze,de.ax);if(se.length){let de=ze-Pe;de<.4*L?Qe=!0:de>.5*L&&(Qe=!1)}if(Qe){let de=(Pe+ze)/2;for(let Te of se){let Ke=Te.ax-de;Te.col?Ke*Te.col<-24&&(Te.col=-Te.col):Te.col=Ke<0?-1:1}for(let Te of[-1,1]){let Ke=se.filter(Ce=>Ce.col===Te).sort((Ce,S)=>Ce.ay-S.ay);if(!Ke.length)continue;let ot=Te<0?Math.max(6,Pe-70):Math.min(L-6,ze+70);for(let Ce of Ke)Ce.x=Te<0?Math.max(6,ot-Ce.w):Math.min(L-Ce.w-6,ot),Ce.y=Ce.ay-Ce.h/2;let et=8;for(let Ce of Ke)Ce.y=Math.max(Ce.y,et),et=Ce.y+Ce.h+5;et=P-40;for(let Ce=Ke.length-1;Ce>=0;Ce--){let S=Ke[Ce];S.y=Math.min(S.y,et-S.h),et=S.y-5}for(let Ce of Ke)Ce.lx=Te<0?Ce.x+Ce.w:Ce.x,Ce.ly=Ce.y+Ce.h/2}}else{for(let de of re){let Te=de.ay-Z;de.side?Te*de.side<-16&&(de.side=-de.side):de.side=Te<0?-1:1}for(let de of[-1,1]){let Te=se.filter(Ce=>Ce.side===de).sort((Ce,S)=>Ce.ax-S.ax);if(!Te.length)continue;let Ke=Te.reduce((Ce,S)=>Ce+S.w+8,0),ot=Ke>L-20||Te.length>5?2:1,et=de<0?8:P-40;for(let Ce=0;Ce<ot;Ce++){let S=Te.filter((W,$)=>$%ot===Ce);for(let W of S)W.x=pt(W.ax-W.w/2,6,L-W.w-6),W.y=de<0?et+Ce*(W.h+6):et-W.h-Ce*(W.h+6);for(let W=0;W<8;W++){for(let $=1;$<S.length;$++){let te=S[$-1],V=S[$],he=te.x+te.w+8-V.x;he>0&&(te.x-=he/2,V.x+=he/2)}for(let $ of S)$.x=pt($.x,6,L-$.w-6)}}}for(let de of se)de.lx=pt(de.ax,de.x+8,de.x+de.w-8),de.ly=de.side<0?de.y+de.h:de.y}for(let de of re)de.el.style.transform=`translate(${de.x.toFixed(1)}px,${de.y.toFixed(1)}px)`,de.el.style.opacity=de.a.toFixed(2),de.line.setAttribute("x1",(de.lx||0).toFixed(1)),de.line.setAttribute("y1",(de.ly||0).toFixed(1)),de.line.setAttribute("x2",de.ax.toFixed(1)),de.line.setAttribute("y2",de.ay.toFixed(1)),de.dot.setAttribute("cx",de.ax.toFixed(1)),de.dot.setAttribute("cy",de.ay.toFixed(1)),de.line.style.opacity=de.dot.style.opacity=de.a.toFixed(2)}function ye(){!b&&!y&&(b=requestAnimationFrame(We))}function We(Z){if(b=0,y)return;let ge=oe(Z);!ae&&M.update()&&(ge=!0),M.autoRotate&&(ge=!0);let _e=M.target;if(!_.containsPoint(_e)){let ze=_.clampPoint(_e,F()),de=ze.sub(_e);_e.add(de),v.position.add(de)}let se=Math.asin(pt((v.position.y-g)/v.position.distanceTo(F(_e.x,g,_e.z)),-1,1));x.plane.material.uniforms.k.value=.34*kt(.02,.22,se),x.plane.visible=se>.02;let Pe=Math.atan2(v.position.x-_e.x,v.position.z-_e.z)*_p;o.environmentRotation.y=Pe;{let ze=v.position.x-_e.x,de=v.position.y-_e.y,Te=v.position.z-_e.z;d.aim(Math.atan2(ze,Te),Math.atan2(de,Math.hypot(ze,Te)))}if(N&&(d.write(),N=!1),n.render(o,v),m&&d.level!=="plain"&&(d.set("plain"),ge=!0),ge&&!t.shot&&d.level==="high"){let ze=Z-X;ze<400&&(le=ze>55?le+1:Math.max(0,le-2),le>14&&(d.set("low"),Y=!0))}X=Z,at(),ge?ye():T=0}M.addEventListener("change",ye),M.addEventListener("start",()=>{ae=null,w=null,r.classList.add("vt3d-drag");for(let Z of C)try{Z()}catch(ge){console.error(ge)}}),M.addEventListener("end",()=>r.classList.remove("vt3d-drag"));let $e=0,xn=0,qn=0,Ft=0,Ht=0,dn=0,K=Z=>{Z.preventDefault(),In.resetView()},Pn=Z=>{Ft=Z.clientX,Ht=Z.clientY,dn=performance.now()},er=Z=>{if(Z.pointerType!=="touch")return;let ge=performance.now();ge-dn>260||Math.hypot(Z.clientX-Ft,Z.clientY-Ht)>12||(ge-$e<330&&Math.hypot(Z.clientX-xn,Z.clientY-qn)<40?($e=0,In.resetView()):($e=ge,xn=Z.clientX,qn=Z.clientY))},ft=Z=>Z.preventDefault();r.addEventListener("dblclick",K),r.addEventListener("pointerdown",Pn),r.addEventListener("pointerup",er),r.addEventListener("contextmenu",ft);let tr=Z=>{Z.preventDefault()},nr=()=>{x.bake(),ye()};r.addEventListener("webglcontextlost",tr),r.addEventListener("webglcontextrestored",nr);function gi(){if(y)return;let Z=Math.max(2,i.clientWidth),ge=Math.max(2,i.clientHeight),_e=i.getBoundingClientRect();O=_e.width>0&&Z>0?_e.width/Z:1;let se=Math.min((window.devicePixelRatio||1)*O,2.5);se=Math.max(se,.75);let Pe=Z*ge*se*se;Pe>4e6&&(se*=Math.sqrt(4e6/Pe));let ze=Z!==L||ge!==P;if((ze||Math.abs(se-n.getPixelRatio())>.01)&&(n.setPixelRatio(se),n.setSize(Z,ge,!1)),L=Z,P=ge,v.aspect=Q?Q.full[0]/Q.full[1]:Z/ge,q(),v.updateProjectionMatrix(),M.rotateSpeed=.9/O,M.panSpeed=1/O,G(),ze&&w){let de=Qt[w],Te=fe(de.az,de.el);A(de.az,de.el,Te.dist,Te.target,0)}if(re.length)for(let de of re)de.w=de.el.offsetWidth,de.h=de.el.offsetHeight;ye()}let Zn=typeof ResizeObserver<"u"?new ResizeObserver(()=>gi()):null;Zn&&Zn.observe(i);let In={setValves(Z,ge){let _e=ge?new Ne(ge):null;H.forEach((se,Pe)=>{let ze=!!(Z&&Z[Pe]);se.to=ze?1:0,ze&&_e?(se.colTo.copy(_e),se.mixTo=1):se.mixTo=0}),ye()},setSlides(Z={}){Z.third!=null&&(z.third.to=pt(+Z.third||0,0,1)),Z.first!=null&&(z.first.to=pt(+Z.first||0,0,1)),ye()},setLabels(Z){if(Z=Z==="fingers"||Z==="parts"?Z:"off",Z===R)return;let ge=R;if(R=Z,be(),ge==="parts"!=(Z==="parts")&&(q(),v.updateProjectionMatrix(),w)){let _e=Qt[w],se=fe(_e.az,_e.el);A(_e.az,_e.el,se.dist,se.target,350)}ye()},setView(Z,ge){let _e=Qt[Z]||Qt.side;w=Qt[Z]?Z:"side",q(),v.updateProjectionMatrix();let se=fe(_e.az,_e.el);A(_e.az,_e.el,se.dist,se.target,ge??650)},resetView(){In.setView("side")},setCamera(Z,ge,_e,se=0){w=null;let Pe=fe(Z,ge);A(Z,ge,Pe.dist*(_e||1),Pe.target,se)},lookAt(Z,ge,_e,se,Pe,ze,de=0){w=null,A(se,Pe,ze,F(Z,ge,_e),de)},photoCamera(Z){Q=Z,w=null,ae=null,v.fov=Z.fov,v.position.set(...Z.pos),M.target.set(...Z.target),v.lookAt(M.target),v.aspect=Z.full[0]/Z.full[1],q(),v.updateProjectionMatrix(),M.update(),ye()},setQuality(Z){d.set(Z==="low"?"low":"high"),le=0,ye()},get quality(){return d.level},setAutoRotate(Z){M.autoRotate=!!Z,M.autoRotateSpeed=1.6,ye()},onViewChange(Z){return typeof Z=="function"&&C.push(Z),()=>{let ge=C.indexOf(Z);ge>=0&&C.splice(ge,1)}},resize:gi,render:ye,tracer:d,get view(){return w},get labels(){return R},scene:o,camera:v,renderer:n,controls:M,trumpet:u.root,materials:u.M,info(){let Z=0;for(let ge of u.meshes)Z+=ge.geometry.index.count/3;return{triangles:Z,meshes:u.meshes.length,calls:n.info.render.calls,pixelRatio:n.getPixelRatio(),size:[L,P],cssScale:O,reflections:d.level,reflectors:d.count,autoLow:Y}},dispose(){if(!y){y=!0,b&&cancelAnimationFrame(b),Zn&&Zn.disconnect(),r.removeEventListener("dblclick",K),r.removeEventListener("pointerdown",Pn),r.removeEventListener("pointerup",er),r.removeEventListener("contextmenu",ft),r.removeEventListener("webglcontextlost",tr),r.removeEventListener("webglcontextrestored",nr),M.dispose(),Me(),x.dispose();for(let Z of u.meshes)Z.geometry.dispose();for(let Z of Object.values(u.M))Z.dispose();h.dispose(),d.dispose(),n.dispose(),r.remove(),s.remove(),i.classList.remove("vt3d-root"),C.length=0}}};gi(),R="off",In.setLabels(t.labels);{let Z=Qt[t.view]?t.view:"side";w=Z,q(),v.updateProjectionMatrix();let ge=fe(Qt[Z].az,Qt[Z].el);A(Qt[Z].az,Qt[Z].el,ge.dist,ge.target,0)}return ye(),In}return lh(yp);})();
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
Trumpet3D.builtFrom=104310;
