const express = require("express");
var axios = require("axios");
var cors = require("cors");
const csv2json = require("./csv2json.js");

const app = express();

app.use(cors());
app.get("/", (req, res, next) => {
  const fromDate= req.query.fromDate
  const toDate =req.query.toDate
  var config = {
    method: "get",
    url:
      `https://bodia.in/Bodia/Driver/driver_report?driver=106&from_date=${fromDate}&to_date=${toDate}&report_type=export`,
    headers: {
      Cookie: "ci_session=tkphlsfe9qppgsip2oi6vvursvjidbpl",
    },
  };

  axios(config)
    .then(function (response) {
      const json = csv2json(response.data, { parseNumbers: true });

      // console.log(JSON.stringify(json))
      demoJSON = [
        {
          "Order No": 84341,
          "Order Date": "03-03-2021",
          Time: "12:57 PM",
          "Customer Name": "Aisha Das",
          "Restaurant Name": "Maa Kureisuni",
          "Payment Mode": "PHONE PE",
          "Order Amount": 379,
          "Distance Km": 0.36,
        },
        {
          "Order No": 84342,
          "Order Date": "03-03-2021",
          Time: "12:58 PM",
          "Customer Name": "mihika swain",
          "Restaurant Name": "Bombay kitchen",
          "Payment Mode": "CASH ON DELIVERY",
          "Order Amount": 596,
          "Distance Km": 2.56,
        },

        
        {
          "Order No": 843489,
          "Order Date": "04-03-2021",
          Time: "01:06 PM",
          "Customer Name": "Sunanda Panda",
          "Restaurant Name": "Bombay kitchen",
          "Payment Mode": "CASH ON DELIVERY",
          "Order Amount": 393,
          "Distance Km": 1.78,
        },
      ];
      var analysisData = reportSummaryCOD(demoJSON);
var demo = [];


demo.push(analysisData )
      res.send(JSON.stringify(demo));
    })

    .catch(function (error) {
      console.log(error);
    });
});

function reportSummaryCOD(fullJson) {
  var totalCOD = 0;

  var baseDate = fullJson[0]["Order Date"];
  var dateList = {};
  var totalIncentiveOnReport = 0;
  var totalOrderOnReport = 0;
  var totalOrder = 0;
  var dailyCOD =0;
  tempDateArray = [];
  tempDateArray.push(baseDate);
  // `  console.log(tempDateArray)`
  for (var i = 0; i < fullJson.length; i++) {
    //The -1 will not print last and miss 04-03-2021
    console.log(fullJson[i]["Order Date"])
    if (fullJson[i]["Payment Mode"] === "CASH ON DELIVERY") {
      totalCOD += fullJson[i]["Order Amount"];
      
    }
    if(baseDate===fullJson[i]["Order Date"]){
      if(fullJson[i]["Payment Mode"]==="CASH ON DELIVERY")
      {
        dailyCOD+=fullJson[i]["Order Amount"];
      }
      dateList[baseDate]={
      "Total Orders":totalOrder+=1,
      "Total COD":dailyCOD,
      "Total Incentive":calculateIncentive(totalOrder)

    }

  }
    else{
      console.log(fullJson[i]["Order Date"])
      totalIncentiveOnReport+=dateList[baseDate]['Total Incentive']
      totalOrder=0
      dailyCOD=0
      baseDate=fullJson[i]["Order Date"]
      if(fullJson[i]["Payment Mode"]==="CASH ON DELIVERY")
      {
        dailyCOD+=fullJson[i]["Order Amount"];
      }

      dateList[baseDate]={
        "Total Orders":totalOrder+=1,
        "Total COD":dailyCOD,
        "Total Incentive":calculateIncentive(totalOrder)
    }

   }}

  //  console.log(dateList);
  dateList['totalOrders']=fullJson.length
  dateList['totalSalary']=fullJson.length*25
  dateList['totalIncentive']=totalIncentiveOnReport;
  dateList['grandTotalSalary']=(fullJson.length*25)+totalIncentiveOnReport
  dateList['totalCOD']=totalCOD;

  console.log(dateList)
  return dateList;
  
  }
function calculateIncentive(totalOrder) {
  var incentiveAmount = 0;
  if (totalOrder >= 10 && totalOrder < 15) {
    incentiveAmount = 50;
    return incentiveAmount;
  } else if (totalOrder >= 15 && totalOrder < 20) {
    incentiveAmount = 75;
    return incentiveAmount;
  } else if (totalOrder >= 20 && totalOrder < 25) {
    incentiveAmount = 150;
    return incentiveAmount;
  } else if (totalOrder >= 25) {
    incentiveAmount = 200;
    return incentiveAmount;
  } else {
    return 0;
  }
}
app.listen(3000);
