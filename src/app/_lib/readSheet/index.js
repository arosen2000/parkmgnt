import { google } from "googleapis";

/***
 * import { getServerSideProps } from 'next/server';

export async function getServerSideProps(context) {
  const cacheKey = 'your-cache-key';
  const cachedData = context.req.headers.cookie.match(new RegExp(`(${cacheKey}=)([^;]*);?`))?.[2];

  if (cachedData) {
    return {
      props: {
        data: JSON.parse(cachedData),
      },
    };
  }
*/
/*
type ResType = {
  Date: String;
  EndTm: String;
  CourtID: String;
  UsageGroupName: String;
  ReservationType: String;
  Party: String;
  ReservationState: String;
  Notes: String;
  TransMsg: String;
  TransDate: String;
  DayOfWk: String;
  RuleNum: String;
  instructor: String;
};
*/

export const getSheetsData = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      //client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      //private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.google_service_account_email,
      private_key: process.env.google_private_key.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = await google.sheets({
    version: "v4",
    auth: await auth.getClient(),
  });

  try {
    const res = await sheets.spreadsheets.values.get({
      //spreadsheetId: process.env.SHEETS_ID,
      spreadsheetId: process.env.sheets_id,
      range: "Reservations!A1:N",
    });
    //console.log("sheets data:", res.data.values);
    var [hdr, ...rows] = res.data.values;
    var objRows = rows.map((row) => {
      var obj = {};
      for (var i = 0; i < hdr.length; i++) {
        obj[hdr[i]] = row[i] == null ? "" : row[i];
      }
      return obj;
    });

    //let resMap: Map<string,ResType> = new Map<string,resType>();
    let resMap = new Map();
    objRows.forEach((row) => {
      let key = `${row.Date}_${row.StartTm}_${row.CourtID}`;
      //console.log("key:", key);
      resMap.set(key, row);
    });
    //console.log("sheets data:", resMap);
    const mapIter = resMap.entries();
    //console.log("mapIter:", mapIter.next().value);
    //console.log("post mapIter:");
    return resMap;
  } catch (error) {
    console.log("error fetching sheets data:", error);
    return [];
  }
};
