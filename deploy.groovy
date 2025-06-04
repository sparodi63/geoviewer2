import groovy.io.FileType

/*
  PARAMETRI 
  - target = PROD / STAGING
  - app = nome della dir della applicazione
    se app="LIB" viene fatto deploy della libreria

  UTILIZZO
  groovy deploy.groovy <TARGET> <APP>
*/

class Deploy {
    static def config = [
        build: [
            assetsRoot: 'dist',
            assetsSubDirectory: 'static'
        ],
        deploy: [
            baseDeployDir: [
                'TEST': 'F:/Progetti/geoapps/viewer/',
                'TEST-PROT': 'F:/TomcatProt/webapps/geoservices/apps/viewer/',
                'PROD': 'J:/geoapps/viewer/',
                'PROD-INT': 'L:/geoapps/viewer/',
                'PROD-PROT': 'H:/webapps/geoservices/apps/viewer/',
                'STAGING': 'J:/geoapps/viewer_staging/',
                'STAGING-PROT': 'H:/webapps/geoservices/apps/viewer_staging/',            
            ]
        ]
    ]

    static void main(String[] args) {
        println 'Deploy Geoviewer2\n\n'

        if (args.length < 2) {
            println 'Usage: groovy deploy.groovy <TARGET> <APP>'
            System.exit(1)
        }

        def target = args[0]
        def app = args[1]

        def validTargets = ['TEST', 'TEST-PROT', 'PROD', 'PROD-INT', 'PROD-PROT', 'STAGING', 'STAGING-PROT']
        if (!validTargets.contains(target)) {
            println '\n\n ATTENZIONE!!! Parametro "target" non corretto (TEST/PROD/PROD-INT/PROD-PROT/STAGING/STAGING-PROT)'
            System.exit(1)
        }

        if (!app) {
            println '\n\n ATTENZIONE!!! Parametro "app" deve essere impostato (impostare a "LIB" per deploy libreria)'
            System.exit(1)
        }

        println "Deploy in ambiente:${target}\n"

        def version = System.currentTimeMillis()
        def type = app == 'LIB' ? 'LIB' : 'APP'

        if (type == 'LIB') deployLib(target)
        if (type == 'APP') deployApp(target, app)
    }

    static void deployLib(String target) {
        def assetsPath = new File(config.build.assetsRoot, config.build.assetsSubDirectory)
        println "assetsPath: ${assetsPath}"

        if (!assetsPath.exists() || !assetsPath.listFiles()) {
            println " ATTENZIONE! La directory ${assetsPath} non esiste o è vuota.\n"
            return
        }

        if (config.deploy.baseDeployDir[target]) {
            def distPath = new File(config.deploy.baseDeployDir[target], 'dist')
            println "distPath: ${distPath}"
            println "\n\nDeploy libreria - Versione ${System.currentTimeMillis()}\n"
            
            if (distPath.exists()) {
                distPath.deleteDir()
            }
            copyDirectory(assetsPath, distPath)
            println "Deploy libreria completato con successo.\n"
        }
    }

    static void deployApp(String target, String app) {
        def appsDir = 'pages/apps'
        def appsSourceBasePath = new File("${appsDir}")
        def appSourcePath = new File(appsSourceBasePath, app)
        println "appSourcePath: ${appSourcePath}"

        if (!appSourcePath.exists() || !appSourcePath.listFiles()) {
            println " ATTENZIONE! La directory ${appSourcePath} non esiste o è vuota.\n"
            return
        }

        def appTargetPath = new File(config.deploy.baseDeployDir[target] + appsDir, app)
        println "appTargetPath: ${appTargetPath}"

        println "\nDeploy applicazione ${app}\n"
        if (appTargetPath.exists()) {
            appTargetPath.deleteDir()
        }
        copyDirectory(appSourcePath, appTargetPath)
        println "Deploy applicazione ${app} completato con successo.\n"
    }

    static void copyDirectory(File sourceDir, File targetDir) {
        targetDir.mkdirs()
        sourceDir.eachFileRecurse(FileType.FILES) { file ->
            def relativePath = file.path - sourceDir.path
            def targetFile = new File(targetDir.path + relativePath)
            targetFile.getParentFile().mkdirs()
            targetFile.bytes = file.bytes
        }
    }
}