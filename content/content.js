function setVysledekKontrolyZdravotniPojistovnaText(text) {
    var VysledekKontrolyZdravotniPojistovnaText = document.getElementById("VysledekKontrolyZdravotniPojistovna");

    if(!VysledekKontrolyZdravotniPojistovnaText) {
        VysledekKontrolyZdravotniPojistovnaText = document.createElement("div");
        VysledekKontrolyZdravotniPojistovnaText.setAttribute("class", "textField");
        VysledekKontrolyZdravotniPojistovnaText.setAttribute("id", "VysledekKontrolyZdravotniPojistovna");
        ZdravotniPojistovnaKod.parentNode.insertBefore(VysledekKontrolyZdravotniPojistovnaText, ZdravotniPojistovnaKod.nextSibling);
    } else {
        VysledekKontrolyZdravotniPojistovnaText.style.display = "block";
    }
    VysledekKontrolyZdravotniPojistovnaText.innerHTML = text;
}

function VysledekKontrolyZdravotniPojistovnaText() {
    const ZdravotniPojistovnaKod = document.getElementById("ZdravotniPojistovnaKod");
    if(
        ZdravotniPojistovnaKod && (
            ZdravotniPojistovnaKod.value == "111" ||
            ZdravotniPojistovnaKod.value == "201" ||
            ZdravotniPojistovnaKod.value == "205" ||
            ZdravotniPojistovnaKod.value == "207" ||
            ZdravotniPojistovnaKod.value == "209" ||
            ZdravotniPojistovnaKod.value == "211" ||
            ZdravotniPojistovnaKod.value == "213"
        )
    ) {
        const TestovanyCisloPojistence = document.getElementById("TestovanyCisloPojistence");
        if(TestovanyCisloPojistence && TestovanyCisloPojistence.value) {
            chrome.runtime.sendMessage({
                "text": "PrubehPojisteniDruhB2B",
                "data": {
                    "CisloPojistence": TestovanyCisloPojistence.value
                }
            }, function(VysledekKontroly) {
                if(
                    VysledekKontroly 
                ) {
                    if(VysledekKontroly.stav == "pojisten") {

                        if(VysledekKontroly.kodPojistovny != ZdravotniPojistovnaKod.value) {
                            alert("Neshoduje se kód pojišťovny na žádance: '" + ZdravotniPojistovnaKod.value + "' a kód pojištovny dohledaného k číslu pojištěnce: '" + VysledekKontroly.kodPojistovny + "'");
                        }

                        setVysledekKontrolyZdravotniPojistovnaText(
                            "Stav: " + VysledekKontroly.stav + "<br>" +
                            "Kód: " + VysledekKontroly.kodPojistovny + "<br>" +
                            "Název: " + VysledekKontroly.nazevPojistovny + "<br>" +
                            "Druh: " + VysledekKontroly.druhPojisteni + "<br>"
                        );
                    } else if(VysledekKontroly.stav == "nepojisten") {

                        alert("Nepojištěn");

                        setVysledekKontrolyZdravotniPojistovnaText(
                            "Stav: " + VysledekKontroly.stav + "<br>"
                        );
                    }
                }
            });
        } else {
            setVysledekKontrolyZdravotniPojistovnaText("Zadejte číslo pojištěnce");
        }
    } else {
        const VysledekKontrolyZdravotniPojistovnaText = document.getElementById("VysledekKontrolyZdravotniPojistovna");
        if (VysledekKontrolyZdravotniPojistovnaText) {
            VysledekKontrolyZdravotniPojistovnaText.style.display = "none";
        }
    }
}

const ZdravotniPojistovnaKod = document.getElementById("ZdravotniPojistovnaKod");

if(ZdravotniPojistovnaKod) {
    ZdravotniPojistovnaKod.addEventListener("change", () => {
        VysledekKontrolyZdravotniPojistovnaText();
    });
}

const TestovanyCisloPojistence = document.getElementById("TestovanyCisloPojistence");

if(TestovanyCisloPojistence) {
    TestovanyCisloPojistence.addEventListener("change", () => {
        VysledekKontrolyZdravotniPojistovnaText();
    });
}

VysledekKontrolyZdravotniPojistovnaText();


const printDiv = document.getElementById("printDiv");

if(printDiv) {
    var ICPElement = document.evaluate('//td[contains(text(), "IČP / Branch ID No.")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

    var ICP = ICPElement.singleNodeValue.nextSibling.nextSibling.innerText;

    chrome.runtime.sendMessage({
        "text": "stavSmlouvyICPICPPB2B",
        "data": {
            "ICP": ICP
        }
    }, function(VysledekKontroly) {
        if(VysledekKontroly) {
            if(
                VysledekKontroly.stavVyrizeniPozadavku
            ) {
                var tableElement = document.createElement("table");
                    tableElement.setAttribute("class", "zadanka");
                    tableElement.setAttribute("style", "width: 100%;");

                var tbodyElement = document.createElement("tbody");
                    tableElement.appendChild(tbodyElement);

                var thHeaderElement = document.createElement("th");
                    thHeaderElement.setAttribute("colspan", 2);
                    thHeaderElement.innerText = "Smlouva s pojišťovnou žádajícího zařízení / Insurance contract of requesting facility";

                var trHeaderElement = document.createElement("tr");
                    trHeaderElement.appendChild(thHeaderElement);
                    tableElement.appendChild(trHeaderElement);

                tableElement.appendChild(createRow("Odbornost / Expertise of medical facility", VysledekKontroly.odbornost));
                tableElement.appendChild(createRow("Datum od / Date from", VysledekKontroly.datumOd));
                tableElement.appendChild(createRow("Datum do / Date to", VysledekKontroly.datumDo));
                tableElement.appendChild(createRow("Název zdravotnického zařízení / Name of medical facility", VysledekKontroly.nazevZZ));
                tableElement.appendChild(createRow("Název pracoviště / Name of workplace", VysledekKontroly.nazevP));
                tableElement.appendChild(createRow("Ulice / Street", VysledekKontroly.ulice));
                tableElement.appendChild(createRow("Místo / Place", VysledekKontroly.misto));
                tableElement.appendChild(createRow("PSČ / Postcode", VysledekKontroly.psc));
                tableElement.appendChild(createRow("Přijmení a jméno / Surname and first name", VysledekKontroly.prijmeniJmeno));

                printDiv.insertBefore(tableElement, printDiv.lastChild);
                printDiv.insertBefore(document.createElement("br"), tableElement);
            } else {
                alert("Žádající zdravotnické zařízení nemá smlouvu s pojišťovnou")
            }
        }
    });
}

function createRow(labelText, valueText) {
    var trElement = document.createElement("tr");
    var tdElement = document.createElement("td");
    tdElement.setAttribute("style", "width: 30%;");
    tdElement.innerText = labelText;
    trElement.appendChild(tdElement);
    var tdValueElement = document.createElement("td");
    tdValueElement.innerText = valueText;
    trElement.appendChild(tdValueElement);
    return trElement;
}