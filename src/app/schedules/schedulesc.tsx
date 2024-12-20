"use client";
import React from "react";
import debounce from "lodash/debounce";
import SchedulesCGrid from "./schedulescgrid";
import CellPopover from "../../components/cellPopover";
import { getSheetsData } from "../_lib/readSheet";
import { MdEventAvailable } from "react-icons/md";
import { CgUnavailable } from "react-icons/cg";
import { DatePicker } from "@nextui-org/date-picker";
import {
  ICellRendererParams,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
} from "ag-grid-community";
import { GiTeacher } from "react-icons/gi";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaCalendarTimes, FaLaptopHouse } from "react-icons/fa";
import { IconContext } from "react-icons";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Switch,
  RadioGroup,
  Radio,
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
//import { Switch } from "@nextui-org/switch";
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
  ResMap: Map<
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
  >;
}

/*
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
*/

type TipType = {
  col: string;
  msg: string;
  msgHdr: string;
};

type GridDisplayRowType = {
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
};

/*export default function SchedulesC(
  valsArr: any[],
  hdr: string[]
*/
var gResMap = new Map<string, any>();
//************ */

const bad_CellClicked = (
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
    //console.log(`value=${s.value}, key=${key}, reskey=${reskey}`);
    var resRow = gResMap.get(reskey);
    //console.log(`resRow=${JSON.stringify(resRow)}`);
    //const { isOpen, onOpen, onOpenChange } = useDisclosure();
  }
  //console.log(`s.value=${s.value}`);
  return (
    <>
      <CellPopover ResRow={resRow} />
    </>
  );
};

const bad_ReserveStateRender = (s: {
  value: any;
  data: any;
  column: any;
  colDef: any;
}) => {
  if (s.value !== "") {
    let key = `${s.colDef.field}key`;
    let reskey = s.data[key];
    //console.log(`value=${s.value}, key=${key}, reskey=${reskey}`);
    var resRow = gResMap.get(reskey);
  }
  if (s.value === "Park Instruction") {
    //console.log(s.data);
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

const bad_CustTooltip = (s: {
  value: any;
  data: any;
  column: any;
  colDef: any;
}) => {
  if (s.value !== "") {
    let key = `${s.colDef.field}key`;
    let reskey = s.data[key];
    //console.log(`value=${s.value}, key=${key}, reskey=${reskey}`);
    var resRow = gResMap.get(reskey);
    let msg = `Ct: ${resRow.CourtID} ${resRow.UsageGroupName} on ${resRow.Date} @ ${resRow.StartTm} --${resRow.instructor}`;
    return (
      <div className="custom-tooltip">
        <div>
          <b>{resRow.UsageGroupName}</b>
        </div>
        <div>
          Ct: {resRow.CourtID}
          Reserved: {resRow.Date} @ {resRow.StartTm}
          {resRow.UsageGroupName == "Reservation" && resRow.Party !== "" && (
            <div>Party: {resRow.Party}</div>
          )}
          {resRow.instructor !== "" && (
            <div>Instructor: {resRow.instructor}</div>
          )}
        </div>
      </div>
    );
  }
  //console.log(`s=${JSON.stringify(s.value)}`);
  return "";
};

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
    //console.log(`value=${s.value}, key=${key}, reskey=${reskey}`);
    var resRow = gResMap.get(reskey);
    //console.log(`resRow=${JSON.stringify(resRow)}`);
    //const { isOpen, onOpen, onOpenChange } = useDisclosure();
  }
  //console.log(`s.value=${s.value}`);
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
  /*
  console.log(
    `ReserveStateRender: s.value=${s.value}, search=${
      s.search ?? ""
    }, s.data=${JSON.stringify(s.data)}`
  );
  */
  if (s.value !== "") {
    let key = `${s.colDef.field}key`;
    let reskey = s.data[key];
    /*
    console.log(
      `value=${JSON.stringify(
        s.value
      )}, key=${key}, reskey=${reskey}, s.search=${s.search ?? ""}`
    );
    */
    var resRow = gResMap.get(reskey);
  }
  if (s.value === "Park Instruction") {
    //console.log(s.data);
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
  //console.log(`in CustTooltip`);

  //console.log(`, s.value=${JSON.stringify(s.value)}`);
  //console.log(` s.column=${JSON.stringify(s.column)}`);
  //console.log(`s.data=${JSON.stringify(s.data)}`);
  //console.log(`s.colDef=${JSON.stringify(s.colDef)}`);

  if (s.value !== "") {
    let field = s.colDef.field;
    //let msg = s.data[`${field}msg`];
    //let msgHdr = s.data[`${field}msgHdr`];
    let msg = s.data.msgMap.get(`${field}`)?.msg ?? "";
    let msgHdr = s.data.msgMap.get(`${field}`)?.msgHdr ?? "";

    //console.log(`msg=${msg}`);
    //console.log(`msgHdr=${msgHdr}`);
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
  }
  //console.log(`s=${JSON.stringify(s.value)}`);
  return "";
};

type AGGridtype = {
  rowData: any;
  columnDefs: any;
  defaultColDef: any;
  tooltipInteraction: any;
  domLayout: any;
};
type RptRowType = {
  Key: String;
  Dt: String;
  Court: String;
  StartTm: String;
  EndTm: String;
  msg: String;
  DayOfWk: String;
  UsageGroupName: String;
  resRowKey: String;
};
const BuildAgRpt = (): AGGridtype => {
  /****
   * build report array
   */
  var valsArr = Array.from(gResMap.values());
  var currentDate = new Date();
  var rptRowMap = new Map<String, RptRowType>();
  var row: RptRowType;

  for (var days = 0; days < 40; days++) {
    var Dt = new Date();
    Dt.setDate(currentDate.getDate() - 7 + days);
    for (const court of ["T1", "T2", "T3", "T4", "T5", "T6"]) {
      for (var hours = 8; hours < 21; hours++) {
        var dataKey = `${Dt.toLocaleDateString(
          "en-US"
        )}_${hours.toString()}_${court}`;
        //console.log(`dataKey=${dataKey}`);
        var resRow = gResMap.get(dataKey);
        //console.log(`resRow=${JSON.stringify(resRow)}`);
        if (resRow != null) {
          const startTmI = parseInt(resRow!.StartTm as string);
          const startTm =
            startTmI < 10
              ? `0${startTmI}:00am`
              : startTmI < 12
              ? `${startTmI}:00am`
              : startTmI == 12
              ? `${startTmI}:00pm`
              : startTmI < 22
              ? `0${startTmI - 12}:00pm`
              : `${startTmI}:00pm`;
          row = {
            Key: `${Dt.toLocaleDateString("en-US")}_${hours.toString()}_court`,
            Dt: Dt.toLocaleDateString("en-US"),
            StartTm: startTm, //`${resRow.StartTm}:00`,
            EndTm: resRow.EndTm,
            Court: resRow.CourtID,
            resRowKey: dataKey,
            msg: `${Dt.getMonth() + 1 < 10 ? "0" : ""}${Dt.getMonth() + 1}/${
              Dt.getDate() < 10 ? "0" : ""
            }${Dt.getDate()}@${startTm} ${resRow.CourtID}  reserved for ${
              resRow.Party
            } `,
            DayOfWk: resRow.DayOfWk,
            UsageGroupName: resRow.UsageGroupName,
          };
          rptRowMap.set(dataKey, row);
        }
      }
    }
  }
  var rowhdr = ["Court", "msg"];
  var tCourts = ["T1", "T2", "T3", "T4", "T5", "T6"];
  var displayArr = Array.from(rptRowMap.values());
  const [rptrowData, setRptRowData] = useState(displayArr);

  /****
   * build rptColDefs
   */
  var rptColDefs = rowhdr.map((col: string) => {
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

    if (col == "msg") {
      rec.flex = 8;
      rec.minWidth = 50;

      rec.cellStyle.textAlign = "left";
      //rec.tooltipValueGetter = CustTooltip;

      rec.cellRenderer = ReserveStateRender;

      rec.onCellClicked = null; //CellClicked;

      rec.cellClassRules = {
        "green-cell": (s: { value: any }) => {
          //console.log(`s=${JSON.stringify(s.value)}`);
          return s.value.includes("free");
        },
        "blue-cell": (s: { value: any }) => {
          //console.log(`s=${JSON.stringify(s.value)}`);
          return s.value.includes("Class Instruction");
        },
        "purple-cell": (s: { value: any }) => {
          //console.log(`s=${JSON.stringify(s.value)}`);
          return s.value.includes("Park Instruction");
        },
        "yellow-cell": (s: { value: any }) => {
          //console.log(`s=${JSON.stringify(s.value)}`);
          return s.value.includes("Res");
        },
      };
    }

    return rec;
  }) as any;
  const [rptcolDefs, setrptColDefs] = useState<ColDef[]>(rptColDefs);

  /*****
   * build defaultColDef
   */
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,

      //tooltipComponent: CustTooltip,
      wrapText: true, // Wrap Cell Text
      autoHeight: true, // Auto Height Cells
    };
  }, []);

  /***** Not used ***
   * build autoGroupColumnDef
   */
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      minWidth: 200,
    };
  }, []);

  return {
    rowData: rptrowData as RptRowType[],
    columnDefs: rptcolDefs as ColDef[],
    defaultColDef: defaultColDef,
    tooltipInteraction: false,
    domLayout: "autoHeight",
  };
};

const SchedulesC: React.FC<SchedulesCProps> = ({ ResMap }) => {
  gResMap = ResMap;

  var agRptparms = BuildAgRpt();

  console.log("in schedulesc");
  //console.log("valsArr=", ResObj.valsArr);
  //console.log("hdr=", hdr);
  //console.log("valsArr=", valsArr);
  var hdr = Object.keys(ResMap.entries().next().value[1]);
  var valsArr = Array.from(ResMap.values());
  //console.log("hdr=", hdr.join(","));
  //var hdr = valsArr[0].keys();

  var currentDate = new Date();
  var gridDisplayRowMap = new Map<String, GridDisplayRowType>();
  var row: GridDisplayRowType;
  for (var days = 0; days < 40; days++) {
    for (var hours = 8; hours < 21; hours++) {
      var Dt = new Date();
      Dt.setDate(currentDate.getDate() - 7 + days);
      row = {
        Key: `${Dt.toLocaleDateString("en-US")}_${hours.toString()}`,
        Dt: Dt.toLocaleDateString("en-US"),
        StartTm:
          (hours < 10
            ? `0${hours}`
            : hours <= 12
            ? `${hours}`
            : hours - 12 < 10
            ? `0${hours - 12}`
            : `${hours - 12}`) +
          ":00" +
          (hours == 24 ? "am" : hours < 12 ? "am" : "pm"),

        T1: "",
        T2: "",
        T3: "",
        T4: "",
        T5: "",
        T6: "",
        //toolTip: [],
        msgMap: new Map<string, TipType>(),
      };
      var rowhdr = ["Dt", "StartTm", "DT", "T1", "T2", "T3", "T4", "T5", "T6"];
      for (const court of ["T1", "T2", "T3", "T4", "T5", "T6"] as const) {
        var dataKey = `${row.Key}_${court}`;
        var resRow = ResMap.get(dataKey);
        if (resRow != null) {
          const startTmI = parseInt(resRow!.StartTm as string);
          const startTm =
            startTmI < 10
              ? `0${startTmI}:00am`
              : startTmI < 12
              ? `${startTmI}:00am`
              : startTmI == 12
              ? `${startTmI}:00pm`
              : startTmI < 22
              ? `0${startTmI - 12}:00pm`
              : `${startTmI}:00pm`;
          row.msgMap.set(court, {
            msg: `${Dt.getMonth() + 1 < 10 ? "0" : ""}${Dt.getMonth() + 1}/${
              Dt.getDate() < 10 ? "0" : ""
            }${Dt.getDate()}@${startTm} ${resRow.CourtID}  reserved for ${
              resRow.Party
            } `,
            /*
            msg: `${resRow.CourtID} ${resRow.UsageGroupName} on ${
              resRow.Date
            } @ ${resRow.StartTm.length < 2 ? "0" : ""}${resRow.StartTm} 
          ${
            ["Reservation", "Class Instruction"].includes(
              resRow.UsageGroupName as string
            ) && resRow.Party !== ""
              ? "Party: " + resRow.Party
              : ""
          }
          ${
            resRow.instructor !== "" ? "Instructor: " + resRow.instructor : ""
          }`,
          */
            msgHdr: resRow.UsageGroupName as string,
          } as TipType);

          row[court] = resRow.UsageGroupName as string;
        }
      }
      gridDisplayRowMap.set(row.Key, row);
    }
  }
  //var rowhdr = ["Dt", "StartTm", "T1", "T2", "T3", "T4", "T5", "T6"];
  var rowhdr = ["Dt", "StartTm", "T1", "T2", "T3", "T4", "T5", "T6"];
  var rowhdrNoDt = ["StartTm", "T1", "T2", "T3", "T4", "T5", "T6"];
  var rowhdrNoDtTm = ["T1", "T2", "T3", "T4", "T5", "T6"];

  var gridDisplayArr = Array.from(gridDisplayRowMap.values());

  const [rowData, setRowData] = useState(gridDisplayArr);
  const [searchInput, setSearchInput] = useState<string>("");

  /*
  var ColDefs = rowhdr.map((col: string) => {
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

      rec.cellRendererParams = {
        search: `${searchInput}`,
      };
      rec.cellRenderer = ReserveStateRender;

      rec.onCellClicked = null; //CellClicked;

      rec.cellStyle = (s: { value: any; data: any; colDef: any }) => {
        console.log(
          `cellStyle: params=${JSON.stringify(s.data)}, search=${searchInput}`
        );
        if (s.value == "") return { backgroundColor: "lightgreen" };
        if ((searchInput ?? "") != "") {
          let msg = s.data.msgMap.get(s.colDef.field)?.msg ?? "";
          if (!msg.includes(searchInput)) {
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
    }

    return rec;
  });
  const [colDefs, setColDefs] = useState(ColDefs);
  //let formatter = useDateFormatter({ dateStyle: "full" });
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 20,
      tooltipComponent: CustTooltip,
    };
  }, []);

  */
  const cDate = new Date();
  const month = cDate.getMonth() + 1;
  const day = cDate.getDate();

  const cDateToString = (cDate: DateValue): string =>
    `${cDate.month}/${cDate.day}/${cDate.year}`;
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
    //console.log(`e=${JSON.stringify(e)}`);
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
  const [selectedResourceType, setSelectedResourceType] =
    useState<string>("Tennis");

  //const [freeRandC, setFreeRandC] = React.useState<boolean>(true);
  const [selectedResourceTypeOption, setSelectedResourceTypeOption] =
    useState<Selection>(new Set(["Tennis"]));
  const handleSelectedResourceType = (e: any) => {
    //console.log(`e=${JSON.stringify(e)}`);
    setSelectedResourceTypeOption(e.target.value.split(","));
  };
  const numOfDays = [1, 2, 3, 4, 5, 6, 7];
  const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  const [numOfDaysSelected, setNumOfDaysSelected] = useState<number>(7);

  var tCourts = ["T1", "T2", "T3", "T4", "T5", "T6"];

  const [selectedCourts, setSelectedCourts] = useState<string[]>(tCourts);
  const handleSelectedCourts = (e: any) => {
    //console.log(`e=${JSON.stringify(e)}`);
    setSelectedCourts(e.target.value.split(","));
  };

  //const [searchInput, setSearchInput] = useState<string>("");
  const handleSearchInput = debounce((e: any) => {
    //console.log(`e=${JSON.stringify(e.target.value)}`);
    setSearchInput(e.target.value);
    /*
    const upd_genColDefs = colDefs.map((rec: any) => {
      if (rec?.cellRendererParams?.search) {
        rec.cellRendererParams = {
          search: `${searchInput}`,
        };
      }
      return rec;
    });
    console.log("upd_genColDefs=", upd_genColDefs);
    setColDefs(upd_genColDefs as any);
    */
  }, 500);
  const [reportType, setReportType] = React.useState("Report");
  return (
    <main className="text-top pt-8 px-5 text-xs">
      <Card>
        <CardBody>
          <ul className="flex flex-wrap justify-left items-start space-x-4 ">
            <li className="min-w-[50px] py-2">
              <h1>Select Park Resource type:</h1>

              <Select
                isRequired
                classNames={{
                  innerWrapper: "  max-w-[200px] bg-blue-200",
                  label: "bg-blue-200",
                  trigger: " bg-blue-200",
                }}
                placeholder="select park Resources"
                selectedKeys={selectedResourceTypeOption}
                selectionMode="single"
                className="  max-w-[200px] "
                onChange={handleSelectedResourceType}
              >
                {resourceTypes.map((option) => (
                  <SelectItem key={option}>{option}</SelectItem>
                ))}
              </Select>
            </li>
            <li className="min-w-[40px] py-2">
              <h1>Courts</h1>
              <Select
                classNames={{
                  innerWrapper: "max-w-[200px] bg-blue-200",
                  label: "bg-blue-200",
                  trigger: " bg-blue-200",
                }}
                placeholder="select all courts"
                selectedKeys={selectedCourts}
                selectionMode="multiple"
                className="min-w-[200px]"
                onChange={handleSelectedCourts}
              >
                {tCourts.map((court) => (
                  <SelectItem key={court} value={court}>
                    {court}
                  </SelectItem>
                ))}
              </Select>
            </li>
            <li className="min-w-[40px] py-2">
              <h1>Enter beginning Date:</h1>
              <DatePicker
                className="bg-custom-color"
                classNames={{
                  calendar: "bg-blue-200",
                  calendarContent: "bg-blue-200",
                  popoverContent: "bg-blue-200",
                }}
                defaultValue={dtValue}
                onChange={handleDateInput}
              />
            </li>
            <li className="min-w-[40px] py-2">
              <h1># of Dates to present:</h1>
              <ButtonGroup variant="flat">
                <Button color="primary">{numOfDaysSelected}</Button>
                <Dropdown
                  placement="bottom-end"
                  classNames={{
                    base: "bg-blue-200",
                  }}
                  className="bg-blue-200"
                >
                  <DropdownTrigger>
                    <Button isIconOnly className="bg-blue-200">
                      <LuChevronDownSquare />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Merge options"
                    selectedKeys={new Set([`${numOfDaysSelected}`])}
                    selectionMode="single"
                    onSelectionChange={(keys) =>
                      setNumOfDaysSelected(Number(Array.from(keys)[0]))
                    }
                    className="max-w-[300px]"
                    classNames={{ base: "bg-blue-200" }}
                  >
                    {numOfDays.map((option) => (
                      <DropdownItem key={option} value={option}>
                        {option}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </ButtonGroup>
            </li>

            <li className="min-w-[40px] py-2">
              <h1>search</h1>
              <Input
                className="max-w-[200px]"
                classNames={{
                  inputWrapper: "bg-blue-200",
                }}
                type="text"
                placeholder="search/filter msg results"
                onChange={handleSearchInput}
              ></Input>
            </li>
            <li className="min-w-[40px] py-2">
              <h1>Report type</h1>
              <RadioGroup
                className="max-w-[200px]"
                value={reportType}
                onValueChange={setReportType}
                orientation="horizontal"
              >
                <Radio size="sm" value="Grid">
                  Grid
                </Radio>
                <Radio size="sm" value="Report">
                  Rpt
                </Radio>
              </RadioGroup>
            </li>
          </ul>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="bg-indigo-900">
          <div
            className={` gap-0 flex flex-row flex-wrap ${
              numOfDaysSelected == 1
                ? "grid-cols-1"
                : numOfDaysSelected == 2
                ? "grid-cols-2"
                : numOfDaysSelected == 3
                ? "grid-cols-3"
                : numOfDaysSelected == 4
                ? "grid-cols-4"
                : numOfDaysSelected == 5
                ? "grid-cols-5"
                : numOfDaysSelected == 6
                ? "grid-cols-6"
                : "grid-cols-7"
            } text-center`}
          >
            {numOfDays.slice(0, numOfDaysSelected).map((d) => (
              <div key={d} className="flex-grow bg-indigo-900 min-w-48">
                <h6 className="text-white">
                  {`${
                    daysOfWeek[
                      getDayOfWeek(dtValue.add({ days: d - 1 }), "en-US")
                    ]
                  }, ${cDateToString(dtValue.add({ days: d - 1 }))}`}
                </h6>
                <div
                  className="ag-theme-alpine min-w-48"
                  style={{ width: "100%" }}
                >
                  {reportType == "Grid" && d > 0 && (
                    <SchedulesCGrid
                      displayArr={rowData}
                      displayHdr={rowhdr}
                      dtValue={dtValue.add({ days: d - 1 })}
                      filterCols={[
                        ...["Dt"],
                        ...tCourts.filter(
                          (str) => !selectedCourts.includes(str)
                        ),
                        ...(d > 1 ? ["StartTm"] : []),
                      ]}
                      resourceType={selectedResourceType}
                      search={searchInput}
                    />
                  )}
                  {reportType == "Report" && (
                    <AgGridReact
                      key={d}
                      rowData={(agRptparms.rowData as RptRowType[]).filter(
                        (rptrow) =>
                          rptrow.Dt ==
                            cDateToString(dtValue.add({ days: d - 1 })) &&
                          selectedCourts.includes(rptrow.Court as string) &&
                          rptrow.msg.includes(searchInput)
                      )}
                      columnDefs={(agRptparms.columnDefs as ColDef[]).filter(
                        (c) => {
                          if (d != 1)
                            return c.field != "Dt" && c.field != "StartTm";
                          else return c.field != "Dt";
                        }
                      )}
                      defaultColDef={agRptparms.defaultColDef}
                      tooltipInteraction={agRptparms.tooltipInteraction}
                      domLayout={agRptparms.domLayout}
                    />
                  )}
                  {/*<!--SchedulesCRpt ResMap={ResMap} DisplayArr={rowData} --> */}{" "}
                  {/* 
              
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
                  */}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </main>
  );
};
export default SchedulesC;
