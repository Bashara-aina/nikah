import { describe, expect, it } from "vitest";
import { toCsv } from "./csv";

const rows = (...values: object[]) => values;

describe("toCsv", () => {
  it("writes a BOM, a header, and CRLF line endings", () => {
    const csv = toCsv(rows({ nama: "Rina" }), ["nama"]);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv).toBe("﻿nama\r\nRina\r\n");
  });

  it("emits only a header when there are no rows", () => {
    expect(toCsv([], ["nama", "pesan"])).toBe("﻿nama,pesan\r\n");
  });

  it("quotes commas, quotes and newlines, doubling inner quotes", () => {
    const csv = toCsv(rows({ pesan: 'Selamat, ya "banget"\nsemoga sakinah' }), ["pesan"]);
    expect(csv).toContain('"Selamat, ya ""banget""\nsemoga sakinah"');
  });

  it("renders null and undefined as empty cells", () => {
    expect(toCsv(rows({ a: null, b: undefined }), ["a", "b"])).toBe("﻿a,b\r\n,\r\n");
  });

  it("renders a missing column as an empty cell", () => {
    expect(toCsv(rows({ a: "x" }), ["a", "tidak_ada"])).toBe("﻿a,tidak_ada\r\nx,\r\n");
  });

  // A guest can type anything into `catatan`; the couple opens this in Excel.
  it.each(["=1+1", "+1", "-1+1", "@SUM(A1)", "=cmd|' /c calc'!A1"])(
    "neutralises the formula trigger in %j",
    (payload) => {
      const cell = toCsv(rows({ catatan: payload }), ["catatan"]).split("\r\n")[1];
      expect(cell?.replace(/^"|"$/g, "").startsWith("'")).toBe(true);
    },
  );

  it("leaves ordinary text and numbers untouched", () => {
    expect(toCsv(rows({ nama: "Rina", jumlah: 2 }), ["nama", "jumlah"])).toBe(
      "﻿nama,jumlah\r\nRina,2\r\n",
    );
  });

  it("does not prefix a negative number", () => {
    expect(toCsv(rows({ saldo: -5 }), ["saldo"])).toBe("﻿saldo\r\n-5\r\n");
  });
});
