function reportSummaryCOD(fullJson){
    var totalCOD=0
    var dateList=[]
    var baseDate=fullJson[0]['Order Date']
    var totalIncentiveOnReport=0
    var totalOrderOnReport=0
    var totalOrder=0
    tempDateArray=[]
    tempDateArray.push(baseDate)
  // `  console.log(tempDateArray)`
  for (var i=0;i<fullJson.length;i++){
   if(fullJson[i]['Payment Mode']==="CASH ON DELIVERY")
   {
    totalCOD+=fullJson[i]['Order Amount']
   }
   if(fullJson[i]["Order Date"]===baseDate){
    totalOrder+=1
    
  }
  else{
    tempDateArray.push(baseDate)
    console.log(fullJson[i]["Order Date"], totalOrder,fullJson[i]["Order No"])
     var incentiveAmount=calculateIncentive(totalOrder);
     totalIncentiveOnReport+=incentiveAmount;
     console.log(incentiveAmount)
     currentObject={
       "Date of Incentive":baseDate,
       "Total orders":totalOrder,
     "Total Incentives":incentiveAmount,
    }
     dateList.push(currentObject)
     totalOrderOnReport+=totalOrder
     totalOrder=0
     baseDate=fullJson[i]['Order Date']
     tempDateArray.push(baseDate);
  
     }
    
     
   }

   dateList.push({
    "Total Incentive": totalIncentiveOnReport,
    "Total Order Completed": totalOrderOnReport,
  });
  