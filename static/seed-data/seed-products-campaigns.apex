// LEOptical — Products, PricebookEntries, and Campaigns
//
// Run this in Developer Console > Debug > Open Execute Anonymous Window.
// Creates 5 Products (with standard Pricebook entries) and 3 Campaigns.
//
// Safe to run once. If you need to re-run, delete the existing Products and
// Campaigns first to avoid duplicates.

// ── Products ────────────────────────────────────────────────────────────────
List<Product2> products = new List<Product2>{
    new Product2(Name='Visionaire UltraLux',       ProductCode='VIS-ULX-001', Family='Visionaire', Description='Premium adaptive lens with ultra-light frame integration', IsActive=true),
    new Product2(Name='Visionaire ChromaShift',     ProductCode='VIS-CHS-001', Family='Visionaire', Description='Color-enhancing photochromic lens for outdoor lifestyles',   IsActive=true),
    new Product2(Name='SeeClear DailyFocus',        ProductCode='SEC-DLF-001', Family='SeeClear',   Description='Daily-wear clarity lens optimized for screen use',            IsActive=true),
    new Product2(Name='SeeClear SunSync',           ProductCode='SEC-SNS-001', Family='SeeClear',   Description='UV-blocking sun lens with seamless indoor transition',        IsActive=true),
    new Product2(Name='LEOptical Designer Frames',  ProductCode='LEO-FRM-001', Family='Frames',     Description='Curated designer frame collection',                           IsActive=true)
};
insert products;

// ── Pricebook Entries ───────────────────────────────────────────────────────
Id stdPricebook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true LIMIT 1].Id;
insert new List<PricebookEntry>{
    new PricebookEntry(Pricebook2Id=stdPricebook, Product2Id=products[0].Id, UnitPrice=349.00, IsActive=true),
    new PricebookEntry(Pricebook2Id=stdPricebook, Product2Id=products[1].Id, UnitPrice=299.00, IsActive=true),
    new PricebookEntry(Pricebook2Id=stdPricebook, Product2Id=products[2].Id, UnitPrice=189.00, IsActive=true),
    new PricebookEntry(Pricebook2Id=stdPricebook, Product2Id=products[3].Id, UnitPrice=219.00, IsActive=true),
    new PricebookEntry(Pricebook2Id=stdPricebook, Product2Id=products[4].Id, UnitPrice=159.00, IsActive=true)
};

// ── Campaigns ───────────────────────────────────────────────────────────────
insert new List<Campaign>{
    new Campaign(Name='Spring Collection 2026',    Status='Active',  Type='Advertisement', StartDate=Date.newInstance(2026,3,1),  EndDate=Date.newInstance(2026,5,31)),
    new Campaign(Name='VisionCare Rewards Launch', Status='Active',  Type='Email',         StartDate=Date.newInstance(2026,1,15), EndDate=Date.newInstance(2026,12,31)),
    new Campaign(Name='Back to School 2026',       Status='Planned', Type='Email',         StartDate=Date.newInstance(2026,7,15), EndDate=Date.newInstance(2026,9,15))
};

System.debug('Created ' + products.size() + ' Products, ' + products.size() + ' PricebookEntries, and 3 Campaigns.');
