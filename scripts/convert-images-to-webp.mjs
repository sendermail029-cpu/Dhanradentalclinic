import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const rootDir = process.cwd()
const publicDir = path.join(rootDir, 'public')
const navbarSourceDir = path.join(rootDir, 'assets', 'navbar', 'treatments')
const navbarOutputDir = path.join(rootDir, 'public', 'navbar', 'treatments')
const convertExtensions = new Set(['.jpg', '.jpeg', '.png', '.avif'])

async function collectFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name)
        return entry.isDirectory() ? collectFiles(fullPath) : [fullPath]
      }),
    )

    return files.flat()
  } catch {
    return []
  }
}

async function ensureDirectory(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function shouldConvert(sourcePath, targetPath) {
  try {
    const [sourceStats, targetStats] = await Promise.all([
      fs.stat(sourcePath),
      fs.stat(targetPath),
    ])

    return sourceStats.mtimeMs > targetStats.mtimeMs
  } catch {
    return true
  }
}

async function convertToWebp(sourcePath, targetPath, resizeOptions) {
  await ensureDirectory(path.dirname(targetPath))

  if (!(await shouldConvert(sourcePath, targetPath))) {
    return { skipped: true, targetPath }
  }

  let pipeline = sharp(sourcePath)

  if (resizeOptions) {
    pipeline = pipeline.resize(resizeOptions.width, resizeOptions.height, resizeOptions.options)
  }

  await pipeline
    .webp({
      quality: 76,
      effort: 6,
    })
    .toFile(targetPath)

  return { skipped: false, targetPath }
}

async function convertPublicImages() {
  const sourceFiles = await collectFiles(publicDir)
  const convertible = sourceFiles.filter((filePath) => convertExtensions.has(path.extname(filePath).toLowerCase()))

  const results = await Promise.all(
    convertible.map(async (sourcePath) => {
      const extension = path.extname(sourcePath)
      const targetPath = sourcePath.slice(0, -extension.length) + '.webp'
      return convertToWebp(sourcePath, targetPath)
    }),
  )

  return {
    label: 'public',
    total: results.length,
    converted: results.filter((result) => !result.skipped).length,
    skipped: results.filter((result) => result.skipped).length,
  }
}

async function convertNavbarSourceImages() {
  await ensureDirectory(navbarSourceDir)
  await ensureDirectory(navbarOutputDir)

  const sourceFiles = await collectFiles(navbarSourceDir)
  const convertible = sourceFiles.filter((filePath) => convertExtensions.has(path.extname(filePath).toLowerCase()))

  const results = await Promise.all(
    convertible.map(async (sourcePath) => {
      const relativePath = path.relative(navbarSourceDir, sourcePath)
      const extension = path.extname(relativePath)
      const targetPath = path.join(navbarOutputDir, relativePath.slice(0, -extension.length) + '.webp')

      return convertToWebp(sourcePath, targetPath, {
        width: 176,
        height: 176,
        options: {
          fit: 'cover',
          position: 'attention',
          withoutEnlargement: true,
        },
      })
    }),
  )

  return {
    label: 'navbar',
    total: results.length,
    converted: results.filter((result) => !result.skipped).length,
    skipped: results.filter((result) => result.skipped).length,
  }
}

async function main() {
  const summaries = await Promise.all([
    convertPublicImages(),
    convertNavbarSourceImages(),
  ])

  for (const summary of summaries) {
    console.log(
      `${summary.label} images ready: ${summary.converted} converted, ${summary.skipped} unchanged, ${summary.total} processed`,
    )
  }
}

main().catch((error) => {
  console.error('Failed to convert images to WebP')
  console.error(error)
  process.exit(1)
})
