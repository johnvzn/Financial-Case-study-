"use client";

import Link from "next/link";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";

const ARTBOARD_WIDTH = 1920;
const FLOOR_1_HEIGHT = 1080;
const GRID_MARGIN = 40;
const GRID_GUTTER = 50;
const GRID_COLUMNS = 12;
const VIEWPORT_TOP_OFFSET = 0;
const BG_IMAGE_PATH = "/BG_01.png";
const FLOOR2_BG_IMAGE_PATH = "/BG_02.png";
const FLOOR3_BG_IMAGE_PATH = "/BG_03.png";
const FLOOR2_HEAD_TOP = 80;
const FLOOR2_CARDS_TOP = 320;
const FLOOR2_CARD_GAP = 114;
const FLOOR2_SCROLL_Y = 1052;
const FLOOR2_CARD_HEIGHT = 620;
const FLOOR2_CARD_WIDTH = 580;
const FLOOR2_CARDS_WIDTH = 1216;
const FLOOR2_CARDS_LEFT = (ARTBOARD_WIDTH - FLOOR2_CARDS_WIDTH) / 2;
const FLOOR2_CARDS_HEIGHT = 2822;
const FLOOR2_TRANSITION_OFFSET_SCREEN_PX = 40;
const FLOOR3_HEAD_TOP = 80;
const FLOOR3_BLOCKS_TOP = 320;
const FLOOR3_SCROLL_Y = 1052;
const FLOOR3_BLOCKS_WIDTH = 1210;
const FLOOR3_BLOCKS_LEFT = (ARTBOARD_WIDTH - FLOOR3_BLOCKS_WIDTH) / 2;
const FLOOR3_BLOCK_ROW_GAP = 40;
const FLOOR3_BOTTOM_OFFSET_SCREEN_PX = 40;
const FLOOR4_BG_PRIMARY = "/BG_04.png";
const FLOOR4_HEAD_TOP = 80;
const FLOOR4_BLOCKS_TOP = 320;
const FLOOR4_SCROLL_Y = 1052;
const FLOOR4_BLOCKS_WIDTH = 1210;
const FLOOR4_BLOCKS_LEFT = (ARTBOARD_WIDTH - FLOOR4_BLOCKS_WIDTH) / 2;
const FLOOR4_BLOCK_ROW_GAP = 12;
const FLOOR4_BOTTOM_OFFSET_SCREEN_PX = 40;
const FLOOR4_DESCRIPTION_WIDTH = 1869;
const FLOOR5_BG_PRIMARY = "/BG_05.png";
const FLOOR5_HEAD_TOP = 80;
const FLOOR5_DESCRIPTION_WIDTH = 1868;
const FLOOR5_DESCRIPTION_LEFT = 40;
const FLOOR5_FORM_TOP = 396;
const FLOOR5_FORM_WIDTH = 896;
const FLOOR5_FORM_LEFT = (ARTBOARD_WIDTH - FLOOR5_FORM_WIDTH) / 2;
const FLOOR5_BOTTOM_OFFSET_SCREEN_PX = 40;

const GRID_COLUMN_WIDTH =
  (ARTBOARD_WIDTH - GRID_MARGIN * 2 - GRID_GUTTER * (GRID_COLUMNS - 1)) /
  GRID_COLUMNS;

const columnStart = (column: number) =>
  GRID_MARGIN + (column - 1) * (GRID_COLUMN_WIDTH + GRID_GUTTER);
const columnEnd = (column: number) => columnStart(column) + GRID_COLUMN_WIDTH;
const FLOOR3_TEXT_LEFT = columnStart(1);
const FLOOR3_TEXT_RIGHT = columnEnd(10);
const FLOOR3_TEXT_WIDTH = FLOOR3_TEXT_RIGHT - FLOOR3_TEXT_LEFT;
const FLOOR3_ACCELERATED_LEFT = columnStart(2) - columnStart(1);
const FLOOR3_ISE_LINE_HEIGHT = 30.13;
const FLOOR3_ACCELERATED_TOP = FLOOR3_ISE_LINE_HEIGHT - 16;
const FLOOR3_ACCELERATED_LINE_HEIGHT = 40;
const FLOOR3_KICKER_LINE_HEIGHT = 21;
const FLOOR3_KICKER_LEFT = columnStart(6) - columnStart(1);
const FLOOR3_KICKER_TOP = FLOOR3_ACCELERATED_TOP + (FLOOR3_ACCELERATED_LINE_HEIGHT - FLOOR3_KICKER_LINE_HEIGHT);
const FLOOR3_LOWERED_TOP = FLOOR3_ACCELERATED_TOP + FLOOR3_ACCELERATED_LINE_HEIGHT;
const FLOOR3_INDEX_LEFT = 250;
const FLOOR3_INDEX_TOP = FLOOR3_LOWERED_TOP + 8;
const FLOOR3_MISSION_LEFT = 300;
const FLOOR3_MISSION_TOP = FLOOR3_LOWERED_TOP;
const FLOOR3_MISSION_WIDTH = FLOOR3_TEXT_WIDTH - FLOOR3_MISSION_LEFT;
const FLOOR3_LINE3_TOP = FLOOR3_MISSION_TOP + FLOOR3_ACCELERATED_LINE_HEIGHT;
const FLOOR3_LINE4_TOP = FLOOR3_LINE3_TOP + FLOOR3_ACCELERATED_LINE_HEIGHT;
const FLOOR3_LINE34_WIDTH = FLOOR3_TEXT_WIDTH;

type Floor2CardData = {
  id: string;
  title: string;
  description: string;
  align: "left" | "right";
  paddingX: number;
  top: number;
};

type Floor3Block = {
  id: string;
  value: string;
  unit: string;
  label: string;
  align: "left" | "right";
  iconVariant: "chart" | "review" | "clear" | "time";
  row: 1 | 2 | 3;
};

type Floor4QuoteCardData = {
  id: string;
  align: "left" | "right";
  quoteLines: string[];
  name: string;
  companyLines: string[];
};

const floor2Cards: Floor2CardData[] = [
  {
    id: "2",
    title: "Design around analysis",
    description:
      "An intelligent system automates complex patent data into structured claim charts with minimal effort. It extracts, maps, and formats claims, letting teams focus on interpretation.",
    align: "right",
    paddingX: 80,
    top: 0,
  },
  {
    id: "1",
    title: "Legal, R&D, & Business all on the same page",
    description:
      "A single source of truth for patent clearance work means transparency and consistency without dangerous scattered communications.",
    align: "left",
    paddingX: 80,
    top: FLOOR2_CARD_HEIGHT + FLOOR2_CARD_GAP,
  },
  {
    id: "4",
    title: "Automated Claim Chart Generation",
    description:
      "A streamlined solution transforms complex patent data into structured claim charts with minimal effort. It automates extraction, mapping, and formatting to help legal teams accelerate analysis and ensure consistency.",
    align: "right",
    paddingX: 60,
    top: (FLOOR2_CARD_HEIGHT + FLOOR2_CARD_GAP) * 2,
  },
  {
    id: "3",
    title: "Specification Support Extraction",
    description:
      "Select a claim term and AI will process the specification to extract and summarize the most relevant portions that help define or explain the selected term, saving hours of detailed patent review.",
    align: "left",
    paddingX: 60,
    top: (FLOOR2_CARD_HEIGHT + FLOOR2_CARD_GAP) * 3,
  },
];

const floor3Blocks: Floor3Block[] = [
  {
    id: "01",
    value: "320.10",
    unit: "m.",
    label: "Patent claims analyzed",
    align: "right",
    iconVariant: "chart",
    row: 1,
  },
  {
    id: "03",
    value: "383",
    unit: "m.",
    label: "Total patents Reviewed",
    align: "left",
    iconVariant: "review",
    row: 2,
  },
  {
    id: "02",
    value: "1700",
    unit: "m.",
    label: "Products cleared",
    align: "right",
    iconVariant: "clear",
    row: 2,
  },
  {
    id: "04",
    value: "30",
    unit: "%.",
    label: "Average time Savings Per Review",
    align: "left",
    iconVariant: "time",
    row: 3,
  },
];

const floor4QuoteCards: Floor4QuoteCardData[] = [
  {
    id: "01",
    align: "right",
    quoteLines: ["“It simply the best product on the market and I must have it.”"],
    name: "Sofia Navarro",
    companyLines: ["Medical Device Company"],
  },
  {
    id: "02",
    align: "left",
    quoteLines: [
      "“The Clearstone FTO Platfrom makes the FTO process easy and intuitive. It enabled us to",
      "easily recall our",
      "notes, comments and earlier determinations regarding a previously searched reference which helped to ensure analysis quality and reduced the chance of missing a claim while saving considerable time in completing the analysis.",
    ],
    name: "Carlyn Burton",
    companyLines: ["Partner, Osha Bergman Watanabe", "& Burton, LLP"],
  },
  {
    id: "03",
    align: "right",
    quoteLines: [
      "“Going back to FTO without Clearstone is a great eye opener for just how much more efficient",
      "FTO exercise is with Clearstone and that is before even considering the increased safety and quality.”",
    ],
    name: "Robert Miller",
    companyLines: ["Formerly at global sportswear company"],
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function useArtboardScale() {
  const [viewport, setViewport] = useState({
    width: ARTBOARD_WIDTH,
    height: FLOOR_1_HEIGHT,
  });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return useMemo(() => {
    const scale = viewport.width / ARTBOARD_WIDTH;
    const offsetX = 0;
    const offsetY = 0;

    return { scale, offsetX, offsetY, viewportHeight: viewport.height };
  }, [viewport.height, viewport.width]);
}

function usePageScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      setScrollY(window.scrollY);
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  return scrollY;
}

function useMeasuredHeight<T extends HTMLElement>(
  ref: RefObject<T | null>,
  fallback: number,
) {
  const [height, setHeight] = useState(fallback);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const measure = () => {
      setHeight(node.offsetHeight);
    };

    measure();
    window.addEventListener("resize", measure);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      observer.observe(node);
    }

    return () => {
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [ref]);

  return height;
}

function GridOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div
        className="absolute inset-y-0 grid"
        style={{
          left: GRID_MARGIN,
          right: GRID_MARGIN,
          gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
          columnGap: GRID_GUTTER,
        }}
      >
        {Array.from({ length: GRID_COLUMNS }).map((_, index) => (
          <div key={index} className="h-full bg-[#ff0000]/10" />
        ))}
      </div>
    </div>
  );
}

function MenuBlock({ lines, index }: { lines: number[]; index: string }) {
  return (
    <div className="flex items-start justify-end gap-10">
      <div className="flex flex-col gap-3">
        {lines.map((lineOffset, itemIndex) => (
          <span
            key={`${index}-${itemIndex}`}
            className="h-px w-[18px] bg-[#ccd5db]"
            style={{ marginLeft: lineOffset }}
          />
        ))}
      </div>
      <span className="w-[16px] text-right text-xs leading-3">{index}</span>
    </div>
  );
}

function FixedRail() {
  const menuItems = [
    { lines: [0, 20, 0], index: "02" },
    { lines: [20, 0, 12], index: "03" },
    { lines: [12, 0, 20], index: "04" },
    { lines: [0], index: "05" },
  ];

  return (
    <aside
      className="pointer-events-auto absolute top-[108px] z-20 h-[512px] w-[220px]"
      style={{ right: 20 }}
    >
      <div className="relative flex h-[106px] w-full items-center overflow-hidden rounded-[20px] pl-8">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${BG_IMAGE_PATH})` }}
        />
        <div className="absolute inset-0 bg-[#343030]/65" />
        <span className="relative text-[15px] leading-[21px]">Main</span>
        <span className="absolute right-5 w-[16px] text-right text-xs leading-3">01</span>
      </div>

      <div className="absolute flex w-[108px] flex-col gap-[60px]" style={{ right: 20, top: 136 }}>
        {menuItems.map((item) => (
          <MenuBlock key={item.index} lines={item.lines} index={item.index} />
        ))}
      </div>
    </aside>
  );
}

function Floor2Card({ card }: { card: Floor2CardData }) {
  const isLeft = card.align === "left";
  const left = isLeft ? 0 : FLOOR2_CARDS_WIDTH - FLOOR2_CARD_WIDTH;

  return (
    <div className="absolute" style={{ top: card.top, left }}>
      <article
        className="relative flex w-[580px] flex-col items-center gap-20 overflow-hidden rounded-[70px] bg-white/0 pt-[120px] pb-20 backdrop-blur-[150px]"
        style={{
          height: FLOOR2_CARD_HEIGHT,
          paddingLeft: card.paddingX,
          paddingRight: card.paddingX,
        }}
      >
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs leading-3 text-white">
          {card.id}
        </div>

        <div className="relative flex w-full flex-col items-start gap-5">
          <h3 className="w-full text-center text-xl leading-[26px]">{card.title}</h3>
          <p className="w-full text-center text-[15px] leading-[21px]">{card.description}</p>
        </div>

        <div className="relative h-[130px] w-[130px] bg-[#d9d9d9]" />
        <div className="relative w-full text-right text-base leading-5 uppercase">{card.id}</div>
      </article>
    </div>
  );
}

function Floor3Icon({ variant }: { variant: Floor3Block["iconVariant"] }) {
  if (variant === "chart") {
    return (
      <div className="relative h-8 w-8 rounded-full bg-white/20">
        <span className="absolute left-2.5 bottom-[9px] h-3 w-1 rounded-sm bg-white/90" />
        <span className="absolute left-[14px] bottom-[9px] h-[7px] w-1 rounded-sm bg-white/70" />
        <span className="absolute left-[18px] bottom-[9px] h-4 w-1 rounded-sm bg-white/90" />
      </div>
    );
  }

  if (variant === "review") {
    return (
      <div className="relative h-8 w-8 rounded-full bg-white/20">
        <span className="absolute left-[9px] top-[9px] h-0.5 w-3.5 bg-white/90" />
        <span className="absolute left-[9px] top-[14px] h-0.5 w-4.5 bg-white/90" />
        <span className="absolute left-[9px] top-[19px] h-0.5 w-2.5 bg-white/90" />
      </div>
    );
  }

  if (variant === "clear") {
    return (
      <div className="relative h-8 w-8 rounded-full bg-white/20">
        <span className="absolute left-[9px] top-[16px] h-0.5 w-4 bg-white/90 rotate-45 origin-left" />
        <span className="absolute left-[12px] top-[18px] h-0.5 w-8 bg-white/90 -rotate-45 origin-left" />
      </div>
    );
  }

  return (
    <div className="relative h-8 w-8 rounded-full bg-white/20">
      <span className="absolute inset-0 m-auto h-3 w-3 rounded-full border border-white/90" />
      <span className="absolute left-1/2 top-[6px] h-1.5 w-0.5 -translate-x-1/2 bg-white/90" />
    </div>
  );
}

function Floor3StatBlock({ block }: { block: Floor3Block }) {
  return (
    <article className="w-[580px] rounded-[70px] bg-white/0 px-[60px] pt-[52px] pb-5 backdrop-blur-[150px]">
      <div className="flex flex-col items-center gap-16">
        <div className="flex w-full items-center gap-3">
          <Floor3Icon variant={block.iconVariant} />
        </div>

        <div className="relative w-full pr-5">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-end gap-1">
              <div className="text-center text-[35px] leading-10 font-medium">{block.value}</div>
              <div className="text-right text-[15px] leading-[21px]">{block.unit}</div>
            </div>
            <div className="w-full text-center text-[15px] leading-[21px] opacity-70">{block.label}</div>
          </div>

          <button
            type="button"
            className="absolute top-[17px] right-0 inline-flex items-center justify-center rounded-[70px] bg-[#d9d9d9]/20 px-6 py-3 text-[15px] leading-[21px]"
          >
            More +
          </button>
        </div>

        <div className="h-[60px] w-[60px] bg-[#d9d9d9]" />
      </div>
    </article>
  );
}

function Floor2PinnedLayer({
  cardsTranslateY,
  renderStatic = true,
  renderCards = true,
}: {
  cardsTranslateY: number;
  renderStatic?: boolean;
  renderCards?: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {renderStatic ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${FLOOR2_BG_IMAGE_PATH})` }}
          />

          <div className="absolute left-10 z-10" style={{ top: FLOOR2_HEAD_TOP }}>
            <div className="w-[1869px] inline-flex flex-col items-start justify-start gap-[9px]">
              <div className="self-stretch text-[25px] font-black leading-[30.13px] text-white font-['Orbitron']">
                ISE /
              </div>
              <div className="flex flex-col gap-0 -mt-[16px]">
                <div className="relative inline-flex w-full items-end justify-start">
                  <div
                    className="flex items-center justify-center gap-2.5"
                    style={{ paddingLeft: columnStart(2) - columnStart(1) }}
                  >
                    <div className="text-[31px] font-medium leading-10 text-white font-['ABC_Favorit_CYR_Variable_Unlicensed_Trial']">
                      Reach the market faster through
                    </div>
                  </div>
                  <div
                    className="absolute text-xs font-medium leading-[21px] text-white font-['ABC_Favorit_CYR_Variable_Unlicensed_Trial']"
                    style={{ left: columnStart(6) - columnStart(1), bottom: 0 }}
                  >
                    How we work:
                  </div>
                </div>
                <div className="inline-flex w-full items-center justify-start gap-10">
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="text-[31px] font-medium leading-10 text-white font-['ABC_Favorit_CYR_Variable_Unlicensed_Trial']">
                      Smarter Collaboration.
                    </div>
                  </div>
                  <div className="text-center text-xl font-medium leading-[21px] text-white font-['Helvetica_Now_Text_']">
                    01
                  </div>
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="text-[31px] font-medium leading-10 text-white font-['ABC_Favorit_CYR_Variable_Unlicensed_Trial']">
                      Move past high-level insights to evaluate infringement exposure,
                    </div>
                  </div>
                </div>
                <div className="text-[31px] font-medium leading-10 text-white font-['ABC_Favorit_CYR_Variable_Unlicensed_Trial']">
                  align every stakeholder effortlessly, and shorten your path to launch.
                </div>
              </div>
            </div>
          </div>

          <div
            className="absolute left-1/2 z-10 -translate-x-1/2 text-center text-xs leading-[21px] font-medium opacity-50"
            style={{ top: FLOOR2_SCROLL_Y }}
          >
            scroll
          </div>

          <GridOverlay />
        </>
      ) : null}

      {renderCards ? (
        <div
          className="absolute z-30 h-[2822px] w-[1216px]"
          style={{
            left: FLOOR2_CARDS_LEFT,
            top: FLOOR2_CARDS_TOP,
            transform: `translateY(${cardsTranslateY}px)`,
            willChange: "transform",
          }}
        >
          {floor2Cards.map((card) => (
            <Floor2Card key={card.id} card={card} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

type Floor3PinnedLayerProps = {
  blocksTranslateY: number;
  row1: Floor3Block[];
  row2: Floor3Block[];
  row3: Floor3Block[];
  trackRef: RefObject<HTMLDivElement | null>;
  renderStatic?: boolean;
  renderCards?: boolean;
};

function Floor3PinnedLayer({
  blocksTranslateY,
  row1,
  row2,
  row3,
  trackRef,
  renderStatic = true,
  renderCards = true,
  }: Floor3PinnedLayerProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {renderStatic ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${FLOOR3_BG_IMAGE_PATH})` }}
          />
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute z-10" style={{ top: FLOOR3_HEAD_TOP, left: FLOOR3_TEXT_LEFT, width: FLOOR3_TEXT_WIDTH }}>
            <div data-layer="Frame 2147229615" className="relative h-[220px] w-full -mt-[16px]">
              <div
                data-layer="ISE /"
                className="justify-start text-white text-[25px] font-black leading-[30.13px]"
                style={{ fontFamily: "Orbitron, var(--font-sans)" }}
              >
                ISE /
              </div>
              <p
                data-layer="Accelerated progress,"
                className="absolute text-white text-[31px] font-medium leading-10"
                style={{ left: FLOOR3_ACCELERATED_LEFT, top: FLOOR3_ACCELERATED_TOP }}
              >
                Accelerated progress,
              </p>
              <p
                data-layer="Where we are thrive:"
                className="absolute text-white text-xs font-medium leading-[21px]"
                style={{ left: FLOOR3_KICKER_LEFT, top: FLOOR3_KICKER_TOP }}
              >
                Where we are thrive:
              </p>
              <p
                data-layer="Lowered risk."
                className="absolute text-white text-[31px] font-medium leading-10"
                style={{ top: FLOOR3_LOWERED_TOP }}
              >
                Lowered risk.
              </p>
              <p
                data-layer="02"
                className="absolute text-center text-white text-xl font-medium leading-[21px]"
                style={{ left: FLOOR3_INDEX_LEFT, top: FLOOR3_INDEX_TOP }}
              >
                02
              </p>
              <p
                data-layer="Our mission is to set the benchmark for digital patent clearance management—"
                className="absolute whitespace-nowrap text-white text-[31px] font-medium leading-10"
                style={{ top: FLOOR3_MISSION_TOP, left: FLOOR3_MISSION_LEFT, width: FLOOR3_MISSION_WIDTH }}
              >
                Our mission is to set the benchmark for digital patent clearance management—
              </p>
              <p
                data-layer="enabling faster product launches while minimizing infringement exposure through an end-to-end"
                className="absolute text-white text-[31px] font-medium leading-10"
                style={{ top: FLOOR3_LINE3_TOP, width: FLOOR3_LINE34_WIDTH }}
              >
                enabling faster product launches while minimizing infringement exposure through an end-to-end
              </p>
              <p
                data-layer="patent analysis and workflow platform."
                className="absolute text-white text-[31px] font-medium leading-10"
                style={{ top: FLOOR3_LINE4_TOP, width: FLOOR3_LINE34_WIDTH }}
              >
                patent analysis and workflow platform.
              </p>
            </div>
          </div>

          <div
            className="absolute left-1/2 z-10 -translate-x-1/2 text-center text-xs leading-[21px] font-medium opacity-50"
            style={{ top: FLOOR3_SCROLL_Y }}
          >
            scroll
          </div>

          <GridOverlay />
        </>
      ) : null}

      {renderCards ? (
        <div
          ref={trackRef}
          className="absolute z-30 w-[1210px]"
          style={{
            left: FLOOR3_BLOCKS_LEFT,
            top: FLOOR3_BLOCKS_TOP,
            transform: `translateY(${blocksTranslateY}px)`,
            willChange: "transform",
          }}
        >
          <div className="flex flex-col" style={{ gap: FLOOR3_BLOCK_ROW_GAP }}>
            <div className="flex justify-end">
              {row1.map((block) => (
                <Floor3StatBlock key={block.id} block={block} />
              ))}
            </div>

            <div className="flex justify-between">
              {row2.map((block) => (
                <Floor3StatBlock key={block.id} block={block} />
              ))}
            </div>

            <div className="flex justify-start">
              {row3.map((block) => (
                <Floor3StatBlock key={block.id} block={block} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Floor4QuoteCard({ card }: { card: Floor4QuoteCardData }) {
  const isLeft = card.align === "left";

  return (
    <article className="w-[580px] rounded-[70px] bg-white/0 p-20 backdrop-blur-[150px]">
      <div className={`flex flex-col gap-[120px] ${isLeft ? "items-start" : "items-center"}`}>
        <p className="w-[420px] text-white text-xl leading-[26px]">
          {card.quoteLines.map((line, index) => (
            <span key={`${card.id}-quote-${index}`}>
              {line}
              {index < card.quoteLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>

        <div className="inline-flex w-full justify-end items-center gap-2.5">
          <div className="h-40 w-[120px] bg-[#d9d9d9]" />
        </div>

        <div className="flex w-full flex-col items-center gap-3">
          <div className="text-center text-[15px] leading-[17px]">{card.name}</div>
          <div className="opacity-75 text-center text-[15px] leading-[17px]">
            {card.companyLines.map((line, index) => (
              <span key={`${card.id}-company-${index}`}>
                {line}
                {index < card.companyLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

type Floor4PinnedLayerProps = {
  blocksTranslateY: number;
  row1: Floor4QuoteCardData[];
  row2: Floor4QuoteCardData[];
  row3: Floor4QuoteCardData[];
  trackRef: RefObject<HTMLDivElement | null>;
  renderStatic?: boolean;
  renderCards?: boolean;
};

function Floor4PinnedLayer({
  blocksTranslateY,
  row1,
  row2,
  row3,
  trackRef,
  renderStatic = true,
  renderCards = true,
}: Floor4PinnedLayerProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {renderStatic ? (
        <>
          <div
            className="absolute inset-0 bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${FLOOR4_BG_PRIMARY}), url(${FLOOR3_BG_IMAGE_PATH})`,
              backgroundSize: "cover, cover",
              backgroundPosition: "center, center",
              backgroundRepeat: "no-repeat, no-repeat",
            }}
          />
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute left-10 z-10" style={{ top: FLOOR4_HEAD_TOP, width: FLOOR4_DESCRIPTION_WIDTH }}>
            <div className="flex flex-col gap-0">
              <div
                className="text-white text-[25px] font-black leading-[30.13px]"
                style={{ fontFamily: "Orbitron, var(--font-sans)" }}
              >
                ISE /
              </div>

              <div className="-mt-[16px] flex flex-col gap-0">
                <div className="relative inline-flex w-full items-end justify-start">
                  <div className="pl-[156px] flex justify-center items-center gap-2.5">
                    <div className="text-white text-[31px] font-medium leading-10">Reliable Intelligence</div>
                  </div>
                  <div
                    className="absolute text-white text-xs font-medium leading-[21px]"
                    style={{ left: columnStart(6) - columnStart(1), bottom: 0 }}
                  >
                    What our customers are saying:
                  </div>
                </div>

                <div className="inline-flex w-full justify-start items-center gap-10">
                  <div className="flex justify-center items-center gap-2.5">
                    <div className="text-white text-[31px] font-medium leading-10">Demonstrated Impact.</div>
                  </div>
                  <div className="text-center text-white text-xl font-medium leading-[21px]">03</div>
                  <div className="flex justify-center items-center gap-2.5">
                    <div className="text-white text-[31px] font-medium leading-10">
                      Leading companies rely on our platform to speed up product launches
                    </div>
                  </div>
                </div>

                <div className="text-white text-[31px] font-medium leading-10">
                  and reduce infringement exposure. Hear firsthand how they achieve faster market entry with <br />
                  complete confidence.
                </div>
              </div>
            </div>
          </div>

          <div
            className="absolute z-10 opacity-50 text-center text-white text-xs font-medium leading-[21px]"
            style={{ left: 946, top: FLOOR4_SCROLL_Y }}
          >
            scroll
          </div>

          <GridOverlay />
        </>
      ) : null}

      {renderCards ? (
        <div
          ref={trackRef}
          className="absolute z-30 w-[1210px]"
          style={{
            left: FLOOR4_BLOCKS_LEFT,
            top: FLOOR4_BLOCKS_TOP,
            transform: `translateY(${blocksTranslateY}px)`,
            willChange: "transform",
          }}
        >
          <div className="inline-flex w-[1210px] flex-col justify-center items-center" style={{ gap: FLOOR4_BLOCK_ROW_GAP }}>
            <div className="inline-flex w-full justify-end items-center gap-3">
              {row1.map((card) => (
                <Floor4QuoteCard key={card.id} card={card} />
              ))}
            </div>
            <div className="inline-flex w-full justify-start items-center gap-3">
              {row2.map((card) => (
                <Floor4QuoteCard key={card.id} card={card} />
              ))}
            </div>
            <div className="inline-flex w-full justify-end items-center gap-3">
              {row3.map((card) => (
                <Floor4QuoteCard key={card.id} card={card} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Floor5Field({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <label className={`inline-flex flex-col items-start gap-4 ${className}`}>
      <span className="text-[15px] leading-5 text-white">{label}</span>
      <span className="block h-px w-full bg-white" aria-hidden="true" />
    </label>
  );
}

function Floor5PinnedLayer({
  formTranslateY,
  trackRef,
}: {
  formTranslateY: number;
  trackRef: RefObject<HTMLFormElement | null>;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${FLOOR5_BG_PRIMARY})` }}
      />
      <div className="absolute inset-0 bg-black/35" />

      <div
        className="absolute z-10 flex flex-col items-start gap-2"
        style={{
          left: FLOOR5_DESCRIPTION_LEFT,
          top: FLOOR5_HEAD_TOP,
          width: FLOOR5_DESCRIPTION_WIDTH,
        }}
      >
        <div
          className="self-stretch text-[25px] font-black leading-[30.13px] text-white"
          style={{ fontFamily: "Orbitron, var(--font-sans)" }}
        >
          ISE /
        </div>

        <div className="flex flex-col items-start gap-4 -mt-[16px]">
          <div className="relative h-[120px] w-full">
            <div className="absolute left-0 top-0 h-10 w-full">
              <div className="relative inline-flex h-full w-full items-end overflow-visible">
                <div className="flex items-center justify-center gap-3 pl-[156px]">
                  <div className="whitespace-nowrap text-[31px] font-medium leading-10 text-white">
                    Every day, thousands of professionals
                  </div>
                </div>
                <div
                  className="absolute inline-block w-fit whitespace-nowrap text-xs font-medium leading-[21px] text-white"
                  style={{ left: columnStart(6) - columnStart(1), bottom: 0 }}
                >
                  Contact us:
                </div>
              </div>
            </div>

            <div className="absolute left-0 top-10 h-10 w-full">
              <div className="inline-flex h-full w-full flex-nowrap items-end gap-10 overflow-visible">
                <div className="flex items-center justify-center gap-3">
                  <div className="whitespace-nowrap text-[31px] font-medium leading-10 text-white">worldwide</div>
                </div>

                <div className="flex items-center justify-center gap-3 rounded-full bg-white/0 px-7 py-3 backdrop-blur-[200px] shrink-0 translate-y-[2px]">
                  <div className="text-center text-[15px] leading-5 text-white">+1 (650) 308-8351</div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="whitespace-nowrap text-[31px] font-medium leading-10 text-white">
                    rely on Nova ISE to coordinate product clearance, freedom-to-operate
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute left-0 top-20 h-10 w-full whitespace-nowrap text-[31px] font-medium leading-10 text-white">
              reviews, and patent risk analysis collaboratively.
            </div>
          </div>

          <a
            href="mailto:info@clearstoneip.com"
            className="inline-flex items-center justify-center gap-3 rounded-full px-7 py-3 text-center text-[15px] leading-5 text-white outline outline-1 -outline-offset-1 outline-white"
          >
            info@clearstoneip.com
          </a>
        </div>
      </div>

      <form
        ref={trackRef}
        className="absolute z-10 flex flex-col items-center gap-[100px] rounded-[70px] bg-white/0 px-[120px] pt-[100px] pb-[52px] backdrop-blur-[150px]"
        style={{
          left: FLOOR5_FORM_LEFT,
          top: FLOOR5_FORM_TOP,
          transform: `translateY(${formTranslateY}px)`,
          willChange: "transform",
          width: FLOOR5_FORM_WIDTH,
        }}
      >
        <div className="flex flex-col items-start gap-[52px]">
          <div className="inline-flex items-center gap-12">
            <Floor5Field label="First name" className="w-[266px]" />
            <Floor5Field label="Last name" className="w-[266px]" />
          </div>

          <div className="inline-flex items-center gap-12">
            <Floor5Field label="Your email" className="w-[266px]" />
            <Floor5Field label="Organisation" className="w-[266px]" />
          </div>

          <Floor5Field label="How can we help you" className="w-[580px]" />
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-3 rounded-full bg-[#FFFFFF]/[0.01] px-7 py-3 text-center text-[15px] leading-5 text-white backdrop-blur-[400px]"
        >
          Send message
        </button>
      </form>

      <GridOverlay />
    </div>
  );
}

export default function Home() {
  const { scale, offsetX, offsetY, viewportHeight } = useArtboardScale();
  const scrollY = usePageScrollY();
  const floor3TrackRef = useRef<HTMLDivElement | null>(null);
  const floor4TrackRef = useRef<HTMLDivElement | null>(null);
  const floor5FormRef = useRef<HTMLFormElement | null>(null);
  const floor3TrackHeight = useMeasuredHeight(floor3TrackRef, 1300);
  const floor4TrackHeight = useMeasuredHeight(floor4TrackRef, 1300);
  const floor5FormHeight = useMeasuredHeight(floor5FormRef, 600);

  const pinnedViewportHeight = viewportHeight / scale;
  const viewTopInArtboard = Math.max((scrollY - offsetY) / scale, 0);
  const floor2BottomOffsetArtboard = FLOOR2_TRANSITION_OFFSET_SCREEN_PX / scale;
  const floor3BottomOffsetArtboard = FLOOR3_BOTTOM_OFFSET_SCREEN_PX / scale;
  const floor4BottomOffsetArtboard = FLOOR4_BOTTOM_OFFSET_SCREEN_PX / scale;
  const floor5BottomOffsetArtboard = FLOOR5_BOTTOM_OFFSET_SCREEN_PX / scale;
  const floor2TargetBottom = pinnedViewportHeight - floor2BottomOffsetArtboard;
  const floor3TargetBottom = pinnedViewportHeight - floor3BottomOffsetArtboard;
  const floor4TargetBottom = pinnedViewportHeight - floor4BottomOffsetArtboard;
  const floor5TargetBottom = pinnedViewportHeight - floor5BottomOffsetArtboard;
  const floor2PinScrollRange = Math.max(
    FLOOR2_CARDS_TOP + FLOOR2_CARDS_HEIGHT - floor2TargetBottom,
    0,
  );
  const floor3PinScrollRange = Math.max(
    FLOOR3_BLOCKS_TOP + floor3TrackHeight - floor3TargetBottom,
    0,
  );
  const floor4PinScrollRange = Math.max(
    FLOOR4_BLOCKS_TOP + floor4TrackHeight - floor4TargetBottom,
    0,
  );
  const floor5PinScrollRange = Math.max(
    FLOOR5_FORM_TOP + floor5FormHeight - floor5TargetBottom,
    0,
  );
  const floor1Height = viewportHeight / scale;
  const floor2Area = pinnedViewportHeight + floor2PinScrollRange;
  const floor3Area = pinnedViewportHeight + floor3PinScrollRange;
  const floor4Area = pinnedViewportHeight + floor4PinScrollRange;
  const floor5Area = pinnedViewportHeight + floor5PinScrollRange;
  const floor2Start = floor1Height;
  const floor3Start = floor2Start + floor2Area;
  const floor4Start = floor3Start + floor3Area;
  const floor5Start = floor4Start + floor4Area;
  const floor2ShellOffset = clamp(
    viewTopInArtboard - floor2Start,
    0,
    floor2PinScrollRange,
  );
  const floor3ShellOffset = clamp(
    viewTopInArtboard - floor3Start,
    0,
    floor3PinScrollRange,
  );
  const floor4ShellOffset = clamp(
    viewTopInArtboard - floor4Start,
    0,
    floor4PinScrollRange,
  );
  const floor5ShellOffset = clamp(
    viewTopInArtboard - floor5Start,
    0,
    floor5PinScrollRange,
  );
  const totalArtboardHeight = floor1Height + floor2Area + floor3Area + floor4Area + floor5Area;
  const scaledContentBottom = offsetY + totalArtboardHeight * scale;
  const pageHeight = Math.max(viewportHeight, scaledContentBottom + VIEWPORT_TOP_OFFSET);
  const cardsTranslateY = -floor2ShellOffset;
  const floor3BlocksTranslateY = -floor3ShellOffset;
  const floor4BlocksTranslateY = -floor4ShellOffset;
  const floor5FormTranslateY = -floor5ShellOffset;

  const contentRightEdge = columnStart(11) - GRID_GUTTER;
  const contentWidth = contentRightEdge - columnStart(1);
  const iseLineHeight = 30.13;
  const headingTop = iseLineHeight - 16;
  const headingLineHeight = 40;
  const transformedRight = 330;
  const novaStart = columnStart(5) - columnStart(1);
  const getStartedCenterX = transformedRight + (novaStart - transformedRight) / 2;
  const rowTwoTop = headingTop + headingLineHeight;
  const getStartedTop = rowTwoTop + headingLineHeight / 2 - 24;
  const aboutUsTop = headingTop + 16;
  const requestDemoTop = headingTop + 120 + headingLineHeight + 12;
  const floor3Row1 = floor3Blocks.filter((block) => block.row === 1);
  const floor3Row2 = floor3Blocks.filter((block) => block.row === 2);
  const floor3Row3 = floor3Blocks.filter((block) => block.row === 3);
  const floor4Row1 = floor4QuoteCards.filter((card) => card.id === "01");
  const floor4Row2 = floor4QuoteCards.filter((card) => card.id === "02");
  const floor4Row3 = floor4QuoteCards.filter((card) => card.id === "03");

  return (
    <main className="relative w-full bg-black text-white" style={{ minHeight: pageHeight }}>
      <div className="relative w-full" style={{ height: pageHeight }}>
        <div
          className="absolute left-0 w-[1920px] origin-top-left"
          style={{
            top: offsetY,
            transform: `translate3d(${offsetX}px, 0, 0) scale(${scale})`,
          }}
        >
          <section className="relative overflow-hidden bg-[#515151]" style={{ height: floor1Height }}>
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${BG_IMAGE_PATH})` }}
            />
            <div className="absolute inset-0 z-0 bg-[#515151]/55" />

            <nav className="absolute top-5 left-10 z-20 inline-flex items-center gap-8 text-[15px] leading-5">
              <a href="#" className="underline">
                Inst
              </a>
              <a href="#" className="underline">
                TikTok
              </a>
              <a href="#" className="underline">
                YouTube
              </a>
            </nav>

            <section
              className="absolute top-[120px] z-20 h-[280px]"
              style={{ left: columnStart(1), width: contentWidth }}
            >
              <div
                className="text-[25px] leading-[30.13px] font-black"
                style={{ fontFamily: "Orbitron, var(--font-sans)" }}
              >
                ISE /
              </div>

              <p
                className="absolute text-xs leading-[21px] font-medium"
                style={{ top: aboutUsTop, left: columnStart(6) - columnStart(1) }}
              >
                About us:
              </p>

              <button
                type="button"
                className="absolute inline-flex items-center justify-center gap-3 rounded-full bg-black/20 px-7 py-3 text-center text-[15px] leading-5"
                style={{
                  top: getStartedTop + 4,
                  left: getStartedCenterX - 24,
                  transform: "translateX(-50%)",
                }}
              >
                Get started for free
              </button>

              <div
                className="absolute left-0 h-[160px] w-full text-[31px] leading-10 font-medium"
                style={{ top: headingTop }}
              >
                <p className="absolute top-0 whitespace-nowrap" style={{ left: columnStart(2) - columnStart(1) }}>
                  Patent Clearance Management,
                </p>
                <div className="absolute top-10 w-full whitespace-nowrap">
                  <span>Digitally Transformed.</span>
                  <span
                    className="absolute top-0 whitespace-nowrap"
                    style={{ left: columnStart(5) - columnStart(1) - 44 }}
                  >
                    Nova ISE, now with ground-breaking AI capabilities, simplifies
                  </span>
                </div>
                <p className="absolute top-20 whitespace-nowrap">
                  and empowers the patent clearance process, streamlining freedom to operate
                  assessments and
                </p>
                <p className="absolute top-[120px] whitespace-nowrap">
                  reducing time-to-market for innovative products
                </p>
              </div>

              <Link
                href="/cases"
                className="absolute inline-flex items-center justify-center rounded-full px-7 py-3 text-center text-[15px] leading-5 outline outline-1 -outline-offset-1 outline-white"
                style={{ top: requestDemoTop, left: 0 }}
              >
                Request demo
              </Link>
            </section>

            <div className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2 text-xs leading-[21px] font-medium opacity-50">
              scroll
            </div>

            <GridOverlay />
          </section>

          <section className="relative overflow-hidden bg-black" style={{ height: floor2Area }}>
            <div
              className="absolute left-0 top-0 w-full"
              style={{
                height: pinnedViewportHeight,
                transform: `translateY(${floor2ShellOffset}px)`,
              }}
            >
              <div className="relative h-full w-full">
                <Floor2PinnedLayer cardsTranslateY={cardsTranslateY} />
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-black" style={{ height: floor3Area }}>
            <div
              className="absolute left-0 top-0 w-full"
              style={{
                height: pinnedViewportHeight,
                transform: `translateY(${floor3ShellOffset}px)`,
              }}
            >
              <div className="relative h-full w-full">
                <Floor3PinnedLayer
                  blocksTranslateY={floor3BlocksTranslateY}
                  row1={floor3Row1}
                  row2={floor3Row2}
                  row3={floor3Row3}
                  trackRef={floor3TrackRef}
                />
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-black" style={{ height: floor4Area }}>
            <div
              className="absolute left-0 top-0 w-full"
              style={{
                height: pinnedViewportHeight,
                transform: `translateY(${floor4ShellOffset}px)`,
              }}
            >
              <div className="relative h-full w-full">
                <Floor4PinnedLayer
                  blocksTranslateY={floor4BlocksTranslateY}
                  row1={floor4Row1}
                  row2={floor4Row2}
                  row3={floor4Row3}
                  trackRef={floor4TrackRef}
                />
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-black" style={{ height: floor5Area }}>
            <div
              className="absolute left-0 top-0 w-full"
              style={{
                height: pinnedViewportHeight,
                transform: `translateY(${floor5ShellOffset}px)`,
              }}
            >
              <div className="relative h-full w-full">
                <Floor5PinnedLayer
                  formTranslateY={floor5FormTranslateY}
                  trackRef={floor5FormRef}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      <div
        className="pointer-events-none fixed left-0 z-40 w-[1920px] origin-top-left"
        style={{
          top: offsetY,
          transform: `translate3d(${offsetX}px, 0, 0) scale(${scale})`,
        }}
      >
        <FixedRail />
      </div>
    </main>
  );
}
