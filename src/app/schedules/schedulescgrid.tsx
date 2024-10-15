"use client";
import React, { useRef } from "react";
import CellPopover from "../../components/cellPopover";
import { getSheetsData } from "../_lib/readSheet";
import { MdEventAvailable } from "react-icons/md";
import { CgUnavailable } from "react-icons/cg";
import { DatePicker } from "@nextui-org/date-picker";
import { ICellRendererParams } from "ag-grid-community";
import { GiTeacher } from "react-icons/gi";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaCalendarTimes } from "react-icons/fa";
import { IconContext } from "react-icons";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";

import {
  now,
  parseDate,
  //getLocalTimeZone,
  DateValue,
  getDayOfWeek,
  CalendarDate,
} from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  //Button,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import type { Selection } from "@nextui-org/react";
import {
  //Container,
  Card,
  CardBody,
  //Row,
  //Text,
  //Col,
  Spacer,
} from "@nextui-org/react";
import { LuChevronDownSquare } from "react-icons/lu";

import { discovery_v1 } from "googleapis";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "./styles.css";
import { useState, useMemo } from "react";
import { Switch } from "@nextui-org/switch";
const gridOptions = { rowHeight: 40, colWidth: 80 };

export interface ResRowType {
  Date: String;
  Starttm: String;
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

interface SchedulesCProps {
  resourceType: String;
  displayArr: DisplayRowType[];
  displayHdr: String[];
  dtValue: DateValue;
  filterCols: String[];
  /*
  courts: String[];
  msgCol: String;
  msgHdr: String;
  */
  search: String;
}

type DataRowType = {
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
type TipType = {
  col: string;
  msg: string;
  msgHdr: string;
};
type DisplayRowType = {
  Key: String;
  Dt: String;
  StartTm: String;
  T1: String;
  T2: String;
  T3: String;
  T4: String;
  T5: String;
  T6: String;
  msgMap: Map<string, TipType>;
  /*
  T1key: String;
  T2key: String;
  T3key: String;
  T4key: String;
  T5key: String;
  T6key: String;
  */
};

/*export default function SchedulesC(
  valsArr: any[],
  hdr: string[]
*/
var gResMap = new Map<string, any>();

const CellClicked = (
  s: { value: any; data: any; column: any; colDef: any }
  /*,
  ResMap: Map<string, any> */
) => {
  /*
        console.log(`s=${JSON.stringify(s.value)}`);
        console.log(`s.data=${JSON.stringify(s.data)}`);
        //console.log(`s.column=${s.column}`);
        console.log(`s.data=${JSON.stringify(s.colDef)}`);
        */
  //const { isOpen, onOpen, onOpenChange } = useDisclosure();
  //const [isOpen, setIsOpen] = useState(true);
  var resMap = new Map<string, any>();
  if (s.value !== "") {
    let key = `${s.colDef.field}key`;
    let reskey = s.data[key];
    console.log(`value=${s.value}, key=${key}, reskey=${reskey}`);
    var resRow = gResMap.get(reskey);
    console.log(`resRow=${JSON.stringify(resRow)}`);
    //const { isOpen, onOpen, onOpenChange } = useDisclosure();
  }
  console.log(`s.value=${s.value}`);
  return (
    <>
      <CellPopover ResRow={resRow} />
    </>
  );
};

const ReserveStateRender = (s: {
  value: any;
  data: any;
  column: any;
  colDef: any;
  search: string;
}) => {
  console.log(
    `ReserveStateRender: s.value=${s.value}, search=${
      s.search ?? ""
    }, s.data=${JSON.stringify(s.data)}`
  );
  if (s.value !== "") {
    let key = `${s.colDef.field}key`;
    let reskey = s.data[key];
    console.log(
      `value=${JSON.stringify(
        s.value
      )}, key=${key}, reskey=${reskey}, s.search=${s.search ?? ""}`
    );
    var resRow = gResMap.get(reskey);
  }
  if (s.value === "Park Instruction") {
    console.log(s.data);
    return (
      <>
        <IconContext.Provider value={{ color: "blue", size: "20px" }}>
          <span className="missionSpan justify-center items-center">
            <MdDoNotDisturbAlt />
          </span>
        </IconContext.Provider>
      </>
    );
  } else if (s.value === "Class Instruction") {
    return (
      <>
        <IconContext.Provider value={{ color: "white", size: "20px" }}>
          <span className="missionSpan justify-center items-center">
            <GiTeacher />
          </span>
        </IconContext.Provider>
      </>
    );
  } else if (s.value === "Reservation") {
    return (
      <>
        <IconContext.Provider value={{ color: "blue", size: "20px" }}>
          <span className="missionSpan justify-center items-center">
            <FaCalendarTimes />
          </span>
        </IconContext.Provider>
      </>
    );
  } else {
    return `${s.value}`;
  }
};

const CustTooltip = (s: {
  value: any;
  data: any;
  column: any;
  colDef: any;
  context: any;
}) => {
  console.log(`in CustTooltip`);

  //console.log(`, s.value=${JSON.stringify(s.value)}`);
  //console.log(` s.column=${JSON.stringify(s.column)}`);
  console.log(`s.data=${JSON.stringify(s.data)}`);
  console.log(`s.colDef=${JSON.stringify(s.colDef)}`);

  if (s.value !== "") {
    let field = s.colDef.field;
    //let msg = s.data[`${field}msg`];
    //let msgHdr = s.data[`${field}msgHdr`];
    let msg = s.data.msgMap.get(`${field}`)?.msg ?? "";
    let msgHdr = s.data.msgMap.get(`${field}`)?.msgHdr ?? "";

    console.log(`msg=${msg}`);
    console.log(`msgHdr=${msgHdr}`);
    /*
    let key = `${s.colDef.field}key`;
    let reskey = s.data[key];
    console.log(`value=${s.value}, key=${key}, reskey=${reskey}`);
    var resRow = gResMap.get(reskey);
    let msg = `Ct: ${resRow.CourtID} ${resRow.UsageGroupName} on ${resRow.Date} @ ${resRow.StartTm} --${resRow.instructor}`;
    */
    //console.log(`s.data=${JSON.stringify(s.data)}`);
    return (
      <div className="custom-tooltip">
        <div>
          <b>{/*resRow.UsageGroupName*/ msgHdr}</b>
        </div>
        <div>
          {msg}
          {/*
          Ct: {resRow.CourtID }
          Reserved: {resRow.Date} @ {resRow.StartTm}
          {resRow.UsageGroupName == "Reservation" && resRow.Party !== "" && (
            <div>Party: {resRow.Party}</div>
          )}
          {resRow.instructor !== "" && (
            <div>Instructor: {resRow.instructor}</div>
          )}
            */}
        </div>
      </div>
    );
    /*
          Date: String;
          Starttm: String;
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
          */
  }
  //console.log(`s=${JSON.stringify(s.value)}`);
  return "";
};

const SchedulesCGrid: React.FC<SchedulesCProps> = ({
  /*ResMap,*/
  displayArr,
  displayHdr,
  resourceType,
  dtValue,
  filterCols,
  /*
  courts,
  msgCol,
  msgHdr,
  */
  search,
}) => {
  /*gResMap = ResMap;*/

  console.log(
    `in schedulescgrid\n resourceType=${resourceType}\n dtValue=${dtValue}\n search=${search}`
  );

  const [srch, setSrch] = useState("");

  //const srchRef = useRef<any>();
  //srchRef.current = srch;
  var genColDefs = displayHdr.map((col: String) => {
    var rec = {
      field: col,
      flex: 1,
      cellStyle: {
        paddingLeft: 0,
        paddingRight: 0,
        textAlign: "center",
      },
    } as any;
    if (col == "StartTm") {
      rec.flex = 1;
      rec.minWidth = 50;
    }

    if (
      col == "T1" ||
      col == "T2" ||
      col == "T3" ||
      col == "T4" ||
      col == "T5" ||
      col == "T6"
    ) {
      rec.tooltipValueGetter = CustTooltip;

      console.log(`schedulescgrid:coldefs: col=${col}, search=${search}`);
      rec.cellRendererParams = {
        search: `${search}`,
      };
      rec.cellRenderer = ReserveStateRender;

      rec.onCellClicked = null; //CellClicked;
      rec.cellStyle = (s: { value: any; data: any; colDef: any }) => {
        console.log(
          `cellStyle: params=${JSON.stringify(s.data)}, search=${search}`
        );
        if (s.value == "") return { backgroundColor: "lightgreen" };
        if ((search ?? "") != "") {
          let msg = s.data.msgMap.get(s.colDef.field)?.msg ?? "";
          if (!msg.includes(search)) {
            return {
              paddingLeft: 0,
              paddingRight: 0,
              textAlign: "center",
              backgroundColor: "grey",
            };
          }
        }
        if (s.value == "Class Instruction")
          return {
            paddingLeft: 0,
            paddingRight: 0,
            textAlign: "center",
            backgroundColor: "#007FFF",
          };
        if (s.value == "Park Instruction")
          return {
            paddingLeft: 0,
            paddingRight: 0,
            textAlign: "center",
            backgroundColor: "purple",
          };
        if (s.value == "Reservation")
          return {
            paddingLeft: 0,
            paddingRight: 0,
            textAlign: "center",
            backgroundColor: "yellow",
          };
        return {};
      };
      /*
      rec.cellClassRules = {
        "grey-cell": (s: { value: any; data: any; colDef: any }) => {
          console.log(
            `cellClassRules: s=${JSON.stringify(s.value)}, search=${search}`
          );
          if ((search ?? "") == "") return false;
          let msg = s.data.msgMap.get(s.colDef.field)?.msg ?? "";
          console.log(
            `cellClassRules: s=${JSON.stringify(
              s.value
            )}, msg=${msg}, search=${search}, msg.includes(search)=${msg.includes(
              search
            )}`
          );
          //if (s.value ?? "" == "") return false;
          return true;
          //return msg.includes(search);
        },
        "green-cell": (s: { value: any }) => {
          console.log(`s=${JSON.stringify(s.value)}`);
          return s.value == "";
        },
        "blue-cell": (s: { value: any }) => {
          console.log(`s=${JSON.stringify(s.value)}`);
          return s.value == "Class Instruction";
        },
        "purple-cell": (s: { value: any }) => {
          console.log(`s=${JSON.stringify(s.value)}`);
          return s.value == "Park Instruction";
        },
        "yellow-cell": (s: { value: any }) => {
          console.log(`yellow-cell: s=${JSON.stringify(s.value)}`);
          return s.value == "Reservation";
        },
      };
      */
    }

    return rec;
  });
  const [colDefs, setColDefs] = useState(genColDefs);
  if (srch !== search) {
    console.log(
      `schedulescgrid:coldefs: search=${search} not equal to srch=${srch}`
    );

    const upd_genColDefs = genColDefs.map((rec: any) => {
      if (rec?.cellRendererParams?.search) {
        rec.cellRendererParams = {
          search: `${search}`,
        };
      }
      return rec;
    });
    console.log("upd_genColDefs=", upd_genColDefs);
    setColDefs(upd_genColDefs as any);
    setSrch(search as string);
  }
  //const [colDefs, setColDefs] = useState(genColDefs);
  //setColDefs(genColDefs as any);
  console.log(`xxx: search=${search}, srch=${srch}`);
  //if (search.length > 0 && search != srch) {
  console.log(`schedulescgrid:coldefs: search=${search}`);
  //setSrch(search as string);
  //setColDefs(genColDefs);
  console.log("coldefs=", colDefs);

  // }
  //let formatter = useDateFormatter({ dateStyle: "full" });
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 20,
      tooltipComponent: CustTooltip,
    };
  }, []);

  const cDate = new Date();
  const month = cDate.getMonth() + 1;
  const day = cDate.getDate();

  const cDateToString = (cDate: DateValue): string =>
    `${cDate.month}/${cDate.day}/${cDate.year}`;

  /*
  const [dtValue, setDtValue] = React.useState<DateValue>(
    //parseDate("2024-03-01");
    //var month=(cDate.getMonth() + 1<10)?"0":"" +`${cDate.getMonth()}`;
    //var day=cDate.getDate();
    parseDate(
      `${cDate.getFullYear()}-${month < 10 ? "0" : ""}${month}-${
        day < 10 ? "0" : ""
      }${day}`
    )
    //)
  );
  

  const [inputDate, setInputDate] = useState(
    `${cDate.getMonth() + 1}/${cDate.getDate()}/${cDate.getFullYear()}`
  );

  const handleDateInput = (e: any) => {
    console.log(`e=${JSON.stringify(e)}`);
    //const cal=new Date(e.target.value);
    const caldt = `${e["month"]}/${e["day"]}/${e["year"]}`;
    setInputDate(caldt);
    setDtValue(
      parseDate(
        `${e["year"]}-${e["month"] < 10 ? "0" : ""}${e["month"]}-${
          e["day"] < 10 ? "0" : ""
        }${e["day"]}`
      )
    );
  };
  const resourceTypes = [
    "Tennis",
    "BasketBall",
    "Soccer",
    "Baseball",
    "Picnic area",
  ];
  const [freeRandC, setFreeRandC] = React.useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<Selection>(
    new Set(["Tennis"])
  );
  const numOfDays = [1, 2, 3, 4, 5, 6, 7];
  const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  const [numOfDaysSelected, setNumOfDaysSelected] = useState<number>(1);
  //<main className="text-top pt-8 px-5 text-xs">
*/
  console.log(`schedulescgrid:before return`);
  var columnDefs = (colDefs! as any[]).filter(
    (c) => !filterCols.includes(c.field)
  );
  console.log(`schedulescgrid:coldefs=${JSON.stringify(columnDefs)}`);
  return (
    <>
      <div className="ag-theme-alpine min-w-32 " style={{ width: "100%" }}>
        <AgGridReact
          rowData={displayArr.filter((row) => {
            const [month, day, year] = row.Dt.split("/");
            const dt = new Date(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day)
            );
            var upperDate = dtValue.add({ days: 0 });
            return (
              dt.getTime() >= dtValue.toDate("America/Los_Angeles").getTime() &&
              dt.getTime() <= upperDate.toDate("America/Los_Angeles").getTime()
            );
          })}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          tooltipInteraction={true}
          domLayout={"autoHeight"}
        />
      </div>
      {/*
            </div>

            {numOfDays.slice(1, numOfDaysSelected).map((d) => (
              <div key={d} className="bg-white">
                <h6>
                  {`${
                    daysOfWeek[
                      getDayOfWeek(dtValue.add({ days: d - 1 }), "en-US")
                    ]
                  }, ${cDateToString(dtValue.add({ days: d - 1 }))}`}
                </h6>
                <div
                  className="ag-theme-alpine"
                  style={{ height: 350, width: "100%" }}
                >
                  <AgGridReact
                    key={d}
                    rowData={rowData.filter(
                      (row) =>
                        row.Dt == cDateToString(dtValue.add({ days: d - 1 }))
                    )}
                    columnDefs={colDefs.filter((c) => {
                      if (d != 1)
                        return c.field != "Dt" && c.field != "StartTm";
                      else return c.field != "Dt";
                    })}
                    defaultColDef={defaultColDef}
                    tooltipInteraction={true}
                  />
                </div>
              </div>
            ))}
              
          </div>
          
        </CardBody>
      </Card>
      */}
    </>
  );
};
export default SchedulesCGrid;
