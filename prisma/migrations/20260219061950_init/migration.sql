/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "statusAbsensi" AS ENUM ('HADIR', 'IZIN', 'SAKIT', 'ALFA', 'TERLAMBAT');

-- CreateEnum
CREATE TYPE "StatusKehadiran" AS ENUM ('HADIR', 'IZIN', 'SAKIT', 'ALFA', 'TERLAMBAT');

-- CreateEnum
CREATE TYPE "JenisHalaqah" AS ENUM ('TAHFIDZ', 'BACAAN');

-- CreateEnum
CREATE TYPE "KategoriTarget" AS ENUM ('RINGAN', 'SEDANG', 'INTENSE', 'BACAAN');

-- CreateEnum
CREATE TYPE "KategoriSetoran" AS ENUM ('MURAJAAH', 'ZIYADAH', 'INTENS', 'BACAAN');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "absensi" (
    "id_absensi" SERIAL NOT NULL,
    "santri_id" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "statusAbsensi" NOT NULL DEFAULT 'HADIR',
    "keterangan" TEXT,

    CONSTRAINT "absensi_pkey" PRIMARY KEY ("id_absensi")
);

-- CreateTable
CREATE TABLE "absensi_asatidz" (
    "id_absensi" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "tanggal_absensi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusKehadiran" NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "absensi_asatidz_pkey" PRIMARY KEY ("id_absensi")
);

-- CreateTable
CREATE TABLE "Halaqah" (
    "id_halaqah" SERIAL NOT NULL,
    "name_halaqah" TEXT NOT NULL,
    "muhafiz_id" INTEGER NOT NULL,
    "jenis" "JenisHalaqah" NOT NULL DEFAULT 'TAHFIDZ',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Halaqah_pkey" PRIMARY KEY ("id_halaqah")
);

-- CreateTable
CREATE TABLE "Santri" (
    "id_santri" SERIAL NOT NULL,
    "nama_santri" TEXT NOT NULL,
    "nomor_telepon" TEXT,
    "target" "KategoriTarget" NOT NULL DEFAULT 'RINGAN',
    "halaqah_id" INTEGER NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Santri_pkey" PRIMARY KEY ("id_santri")
);

-- CreateTable
CREATE TABLE "Setoran" (
    "id_setoran" SERIAL NOT NULL,
    "id_santri" INTEGER NOT NULL,
    "tanggal_setoran" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "juz" INTEGER NOT NULL,
    "surat" TEXT NOT NULL,
    "ayat" TEXT NOT NULL,
    "kategori" "KategoriSetoran" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setoran_pkey" PRIMARY KEY ("id_setoran")
);

-- CreateIndex
CREATE UNIQUE INDEX "Halaqah_muhafiz_id_key" ON "Halaqah"("muhafiz_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_santri_id_fkey" FOREIGN KEY ("santri_id") REFERENCES "Santri"("id_santri") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensi_asatidz" ADD CONSTRAINT "absensi_asatidz_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Halaqah" ADD CONSTRAINT "Halaqah_muhafiz_id_fkey" FOREIGN KEY ("muhafiz_id") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Santri" ADD CONSTRAINT "Santri_halaqah_id_fkey" FOREIGN KEY ("halaqah_id") REFERENCES "Halaqah"("id_halaqah") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setoran" ADD CONSTRAINT "Setoran_id_santri_fkey" FOREIGN KEY ("id_santri") REFERENCES "Santri"("id_santri") ON DELETE RESTRICT ON UPDATE CASCADE;
