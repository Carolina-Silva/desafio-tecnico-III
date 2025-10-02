-- CreateTable
CREATE TABLE `Paciente` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `documento` VARCHAR(191) NOT NULL,
    `data_nascimento` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Paciente_documento_key`(`documento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exame` (
    `id` VARCHAR(191) NOT NULL,
    `idempotency_key` VARCHAR(191) NOT NULL,
    `modalidade` ENUM('CR', 'CT', 'DX', 'MG', 'MR', 'NM', 'OT', 'PT', 'RF', 'US', 'XA') NOT NULL,
    `data_exame` DATETIME(3) NOT NULL,
    `paciente_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Exame_idempotency_key_key`(`idempotency_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Exame` ADD CONSTRAINT `Exame_paciente_id_fkey` FOREIGN KEY (`paciente_id`) REFERENCES `Paciente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
