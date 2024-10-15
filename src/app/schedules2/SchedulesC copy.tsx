"use client";
import React from "react";
import { getSheetsData } from "../_lib/readSheet";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";

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

export default function SchedulesC(
  valsArr: any[],
  hdr: string[]
  /* 
  { valsArr }: { valsArr: any[] },
  { hdr }: { hdr: string[] }
   */
) {
  //let data = await getSheetsData();
  //console.log("in schedules");
  ///console.log(data);
  //const valsArr = Array.from(data.values());
  console.log("in schedulesc");
  //console.log("valsArr=", valsArr);
  //var hdr = Object.keys(valsArr[0]);
  //console.log("hdr=", hdr.join(","));
  //var hdr = valsArr[0].keys();
  return (
    <main className="text-center pt-32 px-5">
      <h1 className="text-4xl md:text-5xl font-bold mb-5 ">
        welcome to schedules page
      </h1>
      <div>
        <h1>Data from Apps Script</h1>
        <Table aria-label="Data from Sheets...">
          <TableHeader>
            <TableRow>
              <TableColumn>yyy</TableColumn>
            </TableRow>

            {/*hdr.map((item) => (
              <TableColumn>{item}</TableColumn>
            ))*/}
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell>xxx</TableCell>
            </TableRow>
            {/*valsArr.map((item, i) => (
              <TableRow key={i}>

                {hdr.map((k) => (
                  <TableCell>{item[k] == null ? "" : item[k]}</TableCell>
                ))}
              </TableRow>
            )) */}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
