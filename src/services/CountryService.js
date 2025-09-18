import { collection, addDoc, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

class CountryService {
  constructor() {
    this.collectionName = 'countries';
  }

  // Obtener todos los países
  async getAllCountries() {
    try {
      const countriesRef = collection(db, this.collectionName);
      const q = query(countriesRef, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const countries = [];
      querySnapshot.forEach((doc) => {
        countries.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, countries };
    } catch (error) {
      console.error('Error getting countries:', error);
      return { success: false, error: error.message, countries: [] };
    }
  }

  // Obtener un país por ID
  async getCountryById(countryId) {
    try {
      const countryRef = doc(db, this.collectionName, countryId);
      const countrySnap = await getDoc(countryRef);
      
      if (countrySnap.exists()) {
        return {
          success: true,
          country: {
            id: countrySnap.id,
            ...countrySnap.data()
          }
        };
      } else {
        return { success: false, error: 'País no encontrado', country: null };
      }
    } catch (error) {
      console.error('Error getting country by ID:', error);
      return { success: false, error: error.message, country: null };
    }
  }

  // Crear un país
  async createCountry(countryData) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), countryData);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating country:', error);
      return { success: false, error: error.message };
    }
  }

  // Sembrar países iniciales en Firebase
  async seedInitialCountries() {
    try {
      // Verificar si ya existen países
      const existingCountries = await this.getAllCountries();
      if (existingCountries.success && existingCountries.countries.length > 0) {
        return { 
          success: true, 
          message: `Ya existen ${existingCountries.countries.length} países en la base de datos`,
          countries: existingCountries.countries 
        };
      }

      // Lista de países para sembrar
      const countries = [
        { name: 'Afghanistan', code: 'AF', phoneCode: '+93', flag: '🇦🇫', flagUrl: 'https://flagcdn.com/w40/af.png', isActive: true },
        { name: 'Albania', code: 'AL', phoneCode: '+355', flag: '🇦🇱', flagUrl: 'https://flagcdn.com/w40/al.png', isActive: true },
        { name: 'Algeria', code: 'DZ', phoneCode: '+213', flag: '🇩🇿', flagUrl: 'https://flagcdn.com/w40/dz.png', isActive: true },
        { name: 'American Samoa', code: 'AS', phoneCode: '+1684', flag: '🇦🇸', flagUrl: 'https://flagcdn.com/w40/as.png', isActive: true },
        { name: 'Andorra', code: 'AD', phoneCode: '+376', flag: '🇦🇩', flagUrl: 'https://flagcdn.com/w40/ad.png', isActive: true },
        { name: 'Angola', code: 'AO', phoneCode: '+244', flag: '🇦🇴', flagUrl: 'https://flagcdn.com/w40/ao.png', isActive: true },
        { name: 'Anguilla', code: 'AI', phoneCode: '+1264', flag: '🇦🇮', flagUrl: 'https://flagcdn.com/w40/ai.png', isActive: true },
        { name: 'Antarctica', code: 'AQ', phoneCode: '+672', flag: '🇦🇶', flagUrl: 'https://flagcdn.com/w40/aq.png', isActive: false },
        { name: 'Antigua and Barbuda', code: 'AG', phoneCode: '+1268', flag: '🇦🇬', flagUrl: 'https://flagcdn.com/w40/ag.png', isActive: true },
        { name: 'Argentina', code: 'AR', phoneCode: '+54', flag: '🇦🇷', flagUrl: 'https://flagcdn.com/w40/ar.png', isActive: true },
        { name: 'Armenia', code: 'AM', phoneCode: '+374', flag: '🇦🇲', flagUrl: 'https://flagcdn.com/w40/am.png', isActive: true },
        { name: 'Aruba', code: 'AW', phoneCode: '+297', flag: '🇦🇼', flagUrl: 'https://flagcdn.com/w40/aw.png', isActive: true },
        { name: 'Australia', code: 'AU', phoneCode: '+61', flag: '🇦🇺', flagUrl: 'https://flagcdn.com/w40/au.png', isActive: true },
        { name: 'Austria', code: 'AT', phoneCode: '+43', flag: '🇦🇹', flagUrl: 'https://flagcdn.com/w40/at.png', isActive: true },
        { name: 'Azerbaijan', code: 'AZ', phoneCode: '+994', flag: '🇦🇿', flagUrl: 'https://flagcdn.com/w40/az.png', isActive: true },
        { name: 'Bahamas', code: 'BS', phoneCode: '+1242', flag: '🇧🇸', flagUrl: 'https://flagcdn.com/w40/bs.png', isActive: true },
        { name: 'Bahrain', code: 'BH', phoneCode: '+973', flag: '🇧🇭', flagUrl: 'https://flagcdn.com/w40/bh.png', isActive: true },
        { name: 'Bangladesh', code: 'BD', phoneCode: '+880', flag: '🇧🇩', flagUrl: 'https://flagcdn.com/w40/bd.png', isActive: true },
        { name: 'Barbados', code: 'BB', phoneCode: '+1246', flag: '🇧🇧', flagUrl: 'https://flagcdn.com/w40/bb.png', isActive: true },
        { name: 'Belarus', code: 'BY', phoneCode: '+375', flag: '🇧🇾', flagUrl: 'https://flagcdn.com/w40/by.png', isActive: true },
        { name: 'Belgium', code: 'BE', phoneCode: '+32', flag: '🇧🇪', flagUrl: 'https://flagcdn.com/w40/be.png', isActive: true },
        { name: 'Belize', code: 'BZ', phoneCode: '+501', flag: '🇧🇿', flagUrl: 'https://flagcdn.com/w40/bz.png', isActive: true },
        { name: 'Benin', code: 'BJ', phoneCode: '+229', flag: '🇧🇯', flagUrl: 'https://flagcdn.com/w40/bj.png', isActive: true },
        { name: 'Bermuda', code: 'BM', phoneCode: '+1441', flag: '🇧🇲', flagUrl: 'https://flagcdn.com/w40/bm.png', isActive: true },
        { name: 'Bhutan', code: 'BT', phoneCode: '+975', flag: '🇧🇹', flagUrl: 'https://flagcdn.com/w40/bt.png', isActive: true },
        { name: 'Bolivia', code: 'BO', phoneCode: '+591', flag: '🇧🇴', flagUrl: 'https://flagcdn.com/w40/bo.png', isActive: true },
        { name: 'Bosnia and Herzegovina', code: 'BA', phoneCode: '+387', flag: '🇧🇦', flagUrl: 'https://flagcdn.com/w40/ba.png', isActive: true },
        { name: 'Botswana', code: 'BW', phoneCode: '+267', flag: '🇧🇼', flagUrl: 'https://flagcdn.com/w40/bw.png', isActive: true },
        { name: 'Brazil', code: 'BR', phoneCode: '+55', flag: '🇧🇷', flagUrl: 'https://flagcdn.com/w40/br.png', isActive: true },
        { name: 'British Indian Ocean Territory', code: 'IO', phoneCode: '+246', flag: '🇮🇴', flagUrl: 'https://flagcdn.com/w40/io.png', isActive: false },
        { name: 'Brunei Darussalam', code: 'BN', phoneCode: '+673', flag: '🇧🇳', flagUrl: 'https://flagcdn.com/w40/bn.png', isActive: true },
        { name: 'Bulgaria', code: 'BG', phoneCode: '+359', flag: '🇧🇬', flagUrl: 'https://flagcdn.com/w40/bg.png', isActive: true },
        { name: 'Burkina Faso', code: 'BF', phoneCode: '+226', flag: '🇧🇫', flagUrl: 'https://flagcdn.com/w40/bf.png', isActive: true },
        { name: 'Burundi', code: 'BI', phoneCode: '+257', flag: '🇧🇮', flagUrl: 'https://flagcdn.com/w40/bi.png', isActive: true },
        { name: 'Cambodia', code: 'KH', phoneCode: '+855', flag: '🇰🇭', flagUrl: 'https://flagcdn.com/w40/kh.png', isActive: true },
        { name: 'Cameroon', code: 'CM', phoneCode: '+237', flag: '🇨🇲', flagUrl: 'https://flagcdn.com/w40/cm.png', isActive: true },
        { name: 'Canada', code: 'CA', phoneCode: '+1', flag: '🇨🇦', flagUrl: 'https://flagcdn.com/w40/ca.png', isActive: true },
        { name: 'Cape Verde', code: 'CV', phoneCode: '+238', flag: '🇨🇻', flagUrl: 'https://flagcdn.com/w40/cv.png', isActive: true },
        { name: 'Cayman Islands', code: 'KY', phoneCode: '+1345', flag: '🇰🇾', flagUrl: 'https://flagcdn.com/w40/ky.png', isActive: true },
        { name: 'Central African Republic', code: 'CF', phoneCode: '+236', flag: '🇨🇫', flagUrl: 'https://flagcdn.com/w40/cf.png', isActive: true },
        { name: 'Chad', code: 'TD', phoneCode: '+235', flag: '🇹🇩', flagUrl: 'https://flagcdn.com/w40/td.png', isActive: true },
        { name: 'Chile', code: 'CL', phoneCode: '+56', flag: '🇨🇱', flagUrl: 'https://flagcdn.com/w40/cl.png', isActive: true },
        { name: 'China', code: 'CN', phoneCode: '+86', flag: '🇨🇳', flagUrl: 'https://flagcdn.com/w40/cn.png', isActive: true },
        { name: 'Christmas Island', code: 'CX', phoneCode: '+61', flag: '🇨🇽', flagUrl: 'https://flagcdn.com/w40/cx.png', isActive: false },
        { name: 'Cocos (Keeling) Islands', code: 'CC', phoneCode: '+61', flag: '🇨🇨', flagUrl: 'https://flagcdn.com/w40/cc.png', isActive: false },
        { name: 'Colombia', code: 'CO', phoneCode: '+57', flag: '🇨🇴', flagUrl: 'https://flagcdn.com/w40/co.png', isActive: true },
        { name: 'Comoros', code: 'KM', phoneCode: '+269', flag: '🇰🇲', flagUrl: 'https://flagcdn.com/w40/km.png', isActive: true },
        { name: 'Congo', code: 'CG', phoneCode: '+242', flag: '🇨🇬', flagUrl: 'https://flagcdn.com/w40/cg.png', isActive: true },
        { name: 'Congo, Democratic Republic', code: 'CD', phoneCode: '+243', flag: '🇨🇩', flagUrl: 'https://flagcdn.com/w40/cd.png', isActive: true },
        { name: 'Cook Islands', code: 'CK', phoneCode: '+682', flag: '🇨🇰', flagUrl: 'https://flagcdn.com/w40/ck.png', isActive: true },
        { name: 'Costa Rica', code: 'CR', phoneCode: '+506', flag: '🇨🇷', flagUrl: 'https://flagcdn.com/w40/cr.png', isActive: true },
        { name: 'Cote d\'Ivoire', code: 'CI', phoneCode: '+225', flag: '🇨🇮', flagUrl: 'https://flagcdn.com/w40/ci.png', isActive: true },
        { name: 'Croatia', code: 'HR', phoneCode: '+385', flag: '🇭🇷', flagUrl: 'https://flagcdn.com/w40/hr.png', isActive: true },
        { name: 'Cuba', code: 'CU', phoneCode: '+53', flag: '🇨🇺', flagUrl: 'https://flagcdn.com/w40/cu.png', isActive: true },
        { name: 'Cyprus', code: 'CY', phoneCode: '+357', flag: '🇨🇾', flagUrl: 'https://flagcdn.com/w40/cy.png', isActive: true },
        { name: 'Czech Republic', code: 'CZ', phoneCode: '+420', flag: '🇨🇿', flagUrl: 'https://flagcdn.com/w40/cz.png', isActive: true },
        { name: 'Denmark', code: 'DK', phoneCode: '+45', flag: '🇩🇰', flagUrl: 'https://flagcdn.com/w40/dk.png', isActive: true },
        { name: 'Djibouti', code: 'DJ', phoneCode: '+253', flag: '🇩🇯', flagUrl: 'https://flagcdn.com/w40/dj.png', isActive: true },
        { name: 'Dominica', code: 'DM', phoneCode: '+1767', flag: '🇩🇲', flagUrl: 'https://flagcdn.com/w40/dm.png', isActive: true },
        { name: 'Dominican Republic', code: 'DO', phoneCode: '+1809', flag: '🇩🇴', flagUrl: 'https://flagcdn.com/w40/do.png', isActive: true },
        { name: 'Ecuador', code: 'EC', phoneCode: '+593', flag: '🇪🇨', flagUrl: 'https://flagcdn.com/w40/ec.png', isActive: true },
        { name: 'Egypt', code: 'EG', phoneCode: '+20', flag: '🇪🇬', flagUrl: 'https://flagcdn.com/w40/eg.png', isActive: true },
        { name: 'El Salvador', code: 'SV', phoneCode: '+503', flag: '🇸🇻', flagUrl: 'https://flagcdn.com/w40/sv.png', isActive: true },
        { name: 'Equatorial Guinea', code: 'GQ', phoneCode: '+240', flag: '🇬🇶', flagUrl: 'https://flagcdn.com/w40/gq.png', isActive: true },
        { name: 'Eritrea', code: 'ER', phoneCode: '+291', flag: '🇪🇷', flagUrl: 'https://flagcdn.com/w40/er.png', isActive: true },
        { name: 'Estonia', code: 'EE', phoneCode: '+372', flag: '🇪🇪', flagUrl: 'https://flagcdn.com/w40/ee.png', isActive: true },
        { name: 'Ethiopia', code: 'ET', phoneCode: '+251', flag: '🇪🇹', flagUrl: 'https://flagcdn.com/w40/et.png', isActive: true },
        { name: 'Falkland Islands', code: 'FK', phoneCode: '+500', flag: '🇫🇰', flagUrl: 'https://flagcdn.com/w40/fk.png', isActive: false },
        { name: 'Faroe Islands', code: 'FO', phoneCode: '+298', flag: '🇫🇴', flagUrl: 'https://flagcdn.com/w40/fo.png', isActive: true },
        { name: 'Fiji', code: 'FJ', phoneCode: '+679', flag: '🇫🇯', flagUrl: 'https://flagcdn.com/w40/fj.png', isActive: true },
        { name: 'Finland', code: 'FI', phoneCode: '+358', flag: '🇫🇮', flagUrl: 'https://flagcdn.com/w40/fi.png', isActive: true },
        { name: 'France', code: 'FR', phoneCode: '+33', flag: '🇫🇷', flagUrl: 'https://flagcdn.com/w40/fr.png', isActive: true },
        { name: 'French Guiana', code: 'GF', phoneCode: '+594', flag: '🇬🇫', flagUrl: 'https://flagcdn.com/w40/gf.png', isActive: true },
        { name: 'French Polynesia', code: 'PF', phoneCode: '+689', flag: '🇵🇫', flagUrl: 'https://flagcdn.com/w40/pf.png', isActive: true },
        { name: 'Gabon', code: 'GA', phoneCode: '+241', flag: '🇬🇦', flagUrl: 'https://flagcdn.com/w40/ga.png', isActive: true },
        { name: 'Gambia', code: 'GM', phoneCode: '+220', flag: '🇬🇲', flagUrl: 'https://flagcdn.com/w40/gm.png', isActive: true },
        { name: 'Georgia', code: 'GE', phoneCode: '+995', flag: '🇬🇪', flagUrl: 'https://flagcdn.com/w40/ge.png', isActive: true },
        { name: 'Germany', code: 'DE', phoneCode: '+49', flag: '🇩🇪', flagUrl: 'https://flagcdn.com/w40/de.png', isActive: true },
        { name: 'Ghana', code: 'GH', phoneCode: '+233', flag: '🇬🇭', flagUrl: 'https://flagcdn.com/w40/gh.png', isActive: true },
        { name: 'Gibraltar', code: 'GI', phoneCode: '+350', flag: '🇬🇮', flagUrl: 'https://flagcdn.com/w40/gi.png', isActive: true },
        { name: 'Greece', code: 'GR', phoneCode: '+30', flag: '🇬🇷', flagUrl: 'https://flagcdn.com/w40/gr.png', isActive: true },
        { name: 'Greenland', code: 'GL', phoneCode: '+299', flag: '🇬🇱', flagUrl: 'https://flagcdn.com/w40/gl.png', isActive: true },
        { name: 'Grenada', code: 'GD', phoneCode: '+1473', flag: '🇬🇩', flagUrl: 'https://flagcdn.com/w40/gd.png', isActive: true },
        { name: 'Guadeloupe', code: 'GP', phoneCode: '+590', flag: '🇬🇵', flagUrl: 'https://flagcdn.com/w40/gp.png', isActive: true },
        { name: 'Guam', code: 'GU', phoneCode: '+1671', flag: '🇬🇺', flagUrl: 'https://flagcdn.com/w40/gu.png', isActive: true },
        { name: 'Guatemala', code: 'GT', phoneCode: '+502', flag: '🇬🇹', flagUrl: 'https://flagcdn.com/w40/gt.png', isActive: true },
        { name: 'Guernsey', code: 'GG', phoneCode: '+44', flag: '🇬🇬', flagUrl: 'https://flagcdn.com/w40/gg.png', isActive: true },
        { name: 'Guinea', code: 'GN', phoneCode: '+224', flag: '🇬🇳', flagUrl: 'https://flagcdn.com/w40/gn.png', isActive: true },
        { name: 'Guinea-Bissau', code: 'GW', phoneCode: '+245', flag: '🇬🇼', flagUrl: 'https://flagcdn.com/w40/gw.png', isActive: true },
        { name: 'Guyana', code: 'GY', phoneCode: '+592', flag: '🇬🇾', flagUrl: 'https://flagcdn.com/w40/gy.png', isActive: true },
        { name: 'Haiti', code: 'HT', phoneCode: '+509', flag: '🇭🇹', flagUrl: 'https://flagcdn.com/w40/ht.png', isActive: true },
        { name: 'Honduras', code: 'HN', phoneCode: '+504', flag: '🇭🇳', flagUrl: 'https://flagcdn.com/w40/hn.png', isActive: true },
        { name: 'Hong Kong', code: 'HK', phoneCode: '+852', flag: '🇭🇰', flagUrl: 'https://flagcdn.com/w40/hk.png', isActive: true },
        { name: 'Hungary', code: 'HU', phoneCode: '+36', flag: '🇭🇺', flagUrl: 'https://flagcdn.com/w40/hu.png', isActive: true },
        { name: 'Iceland', code: 'IS', phoneCode: '+354', flag: '🇮🇸', flagUrl: 'https://flagcdn.com/w40/is.png', isActive: true },
        { name: 'India', code: 'IN', phoneCode: '+91', flag: '🇮🇳', flagUrl: 'https://flagcdn.com/w40/in.png', isActive: true },
        { name: 'Indonesia', code: 'ID', phoneCode: '+62', flag: '🇮🇩', flagUrl: 'https://flagcdn.com/w40/id.png', isActive: true },
        { name: 'Iran', code: 'IR', phoneCode: '+98', flag: '🇮🇷', flagUrl: 'https://flagcdn.com/w40/ir.png', isActive: true },
        { name: 'Iraq', code: 'IQ', phoneCode: '+964', flag: '🇮🇶', flagUrl: 'https://flagcdn.com/w40/iq.png', isActive: true },
        { name: 'Ireland', code: 'IE', phoneCode: '+353', flag: '🇮🇪', flagUrl: 'https://flagcdn.com/w40/ie.png', isActive: true },
        { name: 'Isle of Man', code: 'IM', phoneCode: '+44', flag: '🇮🇲', flagUrl: 'https://flagcdn.com/w40/im.png', isActive: true },
        { name: 'Israel', code: 'IL', phoneCode: '+972', flag: '🇮🇱', flagUrl: 'https://flagcdn.com/w40/il.png', isActive: true },
        { name: 'Italy', code: 'IT', phoneCode: '+39', flag: '🇮🇹', flagUrl: 'https://flagcdn.com/w40/it.png', isActive: true },
        { name: 'Jamaica', code: 'JM', phoneCode: '+1876', flag: '🇯🇲', flagUrl: 'https://flagcdn.com/w40/jm.png', isActive: true },
        { name: 'Japan', code: 'JP', phoneCode: '+81', flag: '🇯🇵', flagUrl: 'https://flagcdn.com/w40/jp.png', isActive: true },
        { name: 'Jersey', code: 'JE', phoneCode: '+44', flag: '🇯🇪', flagUrl: 'https://flagcdn.com/w40/je.png', isActive: true },
        { name: 'Jordan', code: 'JO', phoneCode: '+962', flag: '🇯🇴', flagUrl: 'https://flagcdn.com/w40/jo.png', isActive: true },
        { name: 'Kazakhstan', code: 'KZ', phoneCode: '+7', flag: '🇰🇿', flagUrl: 'https://flagcdn.com/w40/kz.png', isActive: true },
        { name: 'Kenya', code: 'KE', phoneCode: '+254', flag: '🇰🇪', flagUrl: 'https://flagcdn.com/w40/ke.png', isActive: true },
        { name: 'Kiribati', code: 'KI', phoneCode: '+686', flag: '🇰🇮', flagUrl: 'https://flagcdn.com/w40/ki.png', isActive: true },
        { name: 'North Korea', code: 'KP', phoneCode: '+850', flag: '🇰🇵', flagUrl: 'https://flagcdn.com/w40/kp.png', isActive: true },
        { name: 'South Korea', code: 'KR', phoneCode: '+82', flag: '🇰🇷', flagUrl: 'https://flagcdn.com/w40/kr.png', isActive: true },
        { name: 'Kuwait', code: 'KW', phoneCode: '+965', flag: '🇰🇼', flagUrl: 'https://flagcdn.com/w40/kw.png', isActive: true },
        { name: 'Kyrgyzstan', code: 'KG', phoneCode: '+996', flag: '🇰🇬', flagUrl: 'https://flagcdn.com/w40/kg.png', isActive: true },
        { name: 'Laos', code: 'LA', phoneCode: '+856', flag: '🇱🇦', flagUrl: 'https://flagcdn.com/w40/la.png', isActive: true },
        { name: 'Latvia', code: 'LV', phoneCode: '+371', flag: '🇱🇻', flagUrl: 'https://flagcdn.com/w40/lv.png', isActive: true },
        { name: 'Lebanon', code: 'LB', phoneCode: '+961', flag: '🇱🇧', flagUrl: 'https://flagcdn.com/w40/lb.png', isActive: true },
        { name: 'Lesotho', code: 'LS', phoneCode: '+266', flag: '🇱🇸', flagUrl: 'https://flagcdn.com/w40/ls.png', isActive: true },
        { name: 'Liberia', code: 'LR', phoneCode: '+231', flag: '🇱🇷', flagUrl: 'https://flagcdn.com/w40/lr.png', isActive: true },
        { name: 'Libya', code: 'LY', phoneCode: '+218', flag: '🇱🇾', flagUrl: 'https://flagcdn.com/w40/ly.png', isActive: true },
        { name: 'Liechtenstein', code: 'LI', phoneCode: '+423', flag: '🇱🇮', flagUrl: 'https://flagcdn.com/w40/li.png', isActive: true },
        { name: 'Lithuania', code: 'LT', phoneCode: '+370', flag: '🇱🇹', flagUrl: 'https://flagcdn.com/w40/lt.png', isActive: true },
        { name: 'Luxembourg', code: 'LU', phoneCode: '+352', flag: '🇱🇺', flagUrl: 'https://flagcdn.com/w40/lu.png', isActive: true },
        { name: 'Macao', code: 'MO', phoneCode: '+853', flag: '🇲🇴', flagUrl: 'https://flagcdn.com/w40/mo.png', isActive: true },
        { name: 'Macedonia', code: 'MK', phoneCode: '+389', flag: '🇲🇰', flagUrl: 'https://flagcdn.com/w40/mk.png', isActive: true },
        { name: 'Madagascar', code: 'MG', phoneCode: '+261', flag: '🇲🇬', flagUrl: 'https://flagcdn.com/w40/mg.png', isActive: true },
        { name: 'Malawi', code: 'MW', phoneCode: '+265', flag: '🇲🇼', flagUrl: 'https://flagcdn.com/w40/mw.png', isActive: true },
        { name: 'Malaysia', code: 'MY', phoneCode: '+60', flag: '🇲🇾', flagUrl: 'https://flagcdn.com/w40/my.png', isActive: true },
        { name: 'Maldives', code: 'MV', phoneCode: '+960', flag: '🇲🇻', flagUrl: 'https://flagcdn.com/w40/mv.png', isActive: true },
        { name: 'Mali', code: 'ML', phoneCode: '+223', flag: '🇲🇱', flagUrl: 'https://flagcdn.com/w40/ml.png', isActive: true },
        { name: 'Malta', code: 'MT', phoneCode: '+356', flag: '🇲🇹', flagUrl: 'https://flagcdn.com/w40/mt.png', isActive: true },
        { name: 'Marshall Islands', code: 'MH', phoneCode: '+692', flag: '🇲🇭', flagUrl: 'https://flagcdn.com/w40/mh.png', isActive: true },
        { name: 'Martinique', code: 'MQ', phoneCode: '+596', flag: '🇲🇶', flagUrl: 'https://flagcdn.com/w40/mq.png', isActive: true },
        { name: 'Mauritania', code: 'MR', phoneCode: '+222', flag: '🇲🇷', flagUrl: 'https://flagcdn.com/w40/mr.png', isActive: true },
        { name: 'Mauritius', code: 'MU', phoneCode: '+230', flag: '🇲🇺', flagUrl: 'https://flagcdn.com/w40/mu.png', isActive: true },
        { name: 'Mayotte', code: 'YT', phoneCode: '+262', flag: '🇾🇹', flagUrl: 'https://flagcdn.com/w40/yt.png', isActive: true },
        { name: 'Mexico', code: 'MX', phoneCode: '+52', flag: '🇲🇽', flagUrl: 'https://flagcdn.com/w40/mx.png', isActive: true },
        { name: 'Micronesia', code: 'FM', phoneCode: '+691', flag: '🇫🇲', flagUrl: 'https://flagcdn.com/w40/fm.png', isActive: true },
        { name: 'Moldova', code: 'MD', phoneCode: '+373', flag: '🇲🇩', flagUrl: 'https://flagcdn.com/w40/md.png', isActive: true },
        { name: 'Monaco', code: 'MC', phoneCode: '+377', flag: '🇲🇨', flagUrl: 'https://flagcdn.com/w40/mc.png', isActive: true },
        { name: 'Mongolia', code: 'MN', phoneCode: '+976', flag: '🇲🇳', flagUrl: 'https://flagcdn.com/w40/mn.png', isActive: true },
        { name: 'Montenegro', code: 'ME', phoneCode: '+382', flag: '🇲🇪', flagUrl: 'https://flagcdn.com/w40/me.png', isActive: true },
        { name: 'Montserrat', code: 'MS', phoneCode: '+1664', flag: '🇲🇸', flagUrl: 'https://flagcdn.com/w40/ms.png', isActive: true },
        { name: 'Morocco', code: 'MA', phoneCode: '+212', flag: '🇲🇦', flagUrl: 'https://flagcdn.com/w40/ma.png', isActive: true },
        { name: 'Mozambique', code: 'MZ', phoneCode: '+258', flag: '🇲🇿', flagUrl: 'https://flagcdn.com/w40/mz.png', isActive: true },
        { name: 'Myanmar', code: 'MM', phoneCode: '+95', flag: '🇲🇲', flagUrl: 'https://flagcdn.com/w40/mm.png', isActive: true },
        { name: 'Namibia', code: 'NA', phoneCode: '+264', flag: '🇳🇦', flagUrl: 'https://flagcdn.com/w40/na.png', isActive: true },
        { name: 'Nauru', code: 'NR', phoneCode: '+674', flag: '🇳🇷', flagUrl: 'https://flagcdn.com/w40/nr.png', isActive: true },
        { name: 'Nepal', code: 'NP', phoneCode: '+977', flag: '🇳🇵', flagUrl: 'https://flagcdn.com/w40/np.png', isActive: true },
        { name: 'Netherlands', code: 'NL', phoneCode: '+31', flag: '🇳🇱', flagUrl: 'https://flagcdn.com/w40/nl.png', isActive: true },
        { name: 'Netherlands Antilles', code: 'AN', phoneCode: '+599', flag: '🇦🇳', flagUrl: 'https://flagcdn.com/w40/an.png', isActive: false },
        { name: 'New Caledonia', code: 'NC', phoneCode: '+687', flag: '🇳🇨', flagUrl: 'https://flagcdn.com/w40/nc.png', isActive: true },
        { name: 'New Zealand', code: 'NZ', phoneCode: '+64', flag: '🇳🇿', flagUrl: 'https://flagcdn.com/w40/nz.png', isActive: true },
        { name: 'Nicaragua', code: 'NI', phoneCode: '+505', flag: '🇳🇮', flagUrl: 'https://flagcdn.com/w40/ni.png', isActive: true },
        { name: 'Niger', code: 'NE', phoneCode: '+227', flag: '🇳🇪', flagUrl: 'https://flagcdn.com/w40/ne.png', isActive: true },
        { name: 'Nigeria', code: 'NG', phoneCode: '+234', flag: '🇳🇬', flagUrl: 'https://flagcdn.com/w40/ng.png', isActive: true },
        { name: 'Niue', code: 'NU', phoneCode: '+683', flag: '🇳🇺', flagUrl: 'https://flagcdn.com/w40/nu.png', isActive: true },
        { name: 'Norfolk Island', code: 'NF', phoneCode: '+672', flag: '🇳🇫', flagUrl: 'https://flagcdn.com/w40/nf.png', isActive: false },
        { name: 'Northern Mariana Islands', code: 'MP', phoneCode: '+1670', flag: '🇲🇵', flagUrl: 'https://flagcdn.com/w40/mp.png', isActive: true },
        { name: 'Norway', code: 'NO', phoneCode: '+47', flag: '🇳🇴', flagUrl: 'https://flagcdn.com/w40/no.png', isActive: true },
        { name: 'Oman', code: 'OM', phoneCode: '+968', flag: '🇴🇲', flagUrl: 'https://flagcdn.com/w40/om.png', isActive: true },
        { name: 'Pakistan', code: 'PK', phoneCode: '+92', flag: '🇵🇰', flagUrl: 'https://flagcdn.com/w40/pk.png', isActive: true },
        { name: 'Palau', code: 'PW', phoneCode: '+680', flag: '🇵🇼', flagUrl: 'https://flagcdn.com/w40/pw.png', isActive: true },
        { name: 'Palestinian Territory', code: 'PS', phoneCode: '+970', flag: '🇵🇸', flagUrl: 'https://flagcdn.com/w40/ps.png', isActive: true },
        { name: 'Panama', code: 'PA', phoneCode: '+507', flag: '🇵🇦', flagUrl: 'https://flagcdn.com/w40/pa.png', isActive: true },
        { name: 'Papua New Guinea', code: 'PG', phoneCode: '+675', flag: '🇵🇬', flagUrl: 'https://flagcdn.com/w40/pg.png', isActive: true },
        { name: 'Paraguay', code: 'PY', phoneCode: '+595', flag: '🇵🇾', flagUrl: 'https://flagcdn.com/w40/py.png', isActive: true },
        { name: 'Peru', code: 'PE', phoneCode: '+51', flag: '🇵🇪', flagUrl: 'https://flagcdn.com/w40/pe.png', isActive: true },
        { name: 'Philippines', code: 'PH', phoneCode: '+63', flag: '🇵🇭', flagUrl: 'https://flagcdn.com/w40/ph.png', isActive: true },
        { name: 'Pitcairn', code: 'PN', phoneCode: '+64', flag: '🇵🇳', flagUrl: 'https://flagcdn.com/w40/pn.png', isActive: false },
        { name: 'Poland', code: 'PL', phoneCode: '+48', flag: '🇵🇱', flagUrl: 'https://flagcdn.com/w40/pl.png', isActive: true },
        { name: 'Portugal', code: 'PT', phoneCode: '+351', flag: '🇵🇹', flagUrl: 'https://flagcdn.com/w40/pt.png', isActive: true },
        { name: 'Puerto Rico', code: 'PR', phoneCode: '+1787', flag: '🇵🇷', flagUrl: 'https://flagcdn.com/w40/pr.png', isActive: true },
        { name: 'Qatar', code: 'QA', phoneCode: '+974', flag: '🇶🇦', flagUrl: 'https://flagcdn.com/w40/qa.png', isActive: true },
        { name: 'Reunion', code: 'RE', phoneCode: '+262', flag: '🇷🇪', flagUrl: 'https://flagcdn.com/w40/re.png', isActive: true },
        { name: 'Romania', code: 'RO', phoneCode: '+40', flag: '🇷🇴', flagUrl: 'https://flagcdn.com/w40/ro.png', isActive: true },
        { name: 'Russian Federation', code: 'RU', phoneCode: '+7', flag: '🇷🇺', flagUrl: 'https://flagcdn.com/w40/ru.png', isActive: true },
        { name: 'Rwanda', code: 'RW', phoneCode: '+250', flag: '🇷🇼', flagUrl: 'https://flagcdn.com/w40/rw.png', isActive: true },
        { name: 'Saint Barthelemy', code: 'BL', phoneCode: '+590', flag: '🇧🇱', flagUrl: 'https://flagcdn.com/w40/bl.png', isActive: true },
        { name: 'Saint Helena', code: 'SH', phoneCode: '+290', flag: '🇸🇭', flagUrl: 'https://flagcdn.com/w40/sh.png', isActive: false },
        { name: 'Saint Kitts and Nevis', code: 'KN', phoneCode: '+1869', flag: '🇰🇳', flagUrl: 'https://flagcdn.com/w40/kn.png', isActive: true },
        { name: 'Saint Lucia', code: 'LC', phoneCode: '+1758', flag: '🇱🇨', flagUrl: 'https://flagcdn.com/w40/lc.png', isActive: true },
        { name: 'Saint Martin', code: 'MF', phoneCode: '+590', flag: '🇲🇫', flagUrl: 'https://flagcdn.com/w40/mf.png', isActive: true },
        { name: 'Saint Pierre and Miquelon', code: 'PM', phoneCode: '+508', flag: '🇵🇲', flagUrl: 'https://flagcdn.com/w40/pm.png', isActive: true },
        { name: 'Saint Vincent and the Grenadines', code: 'VC', phoneCode: '+1784', flag: '🇻🇨', flagUrl: 'https://flagcdn.com/w40/vc.png', isActive: true },
        { name: 'Samoa', code: 'WS', phoneCode: '+685', flag: '🇼🇸', flagUrl: 'https://flagcdn.com/w40/ws.png', isActive: true },
        { name: 'San Marino', code: 'SM', phoneCode: '+378', flag: '🇸🇲', flagUrl: 'https://flagcdn.com/w40/sm.png', isActive: true },
        { name: 'Sao Tome and Principe', code: 'ST', phoneCode: '+239', flag: '🇸🇹', flagUrl: 'https://flagcdn.com/w40/st.png', isActive: true },
        { name: 'Saudi Arabia', code: 'SA', phoneCode: '+966', flag: '🇸🇦', flagUrl: 'https://flagcdn.com/w40/sa.png', isActive: true },
        { name: 'Senegal', code: 'SN', phoneCode: '+221', flag: '🇸🇳', flagUrl: 'https://flagcdn.com/w40/sn.png', isActive: true },
        { name: 'Serbia', code: 'RS', phoneCode: '+381', flag: '🇷🇸', flagUrl: 'https://flagcdn.com/w40/rs.png', isActive: true },
        { name: 'Seychelles', code: 'SC', phoneCode: '+248', flag: '🇸🇨', flagUrl: 'https://flagcdn.com/w40/sc.png', isActive: true },
        { name: 'Sierra Leone', code: 'SL', phoneCode: '+232', flag: '🇸🇱', flagUrl: 'https://flagcdn.com/w40/sl.png', isActive: true },
        { name: 'Singapore', code: 'SG', phoneCode: '+65', flag: '🇸🇬', flagUrl: 'https://flagcdn.com/w40/sg.png', isActive: true },
        { name: 'Slovakia', code: 'SK', phoneCode: '+421', flag: '🇸🇰', flagUrl: 'https://flagcdn.com/w40/sk.png', isActive: true },
        { name: 'Slovenia', code: 'SI', phoneCode: '+386', flag: '🇸🇮', flagUrl: 'https://flagcdn.com/w40/si.png', isActive: true },
        { name: 'Solomon Islands', code: 'SB', phoneCode: '+677', flag: '🇸🇧', flagUrl: 'https://flagcdn.com/w40/sb.png', isActive: true },
        { name: 'Somalia', code: 'SO', phoneCode: '+252', flag: '🇸🇴', flagUrl: 'https://flagcdn.com/w40/so.png', isActive: true },
        { name: 'South Africa', code: 'ZA', phoneCode: '+27', flag: '🇿🇦', flagUrl: 'https://flagcdn.com/w40/za.png', isActive: true },
        { name: 'South Georgia and the South Sandwich Islands', code: 'GS', phoneCode: '+500', flag: '🇬🇸', flagUrl: 'https://flagcdn.com/w40/gs.png', isActive: false },
        { name: 'Spain', code: 'ES', phoneCode: '+34', flag: '🇪🇸', flagUrl: 'https://flagcdn.com/w40/es.png', isActive: true },
        { name: 'Sri Lanka', code: 'LK', phoneCode: '+94', flag: '🇱🇰', flagUrl: 'https://flagcdn.com/w40/lk.png', isActive: true },
        { name: 'Sudan', code: 'SD', phoneCode: '+249', flag: '🇸🇩', flagUrl: 'https://flagcdn.com/w40/sd.png', isActive: true },
        { name: 'Suriname', code: 'SR', phoneCode: '+597', flag: '🇸🇷', flagUrl: 'https://flagcdn.com/w40/sr.png', isActive: true },
        { name: 'Svalbard and Jan Mayen', code: 'SJ', phoneCode: '+47', flag: '🇸🇯', flagUrl: 'https://flagcdn.com/w40/sj.png', isActive: false },
        { name: 'Swaziland', code: 'SZ', phoneCode: '+268', flag: '🇸🇿', flagUrl: 'https://flagcdn.com/w40/sz.png', isActive: true },
        { name: 'Sweden', code: 'SE', phoneCode: '+46', flag: '🇸🇪', flagUrl: 'https://flagcdn.com/w40/se.png', isActive: true },
        { name: 'Switzerland', code: 'CH', phoneCode: '+41', flag: '🇨🇭', flagUrl: 'https://flagcdn.com/w40/ch.png', isActive: true },
        { name: 'Syrian Arab Republic', code: 'SY', phoneCode: '+963', flag: '🇸🇾', flagUrl: 'https://flagcdn.com/w40/sy.png', isActive: true },
        { name: 'Taiwan', code: 'TW', phoneCode: '+886', flag: '🇹🇼', flagUrl: 'https://flagcdn.com/w40/tw.png', isActive: true },
        { name: 'Tajikistan', code: 'TJ', phoneCode: '+992', flag: '🇹🇯', flagUrl: 'https://flagcdn.com/w40/tj.png', isActive: true },
        { name: 'Tanzania', code: 'TZ', phoneCode: '+255', flag: '🇹🇿', flagUrl: 'https://flagcdn.com/w40/tz.png', isActive: true },
        { name: 'Thailand', code: 'TH', phoneCode: '+66', flag: '🇹🇭', flagUrl: 'https://flagcdn.com/w40/th.png', isActive: true },
        { name: 'Timor-Leste', code: 'TL', phoneCode: '+670', flag: '🇹🇱', flagUrl: 'https://flagcdn.com/w40/tl.png', isActive: true },
        { name: 'Togo', code: 'TG', phoneCode: '+228', flag: '🇹🇬', flagUrl: 'https://flagcdn.com/w40/tg.png', isActive: true },
        { name: 'Tokelau', code: 'TK', phoneCode: '+690', flag: '🇹🇰', flagUrl: 'https://flagcdn.com/w40/tk.png', isActive: true },
        { name: 'Tonga', code: 'TO', phoneCode: '+676', flag: '🇹🇴', flagUrl: 'https://flagcdn.com/w40/to.png', isActive: true },
        { name: 'Trinidad and Tobago', code: 'TT', phoneCode: '+1868', flag: '🇹🇹', flagUrl: 'https://flagcdn.com/w40/tt.png', isActive: true },
        { name: 'Tunisia', code: 'TN', phoneCode: '+216', flag: '🇹🇳', flagUrl: 'https://flagcdn.com/w40/tn.png', isActive: true },
        { name: 'Turkey', code: 'TR', phoneCode: '+90', flag: '🇹🇷', flagUrl: 'https://flagcdn.com/w40/tr.png', isActive: true },
        { name: 'Turkmenistan', code: 'TM', phoneCode: '+993', flag: '🇹🇲', flagUrl: 'https://flagcdn.com/w40/tm.png', isActive: true },
        { name: 'Turks and Caicos Islands', code: 'TC', phoneCode: '+1649', flag: '🇹🇨', flagUrl: 'https://flagcdn.com/w40/tc.png', isActive: true },
        { name: 'Tuvalu', code: 'TV', phoneCode: '+688', flag: '🇹🇻', flagUrl: 'https://flagcdn.com/w40/tv.png', isActive: true },
        { name: 'Uganda', code: 'UG', phoneCode: '+256', flag: '🇺🇬', flagUrl: 'https://flagcdn.com/w40/ug.png', isActive: true },
        { name: 'Ukraine', code: 'UA', phoneCode: '+380', flag: '🇺🇦', flagUrl: 'https://flagcdn.com/w40/ua.png', isActive: true },
        { name: 'United Arab Emirates', code: 'AE', phoneCode: '+971', flag: '🇦🇪', flagUrl: 'https://flagcdn.com/w40/ae.png', isActive: true },
        { name: 'United Kingdom', code: 'GB', phoneCode: '+44', flag: '🇬🇧', flagUrl: 'https://flagcdn.com/w40/gb.png', isActive: true },
        { name: 'United States', code: 'US', phoneCode: '+1', flag: '🇺🇸', flagUrl: 'https://flagcdn.com/w40/us.png', isActive: true },
        { name: 'United States Minor Outlying Islands', code: 'UM', phoneCode: '+1', flag: '🇺🇲', flagUrl: 'https://flagcdn.com/w40/um.png', isActive: false },
        { name: 'Uruguay', code: 'UY', phoneCode: '+598', flag: '🇺🇾', flagUrl: 'https://flagcdn.com/w40/uy.png', isActive: true },
        { name: 'Uzbekistan', code: 'UZ', phoneCode: '+998', flag: '🇺🇿', flagUrl: 'https://flagcdn.com/w40/uz.png', isActive: true },
        { name: 'Vanuatu', code: 'VU', phoneCode: '+678', flag: '🇻🇺', flagUrl: 'https://flagcdn.com/w40/vu.png', isActive: true },
        { name: 'Venezuela', code: 'VE', phoneCode: '+58', flag: '🇻🇪', flagUrl: 'https://flagcdn.com/w40/ve.png', isActive: true },
        { name: 'Vietnam', code: 'VN', phoneCode: '+84', flag: '🇻🇳', flagUrl: 'https://flagcdn.com/w40/vn.png', isActive: true },
        { name: 'Virgin Islands, British', code: 'VG', phoneCode: '+1284', flag: '🇻🇬', flagUrl: 'https://flagcdn.com/w40/vg.png', isActive: true },
        { name: 'Virgin Islands, U.S.', code: 'VI', phoneCode: '+1340', flag: '🇻🇮', flagUrl: 'https://flagcdn.com/w40/vi.png', isActive: true },
        { name: 'Wallis and Futuna', code: 'WF', phoneCode: '+681', flag: '🇼🇫', flagUrl: 'https://flagcdn.com/w40/wf.png', isActive: true },
        { name: 'Western Sahara', code: 'EH', phoneCode: '+212', flag: '🇪🇭', flagUrl: 'https://flagcdn.com/w40/eh.png', isActive: true },
        { name: 'Yemen', code: 'YE', phoneCode: '+967', flag: '🇾🇪', flagUrl: 'https://flagcdn.com/w40/ye.png', isActive: true },
        { name: 'Zambia', code: 'ZM', phoneCode: '+260', flag: '🇿🇲', flagUrl: 'https://flagcdn.com/w40/zm.png', isActive: true },
        { name: 'Zimbabwe', code: 'ZW', phoneCode: '+263', flag: '🇿🇼', flagUrl: 'https://flagcdn.com/w40/zw.png', isActive: true },
      ];

      // Crear países en lotes
      const createdCountries = [];
      for (const country of countries) {
        const result = await this.createCountry(country);
        if (result.success) {
          createdCountries.push({ id: result.id, ...country });
        }
      }

      return { 
        success: true, 
        message: `${createdCountries.length} países creados exitosamente`,
        countries: createdCountries 
      };
    } catch (error) {
      console.error('Error seeding countries:', error);
      return { success: false, error: error.message };
    }
  }

  // Sembrar solo Colombia en Firebase
  async seedColombia() {
    try {
      // Verificar si ya existe Colombia
      const existingCountries = await this.getAllCountries();
      if (existingCountries.success) {
        const colombia = existingCountries.countries.find(country => country.code === 'CO');
        if (colombia) {
          return { 
            success: true, 
            message: `Colombia ya existe en la base de datos`,
            country: colombia 
          };
        }
      }

      // Datos de Colombia
      const colombiaData = {
        name: 'Colombia',
        code: 'CO',
        phoneCode: '+57',
        flag: '🇨🇴',
        flagUrl: 'https://flagcdn.com/w40/co.png',
        isActive: true
      };

      // Crear Colombia
      const result = await this.createCountry(colombiaData);
      if (result.success) {
        return { 
          success: true, 
          message: `Colombia creada exitosamente`,
          country: { id: result.id, ...colombiaData }
        };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error seeding Colombia:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new CountryService();
