import os
import shutil
import sys
import time
import argparse

CONFIG = {
    'build': {
        'assetsRoot': 'dist',
        'assetsSubDirectory': 'static'
    },
    'deploy': {
        'baseDeployDir': {
            'TEST': 'F:/Progetti/geoapps/viewer/',
            'TEST-PROT': 'F:/TomcatProt/webapps/geoservices/apps/viewer/',
            'PROD': 'J:/geoapps/viewer/',
            'PROD-INT': 'L:/geoapps/viewer/',
            'PROD-PROT': 'H:/webapps/geoservices/apps/viewer/',
            'STAGING': 'J:/geoapps/viewer_staging/',
            'STAGING-PROT': 'H:/webapps/geoservices/apps/viewer_staging/',
        }
    }
}

def copy_directory(source_dir, target_dir):
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
    for root, dirs, files in os.walk(source_dir):
        rel_path = os.path.relpath(root, source_dir)
        dest_dir = os.path.join(target_dir, rel_path) if rel_path != '.' else target_dir
        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir)
        for file in files:
            src_file = os.path.join(root, file)
            dst_file = os.path.join(dest_dir, file)
            shutil.copy2(src_file, dst_file)

def backup_directory(target_dir):
    if os.path.exists(target_dir):
        bkp_dir = target_dir + '.bkp'
        if os.path.exists(bkp_dir):
            shutil.rmtree(bkp_dir)
        shutil.move(target_dir, bkp_dir)
        print(f"Backup creato: {bkp_dir}")

def deploy_lib(target):
    print(f"DEPLOY: {target} - LIB")
    assets_path = os.path.join(CONFIG['build']['assetsRoot'], CONFIG['build']['assetsSubDirectory'])
    print(f"assetsPath: {assets_path}")

    if not os.path.exists(assets_path) or not os.listdir(assets_path):
        print(f" ATTENZIONE! La directory {assets_path} non esiste o è vuota.\n")
        return

    base_dir = CONFIG['deploy']['baseDeployDir'].get(target)
    if base_dir:
        dist_path = os.path.join(base_dir, 'dist')
        print(f"distPath: {dist_path}")
        print(f"Deploy libreria - Versione {int(time.time() * 1000)}")
        backup_directory(dist_path)  # Backup before copying
        copy_directory(assets_path, dist_path)
        print("Deploy libreria completato con successo.\n")

def deploy_app(target, app):
    print(f"DEPLOY: {target} - {app}")

    apps_dir = 'pages/apps'
    app_source_path = os.path.join(apps_dir, app)
    print(f"Source Path: {app_source_path}")

    if not os.path.exists(app_source_path) or not os.listdir(app_source_path):
        print(f" ATTENZIONE! La directory {app_source_path} non esiste o è vuota.\n")
        return

    base_dir = CONFIG['deploy']['baseDeployDir'].get(target)
    app_target_path = os.path.join(base_dir, apps_dir, app) if base_dir else None
    print(f"Dest Path: {app_target_path}")

    if app_target_path:
        backup_directory(app_target_path)
        # After backup, app_target_path may not exist, so no need to remove it
        copy_directory(app_source_path, app_target_path)
        print(f"Deploy applicazione {app} completato con successo.\n")

def main():
    print('Deploy Geoviewer2\n')
    parser = argparse.ArgumentParser(
        description='Deploy Geoviewer2 application or library.'
    )
    parser.add_argument('target', help='Deployment target environment(s), comma-separated (e.g. PROD,PROD-INT)')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('-l', '--lib', action='store_true', help='Deploy library')
    group.add_argument('-d', '--dir', metavar='APP_DIR', help='Deploy application directory')

    args = parser.parse_args()

    valid_targets = [
        'TEST', 'TEST-PROT', 'PROD', 'PROD-INT', 'PROD-PROT', 'STAGING', 'STAGING-PROT'
    ]
    targets = [t.strip() for t in args.target.split(',') if t.strip()]
    invalid_targets = [t for t in targets if t not in valid_targets]
    if not targets or invalid_targets:
        print('\n\n ATTENZIONE!!! Parametro "target" non corretto. Valori validi: ' + ','.join(valid_targets))
        if invalid_targets:
            print('Target(s) non validi: ' + ', '.join(invalid_targets))
        sys.exit(1)

    print(f"Deploy in ambiente: {', '.join(targets)}\n")

    for target in targets:
        if args.lib:
            deploy_lib(target)
        elif args.dir:
            deploy_app(target, args.dir)
        else:
            print('\n\n ATTENZIONE!!! Specificare -l per la libreria o -d <dir> per una directory applicazione.')
            sys.exit(1)

if __name__ == '__main__':
    main()
