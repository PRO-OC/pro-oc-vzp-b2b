function getRegistrCUDOvereniUrl() {
    return "/Registr/CUD/Overeni";
}

function getVysledekKontrolyZdravotniPojistovnaTextElement(text, useTd) {
    var VysledekKontrolyZdravotniPojistovnaTextElement = document.getElementById("VysledekKontrolyZdravotniPojistovna");

    if(!VysledekKontrolyZdravotniPojistovnaTextElement) {
        VysledekKontrolyZdravotniPojistovnaTextElement = document.createElement(useTd ? "td" : "div");
        VysledekKontrolyZdravotniPojistovnaTextElement.setAttribute("class", "textField");
        VysledekKontrolyZdravotniPojistovnaTextElement.setAttribute("style", "vertical-align: text-top;");
    } else {
        VysledekKontrolyZdravotniPojistovnaTextElement.style.display = "block";
    }
    VysledekKontrolyZdravotniPojistovnaTextElement.innerHTML = DOMPurify.sanitize(text);

    return VysledekKontrolyZdravotniPojistovnaTextElement;
}

function VysledekKontrolyZdravotniPojistovnaText() {

    const VysledekKontrolyZdravotniPojistovnaElementId = "VysledekKontrolyZdravotniPojistovna";

    // Overeni zadanky
    if(KodPojistovnyPrintDiv) {
        ZdravotniPojistovnaKod = KodPojistovnyPrintDiv;
    }
    if(CisloPojistencePrintDiv) {
        TestovanyCisloPojistence = CisloPojistencePrintDiv;
    }

    // Detail pacienta
    const Pacient_CisloPojistenceLabelElement = document.querySelector('label[for="Pacient_CisloPojistence"]');
    var DetailPacientCisloPojistence = null;
    if(Pacient_CisloPojistenceLabelElement) {
        DetailPacientCisloPojistence = Pacient_CisloPojistenceLabelElement.nextElementSibling.innerText;
    }

    var ZdravotniPojistovnaKodValue = ZdravotniPojistovnaKod && ZdravotniPojistovnaKod.value ? ZdravotniPojistovnaKod.value : (ZdravotniPojistovnaKod && ZdravotniPojistovnaKod.innerText ? ZdravotniPojistovnaKod.innerText.split(" ")[0] : "");

    if(
        ZdravotniPojistovnaKod && (
            ZdravotniPojistovnaKodValue == "111" ||
            ZdravotniPojistovnaKodValue == "201" ||
            ZdravotniPojistovnaKodValue == "205" ||
            ZdravotniPojistovnaKodValue == "207" ||
            ZdravotniPojistovnaKodValue == "209" ||
            ZdravotniPojistovnaKodValue == "211" ||
            ZdravotniPojistovnaKodValue == "213"
        ) || Pacient_CisloPojistenceLabelElement
    ) {

        const CisloPojistenceElement = Pacient_CisloPojistenceLabelElement ? Pacient_CisloPojistenceLabelElement : TestovanyCisloPojistence;
        const CisloPojistence = DetailPacientCisloPojistence ? DetailPacientCisloPojistence : (TestovanyCisloPojistence && TestovanyCisloPojistence.value ? TestovanyCisloPojistence.value : (TestovanyCisloPojistence && TestovanyCisloPojistence.innerText ? TestovanyCisloPojistence.innerText : null))
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

                        if(ZdravotniPojistovnaKod && VysledekKontroly.kodPojistovny != ZdravotniPojistovnaKodValue) {
                            alert("Neshoduje se k??d poji????ovny na ????dance: '" + ZdravotniPojistovnaKodValue + "' a k??d poji??tovny dohledan??ho k ????slu poji??t??nce: '" + VysledekKontroly.kodPojistovny + "'");
                        }

                        VysledekElement = getVysledekKontrolyZdravotniPojistovnaTextElement(
                            "????slo poji??t??nce (" + CisloPojistence + "):" + "<br><br>" +
                            "Stav: " + VysledekKontroly.stav + "<br>" +
                            "K??d: " + VysledekKontroly.kodPojistovny + "<br>" +
                            "N??zev: " + VysledekKontroly.nazevPojistovny + "<br>" +
                            "Druh: " + VysledekKontroly.druhPojisteni + "<br>",
                            true
                        );
                    } else if(VysledekKontroly.stav == "nepojisten") {

                        if(ZdravotniPojistovnaKod) {
                            alert("Nepoji??t??n");
                        }

                        VysledekElement = getVysledekKontrolyZdravotniPojistovnaTextElement(
                            "????slo poji??t??nce (" + CisloPojistence + "):" + "<br><br>" +
                            "Stav: " + VysledekKontroly.stav + "<br>",
                            true
                        );
                    }

                    VysledekElement.setAttribute("id", VysledekKontrolyZdravotniPojistovnaElementId);
                    VysledekNextElement.parentNode.insertBefore(VysledekElement, VysledekNextElement.nextElementSibling);
                } else {
                    VysledekElement = getVysledekKontrolyZdravotniPojistovnaTextElement(
                        "????slo poji??t??nce (" + CisloPojistence + "):" + "<br><br>" + 
                        "Nebylo mo??n?? ov????it. Probl??m na stran?? zprost??edkovatele ov????en?? nebo poskytovatele ov????en?? VZP.",
                        true
                    );
                    VysledekElement.setAttribute("id", VysledekKontrolyZdravotniPojistovnaElementId);
                    VysledekNextElement.parentNode.insertBefore(VysledekElement, VysledekNextElement.nextElementSibling);
                }
            });
        } else if(CisloPojistenceElement && ZdravotniPojistovnaKod) {
            VysledekElement = getVysledekKontrolyZdravotniPojistovnaTextElement(
                "Zadejte ????slo poji??t??nce.",
                true
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

var ZdravotniPojistovnaKod = document.getElementById("ZdravotniPojistovnaKod");

if(ZdravotniPojistovnaKod) {
    ZdravotniPojistovnaKod.addEventListener("change", () => {
        VysledekKontrolyZdravotniPojistovnaText();
    });
}

var TestovanyCisloPojistence = document.getElementById("TestovanyCisloPojistence");

if(TestovanyCisloPojistence) {
    TestovanyCisloPojistence.addEventListener("change", () => {
        VysledekKontrolyZdravotniPojistovnaText();
    });
}

var KodPojistovnyPrintDiv = null;
var CisloPojistencePrintDiv = null;

const printDiv = document.getElementById("printDiv");

if(printDiv && window.location.pathname == getRegistrCUDOvereniUrl()) {
    const KodPojistovnyElement = document.evaluate('//td[contains(text(), "Zdravotn?? poji????ovna")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    KodPojistovnyPrintDiv = KodPojistovnyElement.singleNodeValue.nextSibling.nextSibling;
    const CisloPojistenceElement = document.evaluate('//td[contains(text(), "????slo poji??t??nce")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    CisloPojistencePrintDiv = CisloPojistenceElement.singleNodeValue.nextSibling.nextSibling;
}

VysledekKontrolyZdravotniPojistovnaText();

if(printDiv && window.location.pathname == getRegistrCUDOvereniUrl()) {
    var ICPElement = document.evaluate('//td[contains(text(), "I??P / Branch ID No.")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    var ICP = ICPElement.singleNodeValue.nextSibling.nextSibling.innerText;

    chrome.runtime.sendMessage({
        "text": "stavSmlouvyICPICPPB2B",
        "data": {
            "ICP": ICP
        }
    }, function(VysledekKontroly) {

        var tableElement = document.createElement("table");
            tableElement.setAttribute("class", "zadanka");
            tableElement.setAttribute("style", "width: 100%;");

        var tbodyElement = document.createElement("tbody");
            tableElement.appendChild(tbodyElement);

        var thHeaderElement = document.createElement("th");
            thHeaderElement.setAttribute("colspan", 2);
            thHeaderElement.innerText = "Smlouva s poji????ovnou ????daj??c??ho za????zen?? / Insurance contract of requesting facility";

        var trHeaderElement = document.createElement("tr");
            trHeaderElement.appendChild(thHeaderElement);
            tableElement.appendChild(trHeaderElement);

        if(VysledekKontroly) {
            if(
                VysledekKontroly.stavVyrizeniPozadavku
            ) {
                tableElement.appendChild(createRow("Odbornost / Expertise of medical facility", VysledekKontroly.odbornost));
                tableElement.appendChild(createRow("Datum od / Date from", VysledekKontroly.datumOd));
                tableElement.appendChild(createRow("Datum do / Date to", VysledekKontroly.datumDo));
                tableElement.appendChild(createRow("N??zev zdravotnick??ho za????zen?? / Name of medical facility", VysledekKontroly.nazevZZ));
                tableElement.appendChild(createRow("N??zev pracovi??t?? / Name of workplace", VysledekKontroly.nazevP));
                tableElement.appendChild(createRow("Ulice / Street", VysledekKontroly.ulice));
                tableElement.appendChild(createRow("M??sto / Place", VysledekKontroly.misto));
                tableElement.appendChild(createRow("PS?? / Postcode", VysledekKontroly.psc));
                tableElement.appendChild(createRow("P??ijmen?? a jm??no / Surname and first name", VysledekKontroly.prijmeniJmeno));
            } else {
                alert("????daj??c?? zdravotnick?? za????zen?? nem?? smlouvu s poji????ovnou")
            }
        } else {
            tableElement.appendChild(createRowColSpan2("Nebylo mo??n?? ov????it. Probl??m na stran?? zprost??edkovatele ov????en?? nebo poskytovatele ov????en?? VZP."));
        }

        printDiv.insertBefore(tableElement, printDiv.lastChild);
        printDiv.insertBefore(document.createElement("br"), tableElement);
    });
}

function createRowColSpan2(labelText) {
    var trElement = document.createElement("tr");
    var tdElement = document.createElement("td");
    tdElement.setAttribute("colspan", "2");
    tdElement.innerText = labelText;
    trElement.appendChild(tdElement);
    return trElement;
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