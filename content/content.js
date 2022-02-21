function getVysledekKontrolyZdravotniPojistovnaTextElement(text) {
    var VysledekKontrolyZdravotniPojistovnaTextElement = document.getElementById("VysledekKontrolyZdravotniPojistovna");

    if(!VysledekKontrolyZdravotniPojistovnaTextElement) {
        VysledekKontrolyZdravotniPojistovnaTextElement = document.createElement("div");
        VysledekKontrolyZdravotniPojistovnaTextElement.setAttribute("class", "textField");
    } else {
        VysledekKontrolyZdravotniPojistovnaTextElement.style.display = "block";
    }
    VysledekKontrolyZdravotniPojistovnaTextElement.innerHTML = text;

    return VysledekKontrolyZdravotniPojistovnaTextElement;
}

function VysledekKontrolyZdravotniPojistovnaText() {

    const VysledekKontrolyZdravotniPojistovnaElementId = "VysledekKontrolyZdravotniPojistovna";

    // Vystavení žádanky
    const ZdravotniPojistovnaKod = document.getElementById("ZdravotniPojistovnaKod");
    const TestovanyCisloPojistence = document.getElementById("TestovanyCisloPojistence");

    // Detail pacienta
    const Pacient_CisloPojistenceLabelElement = document.querySelector('label[for="Pacient_CisloPojistence"]');
    var DetailPacientCisloPojistence = null;
    if(Pacient_CisloPojistenceLabelElement) {
        DetailPacientCisloPojistence = Pacient_CisloPojistenceLabelElement.nextElementSibling.innerText;
    }

    if(
        ZdravotniPojistovnaKod && (
            ZdravotniPojistovnaKod.value == "111" ||
            ZdravotniPojistovnaKod.value == "201" ||
            ZdravotniPojistovnaKod.value == "205" ||
            ZdravotniPojistovnaKod.value == "207" ||
            ZdravotniPojistovnaKod.value == "209" ||
            ZdravotniPojistovnaKod.value == "211" ||
            ZdravotniPojistovnaKod.value == "213"
        ) || Pacient_CisloPojistenceLabelElement
    ) {
        const CisloPojistenceElement = Pacient_CisloPojistenceLabelElement ? Pacient_CisloPojistenceLabelElement : TestovanyCisloPojistence;
        const CisloPojistence = DetailPacientCisloPojistence ? DetailPacientCisloPojistence : (TestovanyCisloPojistence ? TestovanyCisloPojistence.value : null)
        const VysledekNextElement = ZdravotniPojistovnaKod ? ZdravotniPojistovnaKod : Pacient_CisloPojistenceLabelElement.nextElementSibling;

        if(CisloPojistence) {
            chrome.runtime.sendMessage({
                "text": "PrubehPojisteniDruhB2B",
                "data": {
                    "CisloPojistence": CisloPojistence
                }
            }, function(VysledekKontroly) {

                if(VysledekKontroly) {

                    var VysledekElement = null;

                    if(VysledekKontroly.stav == "pojisten") {

                        if(ZdravotniPojistovnaKod && VysledekKontroly.kodPojistovny != ZdravotniPojistovnaKod.value) {
                            alert("Neshoduje se kód pojišťovny na žádance: '" + ZdravotniPojistovnaKod.value + "' a kód pojištovny dohledaného k číslu pojištěnce: '" + VysledekKontroly.kodPojistovny + "'");
                        }

                        VysledekElement = getVysledekKontrolyZdravotniPojistovnaTextElement(
                            "Stav: " + VysledekKontroly.stav + "<br>" +
                            "Kód: " + VysledekKontroly.kodPojistovny + "<br>" +
                            "Název: " + VysledekKontroly.nazevPojistovny + "<br>" +
                            "Druh: " + VysledekKontroly.druhPojisteni + "<br>",
                        );
                    } else if(VysledekKontroly.stav == "nepojisten") {

                        if(ZdravotniPojistovnaKod) {
                            alert("Nepojištěn");
                        }

                        VysledekElement = getVysledekKontrolyZdravotniPojistovnaTextElement(
                            "Stav: " + VysledekKontroly.stav + "<br>"
                        );
                    }

                    VysledekElement.setAttribute("id", VysledekKontrolyZdravotniPojistovnaElementId);
                    VysledekNextElement.parentNode.insertBefore(VysledekElement, VysledekNextElement.nextElementSibling);
                }
            });
        } else if(CisloPojistenceElement && ZdravotniPojistovnaKod) {
            VysledekElement = getVysledekKontrolyZdravotniPojistovnaTextElement(
                "Zadejte číslo pojištěnce"
            );
            VysledekElement.setAttribute("id", VysledekKontrolyZdravotniPojistovnaElementId);
            VysledekNextElement.parentNode.insertBefore(VysledekElement, VysledekNextElement.nextElementSibling);
        }
    } else {
        const VysledekKontrolyZdravotniPojistovnaText = document.getElementById(VysledekKontrolyZdravotniPojistovnaElementId);
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