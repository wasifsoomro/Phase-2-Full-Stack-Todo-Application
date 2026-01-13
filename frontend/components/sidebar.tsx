'use client';

import { Home, Plus, Settings, LogOut, Calendar, BarChart3, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface SidebarProps {
  closeSidebar?: () => void;
}

export function Sidebar({ closeSidebar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/tasks',
      icon: BarChart3,
    },
    {
      title: 'Add Task',
      href: '/tasks?add=true',
      icon: Plus,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const handleNavClick = (href: string) => {
    if (href === '/tasks?add=true') {
      // For the "Add Task" option, we want to trigger the task creation modal
      // We'll navigate to /tasks with the add parameter
      router.push('/tasks?add=true');
      // Use a delay to ensure the page has loaded and the effect can process the parameter
      setTimeout(() => {
        // Also trigger the custom event as a backup method
        window.dispatchEvent(new CustomEvent('open-add-task'));
      }, 500); // Increased delay to ensure page is fully loaded
      closeSidebar();
    } else if (href === '/tasks') {
      // For the "Dashboard" option, just navigate to the tasks page
      router.push('/tasks');
      closeSidebar();
    } else {
      if (closeSidebar) {
        closeSidebar();
      }
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Logo/Header */}
      <div className="p-4 border-b border-border/30 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow-md">
            <img
              src="/logo.svg"
              alt="TaskFlow Logo"
              width={24}
              height={24}
              className="text-white drop-shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TaskFlow
            </span>
            <span className="text-xs text-muted-foreground -mt-1 ml-0.5 font-medium">
              Organize Your Life
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-1 py-4 px-2">
        <nav className="grid items-start gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/tasks' && pathname.startsWith('/tasks'));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-primary/10 hover:text-primary group',
                  isActive
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="mr-3 h-4 w-4 transition-transform group-hover:scale-110" />
                <span className="flex-1">{item.title}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-border/30">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer mb-2">
          <div className="p-2 bg-gradient-to-r from-secondary to-primary rounded-full">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">User Profile</p>
            <p className="text-xs text-muted-foreground truncate">View your profile</p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
          onClick={async () => {
            await api.logout();
            router.push('/login');
            if (closeSidebar) {
              closeSidebar();
            }
          }}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}