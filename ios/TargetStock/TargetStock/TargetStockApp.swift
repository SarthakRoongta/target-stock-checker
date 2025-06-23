//
//  TargetStockApp.swift
//  TargetStock
//
//  Created by Sarthak Roongta on 6/22/25.
//

import SwiftUI

@main
struct TargetStockApp: App {
    init() {
        BackgroundFetcher.register()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .onAppear {
                    NotificationManager.shared.requestAuth()
                    BackgroundFetcher.schedule()
                }
        }
    }
}
