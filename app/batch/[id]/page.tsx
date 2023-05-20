import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function BatchModal({ params: { id: batchId } }) {
  return (
    <>
      fdsfdsdsfdsfs
      {/* big blue window */}
      <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
        {/* white window */}
        <div className="relative mx-auto my-6 w-11/12 max-w-3xl rounded-lg bg-white shadow-lg"></div>
      </div>
      <Dialog open={true} defaultOpen={true}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
