import{j,c as fS,S as dS,s as Wg,a as Ma,r as pS,L as mS}from"./index-BzsnytEP.js";import{r as ae,g as Zv}from"./react-wpXbf5jk.js";import"./map-7oLVSK8s.js";import"./graph-DgVqjeHR.js";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Io="169",gS={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},vS={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Jv=0,Kd=1,Kv=2,_S=3,Qv=0,sh=1,Aa=2,bi=3,pr=0,Hn=1,Ci=2,dr=0,xs=1,Qd=2,$d=3,ep=4,$v=5,zr=100,e_=101,t_=102,n_=103,i_=104,r_=200,s_=201,o_=202,a_=203,vu=204,_u=205,l_=206,c_=207,u_=208,h_=209,f_=210,d_=211,p_=212,m_=213,g_=214,xu=0,yu=1,Su=2,As=3,Mu=4,wu=5,Eu=6,Au=7,nl=0,v_=1,__=2,qi=0,x_=1,y_=2,S_=3,xp=4,M_=5,w_=6,E_=7,tp="attached",A_="detached",oh=300,mr=301,kr=302,Na=303,Fa=304,Lo=306,Oa=1e3,xi=1001,Ba=1002,mn=1003,yp=1004,xS=1004,_o=1005,yS=1005,on=1006,ba=1007,SS=1007,Wi=1008,MS=1008,Ri=1009,Sp=1010,Mp=1011,Ao=1012,ah=1013,gr=1014,jn=1015,Do=1016,lh=1017,ch=1018,bs=1020,wp=35902,Ep=1021,Ap=1022,Ln=1023,bp=1024,Tp=1025,ys=1026,Ts=1027,uh=1028,il=1029,Cp=1030,hh=1031,wS=1032,fh=1033,Ta=33776,Ca=33777,Ra=33778,Pa=33779,bu=35840,Tu=35841,Cu=35842,Ru=35843,Pu=36196,Iu=37492,Lu=37496,Du=37808,Uu=37809,Nu=37810,Fu=37811,Ou=37812,Bu=37813,zu=37814,ku=37815,Hu=37816,Vu=37817,Gu=37818,Wu=37819,Xu=37820,qu=37821,Ia=36492,Yu=36494,ju=36495,Rp=36283,Zu=36284,Ju=36285,Ku=36286,b_=2200,T_=2201,C_=2202,za=2300,Qu=2301,du=2302,ms=2400,gs=2401,ka=2402,dh=2500,Pp=2501,ES=0,AS=1,bS=2,R_=3200,P_=3201,TS=3202,CS=3203,Vr=0,I_=1,ur="",_i="srgb",_r="srgb-linear",ph="display-p3",rl="display-p3-linear",Ha="linear",kt="srgb",Va="rec709",Ga="p3",RS=0,fs=7680,PS=7681,IS=7682,LS=7683,DS=34055,US=34056,NS=5386,FS=512,OS=513,BS=514,zS=515,kS=516,HS=517,VS=518,np=519,L_=512,D_=513,U_=514,Ip=515,N_=516,F_=517,O_=518,B_=519,Wa=35044,GS=35048,WS=35040,XS=35045,qS=35049,YS=35041,jS=35046,ZS=35050,JS=35042,KS="100",ip="300 es",Xi=2e3,Xa=2001;class Zi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}}const Rn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Xg=1234567;const Ss=Math.PI/180,bo=180/Math.PI;function si(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Rn[r&255]+Rn[r>>8&255]+Rn[r>>16&255]+Rn[r>>24&255]+"-"+Rn[e&255]+Rn[e>>8&255]+"-"+Rn[e>>16&15|64]+Rn[e>>24&255]+"-"+Rn[t&63|128]+Rn[t>>8&255]+"-"+Rn[t>>16&255]+Rn[t>>24&255]+Rn[n&255]+Rn[n>>8&255]+Rn[n>>16&255]+Rn[n>>24&255]).toLowerCase()}function Jt(r,e,t){return Math.max(e,Math.min(t,r))}function Lp(r,e){return(r%e+e)%e}function QS(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function $S(r,e,t){return r!==e?(t-r)/(e-r):0}function La(r,e,t){return(1-t)*r+t*e}function eM(r,e,t,n){return La(r,e,1-Math.exp(-t*n))}function tM(r,e=1){return e-Math.abs(Lp(r,e*2)-e)}function nM(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function iM(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function rM(r,e){return r+Math.floor(Math.random()*(e-r+1))}function sM(r,e){return r+Math.random()*(e-r)}function oM(r){return r*(.5-Math.random())}function aM(r){r!==void 0&&(Xg=r);let e=Xg+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function lM(r){return r*Ss}function cM(r){return r*bo}function uM(r){return(r&r-1)===0&&r!==0}function hM(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function fM(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function dM(r,e,t,n,i){const s=Math.cos,a=Math.sin,c=s(t/2),u=a(t/2),h=s((e+n)/2),f=a((e+n)/2),p=s((e-n)/2),m=a((e-n)/2),v=s((n-e)/2),x=a((n-e)/2);switch(i){case"XYX":r.set(c*f,u*p,u*m,c*h);break;case"YZY":r.set(u*m,c*f,u*p,c*h);break;case"ZXZ":r.set(u*p,u*m,c*f,c*h);break;case"XZX":r.set(c*f,u*x,u*v,c*h);break;case"YXY":r.set(u*v,c*f,u*x,c*h);break;case"ZYZ":r.set(u*x,u*v,c*f,c*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function kn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function pt(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const sl={DEG2RAD:Ss,RAD2DEG:bo,generateUUID:si,clamp:Jt,euclideanModulo:Lp,mapLinear:QS,inverseLerp:$S,lerp:La,damp:eM,pingpong:tM,smoothstep:nM,smootherstep:iM,randInt:rM,randFloat:sM,randFloatSpread:oM,seededRandom:aM,degToRad:lM,radToDeg:cM,isPowerOfTwo:uM,ceilPowerOfTwo:hM,floorPowerOfTwo:fM,setQuaternionFromProperEuler:dM,normalize:pt,denormalize:kn};class ge{constructor(e=0,t=0){ge.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Jt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class dt{constructor(e,t,n,i,s,a,c,u,h){dt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,c,u,h)}set(e,t,n,i,s,a,c,u,h){const f=this.elements;return f[0]=e,f[1]=i,f[2]=c,f[3]=t,f[4]=s,f[5]=u,f[6]=n,f[7]=a,f[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],c=n[3],u=n[6],h=n[1],f=n[4],p=n[7],m=n[2],v=n[5],x=n[8],M=i[0],y=i[3],_=i[6],E=i[1],w=i[4],T=i[7],U=i[2],P=i[5],I=i[8];return s[0]=a*M+c*E+u*U,s[3]=a*y+c*w+u*P,s[6]=a*_+c*T+u*I,s[1]=h*M+f*E+p*U,s[4]=h*y+f*w+p*P,s[7]=h*_+f*T+p*I,s[2]=m*M+v*E+x*U,s[5]=m*y+v*w+x*P,s[8]=m*_+v*T+x*I,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],c=e[5],u=e[6],h=e[7],f=e[8];return t*a*f-t*c*h-n*s*f+n*c*u+i*s*h-i*a*u}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],c=e[5],u=e[6],h=e[7],f=e[8],p=f*a-c*h,m=c*u-f*s,v=h*s-a*u,x=t*p+n*m+i*v;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/x;return e[0]=p*M,e[1]=(i*h-f*n)*M,e[2]=(c*n-i*a)*M,e[3]=m*M,e[4]=(f*t-i*u)*M,e[5]=(i*s-c*t)*M,e[6]=v*M,e[7]=(n*u-h*t)*M,e[8]=(a*t-n*s)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,c){const u=Math.cos(s),h=Math.sin(s);return this.set(n*u,n*h,-n*(u*a+h*c)+a+e,-i*h,i*u,-i*(-h*a+u*c)+c+t,0,0,1),this}scale(e,t){return this.premultiply(Yf.makeScale(e,t)),this}rotate(e){return this.premultiply(Yf.makeRotation(-e)),this}translate(e,t){return this.premultiply(Yf.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Yf=new dt;function z_(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}const pM={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function xo(r,e){return new pM[r](e)}function qa(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function k_(){const r=qa("canvas");return r.style.display="block",r}const qg={};function pu(r){r in qg||(qg[r]=!0,console.warn(r))}function mM(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}function gM(r){const e=r.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function vM(r){const e=r.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Yg=new dt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),jg=new dt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ra={[_r]:{transfer:Ha,primaries:Va,luminanceCoefficients:[.2126,.7152,.0722],toReference:r=>r,fromReference:r=>r},[_i]:{transfer:kt,primaries:Va,luminanceCoefficients:[.2126,.7152,.0722],toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[rl]:{transfer:Ha,primaries:Ga,luminanceCoefficients:[.2289,.6917,.0793],toReference:r=>r.applyMatrix3(jg),fromReference:r=>r.applyMatrix3(Yg)},[ph]:{transfer:kt,primaries:Ga,luminanceCoefficients:[.2289,.6917,.0793],toReference:r=>r.convertSRGBToLinear().applyMatrix3(jg),fromReference:r=>r.applyMatrix3(Yg).convertLinearToSRGB()}},_M=new Set([_r,rl]),Ut={enabled:!0,_workingColorSpace:_r,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!_M.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,e,t){if(this.enabled===!1||e===t||!e||!t)return r;const n=ra[e].toReference,i=ra[t].fromReference;return i(n(r))},fromWorkingColorSpace:function(r,e){return this.convert(r,this._workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this._workingColorSpace)},getPrimaries:function(r){return ra[r].primaries},getTransfer:function(r){return r===ur?Ha:ra[r].transfer},getLuminanceCoefficients:function(r,e=this._workingColorSpace){return r.fromArray(ra[e].luminanceCoefficients)}};function Eo(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function jf(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Zs;class H_{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Zs===void 0&&(Zs=qa("canvas")),Zs.width=e.width,Zs.height=e.height;const n=Zs.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Zs}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=qa("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=Eo(s[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Eo(t[n]/255)*255):t[n]=Eo(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let xM=0;class vs{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xM++}),this.uuid=si(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,c=i.length;a<c;a++)i[a].isDataTexture?s.push(Zf(i[a].image)):s.push(Zf(i[a]))}else s=Zf(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function Zf(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?H_.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let yM=0;class Yt extends Zi{constructor(e=Yt.DEFAULT_IMAGE,t=Yt.DEFAULT_MAPPING,n=xi,i=xi,s=on,a=Wi,c=Ln,u=Ri,h=Yt.DEFAULT_ANISOTROPY,f=ur){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yM++}),this.uuid=si(),this.name="",this.source=new vs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=h,this.format=c,this.internalFormat=null,this.type=u,this.offset=new ge(0,0),this.repeat=new ge(1,1),this.center=new ge(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new dt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=f,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==oh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Oa:e.x=e.x-Math.floor(e.x);break;case xi:e.x=e.x<0?0:1;break;case Ba:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Oa:e.y=e.y-Math.floor(e.y);break;case xi:e.y=e.y<0?0:1;break;case Ba:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Yt.DEFAULT_IMAGE=null;Yt.DEFAULT_MAPPING=oh;Yt.DEFAULT_ANISOTROPY=1;class xt{constructor(e=0,t=0,n=0,i=1){xt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const u=e.elements,h=u[0],f=u[4],p=u[8],m=u[1],v=u[5],x=u[9],M=u[2],y=u[6],_=u[10];if(Math.abs(f-m)<.01&&Math.abs(p-M)<.01&&Math.abs(x-y)<.01){if(Math.abs(f+m)<.1&&Math.abs(p+M)<.1&&Math.abs(x+y)<.1&&Math.abs(h+v+_-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(h+1)/2,T=(v+1)/2,U=(_+1)/2,P=(f+m)/4,I=(p+M)/4,B=(x+y)/4;return w>T&&w>U?w<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(w),i=P/n,s=I/n):T>U?T<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(T),n=P/i,s=B/i):U<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(U),n=I/s,i=B/s),this.set(n,i,s,t),this}let E=Math.sqrt((y-x)*(y-x)+(p-M)*(p-M)+(m-f)*(m-f));return Math.abs(E)<.001&&(E=1),this.x=(y-x)/E,this.y=(p-M)/E,this.z=(m-f)/E,this.w=Math.acos((h+v+_-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class V_ extends Zi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new xt(0,0,e,t),this.scissorTest=!1,this.viewport=new xt(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:on,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new Yt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let c=0;c<a;c++)this.textures[c]=s.clone(),this.textures[c].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new vs(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Pi extends V_{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class mh extends Yt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=mn,this.minFilter=mn,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class SM extends Pi{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new mh(null,e,t,n),this.texture.isRenderTargetTexture=!0}}class Dp extends Yt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=mn,this.minFilter=mn,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class MM extends Pi{constructor(e=1,t=1,n=1,i={}){super(e,t,i),this.isWebGL3DRenderTarget=!0,this.depth=n,this.texture=new Dp(null,e,t,n),this.texture.isRenderTargetTexture=!0}}class Zn{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,c){let u=n[i+0],h=n[i+1],f=n[i+2],p=n[i+3];const m=s[a+0],v=s[a+1],x=s[a+2],M=s[a+3];if(c===0){e[t+0]=u,e[t+1]=h,e[t+2]=f,e[t+3]=p;return}if(c===1){e[t+0]=m,e[t+1]=v,e[t+2]=x,e[t+3]=M;return}if(p!==M||u!==m||h!==v||f!==x){let y=1-c;const _=u*m+h*v+f*x+p*M,E=_>=0?1:-1,w=1-_*_;if(w>Number.EPSILON){const U=Math.sqrt(w),P=Math.atan2(U,_*E);y=Math.sin(y*P)/U,c=Math.sin(c*P)/U}const T=c*E;if(u=u*y+m*T,h=h*y+v*T,f=f*y+x*T,p=p*y+M*T,y===1-c){const U=1/Math.sqrt(u*u+h*h+f*f+p*p);u*=U,h*=U,f*=U,p*=U}}e[t]=u,e[t+1]=h,e[t+2]=f,e[t+3]=p}static multiplyQuaternionsFlat(e,t,n,i,s,a){const c=n[i],u=n[i+1],h=n[i+2],f=n[i+3],p=s[a],m=s[a+1],v=s[a+2],x=s[a+3];return e[t]=c*x+f*p+u*v-h*m,e[t+1]=u*x+f*m+h*p-c*v,e[t+2]=h*x+f*v+c*m-u*p,e[t+3]=f*x-c*p-u*m-h*v,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,a=e._order,c=Math.cos,u=Math.sin,h=c(n/2),f=c(i/2),p=c(s/2),m=u(n/2),v=u(i/2),x=u(s/2);switch(a){case"XYZ":this._x=m*f*p+h*v*x,this._y=h*v*p-m*f*x,this._z=h*f*x+m*v*p,this._w=h*f*p-m*v*x;break;case"YXZ":this._x=m*f*p+h*v*x,this._y=h*v*p-m*f*x,this._z=h*f*x-m*v*p,this._w=h*f*p+m*v*x;break;case"ZXY":this._x=m*f*p-h*v*x,this._y=h*v*p+m*f*x,this._z=h*f*x+m*v*p,this._w=h*f*p-m*v*x;break;case"ZYX":this._x=m*f*p-h*v*x,this._y=h*v*p+m*f*x,this._z=h*f*x-m*v*p,this._w=h*f*p+m*v*x;break;case"YZX":this._x=m*f*p+h*v*x,this._y=h*v*p+m*f*x,this._z=h*f*x-m*v*p,this._w=h*f*p-m*v*x;break;case"XZY":this._x=m*f*p-h*v*x,this._y=h*v*p-m*f*x,this._z=h*f*x+m*v*p,this._w=h*f*p+m*v*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],c=t[5],u=t[9],h=t[2],f=t[6],p=t[10],m=n+c+p;if(m>0){const v=.5/Math.sqrt(m+1);this._w=.25/v,this._x=(f-u)*v,this._y=(s-h)*v,this._z=(a-i)*v}else if(n>c&&n>p){const v=2*Math.sqrt(1+n-c-p);this._w=(f-u)/v,this._x=.25*v,this._y=(i+a)/v,this._z=(s+h)/v}else if(c>p){const v=2*Math.sqrt(1+c-n-p);this._w=(s-h)/v,this._x=(i+a)/v,this._y=.25*v,this._z=(u+f)/v}else{const v=2*Math.sqrt(1+p-n-c);this._w=(a-i)/v,this._x=(s+h)/v,this._y=(u+f)/v,this._z=.25*v}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Jt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,a=e._w,c=t._x,u=t._y,h=t._z,f=t._w;return this._x=n*f+a*c+i*h-s*u,this._y=i*f+a*u+s*c-n*h,this._z=s*f+a*h+n*u-i*c,this._w=a*f-n*c-i*u-s*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,s=this._z,a=this._w;let c=a*e._w+n*e._x+i*e._y+s*e._z;if(c<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,c=-c):this.copy(e),c>=1)return this._w=a,this._x=n,this._y=i,this._z=s,this;const u=1-c*c;if(u<=Number.EPSILON){const v=1-t;return this._w=v*a+t*this._w,this._x=v*n+t*this._x,this._y=v*i+t*this._y,this._z=v*s+t*this._z,this.normalize(),this}const h=Math.sqrt(u),f=Math.atan2(h,c),p=Math.sin((1-t)*f)/h,m=Math.sin(t*f)/h;return this._w=a*p+this._w*m,this._x=n*p+this._x*m,this._y=i*p+this._y*m,this._z=s*p+this._z*m,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,n=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Zg.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Zg.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,c=e.z,u=e.w,h=2*(a*i-c*n),f=2*(c*t-s*i),p=2*(s*n-a*t);return this.x=t+u*h+a*p-c*f,this.y=n+u*f+c*h-s*p,this.z=i+u*p+s*f-a*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,a=t.x,c=t.y,u=t.z;return this.x=i*u-s*c,this.y=s*a-n*u,this.z=n*c-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Jf.copy(this).projectOnVector(e),this.sub(Jf)}reflect(e){return this.sub(Jf.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Jt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Jf=new D,Zg=new Zn;class gn{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(wi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(wi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=wi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,c=s.count;a<c;a++)e.isMesh===!0?e.getVertexPosition(a,wi):wi.fromBufferAttribute(s,a),wi.applyMatrix4(e.matrixWorld),this.expandByPoint(wi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),gc.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),gc.copy(n.boundingBox)),gc.applyMatrix4(e.matrixWorld),this.union(gc)}const i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,wi),wi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(sa),vc.subVectors(this.max,sa),Js.subVectors(e.a,sa),Ks.subVectors(e.b,sa),Qs.subVectors(e.c,sa),Pr.subVectors(Ks,Js),Ir.subVectors(Qs,Ks),es.subVectors(Js,Qs);let t=[0,-Pr.z,Pr.y,0,-Ir.z,Ir.y,0,-es.z,es.y,Pr.z,0,-Pr.x,Ir.z,0,-Ir.x,es.z,0,-es.x,-Pr.y,Pr.x,0,-Ir.y,Ir.x,0,-es.y,es.x,0];return!Kf(t,Js,Ks,Qs,vc)||(t=[1,0,0,0,1,0,0,0,1],!Kf(t,Js,Ks,Qs,vc))?!1:(_c.crossVectors(Pr,Ir),t=[_c.x,_c.y,_c.z],Kf(t,Js,Ks,Qs,vc))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,wi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(wi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(rr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),rr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),rr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),rr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),rr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),rr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),rr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),rr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(rr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const rr=[new D,new D,new D,new D,new D,new D,new D,new D],wi=new D,gc=new gn,Js=new D,Ks=new D,Qs=new D,Pr=new D,Ir=new D,es=new D,sa=new D,vc=new D,_c=new D,ts=new D;function Kf(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){ts.fromArray(r,s);const c=i.x*Math.abs(ts.x)+i.y*Math.abs(ts.y)+i.z*Math.abs(ts.z),u=e.dot(ts),h=t.dot(ts),f=n.dot(ts);if(Math.max(-Math.max(u,h,f),Math.min(u,h,f))>c)return!1}return!0}const wM=new gn,oa=new D,Qf=new D;class vn{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):wM.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;oa.subVectors(e,this.center);const t=oa.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(oa,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Qf.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(oa.copy(e.center).add(Qf)),this.expandByPoint(oa.copy(e.center).sub(Qf))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const sr=new D,$f=new D,xc=new D,Lr=new D,ed=new D,yc=new D,td=new D;class Uo{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,sr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=sr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(sr.copy(this.origin).addScaledVector(this.direction,t),sr.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){$f.copy(e).add(t).multiplyScalar(.5),xc.copy(t).sub(e).normalize(),Lr.copy(this.origin).sub($f);const s=e.distanceTo(t)*.5,a=-this.direction.dot(xc),c=Lr.dot(this.direction),u=-Lr.dot(xc),h=Lr.lengthSq(),f=Math.abs(1-a*a);let p,m,v,x;if(f>0)if(p=a*u-c,m=a*c-u,x=s*f,p>=0)if(m>=-x)if(m<=x){const M=1/f;p*=M,m*=M,v=p*(p+a*m+2*c)+m*(a*p+m+2*u)+h}else m=s,p=Math.max(0,-(a*m+c)),v=-p*p+m*(m+2*u)+h;else m=-s,p=Math.max(0,-(a*m+c)),v=-p*p+m*(m+2*u)+h;else m<=-x?(p=Math.max(0,-(-a*s+c)),m=p>0?-s:Math.min(Math.max(-s,-u),s),v=-p*p+m*(m+2*u)+h):m<=x?(p=0,m=Math.min(Math.max(-s,-u),s),v=m*(m+2*u)+h):(p=Math.max(0,-(a*s+c)),m=p>0?s:Math.min(Math.max(-s,-u),s),v=-p*p+m*(m+2*u)+h);else m=a>0?-s:s,p=Math.max(0,-(a*m+c)),v=-p*p+m*(m+2*u)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,p),i&&i.copy($f).addScaledVector(xc,m),v}intersectSphere(e,t){sr.subVectors(e.center,this.origin);const n=sr.dot(this.direction),i=sr.dot(sr)-n*n,s=e.radius*e.radius;if(i>s)return null;const a=Math.sqrt(s-i),c=n-a,u=n+a;return u<0?null:c<0?this.at(u,t):this.at(c,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,c,u;const h=1/this.direction.x,f=1/this.direction.y,p=1/this.direction.z,m=this.origin;return h>=0?(n=(e.min.x-m.x)*h,i=(e.max.x-m.x)*h):(n=(e.max.x-m.x)*h,i=(e.min.x-m.x)*h),f>=0?(s=(e.min.y-m.y)*f,a=(e.max.y-m.y)*f):(s=(e.max.y-m.y)*f,a=(e.min.y-m.y)*f),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),p>=0?(c=(e.min.z-m.z)*p,u=(e.max.z-m.z)*p):(c=(e.max.z-m.z)*p,u=(e.min.z-m.z)*p),n>u||c>i)||((c>n||n!==n)&&(n=c),(u<i||i!==i)&&(i=u),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,sr)!==null}intersectTriangle(e,t,n,i,s){ed.subVectors(t,e),yc.subVectors(n,e),td.crossVectors(ed,yc);let a=this.direction.dot(td),c;if(a>0){if(i)return null;c=1}else if(a<0)c=-1,a=-a;else return null;Lr.subVectors(this.origin,e);const u=c*this.direction.dot(yc.crossVectors(Lr,yc));if(u<0)return null;const h=c*this.direction.dot(ed.cross(Lr));if(h<0||u+h>a)return null;const f=-c*Lr.dot(td);return f<0?null:this.at(f/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class rt{constructor(e,t,n,i,s,a,c,u,h,f,p,m,v,x,M,y){rt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,c,u,h,f,p,m,v,x,M,y)}set(e,t,n,i,s,a,c,u,h,f,p,m,v,x,M,y){const _=this.elements;return _[0]=e,_[4]=t,_[8]=n,_[12]=i,_[1]=s,_[5]=a,_[9]=c,_[13]=u,_[2]=h,_[6]=f,_[10]=p,_[14]=m,_[3]=v,_[7]=x,_[11]=M,_[15]=y,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new rt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/$s.setFromMatrixColumn(e,0).length(),s=1/$s.setFromMatrixColumn(e,1).length(),a=1/$s.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),c=Math.sin(n),u=Math.cos(i),h=Math.sin(i),f=Math.cos(s),p=Math.sin(s);if(e.order==="XYZ"){const m=a*f,v=a*p,x=c*f,M=c*p;t[0]=u*f,t[4]=-u*p,t[8]=h,t[1]=v+x*h,t[5]=m-M*h,t[9]=-c*u,t[2]=M-m*h,t[6]=x+v*h,t[10]=a*u}else if(e.order==="YXZ"){const m=u*f,v=u*p,x=h*f,M=h*p;t[0]=m+M*c,t[4]=x*c-v,t[8]=a*h,t[1]=a*p,t[5]=a*f,t[9]=-c,t[2]=v*c-x,t[6]=M+m*c,t[10]=a*u}else if(e.order==="ZXY"){const m=u*f,v=u*p,x=h*f,M=h*p;t[0]=m-M*c,t[4]=-a*p,t[8]=x+v*c,t[1]=v+x*c,t[5]=a*f,t[9]=M-m*c,t[2]=-a*h,t[6]=c,t[10]=a*u}else if(e.order==="ZYX"){const m=a*f,v=a*p,x=c*f,M=c*p;t[0]=u*f,t[4]=x*h-v,t[8]=m*h+M,t[1]=u*p,t[5]=M*h+m,t[9]=v*h-x,t[2]=-h,t[6]=c*u,t[10]=a*u}else if(e.order==="YZX"){const m=a*u,v=a*h,x=c*u,M=c*h;t[0]=u*f,t[4]=M-m*p,t[8]=x*p+v,t[1]=p,t[5]=a*f,t[9]=-c*f,t[2]=-h*f,t[6]=v*p+x,t[10]=m-M*p}else if(e.order==="XZY"){const m=a*u,v=a*h,x=c*u,M=c*h;t[0]=u*f,t[4]=-p,t[8]=h*f,t[1]=m*p+M,t[5]=a*f,t[9]=v*p-x,t[2]=x*p-v,t[6]=c*f,t[10]=M*p+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(EM,e,AM)}lookAt(e,t,n){const i=this.elements;return ni.subVectors(e,t),ni.lengthSq()===0&&(ni.z=1),ni.normalize(),Dr.crossVectors(n,ni),Dr.lengthSq()===0&&(Math.abs(n.z)===1?ni.x+=1e-4:ni.z+=1e-4,ni.normalize(),Dr.crossVectors(n,ni)),Dr.normalize(),Sc.crossVectors(ni,Dr),i[0]=Dr.x,i[4]=Sc.x,i[8]=ni.x,i[1]=Dr.y,i[5]=Sc.y,i[9]=ni.y,i[2]=Dr.z,i[6]=Sc.z,i[10]=ni.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],c=n[4],u=n[8],h=n[12],f=n[1],p=n[5],m=n[9],v=n[13],x=n[2],M=n[6],y=n[10],_=n[14],E=n[3],w=n[7],T=n[11],U=n[15],P=i[0],I=i[4],B=i[8],k=i[12],b=i[1],C=i[5],G=i[9],Z=i[13],$=i[2],oe=i[6],K=i[10],fe=i[14],O=i[3],J=i[7],q=i[11],re=i[15];return s[0]=a*P+c*b+u*$+h*O,s[4]=a*I+c*C+u*oe+h*J,s[8]=a*B+c*G+u*K+h*q,s[12]=a*k+c*Z+u*fe+h*re,s[1]=f*P+p*b+m*$+v*O,s[5]=f*I+p*C+m*oe+v*J,s[9]=f*B+p*G+m*K+v*q,s[13]=f*k+p*Z+m*fe+v*re,s[2]=x*P+M*b+y*$+_*O,s[6]=x*I+M*C+y*oe+_*J,s[10]=x*B+M*G+y*K+_*q,s[14]=x*k+M*Z+y*fe+_*re,s[3]=E*P+w*b+T*$+U*O,s[7]=E*I+w*C+T*oe+U*J,s[11]=E*B+w*G+T*K+U*q,s[15]=E*k+w*Z+T*fe+U*re,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],c=e[5],u=e[9],h=e[13],f=e[2],p=e[6],m=e[10],v=e[14],x=e[3],M=e[7],y=e[11],_=e[15];return x*(+s*u*p-i*h*p-s*c*m+n*h*m+i*c*v-n*u*v)+M*(+t*u*v-t*h*m+s*a*m-i*a*v+i*h*f-s*u*f)+y*(+t*h*p-t*c*v-s*a*p+n*a*v+s*c*f-n*h*f)+_*(-i*c*f-t*u*p+t*c*m+i*a*p-n*a*m+n*u*f)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],c=e[5],u=e[6],h=e[7],f=e[8],p=e[9],m=e[10],v=e[11],x=e[12],M=e[13],y=e[14],_=e[15],E=p*y*h-M*m*h+M*u*v-c*y*v-p*u*_+c*m*_,w=x*m*h-f*y*h-x*u*v+a*y*v+f*u*_-a*m*_,T=f*M*h-x*p*h+x*c*v-a*M*v-f*c*_+a*p*_,U=x*p*u-f*M*u-x*c*m+a*M*m+f*c*y-a*p*y,P=t*E+n*w+i*T+s*U;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/P;return e[0]=E*I,e[1]=(M*m*s-p*y*s-M*i*v+n*y*v+p*i*_-n*m*_)*I,e[2]=(c*y*s-M*u*s+M*i*h-n*y*h-c*i*_+n*u*_)*I,e[3]=(p*u*s-c*m*s-p*i*h+n*m*h+c*i*v-n*u*v)*I,e[4]=w*I,e[5]=(f*y*s-x*m*s+x*i*v-t*y*v-f*i*_+t*m*_)*I,e[6]=(x*u*s-a*y*s-x*i*h+t*y*h+a*i*_-t*u*_)*I,e[7]=(a*m*s-f*u*s+f*i*h-t*m*h-a*i*v+t*u*v)*I,e[8]=T*I,e[9]=(x*p*s-f*M*s-x*n*v+t*M*v+f*n*_-t*p*_)*I,e[10]=(a*M*s-x*c*s+x*n*h-t*M*h-a*n*_+t*c*_)*I,e[11]=(f*c*s-a*p*s-f*n*h+t*p*h+a*n*v-t*c*v)*I,e[12]=U*I,e[13]=(f*M*i-x*p*i+x*n*m-t*M*m-f*n*y+t*p*y)*I,e[14]=(x*c*i-a*M*i-x*n*u+t*M*u+a*n*y-t*c*y)*I,e[15]=(a*p*i-f*c*i+f*n*u-t*p*u-a*n*m+t*c*m)*I,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,c=e.y,u=e.z,h=s*a,f=s*c;return this.set(h*a+n,h*c-i*u,h*u+i*c,0,h*c+i*u,f*c+n,f*u-i*a,0,h*u-i*c,f*u+i*a,s*u*u+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,a=t._y,c=t._z,u=t._w,h=s+s,f=a+a,p=c+c,m=s*h,v=s*f,x=s*p,M=a*f,y=a*p,_=c*p,E=u*h,w=u*f,T=u*p,U=n.x,P=n.y,I=n.z;return i[0]=(1-(M+_))*U,i[1]=(v+T)*U,i[2]=(x-w)*U,i[3]=0,i[4]=(v-T)*P,i[5]=(1-(m+_))*P,i[6]=(y+E)*P,i[7]=0,i[8]=(x+w)*I,i[9]=(y-E)*I,i[10]=(1-(m+M))*I,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let s=$s.set(i[0],i[1],i[2]).length();const a=$s.set(i[4],i[5],i[6]).length(),c=$s.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],Ei.copy(this);const h=1/s,f=1/a,p=1/c;return Ei.elements[0]*=h,Ei.elements[1]*=h,Ei.elements[2]*=h,Ei.elements[4]*=f,Ei.elements[5]*=f,Ei.elements[6]*=f,Ei.elements[8]*=p,Ei.elements[9]*=p,Ei.elements[10]*=p,t.setFromRotationMatrix(Ei),n.x=s,n.y=a,n.z=c,this}makePerspective(e,t,n,i,s,a,c=Xi){const u=this.elements,h=2*s/(t-e),f=2*s/(n-i),p=(t+e)/(t-e),m=(n+i)/(n-i);let v,x;if(c===Xi)v=-(a+s)/(a-s),x=-2*a*s/(a-s);else if(c===Xa)v=-a/(a-s),x=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+c);return u[0]=h,u[4]=0,u[8]=p,u[12]=0,u[1]=0,u[5]=f,u[9]=m,u[13]=0,u[2]=0,u[6]=0,u[10]=v,u[14]=x,u[3]=0,u[7]=0,u[11]=-1,u[15]=0,this}makeOrthographic(e,t,n,i,s,a,c=Xi){const u=this.elements,h=1/(t-e),f=1/(n-i),p=1/(a-s),m=(t+e)*h,v=(n+i)*f;let x,M;if(c===Xi)x=(a+s)*p,M=-2*p;else if(c===Xa)x=s*p,M=-1*p;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+c);return u[0]=2*h,u[4]=0,u[8]=0,u[12]=-m,u[1]=0,u[5]=2*f,u[9]=0,u[13]=-v,u[2]=0,u[6]=0,u[10]=M,u[14]=-x,u[3]=0,u[7]=0,u[11]=0,u[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const $s=new D,Ei=new rt,EM=new D(0,0,0),AM=new D(1,1,1),Dr=new D,Sc=new D,ni=new D,Jg=new rt,Kg=new Zn;class oi{constructor(e=0,t=0,n=0,i=oi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],a=i[4],c=i[8],u=i[1],h=i[5],f=i[9],p=i[2],m=i[6],v=i[10];switch(t){case"XYZ":this._y=Math.asin(Jt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-f,v),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(m,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Jt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(c,v),this._z=Math.atan2(u,h)):(this._y=Math.atan2(-p,s),this._z=0);break;case"ZXY":this._x=Math.asin(Jt(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-p,v),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(u,s));break;case"ZYX":this._y=Math.asin(-Jt(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(m,v),this._z=Math.atan2(u,s)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Jt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(-f,h),this._y=Math.atan2(-p,s)):(this._x=0,this._y=Math.atan2(c,v));break;case"XZY":this._z=Math.asin(-Jt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(m,h),this._y=Math.atan2(c,s)):(this._x=Math.atan2(-f,v),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Jg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Jg,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Kg.setFromEuler(this),this.setFromQuaternion(Kg,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}oi.DEFAULT_ORDER="XYZ";class Ms{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let bM=0;const Qg=new D,eo=new Zn,or=new rt,Mc=new D,aa=new D,TM=new D,CM=new Zn,$g=new D(1,0,0),e0=new D(0,1,0),t0=new D(0,0,1),n0={type:"added"},RM={type:"removed"},to={type:"childadded",child:null},nd={type:"childremoved",child:null};class Tt extends Zi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:bM++}),this.uuid=si(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Tt.DEFAULT_UP.clone();const e=new D,t=new oi,n=new Zn,i=new D(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new rt},normalMatrix:{value:new dt}}),this.matrix=new rt,this.matrixWorld=new rt,this.matrixAutoUpdate=Tt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ms,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return eo.setFromAxisAngle(e,t),this.quaternion.multiply(eo),this}rotateOnWorldAxis(e,t){return eo.setFromAxisAngle(e,t),this.quaternion.premultiply(eo),this}rotateX(e){return this.rotateOnAxis($g,e)}rotateY(e){return this.rotateOnAxis(e0,e)}rotateZ(e){return this.rotateOnAxis(t0,e)}translateOnAxis(e,t){return Qg.copy(e).applyQuaternion(this.quaternion),this.position.add(Qg.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis($g,e)}translateY(e){return this.translateOnAxis(e0,e)}translateZ(e){return this.translateOnAxis(t0,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(or.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Mc.copy(e):Mc.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),aa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?or.lookAt(aa,Mc,this.up):or.lookAt(Mc,aa,this.up),this.quaternion.setFromRotationMatrix(or),i&&(or.extractRotation(i.matrixWorld),eo.setFromRotationMatrix(or),this.quaternion.premultiply(eo.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(n0),to.child=e,this.dispatchEvent(to),to.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(RM),nd.child=e,this.dispatchEvent(nd),nd.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),or.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),or.multiply(e.parent.matrixWorld)),e.applyMatrix4(or),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(n0),to.child=e,this.dispatchEvent(to),to.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(aa,e,TM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(aa,CM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(c=>({boxInitialized:c.boxInitialized,boxMin:c.box.min.toArray(),boxMax:c.box.max.toArray(),sphereInitialized:c.sphereInitialized,sphereRadius:c.sphere.radius,sphereCenter:c.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function s(c,u){return c[u.uuid]===void 0&&(c[u.uuid]=u.toJSON(e)),u.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const c=this.geometry.parameters;if(c!==void 0&&c.shapes!==void 0){const u=c.shapes;if(Array.isArray(u))for(let h=0,f=u.length;h<f;h++){const p=u[h];s(e.shapes,p)}else s(e.shapes,u)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const c=[];for(let u=0,h=this.material.length;u<h;u++)c.push(s(e.materials,this.material[u]));i.material=c}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let c=0;c<this.children.length;c++)i.children.push(this.children[c].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let c=0;c<this.animations.length;c++){const u=this.animations[c];i.animations.push(s(e.animations,u))}}if(t){const c=a(e.geometries),u=a(e.materials),h=a(e.textures),f=a(e.images),p=a(e.shapes),m=a(e.skeletons),v=a(e.animations),x=a(e.nodes);c.length>0&&(n.geometries=c),u.length>0&&(n.materials=u),h.length>0&&(n.textures=h),f.length>0&&(n.images=f),p.length>0&&(n.shapes=p),m.length>0&&(n.skeletons=m),v.length>0&&(n.animations=v),x.length>0&&(n.nodes=x)}return n.object=i,n;function a(c){const u=[];for(const h in c){const f=c[h];delete f.metadata,u.push(f)}return u}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}Tt.DEFAULT_UP=new D(0,1,0);Tt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ai=new D,ar=new D,id=new D,lr=new D,no=new D,io=new D,i0=new D,rd=new D,sd=new D,od=new D,ad=new xt,ld=new xt,cd=new xt;class Yn{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Ai.subVectors(e,t),i.cross(Ai);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){Ai.subVectors(i,t),ar.subVectors(n,t),id.subVectors(e,t);const a=Ai.dot(Ai),c=Ai.dot(ar),u=Ai.dot(id),h=ar.dot(ar),f=ar.dot(id),p=a*h-c*c;if(p===0)return s.set(0,0,0),null;const m=1/p,v=(h*u-c*f)*m,x=(a*f-c*u)*m;return s.set(1-v-x,x,v)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,lr)===null?!1:lr.x>=0&&lr.y>=0&&lr.x+lr.y<=1}static getInterpolation(e,t,n,i,s,a,c,u){return this.getBarycoord(e,t,n,i,lr)===null?(u.x=0,u.y=0,"z"in u&&(u.z=0),"w"in u&&(u.w=0),null):(u.setScalar(0),u.addScaledVector(s,lr.x),u.addScaledVector(a,lr.y),u.addScaledVector(c,lr.z),u)}static getInterpolatedAttribute(e,t,n,i,s,a){return ad.setScalar(0),ld.setScalar(0),cd.setScalar(0),ad.fromBufferAttribute(e,t),ld.fromBufferAttribute(e,n),cd.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(ad,s.x),a.addScaledVector(ld,s.y),a.addScaledVector(cd,s.z),a}static isFrontFacing(e,t,n,i){return Ai.subVectors(n,t),ar.subVectors(e,t),Ai.cross(ar).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ai.subVectors(this.c,this.b),ar.subVectors(this.a,this.b),Ai.cross(ar).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Yn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Yn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return Yn.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return Yn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Yn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let a,c;no.subVectors(i,n),io.subVectors(s,n),rd.subVectors(e,n);const u=no.dot(rd),h=io.dot(rd);if(u<=0&&h<=0)return t.copy(n);sd.subVectors(e,i);const f=no.dot(sd),p=io.dot(sd);if(f>=0&&p<=f)return t.copy(i);const m=u*p-f*h;if(m<=0&&u>=0&&f<=0)return a=u/(u-f),t.copy(n).addScaledVector(no,a);od.subVectors(e,s);const v=no.dot(od),x=io.dot(od);if(x>=0&&v<=x)return t.copy(s);const M=v*h-u*x;if(M<=0&&h>=0&&x<=0)return c=h/(h-x),t.copy(n).addScaledVector(io,c);const y=f*x-v*p;if(y<=0&&p-f>=0&&v-x>=0)return i0.subVectors(s,i),c=(p-f)/(p-f+(v-x)),t.copy(i).addScaledVector(i0,c);const _=1/(y+M+m);return a=M*_,c=m*_,t.copy(n).addScaledVector(no,a).addScaledVector(io,c)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const G_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ur={h:0,s:0,l:0},wc={h:0,s:0,l:0};function ud(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Ue{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=_i){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ut.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=Ut.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ut.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=Ut.workingColorSpace){if(e=Lp(e,1),t=Jt(t,0,1),n=Jt(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=ud(a,s,e+1/3),this.g=ud(a,s,e),this.b=ud(a,s,e-1/3)}return Ut.toWorkingColorSpace(this,i),this}setStyle(e,t=_i){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=i[1],c=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=_i){const n=G_[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Eo(e.r),this.g=Eo(e.g),this.b=Eo(e.b),this}copyLinearToSRGB(e){return this.r=jf(e.r),this.g=jf(e.g),this.b=jf(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=_i){return Ut.fromWorkingColorSpace(Pn.copy(this),e),Math.round(Jt(Pn.r*255,0,255))*65536+Math.round(Jt(Pn.g*255,0,255))*256+Math.round(Jt(Pn.b*255,0,255))}getHexString(e=_i){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ut.workingColorSpace){Ut.fromWorkingColorSpace(Pn.copy(this),t);const n=Pn.r,i=Pn.g,s=Pn.b,a=Math.max(n,i,s),c=Math.min(n,i,s);let u,h;const f=(c+a)/2;if(c===a)u=0,h=0;else{const p=a-c;switch(h=f<=.5?p/(a+c):p/(2-a-c),a){case n:u=(i-s)/p+(i<s?6:0);break;case i:u=(s-n)/p+2;break;case s:u=(n-i)/p+4;break}u/=6}return e.h=u,e.s=h,e.l=f,e}getRGB(e,t=Ut.workingColorSpace){return Ut.fromWorkingColorSpace(Pn.copy(this),t),e.r=Pn.r,e.g=Pn.g,e.b=Pn.b,e}getStyle(e=_i){Ut.fromWorkingColorSpace(Pn.copy(this),e);const t=Pn.r,n=Pn.g,i=Pn.b;return e!==_i?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Ur),this.setHSL(Ur.h+e,Ur.s+t,Ur.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ur),e.getHSL(wc);const n=La(Ur.h,wc.h,t),i=La(Ur.s,wc.s,t),s=La(Ur.l,wc.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Pn=new Ue;Ue.NAMES=G_;let PM=0;class wn extends Zi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:PM++}),this.uuid=si(),this.name="",this.type="Material",this.blending=xs,this.side=pr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=vu,this.blendDst=_u,this.blendEquation=zr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ue(0,0,0),this.blendAlpha=0,this.depthFunc=As,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=np,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fs,this.stencilZFail=fs,this.stencilZPass=fs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==xs&&(n.blending=this.blending),this.side!==pr&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==vu&&(n.blendSrc=this.blendSrc),this.blendDst!==_u&&(n.blendDst=this.blendDst),this.blendEquation!==zr&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==As&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==np&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==fs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==fs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const a=[];for(const c in s){const u=s[c];delete u.metadata,a.push(u)}return a}if(t){const s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class xr extends wn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.combine=nl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const hr=IM();function IM(){const r=new ArrayBuffer(4),e=new Float32Array(r),t=new Uint32Array(r),n=new Uint32Array(512),i=new Uint32Array(512);for(let u=0;u<256;++u){const h=u-127;h<-27?(n[u]=0,n[u|256]=32768,i[u]=24,i[u|256]=24):h<-14?(n[u]=1024>>-h-14,n[u|256]=1024>>-h-14|32768,i[u]=-h-1,i[u|256]=-h-1):h<=15?(n[u]=h+15<<10,n[u|256]=h+15<<10|32768,i[u]=13,i[u|256]=13):h<128?(n[u]=31744,n[u|256]=64512,i[u]=24,i[u|256]=24):(n[u]=31744,n[u|256]=64512,i[u]=13,i[u|256]=13)}const s=new Uint32Array(2048),a=new Uint32Array(64),c=new Uint32Array(64);for(let u=1;u<1024;++u){let h=u<<13,f=0;for(;!(h&8388608);)h<<=1,f-=8388608;h&=-8388609,f+=947912704,s[u]=h|f}for(let u=1024;u<2048;++u)s[u]=939524096+(u-1024<<13);for(let u=1;u<31;++u)a[u]=u<<23;a[31]=1199570944,a[32]=2147483648;for(let u=33;u<63;++u)a[u]=2147483648+(u-32<<23);a[63]=3347054592;for(let u=1;u<64;++u)u!==32&&(c[u]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:s,exponentTable:a,offsetTable:c}}function qn(r){Math.abs(r)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),r=Jt(r,-65504,65504),hr.floatView[0]=r;const e=hr.uint32View[0],t=e>>23&511;return hr.baseTable[t]+((e&8388607)>>hr.shiftTable[t])}function wa(r){const e=r>>10;return hr.uint32View[0]=hr.mantissaTable[hr.offsetTable[e]+(r&1023)]+hr.exponentTable[e],hr.floatView[0]}const LM={toHalfFloat:qn,fromHalfFloat:wa},rn=new D,Ec=new ge;class Bt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Wa,this.updateRanges=[],this.gpuType=jn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ec.fromBufferAttribute(this,t),Ec.applyMatrix3(e),this.setXY(t,Ec.x,Ec.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.applyMatrix3(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.applyMatrix4(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.applyNormalMatrix(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.transformDirection(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=kn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=pt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=kn(t,this.array)),t}setX(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=kn(t,this.array)),t}setY(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=kn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=kn(t,this.array)),t}setW(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array),s=pt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Wa&&(e.usage=this.usage),e}}class DM extends Bt{constructor(e,t,n){super(new Int8Array(e),t,n)}}class UM extends Bt{constructor(e,t,n){super(new Uint8Array(e),t,n)}}class NM extends Bt{constructor(e,t,n){super(new Uint8ClampedArray(e),t,n)}}class FM extends Bt{constructor(e,t,n){super(new Int16Array(e),t,n)}}class Up extends Bt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class OM extends Bt{constructor(e,t,n){super(new Int32Array(e),t,n)}}class Np extends Bt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class BM extends Bt{constructor(e,t,n){super(new Uint16Array(e),t,n),this.isFloat16BufferAttribute=!0}getX(e){let t=wa(this.array[e*this.itemSize]);return this.normalized&&(t=kn(t,this.array)),t}setX(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize]=qn(t),this}getY(e){let t=wa(this.array[e*this.itemSize+1]);return this.normalized&&(t=kn(t,this.array)),t}setY(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+1]=qn(t),this}getZ(e){let t=wa(this.array[e*this.itemSize+2]);return this.normalized&&(t=kn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+2]=qn(t),this}getW(e){let t=wa(this.array[e*this.itemSize+3]);return this.normalized&&(t=kn(t,this.array)),t}setW(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+3]=qn(t),this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array)),this.array[e+0]=qn(t),this.array[e+1]=qn(n),this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array)),this.array[e+0]=qn(t),this.array[e+1]=qn(n),this.array[e+2]=qn(i),this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array),s=pt(s,this.array)),this.array[e+0]=qn(t),this.array[e+1]=qn(n),this.array[e+2]=qn(i),this.array[e+3]=qn(s),this}}class je extends Bt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let zM=0;const vi=new rt,hd=new Tt,ro=new D,ii=new gn,la=new gn,pn=new D;class gt extends Zi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zM++}),this.uuid=si(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(z_(e)?Np:Up)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new dt().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return vi.makeRotationFromQuaternion(e),this.applyMatrix4(vi),this}rotateX(e){return vi.makeRotationX(e),this.applyMatrix4(vi),this}rotateY(e){return vi.makeRotationY(e),this.applyMatrix4(vi),this}rotateZ(e){return vi.makeRotationZ(e),this.applyMatrix4(vi),this}translate(e,t,n){return vi.makeTranslation(e,t,n),this.applyMatrix4(vi),this}scale(e,t,n){return vi.makeScale(e,t,n),this.applyMatrix4(vi),this}lookAt(e){return hd.lookAt(e),hd.updateMatrix(),this.applyMatrix4(hd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ro).negate(),this.translate(ro.x,ro.y,ro.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const s=e[n];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new je(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new gn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];ii.setFromBufferAttribute(s),this.morphTargetsRelative?(pn.addVectors(this.boundingBox.min,ii.min),this.boundingBox.expandByPoint(pn),pn.addVectors(this.boundingBox.max,ii.max),this.boundingBox.expandByPoint(pn)):(this.boundingBox.expandByPoint(ii.min),this.boundingBox.expandByPoint(ii.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const n=this.boundingSphere.center;if(ii.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const c=t[s];la.setFromBufferAttribute(c),this.morphTargetsRelative?(pn.addVectors(ii.min,la.min),ii.expandByPoint(pn),pn.addVectors(ii.max,la.max),ii.expandByPoint(pn)):(ii.expandByPoint(la.min),ii.expandByPoint(la.max))}ii.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)pn.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(pn));if(t)for(let s=0,a=t.length;s<a;s++){const c=t[s],u=this.morphTargetsRelative;for(let h=0,f=c.count;h<f;h++)pn.fromBufferAttribute(c,h),u&&(ro.fromBufferAttribute(e,h),pn.add(ro)),i=Math.max(i,n.distanceToSquared(pn))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Bt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),c=[],u=[];for(let B=0;B<n.count;B++)c[B]=new D,u[B]=new D;const h=new D,f=new D,p=new D,m=new ge,v=new ge,x=new ge,M=new D,y=new D;function _(B,k,b){h.fromBufferAttribute(n,B),f.fromBufferAttribute(n,k),p.fromBufferAttribute(n,b),m.fromBufferAttribute(s,B),v.fromBufferAttribute(s,k),x.fromBufferAttribute(s,b),f.sub(h),p.sub(h),v.sub(m),x.sub(m);const C=1/(v.x*x.y-x.x*v.y);isFinite(C)&&(M.copy(f).multiplyScalar(x.y).addScaledVector(p,-v.y).multiplyScalar(C),y.copy(p).multiplyScalar(v.x).addScaledVector(f,-x.x).multiplyScalar(C),c[B].add(M),c[k].add(M),c[b].add(M),u[B].add(y),u[k].add(y),u[b].add(y))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let B=0,k=E.length;B<k;++B){const b=E[B],C=b.start,G=b.count;for(let Z=C,$=C+G;Z<$;Z+=3)_(e.getX(Z+0),e.getX(Z+1),e.getX(Z+2))}const w=new D,T=new D,U=new D,P=new D;function I(B){U.fromBufferAttribute(i,B),P.copy(U);const k=c[B];w.copy(k),w.sub(U.multiplyScalar(U.dot(k))).normalize(),T.crossVectors(P,k);const C=T.dot(u[B])<0?-1:1;a.setXYZW(B,w.x,w.y,w.z,C)}for(let B=0,k=E.length;B<k;++B){const b=E[B],C=b.start,G=b.count;for(let Z=C,$=C+G;Z<$;Z+=3)I(e.getX(Z+0)),I(e.getX(Z+1)),I(e.getX(Z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Bt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let m=0,v=n.count;m<v;m++)n.setXYZ(m,0,0,0);const i=new D,s=new D,a=new D,c=new D,u=new D,h=new D,f=new D,p=new D;if(e)for(let m=0,v=e.count;m<v;m+=3){const x=e.getX(m+0),M=e.getX(m+1),y=e.getX(m+2);i.fromBufferAttribute(t,x),s.fromBufferAttribute(t,M),a.fromBufferAttribute(t,y),f.subVectors(a,s),p.subVectors(i,s),f.cross(p),c.fromBufferAttribute(n,x),u.fromBufferAttribute(n,M),h.fromBufferAttribute(n,y),c.add(f),u.add(f),h.add(f),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(M,u.x,u.y,u.z),n.setXYZ(y,h.x,h.y,h.z)}else for(let m=0,v=t.count;m<v;m+=3)i.fromBufferAttribute(t,m+0),s.fromBufferAttribute(t,m+1),a.fromBufferAttribute(t,m+2),f.subVectors(a,s),p.subVectors(i,s),f.cross(p),n.setXYZ(m+0,f.x,f.y,f.z),n.setXYZ(m+1,f.x,f.y,f.z),n.setXYZ(m+2,f.x,f.y,f.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)pn.fromBufferAttribute(e,t),pn.normalize(),e.setXYZ(t,pn.x,pn.y,pn.z)}toNonIndexed(){function e(c,u){const h=c.array,f=c.itemSize,p=c.normalized,m=new h.constructor(u.length*f);let v=0,x=0;for(let M=0,y=u.length;M<y;M++){c.isInterleavedBufferAttribute?v=u[M]*c.data.stride+c.offset:v=u[M]*f;for(let _=0;_<f;_++)m[x++]=h[v++]}return new Bt(m,f,p)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new gt,n=this.index.array,i=this.attributes;for(const c in i){const u=i[c],h=e(u,n);t.setAttribute(c,h)}const s=this.morphAttributes;for(const c in s){const u=[],h=s[c];for(let f=0,p=h.length;f<p;f++){const m=h[f],v=e(m,n);u.push(v)}t.morphAttributes[c]=u}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const u=this.parameters;for(const h in u)u[h]!==void 0&&(e[h]=u[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const u in n){const h=n[u];e.data.attributes[u]=h.toJSON(e.data)}const i={};let s=!1;for(const u in this.morphAttributes){const h=this.morphAttributes[u],f=[];for(let p=0,m=h.length;p<m;p++){const v=h[p];f.push(v.toJSON(e.data))}f.length>0&&(i[u]=f,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const c=this.boundingSphere;return c!==null&&(e.data.boundingSphere={center:c.center.toArray(),radius:c.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const h in i){const f=i[h];this.setAttribute(h,f.clone(t))}const s=e.morphAttributes;for(const h in s){const f=[],p=s[h];for(let m=0,v=p.length;m<v;m++)f.push(p[m].clone(t));this.morphAttributes[h]=f}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let h=0,f=a.length;h<f;h++){const p=a[h];this.addGroup(p.start,p.count,p.materialIndex)}const c=e.boundingBox;c!==null&&(this.boundingBox=c.clone());const u=e.boundingSphere;return u!==null&&(this.boundingSphere=u.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const r0=new rt,ns=new Uo,Ac=new vn,s0=new D,bc=new D,Tc=new D,Cc=new D,fd=new D,Rc=new D,o0=new D,Pc=new D;class en extends Tt{constructor(e=new gt,t=new xr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const c=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const c=this.morphTargetInfluences;if(s&&c){Rc.set(0,0,0);for(let u=0,h=s.length;u<h;u++){const f=c[u],p=s[u];f!==0&&(fd.fromBufferAttribute(p,e),a?Rc.addScaledVector(fd,f):Rc.addScaledVector(fd.sub(t),f))}t.add(Rc)}return t}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ac.copy(n.boundingSphere),Ac.applyMatrix4(s),ns.copy(e.ray).recast(e.near),!(Ac.containsPoint(ns.origin)===!1&&(ns.intersectSphere(Ac,s0)===null||ns.origin.distanceToSquared(s0)>(e.far-e.near)**2))&&(r0.copy(s).invert(),ns.copy(e.ray).applyMatrix4(r0),!(n.boundingBox!==null&&ns.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ns)))}_computeIntersections(e,t,n){let i;const s=this.geometry,a=this.material,c=s.index,u=s.attributes.position,h=s.attributes.uv,f=s.attributes.uv1,p=s.attributes.normal,m=s.groups,v=s.drawRange;if(c!==null)if(Array.isArray(a))for(let x=0,M=m.length;x<M;x++){const y=m[x],_=a[y.materialIndex],E=Math.max(y.start,v.start),w=Math.min(c.count,Math.min(y.start+y.count,v.start+v.count));for(let T=E,U=w;T<U;T+=3){const P=c.getX(T),I=c.getX(T+1),B=c.getX(T+2);i=Ic(this,_,e,n,h,f,p,P,I,B),i&&(i.faceIndex=Math.floor(T/3),i.face.materialIndex=y.materialIndex,t.push(i))}}else{const x=Math.max(0,v.start),M=Math.min(c.count,v.start+v.count);for(let y=x,_=M;y<_;y+=3){const E=c.getX(y),w=c.getX(y+1),T=c.getX(y+2);i=Ic(this,a,e,n,h,f,p,E,w,T),i&&(i.faceIndex=Math.floor(y/3),t.push(i))}}else if(u!==void 0)if(Array.isArray(a))for(let x=0,M=m.length;x<M;x++){const y=m[x],_=a[y.materialIndex],E=Math.max(y.start,v.start),w=Math.min(u.count,Math.min(y.start+y.count,v.start+v.count));for(let T=E,U=w;T<U;T+=3){const P=T,I=T+1,B=T+2;i=Ic(this,_,e,n,h,f,p,P,I,B),i&&(i.faceIndex=Math.floor(T/3),i.face.materialIndex=y.materialIndex,t.push(i))}}else{const x=Math.max(0,v.start),M=Math.min(u.count,v.start+v.count);for(let y=x,_=M;y<_;y+=3){const E=y,w=y+1,T=y+2;i=Ic(this,a,e,n,h,f,p,E,w,T),i&&(i.faceIndex=Math.floor(y/3),t.push(i))}}}}function kM(r,e,t,n,i,s,a,c){let u;if(e.side===Hn?u=n.intersectTriangle(a,s,i,!0,c):u=n.intersectTriangle(i,s,a,e.side===pr,c),u===null)return null;Pc.copy(c),Pc.applyMatrix4(r.matrixWorld);const h=t.ray.origin.distanceTo(Pc);return h<t.near||h>t.far?null:{distance:h,point:Pc.clone(),object:r}}function Ic(r,e,t,n,i,s,a,c,u,h){r.getVertexPosition(c,bc),r.getVertexPosition(u,Tc),r.getVertexPosition(h,Cc);const f=kM(r,e,t,n,bc,Tc,Cc,o0);if(f){const p=new D;Yn.getBarycoord(o0,bc,Tc,Cc,p),i&&(f.uv=Yn.getInterpolatedAttribute(i,c,u,h,p,new ge)),s&&(f.uv1=Yn.getInterpolatedAttribute(s,c,u,h,p,new ge)),a&&(f.normal=Yn.getInterpolatedAttribute(a,c,u,h,p,new D),f.normal.dot(n.direction)>0&&f.normal.multiplyScalar(-1));const m={a:c,b:u,c:h,normal:new D,materialIndex:0};Yn.getNormal(bc,Tc,Cc,m.normal),f.face=m,f.barycoord=p}return f}class Rs extends gt{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const c=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const u=[],h=[],f=[],p=[];let m=0,v=0;x("z","y","x",-1,-1,n,t,e,a,s,0),x("z","y","x",1,-1,n,t,-e,a,s,1),x("x","z","y",1,1,e,n,t,i,a,2),x("x","z","y",1,-1,e,n,-t,i,a,3),x("x","y","z",1,-1,e,t,n,i,s,4),x("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(u),this.setAttribute("position",new je(h,3)),this.setAttribute("normal",new je(f,3)),this.setAttribute("uv",new je(p,2));function x(M,y,_,E,w,T,U,P,I,B,k){const b=T/I,C=U/B,G=T/2,Z=U/2,$=P/2,oe=I+1,K=B+1;let fe=0,O=0;const J=new D;for(let q=0;q<K;q++){const re=q*C-Z;for(let xe=0;xe<oe;xe++){const Pe=xe*b-G;J[M]=Pe*E,J[y]=re*w,J[_]=$,h.push(J.x,J.y,J.z),J[M]=0,J[y]=0,J[_]=P>0?1:-1,f.push(J.x,J.y,J.z),p.push(xe/I),p.push(1-q/B),fe+=1}}for(let q=0;q<B;q++)for(let re=0;re<I;re++){const xe=m+re+oe*q,Pe=m+re+oe*(q+1),ie=m+(re+1)+oe*(q+1),me=m+(re+1)+oe*q;u.push(xe,Pe,me),u.push(Pe,ie,me),O+=6}c.addGroup(v,O,k),v+=O,m+=fe}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function To(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Bn(r){const e={};for(let t=0;t<r.length;t++){const n=To(r[t]);for(const i in n)e[i]=n[i]}return e}function HM(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function W_(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ut.workingColorSpace}const Ya={clone:To,merge:Bn};var VM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,GM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ai extends wn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=VM,this.fragmentShader=GM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=To(e.uniforms),this.uniformsGroups=HM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class ol extends Tt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new rt,this.projectionMatrix=new rt,this.projectionMatrixInverse=new rt,this.coordinateSystem=Xi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Nr=new D,a0=new ge,l0=new ge;class sn extends ol{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=bo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ss*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return bo*2*Math.atan(Math.tan(Ss*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Nr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Nr.x,Nr.y).multiplyScalar(-e/Nr.z),Nr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Nr.x,Nr.y).multiplyScalar(-e/Nr.z)}getViewSize(e,t){return this.getViewBounds(e,a0,l0),t.subVectors(l0,a0)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ss*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const u=a.fullWidth,h=a.fullHeight;s+=a.offsetX*i/u,t-=a.offsetY*n/h,i*=a.width/u,n*=a.height/h}const c=this.filmOffset;c!==0&&(s+=e*c/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const so=-90,oo=1;class X_ extends Tt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new sn(so,oo,e,t);i.layers=this.layers,this.add(i);const s=new sn(so,oo,e,t);s.layers=this.layers,this.add(s);const a=new sn(so,oo,e,t);a.layers=this.layers,this.add(a);const c=new sn(so,oo,e,t);c.layers=this.layers,this.add(c);const u=new sn(so,oo,e,t);u.layers=this.layers,this.add(u);const h=new sn(so,oo,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,c,u]=t;for(const h of t)this.remove(h);if(e===Xi)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),c.up.set(0,1,0),c.lookAt(0,0,1),u.up.set(0,1,0),u.lookAt(0,0,-1);else if(e===Xa)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),c.up.set(0,-1,0),c.lookAt(0,0,1),u.up.set(0,-1,0),u.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,c,u,h,f]=this.children,p=e.getRenderTarget(),m=e.getActiveCubeFace(),v=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,s),e.setRenderTarget(n,1,i),e.render(t,a),e.setRenderTarget(n,2,i),e.render(t,c),e.setRenderTarget(n,3,i),e.render(t,u),e.setRenderTarget(n,4,i),e.render(t,h),n.texture.generateMipmaps=M,e.setRenderTarget(n,5,i),e.render(t,f),e.setRenderTarget(p,m,v),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class al extends Yt{constructor(e,t,n,i,s,a,c,u,h,f){e=e!==void 0?e:[],t=t!==void 0?t:mr,super(e,t,n,i,s,a,c,u,h,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class q_ extends Pi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new al(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:on}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Rs(5,5,5),s=new ai({name:"CubemapFromEquirect",uniforms:To(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Hn,blending:dr});s.uniforms.tEquirect.value=t;const a=new en(i,s),c=t.minFilter;return t.minFilter===Wi&&(t.minFilter=on),new X_(1,10,this).update(e,a),t.minFilter=c,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,i){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}}const dd=new D,WM=new D,XM=new dt;class Br{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=dd.subVectors(n,t).cross(WM.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(dd),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||XM.getNormalMatrix(e),i=this.coplanarPoint(dd).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const is=new vn,Lc=new D;class ll{constructor(e=new Br,t=new Br,n=new Br,i=new Br,s=new Br,a=new Br){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){const c=this.planes;return c[0].copy(e),c[1].copy(t),c[2].copy(n),c[3].copy(i),c[4].copy(s),c[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Xi){const n=this.planes,i=e.elements,s=i[0],a=i[1],c=i[2],u=i[3],h=i[4],f=i[5],p=i[6],m=i[7],v=i[8],x=i[9],M=i[10],y=i[11],_=i[12],E=i[13],w=i[14],T=i[15];if(n[0].setComponents(u-s,m-h,y-v,T-_).normalize(),n[1].setComponents(u+s,m+h,y+v,T+_).normalize(),n[2].setComponents(u+a,m+f,y+x,T+E).normalize(),n[3].setComponents(u-a,m-f,y-x,T-E).normalize(),n[4].setComponents(u-c,m-p,y-M,T-w).normalize(),t===Xi)n[5].setComponents(u+c,m+p,y+M,T+w).normalize();else if(t===Xa)n[5].setComponents(c,p,M,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),is.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),is.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(is)}intersectsSprite(e){return is.center.set(0,0,0),is.radius=.7071067811865476,is.applyMatrix4(e.matrixWorld),this.intersectsSphere(is)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Lc.x=i.normal.x>0?e.max.x:e.min.x,Lc.y=i.normal.y>0?e.max.y:e.min.y,Lc.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Lc)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Y_(){let r=null,e=!1,t=null,n=null;function i(s,a){t(s,a),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function qM(r){const e=new WeakMap;function t(c,u){const h=c.array,f=c.usage,p=h.byteLength,m=r.createBuffer();r.bindBuffer(u,m),r.bufferData(u,h,f),c.onUploadCallback();let v;if(h instanceof Float32Array)v=r.FLOAT;else if(h instanceof Uint16Array)c.isFloat16BufferAttribute?v=r.HALF_FLOAT:v=r.UNSIGNED_SHORT;else if(h instanceof Int16Array)v=r.SHORT;else if(h instanceof Uint32Array)v=r.UNSIGNED_INT;else if(h instanceof Int32Array)v=r.INT;else if(h instanceof Int8Array)v=r.BYTE;else if(h instanceof Uint8Array)v=r.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)v=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:m,type:v,bytesPerElement:h.BYTES_PER_ELEMENT,version:c.version,size:p}}function n(c,u,h){const f=u.array,p=u.updateRanges;if(r.bindBuffer(h,c),p.length===0)r.bufferSubData(h,0,f);else{p.sort((v,x)=>v.start-x.start);let m=0;for(let v=1;v<p.length;v++){const x=p[m],M=p[v];M.start<=x.start+x.count+1?x.count=Math.max(x.count,M.start+M.count-x.start):(++m,p[m]=M)}p.length=m+1;for(let v=0,x=p.length;v<x;v++){const M=p[v];r.bufferSubData(h,M.start*f.BYTES_PER_ELEMENT,f,M.start,M.count)}u.clearUpdateRanges()}u.onUploadCallback()}function i(c){return c.isInterleavedBufferAttribute&&(c=c.data),e.get(c)}function s(c){c.isInterleavedBufferAttribute&&(c=c.data);const u=e.get(c);u&&(r.deleteBuffer(u.buffer),e.delete(c))}function a(c,u){if(c.isInterleavedBufferAttribute&&(c=c.data),c.isGLBufferAttribute){const f=e.get(c);(!f||f.version<c.version)&&e.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}const h=e.get(c);if(h===void 0)e.set(c,t(c,u));else if(h.version<c.version){if(h.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,c,u),h.version=c.version}}return{get:i,remove:s,update:a}}class No extends gt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,a=t/2,c=Math.floor(n),u=Math.floor(i),h=c+1,f=u+1,p=e/c,m=t/u,v=[],x=[],M=[],y=[];for(let _=0;_<f;_++){const E=_*m-a;for(let w=0;w<h;w++){const T=w*p-s;x.push(T,-E,0),M.push(0,0,1),y.push(w/c),y.push(1-_/u)}}for(let _=0;_<u;_++)for(let E=0;E<c;E++){const w=E+h*_,T=E+h*(_+1),U=E+1+h*(_+1),P=E+1+h*_;v.push(w,T,P),v.push(T,U,P)}this.setIndex(v),this.setAttribute("position",new je(x,3)),this.setAttribute("normal",new je(M,3)),this.setAttribute("uv",new je(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new No(e.width,e.height,e.widthSegments,e.heightSegments)}}var YM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,jM=`#ifdef USE_ALPHAHASH
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
#endif`,ZM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,JM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,KM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,QM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$M=`#ifdef USE_AOMAP
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
#endif`,e1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,t1=`#ifdef USE_BATCHING
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
#endif`,n1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,i1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,r1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,s1=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,o1=`#ifdef USE_IRIDESCENCE
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
#endif`,a1=`#ifdef USE_BUMPMAP
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
#endif`,l1=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,c1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,u1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,h1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,f1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,d1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,p1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,m1=`#if defined( USE_COLOR_ALPHA )
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
#endif`,g1=`#define PI 3.141592653589793
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
} // validated`,v1=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,_1=`vec3 transformedNormal = objectNormal;
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
#endif`,x1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,y1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,S1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,M1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,w1="gl_FragColor = linearToOutputTexel( gl_FragColor );",E1=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,A1=`#ifdef USE_ENVMAP
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
#endif`,b1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,T1=`#ifdef USE_ENVMAP
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
#endif`,C1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,R1=`#ifdef USE_ENVMAP
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
#endif`,P1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,I1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,L1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,D1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,U1=`#ifdef USE_GRADIENTMAP
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
}`,N1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,F1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,O1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,B1=`uniform bool receiveShadow;
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
#endif`,z1=`#ifdef USE_ENVMAP
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
#endif`,k1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,H1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,V1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,G1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,W1=`PhysicalMaterial material;
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
#endif`,X1=`struct PhysicalMaterial {
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
}`,q1=`
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
#endif`,Y1=`#if defined( RE_IndirectDiffuse )
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
#endif`,j1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Z1=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,J1=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,K1=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Q1=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,$1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ew=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,tw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,nw=`#if defined( USE_POINTS_UV )
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
#endif`,iw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,rw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,sw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ow=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,aw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lw=`#ifdef USE_MORPHTARGETS
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
#endif`,cw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,uw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,hw=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,fw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,mw=`#ifdef USE_NORMALMAP
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
#endif`,gw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,vw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_w=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,xw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,yw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Sw=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Mw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ww=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ew=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Aw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,bw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Tw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Cw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Rw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Pw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Iw=`float getShadowMask() {
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
}`,Lw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Dw=`#ifdef USE_SKINNING
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
#endif`,Uw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Nw=`#ifdef USE_SKINNING
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
#endif`,Fw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ow=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Bw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,zw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,kw=`#ifdef USE_TRANSMISSION
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
#endif`,Hw=`#ifdef USE_TRANSMISSION
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
#endif`,Vw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Gw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ww=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Xw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const qw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Yw=`uniform sampler2D t2D;
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
}`,jw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zw=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Jw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qw=`#include <common>
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
}`,$w=`#if DEPTH_PACKING == 3200
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
}`,eE=`#define DISTANCE
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
}`,tE=`#define DISTANCE
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
}`,nE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,iE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rE=`uniform float scale;
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
}`,sE=`uniform vec3 diffuse;
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
}`,oE=`#include <common>
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
}`,aE=`uniform vec3 diffuse;
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
}`,lE=`#define LAMBERT
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
}`,cE=`#define LAMBERT
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
}`,uE=`#define MATCAP
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
}`,hE=`#define MATCAP
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
}`,fE=`#define NORMAL
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
}`,dE=`#define NORMAL
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
}`,pE=`#define PHONG
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
}`,mE=`#define PHONG
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
}`,gE=`#define STANDARD
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
}`,vE=`#define STANDARD
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
}`,_E=`#define TOON
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
}`,xE=`#define TOON
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
}`,yE=`uniform float size;
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
}`,SE=`uniform vec3 diffuse;
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
}`,ME=`#include <common>
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
}`,wE=`uniform vec3 color;
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
}`,EE=`uniform float rotation;
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
}`,AE=`uniform vec3 diffuse;
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
}`,mt={alphahash_fragment:YM,alphahash_pars_fragment:jM,alphamap_fragment:ZM,alphamap_pars_fragment:JM,alphatest_fragment:KM,alphatest_pars_fragment:QM,aomap_fragment:$M,aomap_pars_fragment:e1,batching_pars_vertex:t1,batching_vertex:n1,begin_vertex:i1,beginnormal_vertex:r1,bsdfs:s1,iridescence_fragment:o1,bumpmap_pars_fragment:a1,clipping_planes_fragment:l1,clipping_planes_pars_fragment:c1,clipping_planes_pars_vertex:u1,clipping_planes_vertex:h1,color_fragment:f1,color_pars_fragment:d1,color_pars_vertex:p1,color_vertex:m1,common:g1,cube_uv_reflection_fragment:v1,defaultnormal_vertex:_1,displacementmap_pars_vertex:x1,displacementmap_vertex:y1,emissivemap_fragment:S1,emissivemap_pars_fragment:M1,colorspace_fragment:w1,colorspace_pars_fragment:E1,envmap_fragment:A1,envmap_common_pars_fragment:b1,envmap_pars_fragment:T1,envmap_pars_vertex:C1,envmap_physical_pars_fragment:z1,envmap_vertex:R1,fog_vertex:P1,fog_pars_vertex:I1,fog_fragment:L1,fog_pars_fragment:D1,gradientmap_pars_fragment:U1,lightmap_pars_fragment:N1,lights_lambert_fragment:F1,lights_lambert_pars_fragment:O1,lights_pars_begin:B1,lights_toon_fragment:k1,lights_toon_pars_fragment:H1,lights_phong_fragment:V1,lights_phong_pars_fragment:G1,lights_physical_fragment:W1,lights_physical_pars_fragment:X1,lights_fragment_begin:q1,lights_fragment_maps:Y1,lights_fragment_end:j1,logdepthbuf_fragment:Z1,logdepthbuf_pars_fragment:J1,logdepthbuf_pars_vertex:K1,logdepthbuf_vertex:Q1,map_fragment:$1,map_pars_fragment:ew,map_particle_fragment:tw,map_particle_pars_fragment:nw,metalnessmap_fragment:iw,metalnessmap_pars_fragment:rw,morphinstance_vertex:sw,morphcolor_vertex:ow,morphnormal_vertex:aw,morphtarget_pars_vertex:lw,morphtarget_vertex:cw,normal_fragment_begin:uw,normal_fragment_maps:hw,normal_pars_fragment:fw,normal_pars_vertex:dw,normal_vertex:pw,normalmap_pars_fragment:mw,clearcoat_normal_fragment_begin:gw,clearcoat_normal_fragment_maps:vw,clearcoat_pars_fragment:_w,iridescence_pars_fragment:xw,opaque_fragment:yw,packing:Sw,premultiplied_alpha_fragment:Mw,project_vertex:ww,dithering_fragment:Ew,dithering_pars_fragment:Aw,roughnessmap_fragment:bw,roughnessmap_pars_fragment:Tw,shadowmap_pars_fragment:Cw,shadowmap_pars_vertex:Rw,shadowmap_vertex:Pw,shadowmask_pars_fragment:Iw,skinbase_vertex:Lw,skinning_pars_vertex:Dw,skinning_vertex:Uw,skinnormal_vertex:Nw,specularmap_fragment:Fw,specularmap_pars_fragment:Ow,tonemapping_fragment:Bw,tonemapping_pars_fragment:zw,transmission_fragment:kw,transmission_pars_fragment:Hw,uv_pars_fragment:Vw,uv_pars_vertex:Gw,uv_vertex:Ww,worldpos_vertex:Xw,background_vert:qw,background_frag:Yw,backgroundCube_vert:jw,backgroundCube_frag:Zw,cube_vert:Jw,cube_frag:Kw,depth_vert:Qw,depth_frag:$w,distanceRGBA_vert:eE,distanceRGBA_frag:tE,equirect_vert:nE,equirect_frag:iE,linedashed_vert:rE,linedashed_frag:sE,meshbasic_vert:oE,meshbasic_frag:aE,meshlambert_vert:lE,meshlambert_frag:cE,meshmatcap_vert:uE,meshmatcap_frag:hE,meshnormal_vert:fE,meshnormal_frag:dE,meshphong_vert:pE,meshphong_frag:mE,meshphysical_vert:gE,meshphysical_frag:vE,meshtoon_vert:_E,meshtoon_frag:xE,points_vert:yE,points_frag:SE,shadow_vert:ME,shadow_frag:wE,sprite_vert:EE,sprite_frag:AE},Re={common:{diffuse:{value:new Ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new dt}},envmap:{envMap:{value:null},envMapRotation:{value:new dt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new dt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new dt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new dt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new dt},normalScale:{value:new ge(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new dt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new dt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new dt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new dt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0},uvTransform:{value:new dt}},sprite:{diffuse:{value:new Ue(16777215)},opacity:{value:1},center:{value:new ge(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}}},Ti={basic:{uniforms:Bn([Re.common,Re.specularmap,Re.envmap,Re.aomap,Re.lightmap,Re.fog]),vertexShader:mt.meshbasic_vert,fragmentShader:mt.meshbasic_frag},lambert:{uniforms:Bn([Re.common,Re.specularmap,Re.envmap,Re.aomap,Re.lightmap,Re.emissivemap,Re.bumpmap,Re.normalmap,Re.displacementmap,Re.fog,Re.lights,{emissive:{value:new Ue(0)}}]),vertexShader:mt.meshlambert_vert,fragmentShader:mt.meshlambert_frag},phong:{uniforms:Bn([Re.common,Re.specularmap,Re.envmap,Re.aomap,Re.lightmap,Re.emissivemap,Re.bumpmap,Re.normalmap,Re.displacementmap,Re.fog,Re.lights,{emissive:{value:new Ue(0)},specular:{value:new Ue(1118481)},shininess:{value:30}}]),vertexShader:mt.meshphong_vert,fragmentShader:mt.meshphong_frag},standard:{uniforms:Bn([Re.common,Re.envmap,Re.aomap,Re.lightmap,Re.emissivemap,Re.bumpmap,Re.normalmap,Re.displacementmap,Re.roughnessmap,Re.metalnessmap,Re.fog,Re.lights,{emissive:{value:new Ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:mt.meshphysical_vert,fragmentShader:mt.meshphysical_frag},toon:{uniforms:Bn([Re.common,Re.aomap,Re.lightmap,Re.emissivemap,Re.bumpmap,Re.normalmap,Re.displacementmap,Re.gradientmap,Re.fog,Re.lights,{emissive:{value:new Ue(0)}}]),vertexShader:mt.meshtoon_vert,fragmentShader:mt.meshtoon_frag},matcap:{uniforms:Bn([Re.common,Re.bumpmap,Re.normalmap,Re.displacementmap,Re.fog,{matcap:{value:null}}]),vertexShader:mt.meshmatcap_vert,fragmentShader:mt.meshmatcap_frag},points:{uniforms:Bn([Re.points,Re.fog]),vertexShader:mt.points_vert,fragmentShader:mt.points_frag},dashed:{uniforms:Bn([Re.common,Re.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:mt.linedashed_vert,fragmentShader:mt.linedashed_frag},depth:{uniforms:Bn([Re.common,Re.displacementmap]),vertexShader:mt.depth_vert,fragmentShader:mt.depth_frag},normal:{uniforms:Bn([Re.common,Re.bumpmap,Re.normalmap,Re.displacementmap,{opacity:{value:1}}]),vertexShader:mt.meshnormal_vert,fragmentShader:mt.meshnormal_frag},sprite:{uniforms:Bn([Re.sprite,Re.fog]),vertexShader:mt.sprite_vert,fragmentShader:mt.sprite_frag},background:{uniforms:{uvTransform:{value:new dt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:mt.background_vert,fragmentShader:mt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new dt}},vertexShader:mt.backgroundCube_vert,fragmentShader:mt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:mt.cube_vert,fragmentShader:mt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:mt.equirect_vert,fragmentShader:mt.equirect_frag},distanceRGBA:{uniforms:Bn([Re.common,Re.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:mt.distanceRGBA_vert,fragmentShader:mt.distanceRGBA_frag},shadow:{uniforms:Bn([Re.lights,Re.fog,{color:{value:new Ue(0)},opacity:{value:1}}]),vertexShader:mt.shadow_vert,fragmentShader:mt.shadow_frag}};Ti.physical={uniforms:Bn([Ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new dt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new dt},clearcoatNormalScale:{value:new ge(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new dt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new dt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new dt},sheen:{value:0},sheenColor:{value:new Ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new dt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new dt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new dt},transmissionSamplerSize:{value:new ge},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new dt},attenuationDistance:{value:0},attenuationColor:{value:new Ue(0)},specularColor:{value:new Ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new dt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new dt},anisotropyVector:{value:new ge},anisotropyMap:{value:null},anisotropyMapTransform:{value:new dt}}]),vertexShader:mt.meshphysical_vert,fragmentShader:mt.meshphysical_frag};const Dc={r:0,b:0,g:0},rs=new oi,bE=new rt;function TE(r,e,t,n,i,s,a){const c=new Ue(0);let u=s===!0?0:1,h,f,p=null,m=0,v=null;function x(E){let w=E.isScene===!0?E.background:null;return w&&w.isTexture&&(w=(E.backgroundBlurriness>0?t:e).get(w)),w}function M(E){let w=!1;const T=x(E);T===null?_(c,u):T&&T.isColor&&(_(T,1),w=!0);const U=r.xr.getEnvironmentBlendMode();U==="additive"?n.buffers.color.setClear(0,0,0,1,a):U==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(r.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function y(E,w){const T=x(w);T&&(T.isCubeTexture||T.mapping===Lo)?(f===void 0&&(f=new en(new Rs(1,1,1),new ai({name:"BackgroundCubeMaterial",uniforms:To(Ti.backgroundCube.uniforms),vertexShader:Ti.backgroundCube.vertexShader,fragmentShader:Ti.backgroundCube.fragmentShader,side:Hn,depthTest:!1,depthWrite:!1,fog:!1})),f.geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(U,P,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(f)),rs.copy(w.backgroundRotation),rs.x*=-1,rs.y*=-1,rs.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(rs.y*=-1,rs.z*=-1),f.material.uniforms.envMap.value=T,f.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,f.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(bE.makeRotationFromEuler(rs)),f.material.toneMapped=Ut.getTransfer(T.colorSpace)!==kt,(p!==T||m!==T.version||v!==r.toneMapping)&&(f.material.needsUpdate=!0,p=T,m=T.version,v=r.toneMapping),f.layers.enableAll(),E.unshift(f,f.geometry,f.material,0,0,null)):T&&T.isTexture&&(h===void 0&&(h=new en(new No(2,2),new ai({name:"BackgroundMaterial",uniforms:To(Ti.background.uniforms),vertexShader:Ti.background.vertexShader,fragmentShader:Ti.background.fragmentShader,side:pr,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(h)),h.material.uniforms.t2D.value=T,h.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,h.material.toneMapped=Ut.getTransfer(T.colorSpace)!==kt,T.matrixAutoUpdate===!0&&T.updateMatrix(),h.material.uniforms.uvTransform.value.copy(T.matrix),(p!==T||m!==T.version||v!==r.toneMapping)&&(h.material.needsUpdate=!0,p=T,m=T.version,v=r.toneMapping),h.layers.enableAll(),E.unshift(h,h.geometry,h.material,0,0,null))}function _(E,w){E.getRGB(Dc,W_(r)),n.buffers.color.setClear(Dc.r,Dc.g,Dc.b,w,a)}return{getClearColor:function(){return c},setClearColor:function(E,w=1){c.set(E),u=w,_(c,u)},getClearAlpha:function(){return u},setClearAlpha:function(E){u=E,_(c,u)},render:M,addToRenderList:y}}function CE(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=m(null);let s=i,a=!1;function c(b,C,G,Z,$){let oe=!1;const K=p(Z,G,C);s!==K&&(s=K,h(s.object)),oe=v(b,Z,G,$),oe&&x(b,Z,G,$),$!==null&&e.update($,r.ELEMENT_ARRAY_BUFFER),(oe||a)&&(a=!1,T(b,C,G,Z),$!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get($).buffer))}function u(){return r.createVertexArray()}function h(b){return r.bindVertexArray(b)}function f(b){return r.deleteVertexArray(b)}function p(b,C,G){const Z=G.wireframe===!0;let $=n[b.id];$===void 0&&($={},n[b.id]=$);let oe=$[C.id];oe===void 0&&(oe={},$[C.id]=oe);let K=oe[Z];return K===void 0&&(K=m(u()),oe[Z]=K),K}function m(b){const C=[],G=[],Z=[];for(let $=0;$<t;$++)C[$]=0,G[$]=0,Z[$]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:G,attributeDivisors:Z,object:b,attributes:{},index:null}}function v(b,C,G,Z){const $=s.attributes,oe=C.attributes;let K=0;const fe=G.getAttributes();for(const O in fe)if(fe[O].location>=0){const q=$[O];let re=oe[O];if(re===void 0&&(O==="instanceMatrix"&&b.instanceMatrix&&(re=b.instanceMatrix),O==="instanceColor"&&b.instanceColor&&(re=b.instanceColor)),q===void 0||q.attribute!==re||re&&q.data!==re.data)return!0;K++}return s.attributesNum!==K||s.index!==Z}function x(b,C,G,Z){const $={},oe=C.attributes;let K=0;const fe=G.getAttributes();for(const O in fe)if(fe[O].location>=0){let q=oe[O];q===void 0&&(O==="instanceMatrix"&&b.instanceMatrix&&(q=b.instanceMatrix),O==="instanceColor"&&b.instanceColor&&(q=b.instanceColor));const re={};re.attribute=q,q&&q.data&&(re.data=q.data),$[O]=re,K++}s.attributes=$,s.attributesNum=K,s.index=Z}function M(){const b=s.newAttributes;for(let C=0,G=b.length;C<G;C++)b[C]=0}function y(b){_(b,0)}function _(b,C){const G=s.newAttributes,Z=s.enabledAttributes,$=s.attributeDivisors;G[b]=1,Z[b]===0&&(r.enableVertexAttribArray(b),Z[b]=1),$[b]!==C&&(r.vertexAttribDivisor(b,C),$[b]=C)}function E(){const b=s.newAttributes,C=s.enabledAttributes;for(let G=0,Z=C.length;G<Z;G++)C[G]!==b[G]&&(r.disableVertexAttribArray(G),C[G]=0)}function w(b,C,G,Z,$,oe,K){K===!0?r.vertexAttribIPointer(b,C,G,$,oe):r.vertexAttribPointer(b,C,G,Z,$,oe)}function T(b,C,G,Z){M();const $=Z.attributes,oe=G.getAttributes(),K=C.defaultAttributeValues;for(const fe in oe){const O=oe[fe];if(O.location>=0){let J=$[fe];if(J===void 0&&(fe==="instanceMatrix"&&b.instanceMatrix&&(J=b.instanceMatrix),fe==="instanceColor"&&b.instanceColor&&(J=b.instanceColor)),J!==void 0){const q=J.normalized,re=J.itemSize,xe=e.get(J);if(xe===void 0)continue;const Pe=xe.buffer,ie=xe.type,me=xe.bytesPerElement,be=ie===r.INT||ie===r.UNSIGNED_INT||J.gpuType===ah;if(J.isInterleavedBufferAttribute){const Se=J.data,tt=Se.stride,nt=J.offset;if(Se.isInstancedInterleavedBuffer){for(let Ze=0;Ze<O.locationSize;Ze++)_(O.location+Ze,Se.meshPerAttribute);b.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=Se.meshPerAttribute*Se.count)}else for(let Ze=0;Ze<O.locationSize;Ze++)y(O.location+Ze);r.bindBuffer(r.ARRAY_BUFFER,Pe);for(let Ze=0;Ze<O.locationSize;Ze++)w(O.location+Ze,re/O.locationSize,ie,q,tt*me,(nt+re/O.locationSize*Ze)*me,be)}else{if(J.isInstancedBufferAttribute){for(let Se=0;Se<O.locationSize;Se++)_(O.location+Se,J.meshPerAttribute);b.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let Se=0;Se<O.locationSize;Se++)y(O.location+Se);r.bindBuffer(r.ARRAY_BUFFER,Pe);for(let Se=0;Se<O.locationSize;Se++)w(O.location+Se,re/O.locationSize,ie,q,re*me,re/O.locationSize*Se*me,be)}}else if(K!==void 0){const q=K[fe];if(q!==void 0)switch(q.length){case 2:r.vertexAttrib2fv(O.location,q);break;case 3:r.vertexAttrib3fv(O.location,q);break;case 4:r.vertexAttrib4fv(O.location,q);break;default:r.vertexAttrib1fv(O.location,q)}}}}E()}function U(){B();for(const b in n){const C=n[b];for(const G in C){const Z=C[G];for(const $ in Z)f(Z[$].object),delete Z[$];delete C[G]}delete n[b]}}function P(b){if(n[b.id]===void 0)return;const C=n[b.id];for(const G in C){const Z=C[G];for(const $ in Z)f(Z[$].object),delete Z[$];delete C[G]}delete n[b.id]}function I(b){for(const C in n){const G=n[C];if(G[b.id]===void 0)continue;const Z=G[b.id];for(const $ in Z)f(Z[$].object),delete Z[$];delete G[b.id]}}function B(){k(),a=!0,s!==i&&(s=i,h(s.object))}function k(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:c,reset:B,resetDefaultState:k,dispose:U,releaseStatesOfGeometry:P,releaseStatesOfProgram:I,initAttributes:M,enableAttribute:y,disableUnusedAttributes:E}}function RE(r,e,t){let n;function i(h){n=h}function s(h,f){r.drawArrays(n,h,f),t.update(f,n,1)}function a(h,f,p){p!==0&&(r.drawArraysInstanced(n,h,f,p),t.update(f,n,p))}function c(h,f,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,h,0,f,0,p);let v=0;for(let x=0;x<p;x++)v+=f[x];t.update(v,n,1)}function u(h,f,p,m){if(p===0)return;const v=e.get("WEBGL_multi_draw");if(v===null)for(let x=0;x<h.length;x++)a(h[x],f[x],m[x]);else{v.multiDrawArraysInstancedWEBGL(n,h,0,f,0,m,0,p);let x=0;for(let M=0;M<p;M++)x+=f[M];for(let M=0;M<m.length;M++)t.update(x,n,m[M])}}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=c,this.renderMultiDrawInstances=u}function PE(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const I=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(I){return!(I!==Ln&&n.convert(I)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function c(I){const B=I===Do&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(I!==Ri&&n.convert(I)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==jn&&!B)}function u(I){if(I==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const f=u(h);f!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",f,"instead."),h=f);const p=t.logarithmicDepthBuffer===!0,m=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(m===!0){const I=e.get("EXT_clip_control");I.clipControlEXT(I.LOWER_LEFT_EXT,I.ZERO_TO_ONE_EXT)}const v=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),x=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=r.getParameter(r.MAX_TEXTURE_SIZE),y=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),_=r.getParameter(r.MAX_VERTEX_ATTRIBS),E=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),w=r.getParameter(r.MAX_VARYING_VECTORS),T=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),U=x>0,P=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:u,textureFormatReadable:a,textureTypeReadable:c,precision:h,logarithmicDepthBuffer:p,reverseDepthBuffer:m,maxTextures:v,maxVertexTextures:x,maxTextureSize:M,maxCubemapSize:y,maxAttributes:_,maxVertexUniforms:E,maxVaryings:w,maxFragmentUniforms:T,vertexTextures:U,maxSamples:P}}function IE(r){const e=this;let t=null,n=0,i=!1,s=!1;const a=new Br,c=new dt,u={value:null,needsUpdate:!1};this.uniform=u,this.numPlanes=0,this.numIntersection=0,this.init=function(p,m){const v=p.length!==0||m||n!==0||i;return i=m,n=p.length,v},this.beginShadows=function(){s=!0,f(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(p,m){t=f(p,m,0)},this.setState=function(p,m,v){const x=p.clippingPlanes,M=p.clipIntersection,y=p.clipShadows,_=r.get(p);if(!i||x===null||x.length===0||s&&!y)s?f(null):h();else{const E=s?0:n,w=E*4;let T=_.clippingState||null;u.value=T,T=f(x,m,w,v);for(let U=0;U!==w;++U)T[U]=t[U];_.clippingState=T,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=E}};function h(){u.value!==t&&(u.value=t,u.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function f(p,m,v,x){const M=p!==null?p.length:0;let y=null;if(M!==0){if(y=u.value,x!==!0||y===null){const _=v+M*4,E=m.matrixWorldInverse;c.getNormalMatrix(E),(y===null||y.length<_)&&(y=new Float32Array(_));for(let w=0,T=v;w!==M;++w,T+=4)a.copy(p[w]).applyMatrix4(E,c),a.normal.toArray(y,T),y[T+3]=a.constant}u.value=y,u.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,y}}function LE(r){let e=new WeakMap;function t(a,c){return c===Na?a.mapping=mr:c===Fa&&(a.mapping=kr),a}function n(a){if(a&&a.isTexture){const c=a.mapping;if(c===Na||c===Fa)if(e.has(a)){const u=e.get(a).texture;return t(u,a.mapping)}else{const u=a.image;if(u&&u.height>0){const h=new q_(u.height);return h.fromEquirectangularTexture(r,a),e.set(a,h),a.addEventListener("dispose",i),t(h.texture,a.mapping)}else return null}}return a}function i(a){const c=a.target;c.removeEventListener("dispose",i);const u=e.get(c);u!==void 0&&(e.delete(c),u.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class Ps extends ol{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,a=n+e,c=i+t,u=i-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=h*this.view.offsetX,a=s+h*this.view.width,c-=f*this.view.offsetY,u=c-f*this.view.height}this.projectionMatrix.makeOrthographic(s,a,c,u,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const yo=4,c0=[.125,.215,.35,.446,.526,.582],ps=20,pd=new Ps,u0=new Ue;let md=null,gd=0,vd=0,_d=!1;const ds=(1+Math.sqrt(5))/2,ao=1/ds,h0=[new D(-ds,ao,0),new D(ds,ao,0),new D(-ao,0,ds),new D(ao,0,ds),new D(0,ds,-ao),new D(0,ds,ao),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)];class rp{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){md=this._renderer.getRenderTarget(),gd=this._renderer.getActiveCubeFace(),vd=this._renderer.getActiveMipmapLevel(),_d=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,i,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=p0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=d0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(md,gd,vd),this._renderer.xr.enabled=_d,e.scissorTest=!1,Uc(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===mr||e.mapping===kr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),md=this._renderer.getRenderTarget(),gd=this._renderer.getActiveCubeFace(),vd=this._renderer.getActiveMipmapLevel(),_d=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:on,minFilter:on,generateMipmaps:!1,type:Do,format:Ln,colorSpace:_r,depthBuffer:!1},i=f0(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=f0(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=DE(s)),this._blurMaterial=UE(s,e,t)}return i}_compileMaterial(e){const t=new en(this._lodPlanes[0],e);this._renderer.compile(t,pd)}_sceneToCubeUV(e,t,n,i){const c=new sn(90,1,t,n),u=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,p=f.autoClear,m=f.toneMapping;f.getClearColor(u0),f.toneMapping=qi,f.autoClear=!1;const v=new xr({name:"PMREM.Background",side:Hn,depthWrite:!1,depthTest:!1}),x=new en(new Rs,v);let M=!1;const y=e.background;y?y.isColor&&(v.color.copy(y),e.background=null,M=!0):(v.color.copy(u0),M=!0);for(let _=0;_<6;_++){const E=_%3;E===0?(c.up.set(0,u[_],0),c.lookAt(h[_],0,0)):E===1?(c.up.set(0,0,u[_]),c.lookAt(0,h[_],0)):(c.up.set(0,u[_],0),c.lookAt(0,0,h[_]));const w=this._cubeSize;Uc(i,E*w,_>2?w:0,w,w),f.setRenderTarget(i),M&&f.render(x,c),f.render(e,c)}x.geometry.dispose(),x.material.dispose(),f.toneMapping=m,f.autoClear=p,e.background=y}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===mr||e.mapping===kr;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=p0()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=d0());const s=i?this._cubemapMaterial:this._equirectMaterial,a=new en(this._lodPlanes[0],s),c=s.uniforms;c.envMap.value=e;const u=this._cubeSize;Uc(t,0,0,3*u,2*u),n.setRenderTarget(t),n.render(a,pd)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let s=1;s<i;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),c=h0[(i-s-1)%h0.length];this._blur(e,s-1,s,a,c)}t.autoClear=n}_blur(e,t,n,i,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",s),this._halfBlur(a,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,a,c){const u=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const f=3,p=new en(this._lodPlanes[i],h),m=h.uniforms,v=this._sizeLods[n]-1,x=isFinite(s)?Math.PI/(2*v):2*Math.PI/(2*ps-1),M=s/x,y=isFinite(s)?1+Math.floor(f*M):ps;y>ps&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${y} samples when the maximum is set to ${ps}`);const _=[];let E=0;for(let I=0;I<ps;++I){const B=I/M,k=Math.exp(-B*B/2);_.push(k),I===0?E+=k:I<y&&(E+=2*k)}for(let I=0;I<_.length;I++)_[I]=_[I]/E;m.envMap.value=e.texture,m.samples.value=y,m.weights.value=_,m.latitudinal.value=a==="latitudinal",c&&(m.poleAxis.value=c);const{_lodMax:w}=this;m.dTheta.value=x,m.mipInt.value=w-n;const T=this._sizeLods[i],U=3*T*(i>w-yo?i-w+yo:0),P=4*(this._cubeSize-T);Uc(t,U,P,3*T,2*T),u.setRenderTarget(t),u.render(p,pd)}}function DE(r){const e=[],t=[],n=[];let i=r;const s=r-yo+1+c0.length;for(let a=0;a<s;a++){const c=Math.pow(2,i);t.push(c);let u=1/c;a>r-yo?u=c0[a-r+yo-1]:a===0&&(u=0),n.push(u);const h=1/(c-2),f=-h,p=1+h,m=[f,f,p,f,p,p,f,f,p,p,f,p],v=6,x=6,M=3,y=2,_=1,E=new Float32Array(M*x*v),w=new Float32Array(y*x*v),T=new Float32Array(_*x*v);for(let P=0;P<v;P++){const I=P%3*2/3-1,B=P>2?0:-1,k=[I,B,0,I+2/3,B,0,I+2/3,B+1,0,I,B,0,I+2/3,B+1,0,I,B+1,0];E.set(k,M*x*P),w.set(m,y*x*P);const b=[P,P,P,P,P,P];T.set(b,_*x*P)}const U=new gt;U.setAttribute("position",new Bt(E,M)),U.setAttribute("uv",new Bt(w,y)),U.setAttribute("faceIndex",new Bt(T,_)),e.push(U),i>yo&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function f0(r,e,t){const n=new Pi(r,e,t);return n.texture.mapping=Lo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Uc(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function UE(r,e,t){const n=new Float32Array(ps),i=new D(0,1,0);return new ai({name:"SphericalGaussianBlur",defines:{n:ps,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Fp(),fragmentShader:`

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
		`,blending:dr,depthTest:!1,depthWrite:!1})}function d0(){return new ai({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fp(),fragmentShader:`

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
		`,blending:dr,depthTest:!1,depthWrite:!1})}function p0(){return new ai({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:dr,depthTest:!1,depthWrite:!1})}function Fp(){return`

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
	`}function NE(r){let e=new WeakMap,t=null;function n(c){if(c&&c.isTexture){const u=c.mapping,h=u===Na||u===Fa,f=u===mr||u===kr;if(h||f){let p=e.get(c);const m=p!==void 0?p.texture.pmremVersion:0;if(c.isRenderTargetTexture&&c.pmremVersion!==m)return t===null&&(t=new rp(r)),p=h?t.fromEquirectangular(c,p):t.fromCubemap(c,p),p.texture.pmremVersion=c.pmremVersion,e.set(c,p),p.texture;if(p!==void 0)return p.texture;{const v=c.image;return h&&v&&v.height>0||f&&v&&i(v)?(t===null&&(t=new rp(r)),p=h?t.fromEquirectangular(c):t.fromCubemap(c),p.texture.pmremVersion=c.pmremVersion,e.set(c,p),c.addEventListener("dispose",s),p.texture):null}}}return c}function i(c){let u=0;const h=6;for(let f=0;f<h;f++)c[f]!==void 0&&u++;return u===h}function s(c){const u=c.target;u.removeEventListener("dispose",s);const h=e.get(u);h!==void 0&&(e.delete(u),h.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function FE(r){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&pu("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function OE(r,e,t,n){const i={},s=new WeakMap;function a(p){const m=p.target;m.index!==null&&e.remove(m.index);for(const x in m.attributes)e.remove(m.attributes[x]);for(const x in m.morphAttributes){const M=m.morphAttributes[x];for(let y=0,_=M.length;y<_;y++)e.remove(M[y])}m.removeEventListener("dispose",a),delete i[m.id];const v=s.get(m);v&&(e.remove(v),s.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function c(p,m){return i[m.id]===!0||(m.addEventListener("dispose",a),i[m.id]=!0,t.memory.geometries++),m}function u(p){const m=p.attributes;for(const x in m)e.update(m[x],r.ARRAY_BUFFER);const v=p.morphAttributes;for(const x in v){const M=v[x];for(let y=0,_=M.length;y<_;y++)e.update(M[y],r.ARRAY_BUFFER)}}function h(p){const m=[],v=p.index,x=p.attributes.position;let M=0;if(v!==null){const E=v.array;M=v.version;for(let w=0,T=E.length;w<T;w+=3){const U=E[w+0],P=E[w+1],I=E[w+2];m.push(U,P,P,I,I,U)}}else if(x!==void 0){const E=x.array;M=x.version;for(let w=0,T=E.length/3-1;w<T;w+=3){const U=w+0,P=w+1,I=w+2;m.push(U,P,P,I,I,U)}}else return;const y=new(z_(m)?Np:Up)(m,1);y.version=M;const _=s.get(p);_&&e.remove(_),s.set(p,y)}function f(p){const m=s.get(p);if(m){const v=p.index;v!==null&&m.version<v.version&&h(p)}else h(p);return s.get(p)}return{get:c,update:u,getWireframeAttribute:f}}function BE(r,e,t){let n;function i(m){n=m}let s,a;function c(m){s=m.type,a=m.bytesPerElement}function u(m,v){r.drawElements(n,v,s,m*a),t.update(v,n,1)}function h(m,v,x){x!==0&&(r.drawElementsInstanced(n,v,s,m*a,x),t.update(v,n,x))}function f(m,v,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,v,0,s,m,0,x);let y=0;for(let _=0;_<x;_++)y+=v[_];t.update(y,n,1)}function p(m,v,x,M){if(x===0)return;const y=e.get("WEBGL_multi_draw");if(y===null)for(let _=0;_<m.length;_++)h(m[_]/a,v[_],M[_]);else{y.multiDrawElementsInstancedWEBGL(n,v,0,s,m,0,M,0,x);let _=0;for(let E=0;E<x;E++)_+=v[E];for(let E=0;E<M.length;E++)t.update(_,n,M[E])}}this.setMode=i,this.setIndex=c,this.render=u,this.renderInstances=h,this.renderMultiDraw=f,this.renderMultiDrawInstances=p}function zE(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,c){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=c*(s/3);break;case r.LINES:t.lines+=c*(s/2);break;case r.LINE_STRIP:t.lines+=c*(s-1);break;case r.LINE_LOOP:t.lines+=c*s;break;case r.POINTS:t.points+=c*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function kE(r,e,t){const n=new WeakMap,i=new xt;function s(a,c,u){const h=a.morphTargetInfluences,f=c.morphAttributes.position||c.morphAttributes.normal||c.morphAttributes.color,p=f!==void 0?f.length:0;let m=n.get(c);if(m===void 0||m.count!==p){let k=function(){I.dispose(),n.delete(c),c.removeEventListener("dispose",k)};m!==void 0&&m.texture.dispose();const v=c.morphAttributes.position!==void 0,x=c.morphAttributes.normal!==void 0,M=c.morphAttributes.color!==void 0,y=c.morphAttributes.position||[],_=c.morphAttributes.normal||[],E=c.morphAttributes.color||[];let w=0;v===!0&&(w=1),x===!0&&(w=2),M===!0&&(w=3);let T=c.attributes.position.count*w,U=1;T>e.maxTextureSize&&(U=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const P=new Float32Array(T*U*4*p),I=new mh(P,T,U,p);I.type=jn,I.needsUpdate=!0;const B=w*4;for(let b=0;b<p;b++){const C=y[b],G=_[b],Z=E[b],$=T*U*4*b;for(let oe=0;oe<C.count;oe++){const K=oe*B;v===!0&&(i.fromBufferAttribute(C,oe),P[$+K+0]=i.x,P[$+K+1]=i.y,P[$+K+2]=i.z,P[$+K+3]=0),x===!0&&(i.fromBufferAttribute(G,oe),P[$+K+4]=i.x,P[$+K+5]=i.y,P[$+K+6]=i.z,P[$+K+7]=0),M===!0&&(i.fromBufferAttribute(Z,oe),P[$+K+8]=i.x,P[$+K+9]=i.y,P[$+K+10]=i.z,P[$+K+11]=Z.itemSize===4?i.w:1)}}m={count:p,texture:I,size:new ge(T,U)},n.set(c,m),c.addEventListener("dispose",k)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)u.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let v=0;for(let M=0;M<h.length;M++)v+=h[M];const x=c.morphTargetsRelative?1:1-v;u.getUniforms().setValue(r,"morphTargetBaseInfluence",x),u.getUniforms().setValue(r,"morphTargetInfluences",h)}u.getUniforms().setValue(r,"morphTargetsTexture",m.texture,t),u.getUniforms().setValue(r,"morphTargetsTextureSize",m.size)}return{update:s}}function HE(r,e,t,n){let i=new WeakMap;function s(u){const h=n.render.frame,f=u.geometry,p=e.get(u,f);if(i.get(p)!==h&&(e.update(p),i.set(p,h)),u.isInstancedMesh&&(u.hasEventListener("dispose",c)===!1&&u.addEventListener("dispose",c),i.get(u)!==h&&(t.update(u.instanceMatrix,r.ARRAY_BUFFER),u.instanceColor!==null&&t.update(u.instanceColor,r.ARRAY_BUFFER),i.set(u,h))),u.isSkinnedMesh){const m=u.skeleton;i.get(m)!==h&&(m.update(),i.set(m,h))}return p}function a(){i=new WeakMap}function c(u){const h=u.target;h.removeEventListener("dispose",c),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:s,dispose:a}}class Op extends Yt{constructor(e,t,n,i,s,a,c,u,h,f=ys){if(f!==ys&&f!==Ts)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&f===ys&&(n=gr),n===void 0&&f===Ts&&(n=bs),super(null,i,s,a,c,u,f,n,h),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=c!==void 0?c:mn,this.minFilter=u!==void 0?u:mn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const j_=new Yt,m0=new Op(1,1),Z_=new mh,J_=new Dp,K_=new al,g0=[],v0=[],_0=new Float32Array(16),x0=new Float32Array(9),y0=new Float32Array(4);function Fo(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=g0[i];if(s===void 0&&(s=new Float32Array(i),g0[i]=s),e!==0){n.toArray(s,0);for(let a=1,c=0;a!==e;++a)c+=t,r[a].toArray(s,c)}return s}function cn(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function un(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function gh(r,e){let t=v0[e];t===void 0&&(t=new Int32Array(e),v0[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function VE(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function GE(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(cn(t,e))return;r.uniform2fv(this.addr,e),un(t,e)}}function WE(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(cn(t,e))return;r.uniform3fv(this.addr,e),un(t,e)}}function XE(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(cn(t,e))return;r.uniform4fv(this.addr,e),un(t,e)}}function qE(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(cn(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),un(t,e)}else{if(cn(t,n))return;y0.set(n),r.uniformMatrix2fv(this.addr,!1,y0),un(t,n)}}function YE(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(cn(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),un(t,e)}else{if(cn(t,n))return;x0.set(n),r.uniformMatrix3fv(this.addr,!1,x0),un(t,n)}}function jE(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(cn(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),un(t,e)}else{if(cn(t,n))return;_0.set(n),r.uniformMatrix4fv(this.addr,!1,_0),un(t,n)}}function ZE(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function JE(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(cn(t,e))return;r.uniform2iv(this.addr,e),un(t,e)}}function KE(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(cn(t,e))return;r.uniform3iv(this.addr,e),un(t,e)}}function QE(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(cn(t,e))return;r.uniform4iv(this.addr,e),un(t,e)}}function $E(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function eA(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(cn(t,e))return;r.uniform2uiv(this.addr,e),un(t,e)}}function tA(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(cn(t,e))return;r.uniform3uiv(this.addr,e),un(t,e)}}function nA(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(cn(t,e))return;r.uniform4uiv(this.addr,e),un(t,e)}}function iA(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(m0.compareFunction=Ip,s=m0):s=j_,t.setTexture2D(e||s,i)}function rA(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||J_,i)}function sA(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||K_,i)}function oA(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Z_,i)}function aA(r){switch(r){case 5126:return VE;case 35664:return GE;case 35665:return WE;case 35666:return XE;case 35674:return qE;case 35675:return YE;case 35676:return jE;case 5124:case 35670:return ZE;case 35667:case 35671:return JE;case 35668:case 35672:return KE;case 35669:case 35673:return QE;case 5125:return $E;case 36294:return eA;case 36295:return tA;case 36296:return nA;case 35678:case 36198:case 36298:case 36306:case 35682:return iA;case 35679:case 36299:case 36307:return rA;case 35680:case 36300:case 36308:case 36293:return sA;case 36289:case 36303:case 36311:case 36292:return oA}}function lA(r,e){r.uniform1fv(this.addr,e)}function cA(r,e){const t=Fo(e,this.size,2);r.uniform2fv(this.addr,t)}function uA(r,e){const t=Fo(e,this.size,3);r.uniform3fv(this.addr,t)}function hA(r,e){const t=Fo(e,this.size,4);r.uniform4fv(this.addr,t)}function fA(r,e){const t=Fo(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function dA(r,e){const t=Fo(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function pA(r,e){const t=Fo(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function mA(r,e){r.uniform1iv(this.addr,e)}function gA(r,e){r.uniform2iv(this.addr,e)}function vA(r,e){r.uniform3iv(this.addr,e)}function _A(r,e){r.uniform4iv(this.addr,e)}function xA(r,e){r.uniform1uiv(this.addr,e)}function yA(r,e){r.uniform2uiv(this.addr,e)}function SA(r,e){r.uniform3uiv(this.addr,e)}function MA(r,e){r.uniform4uiv(this.addr,e)}function wA(r,e,t){const n=this.cache,i=e.length,s=gh(t,i);cn(n,s)||(r.uniform1iv(this.addr,s),un(n,s));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||j_,s[a])}function EA(r,e,t){const n=this.cache,i=e.length,s=gh(t,i);cn(n,s)||(r.uniform1iv(this.addr,s),un(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||J_,s[a])}function AA(r,e,t){const n=this.cache,i=e.length,s=gh(t,i);cn(n,s)||(r.uniform1iv(this.addr,s),un(n,s));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||K_,s[a])}function bA(r,e,t){const n=this.cache,i=e.length,s=gh(t,i);cn(n,s)||(r.uniform1iv(this.addr,s),un(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||Z_,s[a])}function TA(r){switch(r){case 5126:return lA;case 35664:return cA;case 35665:return uA;case 35666:return hA;case 35674:return fA;case 35675:return dA;case 35676:return pA;case 5124:case 35670:return mA;case 35667:case 35671:return gA;case 35668:case 35672:return vA;case 35669:case 35673:return _A;case 5125:return xA;case 36294:return yA;case 36295:return SA;case 36296:return MA;case 35678:case 36198:case 36298:case 36306:case 35682:return wA;case 35679:case 36299:case 36307:return EA;case 35680:case 36300:case 36308:case 36293:return AA;case 36289:case 36303:case 36311:case 36292:return bA}}class CA{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=aA(t.type)}}class RA{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=TA(t.type)}}class PA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,a=i.length;s!==a;++s){const c=i[s];c.setValue(e,t[c.id],n)}}}const xd=/(\w+)(\])?(\[|\.)?/g;function S0(r,e){r.seq.push(e),r.map[e.id]=e}function IA(r,e,t){const n=r.name,i=n.length;for(xd.lastIndex=0;;){const s=xd.exec(n),a=xd.lastIndex;let c=s[1];const u=s[2]==="]",h=s[3];if(u&&(c=c|0),h===void 0||h==="["&&a+2===i){S0(t,h===void 0?new CA(c,r,e):new RA(c,r,e));break}else{let p=t.map[c];p===void 0&&(p=new PA(c),S0(t,p)),t=p}}}class mu{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=e.getActiveUniform(t,i),a=e.getUniformLocation(t,s.name);IA(s,a,this)}}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){const c=t[s],u=n[c.id];u.needsUpdate!==!1&&c.setValue(e,u.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function M0(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const LA=37297;let DA=0;function UA(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=i;a<s;a++){const c=a+1;n.push(`${c===e?">":" "} ${c}: ${t[a]}`)}return n.join(`
`)}function NA(r){const e=Ut.getPrimaries(Ut.workingColorSpace),t=Ut.getPrimaries(r);let n;switch(e===t?n="":e===Ga&&t===Va?n="LinearDisplayP3ToLinearSRGB":e===Va&&t===Ga&&(n="LinearSRGBToLinearDisplayP3"),r){case _r:case rl:return[n,"LinearTransferOETF"];case _i:case ph:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",r),[n,"LinearTransferOETF"]}}function w0(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),i=r.getShaderInfoLog(e).trim();if(n&&i==="")return"";const s=/ERROR: 0:(\d+)/.exec(i);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+i+`

`+UA(r.getShaderSource(e),a)}else return i}function FA(r,e){const t=NA(e);return`vec4 ${r}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function OA(r,e){let t;switch(e){case x_:t="Linear";break;case y_:t="Reinhard";break;case S_:t="Cineon";break;case xp:t="ACESFilmic";break;case w_:t="AgX";break;case E_:t="Neutral";break;case M_:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Nc=new D;function BA(){Ut.getLuminanceCoefficients(Nc);const r=Nc.x.toFixed(4),e=Nc.y.toFixed(4),t=Nc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function zA(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ea).join(`
`)}function kA(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function HA(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),a=s.name;let c=1;s.type===r.FLOAT_MAT2&&(c=2),s.type===r.FLOAT_MAT3&&(c=3),s.type===r.FLOAT_MAT4&&(c=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:c}}return t}function Ea(r){return r!==""}function E0(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function A0(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const VA=/^[ \t]*#include +<([\w\d./]+)>/gm;function sp(r){return r.replace(VA,WA)}const GA=new Map;function WA(r,e){let t=mt[e];if(t===void 0){const n=GA.get(e);if(n!==void 0)t=mt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return sp(t)}const XA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function b0(r){return r.replace(XA,qA)}function qA(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function T0(r){let e=`precision ${r.precision} float;
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
#define LOW_PRECISION`),e}function YA(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===sh?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===Aa?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===bi&&(e="SHADOWMAP_TYPE_VSM"),e}function jA(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case mr:case kr:e="ENVMAP_TYPE_CUBE";break;case Lo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function ZA(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case kr:e="ENVMAP_MODE_REFRACTION";break}return e}function JA(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case nl:e="ENVMAP_BLENDING_MULTIPLY";break;case v_:e="ENVMAP_BLENDING_MIX";break;case __:e="ENVMAP_BLENDING_ADD";break}return e}function KA(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function QA(r,e,t,n){const i=r.getContext(),s=t.defines;let a=t.vertexShader,c=t.fragmentShader;const u=YA(t),h=jA(t),f=ZA(t),p=JA(t),m=KA(t),v=zA(t),x=kA(s),M=i.createProgram();let y,_,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Ea).join(`
`),y.length>0&&(y+=`
`),_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Ea).join(`
`),_.length>0&&(_+=`
`)):(y=[T0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ea).join(`
`),_=[T0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",t.envMap?"#define "+p:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==qi?"#define TONE_MAPPING":"",t.toneMapping!==qi?mt.tonemapping_pars_fragment:"",t.toneMapping!==qi?OA("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",mt.colorspace_pars_fragment,FA("linearToOutputTexel",t.outputColorSpace),BA(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ea).join(`
`)),a=sp(a),a=E0(a,t),a=A0(a,t),c=sp(c),c=E0(c,t),c=A0(c,t),a=b0(a),c=b0(c),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,y=[v,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,_=["#define varying in",t.glslVersion===ip?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ip?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const w=E+y+a,T=E+_+c,U=M0(i,i.VERTEX_SHADER,w),P=M0(i,i.FRAGMENT_SHADER,T);i.attachShader(M,U),i.attachShader(M,P),t.index0AttributeName!==void 0?i.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(M,0,"position"),i.linkProgram(M);function I(C){if(r.debug.checkShaderErrors){const G=i.getProgramInfoLog(M).trim(),Z=i.getShaderInfoLog(U).trim(),$=i.getShaderInfoLog(P).trim();let oe=!0,K=!0;if(i.getProgramParameter(M,i.LINK_STATUS)===!1)if(oe=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,M,U,P);else{const fe=w0(i,U,"vertex"),O=w0(i,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(M,i.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+G+`
`+fe+`
`+O)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(Z===""||$==="")&&(K=!1);K&&(C.diagnostics={runnable:oe,programLog:G,vertexShader:{log:Z,prefix:y},fragmentShader:{log:$,prefix:_}})}i.deleteShader(U),i.deleteShader(P),B=new mu(i,M),k=HA(i,M)}let B;this.getUniforms=function(){return B===void 0&&I(this),B};let k;this.getAttributes=function(){return k===void 0&&I(this),k};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=i.getProgramParameter(M,LA)),b},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=DA++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=U,this.fragmentShader=P,this}let $A=0;class eb{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new tb(e),t.set(e,n)),n}}class tb{constructor(e){this.id=$A++,this.code=e,this.usedTimes=0}}function nb(r,e,t,n,i,s,a){const c=new Ms,u=new eb,h=new Set,f=[],p=i.logarithmicDepthBuffer,m=i.reverseDepthBuffer,v=i.vertexTextures;let x=i.precision;const M={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(b){return h.add(b),b===0?"uv":`uv${b}`}function _(b,C,G,Z,$){const oe=Z.fog,K=$.geometry,fe=b.isMeshStandardMaterial?Z.environment:null,O=(b.isMeshStandardMaterial?t:e).get(b.envMap||fe),J=O&&O.mapping===Lo?O.image.height:null,q=M[b.type];b.precision!==null&&(x=i.getMaxPrecision(b.precision),x!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",x,"instead."));const re=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,xe=re!==void 0?re.length:0;let Pe=0;K.morphAttributes.position!==void 0&&(Pe=1),K.morphAttributes.normal!==void 0&&(Pe=2),K.morphAttributes.color!==void 0&&(Pe=3);let ie,me,be,Se;if(q){const _n=Ti[q];ie=_n.vertexShader,me=_n.fragmentShader}else ie=b.vertexShader,me=b.fragmentShader,u.update(b),be=u.getVertexShaderID(b),Se=u.getFragmentShaderID(b);const tt=r.getRenderTarget(),nt=$.isInstancedMesh===!0,Ze=$.isBatchedMesh===!0,Ie=!!b.map,de=!!b.matcap,N=!!O,Te=!!b.aoMap,we=!!b.lightMap,_e=!!b.bumpMap,Ee=!!b.normalMap,Je=!!b.displacementMap,De=!!b.emissiveMap,F=!!b.metalnessMap,R=!!b.roughnessMap,Q=b.anisotropy>0,ue=b.clearcoat>0,pe=b.dispersion>0,he=b.iridescence>0,Ye=b.sheen>0,Ce=b.transmission>0,ke=Q&&!!b.anisotropyMap,Mt=ue&&!!b.clearcoatMap,ye=ue&&!!b.clearcoatNormalMap,He=ue&&!!b.clearcoatRoughnessMap,at=he&&!!b.iridescenceMap,lt=he&&!!b.iridescenceThicknessMap,Ve=Ye&&!!b.sheenColorMap,wt=Ye&&!!b.sheenRoughnessMap,ut=!!b.specularMap,Ft=!!b.specularColorMap,V=!!b.specularIntensityMap,Be=Ce&&!!b.transmissionMap,le=Ce&&!!b.thicknessMap,ve=!!b.gradientMap,Fe=!!b.alphaMap,ze=b.alphaTest>0,Et=!!b.alphaHash,Wt=!!b.extensions;let En=qi;b.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(En=r.toneMapping);const At={shaderID:q,shaderType:b.type,shaderName:b.name,vertexShader:ie,fragmentShader:me,defines:b.defines,customVertexShaderID:be,customFragmentShaderID:Se,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:x,batching:Ze,batchingColor:Ze&&$._colorsTexture!==null,instancing:nt,instancingColor:nt&&$.instanceColor!==null,instancingMorph:nt&&$.morphTexture!==null,supportsVertexTextures:v,outputColorSpace:tt===null?r.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:_r,alphaToCoverage:!!b.alphaToCoverage,map:Ie,matcap:de,envMap:N,envMapMode:N&&O.mapping,envMapCubeUVHeight:J,aoMap:Te,lightMap:we,bumpMap:_e,normalMap:Ee,displacementMap:v&&Je,emissiveMap:De,normalMapObjectSpace:Ee&&b.normalMapType===I_,normalMapTangentSpace:Ee&&b.normalMapType===Vr,metalnessMap:F,roughnessMap:R,anisotropy:Q,anisotropyMap:ke,clearcoat:ue,clearcoatMap:Mt,clearcoatNormalMap:ye,clearcoatRoughnessMap:He,dispersion:pe,iridescence:he,iridescenceMap:at,iridescenceThicknessMap:lt,sheen:Ye,sheenColorMap:Ve,sheenRoughnessMap:wt,specularMap:ut,specularColorMap:Ft,specularIntensityMap:V,transmission:Ce,transmissionMap:Be,thicknessMap:le,gradientMap:ve,opaque:b.transparent===!1&&b.blending===xs&&b.alphaToCoverage===!1,alphaMap:Fe,alphaTest:ze,alphaHash:Et,combine:b.combine,mapUv:Ie&&y(b.map.channel),aoMapUv:Te&&y(b.aoMap.channel),lightMapUv:we&&y(b.lightMap.channel),bumpMapUv:_e&&y(b.bumpMap.channel),normalMapUv:Ee&&y(b.normalMap.channel),displacementMapUv:Je&&y(b.displacementMap.channel),emissiveMapUv:De&&y(b.emissiveMap.channel),metalnessMapUv:F&&y(b.metalnessMap.channel),roughnessMapUv:R&&y(b.roughnessMap.channel),anisotropyMapUv:ke&&y(b.anisotropyMap.channel),clearcoatMapUv:Mt&&y(b.clearcoatMap.channel),clearcoatNormalMapUv:ye&&y(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:He&&y(b.clearcoatRoughnessMap.channel),iridescenceMapUv:at&&y(b.iridescenceMap.channel),iridescenceThicknessMapUv:lt&&y(b.iridescenceThicknessMap.channel),sheenColorMapUv:Ve&&y(b.sheenColorMap.channel),sheenRoughnessMapUv:wt&&y(b.sheenRoughnessMap.channel),specularMapUv:ut&&y(b.specularMap.channel),specularColorMapUv:Ft&&y(b.specularColorMap.channel),specularIntensityMapUv:V&&y(b.specularIntensityMap.channel),transmissionMapUv:Be&&y(b.transmissionMap.channel),thicknessMapUv:le&&y(b.thicknessMap.channel),alphaMapUv:Fe&&y(b.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(Ee||Q),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:$.isPoints===!0&&!!K.attributes.uv&&(Ie||Fe),fog:!!oe,useFog:b.fog===!0,fogExp2:!!oe&&oe.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:p,reverseDepthBuffer:m,skinning:$.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:Pe,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:r.shadowMap.enabled&&G.length>0,shadowMapType:r.shadowMap.type,toneMapping:En,decodeVideoTexture:Ie&&b.map.isVideoTexture===!0&&Ut.getTransfer(b.map.colorSpace)===kt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ci,flipSided:b.side===Hn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Wt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Wt&&b.extensions.multiDraw===!0||Ze)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return At.vertexUv1s=h.has(1),At.vertexUv2s=h.has(2),At.vertexUv3s=h.has(3),h.clear(),At}function E(b){const C=[];if(b.shaderID?C.push(b.shaderID):(C.push(b.customVertexShaderID),C.push(b.customFragmentShaderID)),b.defines!==void 0)for(const G in b.defines)C.push(G),C.push(b.defines[G]);return b.isRawShaderMaterial===!1&&(w(C,b),T(C,b),C.push(r.outputColorSpace)),C.push(b.customProgramCacheKey),C.join()}function w(b,C){b.push(C.precision),b.push(C.outputColorSpace),b.push(C.envMapMode),b.push(C.envMapCubeUVHeight),b.push(C.mapUv),b.push(C.alphaMapUv),b.push(C.lightMapUv),b.push(C.aoMapUv),b.push(C.bumpMapUv),b.push(C.normalMapUv),b.push(C.displacementMapUv),b.push(C.emissiveMapUv),b.push(C.metalnessMapUv),b.push(C.roughnessMapUv),b.push(C.anisotropyMapUv),b.push(C.clearcoatMapUv),b.push(C.clearcoatNormalMapUv),b.push(C.clearcoatRoughnessMapUv),b.push(C.iridescenceMapUv),b.push(C.iridescenceThicknessMapUv),b.push(C.sheenColorMapUv),b.push(C.sheenRoughnessMapUv),b.push(C.specularMapUv),b.push(C.specularColorMapUv),b.push(C.specularIntensityMapUv),b.push(C.transmissionMapUv),b.push(C.thicknessMapUv),b.push(C.combine),b.push(C.fogExp2),b.push(C.sizeAttenuation),b.push(C.morphTargetsCount),b.push(C.morphAttributeCount),b.push(C.numDirLights),b.push(C.numPointLights),b.push(C.numSpotLights),b.push(C.numSpotLightMaps),b.push(C.numHemiLights),b.push(C.numRectAreaLights),b.push(C.numDirLightShadows),b.push(C.numPointLightShadows),b.push(C.numSpotLightShadows),b.push(C.numSpotLightShadowsWithMaps),b.push(C.numLightProbes),b.push(C.shadowMapType),b.push(C.toneMapping),b.push(C.numClippingPlanes),b.push(C.numClipIntersection),b.push(C.depthPacking)}function T(b,C){c.disableAll(),C.supportsVertexTextures&&c.enable(0),C.instancing&&c.enable(1),C.instancingColor&&c.enable(2),C.instancingMorph&&c.enable(3),C.matcap&&c.enable(4),C.envMap&&c.enable(5),C.normalMapObjectSpace&&c.enable(6),C.normalMapTangentSpace&&c.enable(7),C.clearcoat&&c.enable(8),C.iridescence&&c.enable(9),C.alphaTest&&c.enable(10),C.vertexColors&&c.enable(11),C.vertexAlphas&&c.enable(12),C.vertexUv1s&&c.enable(13),C.vertexUv2s&&c.enable(14),C.vertexUv3s&&c.enable(15),C.vertexTangents&&c.enable(16),C.anisotropy&&c.enable(17),C.alphaHash&&c.enable(18),C.batching&&c.enable(19),C.dispersion&&c.enable(20),C.batchingColor&&c.enable(21),b.push(c.mask),c.disableAll(),C.fog&&c.enable(0),C.useFog&&c.enable(1),C.flatShading&&c.enable(2),C.logarithmicDepthBuffer&&c.enable(3),C.reverseDepthBuffer&&c.enable(4),C.skinning&&c.enable(5),C.morphTargets&&c.enable(6),C.morphNormals&&c.enable(7),C.morphColors&&c.enable(8),C.premultipliedAlpha&&c.enable(9),C.shadowMapEnabled&&c.enable(10),C.doubleSided&&c.enable(11),C.flipSided&&c.enable(12),C.useDepthPacking&&c.enable(13),C.dithering&&c.enable(14),C.transmission&&c.enable(15),C.sheen&&c.enable(16),C.opaque&&c.enable(17),C.pointsUvs&&c.enable(18),C.decodeVideoTexture&&c.enable(19),C.alphaToCoverage&&c.enable(20),b.push(c.mask)}function U(b){const C=M[b.type];let G;if(C){const Z=Ti[C];G=Ya.clone(Z.uniforms)}else G=b.uniforms;return G}function P(b,C){let G;for(let Z=0,$=f.length;Z<$;Z++){const oe=f[Z];if(oe.cacheKey===C){G=oe,++G.usedTimes;break}}return G===void 0&&(G=new QA(r,C,b,s),f.push(G)),G}function I(b){if(--b.usedTimes===0){const C=f.indexOf(b);f[C]=f[f.length-1],f.pop(),b.destroy()}}function B(b){u.remove(b)}function k(){u.dispose()}return{getParameters:_,getProgramCacheKey:E,getUniforms:U,acquireProgram:P,releaseProgram:I,releaseShaderCache:B,programs:f,dispose:k}}function ib(){let r=new WeakMap;function e(a){return r.has(a)}function t(a){let c=r.get(a);return c===void 0&&(c={},r.set(a,c)),c}function n(a){r.delete(a)}function i(a,c,u){r.get(a)[c]=u}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function rb(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function C0(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function R0(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function a(p,m,v,x,M,y){let _=r[e];return _===void 0?(_={id:p.id,object:p,geometry:m,material:v,groupOrder:x,renderOrder:p.renderOrder,z:M,group:y},r[e]=_):(_.id=p.id,_.object=p,_.geometry=m,_.material=v,_.groupOrder=x,_.renderOrder=p.renderOrder,_.z=M,_.group=y),e++,_}function c(p,m,v,x,M,y){const _=a(p,m,v,x,M,y);v.transmission>0?n.push(_):v.transparent===!0?i.push(_):t.push(_)}function u(p,m,v,x,M,y){const _=a(p,m,v,x,M,y);v.transmission>0?n.unshift(_):v.transparent===!0?i.unshift(_):t.unshift(_)}function h(p,m){t.length>1&&t.sort(p||rb),n.length>1&&n.sort(m||C0),i.length>1&&i.sort(m||C0)}function f(){for(let p=e,m=r.length;p<m;p++){const v=r[p];if(v.id===null)break;v.id=null,v.object=null,v.geometry=null,v.material=null,v.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:c,unshift:u,finish:f,sort:h}}function sb(){let r=new WeakMap;function e(n,i){const s=r.get(n);let a;return s===void 0?(a=new R0,r.set(n,[a])):i>=s.length?(a=new R0,s.push(a)):a=s[i],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function ob(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Ue};break;case"SpotLight":t={position:new D,direction:new D,color:new Ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Ue,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Ue,groundColor:new Ue};break;case"RectAreaLight":t={color:new Ue,position:new D,halfWidth:new D,halfHeight:new D};break}return r[e.id]=t,t}}}function ab(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ge};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ge};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ge,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let lb=0;function cb(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function ub(r){const e=new ob,t=ab(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new D);const i=new D,s=new rt,a=new rt;function c(h){let f=0,p=0,m=0;for(let k=0;k<9;k++)n.probe[k].set(0,0,0);let v=0,x=0,M=0,y=0,_=0,E=0,w=0,T=0,U=0,P=0,I=0;h.sort(cb);for(let k=0,b=h.length;k<b;k++){const C=h[k],G=C.color,Z=C.intensity,$=C.distance,oe=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)f+=G.r*Z,p+=G.g*Z,m+=G.b*Z;else if(C.isLightProbe){for(let K=0;K<9;K++)n.probe[K].addScaledVector(C.sh.coefficients[K],Z);I++}else if(C.isDirectionalLight){const K=e.get(C);if(K.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const fe=C.shadow,O=t.get(C);O.shadowIntensity=fe.intensity,O.shadowBias=fe.bias,O.shadowNormalBias=fe.normalBias,O.shadowRadius=fe.radius,O.shadowMapSize=fe.mapSize,n.directionalShadow[v]=O,n.directionalShadowMap[v]=oe,n.directionalShadowMatrix[v]=C.shadow.matrix,E++}n.directional[v]=K,v++}else if(C.isSpotLight){const K=e.get(C);K.position.setFromMatrixPosition(C.matrixWorld),K.color.copy(G).multiplyScalar(Z),K.distance=$,K.coneCos=Math.cos(C.angle),K.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),K.decay=C.decay,n.spot[M]=K;const fe=C.shadow;if(C.map&&(n.spotLightMap[U]=C.map,U++,fe.updateMatrices(C),C.castShadow&&P++),n.spotLightMatrix[M]=fe.matrix,C.castShadow){const O=t.get(C);O.shadowIntensity=fe.intensity,O.shadowBias=fe.bias,O.shadowNormalBias=fe.normalBias,O.shadowRadius=fe.radius,O.shadowMapSize=fe.mapSize,n.spotShadow[M]=O,n.spotShadowMap[M]=oe,T++}M++}else if(C.isRectAreaLight){const K=e.get(C);K.color.copy(G).multiplyScalar(Z),K.halfWidth.set(C.width*.5,0,0),K.halfHeight.set(0,C.height*.5,0),n.rectArea[y]=K,y++}else if(C.isPointLight){const K=e.get(C);if(K.color.copy(C.color).multiplyScalar(C.intensity),K.distance=C.distance,K.decay=C.decay,C.castShadow){const fe=C.shadow,O=t.get(C);O.shadowIntensity=fe.intensity,O.shadowBias=fe.bias,O.shadowNormalBias=fe.normalBias,O.shadowRadius=fe.radius,O.shadowMapSize=fe.mapSize,O.shadowCameraNear=fe.camera.near,O.shadowCameraFar=fe.camera.far,n.pointShadow[x]=O,n.pointShadowMap[x]=oe,n.pointShadowMatrix[x]=C.shadow.matrix,w++}n.point[x]=K,x++}else if(C.isHemisphereLight){const K=e.get(C);K.skyColor.copy(C.color).multiplyScalar(Z),K.groundColor.copy(C.groundColor).multiplyScalar(Z),n.hemi[_]=K,_++}}y>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Re.LTC_FLOAT_1,n.rectAreaLTC2=Re.LTC_FLOAT_2):(n.rectAreaLTC1=Re.LTC_HALF_1,n.rectAreaLTC2=Re.LTC_HALF_2)),n.ambient[0]=f,n.ambient[1]=p,n.ambient[2]=m;const B=n.hash;(B.directionalLength!==v||B.pointLength!==x||B.spotLength!==M||B.rectAreaLength!==y||B.hemiLength!==_||B.numDirectionalShadows!==E||B.numPointShadows!==w||B.numSpotShadows!==T||B.numSpotMaps!==U||B.numLightProbes!==I)&&(n.directional.length=v,n.spot.length=M,n.rectArea.length=y,n.point.length=x,n.hemi.length=_,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=T,n.spotShadowMap.length=T,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=T+U-P,n.spotLightMap.length=U,n.numSpotLightShadowsWithMaps=P,n.numLightProbes=I,B.directionalLength=v,B.pointLength=x,B.spotLength=M,B.rectAreaLength=y,B.hemiLength=_,B.numDirectionalShadows=E,B.numPointShadows=w,B.numSpotShadows=T,B.numSpotMaps=U,B.numLightProbes=I,n.version=lb++)}function u(h,f){let p=0,m=0,v=0,x=0,M=0;const y=f.matrixWorldInverse;for(let _=0,E=h.length;_<E;_++){const w=h[_];if(w.isDirectionalLight){const T=n.directional[p];T.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),T.direction.sub(i),T.direction.transformDirection(y),p++}else if(w.isSpotLight){const T=n.spot[v];T.position.setFromMatrixPosition(w.matrixWorld),T.position.applyMatrix4(y),T.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),T.direction.sub(i),T.direction.transformDirection(y),v++}else if(w.isRectAreaLight){const T=n.rectArea[x];T.position.setFromMatrixPosition(w.matrixWorld),T.position.applyMatrix4(y),a.identity(),s.copy(w.matrixWorld),s.premultiply(y),a.extractRotation(s),T.halfWidth.set(w.width*.5,0,0),T.halfHeight.set(0,w.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),x++}else if(w.isPointLight){const T=n.point[m];T.position.setFromMatrixPosition(w.matrixWorld),T.position.applyMatrix4(y),m++}else if(w.isHemisphereLight){const T=n.hemi[M];T.direction.setFromMatrixPosition(w.matrixWorld),T.direction.transformDirection(y),M++}}}return{setup:c,setupView:u,state:n}}function P0(r){const e=new ub(r),t=[],n=[];function i(f){h.camera=f,t.length=0,n.length=0}function s(f){t.push(f)}function a(f){n.push(f)}function c(){e.setup(t)}function u(f){e.setupView(t,f)}const h={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:h,setupLights:c,setupLightsView:u,pushLight:s,pushShadow:a}}function hb(r){let e=new WeakMap;function t(i,s=0){const a=e.get(i);let c;return a===void 0?(c=new P0(r),e.set(i,[c])):s>=a.length?(c=new P0(r),a.push(c)):c=a[s],c}function n(){e=new WeakMap}return{get:t,dispose:n}}class Bp extends wn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=R_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class zp extends wn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const fb=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,db=`uniform sampler2D shadow_pass;
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
}`;function pb(r,e,t){let n=new ll;const i=new ge,s=new ge,a=new xt,c=new Bp({depthPacking:P_}),u=new zp,h={},f=t.maxTextureSize,p={[pr]:Hn,[Hn]:pr,[Ci]:Ci},m=new ai({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ge},radius:{value:4}},vertexShader:fb,fragmentShader:db}),v=m.clone();v.defines.HORIZONTAL_PASS=1;const x=new gt;x.setAttribute("position",new Bt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new en(x,m),y=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=sh;let _=this.type;this.render=function(P,I,B){if(y.enabled===!1||y.autoUpdate===!1&&y.needsUpdate===!1||P.length===0)return;const k=r.getRenderTarget(),b=r.getActiveCubeFace(),C=r.getActiveMipmapLevel(),G=r.state;G.setBlending(dr),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const Z=_!==bi&&this.type===bi,$=_===bi&&this.type!==bi;for(let oe=0,K=P.length;oe<K;oe++){const fe=P[oe],O=fe.shadow;if(O===void 0){console.warn("THREE.WebGLShadowMap:",fe,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;i.copy(O.mapSize);const J=O.getFrameExtents();if(i.multiply(J),s.copy(O.mapSize),(i.x>f||i.y>f)&&(i.x>f&&(s.x=Math.floor(f/J.x),i.x=s.x*J.x,O.mapSize.x=s.x),i.y>f&&(s.y=Math.floor(f/J.y),i.y=s.y*J.y,O.mapSize.y=s.y)),O.map===null||Z===!0||$===!0){const re=this.type!==bi?{minFilter:mn,magFilter:mn}:{};O.map!==null&&O.map.dispose(),O.map=new Pi(i.x,i.y,re),O.map.texture.name=fe.name+".shadowMap",O.camera.updateProjectionMatrix()}r.setRenderTarget(O.map),r.clear();const q=O.getViewportCount();for(let re=0;re<q;re++){const xe=O.getViewport(re);a.set(s.x*xe.x,s.y*xe.y,s.x*xe.z,s.y*xe.w),G.viewport(a),O.updateMatrices(fe,re),n=O.getFrustum(),T(I,B,O.camera,fe,this.type)}O.isPointLightShadow!==!0&&this.type===bi&&E(O,B),O.needsUpdate=!1}_=this.type,y.needsUpdate=!1,r.setRenderTarget(k,b,C)};function E(P,I){const B=e.update(M);m.defines.VSM_SAMPLES!==P.blurSamples&&(m.defines.VSM_SAMPLES=P.blurSamples,v.defines.VSM_SAMPLES=P.blurSamples,m.needsUpdate=!0,v.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new Pi(i.x,i.y)),m.uniforms.shadow_pass.value=P.map.texture,m.uniforms.resolution.value=P.mapSize,m.uniforms.radius.value=P.radius,r.setRenderTarget(P.mapPass),r.clear(),r.renderBufferDirect(I,null,B,m,M,null),v.uniforms.shadow_pass.value=P.mapPass.texture,v.uniforms.resolution.value=P.mapSize,v.uniforms.radius.value=P.radius,r.setRenderTarget(P.map),r.clear(),r.renderBufferDirect(I,null,B,v,M,null)}function w(P,I,B,k){let b=null;const C=B.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(C!==void 0)b=C;else if(b=B.isPointLight===!0?u:c,r.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0){const G=b.uuid,Z=I.uuid;let $=h[G];$===void 0&&($={},h[G]=$);let oe=$[Z];oe===void 0&&(oe=b.clone(),$[Z]=oe,I.addEventListener("dispose",U)),b=oe}if(b.visible=I.visible,b.wireframe=I.wireframe,k===bi?b.side=I.shadowSide!==null?I.shadowSide:I.side:b.side=I.shadowSide!==null?I.shadowSide:p[I.side],b.alphaMap=I.alphaMap,b.alphaTest=I.alphaTest,b.map=I.map,b.clipShadows=I.clipShadows,b.clippingPlanes=I.clippingPlanes,b.clipIntersection=I.clipIntersection,b.displacementMap=I.displacementMap,b.displacementScale=I.displacementScale,b.displacementBias=I.displacementBias,b.wireframeLinewidth=I.wireframeLinewidth,b.linewidth=I.linewidth,B.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const G=r.properties.get(b);G.light=B}return b}function T(P,I,B,k,b){if(P.visible===!1)return;if(P.layers.test(I.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&b===bi)&&(!P.frustumCulled||n.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,P.matrixWorld);const Z=e.update(P),$=P.material;if(Array.isArray($)){const oe=Z.groups;for(let K=0,fe=oe.length;K<fe;K++){const O=oe[K],J=$[O.materialIndex];if(J&&J.visible){const q=w(P,J,k,b);P.onBeforeShadow(r,P,I,B,Z,q,O),r.renderBufferDirect(B,null,Z,q,P,O),P.onAfterShadow(r,P,I,B,Z,q,O)}}}else if($.visible){const oe=w(P,$,k,b);P.onBeforeShadow(r,P,I,B,Z,oe,null),r.renderBufferDirect(B,null,Z,oe,P,null),P.onAfterShadow(r,P,I,B,Z,oe,null)}}const G=P.children;for(let Z=0,$=G.length;Z<$;Z++)T(G[Z],I,B,k,b)}function U(P){P.target.removeEventListener("dispose",U);for(const B in h){const k=h[B],b=P.target.uuid;b in k&&(k[b].dispose(),delete k[b])}}}const mb={[xu]:yu,[Su]:Eu,[Mu]:Au,[As]:wu,[yu]:xu,[Eu]:Su,[Au]:Mu,[wu]:As};function gb(r){function e(){let V=!1;const Be=new xt;let le=null;const ve=new xt(0,0,0,0);return{setMask:function(Fe){le!==Fe&&!V&&(r.colorMask(Fe,Fe,Fe,Fe),le=Fe)},setLocked:function(Fe){V=Fe},setClear:function(Fe,ze,Et,Wt,En){En===!0&&(Fe*=Wt,ze*=Wt,Et*=Wt),Be.set(Fe,ze,Et,Wt),ve.equals(Be)===!1&&(r.clearColor(Fe,ze,Et,Wt),ve.copy(Be))},reset:function(){V=!1,le=null,ve.set(-1,0,0,0)}}}function t(){let V=!1,Be=!1,le=null,ve=null,Fe=null;return{setReversed:function(ze){Be=ze},setTest:function(ze){ze?be(r.DEPTH_TEST):Se(r.DEPTH_TEST)},setMask:function(ze){le!==ze&&!V&&(r.depthMask(ze),le=ze)},setFunc:function(ze){if(Be&&(ze=mb[ze]),ve!==ze){switch(ze){case xu:r.depthFunc(r.NEVER);break;case yu:r.depthFunc(r.ALWAYS);break;case Su:r.depthFunc(r.LESS);break;case As:r.depthFunc(r.LEQUAL);break;case Mu:r.depthFunc(r.EQUAL);break;case wu:r.depthFunc(r.GEQUAL);break;case Eu:r.depthFunc(r.GREATER);break;case Au:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}ve=ze}},setLocked:function(ze){V=ze},setClear:function(ze){Fe!==ze&&(r.clearDepth(ze),Fe=ze)},reset:function(){V=!1,le=null,ve=null,Fe=null}}}function n(){let V=!1,Be=null,le=null,ve=null,Fe=null,ze=null,Et=null,Wt=null,En=null;return{setTest:function(At){V||(At?be(r.STENCIL_TEST):Se(r.STENCIL_TEST))},setMask:function(At){Be!==At&&!V&&(r.stencilMask(At),Be=At)},setFunc:function(At,_n,li){(le!==At||ve!==_n||Fe!==li)&&(r.stencilFunc(At,_n,li),le=At,ve=_n,Fe=li)},setOp:function(At,_n,li){(ze!==At||Et!==_n||Wt!==li)&&(r.stencilOp(At,_n,li),ze=At,Et=_n,Wt=li)},setLocked:function(At){V=At},setClear:function(At){En!==At&&(r.clearStencil(At),En=At)},reset:function(){V=!1,Be=null,le=null,ve=null,Fe=null,ze=null,Et=null,Wt=null,En=null}}}const i=new e,s=new t,a=new n,c=new WeakMap,u=new WeakMap;let h={},f={},p=new WeakMap,m=[],v=null,x=!1,M=null,y=null,_=null,E=null,w=null,T=null,U=null,P=new Ue(0,0,0),I=0,B=!1,k=null,b=null,C=null,G=null,Z=null;const $=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let oe=!1,K=0;const fe=r.getParameter(r.VERSION);fe.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(fe)[1]),oe=K>=1):fe.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(fe)[1]),oe=K>=2);let O=null,J={};const q=r.getParameter(r.SCISSOR_BOX),re=r.getParameter(r.VIEWPORT),xe=new xt().fromArray(q),Pe=new xt().fromArray(re);function ie(V,Be,le,ve){const Fe=new Uint8Array(4),ze=r.createTexture();r.bindTexture(V,ze),r.texParameteri(V,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(V,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Et=0;Et<le;Et++)V===r.TEXTURE_3D||V===r.TEXTURE_2D_ARRAY?r.texImage3D(Be,0,r.RGBA,1,1,ve,0,r.RGBA,r.UNSIGNED_BYTE,Fe):r.texImage2D(Be+Et,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Fe);return ze}const me={};me[r.TEXTURE_2D]=ie(r.TEXTURE_2D,r.TEXTURE_2D,1),me[r.TEXTURE_CUBE_MAP]=ie(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),me[r.TEXTURE_2D_ARRAY]=ie(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),me[r.TEXTURE_3D]=ie(r.TEXTURE_3D,r.TEXTURE_3D,1,1),i.setClear(0,0,0,1),s.setClear(1),a.setClear(0),be(r.DEPTH_TEST),s.setFunc(As),we(!1),_e(Kd),be(r.CULL_FACE),N(dr);function be(V){h[V]!==!0&&(r.enable(V),h[V]=!0)}function Se(V){h[V]!==!1&&(r.disable(V),h[V]=!1)}function tt(V,Be){return f[V]!==Be?(r.bindFramebuffer(V,Be),f[V]=Be,V===r.DRAW_FRAMEBUFFER&&(f[r.FRAMEBUFFER]=Be),V===r.FRAMEBUFFER&&(f[r.DRAW_FRAMEBUFFER]=Be),!0):!1}function nt(V,Be){let le=m,ve=!1;if(V){le=p.get(Be),le===void 0&&(le=[],p.set(Be,le));const Fe=V.textures;if(le.length!==Fe.length||le[0]!==r.COLOR_ATTACHMENT0){for(let ze=0,Et=Fe.length;ze<Et;ze++)le[ze]=r.COLOR_ATTACHMENT0+ze;le.length=Fe.length,ve=!0}}else le[0]!==r.BACK&&(le[0]=r.BACK,ve=!0);ve&&r.drawBuffers(le)}function Ze(V){return v!==V?(r.useProgram(V),v=V,!0):!1}const Ie={[zr]:r.FUNC_ADD,[e_]:r.FUNC_SUBTRACT,[t_]:r.FUNC_REVERSE_SUBTRACT};Ie[n_]=r.MIN,Ie[i_]=r.MAX;const de={[r_]:r.ZERO,[s_]:r.ONE,[o_]:r.SRC_COLOR,[vu]:r.SRC_ALPHA,[f_]:r.SRC_ALPHA_SATURATE,[u_]:r.DST_COLOR,[l_]:r.DST_ALPHA,[a_]:r.ONE_MINUS_SRC_COLOR,[_u]:r.ONE_MINUS_SRC_ALPHA,[h_]:r.ONE_MINUS_DST_COLOR,[c_]:r.ONE_MINUS_DST_ALPHA,[d_]:r.CONSTANT_COLOR,[p_]:r.ONE_MINUS_CONSTANT_COLOR,[m_]:r.CONSTANT_ALPHA,[g_]:r.ONE_MINUS_CONSTANT_ALPHA};function N(V,Be,le,ve,Fe,ze,Et,Wt,En,At){if(V===dr){x===!0&&(Se(r.BLEND),x=!1);return}if(x===!1&&(be(r.BLEND),x=!0),V!==$v){if(V!==M||At!==B){if((y!==zr||w!==zr)&&(r.blendEquation(r.FUNC_ADD),y=zr,w=zr),At)switch(V){case xs:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Qd:r.blendFunc(r.ONE,r.ONE);break;case $d:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case ep:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case xs:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Qd:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case $d:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case ep:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}_=null,E=null,T=null,U=null,P.set(0,0,0),I=0,M=V,B=At}return}Fe=Fe||Be,ze=ze||le,Et=Et||ve,(Be!==y||Fe!==w)&&(r.blendEquationSeparate(Ie[Be],Ie[Fe]),y=Be,w=Fe),(le!==_||ve!==E||ze!==T||Et!==U)&&(r.blendFuncSeparate(de[le],de[ve],de[ze],de[Et]),_=le,E=ve,T=ze,U=Et),(Wt.equals(P)===!1||En!==I)&&(r.blendColor(Wt.r,Wt.g,Wt.b,En),P.copy(Wt),I=En),M=V,B=!1}function Te(V,Be){V.side===Ci?Se(r.CULL_FACE):be(r.CULL_FACE);let le=V.side===Hn;Be&&(le=!le),we(le),V.blending===xs&&V.transparent===!1?N(dr):N(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),s.setFunc(V.depthFunc),s.setTest(V.depthTest),s.setMask(V.depthWrite),i.setMask(V.colorWrite);const ve=V.stencilWrite;a.setTest(ve),ve&&(a.setMask(V.stencilWriteMask),a.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),a.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),Je(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?be(r.SAMPLE_ALPHA_TO_COVERAGE):Se(r.SAMPLE_ALPHA_TO_COVERAGE)}function we(V){k!==V&&(V?r.frontFace(r.CW):r.frontFace(r.CCW),k=V)}function _e(V){V!==Jv?(be(r.CULL_FACE),V!==b&&(V===Kd?r.cullFace(r.BACK):V===Kv?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Se(r.CULL_FACE),b=V}function Ee(V){V!==C&&(oe&&r.lineWidth(V),C=V)}function Je(V,Be,le){V?(be(r.POLYGON_OFFSET_FILL),(G!==Be||Z!==le)&&(r.polygonOffset(Be,le),G=Be,Z=le)):Se(r.POLYGON_OFFSET_FILL)}function De(V){V?be(r.SCISSOR_TEST):Se(r.SCISSOR_TEST)}function F(V){V===void 0&&(V=r.TEXTURE0+$-1),O!==V&&(r.activeTexture(V),O=V)}function R(V,Be,le){le===void 0&&(O===null?le=r.TEXTURE0+$-1:le=O);let ve=J[le];ve===void 0&&(ve={type:void 0,texture:void 0},J[le]=ve),(ve.type!==V||ve.texture!==Be)&&(O!==le&&(r.activeTexture(le),O=le),r.bindTexture(V,Be||me[V]),ve.type=V,ve.texture=Be)}function Q(){const V=J[O];V!==void 0&&V.type!==void 0&&(r.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function ue(){try{r.compressedTexImage2D.apply(r,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function pe(){try{r.compressedTexImage3D.apply(r,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function he(){try{r.texSubImage2D.apply(r,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ye(){try{r.texSubImage3D.apply(r,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ce(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ke(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Mt(){try{r.texStorage2D.apply(r,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ye(){try{r.texStorage3D.apply(r,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function He(){try{r.texImage2D.apply(r,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function at(){try{r.texImage3D.apply(r,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function lt(V){xe.equals(V)===!1&&(r.scissor(V.x,V.y,V.z,V.w),xe.copy(V))}function Ve(V){Pe.equals(V)===!1&&(r.viewport(V.x,V.y,V.z,V.w),Pe.copy(V))}function wt(V,Be){let le=u.get(Be);le===void 0&&(le=new WeakMap,u.set(Be,le));let ve=le.get(V);ve===void 0&&(ve=r.getUniformBlockIndex(Be,V.name),le.set(V,ve))}function ut(V,Be){const ve=u.get(Be).get(V);c.get(Be)!==ve&&(r.uniformBlockBinding(Be,ve,V.__bindingPointIndex),c.set(Be,ve))}function Ft(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},O=null,J={},f={},p=new WeakMap,m=[],v=null,x=!1,M=null,y=null,_=null,E=null,w=null,T=null,U=null,P=new Ue(0,0,0),I=0,B=!1,k=null,b=null,C=null,G=null,Z=null,xe.set(0,0,r.canvas.width,r.canvas.height),Pe.set(0,0,r.canvas.width,r.canvas.height),i.reset(),s.reset(),a.reset()}return{buffers:{color:i,depth:s,stencil:a},enable:be,disable:Se,bindFramebuffer:tt,drawBuffers:nt,useProgram:Ze,setBlending:N,setMaterial:Te,setFlipSided:we,setCullFace:_e,setLineWidth:Ee,setPolygonOffset:Je,setScissorTest:De,activeTexture:F,bindTexture:R,unbindTexture:Q,compressedTexImage2D:ue,compressedTexImage3D:pe,texImage2D:He,texImage3D:at,updateUBOMapping:wt,uniformBlockBinding:ut,texStorage2D:Mt,texStorage3D:ye,texSubImage2D:he,texSubImage3D:Ye,compressedTexSubImage2D:Ce,compressedTexSubImage3D:ke,scissor:lt,viewport:Ve,reset:Ft}}function vb(r,e){const t=r.image&&r.image.width?r.image.width/r.image.height:1;return t>e?(r.repeat.x=1,r.repeat.y=t/e,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2):(r.repeat.x=e/t,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0),r}function _b(r,e){const t=r.image&&r.image.width?r.image.width/r.image.height:1;return t>e?(r.repeat.x=e/t,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0):(r.repeat.x=1,r.repeat.y=t/e,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2),r}function xb(r){return r.repeat.x=1,r.repeat.y=1,r.offset.x=0,r.offset.y=0,r}function op(r,e,t,n){const i=yb(n);switch(t){case Ep:return r*e;case bp:return r*e;case Tp:return r*e*2;case uh:return r*e/i.components*i.byteLength;case il:return r*e/i.components*i.byteLength;case Cp:return r*e*2/i.components*i.byteLength;case hh:return r*e*2/i.components*i.byteLength;case Ap:return r*e*3/i.components*i.byteLength;case Ln:return r*e*4/i.components*i.byteLength;case fh:return r*e*4/i.components*i.byteLength;case Ta:case Ca:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Ra:case Pa:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Tu:case Ru:return Math.max(r,16)*Math.max(e,8)/4;case bu:case Cu:return Math.max(r,8)*Math.max(e,8)/2;case Pu:case Iu:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Lu:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Du:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Uu:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case Nu:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case Fu:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case Ou:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case Bu:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case zu:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case ku:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case Hu:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case Vu:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case Gu:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case Wu:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case Xu:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case qu:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case Ia:case Yu:case ju:return Math.ceil(r/4)*Math.ceil(e/4)*16;case Rp:case Zu:return Math.ceil(r/4)*Math.ceil(e/4)*8;case Ju:case Ku:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function yb(r){switch(r){case Ri:case Sp:return{byteLength:1,components:1};case Ao:case Mp:case Do:return{byteLength:2,components:1};case lh:case ch:return{byteLength:2,components:4};case gr:case ah:case jn:return{byteLength:4,components:1};case wp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}const Sb={contain:vb,cover:_b,fill:xb,getByteLength:op};function Mb(r,e,t,n,i,s,a){const c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,u=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new ge,f=new WeakMap;let p;const m=new WeakMap;let v=!1;try{v=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(F,R){return v?new OffscreenCanvas(F,R):qa("canvas")}function M(F,R,Q){let ue=1;const pe=De(F);if((pe.width>Q||pe.height>Q)&&(ue=Q/Math.max(pe.width,pe.height)),ue<1)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap||typeof VideoFrame<"u"&&F instanceof VideoFrame){const he=Math.floor(ue*pe.width),Ye=Math.floor(ue*pe.height);p===void 0&&(p=x(he,Ye));const Ce=R?x(he,Ye):p;return Ce.width=he,Ce.height=Ye,Ce.getContext("2d").drawImage(F,0,0,he,Ye),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+pe.width+"x"+pe.height+") to ("+he+"x"+Ye+")."),Ce}else return"data"in F&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+pe.width+"x"+pe.height+")."),F;return F}function y(F){return F.generateMipmaps&&F.minFilter!==mn&&F.minFilter!==on}function _(F){r.generateMipmap(F)}function E(F,R,Q,ue,pe=!1){if(F!==null){if(r[F]!==void 0)return r[F];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let he=R;if(R===r.RED&&(Q===r.FLOAT&&(he=r.R32F),Q===r.HALF_FLOAT&&(he=r.R16F),Q===r.UNSIGNED_BYTE&&(he=r.R8)),R===r.RED_INTEGER&&(Q===r.UNSIGNED_BYTE&&(he=r.R8UI),Q===r.UNSIGNED_SHORT&&(he=r.R16UI),Q===r.UNSIGNED_INT&&(he=r.R32UI),Q===r.BYTE&&(he=r.R8I),Q===r.SHORT&&(he=r.R16I),Q===r.INT&&(he=r.R32I)),R===r.RG&&(Q===r.FLOAT&&(he=r.RG32F),Q===r.HALF_FLOAT&&(he=r.RG16F),Q===r.UNSIGNED_BYTE&&(he=r.RG8)),R===r.RG_INTEGER&&(Q===r.UNSIGNED_BYTE&&(he=r.RG8UI),Q===r.UNSIGNED_SHORT&&(he=r.RG16UI),Q===r.UNSIGNED_INT&&(he=r.RG32UI),Q===r.BYTE&&(he=r.RG8I),Q===r.SHORT&&(he=r.RG16I),Q===r.INT&&(he=r.RG32I)),R===r.RGB_INTEGER&&(Q===r.UNSIGNED_BYTE&&(he=r.RGB8UI),Q===r.UNSIGNED_SHORT&&(he=r.RGB16UI),Q===r.UNSIGNED_INT&&(he=r.RGB32UI),Q===r.BYTE&&(he=r.RGB8I),Q===r.SHORT&&(he=r.RGB16I),Q===r.INT&&(he=r.RGB32I)),R===r.RGBA_INTEGER&&(Q===r.UNSIGNED_BYTE&&(he=r.RGBA8UI),Q===r.UNSIGNED_SHORT&&(he=r.RGBA16UI),Q===r.UNSIGNED_INT&&(he=r.RGBA32UI),Q===r.BYTE&&(he=r.RGBA8I),Q===r.SHORT&&(he=r.RGBA16I),Q===r.INT&&(he=r.RGBA32I)),R===r.RGB&&Q===r.UNSIGNED_INT_5_9_9_9_REV&&(he=r.RGB9_E5),R===r.RGBA){const Ye=pe?Ha:Ut.getTransfer(ue);Q===r.FLOAT&&(he=r.RGBA32F),Q===r.HALF_FLOAT&&(he=r.RGBA16F),Q===r.UNSIGNED_BYTE&&(he=Ye===kt?r.SRGB8_ALPHA8:r.RGBA8),Q===r.UNSIGNED_SHORT_4_4_4_4&&(he=r.RGBA4),Q===r.UNSIGNED_SHORT_5_5_5_1&&(he=r.RGB5_A1)}return(he===r.R16F||he===r.R32F||he===r.RG16F||he===r.RG32F||he===r.RGBA16F||he===r.RGBA32F)&&e.get("EXT_color_buffer_float"),he}function w(F,R){let Q;return F?R===null||R===gr||R===bs?Q=r.DEPTH24_STENCIL8:R===jn?Q=r.DEPTH32F_STENCIL8:R===Ao&&(Q=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===gr||R===bs?Q=r.DEPTH_COMPONENT24:R===jn?Q=r.DEPTH_COMPONENT32F:R===Ao&&(Q=r.DEPTH_COMPONENT16),Q}function T(F,R){return y(F)===!0||F.isFramebufferTexture&&F.minFilter!==mn&&F.minFilter!==on?Math.log2(Math.max(R.width,R.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?R.mipmaps.length:1}function U(F){const R=F.target;R.removeEventListener("dispose",U),I(R),R.isVideoTexture&&f.delete(R)}function P(F){const R=F.target;R.removeEventListener("dispose",P),k(R)}function I(F){const R=n.get(F);if(R.__webglInit===void 0)return;const Q=F.source,ue=m.get(Q);if(ue){const pe=ue[R.__cacheKey];pe.usedTimes--,pe.usedTimes===0&&B(F),Object.keys(ue).length===0&&m.delete(Q)}n.remove(F)}function B(F){const R=n.get(F);r.deleteTexture(R.__webglTexture);const Q=F.source,ue=m.get(Q);delete ue[R.__cacheKey],a.memory.textures--}function k(F){const R=n.get(F);if(F.depthTexture&&F.depthTexture.dispose(),F.isWebGLCubeRenderTarget)for(let ue=0;ue<6;ue++){if(Array.isArray(R.__webglFramebuffer[ue]))for(let pe=0;pe<R.__webglFramebuffer[ue].length;pe++)r.deleteFramebuffer(R.__webglFramebuffer[ue][pe]);else r.deleteFramebuffer(R.__webglFramebuffer[ue]);R.__webglDepthbuffer&&r.deleteRenderbuffer(R.__webglDepthbuffer[ue])}else{if(Array.isArray(R.__webglFramebuffer))for(let ue=0;ue<R.__webglFramebuffer.length;ue++)r.deleteFramebuffer(R.__webglFramebuffer[ue]);else r.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&r.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&r.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let ue=0;ue<R.__webglColorRenderbuffer.length;ue++)R.__webglColorRenderbuffer[ue]&&r.deleteRenderbuffer(R.__webglColorRenderbuffer[ue]);R.__webglDepthRenderbuffer&&r.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const Q=F.textures;for(let ue=0,pe=Q.length;ue<pe;ue++){const he=n.get(Q[ue]);he.__webglTexture&&(r.deleteTexture(he.__webglTexture),a.memory.textures--),n.remove(Q[ue])}n.remove(F)}let b=0;function C(){b=0}function G(){const F=b;return F>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+i.maxTextures),b+=1,F}function Z(F){const R=[];return R.push(F.wrapS),R.push(F.wrapT),R.push(F.wrapR||0),R.push(F.magFilter),R.push(F.minFilter),R.push(F.anisotropy),R.push(F.internalFormat),R.push(F.format),R.push(F.type),R.push(F.generateMipmaps),R.push(F.premultiplyAlpha),R.push(F.flipY),R.push(F.unpackAlignment),R.push(F.colorSpace),R.join()}function $(F,R){const Q=n.get(F);if(F.isVideoTexture&&Ee(F),F.isRenderTargetTexture===!1&&F.version>0&&Q.__version!==F.version){const ue=F.image;if(ue===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ue.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Pe(Q,F,R);return}}t.bindTexture(r.TEXTURE_2D,Q.__webglTexture,r.TEXTURE0+R)}function oe(F,R){const Q=n.get(F);if(F.version>0&&Q.__version!==F.version){Pe(Q,F,R);return}t.bindTexture(r.TEXTURE_2D_ARRAY,Q.__webglTexture,r.TEXTURE0+R)}function K(F,R){const Q=n.get(F);if(F.version>0&&Q.__version!==F.version){Pe(Q,F,R);return}t.bindTexture(r.TEXTURE_3D,Q.__webglTexture,r.TEXTURE0+R)}function fe(F,R){const Q=n.get(F);if(F.version>0&&Q.__version!==F.version){ie(Q,F,R);return}t.bindTexture(r.TEXTURE_CUBE_MAP,Q.__webglTexture,r.TEXTURE0+R)}const O={[Oa]:r.REPEAT,[xi]:r.CLAMP_TO_EDGE,[Ba]:r.MIRRORED_REPEAT},J={[mn]:r.NEAREST,[yp]:r.NEAREST_MIPMAP_NEAREST,[_o]:r.NEAREST_MIPMAP_LINEAR,[on]:r.LINEAR,[ba]:r.LINEAR_MIPMAP_NEAREST,[Wi]:r.LINEAR_MIPMAP_LINEAR},q={[L_]:r.NEVER,[B_]:r.ALWAYS,[D_]:r.LESS,[Ip]:r.LEQUAL,[U_]:r.EQUAL,[O_]:r.GEQUAL,[N_]:r.GREATER,[F_]:r.NOTEQUAL};function re(F,R){if(R.type===jn&&e.has("OES_texture_float_linear")===!1&&(R.magFilter===on||R.magFilter===ba||R.magFilter===_o||R.magFilter===Wi||R.minFilter===on||R.minFilter===ba||R.minFilter===_o||R.minFilter===Wi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(F,r.TEXTURE_WRAP_S,O[R.wrapS]),r.texParameteri(F,r.TEXTURE_WRAP_T,O[R.wrapT]),(F===r.TEXTURE_3D||F===r.TEXTURE_2D_ARRAY)&&r.texParameteri(F,r.TEXTURE_WRAP_R,O[R.wrapR]),r.texParameteri(F,r.TEXTURE_MAG_FILTER,J[R.magFilter]),r.texParameteri(F,r.TEXTURE_MIN_FILTER,J[R.minFilter]),R.compareFunction&&(r.texParameteri(F,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(F,r.TEXTURE_COMPARE_FUNC,q[R.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===mn||R.minFilter!==_o&&R.minFilter!==Wi||R.type===jn&&e.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||n.get(R).__currentAnisotropy){const Q=e.get("EXT_texture_filter_anisotropic");r.texParameterf(F,Q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,i.getMaxAnisotropy())),n.get(R).__currentAnisotropy=R.anisotropy}}}function xe(F,R){let Q=!1;F.__webglInit===void 0&&(F.__webglInit=!0,R.addEventListener("dispose",U));const ue=R.source;let pe=m.get(ue);pe===void 0&&(pe={},m.set(ue,pe));const he=Z(R);if(he!==F.__cacheKey){pe[he]===void 0&&(pe[he]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,Q=!0),pe[he].usedTimes++;const Ye=pe[F.__cacheKey];Ye!==void 0&&(pe[F.__cacheKey].usedTimes--,Ye.usedTimes===0&&B(R)),F.__cacheKey=he,F.__webglTexture=pe[he].texture}return Q}function Pe(F,R,Q){let ue=r.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(ue=r.TEXTURE_2D_ARRAY),R.isData3DTexture&&(ue=r.TEXTURE_3D);const pe=xe(F,R),he=R.source;t.bindTexture(ue,F.__webglTexture,r.TEXTURE0+Q);const Ye=n.get(he);if(he.version!==Ye.__version||pe===!0){t.activeTexture(r.TEXTURE0+Q);const Ce=Ut.getPrimaries(Ut.workingColorSpace),ke=R.colorSpace===ur?null:Ut.getPrimaries(R.colorSpace),Mt=R.colorSpace===ur||Ce===ke?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,R.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,R.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt);let ye=M(R.image,!1,i.maxTextureSize);ye=Je(R,ye);const He=s.convert(R.format,R.colorSpace),at=s.convert(R.type);let lt=E(R.internalFormat,He,at,R.colorSpace,R.isVideoTexture);re(ue,R);let Ve;const wt=R.mipmaps,ut=R.isVideoTexture!==!0,Ft=Ye.__version===void 0||pe===!0,V=he.dataReady,Be=T(R,ye);if(R.isDepthTexture)lt=w(R.format===Ts,R.type),Ft&&(ut?t.texStorage2D(r.TEXTURE_2D,1,lt,ye.width,ye.height):t.texImage2D(r.TEXTURE_2D,0,lt,ye.width,ye.height,0,He,at,null));else if(R.isDataTexture)if(wt.length>0){ut&&Ft&&t.texStorage2D(r.TEXTURE_2D,Be,lt,wt[0].width,wt[0].height);for(let le=0,ve=wt.length;le<ve;le++)Ve=wt[le],ut?V&&t.texSubImage2D(r.TEXTURE_2D,le,0,0,Ve.width,Ve.height,He,at,Ve.data):t.texImage2D(r.TEXTURE_2D,le,lt,Ve.width,Ve.height,0,He,at,Ve.data);R.generateMipmaps=!1}else ut?(Ft&&t.texStorage2D(r.TEXTURE_2D,Be,lt,ye.width,ye.height),V&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,ye.width,ye.height,He,at,ye.data)):t.texImage2D(r.TEXTURE_2D,0,lt,ye.width,ye.height,0,He,at,ye.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){ut&&Ft&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Be,lt,wt[0].width,wt[0].height,ye.depth);for(let le=0,ve=wt.length;le<ve;le++)if(Ve=wt[le],R.format!==Ln)if(He!==null)if(ut){if(V)if(R.layerUpdates.size>0){const Fe=op(Ve.width,Ve.height,R.format,R.type);for(const ze of R.layerUpdates){const Et=Ve.data.subarray(ze*Fe/Ve.data.BYTES_PER_ELEMENT,(ze+1)*Fe/Ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,le,0,0,ze,Ve.width,Ve.height,1,He,Et,0,0)}R.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,le,0,0,0,Ve.width,Ve.height,ye.depth,He,Ve.data,0,0)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,le,lt,Ve.width,Ve.height,ye.depth,0,Ve.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ut?V&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,le,0,0,0,Ve.width,Ve.height,ye.depth,He,at,Ve.data):t.texImage3D(r.TEXTURE_2D_ARRAY,le,lt,Ve.width,Ve.height,ye.depth,0,He,at,Ve.data)}else{ut&&Ft&&t.texStorage2D(r.TEXTURE_2D,Be,lt,wt[0].width,wt[0].height);for(let le=0,ve=wt.length;le<ve;le++)Ve=wt[le],R.format!==Ln?He!==null?ut?V&&t.compressedTexSubImage2D(r.TEXTURE_2D,le,0,0,Ve.width,Ve.height,He,Ve.data):t.compressedTexImage2D(r.TEXTURE_2D,le,lt,Ve.width,Ve.height,0,Ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ut?V&&t.texSubImage2D(r.TEXTURE_2D,le,0,0,Ve.width,Ve.height,He,at,Ve.data):t.texImage2D(r.TEXTURE_2D,le,lt,Ve.width,Ve.height,0,He,at,Ve.data)}else if(R.isDataArrayTexture)if(ut){if(Ft&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Be,lt,ye.width,ye.height,ye.depth),V)if(R.layerUpdates.size>0){const le=op(ye.width,ye.height,R.format,R.type);for(const ve of R.layerUpdates){const Fe=ye.data.subarray(ve*le/ye.data.BYTES_PER_ELEMENT,(ve+1)*le/ye.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,ve,ye.width,ye.height,1,He,at,Fe)}R.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,ye.width,ye.height,ye.depth,He,at,ye.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,lt,ye.width,ye.height,ye.depth,0,He,at,ye.data);else if(R.isData3DTexture)ut?(Ft&&t.texStorage3D(r.TEXTURE_3D,Be,lt,ye.width,ye.height,ye.depth),V&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,ye.width,ye.height,ye.depth,He,at,ye.data)):t.texImage3D(r.TEXTURE_3D,0,lt,ye.width,ye.height,ye.depth,0,He,at,ye.data);else if(R.isFramebufferTexture){if(Ft)if(ut)t.texStorage2D(r.TEXTURE_2D,Be,lt,ye.width,ye.height);else{let le=ye.width,ve=ye.height;for(let Fe=0;Fe<Be;Fe++)t.texImage2D(r.TEXTURE_2D,Fe,lt,le,ve,0,He,at,null),le>>=1,ve>>=1}}else if(wt.length>0){if(ut&&Ft){const le=De(wt[0]);t.texStorage2D(r.TEXTURE_2D,Be,lt,le.width,le.height)}for(let le=0,ve=wt.length;le<ve;le++)Ve=wt[le],ut?V&&t.texSubImage2D(r.TEXTURE_2D,le,0,0,He,at,Ve):t.texImage2D(r.TEXTURE_2D,le,lt,He,at,Ve);R.generateMipmaps=!1}else if(ut){if(Ft){const le=De(ye);t.texStorage2D(r.TEXTURE_2D,Be,lt,le.width,le.height)}V&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,He,at,ye)}else t.texImage2D(r.TEXTURE_2D,0,lt,He,at,ye);y(R)&&_(ue),Ye.__version=he.version,R.onUpdate&&R.onUpdate(R)}F.__version=R.version}function ie(F,R,Q){if(R.image.length!==6)return;const ue=xe(F,R),pe=R.source;t.bindTexture(r.TEXTURE_CUBE_MAP,F.__webglTexture,r.TEXTURE0+Q);const he=n.get(pe);if(pe.version!==he.__version||ue===!0){t.activeTexture(r.TEXTURE0+Q);const Ye=Ut.getPrimaries(Ut.workingColorSpace),Ce=R.colorSpace===ur?null:Ut.getPrimaries(R.colorSpace),ke=R.colorSpace===ur||Ye===Ce?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,R.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,R.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke);const Mt=R.isCompressedTexture||R.image[0].isCompressedTexture,ye=R.image[0]&&R.image[0].isDataTexture,He=[];for(let ve=0;ve<6;ve++)!Mt&&!ye?He[ve]=M(R.image[ve],!0,i.maxCubemapSize):He[ve]=ye?R.image[ve].image:R.image[ve],He[ve]=Je(R,He[ve]);const at=He[0],lt=s.convert(R.format,R.colorSpace),Ve=s.convert(R.type),wt=E(R.internalFormat,lt,Ve,R.colorSpace),ut=R.isVideoTexture!==!0,Ft=he.__version===void 0||ue===!0,V=pe.dataReady;let Be=T(R,at);re(r.TEXTURE_CUBE_MAP,R);let le;if(Mt){ut&&Ft&&t.texStorage2D(r.TEXTURE_CUBE_MAP,Be,wt,at.width,at.height);for(let ve=0;ve<6;ve++){le=He[ve].mipmaps;for(let Fe=0;Fe<le.length;Fe++){const ze=le[Fe];R.format!==Ln?lt!==null?ut?V&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Fe,0,0,ze.width,ze.height,lt,ze.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Fe,wt,ze.width,ze.height,0,ze.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ut?V&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Fe,0,0,ze.width,ze.height,lt,Ve,ze.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Fe,wt,ze.width,ze.height,0,lt,Ve,ze.data)}}}else{if(le=R.mipmaps,ut&&Ft){le.length>0&&Be++;const ve=De(He[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,Be,wt,ve.width,ve.height)}for(let ve=0;ve<6;ve++)if(ye){ut?V&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,0,0,He[ve].width,He[ve].height,lt,Ve,He[ve].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,wt,He[ve].width,He[ve].height,0,lt,Ve,He[ve].data);for(let Fe=0;Fe<le.length;Fe++){const Et=le[Fe].image[ve].image;ut?V&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Fe+1,0,0,Et.width,Et.height,lt,Ve,Et.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Fe+1,wt,Et.width,Et.height,0,lt,Ve,Et.data)}}else{ut?V&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,0,0,lt,Ve,He[ve]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,wt,lt,Ve,He[ve]);for(let Fe=0;Fe<le.length;Fe++){const ze=le[Fe];ut?V&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Fe+1,0,0,lt,Ve,ze.image[ve]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Fe+1,wt,lt,Ve,ze.image[ve])}}}y(R)&&_(r.TEXTURE_CUBE_MAP),he.__version=pe.version,R.onUpdate&&R.onUpdate(R)}F.__version=R.version}function me(F,R,Q,ue,pe,he){const Ye=s.convert(Q.format,Q.colorSpace),Ce=s.convert(Q.type),ke=E(Q.internalFormat,Ye,Ce,Q.colorSpace);if(!n.get(R).__hasExternalTextures){const ye=Math.max(1,R.width>>he),He=Math.max(1,R.height>>he);pe===r.TEXTURE_3D||pe===r.TEXTURE_2D_ARRAY?t.texImage3D(pe,he,ke,ye,He,R.depth,0,Ye,Ce,null):t.texImage2D(pe,he,ke,ye,He,0,Ye,Ce,null)}t.bindFramebuffer(r.FRAMEBUFFER,F),_e(R)?c.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ue,pe,n.get(Q).__webglTexture,0,we(R)):(pe===r.TEXTURE_2D||pe>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&pe<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,ue,pe,n.get(Q).__webglTexture,he),t.bindFramebuffer(r.FRAMEBUFFER,null)}function be(F,R,Q){if(r.bindRenderbuffer(r.RENDERBUFFER,F),R.depthBuffer){const ue=R.depthTexture,pe=ue&&ue.isDepthTexture?ue.type:null,he=w(R.stencilBuffer,pe),Ye=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Ce=we(R);_e(R)?c.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ce,he,R.width,R.height):Q?r.renderbufferStorageMultisample(r.RENDERBUFFER,Ce,he,R.width,R.height):r.renderbufferStorage(r.RENDERBUFFER,he,R.width,R.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Ye,r.RENDERBUFFER,F)}else{const ue=R.textures;for(let pe=0;pe<ue.length;pe++){const he=ue[pe],Ye=s.convert(he.format,he.colorSpace),Ce=s.convert(he.type),ke=E(he.internalFormat,Ye,Ce,he.colorSpace),Mt=we(R);Q&&_e(R)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,Mt,ke,R.width,R.height):_e(R)?c.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Mt,ke,R.width,R.height):r.renderbufferStorage(r.RENDERBUFFER,ke,R.width,R.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Se(F,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,F),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(R.depthTexture).__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),$(R.depthTexture,0);const ue=n.get(R.depthTexture).__webglTexture,pe=we(R);if(R.depthTexture.format===ys)_e(R)?c.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,ue,0,pe):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,ue,0);else if(R.depthTexture.format===Ts)_e(R)?c.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,ue,0,pe):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,ue,0);else throw new Error("Unknown depthTexture format")}function tt(F){const R=n.get(F),Q=F.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==F.depthTexture){const ue=F.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),ue){const pe=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,ue.removeEventListener("dispose",pe)};ue.addEventListener("dispose",pe),R.__depthDisposeCallback=pe}R.__boundDepthTexture=ue}if(F.depthTexture&&!R.__autoAllocateDepthBuffer){if(Q)throw new Error("target.depthTexture not supported in Cube render targets");Se(R.__webglFramebuffer,F)}else if(Q){R.__webglDepthbuffer=[];for(let ue=0;ue<6;ue++)if(t.bindFramebuffer(r.FRAMEBUFFER,R.__webglFramebuffer[ue]),R.__webglDepthbuffer[ue]===void 0)R.__webglDepthbuffer[ue]=r.createRenderbuffer(),be(R.__webglDepthbuffer[ue],F,!1);else{const pe=F.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,he=R.__webglDepthbuffer[ue];r.bindRenderbuffer(r.RENDERBUFFER,he),r.framebufferRenderbuffer(r.FRAMEBUFFER,pe,r.RENDERBUFFER,he)}}else if(t.bindFramebuffer(r.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=r.createRenderbuffer(),be(R.__webglDepthbuffer,F,!1);else{const ue=F.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,pe=R.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,pe),r.framebufferRenderbuffer(r.FRAMEBUFFER,ue,r.RENDERBUFFER,pe)}t.bindFramebuffer(r.FRAMEBUFFER,null)}function nt(F,R,Q){const ue=n.get(F);R!==void 0&&me(ue.__webglFramebuffer,F,F.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),Q!==void 0&&tt(F)}function Ze(F){const R=F.texture,Q=n.get(F),ue=n.get(R);F.addEventListener("dispose",P);const pe=F.textures,he=F.isWebGLCubeRenderTarget===!0,Ye=pe.length>1;if(Ye||(ue.__webglTexture===void 0&&(ue.__webglTexture=r.createTexture()),ue.__version=R.version,a.memory.textures++),he){Q.__webglFramebuffer=[];for(let Ce=0;Ce<6;Ce++)if(R.mipmaps&&R.mipmaps.length>0){Q.__webglFramebuffer[Ce]=[];for(let ke=0;ke<R.mipmaps.length;ke++)Q.__webglFramebuffer[Ce][ke]=r.createFramebuffer()}else Q.__webglFramebuffer[Ce]=r.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){Q.__webglFramebuffer=[];for(let Ce=0;Ce<R.mipmaps.length;Ce++)Q.__webglFramebuffer[Ce]=r.createFramebuffer()}else Q.__webglFramebuffer=r.createFramebuffer();if(Ye)for(let Ce=0,ke=pe.length;Ce<ke;Ce++){const Mt=n.get(pe[Ce]);Mt.__webglTexture===void 0&&(Mt.__webglTexture=r.createTexture(),a.memory.textures++)}if(F.samples>0&&_e(F)===!1){Q.__webglMultisampledFramebuffer=r.createFramebuffer(),Q.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,Q.__webglMultisampledFramebuffer);for(let Ce=0;Ce<pe.length;Ce++){const ke=pe[Ce];Q.__webglColorRenderbuffer[Ce]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,Q.__webglColorRenderbuffer[Ce]);const Mt=s.convert(ke.format,ke.colorSpace),ye=s.convert(ke.type),He=E(ke.internalFormat,Mt,ye,ke.colorSpace,F.isXRRenderTarget===!0),at=we(F);r.renderbufferStorageMultisample(r.RENDERBUFFER,at,He,F.width,F.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ce,r.RENDERBUFFER,Q.__webglColorRenderbuffer[Ce])}r.bindRenderbuffer(r.RENDERBUFFER,null),F.depthBuffer&&(Q.__webglDepthRenderbuffer=r.createRenderbuffer(),be(Q.__webglDepthRenderbuffer,F,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(he){t.bindTexture(r.TEXTURE_CUBE_MAP,ue.__webglTexture),re(r.TEXTURE_CUBE_MAP,R);for(let Ce=0;Ce<6;Ce++)if(R.mipmaps&&R.mipmaps.length>0)for(let ke=0;ke<R.mipmaps.length;ke++)me(Q.__webglFramebuffer[Ce][ke],F,R,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,ke);else me(Q.__webglFramebuffer[Ce],F,R,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,0);y(R)&&_(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ye){for(let Ce=0,ke=pe.length;Ce<ke;Ce++){const Mt=pe[Ce],ye=n.get(Mt);t.bindTexture(r.TEXTURE_2D,ye.__webglTexture),re(r.TEXTURE_2D,Mt),me(Q.__webglFramebuffer,F,Mt,r.COLOR_ATTACHMENT0+Ce,r.TEXTURE_2D,0),y(Mt)&&_(r.TEXTURE_2D)}t.unbindTexture()}else{let Ce=r.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(Ce=F.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(Ce,ue.__webglTexture),re(Ce,R),R.mipmaps&&R.mipmaps.length>0)for(let ke=0;ke<R.mipmaps.length;ke++)me(Q.__webglFramebuffer[ke],F,R,r.COLOR_ATTACHMENT0,Ce,ke);else me(Q.__webglFramebuffer,F,R,r.COLOR_ATTACHMENT0,Ce,0);y(R)&&_(Ce),t.unbindTexture()}F.depthBuffer&&tt(F)}function Ie(F){const R=F.textures;for(let Q=0,ue=R.length;Q<ue;Q++){const pe=R[Q];if(y(pe)){const he=F.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,Ye=n.get(pe).__webglTexture;t.bindTexture(he,Ye),_(he),t.unbindTexture()}}}const de=[],N=[];function Te(F){if(F.samples>0){if(_e(F)===!1){const R=F.textures,Q=F.width,ue=F.height;let pe=r.COLOR_BUFFER_BIT;const he=F.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Ye=n.get(F),Ce=R.length>1;if(Ce)for(let ke=0;ke<R.length;ke++)t.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ke,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ke,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ye.__webglFramebuffer);for(let ke=0;ke<R.length;ke++){if(F.resolveDepthBuffer&&(F.depthBuffer&&(pe|=r.DEPTH_BUFFER_BIT),F.stencilBuffer&&F.resolveStencilBuffer&&(pe|=r.STENCIL_BUFFER_BIT)),Ce){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Ye.__webglColorRenderbuffer[ke]);const Mt=n.get(R[ke]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Mt,0)}r.blitFramebuffer(0,0,Q,ue,0,0,Q,ue,pe,r.NEAREST),u===!0&&(de.length=0,N.length=0,de.push(r.COLOR_ATTACHMENT0+ke),F.depthBuffer&&F.resolveDepthBuffer===!1&&(de.push(he),N.push(he),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,N)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,de))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Ce)for(let ke=0;ke<R.length;ke++){t.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ke,r.RENDERBUFFER,Ye.__webglColorRenderbuffer[ke]);const Mt=n.get(R[ke]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,Ye.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ke,r.TEXTURE_2D,Mt,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ye.__webglMultisampledFramebuffer)}else if(F.depthBuffer&&F.resolveDepthBuffer===!1&&u){const R=F.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[R])}}}function we(F){return Math.min(i.maxSamples,F.samples)}function _e(F){const R=n.get(F);return F.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function Ee(F){const R=a.render.frame;f.get(F)!==R&&(f.set(F,R),F.update())}function Je(F,R){const Q=F.colorSpace,ue=F.format,pe=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||Q!==_r&&Q!==ur&&(Ut.getTransfer(Q)===kt?(ue!==Ln||pe!==Ri)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Q)),R}function De(F){return typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement?(h.width=F.naturalWidth||F.width,h.height=F.naturalHeight||F.height):typeof VideoFrame<"u"&&F instanceof VideoFrame?(h.width=F.displayWidth,h.height=F.displayHeight):(h.width=F.width,h.height=F.height),h}this.allocateTextureUnit=G,this.resetTextureUnits=C,this.setTexture2D=$,this.setTexture2DArray=oe,this.setTexture3D=K,this.setTextureCube=fe,this.rebindTextures=nt,this.setupRenderTarget=Ze,this.updateRenderTargetMipmap=Ie,this.updateMultisampleRenderTarget=Te,this.setupDepthRenderbuffer=tt,this.setupFrameBufferTexture=me,this.useMultisampledRTT=_e}function Q_(r,e){function t(n,i=ur){let s;const a=Ut.getTransfer(i);if(n===Ri)return r.UNSIGNED_BYTE;if(n===lh)return r.UNSIGNED_SHORT_4_4_4_4;if(n===ch)return r.UNSIGNED_SHORT_5_5_5_1;if(n===wp)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===Sp)return r.BYTE;if(n===Mp)return r.SHORT;if(n===Ao)return r.UNSIGNED_SHORT;if(n===ah)return r.INT;if(n===gr)return r.UNSIGNED_INT;if(n===jn)return r.FLOAT;if(n===Do)return r.HALF_FLOAT;if(n===Ep)return r.ALPHA;if(n===Ap)return r.RGB;if(n===Ln)return r.RGBA;if(n===bp)return r.LUMINANCE;if(n===Tp)return r.LUMINANCE_ALPHA;if(n===ys)return r.DEPTH_COMPONENT;if(n===Ts)return r.DEPTH_STENCIL;if(n===uh)return r.RED;if(n===il)return r.RED_INTEGER;if(n===Cp)return r.RG;if(n===hh)return r.RG_INTEGER;if(n===fh)return r.RGBA_INTEGER;if(n===Ta||n===Ca||n===Ra||n===Pa)if(a===kt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Ta)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ca)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ra)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Pa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Ta)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ca)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ra)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Pa)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===bu||n===Tu||n===Cu||n===Ru)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===bu)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Tu)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Cu)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ru)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Pu||n===Iu||n===Lu)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Pu||n===Iu)return a===kt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Lu)return a===kt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Du||n===Uu||n===Nu||n===Fu||n===Ou||n===Bu||n===zu||n===ku||n===Hu||n===Vu||n===Gu||n===Wu||n===Xu||n===qu)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Du)return a===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Uu)return a===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Nu)return a===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Fu)return a===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ou)return a===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Bu)return a===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===zu)return a===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ku)return a===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Hu)return a===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Vu)return a===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Gu)return a===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Wu)return a===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Xu)return a===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===qu)return a===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ia||n===Yu||n===ju)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===Ia)return a===kt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Yu)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ju)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Rp||n===Zu||n===Ju||n===Ku)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===Ia)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Zu)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ju)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ku)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===bs?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}class $_ extends sn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class So extends Tt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const wb={type:"move"};class yd{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new So,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new So,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new So,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null;const c=this._targetRay,u=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){a=!0;for(const M of e.hand.values()){const y=t.getJointPose(M,n),_=this._getHandJoint(h,M);y!==null&&(_.matrix.fromArray(y.transform.matrix),_.matrix.decompose(_.position,_.rotation,_.scale),_.matrixWorldNeedsUpdate=!0,_.jointRadius=y.radius),_.visible=y!==null}const f=h.joints["index-finger-tip"],p=h.joints["thumb-tip"],m=f.position.distanceTo(p.position),v=.02,x=.005;h.inputState.pinching&&m>v+x?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&m<=v-x&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else u!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(u.matrix.fromArray(s.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,s.linearVelocity?(u.hasLinearVelocity=!0,u.linearVelocity.copy(s.linearVelocity)):u.hasLinearVelocity=!1,s.angularVelocity?(u.hasAngularVelocity=!0,u.angularVelocity.copy(s.angularVelocity)):u.hasAngularVelocity=!1));c!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(c.matrix.fromArray(i.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,i.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(i.linearVelocity)):c.hasLinearVelocity=!1,i.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(i.angularVelocity)):c.hasAngularVelocity=!1,this.dispatchEvent(wb)))}return c!==null&&(c.visible=i!==null),u!==null&&(u.visible=s!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new So;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Eb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ab=`
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

}`;class bb{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new Yt,s=e.properties.get(i);s.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new ai({vertexShader:Eb,fragmentShader:Ab,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new en(new No(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Tb extends Zi{constructor(e,t){super();const n=this;let i=null,s=1,a=null,c="local-floor",u=1,h=null,f=null,p=null,m=null,v=null,x=null;const M=new bb,y=t.getContextAttributes();let _=null,E=null;const w=[],T=[],U=new ge;let P=null;const I=new sn;I.layers.enable(1),I.viewport=new xt;const B=new sn;B.layers.enable(2),B.viewport=new xt;const k=[I,B],b=new $_;b.layers.enable(1),b.layers.enable(2);let C=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ie){let me=w[ie];return me===void 0&&(me=new yd,w[ie]=me),me.getTargetRaySpace()},this.getControllerGrip=function(ie){let me=w[ie];return me===void 0&&(me=new yd,w[ie]=me),me.getGripSpace()},this.getHand=function(ie){let me=w[ie];return me===void 0&&(me=new yd,w[ie]=me),me.getHandSpace()};function Z(ie){const me=T.indexOf(ie.inputSource);if(me===-1)return;const be=w[me];be!==void 0&&(be.update(ie.inputSource,ie.frame,h||a),be.dispatchEvent({type:ie.type,data:ie.inputSource}))}function $(){i.removeEventListener("select",Z),i.removeEventListener("selectstart",Z),i.removeEventListener("selectend",Z),i.removeEventListener("squeeze",Z),i.removeEventListener("squeezestart",Z),i.removeEventListener("squeezeend",Z),i.removeEventListener("end",$),i.removeEventListener("inputsourceschange",oe);for(let ie=0;ie<w.length;ie++){const me=T[ie];me!==null&&(T[ie]=null,w[ie].disconnect(me))}C=null,G=null,M.reset(),e.setRenderTarget(_),v=null,m=null,p=null,i=null,E=null,Pe.stop(),n.isPresenting=!1,e.setPixelRatio(P),e.setSize(U.width,U.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ie){s=ie,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ie){c=ie,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(ie){h=ie},this.getBaseLayer=function(){return m!==null?m:v},this.getBinding=function(){return p},this.getFrame=function(){return x},this.getSession=function(){return i},this.setSession=async function(ie){if(i=ie,i!==null){if(_=e.getRenderTarget(),i.addEventListener("select",Z),i.addEventListener("selectstart",Z),i.addEventListener("selectend",Z),i.addEventListener("squeeze",Z),i.addEventListener("squeezestart",Z),i.addEventListener("squeezeend",Z),i.addEventListener("end",$),i.addEventListener("inputsourceschange",oe),y.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(U),i.renderState.layers===void 0){const me={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:s};v=new XRWebGLLayer(i,t,me),i.updateRenderState({baseLayer:v}),e.setPixelRatio(1),e.setSize(v.framebufferWidth,v.framebufferHeight,!1),E=new Pi(v.framebufferWidth,v.framebufferHeight,{format:Ln,type:Ri,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil})}else{let me=null,be=null,Se=null;y.depth&&(Se=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,me=y.stencil?Ts:ys,be=y.stencil?bs:gr);const tt={colorFormat:t.RGBA8,depthFormat:Se,scaleFactor:s};p=new XRWebGLBinding(i,t),m=p.createProjectionLayer(tt),i.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),E=new Pi(m.textureWidth,m.textureHeight,{format:Ln,type:Ri,depthTexture:new Op(m.textureWidth,m.textureHeight,be,void 0,void 0,void 0,void 0,void 0,void 0,me),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(u),h=null,a=await i.requestReferenceSpace(c),Pe.setContext(i),Pe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return M.getDepthTexture()};function oe(ie){for(let me=0;me<ie.removed.length;me++){const be=ie.removed[me],Se=T.indexOf(be);Se>=0&&(T[Se]=null,w[Se].disconnect(be))}for(let me=0;me<ie.added.length;me++){const be=ie.added[me];let Se=T.indexOf(be);if(Se===-1){for(let nt=0;nt<w.length;nt++)if(nt>=T.length){T.push(be),Se=nt;break}else if(T[nt]===null){T[nt]=be,Se=nt;break}if(Se===-1)break}const tt=w[Se];tt&&tt.connect(be)}}const K=new D,fe=new D;function O(ie,me,be){K.setFromMatrixPosition(me.matrixWorld),fe.setFromMatrixPosition(be.matrixWorld);const Se=K.distanceTo(fe),tt=me.projectionMatrix.elements,nt=be.projectionMatrix.elements,Ze=tt[14]/(tt[10]-1),Ie=tt[14]/(tt[10]+1),de=(tt[9]+1)/tt[5],N=(tt[9]-1)/tt[5],Te=(tt[8]-1)/tt[0],we=(nt[8]+1)/nt[0],_e=Ze*Te,Ee=Ze*we,Je=Se/(-Te+we),De=Je*-Te;if(me.matrixWorld.decompose(ie.position,ie.quaternion,ie.scale),ie.translateX(De),ie.translateZ(Je),ie.matrixWorld.compose(ie.position,ie.quaternion,ie.scale),ie.matrixWorldInverse.copy(ie.matrixWorld).invert(),tt[10]===-1)ie.projectionMatrix.copy(me.projectionMatrix),ie.projectionMatrixInverse.copy(me.projectionMatrixInverse);else{const F=Ze+Je,R=Ie+Je,Q=_e-De,ue=Ee+(Se-De),pe=de*Ie/R*F,he=N*Ie/R*F;ie.projectionMatrix.makePerspective(Q,ue,pe,he,F,R),ie.projectionMatrixInverse.copy(ie.projectionMatrix).invert()}}function J(ie,me){me===null?ie.matrixWorld.copy(ie.matrix):ie.matrixWorld.multiplyMatrices(me.matrixWorld,ie.matrix),ie.matrixWorldInverse.copy(ie.matrixWorld).invert()}this.updateCamera=function(ie){if(i===null)return;let me=ie.near,be=ie.far;M.texture!==null&&(M.depthNear>0&&(me=M.depthNear),M.depthFar>0&&(be=M.depthFar)),b.near=B.near=I.near=me,b.far=B.far=I.far=be,(C!==b.near||G!==b.far)&&(i.updateRenderState({depthNear:b.near,depthFar:b.far}),C=b.near,G=b.far);const Se=ie.parent,tt=b.cameras;J(b,Se);for(let nt=0;nt<tt.length;nt++)J(tt[nt],Se);tt.length===2?O(b,I,B):b.projectionMatrix.copy(I.projectionMatrix),q(ie,b,Se)};function q(ie,me,be){be===null?ie.matrix.copy(me.matrixWorld):(ie.matrix.copy(be.matrixWorld),ie.matrix.invert(),ie.matrix.multiply(me.matrixWorld)),ie.matrix.decompose(ie.position,ie.quaternion,ie.scale),ie.updateMatrixWorld(!0),ie.projectionMatrix.copy(me.projectionMatrix),ie.projectionMatrixInverse.copy(me.projectionMatrixInverse),ie.isPerspectiveCamera&&(ie.fov=bo*2*Math.atan(1/ie.projectionMatrix.elements[5]),ie.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(m===null&&v===null))return u},this.setFoveation=function(ie){u=ie,m!==null&&(m.fixedFoveation=ie),v!==null&&v.fixedFoveation!==void 0&&(v.fixedFoveation=ie)},this.hasDepthSensing=function(){return M.texture!==null},this.getDepthSensingMesh=function(){return M.getMesh(b)};let re=null;function xe(ie,me){if(f=me.getViewerPose(h||a),x=me,f!==null){const be=f.views;v!==null&&(e.setRenderTargetFramebuffer(E,v.framebuffer),e.setRenderTarget(E));let Se=!1;be.length!==b.cameras.length&&(b.cameras.length=0,Se=!0);for(let nt=0;nt<be.length;nt++){const Ze=be[nt];let Ie=null;if(v!==null)Ie=v.getViewport(Ze);else{const N=p.getViewSubImage(m,Ze);Ie=N.viewport,nt===0&&(e.setRenderTargetTextures(E,N.colorTexture,m.ignoreDepthValues?void 0:N.depthStencilTexture),e.setRenderTarget(E))}let de=k[nt];de===void 0&&(de=new sn,de.layers.enable(nt),de.viewport=new xt,k[nt]=de),de.matrix.fromArray(Ze.transform.matrix),de.matrix.decompose(de.position,de.quaternion,de.scale),de.projectionMatrix.fromArray(Ze.projectionMatrix),de.projectionMatrixInverse.copy(de.projectionMatrix).invert(),de.viewport.set(Ie.x,Ie.y,Ie.width,Ie.height),nt===0&&(b.matrix.copy(de.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),Se===!0&&b.cameras.push(de)}const tt=i.enabledFeatures;if(tt&&tt.includes("depth-sensing")){const nt=p.getDepthInformation(be[0]);nt&&nt.isValid&&nt.texture&&M.init(e,nt,i.renderState)}}for(let be=0;be<w.length;be++){const Se=T[be],tt=w[be];Se!==null&&tt!==void 0&&tt.update(Se,me,h||a)}re&&re(ie,me),me.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:me}),x=null}const Pe=new Y_;Pe.setAnimationLoop(xe),this.setAnimationLoop=function(ie){re=ie},this.dispose=function(){}}}const ss=new oi,Cb=new rt;function Rb(r,e){function t(y,_){y.matrixAutoUpdate===!0&&y.updateMatrix(),_.value.copy(y.matrix)}function n(y,_){_.color.getRGB(y.fogColor.value,W_(r)),_.isFog?(y.fogNear.value=_.near,y.fogFar.value=_.far):_.isFogExp2&&(y.fogDensity.value=_.density)}function i(y,_,E,w,T){_.isMeshBasicMaterial||_.isMeshLambertMaterial?s(y,_):_.isMeshToonMaterial?(s(y,_),p(y,_)):_.isMeshPhongMaterial?(s(y,_),f(y,_)):_.isMeshStandardMaterial?(s(y,_),m(y,_),_.isMeshPhysicalMaterial&&v(y,_,T)):_.isMeshMatcapMaterial?(s(y,_),x(y,_)):_.isMeshDepthMaterial?s(y,_):_.isMeshDistanceMaterial?(s(y,_),M(y,_)):_.isMeshNormalMaterial?s(y,_):_.isLineBasicMaterial?(a(y,_),_.isLineDashedMaterial&&c(y,_)):_.isPointsMaterial?u(y,_,E,w):_.isSpriteMaterial?h(y,_):_.isShadowMaterial?(y.color.value.copy(_.color),y.opacity.value=_.opacity):_.isShaderMaterial&&(_.uniformsNeedUpdate=!1)}function s(y,_){y.opacity.value=_.opacity,_.color&&y.diffuse.value.copy(_.color),_.emissive&&y.emissive.value.copy(_.emissive).multiplyScalar(_.emissiveIntensity),_.map&&(y.map.value=_.map,t(_.map,y.mapTransform)),_.alphaMap&&(y.alphaMap.value=_.alphaMap,t(_.alphaMap,y.alphaMapTransform)),_.bumpMap&&(y.bumpMap.value=_.bumpMap,t(_.bumpMap,y.bumpMapTransform),y.bumpScale.value=_.bumpScale,_.side===Hn&&(y.bumpScale.value*=-1)),_.normalMap&&(y.normalMap.value=_.normalMap,t(_.normalMap,y.normalMapTransform),y.normalScale.value.copy(_.normalScale),_.side===Hn&&y.normalScale.value.negate()),_.displacementMap&&(y.displacementMap.value=_.displacementMap,t(_.displacementMap,y.displacementMapTransform),y.displacementScale.value=_.displacementScale,y.displacementBias.value=_.displacementBias),_.emissiveMap&&(y.emissiveMap.value=_.emissiveMap,t(_.emissiveMap,y.emissiveMapTransform)),_.specularMap&&(y.specularMap.value=_.specularMap,t(_.specularMap,y.specularMapTransform)),_.alphaTest>0&&(y.alphaTest.value=_.alphaTest);const E=e.get(_),w=E.envMap,T=E.envMapRotation;w&&(y.envMap.value=w,ss.copy(T),ss.x*=-1,ss.y*=-1,ss.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(ss.y*=-1,ss.z*=-1),y.envMapRotation.value.setFromMatrix4(Cb.makeRotationFromEuler(ss)),y.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,y.reflectivity.value=_.reflectivity,y.ior.value=_.ior,y.refractionRatio.value=_.refractionRatio),_.lightMap&&(y.lightMap.value=_.lightMap,y.lightMapIntensity.value=_.lightMapIntensity,t(_.lightMap,y.lightMapTransform)),_.aoMap&&(y.aoMap.value=_.aoMap,y.aoMapIntensity.value=_.aoMapIntensity,t(_.aoMap,y.aoMapTransform))}function a(y,_){y.diffuse.value.copy(_.color),y.opacity.value=_.opacity,_.map&&(y.map.value=_.map,t(_.map,y.mapTransform))}function c(y,_){y.dashSize.value=_.dashSize,y.totalSize.value=_.dashSize+_.gapSize,y.scale.value=_.scale}function u(y,_,E,w){y.diffuse.value.copy(_.color),y.opacity.value=_.opacity,y.size.value=_.size*E,y.scale.value=w*.5,_.map&&(y.map.value=_.map,t(_.map,y.uvTransform)),_.alphaMap&&(y.alphaMap.value=_.alphaMap,t(_.alphaMap,y.alphaMapTransform)),_.alphaTest>0&&(y.alphaTest.value=_.alphaTest)}function h(y,_){y.diffuse.value.copy(_.color),y.opacity.value=_.opacity,y.rotation.value=_.rotation,_.map&&(y.map.value=_.map,t(_.map,y.mapTransform)),_.alphaMap&&(y.alphaMap.value=_.alphaMap,t(_.alphaMap,y.alphaMapTransform)),_.alphaTest>0&&(y.alphaTest.value=_.alphaTest)}function f(y,_){y.specular.value.copy(_.specular),y.shininess.value=Math.max(_.shininess,1e-4)}function p(y,_){_.gradientMap&&(y.gradientMap.value=_.gradientMap)}function m(y,_){y.metalness.value=_.metalness,_.metalnessMap&&(y.metalnessMap.value=_.metalnessMap,t(_.metalnessMap,y.metalnessMapTransform)),y.roughness.value=_.roughness,_.roughnessMap&&(y.roughnessMap.value=_.roughnessMap,t(_.roughnessMap,y.roughnessMapTransform)),_.envMap&&(y.envMapIntensity.value=_.envMapIntensity)}function v(y,_,E){y.ior.value=_.ior,_.sheen>0&&(y.sheenColor.value.copy(_.sheenColor).multiplyScalar(_.sheen),y.sheenRoughness.value=_.sheenRoughness,_.sheenColorMap&&(y.sheenColorMap.value=_.sheenColorMap,t(_.sheenColorMap,y.sheenColorMapTransform)),_.sheenRoughnessMap&&(y.sheenRoughnessMap.value=_.sheenRoughnessMap,t(_.sheenRoughnessMap,y.sheenRoughnessMapTransform))),_.clearcoat>0&&(y.clearcoat.value=_.clearcoat,y.clearcoatRoughness.value=_.clearcoatRoughness,_.clearcoatMap&&(y.clearcoatMap.value=_.clearcoatMap,t(_.clearcoatMap,y.clearcoatMapTransform)),_.clearcoatRoughnessMap&&(y.clearcoatRoughnessMap.value=_.clearcoatRoughnessMap,t(_.clearcoatRoughnessMap,y.clearcoatRoughnessMapTransform)),_.clearcoatNormalMap&&(y.clearcoatNormalMap.value=_.clearcoatNormalMap,t(_.clearcoatNormalMap,y.clearcoatNormalMapTransform),y.clearcoatNormalScale.value.copy(_.clearcoatNormalScale),_.side===Hn&&y.clearcoatNormalScale.value.negate())),_.dispersion>0&&(y.dispersion.value=_.dispersion),_.iridescence>0&&(y.iridescence.value=_.iridescence,y.iridescenceIOR.value=_.iridescenceIOR,y.iridescenceThicknessMinimum.value=_.iridescenceThicknessRange[0],y.iridescenceThicknessMaximum.value=_.iridescenceThicknessRange[1],_.iridescenceMap&&(y.iridescenceMap.value=_.iridescenceMap,t(_.iridescenceMap,y.iridescenceMapTransform)),_.iridescenceThicknessMap&&(y.iridescenceThicknessMap.value=_.iridescenceThicknessMap,t(_.iridescenceThicknessMap,y.iridescenceThicknessMapTransform))),_.transmission>0&&(y.transmission.value=_.transmission,y.transmissionSamplerMap.value=E.texture,y.transmissionSamplerSize.value.set(E.width,E.height),_.transmissionMap&&(y.transmissionMap.value=_.transmissionMap,t(_.transmissionMap,y.transmissionMapTransform)),y.thickness.value=_.thickness,_.thicknessMap&&(y.thicknessMap.value=_.thicknessMap,t(_.thicknessMap,y.thicknessMapTransform)),y.attenuationDistance.value=_.attenuationDistance,y.attenuationColor.value.copy(_.attenuationColor)),_.anisotropy>0&&(y.anisotropyVector.value.set(_.anisotropy*Math.cos(_.anisotropyRotation),_.anisotropy*Math.sin(_.anisotropyRotation)),_.anisotropyMap&&(y.anisotropyMap.value=_.anisotropyMap,t(_.anisotropyMap,y.anisotropyMapTransform))),y.specularIntensity.value=_.specularIntensity,y.specularColor.value.copy(_.specularColor),_.specularColorMap&&(y.specularColorMap.value=_.specularColorMap,t(_.specularColorMap,y.specularColorMapTransform)),_.specularIntensityMap&&(y.specularIntensityMap.value=_.specularIntensityMap,t(_.specularIntensityMap,y.specularIntensityMapTransform))}function x(y,_){_.matcap&&(y.matcap.value=_.matcap)}function M(y,_){const E=e.get(_).light;y.referencePosition.value.setFromMatrixPosition(E.matrixWorld),y.nearDistance.value=E.shadow.camera.near,y.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Pb(r,e,t,n){let i={},s={},a=[];const c=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function u(E,w){const T=w.program;n.uniformBlockBinding(E,T)}function h(E,w){let T=i[E.id];T===void 0&&(x(E),T=f(E),i[E.id]=T,E.addEventListener("dispose",y));const U=w.program;n.updateUBOMapping(E,U);const P=e.render.frame;s[E.id]!==P&&(m(E),s[E.id]=P)}function f(E){const w=p();E.__bindingPointIndex=w;const T=r.createBuffer(),U=E.__size,P=E.usage;return r.bindBuffer(r.UNIFORM_BUFFER,T),r.bufferData(r.UNIFORM_BUFFER,U,P),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,w,T),T}function p(){for(let E=0;E<c;E++)if(a.indexOf(E)===-1)return a.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(E){const w=i[E.id],T=E.uniforms,U=E.__cache;r.bindBuffer(r.UNIFORM_BUFFER,w);for(let P=0,I=T.length;P<I;P++){const B=Array.isArray(T[P])?T[P]:[T[P]];for(let k=0,b=B.length;k<b;k++){const C=B[k];if(v(C,P,k,U)===!0){const G=C.__offset,Z=Array.isArray(C.value)?C.value:[C.value];let $=0;for(let oe=0;oe<Z.length;oe++){const K=Z[oe],fe=M(K);typeof K=="number"||typeof K=="boolean"?(C.__data[0]=K,r.bufferSubData(r.UNIFORM_BUFFER,G+$,C.__data)):K.isMatrix3?(C.__data[0]=K.elements[0],C.__data[1]=K.elements[1],C.__data[2]=K.elements[2],C.__data[3]=0,C.__data[4]=K.elements[3],C.__data[5]=K.elements[4],C.__data[6]=K.elements[5],C.__data[7]=0,C.__data[8]=K.elements[6],C.__data[9]=K.elements[7],C.__data[10]=K.elements[8],C.__data[11]=0):(K.toArray(C.__data,$),$+=fe.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,G,C.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function v(E,w,T,U){const P=E.value,I=w+"_"+T;if(U[I]===void 0)return typeof P=="number"||typeof P=="boolean"?U[I]=P:U[I]=P.clone(),!0;{const B=U[I];if(typeof P=="number"||typeof P=="boolean"){if(B!==P)return U[I]=P,!0}else if(B.equals(P)===!1)return B.copy(P),!0}return!1}function x(E){const w=E.uniforms;let T=0;const U=16;for(let I=0,B=w.length;I<B;I++){const k=Array.isArray(w[I])?w[I]:[w[I]];for(let b=0,C=k.length;b<C;b++){const G=k[b],Z=Array.isArray(G.value)?G.value:[G.value];for(let $=0,oe=Z.length;$<oe;$++){const K=Z[$],fe=M(K),O=T%U,J=O%fe.boundary,q=O+J;T+=J,q!==0&&U-q<fe.storage&&(T+=U-q),G.__data=new Float32Array(fe.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=T,T+=fe.storage}}}const P=T%U;return P>0&&(T+=U-P),E.__size=T,E.__cache={},this}function M(E){const w={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(w.boundary=4,w.storage=4):E.isVector2?(w.boundary=8,w.storage=8):E.isVector3||E.isColor?(w.boundary=16,w.storage=12):E.isVector4?(w.boundary=16,w.storage=16):E.isMatrix3?(w.boundary=48,w.storage=48):E.isMatrix4?(w.boundary=64,w.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),w}function y(E){const w=E.target;w.removeEventListener("dispose",y);const T=a.indexOf(w.__bindingPointIndex);a.splice(T,1),r.deleteBuffer(i[w.id]),delete i[w.id],delete s[w.id]}function _(){for(const E in i)r.deleteBuffer(i[E]);a=[],i={},s={}}return{bind:u,update:h,dispose:_}}class ex{constructor(e={}){const{canvas:t=k_(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:c=!1,premultipliedAlpha:u=!0,preserveDrawingBuffer:h=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:p=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const v=new Uint32Array(4),x=new Int32Array(4);let M=null,y=null;const _=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=_i,this.toneMapping=qi,this.toneMappingExposure=1;const w=this;let T=!1,U=0,P=0,I=null,B=-1,k=null;const b=new xt,C=new xt;let G=null;const Z=new Ue(0);let $=0,oe=t.width,K=t.height,fe=1,O=null,J=null;const q=new xt(0,0,oe,K),re=new xt(0,0,oe,K);let xe=!1;const Pe=new ll;let ie=!1,me=!1;const be=new rt,Se=new rt,tt=new D,nt=new xt,Ze={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ie=!1;function de(){return I===null?fe:1}let N=n;function Te(L,W){return t.getContext(L,W)}try{const L={alpha:!0,depth:i,stencil:s,antialias:c,premultipliedAlpha:u,preserveDrawingBuffer:h,powerPreference:f,failIfMajorPerformanceCaveat:p};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Io}`),t.addEventListener("webglcontextlost",ve,!1),t.addEventListener("webglcontextrestored",Fe,!1),t.addEventListener("webglcontextcreationerror",ze,!1),N===null){const W="webgl2";if(N=Te(W,L),N===null)throw Te(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(L){throw console.error("THREE.WebGLRenderer: "+L.message),L}let we,_e,Ee,Je,De,F,R,Q,ue,pe,he,Ye,Ce,ke,Mt,ye,He,at,lt,Ve,wt,ut,Ft,V;function Be(){we=new FE(N),we.init(),ut=new Q_(N,we),_e=new PE(N,we,e,ut),Ee=new gb(N),_e.reverseDepthBuffer&&Ee.buffers.depth.setReversed(!0),Je=new zE(N),De=new ib,F=new Mb(N,we,Ee,De,_e,ut,Je),R=new LE(w),Q=new NE(w),ue=new qM(N),Ft=new CE(N,ue),pe=new OE(N,ue,Je,Ft),he=new HE(N,pe,ue,Je),lt=new kE(N,_e,F),ye=new IE(De),Ye=new nb(w,R,Q,we,_e,Ft,ye),Ce=new Rb(w,De),ke=new sb,Mt=new hb(we),at=new TE(w,R,Q,Ee,he,m,u),He=new pb(w,he,_e),V=new Pb(N,Je,_e,Ee),Ve=new RE(N,we,Je),wt=new BE(N,we,Je),Je.programs=Ye.programs,w.capabilities=_e,w.extensions=we,w.properties=De,w.renderLists=ke,w.shadowMap=He,w.state=Ee,w.info=Je}Be();const le=new Tb(w,N);this.xr=le,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const L=we.get("WEBGL_lose_context");L&&L.loseContext()},this.forceContextRestore=function(){const L=we.get("WEBGL_lose_context");L&&L.restoreContext()},this.getPixelRatio=function(){return fe},this.setPixelRatio=function(L){L!==void 0&&(fe=L,this.setSize(oe,K,!1))},this.getSize=function(L){return L.set(oe,K)},this.setSize=function(L,W,te=!0){if(le.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}oe=L,K=W,t.width=Math.floor(L*fe),t.height=Math.floor(W*fe),te===!0&&(t.style.width=L+"px",t.style.height=W+"px"),this.setViewport(0,0,L,W)},this.getDrawingBufferSize=function(L){return L.set(oe*fe,K*fe).floor()},this.setDrawingBufferSize=function(L,W,te){oe=L,K=W,fe=te,t.width=Math.floor(L*te),t.height=Math.floor(W*te),this.setViewport(0,0,L,W)},this.getCurrentViewport=function(L){return L.copy(b)},this.getViewport=function(L){return L.copy(q)},this.setViewport=function(L,W,te,ne){L.isVector4?q.set(L.x,L.y,L.z,L.w):q.set(L,W,te,ne),Ee.viewport(b.copy(q).multiplyScalar(fe).round())},this.getScissor=function(L){return L.copy(re)},this.setScissor=function(L,W,te,ne){L.isVector4?re.set(L.x,L.y,L.z,L.w):re.set(L,W,te,ne),Ee.scissor(C.copy(re).multiplyScalar(fe).round())},this.getScissorTest=function(){return xe},this.setScissorTest=function(L){Ee.setScissorTest(xe=L)},this.setOpaqueSort=function(L){O=L},this.setTransparentSort=function(L){J=L},this.getClearColor=function(L){return L.copy(at.getClearColor())},this.setClearColor=function(){at.setClearColor.apply(at,arguments)},this.getClearAlpha=function(){return at.getClearAlpha()},this.setClearAlpha=function(){at.setClearAlpha.apply(at,arguments)},this.clear=function(L=!0,W=!0,te=!0){let ne=0;if(L){let Y=!1;if(I!==null){const Ae=I.texture.format;Y=Ae===fh||Ae===hh||Ae===il}if(Y){const Ae=I.texture.type,Oe=Ae===Ri||Ae===gr||Ae===Ao||Ae===bs||Ae===lh||Ae===ch,Ge=at.getClearColor(),We=at.getClearAlpha(),st=Ge.r,ot=Ge.g,Ke=Ge.b;Oe?(v[0]=st,v[1]=ot,v[2]=Ke,v[3]=We,N.clearBufferuiv(N.COLOR,0,v)):(x[0]=st,x[1]=ot,x[2]=Ke,x[3]=We,N.clearBufferiv(N.COLOR,0,x))}else ne|=N.COLOR_BUFFER_BIT}W&&(ne|=N.DEPTH_BUFFER_BIT,N.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),te&&(ne|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(ne)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ve,!1),t.removeEventListener("webglcontextrestored",Fe,!1),t.removeEventListener("webglcontextcreationerror",ze,!1),ke.dispose(),Mt.dispose(),De.dispose(),R.dispose(),Q.dispose(),he.dispose(),Ft.dispose(),V.dispose(),Ye.dispose(),le.dispose(),le.removeEventListener("sessionstart",vl),le.removeEventListener("sessionend",_l),Ki.stop()};function ve(L){L.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function Fe(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const L=Je.autoReset,W=He.enabled,te=He.autoUpdate,ne=He.needsUpdate,Y=He.type;Be(),Je.autoReset=L,He.enabled=W,He.autoUpdate=te,He.needsUpdate=ne,He.type=Y}function ze(L){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",L.statusMessage)}function Et(L){const W=L.target;W.removeEventListener("dispose",Et),Wt(W)}function Wt(L){En(L),De.remove(L)}function En(L){const W=De.get(L).programs;W!==void 0&&(W.forEach(function(te){Ye.releaseProgram(te)}),L.isShaderMaterial&&Ye.releaseShaderCache(L))}this.renderBufferDirect=function(L,W,te,ne,Y,Ae){W===null&&(W=Ze);const Oe=Y.isMesh&&Y.matrixWorld.determinant()<0,Ge=Bh(L,W,te,ne,Y);Ee.setMaterial(ne,Oe);let We=te.index,st=1;if(ne.wireframe===!0){if(We=pe.getWireframeAttribute(te),We===void 0)return;st=2}const ot=te.drawRange,Ke=te.attributes.position;let Ct=ot.start*st,Pt=(ot.start+ot.count)*st;Ae!==null&&(Ct=Math.max(Ct,Ae.start*st),Pt=Math.min(Pt,(Ae.start+Ae.count)*st)),We!==null?(Ct=Math.max(Ct,0),Pt=Math.min(Pt,We.count)):Ke!=null&&(Ct=Math.max(Ct,0),Pt=Math.min(Pt,Ke.count));const Nt=Pt-Ct;if(Nt<0||Nt===1/0)return;Ft.setup(Y,ne,Ge,te,We);let yt,$e=Ve;if(We!==null&&(yt=ue.get(We),$e=wt,$e.setIndex(yt)),Y.isMesh)ne.wireframe===!0?(Ee.setLineWidth(ne.wireframeLinewidth*de()),$e.setMode(N.LINES)):$e.setMode(N.TRIANGLES);else if(Y.isLine){let qe=ne.linewidth;qe===void 0&&(qe=1),Ee.setLineWidth(qe*de()),Y.isLineSegments?$e.setMode(N.LINES):Y.isLineLoop?$e.setMode(N.LINE_LOOP):$e.setMode(N.LINE_STRIP)}else Y.isPoints?$e.setMode(N.POINTS):Y.isSprite&&$e.setMode(N.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)$e.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(we.get("WEBGL_multi_draw"))$e.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const qe=Y._multiDrawStarts,bt=Y._multiDrawCounts,ct=Y._multiDrawCount,an=We?ue.get(We).bytesPerElement:1,Kn=De.get(ne).currentProgram.getUniforms();for(let Ot=0;Ot<ct;Ot++)Kn.setValue(N,"_gl_DrawID",Ot),$e.render(qe[Ot]/an,bt[Ot])}else if(Y.isInstancedMesh)$e.renderInstances(Ct,Nt,Y.count);else if(te.isInstancedBufferGeometry){const qe=te._maxInstanceCount!==void 0?te._maxInstanceCount:1/0,bt=Math.min(te.instanceCount,qe);$e.renderInstances(Ct,Nt,bt)}else $e.render(Ct,Nt)};function At(L,W,te){L.transparent===!0&&L.side===Ci&&L.forceSinglePass===!1?(L.side=Hn,L.needsUpdate=!0,Fs(L,W,te),L.side=pr,L.needsUpdate=!0,Fs(L,W,te),L.side=Ci):Fs(L,W,te)}this.compile=function(L,W,te=null){te===null&&(te=L),y=Mt.get(te),y.init(W),E.push(y),te.traverseVisible(function(Y){Y.isLight&&Y.layers.test(W.layers)&&(y.pushLight(Y),Y.castShadow&&y.pushShadow(Y))}),L!==te&&L.traverseVisible(function(Y){Y.isLight&&Y.layers.test(W.layers)&&(y.pushLight(Y),Y.castShadow&&y.pushShadow(Y))}),y.setupLights();const ne=new Set;return L.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const Ae=Y.material;if(Ae)if(Array.isArray(Ae))for(let Oe=0;Oe<Ae.length;Oe++){const Ge=Ae[Oe];At(Ge,te,Y),ne.add(Ge)}else At(Ae,te,Y),ne.add(Ae)}),E.pop(),y=null,ne},this.compileAsync=function(L,W,te=null){const ne=this.compile(L,W,te);return new Promise(Y=>{function Ae(){if(ne.forEach(function(Oe){De.get(Oe).currentProgram.isReady()&&ne.delete(Oe)}),ne.size===0){Y(L);return}setTimeout(Ae,10)}we.get("KHR_parallel_shader_compile")!==null?Ae():setTimeout(Ae,10)})};let _n=null;function li(L){_n&&_n(L)}function vl(){Ki.stop()}function _l(){Ki.start()}const Ki=new Y_;Ki.setAnimationLoop(li),typeof self<"u"&&Ki.setContext(self),this.setAnimationLoop=function(L){_n=L,le.setAnimationLoop(L),L===null?Ki.stop():Ki.start()},le.addEventListener("sessionstart",vl),le.addEventListener("sessionend",_l),this.render=function(L,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),le.enabled===!0&&le.isPresenting===!0&&(le.cameraAutoUpdate===!0&&le.updateCamera(W),W=le.getCamera()),L.isScene===!0&&L.onBeforeRender(w,L,W,I),y=Mt.get(L,E.length),y.init(W),E.push(y),Se.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),Pe.setFromProjectionMatrix(Se),me=this.localClippingEnabled,ie=ye.init(this.clippingPlanes,me),M=ke.get(L,_.length),M.init(),_.push(M),le.enabled===!0&&le.isPresenting===!0){const Ae=w.xr.getDepthSensingMesh();Ae!==null&&Us(Ae,W,-1/0,w.sortObjects)}Us(L,W,0,w.sortObjects),M.finish(),w.sortObjects===!0&&M.sort(O,J),Ie=le.enabled===!1||le.isPresenting===!1||le.hasDepthSensing()===!1,Ie&&at.addToRenderList(M,L),this.info.render.frame++,ie===!0&&ye.beginShadows();const te=y.state.shadowsArray;He.render(te,L,W),ie===!0&&ye.endShadows(),this.info.autoReset===!0&&this.info.reset();const ne=M.opaque,Y=M.transmissive;if(y.setupLights(),W.isArrayCamera){const Ae=W.cameras;if(Y.length>0)for(let Oe=0,Ge=Ae.length;Oe<Ge;Oe++){const We=Ae[Oe];xl(ne,Y,L,We)}Ie&&at.render(L);for(let Oe=0,Ge=Ae.length;Oe<Ge;Oe++){const We=Ae[Oe];Ns(M,L,We,We.viewport)}}else Y.length>0&&xl(ne,Y,L,W),Ie&&at.render(L),Ns(M,L,W);I!==null&&(F.updateMultisampleRenderTarget(I),F.updateRenderTargetMipmap(I)),L.isScene===!0&&L.onAfterRender(w,L,W),Ft.resetDefaultState(),B=-1,k=null,E.pop(),E.length>0?(y=E[E.length-1],ie===!0&&ye.setGlobalState(w.clippingPlanes,y.state.camera)):y=null,_.pop(),_.length>0?M=_[_.length-1]:M=null};function Us(L,W,te,ne){if(L.visible===!1)return;if(L.layers.test(W.layers)){if(L.isGroup)te=L.renderOrder;else if(L.isLOD)L.autoUpdate===!0&&L.update(W);else if(L.isLight)y.pushLight(L),L.castShadow&&y.pushShadow(L);else if(L.isSprite){if(!L.frustumCulled||Pe.intersectsSprite(L)){ne&&nt.setFromMatrixPosition(L.matrixWorld).applyMatrix4(Se);const Oe=he.update(L),Ge=L.material;Ge.visible&&M.push(L,Oe,Ge,te,nt.z,null)}}else if((L.isMesh||L.isLine||L.isPoints)&&(!L.frustumCulled||Pe.intersectsObject(L))){const Oe=he.update(L),Ge=L.material;if(ne&&(L.boundingSphere!==void 0?(L.boundingSphere===null&&L.computeBoundingSphere(),nt.copy(L.boundingSphere.center)):(Oe.boundingSphere===null&&Oe.computeBoundingSphere(),nt.copy(Oe.boundingSphere.center)),nt.applyMatrix4(L.matrixWorld).applyMatrix4(Se)),Array.isArray(Ge)){const We=Oe.groups;for(let st=0,ot=We.length;st<ot;st++){const Ke=We[st],Ct=Ge[Ke.materialIndex];Ct&&Ct.visible&&M.push(L,Oe,Ct,te,nt.z,Ke)}}else Ge.visible&&M.push(L,Oe,Ge,te,nt.z,null)}}const Ae=L.children;for(let Oe=0,Ge=Ae.length;Oe<Ge;Oe++)Us(Ae[Oe],W,te,ne)}function Ns(L,W,te,ne){const Y=L.opaque,Ae=L.transmissive,Oe=L.transparent;y.setupLightsView(te),ie===!0&&ye.setGlobalState(w.clippingPlanes,te),ne&&Ee.viewport(b.copy(ne)),Y.length>0&&Di(Y,W,te),Ae.length>0&&Di(Ae,W,te),Oe.length>0&&Di(Oe,W,te),Ee.buffers.depth.setTest(!0),Ee.buffers.depth.setMask(!0),Ee.buffers.color.setMask(!0),Ee.setPolygonOffset(!1)}function xl(L,W,te,ne){if((te.isScene===!0?te.overrideMaterial:null)!==null)return;y.state.transmissionRenderTarget[ne.id]===void 0&&(y.state.transmissionRenderTarget[ne.id]=new Pi(1,1,{generateMipmaps:!0,type:we.has("EXT_color_buffer_half_float")||we.has("EXT_color_buffer_float")?Do:Ri,minFilter:Wi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ut.workingColorSpace}));const Ae=y.state.transmissionRenderTarget[ne.id],Oe=ne.viewport||b;Ae.setSize(Oe.z,Oe.w);const Ge=w.getRenderTarget();w.setRenderTarget(Ae),w.getClearColor(Z),$=w.getClearAlpha(),$<1&&w.setClearColor(16777215,.5),w.clear(),Ie&&at.render(te);const We=w.toneMapping;w.toneMapping=qi;const st=ne.viewport;if(ne.viewport!==void 0&&(ne.viewport=void 0),y.setupLightsView(ne),ie===!0&&ye.setGlobalState(w.clippingPlanes,ne),Di(L,te,ne),F.updateMultisampleRenderTarget(Ae),F.updateRenderTargetMipmap(Ae),we.has("WEBGL_multisampled_render_to_texture")===!1){let ot=!1;for(let Ke=0,Ct=W.length;Ke<Ct;Ke++){const Pt=W[Ke],Nt=Pt.object,yt=Pt.geometry,$e=Pt.material,qe=Pt.group;if($e.side===Ci&&Nt.layers.test(ne.layers)){const bt=$e.side;$e.side=Hn,$e.needsUpdate=!0,yl(Nt,te,ne,yt,$e,qe),$e.side=bt,$e.needsUpdate=!0,ot=!0}}ot===!0&&(F.updateMultisampleRenderTarget(Ae),F.updateRenderTargetMipmap(Ae))}w.setRenderTarget(Ge),w.setClearColor(Z,$),st!==void 0&&(ne.viewport=st),w.toneMapping=We}function Di(L,W,te){const ne=W.isScene===!0?W.overrideMaterial:null;for(let Y=0,Ae=L.length;Y<Ae;Y++){const Oe=L[Y],Ge=Oe.object,We=Oe.geometry,st=ne===null?Oe.material:ne,ot=Oe.group;Ge.layers.test(te.layers)&&yl(Ge,W,te,We,st,ot)}}function yl(L,W,te,ne,Y,Ae){L.onBeforeRender(w,W,te,ne,Y,Ae),L.modelViewMatrix.multiplyMatrices(te.matrixWorldInverse,L.matrixWorld),L.normalMatrix.getNormalMatrix(L.modelViewMatrix),Y.onBeforeRender(w,W,te,ne,L,Ae),Y.transparent===!0&&Y.side===Ci&&Y.forceSinglePass===!1?(Y.side=Hn,Y.needsUpdate=!0,w.renderBufferDirect(te,W,ne,Y,L,Ae),Y.side=pr,Y.needsUpdate=!0,w.renderBufferDirect(te,W,ne,Y,L,Ae),Y.side=Ci):w.renderBufferDirect(te,W,ne,Y,L,Ae),L.onAfterRender(w,W,te,ne,Y,Ae)}function Fs(L,W,te){W.isScene!==!0&&(W=Ze);const ne=De.get(L),Y=y.state.lights,Ae=y.state.shadowsArray,Oe=Y.state.version,Ge=Ye.getParameters(L,Y.state,Ae,W,te),We=Ye.getProgramCacheKey(Ge);let st=ne.programs;ne.environment=L.isMeshStandardMaterial?W.environment:null,ne.fog=W.fog,ne.envMap=(L.isMeshStandardMaterial?Q:R).get(L.envMap||ne.environment),ne.envMapRotation=ne.environment!==null&&L.envMap===null?W.environmentRotation:L.envMapRotation,st===void 0&&(L.addEventListener("dispose",Et),st=new Map,ne.programs=st);let ot=st.get(We);if(ot!==void 0){if(ne.currentProgram===ot&&ne.lightsStateVersion===Oe)return Ml(L,Ge),ot}else Ge.uniforms=Ye.getUniforms(L),L.onBeforeCompile(Ge,w),ot=Ye.acquireProgram(Ge,We),st.set(We,ot),ne.uniforms=Ge.uniforms;const Ke=ne.uniforms;return(!L.isShaderMaterial&&!L.isRawShaderMaterial||L.clipping===!0)&&(Ke.clippingPlanes=ye.uniform),Ml(L,Ge),ne.needsLights=kh(L),ne.lightsStateVersion=Oe,ne.needsLights&&(Ke.ambientLightColor.value=Y.state.ambient,Ke.lightProbe.value=Y.state.probe,Ke.directionalLights.value=Y.state.directional,Ke.directionalLightShadows.value=Y.state.directionalShadow,Ke.spotLights.value=Y.state.spot,Ke.spotLightShadows.value=Y.state.spotShadow,Ke.rectAreaLights.value=Y.state.rectArea,Ke.ltc_1.value=Y.state.rectAreaLTC1,Ke.ltc_2.value=Y.state.rectAreaLTC2,Ke.pointLights.value=Y.state.point,Ke.pointLightShadows.value=Y.state.pointShadow,Ke.hemisphereLights.value=Y.state.hemi,Ke.directionalShadowMap.value=Y.state.directionalShadowMap,Ke.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Ke.spotShadowMap.value=Y.state.spotShadowMap,Ke.spotLightMatrix.value=Y.state.spotLightMatrix,Ke.spotLightMap.value=Y.state.spotLightMap,Ke.pointShadowMap.value=Y.state.pointShadowMap,Ke.pointShadowMatrix.value=Y.state.pointShadowMatrix),ne.currentProgram=ot,ne.uniformsList=null,ot}function Sl(L){if(L.uniformsList===null){const W=L.currentProgram.getUniforms();L.uniformsList=mu.seqWithValue(W.seq,L.uniforms)}return L.uniformsList}function Ml(L,W){const te=De.get(L);te.outputColorSpace=W.outputColorSpace,te.batching=W.batching,te.batchingColor=W.batchingColor,te.instancing=W.instancing,te.instancingColor=W.instancingColor,te.instancingMorph=W.instancingMorph,te.skinning=W.skinning,te.morphTargets=W.morphTargets,te.morphNormals=W.morphNormals,te.morphColors=W.morphColors,te.morphTargetsCount=W.morphTargetsCount,te.numClippingPlanes=W.numClippingPlanes,te.numIntersection=W.numClipIntersection,te.vertexAlphas=W.vertexAlphas,te.vertexTangents=W.vertexTangents,te.toneMapping=W.toneMapping}function Bh(L,W,te,ne,Y){W.isScene!==!0&&(W=Ze),F.resetTextureUnits();const Ae=W.fog,Oe=ne.isMeshStandardMaterial?W.environment:null,Ge=I===null?w.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:_r,We=(ne.isMeshStandardMaterial?Q:R).get(ne.envMap||Oe),st=ne.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,ot=!!te.attributes.tangent&&(!!ne.normalMap||ne.anisotropy>0),Ke=!!te.morphAttributes.position,Ct=!!te.morphAttributes.normal,Pt=!!te.morphAttributes.color;let Nt=qi;ne.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(Nt=w.toneMapping);const yt=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,$e=yt!==void 0?yt.length:0,qe=De.get(ne),bt=y.state.lights;if(ie===!0&&(me===!0||L!==k)){const Dn=L===k&&ne.id===B;ye.setState(ne,L,Dn)}let ct=!1;ne.version===qe.__version?(qe.needsLights&&qe.lightsStateVersion!==bt.state.version||qe.outputColorSpace!==Ge||Y.isBatchedMesh&&qe.batching===!1||!Y.isBatchedMesh&&qe.batching===!0||Y.isBatchedMesh&&qe.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&qe.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&qe.instancing===!1||!Y.isInstancedMesh&&qe.instancing===!0||Y.isSkinnedMesh&&qe.skinning===!1||!Y.isSkinnedMesh&&qe.skinning===!0||Y.isInstancedMesh&&qe.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&qe.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&qe.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&qe.instancingMorph===!1&&Y.morphTexture!==null||qe.envMap!==We||ne.fog===!0&&qe.fog!==Ae||qe.numClippingPlanes!==void 0&&(qe.numClippingPlanes!==ye.numPlanes||qe.numIntersection!==ye.numIntersection)||qe.vertexAlphas!==st||qe.vertexTangents!==ot||qe.morphTargets!==Ke||qe.morphNormals!==Ct||qe.morphColors!==Pt||qe.toneMapping!==Nt||qe.morphTargetsCount!==$e)&&(ct=!0):(ct=!0,qe.__version=ne.version);let an=qe.currentProgram;ct===!0&&(an=Fs(ne,W,Y));let Kn=!1,Ot=!1,yr=!1;const Vt=an.getUniforms(),yi=qe.uniforms;if(Ee.useProgram(an.program)&&(Kn=!0,Ot=!0,yr=!0),ne.id!==B&&(B=ne.id,Ot=!0),Kn||k!==L){_e.reverseDepthBuffer?(be.copy(L.projectionMatrix),gM(be),vM(be),Vt.setValue(N,"projectionMatrix",be)):Vt.setValue(N,"projectionMatrix",L.projectionMatrix),Vt.setValue(N,"viewMatrix",L.matrixWorldInverse);const Dn=Vt.map.cameraPosition;Dn!==void 0&&Dn.setValue(N,tt.setFromMatrixPosition(L.matrixWorld)),_e.logarithmicDepthBuffer&&Vt.setValue(N,"logDepthBufFC",2/(Math.log(L.far+1)/Math.LN2)),(ne.isMeshPhongMaterial||ne.isMeshToonMaterial||ne.isMeshLambertMaterial||ne.isMeshBasicMaterial||ne.isMeshStandardMaterial||ne.isShaderMaterial)&&Vt.setValue(N,"isOrthographic",L.isOrthographicCamera===!0),k!==L&&(k=L,Ot=!0,yr=!0)}if(Y.isSkinnedMesh){Vt.setOptional(N,Y,"bindMatrix"),Vt.setOptional(N,Y,"bindMatrixInverse");const Dn=Y.skeleton;Dn&&(Dn.boneTexture===null&&Dn.computeBoneTexture(),Vt.setValue(N,"boneTexture",Dn.boneTexture,F))}Y.isBatchedMesh&&(Vt.setOptional(N,Y,"batchingTexture"),Vt.setValue(N,"batchingTexture",Y._matricesTexture,F),Vt.setOptional(N,Y,"batchingIdTexture"),Vt.setValue(N,"batchingIdTexture",Y._indirectTexture,F),Vt.setOptional(N,Y,"batchingColorTexture"),Y._colorsTexture!==null&&Vt.setValue(N,"batchingColorTexture",Y._colorsTexture,F));const Sr=te.morphAttributes;if((Sr.position!==void 0||Sr.normal!==void 0||Sr.color!==void 0)&&lt.update(Y,te,an),(Ot||qe.receiveShadow!==Y.receiveShadow)&&(qe.receiveShadow=Y.receiveShadow,Vt.setValue(N,"receiveShadow",Y.receiveShadow)),ne.isMeshGouraudMaterial&&ne.envMap!==null&&(yi.envMap.value=We,yi.flipEnvMap.value=We.isCubeTexture&&We.isRenderTargetTexture===!1?-1:1),ne.isMeshStandardMaterial&&ne.envMap===null&&W.environment!==null&&(yi.envMapIntensity.value=W.environmentIntensity),Ot&&(Vt.setValue(N,"toneMappingExposure",w.toneMappingExposure),qe.needsLights&&zh(yi,yr),Ae&&ne.fog===!0&&Ce.refreshFogUniforms(yi,Ae),Ce.refreshMaterialUniforms(yi,ne,fe,K,y.state.transmissionRenderTarget[L.id]),mu.upload(N,Sl(qe),yi,F)),ne.isShaderMaterial&&ne.uniformsNeedUpdate===!0&&(mu.upload(N,Sl(qe),yi,F),ne.uniformsNeedUpdate=!1),ne.isSpriteMaterial&&Vt.setValue(N,"center",Y.center),Vt.setValue(N,"modelViewMatrix",Y.modelViewMatrix),Vt.setValue(N,"normalMatrix",Y.normalMatrix),Vt.setValue(N,"modelMatrix",Y.matrixWorld),ne.isShaderMaterial||ne.isRawShaderMaterial){const Dn=ne.uniformsGroups;for(let Un=0,Hh=Dn.length;Un<Hh;Un++){const wl=Dn[Un];V.update(wl,an),V.bind(wl,an)}}return an}function zh(L,W){L.ambientLightColor.needsUpdate=W,L.lightProbe.needsUpdate=W,L.directionalLights.needsUpdate=W,L.directionalLightShadows.needsUpdate=W,L.pointLights.needsUpdate=W,L.pointLightShadows.needsUpdate=W,L.spotLights.needsUpdate=W,L.spotLightShadows.needsUpdate=W,L.rectAreaLights.needsUpdate=W,L.hemisphereLights.needsUpdate=W}function kh(L){return L.isMeshLambertMaterial||L.isMeshToonMaterial||L.isMeshPhongMaterial||L.isMeshStandardMaterial||L.isShadowMaterial||L.isShaderMaterial&&L.lights===!0}this.getActiveCubeFace=function(){return U},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(L,W,te){De.get(L.texture).__webglTexture=W,De.get(L.depthTexture).__webglTexture=te;const ne=De.get(L);ne.__hasExternalTextures=!0,ne.__autoAllocateDepthBuffer=te===void 0,ne.__autoAllocateDepthBuffer||we.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ne.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(L,W){const te=De.get(L);te.__webglFramebuffer=W,te.__useDefaultFramebuffer=W===void 0},this.setRenderTarget=function(L,W=0,te=0){I=L,U=W,P=te;let ne=!0,Y=null,Ae=!1,Oe=!1;if(L){const We=De.get(L);if(We.__useDefaultFramebuffer!==void 0)Ee.bindFramebuffer(N.FRAMEBUFFER,null),ne=!1;else if(We.__webglFramebuffer===void 0)F.setupRenderTarget(L);else if(We.__hasExternalTextures)F.rebindTextures(L,De.get(L.texture).__webglTexture,De.get(L.depthTexture).__webglTexture);else if(L.depthBuffer){const Ke=L.depthTexture;if(We.__boundDepthTexture!==Ke){if(Ke!==null&&De.has(Ke)&&(L.width!==Ke.image.width||L.height!==Ke.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");F.setupDepthRenderbuffer(L)}}const st=L.texture;(st.isData3DTexture||st.isDataArrayTexture||st.isCompressedArrayTexture)&&(Oe=!0);const ot=De.get(L).__webglFramebuffer;L.isWebGLCubeRenderTarget?(Array.isArray(ot[W])?Y=ot[W][te]:Y=ot[W],Ae=!0):L.samples>0&&F.useMultisampledRTT(L)===!1?Y=De.get(L).__webglMultisampledFramebuffer:Array.isArray(ot)?Y=ot[te]:Y=ot,b.copy(L.viewport),C.copy(L.scissor),G=L.scissorTest}else b.copy(q).multiplyScalar(fe).floor(),C.copy(re).multiplyScalar(fe).floor(),G=xe;if(Ee.bindFramebuffer(N.FRAMEBUFFER,Y)&&ne&&Ee.drawBuffers(L,Y),Ee.viewport(b),Ee.scissor(C),Ee.setScissorTest(G),Ae){const We=De.get(L.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+W,We.__webglTexture,te)}else if(Oe){const We=De.get(L.texture),st=W||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,We.__webglTexture,te||0,st)}B=-1},this.readRenderTargetPixels=function(L,W,te,ne,Y,Ae,Oe){if(!(L&&L.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ge=De.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&Oe!==void 0&&(Ge=Ge[Oe]),Ge){Ee.bindFramebuffer(N.FRAMEBUFFER,Ge);try{const We=L.texture,st=We.format,ot=We.type;if(!_e.textureFormatReadable(st)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!_e.textureTypeReadable(ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=L.width-ne&&te>=0&&te<=L.height-Y&&N.readPixels(W,te,ne,Y,ut.convert(st),ut.convert(ot),Ae)}finally{const We=I!==null?De.get(I).__webglFramebuffer:null;Ee.bindFramebuffer(N.FRAMEBUFFER,We)}}},this.readRenderTargetPixelsAsync=async function(L,W,te,ne,Y,Ae,Oe){if(!(L&&L.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ge=De.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&Oe!==void 0&&(Ge=Ge[Oe]),Ge){const We=L.texture,st=We.format,ot=We.type;if(!_e.textureFormatReadable(st))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!_e.textureTypeReadable(ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(W>=0&&W<=L.width-ne&&te>=0&&te<=L.height-Y){Ee.bindFramebuffer(N.FRAMEBUFFER,Ge);const Ke=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Ke),N.bufferData(N.PIXEL_PACK_BUFFER,Ae.byteLength,N.STREAM_READ),N.readPixels(W,te,ne,Y,ut.convert(st),ut.convert(ot),0);const Ct=I!==null?De.get(I).__webglFramebuffer:null;Ee.bindFramebuffer(N.FRAMEBUFFER,Ct);const Pt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await mM(N,Pt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Ke),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Ae),N.deleteBuffer(Ke),N.deleteSync(Pt),Ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(L,W=null,te=0){L.isTexture!==!0&&(pu("WebGLRenderer: copyFramebufferToTexture function signature has changed."),W=arguments[0]||null,L=arguments[1]);const ne=Math.pow(2,-te),Y=Math.floor(L.image.width*ne),Ae=Math.floor(L.image.height*ne),Oe=W!==null?W.x:0,Ge=W!==null?W.y:0;F.setTexture2D(L,0),N.copyTexSubImage2D(N.TEXTURE_2D,te,0,0,Oe,Ge,Y,Ae),Ee.unbindTexture()},this.copyTextureToTexture=function(L,W,te=null,ne=null,Y=0){L.isTexture!==!0&&(pu("WebGLRenderer: copyTextureToTexture function signature has changed."),ne=arguments[0]||null,L=arguments[1],W=arguments[2],Y=arguments[3]||0,te=null);let Ae,Oe,Ge,We,st,ot;te!==null?(Ae=te.max.x-te.min.x,Oe=te.max.y-te.min.y,Ge=te.min.x,We=te.min.y):(Ae=L.image.width,Oe=L.image.height,Ge=0,We=0),ne!==null?(st=ne.x,ot=ne.y):(st=0,ot=0);const Ke=ut.convert(W.format),Ct=ut.convert(W.type);F.setTexture2D(W,0),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,W.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,W.unpackAlignment);const Pt=N.getParameter(N.UNPACK_ROW_LENGTH),Nt=N.getParameter(N.UNPACK_IMAGE_HEIGHT),yt=N.getParameter(N.UNPACK_SKIP_PIXELS),$e=N.getParameter(N.UNPACK_SKIP_ROWS),qe=N.getParameter(N.UNPACK_SKIP_IMAGES),bt=L.isCompressedTexture?L.mipmaps[Y]:L.image;N.pixelStorei(N.UNPACK_ROW_LENGTH,bt.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,bt.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Ge),N.pixelStorei(N.UNPACK_SKIP_ROWS,We),L.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,Y,st,ot,Ae,Oe,Ke,Ct,bt.data):L.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,Y,st,ot,bt.width,bt.height,Ke,bt.data):N.texSubImage2D(N.TEXTURE_2D,Y,st,ot,Ae,Oe,Ke,Ct,bt),N.pixelStorei(N.UNPACK_ROW_LENGTH,Pt),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Nt),N.pixelStorei(N.UNPACK_SKIP_PIXELS,yt),N.pixelStorei(N.UNPACK_SKIP_ROWS,$e),N.pixelStorei(N.UNPACK_SKIP_IMAGES,qe),Y===0&&W.generateMipmaps&&N.generateMipmap(N.TEXTURE_2D),Ee.unbindTexture()},this.copyTextureToTexture3D=function(L,W,te=null,ne=null,Y=0){L.isTexture!==!0&&(pu("WebGLRenderer: copyTextureToTexture3D function signature has changed."),te=arguments[0]||null,ne=arguments[1]||null,L=arguments[2],W=arguments[3],Y=arguments[4]||0);let Ae,Oe,Ge,We,st,ot,Ke,Ct,Pt;const Nt=L.isCompressedTexture?L.mipmaps[Y]:L.image;te!==null?(Ae=te.max.x-te.min.x,Oe=te.max.y-te.min.y,Ge=te.max.z-te.min.z,We=te.min.x,st=te.min.y,ot=te.min.z):(Ae=Nt.width,Oe=Nt.height,Ge=Nt.depth,We=0,st=0,ot=0),ne!==null?(Ke=ne.x,Ct=ne.y,Pt=ne.z):(Ke=0,Ct=0,Pt=0);const yt=ut.convert(W.format),$e=ut.convert(W.type);let qe;if(W.isData3DTexture)F.setTexture3D(W,0),qe=N.TEXTURE_3D;else if(W.isDataArrayTexture||W.isCompressedArrayTexture)F.setTexture2DArray(W,0),qe=N.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,W.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,W.unpackAlignment);const bt=N.getParameter(N.UNPACK_ROW_LENGTH),ct=N.getParameter(N.UNPACK_IMAGE_HEIGHT),an=N.getParameter(N.UNPACK_SKIP_PIXELS),Kn=N.getParameter(N.UNPACK_SKIP_ROWS),Ot=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,Nt.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Nt.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,We),N.pixelStorei(N.UNPACK_SKIP_ROWS,st),N.pixelStorei(N.UNPACK_SKIP_IMAGES,ot),L.isDataTexture||L.isData3DTexture?N.texSubImage3D(qe,Y,Ke,Ct,Pt,Ae,Oe,Ge,yt,$e,Nt.data):W.isCompressedArrayTexture?N.compressedTexSubImage3D(qe,Y,Ke,Ct,Pt,Ae,Oe,Ge,yt,Nt.data):N.texSubImage3D(qe,Y,Ke,Ct,Pt,Ae,Oe,Ge,yt,$e,Nt),N.pixelStorei(N.UNPACK_ROW_LENGTH,bt),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ct),N.pixelStorei(N.UNPACK_SKIP_PIXELS,an),N.pixelStorei(N.UNPACK_SKIP_ROWS,Kn),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ot),Y===0&&W.generateMipmaps&&N.generateMipmap(qe),Ee.unbindTexture()},this.initRenderTarget=function(L){De.get(L).__webglFramebuffer===void 0&&F.setupRenderTarget(L)},this.initTexture=function(L){L.isCubeTexture?F.setTextureCube(L,0):L.isData3DTexture?F.setTexture3D(L,0):L.isDataArrayTexture||L.isCompressedArrayTexture?F.setTexture2DArray(L,0):F.setTexture2D(L,0),Ee.unbindTexture()},this.resetState=function(){U=0,P=0,I=null,Ee.reset(),Ft.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Xi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===ph?"display-p3":"srgb",t.unpackColorSpace=Ut.workingColorSpace===rl?"display-p3":"srgb"}}class vh{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ue(e),this.density=t}clone(){return new vh(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class _h{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ue(e),this.near=t,this.far=n}clone(){return new _h(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class $u extends Tt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new oi,this.environmentIntensity=1,this.environmentRotation=new oi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class xh{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Wa,this.updateRanges=[],this.version=0,this.uuid=si()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=si()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=si()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const On=new D;class ri{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)On.fromBufferAttribute(this,t),On.applyMatrix4(e),this.setXYZ(t,On.x,On.y,On.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)On.fromBufferAttribute(this,t),On.applyNormalMatrix(e),this.setXYZ(t,On.x,On.y,On.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)On.fromBufferAttribute(this,t),On.transformDirection(e),this.setXYZ(t,On.x,On.y,On.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=kn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=pt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=kn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=kn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=kn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=kn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array),s=pt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new Bt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ri(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class kp extends wn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ue(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let lo;const ca=new D,co=new D,uo=new D,ho=new ge,ua=new ge,tx=new rt,Fc=new D,ha=new D,Oc=new D,I0=new ge,Sd=new ge,L0=new ge;class nx extends Tt{constructor(e=new kp){if(super(),this.isSprite=!0,this.type="Sprite",lo===void 0){lo=new gt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new xh(t,5);lo.setIndex([0,1,2,0,2,3]),lo.setAttribute("position",new ri(n,3,0,!1)),lo.setAttribute("uv",new ri(n,2,3,!1))}this.geometry=lo,this.material=e,this.center=new ge(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),co.setFromMatrixScale(this.matrixWorld),tx.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),uo.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&co.multiplyScalar(-uo.z);const n=this.material.rotation;let i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));const a=this.center;Bc(Fc.set(-.5,-.5,0),uo,a,co,i,s),Bc(ha.set(.5,-.5,0),uo,a,co,i,s),Bc(Oc.set(.5,.5,0),uo,a,co,i,s),I0.set(0,0),Sd.set(1,0),L0.set(1,1);let c=e.ray.intersectTriangle(Fc,ha,Oc,!1,ca);if(c===null&&(Bc(ha.set(-.5,.5,0),uo,a,co,i,s),Sd.set(0,1),c=e.ray.intersectTriangle(Fc,Oc,ha,!1,ca),c===null))return;const u=e.ray.origin.distanceTo(ca);u<e.near||u>e.far||t.push({distance:u,point:ca.clone(),uv:Yn.getInterpolation(ca,Fc,ha,Oc,I0,Sd,L0,new ge),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Bc(r,e,t,n,i,s){ho.subVectors(r,t).addScalar(.5).multiply(n),i!==void 0?(ua.x=s*ho.x-i*ho.y,ua.y=i*ho.x+s*ho.y):ua.copy(ho),r.copy(e),r.x+=ua.x,r.y+=ua.y,r.applyMatrix4(tx)}const zc=new D,D0=new D;class ix extends Tt{constructor(){super(),this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]},isLOD:{value:!0}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);const t=e.levels;for(let n=0,i=t.length;n<i;n++){const s=t[n];this.addLevel(s.object.clone(),s.distance,s.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,n=0){t=Math.abs(t);const i=this.levels;let s;for(s=0;s<i.length&&!(t<i[s].distance);s++);return i.splice(s,0,{distance:t,hysteresis:n,object:e}),this.add(e),this}removeLevel(e){const t=this.levels;for(let n=0;n<t.length;n++)if(t[n].distance===e){const i=t.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){const t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i;n++){let s=t[n].distance;if(t[n].object.visible&&(s-=s*t[n].hysteresis),e<s)break}return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){zc.setFromMatrixPosition(this.matrixWorld);const i=e.ray.origin.distanceTo(zc);this.getObjectForDistance(i).raycast(e,t)}}update(e){const t=this.levels;if(t.length>1){zc.setFromMatrixPosition(e.matrixWorld),D0.setFromMatrixPosition(this.matrixWorld);const n=zc.distanceTo(D0)/e.zoom;t[0].object.visible=!0;let i,s;for(i=1,s=t.length;i<s;i++){let a=t[i].distance;if(t[i].object.visible&&(a-=a*t[i].hysteresis),n>=a)t[i-1].object.visible=!1,t[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<s;i++)t[i].object.visible=!1}}toJSON(e){const t=super.toJSON(e);this.autoUpdate===!1&&(t.object.autoUpdate=!1),t.object.levels=[];const n=this.levels;for(let i=0,s=n.length;i<s;i++){const a=n[i];t.object.levels.push({object:a.object.uuid,distance:a.distance,hysteresis:a.hysteresis})}return t}}const U0=new D,N0=new xt,F0=new xt,Ib=new D,O0=new rt,kc=new D,Md=new vn,B0=new rt,wd=new Uo;class rx extends en{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=tp,this.bindMatrix=new rt,this.bindMatrixInverse=new rt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new gn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,kc),this.boundingBox.expandByPoint(kc)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new vn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,kc),this.boundingSphere.expandByPoint(kc)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Md.copy(this.boundingSphere),Md.applyMatrix4(i),e.ray.intersectsSphere(Md)!==!1&&(B0.copy(i).invert(),wd.copy(e.ray).applyMatrix4(B0),!(this.boundingBox!==null&&wd.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,wd)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new xt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===tp?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===A_?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;N0.fromBufferAttribute(i.attributes.skinIndex,e),F0.fromBufferAttribute(i.attributes.skinWeight,e),U0.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const a=F0.getComponent(s);if(a!==0){const c=N0.getComponent(s);O0.multiplyMatrices(n.bones[c].matrixWorld,n.boneInverses[c]),t.addScaledVector(Ib.copy(U0).applyMatrix4(O0),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Hp extends Tt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Yi extends Yt{constructor(e=null,t=1,n=1,i,s,a,c,u,h=mn,f=mn,p,m){super(null,a,c,u,h,f,i,s,p,m),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const z0=new rt,Lb=new rt;class yh{constructor(e=[],t=[]){this.uuid=si(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new rt)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new rt;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,a=e.length;s<a;s++){const c=e[s]?e[s].matrixWorld:Lb;z0.multiplyMatrices(c,t[s]),z0.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new yh(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Yi(t,e,e,Ln,jn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const s=e.bones[n];let a=t[s];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),a=new Hp),this.bones.push(a),this.boneInverses.push(new rt().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){const a=t[i];e.bones.push(a.uuid);const c=n[i];e.boneInverses.push(c.toArray())}return e}}class Co extends Bt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const fo=new rt,k0=new rt,Hc=[],H0=new gn,Db=new rt,fa=new en,da=new vn;class sx extends en{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Co(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Db)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new gn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,fo),H0.copy(e.boundingBox).applyMatrix4(fo),this.boundingBox.union(H0)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new vn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,fo),da.copy(e.boundingSphere).applyMatrix4(fo),this.boundingSphere.union(da)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let c=0;c<n.length;c++)n[c]=i[a+c]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(fa.geometry=this.geometry,fa.material=this.material,fa.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),da.copy(this.boundingSphere),da.applyMatrix4(n),e.ray.intersectsSphere(da)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,fo),k0.multiplyMatrices(n,fo),fa.matrixWorld=k0,fa.raycast(e,Hc);for(let a=0,c=Hc.length;a<c;a++){const u=Hc[a];u.instanceId=s,u.object=this,t.push(u)}Hc.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Co(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Yi(new Float32Array(i*this.count),i,this.count,uh,jn));const s=this.morphTexture.source.data.data;let a=0;for(let h=0;h<n.length;h++)a+=n[h];const c=this.geometry.morphTargetsRelative?1:1-a,u=i*e;s[u]=c,s.set(n,u+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}function Ub(r,e){return r.z-e.z}function Nb(r,e){return e.z-r.z}class Fb{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n){const i=this.pool,s=this.list;this.index>=i.length&&i.push({start:-1,count:-1,z:-1,index:-1});const a=i[this.index];s.push(a),this.index++,a.start=e.start,a.count=e.count,a.z=t,a.index=n}reset(){this.list.length=0,this.index=0}}const Fr=new rt,Ed=new rt,Ob=new rt,Bb=new Ue(1,1,1),V0=new rt,Ad=new ll,Vc=new gn,os=new vn,pa=new D,G0=new D,zb=new D,bd=new Fb,In=new en,Gc=[];function kb(r,e,t=0){const n=e.itemSize;if(r.isInterleavedBufferAttribute||r.array.constructor!==e.array.constructor){const i=r.count;for(let s=0;s<i;s++)for(let a=0;a<n;a++)e.setComponent(s+t,a,r.getComponent(s,a))}else e.array.set(r.array,t*n);e.needsUpdate=!0}class ox extends en{get maxInstanceCount(){return this._maxInstanceCount}constructor(e,t,n=t*2,i){super(new gt,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._drawInfo=[],this._availableInstanceIds=[],this._drawRanges=[],this._reservedRanges=[],this._bounds=[],this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=n,this._geometryInitialized=!1,this._geometryCount=0,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._multiDrawInstances=null,this._visibilityChanged=!0,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4),n=new Yi(t,e,e,Ln,jn);this._matricesTexture=n}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);const t=new Uint32Array(e*e),n=new Yi(t,e,e,il,gr);this._indirectTexture=n}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);const t=new Float32Array(e*e*4).fill(1),n=new Yi(t,e,e,Ln,jn);n.colorSpace=Ut.workingColorSpace,this._colorsTexture=n}_initializeGeometry(e){const t=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(const s in e.attributes){const a=e.getAttribute(s),{array:c,itemSize:u,normalized:h}=a,f=new c.constructor(n*u),p=new Bt(f,u,h);t.setAttribute(s,p)}if(e.getIndex()!==null){const s=n>65535?new Uint32Array(i):new Uint16Array(i);t.setIndex(new Bt(s,1))}this._geometryInitialized=!0}}_validateGeometry(e){const t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('BatchedMesh: All geometries must consistently have "index".');for(const n in t.attributes){if(!e.hasAttribute(n))throw new Error(`BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);const i=e.getAttribute(n),s=t.getAttribute(n);if(i.itemSize!==s.itemSize||i.normalized!==s.normalized)throw new Error("BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new gn);const e=this.boundingBox,t=this._drawInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;const s=t[n].geometryIndex;this.getMatrixAt(n,Fr),this.getBoundingBoxAt(s,Vc).applyMatrix4(Fr),e.union(Vc)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vn);const e=this.boundingSphere,t=this._drawInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;const s=t[n].geometryIndex;this.getMatrixAt(n,Fr),this.getBoundingSphereAt(s,os).applyMatrix4(Fr),e.union(os)}}addInstance(e){if(this._drawInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("BatchedMesh: Maximum item count reached.");const n={visible:!0,active:!0,geometryIndex:e};let i=null;this._availableInstanceIds.length>0?(i=this._availableInstanceIds.pop(),this._drawInfo[i]=n):(i=this._drawInfo.length,this._drawInfo.push(n));const s=this._matricesTexture,a=s.image.data;Ob.toArray(a,i*16),s.needsUpdate=!0;const c=this._colorsTexture;return c&&(Bb.toArray(c.image.data,i*4),c.needsUpdate=!0),i}addGeometry(e,t=-1,n=-1){if(this._initializeGeometry(e),this._validateGeometry(e),this._drawInfo.length>=this._maxInstanceCount)throw new Error("BatchedMesh: Maximum item count reached.");const i={vertexStart:-1,vertexCount:-1,indexStart:-1,indexCount:-1};let s=null;const a=this._reservedRanges,c=this._drawRanges,u=this._bounds;this._geometryCount!==0&&(s=a[a.length-1]),t===-1?i.vertexCount=e.getAttribute("position").count:i.vertexCount=t,s===null?i.vertexStart=0:i.vertexStart=s.vertexStart+s.vertexCount;const h=e.getIndex(),f=h!==null;if(f&&(n===-1?i.indexCount=h.count:i.indexCount=n,s===null?i.indexStart=0:i.indexStart=s.indexStart+s.indexCount),i.indexStart!==-1&&i.indexStart+i.indexCount>this._maxIndexCount||i.vertexStart+i.vertexCount>this._maxVertexCount)throw new Error("BatchedMesh: Reserved space request exceeds the maximum buffer size.");const p=this._geometryCount;return this._geometryCount++,a.push(i),c.push({start:f?i.indexStart:i.vertexStart,count:-1}),u.push({boxInitialized:!1,box:new gn,sphereInitialized:!1,sphere:new vn}),this.setGeometryAt(p,e),p}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);const n=this.geometry,i=n.getIndex()!==null,s=n.getIndex(),a=t.getIndex(),c=this._reservedRanges[e];if(i&&a.count>c.indexCount||t.attributes.position.count>c.vertexCount)throw new Error("BatchedMesh: Reserved space not large enough for provided geometry.");const u=c.vertexStart,h=c.vertexCount;for(const v in n.attributes){const x=t.getAttribute(v),M=n.getAttribute(v);kb(x,M,u);const y=x.itemSize;for(let _=x.count,E=h;_<E;_++){const w=u+_;for(let T=0;T<y;T++)M.setComponent(w,T,0)}M.needsUpdate=!0,M.addUpdateRange(u*y,h*y)}if(i){const v=c.indexStart;for(let x=0;x<a.count;x++)s.setX(v+x,u+a.getX(x));for(let x=a.count,M=c.indexCount;x<M;x++)s.setX(v+x,u);s.needsUpdate=!0,s.addUpdateRange(v,c.indexCount)}const f=this._bounds[e];t.boundingBox!==null?(f.box.copy(t.boundingBox),f.boxInitialized=!0):f.boxInitialized=!1,t.boundingSphere!==null?(f.sphere.copy(t.boundingSphere),f.sphereInitialized=!0):f.sphereInitialized=!1;const p=this._drawRanges[e],m=t.getAttribute("position");return p.count=i?a.count:m.count,this._visibilityChanged=!0,e}deleteInstance(e){const t=this._drawInfo;return e>=t.length||t[e].active===!1?this:(t[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this)}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;const n=this._bounds[e],i=n.box,s=this.geometry;if(n.boxInitialized===!1){i.makeEmpty();const a=s.index,c=s.attributes.position,u=this._drawRanges[e];for(let h=u.start,f=u.start+u.count;h<f;h++){let p=h;a&&(p=a.getX(p)),i.expandByPoint(pa.fromBufferAttribute(c,p))}n.boxInitialized=!0}return t.copy(i),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;const n=this._bounds[e],i=n.sphere,s=this.geometry;if(n.sphereInitialized===!1){i.makeEmpty(),this.getBoundingBoxAt(e,Vc),Vc.getCenter(i.center);const a=s.index,c=s.attributes.position,u=this._drawRanges[e];let h=0;for(let f=u.start,p=u.start+u.count;f<p;f++){let m=f;a&&(m=a.getX(m)),pa.fromBufferAttribute(c,m),h=Math.max(h,i.center.distanceToSquared(pa))}i.radius=Math.sqrt(h),n.sphereInitialized=!0}return t.copy(i),t}setMatrixAt(e,t){const n=this._drawInfo,i=this._matricesTexture,s=this._matricesTexture.image.data;return e>=n.length||n[e].active===!1?this:(t.toArray(s,e*16),i.needsUpdate=!0,this)}getMatrixAt(e,t){const n=this._drawInfo,i=this._matricesTexture.image.data;return e>=n.length||n[e].active===!1?null:t.fromArray(i,e*16)}setColorAt(e,t){this._colorsTexture===null&&this._initColorsTexture();const n=this._colorsTexture,i=this._colorsTexture.image.data,s=this._drawInfo;return e>=s.length||s[e].active===!1?this:(t.toArray(i,e*4),n.needsUpdate=!0,this)}getColorAt(e,t){const n=this._colorsTexture.image.data,i=this._drawInfo;return e>=i.length||i[e].active===!1?null:t.fromArray(n,e*4)}setVisibleAt(e,t){const n=this._drawInfo;return e>=n.length||n[e].active===!1||n[e].visible===t?this:(n[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){const t=this._drawInfo;return e>=t.length||t[e].active===!1?!1:t[e].visible}setGeometryIdAt(e,t){const n=this._drawInfo;return e>=n.length||n[e].active===!1||t<0||t>=this._geometryCount?null:(n[e].geometryIndex=t,this)}getGeometryIdAt(e){const t=this._drawInfo;return e>=t.length||t[e].active===!1?-1:t[e].geometryIndex}getGeometryRangeAt(e,t={}){if(e<0||e>=this._geometryCount)return null;const n=this._drawRanges[e];return t.start=n.start,t.count=n.count,t}raycast(e,t){const n=this._drawInfo,i=this._drawRanges,s=this.matrixWorld,a=this.geometry;In.material=this.material,In.geometry.index=a.index,In.geometry.attributes=a.attributes,In.geometry.boundingBox===null&&(In.geometry.boundingBox=new gn),In.geometry.boundingSphere===null&&(In.geometry.boundingSphere=new vn);for(let c=0,u=n.length;c<u;c++){if(!n[c].visible||!n[c].active)continue;const h=n[c].geometryIndex,f=i[h];In.geometry.setDrawRange(f.start,f.count),this.getMatrixAt(c,In.matrixWorld).premultiply(s),this.getBoundingBoxAt(h,In.geometry.boundingBox),this.getBoundingSphereAt(h,In.geometry.boundingSphere),In.raycast(e,Gc);for(let p=0,m=Gc.length;p<m;p++){const v=Gc[p];v.object=this,v.batchId=c,t.push(v)}Gc.length=0}In.material=null,In.geometry.index=null,In.geometry.attributes={},In.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._drawRanges=e._drawRanges.map(t=>({...t})),this._reservedRanges=e._reservedRanges.map(t=>({...t})),this._drawInfo=e._drawInfo.map(t=>({...t})),this._bounds=e._bounds.map(t=>({boxInitialized:t.boxInitialized,box:t.box.clone(),sphereInitialized:t.sphereInitialized,sphere:t.sphere.clone()})),this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._geometryCount=e._geometryCount,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){return this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null),this}onBeforeRender(e,t,n,i,s){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;const a=i.getIndex(),c=a===null?1:a.array.BYTES_PER_ELEMENT,u=this._drawInfo,h=this._multiDrawStarts,f=this._multiDrawCounts,p=this._drawRanges,m=this.perObjectFrustumCulled,v=this._indirectTexture,x=v.image.data;m&&(V0.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),Ad.setFromProjectionMatrix(V0,e.coordinateSystem));let M=0;if(this.sortObjects){Ed.copy(this.matrixWorld).invert(),pa.setFromMatrixPosition(n.matrixWorld).applyMatrix4(Ed),G0.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(Ed);for(let E=0,w=u.length;E<w;E++)if(u[E].visible&&u[E].active){const T=u[E].geometryIndex;this.getMatrixAt(E,Fr),this.getBoundingSphereAt(T,os).applyMatrix4(Fr);let U=!1;if(m&&(U=!Ad.intersectsSphere(os)),!U){const P=zb.subVectors(os.center,pa).dot(G0);bd.push(p[T],P,E)}}const y=bd.list,_=this.customSort;_===null?y.sort(s.transparent?Nb:Ub):_.call(this,y,n);for(let E=0,w=y.length;E<w;E++){const T=y[E];h[M]=T.start*c,f[M]=T.count,x[M]=T.index,M++}bd.reset()}else for(let y=0,_=u.length;y<_;y++)if(u[y].visible&&u[y].active){const E=u[y].geometryIndex;let w=!1;if(m&&(this.getMatrixAt(y,Fr),this.getBoundingSphereAt(E,os).applyMatrix4(Fr),w=!Ad.intersectsSphere(os)),!w){const T=p[E];h[M]=T.start*c,f[M]=T.count,x[M]=y,M++}}v.needsUpdate=!0,this._multiDrawCount=M,this._visibilityChanged=!1}onBeforeShadow(e,t,n,i,s,a){this.onBeforeRender(e,null,i,s,a)}}class Vn extends wn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ue(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const eh=new D,th=new D,W0=new rt,ma=new Uo,Wc=new vn,Td=new D,X0=new D;let Hr=class extends Tt{constructor(e=new gt,t=new Vn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)eh.fromBufferAttribute(t,i-1),th.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=eh.distanceTo(th);e.setAttribute("lineDistance",new je(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Wc.copy(n.boundingSphere),Wc.applyMatrix4(i),Wc.radius+=s,e.ray.intersectsSphere(Wc)===!1)return;W0.copy(i).invert(),ma.copy(e.ray).applyMatrix4(W0);const c=s/((this.scale.x+this.scale.y+this.scale.z)/3),u=c*c,h=this.isLineSegments?2:1,f=n.index,m=n.attributes.position;if(f!==null){const v=Math.max(0,a.start),x=Math.min(f.count,a.start+a.count);for(let M=v,y=x-1;M<y;M+=h){const _=f.getX(M),E=f.getX(M+1),w=Xc(this,e,ma,u,_,E);w&&t.push(w)}if(this.isLineLoop){const M=f.getX(x-1),y=f.getX(v),_=Xc(this,e,ma,u,M,y);_&&t.push(_)}}else{const v=Math.max(0,a.start),x=Math.min(m.count,a.start+a.count);for(let M=v,y=x-1;M<y;M+=h){const _=Xc(this,e,ma,u,M,M+1);_&&t.push(_)}if(this.isLineLoop){const M=Xc(this,e,ma,u,x-1,v);M&&t.push(M)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const c=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}};function Xc(r,e,t,n,i,s){const a=r.geometry.attributes.position;if(eh.fromBufferAttribute(a,i),th.fromBufferAttribute(a,s),t.distanceSqToSegment(eh,th,Td,X0)>n)return;Td.applyMatrix4(r.matrixWorld);const u=e.ray.origin.distanceTo(Td);if(!(u<e.near||u>e.far))return{distance:u,point:X0.clone().applyMatrix4(r.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:r}}const q0=new D,Y0=new D;class Ji extends Hr{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)q0.fromBufferAttribute(t,i),Y0.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+q0.distanceTo(Y0);e.setAttribute("lineDistance",new je(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class ax extends Hr{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Vp extends wn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ue(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const j0=new rt,ap=new Uo,qc=new vn,Yc=new D;class lx extends Tt{constructor(e=new gt,t=new Vp){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),qc.copy(n.boundingSphere),qc.applyMatrix4(i),qc.radius+=s,e.ray.intersectsSphere(qc)===!1)return;j0.copy(i).invert(),ap.copy(e.ray).applyMatrix4(j0);const c=s/((this.scale.x+this.scale.y+this.scale.z)/3),u=c*c,h=n.index,p=n.attributes.position;if(h!==null){const m=Math.max(0,a.start),v=Math.min(h.count,a.start+a.count);for(let x=m,M=v;x<M;x++){const y=h.getX(x);Yc.fromBufferAttribute(p,y),Z0(Yc,y,u,i,e,t,this)}}else{const m=Math.max(0,a.start),v=Math.min(p.count,a.start+a.count);for(let x=m,M=v;x<M;x++)Yc.fromBufferAttribute(p,x),Z0(Yc,x,u,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const c=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}}function Z0(r,e,t,n,i,s,a){const c=ap.distanceSqToPoint(r);if(c<t){const u=new D;ap.closestPointToPoint(r,u),u.applyMatrix4(n);const h=i.ray.origin.distanceTo(u);if(h<i.near||h>i.far)return;s.push({distance:h,distanceToRay:Math.sqrt(c),point:u,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Hb extends Yt{constructor(e,t,n,i,s,a,c,u,h){super(e,t,n,i,s,a,c,u,h),this.isVideoTexture=!0,this.minFilter=a!==void 0?a:on,this.magFilter=s!==void 0?s:on,this.generateMipmaps=!1;const f=this;function p(){f.needsUpdate=!0,e.requestVideoFrameCallback(p)}"requestVideoFrameCallback"in e&&e.requestVideoFrameCallback(p)}clone(){return new this.constructor(this.image).copy(this)}update(){const e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}}class Vb extends Yt{constructor(e,t){super({width:e,height:t}),this.isFramebufferTexture=!0,this.magFilter=mn,this.minFilter=mn,this.generateMipmaps=!1,this.needsUpdate=!0}}class Sh extends Yt{constructor(e,t,n,i,s,a,c,u,h,f,p,m){super(null,a,c,u,h,f,i,s,p,m),this.isCompressedTexture=!0,this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}}class Gb extends Sh{constructor(e,t,n,i,s,a){super(e,t,n,s,a),this.isCompressedArrayTexture=!0,this.image.depth=i,this.wrapR=xi,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Wb extends Sh{constructor(e,t,n){super(void 0,e[0].width,e[0].height,t,n,mr),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=e}}class Xb extends Yt{constructor(e,t,n,i,s,a,c,u,h){super(e,t,n,i,s,a,c,u,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ii{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let i=0;const s=n.length;let a;t?a=t:a=e*n[s-1];let c=0,u=s-1,h;for(;c<=u;)if(i=Math.floor(c+(u-c)/2),h=n[i]-a,h<0)c=i+1;else if(h>0)u=i-1;else{u=i;break}if(i=u,n[i]===a)return i/(s-1);const f=n[i],m=n[i+1]-f,v=(a-f)/m;return(i+v)/(s-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);const a=this.getPoint(i),c=this.getPoint(s),u=t||(a.isVector2?new ge:new D);return u.copy(c).sub(a).normalize(),u}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new D,i=[],s=[],a=[],c=new D,u=new rt;for(let v=0;v<=e;v++){const x=v/e;i[v]=this.getTangentAt(x,new D)}s[0]=new D,a[0]=new D;let h=Number.MAX_VALUE;const f=Math.abs(i[0].x),p=Math.abs(i[0].y),m=Math.abs(i[0].z);f<=h&&(h=f,n.set(1,0,0)),p<=h&&(h=p,n.set(0,1,0)),m<=h&&n.set(0,0,1),c.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],c),a[0].crossVectors(i[0],s[0]);for(let v=1;v<=e;v++){if(s[v]=s[v-1].clone(),a[v]=a[v-1].clone(),c.crossVectors(i[v-1],i[v]),c.length()>Number.EPSILON){c.normalize();const x=Math.acos(Jt(i[v-1].dot(i[v]),-1,1));s[v].applyMatrix4(u.makeRotationAxis(c,x))}a[v].crossVectors(i[v],s[v])}if(t===!0){let v=Math.acos(Jt(s[0].dot(s[e]),-1,1));v/=e,i[0].dot(c.crossVectors(s[0],s[e]))>0&&(v=-v);for(let x=1;x<=e;x++)s[x].applyMatrix4(u.makeRotationAxis(i[x],v*x)),a[x].crossVectors(i[x],s[x])}return{tangents:i,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Mh extends Ii{constructor(e=0,t=0,n=1,i=1,s=0,a=Math.PI*2,c=!1,u=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=c,this.aRotation=u}getPoint(e,t=new ge){const n=t,i=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(a?s=0:s=i),this.aClockwise===!0&&!a&&(s===i?s=-i:s=s-i);const c=this.aStartAngle+e*s;let u=this.aX+this.xRadius*Math.cos(c),h=this.aY+this.yRadius*Math.sin(c);if(this.aRotation!==0){const f=Math.cos(this.aRotation),p=Math.sin(this.aRotation),m=u-this.aX,v=h-this.aY;u=m*f-v*p+this.aX,h=m*p+v*f+this.aY}return n.set(u,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class cx extends Mh{constructor(e,t,n,i,s,a){super(e,t,n,n,i,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Gp(){let r=0,e=0,t=0,n=0;function i(s,a,c,u){r=s,e=c,t=-3*s+3*a-2*c-u,n=2*s-2*a+c+u}return{initCatmullRom:function(s,a,c,u,h){i(a,c,h*(c-s),h*(u-a))},initNonuniformCatmullRom:function(s,a,c,u,h,f,p){let m=(a-s)/h-(c-s)/(h+f)+(c-a)/f,v=(c-a)/f-(u-a)/(f+p)+(u-c)/p;m*=f,v*=f,i(a,c,m,v)},calc:function(s){const a=s*s,c=a*s;return r+e*s+t*a+n*c}}}const jc=new D,Cd=new Gp,Rd=new Gp,Pd=new Gp;class wh extends Ii{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new D){const n=t,i=this.points,s=i.length,a=(s-(this.closed?0:1))*e;let c=Math.floor(a),u=a-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:u===0&&c===s-1&&(c=s-2,u=1);let h,f;this.closed||c>0?h=i[(c-1)%s]:(jc.subVectors(i[0],i[1]).add(i[0]),h=jc);const p=i[c%s],m=i[(c+1)%s];if(this.closed||c+2<s?f=i[(c+2)%s]:(jc.subVectors(i[s-1],i[s-2]).add(i[s-1]),f=jc),this.curveType==="centripetal"||this.curveType==="chordal"){const v=this.curveType==="chordal"?.5:.25;let x=Math.pow(h.distanceToSquared(p),v),M=Math.pow(p.distanceToSquared(m),v),y=Math.pow(m.distanceToSquared(f),v);M<1e-4&&(M=1),x<1e-4&&(x=M),y<1e-4&&(y=M),Cd.initNonuniformCatmullRom(h.x,p.x,m.x,f.x,x,M,y),Rd.initNonuniformCatmullRom(h.y,p.y,m.y,f.y,x,M,y),Pd.initNonuniformCatmullRom(h.z,p.z,m.z,f.z,x,M,y)}else this.curveType==="catmullrom"&&(Cd.initCatmullRom(h.x,p.x,m.x,f.x,this.tension),Rd.initCatmullRom(h.y,p.y,m.y,f.y,this.tension),Pd.initCatmullRom(h.z,p.z,m.z,f.z,this.tension));return n.set(Cd.calc(u),Rd.calc(u),Pd.calc(u)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new D().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function J0(r,e,t,n,i){const s=(n-e)*.5,a=(i-t)*.5,c=r*r,u=r*c;return(2*t-2*n+s+a)*u+(-3*t+3*n-2*s-a)*c+s*r+t}function qb(r,e){const t=1-r;return t*t*e}function Yb(r,e){return 2*(1-r)*r*e}function jb(r,e){return r*r*e}function Da(r,e,t,n){return qb(r,e)+Yb(r,t)+jb(r,n)}function Zb(r,e){const t=1-r;return t*t*t*e}function Jb(r,e){const t=1-r;return 3*t*t*r*e}function Kb(r,e){return 3*(1-r)*r*r*e}function Qb(r,e){return r*r*r*e}function Ua(r,e,t,n,i){return Zb(r,e)+Jb(r,t)+Kb(r,n)+Qb(r,i)}class Wp extends Ii{constructor(e=new ge,t=new ge,n=new ge,i=new ge){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new ge){const n=t,i=this.v0,s=this.v1,a=this.v2,c=this.v3;return n.set(Ua(e,i.x,s.x,a.x,c.x),Ua(e,i.y,s.y,a.y,c.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class ux extends Ii{constructor(e=new D,t=new D,n=new D,i=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new D){const n=t,i=this.v0,s=this.v1,a=this.v2,c=this.v3;return n.set(Ua(e,i.x,s.x,a.x,c.x),Ua(e,i.y,s.y,a.y,c.y),Ua(e,i.z,s.z,a.z,c.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Xp extends Ii{constructor(e=new ge,t=new ge){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ge){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ge){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class hx extends Ii{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class qp extends Ii{constructor(e=new ge,t=new ge,n=new ge){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ge){const n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Da(e,i.x,s.x,a.x),Da(e,i.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Yp extends Ii{constructor(e=new D,t=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new D){const n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Da(e,i.x,s.x,a.x),Da(e,i.y,s.y,a.y),Da(e,i.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class jp extends Ii{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ge){const n=t,i=this.points,s=(i.length-1)*e,a=Math.floor(s),c=s-a,u=i[a===0?a:a-1],h=i[a],f=i[a>i.length-2?i.length-1:a+1],p=i[a>i.length-3?i.length-1:a+2];return n.set(J0(c,u.x,h.x,f.x,p.x),J0(c,u.y,h.y,f.y,p.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new ge().fromArray(i))}return this}}var nh=Object.freeze({__proto__:null,ArcCurve:cx,CatmullRomCurve3:wh,CubicBezierCurve:Wp,CubicBezierCurve3:ux,EllipseCurve:Mh,LineCurve:Xp,LineCurve3:hx,QuadraticBezierCurve:qp,QuadraticBezierCurve3:Yp,SplineCurve:jp});class fx extends Ii{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new nh[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let s=0;for(;s<i.length;){if(i[s]>=n){const a=i[s]-n,c=this.curves[s],u=c.getLength(),h=u===0?0:1-a/u;return c.getPointAt(h,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,s=this.curves;i<s.length;i++){const a=s[i],c=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,u=a.getPoints(c);for(let h=0;h<u.length;h++){const f=u[h];n&&n.equals(f)||(t.push(f),n=f)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new nh[i.type]().fromJSON(i))}return this}}class ja extends fx{constructor(e){super(),this.type="Path",this.currentPoint=new ge,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Xp(this.currentPoint.clone(),new ge(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const s=new qp(this.currentPoint.clone(),new ge(e,t),new ge(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,s,a){const c=new Wp(this.currentPoint.clone(),new ge(e,t),new ge(n,i),new ge(s,a));return this.curves.push(c),this.currentPoint.set(s,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new jp(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,s,a){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absarc(e+c,t+u,n,i,s,a),this}absarc(e,t,n,i,s,a){return this.absellipse(e,t,n,n,i,s,a),this}ellipse(e,t,n,i,s,a,c,u){const h=this.currentPoint.x,f=this.currentPoint.y;return this.absellipse(e+h,t+f,n,i,s,a,c,u),this}absellipse(e,t,n,i,s,a,c,u){const h=new Mh(e,t,n,i,s,a,c,u);if(this.curves.length>0){const p=h.getPoint(0);p.equals(this.currentPoint)||this.lineTo(p.x,p.y)}this.curves.push(h);const f=h.getPoint(1);return this.currentPoint.copy(f),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class cl extends gt{constructor(e=[new ge(0,-.5),new ge(.5,0),new ge(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=Jt(i,0,Math.PI*2);const s=[],a=[],c=[],u=[],h=[],f=1/t,p=new D,m=new ge,v=new D,x=new D,M=new D;let y=0,_=0;for(let E=0;E<=e.length-1;E++)switch(E){case 0:y=e[E+1].x-e[E].x,_=e[E+1].y-e[E].y,v.x=_*1,v.y=-y,v.z=_*0,M.copy(v),v.normalize(),u.push(v.x,v.y,v.z);break;case e.length-1:u.push(M.x,M.y,M.z);break;default:y=e[E+1].x-e[E].x,_=e[E+1].y-e[E].y,v.x=_*1,v.y=-y,v.z=_*0,x.copy(v),v.x+=M.x,v.y+=M.y,v.z+=M.z,v.normalize(),u.push(v.x,v.y,v.z),M.copy(x)}for(let E=0;E<=t;E++){const w=n+E*f*i,T=Math.sin(w),U=Math.cos(w);for(let P=0;P<=e.length-1;P++){p.x=e[P].x*T,p.y=e[P].y,p.z=e[P].x*U,a.push(p.x,p.y,p.z),m.x=E/t,m.y=P/(e.length-1),c.push(m.x,m.y);const I=u[3*P+0]*T,B=u[3*P+1],k=u[3*P+0]*U;h.push(I,B,k)}}for(let E=0;E<t;E++)for(let w=0;w<e.length-1;w++){const T=w+E*e.length,U=T,P=T+e.length,I=T+e.length+1,B=T+1;s.push(U,P,B),s.push(I,B,P)}this.setIndex(s),this.setAttribute("position",new je(a,3)),this.setAttribute("uv",new je(c,2)),this.setAttribute("normal",new je(h,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cl(e.points,e.segments,e.phiStart,e.phiLength)}}class Eh extends cl{constructor(e=1,t=1,n=4,i=8){const s=new ja;s.absarc(0,-t/2,e,Math.PI*1.5,0),s.absarc(0,t/2,e,0,Math.PI*.5),super(s.getPoints(n),i),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:i}}static fromJSON(e){return new Eh(e.radius,e.length,e.capSegments,e.radialSegments)}}class Ah extends gt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const s=[],a=[],c=[],u=[],h=new D,f=new ge;a.push(0,0,0),c.push(0,0,1),u.push(.5,.5);for(let p=0,m=3;p<=t;p++,m+=3){const v=n+p/t*i;h.x=e*Math.cos(v),h.y=e*Math.sin(v),a.push(h.x,h.y,h.z),c.push(0,0,1),f.x=(a[m]/e+1)/2,f.y=(a[m+1]/e+1)/2,u.push(f.x,f.y)}for(let p=1;p<=t;p++)s.push(p,p+1,0);this.setIndex(s),this.setAttribute("position",new je(a,3)),this.setAttribute("normal",new je(c,3)),this.setAttribute("uv",new je(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ah(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Oo extends gt{constructor(e=1,t=1,n=1,i=32,s=1,a=!1,c=0,u=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:c,thetaLength:u};const h=this;i=Math.floor(i),s=Math.floor(s);const f=[],p=[],m=[],v=[];let x=0;const M=[],y=n/2;let _=0;E(),a===!1&&(e>0&&w(!0),t>0&&w(!1)),this.setIndex(f),this.setAttribute("position",new je(p,3)),this.setAttribute("normal",new je(m,3)),this.setAttribute("uv",new je(v,2));function E(){const T=new D,U=new D;let P=0;const I=(t-e)/n;for(let B=0;B<=s;B++){const k=[],b=B/s,C=b*(t-e)+e;for(let G=0;G<=i;G++){const Z=G/i,$=Z*u+c,oe=Math.sin($),K=Math.cos($);U.x=C*oe,U.y=-b*n+y,U.z=C*K,p.push(U.x,U.y,U.z),T.set(oe,I,K).normalize(),m.push(T.x,T.y,T.z),v.push(Z,1-b),k.push(x++)}M.push(k)}for(let B=0;B<i;B++)for(let k=0;k<s;k++){const b=M[k][B],C=M[k+1][B],G=M[k+1][B+1],Z=M[k][B+1];e>0&&(f.push(b,C,Z),P+=3),t>0&&(f.push(C,G,Z),P+=3)}h.addGroup(_,P,0),_+=P}function w(T){const U=x,P=new ge,I=new D;let B=0;const k=T===!0?e:t,b=T===!0?1:-1;for(let G=1;G<=i;G++)p.push(0,y*b,0),m.push(0,b,0),v.push(.5,.5),x++;const C=x;for(let G=0;G<=i;G++){const $=G/i*u+c,oe=Math.cos($),K=Math.sin($);I.x=k*K,I.y=y*b,I.z=k*oe,p.push(I.x,I.y,I.z),m.push(0,b,0),P.x=oe*.5+.5,P.y=K*.5*b+.5,v.push(P.x,P.y),x++}for(let G=0;G<i;G++){const Z=U+G,$=C+G;T===!0?f.push($,$+1,Z):f.push($+1,$,Z),B+=3}h.addGroup(_,B,T===!0?1:2),_+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Oo(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class bh extends Oo{constructor(e=1,t=1,n=32,i=1,s=!1,a=0,c=Math.PI*2){super(0,e,t,n,i,s,a,c),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:a,thetaLength:c}}static fromJSON(e){return new bh(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Gr extends gt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const s=[],a=[];c(i),h(n),f(),this.setAttribute("position",new je(s,3)),this.setAttribute("normal",new je(s.slice(),3)),this.setAttribute("uv",new je(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function c(E){const w=new D,T=new D,U=new D;for(let P=0;P<t.length;P+=3)v(t[P+0],w),v(t[P+1],T),v(t[P+2],U),u(w,T,U,E)}function u(E,w,T,U){const P=U+1,I=[];for(let B=0;B<=P;B++){I[B]=[];const k=E.clone().lerp(T,B/P),b=w.clone().lerp(T,B/P),C=P-B;for(let G=0;G<=C;G++)G===0&&B===P?I[B][G]=k:I[B][G]=k.clone().lerp(b,G/C)}for(let B=0;B<P;B++)for(let k=0;k<2*(P-B)-1;k++){const b=Math.floor(k/2);k%2===0?(m(I[B][b+1]),m(I[B+1][b]),m(I[B][b])):(m(I[B][b+1]),m(I[B+1][b+1]),m(I[B+1][b]))}}function h(E){const w=new D;for(let T=0;T<s.length;T+=3)w.x=s[T+0],w.y=s[T+1],w.z=s[T+2],w.normalize().multiplyScalar(E),s[T+0]=w.x,s[T+1]=w.y,s[T+2]=w.z}function f(){const E=new D;for(let w=0;w<s.length;w+=3){E.x=s[w+0],E.y=s[w+1],E.z=s[w+2];const T=y(E)/2/Math.PI+.5,U=_(E)/Math.PI+.5;a.push(T,1-U)}x(),p()}function p(){for(let E=0;E<a.length;E+=6){const w=a[E+0],T=a[E+2],U=a[E+4],P=Math.max(w,T,U),I=Math.min(w,T,U);P>.9&&I<.1&&(w<.2&&(a[E+0]+=1),T<.2&&(a[E+2]+=1),U<.2&&(a[E+4]+=1))}}function m(E){s.push(E.x,E.y,E.z)}function v(E,w){const T=E*3;w.x=e[T+0],w.y=e[T+1],w.z=e[T+2]}function x(){const E=new D,w=new D,T=new D,U=new D,P=new ge,I=new ge,B=new ge;for(let k=0,b=0;k<s.length;k+=9,b+=6){E.set(s[k+0],s[k+1],s[k+2]),w.set(s[k+3],s[k+4],s[k+5]),T.set(s[k+6],s[k+7],s[k+8]),P.set(a[b+0],a[b+1]),I.set(a[b+2],a[b+3]),B.set(a[b+4],a[b+5]),U.copy(E).add(w).add(T).divideScalar(3);const C=y(U);M(P,b+0,E,C),M(I,b+2,w,C),M(B,b+4,T,C)}}function M(E,w,T,U){U<0&&E.x===1&&(a[w]=E.x-1),T.x===0&&T.z===0&&(a[w]=U/2/Math.PI+.5)}function y(E){return Math.atan2(E.z,-E.x)}function _(E){return Math.atan2(-E.y,Math.sqrt(E.x*E.x+E.z*E.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gr(e.vertices,e.indices,e.radius,e.details)}}class Th extends Gr{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Th(e.radius,e.detail)}}const Zc=new D,Jc=new D,Id=new D,Kc=new Yn;class dx extends gt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const i=Math.pow(10,4),s=Math.cos(Ss*t),a=e.getIndex(),c=e.getAttribute("position"),u=a?a.count:c.count,h=[0,0,0],f=["a","b","c"],p=new Array(3),m={},v=[];for(let x=0;x<u;x+=3){a?(h[0]=a.getX(x),h[1]=a.getX(x+1),h[2]=a.getX(x+2)):(h[0]=x,h[1]=x+1,h[2]=x+2);const{a:M,b:y,c:_}=Kc;if(M.fromBufferAttribute(c,h[0]),y.fromBufferAttribute(c,h[1]),_.fromBufferAttribute(c,h[2]),Kc.getNormal(Id),p[0]=`${Math.round(M.x*i)},${Math.round(M.y*i)},${Math.round(M.z*i)}`,p[1]=`${Math.round(y.x*i)},${Math.round(y.y*i)},${Math.round(y.z*i)}`,p[2]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,!(p[0]===p[1]||p[1]===p[2]||p[2]===p[0]))for(let E=0;E<3;E++){const w=(E+1)%3,T=p[E],U=p[w],P=Kc[f[E]],I=Kc[f[w]],B=`${T}_${U}`,k=`${U}_${T}`;k in m&&m[k]?(Id.dot(m[k].normal)<=s&&(v.push(P.x,P.y,P.z),v.push(I.x,I.y,I.z)),m[k]=null):B in m||(m[B]={index0:h[E],index1:h[w],normal:Id.clone()})}}for(const x in m)if(m[x]){const{index0:M,index1:y}=m[x];Zc.fromBufferAttribute(c,M),Jc.fromBufferAttribute(c,y),v.push(Zc.x,Zc.y,Zc.z),v.push(Jc.x,Jc.y,Jc.z)}this.setAttribute("position",new je(v,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class ws extends ja{constructor(e){super(e),this.uuid=si(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new ja().fromJSON(i))}return this}}const $b={triangulate:function(r,e,t=2){const n=e&&e.length,i=n?e[0]*t:r.length;let s=px(r,0,i,t,!0);const a=[];if(!s||s.next===s.prev)return a;let c,u,h,f,p,m,v;if(n&&(s=rT(r,e,s,t)),r.length>80*t){c=h=r[0],u=f=r[1];for(let x=t;x<i;x+=t)p=r[x],m=r[x+1],p<c&&(c=p),m<u&&(u=m),p>h&&(h=p),m>f&&(f=m);v=Math.max(h-c,f-u),v=v!==0?32767/v:0}return Za(s,a,t,c,u,v,0),a}};function px(r,e,t,n,i){let s,a;if(i===mT(r,e,t,n)>0)for(s=e;s<t;s+=n)a=K0(s,r[s],r[s+1],a);else for(s=t-n;s>=e;s-=n)a=K0(s,r[s],r[s+1],a);return a&&Ch(a,a.next)&&(Ka(a),a=a.next),a}function Cs(r,e){if(!r)return r;e||(e=r);let t=r,n;do if(n=!1,!t.steiner&&(Ch(t,t.next)||qt(t.prev,t,t.next)===0)){if(Ka(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Za(r,e,t,n,i,s,a){if(!r)return;!a&&s&&cT(r,n,i,s);let c=r,u,h;for(;r.prev!==r.next;){if(u=r.prev,h=r.next,s?tT(r,n,i,s):eT(r)){e.push(u.i/t|0),e.push(r.i/t|0),e.push(h.i/t|0),Ka(r),r=h.next,c=h.next;continue}if(r=h,r===c){a?a===1?(r=nT(Cs(r),e,t),Za(r,e,t,n,i,s,2)):a===2&&iT(r,e,t,n,i,s):Za(Cs(r),e,t,n,i,s,1);break}}}function eT(r){const e=r.prev,t=r,n=r.next;if(qt(e,t,n)>=0)return!1;const i=e.x,s=t.x,a=n.x,c=e.y,u=t.y,h=n.y,f=i<s?i<a?i:a:s<a?s:a,p=c<u?c<h?c:h:u<h?u:h,m=i>s?i>a?i:a:s>a?s:a,v=c>u?c>h?c:h:u>h?u:h;let x=n.next;for(;x!==e;){if(x.x>=f&&x.x<=m&&x.y>=p&&x.y<=v&&Mo(i,c,s,u,a,h,x.x,x.y)&&qt(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function tT(r,e,t,n){const i=r.prev,s=r,a=r.next;if(qt(i,s,a)>=0)return!1;const c=i.x,u=s.x,h=a.x,f=i.y,p=s.y,m=a.y,v=c<u?c<h?c:h:u<h?u:h,x=f<p?f<m?f:m:p<m?p:m,M=c>u?c>h?c:h:u>h?u:h,y=f>p?f>m?f:m:p>m?p:m,_=lp(v,x,e,t,n),E=lp(M,y,e,t,n);let w=r.prevZ,T=r.nextZ;for(;w&&w.z>=_&&T&&T.z<=E;){if(w.x>=v&&w.x<=M&&w.y>=x&&w.y<=y&&w!==i&&w!==a&&Mo(c,f,u,p,h,m,w.x,w.y)&&qt(w.prev,w,w.next)>=0||(w=w.prevZ,T.x>=v&&T.x<=M&&T.y>=x&&T.y<=y&&T!==i&&T!==a&&Mo(c,f,u,p,h,m,T.x,T.y)&&qt(T.prev,T,T.next)>=0))return!1;T=T.nextZ}for(;w&&w.z>=_;){if(w.x>=v&&w.x<=M&&w.y>=x&&w.y<=y&&w!==i&&w!==a&&Mo(c,f,u,p,h,m,w.x,w.y)&&qt(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;T&&T.z<=E;){if(T.x>=v&&T.x<=M&&T.y>=x&&T.y<=y&&T!==i&&T!==a&&Mo(c,f,u,p,h,m,T.x,T.y)&&qt(T.prev,T,T.next)>=0)return!1;T=T.nextZ}return!0}function nT(r,e,t){let n=r;do{const i=n.prev,s=n.next.next;!Ch(i,s)&&mx(i,n,n.next,s)&&Ja(i,s)&&Ja(s,i)&&(e.push(i.i/t|0),e.push(n.i/t|0),e.push(s.i/t|0),Ka(n),Ka(n.next),n=r=s),n=n.next}while(n!==r);return Cs(n)}function iT(r,e,t,n,i,s){let a=r;do{let c=a.next.next;for(;c!==a.prev;){if(a.i!==c.i&&fT(a,c)){let u=gx(a,c);a=Cs(a,a.next),u=Cs(u,u.next),Za(a,e,t,n,i,s,0),Za(u,e,t,n,i,s,0);return}c=c.next}a=a.next}while(a!==r)}function rT(r,e,t,n){const i=[];let s,a,c,u,h;for(s=0,a=e.length;s<a;s++)c=e[s]*n,u=s<a-1?e[s+1]*n:r.length,h=px(r,c,u,n,!1),h===h.next&&(h.steiner=!0),i.push(hT(h));for(i.sort(sT),s=0;s<i.length;s++)t=oT(i[s],t);return t}function sT(r,e){return r.x-e.x}function oT(r,e){const t=aT(r,e);if(!t)return e;const n=gx(t,r);return Cs(n,n.next),Cs(t,t.next)}function aT(r,e){let t=e,n=-1/0,i;const s=r.x,a=r.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){const m=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(m<=s&&m>n&&(n=m,i=t.x<t.next.x?t:t.next,m===s))return i}t=t.next}while(t!==e);if(!i)return null;const c=i,u=i.x,h=i.y;let f=1/0,p;t=i;do s>=t.x&&t.x>=u&&s!==t.x&&Mo(a<h?s:n,a,u,h,a<h?n:s,a,t.x,t.y)&&(p=Math.abs(a-t.y)/(s-t.x),Ja(t,r)&&(p<f||p===f&&(t.x>i.x||t.x===i.x&&lT(i,t)))&&(i=t,f=p)),t=t.next;while(t!==c);return i}function lT(r,e){return qt(r.prev,r,e.prev)<0&&qt(e.next,r,r.next)<0}function cT(r,e,t,n){let i=r;do i.z===0&&(i.z=lp(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,uT(i)}function uT(r){let e,t,n,i,s,a,c,u,h=1;do{for(t=r,r=null,s=null,a=0;t;){for(a++,n=t,c=0,e=0;e<h&&(c++,n=n.nextZ,!!n);e++);for(u=h;c>0||u>0&&n;)c!==0&&(u===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,c--):(i=n,n=n.nextZ,u--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;t=n}s.nextZ=null,h*=2}while(a>1);return r}function lp(r,e,t,n,i){return r=(r-t)*i|0,e=(e-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function hT(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function Mo(r,e,t,n,i,s,a,c){return(i-a)*(e-c)>=(r-a)*(s-c)&&(r-a)*(n-c)>=(t-a)*(e-c)&&(t-a)*(s-c)>=(i-a)*(n-c)}function fT(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!dT(r,e)&&(Ja(r,e)&&Ja(e,r)&&pT(r,e)&&(qt(r.prev,r,e.prev)||qt(r,e.prev,e))||Ch(r,e)&&qt(r.prev,r,r.next)>0&&qt(e.prev,e,e.next)>0)}function qt(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function Ch(r,e){return r.x===e.x&&r.y===e.y}function mx(r,e,t,n){const i=$c(qt(r,e,t)),s=$c(qt(r,e,n)),a=$c(qt(t,n,r)),c=$c(qt(t,n,e));return!!(i!==s&&a!==c||i===0&&Qc(r,t,e)||s===0&&Qc(r,n,e)||a===0&&Qc(t,r,n)||c===0&&Qc(t,e,n))}function Qc(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function $c(r){return r>0?1:r<0?-1:0}function dT(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&mx(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function Ja(r,e){return qt(r.prev,r,r.next)<0?qt(r,e,r.next)>=0&&qt(r,r.prev,e)>=0:qt(r,e,r.prev)<0||qt(r,r.next,e)<0}function pT(r,e){let t=r,n=!1;const i=(r.x+e.x)/2,s=(r.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&i<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==r);return n}function gx(r,e){const t=new cp(r.i,r.x,r.y),n=new cp(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function K0(r,e,t,n){const i=new cp(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Ka(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function cp(r,e,t){this.i=r,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function mT(r,e,t,n){let i=0;for(let s=e,a=t-n;s<t;s+=n)i+=(r[a]-r[s])*(r[s+1]+r[a+1]),a=s;return i}class ji{static area(e){const t=e.length;let n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return n*.5}static isClockWise(e){return ji.area(e)<0}static triangulateShape(e,t){const n=[],i=[],s=[];Q0(e),$0(n,e);let a=e.length;t.forEach(Q0);for(let u=0;u<t.length;u++)i.push(a),a+=t[u].length,$0(n,t[u]);const c=$b.triangulate(n,i);for(let u=0;u<c.length;u+=3)s.push(c.slice(u,u+3));return s}}function Q0(r){const e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function $0(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}class Rh extends gt{constructor(e=new ws([new ge(.5,.5),new ge(-.5,.5),new ge(-.5,-.5),new ge(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],s=[];for(let c=0,u=e.length;c<u;c++){const h=e[c];a(h)}this.setAttribute("position",new je(i,3)),this.setAttribute("uv",new je(s,2)),this.computeVertexNormals();function a(c){const u=[],h=t.curveSegments!==void 0?t.curveSegments:12,f=t.steps!==void 0?t.steps:1,p=t.depth!==void 0?t.depth:1;let m=t.bevelEnabled!==void 0?t.bevelEnabled:!0,v=t.bevelThickness!==void 0?t.bevelThickness:.2,x=t.bevelSize!==void 0?t.bevelSize:v-.1,M=t.bevelOffset!==void 0?t.bevelOffset:0,y=t.bevelSegments!==void 0?t.bevelSegments:3;const _=t.extrudePath,E=t.UVGenerator!==void 0?t.UVGenerator:gT;let w,T=!1,U,P,I,B;_&&(w=_.getSpacedPoints(f),T=!0,m=!1,U=_.computeFrenetFrames(f,!1),P=new D,I=new D,B=new D),m||(y=0,v=0,x=0,M=0);const k=c.extractPoints(h);let b=k.shape;const C=k.holes;if(!ji.isClockWise(b)){b=b.reverse();for(let de=0,N=C.length;de<N;de++){const Te=C[de];ji.isClockWise(Te)&&(C[de]=Te.reverse())}}const Z=ji.triangulateShape(b,C),$=b;for(let de=0,N=C.length;de<N;de++){const Te=C[de];b=b.concat(Te)}function oe(de,N,Te){return N||console.error("THREE.ExtrudeGeometry: vec does not exist"),de.clone().addScaledVector(N,Te)}const K=b.length,fe=Z.length;function O(de,N,Te){let we,_e,Ee;const Je=de.x-N.x,De=de.y-N.y,F=Te.x-de.x,R=Te.y-de.y,Q=Je*Je+De*De,ue=Je*R-De*F;if(Math.abs(ue)>Number.EPSILON){const pe=Math.sqrt(Q),he=Math.sqrt(F*F+R*R),Ye=N.x-De/pe,Ce=N.y+Je/pe,ke=Te.x-R/he,Mt=Te.y+F/he,ye=((ke-Ye)*R-(Mt-Ce)*F)/(Je*R-De*F);we=Ye+Je*ye-de.x,_e=Ce+De*ye-de.y;const He=we*we+_e*_e;if(He<=2)return new ge(we,_e);Ee=Math.sqrt(He/2)}else{let pe=!1;Je>Number.EPSILON?F>Number.EPSILON&&(pe=!0):Je<-Number.EPSILON?F<-Number.EPSILON&&(pe=!0):Math.sign(De)===Math.sign(R)&&(pe=!0),pe?(we=-De,_e=Je,Ee=Math.sqrt(Q)):(we=Je,_e=De,Ee=Math.sqrt(Q/2))}return new ge(we/Ee,_e/Ee)}const J=[];for(let de=0,N=$.length,Te=N-1,we=de+1;de<N;de++,Te++,we++)Te===N&&(Te=0),we===N&&(we=0),J[de]=O($[de],$[Te],$[we]);const q=[];let re,xe=J.concat();for(let de=0,N=C.length;de<N;de++){const Te=C[de];re=[];for(let we=0,_e=Te.length,Ee=_e-1,Je=we+1;we<_e;we++,Ee++,Je++)Ee===_e&&(Ee=0),Je===_e&&(Je=0),re[we]=O(Te[we],Te[Ee],Te[Je]);q.push(re),xe=xe.concat(re)}for(let de=0;de<y;de++){const N=de/y,Te=v*Math.cos(N*Math.PI/2),we=x*Math.sin(N*Math.PI/2)+M;for(let _e=0,Ee=$.length;_e<Ee;_e++){const Je=oe($[_e],J[_e],we);Se(Je.x,Je.y,-Te)}for(let _e=0,Ee=C.length;_e<Ee;_e++){const Je=C[_e];re=q[_e];for(let De=0,F=Je.length;De<F;De++){const R=oe(Je[De],re[De],we);Se(R.x,R.y,-Te)}}}const Pe=x+M;for(let de=0;de<K;de++){const N=m?oe(b[de],xe[de],Pe):b[de];T?(I.copy(U.normals[0]).multiplyScalar(N.x),P.copy(U.binormals[0]).multiplyScalar(N.y),B.copy(w[0]).add(I).add(P),Se(B.x,B.y,B.z)):Se(N.x,N.y,0)}for(let de=1;de<=f;de++)for(let N=0;N<K;N++){const Te=m?oe(b[N],xe[N],Pe):b[N];T?(I.copy(U.normals[de]).multiplyScalar(Te.x),P.copy(U.binormals[de]).multiplyScalar(Te.y),B.copy(w[de]).add(I).add(P),Se(B.x,B.y,B.z)):Se(Te.x,Te.y,p/f*de)}for(let de=y-1;de>=0;de--){const N=de/y,Te=v*Math.cos(N*Math.PI/2),we=x*Math.sin(N*Math.PI/2)+M;for(let _e=0,Ee=$.length;_e<Ee;_e++){const Je=oe($[_e],J[_e],we);Se(Je.x,Je.y,p+Te)}for(let _e=0,Ee=C.length;_e<Ee;_e++){const Je=C[_e];re=q[_e];for(let De=0,F=Je.length;De<F;De++){const R=oe(Je[De],re[De],we);T?Se(R.x,R.y+w[f-1].y,w[f-1].x+Te):Se(R.x,R.y,p+Te)}}}ie(),me();function ie(){const de=i.length/3;if(m){let N=0,Te=K*N;for(let we=0;we<fe;we++){const _e=Z[we];tt(_e[2]+Te,_e[1]+Te,_e[0]+Te)}N=f+y*2,Te=K*N;for(let we=0;we<fe;we++){const _e=Z[we];tt(_e[0]+Te,_e[1]+Te,_e[2]+Te)}}else{for(let N=0;N<fe;N++){const Te=Z[N];tt(Te[2],Te[1],Te[0])}for(let N=0;N<fe;N++){const Te=Z[N];tt(Te[0]+K*f,Te[1]+K*f,Te[2]+K*f)}}n.addGroup(de,i.length/3-de,0)}function me(){const de=i.length/3;let N=0;be($,N),N+=$.length;for(let Te=0,we=C.length;Te<we;Te++){const _e=C[Te];be(_e,N),N+=_e.length}n.addGroup(de,i.length/3-de,1)}function be(de,N){let Te=de.length;for(;--Te>=0;){const we=Te;let _e=Te-1;_e<0&&(_e=de.length-1);for(let Ee=0,Je=f+y*2;Ee<Je;Ee++){const De=K*Ee,F=K*(Ee+1),R=N+we+De,Q=N+_e+De,ue=N+_e+F,pe=N+we+F;nt(R,Q,ue,pe)}}}function Se(de,N,Te){u.push(de),u.push(N),u.push(Te)}function tt(de,N,Te){Ze(de),Ze(N),Ze(Te);const we=i.length/3,_e=E.generateTopUV(n,i,we-3,we-2,we-1);Ie(_e[0]),Ie(_e[1]),Ie(_e[2])}function nt(de,N,Te,we){Ze(de),Ze(N),Ze(we),Ze(N),Ze(Te),Ze(we);const _e=i.length/3,Ee=E.generateSideWallUV(n,i,_e-6,_e-3,_e-2,_e-1);Ie(Ee[0]),Ie(Ee[1]),Ie(Ee[3]),Ie(Ee[1]),Ie(Ee[2]),Ie(Ee[3])}function Ze(de){i.push(u[de*3+0]),i.push(u[de*3+1]),i.push(u[de*3+2])}function Ie(de){s.push(de.x),s.push(de.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return vT(t,n,e)}static fromJSON(e,t){const n=[];for(let s=0,a=e.shapes.length;s<a;s++){const c=t[e.shapes[s]];n.push(c)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new nh[i.type]().fromJSON(i)),new Rh(n,e.options)}}const gT={generateTopUV:function(r,e,t,n,i){const s=e[t*3],a=e[t*3+1],c=e[n*3],u=e[n*3+1],h=e[i*3],f=e[i*3+1];return[new ge(s,a),new ge(c,u),new ge(h,f)]},generateSideWallUV:function(r,e,t,n,i,s){const a=e[t*3],c=e[t*3+1],u=e[t*3+2],h=e[n*3],f=e[n*3+1],p=e[n*3+2],m=e[i*3],v=e[i*3+1],x=e[i*3+2],M=e[s*3],y=e[s*3+1],_=e[s*3+2];return Math.abs(c-f)<Math.abs(a-h)?[new ge(a,1-u),new ge(h,1-p),new ge(m,1-x),new ge(M,1-_)]:[new ge(c,1-u),new ge(f,1-p),new ge(v,1-x),new ge(y,1-_)]}};function vT(r,e,t){if(t.shapes=[],Array.isArray(r))for(let n=0,i=r.length;n<i;n++){const s=r[n];t.shapes.push(s.uuid)}else t.shapes.push(r.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Ph extends Gr{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ph(e.radius,e.detail)}}class ul extends Gr{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ul(e.radius,e.detail)}}class Ih extends gt{constructor(e=.5,t=1,n=32,i=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const c=[],u=[],h=[],f=[];let p=e;const m=(t-e)/i,v=new D,x=new ge;for(let M=0;M<=i;M++){for(let y=0;y<=n;y++){const _=s+y/n*a;v.x=p*Math.cos(_),v.y=p*Math.sin(_),u.push(v.x,v.y,v.z),h.push(0,0,1),x.x=(v.x/t+1)/2,x.y=(v.y/t+1)/2,f.push(x.x,x.y)}p+=m}for(let M=0;M<i;M++){const y=M*(n+1);for(let _=0;_<n;_++){const E=_+y,w=E,T=E+n+1,U=E+n+2,P=E+1;c.push(w,T,P),c.push(T,U,P)}}this.setIndex(c),this.setAttribute("position",new je(u,3)),this.setAttribute("normal",new je(h,3)),this.setAttribute("uv",new je(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ih(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Lh extends gt{constructor(e=new ws([new ge(0,.5),new ge(-.5,-.5),new ge(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],s=[],a=[];let c=0,u=0;if(Array.isArray(e)===!1)h(e);else for(let f=0;f<e.length;f++)h(e[f]),this.addGroup(c,u,f),c+=u,u=0;this.setIndex(n),this.setAttribute("position",new je(i,3)),this.setAttribute("normal",new je(s,3)),this.setAttribute("uv",new je(a,2));function h(f){const p=i.length/3,m=f.extractPoints(t);let v=m.shape;const x=m.holes;ji.isClockWise(v)===!1&&(v=v.reverse());for(let y=0,_=x.length;y<_;y++){const E=x[y];ji.isClockWise(E)===!0&&(x[y]=E.reverse())}const M=ji.triangulateShape(v,x);for(let y=0,_=x.length;y<_;y++){const E=x[y];v=v.concat(E)}for(let y=0,_=v.length;y<_;y++){const E=v[y];i.push(E.x,E.y,0),s.push(0,0,1),a.push(E.x,E.y)}for(let y=0,_=M.length;y<_;y++){const E=M[y],w=E[0]+p,T=E[1]+p,U=E[2]+p;n.push(w,T,U),u+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return _T(t,e)}static fromJSON(e,t){const n=[];for(let i=0,s=e.shapes.length;i<s;i++){const a=t[e.shapes[i]];n.push(a)}return new Lh(n,e.curveSegments)}}function _T(r,e){if(e.shapes=[],Array.isArray(r))for(let t=0,n=r.length;t<n;t++){const i=r[t];e.shapes.push(i.uuid)}else e.shapes.push(r.uuid);return e}class hl extends gt{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,a=0,c=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:c},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const u=Math.min(a+c,Math.PI);let h=0;const f=[],p=new D,m=new D,v=[],x=[],M=[],y=[];for(let _=0;_<=n;_++){const E=[],w=_/n;let T=0;_===0&&a===0?T=.5/t:_===n&&u===Math.PI&&(T=-.5/t);for(let U=0;U<=t;U++){const P=U/t;p.x=-e*Math.cos(i+P*s)*Math.sin(a+w*c),p.y=e*Math.cos(a+w*c),p.z=e*Math.sin(i+P*s)*Math.sin(a+w*c),x.push(p.x,p.y,p.z),m.copy(p).normalize(),M.push(m.x,m.y,m.z),y.push(P+T,1-w),E.push(h++)}f.push(E)}for(let _=0;_<n;_++)for(let E=0;E<t;E++){const w=f[_][E+1],T=f[_][E],U=f[_+1][E],P=f[_+1][E+1];(_!==0||a>0)&&v.push(w,T,P),(_!==n-1||u<Math.PI)&&v.push(T,U,P)}this.setIndex(v),this.setAttribute("position",new je(x,3)),this.setAttribute("normal",new je(M,3)),this.setAttribute("uv",new je(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hl(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Dh extends Gr{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Dh(e.radius,e.detail)}}class Uh extends gt{constructor(e=1,t=.4,n=12,i=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s},n=Math.floor(n),i=Math.floor(i);const a=[],c=[],u=[],h=[],f=new D,p=new D,m=new D;for(let v=0;v<=n;v++)for(let x=0;x<=i;x++){const M=x/i*s,y=v/n*Math.PI*2;p.x=(e+t*Math.cos(y))*Math.cos(M),p.y=(e+t*Math.cos(y))*Math.sin(M),p.z=t*Math.sin(y),c.push(p.x,p.y,p.z),f.x=e*Math.cos(M),f.y=e*Math.sin(M),m.subVectors(p,f).normalize(),u.push(m.x,m.y,m.z),h.push(x/i),h.push(v/n)}for(let v=1;v<=n;v++)for(let x=1;x<=i;x++){const M=(i+1)*v+x-1,y=(i+1)*(v-1)+x-1,_=(i+1)*(v-1)+x,E=(i+1)*v+x;a.push(M,y,E),a.push(y,_,E)}this.setIndex(a),this.setAttribute("position",new je(c,3)),this.setAttribute("normal",new je(u,3)),this.setAttribute("uv",new je(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Uh(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Nh extends gt{constructor(e=1,t=.4,n=64,i=8,s=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:n,radialSegments:i,p:s,q:a},n=Math.floor(n),i=Math.floor(i);const c=[],u=[],h=[],f=[],p=new D,m=new D,v=new D,x=new D,M=new D,y=new D,_=new D;for(let w=0;w<=n;++w){const T=w/n*s*Math.PI*2;E(T,s,a,e,v),E(T+.01,s,a,e,x),y.subVectors(x,v),_.addVectors(x,v),M.crossVectors(y,_),_.crossVectors(M,y),M.normalize(),_.normalize();for(let U=0;U<=i;++U){const P=U/i*Math.PI*2,I=-t*Math.cos(P),B=t*Math.sin(P);p.x=v.x+(I*_.x+B*M.x),p.y=v.y+(I*_.y+B*M.y),p.z=v.z+(I*_.z+B*M.z),u.push(p.x,p.y,p.z),m.subVectors(p,v).normalize(),h.push(m.x,m.y,m.z),f.push(w/n),f.push(U/i)}}for(let w=1;w<=n;w++)for(let T=1;T<=i;T++){const U=(i+1)*(w-1)+(T-1),P=(i+1)*w+(T-1),I=(i+1)*w+T,B=(i+1)*(w-1)+T;c.push(U,P,B),c.push(P,I,B)}this.setIndex(c),this.setAttribute("position",new je(u,3)),this.setAttribute("normal",new je(h,3)),this.setAttribute("uv",new je(f,2));function E(w,T,U,P,I){const B=Math.cos(w),k=Math.sin(w),b=U/T*w,C=Math.cos(b);I.x=P*(2+C)*.5*B,I.y=P*(2+C)*k*.5,I.z=P*Math.sin(b)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nh(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}}class Fh extends gt{constructor(e=new Yp(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),t=64,n=1,i=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:s};const a=e.computeFrenetFrames(t,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const c=new D,u=new D,h=new ge;let f=new D;const p=[],m=[],v=[],x=[];M(),this.setIndex(x),this.setAttribute("position",new je(p,3)),this.setAttribute("normal",new je(m,3)),this.setAttribute("uv",new je(v,2));function M(){for(let w=0;w<t;w++)y(w);y(s===!1?t:0),E(),_()}function y(w){f=e.getPointAt(w/t,f);const T=a.normals[w],U=a.binormals[w];for(let P=0;P<=i;P++){const I=P/i*Math.PI*2,B=Math.sin(I),k=-Math.cos(I);u.x=k*T.x+B*U.x,u.y=k*T.y+B*U.y,u.z=k*T.z+B*U.z,u.normalize(),m.push(u.x,u.y,u.z),c.x=f.x+n*u.x,c.y=f.y+n*u.y,c.z=f.z+n*u.z,p.push(c.x,c.y,c.z)}}function _(){for(let w=1;w<=t;w++)for(let T=1;T<=i;T++){const U=(i+1)*(w-1)+(T-1),P=(i+1)*w+(T-1),I=(i+1)*w+T,B=(i+1)*(w-1)+T;x.push(U,P,B),x.push(P,I,B)}}function E(){for(let w=0;w<=t;w++)for(let T=0;T<=i;T++)h.x=w/t,h.y=T/i,v.push(h.x,h.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new Fh(new nh[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class Zp extends gt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const t=[],n=new Set,i=new D,s=new D;if(e.index!==null){const a=e.attributes.position,c=e.index;let u=e.groups;u.length===0&&(u=[{start:0,count:c.count,materialIndex:0}]);for(let h=0,f=u.length;h<f;++h){const p=u[h],m=p.start,v=p.count;for(let x=m,M=m+v;x<M;x+=3)for(let y=0;y<3;y++){const _=c.getX(x+y),E=c.getX(x+(y+1)%3);i.fromBufferAttribute(a,_),s.fromBufferAttribute(a,E),ev(i,s,n)===!0&&(t.push(i.x,i.y,i.z),t.push(s.x,s.y,s.z))}}}else{const a=e.attributes.position;for(let c=0,u=a.count/3;c<u;c++)for(let h=0;h<3;h++){const f=3*c+h,p=3*c+(h+1)%3;i.fromBufferAttribute(a,f),s.fromBufferAttribute(a,p),ev(i,s,n)===!0&&(t.push(i.x,i.y,i.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new je(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function ev(r,e,t){const n=`${r.x},${r.y},${r.z}-${e.x},${e.y},${e.z}`,i=`${e.x},${e.y},${e.z}-${r.x},${r.y},${r.z}`;return t.has(n)===!0||t.has(i)===!0?!1:(t.add(n),t.add(i),!0)}var tv=Object.freeze({__proto__:null,BoxGeometry:Rs,CapsuleGeometry:Eh,CircleGeometry:Ah,ConeGeometry:bh,CylinderGeometry:Oo,DodecahedronGeometry:Th,EdgesGeometry:dx,ExtrudeGeometry:Rh,IcosahedronGeometry:Ph,LatheGeometry:cl,OctahedronGeometry:ul,PlaneGeometry:No,PolyhedronGeometry:Gr,RingGeometry:Ih,ShapeGeometry:Lh,SphereGeometry:hl,TetrahedronGeometry:Dh,TorusGeometry:Uh,TorusKnotGeometry:Nh,TubeGeometry:Fh,WireframeGeometry:Zp});class vx extends wn{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Ue(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class _x extends ai{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class zn extends wn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vr,this.normalScale=new ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class xx extends zn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ge(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Jt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ue(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ue(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ue(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class yx extends wn{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Ue(16777215),this.specular=new Ue(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vr,this.normalScale=new ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.combine=nl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Sx extends wn{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new Ue(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vr,this.normalScale=new ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}class Mx extends wn{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vr,this.normalScale=new ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}class wx extends wn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vr,this.normalScale=new ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.combine=nl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ex extends wn{constructor(e){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new Ue(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vr,this.normalScale=new ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ax extends Vn{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}function _s(r,e,t){return!r||!t&&r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function bx(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function Tx(r){function e(i,s){return r[i]-r[s]}const t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function up(r,e,t){const n=r.length,i=new r.constructor(n);for(let s=0,a=0;a!==n;++s){const c=t[s]*e;for(let u=0;u!==e;++u)i[a++]=r[c+u]}return i}function Jp(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(e.push(s.time),t.push.apply(t,a)),s=r[i++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do a=s[n],a!==void 0&&(e.push(s.time),t.push(a)),s=r[i++];while(s!==void 0)}function xT(r,e,t,n,i=30){const s=r.clone();s.name=e;const a=[];for(let u=0;u<s.tracks.length;++u){const h=s.tracks[u],f=h.getValueSize(),p=[],m=[];for(let v=0;v<h.times.length;++v){const x=h.times[v]*i;if(!(x<t||x>=n)){p.push(h.times[v]);for(let M=0;M<f;++M)m.push(h.values[v*f+M])}}p.length!==0&&(h.times=_s(p,h.times.constructor),h.values=_s(m,h.values.constructor),a.push(h))}s.tracks=a;let c=1/0;for(let u=0;u<s.tracks.length;++u)c>s.tracks[u].times[0]&&(c=s.tracks[u].times[0]);for(let u=0;u<s.tracks.length;++u)s.tracks[u].shift(-1*c);return s.resetDuration(),s}function yT(r,e=0,t=r,n=30){n<=0&&(n=30);const i=t.tracks.length,s=e/n;for(let a=0;a<i;++a){const c=t.tracks[a],u=c.ValueTypeName;if(u==="bool"||u==="string")continue;const h=r.tracks.find(function(_){return _.name===c.name&&_.ValueTypeName===u});if(h===void 0)continue;let f=0;const p=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(f=p/3);let m=0;const v=h.getValueSize();h.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(m=v/3);const x=c.times.length-1;let M;if(s<=c.times[0]){const _=f,E=p-f;M=c.values.slice(_,E)}else if(s>=c.times[x]){const _=x*p+f,E=_+p-f;M=c.values.slice(_,E)}else{const _=c.createInterpolant(),E=f,w=p-f;_.evaluate(s),M=_.resultBuffer.slice(E,w)}u==="quaternion"&&new Zn().fromArray(M).normalize().conjugate().toArray(M);const y=h.times.length;for(let _=0;_<y;++_){const E=_*v+m;if(u==="quaternion")Zn.multiplyQuaternionsFlat(h.values,E,M,0,h.values,E);else{const w=v-m*2;for(let T=0;T<w;++T)h.values[E+T]-=M[T]}}}return r.blendMode=Pp,r}const ST={convertArray:_s,isTypedArray:bx,getKeyframeOrder:Tx,sortedArray:up,flattenJSON:Jp,subclip:xT,makeClipAdditive:yT};class fl{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let a;n:{i:if(!(e<i)){for(let c=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===c)break;if(s=i,i=t[++n],e<i)break t}a=t.length;break n}if(!(e>=s)){const c=t[1];e<c&&(n=2,s=c);for(let u=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===u)break;if(i=s,s=t[--n-1],e>=s)break t}a=n,n=0;break n}break e}for(;n<a;){const c=n+a>>>1;e<t[c]?a=c:n=c+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let a=0;a!==i;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Cx extends fl{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ms,endingEnd:ms}}intervalChanged_(e,t,n){const i=this.parameterPositions;let s=e-2,a=e+1,c=i[s],u=i[a];if(c===void 0)switch(this.getSettings_().endingStart){case gs:s=e,c=2*t-n;break;case ka:s=i.length-2,c=t+i[s]-i[s+1];break;default:s=e,c=n}if(u===void 0)switch(this.getSettings_().endingEnd){case gs:a=e,u=2*n-t;break;case ka:a=1,u=n+i[1]-i[0];break;default:a=e-1,u=t}const h=(n-t)*.5,f=this.valueSize;this._weightPrev=h/(t-c),this._weightNext=h/(u-n),this._offsetPrev=s*f,this._offsetNext=a*f}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,c=this.valueSize,u=e*c,h=u-c,f=this._offsetPrev,p=this._offsetNext,m=this._weightPrev,v=this._weightNext,x=(n-t)/(i-t),M=x*x,y=M*x,_=-m*y+2*m*M-m*x,E=(1+m)*y+(-1.5-2*m)*M+(-.5+m)*x+1,w=(-1-v)*y+(1.5+v)*M+.5*x,T=v*y-v*M;for(let U=0;U!==c;++U)s[U]=_*a[f+U]+E*a[h+U]+w*a[u+U]+T*a[p+U];return s}}class Kp extends fl{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,c=this.valueSize,u=e*c,h=u-c,f=(n-t)/(i-t),p=1-f;for(let m=0;m!==c;++m)s[m]=a[h+m]*p+a[u+m]*f;return s}}class Rx extends fl{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Li{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=_s(t,this.TimeBufferType),this.values=_s(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:_s(e.times,Array),values:_s(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Rx(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Kp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Cx(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case za:t=this.InterpolantFactoryMethodDiscrete;break;case Qu:t=this.InterpolantFactoryMethodLinear;break;case du:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return za;case this.InterpolantFactoryMethodLinear:return Qu;case this.InterpolantFactoryMethodSmooth:return du}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let s=0,a=i-1;for(;s!==i&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);const c=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*c,a*c)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let c=0;c!==s;c++){const u=n[c];if(typeof u=="number"&&isNaN(u)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,c,u),e=!1;break}if(a!==null&&a>u){console.error("THREE.KeyframeTrack: Out of order keys.",this,c,u,a),e=!1;break}a=u}if(i!==void 0&&bx(i))for(let c=0,u=i.length;c!==u;++c){const h=i[c];if(isNaN(h)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,c,h),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===du,s=e.length-1;let a=1;for(let c=1;c<s;++c){let u=!1;const h=e[c],f=e[c+1];if(h!==f&&(c!==1||h!==e[0]))if(i)u=!0;else{const p=c*n,m=p-n,v=p+n;for(let x=0;x!==n;++x){const M=t[p+x];if(M!==t[m+x]||M!==t[v+x]){u=!0;break}}}if(u){if(c!==a){e[a]=e[c];const p=c*n,m=a*n;for(let v=0;v!==n;++v)t[m+v]=t[p+v]}++a}}if(s>0){e[a]=e[s];for(let c=s*n,u=a*n,h=0;h!==n;++h)t[u+h]=t[c+h];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}Li.prototype.TimeBufferType=Float32Array;Li.prototype.ValueBufferType=Float32Array;Li.prototype.DefaultInterpolation=Qu;class Is extends Li{constructor(e,t,n){super(e,t,n)}}Is.prototype.ValueTypeName="bool";Is.prototype.ValueBufferType=Array;Is.prototype.DefaultInterpolation=za;Is.prototype.InterpolantFactoryMethodLinear=void 0;Is.prototype.InterpolantFactoryMethodSmooth=void 0;class Qp extends Li{}Qp.prototype.ValueTypeName="color";class Qa extends Li{}Qa.prototype.ValueTypeName="number";class Px extends fl{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,c=this.valueSize,u=(n-t)/(i-t);let h=e*c;for(let f=h+c;h!==f;h+=4)Zn.slerpFlat(s,0,a,h-c,a,h,u);return s}}class dl extends Li{InterpolantFactoryMethodLinear(e){return new Px(this.times,this.values,this.getValueSize(),e)}}dl.prototype.ValueTypeName="quaternion";dl.prototype.InterpolantFactoryMethodSmooth=void 0;class Ls extends Li{constructor(e,t,n){super(e,t,n)}}Ls.prototype.ValueTypeName="string";Ls.prototype.ValueBufferType=Array;Ls.prototype.DefaultInterpolation=za;Ls.prototype.InterpolantFactoryMethodLinear=void 0;Ls.prototype.InterpolantFactoryMethodSmooth=void 0;class $a extends Li{}$a.prototype.ValueTypeName="vector";class el{constructor(e="",t=-1,n=[],i=dh){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=si(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,c=n.length;a!==c;++a)t.push(wT(n[a]).scale(i));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let s=0,a=n.length;s!==a;++s)t.push(Li.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const s=t.length,a=[];for(let c=0;c<s;c++){let u=[],h=[];u.push((c+s-1)%s,c,(c+1)%s),h.push(0,1,0);const f=Tx(u);u=up(u,1,f),h=up(h,1,f),!i&&u[0]===0&&(u.push(s),h.push(h[0])),a.push(new Qa(".morphTargetInfluences["+t[c].name+"]",u,h).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},s=/^([\w-]*?)([\d]+)$/;for(let c=0,u=e.length;c<u;c++){const h=e[c],f=h.name.match(s);if(f&&f.length>1){const p=f[1];let m=i[p];m||(i[p]=m=[]),m.push(h)}}const a=[];for(const c in i)a.push(this.CreateFromMorphTargetSequence(c,i[c],t,n));return a}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(p,m,v,x,M){if(v.length!==0){const y=[],_=[];Jp(v,y,_,x),y.length!==0&&M.push(new p(m,y,_))}},i=[],s=e.name||"default",a=e.fps||30,c=e.blendMode;let u=e.length||-1;const h=e.hierarchy||[];for(let p=0;p<h.length;p++){const m=h[p].keys;if(!(!m||m.length===0))if(m[0].morphTargets){const v={};let x;for(x=0;x<m.length;x++)if(m[x].morphTargets)for(let M=0;M<m[x].morphTargets.length;M++)v[m[x].morphTargets[M]]=-1;for(const M in v){const y=[],_=[];for(let E=0;E!==m[x].morphTargets.length;++E){const w=m[x];y.push(w.time),_.push(w.morphTarget===M?1:0)}i.push(new Qa(".morphTargetInfluence["+M+"]",y,_))}u=v.length*a}else{const v=".bones["+t[p].name+"]";n($a,v+".position",m,"pos",i),n(dl,v+".quaternion",m,"rot",i),n($a,v+".scale",m,"scl",i)}}return i.length===0?null:new this(s,u,i,c)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function MT(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Qa;case"vector":case"vector2":case"vector3":case"vector4":return $a;case"color":return Qp;case"quaternion":return dl;case"bool":case"boolean":return Is;case"string":return Ls}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function wT(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=MT(r.type);if(r.times===void 0){const t=[],n=[];Jp(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}const fr={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class $p{constructor(e,t,n){const i=this;let s=!1,a=0,c=0,u;const h=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(f){c++,s===!1&&i.onStart!==void 0&&i.onStart(f,a,c),s=!0},this.itemEnd=function(f){a++,i.onProgress!==void 0&&i.onProgress(f,a,c),a===c&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(f){i.onError!==void 0&&i.onError(f)},this.resolveURL=function(f){return u?u(f):f},this.setURLModifier=function(f){return u=f,this},this.addHandler=function(f,p){return h.push(f,p),this},this.removeHandler=function(f){const p=h.indexOf(f);return p!==-1&&h.splice(p,2),this},this.getHandler=function(f){for(let p=0,m=h.length;p<m;p+=2){const v=h[p],x=h[p+1];if(v.global&&(v.lastIndex=0),v.test(f))return x}return null}}}const Ix=new $p;class Jn{constructor(e){this.manager=e!==void 0?e:Ix,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Jn.DEFAULT_MATERIAL_NAME="__DEFAULT";const cr={};class ET extends Error{constructor(e,t){super(e),this.response=t}}class vr extends Jn{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=fr.get(e);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(cr[e]!==void 0){cr[e].push({onLoad:t,onProgress:n,onError:i});return}cr[e]=[],cr[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),c=this.mimeType,u=this.responseType;fetch(a).then(h=>{if(h.status===200||h.status===0){if(h.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||h.body===void 0||h.body.getReader===void 0)return h;const f=cr[e],p=h.body.getReader(),m=h.headers.get("X-File-Size")||h.headers.get("Content-Length"),v=m?parseInt(m):0,x=v!==0;let M=0;const y=new ReadableStream({start(_){E();function E(){p.read().then(({done:w,value:T})=>{if(w)_.close();else{M+=T.byteLength;const U=new ProgressEvent("progress",{lengthComputable:x,loaded:M,total:v});for(let P=0,I=f.length;P<I;P++){const B=f[P];B.onProgress&&B.onProgress(U)}_.enqueue(T),E()}},w=>{_.error(w)})}}});return new Response(y)}else throw new ET(`fetch for "${h.url}" responded with ${h.status}: ${h.statusText}`,h)}).then(h=>{switch(u){case"arraybuffer":return h.arrayBuffer();case"blob":return h.blob();case"document":return h.text().then(f=>new DOMParser().parseFromString(f,c));case"json":return h.json();default:if(c===void 0)return h.text();{const p=/charset="?([^;"\s]*)"?/i.exec(c),m=p&&p[1]?p[1].toLowerCase():void 0,v=new TextDecoder(m);return h.arrayBuffer().then(x=>v.decode(x))}}}).then(h=>{fr.add(e,h);const f=cr[e];delete cr[e];for(let p=0,m=f.length;p<m;p++){const v=f[p];v.onLoad&&v.onLoad(h)}}).catch(h=>{const f=cr[e];if(f===void 0)throw this.manager.itemError(e),h;delete cr[e];for(let p=0,m=f.length;p<m;p++){const v=f[p];v.onError&&v.onError(h)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class AT extends Jn{constructor(e){super(e)}load(e,t,n,i){const s=this,a=new vr(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(c){try{t(s.parse(JSON.parse(c)))}catch(u){i?i(u):console.error(u),s.manager.itemError(e)}},n,i)}parse(e){const t=[];for(let n=0;n<e.length;n++){const i=el.parse(e[n]);t.push(i)}return t}}class bT extends Jn{constructor(e){super(e)}load(e,t,n,i){const s=this,a=[],c=new Sh,u=new vr(this.manager);u.setPath(this.path),u.setResponseType("arraybuffer"),u.setRequestHeader(this.requestHeader),u.setWithCredentials(s.withCredentials);let h=0;function f(p){u.load(e[p],function(m){const v=s.parse(m,!0);a[p]={width:v.width,height:v.height,format:v.format,mipmaps:v.mipmaps},h+=1,h===6&&(v.mipmapCount===1&&(c.minFilter=on),c.image=a,c.format=v.format,c.needsUpdate=!0,t&&t(c))},n,i)}if(Array.isArray(e))for(let p=0,m=e.length;p<m;++p)f(p);else u.load(e,function(p){const m=s.parse(p,!0);if(m.isCubemap){const v=m.mipmaps.length/m.mipmapCount;for(let x=0;x<v;x++){a[x]={mipmaps:[]};for(let M=0;M<m.mipmapCount;M++)a[x].mipmaps.push(m.mipmaps[x*m.mipmapCount+M]),a[x].format=m.format,a[x].width=m.width,a[x].height=m.height}c.image=a}else c.image.width=m.width,c.image.height=m.height,c.mipmaps=m.mipmaps;m.mipmapCount===1&&(c.minFilter=on),c.format=m.format,c.needsUpdate=!0,t&&t(c)},n,i);return c}}class tl extends Jn{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=fr.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;const c=qa("img");function u(){f(),fr.add(e,this),t&&t(this),s.manager.itemEnd(e)}function h(p){f(),i&&i(p),s.manager.itemError(e),s.manager.itemEnd(e)}function f(){c.removeEventListener("load",u,!1),c.removeEventListener("error",h,!1)}return c.addEventListener("load",u,!1),c.addEventListener("error",h,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(c.crossOrigin=this.crossOrigin),s.manager.itemStart(e),c.src=e,c}}class TT extends Jn{constructor(e){super(e)}load(e,t,n,i){const s=new al;s.colorSpace=_i;const a=new tl(this.manager);a.setCrossOrigin(this.crossOrigin),a.setPath(this.path);let c=0;function u(h){a.load(e[h],function(f){s.images[h]=f,c++,c===6&&(s.needsUpdate=!0,t&&t(s))},void 0,i)}for(let h=0;h<e.length;++h)u(h);return s}}class CT extends Jn{constructor(e){super(e)}load(e,t,n,i){const s=this,a=new Yi,c=new vr(this.manager);return c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setPath(this.path),c.setWithCredentials(s.withCredentials),c.load(e,function(u){let h;try{h=s.parse(u)}catch(f){if(i!==void 0)i(f);else{console.error(f);return}}h.image!==void 0?a.image=h.image:h.data!==void 0&&(a.image.width=h.width,a.image.height=h.height,a.image.data=h.data),a.wrapS=h.wrapS!==void 0?h.wrapS:xi,a.wrapT=h.wrapT!==void 0?h.wrapT:xi,a.magFilter=h.magFilter!==void 0?h.magFilter:on,a.minFilter=h.minFilter!==void 0?h.minFilter:on,a.anisotropy=h.anisotropy!==void 0?h.anisotropy:1,h.colorSpace!==void 0&&(a.colorSpace=h.colorSpace),h.flipY!==void 0&&(a.flipY=h.flipY),h.format!==void 0&&(a.format=h.format),h.type!==void 0&&(a.type=h.type),h.mipmaps!==void 0&&(a.mipmaps=h.mipmaps,a.minFilter=Wi),h.mipmapCount===1&&(a.minFilter=on),h.generateMipmaps!==void 0&&(a.generateMipmaps=h.generateMipmaps),a.needsUpdate=!0,t&&t(a,h)},n,i),a}}class RT extends Jn{constructor(e){super(e)}load(e,t,n,i){const s=new Yt,a=new tl(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(c){s.image=c,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class Wr extends Tt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ue(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Lx extends Wr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ue(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Ld=new rt,nv=new D,iv=new D;class em{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ge(512,512),this.map=null,this.mapPass=null,this.matrix=new rt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ll,this._frameExtents=new ge(1,1),this._viewportCount=1,this._viewports=[new xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;nv.setFromMatrixPosition(e.matrixWorld),t.position.copy(nv),iv.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(iv),t.updateMatrixWorld(),Ld.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ld),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ld)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class PT extends em{constructor(){super(new sn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=bo*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Dx extends Wr{constructor(e,t,n=0,i=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.target=new Tt,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new PT}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const rv=new rt,ga=new D,Dd=new D;class IT extends em{constructor(){super(new sn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ge(4,2),this._viewportCount=6,this._viewports=[new xt(2,1,1,1),new xt(0,1,1,1),new xt(3,1,1,1),new xt(1,1,1,1),new xt(3,0,1,1),new xt(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),ga.setFromMatrixPosition(e.matrixWorld),n.position.copy(ga),Dd.copy(n.position),Dd.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Dd),n.updateMatrixWorld(),i.makeTranslation(-ga.x,-ga.y,-ga.z),rv.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(rv)}}class Ux extends Wr{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new IT}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class LT extends em{constructor(){super(new Ps(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Nx extends Wr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.target=new Tt,this.shadow=new LT}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Fx extends Wr{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Ox extends Wr{constructor(e,t,n=10,i=10){super(e,t),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){const t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}class Bx{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new D)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){const n=e.x,i=e.y,s=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.282095),t.addScaledVector(a[1],.488603*i),t.addScaledVector(a[2],.488603*s),t.addScaledVector(a[3],.488603*n),t.addScaledVector(a[4],1.092548*(n*i)),t.addScaledVector(a[5],1.092548*(i*s)),t.addScaledVector(a[6],.315392*(3*s*s-1)),t.addScaledVector(a[7],1.092548*(n*s)),t.addScaledVector(a[8],.546274*(n*n-i*i)),t}getIrradianceAt(e,t){const n=e.x,i=e.y,s=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.886227),t.addScaledVector(a[1],2*.511664*i),t.addScaledVector(a[2],2*.511664*s),t.addScaledVector(a[3],2*.511664*n),t.addScaledVector(a[4],2*.429043*n*i),t.addScaledVector(a[5],2*.429043*i*s),t.addScaledVector(a[6],.743125*s*s-.247708),t.addScaledVector(a[7],2*.429043*n*s),t.addScaledVector(a[8],.429043*(n*n-i*i)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(e.coefficients[n],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let n=0;n<9;n++)this.coefficients[n].lerp(e.coefficients[n],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(e,t+i*3);return this}toArray(e=[],t=0){const n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(e,t+i*3);return e}static getBasisAt(e,t){const n=e.x,i=e.y,s=e.z;t[0]=.282095,t[1]=.488603*i,t[2]=.488603*s,t[3]=.488603*n,t[4]=1.092548*n*i,t[5]=1.092548*i*s,t[6]=.315392*(3*s*s-1),t[7]=1.092548*n*s,t[8]=.546274*(n*n-i*i)}}class zx extends Wr{constructor(e=new Bx,t=1){super(void 0,t),this.isLightProbe=!0,this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}fromJSON(e){return this.intensity=e.intensity,this.sh.fromArray(e.sh),this}toJSON(e){const t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}}class Oh extends Jn{constructor(e){super(e),this.textures={}}load(e,t,n,i){const s=this,a=new vr(s.manager);a.setPath(s.path),a.setRequestHeader(s.requestHeader),a.setWithCredentials(s.withCredentials),a.load(e,function(c){try{t(s.parse(JSON.parse(c)))}catch(u){i?i(u):console.error(u),s.manager.itemError(e)}},n,i)}parse(e){const t=this.textures;function n(s){return t[s]===void 0&&console.warn("THREE.MaterialLoader: Undefined texture",s),t[s]}const i=this.createMaterialFromType(e.type);if(e.uuid!==void 0&&(i.uuid=e.uuid),e.name!==void 0&&(i.name=e.name),e.color!==void 0&&i.color!==void 0&&i.color.setHex(e.color),e.roughness!==void 0&&(i.roughness=e.roughness),e.metalness!==void 0&&(i.metalness=e.metalness),e.sheen!==void 0&&(i.sheen=e.sheen),e.sheenColor!==void 0&&(i.sheenColor=new Ue().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(i.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&i.emissive!==void 0&&i.emissive.setHex(e.emissive),e.specular!==void 0&&i.specular!==void 0&&i.specular.setHex(e.specular),e.specularIntensity!==void 0&&(i.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&i.specularColor!==void 0&&i.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(i.shininess=e.shininess),e.clearcoat!==void 0&&(i.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(i.dispersion=e.dispersion),e.iridescence!==void 0&&(i.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(i.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(i.transmission=e.transmission),e.thickness!==void 0&&(i.thickness=e.thickness),e.attenuationDistance!==void 0&&(i.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&i.attenuationColor!==void 0&&i.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(i.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(i.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(i.fog=e.fog),e.flatShading!==void 0&&(i.flatShading=e.flatShading),e.blending!==void 0&&(i.blending=e.blending),e.combine!==void 0&&(i.combine=e.combine),e.side!==void 0&&(i.side=e.side),e.shadowSide!==void 0&&(i.shadowSide=e.shadowSide),e.opacity!==void 0&&(i.opacity=e.opacity),e.transparent!==void 0&&(i.transparent=e.transparent),e.alphaTest!==void 0&&(i.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(i.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(i.depthFunc=e.depthFunc),e.depthTest!==void 0&&(i.depthTest=e.depthTest),e.depthWrite!==void 0&&(i.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(i.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(i.blendSrc=e.blendSrc),e.blendDst!==void 0&&(i.blendDst=e.blendDst),e.blendEquation!==void 0&&(i.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(i.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(i.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(i.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&i.blendColor!==void 0&&i.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(i.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(i.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(i.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(i.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(i.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(i.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(i.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(i.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(i.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(i.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(i.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(i.rotation=e.rotation),e.linewidth!==void 0&&(i.linewidth=e.linewidth),e.dashSize!==void 0&&(i.dashSize=e.dashSize),e.gapSize!==void 0&&(i.gapSize=e.gapSize),e.scale!==void 0&&(i.scale=e.scale),e.polygonOffset!==void 0&&(i.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(i.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(i.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(i.dithering=e.dithering),e.alphaToCoverage!==void 0&&(i.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(i.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(i.forceSinglePass=e.forceSinglePass),e.visible!==void 0&&(i.visible=e.visible),e.toneMapped!==void 0&&(i.toneMapped=e.toneMapped),e.userData!==void 0&&(i.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?i.vertexColors=e.vertexColors>0:i.vertexColors=e.vertexColors),e.uniforms!==void 0)for(const s in e.uniforms){const a=e.uniforms[s];switch(i.uniforms[s]={},a.type){case"t":i.uniforms[s].value=n(a.value);break;case"c":i.uniforms[s].value=new Ue().setHex(a.value);break;case"v2":i.uniforms[s].value=new ge().fromArray(a.value);break;case"v3":i.uniforms[s].value=new D().fromArray(a.value);break;case"v4":i.uniforms[s].value=new xt().fromArray(a.value);break;case"m3":i.uniforms[s].value=new dt().fromArray(a.value);break;case"m4":i.uniforms[s].value=new rt().fromArray(a.value);break;default:i.uniforms[s].value=a.value}}if(e.defines!==void 0&&(i.defines=e.defines),e.vertexShader!==void 0&&(i.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(i.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(i.glslVersion=e.glslVersion),e.extensions!==void 0)for(const s in e.extensions)i.extensions[s]=e.extensions[s];if(e.lights!==void 0&&(i.lights=e.lights),e.clipping!==void 0&&(i.clipping=e.clipping),e.size!==void 0&&(i.size=e.size),e.sizeAttenuation!==void 0&&(i.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(i.map=n(e.map)),e.matcap!==void 0&&(i.matcap=n(e.matcap)),e.alphaMap!==void 0&&(i.alphaMap=n(e.alphaMap)),e.bumpMap!==void 0&&(i.bumpMap=n(e.bumpMap)),e.bumpScale!==void 0&&(i.bumpScale=e.bumpScale),e.normalMap!==void 0&&(i.normalMap=n(e.normalMap)),e.normalMapType!==void 0&&(i.normalMapType=e.normalMapType),e.normalScale!==void 0){let s=e.normalScale;Array.isArray(s)===!1&&(s=[s,s]),i.normalScale=new ge().fromArray(s)}return e.displacementMap!==void 0&&(i.displacementMap=n(e.displacementMap)),e.displacementScale!==void 0&&(i.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(i.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(i.roughnessMap=n(e.roughnessMap)),e.metalnessMap!==void 0&&(i.metalnessMap=n(e.metalnessMap)),e.emissiveMap!==void 0&&(i.emissiveMap=n(e.emissiveMap)),e.emissiveIntensity!==void 0&&(i.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(i.specularMap=n(e.specularMap)),e.specularIntensityMap!==void 0&&(i.specularIntensityMap=n(e.specularIntensityMap)),e.specularColorMap!==void 0&&(i.specularColorMap=n(e.specularColorMap)),e.envMap!==void 0&&(i.envMap=n(e.envMap)),e.envMapRotation!==void 0&&i.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(i.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(i.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(i.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(i.lightMap=n(e.lightMap)),e.lightMapIntensity!==void 0&&(i.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(i.aoMap=n(e.aoMap)),e.aoMapIntensity!==void 0&&(i.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(i.gradientMap=n(e.gradientMap)),e.clearcoatMap!==void 0&&(i.clearcoatMap=n(e.clearcoatMap)),e.clearcoatRoughnessMap!==void 0&&(i.clearcoatRoughnessMap=n(e.clearcoatRoughnessMap)),e.clearcoatNormalMap!==void 0&&(i.clearcoatNormalMap=n(e.clearcoatNormalMap)),e.clearcoatNormalScale!==void 0&&(i.clearcoatNormalScale=new ge().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(i.iridescenceMap=n(e.iridescenceMap)),e.iridescenceThicknessMap!==void 0&&(i.iridescenceThicknessMap=n(e.iridescenceThicknessMap)),e.transmissionMap!==void 0&&(i.transmissionMap=n(e.transmissionMap)),e.thicknessMap!==void 0&&(i.thicknessMap=n(e.thicknessMap)),e.anisotropyMap!==void 0&&(i.anisotropyMap=n(e.anisotropyMap)),e.sheenColorMap!==void 0&&(i.sheenColorMap=n(e.sheenColorMap)),e.sheenRoughnessMap!==void 0&&(i.sheenRoughnessMap=n(e.sheenRoughnessMap)),i}setTextures(e){return this.textures=e,this}createMaterialFromType(e){return Oh.createMaterialFromType(e)}static createMaterialFromType(e){const t={ShadowMaterial:vx,SpriteMaterial:kp,RawShaderMaterial:_x,ShaderMaterial:ai,PointsMaterial:Vp,MeshPhysicalMaterial:xx,MeshStandardMaterial:zn,MeshPhongMaterial:yx,MeshToonMaterial:Sx,MeshNormalMaterial:Mx,MeshLambertMaterial:wx,MeshDepthMaterial:Bp,MeshDistanceMaterial:zp,MeshBasicMaterial:xr,MeshMatcapMaterial:Ex,LineDashedMaterial:Ax,LineBasicMaterial:Vn,Material:wn};return new t[e]}}class hp{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class tm extends gt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class kx extends Jn{constructor(e){super(e)}load(e,t,n,i){const s=this,a=new vr(s.manager);a.setPath(s.path),a.setRequestHeader(s.requestHeader),a.setWithCredentials(s.withCredentials),a.load(e,function(c){try{t(s.parse(JSON.parse(c)))}catch(u){i?i(u):console.error(u),s.manager.itemError(e)}},n,i)}parse(e){const t={},n={};function i(v,x){if(t[x]!==void 0)return t[x];const y=v.interleavedBuffers[x],_=s(v,y.buffer),E=xo(y.type,_),w=new xh(E,y.stride);return w.uuid=y.uuid,t[x]=w,w}function s(v,x){if(n[x]!==void 0)return n[x];const y=v.arrayBuffers[x],_=new Uint32Array(y).buffer;return n[x]=_,_}const a=e.isInstancedBufferGeometry?new tm:new gt,c=e.data.index;if(c!==void 0){const v=xo(c.type,c.array);a.setIndex(new Bt(v,1))}const u=e.data.attributes;for(const v in u){const x=u[v];let M;if(x.isInterleavedBufferAttribute){const y=i(e.data,x.data);M=new ri(y,x.itemSize,x.offset,x.normalized)}else{const y=xo(x.type,x.array),_=x.isInstancedBufferAttribute?Co:Bt;M=new _(y,x.itemSize,x.normalized)}x.name!==void 0&&(M.name=x.name),x.usage!==void 0&&M.setUsage(x.usage),a.setAttribute(v,M)}const h=e.data.morphAttributes;if(h)for(const v in h){const x=h[v],M=[];for(let y=0,_=x.length;y<_;y++){const E=x[y];let w;if(E.isInterleavedBufferAttribute){const T=i(e.data,E.data);w=new ri(T,E.itemSize,E.offset,E.normalized)}else{const T=xo(E.type,E.array);w=new Bt(T,E.itemSize,E.normalized)}E.name!==void 0&&(w.name=E.name),M.push(w)}a.morphAttributes[v]=M}e.data.morphTargetsRelative&&(a.morphTargetsRelative=!0);const p=e.data.groups||e.data.drawcalls||e.data.offsets;if(p!==void 0)for(let v=0,x=p.length;v!==x;++v){const M=p[v];a.addGroup(M.start,M.count,M.materialIndex)}const m=e.data.boundingSphere;if(m!==void 0){const v=new D;m.center!==void 0&&v.fromArray(m.center),a.boundingSphere=new vn(v,m.radius)}return e.name&&(a.name=e.name),e.userData&&(a.userData=e.userData),a}}class DT extends Jn{constructor(e){super(e)}load(e,t,n,i){const s=this,a=this.path===""?hp.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||a;const c=new vr(this.manager);c.setPath(this.path),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(u){let h=null;try{h=JSON.parse(u)}catch(p){i!==void 0&&i(p),console.error("THREE:ObjectLoader: Can't parse "+e+".",p.message);return}const f=h.metadata;if(f===void 0||f.type===void 0||f.type.toLowerCase()==="geometry"){i!==void 0&&i(new Error("THREE.ObjectLoader: Can't load "+e)),console.error("THREE.ObjectLoader: Can't load "+e);return}s.parse(h,t)},n,i)}async loadAsync(e,t){const n=this,i=this.path===""?hp.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||i;const s=new vr(this.manager);s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials);const a=await s.loadAsync(e,t),c=JSON.parse(a),u=c.metadata;if(u===void 0||u.type===void 0||u.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+e);return await n.parseAsync(c)}parse(e,t){const n=this.parseAnimations(e.animations),i=this.parseShapes(e.shapes),s=this.parseGeometries(e.geometries,i),a=this.parseImages(e.images,function(){t!==void 0&&t(h)}),c=this.parseTextures(e.textures,a),u=this.parseMaterials(e.materials,c),h=this.parseObject(e.object,s,u,c,n),f=this.parseSkeletons(e.skeletons,h);if(this.bindSkeletons(h,f),this.bindLightTargets(h),t!==void 0){let p=!1;for(const m in a)if(a[m].data instanceof HTMLImageElement){p=!0;break}p===!1&&t(h)}return h}async parseAsync(e){const t=this.parseAnimations(e.animations),n=this.parseShapes(e.shapes),i=this.parseGeometries(e.geometries,n),s=await this.parseImagesAsync(e.images),a=this.parseTextures(e.textures,s),c=this.parseMaterials(e.materials,a),u=this.parseObject(e.object,i,c,a,t),h=this.parseSkeletons(e.skeletons,u);return this.bindSkeletons(u,h),this.bindLightTargets(u),u}parseShapes(e){const t={};if(e!==void 0)for(let n=0,i=e.length;n<i;n++){const s=new ws().fromJSON(e[n]);t[s.uuid]=s}return t}parseSkeletons(e,t){const n={},i={};if(t.traverse(function(s){s.isBone&&(i[s.uuid]=s)}),e!==void 0)for(let s=0,a=e.length;s<a;s++){const c=new yh().fromJSON(e[s],i);n[c.uuid]=c}return n}parseGeometries(e,t){const n={};if(e!==void 0){const i=new kx;for(let s=0,a=e.length;s<a;s++){let c;const u=e[s];switch(u.type){case"BufferGeometry":case"InstancedBufferGeometry":c=i.parse(u);break;default:u.type in tv?c=tv[u.type].fromJSON(u,t):console.warn(`THREE.ObjectLoader: Unsupported geometry type "${u.type}"`)}c.uuid=u.uuid,u.name!==void 0&&(c.name=u.name),u.userData!==void 0&&(c.userData=u.userData),n[u.uuid]=c}}return n}parseMaterials(e,t){const n={},i={};if(e!==void 0){const s=new Oh;s.setTextures(t);for(let a=0,c=e.length;a<c;a++){const u=e[a];n[u.uuid]===void 0&&(n[u.uuid]=s.parse(u)),i[u.uuid]=n[u.uuid]}}return i}parseAnimations(e){const t={};if(e!==void 0)for(let n=0;n<e.length;n++){const i=e[n],s=el.parse(i);t[s.uuid]=s}return t}parseImages(e,t){const n=this,i={};let s;function a(u){return n.manager.itemStart(u),s.load(u,function(){n.manager.itemEnd(u)},void 0,function(){n.manager.itemError(u),n.manager.itemEnd(u)})}function c(u){if(typeof u=="string"){const h=u,f=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(h)?h:n.resourcePath+h;return a(f)}else return u.data?{data:xo(u.type,u.data),width:u.width,height:u.height}:null}if(e!==void 0&&e.length>0){const u=new $p(t);s=new tl(u),s.setCrossOrigin(this.crossOrigin);for(let h=0,f=e.length;h<f;h++){const p=e[h],m=p.url;if(Array.isArray(m)){const v=[];for(let x=0,M=m.length;x<M;x++){const y=m[x],_=c(y);_!==null&&(_ instanceof HTMLImageElement?v.push(_):v.push(new Yi(_.data,_.width,_.height)))}i[p.uuid]=new vs(v)}else{const v=c(p.url);i[p.uuid]=new vs(v)}}}return i}async parseImagesAsync(e){const t=this,n={};let i;async function s(a){if(typeof a=="string"){const c=a,u=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(c)?c:t.resourcePath+c;return await i.loadAsync(u)}else return a.data?{data:xo(a.type,a.data),width:a.width,height:a.height}:null}if(e!==void 0&&e.length>0){i=new tl(this.manager),i.setCrossOrigin(this.crossOrigin);for(let a=0,c=e.length;a<c;a++){const u=e[a],h=u.url;if(Array.isArray(h)){const f=[];for(let p=0,m=h.length;p<m;p++){const v=h[p],x=await s(v);x!==null&&(x instanceof HTMLImageElement?f.push(x):f.push(new Yi(x.data,x.width,x.height)))}n[u.uuid]=new vs(f)}else{const f=await s(u.url);n[u.uuid]=new vs(f)}}}return n}parseTextures(e,t){function n(s,a){return typeof s=="number"?s:(console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.",s),a[s])}const i={};if(e!==void 0)for(let s=0,a=e.length;s<a;s++){const c=e[s];c.image===void 0&&console.warn('THREE.ObjectLoader: No "image" specified for',c.uuid),t[c.image]===void 0&&console.warn("THREE.ObjectLoader: Undefined image",c.image);const u=t[c.image],h=u.data;let f;Array.isArray(h)?(f=new al,h.length===6&&(f.needsUpdate=!0)):(h&&h.data?f=new Yi:f=new Yt,h&&(f.needsUpdate=!0)),f.source=u,f.uuid=c.uuid,c.name!==void 0&&(f.name=c.name),c.mapping!==void 0&&(f.mapping=n(c.mapping,UT)),c.channel!==void 0&&(f.channel=c.channel),c.offset!==void 0&&f.offset.fromArray(c.offset),c.repeat!==void 0&&f.repeat.fromArray(c.repeat),c.center!==void 0&&f.center.fromArray(c.center),c.rotation!==void 0&&(f.rotation=c.rotation),c.wrap!==void 0&&(f.wrapS=n(c.wrap[0],sv),f.wrapT=n(c.wrap[1],sv)),c.format!==void 0&&(f.format=c.format),c.internalFormat!==void 0&&(f.internalFormat=c.internalFormat),c.type!==void 0&&(f.type=c.type),c.colorSpace!==void 0&&(f.colorSpace=c.colorSpace),c.minFilter!==void 0&&(f.minFilter=n(c.minFilter,ov)),c.magFilter!==void 0&&(f.magFilter=n(c.magFilter,ov)),c.anisotropy!==void 0&&(f.anisotropy=c.anisotropy),c.flipY!==void 0&&(f.flipY=c.flipY),c.generateMipmaps!==void 0&&(f.generateMipmaps=c.generateMipmaps),c.premultiplyAlpha!==void 0&&(f.premultiplyAlpha=c.premultiplyAlpha),c.unpackAlignment!==void 0&&(f.unpackAlignment=c.unpackAlignment),c.compareFunction!==void 0&&(f.compareFunction=c.compareFunction),c.userData!==void 0&&(f.userData=c.userData),i[c.uuid]=f}return i}parseObject(e,t,n,i,s){let a;function c(m){return t[m]===void 0&&console.warn("THREE.ObjectLoader: Undefined geometry",m),t[m]}function u(m){if(m!==void 0){if(Array.isArray(m)){const v=[];for(let x=0,M=m.length;x<M;x++){const y=m[x];n[y]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",y),v.push(n[y])}return v}return n[m]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",m),n[m]}}function h(m){return i[m]===void 0&&console.warn("THREE.ObjectLoader: Undefined texture",m),i[m]}let f,p;switch(e.type){case"Scene":a=new $u,e.background!==void 0&&(Number.isInteger(e.background)?a.background=new Ue(e.background):a.background=h(e.background)),e.environment!==void 0&&(a.environment=h(e.environment)),e.fog!==void 0&&(e.fog.type==="Fog"?a.fog=new _h(e.fog.color,e.fog.near,e.fog.far):e.fog.type==="FogExp2"&&(a.fog=new vh(e.fog.color,e.fog.density)),e.fog.name!==""&&(a.fog.name=e.fog.name)),e.backgroundBlurriness!==void 0&&(a.backgroundBlurriness=e.backgroundBlurriness),e.backgroundIntensity!==void 0&&(a.backgroundIntensity=e.backgroundIntensity),e.backgroundRotation!==void 0&&a.backgroundRotation.fromArray(e.backgroundRotation),e.environmentIntensity!==void 0&&(a.environmentIntensity=e.environmentIntensity),e.environmentRotation!==void 0&&a.environmentRotation.fromArray(e.environmentRotation);break;case"PerspectiveCamera":a=new sn(e.fov,e.aspect,e.near,e.far),e.focus!==void 0&&(a.focus=e.focus),e.zoom!==void 0&&(a.zoom=e.zoom),e.filmGauge!==void 0&&(a.filmGauge=e.filmGauge),e.filmOffset!==void 0&&(a.filmOffset=e.filmOffset),e.view!==void 0&&(a.view=Object.assign({},e.view));break;case"OrthographicCamera":a=new Ps(e.left,e.right,e.top,e.bottom,e.near,e.far),e.zoom!==void 0&&(a.zoom=e.zoom),e.view!==void 0&&(a.view=Object.assign({},e.view));break;case"AmbientLight":a=new Fx(e.color,e.intensity);break;case"DirectionalLight":a=new Nx(e.color,e.intensity),a.target=e.target||"";break;case"PointLight":a=new Ux(e.color,e.intensity,e.distance,e.decay);break;case"RectAreaLight":a=new Ox(e.color,e.intensity,e.width,e.height);break;case"SpotLight":a=new Dx(e.color,e.intensity,e.distance,e.angle,e.penumbra,e.decay),a.target=e.target||"";break;case"HemisphereLight":a=new Lx(e.color,e.groundColor,e.intensity);break;case"LightProbe":a=new zx().fromJSON(e);break;case"SkinnedMesh":f=c(e.geometry),p=u(e.material),a=new rx(f,p),e.bindMode!==void 0&&(a.bindMode=e.bindMode),e.bindMatrix!==void 0&&a.bindMatrix.fromArray(e.bindMatrix),e.skeleton!==void 0&&(a.skeleton=e.skeleton);break;case"Mesh":f=c(e.geometry),p=u(e.material),a=new en(f,p);break;case"InstancedMesh":f=c(e.geometry),p=u(e.material);const m=e.count,v=e.instanceMatrix,x=e.instanceColor;a=new sx(f,p,m),a.instanceMatrix=new Co(new Float32Array(v.array),16),x!==void 0&&(a.instanceColor=new Co(new Float32Array(x.array),x.itemSize));break;case"BatchedMesh":f=c(e.geometry),p=u(e.material),a=new ox(e.maxInstanceCount,e.maxVertexCount,e.maxIndexCount,p),a.geometry=f,a.perObjectFrustumCulled=e.perObjectFrustumCulled,a.sortObjects=e.sortObjects,a._drawRanges=e.drawRanges,a._reservedRanges=e.reservedRanges,a._visibility=e.visibility,a._active=e.active,a._bounds=e.bounds.map(M=>{const y=new gn;y.min.fromArray(M.boxMin),y.max.fromArray(M.boxMax);const _=new vn;return _.radius=M.sphereRadius,_.center.fromArray(M.sphereCenter),{boxInitialized:M.boxInitialized,box:y,sphereInitialized:M.sphereInitialized,sphere:_}}),a._maxInstanceCount=e.maxInstanceCount,a._maxVertexCount=e.maxVertexCount,a._maxIndexCount=e.maxIndexCount,a._geometryInitialized=e.geometryInitialized,a._geometryCount=e.geometryCount,a._matricesTexture=h(e.matricesTexture.uuid),e.colorsTexture!==void 0&&(a._colorsTexture=h(e.colorsTexture.uuid));break;case"LOD":a=new ix;break;case"Line":a=new Hr(c(e.geometry),u(e.material));break;case"LineLoop":a=new ax(c(e.geometry),u(e.material));break;case"LineSegments":a=new Ji(c(e.geometry),u(e.material));break;case"PointCloud":case"Points":a=new lx(c(e.geometry),u(e.material));break;case"Sprite":a=new nx(u(e.material));break;case"Group":a=new So;break;case"Bone":a=new Hp;break;default:a=new Tt}if(a.uuid=e.uuid,e.name!==void 0&&(a.name=e.name),e.matrix!==void 0?(a.matrix.fromArray(e.matrix),e.matrixAutoUpdate!==void 0&&(a.matrixAutoUpdate=e.matrixAutoUpdate),a.matrixAutoUpdate&&a.matrix.decompose(a.position,a.quaternion,a.scale)):(e.position!==void 0&&a.position.fromArray(e.position),e.rotation!==void 0&&a.rotation.fromArray(e.rotation),e.quaternion!==void 0&&a.quaternion.fromArray(e.quaternion),e.scale!==void 0&&a.scale.fromArray(e.scale)),e.up!==void 0&&a.up.fromArray(e.up),e.castShadow!==void 0&&(a.castShadow=e.castShadow),e.receiveShadow!==void 0&&(a.receiveShadow=e.receiveShadow),e.shadow&&(e.shadow.intensity!==void 0&&(a.shadow.intensity=e.shadow.intensity),e.shadow.bias!==void 0&&(a.shadow.bias=e.shadow.bias),e.shadow.normalBias!==void 0&&(a.shadow.normalBias=e.shadow.normalBias),e.shadow.radius!==void 0&&(a.shadow.radius=e.shadow.radius),e.shadow.mapSize!==void 0&&a.shadow.mapSize.fromArray(e.shadow.mapSize),e.shadow.camera!==void 0&&(a.shadow.camera=this.parseObject(e.shadow.camera))),e.visible!==void 0&&(a.visible=e.visible),e.frustumCulled!==void 0&&(a.frustumCulled=e.frustumCulled),e.renderOrder!==void 0&&(a.renderOrder=e.renderOrder),e.userData!==void 0&&(a.userData=e.userData),e.layers!==void 0&&(a.layers.mask=e.layers),e.children!==void 0){const m=e.children;for(let v=0;v<m.length;v++)a.add(this.parseObject(m[v],t,n,i,s))}if(e.animations!==void 0){const m=e.animations;for(let v=0;v<m.length;v++){const x=m[v];a.animations.push(s[x])}}if(e.type==="LOD"){e.autoUpdate!==void 0&&(a.autoUpdate=e.autoUpdate);const m=e.levels;for(let v=0;v<m.length;v++){const x=m[v],M=a.getObjectByProperty("uuid",x.object);M!==void 0&&a.addLevel(M,x.distance,x.hysteresis)}}return a}bindSkeletons(e,t){Object.keys(t).length!==0&&e.traverse(function(n){if(n.isSkinnedMesh===!0&&n.skeleton!==void 0){const i=t[n.skeleton];i===void 0?console.warn("THREE.ObjectLoader: No skeleton found with UUID:",n.skeleton):n.bind(i,n.bindMatrix)}})}bindLightTargets(e){e.traverse(function(t){if(t.isDirectionalLight||t.isSpotLight){const n=t.target,i=e.getObjectByProperty("uuid",n);i!==void 0?t.target=i:t.target=new Tt}})}}const UT={UVMapping:oh,CubeReflectionMapping:mr,CubeRefractionMapping:kr,EquirectangularReflectionMapping:Na,EquirectangularRefractionMapping:Fa,CubeUVReflectionMapping:Lo},sv={RepeatWrapping:Oa,ClampToEdgeWrapping:xi,MirroredRepeatWrapping:Ba},ov={NearestFilter:mn,NearestMipmapNearestFilter:yp,NearestMipmapLinearFilter:_o,LinearFilter:on,LinearMipmapNearestFilter:ba,LinearMipmapLinearFilter:Wi};class NT extends Jn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=fr.get(e);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(h=>{t&&t(h),s.manager.itemEnd(e)}).catch(h=>{i&&i(h)});return}return setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a}const c={};c.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",c.headers=this.requestHeader;const u=fetch(e,c).then(function(h){return h.blob()}).then(function(h){return createImageBitmap(h,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(h){return fr.add(e,h),t&&t(h),s.manager.itemEnd(e),h}).catch(function(h){i&&i(h),fr.remove(e),s.manager.itemError(e),s.manager.itemEnd(e)});fr.add(e,u),s.manager.itemStart(e)}}let eu;class nm{static getContext(){return eu===void 0&&(eu=new(window.AudioContext||window.webkitAudioContext)),eu}static setContext(e){eu=e}}class FT extends Jn{constructor(e){super(e)}load(e,t,n,i){const s=this,a=new vr(this.manager);a.setResponseType("arraybuffer"),a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(u){try{const h=u.slice(0);nm.getContext().decodeAudioData(h,function(p){t(p)}).catch(c)}catch(h){c(h)}},n,i);function c(u){i?i(u):console.error(u),s.manager.itemError(e)}}}const av=new rt,lv=new rt,as=new rt;class OT{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new sn,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new sn,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(e){const t=this._cache;if(t.focus!==e.focus||t.fov!==e.fov||t.aspect!==e.aspect*this.aspect||t.near!==e.near||t.far!==e.far||t.zoom!==e.zoom||t.eyeSep!==this.eyeSep){t.focus=e.focus,t.fov=e.fov,t.aspect=e.aspect*this.aspect,t.near=e.near,t.far=e.far,t.zoom=e.zoom,t.eyeSep=this.eyeSep,as.copy(e.projectionMatrix);const i=t.eyeSep/2,s=i*t.near/t.focus,a=t.near*Math.tan(Ss*t.fov*.5)/t.zoom;let c,u;lv.elements[12]=-i,av.elements[12]=i,c=-a*t.aspect+s,u=a*t.aspect+s,as.elements[0]=2*t.near/(u-c),as.elements[8]=(u+c)/(u-c),this.cameraL.projectionMatrix.copy(as),c=-a*t.aspect-s,u=a*t.aspect-s,as.elements[0]=2*t.near/(u-c),as.elements[8]=(u+c)/(u-c),this.cameraR.projectionMatrix.copy(as)}this.cameraL.matrixWorld.copy(e.matrixWorld).multiply(lv),this.cameraR.matrixWorld.copy(e.matrixWorld).multiply(av)}}class im{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=cv(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=cv();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function cv(){return performance.now()}const ls=new D,uv=new Zn,BT=new D,cs=new D;class zT extends Tt{constructor(){super(),this.type="AudioListener",this.context=nm.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._clock=new im}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(e){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=e,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}updateMatrixWorld(e){super.updateMatrixWorld(e);const t=this.context.listener,n=this.up;if(this.timeDelta=this._clock.getDelta(),this.matrixWorld.decompose(ls,uv,BT),cs.set(0,0,-1).applyQuaternion(uv),t.positionX){const i=this.context.currentTime+this.timeDelta;t.positionX.linearRampToValueAtTime(ls.x,i),t.positionY.linearRampToValueAtTime(ls.y,i),t.positionZ.linearRampToValueAtTime(ls.z,i),t.forwardX.linearRampToValueAtTime(cs.x,i),t.forwardY.linearRampToValueAtTime(cs.y,i),t.forwardZ.linearRampToValueAtTime(cs.z,i),t.upX.linearRampToValueAtTime(n.x,i),t.upY.linearRampToValueAtTime(n.y,i),t.upZ.linearRampToValueAtTime(n.z,i)}else t.setPosition(ls.x,ls.y,ls.z),t.setOrientation(cs.x,cs.y,cs.z,n.x,n.y,n.z)}}class Hx extends Tt{constructor(e){super(),this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){console.warn("THREE.Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+e;const t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(e=0){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+e),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(e){return e||(e=[]),this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){return this.detune=e,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1}getLoop(){return this.hasPlaybackControl===!1?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}}const us=new D,hv=new Zn,kT=new D,hs=new D;class HT extends Hx{constructor(e){super(e),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){super.connect(),this.panner.connect(this.gain)}disconnect(){super.disconnect(),this.panner.disconnect(this.gain)}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(e){return this.panner.refDistance=e,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(e){return this.panner.rolloffFactor=e,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(e){return this.panner.distanceModel=e,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(e){return this.panner.maxDistance=e,this}setDirectionalCone(e,t,n){return this.panner.coneInnerAngle=e,this.panner.coneOuterAngle=t,this.panner.coneOuterGain=n,this}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(us,hv,kT),hs.set(0,0,1).applyQuaternion(hv);const t=this.panner;if(t.positionX){const n=this.context.currentTime+this.listener.timeDelta;t.positionX.linearRampToValueAtTime(us.x,n),t.positionY.linearRampToValueAtTime(us.y,n),t.positionZ.linearRampToValueAtTime(us.z,n),t.orientationX.linearRampToValueAtTime(hs.x,n),t.orientationY.linearRampToValueAtTime(hs.y,n),t.orientationZ.linearRampToValueAtTime(hs.z,n)}else t.setPosition(us.x,us.y,us.z),t.setOrientation(hs.x,hs.y,hs.z)}}class VT{constructor(e,t=2048){this.analyser=e.context.createAnalyser(),this.analyser.fftSize=t,this.data=new Uint8Array(this.analyser.frequencyBinCount),e.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let e=0;const t=this.getFrequencyData();for(let n=0;n<t.length;n++)e+=t[n];return e/t.length}}class Vx{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,a;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,s=e*i+i;let a=this.cumulativeWeight;if(a===0){for(let c=0;c!==i;++c)n[s+c]=n[c];a=t}else{a+=t;const c=t/a;this._mixBufferRegion(n,s,0,c,i)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,a=this.cumulativeWeightAdditive,c=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){const u=t*this._origIndex;this._mixBufferRegion(n,i,u,1-s,t)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let u=t,h=t+t;u!==h;++u)if(n[u]!==n[u+t]){c.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,a=i;s!==a;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let a=0;a!==s;++a)e[t+a]=e[n+a]}_slerp(e,t,n,i){Zn.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){const a=this._workIndex*s;Zn.multiplyQuaternionsFlat(e,a,e,t,e,n),Zn.slerpFlat(e,t,e,t,e,a,i)}_lerp(e,t,n,i,s){const a=1-i;for(let c=0;c!==s;++c){const u=t+c;e[u]=e[u]*a+e[n+c]*i}}_lerpAdditive(e,t,n,i,s){for(let a=0;a!==s;++a){const c=t+a;e[c]=e[c]+e[n+a]*i}}}const rm="\\[\\]\\.:\\/",GT=new RegExp("["+rm+"]","g"),sm="[^"+rm+"]",WT="[^"+rm.replace("\\.","")+"]",XT=/((?:WC+[\/:])*)/.source.replace("WC",sm),qT=/(WCOD+)?/.source.replace("WCOD",WT),YT=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",sm),jT=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",sm),ZT=new RegExp("^"+XT+qT+YT+jT+"$"),JT=["material","materials","bones","map"];class KT{constructor(e,t,n){const i=n||Rt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class Rt{constructor(e,t,n){this.path=t,this.parsedPath=n||Rt.parseTrackName(t),this.node=Rt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new Rt.Composite(e,t,n):new Rt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(GT,"")}static parseTrackName(e){const t=ZT.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const s=n.nodeName.substring(i+1);JT.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let a=0;a<s.length;a++){const c=s[a];if(c.name===t||c.uuid===t)return c;const u=n(c.children);if(u)return u}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let s=t.propertyIndex;if(e||(e=Rt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let h=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let f=0;f<e.length;f++)if(e[f].name===h){h=f;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(h!==void 0){if(e[h]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[h]}}const a=e[i];if(a===void 0){const h=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+h+"."+i+" but it wasn't found.",e);return}let c=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?c=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(c=this.Versioning.MatrixWorldNeedsUpdate);let u=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}u=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(u=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(u=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[u],this.setValue=this.SetterByBindingTypeAndVersioning[u][c]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Rt.Composite=KT;Rt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Rt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Rt.prototype.GetterByBindingType=[Rt.prototype._getValue_direct,Rt.prototype._getValue_array,Rt.prototype._getValue_arrayElement,Rt.prototype._getValue_toArray];Rt.prototype.SetterByBindingTypeAndVersioning=[[Rt.prototype._setValue_direct,Rt.prototype._setValue_direct_setNeedsUpdate,Rt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_array,Rt.prototype._setValue_array_setNeedsUpdate,Rt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_arrayElement,Rt.prototype._setValue_arrayElement_setNeedsUpdate,Rt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_fromArray,Rt.prototype._setValue_fromArray_setNeedsUpdate,Rt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class QT{constructor(){this.isAnimationObjectGroup=!0,this.uuid=si(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;const e={};this._indicesByUUID=e;for(let n=0,i=arguments.length;n!==i;++n)e[arguments[n].uuid]=n;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};const t=this;this.stats={objects:{get total(){return t._objects.length},get inUse(){return this.total-t.nCachedObjects_}},get bindingsPerObject(){return t._bindings.length}}}add(){const e=this._objects,t=this._indicesByUUID,n=this._paths,i=this._parsedPaths,s=this._bindings,a=s.length;let c,u=e.length,h=this.nCachedObjects_;for(let f=0,p=arguments.length;f!==p;++f){const m=arguments[f],v=m.uuid;let x=t[v];if(x===void 0){x=u++,t[v]=x,e.push(m);for(let M=0,y=a;M!==y;++M)s[M].push(new Rt(m,n[M],i[M]))}else if(x<h){c=e[x];const M=--h,y=e[M];t[y.uuid]=x,e[x]=y,t[v]=M,e[M]=m;for(let _=0,E=a;_!==E;++_){const w=s[_],T=w[M];let U=w[x];w[x]=T,U===void 0&&(U=new Rt(m,n[_],i[_])),w[M]=U}}else e[x]!==c&&console.error("THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=h}remove(){const e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length;let s=this.nCachedObjects_;for(let a=0,c=arguments.length;a!==c;++a){const u=arguments[a],h=u.uuid,f=t[h];if(f!==void 0&&f>=s){const p=s++,m=e[p];t[m.uuid]=f,e[f]=m,t[h]=p,e[p]=u;for(let v=0,x=i;v!==x;++v){const M=n[v],y=M[p],_=M[f];M[f]=y,M[p]=_}}}this.nCachedObjects_=s}uncache(){const e=this._objects,t=this._indicesByUUID,n=this._bindings,i=n.length;let s=this.nCachedObjects_,a=e.length;for(let c=0,u=arguments.length;c!==u;++c){const h=arguments[c],f=h.uuid,p=t[f];if(p!==void 0)if(delete t[f],p<s){const m=--s,v=e[m],x=--a,M=e[x];t[v.uuid]=p,e[p]=v,t[M.uuid]=m,e[m]=M,e.pop();for(let y=0,_=i;y!==_;++y){const E=n[y],w=E[m],T=E[x];E[p]=w,E[m]=T,E.pop()}}else{const m=--a,v=e[m];m>0&&(t[v.uuid]=p),e[p]=v,e.pop();for(let x=0,M=i;x!==M;++x){const y=n[x];y[p]=y[m],y.pop()}}}this.nCachedObjects_=s}subscribe_(e,t){const n=this._bindingsIndicesByPath;let i=n[e];const s=this._bindings;if(i!==void 0)return s[i];const a=this._paths,c=this._parsedPaths,u=this._objects,h=u.length,f=this.nCachedObjects_,p=new Array(h);i=s.length,n[e]=i,a.push(e),c.push(t),s.push(p);for(let m=f,v=u.length;m!==v;++m){const x=u[m];p[m]=new Rt(x,e,t)}return p}unsubscribe_(e){const t=this._bindingsIndicesByPath,n=t[e];if(n!==void 0){const i=this._paths,s=this._parsedPaths,a=this._bindings,c=a.length-1,u=a[c],h=e[c];t[h]=n,a[n]=u,a.pop(),s[n]=s[c],s.pop(),i[n]=i[c],i.pop()}}}class Gx{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const s=t.tracks,a=s.length,c=new Array(a),u={endingStart:ms,endingEnd:ms};for(let h=0;h!==a;++h){const f=s[h].createInterpolant(null);c[h]=f,f.settings=u}this._interpolantSettings=u,this._interpolants=c,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=T_,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n){if(e.fadeOut(t),this.fadeIn(t),n){const i=this._clip.duration,s=e._clip.duration,a=s/i,c=i/s;e.warp(1,a,t),this.warp(c,1,t)}return this}crossFadeTo(e,t,n){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,s=i.time,a=this.timeScale;let c=this._timeScaleInterpolant;c===null&&(c=i._lendControlInterpolant(),this._timeScaleInterpolant=c);const u=c.parameterPositions,h=c.sampleValues;return u[0]=s,u[1]=s+n,h[0]=e/a,h[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const s=this._startTime;if(s!==null){const u=(e-s)*n;u<0||n===0?t=0:(this._startTime=null,t=n*u)}t*=this._updateTimeScale(e);const a=this._updateTime(t),c=this._updateWeight(e);if(c>0){const u=this._interpolants,h=this._propertyBindings;switch(this.blendMode){case Pp:for(let f=0,p=u.length;f!==p;++f)u[f].evaluate(a),h[f].accumulateAdditive(c);break;case dh:default:for(let f=0,p=u.length;f!==p;++f)u[f].evaluate(a),h[f].accumulate(i,c)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,s=this._loopCount;const a=n===C_;if(e===0)return s===-1?i:a&&(s&1)===1?t-i:i;if(n===b_){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=t||i<0){const c=Math.floor(i/t);i-=t*c,s+=Math.abs(c);const u=this.repetitions-s;if(u<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(u===1){const h=e<0;this._setEndings(h,!h,a)}else this._setEndings(!1,!1,a);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:c})}}else this.time=i;if(a&&(s&1)===1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=gs,i.endingEnd=gs):(e?i.endingStart=this.zeroSlopeAtStart?gs:ms:i.endingStart=ka,t?i.endingEnd=this.zeroSlopeAtEnd?gs:ms:i.endingEnd=ka)}_scheduleFading(e,t,n){const i=this._mixer,s=i.time;let a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);const c=a.parameterPositions,u=a.sampleValues;return c[0]=s,u[0]=t,c[1]=s+e,u[1]=n,this}}const $T=new Float32Array(1);class eC extends Zi{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,a=e._propertyBindings,c=e._interpolants,u=n.uuid,h=this._bindingsByRootAndName;let f=h[u];f===void 0&&(f={},h[u]=f);for(let p=0;p!==s;++p){const m=i[p],v=m.name;let x=f[v];if(x!==void 0)++x.referenceCount,a[p]=x;else{if(x=a[p],x!==void 0){x._cacheIndex===null&&(++x.referenceCount,this._addInactiveBinding(x,u,v));continue}const M=t&&t._propertyBindings[p].binding.parsedPath;x=new Vx(Rt.create(n,v,M),m.ValueTypeName,m.getValueSize()),++x.referenceCount,this._addInactiveBinding(x,u,v),a[p]=x}c[p].resultBuffer=x.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,s=this._actionsByClip;let a=s[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=a;else{const c=a.knownActions;e._byClipCacheIndex=c.length,c.push(e)}e._cacheIndex=i.length,i.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const s=e._clip.uuid,a=this._actionsByClip,c=a[s],u=c.knownActions,h=u[u.length-1],f=e._byClipCacheIndex;h._byClipCacheIndex=f,u[f]=h,u.pop(),e._byClipCacheIndex=null;const p=c.actionByRoot,m=(e._localRoot||this._root).uuid;delete p[m],u.length===0&&delete a[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,s=this._bindings;let a=i[t];a===void 0&&(a={},i[t]=a),a[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,a=this._bindingsByRootAndName,c=a[i],u=t[t.length-1],h=e._cacheIndex;u._cacheIndex=h,t[h]=u,t.pop(),delete c[s],Object.keys(c).length===0&&delete a[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new Kp(new Float32Array(2),new Float32Array(2),1,$T),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){const i=t||this._root,s=i.uuid;let a=typeof e=="string"?el.findByName(i,e):e;const c=a!==null?a.uuid:e,u=this._actionsByClip[c];let h=null;if(n===void 0&&(a!==null?n=a.blendMode:n=dh),u!==void 0){const p=u.actionByRoot[s];if(p!==void 0&&p.blendMode===n)return p;h=u.knownActions[0],a===null&&(a=h._clip)}if(a===null)return null;const f=new Gx(this,a,t,n);return this._bindAction(f,h),this._addInactiveAction(f,c,s),f}existingAction(e,t){const n=t||this._root,i=n.uuid,s=typeof e=="string"?el.findByName(n,e):e,a=s?s.uuid:e,c=this._actionsByClip[a];return c!==void 0&&c.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),a=this._accuIndex^=1;for(let h=0;h!==n;++h)t[h]._update(i,e,s,a);const c=this._bindings,u=this._nActiveBindings;for(let h=0;h!==u;++h)c[h].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){const a=s.knownActions;for(let c=0,u=a.length;c!==u;++c){const h=a[c];this._deactivateAction(h);const f=h._cacheIndex,p=t[t.length-1];h._cacheIndex=null,h._byClipCacheIndex=null,p._cacheIndex=f,t[f]=p,t.pop(),this._removeInactiveBindingsForAction(h)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const a in n){const c=n[a].actionByRoot,u=c[t];u!==void 0&&(this._deactivateAction(u),this._removeInactiveAction(u))}const i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(const a in s){const c=s[a];c.restoreOriginalState(),this._removeInactiveBinding(c)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}class om{constructor(e){this.value=e}clone(){return new om(this.value.clone===void 0?this.value:this.value.clone())}}let tC=0;class nC extends Zi{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:tC++}),this.name="",this.usage=Wa,this.uniforms=[]}add(e){return this.uniforms.push(e),this}remove(e){const t=this.uniforms.indexOf(e);return t!==-1&&this.uniforms.splice(t,1),this}setName(e){return this.name=e,this}setUsage(e){return this.usage=e,this}dispose(){return this.dispatchEvent({type:"dispose"}),this}copy(e){this.name=e.name,this.usage=e.usage;const t=e.uniforms;this.uniforms.length=0;for(let n=0,i=t.length;n<i;n++){const s=Array.isArray(t[n])?t[n]:[t[n]];for(let a=0;a<s.length;a++)this.uniforms.push(s[a].clone())}return this}clone(){return new this.constructor().copy(this)}}class ih extends xh{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}class iC{constructor(e,t,n,i,s){this.isGLBufferAttribute=!0,this.name="",this.buffer=e,this.type=t,this.itemSize=n,this.elementSize=i,this.count=s,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}}const fv=new rt;class Wx{constructor(e,t,n=0,i=1/0){this.ray=new Uo(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Ms,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return fv.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(fv),this}intersectObject(e,t=!0,n=[]){return fp(e,this,n,t),n.sort(dv),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)fp(e[i],this,n,t);return n.sort(dv),n}}function dv(r,e){return r.distance-e.distance}function fp(r,e,t,n){let i=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const s=r.children;for(let a=0,c=s.length;a<c;a++)fp(s[a],e,t,!0)}}class rC{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Jt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class sC{constructor(e=1,t=0,n=0){return this.radius=e,this.theta=t,this.y=n,this}set(e,t,n){return this.radius=e,this.theta=t,this.y=n,this}copy(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+n*n),this.theta=Math.atan2(e,n),this.y=t,this}clone(){return new this.constructor().copy(this)}}class am{constructor(e,t,n,i){am.prototype.isMatrix2=!0,this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}}const pv=new ge;class oC{constructor(e=new ge(1/0,1/0),t=new ge(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=pv.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,pv).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const mv=new D,tu=new D;class Xx{constructor(e=new D,t=new D){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){mv.subVectors(e,this.start),tu.subVectors(this.end,this.start);const n=tu.dot(tu);let s=tu.dot(mv)/n;return t&&(s=Jt(s,0,1)),s}closestPointToPoint(e,t,n){const i=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(i).add(this.start)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}const gv=new D;class aC extends Tt{constructor(e,t){super(),this.light=e,this.matrixAutoUpdate=!1,this.color=t,this.type="SpotLightHelper";const n=new gt,i=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let a=0,c=1,u=32;a<u;a++,c++){const h=a/u*Math.PI*2,f=c/u*Math.PI*2;i.push(Math.cos(h),Math.sin(h),1,Math.cos(f),Math.sin(f),1)}n.setAttribute("position",new je(i,3));const s=new Vn({fog:!1,toneMapped:!1});this.cone=new Ji(n,s),this.add(this.cone),this.update()}dispose(){this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorld.copy(this.light.matrixWorld);const e=this.light.distance?this.light.distance:1e3,t=e*Math.tan(this.light.angle);this.cone.scale.set(t,t,e),gv.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(gv),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}}const Or=new D,nu=new rt,Ud=new rt;class lC extends Ji{constructor(e){const t=qx(e),n=new gt,i=[],s=[],a=new Ue(0,0,1),c=new Ue(0,1,0);for(let h=0;h<t.length;h++){const f=t[h];f.parent&&f.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),s.push(a.r,a.g,a.b),s.push(c.r,c.g,c.b))}n.setAttribute("position",new je(i,3)),n.setAttribute("color",new je(s,3));const u=new Vn({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,u),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1}updateMatrixWorld(e){const t=this.bones,n=this.geometry,i=n.getAttribute("position");Ud.copy(this.root.matrixWorld).invert();for(let s=0,a=0;s<t.length;s++){const c=t[s];c.parent&&c.parent.isBone&&(nu.multiplyMatrices(Ud,c.matrixWorld),Or.setFromMatrixPosition(nu),i.setXYZ(a,Or.x,Or.y,Or.z),nu.multiplyMatrices(Ud,c.parent.matrixWorld),Or.setFromMatrixPosition(nu),i.setXYZ(a+1,Or.x,Or.y,Or.z),a+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}dispose(){this.geometry.dispose(),this.material.dispose()}}function qx(r){const e=[];r.isBone===!0&&e.push(r);for(let t=0;t<r.children.length;t++)e.push.apply(e,qx(r.children[t]));return e}class cC extends en{constructor(e,t,n){const i=new hl(t,4,2),s=new xr({wireframe:!0,fog:!1,toneMapped:!1});super(i,s),this.light=e,this.color=n,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){this.geometry.dispose(),this.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}}const uC=new D,vv=new Ue,_v=new Ue;class hC extends Tt{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="HemisphereLightHelper";const i=new ul(t);i.rotateY(Math.PI*.5),this.material=new xr({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);const s=i.getAttribute("position"),a=new Float32Array(s.count*3);i.setAttribute("color",new Bt(a,3)),this.add(new en(i,this.material)),this.update()}dispose(){this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){const e=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{const t=e.geometry.getAttribute("color");vv.copy(this.light.color),_v.copy(this.light.groundColor);for(let n=0,i=t.count;n<i;n++){const s=n<i/2?vv:_v;t.setXYZ(n,s.r,s.g,s.b)}t.needsUpdate=!0}this.light.updateWorldMatrix(!0,!1),e.lookAt(uC.setFromMatrixPosition(this.light.matrixWorld).negate())}}class fC extends Ji{constructor(e=10,t=10,n=4473924,i=8947848){n=new Ue(n),i=new Ue(i);const s=t/2,a=e/t,c=e/2,u=[],h=[];for(let m=0,v=0,x=-c;m<=t;m++,x+=a){u.push(-c,0,x,c,0,x),u.push(x,0,-c,x,0,c);const M=m===s?n:i;M.toArray(h,v),v+=3,M.toArray(h,v),v+=3,M.toArray(h,v),v+=3,M.toArray(h,v),v+=3}const f=new gt;f.setAttribute("position",new je(u,3)),f.setAttribute("color",new je(h,3));const p=new Vn({vertexColors:!0,toneMapped:!1});super(f,p),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class dC extends Ji{constructor(e=10,t=16,n=8,i=64,s=4473924,a=8947848){s=new Ue(s),a=new Ue(a);const c=[],u=[];if(t>1)for(let p=0;p<t;p++){const m=p/t*(Math.PI*2),v=Math.sin(m)*e,x=Math.cos(m)*e;c.push(0,0,0),c.push(v,0,x);const M=p&1?s:a;u.push(M.r,M.g,M.b),u.push(M.r,M.g,M.b)}for(let p=0;p<n;p++){const m=p&1?s:a,v=e-e/n*p;for(let x=0;x<i;x++){let M=x/i*(Math.PI*2),y=Math.sin(M)*v,_=Math.cos(M)*v;c.push(y,0,_),u.push(m.r,m.g,m.b),M=(x+1)/i*(Math.PI*2),y=Math.sin(M)*v,_=Math.cos(M)*v,c.push(y,0,_),u.push(m.r,m.g,m.b)}}const h=new gt;h.setAttribute("position",new je(c,3)),h.setAttribute("color",new je(u,3));const f=new Vn({vertexColors:!0,toneMapped:!1});super(h,f),this.type="PolarGridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const xv=new D,iu=new D,yv=new D;class pC extends Tt{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="DirectionalLightHelper",t===void 0&&(t=1);let i=new gt;i.setAttribute("position",new je([-t,t,0,t,t,0,t,-t,0,-t,-t,0,-t,t,0],3));const s=new Vn({fog:!1,toneMapped:!1});this.lightPlane=new Hr(i,s),this.add(this.lightPlane),i=new gt,i.setAttribute("position",new je([0,0,0,0,0,1],3)),this.targetLine=new Hr(i,s),this.add(this.targetLine),this.update()}dispose(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),xv.setFromMatrixPosition(this.light.matrixWorld),iu.setFromMatrixPosition(this.light.target.matrixWorld),yv.subVectors(iu,xv),this.lightPlane.lookAt(iu),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(iu),this.targetLine.scale.z=yv.length()}}const ru=new D,Zt=new ol;class mC extends Ji{constructor(e){const t=new gt,n=new Vn({color:16777215,vertexColors:!0,toneMapped:!1}),i=[],s=[],a={};c("n1","n2"),c("n2","n4"),c("n4","n3"),c("n3","n1"),c("f1","f2"),c("f2","f4"),c("f4","f3"),c("f3","f1"),c("n1","f1"),c("n2","f2"),c("n3","f3"),c("n4","f4"),c("p","n1"),c("p","n2"),c("p","n3"),c("p","n4"),c("u1","u2"),c("u2","u3"),c("u3","u1"),c("c","t"),c("p","c"),c("cn1","cn2"),c("cn3","cn4"),c("cf1","cf2"),c("cf3","cf4");function c(x,M){u(x),u(M)}function u(x){i.push(0,0,0),s.push(0,0,0),a[x]===void 0&&(a[x]=[]),a[x].push(i.length/3-1)}t.setAttribute("position",new je(i,3)),t.setAttribute("color",new je(s,3)),super(t,n),this.type="CameraHelper",this.camera=e,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=a,this.update();const h=new Ue(16755200),f=new Ue(16711680),p=new Ue(43775),m=new Ue(16777215),v=new Ue(3355443);this.setColors(h,f,p,m,v)}setColors(e,t,n,i,s){const c=this.geometry.getAttribute("color");c.setXYZ(0,e.r,e.g,e.b),c.setXYZ(1,e.r,e.g,e.b),c.setXYZ(2,e.r,e.g,e.b),c.setXYZ(3,e.r,e.g,e.b),c.setXYZ(4,e.r,e.g,e.b),c.setXYZ(5,e.r,e.g,e.b),c.setXYZ(6,e.r,e.g,e.b),c.setXYZ(7,e.r,e.g,e.b),c.setXYZ(8,e.r,e.g,e.b),c.setXYZ(9,e.r,e.g,e.b),c.setXYZ(10,e.r,e.g,e.b),c.setXYZ(11,e.r,e.g,e.b),c.setXYZ(12,e.r,e.g,e.b),c.setXYZ(13,e.r,e.g,e.b),c.setXYZ(14,e.r,e.g,e.b),c.setXYZ(15,e.r,e.g,e.b),c.setXYZ(16,e.r,e.g,e.b),c.setXYZ(17,e.r,e.g,e.b),c.setXYZ(18,e.r,e.g,e.b),c.setXYZ(19,e.r,e.g,e.b),c.setXYZ(20,e.r,e.g,e.b),c.setXYZ(21,e.r,e.g,e.b),c.setXYZ(22,e.r,e.g,e.b),c.setXYZ(23,e.r,e.g,e.b),c.setXYZ(24,t.r,t.g,t.b),c.setXYZ(25,t.r,t.g,t.b),c.setXYZ(26,t.r,t.g,t.b),c.setXYZ(27,t.r,t.g,t.b),c.setXYZ(28,t.r,t.g,t.b),c.setXYZ(29,t.r,t.g,t.b),c.setXYZ(30,t.r,t.g,t.b),c.setXYZ(31,t.r,t.g,t.b),c.setXYZ(32,n.r,n.g,n.b),c.setXYZ(33,n.r,n.g,n.b),c.setXYZ(34,n.r,n.g,n.b),c.setXYZ(35,n.r,n.g,n.b),c.setXYZ(36,n.r,n.g,n.b),c.setXYZ(37,n.r,n.g,n.b),c.setXYZ(38,i.r,i.g,i.b),c.setXYZ(39,i.r,i.g,i.b),c.setXYZ(40,s.r,s.g,s.b),c.setXYZ(41,s.r,s.g,s.b),c.setXYZ(42,s.r,s.g,s.b),c.setXYZ(43,s.r,s.g,s.b),c.setXYZ(44,s.r,s.g,s.b),c.setXYZ(45,s.r,s.g,s.b),c.setXYZ(46,s.r,s.g,s.b),c.setXYZ(47,s.r,s.g,s.b),c.setXYZ(48,s.r,s.g,s.b),c.setXYZ(49,s.r,s.g,s.b),c.needsUpdate=!0}update(){const e=this.geometry,t=this.pointMap,n=1,i=1;Zt.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),$t("c",t,e,Zt,0,0,-1),$t("t",t,e,Zt,0,0,1),$t("n1",t,e,Zt,-n,-i,-1),$t("n2",t,e,Zt,n,-i,-1),$t("n3",t,e,Zt,-n,i,-1),$t("n4",t,e,Zt,n,i,-1),$t("f1",t,e,Zt,-n,-i,1),$t("f2",t,e,Zt,n,-i,1),$t("f3",t,e,Zt,-n,i,1),$t("f4",t,e,Zt,n,i,1),$t("u1",t,e,Zt,n*.7,i*1.1,-1),$t("u2",t,e,Zt,-n*.7,i*1.1,-1),$t("u3",t,e,Zt,0,i*2,-1),$t("cf1",t,e,Zt,-n,0,1),$t("cf2",t,e,Zt,n,0,1),$t("cf3",t,e,Zt,0,-i,1),$t("cf4",t,e,Zt,0,i,1),$t("cn1",t,e,Zt,-n,0,-1),$t("cn2",t,e,Zt,n,0,-1),$t("cn3",t,e,Zt,0,-i,-1),$t("cn4",t,e,Zt,0,i,-1),e.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}function $t(r,e,t,n,i,s,a){ru.set(i,s,a).unproject(n);const c=e[r];if(c!==void 0){const u=t.getAttribute("position");for(let h=0,f=c.length;h<f;h++)u.setXYZ(c[h],ru.x,ru.y,ru.z)}}const su=new gn;class gC extends Ji{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=new Float32Array(8*3),s=new gt;s.setIndex(new Bt(n,1)),s.setAttribute("position",new Bt(i,3)),super(s,new Vn({color:t,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(e){if(e!==void 0&&console.warn("THREE.BoxHelper: .update() has no longer arguments."),this.object!==void 0&&su.setFromObject(this.object),su.isEmpty())return;const t=su.min,n=su.max,i=this.geometry.attributes.position,s=i.array;s[0]=n.x,s[1]=n.y,s[2]=n.z,s[3]=t.x,s[4]=n.y,s[5]=n.z,s[6]=t.x,s[7]=t.y,s[8]=n.z,s[9]=n.x,s[10]=t.y,s[11]=n.z,s[12]=n.x,s[13]=n.y,s[14]=t.z,s[15]=t.x,s[16]=n.y,s[17]=t.z,s[18]=t.x,s[19]=t.y,s[20]=t.z,s[21]=n.x,s[22]=t.y,s[23]=t.z,i.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e,t){return super.copy(e,t),this.object=e.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class vC extends Ji{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],s=new gt;s.setIndex(new Bt(n,1)),s.setAttribute("position",new je(i,3)),super(s,new Vn({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){const t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}}class _C extends Hr{constructor(e,t=1,n=16776960){const i=n,s=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],a=new gt;a.setAttribute("position",new je(s,3)),a.computeBoundingSphere(),super(a,new Vn({color:i,toneMapped:!1})),this.type="PlaneHelper",this.plane=e,this.size=t;const c=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],u=new gt;u.setAttribute("position",new je(c,3)),u.computeBoundingSphere(),this.add(new en(u,new xr({color:i,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(e){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(e)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}const Sv=new D;let ou,Nd;class xC extends Tt{constructor(e=new D(0,0,1),t=new D(0,0,0),n=1,i=16776960,s=n*.2,a=s*.2){super(),this.type="ArrowHelper",ou===void 0&&(ou=new gt,ou.setAttribute("position",new je([0,0,0,0,1,0],3)),Nd=new Oo(0,.5,1,5,1),Nd.translate(0,-.5,0)),this.position.copy(t),this.line=new Hr(ou,new Vn({color:i,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new en(Nd,new xr({color:i,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,s,a)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{Sv.set(e.z,0,-e.x).normalize();const t=Math.acos(e.y);this.quaternion.setFromAxisAngle(Sv,t)}}setLength(e,t=e*.2,n=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class yC extends Ji{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],i=new gt;i.setAttribute("position",new je(t,3)),i.setAttribute("color",new je(n,3));const s=new Vn({vertexColors:!0,toneMapped:!1});super(i,s),this.type="AxesHelper"}setColors(e,t,n){const i=new Ue,s=this.geometry.attributes.color.array;return i.set(e),i.toArray(s,0),i.toArray(s,3),i.set(t),i.toArray(s,6),i.toArray(s,9),i.set(n),i.toArray(s,12),i.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class SC{constructor(){this.type="ShapePath",this.color=new Ue,this.subPaths=[],this.currentPath=null}moveTo(e,t){return this.currentPath=new ja,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,n,i){return this.currentPath.quadraticCurveTo(e,t,n,i),this}bezierCurveTo(e,t,n,i,s,a){return this.currentPath.bezierCurveTo(e,t,n,i,s,a),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(e){function t(_){const E=[];for(let w=0,T=_.length;w<T;w++){const U=_[w],P=new ws;P.curves=U.curves,E.push(P)}return E}function n(_,E){const w=E.length;let T=!1;for(let U=w-1,P=0;P<w;U=P++){let I=E[U],B=E[P],k=B.x-I.x,b=B.y-I.y;if(Math.abs(b)>Number.EPSILON){if(b<0&&(I=E[P],k=-k,B=E[U],b=-b),_.y<I.y||_.y>B.y)continue;if(_.y===I.y){if(_.x===I.x)return!0}else{const C=b*(_.x-I.x)-k*(_.y-I.y);if(C===0)return!0;if(C<0)continue;T=!T}}else{if(_.y!==I.y)continue;if(B.x<=_.x&&_.x<=I.x||I.x<=_.x&&_.x<=B.x)return!0}}return T}const i=ji.isClockWise,s=this.subPaths;if(s.length===0)return[];let a,c,u;const h=[];if(s.length===1)return c=s[0],u=new ws,u.curves=c.curves,h.push(u),h;let f=!i(s[0].getPoints());f=e?!f:f;const p=[],m=[];let v=[],x=0,M;m[x]=void 0,v[x]=[];for(let _=0,E=s.length;_<E;_++)c=s[_],M=c.getPoints(),a=i(M),a=e?!a:a,a?(!f&&m[x]&&x++,m[x]={s:new ws,p:M},m[x].s.curves=c.curves,f&&x++,v[x]=[]):v[x].push({h:c,p:M[0]});if(!m[0])return t(s);if(m.length>1){let _=!1,E=0;for(let w=0,T=m.length;w<T;w++)p[w]=[];for(let w=0,T=m.length;w<T;w++){const U=v[w];for(let P=0;P<U.length;P++){const I=U[P];let B=!0;for(let k=0;k<m.length;k++)n(I.p,m[k].p)&&(w!==k&&E++,B?(B=!1,p[k].push(I)):_=!0);B&&p[w].push(I)}}E>0&&_===!1&&(v=p)}let y;for(let _=0,E=m.length;_<E;_++){u=m[_].s,h.push(u),y=v[_];for(let w=0,T=y.length;w<T;w++)u.holes.push(y[w].h)}return h}}class MC extends Zi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}class wC extends Pi{constructor(e=1,t=1,n=1,i={}){console.warn('THREE.WebGLMultipleRenderTargets has been deprecated and will be removed in r172. Use THREE.WebGLRenderTarget and set the "count" parameter to enable MRT.'),super(e,t,{...i,count:n}),this.isWebGLMultipleRenderTargets=!0}get texture(){return this.textures}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Io}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Io);const EC=Object.freeze(Object.defineProperty({__proto__:null,ACESFilmicToneMapping:xp,AddEquation:zr,AddOperation:__,AdditiveAnimationBlendMode:Pp,AdditiveBlending:Qd,AgXToneMapping:w_,AlphaFormat:Ep,AlwaysCompare:B_,AlwaysDepth:yu,AlwaysStencilFunc:np,AmbientLight:Fx,AnimationAction:Gx,AnimationClip:el,AnimationLoader:AT,AnimationMixer:eC,AnimationObjectGroup:QT,AnimationUtils:ST,ArcCurve:cx,ArrayCamera:$_,ArrowHelper:xC,AttachedBindMode:tp,Audio:Hx,AudioAnalyser:VT,AudioContext:nm,AudioListener:zT,AudioLoader:FT,AxesHelper:yC,BackSide:Hn,BasicDepthPacking:R_,BasicShadowMap:Qv,BatchedMesh:ox,Bone:Hp,BooleanKeyframeTrack:Is,Box2:oC,Box3:gn,Box3Helper:vC,BoxGeometry:Rs,BoxHelper:gC,BufferAttribute:Bt,BufferGeometry:gt,BufferGeometryLoader:kx,ByteType:Sp,Cache:fr,Camera:ol,CameraHelper:mC,CanvasTexture:Xb,CapsuleGeometry:Eh,CatmullRomCurve3:wh,CineonToneMapping:S_,CircleGeometry:Ah,ClampToEdgeWrapping:xi,Clock:im,Color:Ue,ColorKeyframeTrack:Qp,ColorManagement:Ut,CompressedArrayTexture:Gb,CompressedCubeTexture:Wb,CompressedTexture:Sh,CompressedTextureLoader:bT,ConeGeometry:bh,ConstantAlphaFactor:m_,ConstantColorFactor:d_,Controls:MC,CubeCamera:X_,CubeReflectionMapping:mr,CubeRefractionMapping:kr,CubeTexture:al,CubeTextureLoader:TT,CubeUVReflectionMapping:Lo,CubicBezierCurve:Wp,CubicBezierCurve3:ux,CubicInterpolant:Cx,CullFaceBack:Kd,CullFaceFront:Kv,CullFaceFrontBack:_S,CullFaceNone:Jv,Curve:Ii,CurvePath:fx,CustomBlending:$v,CustomToneMapping:M_,CylinderGeometry:Oo,Cylindrical:sC,Data3DTexture:Dp,DataArrayTexture:mh,DataTexture:Yi,DataTextureLoader:CT,DataUtils:LM,DecrementStencilOp:LS,DecrementWrapStencilOp:US,DefaultLoadingManager:Ix,DepthFormat:ys,DepthStencilFormat:Ts,DepthTexture:Op,DetachedBindMode:A_,DirectionalLight:Nx,DirectionalLightHelper:pC,DiscreteInterpolant:Rx,DisplayP3ColorSpace:ph,DodecahedronGeometry:Th,DoubleSide:Ci,DstAlphaFactor:l_,DstColorFactor:u_,DynamicCopyUsage:ZS,DynamicDrawUsage:GS,DynamicReadUsage:qS,EdgesGeometry:dx,EllipseCurve:Mh,EqualCompare:U_,EqualDepth:Mu,EqualStencilFunc:BS,EquirectangularReflectionMapping:Na,EquirectangularRefractionMapping:Fa,Euler:oi,EventDispatcher:Zi,ExtrudeGeometry:Rh,FileLoader:vr,Float16BufferAttribute:BM,Float32BufferAttribute:je,FloatType:jn,Fog:_h,FogExp2:vh,FramebufferTexture:Vb,FrontSide:pr,Frustum:ll,GLBufferAttribute:iC,GLSL1:KS,GLSL3:ip,GreaterCompare:N_,GreaterDepth:Eu,GreaterEqualCompare:O_,GreaterEqualDepth:wu,GreaterEqualStencilFunc:VS,GreaterStencilFunc:kS,GridHelper:fC,Group:So,HalfFloatType:Do,HemisphereLight:Lx,HemisphereLightHelper:hC,IcosahedronGeometry:Ph,ImageBitmapLoader:NT,ImageLoader:tl,ImageUtils:H_,IncrementStencilOp:IS,IncrementWrapStencilOp:DS,InstancedBufferAttribute:Co,InstancedBufferGeometry:tm,InstancedInterleavedBuffer:ih,InstancedMesh:sx,Int16BufferAttribute:FM,Int32BufferAttribute:OM,Int8BufferAttribute:DM,IntType:ah,InterleavedBuffer:xh,InterleavedBufferAttribute:ri,Interpolant:fl,InterpolateDiscrete:za,InterpolateLinear:Qu,InterpolateSmooth:du,InvertStencilOp:NS,KeepStencilOp:fs,KeyframeTrack:Li,LOD:ix,LatheGeometry:cl,Layers:Ms,LessCompare:D_,LessDepth:Su,LessEqualCompare:Ip,LessEqualDepth:As,LessEqualStencilFunc:zS,LessStencilFunc:OS,Light:Wr,LightProbe:zx,Line:Hr,Line3:Xx,LineBasicMaterial:Vn,LineCurve:Xp,LineCurve3:hx,LineDashedMaterial:Ax,LineLoop:ax,LineSegments:Ji,LinearDisplayP3ColorSpace:rl,LinearFilter:on,LinearInterpolant:Kp,LinearMipMapLinearFilter:MS,LinearMipMapNearestFilter:SS,LinearMipmapLinearFilter:Wi,LinearMipmapNearestFilter:ba,LinearSRGBColorSpace:_r,LinearToneMapping:x_,LinearTransfer:Ha,Loader:Jn,LoaderUtils:hp,LoadingManager:$p,LoopOnce:b_,LoopPingPong:C_,LoopRepeat:T_,LuminanceAlphaFormat:Tp,LuminanceFormat:bp,MOUSE:gS,Material:wn,MaterialLoader:Oh,MathUtils:sl,Matrix2:am,Matrix3:dt,Matrix4:rt,MaxEquation:i_,Mesh:en,MeshBasicMaterial:xr,MeshDepthMaterial:Bp,MeshDistanceMaterial:zp,MeshLambertMaterial:wx,MeshMatcapMaterial:Ex,MeshNormalMaterial:Mx,MeshPhongMaterial:yx,MeshPhysicalMaterial:xx,MeshStandardMaterial:zn,MeshToonMaterial:Sx,MinEquation:n_,MirroredRepeatWrapping:Ba,MixOperation:v_,MultiplyBlending:ep,MultiplyOperation:nl,NearestFilter:mn,NearestMipMapLinearFilter:yS,NearestMipMapNearestFilter:xS,NearestMipmapLinearFilter:_o,NearestMipmapNearestFilter:yp,NeutralToneMapping:E_,NeverCompare:L_,NeverDepth:xu,NeverStencilFunc:FS,NoBlending:dr,NoColorSpace:ur,NoToneMapping:qi,NormalAnimationBlendMode:dh,NormalBlending:xs,NotEqualCompare:F_,NotEqualDepth:Au,NotEqualStencilFunc:HS,NumberKeyframeTrack:Qa,Object3D:Tt,ObjectLoader:DT,ObjectSpaceNormalMap:I_,OctahedronGeometry:ul,OneFactor:s_,OneMinusConstantAlphaFactor:g_,OneMinusConstantColorFactor:p_,OneMinusDstAlphaFactor:c_,OneMinusDstColorFactor:h_,OneMinusSrcAlphaFactor:_u,OneMinusSrcColorFactor:a_,OrthographicCamera:Ps,P3Primaries:Ga,PCFShadowMap:sh,PCFSoftShadowMap:Aa,PMREMGenerator:rp,Path:ja,PerspectiveCamera:sn,Plane:Br,PlaneGeometry:No,PlaneHelper:_C,PointLight:Ux,PointLightHelper:cC,Points:lx,PointsMaterial:Vp,PolarGridHelper:dC,PolyhedronGeometry:Gr,PositionalAudio:HT,PropertyBinding:Rt,PropertyMixer:Vx,QuadraticBezierCurve:qp,QuadraticBezierCurve3:Yp,Quaternion:Zn,QuaternionKeyframeTrack:dl,QuaternionLinearInterpolant:Px,RED_GREEN_RGTC2_Format:Ju,RED_RGTC1_Format:Rp,REVISION:Io,RGBADepthPacking:P_,RGBAFormat:Ln,RGBAIntegerFormat:fh,RGBA_ASTC_10x10_Format:Wu,RGBA_ASTC_10x5_Format:Hu,RGBA_ASTC_10x6_Format:Vu,RGBA_ASTC_10x8_Format:Gu,RGBA_ASTC_12x10_Format:Xu,RGBA_ASTC_12x12_Format:qu,RGBA_ASTC_4x4_Format:Du,RGBA_ASTC_5x4_Format:Uu,RGBA_ASTC_5x5_Format:Nu,RGBA_ASTC_6x5_Format:Fu,RGBA_ASTC_6x6_Format:Ou,RGBA_ASTC_8x5_Format:Bu,RGBA_ASTC_8x6_Format:zu,RGBA_ASTC_8x8_Format:ku,RGBA_BPTC_Format:Ia,RGBA_ETC2_EAC_Format:Lu,RGBA_PVRTC_2BPPV1_Format:Ru,RGBA_PVRTC_4BPPV1_Format:Cu,RGBA_S3TC_DXT1_Format:Ca,RGBA_S3TC_DXT3_Format:Ra,RGBA_S3TC_DXT5_Format:Pa,RGBDepthPacking:TS,RGBFormat:Ap,RGBIntegerFormat:wS,RGB_BPTC_SIGNED_Format:Yu,RGB_BPTC_UNSIGNED_Format:ju,RGB_ETC1_Format:Pu,RGB_ETC2_Format:Iu,RGB_PVRTC_2BPPV1_Format:Tu,RGB_PVRTC_4BPPV1_Format:bu,RGB_S3TC_DXT1_Format:Ta,RGDepthPacking:CS,RGFormat:Cp,RGIntegerFormat:hh,RawShaderMaterial:_x,Ray:Uo,Raycaster:Wx,Rec709Primaries:Va,RectAreaLight:Ox,RedFormat:uh,RedIntegerFormat:il,ReinhardToneMapping:y_,RenderTarget:V_,RepeatWrapping:Oa,ReplaceStencilOp:PS,ReverseSubtractEquation:t_,RingGeometry:Ih,SIGNED_RED_GREEN_RGTC2_Format:Ku,SIGNED_RED_RGTC1_Format:Zu,SRGBColorSpace:_i,SRGBTransfer:kt,Scene:$u,ShaderChunk:mt,ShaderLib:Ti,ShaderMaterial:ai,ShadowMaterial:vx,Shape:ws,ShapeGeometry:Lh,ShapePath:SC,ShapeUtils:ji,ShortType:Mp,Skeleton:yh,SkeletonHelper:lC,SkinnedMesh:rx,Source:vs,Sphere:vn,SphereGeometry:hl,Spherical:rC,SphericalHarmonics3:Bx,SplineCurve:jp,SpotLight:Dx,SpotLightHelper:aC,Sprite:nx,SpriteMaterial:kp,SrcAlphaFactor:vu,SrcAlphaSaturateFactor:f_,SrcColorFactor:o_,StaticCopyUsage:jS,StaticDrawUsage:Wa,StaticReadUsage:XS,StereoCamera:OT,StreamCopyUsage:JS,StreamDrawUsage:WS,StreamReadUsage:YS,StringKeyframeTrack:Ls,SubtractEquation:e_,SubtractiveBlending:$d,TOUCH:vS,TangentSpaceNormalMap:Vr,TetrahedronGeometry:Dh,Texture:Yt,TextureLoader:RT,TextureUtils:Sb,TorusGeometry:Uh,TorusKnotGeometry:Nh,Triangle:Yn,TriangleFanDrawMode:bS,TriangleStripDrawMode:AS,TrianglesDrawMode:ES,TubeGeometry:Fh,UVMapping:oh,Uint16BufferAttribute:Up,Uint32BufferAttribute:Np,Uint8BufferAttribute:UM,Uint8ClampedBufferAttribute:NM,Uniform:om,UniformsGroup:nC,UniformsLib:Re,UniformsUtils:Ya,UnsignedByteType:Ri,UnsignedInt248Type:bs,UnsignedInt5999Type:wp,UnsignedIntType:gr,UnsignedShort4444Type:lh,UnsignedShort5551Type:ch,UnsignedShortType:Ao,VSMShadowMap:bi,Vector2:ge,Vector3:D,Vector4:xt,VectorKeyframeTrack:$a,VideoTexture:Hb,WebGL3DRenderTarget:MM,WebGLArrayRenderTarget:SM,WebGLCoordinateSystem:Xi,WebGLCubeRenderTarget:q_,WebGLMultipleRenderTargets:wC,WebGLRenderTarget:Pi,WebGLRenderer:ex,WebGLUtils:Q_,WebGPUCoordinateSystem:Xa,WireframeGeometry:Zp,WrapAroundEnding:ka,ZeroCurvatureEnding:ms,ZeroFactor:r_,ZeroSlopeEnding:gs,ZeroStencilOp:RS,createCanvasElement:k_},Symbol.toStringTag,{value:"Module"}));var Yx={exports:{}},Ds={};/**
 * @license React
 * react-reconciler-constants.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */Ds.ConcurrentRoot=1;Ds.ContinuousEventPriority=4;Ds.DefaultEventPriority=16;Ds.DiscreteEventPriority=1;Ds.IdleEventPriority=536870912;Ds.LegacyRoot=0;Yx.exports=Ds;var wo=Yx.exports;function AC(r){let e;const t=new Set,n=(h,f)=>{const p=typeof h=="function"?h(e):h;if(p!==e){const m=e;e=f?p:Object.assign({},e,p),t.forEach(v=>v(e,m))}},i=()=>e,s=(h,f=i,p=Object.is)=>{console.warn("[DEPRECATED] Please use `subscribeWithSelector` middleware");let m=f(e);function v(){const x=f(e);if(!p(m,x)){const M=m;h(m=x,M)}}return t.add(v),()=>t.delete(v)},u={setState:n,getState:i,subscribe:(h,f,p)=>f||p?s(h,f,p):(t.add(h),()=>t.delete(h)),destroy:()=>t.clear()};return e=r(n,i,u),u}const bC=typeof window>"u"||!window.navigator||/ServerSideRendering|^Deno\//.test(window.navigator.userAgent),Mv=bC?ae.useEffect:ae.useLayoutEffect;function TC(r){const e=typeof r=="function"?AC(r):r,t=(n=e.getState,i=Object.is)=>{const[,s]=ae.useReducer(y=>y+1,0),a=e.getState(),c=ae.useRef(a),u=ae.useRef(n),h=ae.useRef(i),f=ae.useRef(!1),p=ae.useRef();p.current===void 0&&(p.current=n(a));let m,v=!1;(c.current!==a||u.current!==n||h.current!==i||f.current)&&(m=n(a),v=!i(p.current,m)),Mv(()=>{v&&(p.current=m),c.current=a,u.current=n,h.current=i,f.current=!1});const x=ae.useRef(a);Mv(()=>{const y=()=>{try{const E=e.getState(),w=u.current(E);h.current(p.current,w)||(c.current=E,p.current=w,s())}catch{f.current=!0,s()}},_=e.subscribe(y);return e.getState()!==x.current&&y(),_},[]);const M=v?m:p.current;return ae.useDebugValue(M),M};return Object.assign(t,e),t[Symbol.iterator]=function(){console.warn("[useStore, api] = create() is deprecated and will be removed in v4");const n=[t,e];return{next(){const i=n.length<=0;return{value:n.shift(),done:i}}}},t}var jx={exports:{}},Fd={exports:{}},Od={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var wv;function CC(){return wv||(wv=1,function(r){function e(O,J){var q=O.length;O.push(J);e:for(;0<q;){var re=q-1>>>1,xe=O[re];if(0<i(xe,J))O[re]=J,O[q]=xe,q=re;else break e}}function t(O){return O.length===0?null:O[0]}function n(O){if(O.length===0)return null;var J=O[0],q=O.pop();if(q!==J){O[0]=q;e:for(var re=0,xe=O.length,Pe=xe>>>1;re<Pe;){var ie=2*(re+1)-1,me=O[ie],be=ie+1,Se=O[be];if(0>i(me,q))be<xe&&0>i(Se,me)?(O[re]=Se,O[be]=q,re=be):(O[re]=me,O[ie]=q,re=ie);else if(be<xe&&0>i(Se,q))O[re]=Se,O[be]=q,re=be;else break e}}return J}function i(O,J){var q=O.sortIndex-J.sortIndex;return q!==0?q:O.id-J.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;r.unstable_now=function(){return s.now()}}else{var a=Date,c=a.now();r.unstable_now=function(){return a.now()-c}}var u=[],h=[],f=1,p=null,m=3,v=!1,x=!1,M=!1,y=typeof setTimeout=="function"?setTimeout:null,_=typeof clearTimeout=="function"?clearTimeout:null,E=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function w(O){for(var J=t(h);J!==null;){if(J.callback===null)n(h);else if(J.startTime<=O)n(h),J.sortIndex=J.expirationTime,e(u,J);else break;J=t(h)}}function T(O){if(M=!1,w(O),!x)if(t(u)!==null)x=!0,K(U);else{var J=t(h);J!==null&&fe(T,J.startTime-O)}}function U(O,J){x=!1,M&&(M=!1,_(B),B=-1),v=!0;var q=m;try{for(w(J),p=t(u);p!==null&&(!(p.expirationTime>J)||O&&!C());){var re=p.callback;if(typeof re=="function"){p.callback=null,m=p.priorityLevel;var xe=re(p.expirationTime<=J);J=r.unstable_now(),typeof xe=="function"?p.callback=xe:p===t(u)&&n(u),w(J)}else n(u);p=t(u)}if(p!==null)var Pe=!0;else{var ie=t(h);ie!==null&&fe(T,ie.startTime-J),Pe=!1}return Pe}finally{p=null,m=q,v=!1}}var P=!1,I=null,B=-1,k=5,b=-1;function C(){return!(r.unstable_now()-b<k)}function G(){if(I!==null){var O=r.unstable_now();b=O;var J=!0;try{J=I(!0,O)}finally{J?Z():(P=!1,I=null)}}else P=!1}var Z;if(typeof E=="function")Z=function(){E(G)};else if(typeof MessageChannel<"u"){var $=new MessageChannel,oe=$.port2;$.port1.onmessage=G,Z=function(){oe.postMessage(null)}}else Z=function(){y(G,0)};function K(O){I=O,P||(P=!0,Z())}function fe(O,J){B=y(function(){O(r.unstable_now())},J)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(O){O.callback=null},r.unstable_continueExecution=function(){x||v||(x=!0,K(U))},r.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):k=0<O?Math.floor(1e3/O):5},r.unstable_getCurrentPriorityLevel=function(){return m},r.unstable_getFirstCallbackNode=function(){return t(u)},r.unstable_next=function(O){switch(m){case 1:case 2:case 3:var J=3;break;default:J=m}var q=m;m=J;try{return O()}finally{m=q}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(O,J){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var q=m;m=O;try{return J()}finally{m=q}},r.unstable_scheduleCallback=function(O,J,q){var re=r.unstable_now();switch(typeof q=="object"&&q!==null?(q=q.delay,q=typeof q=="number"&&0<q?re+q:re):q=re,O){case 1:var xe=-1;break;case 2:xe=250;break;case 5:xe=1073741823;break;case 4:xe=1e4;break;default:xe=5e3}return xe=q+xe,O={id:f++,callback:J,priorityLevel:O,startTime:q,expirationTime:xe,sortIndex:-1},q>re?(O.sortIndex=q,e(h,O),t(u)===null&&O===t(h)&&(M?(_(B),B=-1):M=!0,fe(T,q-re))):(O.sortIndex=xe,e(u,O),x||v||(x=!0,K(U))),O},r.unstable_shouldYield=C,r.unstable_wrapCallback=function(O){var J=m;return function(){var q=m;m=J;try{return O.apply(this,arguments)}finally{m=q}}}}(Od)),Od}var Ev;function RC(){return Ev||(Ev=1,Fd.exports=CC()),Fd.exports}/**
 * @license React
 * react-reconciler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var PC=function(e){var t={},n=ae,i=RC(),s=Object.assign;function a(o){for(var l="https://reactjs.org/docs/error-decoder.html?invariant="+o,d=1;d<arguments.length;d++)l+="&args[]="+encodeURIComponent(arguments[d]);return"Minified React error #"+o+"; visit "+l+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var c=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,u=Symbol.for("react.element"),h=Symbol.for("react.portal"),f=Symbol.for("react.fragment"),p=Symbol.for("react.strict_mode"),m=Symbol.for("react.profiler"),v=Symbol.for("react.provider"),x=Symbol.for("react.context"),M=Symbol.for("react.forward_ref"),y=Symbol.for("react.suspense"),_=Symbol.for("react.suspense_list"),E=Symbol.for("react.memo"),w=Symbol.for("react.lazy"),T=Symbol.for("react.offscreen"),U=Symbol.iterator;function P(o){return o===null||typeof o!="object"?null:(o=U&&o[U]||o["@@iterator"],typeof o=="function"?o:null)}function I(o){if(o==null)return null;if(typeof o=="function")return o.displayName||o.name||null;if(typeof o=="string")return o;switch(o){case f:return"Fragment";case h:return"Portal";case m:return"Profiler";case p:return"StrictMode";case y:return"Suspense";case _:return"SuspenseList"}if(typeof o=="object")switch(o.$$typeof){case x:return(o.displayName||"Context")+".Consumer";case v:return(o._context.displayName||"Context")+".Provider";case M:var l=o.render;return o=o.displayName,o||(o=l.displayName||l.name||"",o=o!==""?"ForwardRef("+o+")":"ForwardRef"),o;case E:return l=o.displayName||null,l!==null?l:I(o.type)||"Memo";case w:l=o._payload,o=o._init;try{return I(o(l))}catch{}}return null}function B(o){var l=o.type;switch(o.tag){case 24:return"Cache";case 9:return(l.displayName||"Context")+".Consumer";case 10:return(l._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return o=l.render,o=o.displayName||o.name||"",l.displayName||(o!==""?"ForwardRef("+o+")":"ForwardRef");case 7:return"Fragment";case 5:return l;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return I(l);case 8:return l===p?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof l=="function")return l.displayName||l.name||null;if(typeof l=="string")return l}return null}function k(o){var l=o,d=o;if(o.alternate)for(;l.return;)l=l.return;else{o=l;do l=o,l.flags&4098&&(d=l.return),o=l.return;while(o)}return l.tag===3?d:null}function b(o){if(k(o)!==o)throw Error(a(188))}function C(o){var l=o.alternate;if(!l){if(l=k(o),l===null)throw Error(a(188));return l!==o?null:o}for(var d=o,g=l;;){var S=d.return;if(S===null)break;var A=S.alternate;if(A===null){if(g=S.return,g!==null){d=g;continue}break}if(S.child===A.child){for(A=S.child;A;){if(A===d)return b(S),o;if(A===g)return b(S),l;A=A.sibling}throw Error(a(188))}if(d.return!==g.return)d=S,g=A;else{for(var z=!1,H=S.child;H;){if(H===d){z=!0,d=S,g=A;break}if(H===g){z=!0,g=S,d=A;break}H=H.sibling}if(!z){for(H=A.child;H;){if(H===d){z=!0,d=A,g=S;break}if(H===g){z=!0,g=A,d=S;break}H=H.sibling}if(!z)throw Error(a(189))}}if(d.alternate!==g)throw Error(a(190))}if(d.tag!==3)throw Error(a(188));return d.stateNode.current===d?o:l}function G(o){return o=C(o),o!==null?Z(o):null}function Z(o){if(o.tag===5||o.tag===6)return o;for(o=o.child;o!==null;){var l=Z(o);if(l!==null)return l;o=o.sibling}return null}function $(o){if(o.tag===5||o.tag===6)return o;for(o=o.child;o!==null;){if(o.tag!==4){var l=$(o);if(l!==null)return l}o=o.sibling}return null}var oe=Array.isArray,K=e.getPublicInstance,fe=e.getRootHostContext,O=e.getChildHostContext,J=e.prepareForCommit,q=e.resetAfterCommit,re=e.createInstance,xe=e.appendInitialChild,Pe=e.finalizeInitialChildren,ie=e.prepareUpdate,me=e.shouldSetTextContent,be=e.createTextInstance,Se=e.scheduleTimeout,tt=e.cancelTimeout,nt=e.noTimeout,Ze=e.isPrimaryRenderer,Ie=e.supportsMutation,de=e.supportsPersistence,N=e.supportsHydration,Te=e.getInstanceFromNode,we=e.preparePortalMount,_e=e.getCurrentEventPriority,Ee=e.detachDeletedInstance,Je=e.supportsMicrotasks,De=e.scheduleMicrotask,F=e.supportsTestSelectors,R=e.findFiberRoot,Q=e.getBoundingRect,ue=e.getTextContent,pe=e.isHiddenSubtree,he=e.matchAccessibilityRole,Ye=e.setFocusIfFocusable,Ce=e.setupIntersectionObserver,ke=e.appendChild,Mt=e.appendChildToContainer,ye=e.commitTextUpdate,He=e.commitMount,at=e.commitUpdate,lt=e.insertBefore,Ve=e.insertInContainerBefore,wt=e.removeChild,ut=e.removeChildFromContainer,Ft=e.resetTextContent,V=e.hideInstance,Be=e.hideTextInstance,le=e.unhideInstance,ve=e.unhideTextInstance,Fe=e.clearContainer,ze=e.cloneInstance,Et=e.createContainerChildSet,Wt=e.appendChildToContainerChildSet,En=e.finalizeContainerChildren,At=e.replaceContainerChildren,_n=e.cloneHiddenInstance,li=e.cloneHiddenTextInstance,vl=e.canHydrateInstance,_l=e.canHydrateTextInstance,Ki=e.canHydrateSuspenseInstance,Us=e.isSuspenseInstancePending,Ns=e.isSuspenseInstanceFallback,xl=e.registerSuspenseInstanceRetry,Di=e.getNextHydratableSibling,yl=e.getFirstHydratableChild,Fs=e.getFirstHydratableChildWithinContainer,Sl=e.getFirstHydratableChildWithinSuspenseInstance,Ml=e.hydrateInstance,Bh=e.hydrateTextInstance,zh=e.hydrateSuspenseInstance,kh=e.getNextHydratableInstanceAfterSuspenseInstance,L=e.commitHydratedContainer,W=e.commitHydratedSuspenseInstance,te=e.clearSuspenseBoundary,ne=e.clearSuspenseBoundaryFromContainer,Y=e.shouldDeleteUnhydratedTailInstances,Ae=e.didNotMatchHydratedContainerTextInstance,Oe=e.didNotMatchHydratedTextInstance,Ge;function We(o){if(Ge===void 0)try{throw Error()}catch(d){var l=d.stack.trim().match(/\n( *(at )?)/);Ge=l&&l[1]||""}return`
`+Ge+o}var st=!1;function ot(o,l){if(!o||st)return"";st=!0;var d=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(l)if(l=function(){throw Error()},Object.defineProperty(l.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(l,[])}catch(Me){var g=Me}Reflect.construct(o,[],l)}else{try{l.call()}catch(Me){g=Me}o.call(l.prototype)}else{try{throw Error()}catch(Me){g=Me}o()}}catch(Me){if(Me&&g&&typeof Me.stack=="string"){for(var S=Me.stack.split(`
`),A=g.stack.split(`
`),z=S.length-1,H=A.length-1;1<=z&&0<=H&&S[z]!==A[H];)H--;for(;1<=z&&0<=H;z--,H--)if(S[z]!==A[H]){if(z!==1||H!==1)do if(z--,H--,0>H||S[z]!==A[H]){var ce=`
`+S[z].replace(" at new "," at ");return o.displayName&&ce.includes("<anonymous>")&&(ce=ce.replace("<anonymous>",o.displayName)),ce}while(1<=z&&0<=H);break}}}finally{st=!1,Error.prepareStackTrace=d}return(o=o?o.displayName||o.name:"")?We(o):""}var Ke=Object.prototype.hasOwnProperty,Ct=[],Pt=-1;function Nt(o){return{current:o}}function yt(o){0>Pt||(o.current=Ct[Pt],Ct[Pt]=null,Pt--)}function $e(o,l){Pt++,Ct[Pt]=o.current,o.current=l}var qe={},bt=Nt(qe),ct=Nt(!1),an=qe;function Kn(o,l){var d=o.type.contextTypes;if(!d)return qe;var g=o.stateNode;if(g&&g.__reactInternalMemoizedUnmaskedChildContext===l)return g.__reactInternalMemoizedMaskedChildContext;var S={},A;for(A in d)S[A]=l[A];return g&&(o=o.stateNode,o.__reactInternalMemoizedUnmaskedChildContext=l,o.__reactInternalMemoizedMaskedChildContext=S),S}function Ot(o){return o=o.childContextTypes,o!=null}function yr(){yt(ct),yt(bt)}function Vt(o,l,d){if(bt.current!==qe)throw Error(a(168));$e(bt,l),$e(ct,d)}function yi(o,l,d){var g=o.stateNode;if(l=l.childContextTypes,typeof g.getChildContext!="function")return d;g=g.getChildContext();for(var S in g)if(!(S in l))throw Error(a(108,B(o)||"Unknown",S));return s({},d,g)}function Sr(o){return o=(o=o.stateNode)&&o.__reactInternalMemoizedMergedChildContext||qe,an=bt.current,$e(bt,o),$e(ct,ct.current),!0}function Dn(o,l,d){var g=o.stateNode;if(!g)throw Error(a(169));d?(o=yi(o,l,an),g.__reactInternalMemoizedMergedChildContext=o,yt(ct),yt(bt),$e(bt,o)):yt(ct),$e(ct,d)}var Un=Math.clz32?Math.clz32:wy,Hh=Math.log,wl=Math.LN2;function wy(o){return o>>>=0,o===0?32:31-(Hh(o)/wl|0)|0}var El=64,Al=4194304;function zo(o){switch(o&-o){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return o&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return o&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return o}}function bl(o,l){var d=o.pendingLanes;if(d===0)return 0;var g=0,S=o.suspendedLanes,A=o.pingedLanes,z=d&268435455;if(z!==0){var H=z&~S;H!==0?g=zo(H):(A&=z,A!==0&&(g=zo(A)))}else z=d&~S,z!==0?g=zo(z):A!==0&&(g=zo(A));if(g===0)return 0;if(l!==0&&l!==g&&!(l&S)&&(S=g&-g,A=l&-l,S>=A||S===16&&(A&4194240)!==0))return l;if(g&4&&(g|=d&16),l=o.entangledLanes,l!==0)for(o=o.entanglements,l&=g;0<l;)d=31-Un(l),S=1<<d,g|=o[d],l&=~S;return g}function Ey(o,l){switch(o){case 1:case 2:case 4:return l+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return l+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ay(o,l){for(var d=o.suspendedLanes,g=o.pingedLanes,S=o.expirationTimes,A=o.pendingLanes;0<A;){var z=31-Un(A),H=1<<z,ce=S[z];ce===-1?(!(H&d)||H&g)&&(S[z]=Ey(H,l)):ce<=l&&(o.expiredLanes|=H),A&=~H}}function Vh(o){return o=o.pendingLanes&-1073741825,o!==0?o:o&1073741824?1073741824:0}function Gh(o){for(var l=[],d=0;31>d;d++)l.push(o);return l}function ko(o,l,d){o.pendingLanes|=l,l!==536870912&&(o.suspendedLanes=0,o.pingedLanes=0),o=o.eventTimes,l=31-Un(l),o[l]=d}function by(o,l){var d=o.pendingLanes&~l;o.pendingLanes=l,o.suspendedLanes=0,o.pingedLanes=0,o.expiredLanes&=l,o.mutableReadLanes&=l,o.entangledLanes&=l,l=o.entanglements;var g=o.eventTimes;for(o=o.expirationTimes;0<d;){var S=31-Un(d),A=1<<S;l[S]=0,g[S]=-1,o[S]=-1,d&=~A}}function Wh(o,l){var d=o.entangledLanes|=l;for(o=o.entanglements;d;){var g=31-Un(d),S=1<<g;S&l|o[g]&l&&(o[g]|=l),d&=~S}}var It=0;function dm(o){return o&=-o,1<o?4<o?o&268435455?16:536870912:4:1}var Xh=i.unstable_scheduleCallback,pm=i.unstable_cancelCallback,Ty=i.unstable_shouldYield,Cy=i.unstable_requestPaint,hn=i.unstable_now,qh=i.unstable_ImmediatePriority,Ry=i.unstable_UserBlockingPriority,Yh=i.unstable_NormalPriority,Py=i.unstable_IdlePriority,Tl=null,Ui=null;function Iy(o){if(Ui&&typeof Ui.onCommitFiberRoot=="function")try{Ui.onCommitFiberRoot(Tl,o,void 0,(o.current.flags&128)===128)}catch{}}function Ly(o,l){return o===l&&(o!==0||1/o===1/l)||o!==o&&l!==l}var Ni=typeof Object.is=="function"?Object.is:Ly,Qi=null,Cl=!1,jh=!1;function mm(o){Qi===null?Qi=[o]:Qi.push(o)}function Dy(o){Cl=!0,mm(o)}function Fi(){if(!jh&&Qi!==null){jh=!0;var o=0,l=It;try{var d=Qi;for(It=1;o<d.length;o++){var g=d[o];do g=g(!0);while(g!==null)}Qi=null,Cl=!1}catch(S){throw Qi!==null&&(Qi=Qi.slice(o+1)),Xh(qh,Fi),S}finally{It=l,jh=!1}}return null}var Uy=c.ReactCurrentBatchConfig;function Rl(o,l){if(Ni(o,l))return!0;if(typeof o!="object"||o===null||typeof l!="object"||l===null)return!1;var d=Object.keys(o),g=Object.keys(l);if(d.length!==g.length)return!1;for(g=0;g<d.length;g++){var S=d[g];if(!Ke.call(l,S)||!Ni(o[S],l[S]))return!1}return!0}function Ny(o){switch(o.tag){case 5:return We(o.type);case 16:return We("Lazy");case 13:return We("Suspense");case 19:return We("SuspenseList");case 0:case 2:case 15:return o=ot(o.type,!1),o;case 11:return o=ot(o.type.render,!1),o;case 1:return o=ot(o.type,!0),o;default:return""}}function Si(o,l){if(o&&o.defaultProps){l=s({},l),o=o.defaultProps;for(var d in o)l[d]===void 0&&(l[d]=o[d]);return l}return l}var Pl=Nt(null),Il=null,Os=null,Zh=null;function Jh(){Zh=Os=Il=null}function gm(o,l,d){Ze?($e(Pl,l._currentValue),l._currentValue=d):($e(Pl,l._currentValue2),l._currentValue2=d)}function Kh(o){var l=Pl.current;yt(Pl),Ze?o._currentValue=l:o._currentValue2=l}function Qh(o,l,d){for(;o!==null;){var g=o.alternate;if((o.childLanes&l)!==l?(o.childLanes|=l,g!==null&&(g.childLanes|=l)):g!==null&&(g.childLanes&l)!==l&&(g.childLanes|=l),o===d)break;o=o.return}}function Bs(o,l){Il=o,Zh=Os=null,o=o.dependencies,o!==null&&o.firstContext!==null&&(o.lanes&l&&(ei=!0),o.firstContext=null)}function ci(o){var l=Ze?o._currentValue:o._currentValue2;if(Zh!==o)if(o={context:o,memoizedValue:l,next:null},Os===null){if(Il===null)throw Error(a(308));Os=o,Il.dependencies={lanes:0,firstContext:o}}else Os=Os.next=o;return l}var Oi=null,Mr=!1;function $h(o){o.updateQueue={baseState:o.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function vm(o,l){o=o.updateQueue,l.updateQueue===o&&(l.updateQueue={baseState:o.baseState,firstBaseUpdate:o.firstBaseUpdate,lastBaseUpdate:o.lastBaseUpdate,shared:o.shared,effects:o.effects})}function $i(o,l){return{eventTime:o,lane:l,tag:0,payload:null,callback:null,next:null}}function wr(o,l){var d=o.updateQueue;d!==null&&(d=d.shared,tn!==null&&o.mode&1&&!(St&2)?(o=d.interleaved,o===null?(l.next=l,Oi===null?Oi=[d]:Oi.push(d)):(l.next=o.next,o.next=l),d.interleaved=l):(o=d.pending,o===null?l.next=l:(l.next=o.next,o.next=l),d.pending=l))}function Ll(o,l,d){if(l=l.updateQueue,l!==null&&(l=l.shared,(d&4194240)!==0)){var g=l.lanes;g&=o.pendingLanes,d|=g,l.lanes=d,Wh(o,d)}}function _m(o,l){var d=o.updateQueue,g=o.alternate;if(g!==null&&(g=g.updateQueue,d===g)){var S=null,A=null;if(d=d.firstBaseUpdate,d!==null){do{var z={eventTime:d.eventTime,lane:d.lane,tag:d.tag,payload:d.payload,callback:d.callback,next:null};A===null?S=A=z:A=A.next=z,d=d.next}while(d!==null);A===null?S=A=l:A=A.next=l}else S=A=l;d={baseState:g.baseState,firstBaseUpdate:S,lastBaseUpdate:A,shared:g.shared,effects:g.effects},o.updateQueue=d;return}o=d.lastBaseUpdate,o===null?d.firstBaseUpdate=l:o.next=l,d.lastBaseUpdate=l}function Dl(o,l,d,g){var S=o.updateQueue;Mr=!1;var A=S.firstBaseUpdate,z=S.lastBaseUpdate,H=S.shared.pending;if(H!==null){S.shared.pending=null;var ce=H,Me=ce.next;ce.next=null,z===null?A=Me:z.next=Me,z=ce;var Xe=o.alternate;Xe!==null&&(Xe=Xe.updateQueue,H=Xe.lastBaseUpdate,H!==z&&(H===null?Xe.firstBaseUpdate=Me:H.next=Me,Xe.lastBaseUpdate=ce))}if(A!==null){var ht=S.baseState;z=0,Xe=Me=ce=null,H=A;do{var it=H.lane,zt=H.eventTime;if((g&it)===it){Xe!==null&&(Xe=Xe.next={eventTime:zt,lane:0,tag:H.tag,payload:H.payload,callback:H.callback,next:null});e:{var et=o,Cn=H;switch(it=l,zt=d,Cn.tag){case 1:if(et=Cn.payload,typeof et=="function"){ht=et.call(zt,ht,it);break e}ht=et;break e;case 3:et.flags=et.flags&-65537|128;case 0:if(et=Cn.payload,it=typeof et=="function"?et.call(zt,ht,it):et,it==null)break e;ht=s({},ht,it);break e;case 2:Mr=!0}}H.callback!==null&&H.lane!==0&&(o.flags|=64,it=S.effects,it===null?S.effects=[H]:it.push(H))}else zt={eventTime:zt,lane:it,tag:H.tag,payload:H.payload,callback:H.callback,next:null},Xe===null?(Me=Xe=zt,ce=ht):Xe=Xe.next=zt,z|=it;if(H=H.next,H===null){if(H=S.shared.pending,H===null)break;it=H,H=it.next,it.next=null,S.lastBaseUpdate=it,S.shared.pending=null}}while(!0);if(Xe===null&&(ce=ht),S.baseState=ce,S.firstBaseUpdate=Me,S.lastBaseUpdate=Xe,l=S.shared.interleaved,l!==null){S=l;do z|=S.lane,S=S.next;while(S!==l)}else A===null&&(S.shared.lanes=0);Ys|=z,o.lanes=z,o.memoizedState=ht}}function xm(o,l,d){if(o=l.effects,l.effects=null,o!==null)for(l=0;l<o.length;l++){var g=o[l],S=g.callback;if(S!==null){if(g.callback=null,g=d,typeof S!="function")throw Error(a(191,S));S.call(g)}}}var ym=new n.Component().refs;function ef(o,l,d,g){l=o.memoizedState,d=d(g,l),d=d==null?l:s({},l,d),o.memoizedState=d,o.lanes===0&&(o.updateQueue.baseState=d)}var Ul={isMounted:function(o){return(o=o._reactInternals)?k(o)===o:!1},enqueueSetState:function(o,l,d){o=o._reactInternals;var g=Fn(),S=br(o),A=$i(g,S);A.payload=l,d!=null&&(A.callback=d),wr(o,A),l=pi(o,S,g),l!==null&&Ll(l,o,S)},enqueueReplaceState:function(o,l,d){o=o._reactInternals;var g=Fn(),S=br(o),A=$i(g,S);A.tag=1,A.payload=l,d!=null&&(A.callback=d),wr(o,A),l=pi(o,S,g),l!==null&&Ll(l,o,S)},enqueueForceUpdate:function(o,l){o=o._reactInternals;var d=Fn(),g=br(o),S=$i(d,g);S.tag=2,l!=null&&(S.callback=l),wr(o,S),l=pi(o,g,d),l!==null&&Ll(l,o,g)}};function Sm(o,l,d,g,S,A,z){return o=o.stateNode,typeof o.shouldComponentUpdate=="function"?o.shouldComponentUpdate(g,A,z):l.prototype&&l.prototype.isPureReactComponent?!Rl(d,g)||!Rl(S,A):!0}function Mm(o,l,d){var g=!1,S=qe,A=l.contextType;return typeof A=="object"&&A!==null?A=ci(A):(S=Ot(l)?an:bt.current,g=l.contextTypes,A=(g=g!=null)?Kn(o,S):qe),l=new l(d,A),o.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,l.updater=Ul,o.stateNode=l,l._reactInternals=o,g&&(o=o.stateNode,o.__reactInternalMemoizedUnmaskedChildContext=S,o.__reactInternalMemoizedMaskedChildContext=A),l}function wm(o,l,d,g){o=l.state,typeof l.componentWillReceiveProps=="function"&&l.componentWillReceiveProps(d,g),typeof l.UNSAFE_componentWillReceiveProps=="function"&&l.UNSAFE_componentWillReceiveProps(d,g),l.state!==o&&Ul.enqueueReplaceState(l,l.state,null)}function tf(o,l,d,g){var S=o.stateNode;S.props=d,S.state=o.memoizedState,S.refs=ym,$h(o);var A=l.contextType;typeof A=="object"&&A!==null?S.context=ci(A):(A=Ot(l)?an:bt.current,S.context=Kn(o,A)),S.state=o.memoizedState,A=l.getDerivedStateFromProps,typeof A=="function"&&(ef(o,l,A,d),S.state=o.memoizedState),typeof l.getDerivedStateFromProps=="function"||typeof S.getSnapshotBeforeUpdate=="function"||typeof S.UNSAFE_componentWillMount!="function"&&typeof S.componentWillMount!="function"||(l=S.state,typeof S.componentWillMount=="function"&&S.componentWillMount(),typeof S.UNSAFE_componentWillMount=="function"&&S.UNSAFE_componentWillMount(),l!==S.state&&Ul.enqueueReplaceState(S,S.state,null),Dl(o,d,S,g),S.state=o.memoizedState),typeof S.componentDidMount=="function"&&(o.flags|=4194308)}var zs=[],ks=0,Nl=null,Fl=0,ui=[],hi=0,Xr=null,er=1,tr="";function qr(o,l){zs[ks++]=Fl,zs[ks++]=Nl,Nl=o,Fl=l}function Em(o,l,d){ui[hi++]=er,ui[hi++]=tr,ui[hi++]=Xr,Xr=o;var g=er;o=tr;var S=32-Un(g)-1;g&=~(1<<S),d+=1;var A=32-Un(l)+S;if(30<A){var z=S-S%5;A=(g&(1<<z)-1).toString(32),g>>=z,S-=z,er=1<<32-Un(l)+S|d<<S|g,tr=A+o}else er=1<<A|d<<S|g,tr=o}function nf(o){o.return!==null&&(qr(o,1),Em(o,1,0))}function rf(o){for(;o===Nl;)Nl=zs[--ks],zs[ks]=null,Fl=zs[--ks],zs[ks]=null;for(;o===Xr;)Xr=ui[--hi],ui[hi]=null,tr=ui[--hi],ui[hi]=null,er=ui[--hi],ui[hi]=null}var Qn=null,$n=null,Gt=!1,Ho=!1,Mi=null;function Am(o,l){var d=mi(5,null,null,0);d.elementType="DELETED",d.stateNode=l,d.return=o,l=o.deletions,l===null?(o.deletions=[d],o.flags|=16):l.push(d)}function bm(o,l){switch(o.tag){case 5:return l=vl(l,o.type,o.pendingProps),l!==null?(o.stateNode=l,Qn=o,$n=yl(l),!0):!1;case 6:return l=_l(l,o.pendingProps),l!==null?(o.stateNode=l,Qn=o,$n=null,!0):!1;case 13:if(l=Ki(l),l!==null){var d=Xr!==null?{id:er,overflow:tr}:null;return o.memoizedState={dehydrated:l,treeContext:d,retryLane:1073741824},d=mi(18,null,null,0),d.stateNode=l,d.return=o,o.child=d,Qn=o,$n=null,!0}return!1;default:return!1}}function sf(o){return(o.mode&1)!==0&&(o.flags&128)===0}function of(o){if(Gt){var l=$n;if(l){var d=l;if(!bm(o,l)){if(sf(o))throw Error(a(418));l=Di(d);var g=Qn;l&&bm(o,l)?Am(g,d):(o.flags=o.flags&-4097|2,Gt=!1,Qn=o)}}else{if(sf(o))throw Error(a(418));o.flags=o.flags&-4097|2,Gt=!1,Qn=o}}}function Tm(o){for(o=o.return;o!==null&&o.tag!==5&&o.tag!==3&&o.tag!==13;)o=o.return;Qn=o}function Vo(o){if(!N||o!==Qn)return!1;if(!Gt)return Tm(o),Gt=!0,!1;if(o.tag!==3&&(o.tag!==5||Y(o.type)&&!me(o.type,o.memoizedProps))){var l=$n;if(l){if(sf(o)){for(o=$n;o;)o=Di(o);throw Error(a(418))}for(;l;)Am(o,l),l=Di(l)}}if(Tm(o),o.tag===13){if(!N)throw Error(a(316));if(o=o.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(a(317));$n=kh(o)}else $n=Qn?Di(o.stateNode):null;return!0}function Hs(){N&&($n=Qn=null,Ho=Gt=!1)}function af(o){Mi===null?Mi=[o]:Mi.push(o)}function Go(o,l,d){if(o=d.ref,o!==null&&typeof o!="function"&&typeof o!="object"){if(d._owner){if(d=d._owner,d){if(d.tag!==1)throw Error(a(309));var g=d.stateNode}if(!g)throw Error(a(147,o));var S=g,A=""+o;return l!==null&&l.ref!==null&&typeof l.ref=="function"&&l.ref._stringRef===A?l.ref:(l=function(z){var H=S.refs;H===ym&&(H=S.refs={}),z===null?delete H[A]:H[A]=z},l._stringRef=A,l)}if(typeof o!="string")throw Error(a(284));if(!d._owner)throw Error(a(290,o))}return o}function Ol(o,l){throw o=Object.prototype.toString.call(l),Error(a(31,o==="[object Object]"?"object with keys {"+Object.keys(l).join(", ")+"}":o))}function Cm(o){var l=o._init;return l(o._payload)}function Rm(o){function l(ee,X){if(o){var se=ee.deletions;se===null?(ee.deletions=[X],ee.flags|=16):se.push(X)}}function d(ee,X){if(!o)return null;for(;X!==null;)l(ee,X),X=X.sibling;return null}function g(ee,X){for(ee=new Map;X!==null;)X.key!==null?ee.set(X.key,X):ee.set(X.index,X),X=X.sibling;return ee}function S(ee,X){return ee=Cr(ee,X),ee.index=0,ee.sibling=null,ee}function A(ee,X,se){return ee.index=se,o?(se=ee.alternate,se!==null?(se=se.index,se<X?(ee.flags|=2,X):se):(ee.flags|=2,X)):(ee.flags|=1048576,X)}function z(ee){return o&&ee.alternate===null&&(ee.flags|=2),ee}function H(ee,X,se,Ne){return X===null||X.tag!==6?(X=Wf(se,ee.mode,Ne),X.return=ee,X):(X=S(X,se),X.return=ee,X)}function ce(ee,X,se,Ne){var Qe=se.type;return Qe===f?Xe(ee,X,se.props.children,Ne,se.key):X!==null&&(X.elementType===Qe||typeof Qe=="object"&&Qe!==null&&Qe.$$typeof===w&&Cm(Qe)===X.type)?(Ne=S(X,se.props),Ne.ref=Go(ee,X,se),Ne.return=ee,Ne):(Ne=pc(se.type,se.key,se.props,null,ee.mode,Ne),Ne.ref=Go(ee,X,se),Ne.return=ee,Ne)}function Me(ee,X,se,Ne){return X===null||X.tag!==4||X.stateNode.containerInfo!==se.containerInfo||X.stateNode.implementation!==se.implementation?(X=Xf(se,ee.mode,Ne),X.return=ee,X):(X=S(X,se.children||[]),X.return=ee,X)}function Xe(ee,X,se,Ne,Qe){return X===null||X.tag!==7?(X=$r(se,ee.mode,Ne,Qe),X.return=ee,X):(X=S(X,se),X.return=ee,X)}function ht(ee,X,se){if(typeof X=="string"&&X!==""||typeof X=="number")return X=Wf(""+X,ee.mode,se),X.return=ee,X;if(typeof X=="object"&&X!==null){switch(X.$$typeof){case u:return se=pc(X.type,X.key,X.props,null,ee.mode,se),se.ref=Go(ee,null,X),se.return=ee,se;case h:return X=Xf(X,ee.mode,se),X.return=ee,X;case w:var Ne=X._init;return ht(ee,Ne(X._payload),se)}if(oe(X)||P(X))return X=$r(X,ee.mode,se,null),X.return=ee,X;Ol(ee,X)}return null}function it(ee,X,se,Ne){var Qe=X!==null?X.key:null;if(typeof se=="string"&&se!==""||typeof se=="number")return Qe!==null?null:H(ee,X,""+se,Ne);if(typeof se=="object"&&se!==null){switch(se.$$typeof){case u:return se.key===Qe?ce(ee,X,se,Ne):null;case h:return se.key===Qe?Me(ee,X,se,Ne):null;case w:return Qe=se._init,it(ee,X,Qe(se._payload),Ne)}if(oe(se)||P(se))return Qe!==null?null:Xe(ee,X,se,Ne,null);Ol(ee,se)}return null}function zt(ee,X,se,Ne,Qe){if(typeof Ne=="string"&&Ne!==""||typeof Ne=="number")return ee=ee.get(se)||null,H(X,ee,""+Ne,Qe);if(typeof Ne=="object"&&Ne!==null){switch(Ne.$$typeof){case u:return ee=ee.get(Ne.key===null?se:Ne.key)||null,ce(X,ee,Ne,Qe);case h:return ee=ee.get(Ne.key===null?se:Ne.key)||null,Me(X,ee,Ne,Qe);case w:var vt=Ne._init;return zt(ee,X,se,vt(Ne._payload),Qe)}if(oe(Ne)||P(Ne))return ee=ee.get(se)||null,Xe(X,ee,Ne,Qe,null);Ol(X,Ne)}return null}function et(ee,X,se,Ne){for(var Qe=null,vt=null,ft=X,Lt=X=0,dn=null;ft!==null&&Lt<se.length;Lt++){ft.index>Lt?(dn=ft,ft=null):dn=ft.sibling;var Dt=it(ee,ft,se[Lt],Ne);if(Dt===null){ft===null&&(ft=dn);break}o&&ft&&Dt.alternate===null&&l(ee,ft),X=A(Dt,X,Lt),vt===null?Qe=Dt:vt.sibling=Dt,vt=Dt,ft=dn}if(Lt===se.length)return d(ee,ft),Gt&&qr(ee,Lt),Qe;if(ft===null){for(;Lt<se.length;Lt++)ft=ht(ee,se[Lt],Ne),ft!==null&&(X=A(ft,X,Lt),vt===null?Qe=ft:vt.sibling=ft,vt=ft);return Gt&&qr(ee,Lt),Qe}for(ft=g(ee,ft);Lt<se.length;Lt++)dn=zt(ft,ee,Lt,se[Lt],Ne),dn!==null&&(o&&dn.alternate!==null&&ft.delete(dn.key===null?Lt:dn.key),X=A(dn,X,Lt),vt===null?Qe=dn:vt.sibling=dn,vt=dn);return o&&ft.forEach(function(Rr){return l(ee,Rr)}),Gt&&qr(ee,Lt),Qe}function Cn(ee,X,se,Ne){var Qe=P(se);if(typeof Qe!="function")throw Error(a(150));if(se=Qe.call(se),se==null)throw Error(a(151));for(var vt=Qe=null,ft=X,Lt=X=0,dn=null,Dt=se.next();ft!==null&&!Dt.done;Lt++,Dt=se.next()){ft.index>Lt?(dn=ft,ft=null):dn=ft.sibling;var Rr=it(ee,ft,Dt.value,Ne);if(Rr===null){ft===null&&(ft=dn);break}o&&ft&&Rr.alternate===null&&l(ee,ft),X=A(Rr,X,Lt),vt===null?Qe=Rr:vt.sibling=Rr,vt=Rr,ft=dn}if(Dt.done)return d(ee,ft),Gt&&qr(ee,Lt),Qe;if(ft===null){for(;!Dt.done;Lt++,Dt=se.next())Dt=ht(ee,Dt.value,Ne),Dt!==null&&(X=A(Dt,X,Lt),vt===null?Qe=Dt:vt.sibling=Dt,vt=Dt);return Gt&&qr(ee,Lt),Qe}for(ft=g(ee,ft);!Dt.done;Lt++,Dt=se.next())Dt=zt(ft,ee,Lt,Dt.value,Ne),Dt!==null&&(o&&Dt.alternate!==null&&ft.delete(Dt.key===null?Lt:Dt.key),X=A(Dt,X,Lt),vt===null?Qe=Dt:vt.sibling=Dt,vt=Dt);return o&&ft.forEach(function(hS){return l(ee,hS)}),Gt&&qr(ee,Lt),Qe}function gi(ee,X,se,Ne){if(typeof se=="object"&&se!==null&&se.type===f&&se.key===null&&(se=se.props.children),typeof se=="object"&&se!==null){switch(se.$$typeof){case u:e:{for(var Qe=se.key,vt=X;vt!==null;){if(vt.key===Qe){if(Qe=se.type,Qe===f){if(vt.tag===7){d(ee,vt.sibling),X=S(vt,se.props.children),X.return=ee,ee=X;break e}}else if(vt.elementType===Qe||typeof Qe=="object"&&Qe!==null&&Qe.$$typeof===w&&Cm(Qe)===vt.type){d(ee,vt.sibling),X=S(vt,se.props),X.ref=Go(ee,vt,se),X.return=ee,ee=X;break e}d(ee,vt);break}else l(ee,vt);vt=vt.sibling}se.type===f?(X=$r(se.props.children,ee.mode,Ne,se.key),X.return=ee,ee=X):(Ne=pc(se.type,se.key,se.props,null,ee.mode,Ne),Ne.ref=Go(ee,X,se),Ne.return=ee,ee=Ne)}return z(ee);case h:e:{for(vt=se.key;X!==null;){if(X.key===vt)if(X.tag===4&&X.stateNode.containerInfo===se.containerInfo&&X.stateNode.implementation===se.implementation){d(ee,X.sibling),X=S(X,se.children||[]),X.return=ee,ee=X;break e}else{d(ee,X);break}else l(ee,X);X=X.sibling}X=Xf(se,ee.mode,Ne),X.return=ee,ee=X}return z(ee);case w:return vt=se._init,gi(ee,X,vt(se._payload),Ne)}if(oe(se))return et(ee,X,se,Ne);if(P(se))return Cn(ee,X,se,Ne);Ol(ee,se)}return typeof se=="string"&&se!==""||typeof se=="number"?(se=""+se,X!==null&&X.tag===6?(d(ee,X.sibling),X=S(X,se),X.return=ee,ee=X):(d(ee,X),X=Wf(se,ee.mode,Ne),X.return=ee,ee=X),z(ee)):d(ee,X)}return gi}var Vs=Rm(!0),Pm=Rm(!1),Wo={},fi=Nt(Wo),Xo=Nt(Wo),Gs=Nt(Wo);function Bi(o){if(o===Wo)throw Error(a(174));return o}function lf(o,l){$e(Gs,l),$e(Xo,o),$e(fi,Wo),o=fe(l),yt(fi),$e(fi,o)}function Ws(){yt(fi),yt(Xo),yt(Gs)}function Im(o){var l=Bi(Gs.current),d=Bi(fi.current);l=O(d,o.type,l),d!==l&&($e(Xo,o),$e(fi,l))}function cf(o){Xo.current===o&&(yt(fi),yt(Xo))}var Xt=Nt(0);function Bl(o){for(var l=o;l!==null;){if(l.tag===13){var d=l.memoizedState;if(d!==null&&(d=d.dehydrated,d===null||Us(d)||Ns(d)))return l}else if(l.tag===19&&l.memoizedProps.revealOrder!==void 0){if(l.flags&128)return l}else if(l.child!==null){l.child.return=l,l=l.child;continue}if(l===o)break;for(;l.sibling===null;){if(l.return===null||l.return===o)return null;l=l.return}l.sibling.return=l.return,l=l.sibling}return null}var uf=[];function hf(){for(var o=0;o<uf.length;o++){var l=uf[o];Ze?l._workInProgressVersionPrimary=null:l._workInProgressVersionSecondary=null}uf.length=0}var zl=c.ReactCurrentDispatcher,di=c.ReactCurrentBatchConfig,Xs=0,jt=null,An=null,fn=null,kl=!1,qo=!1,Yo=0,Fy=0;function bn(){throw Error(a(321))}function ff(o,l){if(l===null)return!1;for(var d=0;d<l.length&&d<o.length;d++)if(!Ni(o[d],l[d]))return!1;return!0}function df(o,l,d,g,S,A){if(Xs=A,jt=l,l.memoizedState=null,l.updateQueue=null,l.lanes=0,zl.current=o===null||o.memoizedState===null?ky:Hy,o=d(g,S),qo){A=0;do{if(qo=!1,Yo=0,25<=A)throw Error(a(301));A+=1,fn=An=null,l.updateQueue=null,zl.current=Vy,o=d(g,S)}while(qo)}if(zl.current=Xl,l=An!==null&&An.next!==null,Xs=0,fn=An=jt=null,kl=!1,l)throw Error(a(300));return o}function pf(){var o=Yo!==0;return Yo=0,o}function nr(){var o={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return fn===null?jt.memoizedState=fn=o:fn=fn.next=o,fn}function zi(){if(An===null){var o=jt.alternate;o=o!==null?o.memoizedState:null}else o=An.next;var l=fn===null?jt.memoizedState:fn.next;if(l!==null)fn=l,An=o;else{if(o===null)throw Error(a(310));An=o,o={memoizedState:An.memoizedState,baseState:An.baseState,baseQueue:An.baseQueue,queue:An.queue,next:null},fn===null?jt.memoizedState=fn=o:fn=fn.next=o}return fn}function Yr(o,l){return typeof l=="function"?l(o):l}function Hl(o){var l=zi(),d=l.queue;if(d===null)throw Error(a(311));d.lastRenderedReducer=o;var g=An,S=g.baseQueue,A=d.pending;if(A!==null){if(S!==null){var z=S.next;S.next=A.next,A.next=z}g.baseQueue=S=A,d.pending=null}if(S!==null){A=S.next,g=g.baseState;var H=z=null,ce=null,Me=A;do{var Xe=Me.lane;if((Xs&Xe)===Xe)ce!==null&&(ce=ce.next={lane:0,action:Me.action,hasEagerState:Me.hasEagerState,eagerState:Me.eagerState,next:null}),g=Me.hasEagerState?Me.eagerState:o(g,Me.action);else{var ht={lane:Xe,action:Me.action,hasEagerState:Me.hasEagerState,eagerState:Me.eagerState,next:null};ce===null?(H=ce=ht,z=g):ce=ce.next=ht,jt.lanes|=Xe,Ys|=Xe}Me=Me.next}while(Me!==null&&Me!==A);ce===null?z=g:ce.next=H,Ni(g,l.memoizedState)||(ei=!0),l.memoizedState=g,l.baseState=z,l.baseQueue=ce,d.lastRenderedState=g}if(o=d.interleaved,o!==null){S=o;do A=S.lane,jt.lanes|=A,Ys|=A,S=S.next;while(S!==o)}else S===null&&(d.lanes=0);return[l.memoizedState,d.dispatch]}function Vl(o){var l=zi(),d=l.queue;if(d===null)throw Error(a(311));d.lastRenderedReducer=o;var g=d.dispatch,S=d.pending,A=l.memoizedState;if(S!==null){d.pending=null;var z=S=S.next;do A=o(A,z.action),z=z.next;while(z!==S);Ni(A,l.memoizedState)||(ei=!0),l.memoizedState=A,l.baseQueue===null&&(l.baseState=A),d.lastRenderedState=A}return[A,g]}function Lm(){}function Dm(o,l){var d=jt,g=zi(),S=l(),A=!Ni(g.memoizedState,S);if(A&&(g.memoizedState=S,ei=!0),g=g.queue,Zo(Fm.bind(null,d,g,o),[o]),g.getSnapshot!==l||A||fn!==null&&fn.memoizedState.tag&1){if(d.flags|=2048,jo(9,Nm.bind(null,d,g,S,l),void 0,null),tn===null)throw Error(a(349));Xs&30||Um(d,l,S)}return S}function Um(o,l,d){o.flags|=16384,o={getSnapshot:l,value:d},l=jt.updateQueue,l===null?(l={lastEffect:null,stores:null},jt.updateQueue=l,l.stores=[o]):(d=l.stores,d===null?l.stores=[o]:d.push(o))}function Nm(o,l,d,g){l.value=d,l.getSnapshot=g,Om(l)&&pi(o,1,-1)}function Fm(o,l,d){return d(function(){Om(l)&&pi(o,1,-1)})}function Om(o){var l=o.getSnapshot;o=o.value;try{var d=l();return!Ni(o,d)}catch{return!0}}function mf(o){var l=nr();return typeof o=="function"&&(o=o()),l.memoizedState=l.baseState=o,o={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Yr,lastRenderedState:o},l.queue=o,o=o.dispatch=zy.bind(null,jt,o),[l.memoizedState,o]}function jo(o,l,d,g){return o={tag:o,create:l,destroy:d,deps:g,next:null},l=jt.updateQueue,l===null?(l={lastEffect:null,stores:null},jt.updateQueue=l,l.lastEffect=o.next=o):(d=l.lastEffect,d===null?l.lastEffect=o.next=o:(g=d.next,d.next=o,o.next=g,l.lastEffect=o)),o}function Bm(){return zi().memoizedState}function Gl(o,l,d,g){var S=nr();jt.flags|=o,S.memoizedState=jo(1|l,d,void 0,g===void 0?null:g)}function Wl(o,l,d,g){var S=zi();g=g===void 0?null:g;var A=void 0;if(An!==null){var z=An.memoizedState;if(A=z.destroy,g!==null&&ff(g,z.deps)){S.memoizedState=jo(l,d,A,g);return}}jt.flags|=o,S.memoizedState=jo(1|l,d,A,g)}function gf(o,l){return Gl(8390656,8,o,l)}function Zo(o,l){return Wl(2048,8,o,l)}function zm(o,l){return Wl(4,2,o,l)}function km(o,l){return Wl(4,4,o,l)}function Hm(o,l){if(typeof l=="function")return o=o(),l(o),function(){l(null)};if(l!=null)return o=o(),l.current=o,function(){l.current=null}}function Vm(o,l,d){return d=d!=null?d.concat([o]):null,Wl(4,4,Hm.bind(null,l,o),d)}function vf(){}function Gm(o,l){var d=zi();l=l===void 0?null:l;var g=d.memoizedState;return g!==null&&l!==null&&ff(l,g[1])?g[0]:(d.memoizedState=[o,l],o)}function Wm(o,l){var d=zi();l=l===void 0?null:l;var g=d.memoizedState;return g!==null&&l!==null&&ff(l,g[1])?g[0]:(o=o(),d.memoizedState=[o,l],o)}function Oy(o,l){var d=It;It=d!==0&&4>d?d:4,o(!0);var g=di.transition;di.transition={};try{o(!1),l()}finally{It=d,di.transition=g}}function Xm(){return zi().memoizedState}function By(o,l,d){var g=br(o);d={lane:g,action:d,hasEagerState:!1,eagerState:null,next:null},qm(o)?Ym(l,d):(jm(o,l,d),d=Fn(),o=pi(o,g,d),o!==null&&Zm(o,l,g))}function zy(o,l,d){var g=br(o),S={lane:g,action:d,hasEagerState:!1,eagerState:null,next:null};if(qm(o))Ym(l,S);else{jm(o,l,S);var A=o.alternate;if(o.lanes===0&&(A===null||A.lanes===0)&&(A=l.lastRenderedReducer,A!==null))try{var z=l.lastRenderedState,H=A(z,d);if(S.hasEagerState=!0,S.eagerState=H,Ni(H,z))return}catch{}finally{}d=Fn(),o=pi(o,g,d),o!==null&&Zm(o,l,g)}}function qm(o){var l=o.alternate;return o===jt||l!==null&&l===jt}function Ym(o,l){qo=kl=!0;var d=o.pending;d===null?l.next=l:(l.next=d.next,d.next=l),o.pending=l}function jm(o,l,d){tn!==null&&o.mode&1&&!(St&2)?(o=l.interleaved,o===null?(d.next=d,Oi===null?Oi=[l]:Oi.push(l)):(d.next=o.next,o.next=d),l.interleaved=d):(o=l.pending,o===null?d.next=d:(d.next=o.next,o.next=d),l.pending=d)}function Zm(o,l,d){if(d&4194240){var g=l.lanes;g&=o.pendingLanes,d|=g,l.lanes=d,Wh(o,d)}}var Xl={readContext:ci,useCallback:bn,useContext:bn,useEffect:bn,useImperativeHandle:bn,useInsertionEffect:bn,useLayoutEffect:bn,useMemo:bn,useReducer:bn,useRef:bn,useState:bn,useDebugValue:bn,useDeferredValue:bn,useTransition:bn,useMutableSource:bn,useSyncExternalStore:bn,useId:bn,unstable_isNewReconciler:!1},ky={readContext:ci,useCallback:function(o,l){return nr().memoizedState=[o,l===void 0?null:l],o},useContext:ci,useEffect:gf,useImperativeHandle:function(o,l,d){return d=d!=null?d.concat([o]):null,Gl(4194308,4,Hm.bind(null,l,o),d)},useLayoutEffect:function(o,l){return Gl(4194308,4,o,l)},useInsertionEffect:function(o,l){return Gl(4,2,o,l)},useMemo:function(o,l){var d=nr();return l=l===void 0?null:l,o=o(),d.memoizedState=[o,l],o},useReducer:function(o,l,d){var g=nr();return l=d!==void 0?d(l):l,g.memoizedState=g.baseState=l,o={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:o,lastRenderedState:l},g.queue=o,o=o.dispatch=By.bind(null,jt,o),[g.memoizedState,o]},useRef:function(o){var l=nr();return o={current:o},l.memoizedState=o},useState:mf,useDebugValue:vf,useDeferredValue:function(o){var l=mf(o),d=l[0],g=l[1];return gf(function(){var S=di.transition;di.transition={};try{g(o)}finally{di.transition=S}},[o]),d},useTransition:function(){var o=mf(!1),l=o[0];return o=Oy.bind(null,o[1]),nr().memoizedState=o,[l,o]},useMutableSource:function(){},useSyncExternalStore:function(o,l,d){var g=jt,S=nr();if(Gt){if(d===void 0)throw Error(a(407));d=d()}else{if(d=l(),tn===null)throw Error(a(349));Xs&30||Um(g,l,d)}S.memoizedState=d;var A={value:d,getSnapshot:l};return S.queue=A,gf(Fm.bind(null,g,A,o),[o]),g.flags|=2048,jo(9,Nm.bind(null,g,A,d,l),void 0,null),d},useId:function(){var o=nr(),l=tn.identifierPrefix;if(Gt){var d=tr,g=er;d=(g&~(1<<32-Un(g)-1)).toString(32)+d,l=":"+l+"R"+d,d=Yo++,0<d&&(l+="H"+d.toString(32)),l+=":"}else d=Fy++,l=":"+l+"r"+d.toString(32)+":";return o.memoizedState=l},unstable_isNewReconciler:!1},Hy={readContext:ci,useCallback:Gm,useContext:ci,useEffect:Zo,useImperativeHandle:Vm,useInsertionEffect:zm,useLayoutEffect:km,useMemo:Wm,useReducer:Hl,useRef:Bm,useState:function(){return Hl(Yr)},useDebugValue:vf,useDeferredValue:function(o){var l=Hl(Yr),d=l[0],g=l[1];return Zo(function(){var S=di.transition;di.transition={};try{g(o)}finally{di.transition=S}},[o]),d},useTransition:function(){var o=Hl(Yr)[0],l=zi().memoizedState;return[o,l]},useMutableSource:Lm,useSyncExternalStore:Dm,useId:Xm,unstable_isNewReconciler:!1},Vy={readContext:ci,useCallback:Gm,useContext:ci,useEffect:Zo,useImperativeHandle:Vm,useInsertionEffect:zm,useLayoutEffect:km,useMemo:Wm,useReducer:Vl,useRef:Bm,useState:function(){return Vl(Yr)},useDebugValue:vf,useDeferredValue:function(o){var l=Vl(Yr),d=l[0],g=l[1];return Zo(function(){var S=di.transition;di.transition={};try{g(o)}finally{di.transition=S}},[o]),d},useTransition:function(){var o=Vl(Yr)[0],l=zi().memoizedState;return[o,l]},useMutableSource:Lm,useSyncExternalStore:Dm,useId:Xm,unstable_isNewReconciler:!1};function _f(o,l){try{var d="",g=l;do d+=Ny(g),g=g.return;while(g);var S=d}catch(A){S=`
Error generating stack: `+A.message+`
`+A.stack}return{value:o,source:l,stack:S}}function xf(o,l){try{console.error(l.value)}catch(d){setTimeout(function(){throw d})}}var Gy=typeof WeakMap=="function"?WeakMap:Map;function Jm(o,l,d){d=$i(-1,d),d.tag=3,d.payload={element:null};var g=l.value;return d.callback=function(){ac||(ac=!0,Of=g),xf(o,l)},d}function Km(o,l,d){d=$i(-1,d),d.tag=3;var g=o.type.getDerivedStateFromError;if(typeof g=="function"){var S=l.value;d.payload=function(){return g(S)},d.callback=function(){xf(o,l)}}var A=o.stateNode;return A!==null&&typeof A.componentDidCatch=="function"&&(d.callback=function(){xf(o,l),typeof g!="function"&&(Er===null?Er=new Set([this]):Er.add(this));var z=l.stack;this.componentDidCatch(l.value,{componentStack:z!==null?z:""})}),d}function Qm(o,l,d){var g=o.pingCache;if(g===null){g=o.pingCache=new Gy;var S=new Set;g.set(l,S)}else S=g.get(l),S===void 0&&(S=new Set,g.set(l,S));S.has(d)||(S.add(d),o=iS.bind(null,o,l,d),l.then(o,o))}function $m(o){do{var l;if((l=o.tag===13)&&(l=o.memoizedState,l=l!==null?l.dehydrated!==null:!0),l)return o;o=o.return}while(o!==null);return null}function eg(o,l,d,g,S){return o.mode&1?(o.flags|=65536,o.lanes=S,o):(o===l?o.flags|=65536:(o.flags|=128,d.flags|=131072,d.flags&=-52805,d.tag===1&&(d.alternate===null?d.tag=17:(l=$i(-1,1),l.tag=2,wr(d,l))),d.lanes|=1),o)}function ki(o){o.flags|=4}function tg(o,l){if(o!==null&&o.child===l.child)return!0;if(l.flags&16)return!1;for(o=l.child;o!==null;){if(o.flags&12854||o.subtreeFlags&12854)return!1;o=o.sibling}return!0}var Jo,Ko,ql,Yl;if(Ie)Jo=function(o,l){for(var d=l.child;d!==null;){if(d.tag===5||d.tag===6)xe(o,d.stateNode);else if(d.tag!==4&&d.child!==null){d.child.return=d,d=d.child;continue}if(d===l)break;for(;d.sibling===null;){if(d.return===null||d.return===l)return;d=d.return}d.sibling.return=d.return,d=d.sibling}},Ko=function(){},ql=function(o,l,d,g,S){if(o=o.memoizedProps,o!==g){var A=l.stateNode,z=Bi(fi.current);d=ie(A,d,o,g,S,z),(l.updateQueue=d)&&ki(l)}},Yl=function(o,l,d,g){d!==g&&ki(l)};else if(de){Jo=function(o,l,d,g){for(var S=l.child;S!==null;){if(S.tag===5){var A=S.stateNode;d&&g&&(A=_n(A,S.type,S.memoizedProps,S)),xe(o,A)}else if(S.tag===6)A=S.stateNode,d&&g&&(A=li(A,S.memoizedProps,S)),xe(o,A);else if(S.tag!==4){if(S.tag===22&&S.memoizedState!==null)A=S.child,A!==null&&(A.return=S),Jo(o,S,!0,!0);else if(S.child!==null){S.child.return=S,S=S.child;continue}}if(S===l)break;for(;S.sibling===null;){if(S.return===null||S.return===l)return;S=S.return}S.sibling.return=S.return,S=S.sibling}};var ng=function(o,l,d,g){for(var S=l.child;S!==null;){if(S.tag===5){var A=S.stateNode;d&&g&&(A=_n(A,S.type,S.memoizedProps,S)),Wt(o,A)}else if(S.tag===6)A=S.stateNode,d&&g&&(A=li(A,S.memoizedProps,S)),Wt(o,A);else if(S.tag!==4){if(S.tag===22&&S.memoizedState!==null)A=S.child,A!==null&&(A.return=S),ng(o,S,!0,!0);else if(S.child!==null){S.child.return=S,S=S.child;continue}}if(S===l)break;for(;S.sibling===null;){if(S.return===null||S.return===l)return;S=S.return}S.sibling.return=S.return,S=S.sibling}};Ko=function(o,l){var d=l.stateNode;if(!tg(o,l)){o=d.containerInfo;var g=Et(o);ng(g,l,!1,!1),d.pendingChildren=g,ki(l),En(o,g)}},ql=function(o,l,d,g,S){var A=o.stateNode,z=o.memoizedProps;if((o=tg(o,l))&&z===g)l.stateNode=A;else{var H=l.stateNode,ce=Bi(fi.current),Me=null;z!==g&&(Me=ie(H,d,z,g,S,ce)),o&&Me===null?l.stateNode=A:(A=ze(A,Me,d,z,g,l,o,H),Pe(A,d,g,S,ce)&&ki(l),l.stateNode=A,o?ki(l):Jo(A,l,!1,!1))}},Yl=function(o,l,d,g){d!==g?(o=Bi(Gs.current),d=Bi(fi.current),l.stateNode=be(g,o,d,l),ki(l)):l.stateNode=o.stateNode}}else Ko=function(){},ql=function(){},Yl=function(){};function Qo(o,l){if(!Gt)switch(o.tailMode){case"hidden":l=o.tail;for(var d=null;l!==null;)l.alternate!==null&&(d=l),l=l.sibling;d===null?o.tail=null:d.sibling=null;break;case"collapsed":d=o.tail;for(var g=null;d!==null;)d.alternate!==null&&(g=d),d=d.sibling;g===null?l||o.tail===null?o.tail=null:o.tail.sibling=null:g.sibling=null}}function Tn(o){var l=o.alternate!==null&&o.alternate.child===o.child,d=0,g=0;if(l)for(var S=o.child;S!==null;)d|=S.lanes|S.childLanes,g|=S.subtreeFlags&14680064,g|=S.flags&14680064,S.return=o,S=S.sibling;else for(S=o.child;S!==null;)d|=S.lanes|S.childLanes,g|=S.subtreeFlags,g|=S.flags,S.return=o,S=S.sibling;return o.subtreeFlags|=g,o.childLanes=d,l}function Wy(o,l,d){var g=l.pendingProps;switch(rf(l),l.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Tn(l),null;case 1:return Ot(l.type)&&yr(),Tn(l),null;case 3:return g=l.stateNode,Ws(),yt(ct),yt(bt),hf(),g.pendingContext&&(g.context=g.pendingContext,g.pendingContext=null),(o===null||o.child===null)&&(Vo(l)?ki(l):o===null||o.memoizedState.isDehydrated&&!(l.flags&256)||(l.flags|=1024,Mi!==null&&(kf(Mi),Mi=null))),Ko(o,l),Tn(l),null;case 5:cf(l),d=Bi(Gs.current);var S=l.type;if(o!==null&&l.stateNode!=null)ql(o,l,S,g,d),o.ref!==l.ref&&(l.flags|=512,l.flags|=2097152);else{if(!g){if(l.stateNode===null)throw Error(a(166));return Tn(l),null}if(o=Bi(fi.current),Vo(l)){if(!N)throw Error(a(175));o=Ml(l.stateNode,l.type,l.memoizedProps,d,o,l,!Ho),l.updateQueue=o,o!==null&&ki(l)}else{var A=re(S,g,d,o,l);Jo(A,l,!1,!1),l.stateNode=A,Pe(A,S,g,d,o)&&ki(l)}l.ref!==null&&(l.flags|=512,l.flags|=2097152)}return Tn(l),null;case 6:if(o&&l.stateNode!=null)Yl(o,l,o.memoizedProps,g);else{if(typeof g!="string"&&l.stateNode===null)throw Error(a(166));if(o=Bi(Gs.current),d=Bi(fi.current),Vo(l)){if(!N)throw Error(a(176));if(o=l.stateNode,g=l.memoizedProps,(d=Bh(o,g,l,!Ho))&&(S=Qn,S!==null))switch(A=(S.mode&1)!==0,S.tag){case 3:Ae(S.stateNode.containerInfo,o,g,A);break;case 5:Oe(S.type,S.memoizedProps,S.stateNode,o,g,A)}d&&ki(l)}else l.stateNode=be(g,o,d,l)}return Tn(l),null;case 13:if(yt(Xt),g=l.memoizedState,Gt&&$n!==null&&l.mode&1&&!(l.flags&128)){for(o=$n;o;)o=Di(o);return Hs(),l.flags|=98560,l}if(g!==null&&g.dehydrated!==null){if(g=Vo(l),o===null){if(!g)throw Error(a(318));if(!N)throw Error(a(344));if(o=l.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(a(317));zh(o,l)}else Hs(),!(l.flags&128)&&(l.memoizedState=null),l.flags|=4;return Tn(l),null}return Mi!==null&&(kf(Mi),Mi=null),l.flags&128?(l.lanes=d,l):(g=g!==null,d=!1,o===null?Vo(l):d=o.memoizedState!==null,g&&!d&&(l.child.flags|=8192,l.mode&1&&(o===null||Xt.current&1?ln===0&&(ln=3):Vf())),l.updateQueue!==null&&(l.flags|=4),Tn(l),null);case 4:return Ws(),Ko(o,l),o===null&&we(l.stateNode.containerInfo),Tn(l),null;case 10:return Kh(l.type._context),Tn(l),null;case 17:return Ot(l.type)&&yr(),Tn(l),null;case 19:if(yt(Xt),S=l.memoizedState,S===null)return Tn(l),null;if(g=(l.flags&128)!==0,A=S.rendering,A===null)if(g)Qo(S,!1);else{if(ln!==0||o!==null&&o.flags&128)for(o=l.child;o!==null;){if(A=Bl(o),A!==null){for(l.flags|=128,Qo(S,!1),o=A.updateQueue,o!==null&&(l.updateQueue=o,l.flags|=4),l.subtreeFlags=0,o=d,g=l.child;g!==null;)d=g,S=o,d.flags&=14680066,A=d.alternate,A===null?(d.childLanes=0,d.lanes=S,d.child=null,d.subtreeFlags=0,d.memoizedProps=null,d.memoizedState=null,d.updateQueue=null,d.dependencies=null,d.stateNode=null):(d.childLanes=A.childLanes,d.lanes=A.lanes,d.child=A.child,d.subtreeFlags=0,d.deletions=null,d.memoizedProps=A.memoizedProps,d.memoizedState=A.memoizedState,d.updateQueue=A.updateQueue,d.type=A.type,S=A.dependencies,d.dependencies=S===null?null:{lanes:S.lanes,firstContext:S.firstContext}),g=g.sibling;return $e(Xt,Xt.current&1|2),l.child}o=o.sibling}S.tail!==null&&hn()>Ff&&(l.flags|=128,g=!0,Qo(S,!1),l.lanes=4194304)}else{if(!g)if(o=Bl(A),o!==null){if(l.flags|=128,g=!0,o=o.updateQueue,o!==null&&(l.updateQueue=o,l.flags|=4),Qo(S,!0),S.tail===null&&S.tailMode==="hidden"&&!A.alternate&&!Gt)return Tn(l),null}else 2*hn()-S.renderingStartTime>Ff&&d!==1073741824&&(l.flags|=128,g=!0,Qo(S,!1),l.lanes=4194304);S.isBackwards?(A.sibling=l.child,l.child=A):(o=S.last,o!==null?o.sibling=A:l.child=A,S.last=A)}return S.tail!==null?(l=S.tail,S.rendering=l,S.tail=l.sibling,S.renderingStartTime=hn(),l.sibling=null,o=Xt.current,$e(Xt,g?o&1|2:o&1),l):(Tn(l),null);case 22:case 23:return Hf(),g=l.memoizedState!==null,o!==null&&o.memoizedState!==null!==g&&(l.flags|=8192),g&&l.mode&1?ti&1073741824&&(Tn(l),Ie&&l.subtreeFlags&6&&(l.flags|=8192)):Tn(l),null;case 24:return null;case 25:return null}throw Error(a(156,l.tag))}var Xy=c.ReactCurrentOwner,ei=!1;function Nn(o,l,d,g){l.child=o===null?Pm(l,null,d,g):Vs(l,o.child,d,g)}function ig(o,l,d,g,S){d=d.render;var A=l.ref;return Bs(l,S),g=df(o,l,d,g,A,S),d=pf(),o!==null&&!ei?(l.updateQueue=o.updateQueue,l.flags&=-2053,o.lanes&=~S,ir(o,l,S)):(Gt&&d&&nf(l),l.flags|=1,Nn(o,l,g,S),l.child)}function rg(o,l,d,g,S){if(o===null){var A=d.type;return typeof A=="function"&&!Gf(A)&&A.defaultProps===void 0&&d.compare===null&&d.defaultProps===void 0?(l.tag=15,l.type=A,sg(o,l,A,g,S)):(o=pc(d.type,null,g,l,l.mode,S),o.ref=l.ref,o.return=l,l.child=o)}if(A=o.child,!(o.lanes&S)){var z=A.memoizedProps;if(d=d.compare,d=d!==null?d:Rl,d(z,g)&&o.ref===l.ref)return ir(o,l,S)}return l.flags|=1,o=Cr(A,g),o.ref=l.ref,o.return=l,l.child=o}function sg(o,l,d,g,S){if(o!==null&&Rl(o.memoizedProps,g)&&o.ref===l.ref)if(ei=!1,(o.lanes&S)!==0)o.flags&131072&&(ei=!0);else return l.lanes=o.lanes,ir(o,l,S);return yf(o,l,d,g,S)}function og(o,l,d){var g=l.pendingProps,S=g.children,A=o!==null?o.memoizedState:null;if(g.mode==="hidden")if(!(l.mode&1))l.memoizedState={baseLanes:0,cachePool:null},$e(qs,ti),ti|=d;else if(d&1073741824)l.memoizedState={baseLanes:0,cachePool:null},g=A!==null?A.baseLanes:d,$e(qs,ti),ti|=g;else return o=A!==null?A.baseLanes|d:d,l.lanes=l.childLanes=1073741824,l.memoizedState={baseLanes:o,cachePool:null},l.updateQueue=null,$e(qs,ti),ti|=o,null;else A!==null?(g=A.baseLanes|d,l.memoizedState=null):g=d,$e(qs,ti),ti|=g;return Nn(o,l,S,d),l.child}function ag(o,l){var d=l.ref;(o===null&&d!==null||o!==null&&o.ref!==d)&&(l.flags|=512,l.flags|=2097152)}function yf(o,l,d,g,S){var A=Ot(d)?an:bt.current;return A=Kn(l,A),Bs(l,S),d=df(o,l,d,g,A,S),g=pf(),o!==null&&!ei?(l.updateQueue=o.updateQueue,l.flags&=-2053,o.lanes&=~S,ir(o,l,S)):(Gt&&g&&nf(l),l.flags|=1,Nn(o,l,d,S),l.child)}function lg(o,l,d,g,S){if(Ot(d)){var A=!0;Sr(l)}else A=!1;if(Bs(l,S),l.stateNode===null)o!==null&&(o.alternate=null,l.alternate=null,l.flags|=2),Mm(l,d,g),tf(l,d,g,S),g=!0;else if(o===null){var z=l.stateNode,H=l.memoizedProps;z.props=H;var ce=z.context,Me=d.contextType;typeof Me=="object"&&Me!==null?Me=ci(Me):(Me=Ot(d)?an:bt.current,Me=Kn(l,Me));var Xe=d.getDerivedStateFromProps,ht=typeof Xe=="function"||typeof z.getSnapshotBeforeUpdate=="function";ht||typeof z.UNSAFE_componentWillReceiveProps!="function"&&typeof z.componentWillReceiveProps!="function"||(H!==g||ce!==Me)&&wm(l,z,g,Me),Mr=!1;var it=l.memoizedState;z.state=it,Dl(l,g,z,S),ce=l.memoizedState,H!==g||it!==ce||ct.current||Mr?(typeof Xe=="function"&&(ef(l,d,Xe,g),ce=l.memoizedState),(H=Mr||Sm(l,d,H,g,it,ce,Me))?(ht||typeof z.UNSAFE_componentWillMount!="function"&&typeof z.componentWillMount!="function"||(typeof z.componentWillMount=="function"&&z.componentWillMount(),typeof z.UNSAFE_componentWillMount=="function"&&z.UNSAFE_componentWillMount()),typeof z.componentDidMount=="function"&&(l.flags|=4194308)):(typeof z.componentDidMount=="function"&&(l.flags|=4194308),l.memoizedProps=g,l.memoizedState=ce),z.props=g,z.state=ce,z.context=Me,g=H):(typeof z.componentDidMount=="function"&&(l.flags|=4194308),g=!1)}else{z=l.stateNode,vm(o,l),H=l.memoizedProps,Me=l.type===l.elementType?H:Si(l.type,H),z.props=Me,ht=l.pendingProps,it=z.context,ce=d.contextType,typeof ce=="object"&&ce!==null?ce=ci(ce):(ce=Ot(d)?an:bt.current,ce=Kn(l,ce));var zt=d.getDerivedStateFromProps;(Xe=typeof zt=="function"||typeof z.getSnapshotBeforeUpdate=="function")||typeof z.UNSAFE_componentWillReceiveProps!="function"&&typeof z.componentWillReceiveProps!="function"||(H!==ht||it!==ce)&&wm(l,z,g,ce),Mr=!1,it=l.memoizedState,z.state=it,Dl(l,g,z,S);var et=l.memoizedState;H!==ht||it!==et||ct.current||Mr?(typeof zt=="function"&&(ef(l,d,zt,g),et=l.memoizedState),(Me=Mr||Sm(l,d,Me,g,it,et,ce)||!1)?(Xe||typeof z.UNSAFE_componentWillUpdate!="function"&&typeof z.componentWillUpdate!="function"||(typeof z.componentWillUpdate=="function"&&z.componentWillUpdate(g,et,ce),typeof z.UNSAFE_componentWillUpdate=="function"&&z.UNSAFE_componentWillUpdate(g,et,ce)),typeof z.componentDidUpdate=="function"&&(l.flags|=4),typeof z.getSnapshotBeforeUpdate=="function"&&(l.flags|=1024)):(typeof z.componentDidUpdate!="function"||H===o.memoizedProps&&it===o.memoizedState||(l.flags|=4),typeof z.getSnapshotBeforeUpdate!="function"||H===o.memoizedProps&&it===o.memoizedState||(l.flags|=1024),l.memoizedProps=g,l.memoizedState=et),z.props=g,z.state=et,z.context=ce,g=Me):(typeof z.componentDidUpdate!="function"||H===o.memoizedProps&&it===o.memoizedState||(l.flags|=4),typeof z.getSnapshotBeforeUpdate!="function"||H===o.memoizedProps&&it===o.memoizedState||(l.flags|=1024),g=!1)}return Sf(o,l,d,g,A,S)}function Sf(o,l,d,g,S,A){ag(o,l);var z=(l.flags&128)!==0;if(!g&&!z)return S&&Dn(l,d,!1),ir(o,l,A);g=l.stateNode,Xy.current=l;var H=z&&typeof d.getDerivedStateFromError!="function"?null:g.render();return l.flags|=1,o!==null&&z?(l.child=Vs(l,o.child,null,A),l.child=Vs(l,null,H,A)):Nn(o,l,H,A),l.memoizedState=g.state,S&&Dn(l,d,!0),l.child}function cg(o){var l=o.stateNode;l.pendingContext?Vt(o,l.pendingContext,l.pendingContext!==l.context):l.context&&Vt(o,l.context,!1),lf(o,l.containerInfo)}function ug(o,l,d,g,S){return Hs(),af(S),l.flags|=256,Nn(o,l,d,g),l.child}var jl={dehydrated:null,treeContext:null,retryLane:0};function Zl(o){return{baseLanes:o,cachePool:null}}function hg(o,l,d){var g=l.pendingProps,S=Xt.current,A=!1,z=(l.flags&128)!==0,H;if((H=z)||(H=o!==null&&o.memoizedState===null?!1:(S&2)!==0),H?(A=!0,l.flags&=-129):(o===null||o.memoizedState!==null)&&(S|=1),$e(Xt,S&1),o===null)return of(l),o=l.memoizedState,o!==null&&(o=o.dehydrated,o!==null)?(l.mode&1?Ns(o)?l.lanes=8:l.lanes=1073741824:l.lanes=1,null):(S=g.children,o=g.fallback,A?(g=l.mode,A=l.child,S={mode:"hidden",children:S},!(g&1)&&A!==null?(A.childLanes=0,A.pendingProps=S):A=mc(S,g,0,null),o=$r(o,g,d,null),A.return=l,o.return=l,A.sibling=o,l.child=A,l.child.memoizedState=Zl(d),l.memoizedState=jl,o):Mf(l,S));if(S=o.memoizedState,S!==null){if(H=S.dehydrated,H!==null){if(z)return l.flags&256?(l.flags&=-257,Jl(o,l,d,Error(a(422)))):l.memoizedState!==null?(l.child=o.child,l.flags|=128,null):(A=g.fallback,S=l.mode,g=mc({mode:"visible",children:g.children},S,0,null),A=$r(A,S,d,null),A.flags|=2,g.return=l,A.return=l,g.sibling=A,l.child=g,l.mode&1&&Vs(l,o.child,null,d),l.child.memoizedState=Zl(d),l.memoizedState=jl,A);if(!(l.mode&1))l=Jl(o,l,d,null);else if(Ns(H))l=Jl(o,l,d,Error(a(419)));else if(g=(d&o.childLanes)!==0,ei||g){if(g=tn,g!==null){switch(d&-d){case 4:A=2;break;case 16:A=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:A=32;break;case 536870912:A=268435456;break;default:A=0}g=A&(g.suspendedLanes|d)?0:A,g!==0&&g!==S.retryLane&&(S.retryLane=g,pi(o,g,-1))}Vf(),l=Jl(o,l,d,Error(a(421)))}else Us(H)?(l.flags|=128,l.child=o.child,l=rS.bind(null,o),xl(H,l),l=null):(d=S.treeContext,N&&($n=Sl(H),Qn=l,Gt=!0,Mi=null,Ho=!1,d!==null&&(ui[hi++]=er,ui[hi++]=tr,ui[hi++]=Xr,er=d.id,tr=d.overflow,Xr=l)),l=Mf(l,l.pendingProps.children),l.flags|=4096);return l}return A?(g=dg(o,l,g.children,g.fallback,d),A=l.child,S=o.child.memoizedState,A.memoizedState=S===null?Zl(d):{baseLanes:S.baseLanes|d,cachePool:null},A.childLanes=o.childLanes&~d,l.memoizedState=jl,g):(d=fg(o,l,g.children,d),l.memoizedState=null,d)}return A?(g=dg(o,l,g.children,g.fallback,d),A=l.child,S=o.child.memoizedState,A.memoizedState=S===null?Zl(d):{baseLanes:S.baseLanes|d,cachePool:null},A.childLanes=o.childLanes&~d,l.memoizedState=jl,g):(d=fg(o,l,g.children,d),l.memoizedState=null,d)}function Mf(o,l){return l=mc({mode:"visible",children:l},o.mode,0,null),l.return=o,o.child=l}function fg(o,l,d,g){var S=o.child;return o=S.sibling,d=Cr(S,{mode:"visible",children:d}),!(l.mode&1)&&(d.lanes=g),d.return=l,d.sibling=null,o!==null&&(g=l.deletions,g===null?(l.deletions=[o],l.flags|=16):g.push(o)),l.child=d}function dg(o,l,d,g,S){var A=l.mode;o=o.child;var z=o.sibling,H={mode:"hidden",children:d};return!(A&1)&&l.child!==o?(d=l.child,d.childLanes=0,d.pendingProps=H,l.deletions=null):(d=Cr(o,H),d.subtreeFlags=o.subtreeFlags&14680064),z!==null?g=Cr(z,g):(g=$r(g,A,S,null),g.flags|=2),g.return=l,d.return=l,d.sibling=g,l.child=d,g}function Jl(o,l,d,g){return g!==null&&af(g),Vs(l,o.child,null,d),o=Mf(l,l.pendingProps.children),o.flags|=2,l.memoizedState=null,o}function pg(o,l,d){o.lanes|=l;var g=o.alternate;g!==null&&(g.lanes|=l),Qh(o.return,l,d)}function wf(o,l,d,g,S){var A=o.memoizedState;A===null?o.memoizedState={isBackwards:l,rendering:null,renderingStartTime:0,last:g,tail:d,tailMode:S}:(A.isBackwards=l,A.rendering=null,A.renderingStartTime=0,A.last=g,A.tail=d,A.tailMode=S)}function mg(o,l,d){var g=l.pendingProps,S=g.revealOrder,A=g.tail;if(Nn(o,l,g.children,d),g=Xt.current,g&2)g=g&1|2,l.flags|=128;else{if(o!==null&&o.flags&128)e:for(o=l.child;o!==null;){if(o.tag===13)o.memoizedState!==null&&pg(o,d,l);else if(o.tag===19)pg(o,d,l);else if(o.child!==null){o.child.return=o,o=o.child;continue}if(o===l)break e;for(;o.sibling===null;){if(o.return===null||o.return===l)break e;o=o.return}o.sibling.return=o.return,o=o.sibling}g&=1}if($e(Xt,g),!(l.mode&1))l.memoizedState=null;else switch(S){case"forwards":for(d=l.child,S=null;d!==null;)o=d.alternate,o!==null&&Bl(o)===null&&(S=d),d=d.sibling;d=S,d===null?(S=l.child,l.child=null):(S=d.sibling,d.sibling=null),wf(l,!1,S,d,A);break;case"backwards":for(d=null,S=l.child,l.child=null;S!==null;){if(o=S.alternate,o!==null&&Bl(o)===null){l.child=S;break}o=S.sibling,S.sibling=d,d=S,S=o}wf(l,!0,d,null,A);break;case"together":wf(l,!1,null,null,void 0);break;default:l.memoizedState=null}return l.child}function ir(o,l,d){if(o!==null&&(l.dependencies=o.dependencies),Ys|=l.lanes,!(d&l.childLanes))return null;if(o!==null&&l.child!==o.child)throw Error(a(153));if(l.child!==null){for(o=l.child,d=Cr(o,o.pendingProps),l.child=d,d.return=l;o.sibling!==null;)o=o.sibling,d=d.sibling=Cr(o,o.pendingProps),d.return=l;d.sibling=null}return l.child}function qy(o,l,d){switch(l.tag){case 3:cg(l),Hs();break;case 5:Im(l);break;case 1:Ot(l.type)&&Sr(l);break;case 4:lf(l,l.stateNode.containerInfo);break;case 10:gm(l,l.type._context,l.memoizedProps.value);break;case 13:var g=l.memoizedState;if(g!==null)return g.dehydrated!==null?($e(Xt,Xt.current&1),l.flags|=128,null):d&l.child.childLanes?hg(o,l,d):($e(Xt,Xt.current&1),o=ir(o,l,d),o!==null?o.sibling:null);$e(Xt,Xt.current&1);break;case 19:if(g=(d&l.childLanes)!==0,o.flags&128){if(g)return mg(o,l,d);l.flags|=128}var S=l.memoizedState;if(S!==null&&(S.rendering=null,S.tail=null,S.lastEffect=null),$e(Xt,Xt.current),g)break;return null;case 22:case 23:return l.lanes=0,og(o,l,d)}return ir(o,l,d)}function Yy(o,l){switch(rf(l),l.tag){case 1:return Ot(l.type)&&yr(),o=l.flags,o&65536?(l.flags=o&-65537|128,l):null;case 3:return Ws(),yt(ct),yt(bt),hf(),o=l.flags,o&65536&&!(o&128)?(l.flags=o&-65537|128,l):null;case 5:return cf(l),null;case 13:if(yt(Xt),o=l.memoizedState,o!==null&&o.dehydrated!==null){if(l.alternate===null)throw Error(a(340));Hs()}return o=l.flags,o&65536?(l.flags=o&-65537|128,l):null;case 19:return yt(Xt),null;case 4:return Ws(),null;case 10:return Kh(l.type._context),null;case 22:case 23:return Hf(),null;case 24:return null;default:return null}}var Kl=!1,jr=!1,jy=typeof WeakSet=="function"?WeakSet:Set,Le=null;function Ql(o,l){var d=o.ref;if(d!==null)if(typeof d=="function")try{d(null)}catch(g){Xn(o,l,g)}else d.current=null}function Ef(o,l,d){try{d()}catch(g){Xn(o,l,g)}}var gg=!1;function Zy(o,l){for(J(o.containerInfo),Le=l;Le!==null;)if(o=Le,l=o.child,(o.subtreeFlags&1028)!==0&&l!==null)l.return=o,Le=l;else for(;Le!==null;){o=Le;try{var d=o.alternate;if(o.flags&1024)switch(o.tag){case 0:case 11:case 15:break;case 1:if(d!==null){var g=d.memoizedProps,S=d.memoizedState,A=o.stateNode,z=A.getSnapshotBeforeUpdate(o.elementType===o.type?g:Si(o.type,g),S);A.__reactInternalSnapshotBeforeUpdate=z}break;case 3:Ie&&Fe(o.stateNode.containerInfo);break;case 5:case 6:case 4:case 17:break;default:throw Error(a(163))}}catch(H){Xn(o,o.return,H)}if(l=o.sibling,l!==null){l.return=o.return,Le=l;break}Le=o.return}return d=gg,gg=!1,d}function Zr(o,l,d){var g=l.updateQueue;if(g=g!==null?g.lastEffect:null,g!==null){var S=g=g.next;do{if((S.tag&o)===o){var A=S.destroy;S.destroy=void 0,A!==void 0&&Ef(l,d,A)}S=S.next}while(S!==g)}}function $o(o,l){if(l=l.updateQueue,l=l!==null?l.lastEffect:null,l!==null){var d=l=l.next;do{if((d.tag&o)===o){var g=d.create;d.destroy=g()}d=d.next}while(d!==l)}}function Af(o){var l=o.ref;if(l!==null){var d=o.stateNode;switch(o.tag){case 5:o=K(d);break;default:o=d}typeof l=="function"?l(o):l.current=o}}function vg(o,l,d){if(Ui&&typeof Ui.onCommitFiberUnmount=="function")try{Ui.onCommitFiberUnmount(Tl,l)}catch{}switch(l.tag){case 0:case 11:case 14:case 15:if(o=l.updateQueue,o!==null&&(o=o.lastEffect,o!==null)){var g=o=o.next;do{var S=g,A=S.destroy;S=S.tag,A!==void 0&&(S&2||S&4)&&Ef(l,d,A),g=g.next}while(g!==o)}break;case 1:if(Ql(l,d),o=l.stateNode,typeof o.componentWillUnmount=="function")try{o.props=l.memoizedProps,o.state=l.memoizedState,o.componentWillUnmount()}catch(z){Xn(l,d,z)}break;case 5:Ql(l,d);break;case 4:Ie?wg(o,l,d):de&&de&&(l=l.stateNode.containerInfo,d=Et(l),At(l,d))}}function _g(o,l,d){for(var g=l;;)if(vg(o,g,d),g.child===null||Ie&&g.tag===4){if(g===l)break;for(;g.sibling===null;){if(g.return===null||g.return===l)return;g=g.return}g.sibling.return=g.return,g=g.sibling}else g.child.return=g,g=g.child}function xg(o){var l=o.alternate;l!==null&&(o.alternate=null,xg(l)),o.child=null,o.deletions=null,o.sibling=null,o.tag===5&&(l=o.stateNode,l!==null&&Ee(l)),o.stateNode=null,o.return=null,o.dependencies=null,o.memoizedProps=null,o.memoizedState=null,o.pendingProps=null,o.stateNode=null,o.updateQueue=null}function yg(o){return o.tag===5||o.tag===3||o.tag===4}function Sg(o){e:for(;;){for(;o.sibling===null;){if(o.return===null||yg(o.return))return null;o=o.return}for(o.sibling.return=o.return,o=o.sibling;o.tag!==5&&o.tag!==6&&o.tag!==18;){if(o.flags&2||o.child===null||o.tag===4)continue e;o.child.return=o,o=o.child}if(!(o.flags&2))return o.stateNode}}function Mg(o){if(Ie){e:{for(var l=o.return;l!==null;){if(yg(l))break e;l=l.return}throw Error(a(160))}var d=l;switch(d.tag){case 5:l=d.stateNode,d.flags&32&&(Ft(l),d.flags&=-33),d=Sg(o),Tf(o,d,l);break;case 3:case 4:l=d.stateNode.containerInfo,d=Sg(o),bf(o,d,l);break;default:throw Error(a(161))}}}function bf(o,l,d){var g=o.tag;if(g===5||g===6)o=o.stateNode,l?Ve(d,o,l):Mt(d,o);else if(g!==4&&(o=o.child,o!==null))for(bf(o,l,d),o=o.sibling;o!==null;)bf(o,l,d),o=o.sibling}function Tf(o,l,d){var g=o.tag;if(g===5||g===6)o=o.stateNode,l?lt(d,o,l):ke(d,o);else if(g!==4&&(o=o.child,o!==null))for(Tf(o,l,d),o=o.sibling;o!==null;)Tf(o,l,d),o=o.sibling}function wg(o,l,d){for(var g=l,S=!1,A,z;;){if(!S){S=g.return;e:for(;;){if(S===null)throw Error(a(160));switch(A=S.stateNode,S.tag){case 5:z=!1;break e;case 3:A=A.containerInfo,z=!0;break e;case 4:A=A.containerInfo,z=!0;break e}S=S.return}S=!0}if(g.tag===5||g.tag===6)_g(o,g,d),z?ut(A,g.stateNode):wt(A,g.stateNode);else if(g.tag===18)z?ne(A,g.stateNode):te(A,g.stateNode);else if(g.tag===4){if(g.child!==null){A=g.stateNode.containerInfo,z=!0,g.child.return=g,g=g.child;continue}}else if(vg(o,g,d),g.child!==null){g.child.return=g,g=g.child;continue}if(g===l)break;for(;g.sibling===null;){if(g.return===null||g.return===l)return;g=g.return,g.tag===4&&(S=!1)}g.sibling.return=g.return,g=g.sibling}}function Cf(o,l){if(Ie){switch(l.tag){case 0:case 11:case 14:case 15:Zr(3,l,l.return),$o(3,l),Zr(5,l,l.return);return;case 1:return;case 5:var d=l.stateNode;if(d!=null){var g=l.memoizedProps;o=o!==null?o.memoizedProps:g;var S=l.type,A=l.updateQueue;l.updateQueue=null,A!==null&&at(d,A,S,o,g,l)}return;case 6:if(l.stateNode===null)throw Error(a(162));d=l.memoizedProps,ye(l.stateNode,o!==null?o.memoizedProps:d,d);return;case 3:N&&o!==null&&o.memoizedState.isDehydrated&&L(l.stateNode.containerInfo);return;case 12:return;case 13:$l(l);return;case 19:$l(l);return;case 17:return}throw Error(a(163))}switch(l.tag){case 0:case 11:case 14:case 15:Zr(3,l,l.return),$o(3,l),Zr(5,l,l.return);return;case 12:return;case 13:$l(l);return;case 19:$l(l);return;case 3:N&&o!==null&&o.memoizedState.isDehydrated&&L(l.stateNode.containerInfo);break;case 22:case 23:return}e:if(de){switch(l.tag){case 1:case 5:case 6:break e;case 3:case 4:l=l.stateNode,At(l.containerInfo,l.pendingChildren);break e}throw Error(a(163))}}function $l(o){var l=o.updateQueue;if(l!==null){o.updateQueue=null;var d=o.stateNode;d===null&&(d=o.stateNode=new jy),l.forEach(function(g){var S=sS.bind(null,o,g);d.has(g)||(d.add(g),g.then(S,S))})}}function Jy(o,l){for(Le=l;Le!==null;){l=Le;var d=l.deletions;if(d!==null)for(var g=0;g<d.length;g++){var S=d[g];try{var A=o;Ie?wg(A,S,l):_g(A,S,l);var z=S.alternate;z!==null&&(z.return=null),S.return=null}catch(Qe){Xn(S,l,Qe)}}if(d=l.child,l.subtreeFlags&12854&&d!==null)d.return=l,Le=d;else for(;Le!==null;){l=Le;try{var H=l.flags;if(H&32&&Ie&&Ft(l.stateNode),H&512){var ce=l.alternate;if(ce!==null){var Me=ce.ref;Me!==null&&(typeof Me=="function"?Me(null):Me.current=null)}}if(H&8192)switch(l.tag){case 13:if(l.memoizedState!==null){var Xe=l.alternate;(Xe===null||Xe.memoizedState===null)&&(Nf=hn())}break;case 22:var ht=l.memoizedState!==null,it=l.alternate,zt=it!==null&&it.memoizedState!==null;if(d=l,Ie){e:if(g=d,S=ht,A=null,Ie)for(var et=g;;){if(et.tag===5){if(A===null){A=et;var Cn=et.stateNode;S?V(Cn):le(et.stateNode,et.memoizedProps)}}else if(et.tag===6){if(A===null){var gi=et.stateNode;S?Be(gi):ve(gi,et.memoizedProps)}}else if((et.tag!==22&&et.tag!==23||et.memoizedState===null||et===g)&&et.child!==null){et.child.return=et,et=et.child;continue}if(et===g)break;for(;et.sibling===null;){if(et.return===null||et.return===g)break e;A===et&&(A=null),et=et.return}A===et&&(A=null),et.sibling.return=et.return,et=et.sibling}}if(ht&&!zt&&d.mode&1){Le=d;for(var ee=d.child;ee!==null;){for(d=Le=ee;Le!==null;){g=Le;var X=g.child;switch(g.tag){case 0:case 11:case 14:case 15:Zr(4,g,g.return);break;case 1:Ql(g,g.return);var se=g.stateNode;if(typeof se.componentWillUnmount=="function"){var Ne=g.return;try{se.props=g.memoizedProps,se.state=g.memoizedState,se.componentWillUnmount()}catch(Qe){Xn(g,Ne,Qe)}}break;case 5:Ql(g,g.return);break;case 22:if(g.memoizedState!==null){bg(d);continue}}X!==null?(X.return=g,Le=X):bg(d)}ee=ee.sibling}}}switch(H&4102){case 2:Mg(l),l.flags&=-3;break;case 6:Mg(l),l.flags&=-3,Cf(l.alternate,l);break;case 4096:l.flags&=-4097;break;case 4100:l.flags&=-4097,Cf(l.alternate,l);break;case 4:Cf(l.alternate,l)}}catch(Qe){Xn(l,l.return,Qe)}if(d=l.sibling,d!==null){d.return=l.return,Le=d;break}Le=l.return}}}function Ky(o,l,d){Le=o,Eg(o)}function Eg(o,l,d){for(var g=(o.mode&1)!==0;Le!==null;){var S=Le,A=S.child;if(S.tag===22&&g){var z=S.memoizedState!==null||Kl;if(!z){var H=S.alternate,ce=H!==null&&H.memoizedState!==null||jr;H=Kl;var Me=jr;if(Kl=z,(jr=ce)&&!Me)for(Le=S;Le!==null;)z=Le,ce=z.child,z.tag===22&&z.memoizedState!==null?Tg(S):ce!==null?(ce.return=z,Le=ce):Tg(S);for(;A!==null;)Le=A,Eg(A),A=A.sibling;Le=S,Kl=H,jr=Me}Ag(o)}else S.subtreeFlags&8772&&A!==null?(A.return=S,Le=A):Ag(o)}}function Ag(o){for(;Le!==null;){var l=Le;if(l.flags&8772){var d=l.alternate;try{if(l.flags&8772)switch(l.tag){case 0:case 11:case 15:jr||$o(5,l);break;case 1:var g=l.stateNode;if(l.flags&4&&!jr)if(d===null)g.componentDidMount();else{var S=l.elementType===l.type?d.memoizedProps:Si(l.type,d.memoizedProps);g.componentDidUpdate(S,d.memoizedState,g.__reactInternalSnapshotBeforeUpdate)}var A=l.updateQueue;A!==null&&xm(l,A,g);break;case 3:var z=l.updateQueue;if(z!==null){if(d=null,l.child!==null)switch(l.child.tag){case 5:d=K(l.child.stateNode);break;case 1:d=l.child.stateNode}xm(l,z,d)}break;case 5:var H=l.stateNode;d===null&&l.flags&4&&He(H,l.type,l.memoizedProps,l);break;case 6:break;case 4:break;case 12:break;case 13:if(N&&l.memoizedState===null){var ce=l.alternate;if(ce!==null){var Me=ce.memoizedState;if(Me!==null){var Xe=Me.dehydrated;Xe!==null&&W(Xe)}}}break;case 19:case 17:case 21:case 22:case 23:break;default:throw Error(a(163))}jr||l.flags&512&&Af(l)}catch(ht){Xn(l,l.return,ht)}}if(l===o){Le=null;break}if(d=l.sibling,d!==null){d.return=l.return,Le=d;break}Le=l.return}}function bg(o){for(;Le!==null;){var l=Le;if(l===o){Le=null;break}var d=l.sibling;if(d!==null){d.return=l.return,Le=d;break}Le=l.return}}function Tg(o){for(;Le!==null;){var l=Le;try{switch(l.tag){case 0:case 11:case 15:var d=l.return;try{$o(4,l)}catch(ce){Xn(l,d,ce)}break;case 1:var g=l.stateNode;if(typeof g.componentDidMount=="function"){var S=l.return;try{g.componentDidMount()}catch(ce){Xn(l,S,ce)}}var A=l.return;try{Af(l)}catch(ce){Xn(l,A,ce)}break;case 5:var z=l.return;try{Af(l)}catch(ce){Xn(l,z,ce)}}}catch(ce){Xn(l,l.return,ce)}if(l===o){Le=null;break}var H=l.sibling;if(H!==null){H.return=l.return,Le=H;break}Le=l.return}}var ec=0,tc=1,nc=2,ic=3,rc=4;if(typeof Symbol=="function"&&Symbol.for){var ea=Symbol.for;ec=ea("selector.component"),tc=ea("selector.has_pseudo_class"),nc=ea("selector.role"),ic=ea("selector.test_id"),rc=ea("selector.text")}function Rf(o){var l=Te(o);if(l!=null){if(typeof l.memoizedProps["data-testname"]!="string")throw Error(a(364));return l}if(o=R(o),o===null)throw Error(a(362));return o.stateNode.current}function Pf(o,l){switch(l.$$typeof){case ec:if(o.type===l.value)return!0;break;case tc:e:{l=l.value,o=[o,0];for(var d=0;d<o.length;){var g=o[d++],S=o[d++],A=l[S];if(g.tag!==5||!pe(g)){for(;A!=null&&Pf(g,A);)S++,A=l[S];if(S===l.length){l=!0;break e}else for(g=g.child;g!==null;)o.push(g,S),g=g.sibling}}l=!1}return l;case nc:if(o.tag===5&&he(o.stateNode,l.value))return!0;break;case rc:if((o.tag===5||o.tag===6)&&(o=ue(o),o!==null&&0<=o.indexOf(l.value)))return!0;break;case ic:if(o.tag===5&&(o=o.memoizedProps["data-testname"],typeof o=="string"&&o.toLowerCase()===l.value.toLowerCase()))return!0;break;default:throw Error(a(365))}return!1}function If(o){switch(o.$$typeof){case ec:return"<"+(I(o.value)||"Unknown")+">";case tc:return":has("+(If(o)||"")+")";case nc:return'[role="'+o.value+'"]';case rc:return'"'+o.value+'"';case ic:return'[data-testname="'+o.value+'"]';default:throw Error(a(365))}}function Cg(o,l){var d=[];o=[o,0];for(var g=0;g<o.length;){var S=o[g++],A=o[g++],z=l[A];if(S.tag!==5||!pe(S)){for(;z!=null&&Pf(S,z);)A++,z=l[A];if(A===l.length)d.push(S);else for(S=S.child;S!==null;)o.push(S,A),S=S.sibling}}return d}function Lf(o,l){if(!F)throw Error(a(363));o=Rf(o),o=Cg(o,l),l=[],o=Array.from(o);for(var d=0;d<o.length;){var g=o[d++];if(g.tag===5)pe(g)||l.push(g.stateNode);else for(g=g.child;g!==null;)o.push(g),g=g.sibling}return l}var Qy=Math.ceil,sc=c.ReactCurrentDispatcher,Df=c.ReactCurrentOwner,Qt=c.ReactCurrentBatchConfig,St=0,tn=null,nn=null,xn=0,ti=0,qs=Nt(0),ln=0,ta=null,Ys=0,oc=0,Uf=0,na=null,Gn=null,Nf=0,Ff=1/0;function js(){Ff=hn()+500}var ac=!1,Of=null,Er=null,lc=!1,Ar=null,cc=0,ia=0,Bf=null,uc=-1,hc=0;function Fn(){return St&6?hn():uc!==-1?uc:uc=hn()}function br(o){return o.mode&1?St&2&&xn!==0?xn&-xn:Uy.transition!==null?(hc===0&&(o=El,El<<=1,!(El&4194240)&&(El=64),hc=o),hc):(o=It,o!==0?o:_e()):1}function pi(o,l,d){if(50<ia)throw ia=0,Bf=null,Error(a(185));var g=fc(o,l);return g===null?null:(ko(g,l,d),(!(St&2)||g!==tn)&&(g===tn&&(!(St&2)&&(oc|=l),ln===4&&Tr(g,xn)),Wn(g,d),l===1&&St===0&&!(o.mode&1)&&(js(),Cl&&Fi())),g)}function fc(o,l){o.lanes|=l;var d=o.alternate;for(d!==null&&(d.lanes|=l),d=o,o=o.return;o!==null;)o.childLanes|=l,d=o.alternate,d!==null&&(d.childLanes|=l),d=o,o=o.return;return d.tag===3?d.stateNode:null}function Wn(o,l){var d=o.callbackNode;Ay(o,l);var g=bl(o,o===tn?xn:0);if(g===0)d!==null&&pm(d),o.callbackNode=null,o.callbackPriority=0;else if(l=g&-g,o.callbackPriority!==l){if(d!=null&&pm(d),l===1)o.tag===0?Dy(Pg.bind(null,o)):mm(Pg.bind(null,o)),Je?De(function(){St===0&&Fi()}):Xh(qh,Fi),d=null;else{switch(dm(g)){case 1:d=qh;break;case 4:d=Ry;break;case 16:d=Yh;break;case 536870912:d=Py;break;default:d=Yh}d=zg(d,Rg.bind(null,o))}o.callbackPriority=l,o.callbackNode=d}}function Rg(o,l){if(uc=-1,hc=0,St&6)throw Error(a(327));var d=o.callbackNode;if(Qr()&&o.callbackNode!==d)return null;var g=bl(o,o===tn?xn:0);if(g===0)return null;if(g&30||g&o.expiredLanes||l)l=dc(o,g);else{l=g;var S=St;St|=2;var A=Dg();(tn!==o||xn!==l)&&(js(),Jr(o,l));do try{tS();break}catch(H){Lg(o,H)}while(!0);Jh(),sc.current=A,St=S,nn!==null?l=0:(tn=null,xn=0,l=ln)}if(l!==0){if(l===2&&(S=Vh(o),S!==0&&(g=S,l=zf(o,S))),l===1)throw d=ta,Jr(o,0),Tr(o,g),Wn(o,hn()),d;if(l===6)Tr(o,g);else{if(S=o.current.alternate,!(g&30)&&!$y(S)&&(l=dc(o,g),l===2&&(A=Vh(o),A!==0&&(g=A,l=zf(o,A))),l===1))throw d=ta,Jr(o,0),Tr(o,g),Wn(o,hn()),d;switch(o.finishedWork=S,o.finishedLanes=g,l){case 0:case 1:throw Error(a(345));case 2:Kr(o,Gn);break;case 3:if(Tr(o,g),(g&130023424)===g&&(l=Nf+500-hn(),10<l)){if(bl(o,0)!==0)break;if(S=o.suspendedLanes,(S&g)!==g){Fn(),o.pingedLanes|=o.suspendedLanes&S;break}o.timeoutHandle=Se(Kr.bind(null,o,Gn),l);break}Kr(o,Gn);break;case 4:if(Tr(o,g),(g&4194240)===g)break;for(l=o.eventTimes,S=-1;0<g;){var z=31-Un(g);A=1<<z,z=l[z],z>S&&(S=z),g&=~A}if(g=S,g=hn()-g,g=(120>g?120:480>g?480:1080>g?1080:1920>g?1920:3e3>g?3e3:4320>g?4320:1960*Qy(g/1960))-g,10<g){o.timeoutHandle=Se(Kr.bind(null,o,Gn),g);break}Kr(o,Gn);break;case 5:Kr(o,Gn);break;default:throw Error(a(329))}}}return Wn(o,hn()),o.callbackNode===d?Rg.bind(null,o):null}function zf(o,l){var d=na;return o.current.memoizedState.isDehydrated&&(Jr(o,l).flags|=256),o=dc(o,l),o!==2&&(l=Gn,Gn=d,l!==null&&kf(l)),o}function kf(o){Gn===null?Gn=o:Gn.push.apply(Gn,o)}function $y(o){for(var l=o;;){if(l.flags&16384){var d=l.updateQueue;if(d!==null&&(d=d.stores,d!==null))for(var g=0;g<d.length;g++){var S=d[g],A=S.getSnapshot;S=S.value;try{if(!Ni(A(),S))return!1}catch{return!1}}}if(d=l.child,l.subtreeFlags&16384&&d!==null)d.return=l,l=d;else{if(l===o)break;for(;l.sibling===null;){if(l.return===null||l.return===o)return!0;l=l.return}l.sibling.return=l.return,l=l.sibling}}return!0}function Tr(o,l){for(l&=~Uf,l&=~oc,o.suspendedLanes|=l,o.pingedLanes&=~l,o=o.expirationTimes;0<l;){var d=31-Un(l),g=1<<d;o[d]=-1,l&=~g}}function Pg(o){if(St&6)throw Error(a(327));Qr();var l=bl(o,0);if(!(l&1))return Wn(o,hn()),null;var d=dc(o,l);if(o.tag!==0&&d===2){var g=Vh(o);g!==0&&(l=g,d=zf(o,g))}if(d===1)throw d=ta,Jr(o,0),Tr(o,l),Wn(o,hn()),d;if(d===6)throw Error(a(345));return o.finishedWork=o.current.alternate,o.finishedLanes=l,Kr(o,Gn),Wn(o,hn()),null}function Ig(o){Ar!==null&&Ar.tag===0&&!(St&6)&&Qr();var l=St;St|=1;var d=Qt.transition,g=It;try{if(Qt.transition=null,It=1,o)return o()}finally{It=g,Qt.transition=d,St=l,!(St&6)&&Fi()}}function Hf(){ti=qs.current,yt(qs)}function Jr(o,l){o.finishedWork=null,o.finishedLanes=0;var d=o.timeoutHandle;if(d!==nt&&(o.timeoutHandle=nt,tt(d)),nn!==null)for(d=nn.return;d!==null;){var g=d;switch(rf(g),g.tag){case 1:g=g.type.childContextTypes,g!=null&&yr();break;case 3:Ws(),yt(ct),yt(bt),hf();break;case 5:cf(g);break;case 4:Ws();break;case 13:yt(Xt);break;case 19:yt(Xt);break;case 10:Kh(g.type._context);break;case 22:case 23:Hf()}d=d.return}if(tn=o,nn=o=Cr(o.current,null),xn=ti=l,ln=0,ta=null,Uf=oc=Ys=0,Gn=na=null,Oi!==null){for(l=0;l<Oi.length;l++)if(d=Oi[l],g=d.interleaved,g!==null){d.interleaved=null;var S=g.next,A=d.pending;if(A!==null){var z=A.next;A.next=S,g.next=z}d.pending=g}Oi=null}return o}function Lg(o,l){do{var d=nn;try{if(Jh(),zl.current=Xl,kl){for(var g=jt.memoizedState;g!==null;){var S=g.queue;S!==null&&(S.pending=null),g=g.next}kl=!1}if(Xs=0,fn=An=jt=null,qo=!1,Yo=0,Df.current=null,d===null||d.return===null){ln=1,ta=l,nn=null;break}e:{var A=o,z=d.return,H=d,ce=l;if(l=xn,H.flags|=32768,ce!==null&&typeof ce=="object"&&typeof ce.then=="function"){var Me=ce,Xe=H,ht=Xe.tag;if(!(Xe.mode&1)&&(ht===0||ht===11||ht===15)){var it=Xe.alternate;it?(Xe.updateQueue=it.updateQueue,Xe.memoizedState=it.memoizedState,Xe.lanes=it.lanes):(Xe.updateQueue=null,Xe.memoizedState=null)}var zt=$m(z);if(zt!==null){zt.flags&=-257,eg(zt,z,H,A,l),zt.mode&1&&Qm(A,Me,l),l=zt,ce=Me;var et=l.updateQueue;if(et===null){var Cn=new Set;Cn.add(ce),l.updateQueue=Cn}else et.add(ce);break e}else{if(!(l&1)){Qm(A,Me,l),Vf();break e}ce=Error(a(426))}}else if(Gt&&H.mode&1){var gi=$m(z);if(gi!==null){!(gi.flags&65536)&&(gi.flags|=256),eg(gi,z,H,A,l),af(ce);break e}}A=ce,ln!==4&&(ln=2),na===null?na=[A]:na.push(A),ce=_f(ce,H),H=z;do{switch(H.tag){case 3:H.flags|=65536,l&=-l,H.lanes|=l;var ee=Jm(H,ce,l);_m(H,ee);break e;case 1:A=ce;var X=H.type,se=H.stateNode;if(!(H.flags&128)&&(typeof X.getDerivedStateFromError=="function"||se!==null&&typeof se.componentDidCatch=="function"&&(Er===null||!Er.has(se)))){H.flags|=65536,l&=-l,H.lanes|=l;var Ne=Km(H,A,l);_m(H,Ne);break e}}H=H.return}while(H!==null)}Ng(d)}catch(Qe){l=Qe,nn===d&&d!==null&&(nn=d=d.return);continue}break}while(!0)}function Dg(){var o=sc.current;return sc.current=Xl,o===null?Xl:o}function Vf(){(ln===0||ln===3||ln===2)&&(ln=4),tn===null||!(Ys&268435455)&&!(oc&268435455)||Tr(tn,xn)}function dc(o,l){var d=St;St|=2;var g=Dg();tn===o&&xn===l||Jr(o,l);do try{eS();break}catch(S){Lg(o,S)}while(!0);if(Jh(),St=d,sc.current=g,nn!==null)throw Error(a(261));return tn=null,xn=0,ln}function eS(){for(;nn!==null;)Ug(nn)}function tS(){for(;nn!==null&&!Ty();)Ug(nn)}function Ug(o){var l=Bg(o.alternate,o,ti);o.memoizedProps=o.pendingProps,l===null?Ng(o):nn=l,Df.current=null}function Ng(o){var l=o;do{var d=l.alternate;if(o=l.return,l.flags&32768){if(d=Yy(d,l),d!==null){d.flags&=32767,nn=d;return}if(o!==null)o.flags|=32768,o.subtreeFlags=0,o.deletions=null;else{ln=6,nn=null;return}}else if(d=Wy(d,l,ti),d!==null){nn=d;return}if(l=l.sibling,l!==null){nn=l;return}nn=l=o}while(l!==null);ln===0&&(ln=5)}function Kr(o,l){var d=It,g=Qt.transition;try{Qt.transition=null,It=1,nS(o,l,d)}finally{Qt.transition=g,It=d}return null}function nS(o,l,d){do Qr();while(Ar!==null);if(St&6)throw Error(a(327));var g=o.finishedWork,S=o.finishedLanes;if(g===null)return null;if(o.finishedWork=null,o.finishedLanes=0,g===o.current)throw Error(a(177));o.callbackNode=null,o.callbackPriority=0;var A=g.lanes|g.childLanes;if(by(o,A),o===tn&&(nn=tn=null,xn=0),!(g.subtreeFlags&2064)&&!(g.flags&2064)||lc||(lc=!0,zg(Yh,function(){return Qr(),null})),A=(g.flags&15990)!==0,g.subtreeFlags&15990||A){A=Qt.transition,Qt.transition=null;var z=It;It=1;var H=St;St|=4,Df.current=null,Zy(o,g),Jy(o,g),q(o.containerInfo),o.current=g,Ky(g),Cy(),St=H,It=z,Qt.transition=A}else o.current=g;if(lc&&(lc=!1,Ar=o,cc=S),A=o.pendingLanes,A===0&&(Er=null),Iy(g.stateNode),Wn(o,hn()),l!==null)for(d=o.onRecoverableError,g=0;g<l.length;g++)d(l[g]);if(ac)throw ac=!1,o=Of,Of=null,o;return cc&1&&o.tag!==0&&Qr(),A=o.pendingLanes,A&1?o===Bf?ia++:(ia=0,Bf=o):ia=0,Fi(),null}function Qr(){if(Ar!==null){var o=dm(cc),l=Qt.transition,d=It;try{if(Qt.transition=null,It=16>o?16:o,Ar===null)var g=!1;else{if(o=Ar,Ar=null,cc=0,St&6)throw Error(a(331));var S=St;for(St|=4,Le=o.current;Le!==null;){var A=Le,z=A.child;if(Le.flags&16){var H=A.deletions;if(H!==null){for(var ce=0;ce<H.length;ce++){var Me=H[ce];for(Le=Me;Le!==null;){var Xe=Le;switch(Xe.tag){case 0:case 11:case 15:Zr(8,Xe,A)}var ht=Xe.child;if(ht!==null)ht.return=Xe,Le=ht;else for(;Le!==null;){Xe=Le;var it=Xe.sibling,zt=Xe.return;if(xg(Xe),Xe===Me){Le=null;break}if(it!==null){it.return=zt,Le=it;break}Le=zt}}}var et=A.alternate;if(et!==null){var Cn=et.child;if(Cn!==null){et.child=null;do{var gi=Cn.sibling;Cn.sibling=null,Cn=gi}while(Cn!==null)}}Le=A}}if(A.subtreeFlags&2064&&z!==null)z.return=A,Le=z;else e:for(;Le!==null;){if(A=Le,A.flags&2048)switch(A.tag){case 0:case 11:case 15:Zr(9,A,A.return)}var ee=A.sibling;if(ee!==null){ee.return=A.return,Le=ee;break e}Le=A.return}}var X=o.current;for(Le=X;Le!==null;){z=Le;var se=z.child;if(z.subtreeFlags&2064&&se!==null)se.return=z,Le=se;else e:for(z=X;Le!==null;){if(H=Le,H.flags&2048)try{switch(H.tag){case 0:case 11:case 15:$o(9,H)}}catch(Qe){Xn(H,H.return,Qe)}if(H===z){Le=null;break e}var Ne=H.sibling;if(Ne!==null){Ne.return=H.return,Le=Ne;break e}Le=H.return}}if(St=S,Fi(),Ui&&typeof Ui.onPostCommitFiberRoot=="function")try{Ui.onPostCommitFiberRoot(Tl,o)}catch{}g=!0}return g}finally{It=d,Qt.transition=l}}return!1}function Fg(o,l,d){l=_f(d,l),l=Jm(o,l,1),wr(o,l),l=Fn(),o=fc(o,1),o!==null&&(ko(o,1,l),Wn(o,l))}function Xn(o,l,d){if(o.tag===3)Fg(o,o,d);else for(;l!==null;){if(l.tag===3){Fg(l,o,d);break}else if(l.tag===1){var g=l.stateNode;if(typeof l.type.getDerivedStateFromError=="function"||typeof g.componentDidCatch=="function"&&(Er===null||!Er.has(g))){o=_f(d,o),o=Km(l,o,1),wr(l,o),o=Fn(),l=fc(l,1),l!==null&&(ko(l,1,o),Wn(l,o));break}}l=l.return}}function iS(o,l,d){var g=o.pingCache;g!==null&&g.delete(l),l=Fn(),o.pingedLanes|=o.suspendedLanes&d,tn===o&&(xn&d)===d&&(ln===4||ln===3&&(xn&130023424)===xn&&500>hn()-Nf?Jr(o,0):Uf|=d),Wn(o,l)}function Og(o,l){l===0&&(o.mode&1?(l=Al,Al<<=1,!(Al&130023424)&&(Al=4194304)):l=1);var d=Fn();o=fc(o,l),o!==null&&(ko(o,l,d),Wn(o,d))}function rS(o){var l=o.memoizedState,d=0;l!==null&&(d=l.retryLane),Og(o,d)}function sS(o,l){var d=0;switch(o.tag){case 13:var g=o.stateNode,S=o.memoizedState;S!==null&&(d=S.retryLane);break;case 19:g=o.stateNode;break;default:throw Error(a(314))}g!==null&&g.delete(l),Og(o,d)}var Bg;Bg=function(o,l,d){if(o!==null)if(o.memoizedProps!==l.pendingProps||ct.current)ei=!0;else{if(!(o.lanes&d)&&!(l.flags&128))return ei=!1,qy(o,l,d);ei=!!(o.flags&131072)}else ei=!1,Gt&&l.flags&1048576&&Em(l,Fl,l.index);switch(l.lanes=0,l.tag){case 2:var g=l.type;o!==null&&(o.alternate=null,l.alternate=null,l.flags|=2),o=l.pendingProps;var S=Kn(l,bt.current);Bs(l,d),S=df(null,l,g,o,S,d);var A=pf();return l.flags|=1,typeof S=="object"&&S!==null&&typeof S.render=="function"&&S.$$typeof===void 0?(l.tag=1,l.memoizedState=null,l.updateQueue=null,Ot(g)?(A=!0,Sr(l)):A=!1,l.memoizedState=S.state!==null&&S.state!==void 0?S.state:null,$h(l),S.updater=Ul,l.stateNode=S,S._reactInternals=l,tf(l,g,o,d),l=Sf(null,l,g,!0,A,d)):(l.tag=0,Gt&&A&&nf(l),Nn(null,l,S,d),l=l.child),l;case 16:g=l.elementType;e:{switch(o!==null&&(o.alternate=null,l.alternate=null,l.flags|=2),o=l.pendingProps,S=g._init,g=S(g._payload),l.type=g,S=l.tag=aS(g),o=Si(g,o),S){case 0:l=yf(null,l,g,o,d);break e;case 1:l=lg(null,l,g,o,d);break e;case 11:l=ig(null,l,g,o,d);break e;case 14:l=rg(null,l,g,Si(g.type,o),d);break e}throw Error(a(306,g,""))}return l;case 0:return g=l.type,S=l.pendingProps,S=l.elementType===g?S:Si(g,S),yf(o,l,g,S,d);case 1:return g=l.type,S=l.pendingProps,S=l.elementType===g?S:Si(g,S),lg(o,l,g,S,d);case 3:e:{if(cg(l),o===null)throw Error(a(387));g=l.pendingProps,A=l.memoizedState,S=A.element,vm(o,l),Dl(l,g,null,d);var z=l.memoizedState;if(g=z.element,N&&A.isDehydrated)if(A={element:g,isDehydrated:!1,cache:z.cache,transitions:z.transitions},l.updateQueue.baseState=A,l.memoizedState=A,l.flags&256){S=Error(a(423)),l=ug(o,l,g,d,S);break e}else if(g!==S){S=Error(a(424)),l=ug(o,l,g,d,S);break e}else for(N&&($n=Fs(l.stateNode.containerInfo),Qn=l,Gt=!0,Mi=null,Ho=!1),d=Pm(l,null,g,d),l.child=d;d;)d.flags=d.flags&-3|4096,d=d.sibling;else{if(Hs(),g===S){l=ir(o,l,d);break e}Nn(o,l,g,d)}l=l.child}return l;case 5:return Im(l),o===null&&of(l),g=l.type,S=l.pendingProps,A=o!==null?o.memoizedProps:null,z=S.children,me(g,S)?z=null:A!==null&&me(g,A)&&(l.flags|=32),ag(o,l),Nn(o,l,z,d),l.child;case 6:return o===null&&of(l),null;case 13:return hg(o,l,d);case 4:return lf(l,l.stateNode.containerInfo),g=l.pendingProps,o===null?l.child=Vs(l,null,g,d):Nn(o,l,g,d),l.child;case 11:return g=l.type,S=l.pendingProps,S=l.elementType===g?S:Si(g,S),ig(o,l,g,S,d);case 7:return Nn(o,l,l.pendingProps,d),l.child;case 8:return Nn(o,l,l.pendingProps.children,d),l.child;case 12:return Nn(o,l,l.pendingProps.children,d),l.child;case 10:e:{if(g=l.type._context,S=l.pendingProps,A=l.memoizedProps,z=S.value,gm(l,g,z),A!==null)if(Ni(A.value,z)){if(A.children===S.children&&!ct.current){l=ir(o,l,d);break e}}else for(A=l.child,A!==null&&(A.return=l);A!==null;){var H=A.dependencies;if(H!==null){z=A.child;for(var ce=H.firstContext;ce!==null;){if(ce.context===g){if(A.tag===1){ce=$i(-1,d&-d),ce.tag=2;var Me=A.updateQueue;if(Me!==null){Me=Me.shared;var Xe=Me.pending;Xe===null?ce.next=ce:(ce.next=Xe.next,Xe.next=ce),Me.pending=ce}}A.lanes|=d,ce=A.alternate,ce!==null&&(ce.lanes|=d),Qh(A.return,d,l),H.lanes|=d;break}ce=ce.next}}else if(A.tag===10)z=A.type===l.type?null:A.child;else if(A.tag===18){if(z=A.return,z===null)throw Error(a(341));z.lanes|=d,H=z.alternate,H!==null&&(H.lanes|=d),Qh(z,d,l),z=A.sibling}else z=A.child;if(z!==null)z.return=A;else for(z=A;z!==null;){if(z===l){z=null;break}if(A=z.sibling,A!==null){A.return=z.return,z=A;break}z=z.return}A=z}Nn(o,l,S.children,d),l=l.child}return l;case 9:return S=l.type,g=l.pendingProps.children,Bs(l,d),S=ci(S),g=g(S),l.flags|=1,Nn(o,l,g,d),l.child;case 14:return g=l.type,S=Si(g,l.pendingProps),S=Si(g.type,S),rg(o,l,g,S,d);case 15:return sg(o,l,l.type,l.pendingProps,d);case 17:return g=l.type,S=l.pendingProps,S=l.elementType===g?S:Si(g,S),o!==null&&(o.alternate=null,l.alternate=null,l.flags|=2),l.tag=1,Ot(g)?(o=!0,Sr(l)):o=!1,Bs(l,d),Mm(l,g,S),tf(l,g,S,d),Sf(null,l,g,!0,o,d);case 19:return mg(o,l,d);case 22:return og(o,l,d)}throw Error(a(156,l.tag))};function zg(o,l){return Xh(o,l)}function oS(o,l,d,g){this.tag=o,this.key=d,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=l,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=g,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function mi(o,l,d,g){return new oS(o,l,d,g)}function Gf(o){return o=o.prototype,!(!o||!o.isReactComponent)}function aS(o){if(typeof o=="function")return Gf(o)?1:0;if(o!=null){if(o=o.$$typeof,o===M)return 11;if(o===E)return 14}return 2}function Cr(o,l){var d=o.alternate;return d===null?(d=mi(o.tag,l,o.key,o.mode),d.elementType=o.elementType,d.type=o.type,d.stateNode=o.stateNode,d.alternate=o,o.alternate=d):(d.pendingProps=l,d.type=o.type,d.flags=0,d.subtreeFlags=0,d.deletions=null),d.flags=o.flags&14680064,d.childLanes=o.childLanes,d.lanes=o.lanes,d.child=o.child,d.memoizedProps=o.memoizedProps,d.memoizedState=o.memoizedState,d.updateQueue=o.updateQueue,l=o.dependencies,d.dependencies=l===null?null:{lanes:l.lanes,firstContext:l.firstContext},d.sibling=o.sibling,d.index=o.index,d.ref=o.ref,d}function pc(o,l,d,g,S,A){var z=2;if(g=o,typeof o=="function")Gf(o)&&(z=1);else if(typeof o=="string")z=5;else e:switch(o){case f:return $r(d.children,S,A,l);case p:z=8,S|=8;break;case m:return o=mi(12,d,l,S|2),o.elementType=m,o.lanes=A,o;case y:return o=mi(13,d,l,S),o.elementType=y,o.lanes=A,o;case _:return o=mi(19,d,l,S),o.elementType=_,o.lanes=A,o;case T:return mc(d,S,A,l);default:if(typeof o=="object"&&o!==null)switch(o.$$typeof){case v:z=10;break e;case x:z=9;break e;case M:z=11;break e;case E:z=14;break e;case w:z=16,g=null;break e}throw Error(a(130,o==null?o:typeof o,""))}return l=mi(z,d,l,S),l.elementType=o,l.type=g,l.lanes=A,l}function $r(o,l,d,g){return o=mi(7,o,g,l),o.lanes=d,o}function mc(o,l,d,g){return o=mi(22,o,g,l),o.elementType=T,o.lanes=d,o.stateNode={},o}function Wf(o,l,d){return o=mi(6,o,null,l),o.lanes=d,o}function Xf(o,l,d){return l=mi(4,o.children!==null?o.children:[],o.key,l),l.lanes=d,l.stateNode={containerInfo:o.containerInfo,pendingChildren:null,implementation:o.implementation},l}function lS(o,l,d,g,S){this.tag=l,this.containerInfo=o,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=nt,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Gh(0),this.expirationTimes=Gh(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Gh(0),this.identifierPrefix=g,this.onRecoverableError=S,N&&(this.mutableSourceEagerHydrationData=null)}function kg(o,l,d,g,S,A,z,H,ce){return o=new lS(o,l,d,H,ce),l===1?(l=1,A===!0&&(l|=8)):l=0,A=mi(3,null,null,l),o.current=A,A.stateNode=o,A.memoizedState={element:g,isDehydrated:d,cache:null,transitions:null},$h(A),o}function Hg(o){if(!o)return qe;o=o._reactInternals;e:{if(k(o)!==o||o.tag!==1)throw Error(a(170));var l=o;do{switch(l.tag){case 3:l=l.stateNode.context;break e;case 1:if(Ot(l.type)){l=l.stateNode.__reactInternalMemoizedMergedChildContext;break e}}l=l.return}while(l!==null);throw Error(a(171))}if(o.tag===1){var d=o.type;if(Ot(d))return yi(o,d,l)}return l}function Vg(o){var l=o._reactInternals;if(l===void 0)throw typeof o.render=="function"?Error(a(188)):(o=Object.keys(o).join(","),Error(a(268,o)));return o=G(l),o===null?null:o.stateNode}function Gg(o,l){if(o=o.memoizedState,o!==null&&o.dehydrated!==null){var d=o.retryLane;o.retryLane=d!==0&&d<l?d:l}}function qf(o,l){Gg(o,l),(o=o.alternate)&&Gg(o,l)}function cS(o){return o=G(o),o===null?null:o.stateNode}function uS(){return null}return t.attemptContinuousHydration=function(o){if(o.tag===13){var l=Fn();pi(o,134217728,l),qf(o,134217728)}},t.attemptHydrationAtCurrentPriority=function(o){if(o.tag===13){var l=Fn(),d=br(o);pi(o,d,l),qf(o,d)}},t.attemptSynchronousHydration=function(o){switch(o.tag){case 3:var l=o.stateNode;if(l.current.memoizedState.isDehydrated){var d=zo(l.pendingLanes);d!==0&&(Wh(l,d|1),Wn(l,hn()),!(St&6)&&(js(),Fi()))}break;case 13:var g=Fn();Ig(function(){return pi(o,1,g)}),qf(o,1)}},t.batchedUpdates=function(o,l){var d=St;St|=1;try{return o(l)}finally{St=d,St===0&&(js(),Cl&&Fi())}},t.createComponentSelector=function(o){return{$$typeof:ec,value:o}},t.createContainer=function(o,l,d,g,S,A,z){return kg(o,l,!1,null,d,g,S,A,z)},t.createHasPseudoClassSelector=function(o){return{$$typeof:tc,value:o}},t.createHydrationContainer=function(o,l,d,g,S,A,z,H,ce){return o=kg(d,g,!0,o,S,A,z,H,ce),o.context=Hg(null),d=o.current,g=Fn(),S=br(d),A=$i(g,S),A.callback=l??null,wr(d,A),o.current.lanes=S,ko(o,S,g),Wn(o,g),o},t.createPortal=function(o,l,d){var g=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:h,key:g==null?null:""+g,children:o,containerInfo:l,implementation:d}},t.createRoleSelector=function(o){return{$$typeof:nc,value:o}},t.createTestNameSelector=function(o){return{$$typeof:ic,value:o}},t.createTextSelector=function(o){return{$$typeof:rc,value:o}},t.deferredUpdates=function(o){var l=It,d=Qt.transition;try{return Qt.transition=null,It=16,o()}finally{It=l,Qt.transition=d}},t.discreteUpdates=function(o,l,d,g,S){var A=It,z=Qt.transition;try{return Qt.transition=null,It=1,o(l,d,g,S)}finally{It=A,Qt.transition=z,St===0&&js()}},t.findAllNodes=Lf,t.findBoundingRects=function(o,l){if(!F)throw Error(a(363));l=Lf(o,l),o=[];for(var d=0;d<l.length;d++)o.push(Q(l[d]));for(l=o.length-1;0<l;l--){d=o[l];for(var g=d.x,S=g+d.width,A=d.y,z=A+d.height,H=l-1;0<=H;H--)if(l!==H){var ce=o[H],Me=ce.x,Xe=Me+ce.width,ht=ce.y,it=ht+ce.height;if(g>=Me&&A>=ht&&S<=Xe&&z<=it){o.splice(l,1);break}else if(g!==Me||d.width!==ce.width||it<A||ht>z){if(!(A!==ht||d.height!==ce.height||Xe<g||Me>S)){Me>g&&(ce.width+=Me-g,ce.x=g),Xe<S&&(ce.width=S-Me),o.splice(l,1);break}}else{ht>A&&(ce.height+=ht-A,ce.y=A),it<z&&(ce.height=z-ht),o.splice(l,1);break}}}return o},t.findHostInstance=Vg,t.findHostInstanceWithNoPortals=function(o){return o=C(o),o=o!==null?$(o):null,o===null?null:o.stateNode},t.findHostInstanceWithWarning=function(o){return Vg(o)},t.flushControlled=function(o){var l=St;St|=1;var d=Qt.transition,g=It;try{Qt.transition=null,It=1,o()}finally{It=g,Qt.transition=d,St=l,St===0&&(js(),Fi())}},t.flushPassiveEffects=Qr,t.flushSync=Ig,t.focusWithin=function(o,l){if(!F)throw Error(a(363));for(o=Rf(o),l=Cg(o,l),l=Array.from(l),o=0;o<l.length;){var d=l[o++];if(!pe(d)){if(d.tag===5&&Ye(d.stateNode))return!0;for(d=d.child;d!==null;)l.push(d),d=d.sibling}}return!1},t.getCurrentUpdatePriority=function(){return It},t.getFindAllNodesFailureDescription=function(o,l){if(!F)throw Error(a(363));var d=0,g=[];o=[Rf(o),0];for(var S=0;S<o.length;){var A=o[S++],z=o[S++],H=l[z];if((A.tag!==5||!pe(A))&&(Pf(A,H)&&(g.push(If(H)),z++,z>d&&(d=z)),z<l.length))for(A=A.child;A!==null;)o.push(A,z),A=A.sibling}if(d<l.length){for(o=[];d<l.length;d++)o.push(If(l[d]));return`findAllNodes was able to match part of the selector:
  `+(g.join(" > ")+`

No matching component was found for:
  `)+o.join(" > ")}return null},t.getPublicRootInstance=function(o){if(o=o.current,!o.child)return null;switch(o.child.tag){case 5:return K(o.child.stateNode);default:return o.child.stateNode}},t.injectIntoDevTools=function(o){if(o={bundleType:o.bundleType,version:o.version,rendererPackageName:o.rendererPackageName,rendererConfig:o.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:c.ReactCurrentDispatcher,findHostInstanceByFiber:cS,findFiberByHostInstance:o.findFiberByHostInstance||uS,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.0.0-fc46dba67-20220329"},typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u")o=!1;else{var l=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(l.isDisabled||!l.supportsFiber)o=!0;else{try{Tl=l.inject(o),Ui=l}catch{}o=!!l.checkDCE}}return o},t.isAlreadyRendering=function(){return!1},t.observeVisibleRects=function(o,l,d,g){if(!F)throw Error(a(363));o=Lf(o,l);var S=Ce(o,d,g).disconnect;return{disconnect:function(){S()}}},t.registerMutableSourceForHydration=function(o,l){var d=l._getVersion;d=d(l._source),o.mutableSourceEagerHydrationData==null?o.mutableSourceEagerHydrationData=[l,d]:o.mutableSourceEagerHydrationData.push(l,d)},t.runWithPriority=function(o,l){var d=It;try{return It=o,l()}finally{It=d}},t.shouldError=function(){return null},t.shouldSuspend=function(){return!1},t.updateContainer=function(o,l,d,g){var S=l.current,A=Fn(),z=br(S);return d=Hg(d),l.context===null?l.context=d:l.pendingContext=d,l=$i(A,z),l.payload={element:o},g=g===void 0?null:g,g!==null&&(l.callback=g),wr(S,l),o=pi(S,z,A),o!==null&&Ll(o,S,z),z},t};jx.exports=PC;var IC=jx.exports;const LC=Zv(IC);var Zx={exports:{}},Jx={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(r){function e(O,J){var q=O.length;O.push(J);e:for(;0<q;){var re=q-1>>>1,xe=O[re];if(0<i(xe,J))O[re]=J,O[q]=xe,q=re;else break e}}function t(O){return O.length===0?null:O[0]}function n(O){if(O.length===0)return null;var J=O[0],q=O.pop();if(q!==J){O[0]=q;e:for(var re=0,xe=O.length,Pe=xe>>>1;re<Pe;){var ie=2*(re+1)-1,me=O[ie],be=ie+1,Se=O[be];if(0>i(me,q))be<xe&&0>i(Se,me)?(O[re]=Se,O[be]=q,re=be):(O[re]=me,O[ie]=q,re=ie);else if(be<xe&&0>i(Se,q))O[re]=Se,O[be]=q,re=be;else break e}}return J}function i(O,J){var q=O.sortIndex-J.sortIndex;return q!==0?q:O.id-J.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;r.unstable_now=function(){return s.now()}}else{var a=Date,c=a.now();r.unstable_now=function(){return a.now()-c}}var u=[],h=[],f=1,p=null,m=3,v=!1,x=!1,M=!1,y=typeof setTimeout=="function"?setTimeout:null,_=typeof clearTimeout=="function"?clearTimeout:null,E=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function w(O){for(var J=t(h);J!==null;){if(J.callback===null)n(h);else if(J.startTime<=O)n(h),J.sortIndex=J.expirationTime,e(u,J);else break;J=t(h)}}function T(O){if(M=!1,w(O),!x)if(t(u)!==null)x=!0,K(U);else{var J=t(h);J!==null&&fe(T,J.startTime-O)}}function U(O,J){x=!1,M&&(M=!1,_(B),B=-1),v=!0;var q=m;try{for(w(J),p=t(u);p!==null&&(!(p.expirationTime>J)||O&&!C());){var re=p.callback;if(typeof re=="function"){p.callback=null,m=p.priorityLevel;var xe=re(p.expirationTime<=J);J=r.unstable_now(),typeof xe=="function"?p.callback=xe:p===t(u)&&n(u),w(J)}else n(u);p=t(u)}if(p!==null)var Pe=!0;else{var ie=t(h);ie!==null&&fe(T,ie.startTime-J),Pe=!1}return Pe}finally{p=null,m=q,v=!1}}var P=!1,I=null,B=-1,k=5,b=-1;function C(){return!(r.unstable_now()-b<k)}function G(){if(I!==null){var O=r.unstable_now();b=O;var J=!0;try{J=I(!0,O)}finally{J?Z():(P=!1,I=null)}}else P=!1}var Z;if(typeof E=="function")Z=function(){E(G)};else if(typeof MessageChannel<"u"){var $=new MessageChannel,oe=$.port2;$.port1.onmessage=G,Z=function(){oe.postMessage(null)}}else Z=function(){y(G,0)};function K(O){I=O,P||(P=!0,Z())}function fe(O,J){B=y(function(){O(r.unstable_now())},J)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(O){O.callback=null},r.unstable_continueExecution=function(){x||v||(x=!0,K(U))},r.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):k=0<O?Math.floor(1e3/O):5},r.unstable_getCurrentPriorityLevel=function(){return m},r.unstable_getFirstCallbackNode=function(){return t(u)},r.unstable_next=function(O){switch(m){case 1:case 2:case 3:var J=3;break;default:J=m}var q=m;m=J;try{return O()}finally{m=q}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(O,J){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var q=m;m=O;try{return J()}finally{m=q}},r.unstable_scheduleCallback=function(O,J,q){var re=r.unstable_now();switch(typeof q=="object"&&q!==null?(q=q.delay,q=typeof q=="number"&&0<q?re+q:re):q=re,O){case 1:var xe=-1;break;case 2:xe=250;break;case 5:xe=1073741823;break;case 4:xe=1e4;break;default:xe=5e3}return xe=q+xe,O={id:f++,callback:J,priorityLevel:O,startTime:q,expirationTime:xe,sortIndex:-1},q>re?(O.sortIndex=q,e(h,O),t(u)===null&&O===t(h)&&(M?(_(B),B=-1):M=!0,fe(T,q-re))):(O.sortIndex=xe,e(u,O),x||v||(x=!0,K(U))),O},r.unstable_shouldYield=C,r.unstable_wrapCallback=function(O){var J=m;return function(){var q=m;m=J;try{return O.apply(this,arguments)}finally{m=q}}}})(Jx);Zx.exports=Jx;var Av=Zx.exports;const lm={},Kx=r=>void Object.assign(lm,r);function DC(r,e){function t(f,{args:p=[],attach:m,...v},x){let M=`${f[0].toUpperCase()}${f.slice(1)}`,y;if(f==="primitive"){if(v.object===void 0)throw new Error("R3F: Primitives without 'object' are invalid!");const _=v.object;y=go(_,{type:f,root:x,attach:m,primitive:!0})}else{const _=lm[M];if(!_)throw new Error(`R3F: ${M} is not part of the THREE namespace! Did you forget to extend? See: https://docs.pmnd.rs/react-three-fiber/api/objects#using-3rd-party-objects-declaratively`);if(!Array.isArray(p))throw new Error("R3F: The args prop must be an array!");y=go(new _(...p),{type:f,root:x,attach:m,memoizedProps:{args:p}})}return y.__r3f.attach===void 0&&(y instanceof gt?y.__r3f.attach="geometry":y instanceof wn&&(y.__r3f.attach="material")),M!=="inject"&&kd(y,v),y}function n(f,p){let m=!1;if(p){var v,x;(v=p.__r3f)!=null&&v.attach?zd(f,p,p.__r3f.attach):p.isObject3D&&f.isObject3D&&(f.add(p),m=!0),m||(x=f.__r3f)==null||x.objects.push(p),p.__r3f||go(p,{}),p.__r3f.parent=f,pp(p),vo(p)}}function i(f,p,m){let v=!1;if(p){var x,M;if((x=p.__r3f)!=null&&x.attach)zd(f,p,p.__r3f.attach);else if(p.isObject3D&&f.isObject3D){p.parent=f,p.dispatchEvent({type:"added"}),f.dispatchEvent({type:"childadded",child:p});const y=f.children.filter(E=>E!==p),_=y.indexOf(m);f.children=[...y.slice(0,_),p,...y.slice(_)],v=!0}v||(M=f.__r3f)==null||M.objects.push(p),p.__r3f||go(p,{}),p.__r3f.parent=f,pp(p),vo(p)}}function s(f,p,m=!1){f&&[...f].forEach(v=>a(p,v,m))}function a(f,p,m){if(p){var v,x,M;if(p.__r3f&&(p.__r3f.parent=null),(v=f.__r3f)!=null&&v.objects&&(f.__r3f.objects=f.__r3f.objects.filter(T=>T!==p)),(x=p.__r3f)!=null&&x.attach)Pv(f,p,p.__r3f.attach);else if(p.isObject3D&&f.isObject3D){var y;f.remove(p),(y=p.__r3f)!=null&&y.root&&HC(gu(p),p)}const E=(M=p.__r3f)==null?void 0:M.primitive,w=!E&&(m===void 0?p.dispose!==null:m);if(!E){var _;s((_=p.__r3f)==null?void 0:_.objects,p,w),s(p.children,p,w)}if(delete p.__r3f,w&&p.dispose&&p.type!=="Scene"){const T=()=>{try{p.dispose()}catch{}};typeof IS_REACT_ACT_ENVIRONMENT>"u"?Av.unstable_scheduleCallback(Av.unstable_IdlePriority,T):T()}vo(f)}}function c(f,p,m,v){var x;const M=(x=f.__r3f)==null?void 0:x.parent;if(!M)return;const y=t(p,m,f.__r3f.root);if(f.children){for(const _ of f.children)_.__r3f&&n(y,_);f.children=f.children.filter(_=>!_.__r3f)}f.__r3f.objects.forEach(_=>n(y,_)),f.__r3f.objects=[],f.__r3f.autoRemovedBeforeAppend||a(M,f),y.parent&&(y.__r3f.autoRemovedBeforeAppend=!0),n(M,y),y.raycast&&y.__r3f.eventCount&&gu(y).getState().internal.interaction.push(y),[v,v.alternate].forEach(_=>{_!==null&&(_.stateNode=y,_.ref&&(typeof _.ref=="function"?_.ref(y):_.ref.current=y))})}const u=()=>{};return{reconciler:LC({createInstance:t,removeChild:a,appendChild:n,appendInitialChild:n,insertBefore:i,supportsMutation:!0,isPrimaryRenderer:!1,supportsPersistence:!1,supportsHydration:!1,noTimeout:-1,appendChildToContainer:(f,p)=>{if(!p)return;const m=f.getState().scene;m.__r3f&&(m.__r3f.root=f,n(m,p))},removeChildFromContainer:(f,p)=>{p&&a(f.getState().scene,p)},insertInContainerBefore:(f,p,m)=>{if(!p||!m)return;const v=f.getState().scene;v.__r3f&&i(v,p,m)},getRootHostContext:()=>null,getChildHostContext:f=>f,finalizeInitialChildren(f){var p;return!!((p=f==null?void 0:f.__r3f)!=null?p:{}).handlers},prepareUpdate(f,p,m,v){var x;if(((x=f==null?void 0:f.__r3f)!=null?x:{}).primitive&&v.object&&v.object!==f)return[!0];{const{args:y=[],children:_,...E}=v,{args:w=[],children:T,...U}=m;if(!Array.isArray(y))throw new Error("R3F: the args prop must be an array!");if(y.some((I,B)=>I!==w[B]))return[!0];const P=ry(f,E,U,!0);return P.changes.length?[!1,P]:null}},commitUpdate(f,[p,m],v,x,M,y){p?c(f,v,M,y):kd(f,m)},commitMount(f,p,m,v){var x;const M=(x=f.__r3f)!=null?x:{};f.raycast&&M.handlers&&M.eventCount&&gu(f).getState().internal.interaction.push(f)},getPublicInstance:f=>f,prepareForCommit:()=>null,preparePortalMount:f=>go(f.getState().scene),resetAfterCommit:()=>{},shouldSetTextContent:()=>!1,clearContainer:()=>!1,hideInstance(f){var p;const{attach:m,parent:v}=(p=f.__r3f)!=null?p:{};m&&v&&Pv(v,f,m),f.isObject3D&&(f.visible=!1),vo(f)},unhideInstance(f,p){var m;const{attach:v,parent:x}=(m=f.__r3f)!=null?m:{};v&&x&&zd(x,f,v),(f.isObject3D&&p.visible==null||p.visible)&&(f.visible=!0),vo(f)},createTextInstance:u,hideTextInstance:u,unhideTextInstance:u,getCurrentEventPriority:()=>e?e():wo.DefaultEventPriority,beforeActiveInstanceBlur:()=>{},afterActiveInstanceBlur:()=>{},detachDeletedInstance:()=>{},now:typeof performance<"u"&&Ht.fun(performance.now)?performance.now:Ht.fun(Date.now)?Date.now:()=>0,scheduleTimeout:Ht.fun(setTimeout)?setTimeout:void 0,cancelTimeout:Ht.fun(clearTimeout)?clearTimeout:void 0}),applyProps:kd}}var bv,Tv;const Bd=r=>"colorSpace"in r||"outputColorSpace"in r,Qx=()=>{var r;return(r=lm.ColorManagement)!=null?r:null},$x=r=>r&&r.isOrthographicCamera,UC=r=>r&&r.hasOwnProperty("current"),pl=typeof window<"u"&&((bv=window.document)!=null&&bv.createElement||((Tv=window.navigator)==null?void 0:Tv.product)==="ReactNative")?ae.useLayoutEffect:ae.useEffect;function ey(r){const e=ae.useRef(r);return pl(()=>void(e.current=r),[r]),e}function NC({set:r}){return pl(()=>(r(new Promise(()=>null)),()=>r(!1)),[r]),null}class ty extends ae.Component{constructor(...e){super(...e),this.state={error:!1}}componentDidCatch(e){this.props.set(e)}render(){return this.state.error?null:this.props.children}}ty.getDerivedStateFromError=()=>({error:!0});const ny="__default",Cv=new Map,FC=r=>r&&!!r.memoized&&!!r.changes;function iy(r){var e;const t=typeof window<"u"?(e=window.devicePixelRatio)!=null?e:2:1;return Array.isArray(r)?Math.min(Math.max(r[0],t),r[1]):r}const va=r=>{var e;return(e=r.__r3f)==null?void 0:e.root.getState()};function gu(r){let e=r.__r3f.root;for(;e.getState().previousRoot;)e=e.getState().previousRoot;return e}const Ht={obj:r=>r===Object(r)&&!Ht.arr(r)&&typeof r!="function",fun:r=>typeof r=="function",str:r=>typeof r=="string",num:r=>typeof r=="number",boo:r=>typeof r=="boolean",und:r=>r===void 0,arr:r=>Array.isArray(r),equ(r,e,{arrays:t="shallow",objects:n="reference",strict:i=!0}={}){if(typeof r!=typeof e||!!r!=!!e)return!1;if(Ht.str(r)||Ht.num(r)||Ht.boo(r))return r===e;const s=Ht.obj(r);if(s&&n==="reference")return r===e;const a=Ht.arr(r);if(a&&t==="reference")return r===e;if((a||s)&&r===e)return!0;let c;for(c in r)if(!(c in e))return!1;if(s&&t==="shallow"&&n==="shallow"){for(c in i?e:r)if(!Ht.equ(r[c],e[c],{strict:i,objects:"reference"}))return!1}else for(c in i?e:r)if(r[c]!==e[c])return!1;if(Ht.und(c)){if(a&&r.length===0&&e.length===0||s&&Object.keys(r).length===0&&Object.keys(e).length===0)return!0;if(r!==e)return!1}return!0}};function OC(r){r.dispose&&r.type!=="Scene"&&r.dispose();for(const e in r)e.dispose==null||e.dispose(),delete r[e]}function go(r,e){const t=r;return t.__r3f={type:"",root:null,previousAttach:null,memoizedProps:{},eventCount:0,handlers:{},objects:[],parent:null,...e},r}function dp(r,e){let t=r;if(e.includes("-")){const n=e.split("-"),i=n.pop();return t=n.reduce((s,a)=>s[a],r),{target:t,key:i}}else return{target:t,key:e}}const Rv=/-\d+$/;function zd(r,e,t){if(Ht.str(t)){if(Rv.test(t)){const s=t.replace(Rv,""),{target:a,key:c}=dp(r,s);Array.isArray(a[c])||(a[c]=[])}const{target:n,key:i}=dp(r,t);e.__r3f.previousAttach=n[i],n[i]=e}else e.__r3f.previousAttach=t(r,e)}function Pv(r,e,t){var n,i;if(Ht.str(t)){const{target:s,key:a}=dp(r,t),c=e.__r3f.previousAttach;c===void 0?delete s[a]:s[a]=c}else(n=e.__r3f)==null||n.previousAttach==null||n.previousAttach(r,e);(i=e.__r3f)==null||delete i.previousAttach}function ry(r,{children:e,key:t,ref:n,...i},{children:s,key:a,ref:c,...u}={},h=!1){const f=r.__r3f,p=Object.entries(i),m=[];if(h){const x=Object.keys(u);for(let M=0;M<x.length;M++)i.hasOwnProperty(x[M])||p.unshift([x[M],ny+"remove"])}p.forEach(([x,M])=>{var y;if((y=r.__r3f)!=null&&y.primitive&&x==="object"||Ht.equ(M,u[x]))return;if(/^on(Pointer|Click|DoubleClick|ContextMenu|Wheel)/.test(x))return m.push([x,M,!0,[]]);let _=[];x.includes("-")&&(_=x.split("-")),m.push([x,M,!1,_]);for(const E in i){const w=i[E];E.startsWith(`${x}-`)&&m.push([E,w,!1,E.split("-")])}});const v={...i};return f!=null&&f.memoizedProps&&f!=null&&f.memoizedProps.args&&(v.args=f.memoizedProps.args),f!=null&&f.memoizedProps&&f!=null&&f.memoizedProps.attach&&(v.attach=f.memoizedProps.attach),{memoized:v,changes:m}}const BC=typeof process<"u"&&!1;function kd(r,e){var t;const n=r.__r3f,i=n==null?void 0:n.root,s=i==null||i.getState==null?void 0:i.getState(),{memoized:a,changes:c}=FC(e)?e:ry(r,e),u=n==null?void 0:n.eventCount;r.__r3f&&(r.__r3f.memoizedProps=a);for(let f=0;f<c.length;f++){let[p,m,v,x]=c[f];if(Bd(r)){const E="srgb",w="srgb-linear";p==="encoding"?(p="colorSpace",m=m===3001?E:w):p==="outputEncoding"&&(p="outputColorSpace",m=m===3001?E:w)}let M=r,y=M[p];if(x.length&&(y=x.reduce((_,E)=>_[E],r),!(y&&y.set))){const[_,...E]=x.reverse();M=E.reverse().reduce((w,T)=>w[T],r),p=_}if(m===ny+"remove")if(M.constructor){let _=Cv.get(M.constructor);_||(_=new M.constructor,Cv.set(M.constructor,_)),m=_[p]}else m=0;if(v&&n)m?n.handlers[p]=m:delete n.handlers[p],n.eventCount=Object.keys(n.handlers).length;else if(y&&y.set&&(y.copy||y instanceof Ms)){if(Array.isArray(m))y.fromArray?y.fromArray(m):y.set(...m);else if(y.copy&&m&&m.constructor&&(BC?y.constructor.name===m.constructor.name:y.constructor===m.constructor))y.copy(m);else if(m!==void 0){const _=y instanceof Ue;!_&&y.setScalar?y.setScalar(m):y instanceof Ms&&m instanceof Ms?y.mask=m.mask:y.set(m),!Qx()&&s&&!s.linear&&_&&y.convertSRGBToLinear()}}else if(M[p]=m,M[p]instanceof Yt&&M[p].format===Ln&&M[p].type===Ri&&s){const _=M[p];Bd(_)&&Bd(s.gl)?_.colorSpace=s.gl.outputColorSpace:_.encoding=s.gl.outputEncoding}vo(r)}if(n&&n.parent&&r.raycast&&u!==n.eventCount){const f=gu(r).getState().internal,p=f.interaction.indexOf(r);p>-1&&f.interaction.splice(p,1),n.eventCount&&f.interaction.push(r)}return!(c.length===1&&c[0][0]==="onUpdate")&&c.length&&(t=r.__r3f)!=null&&t.parent&&pp(r),r}function vo(r){var e,t;const n=(e=r.__r3f)==null||(t=e.root)==null||t.getState==null?void 0:t.getState();n&&n.internal.frames===0&&n.invalidate()}function pp(r){r.onUpdate==null||r.onUpdate(r)}function zC(r,e){r.manual||($x(r)?(r.left=e.width/-2,r.right=e.width/2,r.top=e.height/2,r.bottom=e.height/-2):r.aspect=e.width/e.height,r.updateProjectionMatrix(),r.updateMatrixWorld())}function au(r){return(r.eventObject||r.object).uuid+"/"+r.index+r.instanceId}function kC(){var r;const e=typeof self<"u"&&self||typeof window<"u"&&window;if(!e)return wo.DefaultEventPriority;switch((r=e.event)==null?void 0:r.type){case"click":case"contextmenu":case"dblclick":case"pointercancel":case"pointerdown":case"pointerup":return wo.DiscreteEventPriority;case"pointermove":case"pointerout":case"pointerover":case"pointerenter":case"pointerleave":case"wheel":return wo.ContinuousEventPriority;default:return wo.DefaultEventPriority}}function sy(r,e,t,n){const i=t.get(e);i&&(t.delete(e),t.size===0&&(r.delete(n),i.target.releasePointerCapture(n)))}function HC(r,e){const{internal:t}=r.getState();t.interaction=t.interaction.filter(n=>n!==e),t.initialHits=t.initialHits.filter(n=>n!==e),t.hovered.forEach((n,i)=>{(n.eventObject===e||n.object===e)&&t.hovered.delete(i)}),t.capturedMap.forEach((n,i)=>{sy(t.capturedMap,e,n,i)})}function VC(r){function e(u){const{internal:h}=r.getState(),f=u.offsetX-h.initialClick[0],p=u.offsetY-h.initialClick[1];return Math.round(Math.sqrt(f*f+p*p))}function t(u){return u.filter(h=>["Move","Over","Enter","Out","Leave"].some(f=>{var p;return(p=h.__r3f)==null?void 0:p.handlers["onPointer"+f]}))}function n(u,h){const f=r.getState(),p=new Set,m=[],v=h?h(f.internal.interaction):f.internal.interaction;for(let _=0;_<v.length;_++){const E=va(v[_]);E&&(E.raycaster.camera=void 0)}f.previousRoot||f.events.compute==null||f.events.compute(u,f);function x(_){const E=va(_);if(!E||!E.events.enabled||E.raycaster.camera===null)return[];if(E.raycaster.camera===void 0){var w;E.events.compute==null||E.events.compute(u,E,(w=E.previousRoot)==null?void 0:w.getState()),E.raycaster.camera===void 0&&(E.raycaster.camera=null)}return E.raycaster.camera?E.raycaster.intersectObject(_,!0):[]}let M=v.flatMap(x).sort((_,E)=>{const w=va(_.object),T=va(E.object);return!w||!T?_.distance-E.distance:T.events.priority-w.events.priority||_.distance-E.distance}).filter(_=>{const E=au(_);return p.has(E)?!1:(p.add(E),!0)});f.events.filter&&(M=f.events.filter(M,f));for(const _ of M){let E=_.object;for(;E;){var y;(y=E.__r3f)!=null&&y.eventCount&&m.push({..._,eventObject:E}),E=E.parent}}if("pointerId"in u&&f.internal.capturedMap.has(u.pointerId))for(let _ of f.internal.capturedMap.get(u.pointerId).values())p.has(au(_.intersection))||m.push(_.intersection);return m}function i(u,h,f,p){const m=r.getState();if(u.length){const v={stopped:!1};for(const x of u){const M=va(x.object)||m,{raycaster:y,pointer:_,camera:E,internal:w}=M,T=new D(_.x,_.y,0).unproject(E),U=b=>{var C,G;return(C=(G=w.capturedMap.get(b))==null?void 0:G.has(x.eventObject))!=null?C:!1},P=b=>{const C={intersection:x,target:h.target};w.capturedMap.has(b)?w.capturedMap.get(b).set(x.eventObject,C):w.capturedMap.set(b,new Map([[x.eventObject,C]])),h.target.setPointerCapture(b)},I=b=>{const C=w.capturedMap.get(b);C&&sy(w.capturedMap,x.eventObject,C,b)};let B={};for(let b in h){let C=h[b];typeof C!="function"&&(B[b]=C)}let k={...x,...B,pointer:_,intersections:u,stopped:v.stopped,delta:f,unprojectedPoint:T,ray:y.ray,camera:E,stopPropagation(){const b="pointerId"in h&&w.capturedMap.get(h.pointerId);if((!b||b.has(x.eventObject))&&(k.stopped=v.stopped=!0,w.hovered.size&&Array.from(w.hovered.values()).find(C=>C.eventObject===x.eventObject))){const C=u.slice(0,u.indexOf(x));s([...C,x])}},target:{hasPointerCapture:U,setPointerCapture:P,releasePointerCapture:I},currentTarget:{hasPointerCapture:U,setPointerCapture:P,releasePointerCapture:I},nativeEvent:h};if(p(k),v.stopped===!0)break}}return u}function s(u){const{internal:h}=r.getState();for(const f of h.hovered.values())if(!u.length||!u.find(p=>p.object===f.object&&p.index===f.index&&p.instanceId===f.instanceId)){const m=f.eventObject.__r3f,v=m==null?void 0:m.handlers;if(h.hovered.delete(au(f)),m!=null&&m.eventCount){const x={...f,intersections:u};v.onPointerOut==null||v.onPointerOut(x),v.onPointerLeave==null||v.onPointerLeave(x)}}}function a(u,h){for(let f=0;f<h.length;f++){const p=h[f].__r3f;p==null||p.handlers.onPointerMissed==null||p.handlers.onPointerMissed(u)}}function c(u){switch(u){case"onPointerLeave":case"onPointerCancel":return()=>s([]);case"onLostPointerCapture":return h=>{const{internal:f}=r.getState();"pointerId"in h&&f.capturedMap.has(h.pointerId)&&requestAnimationFrame(()=>{f.capturedMap.has(h.pointerId)&&(f.capturedMap.delete(h.pointerId),s([]))})}}return function(f){const{onPointerMissed:p,internal:m}=r.getState();m.lastEvent.current=f;const v=u==="onPointerMove",x=u==="onClick"||u==="onContextMenu"||u==="onDoubleClick",y=n(f,v?t:void 0),_=x?e(f):0;u==="onPointerDown"&&(m.initialClick=[f.offsetX,f.offsetY],m.initialHits=y.map(w=>w.eventObject)),x&&!y.length&&_<=2&&(a(f,m.interaction),p&&p(f)),v&&s(y);function E(w){const T=w.eventObject,U=T.__r3f,P=U==null?void 0:U.handlers;if(U!=null&&U.eventCount)if(v){if(P.onPointerOver||P.onPointerEnter||P.onPointerOut||P.onPointerLeave){const I=au(w),B=m.hovered.get(I);B?B.stopped&&w.stopPropagation():(m.hovered.set(I,w),P.onPointerOver==null||P.onPointerOver(w),P.onPointerEnter==null||P.onPointerEnter(w))}P.onPointerMove==null||P.onPointerMove(w)}else{const I=P[u];I?(!x||m.initialHits.includes(T))&&(a(f,m.interaction.filter(B=>!m.initialHits.includes(B))),I(w)):x&&m.initialHits.includes(T)&&a(f,m.interaction.filter(B=>!m.initialHits.includes(B)))}}i(y,f,_,E)}}return{handlePointer:c}}const oy=r=>!!(r!=null&&r.render),ay=ae.createContext(null),GC=(r,e)=>{const t=TC((c,u)=>{const h=new D,f=new D,p=new D;function m(_=u().camera,E=f,w=u().size){const{width:T,height:U,top:P,left:I}=w,B=T/U;E instanceof D?p.copy(E):p.set(...E);const k=_.getWorldPosition(h).distanceTo(p);if($x(_))return{width:T/_.zoom,height:U/_.zoom,top:P,left:I,factor:1,distance:k,aspect:B};{const b=_.fov*Math.PI/180,C=2*Math.tan(b/2)*k,G=C*(T/U);return{width:G,height:C,top:P,left:I,factor:T/G,distance:k,aspect:B}}}let v;const x=_=>c(E=>({performance:{...E.performance,current:_}})),M=new ge;return{set:c,get:u,gl:null,camera:null,raycaster:null,events:{priority:1,enabled:!0,connected:!1},xr:null,scene:null,invalidate:(_=1)=>r(u(),_),advance:(_,E)=>e(_,E,u()),legacy:!1,linear:!1,flat:!1,controls:null,clock:new im,pointer:M,mouse:M,frameloop:"always",onPointerMissed:void 0,performance:{current:1,min:.5,max:1,debounce:200,regress:()=>{const _=u();v&&clearTimeout(v),_.performance.current!==_.performance.min&&x(_.performance.min),v=setTimeout(()=>x(u().performance.max),_.performance.debounce)}},size:{width:0,height:0,top:0,left:0,updateStyle:!1},viewport:{initialDpr:0,dpr:0,width:0,height:0,top:0,left:0,aspect:0,distance:0,factor:0,getCurrentViewport:m},setEvents:_=>c(E=>({...E,events:{...E.events,..._}})),setSize:(_,E,w,T,U)=>{const P=u().camera,I={width:_,height:E,top:T||0,left:U||0,updateStyle:w};c(B=>({size:I,viewport:{...B.viewport,...m(P,f,I)}}))},setDpr:_=>c(E=>{const w=iy(_);return{viewport:{...E.viewport,dpr:w,initialDpr:E.viewport.initialDpr||w}}}),setFrameloop:(_="always")=>{const E=u().clock;E.stop(),E.elapsedTime=0,_!=="never"&&(E.start(),E.elapsedTime=0),c(()=>({frameloop:_}))},previousRoot:void 0,internal:{active:!1,priority:0,frames:0,lastEvent:ae.createRef(),interaction:[],hovered:new Map,subscribers:[],initialClick:[0,0],initialHits:[],capturedMap:new Map,subscribe:(_,E,w)=>{const T=u().internal;return T.priority=T.priority+(E>0?1:0),T.subscribers.push({ref:_,priority:E,store:w}),T.subscribers=T.subscribers.sort((U,P)=>U.priority-P.priority),()=>{const U=u().internal;U!=null&&U.subscribers&&(U.priority=U.priority-(E>0?1:0),U.subscribers=U.subscribers.filter(P=>P.ref!==_))}}}}}),n=t.getState();let i=n.size,s=n.viewport.dpr,a=n.camera;return t.subscribe(()=>{const{camera:c,size:u,viewport:h,gl:f,set:p}=t.getState();if(u.width!==i.width||u.height!==i.height||h.dpr!==s){var m;i=u,s=h.dpr,zC(c,u),f.setPixelRatio(h.dpr);const v=(m=u.updateStyle)!=null?m:typeof HTMLCanvasElement<"u"&&f.domElement instanceof HTMLCanvasElement;f.setSize(u.width,u.height,v)}c!==a&&(a=c,p(v=>({viewport:{...v.viewport,...v.viewport.getCurrentViewport(c)}})))}),t.subscribe(c=>r(c)),t};let lu,WC=new Set,XC=new Set,qC=new Set;function Hd(r,e){if(r.size)for(const{callback:t}of r.values())t(e)}function _a(r,e){switch(r){case"before":return Hd(WC,e);case"after":return Hd(XC,e);case"tail":return Hd(qC,e)}}let Vd,Gd;function Wd(r,e,t){let n=e.clock.getDelta();for(e.frameloop==="never"&&typeof r=="number"&&(n=r-e.clock.elapsedTime,e.clock.oldTime=e.clock.elapsedTime,e.clock.elapsedTime=r),Vd=e.internal.subscribers,lu=0;lu<Vd.length;lu++)Gd=Vd[lu],Gd.ref.current(Gd.store.getState(),n,t);return!e.internal.priority&&e.gl.render&&e.gl.render(e.scene,e.camera),e.internal.frames=Math.max(0,e.internal.frames-1),e.frameloop==="always"?1:e.internal.frames}function YC(r){let e=!1,t=!1,n,i,s;function a(h){i=requestAnimationFrame(a),e=!0,n=0,_a("before",h),t=!0;for(const p of r.values()){var f;s=p.store.getState(),s.internal.active&&(s.frameloop==="always"||s.internal.frames>0)&&!((f=s.gl.xr)!=null&&f.isPresenting)&&(n+=Wd(h,s))}if(t=!1,_a("after",h),n===0)return _a("tail",h),e=!1,cancelAnimationFrame(i)}function c(h,f=1){var p;if(!h)return r.forEach(m=>c(m.store.getState(),f));(p=h.gl.xr)!=null&&p.isPresenting||!h.internal.active||h.frameloop==="never"||(f>1?h.internal.frames=Math.min(60,h.internal.frames+f):t?h.internal.frames=2:h.internal.frames=1,e||(e=!0,requestAnimationFrame(a)))}function u(h,f=!0,p,m){if(f&&_a("before",h),p)Wd(h,p,m);else for(const v of r.values())Wd(h,v.store.getState());f&&_a("after",h)}return{loop:a,invalidate:c,advance:u}}function ly(){const r=ae.useContext(ay);if(!r)throw new Error("R3F: Hooks can only be used within the Canvas component!");return r}function ml(r=t=>t,e){return ly()(r,e)}function Bo(r,e=0){const t=ly(),n=t.getState().internal.subscribe,i=ey(r);return pl(()=>n(i,e,t),[e,n,t]),null}const Ro=new Map,{invalidate:Iv,advance:Lv}=YC(Ro),{reconciler:rh,applyProps:po}=DC(Ro,kC),mo={objects:"shallow",strict:!1},jC=(r,e)=>{const t=typeof r=="function"?r(e):r;return oy(t)?t:new ex({powerPreference:"high-performance",canvas:e,antialias:!0,alpha:!0,...r})};function ZC(r,e){const t=typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement;if(e){const{width:n,height:i,top:s,left:a,updateStyle:c=t}=e;return{width:n,height:i,top:s,left:a,updateStyle:c}}else if(typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement&&r.parentElement){const{width:n,height:i,top:s,left:a}=r.parentElement.getBoundingClientRect();return{width:n,height:i,top:s,left:a,updateStyle:t}}else if(typeof OffscreenCanvas<"u"&&r instanceof OffscreenCanvas)return{width:r.width,height:r.height,top:0,left:0,updateStyle:t};return{width:0,height:0,top:0,left:0}}function JC(r){const e=Ro.get(r),t=e==null?void 0:e.fiber,n=e==null?void 0:e.store;e&&console.warn("R3F.createRoot should only be called once!");const i=typeof reportError=="function"?reportError:console.error,s=n||GC(Iv,Lv),a=t||rh.createContainer(s,wo.ConcurrentRoot,null,!1,null,"",i,null);e||Ro.set(r,{fiber:a,store:s});let c,u=!1,h;return{configure(f={}){let{gl:p,size:m,scene:v,events:x,onCreated:M,shadows:y=!1,linear:_=!1,flat:E=!1,legacy:w=!1,orthographic:T=!1,frameloop:U="always",dpr:P=[1,2],performance:I,raycaster:B,camera:k,onPointerMissed:b}=f,C=s.getState(),G=C.gl;C.gl||C.set({gl:G=jC(p,r)});let Z=C.raycaster;Z||C.set({raycaster:Z=new Wx});const{params:$,...oe}=B||{};if(Ht.equ(oe,Z,mo)||po(Z,{...oe}),Ht.equ($,Z.params,mo)||po(Z,{params:{...Z.params,...$}}),!C.camera||C.camera===h&&!Ht.equ(h,k,mo)){h=k;const q=k instanceof ol,re=q?k:T?new Ps(0,0,0,0,.1,1e3):new sn(75,0,.1,1e3);q||(re.position.z=5,k&&(po(re,k),("aspect"in k||"left"in k||"right"in k||"bottom"in k||"top"in k)&&(re.manual=!0,re.updateProjectionMatrix())),!C.camera&&!(k!=null&&k.rotation)&&re.lookAt(0,0,0)),C.set({camera:re}),Z.camera=re}if(!C.scene){let q;v instanceof $u?q=v:(q=new $u,v&&po(q,v)),C.set({scene:go(q)})}if(!C.xr){var K;const q=(Pe,ie)=>{const me=s.getState();me.frameloop!=="never"&&Lv(Pe,!0,me,ie)},re=()=>{const Pe=s.getState();Pe.gl.xr.enabled=Pe.gl.xr.isPresenting,Pe.gl.xr.setAnimationLoop(Pe.gl.xr.isPresenting?q:null),Pe.gl.xr.isPresenting||Iv(Pe)},xe={connect(){const Pe=s.getState().gl;Pe.xr.addEventListener("sessionstart",re),Pe.xr.addEventListener("sessionend",re)},disconnect(){const Pe=s.getState().gl;Pe.xr.removeEventListener("sessionstart",re),Pe.xr.removeEventListener("sessionend",re)}};typeof((K=G.xr)==null?void 0:K.addEventListener)=="function"&&xe.connect(),C.set({xr:xe})}if(G.shadowMap){const q=G.shadowMap.enabled,re=G.shadowMap.type;if(G.shadowMap.enabled=!!y,Ht.boo(y))G.shadowMap.type=Aa;else if(Ht.str(y)){var fe;const xe={basic:Qv,percentage:sh,soft:Aa,variance:bi};G.shadowMap.type=(fe=xe[y])!=null?fe:Aa}else Ht.obj(y)&&Object.assign(G.shadowMap,y);(q!==G.shadowMap.enabled||re!==G.shadowMap.type)&&(G.shadowMap.needsUpdate=!0)}const O=Qx();O&&("enabled"in O?O.enabled=!w:"legacyMode"in O&&(O.legacyMode=w)),u||po(G,{outputEncoding:_?3e3:3001,toneMapping:E?qi:xp}),C.legacy!==w&&C.set(()=>({legacy:w})),C.linear!==_&&C.set(()=>({linear:_})),C.flat!==E&&C.set(()=>({flat:E})),p&&!Ht.fun(p)&&!oy(p)&&!Ht.equ(p,G,mo)&&po(G,p),x&&!C.events.handlers&&C.set({events:x(s)});const J=ZC(r,m);return Ht.equ(J,C.size,mo)||C.setSize(J.width,J.height,J.updateStyle,J.top,J.left),P&&C.viewport.dpr!==iy(P)&&C.setDpr(P),C.frameloop!==U&&C.setFrameloop(U),C.onPointerMissed||C.set({onPointerMissed:b}),I&&!Ht.equ(I,C.performance,mo)&&C.set(q=>({performance:{...q.performance,...I}})),c=M,u=!0,this},render(f){return u||this.configure(),rh.updateContainer(j.jsx(KC,{store:s,children:f,onCreated:c,rootElement:r}),a,null,()=>{}),s},unmount(){cy(r)}}}function KC({store:r,children:e,onCreated:t,rootElement:n}){return pl(()=>{const i=r.getState();i.set(s=>({internal:{...s.internal,active:!0}})),t&&t(i),r.getState().events.connected||i.events.connect==null||i.events.connect(n)},[]),j.jsx(ay.Provider,{value:r,children:e})}function cy(r,e){const t=Ro.get(r),n=t==null?void 0:t.fiber;if(n){const i=t==null?void 0:t.store.getState();i&&(i.internal.active=!1),rh.updateContainer(null,n,null,()=>{i&&setTimeout(()=>{try{var s,a,c,u;i.events.disconnect==null||i.events.disconnect(),(s=i.gl)==null||(a=s.renderLists)==null||a.dispose==null||a.dispose(),(c=i.gl)==null||c.forceContextLoss==null||c.forceContextLoss(),(u=i.gl)!=null&&u.xr&&i.xr.disconnect(),OC(i),Ro.delete(r)}catch{}},500)})}}rh.injectIntoDevTools({bundleType:0,rendererPackageName:"@react-three/fiber",version:ae.version});const Xd={onClick:["click",!1],onContextMenu:["contextmenu",!1],onDoubleClick:["dblclick",!1],onWheel:["wheel",!0],onPointerDown:["pointerdown",!0],onPointerUp:["pointerup",!0],onPointerLeave:["pointerleave",!0],onPointerMove:["pointermove",!0],onPointerCancel:["pointercancel",!0],onLostPointerCapture:["lostpointercapture",!0]};function QC(r){const{handlePointer:e}=VC(r);return{priority:1,enabled:!0,compute(t,n,i){n.pointer.set(t.offsetX/n.size.width*2-1,-(t.offsetY/n.size.height)*2+1),n.raycaster.setFromCamera(n.pointer,n.camera)},connected:void 0,handlers:Object.keys(Xd).reduce((t,n)=>({...t,[n]:e(n)}),{}),update:()=>{var t;const{events:n,internal:i}=r.getState();(t=i.lastEvent)!=null&&t.current&&n.handlers&&n.handlers.onPointerMove(i.lastEvent.current)},connect:t=>{var n;const{set:i,events:s}=r.getState();s.disconnect==null||s.disconnect(),i(a=>({events:{...a.events,connected:t}})),Object.entries((n=s.handlers)!=null?n:[]).forEach(([a,c])=>{const[u,h]=Xd[a];t.addEventListener(u,c,{passive:h})})},disconnect:()=>{const{set:t,events:n}=r.getState();if(n.connected){var i;Object.entries((i=n.handlers)!=null?i:[]).forEach(([s,a])=>{if(n&&n.connected instanceof HTMLElement){const[c]=Xd[s];n.connected.removeEventListener(c,a)}}),t(s=>({events:{...s.events,connected:void 0}}))}}}}function mp(r,e,t){var n,i,s,a,c;e==null&&(e=100);function u(){var f=Date.now()-a;f<e&&f>=0?n=setTimeout(u,e-f):(n=null,t||(c=r.apply(s,i),s=i=null))}var h=function(){s=this,i=arguments,a=Date.now();var f=t&&!n;return n||(n=setTimeout(u,e)),f&&(c=r.apply(s,i),s=i=null),c};return h.clear=function(){n&&(clearTimeout(n),n=null)},h.flush=function(){n&&(c=r.apply(s,i),s=i=null,clearTimeout(n),n=null)},h}mp.debounce=mp;var $C=mp;const Dv=Zv($C);var eR=Object.defineProperty,tR=Object.defineProperties,nR=Object.getOwnPropertyDescriptors,Uv=Object.getOwnPropertySymbols,iR=Object.prototype.hasOwnProperty,rR=Object.prototype.propertyIsEnumerable,Nv=(r,e,t)=>e in r?eR(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,Fv=(r,e)=>{for(var t in e||(e={}))iR.call(e,t)&&Nv(r,t,e[t]);if(Uv)for(var t of Uv(e))rR.call(e,t)&&Nv(r,t,e[t]);return r},sR=(r,e)=>tR(r,nR(e)),Ov,Bv;typeof window<"u"&&((Ov=window.document)!=null&&Ov.createElement||((Bv=window.navigator)==null?void 0:Bv.product)==="ReactNative")?ae.useLayoutEffect:ae.useEffect;function uy(r,e,t){if(!r)return;if(t(r)===!0)return r;let n=r.child;for(;n;){const i=uy(n,e,t);if(i)return i;n=n.sibling}}function hy(r){try{return Object.defineProperties(r,{_currentRenderer:{get(){return null},set(){}},_currentRenderer2:{get(){return null},set(){}}})}catch{return r}}const zv=console.error;console.error=function(){const r=[...arguments].join("");if(r!=null&&r.startsWith("Warning:")&&r.includes("useContext")){console.error=zv;return}return zv.apply(this,arguments)};const cm=hy(ae.createContext(null));class fy extends ae.Component{render(){return ae.createElement(cm.Provider,{value:this._reactInternals},this.props.children)}}function oR(){const r=ae.useContext(cm);if(r===null)throw new Error("its-fine: useFiber must be called within a <FiberProvider />!");const e=ae.useId();return ae.useMemo(()=>{for(const n of[r,r==null?void 0:r.alternate]){if(!n)continue;const i=uy(n,!1,s=>{let a=s.memoizedState;for(;a;){if(a.memoizedState===e)return!0;a=a.next}});if(i)return i}},[r,e])}function aR(){const r=oR(),[e]=ae.useState(()=>new Map);e.clear();let t=r;for(;t;){if(t.type&&typeof t.type=="object"){const i=t.type._context===void 0&&t.type.Provider===t.type?t.type:t.type._context;i&&i!==cm&&!e.has(i)&&e.set(i,ae.useContext(hy(i)))}t=t.return}return e}function lR(){const r=aR();return ae.useMemo(()=>Array.from(r.keys()).reduce((e,t)=>n=>ae.createElement(e,null,ae.createElement(t.Provider,sR(Fv({},n),{value:r.get(t)}))),e=>ae.createElement(fy,Fv({},e))),[r])}function cR({debounce:r,scroll:e,polyfill:t,offsetSize:n}={debounce:0,scroll:!1,offsetSize:!1}){const i=t||typeof window<"u"&&window.ResizeObserver,[s,a]=ae.useState({left:0,top:0,width:0,height:0,bottom:0,right:0,x:0,y:0});if(!i)return s.width=1280,s.height=800,[()=>{},s,()=>{}];const c=ae.useRef({element:null,scrollContainers:null,resizeObserver:null,lastBounds:s,orientationHandler:null}),u=r?typeof r=="number"?r:r.scroll:null,h=r?typeof r=="number"?r:r.resize:null,f=ae.useRef(!1);ae.useEffect(()=>(f.current=!0,()=>void(f.current=!1)));const[p,m,v]=ae.useMemo(()=>{const _=()=>{if(!c.current.element)return;const{left:E,top:w,width:T,height:U,bottom:P,right:I,x:B,y:k}=c.current.element.getBoundingClientRect(),b={left:E,top:w,width:T,height:U,bottom:P,right:I,x:B,y:k};c.current.element instanceof HTMLElement&&n&&(b.height=c.current.element.offsetHeight,b.width=c.current.element.offsetWidth),Object.freeze(b),f.current&&!dR(c.current.lastBounds,b)&&a(c.current.lastBounds=b)};return[_,h?Dv(_,h):_,u?Dv(_,u):_]},[a,n,u,h]);function x(){c.current.scrollContainers&&(c.current.scrollContainers.forEach(_=>_.removeEventListener("scroll",v,!0)),c.current.scrollContainers=null),c.current.resizeObserver&&(c.current.resizeObserver.disconnect(),c.current.resizeObserver=null),c.current.orientationHandler&&("orientation"in screen&&"removeEventListener"in screen.orientation?screen.orientation.removeEventListener("change",c.current.orientationHandler):"onorientationchange"in window&&window.removeEventListener("orientationchange",c.current.orientationHandler))}function M(){var _;c.current.element&&(c.current.resizeObserver=new i(m),(_=c.current.resizeObserver)==null||_.observe(c.current.element),e&&c.current.scrollContainers&&c.current.scrollContainers.forEach(E=>E.addEventListener("scroll",v,{capture:!0,passive:!0})),c.current.orientationHandler=()=>{v()},"orientation"in screen&&"addEventListener"in screen.orientation?screen.orientation.addEventListener("change",c.current.orientationHandler):"onorientationchange"in window&&window.addEventListener("orientationchange",c.current.orientationHandler))}const y=_=>{!_||_===c.current.element||(x(),c.current.element=_,c.current.scrollContainers=dy(_),M())};return hR(v,!!e),uR(m),ae.useEffect(()=>{x(),M()},[e,v,m]),ae.useEffect(()=>x,[]),[y,s,p]}function uR(r){ae.useEffect(()=>{const e=r;return window.addEventListener("resize",e),()=>void window.removeEventListener("resize",e)},[r])}function hR(r,e){ae.useEffect(()=>{if(e){const t=r;return window.addEventListener("scroll",t,{capture:!0,passive:!0}),()=>void window.removeEventListener("scroll",t,!0)}},[r,e])}function dy(r){const e=[];if(!r||r===document.body)return e;const{overflow:t,overflowX:n,overflowY:i}=window.getComputedStyle(r);return[t,n,i].some(s=>s==="auto"||s==="scroll")&&e.push(r),[...e,...dy(r.parentElement)]}const fR=["x","y","top","bottom","left","right","width","height"],dR=(r,e)=>fR.every(t=>r[t]===e[t]),pR=ae.forwardRef(function({children:e,fallback:t,resize:n,style:i,gl:s,events:a=QC,eventSource:c,eventPrefix:u,shadows:h,linear:f,flat:p,legacy:m,orthographic:v,frameloop:x,dpr:M,performance:y,raycaster:_,camera:E,scene:w,onPointerMissed:T,onCreated:U,...P},I){ae.useMemo(()=>Kx(EC),[]);const B=lR(),[k,b]=cR({scroll:!0,debounce:{scroll:50,resize:0},...n}),C=ae.useRef(null),G=ae.useRef(null);ae.useImperativeHandle(I,()=>C.current);const Z=ey(T),[$,oe]=ae.useState(!1),[K,fe]=ae.useState(!1);if($)throw $;if(K)throw K;const O=ae.useRef(null);pl(()=>{const q=C.current;b.width>0&&b.height>0&&q&&(O.current||(O.current=JC(q)),O.current.configure({gl:s,events:a,shadows:h,linear:f,flat:p,legacy:m,orthographic:v,frameloop:x,dpr:M,performance:y,raycaster:_,camera:E,scene:w,size:b,onPointerMissed:(...re)=>Z.current==null?void 0:Z.current(...re),onCreated:re=>{re.events.connect==null||re.events.connect(c?UC(c)?c.current:c:G.current),u&&re.setEvents({compute:(xe,Pe)=>{const ie=xe[u+"X"],me=xe[u+"Y"];Pe.pointer.set(ie/Pe.size.width*2-1,-(me/Pe.size.height)*2+1),Pe.raycaster.setFromCamera(Pe.pointer,Pe.camera)}}),U==null||U(re)}}),O.current.render(j.jsx(B,{children:j.jsx(ty,{set:fe,children:j.jsx(ae.Suspense,{fallback:j.jsx(NC,{set:oe}),children:e})})})))}),ae.useEffect(()=>{const q=C.current;if(q)return()=>cy(q)},[]);const J=c?"none":"auto";return j.jsx("div",{ref:G,style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",pointerEvents:J,...i},...P,children:j.jsx("div",{ref:k,style:{width:"100%",height:"100%"},children:j.jsx("canvas",{ref:C,style:{display:"block"},children:t})})})}),mR=ae.forwardRef(function(e,t){return j.jsx(fy,{children:j.jsx(pR,{...e,ref:t})})});function Po(){return Po=Object.assign?Object.assign.bind():function(r){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var n in t)({}).hasOwnProperty.call(t,n)&&(r[n]=t[n])}return r},Po.apply(null,arguments)}const gl=new D,um=new D,gR=new D,kv=new ge;function vR(r,e,t){const n=gl.setFromMatrixPosition(r.matrixWorld);n.project(e);const i=t.width/2,s=t.height/2;return[n.x*i+i,-(n.y*s)+s]}function _R(r,e){const t=gl.setFromMatrixPosition(r.matrixWorld),n=um.setFromMatrixPosition(e.matrixWorld),i=t.sub(n),s=e.getWorldDirection(gR);return i.angleTo(s)>Math.PI/2}function xR(r,e,t,n){const i=gl.setFromMatrixPosition(r.matrixWorld),s=i.clone();s.project(e),kv.set(s.x,s.y),t.setFromCamera(kv,e);const a=t.intersectObjects(n,!0);if(a.length){const c=a[0].distance;return i.distanceTo(t.ray.origin)<c}return!0}function yR(r,e){if(e instanceof Ps)return e.zoom;if(e instanceof sn){const t=gl.setFromMatrixPosition(r.matrixWorld),n=um.setFromMatrixPosition(e.matrixWorld),i=e.fov*Math.PI/180,s=t.distanceTo(n);return 1/(2*Math.tan(i/2)*s)}else return 1}function SR(r,e,t){if(e instanceof sn||e instanceof Ps){const n=gl.setFromMatrixPosition(r.matrixWorld),i=um.setFromMatrixPosition(e.matrixWorld),s=n.distanceTo(i),a=(t[1]-t[0])/(e.far-e.near),c=t[1]-a*e.far;return Math.round(a*s+c)}}const gp=r=>Math.abs(r)<1e-10?0:r;function py(r,e,t=""){let n="matrix3d(";for(let i=0;i!==16;i++)n+=gp(e[i]*r.elements[i])+(i!==15?",":")");return t+n}const MR=(r=>e=>py(e,r))([1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1]),wR=(r=>(e,t)=>py(e,r(t),"translate(-50%,-50%)"))(r=>[1/r,1/r,1/r,1,-1/r,-1/r,-1/r,-1,1/r,1/r,1/r,1,1,1,1,1]);function ER(r){return r&&typeof r=="object"&&"current"in r}const my=ae.forwardRef(({children:r,eps:e=.001,style:t,className:n,prepend:i,center:s,fullscreen:a,portal:c,distanceFactor:u,sprite:h=!1,transform:f=!1,occlude:p,onOcclude:m,castShadow:v,receiveShadow:x,material:M,geometry:y,zIndexRange:_=[16777271,0],calculatePosition:E=vR,as:w="div",wrapperClass:T,pointerEvents:U="auto",...P},I)=>{const{gl:B,camera:k,scene:b,size:C,raycaster:G,events:Z,viewport:$}=ml(),[oe]=ae.useState(()=>document.createElement(w)),K=ae.useRef(),fe=ae.useRef(null),O=ae.useRef(0),J=ae.useRef([0,0]),q=ae.useRef(null),re=ae.useRef(null),xe=(c==null?void 0:c.current)||Z.connected||B.domElement.parentNode,Pe=ae.useRef(null),ie=ae.useRef(!1),me=ae.useMemo(()=>p&&p!=="blending"||Array.isArray(p)&&p.length&&ER(p[0]),[p]);ae.useLayoutEffect(()=>{const Ze=B.domElement;p&&p==="blending"?(Ze.style.zIndex=`${Math.floor(_[0]/2)}`,Ze.style.position="absolute",Ze.style.pointerEvents="none"):(Ze.style.zIndex=null,Ze.style.position=null,Ze.style.pointerEvents=null)},[p]),ae.useLayoutEffect(()=>{if(fe.current){const Ze=K.current=fS(oe);if(b.updateMatrixWorld(),f)oe.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{const Ie=E(fe.current,k,C);oe.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${Ie[0]}px,${Ie[1]}px,0);transform-origin:0 0;`}return xe&&(i?xe.prepend(oe):xe.appendChild(oe)),()=>{xe&&xe.removeChild(oe),Ze.unmount()}}},[xe,f]),ae.useLayoutEffect(()=>{T&&(oe.className=T)},[T]);const be=ae.useMemo(()=>f?{position:"absolute",top:0,left:0,width:C.width,height:C.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:s?"translate3d(-50%,-50%,0)":"none",...a&&{top:-C.height/2,left:-C.width/2,width:C.width,height:C.height},...t},[t,s,a,C,f]),Se=ae.useMemo(()=>({position:"absolute",pointerEvents:U}),[U]);ae.useLayoutEffect(()=>{if(ie.current=!1,f){var Ze;(Ze=K.current)==null||Ze.render(ae.createElement("div",{ref:q,style:be},ae.createElement("div",{ref:re,style:Se},ae.createElement("div",{ref:I,className:n,style:t,children:r}))))}else{var Ie;(Ie=K.current)==null||Ie.render(ae.createElement("div",{ref:I,style:be,className:n,children:r}))}});const tt=ae.useRef(!0);Bo(Ze=>{if(fe.current){k.updateMatrixWorld(),fe.current.updateWorldMatrix(!0,!1);const Ie=f?J.current:E(fe.current,k,C);if(f||Math.abs(O.current-k.zoom)>e||Math.abs(J.current[0]-Ie[0])>e||Math.abs(J.current[1]-Ie[1])>e){const de=_R(fe.current,k);let N=!1;me&&(Array.isArray(p)?N=p.map(Ee=>Ee.current):p!=="blending"&&(N=[b]));const Te=tt.current;if(N){const Ee=xR(fe.current,k,G,N);tt.current=Ee&&!de}else tt.current=!de;Te!==tt.current&&(m?m(!tt.current):oe.style.display=tt.current?"block":"none");const we=Math.floor(_[0]/2),_e=p?me?[_[0],we]:[we-1,0]:_;if(oe.style.zIndex=`${SR(fe.current,k,_e)}`,f){const[Ee,Je]=[C.width/2,C.height/2],De=k.projectionMatrix.elements[5]*Je,{isOrthographicCamera:F,top:R,left:Q,bottom:ue,right:pe}=k,he=MR(k.matrixWorldInverse),Ye=F?`scale(${De})translate(${gp(-(pe+Q)/2)}px,${gp((R+ue)/2)}px)`:`translateZ(${De}px)`;let Ce=fe.current.matrixWorld;h&&(Ce=k.matrixWorldInverse.clone().transpose().copyPosition(Ce).scale(fe.current.scale),Ce.elements[3]=Ce.elements[7]=Ce.elements[11]=0,Ce.elements[15]=1),oe.style.width=C.width+"px",oe.style.height=C.height+"px",oe.style.perspective=F?"":`${De}px`,q.current&&re.current&&(q.current.style.transform=`${Ye}${he}translate(${Ee}px,${Je}px)`,re.current.style.transform=wR(Ce,1/((u||10)/400)))}else{const Ee=u===void 0?1:yR(fe.current,k)*u;oe.style.transform=`translate3d(${Ie[0]}px,${Ie[1]}px,0) scale(${Ee})`}J.current=Ie,O.current=k.zoom}}if(!me&&Pe.current&&!ie.current)if(f){if(q.current){const Ie=q.current.children[0];if(Ie!=null&&Ie.clientWidth&&Ie!=null&&Ie.clientHeight){const{isOrthographicCamera:de}=k;if(de||y)P.scale&&(Array.isArray(P.scale)?P.scale instanceof D?Pe.current.scale.copy(P.scale.clone().divideScalar(1)):Pe.current.scale.set(1/P.scale[0],1/P.scale[1],1/P.scale[2]):Pe.current.scale.setScalar(1/P.scale));else{const N=(u||10)/400,Te=Ie.clientWidth*N,we=Ie.clientHeight*N;Pe.current.scale.set(Te,we,1)}ie.current=!0}}}else{const Ie=oe.children[0];if(Ie!=null&&Ie.clientWidth&&Ie!=null&&Ie.clientHeight){const de=1/$.factor,N=Ie.clientWidth*de,Te=Ie.clientHeight*de;Pe.current.scale.set(N,Te,1),ie.current=!0}Pe.current.lookAt(Ze.camera.position)}});const nt=ae.useMemo(()=>({vertexShader:f?void 0:`
          /*
            This shader is from the THREE's SpriteMaterial.
            We need to turn the backing plane into a Sprite
            (make it always face the camera) if "transfrom"
            is false.
          */
          #include <common>

          void main() {
            vec2 center = vec2(0., 1.);
            float rotation = 0.0;

            // This is somewhat arbitrary, but it seems to work well
            // Need to figure out how to derive this dynamically if it even matters
            float size = 0.03;

            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
            vec2 scale;
            scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
            scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

            bool isPerspective = isPerspectiveMatrix( projectionMatrix );
            if ( isPerspective ) scale *= - mvPosition.z;

            vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;
            vec2 rotatedPosition;
            rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
            rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;

            gl_Position = projectionMatrix * mvPosition;
          }
      `,fragmentShader:`
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `}),[f]);return ae.createElement("group",Po({},P,{ref:fe}),p&&!me&&ae.createElement("mesh",{castShadow:v,receiveShadow:x,ref:Pe},y||ae.createElement("planeGeometry",null),M||ae.createElement("shaderMaterial",{side:Ci,vertexShader:nt.vertexShader,fragmentShader:nt.fragmentShader})))}),gy=parseInt(Io.replace(/\D+/g,"")),vy=gy>=125?"uv1":"uv2",Hv=new gn,cu=new D;class hm extends tm{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new je(e,3)),this.setAttribute("uv",new je(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const n=new ih(t,6,1);return this.setAttribute("instanceStart",new ri(n,3,0)),this.setAttribute("instanceEnd",new ri(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));const i=new ih(n,t*2,1);return this.setAttribute("instanceColorStart",new ri(i,t,0)),this.setAttribute("instanceColorEnd",new ri(i,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Zp(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new gn);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),Hv.setFromBufferAttribute(t),this.boundingBox.union(Hv))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vn),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)cu.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(cu)),cu.fromBufferAttribute(t,s),i=Math.max(i,n.distanceToSquared(cu));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}class _y extends hm{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,n=new Float32Array(2*t);for(let i=0;i<t;i+=3)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5];return super.setPositions(n),this}setColors(e,t=3){const n=e.length-t,i=new Float32Array(2*n);if(t===3)for(let s=0;s<n;s+=t)i[2*s]=e[s],i[2*s+1]=e[s+1],i[2*s+2]=e[s+2],i[2*s+3]=e[s+3],i[2*s+4]=e[s+4],i[2*s+5]=e[s+5];else for(let s=0;s<n;s+=t)i[2*s]=e[s],i[2*s+1]=e[s+1],i[2*s+2]=e[s+2],i[2*s+3]=e[s+3],i[2*s+4]=e[s+4],i[2*s+5]=e[s+5],i[2*s+6]=e[s+6],i[2*s+7]=e[s+7];return super.setColors(i,t),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class fm extends ai{constructor(e){super({type:"LineMaterial",uniforms:Ya.clone(Ya.merge([Re.common,Re.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ge(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${gy>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(t){this.uniforms.diffuse.value=t}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(t){this.uniforms.linewidth.value=t}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(t){!!t!="USE_DASH"in this.defines&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(t){this.uniforms.dashScale.value=t}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(t){this.uniforms.dashSize.value=t}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(t){this.uniforms.dashOffset.value=t}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(t){this.uniforms.gapSize.value=t}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(t){this.uniforms.opacity.value=t}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(t){this.uniforms.resolution.value.copy(t)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(t){!!t!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}const qd=new xt,Vv=new D,Gv=new D,yn=new xt,Sn=new xt,Hi=new xt,Yd=new D,jd=new rt,Mn=new Xx,Wv=new D,uu=new gn,hu=new vn,Vi=new xt;let Gi,Es;function Xv(r,e,t){return Vi.set(0,0,-e,1).applyMatrix4(r.projectionMatrix),Vi.multiplyScalar(1/Vi.w),Vi.x=Es/t.width,Vi.y=Es/t.height,Vi.applyMatrix4(r.projectionMatrixInverse),Vi.multiplyScalar(1/Vi.w),Math.abs(Math.max(Vi.x,Vi.y))}function AR(r,e){const t=r.matrixWorld,n=r.geometry,i=n.attributes.instanceStart,s=n.attributes.instanceEnd,a=Math.min(n.instanceCount,i.count);for(let c=0,u=a;c<u;c++){Mn.start.fromBufferAttribute(i,c),Mn.end.fromBufferAttribute(s,c),Mn.applyMatrix4(t);const h=new D,f=new D;Gi.distanceSqToSegment(Mn.start,Mn.end,f,h),f.distanceTo(h)<Es*.5&&e.push({point:f,pointOnLine:h,distance:Gi.origin.distanceTo(f),object:r,face:null,faceIndex:c,uv:null,[vy]:null})}}function bR(r,e,t){const n=e.projectionMatrix,s=r.material.resolution,a=r.matrixWorld,c=r.geometry,u=c.attributes.instanceStart,h=c.attributes.instanceEnd,f=Math.min(c.instanceCount,u.count),p=-e.near;Gi.at(1,Hi),Hi.w=1,Hi.applyMatrix4(e.matrixWorldInverse),Hi.applyMatrix4(n),Hi.multiplyScalar(1/Hi.w),Hi.x*=s.x/2,Hi.y*=s.y/2,Hi.z=0,Yd.copy(Hi),jd.multiplyMatrices(e.matrixWorldInverse,a);for(let m=0,v=f;m<v;m++){if(yn.fromBufferAttribute(u,m),Sn.fromBufferAttribute(h,m),yn.w=1,Sn.w=1,yn.applyMatrix4(jd),Sn.applyMatrix4(jd),yn.z>p&&Sn.z>p)continue;if(yn.z>p){const w=yn.z-Sn.z,T=(yn.z-p)/w;yn.lerp(Sn,T)}else if(Sn.z>p){const w=Sn.z-yn.z,T=(Sn.z-p)/w;Sn.lerp(yn,T)}yn.applyMatrix4(n),Sn.applyMatrix4(n),yn.multiplyScalar(1/yn.w),Sn.multiplyScalar(1/Sn.w),yn.x*=s.x/2,yn.y*=s.y/2,Sn.x*=s.x/2,Sn.y*=s.y/2,Mn.start.copy(yn),Mn.start.z=0,Mn.end.copy(Sn),Mn.end.z=0;const M=Mn.closestPointToPointParameter(Yd,!0);Mn.at(M,Wv);const y=sl.lerp(yn.z,Sn.z,M),_=y>=-1&&y<=1,E=Yd.distanceTo(Wv)<Es*.5;if(_&&E){Mn.start.fromBufferAttribute(u,m),Mn.end.fromBufferAttribute(h,m),Mn.start.applyMatrix4(a),Mn.end.applyMatrix4(a);const w=new D,T=new D;Gi.distanceSqToSegment(Mn.start,Mn.end,T,w),t.push({point:T,pointOnLine:w,distance:Gi.origin.distanceTo(T),object:r,face:null,faceIndex:m,uv:null,[vy]:null})}}}class xy extends en{constructor(e=new hm,t=new fm({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let a=0,c=0,u=t.count;a<u;a++,c+=2)Vv.fromBufferAttribute(t,a),Gv.fromBufferAttribute(n,a),i[c]=c===0?0:i[c-1],i[c+1]=i[c]+Vv.distanceTo(Gv);const s=new ih(i,2,1);return e.setAttribute("instanceDistanceStart",new ri(s,1,0)),e.setAttribute("instanceDistanceEnd",new ri(s,1,1)),this}raycast(e,t){const n=this.material.worldUnits,i=e.camera;i===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const s=e.params.Line2!==void 0&&e.params.Line2.threshold||0;Gi=e.ray;const a=this.matrixWorld,c=this.geometry,u=this.material;Es=u.linewidth+s,c.boundingSphere===null&&c.computeBoundingSphere(),hu.copy(c.boundingSphere).applyMatrix4(a);let h;if(n)h=Es*.5;else{const p=Math.max(i.near,hu.distanceToPoint(Gi.origin));h=Xv(i,p,u.resolution)}if(hu.radius+=h,Gi.intersectsSphere(hu)===!1)return;c.boundingBox===null&&c.computeBoundingBox(),uu.copy(c.boundingBox).applyMatrix4(a);let f;if(n)f=Es*.5;else{const p=Math.max(i.near,uu.distanceToPoint(Gi.origin));f=Xv(i,p,u.resolution)}uu.expandByScalar(f),Gi.intersectsBox(uu)!==!1&&(n?AR(this,t):bR(this,i,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(qd),this.material.uniforms.resolution.value.set(qd.z,qd.w))}}class TR extends xy{constructor(e=new _y,t=new fm({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}const qv=ae.forwardRef(function({points:e,color:t=16777215,vertexColors:n,linewidth:i,lineWidth:s,segments:a,dashed:c,...u},h){var f,p;const m=ml(_=>_.size),v=ae.useMemo(()=>a?new xy:new TR,[a]),[x]=ae.useState(()=>new fm),M=(n==null||(f=n[0])==null?void 0:f.length)===4?4:3,y=ae.useMemo(()=>{const _=a?new hm:new _y,E=e.map(w=>{const T=Array.isArray(w);return w instanceof D||w instanceof xt?[w.x,w.y,w.z]:w instanceof ge?[w.x,w.y,0]:T&&w.length===3?[w[0],w[1],w[2]]:T&&w.length===2?[w[0],w[1],0]:w});if(_.setPositions(E.flat()),n){t=16777215;const w=n.map(T=>T instanceof Ue?T.toArray():T);_.setColors(w.flat(),M)}return _},[e,a,n,M]);return ae.useLayoutEffect(()=>{v.computeLineDistances()},[e,v]),ae.useLayoutEffect(()=>{c?x.defines.USE_DASH="":delete x.defines.USE_DASH,x.needsUpdate=!0},[c,x]),ae.useEffect(()=>()=>{y.dispose(),x.dispose()},[y]),ae.createElement("primitive",Po({object:v,ref:h},u),ae.createElement("primitive",{object:y,attach:"geometry"}),ae.createElement("primitive",Po({object:x,attach:"material",color:t,vertexColors:!!n,resolution:[m.width,m.height],linewidth:(p=i??s)!==null&&p!==void 0?p:1,dashed:c,transparent:M===4},u)))});function CR(r,e,t,n){const i=class extends ai{constructor(a={}){const c=Object.entries(r);super({uniforms:c.reduce((u,[h,f])=>{const p=Ya.clone({[h]:{value:f}});return{...u,...p}},{}),vertexShader:e,fragmentShader:t}),this.key="",c.forEach(([u])=>Object.defineProperty(this,u,{get:()=>this.uniforms[u].value,set:h=>this.uniforms[u].value=h})),Object.assign(this,a)}};return i.key=sl.generateUUID(),i}const RR=()=>parseInt(Io.replace(/\D+/g,"")),PR=RR(),IR=CR({time:0,pixelRatio:1},` uniform float pixelRatio;
    uniform float time;
    attribute float size;  
    attribute float speed;  
    attribute float opacity;
    attribute vec3 noise;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vOpacity;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      modelPosition.y += sin(time * speed + modelPosition.x * noise.x * 100.0) * 0.2;
      modelPosition.z += cos(time * speed + modelPosition.x * noise.y * 100.0) * 0.2;
      modelPosition.x += cos(time * speed + modelPosition.x * noise.z * 100.0) * 0.2;
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPostion = projectionMatrix * viewPosition;
      gl_Position = projectionPostion;
      gl_PointSize = size * 25. * pixelRatio;
      gl_PointSize *= (1.0 / - viewPosition.z);
      vColor = color;
      vOpacity = opacity;
    }`,` varying vec3 vColor;
    varying float vOpacity;
    void main() {
      float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
      float strength = 0.05 / distanceToCenter - 0.1;
      gl_FragColor = vec4(vColor, strength * vOpacity);
      #include <tonemapping_fragment>
      #include <${PR>=154?"colorspace_fragment":"encodings_fragment"}>
    }`),yy=r=>r&&r.constructor===Float32Array,LR=r=>[r.r,r.g,r.b],Sy=r=>r instanceof ge||r instanceof D||r instanceof xt,My=r=>Array.isArray(r)?r:Sy(r)?r.toArray():[r,r,r];function xa(r,e,t){return ae.useMemo(()=>{if(e!==void 0){if(yy(e))return e;if(e instanceof Ue){const n=Array.from({length:r*3},()=>LR(e)).flat();return Float32Array.from(n)}else if(Sy(e)||Array.isArray(e)){const n=Array.from({length:r*3},()=>My(e)).flat();return Float32Array.from(n)}return Float32Array.from({length:r},()=>e)}return Float32Array.from({length:r},t)},[e])}const DR=ae.forwardRef(({noise:r=1,count:e=100,speed:t=1,opacity:n=1,scale:i=1,size:s,color:a,children:c,...u},h)=>{ae.useMemo(()=>Kx({SparklesImplMaterial:IR}),[]);const f=ae.useRef(null),p=ml(w=>w.viewport.dpr),m=My(i),v=ae.useMemo(()=>Float32Array.from(Array.from({length:e},()=>m.map(sl.randFloatSpread)).flat()),[e,...m]),x=xa(e,s,Math.random),M=xa(e,n),y=xa(e,t),_=xa(e*3,r),E=xa(a===void 0?e*3:e,yy(a)?a:new Ue(a),()=>1);return Bo(w=>{f.current&&f.current.material&&(f.current.material.time=w.clock.elapsedTime)}),ae.useImperativeHandle(h,()=>f.current,[]),ae.createElement("points",Po({key:`particle-${e}-${JSON.stringify(i)}`},u,{ref:f}),ae.createElement("bufferGeometry",null,ae.createElement("bufferAttribute",{attach:"attributes-position",args:[v,3]}),ae.createElement("bufferAttribute",{attach:"attributes-size",args:[x,1]}),ae.createElement("bufferAttribute",{attach:"attributes-opacity",args:[M,1]}),ae.createElement("bufferAttribute",{attach:"attributes-speed",args:[y,1]}),ae.createElement("bufferAttribute",{attach:"attributes-color",args:[E,3]}),ae.createElement("bufferAttribute",{attach:"attributes-noise",args:[_,3]})),c||ae.createElement("sparklesImplMaterial",{transparent:!0,pixelRatio:p,depthWrite:!1}))}),_t={white:new zn({color:"#F7F9FC",roughness:.45,metalness:.1}),blue:new zn({color:"#1F6BFF",roughness:.4,metalness:.15}),navy:new zn({color:"#16305F",roughness:.5}),glass:new zn({color:"#0B1B3A",roughness:.15,metalness:.4}),sandstone:new zn({color:"#D8B58A",roughness:.85}),redstone:new zn({color:"#C98A67",roughness:.85}),marble:new zn({color:"#F4F0E8",roughness:.6}),building:new zn({color:"#DCE6F2",roughness:.8}),buildingDark:new zn({color:"#B9C9DE",roughness:.8}),hill:new zn({color:"#BCD2C4",roughness:1,flatShading:!0}),tree:new zn({color:"#7FAE8A",roughness:1,flatShading:!0}),ground:new zn({color:"#E3EBDD",roughness:1}),cloud:new xr({color:"#FFFFFF",transparent:!0,opacity:.78,depthWrite:!1})},UR=ae.forwardRef(function({children:e},t){return j.jsxs("group",{ref:t,children:[j.jsxs("group",{rotation:[0,-Math.PI/2,0],scale:.62,children:[j.jsx("mesh",{material:_t.white,rotation:[0,0,-Math.PI/2],castShadow:!0,children:j.jsx("capsuleGeometry",{args:[.32,3,6,12]})}),j.jsx("mesh",{material:_t.glass,position:[1.62,.1,0],rotation:[0,0,-Math.PI/2.4],children:j.jsx("sphereGeometry",{args:[.2,10,8,0,Math.PI*2,0,Math.PI/2]})}),[1,-1].map(n=>j.jsx("mesh",{material:_t.white,position:[.05,-.08,n*1.35],rotation:[0,n*.35,0],children:j.jsx("boxGeometry",{args:[.7,.06,2.4]})},n)),[1,-1].map(n=>j.jsx("mesh",{material:_t.blue,position:[.35,-.3,n*.95],rotation:[0,0,Math.PI/2],children:j.jsx("cylinderGeometry",{args:[.14,.12,.6,10]})},`e${n}`)),j.jsx("mesh",{material:_t.blue,position:[-1.55,.5,0],rotation:[0,0,.45],children:j.jsx("boxGeometry",{args:[.65,.75,.06]})}),[1,-1].map(n=>j.jsx("mesh",{material:_t.white,position:[-1.6,.05,n*.45],rotation:[0,n*.4,0],children:j.jsx("boxGeometry",{args:[.35,.05,.8]})},`t${n}`)),j.jsx("mesh",{material:_t.blue,position:[0,-.02,0],rotation:[0,0,-Math.PI/2],children:j.jsx("cylinderGeometry",{args:[.325,.325,2.2,12,1,!0]})})]}),e]})});function NR({lead:r=!1}){return j.jsxs("group",{children:[j.jsx("mesh",{material:_t.white,position:[0,.22,0],children:j.jsx("boxGeometry",{args:[1.1,.32,.34]})}),j.jsx("mesh",{material:_t.blue,position:[0,.14,0],children:j.jsx("boxGeometry",{args:[1.11,.06,.35]})}),j.jsx("mesh",{material:_t.glass,position:[0,.29,0],children:j.jsx("boxGeometry",{args:[.95,.08,.352]})}),r&&j.jsx("mesh",{material:_t.white,position:[.62,.2,0],rotation:[0,0,-Math.PI/2],children:j.jsx("coneGeometry",{args:[.18,.4,4,1]})})]})}function FR({carRefs:r}){return j.jsx(j.Fragment,{children:[0,1,2].map(e=>j.jsx("group",{ref:t=>r(t,e),children:j.jsx(NR,{lead:e===0})},e))})}function OR(){return j.jsxs("group",{children:[j.jsx("mesh",{material:_t.sandstone,position:[0,.1,0],children:j.jsx("boxGeometry",{args:[2.2,.2,1]})}),[-.7,.7].map(r=>j.jsx("mesh",{material:_t.sandstone,position:[r,.95,0],children:j.jsx("boxGeometry",{args:[.7,1.5,.8]})},r)),j.jsx("mesh",{material:_t.sandstone,position:[0,1.95,0],children:j.jsx("boxGeometry",{args:[2.1,.5,.85]})}),[-.95,-.32,.32,.95].map(r=>j.jsxs("group",{position:[r,2.2,0],children:[j.jsx("mesh",{material:_t.sandstone,position:[0,.25,0],children:j.jsx("cylinderGeometry",{args:[.13,.15,.5,8]})}),j.jsx("mesh",{material:_t.sandstone,position:[0,.55,0],children:j.jsx("sphereGeometry",{args:[.15,8,6,0,Math.PI*2,0,Math.PI/2]})})]},r))]})}function BR(){return j.jsxs("group",{children:[j.jsx("mesh",{material:_t.redstone,position:[0,.1,0],children:j.jsx("boxGeometry",{args:[1.8,.2,.9]})}),[-.55,.55].map(r=>j.jsx("mesh",{material:_t.redstone,position:[r,1.25,0],children:j.jsx("boxGeometry",{args:[.55,2.1,.7]})},r)),j.jsx("mesh",{material:_t.redstone,position:[0,2.55,0],children:j.jsx("boxGeometry",{args:[1.7,.55,.75]})}),j.jsx("mesh",{material:_t.redstone,position:[0,2.95,0],children:j.jsx("boxGeometry",{args:[1.2,.25,.55]})}),j.jsx("mesh",{material:_t.redstone,position:[0,3.18,0],children:j.jsx("cylinderGeometry",{args:[.28,.32,.22,10]})})]})}function zR(){return j.jsxs("group",{children:[j.jsx("mesh",{material:_t.marble,position:[0,.12,0],children:j.jsx("boxGeometry",{args:[3,.24,3]})}),j.jsx("mesh",{material:_t.marble,position:[0,.85,0],children:j.jsx("boxGeometry",{args:[1.6,1.2,1.6]})}),j.jsx("mesh",{material:_t.marble,position:[0,1.6,0],children:j.jsx("cylinderGeometry",{args:[.55,.6,.35,16]})}),j.jsx("mesh",{material:_t.marble,position:[0,2.05,0],scale:[1,1.25,1],children:j.jsx("sphereGeometry",{args:[.62,18,14]})}),j.jsx("mesh",{material:_t.sandstone,position:[0,2.95,0],children:j.jsx("coneGeometry",{args:[.07,.4,6]})}),[[-.55,-.55],[.55,-.55],[-.55,.55],[.55,.55]].map(([r,e])=>j.jsx("mesh",{material:_t.marble,position:[r,1.65,e],children:j.jsx("sphereGeometry",{args:[.2,10,8]})},`${r}${e}`)),[[-1.35,-1.35],[1.35,-1.35],[-1.35,1.35],[1.35,1.35]].map(([r,e])=>j.jsxs("group",{position:[r,.24,e],children:[j.jsx("mesh",{material:_t.marble,position:[0,.9,0],children:j.jsx("cylinderGeometry",{args:[.1,.13,1.8,8]})}),j.jsx("mesh",{material:_t.marble,position:[0,1.9,0],children:j.jsx("sphereGeometry",{args:[.14,8,6]})})]},`m${r}${e}`))]})}function kR(){return j.jsxs("group",{children:[j.jsx("mesh",{material:_t.navy,position:[0,1,0],children:j.jsx("coneGeometry",{args:[.9,2,4,1,!0]})}),j.jsx("mesh",{material:_t.navy,position:[0,2.6,0],children:j.jsx("coneGeometry",{args:[.35,1.8,4]})}),j.jsx("mesh",{material:_t.navy,position:[0,1.2,0],children:j.jsx("boxGeometry",{args:[1,.1,1]})})]})}function HR(){return j.jsxs("group",{children:[j.jsx("mesh",{material:_t.building,position:[0,1.2,0],children:j.jsx("cylinderGeometry",{args:[.35,.5,2.4,8]})}),j.jsx("mesh",{material:_t.blue,position:[0,2.6,0],children:j.jsx("sphereGeometry",{args:[.4,12,10]})})]})}const VR={mumbai:OR,delhi:BR,agra:zR,paris:kR};function GR({city:r}){const e=VR[r.toLowerCase()]??HR;return j.jsx(e,{})}function vp(r){let e=r;return()=>((e=e*16807%2147483647)-1)/2147483646}function Zd({position:r,seed:e,count:t=14,spread:n=3.2}){const i=ae.useMemo(()=>{const s=vp(e);return Array.from({length:t},()=>{const a=.25+s()*.35,c=.4+s()*1.8;return{x:(s()-.5)*n*2,z:-.8-s()*2.2,w:a,h:c,dark:s()>.6}})},[e,t,n]);return j.jsx("group",{position:r,children:i.map((s,a)=>j.jsx("mesh",{material:s.dark?_t.buildingDark:_t.building,position:[s.x,s.h/2,s.z],children:j.jsx("boxGeometry",{args:[s.w,s.h,s.w]})},a))})}function WR(){const r=ae.useMemo(()=>{const t=vp(7);return Array.from({length:10},()=>({x:-16+t()*44,z:-24-t()*12,s:3+t()*4,h:1.2+t()*1.6}))},[]),e=ae.useMemo(()=>{const t=vp(21);return Array.from({length:22},()=>({x:-5+t()*22,z:-5+t()*12,s:.12+t()*.14}))},[]);return j.jsxs("group",{children:[j.jsx("mesh",{material:_t.ground,rotation:[-Math.PI/2,0,0],position:[4,0,0],receiveShadow:!0,children:j.jsx("circleGeometry",{args:[40,48]})}),r.map((t,n)=>j.jsx("mesh",{material:_t.hill,position:[t.x,t.h/2-.05,t.z],children:j.jsx("coneGeometry",{args:[t.s,t.h,6]})},n)),e.map((t,n)=>j.jsx("mesh",{material:_t.tree,position:[t.x,t.s,t.z],children:j.jsx("coneGeometry",{args:[t.s*.7,t.s*2.2,5]})},`t${n}`))]})}function ya({position:r,scale:e=1}){return j.jsx("group",{position:r,scale:e,children:[[0,0,0,1],[.9,-.15,.1,.75],[-.85,-.2,0,.7],[.35,.35,-.2,.65]].map(([t,n,i,s],a)=>j.jsx("mesh",{material:_t.cloud,position:[t,n,i],scale:s,children:j.jsx("icosahedronGeometry",{args:[.8,3]})},a))})}const Kt=(r,e,t)=>new D(r,e,t),_p={mumbai:{name:"Mumbai",code:"BOM",pos:Kt(-1,0,3.5),landmark:Kt(-1.4,0,2.2),card:"Gateway of India"},delhi:{name:"Delhi",code:"DEL",pos:Kt(5.5,0,-1.5),landmark:Kt(5.2,0,-2.8),card:"India Gate"},agra:{name:"Agra",code:"AGC",pos:Kt(10.8,0,2.8),landmark:Kt(11.5,0,1),card:"Taj Mahal"}},Sa=new wh([Kt(-1,.8,3.5),Kt(.8,3.6,2.6),Kt(3.2,4.7,.8),Kt(5,2.3,-1),Kt(5.5,.8,-1.5)]),fu=new wh([Kt(5.8,.12,-1.1),Kt(7,.12,1.6),Kt(8.8,.12,3.8),Kt(10.3,.12,3.6),Kt(10.8,.12,2.9)]),XR={"on-track":"#16A34A",departed:"#16A34A",delayed:"#EF4444","at-risk":"#F59E0B",recovered:"#12B5E5"},Yv={"on-track":"On Track",departed:"Departed",delayed:"Delayed","at-risk":"At Risk",recovered:"Recovered"};function jv({curve:r,count:e,progressRef:t,color:n}){const i=ae.useRef(null),s=ae.useMemo(()=>Array.from({length:e},(c,u)=>r.getPointAt(u/(e-1))),[r,e]),a=ae.useMemo(()=>new Tt,[]);return Bo(()=>{if(!i.current)return;const c=t.current;s.forEach((u,h)=>{const f=h/(e-1),p=f<=c;a.position.copy(u),a.scale.setScalar(p?.55+.45*Math.max(0,1-(c-f)*6):1e-4),a.updateMatrix(),i.current.setMatrixAt(h,a.matrix)}),i.current.instanceMatrix.needsUpdate=!0}),j.jsxs("instancedMesh",{ref:i,args:[void 0,void 0,e],frustumCulled:!1,children:[j.jsx("sphereGeometry",{args:[.06,8,6]}),j.jsx("meshBasicMaterial",{color:n,transparent:!0,opacity:.9,toneMapped:!1})]})}function qR({color:r}){const e=ae.useRef(null);return Bo(({clock:t})=>{if(!e.current)return;const n=t.elapsedTime%2/2;e.current.scale.setScalar(.6+n*1.6),e.current.material.opacity=.55*(1-n)}),j.jsxs("mesh",{ref:e,rotation:[-Math.PI/2,0,0],position:[0,.03,0],children:[j.jsx("ringGeometry",{args:[.35,.5,32]}),j.jsx("meshBasicMaterial",{color:r,transparent:!0,toneMapped:!1})]})}function Jd({city:r,status:e,selected:t,onToggle:n,extra:i,compact:s}){const a=_p[r],[c,u]=ae.useState(!1),h=XR[e];return ae.useEffect(()=>(document.body.style.cursor=c?"pointer":"",()=>{document.body.style.cursor=""}),[c]),j.jsxs("group",{position:a.pos,children:[j.jsx(qR,{color:h}),j.jsxs("mesh",{position:[0,.25,0],scale:c||t?1.35:1,onPointerOver:f=>{f.stopPropagation(),u(!0)},onPointerOut:()=>u(!1),onClick:f=>{f.stopPropagation(),n()},children:[j.jsx("sphereGeometry",{args:[.22,16,12]}),j.jsx("meshStandardMaterial",{color:h,emissive:h,emissiveIntensity:.55})]}),j.jsxs(my,{position:[0,3.9,0],center:!0,zIndexRange:[5,0],wrapperClass:"ss-hero-html",style:{transform:r==="agra"?s?"translateX(-30%)":"translateX(-38%)":void 0},children:[j.jsxs("button",{onClick:n,onMouseEnter:()=>u(!0),onMouseLeave:()=>u(!1),className:Ma("ss-float flex items-center gap-2.5 whitespace-nowrap rounded-2xl border border-white/80 bg-white/90 p-1.5 pr-3.5 text-left shadow-lift backdrop-blur-md transition",(c||t)&&"scale-105 border-brand/40"),"aria-label":`${a.name}: ${Yv[e]}`,"aria-expanded":t,children:[!s&&j.jsx("img",{src:pS(a.name),alt:"",className:"h-11 w-14 rounded-xl object-cover"}),j.jsxs("span",{className:"leading-tight",children:[j.jsx("span",{className:"block text-sm font-bold text-ink",children:a.name}),j.jsxs("span",{className:"mt-0.5 flex items-center gap-1 text-xs font-semibold",style:{color:h},children:[j.jsx("span",{className:"h-1.5 w-1.5 rounded-full",style:{background:h}}),Yv[e]]})]})]}),t&&j.jsxs("div",{className:"mt-2 w-56 rounded-2xl border border-line bg-white p-3 text-xs text-ink-soft shadow-lift animate-scale-in",children:[j.jsxs("div",{className:"font-bold text-ink",children:[a.name," (",a.code,")"]}),j.jsx("div",{className:"mt-0.5 text-ink-muted",children:a.card}),j.jsx("div",{className:"mt-2",children:YR(r,e)}),i&&j.jsx("div",{className:"mt-1.5 font-semibold text-brand",children:i})]})]})]})}function YR(r,e){return r==="mumbai"?"UA 901 departed 08:00 AM from Terminal 2.":r==="delhi"?e==="delayed"?"Arrival pushed to 11:50 AM (+95 min). Safar Sathi re-checked every downstream booking.":"Arriving 10:15 AM · 70 min connection to the Agra train.":e==="at-risk"?"Train connection at risk: only 45 min buffer left.":e==="recovered"?"Rebooked onto the next express · hotel check-in protected.":"Arriving 03:05 PM · Taj hotel check-in at 04:00 PM."}function jR({reducedMotion:r}){const{camera:e,size:t}=ml(),n=ae.useRef({x:0,y:0}),i=ae.useRef(0),s=ae.useMemo(()=>new D,[]);return ae.useEffect(()=>{const a=e;window.innerWidth<1024?a.clearViewOffset():a.setViewOffset(t.width,t.height,-t.width*.21,-t.height*.02,t.width,t.height),a.updateProjectionMatrix()},[e,t.width,t.height]),ae.useEffect(()=>{const a=u=>{n.current={x:u.clientX/window.innerWidth-.5,y:u.clientY/window.innerHeight-.5}},c=()=>{i.current=Math.min(1,window.scrollY/window.innerHeight)};return window.addEventListener("pointermove",a,{passive:!0}),window.addEventListener("scroll",c,{passive:!0}),()=>{window.removeEventListener("pointermove",a),window.removeEventListener("scroll",c)}},[]),Bo((a,c)=>{const u=window.innerWidth<1024,h=window.innerWidth<640,f=u?h?Kt(5.4,11.5,24):Kt(5.2,9.5,21):Kt(3.5,13,28.5),p=u?Kt(5.3,h?2.4:.6,1):Kt(5.8,.2,.5),m=r?0:1,v=u?0:i.current,x=Kt(f.x+n.current.x*1.6*m,f.y-n.current.y*.8*m+v*2.5,f.z-v*2.5);e.position.lerp(x,r?1:Math.min(1,c*2.2)),s.lerp(p,r?1:Math.min(1,c*2.2)),e.lookAt(s)}),null}function ZR({focus:r,reducedMotion:e,onSample:t}){const n=ae.useRef(null),i=ae.useRef([]),s=ae.useRef(null),a=ae.useRef(e?dS:0),c=ae.useRef(0),u=ae.useRef(0),[h,f]=ae.useState(()=>Wg(a.current)),[p,m]=ae.useState(null),v=ml(U=>U.size.width<640),x=ae.useRef(""),M=ae.useMemo(()=>({tangent:new D,ahead:new D,look:new D}),[]);Bo((U,P)=>{e||(a.current=(a.current+Math.min(P,.1))%mS);const I=Wg(a.current);if(c.current=I.flight,u.current=I.train,n.current){const k=Math.min(.999,Math.max(.001,I.flight)),b=Sa.getPointAt(k);Sa.getTangentAt(k,M.tangent),Sa.getTangentAt(Math.min(.999,k+.02),M.ahead),n.current.position.copy(b),n.current.lookAt(M.look.copy(b).add(M.tangent));const C=M.tangent.x*M.ahead.z-M.tangent.z*M.ahead.x;n.current.rotateZ(sl.clamp(C*18,-.35,.35)),n.current.visible=I.flight<.995}i.current.forEach((k,b)=>{if(!k)return;const C=Math.min(.999,Math.max(.001,I.train-b*.035)),G=fu.getPointAt(C);fu.getTangentAt(C,M.tangent),k.position.copy(G),k.rotation.set(0,Math.atan2(-M.tangent.z,M.tangent.x),0),k.visible=I.train>.001||b===0}),s.current&&!e&&s.current.children.forEach((k,b)=>{k.position.x+=P*(.12+b*.02),k.position.x>22&&(k.position.x=-12)});const B=`${I.phase}|${I.flightStatus}|${I.railStatus}|${I.stops.delhi}|${I.stops.agra}`;B!==x.current&&(x.current=B,f(I),t(I))});const y=h.flightStatus==="delayed"?"#FF6B6B":"#FFFFFF",_=h.railStatus==="at-risk"?"#F59E0B":h.railStatus==="scheduled"?"#7DB4FF":h.railStatus==="recovered"?"#12B5E5":"#16A34A",E=ae.useMemo(()=>Sa.getPoints(90),[]),w=ae.useMemo(()=>fu.getPoints(90),[]),T=U=>U?1:.35;return j.jsxs(j.Fragment,{children:[j.jsx(WR,{}),j.jsx(Zd,{position:[-1,0,1.8],seed:3}),j.jsx(Zd,{position:[5.6,0,-3.3],seed:5,count:16}),j.jsx(Zd,{position:[10.8,0,-.6],seed:9,count:8,spread:2.4}),Object.keys(_p).map(U=>j.jsx("group",{position:_p[U].landmark,scale:U==="agra"?1.05:.95,children:j.jsx(GR,{city:U})},U)),j.jsx(qv,{points:E,color:y,lineWidth:1.6,dashed:!0,dashSize:.25,gapSize:.18,transparent:!0,opacity:.85*T(r!=="trains")}),j.jsx(jv,{curve:Sa,count:60,progressRef:c,color:h.flightStatus==="delayed"?"#FF8A8A":"#BFE9FF"}),j.jsx(qv,{points:w,color:_,lineWidth:2.4,dashed:h.railStatus!=="recovered",dashSize:.2,gapSize:.14,transparent:!0,opacity:T(r!=="flights")}),j.jsx(jv,{curve:fu,count:40,progressRef:u,color:"#8BE3FF"}),j.jsx(UR,{ref:n,children:j.jsxs(my,{position:[0,.9,0],center:!0,zIndexRange:[6,0],children:[j.jsxs("button",{onClick:()=>m(U=>U==="flight"?null:"flight"),className:Ma("flex items-center gap-2.5 whitespace-nowrap rounded-2xl border bg-white/92 px-3 py-2 text-left shadow-lift backdrop-blur-md transition",h.flightStatus==="delayed"?"border-danger/40":"border-white/80",r==="trains"&&"opacity-60"),"aria-label":"Flight UA 901 status","aria-expanded":p==="flight",children:[j.jsx("span",{className:Ma("h-2 w-2 rounded-full",h.flightStatus==="delayed"?"bg-danger animate-pulse":"bg-safe")}),j.jsxs("span",{className:"leading-tight",children:[j.jsx("span",{className:"block text-sm font-bold text-ink",children:"UA 901"}),j.jsx("span",{className:Ma("block text-xs font-semibold",h.flightStatus==="delayed"?"text-danger":"text-safe"),children:h.flightStatus==="delayed"?"+95 min delay":h.flightStatus==="landed"?"Landed":"On Track"})]}),!v&&j.jsx("span",{className:"border-l border-line pl-2.5 text-xs text-ink-muted",children:"BOM → DEL"})]}),p==="flight"&&j.jsxs("div",{className:"mt-2 w-60 rounded-2xl border border-line bg-white p-3 text-xs text-ink-soft shadow-lift animate-scale-in",children:[j.jsx("div",{className:"font-bold text-ink",children:"Flight UA 901"}),j.jsx("div",{className:"text-ink-muted",children:"Mumbai → Delhi"}),j.jsx("div",{className:Ma("mt-2 font-semibold",h.flightStatus==="delayed"?"text-danger":"text-safe"),children:h.flightStatus==="on-track"?"On schedule · arrives 10:15 AM":"+95 min delay · arrives 11:50 AM"}),j.jsxs("div",{className:"mt-1",children:["Downstream: Delhi → Agra train ",h.railStatus==="at-risk"?"at risk":h.railStatus==="scheduled"?"on track":"protected by Safar Sathi","."]})]})]})}),j.jsx(FR,{carRefs:(U,P)=>{i.current[P]=U}}),j.jsx(Jd,{compact:v,city:"mumbai",status:h.stops.mumbai,selected:p==="mumbai",onToggle:()=>m(U=>U==="mumbai"?null:"mumbai")}),j.jsx(Jd,{compact:v,city:"delhi",status:h.stops.delhi,selected:p==="delhi",onToggle:()=>m(U=>U==="delhi"?null:"delhi"),extra:r==="transfers"?"Transfer: airport → New Delhi station, 50 min":void 0}),j.jsx(Jd,{compact:v,city:"agra",status:h.stops.agra,selected:p==="agra",onToggle:()=>m(U=>U==="agra"?null:"agra"),extra:r==="hotels"?"Hotel: Taj, check-in 4:00 PM":void 0}),j.jsxs("group",{ref:s,children:[j.jsx(ya,{position:[-6,8.5,-14],scale:1.6}),j.jsx(ya,{position:[3,9.5,-18],scale:2.1}),j.jsx(ya,{position:[11,8,-12],scale:1.3}),j.jsx(ya,{position:[18,10,-20],scale:2.4}),j.jsx(ya,{position:[8,6.8,-6],scale:.7})]}),!e&&j.jsx(DR,{count:36,scale:[26,7,14],position:[5,4,0],size:2.2,speed:.25,opacity:.55,color:"#ffffff"})]})}function n2({focus:r,reducedMotion:e,active:t,onSample:n}){return j.jsxs(mR,{className:"!absolute inset-0",dpr:[1,1.5],frameloop:t?e?"demand":"always":"never",camera:{position:[3.5,12.5,27],fov:34,near:.1,far:160},gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},"aria-hidden":"true",children:[j.jsx("fog",{attach:"fog",args:["#EDF3FB",36,78]}),j.jsx("hemisphereLight",{args:["#DDEBFF","#EAD9C4",.75]}),j.jsx("directionalLight",{position:[10,14,8],intensity:2,color:"#FFE2C2"}),j.jsx("directionalLight",{position:[-8,6,-6],intensity:.35,color:"#BFD8FF"}),j.jsx(jR,{reducedMotion:e}),j.jsx(ZR,{focus:r,reducedMotion:e,onSample:n})]})}export{n2 as default};
