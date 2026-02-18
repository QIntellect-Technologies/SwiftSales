function debugParser() {
    const cleanSegment = "5 glucophage";
    const qtyMatch = cleanSegment.match(/^(\d{1,3})\b(?!\s*(?:mg|ml|mcg|gm|g|%)\b)\s+(.+)/i);

    console.log("Segment:", cleanSegment);
    if (qtyMatch) {
        console.log("Match Found!");
        console.log("Qty:", qtyMatch[1]);
        console.log("Product:", qtyMatch[2]);
    } else {
        console.log("Match Failed.");
    }

    const cleanSegment2 = "5 mg panadol";
    const qtyMatch2 = cleanSegment2.match(/^(\d{1,3})\b(?!\s*(?:mg|ml|mcg|gm|g|%))\s+(.+)/i);
    console.log("\nSegment:", cleanSegment2);
    if (qtyMatch2) {
        console.log("Match Found (UNEXPECTED if mg is ignored)!");
    } else {
        console.log("Match Failed (EXPECTED for dosage).");
    }
}

debugParser();
