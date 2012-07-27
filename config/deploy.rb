set :application, "Ruby on Rails China"
set :domain, "www.railschina.org"
set :use_sudo, false
set :user, "ruby"
set :version, "v3.2.3"
set :repository,  "./public"
set :scm, :none

 
role :web, domain
role :app, domain
role :db,  domain, :primary => true 
set :deploy_to, "/home/#{user}/railschina"
set :deploy_via, :copy


namespace :deploy do
  task :migrate do
  end
  task :finalize_update do
  end
  task :start do
  end
  task :stop do 
  end
  task :restart do
  end
end

#callbacks
#after 'deploy:setup', 'remote:create_symlink'
