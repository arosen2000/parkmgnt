import React from "react";
import { getSheetsData } from "../_lib/readSheet";

import SchedulesC from "./schedulesc";
//import { useState } from "react";
/*import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";
 */

/*
export const getServerSideProps = async () => {
  const response = await getSheetsData();
  const data = response;
  console.log(data);

  return {
    props: {
      data,
    },
  };
};
*/
type ResType = {
  Date: String;
  StartTm: String;
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

export default async function Page() {
  let resMap = await getSheetsData();
  console.log("in schedules");
  console.log(resMap);

  return (
    <main className="text-center pt-32 px-5">
      <h1 className="text-4xl md:text-5xl font-bold mb-5 ">
        Welcome to Mar Vista Park Resource schedules
      </h1>
      <div>
        <SchedulesC
          ResMap={
            resMap as Map<
              string,
              {
                Date: String;
                StartTm: String;
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
              }
            >
          }
        />
      </div>
    </main>
  );
}
