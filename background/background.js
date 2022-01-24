// Duplikované v options/options.js
const chromeLocalStorageOptionsNamespace = "pro-oc-vzp-b2b-options";

const DEFAULT_B2B_PROD_SERVER_URL = 'https://prod.b2b.vzp.cz';

function getSoapTagValue(soapBody, tagName) {

    var tagStartPosition = soapBody.indexOf(tagName);
    if(tagStartPosition < 0) {
        return undefined;
    }

    var tagValueStartPosition = soapBody.substring(tagStartPosition + tagName.length + 1);

    var tagClosePosition = tagValueStartPosition.indexOf(tagName);
    if(tagClosePosition < 0) {
        return undefined;
    }

    var tagValue = tagValueStartPosition.substring(0, tagClosePosition - ("</ns0:").length);

    return tagValue;
}

function getOptionsFromLocalStorage(callback) {
    chrome.storage.local.get([chromeLocalStorageOptionsNamespace], function(data) {
        callback(data[chromeLocalStorageOptionsNamespace]);
    });
}

function padStart(num, padLen, padChar) {
    var pad = new Array(1 + padLen).join(padChar);
    return (pad + num).slice(-pad.length);
}

function PrubehPojisteniDruhB2B(CisloPojistence, onSuccess) {

    getOptionsFromLocalStorage(function(optionsURLSearchParams) {
  
        var options = new URLSearchParams(optionsURLSearchParams);
  
        var B2BServerUrlFromOptions = options.get("B2BServerUrl");
  
        var xmlhttp = new XMLHttpRequest();
  
        var DnesniDatum = new Date();
        DnesniDatumString = DnesniDatum.getFullYear() + "-" + padStart((DnesniDatum.getMonth() + 1 ), 2, "0") + "-" + padStart(DnesniDatum.getDate(), 2, "0");
  
        var sr = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n\t<soap:Body xmlns:ns1=\"http://xmlns.gemsystem.cz/PrubehPojisteniDruhB2B\">\r\n\t\t<ns1:prubehPojisteniDruhB2BPozadavek>\r\n\t\t<ns1:cisloPojistence>" + CisloPojistence + "</ns1:cisloPojistence>\r\n\t\t<ns1:kDatu>" + DnesniDatumString + "</ns1:kDatu>\r\n\t\t</ns1:prubehPojisteniDruhB2BPozadavek>\r\n\t</soap:Body>\r\n</soap:Envelope>";
  
        xmlhttp.open('POST', (B2BServerUrlFromOptions ? B2BServerUrlFromOptions : DEFAULT_B2B_PROD_SERVER_URL) + "/B2BProxy/HttpProxy/PrubehPojisteniDruhB2B", true);
        //xmlhttp.withCredentials = true;
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.onreadystatechange = function () {
            if(xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status == 200) {  
  
                var results = {
                    "stav": getSoapTagValue(xmlhttp.response, "stav"),
                    "kodPojistovny": getSoapTagValue(xmlhttp.response, "kodPojistovny"),
                    "nazevPojistovny": getSoapTagValue(xmlhttp.response, "nazevPojistovny"),
                    "druhPojisteni": getSoapTagValue(xmlhttp.response, "druhPojisteni")
                };
  
              onSuccess(results);
            }
        }
        xmlhttp.send(sr);
    });
}

function stavSmlouvyICPICPPB2B(ICP_ICPP, onSuccess) {

    getOptionsFromLocalStorage(function(optionsURLSearchParams) {
  
        var options = new URLSearchParams(optionsURLSearchParams);
  
        var B2BServerUrlFromOptions = options.get("B2BServerUrl");
  
        var xmlhttp = new XMLHttpRequest();
  
        var DnesniDatum = new Date();
        DnesniDatumString = DnesniDatum.getFullYear() + "-" + padStart((DnesniDatum.getMonth() + 1 ), 2, "0") + "-" + padStart(DnesniDatum.getDate(), 2, "0");
  
        var sr = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n\t<soap:Body xmlns:ns1=\"http://xmlns.gemsystem.cz/stavSmlouvyICPICPPB2B\">\r\n\t\t<ns1:stavSmlouvyICPICPPB2BZadost>\r\n\t\t<ns1:ICP_ICPP>" + ICP_ICPP + "</ns1:ICP_ICPP>\r\n\t\t<ns1:kDatu>" + DnesniDatumString + "</ns1:kDatu>\r\n\t\t</ns1:stavSmlouvyICPICPPB2BZadost>\r\n\t</soap:Body>\r\n</soap:Envelope>";
  
        xmlhttp.open('POST', (B2BServerUrlFromOptions ? B2BServerUrlFromOptions : DEFAULT_B2B_PROD_SERVER_URL) + "/B2BProxy/HttpProxy/stavSmlouvyICPICPPB2B", true);
        //xmlhttp.withCredentials = true;
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.onreadystatechange = function () {
            if(xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status == 200) {  
  
                var stavVyrizeniPozadavku = getSoapTagValue(xmlhttp.response, "stavVyrizeniPozadavku");
          
                if(stavVyrizeniPozadavku) {
                    var results = {
                        "odbornost": getSoapTagValue(xmlhttp.response, "odbornost"),
                        "datumOd": getSoapTagValue(xmlhttp.response, "datumOd"),
                        "datumDo": getSoapTagValue(xmlhttp.response, "datumDo"),
                        "nazevZZ": getSoapTagValue(xmlhttp.response, "nazevZZ"),
                        "nazevP": getSoapTagValue(xmlhttp.response, "nazevP"),
                        "ulice": getSoapTagValue(xmlhttp.response, "ulice"),
                        "misto": getSoapTagValue(xmlhttp.response, "misto"),
                        "psc": getSoapTagValue(xmlhttp.response, "psc"),
                        "prijmeniJmeno": getSoapTagValue(xmlhttp.response, "prijmeniJmeno"),
                        "stavVyrizeniPozadavku": stavVyrizeniPozadavku
                    };
                } else {
                    var results = {
                        "stavVyrizeniPozadavku": stavVyrizeniPozadavku
                    };
                }
                onSuccess(results);
            }
        }
        xmlhttp.send(sr);
    });
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'PrubehPojisteniDruhB2B' && msg.data.CisloPojistence) {
        PrubehPojisteniDruhB2B(msg.data.CisloPojistence, function(responsePrubehPojisteniDruhB2B) {
            sendResponse(responsePrubehPojisteniDruhB2B);
        });
        return true;
    } else if (msg.text === 'stavSmlouvyICPICPPB2B' && msg.data.ICP) {
        stavSmlouvyICPICPPB2B(msg.data.ICP, function(responseStavSmlouvyICP) {
            sendResponse(responseStavSmlouvyICP);
        });
        return true;
    }
});