import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useCountry } from '../contexts/CountryContext';

// Lista completa de países con códigos telefónicos
const COUNTRIES = [
  { id: 1, name: 'Afghanistan', code: 'AF', phoneCode: '+93', flag: '🇦🇫' },
  { id: 2, name: 'Albania', code: 'AL', phoneCode: '+355', flag: '🇦🇱' },
  { id: 3, name: 'Algeria', code: 'DZ', phoneCode: '+213', flag: '🇩🇿' },
  { id: 4, name: 'American Samoa', code: 'AS', phoneCode: '+1684', flag: '🇦🇸' },
  { id: 5, name: 'Andorra', code: 'AD', phoneCode: '+376', flag: '🇦🇩' },
  { id: 6, name: 'Angola', code: 'AO', phoneCode: '+244', flag: '🇦🇴' },
  { id: 7, name: 'Anguilla', code: 'AI', phoneCode: '+1264', flag: '🇦🇮' },
  { id: 8, name: 'Antarctica', code: 'AQ', phoneCode: '+672', flag: '🇦🇶' },
  { id: 9, name: 'Antigua and Barbuda', code: 'AG', phoneCode: '+1268', flag: '🇦🇬' },
  { id: 10, name: 'Argentina', code: 'AR', phoneCode: '+54', flag: '🇦🇷' },
  { id: 11, name: 'Armenia', code: 'AM', phoneCode: '+374', flag: '🇦🇲' },
  { id: 12, name: 'Aruba', code: 'AW', phoneCode: '+297', flag: '🇦🇼' },
  { id: 13, name: 'Australia', code: 'AU', phoneCode: '+61', flag: '🇦🇺' },
  { id: 14, name: 'Austria', code: 'AT', phoneCode: '+43', flag: '🇦🇹' },
  { id: 15, name: 'Azerbaijan', code: 'AZ', phoneCode: '+994', flag: '🇦🇿' },
  { id: 16, name: 'Bahamas', code: 'BS', phoneCode: '+1242', flag: '🇧🇸' },
  { id: 17, name: 'Bahrain', code: 'BH', phoneCode: '+973', flag: '🇧🇭' },
  { id: 18, name: 'Bangladesh', code: 'BD', phoneCode: '+880', flag: '🇧🇩' },
  { id: 19, name: 'Barbados', code: 'BB', phoneCode: '+1246', flag: '🇧🇧' },
  { id: 20, name: 'Belarus', code: 'BY', phoneCode: '+375', flag: '🇧🇾' },
  { id: 21, name: 'Belgium', code: 'BE', phoneCode: '+32', flag: '🇧🇪' },
  { id: 22, name: 'Belize', code: 'BZ', phoneCode: '+501', flag: '🇧🇿' },
  { id: 23, name: 'Benin', code: 'BJ', phoneCode: '+229', flag: '🇧🇯' },
  { id: 24, name: 'Bermuda', code: 'BM', phoneCode: '+1441', flag: '🇧🇲' },
  { id: 25, name: 'Bhutan', code: 'BT', phoneCode: '+975', flag: '🇧🇹' },
  { id: 26, name: 'Bolivia', code: 'BO', phoneCode: '+591', flag: '🇧🇴' },
  { id: 27, name: 'Bosnia and Herzegovina', code: 'BA', phoneCode: '+387', flag: '🇧🇦' },
  { id: 28, name: 'Botswana', code: 'BW', phoneCode: '+267', flag: '🇧🇼' },
  { id: 29, name: 'Brazil', code: 'BR', phoneCode: '+55', flag: '🇧🇷' },
  { id: 30, name: 'British Indian Ocean Territory', code: 'IO', phoneCode: '+246', flag: '🇮🇴' },
  { id: 31, name: 'Brunei Darussalam', code: 'BN', phoneCode: '+673', flag: '🇧🇳' },
  { id: 32, name: 'Bulgaria', code: 'BG', phoneCode: '+359', flag: '🇧🇬' },
  { id: 33, name: 'Burkina Faso', code: 'BF', phoneCode: '+226', flag: '🇧🇫' },
  { id: 34, name: 'Burundi', code: 'BI', phoneCode: '+257', flag: '🇧🇮' },
  { id: 35, name: 'Cambodia', code: 'KH', phoneCode: '+855', flag: '🇰🇭' },
  { id: 36, name: 'Cameroon', code: 'CM', phoneCode: '+237', flag: '🇨🇲' },
  { id: 37, name: 'Canada', code: 'CA', phoneCode: '+1', flag: '🇨🇦' },
  { id: 38, name: 'Cape Verde', code: 'CV', phoneCode: '+238', flag: '🇨🇻' },
  { id: 39, name: 'Cayman Islands', code: 'KY', phoneCode: '+1345', flag: '🇰🇾' },
  { id: 40, name: 'Central African Republic', code: 'CF', phoneCode: '+236', flag: '🇨🇫' },
  { id: 41, name: 'Chad', code: 'TD', phoneCode: '+235', flag: '🇹🇩' },
  { id: 42, name: 'Chile', code: 'CL', phoneCode: '+56', flag: '🇨🇱' },
  { id: 43, name: 'China', code: 'CN', phoneCode: '+86', flag: '🇨🇳' },
  { id: 44, name: 'Christmas Island', code: 'CX', phoneCode: '+61', flag: '🇨🇽' },
  { id: 45, name: 'Cocos (Keeling) Islands', code: 'CC', phoneCode: '+61', flag: '🇨🇨' },
  { id: 46, name: 'Colombia', code: 'CO', phoneCode: '+57', flag: '🇨🇴' },
  { id: 47, name: 'Comoros', code: 'KM', phoneCode: '+269', flag: '🇰🇲' },
  { id: 48, name: 'Congo', code: 'CG', phoneCode: '+242', flag: '🇨🇬' },
  { id: 49, name: 'Congo, Democratic Republic', code: 'CD', phoneCode: '+243', flag: '🇨🇩' },
  { id: 50, name: 'Cook Islands', code: 'CK', phoneCode: '+682', flag: '🇨🇰' },
  { id: 51, name: 'Costa Rica', code: 'CR', phoneCode: '+506', flag: '🇨🇷' },
  { id: 52, name: 'Cote d\'Ivoire', code: 'CI', phoneCode: '+225', flag: '🇨🇮' },
  { id: 53, name: 'Croatia', code: 'HR', phoneCode: '+385', flag: '🇭🇷' },
  { id: 54, name: 'Cuba', code: 'CU', phoneCode: '+53', flag: '🇨🇺' },
  { id: 55, name: 'Cyprus', code: 'CY', phoneCode: '+357', flag: '🇨🇾' },
  { id: 56, name: 'Czech Republic', code: 'CZ', phoneCode: '+420', flag: '🇨🇿' },
  { id: 57, name: 'Denmark', code: 'DK', phoneCode: '+45', flag: '🇩🇰' },
  { id: 58, name: 'Djibouti', code: 'DJ', phoneCode: '+253', flag: '🇩🇯' },
  { id: 59, name: 'Dominica', code: 'DM', phoneCode: '+1767', flag: '🇩🇲' },
  { id: 60, name: 'Dominican Republic', code: 'DO', phoneCode: '+1809', flag: '🇩🇴' },
  { id: 61, name: 'Ecuador', code: 'EC', phoneCode: '+593', flag: '🇪🇨' },
  { id: 62, name: 'Egypt', code: 'EG', phoneCode: '+20', flag: '🇪🇬' },
  { id: 63, name: 'El Salvador', code: 'SV', phoneCode: '+503', flag: '🇸🇻' },
  { id: 64, name: 'Equatorial Guinea', code: 'GQ', phoneCode: '+240', flag: '🇬🇶' },
  { id: 65, name: 'Eritrea', code: 'ER', phoneCode: '+291', flag: '🇪🇷' },
  { id: 66, name: 'Estonia', code: 'EE', phoneCode: '+372', flag: '🇪🇪' },
  { id: 67, name: 'Ethiopia', code: 'ET', phoneCode: '+251', flag: '🇪🇹' },
  { id: 68, name: 'Falkland Islands', code: 'FK', phoneCode: '+500', flag: '🇫🇰' },
  { id: 69, name: 'Faroe Islands', code: 'FO', phoneCode: '+298', flag: '🇫🇴' },
  { id: 70, name: 'Fiji', code: 'FJ', phoneCode: '+679', flag: '🇫🇯' },
  { id: 71, name: 'Finland', code: 'FI', phoneCode: '+358', flag: '🇫🇮' },
  { id: 72, name: 'France', code: 'FR', phoneCode: '+33', flag: '🇫🇷' },
  { id: 73, name: 'French Guiana', code: 'GF', phoneCode: '+594', flag: '🇬🇫' },
  { id: 74, name: 'French Polynesia', code: 'PF', phoneCode: '+689', flag: '🇵🇫' },
  { id: 75, name: 'Gabon', code: 'GA', phoneCode: '+241', flag: '🇬🇦' },
  { id: 76, name: 'Gambia', code: 'GM', phoneCode: '+220', flag: '🇬🇲' },
  { id: 77, name: 'Georgia', code: 'GE', phoneCode: '+995', flag: '🇬🇪' },
  { id: 78, name: 'Germany', code: 'DE', phoneCode: '+49', flag: '🇩🇪' },
  { id: 79, name: 'Ghana', code: 'GH', phoneCode: '+233', flag: '🇬🇭' },
  { id: 80, name: 'Gibraltar', code: 'GI', phoneCode: '+350', flag: '🇬🇮' },
  { id: 81, name: 'Greece', code: 'GR', phoneCode: '+30', flag: '🇬🇷' },
  { id: 82, name: 'Greenland', code: 'GL', phoneCode: '+299', flag: '🇬🇱' },
  { id: 83, name: 'Grenada', code: 'GD', phoneCode: '+1473', flag: '🇬🇩' },
  { id: 84, name: 'Guadeloupe', code: 'GP', phoneCode: '+590', flag: '🇬🇵' },
  { id: 85, name: 'Guam', code: 'GU', phoneCode: '+1671', flag: '🇬🇺' },
  { id: 86, name: 'Guatemala', code: 'GT', phoneCode: '+502', flag: '🇬🇹' },
  { id: 87, name: 'Guernsey', code: 'GG', phoneCode: '+44', flag: '🇬🇬' },
  { id: 88, name: 'Guinea', code: 'GN', phoneCode: '+224', flag: '🇬🇳' },
  { id: 89, name: 'Guinea-Bissau', code: 'GW', phoneCode: '+245', flag: '🇬🇼' },
  { id: 90, name: 'Guyana', code: 'GY', phoneCode: '+592', flag: '🇬🇾' },
  { id: 91, name: 'Haiti', code: 'HT', phoneCode: '+509', flag: '🇭🇹' },
  { id: 92, name: 'Honduras', code: 'HN', phoneCode: '+504', flag: '🇭🇳' },
  { id: 93, name: 'Hong Kong', code: 'HK', phoneCode: '+852', flag: '🇭🇰' },
  { id: 94, name: 'Hungary', code: 'HU', phoneCode: '+36', flag: '🇭🇺' },
  { id: 95, name: 'Iceland', code: 'IS', phoneCode: '+354', flag: '🇮🇸' },
  { id: 96, name: 'India', code: 'IN', phoneCode: '+91', flag: '🇮🇳' },
  { id: 97, name: 'Indonesia', code: 'ID', phoneCode: '+62', flag: '🇮🇩' },
  { id: 98, name: 'Iran', code: 'IR', phoneCode: '+98', flag: '🇮🇷' },
  { id: 99, name: 'Iraq', code: 'IQ', phoneCode: '+964', flag: '🇮🇶' },
  { id: 100, name: 'Ireland', code: 'IE', phoneCode: '+353', flag: '🇮🇪' },
  { id: 101, name: 'Isle of Man', code: 'IM', phoneCode: '+44', flag: '🇮🇲' },
  { id: 102, name: 'Israel', code: 'IL', phoneCode: '+972', flag: '🇮🇱' },
  { id: 103, name: 'Italy', code: 'IT', phoneCode: '+39', flag: '🇮🇹' },
  { id: 104, name: 'Jamaica', code: 'JM', phoneCode: '+1876', flag: '🇯🇲' },
  { id: 105, name: 'Japan', code: 'JP', phoneCode: '+81', flag: '🇯🇵' },
  { id: 106, name: 'Jersey', code: 'JE', phoneCode: '+44', flag: '🇯🇪' },
  { id: 107, name: 'Jordan', code: 'JO', phoneCode: '+962', flag: '🇯🇴' },
  { id: 108, name: 'Kazakhstan', code: 'KZ', phoneCode: '+7', flag: '🇰🇿' },
  { id: 109, name: 'Kenya', code: 'KE', phoneCode: '+254', flag: '🇰🇪' },
  { id: 110, name: 'Kiribati', code: 'KI', phoneCode: '+686', flag: '🇰🇮' },
  { id: 111, name: 'North Korea', code: 'KP', phoneCode: '+850', flag: '🇰🇵' },
  { id: 112, name: 'South Korea', code: 'KR', phoneCode: '+82', flag: '🇰🇷' },
  { id: 113, name: 'Kuwait', code: 'KW', phoneCode: '+965', flag: '🇰🇼' },
  { id: 114, name: 'Kyrgyzstan', code: 'KG', phoneCode: '+996', flag: '🇰🇬' },
  { id: 115, name: 'Laos', code: 'LA', phoneCode: '+856', flag: '🇱🇦' },
  { id: 116, name: 'Latvia', code: 'LV', phoneCode: '+371', flag: '🇱🇻' },
  { id: 117, name: 'Lebanon', code: 'LB', phoneCode: '+961', flag: '🇱🇧' },
  { id: 118, name: 'Lesotho', code: 'LS', phoneCode: '+266', flag: '🇱🇸' },
  { id: 119, name: 'Liberia', code: 'LR', phoneCode: '+231', flag: '🇱🇷' },
  { id: 120, name: 'Libya', code: 'LY', phoneCode: '+218', flag: '🇱🇾' },
  { id: 121, name: 'Liechtenstein', code: 'LI', phoneCode: '+423', flag: '🇱🇮' },
  { id: 122, name: 'Lithuania', code: 'LT', phoneCode: '+370', flag: '🇱🇹' },
  { id: 123, name: 'Luxembourg', code: 'LU', phoneCode: '+352', flag: '🇱🇺' },
  { id: 124, name: 'Macao', code: 'MO', phoneCode: '+853', flag: '🇲🇴' },
  { id: 125, name: 'Macedonia', code: 'MK', phoneCode: '+389', flag: '🇲🇰' },
  { id: 126, name: 'Madagascar', code: 'MG', phoneCode: '+261', flag: '🇲🇬' },
  { id: 127, name: 'Malawi', code: 'MW', phoneCode: '+265', flag: '🇲🇼' },
  { id: 128, name: 'Malaysia', code: 'MY', phoneCode: '+60', flag: '🇲🇾' },
  { id: 129, name: 'Maldives', code: 'MV', phoneCode: '+960', flag: '🇲🇻' },
  { id: 130, name: 'Mali', code: 'ML', phoneCode: '+223', flag: '🇲🇱' },
  { id: 131, name: 'Malta', code: 'MT', phoneCode: '+356', flag: '🇲🇹' },
  { id: 132, name: 'Marshall Islands', code: 'MH', phoneCode: '+692', flag: '🇲🇭' },
  { id: 133, name: 'Martinique', code: 'MQ', phoneCode: '+596', flag: '🇲🇶' },
  { id: 134, name: 'Mauritania', code: 'MR', phoneCode: '+222', flag: '🇲🇷' },
  { id: 135, name: 'Mauritius', code: 'MU', phoneCode: '+230', flag: '🇲🇺' },
  { id: 136, name: 'Mayotte', code: 'YT', phoneCode: '+262', flag: '🇾🇹' },
  { id: 137, name: 'Mexico', code: 'MX', phoneCode: '+52', flag: '🇲🇽' },
  { id: 138, name: 'Micronesia', code: 'FM', phoneCode: '+691', flag: '🇫🇲' },
  { id: 139, name: 'Moldova', code: 'MD', phoneCode: '+373', flag: '🇲🇩' },
  { id: 140, name: 'Monaco', code: 'MC', phoneCode: '+377', flag: '��🇨' },
  { id: 141, name: 'Mongolia', code: 'MN', phoneCode: '+976', flag: '🇲🇳' },
  { id: 142, name: 'Montenegro', code: 'ME', phoneCode: '+382', flag: '🇲🇪' },
  { id: 143, name: 'Montserrat', code: 'MS', phoneCode: '+1664', flag: '🇲🇸' },
  { id: 144, name: 'Morocco', code: 'MA', phoneCode: '+212', flag: '🇲🇦' },
  { id: 145, name: 'Mozambique', code: 'MZ', phoneCode: '+258', flag: '🇲🇿' },
  { id: 146, name: 'Myanmar', code: 'MM', phoneCode: '+95', flag: '🇲🇲' },
  { id: 147, name: 'Namibia', code: 'NA', phoneCode: '+264', flag: '🇳🇦' },
  { id: 148, name: 'Nauru', code: 'NR', phoneCode: '+674', flag: '🇳🇷' },
  { id: 149, name: 'Nepal', code: 'NP', phoneCode: '+977', flag: '🇳🇵' },
  { id: 150, name: 'Netherlands', code: 'NL', phoneCode: '+31', flag: '🇳🇱' },
  { id: 151, name: 'Netherlands Antilles', code: 'AN', phoneCode: '+599', flag: '🇦🇳' },
  { id: 152, name: 'New Caledonia', code: 'NC', phoneCode: '+687', flag: '🇳�' },
  { id: 153, name: 'New Zealand', code: 'NZ', phoneCode: '+64', flag: '🇳🇿' },
  { id: 154, name: 'Nicaragua', code: 'NI', phoneCode: '+505', flag: '🇳🇮' },
  { id: 155, name: 'Niger', code: 'NE', phoneCode: '+227', flag: '🇳🇪' },
  { id: 156, name: 'Nigeria', code: 'NG', phoneCode: '+234', flag: '🇳🇬' },
  { id: 157, name: 'Niue', code: 'NU', phoneCode: '+683', flag: '🇳🇺' },
  { id: 158, name: 'Norfolk Island', code: 'NF', phoneCode: '+672', flag: '🇳🇫' },
  { id: 159, name: 'Northern Mariana Islands', code: 'MP', phoneCode: '+1670', flag: '🇲🇵' },
  { id: 160, name: 'Norway', code: 'NO', phoneCode: '+47', flag: '🇳🇴' },
  { id: 161, name: 'Oman', code: 'OM', phoneCode: '+968', flag: '�🇴🇲' },
  { id: 162, name: 'Pakistan', code: 'PK', phoneCode: '+92', flag: '🇵🇰' },
  { id: 163, name: 'Palau', code: 'PW', phoneCode: '+680', flag: '🇵🇼' },
  { id: 164, name: 'Palestinian Territory', code: 'PS', phoneCode: '+970', flag: '🇵🇸' },
  { id: 165, name: 'Panama', code: 'PA', phoneCode: '+507', flag: '🇵🇦' },
  { id: 166, name: 'Papua New Guinea', code: 'PG', phoneCode: '+675', flag: '🇵🇬' },
  { id: 167, name: 'Paraguay', code: 'PY', phoneCode: '+595', flag: '🇵🇾' },
  { id: 168, name: 'Peru', code: 'PE', phoneCode: '+51', flag: '🇵🇪' },
  { id: 169, name: 'Philippines', code: 'PH', phoneCode: '+63', flag: '🇵🇭' },
  { id: 170, name: 'Pitcairn', code: 'PN', phoneCode: '+64', flag: '🇵🇳' },
  { id: 171, name: 'Poland', code: 'PL', phoneCode: '+48', flag: '🇵🇱' },
  { id: 172, name: 'Portugal', code: 'PT', phoneCode: '+351', flag: '🇵🇹' },
  { id: 173, name: 'Puerto Rico', code: 'PR', phoneCode: '+1787', flag: '🇵🇷' },
  { id: 174, name: 'Qatar', code: 'QA', phoneCode: '+974', flag: '🇶🇦' },
  { id: 175, name: 'Reunion', code: 'RE', phoneCode: '+262', flag: '🇷🇪' },
  { id: 176, name: 'Romania', code: 'RO', phoneCode: '+40', flag: '🇷🇴' },
  { id: 177, name: 'Russian Federation', code: 'RU', phoneCode: '+7', flag: '🇷🇺' },
  { id: 178, name: 'Rwanda', code: 'RW', phoneCode: '+250', flag: '🇷🇼' },
  { id: 179, name: 'Saint Barthelemy', code: 'BL', phoneCode: '+590', flag: '🇧🇱' },
  { id: 180, name: 'Saint Helena', code: 'SH', phoneCode: '+290', flag: '🇸🇭' },
  { id: 181, name: 'Saint Kitts and Nevis', code: 'KN', phoneCode: '+1869', flag: '🇰🇳' },
  { id: 182, name: 'Saint Lucia', code: 'LC', phoneCode: '+1758', flag: '🇱🇨' },
  { id: 183, name: 'Saint Martin', code: 'MF', phoneCode: '+590', flag: '🇲🇫' },
  { id: 184, name: 'Saint Pierre and Miquelon', code: 'PM', phoneCode: '+508', flag: '🇵🇲' },
  { id: 185, name: 'Saint Vincent and the Grenadines', code: 'VC', phoneCode: '+1784', flag: '🇻🇨' },
  { id: 186, name: 'Samoa', code: 'WS', phoneCode: '+685', flag: '🇼🇸' },
  { id: 187, name: 'San Marino', code: 'SM', phoneCode: '+378', flag: '🇸🇲' },
  { id: 188, name: 'Sao Tome and Principe', code: 'ST', phoneCode: '+239', flag: '🇸🇹' },
  { id: 189, name: 'Saudi Arabia', code: 'SA', phoneCode: '+966', flag: '🇸🇦' },
  { id: 190, name: 'Senegal', code: 'SN', phoneCode: '+221', flag: '🇸🇳' },
  { id: 191, name: 'Serbia', code: 'RS', phoneCode: '+381', flag: '🇷🇸' },
  { id: 192, name: 'Seychelles', code: 'SC', phoneCode: '+248', flag: '🇸🇨' },
  { id: 193, name: 'Sierra Leone', code: 'SL', phoneCode: '+232', flag: '🇸🇱' },
  { id: 194, name: 'Singapore', code: 'SG', phoneCode: '+65', flag: '🇸🇬' },
  { id: 195, name: 'Slovakia', code: 'SK', phoneCode: '+421', flag: '🇸🇰' },
  { id: 196, name: 'Slovenia', code: 'SI', phoneCode: '+386', flag: '🇸🇮' },
  { id: 197, name: 'Solomon Islands', code: 'SB', phoneCode: '+677', flag: '🇸🇧' },
  { id: 198, name: 'Somalia', code: 'SO', phoneCode: '+252', flag: '🇸🇴' },
  { id: 199, name: 'South Africa', code: 'ZA', phoneCode: '+27', flag: '🇿🇦' },
  { id: 200, name: 'South Georgia and the South Sandwich Islands', code: 'GS', phoneCode: '+500', flag: '🇬🇸' },
  { id: 201, name: 'Spain', code: 'ES', phoneCode: '+34', flag: '🇪🇸' },
  { id: 202, name: 'Sri Lanka', code: 'LK', phoneCode: '+94', flag: '🇱🇰' },
  { id: 203, name: 'Sudan', code: 'SD', phoneCode: '+249', flag: '🇸🇩' },
  { id: 204, name: 'Suriname', code: 'SR', phoneCode: '+597', flag: '🇸🇷' },
  { id: 205, name: 'Svalbard and Jan Mayen', code: 'SJ', phoneCode: '+47', flag: '🇸🇯' },
  { id: 206, name: 'Swaziland', code: 'SZ', phoneCode: '+268', flag: '🇸🇿' },
  { id: 207, name: 'Sweden', code: 'SE', phoneCode: '+46', flag: '🇸🇪' },
  { id: 208, name: 'Switzerland', code: 'CH', phoneCode: '+41', flag: '🇨🇭' },
  { id: 209, name: 'Syrian Arab Republic', code: 'SY', phoneCode: '+963', flag: '🇸🇾' },
  { id: 210, name: 'Taiwan', code: 'TW', phoneCode: '+886', flag: '🇹🇼' },
  { id: 211, name: 'Tajikistan', code: 'TJ', phoneCode: '+992', flag: '🇹🇯' },
  { id: 212, name: 'Tanzania', code: 'TZ', phoneCode: '+255', flag: '🇹🇿' },
  { id: 213, name: 'Thailand', code: 'TH', phoneCode: '+66', flag: '🇹🇭' },
  { id: 214, name: 'Timor-Leste', code: 'TL', phoneCode: '+670', flag: '🇹🇱' },
  { id: 215, name: 'Togo', code: 'TG', phoneCode: '+228', flag: '🇹🇬' },
  { id: 216, name: 'Tokelau', code: 'TK', phoneCode: '+690', flag: '🇹🇰' },
  { id: 217, name: 'Tonga', code: 'TO', phoneCode: '+676', flag: '🇹🇴' },
  { id: 218, name: 'Trinidad and Tobago', code: 'TT', phoneCode: '+1868', flag: '🇹🇹' },
  { id: 219, name: 'Tunisia', code: 'TN', phoneCode: '+216', flag: '🇹🇳' },
  { id: 220, name: 'Turkey', code: 'TR', phoneCode: '+90', flag: '🇹🇷' },
  { id: 221, name: 'Turkmenistan', code: 'TM', phoneCode: '+993', flag: '🇹🇲' },
  { id: 222, name: 'Turks and Caicos Islands', code: 'TC', phoneCode: '+1649', flag: '🇹🇨' },
  { id: 223, name: 'Tuvalu', code: 'TV', phoneCode: '+688', flag: '🇹🇻' },
  { id: 224, name: 'Uganda', code: 'UG', phoneCode: '+256', flag: '🇺🇬' },
  { id: 225, name: 'Ukraine', code: 'UA', phoneCode: '+380', flag: '🇺🇦' },
  { id: 226, name: 'United Arab Emirates', code: 'AE', phoneCode: '+971', flag: '🇦🇪' },
  { id: 227, name: 'United Kingdom', code: 'GB', phoneCode: '+44', flag: '🇬🇧' },
  { id: 228, name: 'United States', code: 'US', phoneCode: '+1', flag: '🇺🇸' },
  { id: 229, name: 'United States Minor Outlying Islands', code: 'UM', phoneCode: '+1', flag: '🇺🇲' },
  { id: 230, name: 'Uruguay', code: 'UY', phoneCode: '+598', flag: '🇺🇾' },
  { id: 231, name: 'Uzbekistan', code: 'UZ', phoneCode: '+998', flag: '🇺🇿' },
  { id: 232, name: 'Vanuatu', code: 'VU', phoneCode: '+678', flag: '🇻🇺' },
  { id: 233, name: 'Venezuela', code: 'VE', phoneCode: '+58', flag: '🇻🇪' },
  { id: 234, name: 'Vietnam', code: 'VN', phoneCode: '+84', flag: '🇻🇳' },
  { id: 235, name: 'Virgin Islands, British', code: 'VG', phoneCode: '+1284', flag: '🇻🇬' },
  { id: 236, name: 'Virgin Islands, U.S.', code: 'VI', phoneCode: '+1340', flag: '🇻🇮' },
  { id: 237, name: 'Wallis and Futuna', code: 'WF', phoneCode: '+681', flag: '🇼🇫' },
  { id: 238, name: 'Western Sahara', code: 'EH', phoneCode: '+212', flag: '🇪🇭' },
  { id: 239, name: 'Yemen', code: 'YE', phoneCode: '+967', flag: '🇾🇪' },
  { id: 240, name: 'Zambia', code: 'ZM', phoneCode: '+260', flag: '🇿🇲' },
  { id: 241, name: 'Zimbabwe', code: 'ZW', phoneCode: '+263', flag: '🇿🇼' },
];

const CountryPicker = ({ 
  selectedCountry, 
  onCountrySelect, 
  visible, 
  onClose,
  style = {} 
}) => {
  const handleCountrySelect = (country) => {
    onCountrySelect(country);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecciona tu país</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={COUNTRIES}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.countryOption,
                  selectedCountry?.code === item.code && styles.countryOptionSelected
                ]}
                onPress={() => handleCountrySelect(item)}
              >
                <View style={styles.countryInfo}>
                  <View style={styles.flagContainer}>
                    <Text style={styles.flagEmoji}>{item.flag}</Text>
                  </View>
                  <View style={styles.countryTextContainer}>
                    <Text style={[
                      styles.countryName,
                      selectedCountry?.code === item.code && styles.countryNameSelected
                    ]}>
                      {item.name}
                    </Text>
                    <Text style={[
                      styles.phoneCode,
                      selectedCountry?.code === item.code && styles.phoneCodeSelected
                    ]}>
                      {item.phoneCode}
                    </Text>
                  </View>
                </View>
                {selectedCountry?.code === item.code && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const CountrySelector = ({ 
  selectedCountry, 
  onPress, 
  style = {},
  placeholder = "Selecciona tu país" 
}) => {
  return (
    <TouchableOpacity
      style={[styles.selectorContainer, style]}
      onPress={onPress}
    >
      {selectedCountry ? (
        <View style={styles.selectedCountryContainer}>
          <View style={styles.flagContainer}>
            <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
          </View>
          <Text style={styles.selectedCountryText}>{selectedCountry.name}</Text>
        </View>
      ) : (
        <Text style={styles.placeholderText}>{placeholder}</Text>
      )}
      <Text style={styles.chevron}>▼</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },

  // Country option styles
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  countryOptionSelected: {
    backgroundColor: '#FEF2F2',
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  flagEmoji: {
    fontSize: 14,
  },
  countryTextContainer: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  countryNameSelected: {
    color: '#DC2626',
  },
  phoneCode: {
    fontSize: 14,
    color: '#6B7280',
  },
  phoneCodeSelected: {
    color: '#DC2626',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },

  // Selector styles
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedCountryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCountryText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
    marginLeft: 4,
  },
  placeholderText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  chevron: {
    fontSize: 8,
    color: '#6B7280',
    marginLeft: 4,
  },
});

export { CountryPicker, CountrySelector, COUNTRIES };
export default CountryPicker;
