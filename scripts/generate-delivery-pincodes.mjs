import fs from 'node:fs';
import Papa from 'papaparse';
const rows=Papa.parse(fs.readFileSync('pincode.csv','utf8'),{header:true,skipEmptyLines:true}).data;
const aliases={'KANNIYAKUMARI':'KANYAKUMARI','THE NILGIRIS':'NILGIRIS','THIRUVALLUR':'TIRUVALLUR','THIRUVARUR':'TIRUVARUR','TUTICORIN':'THOOTHUKUDI','VILLUPURAM':'VILUPPURAM'};
const counts=new Map();
for(const row of rows){
  if(row.statename?.trim().toUpperCase()!=='TAMIL NADU' || !/^\d{6}$/.test(row.pincode)) continue;
  let district=row.district.trim().toUpperCase();district=aliases[district]||district;
  const options=counts.get(row.pincode)||new Map();options.set(district,(options.get(district)||0)+1);counts.set(row.pincode,options);
}
const pincodes=Object.fromEntries([...counts].sort(([a],[b])=>a.localeCompare(b)).map(([pin,options])=>[pin,[...options].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0][0]]));
fs.writeFileSync('src/data/deliveryPincodes.json',JSON.stringify(pincodes)+'\n');
console.log(`Generated ${Object.keys(pincodes).length} Tamil Nadu pincodes from the repository postal dataset.`);
