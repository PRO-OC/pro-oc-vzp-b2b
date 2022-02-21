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

function getPrubehPojisteniDruhB2BPage() {
    return "/B2BProxy/HttpProxy/PrubehPojisteniDruhB2B";
}

function encryptBody(body) {
    return btoa(encodeURIComponent(body))
}

function getContentType(EncryptingDisabled) {
    return !EncryptingDisabled ? "text/plain" : "text/xml";
}

function decryptBody(body) {
    return decodeURIComponent(atob(body));
}

function getRequestBody(EncryptingDisabled, body) {
    return !EncryptingDisabled ? encryptBody(body) : body
}

function getResponseBody(EncryptingDisabled, body) {
    return !EncryptingDisabled ? decryptBody(body) : body;
}

function PrubehPojisteniDruhB2B(CisloPojistence, onSuccess) {

    getOptionsFromLocalStorage(function(optionsURLSearchParams) {

        var options = new URLSearchParams(optionsURLSearchParams);
        var B2BServerUrlFromOptions = options.get("B2BServerUrl");
        var B2BServerUrl = B2BServerUrlFromOptions ? B2BServerUrlFromOptions : DEFAULT_B2B_PROD_SERVER_URL;

        var EncryptingDisabled = options.get("EncryptingDisabled");

        var DnesniDatum = new Date();
        DnesniDatumString = DnesniDatum.getFullYear() + "-" + padStart((DnesniDatum.getMonth() + 1 ), 2, "0") + "-" + padStart(DnesniDatum.getDate(), 2, "0");

        var body = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Body xmlns:ns1=\"http://xmlns.gemsystem.cz/PrubehPojisteniDruhB2B\"><ns1:prubehPojisteniDruhB2BPozadavek><ns1:cisloPojistence>" + CisloPojistence + "</ns1:cisloPojistence><ns1:kDatu>" + DnesniDatumString + "</ns1:kDatu></ns1:prubehPojisteniDruhB2BPozadavek></soap:Body></soap:Envelope>";

        var url = B2BServerUrl + getPrubehPojisteniDruhB2BPage();

        fetch(url, {
            method: 'post',
            headers: {
                "Content-type": getContentType(EncryptingDisabled)
            },
            body: getRequestBody(EncryptingDisabled, body)
        })
        .then(function (response) {
            if (response.status == 200) {
                try {
                    response.text().then(function(responseText) {

                        var text = getResponseBody(EncryptingDisabled, responseText)

                        var results = {
                            "stav": getSoapTagValue(text, "stav"),
                            "kodPojistovny": getSoapTagValue(text, "kodPojistovny"),
                            "nazevPojistovny": getSoapTagValue(text, "nazevPojistovny"),
                            "druhPojisteni": getSoapTagValue(text, "druhPojisteni")
                        };
                        onSuccess(results);
                    });
                } catch(err) {
                    console.log(err);
                    return;
                }
            } else {
                return;
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}

function getStavSmlouvyICPICPPB2B() {
    return "/B2BProxy/HttpProxy/stavSmlouvyICPICPPB2B";
}

function stavSmlouvyICPICPPB2B(ICP_ICPP, onSuccess) {

    getOptionsFromLocalStorage(function(optionsURLSearchParams) {
        var options = new URLSearchParams(optionsURLSearchParams);
        var B2BServerUrlFromOptions = options.get("B2BServerUrl");
        var B2BServerUrl = B2BServerUrlFromOptions ? B2BServerUrlFromOptions : DEFAULT_B2B_PROD_SERVER_URL;

        var EncryptingDisabled = options.get("EncryptingDisabled");

        var DnesniDatum = new Date();
        DnesniDatumString = DnesniDatum.getFullYear() + "-" + padStart((DnesniDatum.getMonth() + 1 ), 2, "0") + "-" + padStart(DnesniDatum.getDate(), 2, "0");

        var body = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Body xmlns:ns1=\"http://xmlns.gemsystem.cz/stavSmlouvyICPICPPB2B\"><ns1:stavSmlouvyICPICPPB2BZadost><ns1:ICP_ICPP>" + ICP_ICPP + "</ns1:ICP_ICPP><ns1:kDatu>" + DnesniDatumString + "</ns1:kDatu></ns1:stavSmlouvyICPICPPB2BZadost></soap:Body></soap:Envelope>";

        var url = B2BServerUrl + getStavSmlouvyICPICPPB2B();
    
        fetch(url, {
            method: 'post',
            headers: {
                "Content-type": getContentType(EncryptingDisabled)
            },
            body: getRequestBody(EncryptingDisabled, body)
        })
        .then(function (response) {
            if (response.status == 200) {
                response.text().then(function(responseText) {

                    var text = getResponseBody(EncryptingDisabled, responseText);

                    var stavVyrizeniPozadavku = getSoapTagValue(text, "stavVyrizeniPozadavku");

                    if(stavVyrizeniPozadavku) {
                        var results = {
                            "odbornost": getSoapTagValue(text, "odbornost"),
                            "datumOd": getSoapTagValue(text, "datumOd"),
                            "datumDo": getSoapTagValue(text, "datumDo"),
                            "nazevZZ": getSoapTagValue(text, "nazevZZ"),
                            "nazevP": getSoapTagValue(text, "nazevP"),
                            "ulice": getSoapTagValue(text, "ulice"),
                            "misto": getSoapTagValue(text, "misto"),
                            "psc": getSoapTagValue(text, "psc"),
                            "prijmeniJmeno": getSoapTagValue(text, "prijmeniJmeno"),
                            "stavVyrizeniPozadavku": stavVyrizeniPozadavku
                        };
                        onSuccess(results);
                    } else {
                        var results = {
                            "stavVyrizeniPozadavku": stavVyrizeniPozadavku
                        };
                        onSuccess(results);
                    }
                });
            } else {
                return;
            }
        })
        .catch(function (error) {
            console.log(error);
        });
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