const campaigns = [
  {id:1,title:"Help provide school supplies for local children",category:"Education",raised:7200,goal:10000,donors:84,story:"We are raising funds to provide essential school supplies and learning materials to children in our community. Every contribution helps give a child the tools they need to learn.",image:""},
  {id:2,title:"Emergency support for a family rebuilding",category:"Emergency",raised:4850,goal:8000,donors:61,story:"After an unexpected emergency, this family needs help covering immediate living expenses while they get back on their feet. Thank you for helping them through this difficult period.",image:""},
  {id:3,title:"Community project to improve our neighborhood",category:"Community",raised:3150,goal:5000,donors:43,story:"Our community is coming together to improve a shared space and create a safer, more welcoming environment for everyone. Your support can help us reach the finish line.",image:""}
];

function money(n){return "$"+Number(n).toLocaleString("en-US")}
function card(c){
  const pct=Math.min(100,Math.round(c.raised/c.goal*100));
  return `<article class="campaign-card"><a href="campaign.html?id=${c.id}"><div class="campaign-thumb">${c.category}</div></a><div class="campaign-body"><p class="eyebrow">${c.category}</p><h3><a href="campaign.html?id=${c.id}">${c.title}</a></h3><div class="progress"><span style="width:${pct}%"></span></div><p><strong>${money(c.raised)}</strong> raised of ${money(c.goal)}</p><p class="small">${c.donors} people have donated</p></div></article>`;
}

function render(list=campaigns){
  const el=document.getElementById("campaigns");
  if(el) el.innerHTML=list.map(card).join("") || "<p>No fundraisers found.</p>";
}
document.addEventListener("DOMContentLoaded",()=>{
  render();
  const search=document.getElementById("search");
  if(search) search.addEventListener("input",e=>{
    const q=e.target.value.toLowerCase();
    render(campaigns.filter(c=>(c.title+" "+c.category+" "+c.story).toLowerCase().includes(q)));
  });

  const form=document.getElementById("create-form");
  if(form) form.addEventListener("submit",e=>{
    e.preventDefault();
    const data=new FormData(form);
    const c={id:Date.now(),title:data.get("title"),category:data.get("category"),raised:0,goal:Number(data.get("goal")),donors:0,story:data.get("story"),image:data.get("image")};
    campaigns.unshift(c);
    localStorage.setItem("giveforward_campaigns",JSON.stringify(campaigns));
    window.location.href="campaign.html?id="+c.id;
  });

  const id=new URLSearchParams(location.search).get("id");
  if(id){
    const c=campaigns.find(x=>String(x.id)===String(id));
    if(c){
      document.title=c.title+" — GiveForward";
      set("campaign-title",c.title); set("campaign-category",c.category); set("campaign-story",c.story);
      set("campaign-raised",money(c.raised)); set("campaign-goal"," raised of "+money(c.goal)); set("campaign-donors",c.donors+" people have donated");
      document.getElementById("campaign-progress").style.width=Math.min(100,c.raised/c.goal*100)+"%";
      const img=document.getElementById("campaign-image");
      if(c.image) img.style.backgroundImage=`url('${c.image}')`,img.textContent="";
      else img.textContent=c.category;
    }
  }
});
function set(id,text){const e=document.getElementById(id);if(e)e.textContent=text}
function donate(){alert("Donation checkout will be connected to a payment provider in the next step.")}
function shareCampaign(){
  navigator.clipboard?.writeText(location.href);
  alert("Campaign link copied!");
}