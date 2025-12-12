/* eslint-disable @typescript-eslint/no-unused-vars */
import { wrap } from "@/lib/errorApi";
import { setResponse } from "@/lib/http";
import { NextRequest } from "next/server";

// DELETE /api/services/[id]
export const DELETE = wrap(
  async (_req: NextRequest, _ctx: { params: Promise<{ id: string }> }) => {
    // const { id } = await ctx.params;
    // const deleted = await prisma.request_attachments.delete({
    //   where: { id },
    // });

    // return setResponse(deleted, "Lampiran dihapus");
    return setResponse(null, "Fitur belum tersedia", 501);
  }
);
