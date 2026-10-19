/* data.js — product, fitment and colour data for the Cassette Collars prototypes.

   Collar sizes, depth bands, hole sizes and prices are copied from the live product
   pages on cassettecollars.co.uk (19 October 2026), including the figures we have
   asked the client to confirm (four sizes list a 585 x 585 hole). Prices are shown
   on the live site with no VAT basis; the prototypes treat them as ex VAT, which is
   an assumption to confirm.

   Deflector prices, lead times, the delivery charge and volume discount are SAMPLE
   figures, invented for the prototypes and labelled as such on the pages.

   Brand and model data is taken from the live brand compatibility pages. The mapping
   from facia size to recommended collar is our sample logic, to be confirmed. */

window.CC_VAT = 0.2;

window.CC_COLLARS = {
  '650': {
    name: '650 × 650 collar', size: 650, hole: '585 × 585', tapered: 'Yes', cad: true,
    bands: [[0, 49, 119], [50, 50, 108], [51, 74, 128], [75, 99, 131], [100, 100, 119], [101, 120, 125]]
  },
  '750': {
    name: '750 × 750 collar', size: 750, hole: '585 × 585', tapered: 'Yes', cad: true,
    bands: [[0, 49, 119], [50, 50, 108], [51, 74, 128], [75, 99, 131], [100, 100, 119], [101, 124, 139], [125, 149, 142],
      [150, 150, 129], [151, 174, 151], [175, 199, 155], [200, 200, 141], [201, 224, 162], [225, 249, 165], [250, 250, 151],
      [251, 274, 172], [275, 299, 177], [300, 300, 161], [320, 320, 180]]
  },
  '850': {
    name: '850 × 850 collar', size: 850, hole: '585 × 585', tapered: 'Slight', cad: true,
    bands: [[0, 49, 145], [50, 50, 135], [51, 74, 142], [75, 99, 147], [100, 100, 145], [101, 124, 153], [125, 149, 159],
      [150, 150, 155], [151, 174, 157], [175, 199, 164], [200, 200, 159], [201, 224, 169], [225, 249, 174], [250, 250, 170],
      [251, 274, 179], [275, 299, 189]]
  },
  '1000': {
    name: '1000 × 1000 collar', size: 1000, hole: '855 × 855', tapered: 'Yes', cad: true,
    bands: [[0, 49, 133], [50, 50, 121], [51, 74, 138], [75, 99, 142], [100, 100, 130], [101, 124, 150], [125, 149, 155],
      [150, 150, 142], [151, 174, 160], [175, 199, 164], [200, 200, 154], [201, 224, 174], [225, 249, 179], [250, 250, 164],
      [251, 274, 184], [275, 299, 189], [300, 300, 174], [320, 320, 189]]
  },
  '1200': {
    name: '1200 × 1200 collar', size: 1200, hole: '585 × 585', tapered: 'Yes', cad: true,
    bands: [[0, 49, 148], [50, 50, 136], [51, 74, 156], [75, 99, 160], [100, 100, 146], [101, 124, 166], [125, 149, 169],
      [150, 150, 156], [151, 174, 189], [175, 199, 190], [200, 200, 171], [201, 224, 195], [225, 249, 200], [250, 250, 184],
      [251, 274, 215], [275, 299, 220], [300, 300, 199]]
  }
};

/* SAMPLE: the live deflector pages carry no prices or specifications. */
window.CC_DEFLECTORS = {
  'cassette': { name: 'Cassette air deflector', price: 68, note: 'Fits standard and compact four-way cassettes (to confirm)' },
  'split': { name: 'Split unit air deflector', price: 42, note: 'Wall-mounted split units (to confirm)' },
  'outside': { name: 'Outside unit deflector', price: 85, note: 'Condensing units (to confirm)' }
};

/* SAMPLE commercial rules for the quote builder */
window.CC_RULES = {
  ralSurcharge: 0.15,            // +15% for a RAL colour other than white
  ralLeadDays: '3–5 working days',
  customLeadDays: '5–7 working days',
  delivery: 12.5,                // per order, ex VAT
  freeDeliveryOver: 500,
  volumeFrom: 10, volumeDiscount: 0.05,
  cutoffHour: 10                 // live site: same-day dispatch before 10am
};

/* Brand fitment data, from the live brand pages. "body" is the cassette body size;
   "facias" are the facia/grille references with their outer size in mm. */
window.CC_BRANDS = [
  { id: 'mitsubishi', name: 'Mitsubishi Electric', ranges: [
    { range: 'Mr Slim 4-way blow SLZ (compact)', body: 600, facias: [['SLP-2FA', 625]], models: ['SLZ-KF25VA', 'SLZ-KF35VA', 'SLZ-KF50VA', 'SLZ-KF60VA'] },
    { range: 'City Multi 4-way blow small PLFY-P-VFM', body: 600, facias: [['SLP-2FA', 625]], models: ['PLFY-P20VFM', 'PLFY-P25VFM', 'PLFY-P32VFM', 'PLFY-P40VFM', 'PLFY-P50VFM'] },
    { range: 'Mr Slim 4-way blow PLA-(Z)RP', body: 840, facias: [['PLP-6EA', 950]], models: ['PLA-ZM35RP', 'PLA-ZM50RP', 'PLA-ZM60RP', 'PLA-ZM71RP', 'PLA-ZM100RP', 'PLA-ZM125RP', 'PLA-ZM140RP', 'PLA-M35EA', 'PLA-M50EA', 'PLA-M71EA'] },
    { range: 'Mr Slim 4-way blow PLA-SP', body: 840, facias: [['PLP-6BA', 950]], models: ['PLA-SP71BA', 'PLA-SP100BA', 'PLA-SP125BA', 'PLA-SP14BA'] },
    { range: 'City Multi 4-way blow PLFY-P-VBM', body: 840, facias: [['PLP-6EA', 950]], models: ['PLFY-P32VBM', 'PLFY-P40VBM', 'PLFY-P50VBM', 'PLFY-P63VBM', 'PLFY-P80VBM', 'PLFY-P100VBM', 'PLFY-P125VBM'] }
  ] },
  { id: 'daikin', name: 'Daikin', ranges: [
    { range: 'Fully Flat cassette compact FFA', body: 600, facias: [['BYFQ60C2W1W', 620], ['BYFQ60C2W1S', 620], ['BYFQ60B2W1', 700], ['BYFQ60B3W1', 700]], models: ['FFA25A2VEB9', 'FFA35A2VEB9', 'FFA50A2VEB9', 'FFA60A2VEB9'] },
    { range: 'FXZQ-A Fully Flat cassette compact (VRV)', body: 600, facias: [['BYFQ60C2W1W', 620], ['BYFQ60B2W1', 700]], models: ['FXZQ15A2VEB', 'FXZQ20A2VEB', 'FXZQ25A2VEB', 'FXZQ32A2VEB', 'FXZQ40A2VEB', 'FXZQ50A2VEB'] },
    { range: 'FWF-BF 4-way blow cassette compact', body: 600, facias: [['BYFQ60CW', 620], ['BYFQ60B3W1', 700]], models: ['FWF02B5FV1B', 'FWF03B5FV1B', 'FWF04B5FV1B', 'FWF06B5FV1B'] },
    { range: 'FWF-D 4-way blow cassette compact', body: 600, facias: [['BYFQ60CW', 620], ['BYFQ60B3W1', 700]], models: ['FWF02DATN5V3', 'FWF02DAFN5V3', 'FWF03DATN5V3', 'FWF03DAFN5V3', 'FWF04DATN5V3', 'FWF04DAFN5V3', 'FWF05DATN5V3', 'FWF05DAFN5V3'] }
  ] },
  { id: 'samsung', name: 'Samsung', ranges: [
    { range: 'WindFree 4-way cassette compact', body: 600, facias: [['PC4SUFMANW', 620]], models: ['AC052RXADKG/EU', 'AC071RXADKG/EU', 'AC100RXADKG/EU', 'AC120RXADKG/EU', 'AC140RXADKG/EU'] },
    { range: 'WindFree 4-way cassette standard', body: 840, facias: [['PC4NUFMAN', 950]], models: ['AC052RN4DKG', 'AC071RN4DKG', 'AC100RN4DKG', 'AC120RN4DKG', 'AC140RN4DKG', 'AM045NN4DEH/EU', 'AM056NN4DEH/EU', 'AM071NN4DEH/EU', 'AM090NN4DEH/EU', 'AM112NN4DEH/EU', 'AM128NN4DEH/EU', 'AM140NN4DEH/EU'] }
  ] },
  { id: 'panasonic', name: 'Panasonic', ranges: [
    { range: 'PACi NX 4-way 60 × 60 cassette', body: 600, facias: [['CZ-KPY4', 600], ['CZ-BT20EW', 700]], models: ['S-M20PY3E', 'S-25PY3E', 'S-36PY3E', 'S-50PY3E', 'S-60PY3E', 'CS-Z25UB4EAW', 'CS-Z35UB4EAW', 'CS-Z50UB4EAW', 'CS-Z60UB4EAW'] }
  ] },
  { id: 'toshiba', name: 'Toshiba', ranges: [
    { range: 'Digital Inverter compact 4-way RAV-HM MUT', body: 575, facias: [['RBC-UM21P-E', 620], ['RBC-UM21PG(W)-E', 620]], models: ['RAV-HM301MUT-E', 'RAV-HM401MUT-E', 'RAV-HM561MUT-E', 'M10S4MUVG-E', 'M13S4MUVG-E', 'M16S4MUVG-E'] },
    { range: 'VRF compact 4-way MMU-UP MH', body: 575, facias: [['RBC-UM21P-E', 620]], models: ['MMU-UP0051MH-E', 'MMU-UP0071MH-E', 'MMU-UP0091MH-E', 'MMU-UP0121MH-E', 'MMU-UP0151MH-E', 'MMU-UP0181MH-E'] }
  ] },
  { id: 'fujitsu', name: 'Fujitsu', ranges: [
    { range: '4-way compact cassette', body: 570, facias: [['UTGUFYFW', 620], ['UTGUFYEW', 620], ['UTGUFYDW', 700]], models: ['AUXG07KVLA', 'AUXG09KVLA', 'AUXG12KVLA', 'AUXG14KVLA', 'AUXG18KVLA', 'AUXG22KVLA', 'AUXG24KVLA', 'AUXB004GLEH', 'AUXB007GLEH', 'AUXB012GLEH', 'AUXB018GLEH', 'AUXB024GLEH'] }
  ] }
];

/* SAMPLE mapping from facia size to the collar that frames it. To confirm with the client. */
window.CC_COLLAR_FOR_FACIA = function (facia) {
  if (facia <= 630) return '650';
  if (facia <= 720) return '750';
  if (facia <= 960) return '1000';
  return '1200';
};

/* RAL Classic colours most often asked for on ceilings and shopfits. Hex values are
   screen approximations; physical RAL cards should be used to match. */
window.CC_RAL = [
  ['9010', 'Pure white', '#F1ECE1', 'white', true], ['9016', 'Traffic white', '#F1F0EA', 'white'], ['9003', 'Signal white', '#ECECE7', 'white'],
  ['9001', 'Cream', '#E9E0D2', 'white'], ['1013', 'Oyster white', '#E3D9C6', 'white'], ['9002', 'Grey white', '#D7D5CB', 'white'],
  ['7035', 'Light grey', '#CBD0CC', 'grey'], ['7040', 'Window grey', '#9DA3A6', 'grey'], ['7038', 'Agate grey', '#B0B0A9', 'grey'],
  ['7037', 'Dusty grey', '#7A7B7A', 'grey'], ['7016', 'Anthracite grey', '#383E42', 'grey'], ['7021', 'Black grey', '#2F3234', 'grey'],
  ['9006', 'White aluminium', '#A1A1A0', 'metallic'], ['9007', 'Grey aluminium', '#878581', 'metallic'],
  ['9005', 'Jet black', '#0E0E10', 'black'], ['9004', 'Signal black', '#2B2B2C', 'black'],
  ['5015', 'Sky blue', '#2271B3', 'blue'], ['5012', 'Light blue', '#3B83BD', 'blue'], ['5010', 'Gentian blue', '#0E4C92', 'blue'], ['5024', 'Pastel blue', '#6093AC', 'blue'],
  ['6018', 'Yellow green', '#57A639', 'green'], ['6005', 'Moss green', '#114232', 'green'], ['6019', 'Pastel green', '#B9CEAC', 'green'], ['6021', 'Pale green', '#8A9977', 'green'],
  ['3000', 'Flame red', '#AF2B1E', 'red'], ['3020', 'Traffic red', '#CC0605', 'red'], ['3005', 'Wine red', '#5E2129', 'red'],
  ['1021', 'Rape yellow', '#F3DA0B', 'yellow'], ['1015', 'Light ivory', '#E6D2B5', 'yellow'], ['2004', 'Pure orange', '#F44611', 'orange']
];

/* SAMPLE projects for the gallery. Settings and descriptions are illustrative. */
window.CC_PROJECTS = [
  { id: 'p1', title: 'Restaurant dining room', setting: 'Restaurants', product: 'Collars', detail: '1000 × 1000 collars in white under a timber-beamed ceiling, hiding the gap left by an uneven plasterboard line.' },
  { id: 'p2', title: 'Open-plan office refit', setting: 'Offices', product: 'Deflectors', detail: 'Cassette deflectors over a bank of desks to stop cold air landing on the people sitting underneath.' },
  { id: 'p3', title: 'Primary school hall', setting: 'Schools', product: 'Collars', detail: 'Deep collars on a pitched ceiling, cut on site to the angle.' },
  { id: 'p4', title: 'High street retail unit', setting: 'Retail', product: 'Collars', detail: 'RAL 9005 black collars on an open-void ceiling painted black.' },
  { id: 'p5', title: 'Hotel function suite', setting: 'Hotels', product: 'Collars', detail: '750 × 750 collars on compact cassettes, coloured to the ceiling.' },
  { id: 'p6', title: 'Dental practice', setting: 'Offices', product: 'Deflectors', detail: 'Deflectors over treatment chairs.' },
  { id: 'p7', title: 'Café counter', setting: 'Restaurants', product: 'Deflectors', detail: 'Deflectors keeping air off the counter and food display.' },
  { id: 'p8', title: 'Supermarket open void', setting: 'Retail', product: 'Collars', detail: 'Collars housing condensate pumps on cassettes hung in an open void.' },
  { id: 'p9', title: 'University seminar rooms', setting: 'Schools', product: 'Collars', detail: 'Matching collars across twelve rooms, supplied in one delivery.' }
];

window.CC_MONEY = function (n) {
  return '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
