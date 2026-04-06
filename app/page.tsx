"use client";

import Link from "next/link";
import {
  type ChangeEvent,
  type FormEvent,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
const FLOOR2_CARD_HEIGHT = 760;
const FLOOR2_CARD_WIDTH = 580;
const FLOOR2_CARDS_WIDTH = 1216;
const FLOOR2_CARDS_LEFT = (ARTBOARD_WIDTH - FLOOR2_CARDS_WIDTH) / 2;
const FLOOR2_CARDS_HEIGHT = 3382;
const FLOOR2_COMPACT_CARDS_WIDTH = 365;
const FLOOR2_ICON_TOP = 120;
const FLOOR2_ICON_SIZE = 32;
const FLOOR2_ICON_TO_TEXT_GAP = 120;
const FLOOR2_TEXT_TO_IMAGE_GAP = 60;
const FLOOR2_IMAGE_SIZE = 130;
const FLOOR2_IMAGE_TO_NUMBER_GAP = 60;
const FLOOR2_NUMBER_BOTTOM = 80;
const FLOOR2_NUMBER_LINE_HEIGHT = 20;
const FLOOR2_TRANSITION_OFFSET_SCREEN_PX = 40;
const FLOOR3_HEAD_TOP = 80;
const FLOOR3_BLOCKS_TOP = 320;
const FLOOR3_SCROLL_Y = 1052;
const FLOOR3_BLOCKS_WIDTH = 1210;
const FLOOR3_BLOCKS_LEFT = (ARTBOARD_WIDTH - FLOOR3_BLOCKS_WIDTH) / 2;
const FLOOR3_COMPACT_BLOCKS_WIDTH = 365;
const FLOOR3_BLOCK_ROW_GAP = 40;
const FLOOR3_BOTTOM_OFFSET_SCREEN_PX = 40;
const FLOOR4_BG_PRIMARY = "/BG_04.png";
const FLOOR4_HEAD_TOP = 80;
const FLOOR4_BLOCKS_TOP = 320;
const FLOOR4_SCROLL_Y = 1052;
const FLOOR4_BLOCKS_WIDTH = 1210;
const FLOOR4_BLOCKS_LEFT = (ARTBOARD_WIDTH - FLOOR4_BLOCKS_WIDTH) / 2;
const FLOOR4_COMPACT_CARDS_WIDTH = 365;
const FLOOR4_BLOCK_ROW_GAP = 12;
const FLOOR4_BOTTOM_OFFSET_SCREEN_PX = 40;
const FLOOR4_DESCRIPTION_WIDTH = 1869;
const FLOOR5_BG_PRIMARY = "/BG_05.png";
const FLOOR5_DESCRIPTION_WIDTH = 1868;
const FLOOR5_FORM_WIDTH = 896;
const FLOOR5_COMPACT_FORM_WIDTH = 580;

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
  iconSrc: string;
  imageSrc: string;
};

type Floor2CompactCardData = {
  id: string;
  title: string;
  contentGapClassName: string;
  iconSrc: string;
};

type Floor3Block = {
  id: string;
  value: string;
  unit: string;
  label: string;
  align: "left" | "right";
  iconVariant: "chart" | "review" | "clear" | "time";
  row: 1 | 2 | 3;
  imageSrc: string;
};

type Floor3CompactBlockData = {
  id: Floor3Block["id"];
  value: string;
  unit?: string;
  label: string;
  textWidthClassName?: string;
  valueWeightClassName?: "font-medium" | "font-bold";
};

type Floor4QuoteCardData = {
  id: string;
  align: "left" | "right";
  quoteLines: string[];
  name: string;
  companyLines: string[];
  imageSrc: string;
};

type Floor4CompactCardData = {
  id: Floor4QuoteCardData["id"];
  name: string;
  companyLines: string[];
};

type FloorIndex = 1 | 2 | 3 | 4 | 5;
type FloorTransitionState = {
  id: number;
  direction: "up" | "down";
  from: FloorIndex;
  to: FloorIndex;
};
type MenuGroupStart = { floor: FloorIndex; startY: number };
type MenuLine = { left: number; top: number };
type Floor5FormState = {
  firstName: string;
  lastName: string;
  email: string;
  organisation: string;
  message: string;
};

const INITIAL_FLOOR5_FORM_STATE: Floor5FormState = {
  firstName: "",
  lastName: "",
  email: "",
  organisation: "",
  message: "",
};
const FLOOR5_COMPACT_FORM_FIELDS = [
  "First name",
  "Last name",
  "Your email",
  "Organisation",
  "How can we help you",
] as const;
const FLOOR5_COMPACT_FORM_CTA = "Send message";
const SHOW_GRID_OVERLAY = false;
const FLOOR4_LAST_TICK_OFFSET_IN_BLOCK_PX = 29;
const FLOOR4_TO_5_RELEASE_GAP_PX = 20;
// >1 means faster movement at the beginning of 4 -> 5, while still reaching 100% only at segment end.
const FLOOR4_TO_5_DRAG_ASSIST_CURVE = 1.5;
const FLOOR_TRANSITION_DURATION_MS = 620;
const FLOOR1_TO_2_TRIGGER_FROM_GROUP1_TOP_PX = 40;
const MENU_CONTAINER_TOP_IN_RAIL = 56;
const FLOOR1_TO_2_DRAG_ASSIST_CURVE = 0.78;
const DEFAULT_MENU_GROUP_STARTS: MenuGroupStart[] = [
  { floor: 1, startY: 56 },
  { floor: 2, startY: 136 },
  { floor: 3, startY: 196 },
  { floor: 4, startY: 256 },
  { floor: 5, startY: 387 },
];
const RAIL_MENU_ITEMS: Array<"01" | "02" | "03" | "04" | "05"> = ["01", "02", "03", "04", "05"];

const floor2Cards: Floor2CardData[] = [
  {
    id: "2",
    title: "Design around analysis",
    description:
      "An intelligent system automates complex patent data into structured claim charts with minimal effort. It extracts, maps, and formats claims, letting teams focus on interpretation.",
    align: "right",
    paddingX: 80,
    top: 0,
    iconSrc: "/materials/1-card.svg",
    imageSrc: "/card-pics/01.png",
  },
  {
    id: "1",
    title: "Legal, R&D, & Business all on the same page",
    description:
      "A single source of truth for patent clearance work means transparency and consistency without dangerous scattered communications.",
    align: "left",
    paddingX: 80,
    top: FLOOR2_CARD_HEIGHT + FLOOR2_CARD_GAP,
    iconSrc: "/materials/2-card.svg",
    imageSrc: "/card-pics/02.png",
  },
  {
    id: "4",
    title: "Automated Claim Chart Generation",
    description:
      "A streamlined solution transforms complex patent data into structured claim charts with minimal effort. It automates extraction, mapping, and formatting to help legal teams accelerate analysis and ensure consistency.",
    align: "right",
    paddingX: 60,
    top: (FLOOR2_CARD_HEIGHT + FLOOR2_CARD_GAP) * 2,
    iconSrc: "/materials/3-card.svg",
    imageSrc: "/card-pics/03.png",
  },
  {
    id: "3",
    title: "Specification Support Extraction",
    description:
      "Select a claim term and AI will process the specification to extract and summarize the most relevant portions that help define or explain the selected term, saving hours of detailed patent review.",
    align: "left",
    paddingX: 60,
    top: (FLOOR2_CARD_HEIGHT + FLOOR2_CARD_GAP) * 3,
    iconSrc: "/materials/4-card.svg",
    imageSrc: "/card-pics/04.png",
  },
];

const floor2IconSrcByTitle = floor2Cards.reduce<Record<string, string>>((mapping, card) => {
  mapping[card.title] = card.iconSrc;
  return mapping;
}, {});

const floor2CompactCards: Floor2CompactCardData[] = [
  {
    id: "01",
    title: "Legal, R&D, & Business all on the same page",
    contentGapClassName: "gap-12",
    iconSrc: floor2IconSrcByTitle["Legal, R&D, & Business all on the same page"] ?? floor2Cards[0].iconSrc,
  },
  {
    id: "02",
    title: "Design around analysis",
    contentGapClassName: "gap-[72px]",
    iconSrc: floor2IconSrcByTitle["Design around analysis"] ?? floor2Cards[0].iconSrc,
  },
  {
    id: "03",
    title: "Specification Support Extraction",
    contentGapClassName: "gap-12",
    iconSrc: floor2IconSrcByTitle["Specification Support Extraction"] ?? floor2Cards[0].iconSrc,
  },
  {
    id: "04",
    title: "Automated Claim Chart Generation",
    contentGapClassName: "gap-12",
    iconSrc: floor2IconSrcByTitle["Automated Claim Chart Generation"] ?? floor2Cards[0].iconSrc,
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
    imageSrc: "/card-pics/05.png",
  },
  {
    id: "03",
    value: "383",
    unit: "m.",
    label: "Total patents Reviewed",
    align: "left",
    iconVariant: "review",
    row: 2,
    imageSrc: "/card-pics/06.png",
  },
  {
    id: "02",
    value: "1700",
    unit: "m.",
    label: "Products cleared",
    align: "right",
    iconVariant: "clear",
    row: 2,
    imageSrc: "/card-pics/07.png",
  },
  {
    id: "04",
    value: "30",
    unit: "%.",
    label: "Average time Savings Per Review",
    align: "left",
    iconVariant: "time",
    row: 3,
    imageSrc: "/card-pics/08.png",
  },
];

const floor3CompactBlocks: Floor3CompactBlockData[] = [
  {
    id: "01",
    value: "320.10",
    unit: "m.",
    label: "Patent claims analyzed",
  },
  {
    id: "03",
    value: "383",
    label: "Total patents Reviewed",
    textWidthClassName: "w-[158px]",
  },
  {
    id: "02",
    value: "1700",
    label: "Products cleared",
    valueWeightClassName: "font-bold",
  },
  {
    id: "04",
    value: "30",
    unit: "%",
    label: "Average time Savings Per Review",
    textWidthClassName: "w-[226px]",
  },
];

const floor4QuoteCards: Floor4QuoteCardData[] = [
  {
    id: "01",
    align: "right",
    quoteLines: ["“It simply the best product on the market and I must have it.”"],
    name: "Sofia Navarro",
    companyLines: ["Medical Device Company"],
    imageSrc: "/card-pics/09.png",
  },
  {
    id: "02",
    align: "left",
    quoteLines: [
      "“The Clearstone FTO Platfrom makes the FTO process easy and intuitive. It enabled us to easily recall our notes, comments and",
      "earlier determinations regarding a previously searched reference which helped to ensure analysis quality and reduced the chance of missing a claim while saving considerable time in completing the analysis.",
    ],
    name: "Carlyn Burton",
    companyLines: ["Partner, Osha Bergman Watanabe", "& Burton, LLP"],
    imageSrc: "/card-pics/10.png",
  },
  {
    id: "03",
    align: "right",
    quoteLines: [
      "“Going back to FTO without Clearstone is a great eye opener for just how much more efficient FTO exercise is with Clearstone and that is before even considering the increased safety and quality.”",
    ],
    name: "Robert Miller",
    companyLines: ["Formerly at global sportswear company"],
    imageSrc: "/card-pics/11.png",
  },
];

const floor4CompactCards: Floor4CompactCardData[] = [
  {
    id: "01",
    name: "Sofia Navarro",
    companyLines: ["Medical Device Company"],
  },
  {
    id: "03",
    name: "Robert Miller",
    companyLines: ["Formerly at global sportswear company"],
  },
  {
    id: "02",
    name: "Carlyn Burton",
    companyLines: ["Partner, Osha Bergman Watanabe", "& Burton, LLP"],
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
const fractionalPart = (value: number) => Math.abs(value % 1);
const getPinScrollRange = (trackTop: number, trackHeight: number, targetBottom: number) =>
  Math.max(trackTop + trackHeight - targetBottom, 0);

function mapPiecewise(
  value: number,
  inputStops: readonly number[],
  outputStops: readonly number[],
): number {
  if (inputStops.length !== outputStops.length || inputStops.length < 2) {
    return value;
  }

  const lastIndex = inputStops.length - 1;
  const clampedValue = clamp(value, inputStops[0], inputStops[lastIndex]);

  for (let index = 1; index <= lastIndex; index += 1) {
    const inputStart = inputStops[index - 1];
    const inputEnd = inputStops[index];
    const outputStart = outputStops[index - 1];
    const outputEnd = outputStops[index];

    if (clampedValue <= inputEnd || index === lastIndex) {
      if (Math.abs(inputEnd - inputStart) < 0.0001) return outputEnd;
      const progress = (clampedValue - inputStart) / (inputEnd - inputStart);
      return outputStart + (outputEnd - outputStart) * progress;
    }
  }

  return outputStops[lastIndex];
}

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
  if (!SHOW_GRID_OVERLAY) return null;

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

function MenuLines({
  width,
  height,
  lines,
}: {
  width: number;
  height: number;
  lines: MenuLine[];
}) {
  return (
    <div aria-hidden="true" className="relative shrink-0" style={{ width, height }}>
      {lines.map((line, index) => (
        <div
          key={`${line.left}-${line.top}-${index}`}
          className="absolute flex h-[5px] w-[17px] -translate-y-1/2 items-center"
          style={{ left: line.left, top: line.top }}
        >
          <div className="h-px w-full bg-[#CCD5DB] transition-[height] duration-200 ease-out group-hover:h-[5px]" />
        </div>
      ))}
    </div>
  );
}

function MenuBlock({ index }: { index: "01" | "02" | "03" | "04" | "05" }) {
  const blockClassName = "self-stretch p-1";

  if (index === "01" || index === "05") {
    return (
      <div data-menu-floor={index} className={`${blockClassName} inline-flex items-center justify-between`}>
        <MenuLines width={18} height={2} lines={[{ left: 0, top: 1 }]} />
        <div className={`text-center text-xs text-white ${index === "01" ? "leading-[21px]" : "leading-3"}`}>{index}</div>
      </div>
    );
  }

  if (index === "02") {
    return (
      <div data-menu-floor={index} className={`${blockClassName} inline-flex items-start justify-between overflow-hidden`}>
        <MenuLines
          width={40}
          height={56}
          lines={[
            { left: 0, top: 1 },
            { left: 22, top: 19 },
            { left: 0, top: 37 },
            { left: 22, top: 55 },
          ]}
        />
        <div className="text-center text-xs leading-3 text-white">02</div>
      </div>
    );
  }

  if (index === "03") {
    return (
      <div data-menu-floor={index} className={`${blockClassName} inline-flex items-start justify-between overflow-hidden`}>
        <MenuLines
          width={40}
          height={44}
          lines={[
            { left: 22, top: 1 },
            { left: 22, top: 15 },
            { left: 0, top: 29 },
            { left: 0, top: 43 },
          ]}
        />
        <div className="text-center text-xs leading-3 text-white">03</div>
      </div>
    );
  }

  return (
    <div data-menu-floor={index} className={`${blockClassName} -mt-[20px] inline-flex items-start justify-between overflow-hidden`}>
      <MenuLines
        width={40}
        height={26}
        lines={[
          { left: 22, top: 1 },
          { left: 0, top: 13 },
          { left: 22, top: 25 },
        ]}
      />
      <div className="text-center text-xs leading-3 text-white">04</div>
    </div>
  );
}

const FLOOR_BG_BY_INDEX: Record<FloorIndex, string> = {
  1: BG_IMAGE_PATH,
  2: FLOOR2_BG_IMAGE_PATH,
  3: FLOOR3_BG_IMAGE_PATH,
  4: FLOOR4_BG_PRIMARY,
  5: FLOOR5_BG_PRIMARY,
};

function FixedRail({
  activeFloor,
  currentDraggerY,
  dragMinY,
  dragMaxY,
  onDragPositionChange,
  onMenuGroupStartsChange,
  onHoverChange,
}: {
  activeFloor: FloorIndex;
  currentDraggerY: number;
  dragMinY: number;
  dragMaxY: number;
  onDragPositionChange: (y: number) => void;
  onMenuGroupStartsChange?: (starts: MenuGroupStart[]) => void;
  onHoverChange?: (hovered: boolean) => void;
}) {
  const railRef = useRef<HTMLElement | null>(null);
  const draggerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pointerIsDownRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const pointerOffsetRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [draggerY, setDraggerY] = useState<number>(currentDraggerY);
  const [menuGroupStarts, setMenuGroupStarts] = useState<MenuGroupStart[]>(DEFAULT_MENU_GROUP_STARTS);
  // Initial local value is quickly replaced by controlled `currentDraggerY`.
  // Keep this as-is to avoid visual jump on first paint.

  useEffect(() => {
    const menuNode = menuRef.current;
    if (!menuNode) return;

    const measureMenuStarts = () => {
      const nextStarts = RAIL_MENU_ITEMS.map((item, index) => {
        const block = menuNode.querySelector<HTMLElement>(`[data-menu-floor="${item}"]`);
        return {
          floor: (index + 1) as FloorIndex,
          startY: MENU_CONTAINER_TOP_IN_RAIL + (block?.offsetTop ?? DEFAULT_MENU_GROUP_STARTS[index].startY - MENU_CONTAINER_TOP_IN_RAIL),
        };
      });

      setMenuGroupStarts((prev) => {
        const unchanged =
          prev.length === nextStarts.length &&
          prev.every(
            (item, index) =>
              item.floor === nextStarts[index].floor &&
              Math.abs(item.startY - nextStarts[index].startY) < 0.1,
          );
        return unchanged ? prev : nextStarts;
      });
    };

    measureMenuStarts();
    window.addEventListener("resize", measureMenuStarts);
    return () => {
      window.removeEventListener("resize", measureMenuStarts);
    };
  }, []);

  useEffect(() => {
    onMenuGroupStartsChange?.(menuGroupStarts);
  }, [menuGroupStarts, onMenuGroupStartsChange]);

  const floor4To5TriggerY = menuGroupStarts[3].startY + FLOOR4_LAST_TICK_OFFSET_IN_BLOCK_PX;
  const floor1To2TriggerY = menuGroupStarts[0].startY + FLOOR1_TO_2_TRIGGER_FROM_GROUP1_TOP_PX;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const railNode = railRef.current;
    const draggerNode = draggerRef.current;
    if (!railNode || !draggerNode) return;
    const railRect = railNode.getBoundingClientRect();
    const draggerRect = draggerNode.getBoundingClientRect();
    const railScale = railRect.height > 0 ? railNode.offsetHeight / railRect.height : 1;
    pointerOffsetRef.current = (event.clientY - draggerRect.top) * railScale;

    // Keep visual state unchanged on press.
    // Drag state starts only after actual pointer movement.
    pointerIsDownRef.current = true;
    activePointerIdRef.current = event.pointerId;
    setHasDragged(false);
    draggerNode.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerIsDownRef.current || activePointerIdRef.current !== event.pointerId) return;
    const railNode = railRef.current;
    if (!railNode) return;

    const railRect = railNode.getBoundingClientRect();
    const railScale = railRect.height > 0 ? railNode.offsetHeight / railRect.height : 1;
    const pointerLocalY = (event.clientY - railRect.top) * railScale;
    const nextY = clamp(pointerLocalY - pointerOffsetRef.current, dragMinY, dragMaxY);
    const moved = Math.abs(nextY - currentDraggerY) > 0.5;
    if (!hasDragged && !moved) return;

    if (!hasDragged) {
      setIsDragging(true);
      setHasDragged(true);
    }

    setDraggerY(nextY);
    onDragPositionChange(nextY);
  };

  const finishDrag = (pointerId: number) => {
    if (!pointerIsDownRef.current || activePointerIdRef.current !== pointerId) return;
    const draggerNode = draggerRef.current;
    if (draggerNode?.hasPointerCapture(pointerId)) {
      draggerNode.releasePointerCapture(pointerId);
    }

    pointerIsDownRef.current = false;
    activePointerIdRef.current = null;
    setIsDragging(false);
    setHasDragged(false);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    finishDrag(event.pointerId);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    finishDrag(event.pointerId);
  };

  const handleRailPointerEnter = () => {
    onHoverChange?.(true);
  };

  const handleRailPointerLeave = () => {
    onHoverChange?.(false);
  };

  const handleRailFocus = () => {
    onHoverChange?.(true);
  };

  const handleRailBlur = (event: React.FocusEvent<HTMLElement>) => {
    const nextFocusedNode = event.relatedTarget;
    if (nextFocusedNode instanceof Node && railRef.current?.contains(nextFocusedNode)) {
      return;
    }

    onHoverChange?.(false);
  };

  const shouldUseDragState = isDragging && hasDragged;
  const draggerYInView = shouldUseDragState ? draggerY : currentDraggerY;
  const draggerFloor: FloorIndex =
    activeFloor <= 1
      ? draggerYInView >= floor1To2TriggerY
        ? 2
        : 1
      : activeFloor <= 3
        ? activeFloor
        : draggerYInView >= floor4To5TriggerY
          ? 5
          : 4;
  const previewImage = FLOOR_BG_BY_INDEX[draggerFloor];
  const previewIndexLabel = String(draggerFloor).padStart(2, "0");
  const previewTitle =
    draggerFloor === 1
      ? "Main"
      : draggerFloor === 2
        ? "Feature"
        : draggerFloor === 3
          ? "Mission"
          : draggerFloor === 4
            ? "Clients"
            : "Contacts";

  return (
    <aside
      ref={railRef}
      className="group pointer-events-auto absolute top-[108px] z-20 h-[512px] w-[220px]"
      style={{ right: 20 }}
      onPointerEnter={handleRailPointerEnter}
      onPointerLeave={handleRailPointerLeave}
      onFocus={handleRailFocus}
      onBlur={handleRailBlur}
    >
      <div
        ref={draggerRef}
        role="slider"
        aria-label="Floor dragger"
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={draggerFloor}
        aria-valuetext={`Floor ${previewIndexLabel}`}
        tabIndex={0}
        className={`absolute left-0 z-20 w-full touch-none select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ top: draggerYInView }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div className="relative flex h-[106px] w-full items-center overflow-hidden rounded-[20px] pl-8">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${previewImage})` }}
          />
          <div className="absolute inset-0 bg-[#343030]/65" />
          <span className="relative text-[15px] leading-[21px]">{previewTitle}</span>
          <span className="absolute right-5 w-[16px] text-right text-xs leading-3">{previewIndexLabel}</span>
        </div>
      </div>

      <div
        ref={menuRef}
        className="absolute z-10 inline-flex w-[108px] flex-col items-start justify-start gap-[48px]"
        style={{ right: 20, top: MENU_CONTAINER_TOP_IN_RAIL }}
      >
        {RAIL_MENU_ITEMS.map((item) => (
          <MenuBlock key={item} index={item} />
        ))}
      </div>
    </aside>
  );
}

function Floor2Card({
  card,
  orderNumber,
}: {
  card: Floor2CardData;
  orderNumber: number;
}) {
  const isLeft = card.align === "left";
  const left = isLeft ? 0 : FLOOR2_CARDS_WIDTH - FLOOR2_CARD_WIDTH;

  return (
    <div className="absolute" style={{ top: card.top, left }}>
      <article
        className="relative w-[580px] overflow-hidden rounded-[70px] bg-white/0 backdrop-blur-[150px]"
        style={{
          height: FLOOR2_CARD_HEIGHT,
        }}
      >
        <div
          className="absolute left-1/2 flex items-center justify-center rounded-full bg-[#eeeeee]/20"
          style={{
            top: FLOOR2_ICON_TOP,
            width: FLOOR2_ICON_SIZE,
            height: FLOOR2_ICON_SIZE,
            transform: "translateX(-50%)",
          }}
        >
          <img
            src={card.iconSrc}
            alt=""
            aria-hidden="true"
            className="h-4 w-auto max-w-4 object-contain"
          />
        </div>

        <div
          className="absolute flex flex-col items-start gap-5"
          style={{
            top: FLOOR2_ICON_TOP + FLOOR2_ICON_SIZE + FLOOR2_ICON_TO_TEXT_GAP,
            left: card.paddingX,
            right: card.paddingX,
            bottom:
              FLOOR2_NUMBER_BOTTOM +
              FLOOR2_NUMBER_LINE_HEIGHT +
              FLOOR2_IMAGE_TO_NUMBER_GAP +
              FLOOR2_IMAGE_SIZE +
              FLOOR2_TEXT_TO_IMAGE_GAP,
          }}
        >
          <h3 className="w-full text-center text-xl leading-[26px]">{card.title}</h3>
          <p className="w-full text-center text-[15px] leading-[21px]">{card.description}</p>
        </div>

        <div
          className="absolute left-1/2 overflow-hidden rounded-none bg-[#d9d9d9]"
          style={{
            width: FLOOR2_IMAGE_SIZE,
            height: FLOOR2_IMAGE_SIZE,
            bottom:
              FLOOR2_NUMBER_BOTTOM + FLOOR2_NUMBER_LINE_HEIGHT + FLOOR2_IMAGE_TO_NUMBER_GAP,
            transform: "translateX(-50%)",
          }}
        >
          <img
            src={card.imageSrc}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute right-20 bottom-20 text-right text-base leading-5 uppercase">
          {orderNumber}
        </div>
      </article>
    </div>
  );
}

const FLOOR3_ICON_BY_BLOCK_ID: Record<Floor3Block["id"], string> = {
  "01": "/materials/block-1.svg",
  "02": "/materials/block-2.svg",
  "03": "/materials/block-3.svg",
  "04": "/materials/block-4.svg",
};

function Floor3Icon({ blockId }: { blockId: Floor3Block["id"] }) {
  const iconSrc = FLOOR3_ICON_BY_BLOCK_ID[blockId];

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20" aria-hidden="true">
      <img src={iconSrc} alt="" className="h-4 w-4 object-contain" />
    </div>
  );
}

function Floor3StatBlock({ block }: { block: Floor3Block }) {
  return (
    <article className="w-[580px] rounded-[70px] bg-white/0 px-[60px] pt-[52px] pb-5 backdrop-blur-[150px]">
        <div className="flex flex-col items-center gap-16">
          <div className="flex w-full items-center gap-3">
            <Floor3Icon blockId={block.id} />
          </div>

        <div className="relative w-full">
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-end gap-1">
              <div className="text-center text-[35px] leading-10 font-medium">{block.value}</div>
              <div className="text-right text-[15px] leading-[21px]">{block.unit}</div>
            </div>
            <div className="w-full text-center text-[15px] leading-[21px] opacity-70">{block.label}</div>
          </div>

          <button
            type="button"
            className="absolute top-[17px] right-[-40px] inline-flex items-center justify-center rounded-[70px] bg-[#d9d9d9]/20 px-6 py-3 text-[15px] leading-[21px]"
          >
            More +
          </button>
        </div>

        <div className="flex w-full justify-center">
          <div className="h-[60px] w-[60px] overflow-hidden bg-[#d9d9d9]">
            <img
              src={block.imageSrc}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function Floor3CompactBlock({ block }: { block: Floor3CompactBlockData }) {
  const valueWeightClassName = block.valueWeightClassName ?? "font-medium";
  const textWidthClassName = block.textWidthClassName ?? "";

  return (
    <article className="self-stretch rounded-[50px] bg-white/0 pt-8 pb-10 backdrop-blur-[150px]">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="inline-flex w-full items-center justify-start gap-3 px-10">
          <Floor3Icon blockId={block.id} />
        </div>

        <div className={`flex flex-col items-center justify-start gap-4 ${textWidthClassName}`}>
          {block.unit ? (
            <div className="inline-flex items-end justify-start gap-1">
              <div className={`text-center text-[35px] leading-10 ${valueWeightClassName}`}>
                {block.value}
              </div>
              <div className="text-right text-[15px] leading-[21px]">{block.unit}</div>
            </div>
          ) : (
            <div className={`w-full text-center text-[35px] leading-10 ${valueWeightClassName}`}>
              {block.value}
            </div>
          )}
          <div className="w-full text-center text-[15px] leading-[21px] opacity-70">{block.label}</div>
        </div>
      </div>
    </article>
  );
}

function Floor2PinnedLayer({
  trackRef,
  compactTrackRef,
  lastCompactCardRef,
  renderStatic = true,
  renderCards = true,
  showCompactCards = false,
}: {
  trackRef: RefObject<HTMLDivElement | null>;
  compactTrackRef?: RefObject<HTMLDivElement | null>;
  lastCompactCardRef?: RefObject<HTMLElement | null>;
  renderStatic?: boolean;
  renderCards?: boolean;
  showCompactCards?: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-visible bg-black">
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
          ref={trackRef}
          className="absolute z-30 w-[1216px]"
          style={{
            left: FLOOR2_CARDS_LEFT,
            top: FLOOR2_CARDS_TOP,
            height: FLOOR2_CARDS_HEIGHT,
            willChange: "transform",
          }}
        >
          <div
            aria-hidden={showCompactCards}
            className={showCompactCards ? "pointer-events-none invisible" : ""}
          >
            {floor2Cards.map((card, index) => (
              <Floor2Card key={card.id} card={card} orderNumber={index + 1} />
            ))}
          </div>

          <div
            ref={compactTrackRef}
            aria-hidden={!showCompactCards}
            className={`absolute left-1/2 flex -translate-x-1/2 flex-col justify-start items-start gap-10 ${
              showCompactCards ? "" : "pointer-events-none invisible"
            }`}
            style={{ top: 0, width: FLOOR2_COMPACT_CARDS_WIDTH }}
          >
            {floor2CompactCards.map((card, index) => (
              <article
                key={card.id}
                ref={index === floor2CompactCards.length - 1 ? lastCompactCardRef : undefined}
                className={`self-stretch rounded-[50px] bg-white/0 px-11 py-10 backdrop-blur-[150px] inline-flex flex-col justify-start items-center ${card.contentGapClassName}`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eeeeee]/20" aria-hidden="true">
                  <img src={card.iconSrc} alt="" aria-hidden="true" className="h-4 w-auto max-w-4 object-contain" />
                </div>
                <h3 className="w-[280px] text-center text-xl leading-[26px]">{card.title}</h3>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

type Floor3PinnedLayerProps = {
  row1: Floor3Block[];
  row2: Floor3Block[];
  row3: Floor3Block[];
  trackRef: RefObject<HTMLDivElement | null>;
  renderStatic?: boolean;
  renderCards?: boolean;
  showCompactBlocks?: boolean;
};

function Floor3PinnedLayer({
  row1,
  row2,
  row3,
  trackRef,
  renderStatic = true,
  renderCards = true,
  showCompactBlocks = false,
  }: Floor3PinnedLayerProps) {
  return (
    <div className="absolute inset-0 overflow-visible bg-black">
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
            willChange: "transform",
          }}
        >
          <div
            aria-hidden={showCompactBlocks}
            className={showCompactBlocks ? "pointer-events-none invisible" : ""}
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

          <div
            aria-hidden={!showCompactBlocks}
            className={`absolute left-1/2 flex -translate-x-1/2 flex-col items-start justify-start gap-10 ${
              showCompactBlocks ? "" : "pointer-events-none invisible"
            }`}
            style={{ top: 0, width: FLOOR3_COMPACT_BLOCKS_WIDTH }}
          >
            {floor3CompactBlocks.map((block) => (
              <Floor3CompactBlock key={block.id} block={block} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Floor4QuoteCard({ card }: { card: Floor4QuoteCardData }) {
  const isLeft = card.align === "left";
  const [expanded, setExpanded] = useState(false);
  const [isQuoteOverflowing, setIsQuoteOverflowing] = useState(false);
  const quoteRef = useRef<HTMLParagraphElement | null>(null);
  const quoteText = card.quoteLines.join(" ");
  const companyText = card.companyLines.join(" ");
  const clampClassName = expanded ? "" : "clamp-2-lines";
  const shouldApplyHoverOpacity = !expanded && isQuoteOverflowing;

  useEffect(() => {
    if (expanded) return;

    const quoteElement = quoteRef.current;
    if (!quoteElement) return;

    const checkOverflow = () => {
      const hasOverflow = quoteElement.scrollHeight - quoteElement.clientHeight > 1;
      setIsQuoteOverflowing(hasOverflow);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(quoteElement);
    window.addEventListener("resize", checkOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkOverflow);
    };
  }, [expanded, quoteText]);

  return (
    <article className="w-[580px] rounded-[70px] bg-[#6b595f] p-20">
      <button
        type="button"
        className={`${shouldApplyHoverOpacity ? "group" : ""} flex w-full flex-col gap-[120px] bg-transparent text-left ${isLeft ? "items-start" : "items-center"}`}
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <div className="relative w-[420px]">
          <p
            ref={quoteRef}
            className={`text-white text-xl leading-[26px] ${shouldApplyHoverOpacity ? "transition-opacity group-hover:opacity-70" : ""} ${clampClassName}`}
          >
            {quoteText}
          </p>
        </div>

        <div className="inline-flex w-full justify-end items-center gap-2.5">
          <div className="h-40 w-[120px] overflow-hidden bg-[#d9d9d9]">
            <img
              src={card.imageSrc}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-3">
          <div className={`text-center text-[15px] leading-[17px] ${clampClassName}`}>{card.name}</div>
          <div className={`opacity-75 text-center text-[15px] leading-[17px] ${clampClassName}`}>
            {companyText}
          </div>
        </div>
      </button>
    </article>
  );
}

function Floor4CompactCard({ card }: { card: Floor4CompactCardData }) {
  return (
    <article className="self-stretch rounded-[50px] bg-white/0 px-14 py-[76px] backdrop-blur-[150px]">
      <div className="flex flex-col items-start justify-start gap-3">
        <div className="flex w-[250px] flex-col items-center justify-center gap-3">
          <div className="text-center text-[15px] leading-[17px]">{card.name}</div>
          <div className="w-full text-center text-[15px] leading-[17px] opacity-75">
            {card.companyLines.map((line, index) => (
              <span key={`${card.id}-${line}-${index}`}>
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
  row1: Floor4QuoteCardData[];
  row2: Floor4QuoteCardData[];
  row3: Floor4QuoteCardData[];
  trackRef: RefObject<HTMLDivElement | null>;
  renderStatic?: boolean;
  renderCards?: boolean;
  showCompactCards?: boolean;
};

function Floor4PinnedLayer({
  row1,
  row2,
  row3,
  trackRef,
  renderStatic = true,
  renderCards = true,
  showCompactCards = false,
}: Floor4PinnedLayerProps) {
  return (
    <div className="absolute inset-0 overflow-visible bg-black">
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
            willChange: "transform",
          }}
        >
          <div
            aria-hidden={showCompactCards}
            className={showCompactCards ? "pointer-events-none invisible" : ""}
          >
            <div className="inline-flex w-[1210px] flex-col items-center justify-center" style={{ gap: FLOOR4_BLOCK_ROW_GAP }}>
              <div className="inline-flex w-full items-center justify-end gap-3">
                {row1.map((card) => (
                  <Floor4QuoteCard key={card.id} card={card} />
                ))}
              </div>
              <div className="inline-flex w-full items-center justify-start gap-3">
                {row2.map((card) => (
                  <Floor4QuoteCard key={card.id} card={card} />
                ))}
              </div>
              <div className="inline-flex w-full items-center justify-end gap-3">
                {row3.map((card) => (
                  <Floor4QuoteCard key={card.id} card={card} />
                ))}
              </div>
            </div>
          </div>

          <div
            aria-hidden={!showCompactCards}
            className={`absolute left-1/2 inline-flex -translate-x-1/2 flex-col items-end justify-start gap-10 ${
              showCompactCards ? "" : "pointer-events-none invisible"
            }`}
            style={{ top: 0, width: FLOOR4_COMPACT_CARDS_WIDTH }}
          >
            {floor4CompactCards.map((card) => (
              <Floor4CompactCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Floor5InputField({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  required = false,
  className = "",
}: {
  id: string;
  name: keyof Floor5FormState;
  label: string;
  type?: "text" | "email";
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
  className?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const displayText = value.trim().length > 0 ? value : isFocused ? "" : label;

  return (
    <label htmlFor={id} className={`relative inline-flex cursor-text flex-col items-start gap-4 ${className}`}>
      <span className="h-5 text-[15px] leading-5 text-white">{displayText}</span>
      <span className="block h-px w-full bg-white" aria-hidden="true" />
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        aria-label={label}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute left-0 top-0 h-5 w-full cursor-text bg-transparent text-transparent caret-white outline-none"
      />
    </label>
  );
}

function Floor5TextareaField({
  id,
  name,
  label,
  value,
  onChange,
  className = "",
}: {
  id: string;
  name: keyof Floor5FormState;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const displayText = value.trim().length > 0 ? value : isFocused ? "" : label;

  return (
    <label htmlFor={id} className={`relative inline-flex cursor-text flex-col items-start gap-4 ${className}`}>
      <span className="h-5 text-[15px] leading-5 text-white">{displayText}</span>
      <span className="block h-px w-full bg-white" aria-hidden="true" />
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        rows={1}
        aria-label={label}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute left-0 top-0 h-5 w-full resize-none overflow-hidden bg-transparent text-transparent caret-white outline-none"
      />
    </label>
  );
}

function Floor5PinnedLayer({
  trackRef,
  showCompactForm = false,
}: {
  trackRef: RefObject<HTMLFormElement | null>;
  showCompactForm?: boolean;
}) {
  const EMAIL_VALUE = "info@clearstoneip.com";
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [formData, setFormData] = useState<Floor5FormState>(INITIAL_FLOOR5_FORM_STATE);
  const [isSubmitToastVisible, setIsSubmitToastVisible] = useState(false);
  const emailCopiedTimeoutRef = useRef<number | null>(null);
  const submitToastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (emailCopiedTimeoutRef.current !== null) {
        window.clearTimeout(emailCopiedTimeoutRef.current);
      }
      if (submitToastTimeoutRef.current !== null) {
        window.clearTimeout(submitToastTimeoutRef.current);
      }
    };
  }, []);

  const handleEmailCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(EMAIL_VALUE);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = EMAIL_VALUE;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setIsEmailCopied(true);
      if (emailCopiedTimeoutRef.current !== null) {
        window.clearTimeout(emailCopiedTimeoutRef.current);
      }
      emailCopiedTimeoutRef.current = window.setTimeout(() => {
        setIsEmailCopied(false);
      }, 2000);
    } catch {
      setIsEmailCopied(false);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitToastVisible(true);
    if (submitToastTimeoutRef.current !== null) {
      window.clearTimeout(submitToastTimeoutRef.current);
    }
    submitToastTimeoutRef.current = window.setTimeout(() => {
      setIsSubmitToastVisible(false);
    }, 2000);
  };

  return (
    <div className="absolute inset-0 overflow-visible bg-black">
      <div
        role="status"
        aria-live="polite"
        className={`fixed top-5 left-1/2 z-50 w-fit max-w-[calc(100vw-80px)] -translate-x-1/2 rounded-full bg-[#000000]/[0.45] px-5 py-3 text-center text-[15px] leading-5 text-[#9BF49F] shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-[150px] transition-all duration-300 ${
          isSubmitToastVisible
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        We got your message. Our team will be in touch with you shortly.
      </div>

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${FLOOR5_BG_PRIMARY})` }}
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute inset-0 z-10 flex flex-col items-center pt-20 pb-[160px]">
        <div
          className="ml-10 flex w-[1868px] flex-col items-start gap-2 self-start"
          style={{ width: FLOOR5_DESCRIPTION_WIDTH }}
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

                  <a
                    href="tel:+16503088351"
                    className="inline-flex shrink-0 translate-y-[2px] items-center justify-center gap-3 rounded-full bg-black/20 px-7 py-3 text-center text-[15px] leading-5 text-white backdrop-blur-[6px] transition-all duration-200 hover:bg-black hover:backdrop-blur-none focus-visible:bg-black focus-visible:backdrop-blur-none"
                  >
                    +1 (650) 308-8351
                  </a>

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

            <button
              type="button"
              onClick={handleEmailCopy}
              className="relative inline-flex items-center justify-center rounded-full px-7 py-3 text-center text-[15px] leading-5 text-white outline outline-1 -outline-offset-1 outline-white transition-colors duration-200 hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black"
            >
              <span className="invisible whitespace-nowrap" aria-hidden="true">
                {EMAIL_VALUE}
              </span>
              <span className="absolute inset-0 inline-flex items-center justify-center whitespace-nowrap">
                {isEmailCopied ? "Copied" : EMAIL_VALUE}
              </span>
            </button>
          </div>
        </div>
        <form
          ref={trackRef}
          onSubmit={handleSubmit}
          aria-hidden={showCompactForm}
          className={`mt-auto flex flex-col items-center gap-[100px] rounded-[70px] bg-white/0 px-[120px] pt-[100px] pb-[52px] backdrop-blur-[150px] ${
            showCompactForm ? "pointer-events-none invisible" : ""
          }`}
          style={{
            width: FLOOR5_FORM_WIDTH,
            willChange: "transform",
          }}
        >
          <div className="flex flex-col items-start gap-[52px]">
            <div className="inline-flex items-center gap-12">
              <Floor5InputField
                id="first-name"
                name="firstName"
                label="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                autoComplete="given-name"
                required
                className="w-[266px]"
              />
              <Floor5InputField
                id="last-name"
                name="lastName"
                label="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                autoComplete="family-name"
                required
                className="w-[266px]"
              />
            </div>

            <div className="inline-flex items-center gap-12">
              <Floor5InputField
                id="email"
                name="email"
                label="Your email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                required
                className="w-[266px]"
              />
              <Floor5InputField
                id="organisation"
                name="organisation"
                label="Organisation"
                value={formData.organisation}
                onChange={handleInputChange}
                autoComplete="organization"
                className="w-[266px]"
              />
            </div>

            <Floor5TextareaField
              id="message"
              name="message"
              label="How can we help you"
              value={formData.message}
              onChange={handleTextareaChange}
              className="w-[580px]"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-[#FFFFFF]/[0.01] px-7 py-3 text-center text-[15px] leading-5 text-white backdrop-blur-[400px]"
          >
            Send message
          </button>
        </form>
      </div>

      <div
        aria-hidden={!showCompactForm}
        className={`absolute top-1/2 left-1/2 z-20 inline-flex -translate-x-1/2 -translate-y-1/2 items-center justify-start gap-3 rounded-[70px] bg-white/0 px-40 pt-[100px] pb-[52px] backdrop-blur-[150px] ${
          showCompactForm ? "" : "pointer-events-none invisible"
        }`}
        style={{
          width: FLOOR5_COMPACT_FORM_WIDTH,
        }}
      >
        <div className="inline-flex flex-1 flex-col items-center justify-start gap-[100px]">
          <div className="flex w-full flex-col items-start justify-start gap-[52px]">
            {FLOOR5_COMPACT_FORM_FIELDS.map((field) => (
              <div key={field} className="flex w-full flex-col items-start justify-start gap-4">
                <div className="w-full text-[15px] leading-5 text-white">{field}</div>
                <div className="h-px w-full bg-white" />
              </div>
            ))}
          </div>
          <div className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-white/0 px-8 py-4 backdrop-blur-[200px]">
            <div className="text-center text-[15px] leading-5 text-white">{FLOOR5_COMPACT_FORM_CTA}</div>
          </div>
        </div>
      </div>

      <GridOverlay />
    </div>
  );
}

export default function Home() {
  const { scale, offsetX, offsetY, viewportHeight } = useArtboardScale();
  const [debugScrollEnabled, setDebugScrollEnabled] = useState(false);
  const [activeFloor, setActiveFloor] = useState<FloorIndex>(1);
  const [floorTransition, setFloorTransition] = useState<FloorTransitionState | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [railDraggerY, setRailDraggerY] = useState(0);
  const [isRailHovered, setIsRailHovered] = useState(false);
  const [railMenuGroupStarts, setRailMenuGroupStarts] = useState<MenuGroupStart[]>(DEFAULT_MENU_GROUP_STARTS);
  const floor2ShellRef = useRef<HTMLDivElement | null>(null);
  const floor3ShellRef = useRef<HTMLDivElement | null>(null);
  const floor4ShellRef = useRef<HTMLDivElement | null>(null);
  const floor5ShellRef = useRef<HTMLDivElement | null>(null);
  const floor2TrackRef = useRef<HTMLDivElement | null>(null);
  const floor2CompactTrackRef = useRef<HTMLDivElement | null>(null);
  const floor2LastCompactCardRef = useRef<HTMLElement | null>(null);
  const floor3TrackRef = useRef<HTMLDivElement | null>(null);
  const floor4TrackRef = useRef<HTMLDivElement | null>(null);
  const floor5FormRef = useRef<HTMLFormElement | null>(null);
  const socialNavRef = useRef<HTMLElement | null>(null);
  const socialInstRef = useRef<HTMLAnchorElement | null>(null);
  const socialYoutubeRef = useRef<HTMLAnchorElement | null>(null);
  const [socialTiktokCenter, setSocialTiktokCenter] = useState<number | null>(null);
  const scrollYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastRafAtRef = useRef(0);
  const activeFloorRef = useRef<FloorIndex>(1);
  const railDraggerYRef = useRef(0);
  const lastAppliedRef = useRef({
    floor2ShellOffset: Number.NaN,
    floor3ShellOffset: Number.NaN,
    floor4ShellOffset: Number.NaN,
    floor5ShellOffset: Number.NaN,
    cardsTranslateY: Number.NaN,
    floor3BlocksTranslateY: Number.NaN,
    floor4BlocksTranslateY: Number.NaN,
    floor5FormTranslateY: Number.NaN,
  });
  const lastDebugLogAtRef = useRef(0);
  const lastDebugFloorRef = useRef<string>("floor-1");
  const floorTransitionSequenceRef = useRef(0);
  const fastFloor2To3TriggeredRef = useRef(false);
  const lastFastFloor2To3CardBottomRef = useRef<number | null>(null);
  const lastFastFloor2To3ScrollTopRef = useRef<number | null>(null);
  const floor2TrackHeight = useMeasuredHeight(floor2TrackRef, FLOOR2_CARDS_HEIGHT);
  const floor3TrackHeight = useMeasuredHeight(floor3TrackRef, 1300);
  const floor4TrackHeight = useMeasuredHeight(floor4TrackRef, 1300);

  const pinnedViewportHeight = viewportHeight / scale;
  const floor2BottomOffsetArtboard = FLOOR2_TRANSITION_OFFSET_SCREEN_PX / scale;
  const floor3BottomOffsetArtboard = FLOOR3_BOTTOM_OFFSET_SCREEN_PX / scale;
  const floor4BottomOffsetArtboard = FLOOR4_BOTTOM_OFFSET_SCREEN_PX / scale;
  const floor2TargetBottom = pinnedViewportHeight - floor2BottomOffsetArtboard;
  const floor3TargetBottom = pinnedViewportHeight - floor3BottomOffsetArtboard;
  const floor4TargetBottom = pinnedViewportHeight - floor4BottomOffsetArtboard;
  const floor2PinScrollRange = getPinScrollRange(
    FLOOR2_CARDS_TOP,
    floor2TrackHeight,
    floor2TargetBottom,
  );
  const floor3PinScrollRange = getPinScrollRange(
    FLOOR3_BLOCKS_TOP,
    floor3TrackHeight,
    floor3TargetBottom,
  );
  const floor4PinScrollRange = getPinScrollRange(
    FLOOR4_BLOCKS_TOP,
    floor4TrackHeight,
    floor4TargetBottom,
  );
  // Last floor should remain visually stable at page bottom:
  // no extra pin-range after reaching the final viewport.
  const floor5PinScrollRange = 0;
  const floor1Height = viewportHeight / scale;
  const floor2Area = pinnedViewportHeight + floor2PinScrollRange;
  const floor3Area = pinnedViewportHeight + floor3PinScrollRange;
  const floor4Area = pinnedViewportHeight + floor4PinScrollRange;
  const floor5Area = pinnedViewportHeight + floor5PinScrollRange;
  const floor2Start = floor1Height;
  const floor3Start = floor2Start + floor2Area;
  const floor4Start = floor3Start + floor3Area;
  const floor5Start = floor4Start + floor4Area;
  const floorStartByIndex: Record<FloorIndex, number> = useMemo(
    () => ({
      1: 0,
      2: floor2Start,
      3: floor3Start,
      4: floor4Start,
      5: floor5Start,
    }),
    [floor2Start, floor3Start, floor4Start, floor5Start],
  );
  const scrollTopByFloor: Record<FloorIndex, number> = useMemo(
    () => ({
      1: Math.max(offsetY + floorStartByIndex[1] * scale, 0),
      2: Math.max(offsetY + floorStartByIndex[2] * scale, 0),
      3: Math.max(offsetY + floorStartByIndex[3] * scale, 0),
      4: Math.max(offsetY + floorStartByIndex[4] * scale, 0),
      5: Math.max(offsetY + floorStartByIndex[5] * scale, 0),
    }),
    [floorStartByIndex, offsetY, scale],
  );
  const railFloorStops: Array<{ floor: FloorIndex; y: number }> = useMemo(
    () => [
      { floor: 1, y: 0 },
      { floor: 2, y: 136 },
      { floor: 3, y: 196 },
      { floor: 4, y: 256 },
      { floor: 5, y: 387 },
    ],
    [],
  );
  const dragMinY = railFloorStops[0].y;
  const floor5EntryY = Math.max(
    railFloorStops[4].y,
    railMenuGroupStarts[3].startY + FLOOR4_TO_5_RELEASE_GAP_PX,
  );
  const effectiveDragMaxY = floor5EntryY;
  const floor5FullyPinnedScrollTop = offsetY + (floor5Start + floor5PinScrollRange) * scale;
  const railScrollMax = Math.max(scrollTopByFloor[5], floor5FullyPinnedScrollTop);
  const railYStops = useMemo(
    () => [
      dragMinY,
      railFloorStops[1].y,
      railFloorStops[2].y,
      railFloorStops[3].y,
      floor5EntryY,
      effectiveDragMaxY,
    ],
    [dragMinY, effectiveDragMaxY, floor5EntryY, railFloorStops],
  );
  const railScrollStops = useMemo(
    () => [
      scrollTopByFloor[1],
      scrollTopByFloor[2],
      scrollTopByFloor[3],
      scrollTopByFloor[4],
      floor5FullyPinnedScrollTop,
      railScrollMax,
    ],
    [floor5FullyPinnedScrollTop, railScrollMax, scrollTopByFloor],
  );

  const getScrollTopForDraggerY = useCallback(
    (draggerY: number) => {
      const railYStart = railYStops[0];
      const railYFloor2 = railYStops[1];
      const railYFloor4 = railYStops[3];
      const railYFloor5 = railYStops[4];
      const scrollStart = railScrollStops[0];
      const scrollFloor2 = railScrollStops[1];
      const scrollFloor4 = railScrollStops[3];
      const scrollFloor5 = railScrollStops[4];

      if (draggerY <= railYFloor2) {
        if (Math.abs(railYFloor2 - railYStart) < 0.0001) return scrollFloor2;
        const clampedY = clamp(draggerY, railYStart, railYFloor2);
        const progress = (clampedY - railYStart) / (railYFloor2 - railYStart);
        const acceleratedProgress = Math.pow(progress, FLOOR1_TO_2_DRAG_ASSIST_CURVE);
        return scrollStart + (scrollFloor2 - scrollStart) * acceleratedProgress;
      }

      if (draggerY >= railYFloor4 && draggerY <= railYFloor5) {
        if (Math.abs(railYFloor5 - railYFloor4) < 0.0001) return scrollFloor5;
        const clampedY = clamp(draggerY, railYFloor4, railYFloor5);
        const progress = (clampedY - railYFloor4) / (railYFloor5 - railYFloor4);
        const acceleratedProgress = 1 - Math.pow(1 - progress, FLOOR4_TO_5_DRAG_ASSIST_CURVE);
        return scrollFloor4 + (scrollFloor5 - scrollFloor4) * acceleratedProgress;
      }

      return mapPiecewise(draggerY, railYStops, railScrollStops);
    },
    [railScrollStops, railYStops],
  );
  const isFastFloor2To3TriggerReached = useCallback(
    (scrollTop: number) => {
      if (!isRailHovered) {
        fastFloor2To3TriggeredRef.current = false;
        lastFastFloor2To3CardBottomRef.current = null;
        lastFastFloor2To3ScrollTopRef.current = null;
        return false;
      }

      const lastCompactCardNode = floor2LastCompactCardRef.current;
      if (!lastCompactCardNode) return false;

      const viewportBottom = window.innerHeight;
      const currentBottom = lastCompactCardNode.getBoundingClientRect().bottom;
      const previousBottom = lastFastFloor2To3CardBottomRef.current;
      const previousScrollTop = lastFastFloor2To3ScrollTopRef.current;
      const isScrollingDown = previousScrollTop !== null && scrollTop > previousScrollTop + 0.1;
      const isScrollingUp = previousScrollTop !== null && scrollTop < previousScrollTop - 0.1;
      // Fast 2 -> 3 should start only after the 4th compact card is fully visible.
      const fullyVisibleBottomThreshold = viewportBottom + 0.5;
      const isLastCardFullyVisible = currentBottom <= fullyVisibleBottomThreshold;
      const hasCrossedIntoFullyVisibleInOneStep =
        isScrollingDown &&
        previousBottom !== null &&
        previousBottom > fullyVisibleBottomThreshold &&
        currentBottom <= fullyVisibleBottomThreshold;

      if (isLastCardFullyVisible || hasCrossedIntoFullyVisibleInOneStep) {
        fastFloor2To3TriggeredRef.current = true;
      } else if (isScrollingUp && currentBottom > viewportBottom + 8) {
        fastFloor2To3TriggeredRef.current = false;
      }

      lastFastFloor2To3CardBottomRef.current = currentBottom;
      lastFastFloor2To3ScrollTopRef.current = scrollTop;

      return fastFloor2To3TriggeredRef.current;
    },
    [isRailHovered],
  );
  const getFloorForScrollTop = useCallback(
    (scrollTop: number): FloorIndex => {
      // Tiny epsilon prevents boundary jitter around exact floor starts.
      const epsilon = 0.5;

      if (scrollTop + epsilon >= scrollTopByFloor[5]) return 5;
      if (scrollTop + epsilon >= scrollTopByFloor[4]) return 4;
      if (
        isRailHovered &&
        scrollTop + epsilon >= scrollTopByFloor[2] &&
        isFastFloor2To3TriggerReached(scrollTop)
      ) {
        return 3;
      }
      if (scrollTop + epsilon >= scrollTopByFloor[3]) return 3;
      if (scrollTop + epsilon >= scrollTopByFloor[2]) return 2;
      return 1;
    },
    [isFastFloor2To3TriggerReached, isRailHovered, scrollTopByFloor],
  );
  const getDraggerYForScrollTop = useCallback(
    (scrollTop: number) => {
      const scrollStart = railScrollStops[0];
      const scrollFloor2 = railScrollStops[1];
      const scrollFloor4 = railScrollStops[3];
      const scrollFloor5 = railScrollStops[4];
      const railYStart = railYStops[0];
      const railYFloor2 = railYStops[1];
      const railYFloor4 = railYStops[3];
      const railYFloor5 = railYStops[4];

      if (scrollTop <= scrollFloor2) {
        if (Math.abs(scrollFloor2 - scrollStart) < 0.0001) return railYFloor2;
        const clampedScroll = clamp(scrollTop, scrollStart, scrollFloor2);
        const progress = (clampedScroll - scrollStart) / (scrollFloor2 - scrollStart);
        const restoredProgress = Math.pow(progress, 1 / FLOOR1_TO_2_DRAG_ASSIST_CURVE);
        return railYStart + (railYFloor2 - railYStart) * restoredProgress;
      }

      if (scrollTop >= scrollFloor4 && scrollTop <= scrollFloor5) {
        if (Math.abs(scrollFloor5 - scrollFloor4) < 0.0001) return railYFloor5;
        const clampedScroll = clamp(scrollTop, scrollFloor4, scrollFloor5);
        const progress = (clampedScroll - scrollFloor4) / (scrollFloor5 - scrollFloor4);
        const normalizedProgress =
          progress >= 0.9999
            ? 1
            : 1 - Math.pow(1 - progress, 1 / FLOOR4_TO_5_DRAG_ASSIST_CURVE);
        return railYFloor4 + (railYFloor5 - railYFloor4) * normalizedProgress;
      }

      return mapPiecewise(scrollTop, railScrollStops, railYStops);
    },
    [railScrollStops, railYStops],
  );
  const commitActiveFloor = useCallback(
    (nextFloor: FloorIndex) => {
      const previousFloor = activeFloorRef.current;
      if (previousFloor === nextFloor) return;

      activeFloorRef.current = nextFloor;
      setActiveFloor(nextFloor);

      if (prefersReducedMotion) return;

      floorTransitionSequenceRef.current += 1;
      setFloorTransition({
        id: floorTransitionSequenceRef.current,
        direction: nextFloor > previousFloor ? "down" : "up",
        from: previousFloor,
        to: nextFloor,
      });
    },
    [prefersReducedMotion],
  );

  const totalArtboardHeight = floor1Height + floor2Area + floor3Area + floor4Area + floor5Area;
  const scaledContentBottom = offsetY + totalArtboardHeight * scale;
  const pageHeight = Math.max(viewportHeight, scaledContentBottom + VIEWPORT_TOP_OFFSET);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryFlag = params.get("debugScroll");
    setDebugScrollEnabled(queryFlag === "1");
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      const isLocalPreview =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      setPrefersReducedMotion(mediaQuery.matches && !isLocalPreview);
    };

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncPreference);
    };
  }, []);

  useEffect(() => {
    if (!floorTransition) return;

    const timeoutId = window.setTimeout(() => {
      setFloorTransition((current) => {
        if (!current || current.id !== floorTransition.id) return current;
        return null;
      });
    }, FLOOR_TRANSITION_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [floorTransition]);

  useEffect(() => {
    const applyTransformIfChanged = (
      key: keyof typeof lastAppliedRef.current,
      value: number,
      node: HTMLElement | null,
    ) => {
      if (!node) return;
      if (lastAppliedRef.current[key] === value) return;

      lastAppliedRef.current[key] = value;
      node.style.transform = `translate3d(0, ${value}px, 0)`;
    };

    const snapToScreenPixels = (valueInArtboardPx: number) => {
      const dpr = window.devicePixelRatio || 1;
      const screenScale = Math.max(scale * dpr, 0.0001);
      return Math.round(valueInArtboardPx * screenScale) / screenScale;
    };

    const runFrame = () => {
      try {
        const latestScrollY = window.scrollY;
        if (latestScrollY !== scrollYRef.current) {
          scrollYRef.current = latestScrollY;
        }

        const viewTopInArtboard = Math.max((scrollYRef.current - offsetY) / scale, 0);
        const floor2ShellOffsetProgress = clamp(
          viewTopInArtboard - floor2Start,
          0,
          floor2PinScrollRange,
        );
        const floor2ShellOffset = floor2ShellOffsetProgress;
        const floor3ShellOffset = clamp(viewTopInArtboard - floor3Start, 0, floor3PinScrollRange);
        const floor4ShellOffset = clamp(viewTopInArtboard - floor4Start, 0, floor4PinScrollRange);
        const floor5ShellOffset = clamp(viewTopInArtboard - floor5Start, 0, floor5PinScrollRange);

        const floor2ShellOffsetSnapped = snapToScreenPixels(floor2ShellOffset);
        const floor3ShellOffsetSnapped = snapToScreenPixels(floor3ShellOffset);
        const floor4ShellOffsetSnapped = snapToScreenPixels(floor4ShellOffset);
        const floor5ShellOffsetSnapped = snapToScreenPixels(floor5ShellOffset);

        const cardsTranslateY = -floor2ShellOffsetSnapped;
        const floor3BlocksTranslateY = -floor3ShellOffsetSnapped;
        const floor4BlocksTranslateY = -floor4ShellOffsetSnapped;
        const floor5FormTranslateY = -floor5ShellOffsetSnapped;

        const activeFloorInView = getFloorForScrollTop(scrollYRef.current);

        commitActiveFloor(activeFloorInView);

        const nextRailDraggerY = getDraggerYForScrollTop(scrollYRef.current);
        if (Math.abs(railDraggerYRef.current - nextRailDraggerY) > 0.1) {
          railDraggerYRef.current = nextRailDraggerY;
          setRailDraggerY(nextRailDraggerY);
        }

        applyTransformIfChanged("floor2ShellOffset", floor2ShellOffsetSnapped, floor2ShellRef.current);
        applyTransformIfChanged("floor3ShellOffset", floor3ShellOffsetSnapped, floor3ShellRef.current);
        applyTransformIfChanged("floor4ShellOffset", floor4ShellOffsetSnapped, floor4ShellRef.current);
        applyTransformIfChanged("floor5ShellOffset", floor5ShellOffsetSnapped, floor5ShellRef.current);
        applyTransformIfChanged("cardsTranslateY", cardsTranslateY, floor2TrackRef.current);
        applyTransformIfChanged("floor3BlocksTranslateY", floor3BlocksTranslateY, floor3TrackRef.current);
        applyTransformIfChanged("floor4BlocksTranslateY", floor4BlocksTranslateY, floor4TrackRef.current);
        applyTransformIfChanged("floor5FormTranslateY", floor5FormTranslateY, floor5FormRef.current);

        if (debugScrollEnabled) {
          const now = performance.now();
          const rafGap = lastRafAtRef.current === 0 ? 0 : now - lastRafAtRef.current;
          lastRafAtRef.current = now;
          const fps = rafGap > 0 ? 1000 / rafGap : 0;
          const droppedFrames = rafGap > 0 ? Math.max(0, Math.round(rafGap / 16.67) - 1) : 0;

          const activeFloor =
            activeFloorInView === 5
              ? "floor-5"
              : activeFloorInView === 4
                ? "floor-4"
                : activeFloorInView === 3
                  ? "floor-3"
                  : activeFloorInView === 2
                    ? "floor-2"
                    : "floor-1";

          const floorChanged = activeFloor !== lastDebugFloorRef.current;
          const shouldLog = floorChanged || now - lastDebugLogAtRef.current >= 500;

          if (shouldLog) {
            lastDebugLogAtRef.current = now;
            lastDebugFloorRef.current = activeFloor;

            const shellOffsets = [floor2ShellOffset, floor3ShellOffset, floor4ShellOffset, floor5ShellOffset];
            const maxFraction = Math.max(...shellOffsets.map(fractionalPart));
            const anyFractional = maxFraction > 0.001;

            console.groupCollapsed(
              `[debug-scroll] ${activeFloor} | y=${scrollYRef.current.toFixed(2)} | fps=${fps.toFixed(1)} | rAF gap=${rafGap.toFixed(1)}ms${droppedFrames > 0 ? ` | DROPPED ${droppedFrames}f` : ""}`
            );
            console.table({
              scrollY: Number(scrollYRef.current.toFixed(3)),
              scale: Number(scale.toFixed(4)),
              viewTopInArtboard: Number(viewTopInArtboard.toFixed(3)),
              pinnedViewportHeight: Number(pinnedViewportHeight.toFixed(3)),
              floor2ShellOffset: Number(floor2ShellOffset.toFixed(3)),
              floor3ShellOffset: Number(floor3ShellOffset.toFixed(3)),
              floor4ShellOffset: Number(floor4ShellOffset.toFixed(3)),
              floor5ShellOffset: Number(floor5ShellOffset.toFixed(3)),
              floor2ShellOffsetSnapped,
              floor3ShellOffsetSnapped,
              floor4ShellOffsetSnapped,
              floor5ShellOffsetSnapped,
              cardsTranslateY,
              floor3BlocksTranslateY,
              floor4BlocksTranslateY,
              floor5FormTranslateY,
              anyFractionalOffset: anyFractional,
              activeFloor,
            });
            console.groupEnd();
          }
        }
      } finally {
        if (!document.hidden) {
          rafIdRef.current = window.requestAnimationFrame(runFrame);
        } else {
          rafIdRef.current = null;
        }
      }
    };

    const startLoop = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = window.requestAnimationFrame(runFrame);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafIdRef.current !== null) {
          window.cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        return;
      }

      scrollYRef.current = window.scrollY;
      lastRafAtRef.current = 0;
      startLoop();
    };

    scrollYRef.current = window.scrollY;
    startLoop();
    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);

      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = null;
    };
  }, [
    floor2PinScrollRange,
    floor2Start,
    floor3PinScrollRange,
    floor3Start,
    floor4PinScrollRange,
    floor4Start,
    floor5PinScrollRange,
    floor5Start,
    debugScrollEnabled,
    commitActiveFloor,
    getFloorForScrollTop,
    getDraggerYForScrollTop,
    offsetY,
    pinnedViewportHeight,
    scale,
  ]);

  const handleDragPositionChange = (draggerY: number) => {
    railDraggerYRef.current = draggerY;
    setRailDraggerY(draggerY);
    const targetScrollTop = getScrollTopForDraggerY(draggerY);
    scrollYRef.current = targetScrollTop;

    const nextFloor = getFloorForScrollTop(targetScrollTop);
    commitActiveFloor(nextFloor);

    window.scrollTo({
      top: targetScrollTop,
      behavior: "auto",
    });
  };

  useEffect(() => {
    const clampedY = clamp(railDraggerYRef.current, dragMinY, effectiveDragMaxY);
    if (Math.abs(clampedY - railDraggerYRef.current) < 0.1) return;

    railDraggerYRef.current = clampedY;
    setRailDraggerY(clampedY);

    const targetScrollTop = getScrollTopForDraggerY(clampedY);
    scrollYRef.current = targetScrollTop;
    window.scrollTo({
      top: targetScrollTop,
      behavior: "auto",
    });

    const nextFloor = getFloorForScrollTop(targetScrollTop);
    commitActiveFloor(nextFloor);
  }, [commitActiveFloor, dragMinY, effectiveDragMaxY, getFloorForScrollTop, getScrollTopForDraggerY]);

  useEffect(() => {
    const measureSocialNav = () => {
      const navNode = socialNavRef.current;
      const instNode = socialInstRef.current;
      const youtubeNode = socialYoutubeRef.current;
      if (!navNode || !instNode || !youtubeNode) return;

      const navRect = navNode.getBoundingClientRect();
      const instRect = instNode.getBoundingClientRect();
      const youtubeRect = youtubeNode.getBoundingClientRect();
      const instCenter = instRect.left + instRect.width / 2;
      const youtubeCenter = youtubeRect.left + youtubeRect.width / 2;
      const center = (instCenter + youtubeCenter) / 2 - navRect.left;
      setSocialTiktokCenter(center);
    };

    const rafId = window.requestAnimationFrame(() => {
      measureSocialNav();
      window.requestAnimationFrame(measureSocialNav);
    });

    if (document.fonts?.ready) {
      document.fonts.ready.then(measureSocialNav).catch(() => {});
    }

    window.addEventListener("resize", measureSocialNav);
    window.addEventListener("load", measureSocialNav);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measureSocialNav);
      window.removeEventListener("load", measureSocialNav);
    };
  }, [scale]);

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

            <nav
              ref={socialNavRef}
              className="absolute z-20 text-[15px] leading-5"
              style={{
                top: 20,
                left: columnStart(1),
                width: columnStart(3) - columnStart(1),
              }}
            >
              <a ref={socialInstRef} href="#" className="absolute left-0 inline-block border-b border-current leading-none">
                Inst
              </a>
              <a
                href="#"
                className="absolute inline-block border-b border-current leading-none"
                style={{
                  left: socialTiktokCenter ?? (columnStart(2) - columnStart(1)) / 2,
                  transform: "translateX(calc(-50% + 20px))",
                }}
              >
                TikTok
              </a>
              <a
                ref={socialYoutubeRef}
                href="#"
                className="absolute inline-block border-b border-current leading-none"
                style={{ left: columnStart(2) - columnStart(1) }}
              >
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
                className="absolute z-30 inline-flex items-center justify-center gap-3 rounded-full bg-black/20 px-7 py-3 text-center text-[15px] leading-5 backdrop-blur-[6px] transition-all duration-200 hover:bg-black hover:backdrop-blur-none"
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
                className="absolute inline-flex items-center justify-center rounded-full px-7 py-3 text-center text-[15px] leading-5 text-white outline outline-1 -outline-offset-1 outline-white transition-colors duration-200 hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black"
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

          <section className="relative bg-black" style={{ height: floor2Area }}>
            <div
              ref={floor2ShellRef}
              className="absolute left-0 top-0 w-full overflow-hidden"
              style={{
                height: pinnedViewportHeight,
                transform: "translateY(0px)",
                willChange: "transform",
              }}
            >
              <div className="relative h-full w-full">
                <Floor2PinnedLayer
                  trackRef={floor2TrackRef}
                  compactTrackRef={floor2CompactTrackRef}
                  lastCompactCardRef={floor2LastCompactCardRef}
                  showCompactCards={isRailHovered}
                />
              </div>
            </div>
          </section>

          <section className="relative bg-black" style={{ height: floor3Area }}>
            <div
              ref={floor3ShellRef}
              className="absolute left-0 top-0 w-full overflow-hidden"
              style={{
                height: pinnedViewportHeight,
                transform: "translateY(0px)",
                willChange: "transform",
              }}
            >
              <div className="relative h-full w-full">
                <Floor3PinnedLayer
                  row1={floor3Row1}
                  row2={floor3Row2}
                  row3={floor3Row3}
                  trackRef={floor3TrackRef}
                  showCompactBlocks={isRailHovered}
                />
              </div>
            </div>
          </section>

          <section className="relative bg-black" style={{ height: floor4Area }}>
            <div
              ref={floor4ShellRef}
              className="absolute left-0 top-0 w-full overflow-hidden"
              style={{
                height: pinnedViewportHeight,
                transform: "translateY(0px)",
                willChange: "transform",
              }}
            >
              <div className="relative h-full w-full">
                <Floor4PinnedLayer
                  row1={floor4Row1}
                  row2={floor4Row2}
                  row3={floor4Row3}
                  trackRef={floor4TrackRef}
                  showCompactCards={isRailHovered}
                />
              </div>
            </div>
          </section>

          <section className="relative bg-black" style={{ height: floor5Area }}>
            <div
              ref={floor5ShellRef}
              className="absolute left-0 top-0 w-full overflow-hidden"
              style={{
                height: pinnedViewportHeight,
                transform: "translateY(0px)",
                willChange: "transform",
              }}
            >
              <div className="relative h-full w-full">
                <Floor5PinnedLayer
                  trackRef={floor5FormRef}
                  showCompactForm={isRailHovered}
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
        <FixedRail
          activeFloor={activeFloor}
          currentDraggerY={railDraggerY}
          dragMinY={dragMinY}
          dragMaxY={effectiveDragMaxY}
          onDragPositionChange={handleDragPositionChange}
          onMenuGroupStartsChange={setRailMenuGroupStarts}
          onHoverChange={setIsRailHovered}
        />
      </div>

      {floorTransition ? (
        <div
          aria-hidden="true"
          className="floor-transition-layer"
          data-direction={floorTransition.direction}
        >
          <div className="floor-transition-vignette" />
          <div className="floor-transition-sheen" />
        </div>
      ) : null}
    </main>
  );
}
