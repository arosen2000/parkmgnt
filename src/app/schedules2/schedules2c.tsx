"use client";
import React from "react";
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
//import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
//import "ag-grid-enterprise";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
} from "ag-grid-community"; //import { MenuModule } from "@ag-grid-enterprise/menu";
//import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import "./styles.css";
import { useState, useMemo } from "react";
import { Switch } from "@nextui-org/switch";
const gridOptions = { rowHeight: 40, colWidth: 80 };

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
/*type ResCols = {
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
};*/

export interface ResRowType {
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
    //console.log(`CellClicked: value=${s.value}, key=${key}, reskey=${reskey}`);
    var resRow = gResMap.get(reskey);
    //console.log(`CellClicked: resRow=${JSON.stringify(resRow)}`);
    //const { isOpen, onOpen, onOpenChange } = useDisclosure();
  }
  //console.log(`CellClicked: s.value=${s.value}`);
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
}) => {
  if (s.value !== "") {
    let key = `${s.colDef.field}key`;
    let reskey = s.data[key];
    /*
    console.log(
      `ResserveStateRender: value=${s.value}, key=${key}, reskey=${reskey}`
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
}) => {
  if (s.value !== "") {
    let key = `${s.colDef.field}key`;
    var resRow = s.data.resRowKey;
    /*
    console.log(
      `CustTooltip: value=${s.value}, key=${key}, resRow=${JSON.stringify(
        resRow
      )}`
    );
    */
    //var resRow = gResMap.get(reskey);
    let msg = `${resRow.CourtID} ${resRow.UsageGroupName} on ${resRow.Date} @ ${
      resRow.StartTm < 10 ? "0" : ""
    }${resRow.StartTm} --${resRow.instructor}`;
    return (
      <div className="custom-tooltip">
        <div>
          <b>
            {s.data.UsageGroupName} {resRow.UsageGroupName}
          </b>
        </div>
        <div>{s.data.msg}</div>
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
const Schedules2C: React.FC<SchedulesCProps> = ({ ResMap }) => {
  gResMap = ResMap;
  /* 
  { valsArr }: { valsArr: any[] },
  { hdr }: { hdr: string[] }
   */
  //) {
  //let data = await getSheetsData();
  //console.log("in schedules");
  ///console.log(data);
  //const valsArr = Array.from(data.values());
  console.log("in schedules2c");
  //console.log("valsArr=", ResObj.valsArr);
  //console.log("hdr=", hdr);
  //console.log("valsArr=", valsArr);
  //var hdr = Object.keys(ResMap.entries().next().value[1]);
  var valsArr = Array.from(ResMap.values());
  //console.log("hdr=", hdr.join(","));
  //var hdr = valsArr[0].keys();

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
        var resRow = ResMap.get(dataKey);
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

  //var rowhdr = ["Dt", "StartTm", "T1", "T2", "T3", "T4", "T5", "T6"];
  var rowhdr = ["Court", "msg"];
  //var rowhdr = ["Dt", "StartTm", "Court", "msg"];
  //var rowhdrNoDt = ["StartTm", "T1", "T2", "T3", "T4", "T5", "T6"];
  //var rowhdrNoDtTm = ["T1", "T2", "T3", "T4", "T5", "T6"];
  var tCourts = ["T1", "T2", "T3", "T4", "T5", "T6"];

  var displayArr = Array.from(rptRowMap.values());
  //console.log("displayArr=", displayArr);

  const [rowData, setRowData] = useState(displayArr);

  /* var ColDefs = [
    { field: "Dt", rowGroup: true, enableRowGroup: true },
    { field: "Court", rowGroup: true, enableRowGroup: true },
    { field: "StartTm", rowGroup: true, enableRowGroup: true },
  ];

  ColDefs.push(
  */
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

    if (col == "msg") {
      rec.flex = 8;
      rec.minWidth = 50;

      rec.cellStyle.textAlign = "left";
      rec.tooltipValueGetter = CustTooltip;

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
  const [colDefs, setColDefs] = useState<ColDef[]>(ColDefs);
  //let formatter = useDateFormatter({ dateStyle: "full" });
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,

      tooltipComponent: CustTooltip,
      wrapText: true, // Wrap Cell Text
      autoHeight: true, // Auto Height Cells
    };
  }, []);
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      minWidth: 200,
    };
  }, []);

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
  const [freeRandC, setFreeRandC] = React.useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<Selection>(
    new Set(["Tennis"])
  );
  const numOfDays = [1, 2, 3, 4, 5, 6, 7];
  const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  const [numOfDaysSelected, setNumOfDaysSelected] = useState<number>(1);

  const [selectedCourts, setSelectedCourts] = useState<string[]>(tCourts);
  const handleSelectedCourts = (e: any) => {
    //console.log(`e=${JSON.stringify(e)}`);
    setSelectedCourts(e.target.value.split(","));
  };

  const [searchInput, setSearchInput] = useState<string>("");
  const handleSearchInput = (e: any) => {
    //console.log(`e=${JSON.stringify(e.target.value)}`);
    setSearchInput(e.target.value);
  };
  return (
    <main className="text-top pt-8 px-5 text-xs">
      {/* ... other JSX elements */}
      <Card>
        <CardBody>
          <ul className="flex flex-row flex-wrap justify-left items-start space-x-4">
            <li className="min-w-[50px]">
              <h1>Select Park Resource type:</h1>
              <ButtonGroup variant="flat">
                <Button color="primary">{selectedOption}</Button>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button isIconOnly>
                      <LuChevronDownSquare />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Merge options"
                    selectedKeys={selectedOption}
                    selectionMode="single"
                    onSelectionChange={setSelectedOption}
                    className="max-w-[200px]"
                  >
                    {resourceTypes.map((option) => (
                      <DropdownItem key={option} value={option}>
                        {option}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </ButtonGroup>
            </li>
            <li className="min-w-[40px]">
              <h1>Enter beginning Date:</h1>
              <DatePicker
                defaultValue={dtValue}
                color="secondary"
                className="max-w-[284px]"
                onChange={handleDateInput}
              />
            </li>
            <li className="min-w-[40px]">
              <h1># of Dates to present:</h1>
              <ButtonGroup variant="flat">
                <Button color="primary">{numOfDaysSelected}</Button>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button isIconOnly>
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
            <li className="min-w-[40px]">
              <Select
                label="Courts"
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
            <li className="min-w-[40px]">
              <Input
                type="text"
                label="search"
                placeholder="search/filter msg results"
                onChange={handleSearchInput}
              ></Input>
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
            } text-center `}
          >
            <div className="flex-grow bg-indigo-900 min-w-48">
              <h6 className="text-white">
                {`${daysOfWeek[getDayOfWeek(dtValue, "en-US")]}, ${inputDate} `}
              </h6>
              <div
                className="ag-theme-alpine min-w-48 "
                style={{ width: "100%" }}
              >
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
                      dt.getTime() >=
                        dtValue.toDate("America/Los_Angeles").getTime() &&
                      dt.getTime() <=
                        upperDate.toDate("America/Los_Angeles").getTime() &&
                      selectedCourts.includes(row.Court as string) &&
                      row.msg.includes(searchInput)
                    );
                    /*
                  rowData={rowData.filter(
                    (row) =>
                      row.Dt == cDateToString(dtValue) &&
                      selectedCourts.includes(row.Court as string) &&
                      row.msg.includes(searchInput)
                  )}
                  */
                  })}
                  columnDefs={colDefs.filter((c) => c.field != "Dt")}
                  defaultColDef={defaultColDef}
                  //autoGroupColumnDef={autoGroupColumnDef}
                  tooltipInteraction={true}
                  domLayout={"autoHeight"}
                  //groupDisplayType={"singleColumn"}
                />
              </div>
            </div>

            {numOfDays.slice(1, numOfDaysSelected).map((d) => (
              <div key={d} className="flex-grow bg-indigo-900 min-w-48">
                <h6 className="text-white">
                  {`${
                    daysOfWeek[
                      getDayOfWeek(dtValue.add({ days: d - 1 }), "en-US")
                    ]
                  }, ${cDateToString(dtValue.add({ days: d - 1 }))}`}
                </h6>
                <div className="ag-theme-alpine" style={{ width: "100%" }}>
                  <AgGridReact
                    key={d}
                    rowData={rowData.filter(
                      (row) =>
                        row.Dt == cDateToString(dtValue.add({ days: d - 1 })) &&
                        selectedCourts.includes(row.Court as string) &&
                        row.msg.includes(searchInput)
                    )}
                    columnDefs={colDefs.filter((c) => {
                      if (d != 1)
                        return c.field != "Dt" && c.field != "StartTm";
                      else return c.field != "Dt";
                    })}
                    defaultColDef={defaultColDef}
                    tooltipInteraction={true}
                    domLayout={"autoHeight"}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </main>
  );
};
export default Schedules2C;
