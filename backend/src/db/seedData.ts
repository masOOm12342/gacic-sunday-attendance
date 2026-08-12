import pool, { execute, queryOne } from './index';
import { getISTDateTimeString } from '../utils/datetime';

export interface SeedMember {
  reg_id: string;
  full_name: string;
  mobile_number: string;
  address: string;
  dob: string;
  adhaar_number: string;
  gender: string;
}

export const INITIAL_MEMBERS_DATA: SeedMember[] = [
  { reg_id: "REG-2026-00001", full_name: "Pr.Dr. Anish Ankush Vijagat", address: "Thergaon", mobile_number: "9604697240", dob: "26-02-1993", adhaar_number: "FOUNDER", gender: "Male" },
  { reg_id: "REG-2026-00002", full_name: "Pr.Juliya Anish Vijagat", address: "Thergaon", mobile_number: "8975330271", dob: "15-07-1996", adhaar_number: "CO.FOUNDER", gender: "Female" },
  { reg_id: "REG-2026-00003", full_name: "Ankush Vijagat", address: "Thergaon", mobile_number: "9767843675", dob: "28-09-1962", adhaar_number: "CO.FOUNDER", gender: "Male" },
  { reg_id: "REG-2026-00004", full_name: "Sunanda Ankush Vijagat", address: "Thergaon", mobile_number: "9767843675", dob: "02-04-1967", adhaar_number: "CO.FOUNDER", gender: "Female" },
  { reg_id: "REG-2026-00005", full_name: "Sis. Surekha Sunil Chakrnarayan", address: "Kalewadi", mobile_number: "7219124289", dob: "02-11-1966", adhaar_number: "CO.FOUNDER", gender: "Female" },
  { reg_id: "REG-2026-00006", full_name: "Ps Ramesh Nana Kamble", address: "Rahatni", mobile_number: "9604494682", dob: "01-06-1967", adhaar_number: "515062004678", gender: "Male" },
  { reg_id: "REG-2026-00007", full_name: "Rajshree Ramesh Kamble", address: "Rahatani", mobile_number: "9604007335", dob: "01-06-1974", adhaar_number: "562452206588", gender: "Female" },
  { reg_id: "REG-2026-00008", full_name: "Ashish Ramesh kamble", address: "Rahatni", mobile_number: "7770051484", dob: "14-12-1996", adhaar_number: "836685556674", gender: "Male" },
  { reg_id: "REG-2026-00009", full_name: "Manjusha Ashish kamble", address: "Rahatni", mobile_number: "9552231577", dob: "05-09-1990", adhaar_number: "568660732387", gender: "Female" },
  { reg_id: "REG-2026-00010", full_name: "Amruta Ramesh kamble", address: "Rahatni ,Pune 411027", mobile_number: "9834618368", dob: "16-06-2000", adhaar_number: "930756007641", gender: "Female" },
  { reg_id: "REG-2026-00011", full_name: "Shivaji Pandurang Khandagale", address: "Rahatni ,Pune 411017", mobile_number: "7350903517", dob: "28-06-1976", adhaar_number: "539431405413", gender: "Male" },
  { reg_id: "REG-2026-00012", full_name: "Sangita Pandurang Khandagale", address: "Rahatni ,Pune 411017", mobile_number: "9764945016", dob: "03-05-1980", adhaar_number: "359376382572", gender: "Female" },
  { reg_id: "REG-2026-00013", full_name: "Gaurav Shivaji Khandagle", address: "Rahatani", mobile_number: "744765216", dob: "15-05-2001", adhaar_number: "392406546558", gender: "Male" },
  { reg_id: "REG-2026-00014", full_name: "Anjali Shivaji Khandagale", address: "Rahatni pune", mobile_number: "9356768990", dob: "14-12-2003", adhaar_number: "746212498412", gender: "Female" },
  { reg_id: "REG-2026-00015", full_name: "Vinayak Bandari", address: "Kalewadi", mobile_number: "8446546065", dob: "14-11-1965", adhaar_number: "636963880001", gender: "Male" },
  { reg_id: "REG-2026-00016", full_name: "Ps.Theodar Walter Jerome", address: "Kalewadi", mobile_number: "9850151204", dob: "16-12-1973", adhaar_number: "812602214166", gender: "Male" },
  { reg_id: "REG-2026-00017", full_name: "Ps.Ruth Theodor Jerome", address: "Kalewadi", mobile_number: "9284470684", dob: "22-11-1962", adhaar_number: "362459210708", gender: "Female" },
  { reg_id: "REG-2026-00018", full_name: "Jalindar Vithoba Hivare", address: "Nigadi ,pune", mobile_number: "8857057477", dob: "05-06-1956", adhaar_number: "567094710713", gender: "Male" },
  { reg_id: "REG-2026-00019", full_name: "Bhagirthi Jalindar Hivare", address: "Nigadi ,pune", mobile_number: "8857057477", dob: "01-01-1967", adhaar_number: "342373999362", gender: "Female" },
  { reg_id: "REG-2026-00020", full_name: "Ps Joshva Jalindar Hivare", address: "Nigadi ,pune", mobile_number: "7558593429", dob: "15-06-1988", adhaar_number: "532527615506", gender: "Male" },
  { reg_id: "REG-2026-00021", full_name: "Shilpa Ganesh hivare", address: "Gharkul, Chikhali", mobile_number: "7350169509", dob: "08-09-1990", adhaar_number: "915727898258", gender: "Female" },
  { reg_id: "REG-2026-00022", full_name: "Sagar Madhukar Nikam", address: "Thergoan ,pune", mobile_number: "9545966955", dob: "25-05-1987", adhaar_number: "412141722412", gender: "Male" },
  { reg_id: "REG-2026-00023", full_name: "Jagruti Sagar Nikam", address: "Thergoan ,pune", mobile_number: "9545506055", dob: "06-09-1989", adhaar_number: "407824293192", gender: "Female" },
  { reg_id: "REG-2026-00024", full_name: "Balasaheb Nagurow Shinde", address: "Kalewadi", mobile_number: "9823891877", dob: "05-07-1974", adhaar_number: "208769947437", gender: "Male" },
  { reg_id: "REG-2026-00025", full_name: "Nanda Nagurow Shinde", address: "Kalewadi", mobile_number: "9921229531", dob: "10-02-1979", adhaar_number: "554196571937", gender: "Female" },
  { reg_id: "REG-2026-00026", full_name: "Shrikant Balu Shinde", address: "Kalewadi", mobile_number: "7058886391", dob: "13-12-1998", adhaar_number: "920968870551", gender: "Male" },
  { reg_id: "REG-2026-00027", full_name: "Ishita Shrikant Shinde", address: "Kalewadi", mobile_number: "7823012645", dob: "19-04-2000", adhaar_number: "907649505949", gender: "Female" },
  { reg_id: "REG-2026-00028", full_name: "Triveni Ganpat Bodke", address: "Ramnagar,Rahatni .pune", mobile_number: "9604673287", dob: "05-05-1984", adhaar_number: "481486670100", gender: "Female" },
  { reg_id: "REG-2026-00029", full_name: "Tushar Bodke", address: "Rahatani", mobile_number: "9284837330", dob: "24-05-2002", adhaar_number: "880641415274", gender: "Male" },
  { reg_id: "REG-2026-00030", full_name: "Nandini Tushar Bodke", address: "Rahatani", mobile_number: "7774050113", dob: "01-12-2006", adhaar_number: "464225625819", gender: "Female" },
  { reg_id: "REG-2026-00031", full_name: "Vikram Babhasaheb Suryagandh", address: "Kalewadi ,pune", mobile_number: "8237190577", dob: "25-10-1983", adhaar_number: "392344186848", gender: "Male" },
  { reg_id: "REG-2026-00032", full_name: "Nayna Vikram Suryagandh", address: "kalewadi", mobile_number: "9766569771", dob: "22-11-1991", adhaar_number: "451334979344", gender: "Female" },
  { reg_id: "REG-2026-00033", full_name: "Sachin Khaderao Thakur", address: "Chikali", mobile_number: "7620952566", dob: "11-09-1980", adhaar_number: "313788870923", gender: "Male" },
  { reg_id: "REG-2026-00034", full_name: "Ranjit Bapurao Sonkamble", address: "Rahatni pune", mobile_number: "8788505889", dob: "01-05-1985", adhaar_number: "334606143396", gender: "Male" },
  { reg_id: "REG-2026-00035", full_name: "Meera Ranjit Sonkamble", address: "kalewadi ,pune", mobile_number: "9518367039", dob: "09-07-1987", adhaar_number: "375802204101", gender: "Female" },
  { reg_id: "REG-2026-00036", full_name: "Vivekanand Pandurang Lamtile", address: "Lavale ,pune", mobile_number: "9657768358", dob: "14-10-1998", adhaar_number: "656499990583", gender: "Male" },
  { reg_id: "REG-2026-00037", full_name: "Ravi Bharat Surywanshi", address: "Lavale ,pune", mobile_number: "7030666591", dob: "01-01-1996", adhaar_number: "556300231741", gender: "Male" },
  { reg_id: "REG-2026-00038", full_name: "Sandeep Gajanan Chavan", address: "Wakad", mobile_number: "7276528630", dob: "23-04-2008", adhaar_number: "383900789664", gender: "Male" },
  { reg_id: "REG-2026-00039", full_name: "Dinkar Pandhurang Khandagle", address: "Moshi, Pune - 412105", mobile_number: "8390922414", dob: "01-05-1988", adhaar_number: "656363272042", gender: "Male" },
  { reg_id: "REG-2026-00040", full_name: "Laxmi Dinkar Khandagle", address: "Moshi, Pune - 412105", mobile_number: "7391961817", dob: "13-06-1998", adhaar_number: "852530921357", gender: "Female" },
  { reg_id: "REG-2026-00041", full_name: "Charles Milind Mosses Satralkar", address: "Phule nagar ,Yerwada", mobile_number: "9326783511", dob: "06-06-1961", adhaar_number: "772580163215", gender: "Male" },
  { reg_id: "REG-2026-00042", full_name: "Sunanda Charles Satralkar", address: "Phule nagar ,Yerwada", mobile_number: "8379879434", dob: "15-07-1963", adhaar_number: "", gender: "Female" },
  { reg_id: "REG-2026-00043", full_name: "Dhanashree Vishwas Salve", address: "Chikhali, Pune - 411062", mobile_number: "7448187536", dob: "03-04-1998", adhaar_number: "571576683156", gender: "Female" },
  { reg_id: "REG-2026-00044", full_name: "Swaminath Nana jadhav", address: "Nigadi ,pune", mobile_number: "8888747810", dob: "01-06-1971", adhaar_number: "774800763145", gender: "Male" },
  { reg_id: "REG-2026-00045", full_name: "Mangal Swaminath Jadhav", address: "Nigadi ,pune", mobile_number: "8888747810", dob: "01-06-1980", adhaar_number: "593981505169", gender: "Female" },
  { reg_id: "REG-2026-00046", full_name: "Asawari Swaminath jadhav", address: "Nigadi ,pune", mobile_number: "9699491760", dob: "07-08-2000", adhaar_number: "889448952101", gender: "Female" },
  { reg_id: "REG-2026-00047", full_name: "Sharda Sanjay Palande", address: "Pimpale Gurav", mobile_number: "7758989187", dob: "26-06-1968", adhaar_number: "541514453704", gender: "Female" },
  { reg_id: "REG-2026-00048", full_name: "Uma Sanjay Palande", address: "Pimpale Gurav", mobile_number: "7769965579", dob: "15-07-1993", adhaar_number: "335602361184", gender: "Female" },
  { reg_id: "REG-2026-00049", full_name: "Seema sudhakar salve", address: "kalewadi", mobile_number: "7040416136", dob: "01-01-1973", adhaar_number: "810014588065", gender: "Female" },
  { reg_id: "REG-2026-00050", full_name: "Sushil sudhakar salve", address: "kalewadi", mobile_number: "9322756162", dob: "14-03-2007", adhaar_number: "431864201268", gender: "Male" },
  { reg_id: "REG-2026-00051", full_name: "Rajendra Shankar Sonawane", address: "Pune - 411004", mobile_number: "7709111511", dob: "07-11-1971", adhaar_number: "888538168288", gender: "Male" },
  { reg_id: "REG-2026-00052", full_name: "Rajni Rajendra Sonawane", address: "Pune - 411004", mobile_number: "9960677098", dob: "20-06-1971", adhaar_number: "532652883899", gender: "Female" },
  { reg_id: "REG-2026-00053", full_name: "Sakshi Rajendra sonawane", address: "Pune - 411004", mobile_number: "8623007092", dob: "27-05-2004", adhaar_number: "981506744844", gender: "Female" },
  { reg_id: "REG-2026-00054", full_name: "Lakshmi Dattaraty Chavan", address: "Chikhali", mobile_number: "8275883065", dob: "", adhaar_number: "963537636248", gender: "Female" },
  { reg_id: "REG-2026-00055", full_name: "Santosh Dattatray Chavan", address: "Chikhali", mobile_number: "8275883065", dob: "05-07-1987", adhaar_number: "206020023705", gender: "Male" },
  { reg_id: "REG-2026-00056", full_name: "Sarika Ashok Bansode", address: "Chikhali,pune", mobile_number: "9112190333", dob: "30-03-1995", adhaar_number: "423686496436", gender: "Female" },
  { reg_id: "REG-2026-00057", full_name: "Vinayak Anukush Khopade", address: "Dhayri ,pune 411024", mobile_number: "9130140646", dob: "28-11-1987", adhaar_number: "434777486629", gender: "Male" },
  { reg_id: "REG-2026-00058", full_name: "Dhanshree Vinayak Khopade", address: "Dhayri ,pune 411024", mobile_number: "7666500119", dob: "01-10-1993", adhaar_number: "984901450803", gender: "Female" },
  { reg_id: "REG-2026-00059", full_name: "Sonali shivaji kamble", address: "Manjari", mobile_number: "9673596738", dob: "01-06-1992", adhaar_number: "210155240163", gender: "Female" },
  { reg_id: "REG-2026-00060", full_name: "Shivaji sahebrao kamble", address: "Manjari", mobile_number: "9970676856", dob: "12-06-1986", adhaar_number: "594360257120", gender: "Male" },
  { reg_id: "REG-2026-00061", full_name: "Pramila Sudhakar Asawale", address: "Gokul nagarr ,Pimple gurav", mobile_number: "9921459549", dob: "24-01-1981", adhaar_number: "632777214268", gender: "Female" },
  { reg_id: "REG-2026-00062", full_name: "Rutuja Sudhakar Asawale", address: "Pimple gurav", mobile_number: "7057924881", dob: "12-05-2003", adhaar_number: "706389856578", gender: "Female" },
  { reg_id: "REG-2026-00063", full_name: "Ria Dixit", address: "Pimple gurav", mobile_number: "8329453626", dob: "26-11-2010", adhaar_number: "936889540181", gender: "Female" },
  { reg_id: "REG-2026-00064", full_name: "Neetu Diixt", address: "Pimple gurav", mobile_number: "9850149391", dob: "26-01-1978", adhaar_number: "820517873019", gender: "Female" },
  { reg_id: "REG-2026-00065", full_name: "Niranjan Dixit", address: "Pimple gurav", mobile_number: "8329453626", dob: "06-12-1977", adhaar_number: "692097439389", gender: "Male" },
  { reg_id: "REG-2026-00066", full_name: "Harshita dixit", address: "Pimple gurav", mobile_number: "8329453626", dob: "25-05-2013", adhaar_number: "935974431014", gender: "Female" },
  { reg_id: "REG-2026-00067", full_name: "Shashi sinha", address: "Pimple gurav", mobile_number: "9850149391", dob: "21-07-1958", adhaar_number: "533351026880", gender: "Female" },
  { reg_id: "REG-2026-00068", full_name: "Aditya gaikwad", address: "wakad", mobile_number: "9579603744", dob: "18-05-2005", adhaar_number: "321414973128", gender: "Male" },
  { reg_id: "REG-2026-00069", full_name: "Pramila Gaikwad", address: "wakad", mobile_number: "8806726045", dob: "09-09-1981", adhaar_number: "436753421961", gender: "Female" },
  { reg_id: "REG-2026-00070", full_name: "Deepak kumar", address: "vitthal vadi , chikhali", mobile_number: "8262881758", dob: "01-02-1989", adhaar_number: "612482888365", gender: "Male" },
  { reg_id: "REG-2026-00071", full_name: "Urmila devi", address: "vitthal vadi , chikhali", mobile_number: "8262881758", dob: "02-01-1991", adhaar_number: "561417478938", gender: "Female" },
  { reg_id: "REG-2026-00072", full_name: "Ankesh kadbe", address: "pune", mobile_number: "7218903418", dob: "01-08-1997", adhaar_number: "347370291048", gender: "Male" },
  { reg_id: "REG-2026-00073", full_name: "Swati Avinash sasane", address: "Bhosari", mobile_number: "8605721273", dob: "31-12-1986", adhaar_number: "895210397587", gender: "Female" },
  { reg_id: "REG-2026-00074", full_name: "Jaya Ashok sasane", address: "Bhosari", mobile_number: "8605721273", dob: "01-06-1968", adhaar_number: "562849574635", gender: "Female" },
  { reg_id: "REG-2026-00075", full_name: "Babita Prakash Gaikwad", address: "Wagholi", mobile_number: "8975510204", dob: "25-12-1984", adhaar_number: "440990687833", gender: "Female" },
  { reg_id: "REG-2026-00076", full_name: "Babita Abhiman Handge", address: "Wadegaon, Pune - 431126", mobile_number: "9527636466", dob: "17-02-1973", adhaar_number: "910565824575", gender: "Female" },
  { reg_id: "REG-2026-00077", full_name: "Suresh Bhagwanrav Ingole", address: "Parbhani - 431509", mobile_number: "9764830940", dob: "15-08-1989", adhaar_number: "609740688699", gender: "Male" },
  { reg_id: "REG-2026-00078", full_name: "Sunita Suresh Ingole", address: "Parbhani - 431509", mobile_number: "9561490940", dob: "02-05-1987", adhaar_number: "837738703712", gender: "Female" },
  { reg_id: "REG-2026-00079", full_name: "Tarabai Shantappa Channur", address: "Pimple Gurav, Pune - 411061", mobile_number: "8669869930", dob: "23-01-1980", adhaar_number: "685818683075", gender: "Female" },
  { reg_id: "REG-2026-00080", full_name: "Rausaheb Nana Tupe", address: "Walhe, Pune - 412305", mobile_number: "9689852903", dob: "01-06-1969", adhaar_number: "485343741466", gender: "Male" },
  { reg_id: "REG-2026-00081", full_name: "Chhaya Ravasaheb Tupe", address: "Walhe, Pune - 412305", mobile_number: "9637494574", dob: "14-06-1975", adhaar_number: "414637170211", gender: "Female" },
  { reg_id: "REG-2026-00082", full_name: "Akshay Rausaheb Tupe", address: "Walhe, Pune - 412305", mobile_number: "9637494574", dob: "10-06-1995", adhaar_number: "289209371459", gender: "Male" },
  { reg_id: "REG-2026-00083", full_name: "Asawari Akshay tupe", address: "Walhe, Pune - 412305", mobile_number: "9623714574", dob: "07-08-2000", adhaar_number: "889448952101", gender: "Female" },
  { reg_id: "REG-2026-00084", full_name: "Suman Sahadev Bhosale", address: "Wade Bolhai pune", mobile_number: "8010851445", dob: "01-01-1975", adhaar_number: "998642146616", gender: "Female" },
  { reg_id: "REG-2026-00085", full_name: "Jyoti prakash ghorpade", address: "Yerwada", mobile_number: "9172040281", dob: "14-06-1999", adhaar_number: "640512063127", gender: "Female" },
  { reg_id: "REG-2026-00086", full_name: "Prakash shadev ghorpade", address: "Yerwada", mobile_number: "8390202572", dob: "02-06-1996", adhaar_number: "813000405663", gender: "Male" },
  { reg_id: "REG-2026-00087", full_name: "Aadesh Sachit Singh", address: "Pimpri", mobile_number: "8459400723", dob: "02-05-1999", adhaar_number: "806585303944", gender: "Male" },
  { reg_id: "REG-2026-00088", full_name: "Vaishali Sachit Singh", address: "Pimpri pune", mobile_number: "7744954649", dob: "31-08-1973", adhaar_number: "943060767276", gender: "Female" },
  { reg_id: "REG-2026-00089", full_name: "Sunita Narayan Kamthi", address: "Chichwad ,pune", mobile_number: "9767838252", dob: "23-05-1971", adhaar_number: "534287947863", gender: "Female" },
  { reg_id: "REG-2026-00090", full_name: "Pranav Narayan Kamathi", address: "Chichwad ,pune", mobile_number: "9960811672", dob: "15-08-1999", adhaar_number: "860980879124", gender: "Male" },
  { reg_id: "REG-2026-00091", full_name: "Sanjivani Raju Bhole", address: "Pimpri ,pune", mobile_number: "9850064704", dob: "05-09-1984", adhaar_number: "707907411201", gender: "Female" },
  { reg_id: "REG-2026-00092", full_name: "Pradnya Raju Bhole", address: "Pimpri ,pune", mobile_number: "9850064704", dob: "16-08-2005", adhaar_number: "732625020189", gender: "Female" },
  { reg_id: "REG-2026-00093", full_name: "Priya Raju Bhole", address: "Pimpri, pune", mobile_number: "9850064704", dob: "18-03-2009", adhaar_number: "819209096811", gender: "Female" },
  { reg_id: "REG-2026-00094", full_name: "Vandana Shankar Shinde", address: "Nehrunagar", mobile_number: "9850064704", dob: "01-09-1978", adhaar_number: "343394887156", gender: "Female" },
  { reg_id: "REG-2026-00095", full_name: "Sunita Ram Waghmare", address: "Bhosari ,pune", mobile_number: "9623516610", dob: "01-01-1978", adhaar_number: "411115654479", gender: "Female" },
  { reg_id: "REG-2026-00096", full_name: "Vikas Sanjay shinde", address: "Bibewadi,pune", mobile_number: "9322680153", dob: "10-02-1994", adhaar_number: "551006141277", gender: "Male" },
  { reg_id: "REG-2026-00097", full_name: "Dropadi Vikas Shinde", address: "Bibewadi,pune", mobile_number: "7276243321", dob: "20-03-1998", adhaar_number: "847817329425", gender: "Female" },
  { reg_id: "REG-2026-00098", full_name: "Dattaram Vishwanath Khanjode", address: "Lavale ,pune", mobile_number: "9198367878", dob: "01-03-1986", adhaar_number: "910315562449", gender: "Male" },
  { reg_id: "REG-2026-00099", full_name: "Pratibha Dattram Khanjode", address: "Lavale ,pune", mobile_number: "9588652380", dob: "06-10-1991", adhaar_number: "61346801831", gender: "Female" },
  { reg_id: "REG-2026-00100", full_name: "Swati Santosh Gaikwad", address: "Chikhali", mobile_number: "8237025383", dob: "23-03-1988", adhaar_number: "909944778628", gender: "Female" },
  { reg_id: "REG-2026-00101", full_name: "Pandurang Suryabhan Bidbag", address: "Hadapsar,pune", mobile_number: "8983025383", dob: "06-01-1994", adhaar_number: "886527101398", gender: "Male" },
  { reg_id: "REG-2026-00102", full_name: "Krishna Santosh Gaikwad", address: "Hadpasar ,pune", mobile_number: "823702583", dob: "09-03-2007", adhaar_number: "684268532847", gender: "Male" },
  { reg_id: "REG-2026-00103", full_name: "Yash Sanotsh gaikwad", address: "Hadpasar ,pune", mobile_number: "8237025383", dob: "23-02-2008", adhaar_number: "971988685137", gender: "Male" },
  { reg_id: "REG-2026-00104", full_name: "Prakash Vishnu Dubale", address: "Swarget ,pune", mobile_number: "9325830585", dob: "30-09-1976", adhaar_number: "962127082826", gender: "Male" },
  { reg_id: "REG-2026-00105", full_name: "Seema prakash Dubale", address: "Sinhagad road pune", mobile_number: "7276061507", dob: "11-12-1986", adhaar_number: "993284777312", gender: "Female" },
  { reg_id: "REG-2026-00106", full_name: "Nikhil Prakash Dubale", address: "Swarget ,pune", mobile_number: "7276061507", dob: "10-05-2009", adhaar_number: "902405340178", gender: "Male" },
  { reg_id: "REG-2026-00107", full_name: "Mithila Prakash Duble", address: "Swarget ,pune", mobile_number: "7276061507", dob: "05-10-2010", adhaar_number: "653968046777", gender: "Female" },
  { reg_id: "REG-2026-00108", full_name: "Sakshi Keshav Jawale", address: "Kalewadi, Pune - 411017", mobile_number: "7559478198", dob: "21-05-2003", adhaar_number: "296377354896", gender: "Female" },
  { reg_id: "REG-2026-00109", full_name: "Mudrika sangram kale", address: "Chikhali", mobile_number: "9527595411", dob: "", adhaar_number: "383297185227", gender: "Female" },
  { reg_id: "REG-2026-00110", full_name: "Rina suresh dodke", address: "Ahmendnagar", mobile_number: "9226588898", dob: "13-03-1995", adhaar_number: "894110442459", gender: "Female" },
  { reg_id: "REG-2026-00111", full_name: "Anita shelar", address: "kalewadi", mobile_number: "8087863524", dob: "12-01-1975", adhaar_number: "489103958720", gender: "Female" },
  { reg_id: "REG-2026-00112", full_name: "Laxmi Dilip Sorate", address: "kalewadi", mobile_number: "9922880826", dob: "22-05-1968", adhaar_number: "517805036722", gender: "Female" },
  { reg_id: "REG-2026-00113", full_name: "Mangal Girish Date", address: "Pimple gurav ,pune -61", mobile_number: "9881041189", dob: "04-05-1981", adhaar_number: "448363984711", gender: "Female" },
  { reg_id: "REG-2026-00114", full_name: "Aastha Girirsh date", address: "Pimple gurav ,pune -61", mobile_number: "9322601505", dob: "12-11-2003", adhaar_number: "918706935584", gender: "Female" },
  { reg_id: "REG-2026-00115", full_name: "Sandeep Mahadev Sable", address: "katraj", mobile_number: "9604988289", dob: "01-06-1975", adhaar_number: "873071775719", gender: "Male" },
  { reg_id: "REG-2026-00116", full_name: "Lata sandeep sable", address: "katraj", mobile_number: "9850715375", dob: "09-01-1980", adhaar_number: "724232279301", gender: "Female" },
  { reg_id: "REG-2026-00117", full_name: "Shubham sandip sabale", address: "katraj", mobile_number: "8080051146", dob: "16-04-2003", adhaar_number: "984178244239", gender: "Male" },
  { reg_id: "REG-2026-00118", full_name: "Sunita bhayuji Joshi", address: "katraj", mobile_number: "9850715375", dob: "15-08-1984", adhaar_number: "208472607539", gender: "Female" },
  { reg_id: "REG-2026-00119", full_name: "Sumit Sandeep sable", address: "katraj", mobile_number: "9699008661", dob: "19-08-2005", adhaar_number: "539315000764", gender: "Male" },
  { reg_id: "REG-2026-00120", full_name: "Pournima raju khandagale", address: "Dehuroad", mobile_number: "8600096136", dob: "16-08-1989", adhaar_number: "514008675470", gender: "Female" },
  { reg_id: "REG-2026-00121", full_name: "Nitin Vasanantrao Shinde", address: "Rahatni pune", mobile_number: "973616260", dob: "29-03-1972", adhaar_number: "624851384677", gender: "Male" },
  { reg_id: "REG-2026-00122", full_name: "Priya Nitin Shinde", address: "Rahatni pune", mobile_number: "7350347622", dob: "13-10-1981", adhaar_number: "459471649262", gender: "Female" },
  { reg_id: "REG-2026-00123", full_name: "Sakshi Nitin shinde", address: "Rahatni pune", mobile_number: "9699464239", dob: "27-08-2003", adhaar_number: "469774903001", gender: "Female" },
  { reg_id: "REG-2026-00124", full_name: "Aashish Nitin Shinde", address: "Rahatni pune", mobile_number: "9021766945", dob: "", adhaar_number: "564097433108", gender: "Male" },
  { reg_id: "REG-2026-00125", full_name: "Savita dada thombare", address: "Kharadi", mobile_number: "8767904302", dob: "03-10-1986", adhaar_number: "939108713632", gender: "Female" },
  { reg_id: "REG-2026-00126", full_name: "Vaishali Nitin Chavan", address: "Nigadi ,pune", mobile_number: "7557588766", dob: "05-08-1988", adhaar_number: "695337215310", gender: "Female" },
  { reg_id: "REG-2026-00127", full_name: "Sunita sudhakar gaikwad", address: "Rahatni", mobile_number: "9552849324", dob: "04-05-1983", adhaar_number: "437154358468", gender: "Female" },
  { reg_id: "REG-2026-00128", full_name: "Nikhil Sakharam Jawale", address: "Pimpale Gurav", mobile_number: "8308408877", dob: "19-11-1990", adhaar_number: "312905375128", gender: "Male" },
  { reg_id: "REG-2026-00129", full_name: "Komal Nikhil Jawale", address: "Pimpale Gurav", mobile_number: "9096028877", dob: "27-12-1995", adhaar_number: "590942847148", gender: "Female" },
  { reg_id: "REG-2026-00130", full_name: "Sumanbai Kishor Magare", address: "Akurdi ,pune", mobile_number: "9527158539", dob: "15-03-1970", adhaar_number: "982207114775", gender: "Female" },
  { reg_id: "REG-2026-00131", full_name: "Neha Keshav Jawale", address: "Wanowri", mobile_number: "9075449658", dob: "04-05-1999", adhaar_number: "619665427205", gender: "Female" },
  { reg_id: "REG-2026-00132", full_name: "Kiran Narendra kamble", address: "Wanowri", mobile_number: "8237706323", dob: "21-06-1995", adhaar_number: "802254556955", gender: "Male" },
  { reg_id: "REG-2026-00133", full_name: "Priya Shankar Shinde", address: "Nehrunagar", mobile_number: "9850064704", dob: "03-02-2003", adhaar_number: "811518785222", gender: "Female" },
  { reg_id: "REG-2026-00134", full_name: "Lilabai Ramu Khandekar", address: "Rupinagar,pune", mobile_number: "8600089451", dob: "12-03-1946", adhaar_number: "240887493003", gender: "Female" },
  { reg_id: "REG-2026-00135", full_name: "Sangita prakash tandalekar", address: "Chikhali", mobile_number: "9225492728", dob: "31-08-1969", adhaar_number: "512417144200", gender: "Female" },
  { reg_id: "REG-2026-00136", full_name: "Balaji Manik Watane", address: "Dange Chowk ,pune", mobile_number: "9699323778", dob: "11-04-1993", adhaar_number: "316518097800", gender: "Male" },
  { reg_id: "REG-2026-00137", full_name: "Ujwala Manik Watane", address: "Dange Chowk ,pune", mobile_number: "9637661326", dob: "28-05-1991", adhaar_number: "709041471171", gender: "Female" }
];

export async function seedInitialMembers() {
  const memberCount = await queryOne<{ count: string | number }>(`SELECT COUNT(*) as count FROM members`);
  const count = parseInt(String(memberCount?.count || 0), 10);

  if (count > 0) {
    console.log(`[DB Seed] Members table already has ${count} records. Skipping seed to preserve live data.`);
    return;
  }

  console.log('[DB Seed] Members table is empty. Starting initial seed (137 members)...');
  const now = getISTDateTimeString();

  // ── STEP 1: Insert all 137 members fresh ──
  let insertedCount = 0;
  for (const m of INITIAL_MEMBERS_DATA) {
    try {
      await execute(
        `INSERT INTO members (reg_id, full_name, mobile_number, email, address, place_city, gender, dob, adhaar_number, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          m.reg_id,
          m.full_name,
          m.mobile_number,
          null,
          m.address,
          m.address,
          m.gender,
          m.dob || null,
          m.adhaar_number || null,
          null,
          now,
          now
        ]
      );
      insertedCount++;
    } catch (e: any) {
      console.warn(`[DB Seed] Error inserting ${m.reg_id} (${m.full_name}):`, e.message);
    }
  }

  console.log(`[DB Seed] Done. Inserted ${insertedCount} of 137 members (REG-2026-00001 to REG-2026-00137).`);
}
