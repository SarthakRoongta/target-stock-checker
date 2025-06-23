//
//  BackgroundFetcher.swift
//  TargetStock
//
//  Created by Sarthak Roongta on 6/23/25.
//


import BackgroundTasks
import Amplify

@MainActor
enum BackgroundFetcher {
    static let id = "com.yourname.stockbot.fetch"

    static func register() {
        BGTaskScheduler.shared.register(forTaskWithIdentifier: id, using: nil) { task in
            Task { await handle(task: task as! BGAppRefreshTask) }
        }
    }

    static func schedule() {
        let req = BGAppRefreshTaskRequest(identifier: id)
        req.earliestBeginDate = Date(timeIntervalSinceNow: 15*60)
        try? BGTaskScheduler.shared.submit(req)
    }

    private static func handle(task: BGAppRefreshTask) async {
        schedule()          // schedule next one

        guard let session = try? await Amplify.Auth.fetchAuthSession(),
              let jwt = (session as? AuthCognitoTokensProvider)?
                .getCognitoTokens()?.idToken else {
            task.setTaskCompleted(success: false)
            return
        }

        do {
            let previous = loadCache()
            let latest = try await API.fetchProducts(jwt: jwt)
            LocalNotifier.notifyIfNeeded(old: previous, new: latest)
            saveCache(latest)
            task.setTaskCompleted(success: true)
        } catch {
            task.setTaskCompleted(success: false)
        }
    }

    // simplistic caching
    private static func loadCache() -> [Product] {
        guard let data = UserDefaults.standard.data(forKey: "products"),
              let arr = try? JSONDecoder().decode([Product].self, from: data) else { return [] }
        return arr
    }
    private static func saveCache(_ arr: [Product]) {
        let data = try? JSONEncoder().encode(arr)
        UserDefaults.standard.set(data, forKey: "products")
    }
}
