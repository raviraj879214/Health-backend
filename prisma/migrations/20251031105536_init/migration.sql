-- CreateTable
CREATE TABLE "clinics" (
    "id" SERIAL NOT NULL,
    "clinic_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clinic_name" TEXT NOT NULL,
    "profession" TEXT NOT NULL,

    CONSTRAINT "clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat" (
    "id" SERIAL NOT NULL,
    "chat_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
