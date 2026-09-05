const seed=[
{id:1,title:"Help provide school supplies for local children",category:"Education",raised:7200,goal:10000,donors:84,story:"We are raising funds to provide essential school supplies and learning materials to children in our community. Every contribution helps give a child the tools they need to learn."},
{id:2,title:"Emergency support for a family rebuilding",category:"Emergency",raised:4850,goal:8000,donors:61,story:"After an unexpected emergency, this family needs help covering immediate living expenses while they get back on their feet. Thank you for helping them through this difficult period."},
{id:3,title:"Community project to improve our neighborhood",category:"Community",raised:3150,goal:5000,donors:43,story:"Our community is coming together to improve a shared space and create a safer, more welcoming environment for everyone. Your support can help us reach the finish line."}
];
let campaigns=JSON.parse(localStorage.getItem("giveforward_campaigns")||"null")||seed;
const save=()=>localStorage.setItem("giveforward_campaigns",JSON.stringify(campaigns));
const fmt=n=>"$"+Number(n).toLocaleString("en-US");
function card(c){let p=Math.min(100,c.raised/c.goal*100);return `<article class="card"><a href="campaign.html?id=${c.id}"><div class="thumb">${c.category}</div></a><div class="card-body"><div class="kicker">${c.category}</div><h3><a href="campaign.html?id=${c.id}">${c.title}</a></h3><div class="bar"><i style="width:${p}%"></i></div><p><b>${fmt(c.raised)}</b> raised of ${fmt(c.goal)}</p><p class="muted-text">${c.donors} people have donated</p></div></article>`}
function render(list=campaigns){let e=document.getElementById("campaigns");if(e)e.innerHTML=list.map(card).join("")||"<p>No fundraisers found.</p>"}
document.addEventListener("DOMContentLoaded",()=>{
 render();
 const s=document.getElementById("search");if(s)s.oninput=()=>{let q=s.value.toLowerCase();render(campaigns.filter(c=>(c.title+" "+c.category+" "+c.story).toLowerCase().includes(q)))};
 const f=document.getElementById("form");if(f)f.onsubmit=e=>{e.preventDefault();let d=new FormData(f),c={id:Date.now(),title:d.get("title"),category:d.get("category"),raised:0,goal:Number(d.get("goal")),donors:0,story:d.get("story"),image:d.get("image")};campaigns.unshift(c);save();location.href="campaign.html?id="+c.id};
 const id=new URLSearchParams(location.search).get("id");if(id)loadCampaign(id);
});
function loadCampaign(id){let c=campaigns.find(x=>String(x.id)===String(id));if(!c)return;document.title=c.title+" — GiveForward";setText("title",c.title);setText("category",c.category);setText("story",c.story);setText("raised",fmt(c.raised));setText("goal"," raised of "+fmt(c.goal));setText("donors",c.donors+" people have donated");let p=Math.min(100,c.raised/c.goal*100);document.getElementById("progress").style.width=p+"%";if(c.image){let e=document.getElementById("campaign-image");e.style.backgroundImage=`url("${c.image}")`;e.textContent=""}}
function setText(id,t){let e=document.getElementById(id);if(e)e.textContent=t}
let selected=25;
function openDonate(){document.getElementById("modal")?.classList.add("open")}
function closeDonate(){document.getElementById("modal")?.classList.remove("open")}
function pick(n){selected=n;document.getElementById("custom").value=n}
function checkout(){let v=Number(document.getElementById("custom").value)||selected;if(v>0)alert(`Demo checkout: $${v}. No money is charged.`)}
async function share(){try{await navigator.clipboard.writeText(location.href);alert("Campaign link copied!")}catch{alert("Copy the page URL to share this fundraiser.")}}