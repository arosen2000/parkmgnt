"use client";

import { ResRowType } from "../app/schedules/schedulesc";
import React from "react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";

export default function CellPopover(props: { ResRow: any }) {
  const resRow = props.ResRow;
  const [isOpen, setIsOpen] = React.useState<boolean>(true);
  const triggerRef = React.useRef(null);
  console.log("in CellPopover");
  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        onClick={() => {
          console.log("change from", isOpen, "to", !isOpen);
          setIsOpen((o) => !o);
        }}
      ></PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">
            Court {resRow.CourtId} reservered{resRow.Date}
          </div>
          <div className="text-tiny">
            <p>
              {" "}
              Date: {resRow.Date} Time {resRow.Starttm}
            </p>
            <p> Party: {resRow.Party}</p>
            <p> Type: {resRow.ReservationType}</p>
            <p> State: {resRow.ReservationState}</p>
            <p> Notes: {resRow.Notes}</p>
            <p> TransMsg: {resRow.TransMsg}</p>
            <p>
              {" "}
              TransDate:
              {resRow.TransDate}
            </p>
            <p> DayOfWk: {resRow.DayOfWk}</p>
            <p> RuleNum: {resRow.RuleNum}</p>
            <p> Instructor: {resRow.instructor}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} /*}

/*
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
/*import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RiCloseFill, RiMenuFill } from "react-icons/ri";

const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
  {
    name: "Schedules",
    href: "/schedules",
  },
  {
    name: "Instructors",
    href: "/instructors",
  },
];
*/
/*
export default function ResModal() {
  const pathname = usePathname();
  console.log(pathname);
  const [isOpen, setIsOpen] = useState(false);
  const toggleNav = () => setIsOpen((prev) => !prev);

  return (
    <>
      <header
        className="flex flex-row justify-between  items-center p-2 px-10
     border-b  text-indigo-100 bg-indigo-900 sticky top-0 z-[1] mx-auto w-full"
      >
        <ul className="flex flex-row justify-between items-center space-x-4">
          <li className="min-w-[50px]">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="logo"
                className="w-[50px] h-[50px]"
                width={50}
                height={50}
              />
            </Link>
          </li>
          <li>
            <h1 className="px-2 text-xl font-thin md:text-3xl text-red-500 ">
              Mar Vista Rec Center{" "}
            </h1>
          </li>
        </ul>
        <nav className="hidden md:flex flex-row justify-center items-center space-x-3 px-10 font-thin font-size-3xl">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`${
                pathname === link.href ? "text-indigo-500" : "text-indigo-100"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <button onClick={toggleNav} className="px-10 ">
            {isOpen ? (
              <RiCloseFill className="text-indigo-100 h-[30px] w-[30px] " />
            ) : (
              <RiMenuFill className="text-indigo-100 h-[30px] w-[30px] " />
            )}
          </button>
        </div>
      </header>

      {isOpen ? (
        <div className="transition ease-in duration-500 fixed left-0 top-0 w-[65%] md:hidden h-screen bg-indigo-400 p-10 flex flex-col  text-cyan-200">
          <div className="pt-10 justify-self-end justify-end justify-items-end">
            <button
              onClick={toggleNav}
              className="float-right justify-self-end justify-items-end"
            >
              <RiCloseFill className="text-indigo-100 h-[30px] w-[30px] " />
            </button>
          </div>
          <ul>
            <nav className=" md:hidden h-screen bg-indigo-400 p-4 ease-in duration-500 flex flex-col items-center">
              {/* "flex flex-col  flex-wrap items-center justiy-end overflow-hidden"
              {navLinks.map((link, index) => (
                <li key={index} className="mb-5">
                  <Link
                    key={index}
                    href={link.href}
                    onClick={toggleNav}
                    className="text-indigo-900"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </nav>
          </ul>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
*/
