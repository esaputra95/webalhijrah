import Swal, { SweetAlertResult } from "sweetalert2";

// type untuk custom text jika ingin override
export interface ConfirmDeleteOptions {
  title?: string;
  text?: string;
  successMessage?: string;
}

export type AsyncAction<T = unknown> = () => Promise<T>;

export async function confirmDelete(
  action: AsyncAction,
  opts?: ConfirmDeleteOptions
): Promise<SweetAlertResult> {
  const title = opts?.title ?? "Yakin?";
  const text = opts?.text ?? "Data ini akan dihapus permanen!";
  const successMessage = opts?.successMessage ?? "Data berhasil dihapus.";

  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e42c2c",
    cancelButtonColor: "#3278A0",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !Swal.isLoading(),
    preConfirm: async () => {
      try {
        await action();
      } catch (error) {
        Swal.showValidationMessage(
          error instanceof Error ? error.message : "Gagal menghapus data"
        );
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      void Swal.fire("Terhapus!", successMessage, "success");
    }
    return result;
  });
}
